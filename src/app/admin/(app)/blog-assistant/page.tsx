
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Newspaper, Loader2, Sparkles, AlertTriangle, FileText, Send, Copy } from 'lucide-react';
import { generateBlogPostAction } from '@/app/actions/blogActions';
import type { BlogPostOutput } from '@/ai/types';
import BlogPostClient from '@/components/features/BlogPostClient';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  topic: z.string().min(10, 'Please provide a topic with at least 10 characters.'),
});
type FormValues = z.infer<typeof FormSchema>;

// A simplified display component for the generated post inside the admin panel
const GeneratedPostPreview = ({ post }: { post: BlogPostOutput }) => {
  // A mock post object for the BlogPostClient component
  const mockPostForDisplay = {
    ...post,
    id: 999, // dummy id
    slug: 'preview-slug', // dummy slug
  };

  return (
    <div className="bg-background rounded-lg p-4 border border-border/50">
        <h3 className="text-lg font-semibold mb-4">Generated Preview</h3>
        <div className="max-h-[800px] overflow-y-auto pr-4">
             <BlogPostClient post={mockPostForDisplay} />
        </div>
    </div>
  );
};

const LoadingAnimation = () => (
    <motion.div
        key="loading"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center p-8 bg-card-foreground/[.02] rounded-lg border-2 border-dashed border-primary/30 h-[400px] flex flex-col justify-center items-center relative overflow-hidden"
    >
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--primary)/0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}
            className="mt-6 text-2xl font-headline text-primary text-glow-primary"
        >
            <Loader2 className="inline-block mr-3 h-8 w-8 animate-spin" />
            Rudra AI is Forging Your Article...
        </motion.div>
        <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.8 } }}
            className="text-muted-foreground font-body mt-2 max-w-sm"
        >
            The agent is analyzing the topic, drafting content, and commanding the image generator. This may take a moment.
        </motion.p>
    </motion.div>
);


export default function BlogAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState<BlogPostOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);

    try {
      const post = await generateBlogPostAction({ topic: data.topic });
      setGeneratedPost(post);
      reset();
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyPostObject = () => {
      if (!generatedPost) return;

      const postForDataFile = {
        // id should be manually incremented when adding
        // slug should be manually created from the title
        ...generatedPost,
      };

      // Exclude fields that might not be in the final data structure or need manual setting
      const { imageAlt, ...restOfPost } = postForDataFile;

      navigator.clipboard.writeText(JSON.stringify(restOfPost, null, 2));
      toast({
        title: "Copied to Clipboard",
        description: "The blog post data object has been copied.",
      })
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      <div className="flex justify-between items-start mb-8">
        <div className="text-left">
          <h1 className="text-4xl sm:text-5xl font-headline font-semibold mb-4 text-glow-secondary text-gradient-secondary-accent">
            <Newspaper className="inline-block mr-3 h-10 w-10 align-bottom" />
            Blog Assistant
          </h1>
          <p className="text-lg text-foreground/80 max-w-2xl font-body">
            Command the AI to craft a complete, high-quality blog post with a generated image.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Command Input</CardTitle>
                <CardDescription>
                  Provide a detailed topic or concept for the article.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="topic">Blog Post Topic</Label>
                <Textarea
                  id="topic"
                  placeholder="e.g., 'The role of the REMAP stage in athletic performance' or 'A deep dive into how R8 helps with chronic back pain'"
                  rows={6}
                  {...register('topic')}
                />
                {errors.topic && (
                  <p className="text-sm text-destructive mt-2">{errors.topic.message}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate Post
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
            {isLoading ? (
                <LoadingAnimation />
            ) : error ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Generation Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </motion.div>
            ) : generatedPost ? (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertTitle>Post Generated Successfully!</AlertTitle>
                        <AlertDescription>
                            Review the generated post below. To publish it, you must currently copy the data object and manually add it to the `src/lib/blogPostsData.ts` file. Remember to assign a new `id` and create a `slug`.
                        </AlertDescription>
                        <div className="mt-4">
                            <Button onClick={copyPostObject} variant="outline" size="sm">
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Post Object
                            </Button>
                        </div>
                    </Alert>
                    <GeneratedPostPreview post={generatedPost} />
                </motion.div>
            ) : (
                <Card className="flex flex-col items-center justify-center text-center p-8 h-[400px] border-dashed">
                    <Newspaper className="h-16 w-16 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-semibold">Awaiting Command</h3>
                    <p className="mt-2 text-muted-foreground">
                        Your generated blog post will appear here.
                    </p>
                </Card>
            )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
