
"use client";

import { smartBookingJourneyAction, logAppointmentAction } from '@/app/actions/smartBookingActions';
import type { SmartBookingJourneyInput, SmartBookingJourneyOutput, LogAppointmentInput, LogAppointmentOutput, Question } from '@/ai/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Sparkles, CheckCircle, ArrowRight, RefreshCw, AlertTriangle, Info, BrainCircuit, Wallet, Milestone, Mic, MicOff, Copy, MessageCircle, Move3d } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { r8Programs } from '@/lib/r8ProgramsData';
import { QRCodeCanvas } from 'qrcode.react';
import { useInteractive3D } from '@/hooks/useInteractive3D';


type Answers = Record<string, string>;

// Speech Recognition must be handled carefully on the client side.
let recognition: any = null;

// A reusable component for the permission prompt
const Mobile3DPrompt = () => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg pointer-events-none">
        <div className="flex flex-col items-center text-white text-glow-primary animate-pulse">
            <Move3d className="h-10 w-10 mb-2" />
            <span className="text-sm font-semibold">Tap to Activate 3D Tilt</span>
        </div>
    </div>
);

const UPIPaymentStep = ({ onPaymentConfirm, onBack }: { onPaymentConfirm: (upiTxnId: string) => void, onBack: () => void }) => {
    const [upiTxnId, setUpiTxnId] = useState('');
    const [error, setError] = useState('');

    // --- YOUR OPERATIONAL UPI ID ---
    const UPI_ID = 'bhanu22priya19971@ybl';
    const PAYEE_NAME = 'BHANU PRIYA';
    const BOOKING_AMOUNT = 1000;
    // Construct the UPI URI for the QR Code
    const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${BOOKING_AMOUNT}&cu=INR`;
    // ------------------------------------

    const copyUpiId = () => {
      navigator.clipboard.writeText(UPI_ID);
      // Optional: Show a toast or message that it's copied
    };

    const handleConfirm = () => {
        if (!upiTxnId.trim()) {
            setError('Please enter the UPI Transaction ID to confirm.');
            return;
        }
        setError('');
        onPaymentConfirm(upiTxnId);
    };

    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-headline text-glow-accent flex items-center"><Wallet className="mr-3 h-7 w-7 text-accent" />Confirm Your Appointment</CardTitle>
                <CardDescription>To finalize your booking, please complete the ₹{BOOKING_AMOUNT} confirmation fee payment using any UPI app.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <div className="p-4 bg-muted rounded-lg border border-border/50 flex flex-col items-center">
                    <p className="text-sm text-muted-foreground">Scan QR or use UPI ID</p>
                     <div className="bg-white p-4 rounded-lg my-3 inline-block shadow-lg border">
                        <QRCodeCanvas
                            value={upiUri}
                            size={180}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"H"}
                            includeMargin={false}
                        />
                        <p className="font-bold text-lg text-black mt-2">{PAYEE_NAME}</p>
                    </div>
                    <div className="flex items-center space-x-2 w-full bg-background p-2 rounded-md">
                      <p className="font-mono text-foreground flex-grow text-center">{UPI_ID}</p>
                      <Button variant="ghost" size="icon" onClick={copyUpiId} aria-label="Copy UPI ID">
                        <Copy className="h-4 w-4"/>
                      </Button>
                    </div>
                </div>
                
                <div className="text-left">
                    <Label htmlFor="upi-txn-id">Enter UPI Transaction ID</Label>
                    <Input 
                        id="upi-txn-id" 
                        value={upiTxnId}
                        onChange={(e) => setUpiTxnId(e.target.value)}
                        placeholder="e.g., 20240730..."
                    />
                    {error && <p className="text-destructive text-sm mt-1">{error}</p>}
                    <p className="text-xs text-muted-foreground mt-2">After paying, copy the Transaction ID from your UPI app and paste it here to confirm.</p>
                </div>

                <div className="pt-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                        <hr className="flex-grow border-t border-border/50" />
                        <span>OR</span>
                        <hr className="flex-grow border-t border-border/50" />
                    </div>
                     <p className="mt-2 flex items-center justify-center gap-2">
                        <MessageCircle className="h-4 w-4 text-green-500"/>
                        <span>Having trouble? <a href="https://wa.link/7o72jp" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">Contact us on WhatsApp</a> for help.</span>
                    </p>
                </div>

            </CardContent>
            <CardFooter className="flex-col gap-3">
                <Button onClick={handleConfirm} size="lg" className="w-full">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Confirm Payment & Finalize Booking
                </Button>
                <Button variant="link" onClick={onBack}>Go Back</Button>
            </CardFooter>
        </>
    );
};


export default function SmartBookingWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const programNameParam = searchParams.get('program');
  const programSlugParam = searchParams.get('programSlug');

  const [wizardState, setWizardState] = useState({
    selectedProgramName: null as string | null,
    selectedProgramSlug: null as string | null,
    currentStep: 0,
    currentQuestion: null as Question | null,
    answers: {} as Answers,
    currentAnswer: '',
    isLoading: true,
    error: null as string | null,
    finalRecommendation: null as SmartBookingJourneyOutput | null,
    showPaymentStep: false,
    inquiryResult: null as LogAppointmentOutput | null,
    isSubmitting: false,
    isListening: false,
  });
  
  const { ref, style, onMouseMove, onMouseLeave, onClick, xSpring, ySpring, isPermissionPromptVisible } = useInteractive3D({
      rotationRangeX: 8,
      rotationRangeY: 8,
      stiffness: 100,
      damping: 20
  });
  
  const cardTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 50]);
  const shineBackground = useTransform(
    [xSpring, ySpring],
    ([px, py]) =>
      `radial-gradient(circle at ${Number(px) * 100}% ${
        Number(py) * 100
      }%, hsl(var(--primary)/0.1) 0%, transparent 50%)`
  );

  const {
    selectedProgramName, selectedProgramSlug, currentStep, currentQuestion, answers,
    currentAnswer, isLoading, error, finalRecommendation, showPaymentStep,
    inquiryResult, isSubmitting, isListening
  } = wizardState;

  const setState = (newState: Partial<typeof wizardState>) => {
    setWizardState(prevState => ({ ...prevState, ...newState }));
  };

  const loadInitialQuestion = useCallback(async (programName: string | null, programSlug: string | null) => {
    setState({ isLoading: true, error: null, finalRecommendation: null, showPaymentStep: false, inquiryResult: null, currentStep: 0, answers: {}, currentAnswer: '', selectedProgramName: programName, selectedProgramSlug: programSlug });

    try {
      const result = await smartBookingJourneyAction({ currentQuestionId: 'pain_point', previousAnswers: {}, userResponse: '', selectedProgramName: programName || undefined });
      if (result.nextQuestion) {
        setState({ currentQuestion: result.nextQuestion, currentStep: 1 });
      } else {
        setState({ error: result.summary || 'Failed to initialize the Rudra AI Smart Booking wizard.' });
      }
    } catch (err) {
      setState({ error: 'An error occurred while loading the Rudra AI wizard. Please try refreshing the page.' });
      console.error(err);
    } finally {
      setState({ isLoading: false });
    }
  }, []);

  useEffect(() => {
    const programNameFromUrl = programNameParam ? decodeURIComponent(programNameParam) : null;
    const programSlugFromUrl = programSlugParam ? decodeURIComponent(programSlugParam) : null;
    loadInitialQuestion(programNameFromUrl, programSlugFromUrl);
  }, [programNameParam, programSlugParam, loadInitialQuestion]);


  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-IN';
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setState({ currentAnswer: transcript });
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            setState({ isListening: false });
        };

        recognition.onend = () => {
            setState({ isListening: false });
        };
      }
    }

    return () => {
        if (recognition) {
            recognition.stop();
            recognition = null;
        }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
        recognition.stop();
    } else {
        setState({ currentAnswer: '' }); // Clear previous text on new recording
        recognition.start();
    }
    setState({ isListening: !isListening });
  };


  const handleNext = async () => {
    if (!currentQuestion) return;
  
    const isOptionalAndEmpty = (currentQuestion.type === 'tel' && currentAnswer.trim() === '' && currentQuestion.placeholder?.includes('Optional')) || (currentQuestion.id === 'profession' && currentAnswer.trim() === '');
    if (currentAnswer.trim() === '' && !isOptionalAndEmpty && !(currentQuestion.type === 'tel' && currentQuestion.id === 'whatsapp') ) {
        setState({ error: 'This field is required.' });
        return;
    }
    if (currentQuestion.type === 'email' && currentAnswer.trim() !== '' && !/^\S+@\S+\.\S+$/.test(currentAnswer)) {
        setState({ error: 'Please enter a valid email address.' });
        return;
    }
    
    setState({ error: null, isLoading: true });
    const updatedAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setState({ answers: updatedAnswers });

    try {
      const result = await smartBookingJourneyAction({ currentQuestionId: currentQuestion.id, previousAnswers: answers, userResponse: currentAnswer, selectedProgramName: selectedProgramName || undefined });
      if (result.nextQuestion) {
        setState({ currentQuestion: result.nextQuestion, currentAnswer: '', currentStep: currentStep + 1 });
      } else if (result.conversationComplete) {
        setState({ finalRecommendation: result, currentQuestion: null });
      } else {
         setState({ error: 'Received an unexpected response from Rudra AI. Please try again.' });
      }
    } catch (err: any) {
        setState({ error: err.message || 'An error occurred with Rudra AI. Please try again.' });
    } finally {
        setState({ isLoading: false });
    }
  };
  
  const handleConfirmPayment = async (upiTransactionId: string) => {
    if (!finalRecommendation) return;
    setState({ isSubmitting: true, error: null });

    try {
      const logInput: LogAppointmentInput = {
        name: answers['name'] || 'N/A', email: answers['email'] || 'N/A', phone: answers['phone'] || 'N/A',
        whatsapp: answers['whatsapp'] || '', city: answers['city'] || 'N/A', profession: answers['profession'] || '',
        pain_point: answers['pain_point'] || '', pain_duration: answers['pain_duration'] || '',
        goals: answers['goals'] || '', previous_treatments: answers['previous_treatments'] || '',
        aiSummary: finalRecommendation.summary || 'N/A',
        aiRecommendation: finalRecommendation.recommendation || 'N/A',
        selectedProgramName: selectedProgramName || '',
        selectedProgramSlug: selectedProgramSlug || '',
        upiTransactionId: upiTransactionId,
      };
      const result = await logAppointmentAction(logInput);
      setState({ inquiryResult: result, showPaymentStep: false });
      if (!result.success) { setState({ error: result.message }); }
    } catch (err: any) {
        setState({ error: err.message || "A critical error occurred while submitting your booking." });
    } finally {
        setState({ isSubmitting: false });
    }
  };


  const handleProceedToPayment = () => setState({ showPaymentStep: true });
  const handleRestart = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('program'); currentUrl.searchParams.delete('programSlug');
    router.replace(currentUrl.toString(), { scroll: false }); 
    loadInitialQuestion(null, null);
  };
  
  const getRecommendedProgram = () => {
    if (!finalRecommendation?.recommendation) return null;
    const recommendedProgram = r8Programs.find(p => finalRecommendation.recommendation!.toLowerCase().includes(p.name.split(':')[0].toLowerCase()));
    return recommendedProgram;
  };
  
  const renderCard = (content: React.ReactNode, key: string) => (
    <motion.div
        key={key}
        style={{ ...style, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl mx-auto"
    >
      <Card 
          style={{transform: `translateZ(${cardTranslateZ}px)`}} 
          className="bg-card/50 backdrop-blur-2xl border border-primary/20 shadow-2xl shadow-primary/10 relative overflow-hidden"
      >
        <motion.div className="absolute inset-0 pointer-events-none" style={{ background: shineBackground }}/>
        {content}
        {isPermissionPromptVisible && <Mobile3DPrompt />}
      </Card>
    </motion.div>
  );

  if (isLoading && currentStep === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl">Initializing Rudra AI...</p>
      </div>
    );
  }

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} onClick={onClick} className="min-h-[600px] flex items-center" style={{ perspective: '2000px' }}>
      <AnimatePresence mode="wait">
        {isSubmitting ? renderCard(<div className="flex flex-col items-center justify-center p-20 space-y-4"><Loader2 className="h-10 w-10 animate-spin text-primary"/><p>Finalizing Booking...</p></div>, 'submitting')
        : isLoading && currentStep > 0 ? renderCard(<div className="flex items-center justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary"/></div>, 'loading')
        : error ? renderCard(<> <CardHeader className="text-center"><AlertTriangle className="mx-auto h-12 w-12 text-destructive"/> <CardTitle className="text-xl font-headline text-destructive">Rudra AI Error</CardTitle></CardHeader> <CardContent><p className="text-destructive-foreground text-center">{error}</p></CardContent> <CardFooter><Button onClick={() => loadInitialQuestion(programNameParam, programSlugParam)} variant="outline" className="w-full"><RefreshCw className="mr-2 h-4 w-4" /> Try Again</Button></CardFooter></>, 'error')
        : inquiryResult?.success ? renderCard(<> <CardHeader className="text-center"><CheckCircle className="mx-auto h-16 w-16 text-green-500 animate-pulse-glow-accent"/><CardTitle className="text-2xl font-headline text-glow-primary text-gradient-primary-accent">Appointment Request Confirmed!</CardTitle></CardHeader> <CardContent className="space-y-4 text-center"><p className="text-foreground/80">{inquiryResult.message}</p><div className="mt-4 p-4 bg-card-foreground/[.03] rounded-md border border-border/30 text-left"><h4 className="font-semibold text-primary mb-2 flex items-center"><Milestone size={20} className="mr-2"/> Your R8 Blueprint:</h4><p className="text-sm text-foreground/75 whitespace-pre-wrap"><strong>AI Analysis:</strong> {finalRecommendation?.summary}</p><p className="text-sm text-foreground/75 whitespace-pre-wrap mt-2"><strong>Prescribed Pathway:</strong> {finalRecommendation?.recommendation}</p>{selectedProgramName && <p className="text-sm text-foreground/75 mt-2"><strong>Program Context:</strong> {selectedProgramName}</p>}</div></CardContent><CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2"><Button variant="outline" onClick={handleRestart} className="w-full sm:w-auto"><RefreshCw className="mr-2 h-4 w-4" /> New Booking</Button><Button asChild className="w-full sm:w-auto"><Link href="/">Return Home<ArrowRight className="ml-2 h-4 w-4"/></Link></Button></CardFooter></>, 'success')
        : showPaymentStep ? renderCard(<UPIPaymentStep onPaymentConfirm={handleConfirmPayment} onBack={() => setState({ showPaymentStep: false })} />, 'payment')
        : finalRecommendation ? renderCard(<> <CardHeader><CardTitle className="text-2xl font-headline text-glow-primary flex items-center"><Milestone className="mr-3 h-7 w-7 text-primary" />Your R8 Blueprint, {answers.name}</CardTitle><CardDescription>Based on your answers, Rudra AI has architected your preliminary R8 pathway. Review and proceed to confirm your appointment.</CardDescription>{selectedProgramName && (<div className="mt-2 p-2 rounded-md bg-primary/10 border border-primary/30 text-sm text-primary"><Info size={16} className="inline-block mr-2 align-middle" />Considering your interest in <strong>{selectedProgramName}</strong>.</div>)}</CardHeader><CardContent className="space-y-4"><div><h3 className="font-semibold text-lg text-primary">Rudra AI's Analysis</h3><p className="text-foreground/80 whitespace-pre-wrap">{finalRecommendation.summary}</p></div><div><h3 className="font-semibold text-lg text-primary">Prescribed R8 Pathway</h3><p className="text-foreground/80 whitespace-pre-wrap">{finalRecommendation.recommendation}</p></div></CardContent><CardFooter className="flex flex-col gap-3"><Button onClick={handleProceedToPayment} size="lg" className="w-full"><Send className="mr-2 h-5 w-5" />Confirm Appointment & Proceed</Button><Button variant="outline" onClick={handleRestart} disabled={isSubmitting}><RefreshCw className="mr-2 h-4 w-4" /> Start Over</Button></CardFooter></>, 'recommendation')
        : currentQuestion ? renderCard(<> <CardHeader>{selectedProgramName && currentStep === 1 && (<div className="mb-4 p-3 rounded-md bg-primary/10 border border-primary/30 text-sm"><Info size={16} className="inline-block mr-2 text-primary align-middle" />Context: <span className="font-semibold">{selectedProgramName}</span></div>)}<CardTitle className="text-xl font-headline text-primary flex items-center"><BrainCircuit className="mr-2 h-6 w-6" />Rudra AI Consultation (Step {currentStep})</CardTitle><CardDescription>{currentQuestion.helperText}</CardDescription></CardHeader><CardContent className="space-y-4"><Label htmlFor={currentQuestion.id} className="text-lg font-semibold">{currentQuestion.text}</Label><div className="relative">{currentQuestion.type === 'textarea' ? <Textarea id={currentQuestion.id} value={currentAnswer} onChange={e => setState({ currentAnswer: e.target.value })} placeholder={currentQuestion.placeholder} rows={5} disabled={isLoading} className="pr-12"/> : currentQuestion.type === 'radio' && currentQuestion.options ? <RadioGroup id={currentQuestion.id} value={currentAnswer} onValueChange={value => setState({ currentAnswer: value })} disabled={isLoading} className="space-y-2">{currentQuestion.options.map(option => (<div key={option.value} className="flex items-center space-x-3 p-3 rounded-md border hover:border-primary transition-colors has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary has-[input:checked]:glow-primary"><RadioGroupItem value={option.value} id={`${currentQuestion.id}-${option.value}`} /><Label htmlFor={`${currentQuestion.id}-${option.value}`} className="cursor-pointer flex-grow">{option.label}</Label></div>))}</RadioGroup> : <Input id={currentQuestion.id} type={currentQuestion.type} value={currentAnswer} onChange={e => setState({ currentAnswer: e.target.value })} placeholder={currentQuestion.placeholder} disabled={isLoading} onKeyDown={e => e.key === 'Enter' && !isLoading && handleNext()} className="pr-12"/>}{ (currentQuestion.type === 'textarea' || currentQuestion.type === 'text') && recognition && (<Button type="button" size="icon" variant="ghost" onClick={toggleListening} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground">{isListening ? <MicOff className="text-destructive"/> : <Mic/>}</Button>)}</div>{error && currentStep > 0 && (<div className="p-2 mt-1 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center"><AlertTriangle size={14} className="mr-2 shrink-0"/> {error}</div>)}</CardContent><CardFooter><Button onClick={handleNext} className="w-.full" disabled={isLoading || (currentAnswer.trim() === '' && !(currentQuestion.type === 'tel' && currentQuestion.placeholder?.includes('Optional')) && !(currentQuestion.id === 'profession' && currentAnswer.trim() === '') && !(currentQuestion.type === 'tel' && currentQuestion.id === 'whatsapp') )}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (currentQuestion.nextQuestionId === null ? 'Get R8 Blueprint' : 'Next Question')}{!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}</Button></CardFooter></>, 'question')
        : null}
      </AnimatePresence>
    </div>
  );
}
