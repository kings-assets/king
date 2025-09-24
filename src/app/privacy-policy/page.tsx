
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
      <div className="text-center mb-12 animate-slide-up">
        <h1 className="text-4xl sm:text-5xl font-headline font-semibold mb-4 text-glow-primary text-gradient-primary-accent">
          <ShieldCheck className="inline-block mr-3 h-10 w-10 align-bottom" />
          Privacy Policy
        </h1>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-body">
          Your privacy is critically important to us. Here's how we collect, use, and protect your information.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-card-foreground/[.02] to-transparent">
        <CardHeader>
          <CardTitle>Our Commitment to Your Privacy</CardTitle>
          <CardDescription>Last updated: July 29, 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 font-body text-foreground/80 prose prose-invert">
          
          <p>Revive 2.0 Underground ("us", "we", or "our") operates the https://www.revive2-0.in/ website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

          <h3 className="font-headline text-primary">Information Collection and Use</h3>
          <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
          
          <h4 className="font-headline text-secondary">Types of Data Collected</h4>
          <ul className="list-disc pl-5">
            <li><strong>Personal Data:</strong> While using our Service, particularly the contact and booking forms, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Email address, Name, Phone number, and details about your health goals and physical condition.</li>
            <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data. This data is collected in an anonymized form.</li>
          </ul>

          <h3 className="font-headline text-primary">Use of Data</h3>
          <p>Revive 2.0 Underground uses the collected data for various purposes:</p>
          <ul className="list-disc pl-5">
            <li>To provide and maintain our Service.</li>
            <li>To respond to your inquiries and schedule appointments.</li>
            <li>To provide you with initial AI-driven insights about our services based on the information you provide.</li>
            <li>To provide analysis or valuable information so that we can improve the Service.</li>
            <li>To monitor the usage of the Service.</li>
            <li>To detect, prevent and address technical issues.</li>
          </ul>

          <h3 className="font-headline text-primary">Data Security</h3>
          <p>The security of your data is important to us. We store your inquiry information in a secure database (Google Firestore) with access controls. However, remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

          <h3 className="font-headline text-primary">Service Providers</h3>
          <p>We may employ third-party companies to facilitate our Service ("Service Providers"), such as Google for our AI models (Genkit) and Twilio for SMS notifications. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
          
          <h3 className="font-headline text-primary">Changes to This Privacy Policy</h3>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

          <h3 className="font-headline text-primary">Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us by email: <a href="mailto:underground@revive2-0.in" className="text-accent hover:underline">underground@revive2-0.in</a></p>

        </CardContent>
      </Card>
    </div>
  );
}
