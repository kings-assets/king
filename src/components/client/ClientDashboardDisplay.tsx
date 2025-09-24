
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AnalysisResultDisplay from '@/components/features/AnalysisResultDisplay';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';
import Link from 'next/link';
import type { ClientReport, ClientAppointment } from '@/ai/types';
import { BrainCircuit, Calendar, FileText, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ClientDashboardDisplayProps {
  reports: ClientReport[];
  appointments: ClientAppointment[];
}

export default function ClientDashboardDisplay({ reports, appointments }: ClientDashboardDisplayProps) {
  
  const hasReports = reports && reports.length > 0;
  const hasAppointments = appointments && appointments.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><FileText /> Reviver Agent Reports</CardTitle>
                    <CardDescription>Your AI-generated analysis from uploaded medical documents.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!hasReports ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">You have not analyzed any reports yet.</p>
                            <Button asChild>
                                <Link href="/reviver-agent">
                                    <BrainCircuit className="mr-2 h-4 w-4"/> Analyze Your First Report
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {reports.map((report, index) => (
                                <AccordionItem value={`item-${index}`} key={index} className="border bg-card-foreground/[.02] rounded-md px-4">
                                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                    Report from {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
                                </AccordionTrigger>
                                <AccordionContent className="bg-background/50 -mx-4 -mb-4 p-4 rounded-b-md border-t">
                                    <AnalysisResultDisplay analysisResult={report.analysis} />
                                </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Calendar /> Smart Booking History</CardTitle>
                    <CardDescription>A log of your past booking inquiries and the AI's analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!hasAppointments ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground mb-4">You have no booking history.</p>
                            <Button asChild>
                                <Link href="/smart-booking">
                                    <Bot className="mr-2 h-4 w-4"/> Start a Smart Booking
                                </Link>
                            </Button>
                        </div>
                    ) : (
                         <Accordion type="single" collapsible className="w-full space-y-2">
                            {appointments.map((appt) => (
                                <AccordionItem value={appt.id} key={appt.id} className="border bg-card-foreground/[.02] rounded-md px-4">
                                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                    <div className="flex justify-between w-full pr-2">
                                        <span>{appt.program}</span>
                                        <span className="text-muted-foreground text-sm">{formatDistanceToNow(new Date(appt.createdAt), { addSuffix: true })}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-background/50 -mx-4 -mb-4 p-4 rounded-b-md border-t space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-primary">AI Summary</h4>
                                        <p className="text-sm text-foreground/80">{appt.summary}</p>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold text-primary">AI Recommendation</h4>
                                        <p className="text-sm text-foreground/80">{appt.recommendation}</p>
                                    </div>
                                    <div className="flex justify-start">
                                        <Badge variant={appt.status.startsWith('booked') ? 'default' : 'secondary'}>{appt.status}</Badge>
                                    </div>
                                </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
