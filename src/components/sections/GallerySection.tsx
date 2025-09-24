
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AnimatePresence, motion } from 'framer-motion';

const galleryImages = [
  { id: 1, src: "/gallery-therapy-session.jpg", alt: "R8 therapy session in a modern Revive Underground clinic", dataAiHint: "therapy session" },
  { id: 2, src: "/gallery-diagnostic-equipment.jpg", alt: "Advanced R8 diagnostic equipment interface", dataAiHint: "diagnostic equipment" },
  { id: 3, src: "/gallery-peak-performance.jpg", alt: "Client embodying peak performance after R8 therapy", dataAiHint: "peak performance" },
  { id: 4, src: "/gallery-r8-technology-detail.jpg", alt: "Detailed close-up of R8 system technology component", dataAiHint: "technology detail" },
  { id: 5, src: "/gallery-facility-interior.jpg", alt: "Interior of Revive Underground facility", dataAiHint: "facility interior" },
  { id: 6, src: "/gallery-r8-application.jpg", alt: "Client receiving a precise R8 system application", dataAiHint: "therapy application" },
  { id: 7, src: "/gallery-client-consultation.jpg", alt: "Therapist and client in consultation", dataAiHint: "client consultation" },
  { id: 8, src: "/gallery-athlete-recovery.jpg", alt: "Athlete in a rejuvenating R8 recovery session", dataAiHint: "athlete recovery" },
];

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <section id="gallery" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-semibold mb-4 text-gradient-primary-accent" style={{ textShadow: '0 0 15px hsl(var(--primary)/0.5), 0 0 25px hsl(var(--accent)/0.5)' }}>
              Visual Journey: The R8 Experience
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-body">
              A glimpse into the world of Revive Underground and the transformative R8 system.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedImage(image.src)}
                className="group cursor-pointer relative overflow-hidden rounded-lg shadow-lg aspect-square border border-border/20 hover:border-primary/50"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  data-ai-hint={image.dataAiHint}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                  quality={75}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-body opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="p-0 border-0 bg-transparent w-full max-w-5xl h-[90vh] shadow-none flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                className="relative w-full h-full"
              >
                <Image
                  src={selectedImage}
                  alt="Selected gallery image"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
