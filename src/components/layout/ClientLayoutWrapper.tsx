'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Preloader from './Preloader';
import FloatingAssistant from '../features/FloatingAssistant';
import { DeviceOrientationProvider } from '@/hooks/useDeviceOrientation';
import Header from './Header';
import Footer from './Footer';
import { usePathname } from 'next/navigation';

export default function ClientLayoutWrapper({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/admin/login') || pathname.startsWith('/client/login');


  useEffect(() => {
    // This stable effect runs only on the client side.
    // It removes the preloader after a fixed duration, avoiding complex DOM interactions that can cause instability.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800); // A safe duration for animations to complete.

    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount.

  return (
    <DeviceOrientationProvider>
      {isLoading && <Preloader />}
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }} className="flex min-h-screen flex-col">
        {!isAuthPage && <Header />}
        <main className="flex-grow">
          {children}
        </main>
        {!isAuthPage && <Footer />}
        {!isAuthPage && <FloatingAssistant />}
      </div>
    </DeviceOrientationProvider>
  );
}
