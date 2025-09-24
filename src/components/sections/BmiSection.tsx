
"use client";

import { useState, type FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, Scale, Activity, RefreshCw, FileText, Droplets, Dumbbell, Percent, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface BodyMetrics {
    bmi: number;
    category: string;
    healthyRange: string;
    bodyFatPercentage: number;
    fatMass: number;
    leanMass: number;
    totalBodyWater: number;
}

interface BmiSectionProps {
    onReportGenerated: (data: { reportString: string, metrics: { age: number, weight: number, height: number }}) => void;
}

export default function BmiSection({ onReportGenerated }: BmiSectionProps) {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [report, setReport] = useState<BodyMetrics | null>(null);
  const [error, setError] = useState<string>('');

  const calculateMetrics = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setReport(null);

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);
    const g = parseInt(gender, 10); // 1 for male, 0 for female

    if (isNaN(h) || isNaN(w) || isNaN(a) || isNaN(g) || h <= 0 || w <= 0 || a <= 0) {
      setError('Please enter valid positive numbers for all fields.');
      return;
    }
    
    // --- Calculations ---
    const bmi = w / ((h / 100) ** 2);
    const healthyWeightLower = 18.5 * ((h / 100) ** 2);
    const healthyWeightUpper = 24.9 * ((h / 100) ** 2);

    // Body Fat % (Deurenberg formula)
    const bodyFatPercentage = (1.20 * bmi) + (0.23 * a) - (10.8 * g) - 5.4;

    // Fat Mass and Lean Mass
    const fatMass = w * (bodyFatPercentage / 100);
    const leanMass = w - fatMass;

    // Total Body Water (Watson formula)
    let totalBodyWater;
    if (g === 1) { // Male
      totalBodyWater = 2.447 - (0.09156 * a) + (0.1074 * h) + (0.3362 * w);
    } else { // Female
      totalBodyWater = -2.097 + (0.1069 * h) + (0.2466 * w);
    }

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obesity';
    
    const newReport: BodyMetrics = {
        bmi: parseFloat(bmi.toFixed(1)),
        category,
        healthyRange: `For your height, a healthy weight range is approximately ${healthyWeightLower.toFixed(1)} kg to ${healthyWeightUpper.toFixed(1)} kg.`,
        bodyFatPercentage: parseFloat(bodyFatPercentage.toFixed(1)),
        fatMass: parseFloat(fatMass.toFixed(1)),
        leanMass: parseFloat(leanMass.toFixed(1)),
        totalBodyWater: parseFloat(totalBodyWater.toFixed(1)),
    };

    setReport(newReport);

    const reportString = `Client Body Composition Analysis:
- BMI: ${newReport.bmi} (${newReport.category})
- Estimated Body Fat: ${newReport.bodyFatPercentage}%
- Estimated Fat Mass: ${newReport.fatMass} kg
- Estimated Lean Body Mass: ${newReport.leanMass} kg
- Estimated Total Body Water: ${newReport.totalBodyWater} L
- Client provided info: Age=${a}, Gender=${g === 1 ? 'Male' : 'Female'}, Height=${h}cm, Weight=${w}kg.`;
    
    onReportGenerated({
        reportString: reportString,
        metrics: { age: a, weight: w, height: h }
    });
  };
  
  const resetCalculator = () => {
    setHeight(''); setWeight(''); setAge(''); setGender('');
    setReport(null); setError('');
    onReportGenerated({ reportString: '', metrics: { age: 0, weight: 0, height: 0 }});
  }

  const getCategoryStyle = (category?: string) => {
    if (!category) return "text-foreground";
    switch (category) {
      case 'Underweight': return 'text-yellow-400';
      case 'Normal weight': return 'text-green-400';
      case 'Overweight': return 'text-orange-400';
      case 'Obesity': return 'text-red-500';
      default: return 'text-foreground';
    }
  };

  const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

  return (
    <Card className="w-full animate-fade-in bg-gradient-to-br from-card-foreground/[.02] to-transparent">
        <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center">
            <Scale size={28} className="mr-3 text-primary animate-pulse-glow"/> Step 1: Body Composition Analysis
            </CardTitle>
            <CardDescription className="font-body">Enter your details for a comprehensive body composition estimate. This provides crucial context for your AI Nutritionist.</CardDescription>
        </CardHeader>
        <AnimatePresence mode="wait">
        {!report ? (
        <motion.div key="form" exit={{ opacity: 0, height: 0 }}>
        <form onSubmit={calculateMetrics}>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2"> <Label htmlFor="height" className="font-body">Height (cm)</Label> <Input id="height" type="number" placeholder="e.g., 175" value={height} onChange={(e) => setHeight(e.target.value)} required /> </div>
                    <div className="space-y-2"> <Label htmlFor="weight" className="font-body">Weight (kg)</Label> <Input id="weight" type="number" placeholder="e.g., 70" value={weight} onChange={(e) => setWeight(e.target.value)} required /> </div>
                    <div className="space-y-2"> <Label htmlFor="age" className="font-body">Age</Label> <Input id="age" type="number" placeholder="e.g., 30" value={age} onChange={(e) => setAge(e.target.value)} required /> </div>
                    <div className="space-y-2">
                        <Label className="font-body">Biological Gender</Label>
                        <RadioGroup onValueChange={setGender} value={gender} className="flex gap-4 pt-2" required>
                            <div className="flex items-center space-x-2"> <RadioGroupItem value="1" id="male" /> <Label htmlFor="male">Male</Label> </div>
                            <div className="flex items-center space-x-2"> <RadioGroupItem value="0" id="female" /> <Label htmlFor="female">Female</Label> </div>
                        </RadioGroup>
                    </div>
                </div>
                {error && <p className="text-sm text-destructive font-body">{error}</p>}
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary hover:glow-primary">
                    <Calculator className="mr-2 h-4 w-4" /> Generate Body Report
                </Button>
            </CardFooter>
        </form>
        </motion.div>
        ) : (
        <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pt-0">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    { icon: Activity, label: "BMI", value: report.bmi, unit: "", color: getCategoryStyle(report.category) },
                    { icon: Percent, label: "Body Fat", value: report.bodyFatPercentage, unit: "%", color: "text-accent" },
                    { icon: Droplets, label: "Body Water", value: report.totalBodyWater, unit: "L", color: "text-blue-400" },
                    { icon: Dumbbell, label: "Lean Mass", value: report.leanMass, unit: "kg", color: "text-green-400" },
                    { icon: Scale, label: "Fat Mass", value: report.fatMass, unit: "kg", color: "text-orange-400" },
                    { icon: Calendar, label: "Category", value: report.category, unit: "", color: getCategoryStyle(report.category) },
                ].map(item => (
                    <motion.div key={item.label} variants={itemVariants}>
                        <Card className="p-4 text-center bg-card-foreground/[.02] border border-border/30 h-full">
                            <item.icon className={`mx-auto h-8 w-8 mb-2 ${item.color}`} />
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            <p className={`text-2xl font-bold font-headline ${item.color}`}>{item.value} <span className="text-base font-sans">{item.unit}</span></p>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
            <motion.div variants={itemVariants} className="mt-4 p-4 bg-card-foreground/[.02] rounded-lg border-l-4 border-primary">
                    <h4 className="font-semibold text-primary">Interpretation</h4>
                    <p className="text-foreground/80 font-body text-sm">{report.healthyRange}</p>
            </motion.div>
            <CardFooter className="flex flex-col sm:flex-row gap-2 pt-6">
                <Button onClick={resetCalculator} className="w-full" variant="outline"> <RefreshCw className="mr-2 h-4 w-4" /> Calculate Again </Button>
            </CardFooter>
        </motion.div>
        )}
        </AnimatePresence>
    </Card>
  );
}
