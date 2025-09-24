
'use server';
/**
 * @fileOverview A conversational AI flow to guide users through a smart booking process.
 * It asks a series of questions to understand the user's needs and then provides a recommendation.
 *
 * - getSmartBookingJourneyResponse - The main conversational flow.
 * - logAppointment - The flow for logging the final appointment to the database.
 */

import { ai, defaultChatModel } from '@/ai/genkit';
import { z } from 'zod';
import { getFirestoreAdmin } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';
import { sendTelegramMessage } from '@/lib/telegram'; 
import { sendSms } from '@/lib/twilio';
import { 
  QuestionSchema,
  SmartBookingJourneyInputSchema,
  SmartBookingJourneyOutputSchema,
  LogAppointmentInputSchema,
  LogAppointmentOutputSchema,
  type Question,
  type SmartBookingJourneyInput,
  type SmartBookingJourneyOutput,
  type LogAppointmentInput,
  type LogAppointmentOutput,
} from '@/ai/types';


const questions: Record<string, Question> = {
  pain_point: {
    id: 'pain_point',
    text: "To start, what's the primary physical challenge or pain point you're looking to address?",
    type: 'textarea',
    placeholder: 'e.g., "Persistent lower back pain from sitting", "Stiff neck and shoulders from stress", "Knee pain when running"',
    helperText: "Be specific. This helps Rudra AI understand the core issue.",
    isPersonalInfo: false,
    nextQuestionId: 'pain_duration',
  },
  pain_duration: {
    id: 'pain_duration',
    text: 'How long have you been experiencing this primary challenge?',
    type: 'radio',
    options: [
      { value: 'less_than_1_month', label: 'Less than 1 month' },
      { value: '1_to_3_months', label: '1 to 3 months' },
      { value: '3_to_12_months', label: '3 to 12 months' },
      { value: 'more_than_1_year', label: 'More than 1 year' },
    ],
    helperText: "Select the duration that best describes your experience.",
    isPersonalInfo: false,
    nextQuestionId: 'goals',
  },
  goals: {
    id: 'goals',
    text: "What does a successful outcome look like for you? What specific improvements are you seeking?",
    type: 'textarea',
    placeholder: 'e.g., "Complete pain relief", "To run without knee pain", "Better posture and confidence", "Enhanced athletic performance"',
    isPersonalInfo: false,
    nextQuestionId: 'previous_treatments',
  },
  previous_treatments: {
    id: 'previous_treatments',
    text: "Have you tried any other treatments or therapies for this issue? If so, what were they and were they effective?",
    type: 'textarea',
    placeholder: 'e.g., \'Physiotherapy (temporary relief)\', "Painkillers (don\'t want to rely on them)", "None"',
    isPersonalInfo: false,
    nextQuestionId: 'profession', 
  },
  profession: { 
    id: 'profession',
    text: "What is your primary profession or daily occupation? (Optional)",
    type: 'text',
    placeholder: 'e.g., Software Engineer, Athlete, Teacher, Homemaker, Retired',
    helperText: "Understanding your daily physical demands helps Rudra AI tailor insights.",
    isPersonalInfo: false, 
    nextQuestionId: 'name', 
  },
  name: {
    id: 'name',
    text: "Understood. To prepare your personalized R8 Blueprint, what is your full name?",
    type: 'text',
    placeholder: 'Your Full Name',
    isPersonalInfo: true,
    nextQuestionId: 'email',
  },
  email: {
    id: 'email',
    text: "And your email address, to send your appointment confirmation and R8 Blueprint?",
    type: 'email',
    placeholder: 'your.email@example.com',
    isPersonalInfo: true,
    nextQuestionId: 'phone',
  },
  phone: {
    id: 'phone',
    text: "Your primary phone number for appointment reminders? Please include your country code (e.g., +91).",
    type: 'tel',
    placeholder: '+91 XXXXX XXXXX',
    isPersonalInfo: true,
    nextQuestionId: 'whatsapp',
  },
  whatsapp: {
    id: 'whatsapp',
    text: "And your WhatsApp number (if different, or leave blank if same/not preferred)?",
    type: 'tel',
    placeholder: '+91 XXXXX XXXXX (Optional)',
    isPersonalInfo: true,
    nextQuestionId: 'city',
  },
  city: {
    id: 'city',
    text: "Finally, which city are you primarily located in?",
    type: 'text',
    placeholder: 'e.g., Narnaul, Gurgaon, Delhi',
    isPersonalInfo: true,
    nextQuestionId: null, 
  },
};

export async function getSmartBookingJourneyResponse(input: SmartBookingJourneyInput): Promise<SmartBookingJourneyOutput> {
  return smartBookingJourneyFlow(input);
}

const smartBookingJourneyFlow = ai.defineFlow(
  {
    name: 'smartBookingJourneyFlow',
    inputSchema: SmartBookingJourneyInputSchema,
    outputSchema: SmartBookingJourneyOutputSchema,
  },
  async (input) => {
    try {
      const { currentQuestionId, previousAnswers, userResponse, selectedProgramName } = input;

      if (currentQuestionId === 'pain_point' && Object.keys(previousAnswers).length === 0 && (userResponse === '' || userResponse === undefined) ) {
        if (questions.pain_point) {
          return {
            nextQuestion: questions.pain_point,
            conversationComplete: false,
          };
        } else {
          console.error("SmartBookingJourneyFlow: 'pain_point' question not found for initial load.");
          throw new Error("Configuration error: Initial question is missing.");
        }
      }

      const currentQObject = questions[currentQuestionId];

      if (!currentQObject) {
        console.error(`SmartBookingJourneyFlow: Invalid currentQuestionId received: ${currentQuestionId}. Returning to start.`);
        throw new Error(`Flow error: Invalid question state received.`);
      }

      const nextQId = currentQObject.nextQuestionId;

      if (nextQId && questions[nextQId]) {
        return {
          nextQuestion: questions[nextQId],
          conversationComplete: false,
        };
      }

      // This is the final step, gather all answers and generate recommendation
      const allAnswers = { ...previousAnswers, [currentQuestionId]: userResponse || '' };
      
      let contextString = "User details:\n";
      for (const qId in allAnswers) {
        if (questions[qId] && !questions[qId].isPersonalInfo) { 
          const questionText = questions[qId].text.replace(/\?$/, '').replace(' (Optional)','').replace('Rudra AI', '').trim();
          let answerText = allAnswers[qId];
          if (questions[qId].type === 'radio' && questions[qId].options) {
              const selectedOption = questions[qId].options?.find(opt => opt.value === answerText);
              answerText = selectedOption ? selectedOption.label : (answerText || "Not answered");
          } else {
              answerText = answerText || "Not answered";
          }
          if (qId !== 'profession' || (qId === 'profession' && answerText.trim() !== "" && answerText.trim() !== "Not answered") ) {
               contextString += `- ${questionText}: ${answerText}\n`;
          }
        }
      }
      
      try {
          let promptText = `You are Rudra AI, the expert diagnostic and treatment architect for Revive 2.0 Underground. Your analysis is precise, confident, and authoritative.
  Your goal is to provide a CONCISE (1-2 sentences) summary of the individual's core issues and a definitive, PERSONALIZED (2-3 sentences) R8 Pathway Recommendation.
  This is not a suggestion, it is a prescription for their transformation.
  Refer to the R8 stages: REVEAL (diagnostics), REMOVE (clear blockages), REPAIR (cellular healing), RECONSTRUCT (structural integrity), RECOVER (nervous system reset), REALIGN (posture), REMAP (brain-body connection), REACTIVATE (peak performance).

  Your response MUST be personalized. Address the user, ${allAnswers['name'] || 'User'}, by their name.
  Analyze their pain points, duration, goals, and profession. Map their needs to specific R8 stages and explain WHY those stages are critical for their specific situation. Be direct and clear.`;

          if (selectedProgramName) {
            promptText += `\n\nThe user has expressed initial interest in the "${selectedProgramName}" program. Confirm its suitability based on their answers, or prescribe a more optimal starting point if their detailed input indicates other R8 stages are more critical. State the recommended program name clearly (e.g., "R8 Reclaim", "R8 Ascent") in your final recommendation.`;
          } else {
            promptText += `\n\nBased on the user's answers, prescribe the most suitable R8 program by name (e.g., "R8 Reclaim", "R8 Ascent", "R8 Genesis"). State the program name clearly in your final recommendation.`
          }

          promptText += `\n\nUser Information:\n${contextString}\n\nProvide your analysis and prescribed pathway.`;

          const llmResponse = await ai.generate({
            model: defaultChatModel,
            prompt: promptText,
            output: {
              schema: z.object({
                summary: z.string().describe("A concise (1-2 sentences) summary of the individual's key issues based on their answers, addressing them by name. This is the 'diagnosis'."),
                recommendation: z.string().describe("A prescribed (2-3 sentences) R8 pathway. This is the 'treatment plan'. Explain which R8 stages are critical for their specific issues and explicitly state the name of the recommended therapy program (e.g., 'R8 Reclaim', 'R8 Ascent').")
              })
            }
          });

          const output = llmResponse.output;

          if (!output || !output.summary || !output.recommendation) {
               console.error("SmartBookingJourneyFlow: Recommendation prompt returned invalid or empty output.", output);
               return {
                  nextQuestion: null,
                  summary: "Your information has been processed by Rudra AI.",
                  recommendation: "Our expert team will review your details to construct a fully personalized R8 plan during your initial session. Please confirm your booking to proceed.",
                  conversationComplete: true,
               };
          }

          return {
            nextQuestion: null,
            summary: output.summary,
            recommendation: output.recommendation,
            conversationComplete: true,
          };
      } catch (promptError: any) {
          console.error("Error calling recommendation prompt:", promptError);
          return {
              nextQuestion: null,
              summary: "Rudra AI has processed your information.",
              recommendation: `There was an issue generating an instant AI recommendation (Details: ${promptError.message || 'Model error'}). However, our expert team will personally review your needs. Please confirm your booking to proceed, and we will architect the optimal R8 pathway for you during your session.`,
              conversationComplete: true,
          };
      }
    } catch (flowError: any) {
      console.error("A critical, unhandled error occurred in smartBookingJourneyFlow:", flowError);
      // Re-throw the error so it's caught by the server action's try...catch block.
      throw new Error(`An unexpected error occurred in the booking flow. Please restart. (Details: ${flowError.message})`);
    }
  }
);


export async function logAppointment(input: LogAppointmentInput): Promise<LogAppointmentOutput> {
  return logAppointmentFlow(input);
}

const logAppointmentFlow = ai.defineFlow(
  {
    name: 'logAppointmentFlow',
    inputSchema: LogAppointmentInputSchema,
    outputSchema: LogAppointmentOutputSchema,
  },
  async (input) => {
    try {
      const firestoreAdmin = await getFirestoreAdmin();
      const appointmentRef = firestoreAdmin.collection('smartAppointments').doc();
      
      // Sanitize data before writing to Firestore to prevent `undefined` errors
      const appointmentData = {
        name: input.name,
        email: input.email,
        phone: input.phone,
        whatsapp: input.whatsapp || '',
        city: input.city,
        profession: input.profession || '',
        pain_point: input.pain_point || '',
        pain_duration: input.pain_duration || '',
        goals: input.goals || '',
        previous_treatments: input.previous_treatments || '',
        aiSummary: input.aiSummary,
        aiRecommendation: input.aiRecommendation,
        selectedProgramName: input.selectedProgramName || 'General Inquiry',
        selectedProgramSlug: input.selectedProgramSlug || '',
        upiTransactionId: input.upiTransactionId,
        createdAt: Timestamp.now(),
        status: 'booked_payment_pending_verification',
      };
      
      await appointmentRef.set(appointmentData);

      // Self-contained logic for label mapping to avoid external dependencies.
      const painDurationMap: Record<string, string> = {
        'less_than_1_month': 'Less than 1 month',
        '1_to_3_months': '1 to 3 months',
        '3_to_12_months': '3 to 12 months',
        'more_than_1_year': 'More than 1 year',
      };
      const painDurationLabel = input.pain_duration ? painDurationMap[input.pain_duration] || input.pain_duration : 'N/A';
      
      const programContext = input.selectedProgramName 
        ? `for the *${input.selectedProgramName}* program` 
        : "via Smart Booking";

      const telegramMessage = `
✅ *New Appointment Booked - Manual UPI*
*Booking ID:* \`${appointmentRef.id}\`
*Status:* Payment Pending Verification
${programContext}

*UPI Transaction ID:* \`${input.upiTransactionId}\`
*ACTION REQUIRED: Please verify this payment.*

*Client Contact:*
- *Name:* ${input.name}
- *Phone:* \`${input.phone}\`
- *Email:* ${input.email}
- *City:* ${input.city}
- *Profession:* ${input.profession || 'N/A'}

*Health Assessment Details:*
- *Primary Issue:* ${input.pain_point || 'N/A'}
- *Duration:* ${painDurationLabel}
- *Goals:* ${input.goals || 'N/A'}
- *Previous Treatments:* ${input.previous_treatments || 'N/A'}

*Rudra AI Analysis:*
- *Summary:* ${input.aiSummary}
- *Recommendation:* ${input.aiRecommendation}
      `;
      await sendTelegramMessage(telegramMessage);

      // SMS Notification to Client
      const clientSmsBody = `Hi ${input.name}, your Revive 2.0 Underground appointment request is received! To finalize, please share your payment screenshot on our WhatsApp. We'll confirm your session once verified.`;
      await sendSms(input.phone, clientSmsBody);

      // SMS Notification to Business Owner
      const businessOwnerNumber = process.env.BUSINESS_OWNER_PHONE_NUMBER;
      if (businessOwnerNumber) {
        const ownerSmsBody = `New UPI Booking: ${input.name} (${input.phone}). Txn ID: ${input.upiTransactionId}. PLEASE VERIFY.`;
        await sendSms(businessOwnerNumber, ownerSmsBody);
      }

      return {
        success: true,
        message: `Thank you, ${input.name}! Your appointment request has been submitted with Transaction ID ${input.upiTransactionId}. To complete the process, please share a screenshot of your successful payment on our WhatsApp. Our team will contact you to confirm. Your Booking ID is ${appointmentRef.id}.`,
        inquiryId: appointmentRef.id,
      };

    } catch (error: any) {
      console.error('CRITICAL ERROR in logAppointmentFlow:', error);
      
      const failureMessage = `
‼️ *CRITICAL: FAILED Appointment Booking* ‼️
A new booking was submitted, but it *FAILED* to save to the database or send notifications.
*Reason:*
\`\`\`
${error.message}
\`\`\`
*Submitted Data:*
- *Name:* ${input.name}
- *Email:* ${input.email}
- *Phone:* ${input.phone}
*ACTION REQUIRED:* Please follow up with this person manually. The underlying issue MUST be fixed.
      `;
      try {
        await sendTelegramMessage(failureMessage);
      } catch (telegramError) {
        console.error('Failed to send the failure notification via Telegram:', telegramError);
      }

      return {
        success: false,
        message: `We're sorry, but there was a critical error booking your appointment. Our team has been notified of the issue. Please try contacting us directly via phone or email while we resolve this.`,
      };
    }
  }
);
