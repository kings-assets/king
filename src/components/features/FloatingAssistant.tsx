'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Bot, X, Sparkles, User, MessageCircle } from 'lucide-react';

import { marketingAssistantAction } from '@/app/actions/assistantActions';
import type { MarketingAssistantInput } from '@/ai/types';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HolographicLogo } from '@/components/layout/Header';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const initialPrompts = ["What is the R8 System?", "Tell me about R8 Reclaim", "Who is Shivansh Sharma?"];

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
      { role: 'assistant', content: "Hi! I am Rudra, your personal guide to Revive 2.0 Underground. You can ask me about our R8 programs, our philosophy, or general wellness topics. How can I assist you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if(viewport) {
           viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = { role: 'user', content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setQuery('');

    try {
      const input: MarketingAssistantInput = { query: messageContent };
      const response = await marketingAssistantAction(input);
      const assistantMessage: Message = { role: 'assistant', content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(query);
  };

  const handleInitialPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60]">
        <AnimatePresence>
        {!isOpen && (
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <Button
                size="lg"
                className="rounded-full h-16 w-16 p-0 shadow-2xl shadow-primary/30 bg-gradient-to-br from-primary to-accent glow-primary hover:glow-primary"
                onClick={() => setIsOpen(true)}
                aria-label="Open AI Assistant"
                >
                    <Sparkles className="h-8 w-8 text-primary-foreground animate-pulse" />
                </Button>
            </motion.div>
        )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="fixed bottom-6 right-6 z-[60] w-[calc(100vw-3rem)] max-w-md h-[70vh] max-h-[600px]"
          >
            <Card className="h-full w-full flex flex-col bg-card/80 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/20">
              <CardHeader className="flex-row items-center justify-between border-b border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-full text-primary"> <Bot size={24} /> </div>
                    <div>
                        <CardTitle className="text-lg font-headline text-glow-primary">Rudra AI Agent</CardTitle>
                        <CardDescription className="text-xs">Ask me anything</CardDescription>
                    </div>
                  </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}><X /></Button>
              </CardHeader>
              <CardContent className="p-4 flex-grow overflow-hidden">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                  <div className="space-y-6">
                    <AnimatePresence>
                    {messages.map((message, index) => (
                        <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : '')}
                        >
                        {message.role === 'assistant' && (<div className="p-2 bg-primary/20 rounded-full text-primary shrink-0"><Bot size={18} /></div>)}
                        <div className={cn('max-w-xs p-3 rounded-xl', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <div className="prose prose-sm prose-invert max-w-none text-white">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                            </div>
                        </div>
                        {message.role === 'user' && (<div className="p-2 bg-muted rounded-full shrink-0"><User size={18} /></div>)}
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
                             <div className="p-2 bg-primary/20 rounded-full text-primary"><Bot size={18} /></div>
                             <div className="p-3 rounded-xl bg-muted flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm text-muted-foreground">Thinking...</span>
                            </div>
                        </motion.div>
                    )}
                    </AnimatePresence>
                     {messages.length === 1 && (
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1, transition:{delay:0.3}}} className="space-y-2 text-center p-4">
                            <p className="text-sm text-muted-foreground">Or, select a starting point:</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {initialPrompts.map(prompt => (
                                    <Button key={prompt} variant="outline" size="sm" onClick={() => handleInitialPrompt(prompt)}>
                                        {prompt}
                                    </Button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <div className="p-4 border-t border-border/50">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question..."
                    rows={1}
                    className="flex-grow resize-none bg-input"
                    disabled={isLoading}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !query.trim()}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
