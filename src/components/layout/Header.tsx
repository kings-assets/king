'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, BrainCircuit, Sparkles, UtensilsCrossed, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInteractive3D } from '@/hooks/useInteractive3D';
import Image from 'next/image';

const mainNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About R8' },
  { href: '/r8-stages', label: 'The R8 System' },
  { href: '/r8-programs', label: 'Programs' },
  { href: '/who-can-benefit', label: 'Who Can Benefit' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

const featureLinks = [
    { href: '/smart-booking', label: 'Smart Booking', icon: Sparkles },
    { href: '/reviver-agent', label: 'Reviver Agent', icon: BrainCircuit },
    { href: '/nutrition-agent', label: 'Nutrition Agent', icon: UtensilsCrossed },
];

export const HolographicLogo = () => {
    const { ref, style } = useInteractive3D({
        stiffness: 120, damping: 20, rotationRangeX: 10, rotationRangeY: 10
    });

    return (
        <motion.div
            ref={ref}
            style={{ ...style, transformStyle: 'preserve-3d' }}
            className="relative w-[250px] h-[60px] cursor-pointer"
        >
            <Image
                src="/logo.png"
                alt="Revive 2.0 Underground Logo"
                fill
                className="object-contain animate-logo-aurora-glow"
                priority
            />
        </motion.div>
    );
};

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
        <Link
            href={href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
                "text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300 relative group",
                isActive && "text-primary"
            )}
        >
            {children}
            <span className={cn(
                "absolute bottom-[-2px] left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ease-out",
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
            )}></span>
        </Link>
    );
  };
  
  const MobileNavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
     <Link
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className="text-xl font-headline text-foreground/80 hover:text-primary transition-colors"
      >
        {children}
      </Link>
  );

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border/50' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
           <Link href="/" className="flex-shrink-0">
               <HolographicLogo />
           </Link>

          <nav className="hidden lg:flex items-center space-x-6">
            {mainNavLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
            ))}
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium text-foreground/80 hover:text-primary data-[state=open]:text-primary focus:text-primary">
                        Features <ChevronDown className="ml-1 h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {featureLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <DropdownMenuItem key={link.href} asChild>
                                <Link href={link.href} className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-primary"/>
                                    {link.label}
                                </Link>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center space-x-2">
            <Button asChild className="hidden sm:inline-flex bg-gradient-to-r from-primary to-accent text-primary-foreground glow-primary hover:glow-primary">
              <Link href="/smart-booking">Book a Session</Link>
            </Button>
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full bg-sidebar border-l-border/50 p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                       <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                          <Image src="/logo.png" alt="Rudra R8 Logo" width={150} height={40} className="h-8 w-auto" />
                       </Link>
                       <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                         <X className="h-6 w-6"/>
                       </Button>
                    </div>
                    <nav className="flex-grow flex flex-col justify-center items-center gap-y-6">
                      {mainNavLinks.map((link) => (
                        <MobileNavLink key={link.href} href={link.href}>{link.label}</MobileNavLink>
                      ))}
                      <div className="pt-4 border-t border-sidebar-border/50 w-3/4 text-center">
                         <p className="font-headline text-lg text-primary mb-4 mt-4">Features</p>
                          {featureLinks.map((link) => {
                              const Icon = link.icon;
                              return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-3 text-xl font-headline text-foreground/80 hover:text-primary transition-colors mb-4"
                                >
                                    <Icon className="h-5 w-5 text-primary"/>
                                    {link.label}
                                </Link>
                              )
                          })}
                      </div>
                    </nav>
                     <div className="p-4 border-t border-sidebar-border">
                        <Button asChild className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                          <Link href="/smart-booking" onClick={() => setIsMobileMenuOpen(false)}>Book a Session</Link>
                        </Button>
                      </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
