
"use client";

import React, { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, MessageSquare, Send, Loader2, Clock } from 'lucide-react';
import { submitContactForm } from '@/app/actions/communicationActions';
import type { ContactFormInput } from '@/ai/types';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle as WhatsAppIcon } from 'lucide-react';
import { z } from 'zod';

export default function ContactUsSection() {
  const [formData, setFormData] = useState<ContactFormInput>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setErrors([]);
    
    const result = await submitContactForm(formData);
    
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      });
      formRef.current?.reset();
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
      if (result.errors) {
        setErrors(result.errors);
      }
    }
    setIsPending(false);
  };
  
  const getErrorForField = (fieldName: keyof ContactFormInput) => {
    return errors.find(err => err.path[0] === fieldName)?.message;
  }

  return (
    <section id="contact-us" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold mb-4 text-gradient-primary-accent" style={{ textShadow: '0 0 15px hsl(var(--primary)/0.5), 0 0 25px hsl(var(--accent)/0.5)' }}>
            Start Your RUDRA R8 Journey Today
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-body">
            Reach out to us to book your session or ask any questions. We're here to guide you on your path to full-spectrum recovery and healing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Card className="bg-gradient-to-br from-card-foreground/[.02] to-transparent">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><MessageSquare size={28} className="mr-3 text-primary animate-pulse-glow"/>Get In Touch</CardTitle>
              <CardDescription className="font-body">
                Fill out the form below, and our team will contact you promptly.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} ref={formRef}>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-body">Full Name</Label>
                    <Input id="name" name="name" placeholder="Your Name" required className="font-body" value={formData.name} onChange={handleInputChange}/>
                    {getErrorForField('name') && <p className="text-sm text-destructive">{getErrorForField('name')}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-body">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="your.email@example.com" required className="font-body" value={formData.email} onChange={handleInputChange}/>
                    {getErrorForField('email') && <p className="text-sm text-destructive">{getErrorForField('email')}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-body">Phone Number (Optional)</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" className="font-body" value={formData.phone} onChange={handleInputChange}/>
                   {getErrorForField('phone') && <p className="text-sm text-destructive">{getErrorForField('phone')}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-body">Subject</Label>
                  <Input id="subject" name="subject" placeholder="RUDRA R8 Session Booking" required className="font-body" value={formData.subject} onChange={handleInputChange}/>
                  {getErrorForField('subject') && <p className="text-sm text-destructive">{getErrorForField('subject')}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-body">Your Message</Label>
                  <Textarea id="message" name="message" placeholder="Tell us more about your needs or questions..." rows={5} required className="font-body" value={formData.message} onChange={handleInputChange}/>
                  {getErrorForField('message') && <p className="text-sm text-destructive">{getErrorForField('message')}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary hover:glow-primary" disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Send Message
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-card-foreground/[.02] to-transparent">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Our Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start group">
                  <MapPin size={24} className="mr-3 mt-1 text-primary shrink-0 group-hover:animate-pulse-glow" />
                  <div>
                    <h4 className="font-semibold text-foreground font-body group-hover:text-primary transition-colors">Visit Us:</h4>
                    <p className="text-foreground/80 font-body">Operating in Delhi NCR & Gurgaon.</p>
                    <p className="text-muted-foreground text-sm font-body">Headquarters: H.No. 557, Sec-1, Huda, Narnaul (123001)</p>
                  </div>
                </div>
                 <div className="flex items-start group">
                  <Phone size={24} className="mr-3 mt-1 text-primary shrink-0 group-hover:animate-pulse-glow" />
                  <div>
                    <h4 className="font-semibold text-foreground font-body group-hover:text-primary transition-colors">Call / Helpline:</h4>
                    <a href="tel:+918278090111" className="text-foreground/80 hover:text-primary transition-colors font-body">+91-8278090111</a>
                  </div>
                </div>
                <div className="flex items-start group">
                  <WhatsAppIcon size={24} className="mr-3 mt-1 text-primary shrink-0 group-hover:animate-pulse-glow" />
                  <div>
                    <h4 className="font-semibold text-foreground font-body group-hover:text-primary transition-colors">WhatsApp:</h4>
                    <a href="https://wa.link/7o72jp" target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors font-body">Chat on WhatsApp</a>
                  </div>
                </div>
                <div className="flex items-start group">
                  <Mail size={24} className="mr-3 mt-1 text-primary shrink-0 group-hover:animate-pulse-glow" />
                  <div>
                    <h4 className="font-semibold text-foreground font-body group-hover:text-primary transition-colors">Email:</h4>
                    <a href="mailto:underground@revive2-0.in" className="text-foreground/80 hover:text-primary transition-colors font-body">underground@revive2-0.in</a>
                  </div>
                </div>
                 <div className="flex items-start group">
                   <Clock size={24} className="mr-3 mt-1 text-primary shrink-0 group-hover:animate-pulse-glow" />
                  <div>
                    <h4 className="font-semibold text-foreground font-body group-hover:text-primary transition-colors">Operating Hours:</h4>
                    <p className="text-foreground/80 font-body">Mon - Sun: 10:00 AM – 05:00 PM IST</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
