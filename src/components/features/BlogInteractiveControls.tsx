
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ImageIcon, Volume2, Play, Pause, AlertTriangle } from 'lucide-react';
import { generateBlogImageAction, generateBlogAudioAction } from '@/app/actions/blogActions';
import type { BlogImageOutput, BlogAudioOutput } from '@/ai/types';
import { AnimatePresence, motion } from 'framer-motion';

interface BlogInteractiveControlsProps {
  initialImageUrl: string;
  initialImageAlt: string;
  dataAiHint: string;
  blogTitle: string;
  textContent: string;
}

const MAX_AUDIO_CHARS = 4900; // Set a safe limit below the model's max of 5000

export default function BlogInteractiveControls({
  initialImageUrl,
  initialImageAlt,
  dataAiHint,
  blogTitle,
  textContent
}: BlogInteractiveControlsProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [imageAlt, setImageAlt] = useState(initialImageAlt);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This effect ensures the audio element is ready for interaction.
    const audio = audioRef.current;
    if (audio) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioUrl]); // Rerun when audioUrl changes

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setError(null);
    try {
      const result: BlogImageOutput = await generateBlogImageAction({ title: blogTitle });
      setImageUrl(result.imageUrl);
      setImageAlt(`AI generated image for blog post: ${blogTitle}. Style: ${result.revisedPrompt}`);
    } catch (err: any) {
      setError(err.message || "Failed to generate image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    setError(null);
    try {
        const truncatedText = textContent.length > MAX_AUDIO_CHARS 
          ? textContent.substring(0, MAX_AUDIO_CHARS) 
          : textContent;

        if (truncatedText.trim() === "") {
          throw new Error("Article has no text content to generate audio from.");
        }

        const result: BlogAudioOutput = await generateBlogAudioAction({ text: truncatedText });
        setAudioUrl(result.audioUrl);
    } catch (err: any) {
        setError(err.message || "Failed to generate audio.");
    } finally {
        setIsGeneratingAudio(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    }
  };


  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={imageUrl} // Use key to force re-render on URL change and trigger animation
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={1200}
            height={600}
            data-ai-hint={dataAiHint}
            className="w-full h-auto object-cover rounded-lg border border-border/30 shadow-lg"
            priority
          />
        </motion.div>
      </AnimatePresence>
      
      <Card className="bg-card-foreground/[.02] border-border/50">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            
          <Button onClick={handleGenerateImage} disabled={isGeneratingImage || isGeneratingAudio} variant="outline" className="w-full sm:w-auto">
            {isGeneratingImage ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Image...</>
            ) : (
              <><ImageIcon className="mr-2 h-4 w-4" /> Regenerate Art</>
            )}
          </Button>

          {!audioUrl ? (
            <Button onClick={handleGenerateAudio} disabled={isGeneratingAudio || isGeneratingImage} variant="outline" className="w-full sm:w-auto">
              {isGeneratingAudio ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Audio...</>
              ) : (
                <><Volume2 className="mr-2 h-4 w-4" /> Listen to this Article</>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-3 p-2 bg-muted rounded-md">
                <Button onClick={togglePlayPause} variant="outline" size="icon">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <audio 
                  ref={audioRef} 
                  src={audioUrl} 
                  className="hidden"
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Audio is ready.</p>
                   {textContent.length > MAX_AUDIO_CHARS && (
                    <p className="text-xs text-muted-foreground/80">(This is a preview of the article)</p>
                  )}
                </div>
            </div>
          )}

        </CardContent>
      </Card>
      
      {error && 
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center gap-x-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/50">
                <AlertTriangle className="h-4 w-4" />
                <p>{error}</p>
            </div>
        </motion.div>
      }
    </div>
  );
}
