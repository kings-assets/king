'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-card-foreground/[.03] to-transparent border-t border-border/50 pt-16 pb-8 font-body">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div className="space-y-4">
            <Image src="/logo.png" alt="Rudra R8 Logo" width={200} height={50} className="h-10 w-auto animate-logo-aurora-glow" />
            <p className="text-sm text-foreground/70">
              Revive 2.0 Underground is a world-class center dedicated to unlocking human potential through the revolutionary RUDRA R8 system, pioneered by Shivansh Sharma.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/Revive2Underground/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-foreground/70 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://twitter.com/revive2_0ug" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-foreground/70 hover:text-primary transition-colors" />
              </Link>
              <Link href="https://www.instagram.com/revive2.0_ug/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-foreground/70 hover:text-primary transition-colors" />
              </Link>
               <Link href="https://www.youtube.com/@Revive2.0UG" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="h-5 w-5 text-foreground/70 hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-headline font-semibold text-lg text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/#r8-system" className="text-foreground/70 hover:text-primary transition-colors">R8 System</Link></li>
              <li><Link href="/r8-programs" className="text-foreground/70 hover:text-primary transition-colors">Programs</Link></li>
              <li><Link href="/faq" className="text-foreground/70 hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/blog" className="text-foreground/70 hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal & Resources */}
          <div className="space-y-4">
            <h4 className="font-headline font-semibold text-lg text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/sitemap.xml" className="text-foreground/70 hover:text-primary transition-colors">Sitemap</Link></li>
              <li><Link href="/client/login" className="text-foreground/70 hover:text-primary transition-colors">Client Portal</Link></li>
               <li><Link href="/admin/login" className="text-foreground/70 hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="font-headline font-semibold text-lg text-foreground">Join the Revolution</h4>
            <p className="text-sm text-foreground/70">Subscribe for insights on human optimization and system updates.</p>
            <div className="opacity-50 cursor-not-allowed">
              <div className="flex space-x-2">
                <Input type="email" placeholder="Your Email" className="bg-input border-border/50" disabled />
                <Button type="submit" size="icon" aria-label="Subscribe to newsletter" disabled>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
             <p className="text-xs text-muted-foreground">Newsletter coming soon.</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Revive 2.0 Underground. All Rights Reserved.</p>
           <p className="mt-1">A creation of Visionary Architect Shivansh Sharma.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
