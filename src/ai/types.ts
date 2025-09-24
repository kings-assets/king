

/**
 * @fileOverview Shared types and schemas for AI tools and actions.
 * This file centralizes complex type definitions to prevent import-related issues
 * between client and server components. It should only contain Zod schemas
 * and TypeScript type definitions, with NO imports from server-side libraries like Genkit.
 */
import { z } from 'zod';

// --- PageProps for Dynamic Pages ---
export interface PageProps {
    params: { slug: string };
    searchParams?: { [key:string]: string | string[] | undefined };
}

// --- Auth Actions Types ---
export type LoginState = {
  success: boolean;
  message: string;
};

// --- Contact Form Types ---
export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});
export type ContactFormInput = z.infer<typeof ContactFormSchema>;
export type ContactFormState = {
  message: string;
  success: boolean;
  errors?: z.ZodIssue[];
};

// --- Personalized Booking Insights Types ---
export const PersonalizedBookingInputSchema = z.object({
  healthGoals: z
    .string()
    .describe('The health goals of the client, e.g., reduce back pain, improve flexibility, etc.'),
  specificPainPoints: z
    .string()
    .describe('Specific pain points the client is experiencing, e.g., lower back pain, neck stiffness.'),
  desiredImprovements: z
    .string()
    .describe('Areas the client wants to improve, e.g., better posture, more energy.'),
});
export type PersonalizedBookingInput = z.infer<typeof PersonalizedBookingInputSchema>;

export const PersonalizedBookingOutputSchema = z.object({
  insights: z
    .string()
    .describe(
      'Personalized insights recommending relevant R8 stages based on the input data.'
    ),
});
export type PersonalizedBookingOutput = z.infer<typeof PersonalizedBookingOutputSchema>;


// --- Blog Assistant Flow Types ---
export const BlogImageInputSchema = z.object({
  title: z.string().describe('The title of the blog post to generate an image for.'),
});
export type BlogImageInput = z.infer<typeof BlogImageInputSchema>;

export const BlogImageOutputSchema = z.object({
  imageUrl: z.string().describe("The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
  revisedPrompt: z.string().describe("The revised prompt used by the AI to generate the image."),
});
export type BlogImageOutput = z.infer<typeof BlogImageOutputSchema>;

export const BlogAudioInputSchema = z.object({
    text: z.string().max(5000, "Text content cannot exceed 5000 characters for audio generation.").describe("The text content of the blog post to convert to audio."),
});
export type BlogAudioInput = z.infer<typeof BlogAudioInputSchema>;

export const BlogAudioOutputSchema = z.object({
    audioUrl: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type BlogAudioOutput = z.infer<typeof BlogAudioOutputSchema>;

export const BlogContentBlockSchema = z.object({
  type: z.enum(['paragraph', 'heading', 'list']),
  text: z.string().optional().describe("Used for 'paragraph' and 'heading' types."),
  title: z.string().optional().describe("Used as the title for 'list' types."),
  items: z.array(z.string()).optional().describe("Used for 'list' types."),
});
export type BlogContentBlock = z.infer<typeof BlogContentBlockSchema>;

export const BlogPostInputSchema = z.object({
  topic: z.string().describe('The topic or main idea for the blog post.'),
});
export type BlogPostInput = z.infer<typeof BlogPostInputSchema>;

export const BlogPostOutputSchema = z.object({
  title: z.string(),
  category: z.string(),
  excerpt: z.string(),
  content: z.array(BlogContentBlockSchema),
  imageUrl: z.string(),
  imageAlt: z.string(),
  dataAiHint: z.string(),
});
export type BlogPostOutput = z.infer<typeof BlogPostOutputSchema>;


// --- Follow-up Assistant Flow Types ---
export const FollowUpInputSchema = z.object({
  name: z.string().describe("The client's full name."),
  phone: z.string().describe("The client's phone number."),
  email: z.string().email().describe("The client's email address."),
  program: z.string().optional().describe("The specific program the client was interested in, if any."),
  aiSummary: z.string().describe("The AI-generated summary of the client's issues from their inquiry."),
  aiRecommendation: z.string().describe("The AI-generated recommendation for the client."),
});
export type FollowUpInput = z.infer<typeof FollowUpInputSchema>;

export const FollowUpOutputSchema = z.object({
  smsMessage: z.string().describe("A concise, confident, and welcoming SMS/WhatsApp message. Welcome the client to Revive 2.0 Underground. Briefly mention their primary issue (e.g., 'back pain') and confirm that their personalized R8 plan is being prepared. State a clear next step: 'Our team will call you shortly to schedule your first session.'"),
  emailSubject: z.string().describe("A compelling and informative subject line. Example: 'Your Personalized R8 Pathway with Revive 2.0 Underground is Ready' or 'Next Steps for Your Transformation at Revive Underground'."),
  emailBody: z.string().describe("A detailed, well-structured, and professional plain-text email. It must: 1. Welcome the client by name. 2. Thank them for their inquiry. 3. Briefly recap their situation based on the AI summary. 4. Clearly state the recommended R8 stages from the AI recommendation and briefly explain the benefit. 5. State the clear next step (e.g., 'Our team will contact you shortly to schedule your session'). 6. End with a professional closing from 'The Revive 2.0 Underground Team'.")
});
export type FollowUpOutput = z.infer<typeof FollowUpOutputSchema>;


// --- Marketing Assistant Flow Types ---
export const MarketingAssistantInputSchema = z.object({
  query: z.string().describe("The user's question about Revive Underground's marketing, contact, or social media details."),
});
export type MarketingAssistantInput = z.infer<typeof MarketingAssistantInputSchema>;

export const MarketingAssistantOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's query."),
});
export type MarketingAssistantOutput = z.infer<typeof MarketingAssistantOutputSchema>;


// --- Smart Booking Journey Flow Types ---
export const QuestionOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['text', 'textarea', 'radio', 'email', 'tel']),
  options: z.array(QuestionOptionSchema).optional().describe("Options for radio button questions"),
  placeholder: z.string().optional().describe("Placeholder text for input fields"),
  helperText: z.string().optional().describe("Additional helper text for the question"),
  nextQuestionId: z.string().nullable().optional().describe("ID of the next question, or null if this is the last one in a sequence."),
  isPersonalInfo: z.boolean().optional().default(false).describe("Indicates if the question asks for personal info like name/email"),
});
export type Question = z.infer<typeof QuestionSchema>;

export const SmartBookingJourneyInputSchema = z.object({
  currentQuestionId: z.string(),
  previousAnswers: z.record(z.string()),
  userResponse: z.string().optional(),
  selectedProgramName: z.string().optional().describe("Name of the program if pre-selected by the user from a program page."),
});
export type SmartBookingJourneyInput = z.infer<typeof SmartBookingJourneyInputSchema>;

export const SmartBookingJourneyOutputSchema = z.object({
  nextQuestion: QuestionSchema.nullable(),
  summary: z.string().optional(),
  recommendation: z.string().optional(),
  suggestedBookingLink: z.string().optional(),
  conversationComplete: z.boolean(),
});
export type SmartBookingJourneyOutput = z.infer<typeof SmartBookingJourneyOutputSchema>;

export const LogAppointmentInputSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  whatsapp: z.string().optional(),
  city: z.string(),
  profession: z.string().optional(),
  pain_point: z.string().optional(),
  pain_duration: z.string().optional(),
  goals: z.string().optional(),
  previous_treatments: z.string().optional(),
  aiSummary: z.string(),
  aiRecommendation: z.string(),
  selectedProgramName: z.string().optional(),
  selectedProgramSlug: z.string().optional(),
  upiTransactionId: z.string().describe("The UPI transaction ID provided by the user for manual payment verification."),
});
export type LogAppointmentInput = z.infer<typeof LogAppointmentInputSchema>;

export const LogAppointmentOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  inquiryId: z.string().optional(),
});
export type LogAppointmentOutput = z.infer<typeof LogAppointmentOutputSchema>;


// --- Reviver Agent Flow Types ---
export const AgentActionInputSchema = z.object({
  clientEmail: z.string().email({ message: "A valid email is required to save your report."}),
  clientName: z.string().min(2, { message: "Please provide your name." }),
  fileDataUri: z.string().startsWith('data:', { message: "The file data is corrupted or missing." }),
});
export type AgentActionInput = z.infer<typeof AgentActionInputSchema>;


// --- Nutritionist Agent Flow Types ---
export const NutritionistToolInputSchema = z.object({
  analysisType: z.enum(["Post-Diagnostic Report", "Standalone Nutritional Assessment"]),
  diagnosticData: z.string().describe("The full diagnostic report from the analyzeDocument tool OR a detailed BMI analysis report. This provides the core health data."),
  clientInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    age: z.number(),
    weight: z.number(),
    height: z.number(),
    activityLevel: z.string().describe("e.g., Sedentary (office job), Lightly Active (mostly standing/walking), Moderately Active (physical work), Very Active (intense labor/athlete)"),
    dietaryPreferences: z.string().describe("Client's current nutritional routine, likes, dislikes, and any allergies. e.g., 'I eat twice a day, vegetarian, dislike mushrooms, prefer low-carb'"),
    healthGoals: z.string().describe("e.g., Fat Loss, Muscle Gain, Performance Enhancement, Hormonal Balance, Post-cycle recovery"),
    medicalConditions: z.string().optional().describe("Any pre-existing medical conditions, such as diabetes, thyroid issues, etc."),
    currentMedications: z.string().optional().describe("Any medications the client is currently taking."),
    bloodWorkData: z.string().optional().describe("Specific data from blood work reports, if available."),
  }).describe("Detailed information about the client."),
});
export type NutritionistToolInput = z.infer<typeof NutritionistToolInputSchema>;


const MealOptionSchema = z.object({
    title: z.string().describe("A catchy name for this meal option, e.g., 'The Powerhouse Breakfast' or 'Lean & Green Lunch'."),
    foodItems: z.array(z.string()).describe("A list of specific food items with precise quantities. e.g., ['150g Chicken Breast (raw weight)', '75g Brown Rice (uncooked weight)', '1 cup Broccoli']"),
    tacticalPurpose: z.string().describe("A brief, powerful explanation of why this meal option is beneficial. e.g., 'High in protein for muscle repair, with complex carbs for sustained energy release.'"),
});

const MealSchema = z.object({
    mealName: z.string().describe("The name of the meal, e.g., 'Meal 1 / Breakfast', 'Pre-Workout', 'Post-Workout', 'Meal 4'."),
    options: z.array(MealOptionSchema).min(2).max(4).describe("Provide 2-4 distinct, feasible options for this meal that the user can choose from."),
});

const SupplementSchema = z.object({
    name: z.string().describe("The name of the supplement, e.g., 'Zinc Glycinate', 'Magnesium Citrate', 'Omega-3 Fish Oil'."),
    dosage: z.string().describe("The precise dosage to be taken. e.g., '25mg', '5000 IU'."),
    timing: z.string().describe("The exact timing for when to take the supplement. e.g., '30 minutes before sleep', 'With first meal'."),
});

export const NutritionistToolOutputSchema = z.object({
    executiveSummary: z.string().describe("A brief, powerful paragraph explaining the 'why' behind this protocol, directly linking it to the client's goals and diagnostic data."),
    macronutrientTargets: z.object({
        totalCalories: z.number().describe("The precise daily target for Total Calories."),
        proteinGrams: z.number().describe("The precise daily target for Protein in grams."),
        carbsGrams: z.number().describe("The precise daily target for Carbohydrates in grams."),
        fatsGrams: z.number().describe("The precise daily target for Fats in grams."),
    }).describe("The core macronutrient and caloric prescription."),
    mealPlan: z.array(MealSchema).describe("The detailed, interactive meal plan with multiple options for each meal."),
    supplementProtocol: z.array(SupplementSchema).describe("An annex of specific, evidence-based supplements. If specific blood work is not provided, this should recommend general wellness supplements like Vitamin D3 or Omega-3, and state that more specific recommendations require blood work. If blood work IS provided, recommendations should be based on that data."),
    closingStatement: z.string().describe("A powerful, motivational closing statement. It must NOT mention 'Aura' or 'Shivansh'. The work should speak for itself."),
});
export type NutritionPlanObject = z.infer<typeof NutritionistToolOutputSchema>;


// The input type for the standalone nutrition plan form, different from the tool input.
export const StandaloneNutritionPlanFormInputSchema = z.object({
    diagnosticData: z.string(),
    age: z.number(),
    weight: z.number(),
    height: z.number(),
    activityLevel: z.string(),
    dietaryPreferences: z.string(),
    healthGoals: z.string(),
    clientName: z.string(),
    clientEmail: z.string(),
    medicalConditions: z.string().optional(),
    currentMedications: z.string().optional(),
    bloodWorkData: z.string().optional(),
});
export type StandaloneNutritionPlanFormInput = z.infer<typeof StandaloneNutritionPlanFormInputSchema>;

// --- Client Dashboard Types ---
export interface ClientReport {
  timestamp: string;
  analysis: string;
  clientName?: string;
}

export interface ClientAppointment {
    id: string;
    createdAt: string;
    program: string;
    summary: string;
    recommendation: string;
    status: string;
}
