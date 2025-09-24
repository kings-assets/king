
import SmartBookingWizard from '@/components/features/SmartBookingWizard';
import { BrainCircuit } from 'lucide-react';

export default function SmartBookingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl sm:text-5xl font-headline font-semibold mb-4 text-glow-accent text-gradient-secondary-accent animate-aurora-pulse">
          Rudra AI: Your Transformation Architect
        </h1>
        <p className="text-lg text-foreground/80 max-w-3xl mx-auto font-body">
          Engage with our advanced AI to analyze your unique needs and architect the precise RUDRA R8 pathway for your transformation. Your journey to peak potential begins now.
        </p>
      </div>
      <SmartBookingWizard />
    </div>
  );
}
