
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence, useTransform, useSpring, Variants } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BrainCircuit, UploadCloud, FileCheck2, Loader2, Sparkles, AlertTriangle, Send, UtensilsCrossed, ArrowRight } from 'lucide-react';
import { analyzeAndSaveReportAction } from '@/app/actions/agentActions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AnalysisResultDisplay from '@/components/features/AnalysisResultDisplay';
import { useIsMobile } from '@/hooks/use-is-mobile';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import type { AgentActionInput } from '@/ai/types';
import Link from 'next/link';
import { useInteractive3D } from '@/hooks/useInteractive3D';

const FormSchema = z.object({
  clientName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  clientEmail: z.string().email({ message: 'Please enter a valid email address.' }),
});
type FormValues = z.infer<typeof FormSchema>;

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain'];

function FileDropzone({ onFileSelect, fileError }: { onFileSelect: (file: File | null) => void, fileError: string | null }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  }, [handleFileChange]);

  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card-foreground/[.02] hover:bg-card-foreground/[.05] transition-all duration-300",
        "group-hover:border-primary",
        isDragging ? "border-primary scale-105 shadow-2xl shadow-primary/30 bg-primary/10" : "border-border",
        fileError ? "border-destructive" : ""
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
        <div className={cn("absolute inset-0 transition-opacity duration-300 opacity-0", isDragging && "opacity-100")}>
            <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
            <div className="absolute inset-0 bg-grid-pattern opacity-10 bg-[length:30px_30px]"></div>
        </div>
      <input 
        ref={fileInputRef} 
        type="file" 
        className="hidden" 
        accept={ALLOWED_FILE_TYPES.join(',')}
        onChange={(e) => handleFileChange(e.target.files)}
      />
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <UploadCloud className={cn("w-12 h-12 text-muted-foreground transition-all duration-300", isDragging && "text-primary scale-125 animate-pulse")} />
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">PDF, TXT, PNG, JPG, or WEBP (Max 15MB)</p>
      </div>
    </div>
  );
}

function AnalysisForm({
  onFormSubmit, onFileSelect, selectedFile, fileError, isLoading,
  cardTranslateZ, shineX, shineY
}: {
  onFormSubmit: SubmitHandler<FormValues>; onFileSelect: (file: File | null) => void;
  selectedFile: File | null; fileError: string | null; isLoading: boolean;
  cardTranslateZ: any; shineX: any; shineY: any;
}) {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(FormSchema) });
    const shineSpringX = useSpring(shineX, { stiffness: 100, damping: 20 });
    const shineSpringY = useSpring(shineY, { stiffness: 100, damping: 20 });
    
    return (
        <motion.div key="form" style={{ transform: `translateZ(${cardTranslateZ}px)` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <Card className="animate-fade-in bg-gradient-to-br from-card-foreground/[.03] to-transparent border border-border/50 hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                <motion.div className="absolute inset-0 pointer-events-none" style={{ background: useTransform([shineSpringX, shineSpringY], ([px, py]) => `radial-gradient(circle at ${px}% ${py}%, hsl(var(--primary)/0.1) 0%, transparent 50%)`) }}/>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-glow-primary">Submit Your Report for Analysis</CardTitle>
                        <CardDescription>Provide your details and upload your report file. All information is confidential.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2"> <Label htmlFor="clientName">Your Name</Label> <Input id="clientName" {...register('clientName')} placeholder="e.g., Jane Doe" /> {errors.clientName && <p className="text-sm text-destructive">{errors.clientName.message}</p>} </div>
                            <div className="space-y-2"> <Label htmlFor="clientEmail">Your Email</Label> <Input id="clientEmail" {...register('clientEmail')} placeholder="jane.doe@example.com" /> {errors.clientEmail && <p className="text-sm text-destructive">{errors.clientEmail.message}</p>} </div>
                        </div>
                        <div className="space-y-2"> <Label>Your Medical Report</Label> <FileDropzone onFileSelect={onFileSelect} fileError={fileError} /> {fileError && <p className="text-sm text-destructive">{fileError}</p>} {selectedFile && !fileError && (<div className="flex items-center gap-2 p-2 rounded-md bg-green-500/10 text-green-700 border border-green-500/20 text-sm"><FileCheck2 className="h-5 w-5" /><span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB) selected.</span></div>)}</div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary hover:glow-primary" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>} {isLoading ? 'Analyzing... Please Wait' : 'Analyze My Report'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    );
}

export default function ReviverAgentPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const { toast } = useToast();

  const { ref, style, onMouseMove, onMouseLeave, onClick, xSpring, ySpring } = useInteractive3D({
    stiffness: 80,
    damping: 15,
    rotationRangeX: 5,
    rotationRangeY: 5
  });
  
  const cardTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 40]); 
  const shineX = useTransform(xSpring, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(ySpring, [-0.5, 0.5], [0, 100]);
  const iconTranslateZ = useTransform(ySpring, [-0.5, 0.5], [20, 80]);
  const titleTranslateZ = useTransform(ySpring, [-0.5, 0.5], [10, 60]);
  const pTranslateZ = useTransform(ySpring, [-0.5, 0.5], [0, 40]);
  const nextStepTranslateZ = useTransform(ySpring, [-0.5, 0.5], [20, 60]);

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) { setSelectedFile(null); return; }
    if (file.size > MAX_FILE_SIZE) { setFileError("File is too large. Maximum size is 15MB."); setSelectedFile(null); } 
    else if (!ALLOWED_FILE_TYPES.includes(file.type)) { setFileError("Invalid file type. Please upload a PDF, TXT, or image file."); setSelectedFile(null); } 
    else { setFileError(null); setSelectedFile(file); }
  }, []);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onAnalysisSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!selectedFile) { setFileError("Please select a file to analyze."); return; }
    setIsLoading(true); setAnalysisResult(null); setServerError(null);

    try {
      const fileDataUri = await fileToDataUri(selectedFile);
      const input: AgentActionInput = { ...data, fileDataUri };
      const result = await analyzeAndSaveReportAction(input);

      if (result && result.success && result.analysis) {
        setAnalysisResult(result.analysis);
        toast({ title: "Analysis Complete", description: "Rudra AI has successfully analyzed your report." });
      } else { 
        setServerError(result?.error || "An unknown error occurred during analysis."); 
      }
    } catch (err: any) { 
        setServerError(err.message || "A client-side error occurred. Please try again."); 
    } 
    finally { 
        setIsLoading(false); 
    }
  };
  
  const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
  const itemVariants: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };

  return (
    <div 
      ref={ref} 
      onMouseMove={onMouseMove} 
      onMouseLeave={onMouseLeave} 
      onClick={onClick}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16 flex flex-col items-center" 
      style={{ perspective: '2000px' }}
    >
      <div className="w-full max-w-4xl space-y-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ transformStyle: "preserve-3d" }} className="text-center">
              <motion.div style={{ transform: 'translateZ(80px)', translateZ: iconTranslateZ }} variants={itemVariants}>
                  <div className="relative flex items-center justify-center w-28 h-28 mx-auto mb-4">
                      <div className="absolute h-24 w-24 rounded-full border-2 border-primary/20 animate-ping delay-300"></div>
                      <div className="absolute h-36 w-36 rounded-full border border-secondary/20 animate-ping delay-500"></div>
                      <BrainCircuit className="h-20 w-20 text-primary z-10 animate-aurora-pulse" />
                  </div>
              </motion.div>
              <motion.h1 style={{ transform: 'translateZ(60px)', translateZ: titleTranslateZ }} variants={itemVariants} className="text-5xl sm:text-6xl font-headline font-semibold mb-2 text-glow-accent text-gradient-secondary-accent">Rudra AI: The Super-Doctor</motion.h1>
              <motion.p style={{ transform: 'translateZ(40px)', translateZ: pTranslateZ }} variants={itemVariants} className="text-lg text-foreground/80 max-w-3xl mx-auto font-body">Upload your medical reports (X-rays, MRIs, blood tests, PDFs) and receive an instant, deep analysis from our advanced AI, trained on millions of data points.</motion.p>
          </motion.div>
          
          <motion.div style={style} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}>
            <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }} style={{ transform: "translateZ(40px)" }} className="text-center p-8 bg-card-foreground/[.02] rounded-lg border-2 border-primary/30 h-[500px] flex flex-col justify-center items-center">
                  <div className="relative flex items-center justify-center">
                      <div className="absolute w-64 h-64 border-2 border-primary/20 animate-ping"></div>
                      <div className="absolute w-48 h-48 border-2 border-secondary/20 animate-ping delay-200"></div>
                      <BrainCircuit className="h-24 w-24 animate-pulse-glow text-primary z-10" />
                  </div>
                  <p className="mt-8 text-3xl font-headline text-primary text-glow-primary">Rudra AI is analyzing your document...</p>
                  <p className="text-muted-foreground font-body mt-2">The engine is performing a deep cognitive analysis. Please wait.</p>
              </motion.div>
            ) : analysisResult ? (
               <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AnalysisResultDisplay analysisResult={analysisResult} />
                  
                  <motion.div 
                    key="next-step" 
                    style={{ transform: `translateZ(${nextStepTranslateZ}px)`}}
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="mt-8 bg-gradient-to-br from-card-foreground/[.04] to-transparent border border-accent/30 shadow-2xl shadow-accent/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl font-headline text-glow-accent">
                          <UtensilsCrossed/> Next Step: Your Nutrition Protocol
                        </CardTitle>
                        <CardDescription>
                          Use the insights from your new report to generate a hyper-personalized nutrition plan.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">
                          Your detailed analysis provides the perfect foundation for a tailored diet. The AI Nutritionist can use this data to calculate your precise macronutrient needs, suggest meal options, and recommend supplements.
                        </p>
                      </CardContent>
                      <CardFooter>
                          <Button asChild size="lg" className="w-full bg-gradient-to-r from-accent to-secondary text-accent-foreground glow-accent hover:glow-accent">
                              <Link href="/nutrition-agent">
                                  <Sparkles className="mr-2 h-5 w-5"/>
                                  Launch AI Nutritionist
                                  <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                          </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>

               </motion.div>
            ) : (
              <AnalysisForm onFormSubmit={onAnalysisSubmit} onFileSelect={handleFileSelect} selectedFile={selectedFile} fileError={fileError} isLoading={isLoading} cardTranslateZ={cardTranslateZ} shineX={shineX} shineY={shineY} />
            )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {serverError && !isLoading && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className="bg-destructive/10 border-destructive">
                      <CardHeader className="flex-row items-center gap-3 space-y-0">
                          <AlertTriangle className="h-6 w-6 text-destructive" />
                          <CardTitle className="text-destructive">An Error Occurred</CardTitle>
                      </CardHeader>
                      <CardContent>
                         <p className="text-destructive-foreground">{serverError}</p>
                      </CardContent>
                  </Card>
               </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
}
