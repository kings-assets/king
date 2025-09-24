
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Send, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { generateFollowUpMessageAction } from '@/app/actions/assistantActions';
import { sendSmsAction } from '@/app/actions/communicationActions';
import type { FollowUpInput, FollowUpOutput } from '@/ai/types';
import { useToast } from "@/hooks/use-toast";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  program: string;
  summary: string;
  recommendation: string;
  createdAt: string;
  status: string;
}

interface DashboardClientProps {
  initialInquiries: Inquiry[];
}

interface GeneratedDrafts {
    sms: string;
    emailSubject: string;
    emailBody: string;
}

export default function DashboardClient({ initialInquiries }: DashboardClientProps) {
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<GeneratedDrafts | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAiFollowUpClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setGeneratedDrafts(null);
    setGenerationError(null);
    setIsDialogOpen(true);
  };

  const handleGenerateMessage = async () => {
    if (!selectedInquiry) return;
    setIsGenerating(true);
    setGenerationError(null);
    setGeneratedDrafts(null);

    try {
      const input: FollowUpInput = {
        name: selectedInquiry.name,
        phone: selectedInquiry.phone,
        email: selectedInquiry.email,
        program: selectedInquiry.program,
        aiSummary: selectedInquiry.summary,
        aiRecommendation: selectedInquiry.recommendation,
      };
      const result: FollowUpOutput = await generateFollowUpMessageAction(input);
      setGeneratedDrafts({
          sms: result.smsMessage,
          emailSubject: result.emailSubject,
          emailBody: result.emailBody,
      });
    } catch (e: any) {
      setGenerationError(e.message || 'Failed to generate message.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendSms = async () => {
      if (!selectedInquiry || !generatedDrafts?.sms) return;
      setIsSendingSms(true);
      try {
          const result = await sendSmsAction({ to: selectedInquiry.phone, body: generatedDrafts.sms });
          if (!result) {
            throw new Error("The server failed to respond. Please check the logs.");
          }
          toast({
              title: result.success ? "SMS Sent" : "SMS Failed",
              description: result.message,
              variant: result.success ? "default" : "destructive",
          });
          if (result.success) {
            setIsDialogOpen(false);
          }
      } catch (e: any) {
          toast({
              title: "SMS Error",
              description: e.message || "An unknown error occurred.",
              variant: "destructive",
          });
      } finally {
          setIsSendingSms(false);
      }
  };

  const handleSendEmail = () => {
    if (!selectedInquiry || !generatedDrafts?.emailSubject || !generatedDrafts?.emailBody) return;
    const mailtoLink = `mailto:${selectedInquiry.email}?subject=${encodeURIComponent(generatedDrafts.emailSubject)}&body=${encodeURIComponent(generatedDrafts.emailBody)}`;
    window.open(mailtoLink, '_blank');
    toast({
        title: "Email Client Opened",
        description: "Your default email client has been opened with the drafted message.",
    });
    setIsDialogOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Latest Client Appointments</CardTitle>
          <CardDescription>
            Showing the last 50 submissions. Use the AI Follow-up tool to draft personalized client messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead className="hidden md:table-cell">Program</TableHead>
                <TableHead className="hidden lg:table-cell">AI Summary</TableHead>
                <TableHead className="hidden md:table-cell">Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No appointments found.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div className="font-medium">{inquiry.name}</div>
                      <div className="text-sm text-muted-foreground">{inquiry.phone}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{inquiry.program}</TableCell>
                    <TableCell className="hidden lg:table-cell max-w-xs truncate" title={inquiry.summary}>
                      {inquiry.summary}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {isMounted ? formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true }) : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant={inquiry.status === 'booked' ? 'default' : 'secondary'}>
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAiFollowUpClick(inquiry)}
                      >
                         <Sparkles className="mr-2 h-4 w-4" /> AI Follow-up
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
                <Sparkles className="mr-2 h-6 w-6 text-primary"/> AI Follow-up Assistant
            </DialogTitle>
            <DialogDescription>
              Draft personalized follow-up messages for {selectedInquiry?.name}. Click send to use your default app.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Inquiry Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p><strong>Name:</strong> {selectedInquiry?.name}</p>
                <p><strong>Phone:</strong> {selectedInquiry?.phone}</p>
                <p><strong>Email:</strong> {selectedInquiry?.email}</p>
                <p><strong>Program:</strong> {selectedInquiry?.program}</p>
                <div className="p-3 mt-2 bg-muted rounded-md text-xs">
                    <p><strong>AI Summary:</strong> {selectedInquiry?.summary}</p>
                    <p className="mt-2"><strong>AI Recommendation:</strong> {selectedInquiry?.recommendation}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
               <CardHeader>
                <CardTitle>Generated Drafts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              {!generatedDrafts && !isGenerating && (
                <div className='flex items-center justify-center h-full bg-muted rounded-md p-8 text-center'>
                    <Button onClick={handleGenerateMessage}>
                        <Sparkles className="mr-2 h-4 w-4"/> Generate Drafts
                    </Button>
                </div>
              )}
              {isGenerating && (
                <div className="flex items-center justify-center h-full bg-muted rounded-md p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {generationError && <p className="text-sm text-destructive">{generationError}</p>}
              {generatedDrafts && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                        <Label htmlFor="sms-message">SMS / WhatsApp Draft</Label>
                        <Textarea id="sms-message" defaultValue={generatedDrafts.sms} rows={4} className="text-sm"/>
                        <Button variant="secondary" size="sm" onClick={handleSendSms} disabled={isSendingSms}>
                            {isSendingSms ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                            {isSendingSms ? 'Sending...' : 'Send SMS'}
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email-subject">Email Subject</Label>
                        <Input id="email-subject" defaultValue={generatedDrafts.emailSubject} className="text-sm"/>
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="email-body">Email Body</Label>
                        <Textarea id="email-body" defaultValue={generatedDrafts.emailBody} rows={8} className="text-sm"/>
                         <Button variant="secondary" size="sm" onClick={handleSendEmail} disabled={isSendingSms}>
                            <Mail className="mr-2 h-4 w-4"/> Open in Email Client
                        </Button>
                    </div>
                    <Button variant="outline" onClick={handleGenerateMessage} className="w-full mt-4" disabled={isGenerating || isSendingSms}>
                        <Sparkles className="mr-2 h-4 w-4"/> Regenerate Drafts
                    </Button>
                </div>
              )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
