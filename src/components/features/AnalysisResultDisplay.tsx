
'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText } from 'lucide-react';

interface AnalysisResultDisplayProps {
  analysisResult: string;
}

export default function AnalysisResultDisplay({ analysisResult }: AnalysisResultDisplayProps) {
  return (
    <Card className="bg-gradient-to-br from-card-foreground/[.04] to-transparent border-2 border-primary/30 shadow-2xl shadow-primary/10">
        <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-headline text-glow-primary text-primary">
                <FileText /> Rudra AI Analysis Report
            </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none font-body text-foreground/80 marker:text-primary [&_a]:text-accent [&_a:hover]:text-accent/80 [&_strong]:text-foreground/90">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysisResult}
            </ReactMarkdown>
        </CardContent>
    </Card>
  );
}
