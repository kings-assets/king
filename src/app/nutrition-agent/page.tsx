
'use client';

import { useState, useMemo } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UtensilsCrossed, Loader2, Sparkles, AlertTriangle, FileText, Send, BrainCircuit, Check, CheckCircle, RefreshCw } from 'lucide-react';
import BmiSection from '@/components/sections/BmiSection';
import { generateStandaloneNutritionPlanAction } from '@/app/actions/nutritionAgentActions';
import type { StandaloneNutritionPlanFormInput, NutritionPlanObject } from '@/ai/types';

// --- Zod Schemas and Types ---
// Schema for the second step form ONLY
const Step2FormSchema = z.object({
    clientName: z.string().min(2, 'Name must be at least 2 characters.'),
    clientEmail: z.string().email('Please enter a valid email address.'),
    activityLevel: z.string().min(1, "Please select an activity level."),
    dietaryPreferences: z.string().min(3, "Please describe your dietary preferences."),
    healthGoals: z.string().min(3, "Please describe your health goals."),
    medicalConditions: z.string().optional(),
    currentMedications: z.string().optional(),
    bloodWorkData: z.string().optional(),
});
type Step2FormValues = z.infer<typeof Step2FormSchema>;

// Local type to parse the JSON response from the server action
const MealOptionSchema = z.object({
    title: z.string(),
    foodItems: z.array(z.string()),
    tacticalPurpose: z.string(),
});
const MealSchema = z.object({
    mealName: z.string(),
    options: z.array(MealOptionSchema),
});
const SupplementSchema = z.object({
    name: z.string(),
    dosage: z.string(),
    timing: z.string(),
});
const NutritionistToolOutputSchema = z.object({
    executiveSummary: z.string(),
    macronutrientTargets: z.object({
        totalCalories: z.number(),
        proteinGrams: z.number(),
        carbsGrams: z.number(),
        fatsGrams: z.number(),
    }),
    mealPlan: z.array(MealSchema),
    supplementProtocol: z.array(SupplementSchema),
    closingStatement: z.string(),
});
// ---------------------------------------------


type SelectedMeals = { [mealName: string]: number };


const LoadingAnimation = () => (
    <motion.div
      key="loading"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center p-8 bg-card-foreground/[.02] rounded-lg border-2 border-primary/30 h-[400px] flex flex-col justify-center items-center relative overflow-hidden"
    >
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--primary)/0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <motion.div 
            className="relative flex items-center justify-center w-48 h-48"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "backOut" }}
        >
            <motion.div className="absolute w-full h-full border-2 border-primary/30 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
            <motion.div className="absolute w-3/4 h-3/4 border-2 border-accent/30 rounded-full" animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
            <BrainCircuit className="h-20 w-20 text-primary z-10 animate-pulse-glow" />
        </motion.div>
      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}
        className="mt-6 text-2xl font-headline text-primary text-glow-primary">Rudra AI is Forging Your Protocol...
      </motion.p>
       <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.8 } }}
        className="text-muted-foreground font-body mt-2">Analyzing inputs... Calculating macronutrients... Synthesizing options...
      </motion.p>
    </motion.div>
);


export default function NutritionAgentPage() {
  const [currentStage, setCurrentStage] = useState<'form' | 'loading' | 'selection' | 'final_plan'>('form');
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanObject | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  
  // State for data from BmiSection
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [bodyMetrics, setBodyMetrics] = useState<{ age: number; weight: number; height: number; } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedMeals, setSelectedMeals] = useState<SelectedMeals>({});

  const { register, handleSubmit, control, formState: { errors } } = useForm<Step2FormValues>({
    resolver: zodResolver(Step2FormSchema),
  });
  
  const handleReportGenerated = (data: { reportString: string, metrics: { age: number; weight: number; height: number; }}) => {
    setGeneratedReport(data.reportString);
    setBodyMetrics(data.metrics);
  }

  const onFormSubmit: SubmitHandler<Step2FormValues> = async (formData) => {
    if (!generatedReport || !bodyMetrics) {
        setServerError("Please generate your body composition report first before creating a nutrition plan.");
        return;
    }

    setCurrentStage('loading');
    setNutritionPlan(null);
    setServerError(null);
    setIsSubmitting(true);

    const actionInput: StandaloneNutritionPlanFormInput = {
        diagnosticData: generatedReport,
        age: bodyMetrics.age,
        weight: bodyMetrics.weight,
        height: bodyMetrics.height,
        activityLevel: formData.activityLevel,
        dietaryPreferences: formData.dietaryPreferences,
        healthGoals: formData.healthGoals,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        medicalConditions: formData.medicalConditions,
        currentMedications: formData.currentMedications,
        bloodWorkData: formData.bloodWorkData,
    };

    try {
      const result = await generateStandaloneNutritionPlanAction(actionInput);
      if (result.success && result.plan) {
        try {
            const parsedPlan = JSON.parse(result.plan);
            NutritionistToolOutputSchema.parse(parsedPlan); // Validate the structure
            setNutritionPlan(parsedPlan);
            setCurrentStage('selection');
        } catch (parseError) {
             console.error("Failed to parse AI response:", parseError);
             setServerError("The AI returned an invalid or corrupted response. Please try generating the plan again.");
             setCurrentStage('form');
        }
      } else {
        setServerError(result.error || "An unknown error occurred during plan generation.");
        setCurrentStage('form');
      }
    } catch (err: any) {
      setServerError(err.message || "A client-side error occurred. Please try again.");
      setCurrentStage('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMealSelect = (mealName: string, optionIndex: number) => {
    setSelectedMeals(prev => ({ ...prev, [mealName]: optionIndex }));
  };
  
  const isSelectionComplete = useMemo(() => {
    if (!nutritionPlan) return false;
    return nutritionPlan.mealPlan.every(meal => selectedMeals[meal.mealName] !== undefined);
  }, [nutritionPlan, selectedMeals]);


  const renderContent = () => {
    switch(currentStage) {
        case 'loading':
            return <LoadingAnimation />;
        
        case 'selection':
            if (!nutritionPlan) return null;
            return (
                <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                     <div className="text-center">
                        <h2 className="text-3xl font-headline text-glow-primary text-gradient-primary-accent">Step 3: Customize Your Protocol</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">Your plan is ready. Select one option for each meal that best fits your lifestyle and preferences.</p>
                    </div>
                    {nutritionPlan.mealPlan.map((meal, mealIndex) => (
                        <Card key={mealIndex} className="bg-card-foreground/[.03] border-border/50">
                            <CardHeader>
                                <CardTitle className="text-2xl font-headline text-secondary">{meal.mealName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {meal.options.map((option, optionIndex) => (
                                    <Card 
                                        key={optionIndex}
                                        onClick={() => handleMealSelect(meal.mealName, optionIndex)}
                                        className={`cursor-pointer group border-2 p-4 transition-all duration-300 relative ${selectedMeals[meal.mealName] === optionIndex ? 'border-primary shadow-2xl shadow-primary/20' : 'border-transparent hover:border-primary/50'}`}
                                    >
                                        <h4 className="font-semibold text-primary">{option.title}</h4>
                                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                                            {option.foodItems.map((item, i) => <li key={i}>{item}</li>)}
                                        </ul>
                                        <p className="text-xs text-accent mt-3 italic">{option.tacticalPurpose}</p>
                                        <AnimatePresence>
                                        {selectedMeals[meal.mealName] === optionIndex && (
                                            <motion.div initial={{opacity: 0, scale: 0.5}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.5}} className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center">
                                                <Check />
                                            </motion.div>
                                        )}
                                        </AnimatePresence>
                                    </Card>
                                ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <div className="flex justify-center pt-4">
                        <Button size="lg" onClick={() => setCurrentStage('final_plan')} disabled={!isSelectionComplete}>
                            Finalize & View My Plan
                        </Button>
                    </div>
                </motion.div>
            );

        case 'final_plan':
            if (!nutritionPlan) return null;
            const finalMealPlan = nutritionPlan.mealPlan.map(meal => {
                const selectedOption = meal.options[selectedMeals[meal.mealName]];
                return `**${meal.mealName}: ${selectedOption.title}**\n- ${selectedOption.foodItems.join('\n- ')}\n*Purpose: ${selectedOption.tacticalPurpose}*\n`;
            }).join('\n');

            const finalTextReport = `## Finalized RUDRA R8 Nutrition Protocol

**Executive Summary:**
${nutritionPlan.executiveSummary}

**Macronutrient Targets:**
- Total Calories: ${nutritionPlan.macronutrientTargets.totalCalories}
- Protein: ${nutritionPlan.macronutrientTargets.proteinGrams}g
- Carbs: ${nutritionPlan.macronutrientTargets.carbsGrams}g
- Fats: ${nutritionPlan.macronutrientTargets.fatsGrams}g

**Your Finalized Meal Plan:**
${finalMealPlan}

**Supplement Annex:**
${nutritionPlan.supplementProtocol.map(sup => `- ${sup.name}: ${sup.dosage} (${sup.timing})`).join('\n')}

**Closing Statement:**
${nutritionPlan.closingStatement}
`;


            return (
                 <motion.div key="final_plan" initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-headline text-glow-primary text-gradient-primary-accent">Your Finalized RUDRA R8 Nutrition Protocol</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">{nutritionPlan.executiveSummary}</p>
                    </div>
                    
                    <Card className="max-w-4xl mx-auto bg-gradient-to-br from-card-foreground/[.04] to-transparent border-2 border-green-500/30 shadow-2xl shadow-green-500/10">
                        <CardHeader><CardTitle className="flex items-center gap-3 text-3xl font-headline text-green-400 text-glow-primary"><FileText /> Finalized Protocol</CardTitle></CardHeader>
                        <CardContent className="space-y-6 prose prose-sm prose-invert marker:text-primary max-w-none">
                            
                           <div>
                                <h3 className="font-headline text-2xl text-accent pt-4 border-t border-border/50">Your Meal Plan</h3>
                                <p className="text-foreground/80 whitespace-pre-line ">{finalMealPlan}</p>
                           </div>
                            
                            <div>
                                <h3 className="font-headline text-2xl text-accent pt-4 border-t border-border/50">Supplement Annex</h3>
                                <ul className="space-y-2 pt-2">
                                {nutritionPlan.supplementProtocol.map((sup, i) => <li key={i} className="flex items-baseline"><CheckCircle className="h-4 w-4 text-accent mr-2 shrink-0"/><div><strong>{sup.name}:</strong> {sup.dosage} <em className="text-muted-foreground">({sup.timing})</em></div></li>)}
                                </ul>
                            </div>
                            
                            <p className="text-lg text-foreground/90 pt-4 border-t border-border/50 text-center">{nutritionPlan.closingStatement}</p>
                        </CardContent>
                        <CardFooter><Button onClick={() => { setCurrentStage('form'); setBodyMetrics(null); setGeneratedReport(''); }} size="lg" variant="outline" className="w-full"><RefreshCw className="mr-2 h-4 w-4"/> Generate a New Plan</Button></CardFooter>
                    </Card>
                 </motion.div>
            );
        
        case 'form':
        default:
            return (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
                    <BmiSection onReportGenerated={handleReportGenerated} />

                    <Card className="mt-12 animate-fade-in bg-gradient-to-br from-card-foreground/[.03] to-transparent border border-border/50">
                        <form onSubmit={handleSubmit(onFormSubmit)}>
                            <CardHeader>
                                <CardTitle className="text-2xl font-headline">Step 2: Provide Your Details</CardTitle>
                                <CardDescription>This information is crucial for personalizing your plan. It will be combined with your body report above.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2"> <Label htmlFor="clientName">Your Name</Label> <Input id="clientName" {...register('clientName')} placeholder="e.g., Jane Doe" /> {errors.clientName && <p className="text-sm text-destructive">{errors.clientName.message}</p>} </div>
                                    <div className="space-y-2"> <Label htmlFor="clientEmail">Your Email</Label> <Input id="clientEmail" {...register('clientEmail')} placeholder="jane.doe@example.com" /> {errors.clientEmail && <p className="text-sm text-destructive">{errors.clientEmail.message}</p>} </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Activity Level</Label>
                                    <Controller
                                        name="activityLevel"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger><SelectValue placeholder="Select your weekly activity level" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Sedentary">Sedentary (little or no exercise)</SelectItem>
                                                    <SelectItem value="Lightly Active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                                                    <SelectItem value="Moderately Active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                                                    <SelectItem value="Very Active">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.activityLevel && <p className="text-xs text-destructive">{errors.activityLevel.message}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="dietaryPreferences">Current Nutrition Routine, Dislikes & Allergies</Label>
                                    <Textarea id="dietaryPreferences" {...register('dietaryPreferences')} placeholder="e.g., I am vegetarian and cannot eat eggs. I usually eat twice a day. I dislike mushrooms. I prefer low-carb meals." />
                                    {errors.dietaryPreferences && <p className="text-xs text-destructive">{errors.dietaryPreferences.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="healthGoals">Primary Health & Fitness Goals</Label>
                                    <Textarea id="healthGoals" {...register('healthGoals')} placeholder="e.g., Fat Loss, Muscle Gain, Performance Enhancement, Hormonal Balance, Post-cycle recovery..." />
                                    {errors.healthGoals && <p className="text-xs text-destructive">{errors.healthGoals.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="medicalConditions">Medical Conditions & History (Optional)</Label>
                                    <Textarea id="medicalConditions" {...register('medicalConditions')} placeholder="e.g., Type 2 Diabetes, Hypothyroidism, old knee injury..." />
                                    {errors.medicalConditions && <p className="text-xs text-destructive">{errors.medicalConditions.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currentMedications">Current Medications (Optional)</Label>
                                    <Textarea id="currentMedications" {...register('currentMedications')} placeholder="e.g., Metformin 500mg, Thyronorm 50mcg..." />
                                    {errors.currentMedications && <p className="text-xs text-destructive">{errors.currentMedications.message}</p>}
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="bloodWorkData">Blood Work Data (Optional)</Label>
                                    <Textarea id="bloodWorkData" {...register('bloodWorkData')} placeholder="Copy and paste relevant lines from your blood reports, e.g., 'Testosterone: 350 ng/dL, Vitamin D: 25 ng/mL'..." />
                                    <p className="text-xs text-muted-foreground">Providing this data allows for a more precise supplement recommendation.</p>
                                    {errors.bloodWorkData && <p className="text-xs text-destructive">{errors.bloodWorkData.message}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary hover:glow-primary" disabled={!generatedReport || isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>} 
                                    {isSubmitting ? 'Generating...' : 'Generate My Nutrition Protocol'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            );
    }
  }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-12"
      >
        <UtensilsCrossed className="mx-auto h-16 w-16 text-primary mb-4 animate-pulse-glow" />
        <h1 className="text-4xl sm:text-5xl font-headline font-semibold mb-4 text-glow-primary text-gradient-primary-accent">
          Rudra AI Nutritionist
        </h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto font-body">
          Receive a hyper-personalized nutrition protocol, engineered with the intelligence of the world's top experts.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
          {renderContent()}
      </AnimatePresence>

      <AnimatePresence>
          {serverError && currentStage === 'form' && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto mt-8">
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
  );
}
