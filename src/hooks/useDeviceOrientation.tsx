'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode, useMemo } from 'react';

// Define the shape of our context state
interface DeviceOrientationContextState {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  permissionState: 'granted' | 'denied' | 'prompt' | 'unsupported';
  requestPermission: () => Promise<void>;
  hasInteracted: boolean;
}

// Create the context with a default undefined value
const DeviceOrientationContext = createContext<DeviceOrientationContextState | undefined>(undefined);

// Create the provider component
export const DeviceOrientationProvider = ({ children }: { children: ReactNode }) => {
  const [orientation, setOrientation] = useState<{
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  }>({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');
  const [hasInteracted, setHasInteracted] = useState(false);

  const requestPermission = useCallback(async () => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;
    
    setHasInteracted(true); // Record that user has clicked, regardless of outcome

    const DOWindow = window as any;
    if (typeof DOWindow.DeviceOrientationEvent?.requestPermission === 'function') {
      try {
        const permission = await DOWindow.DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setPermissionState('granted');
        } else {
          setPermissionState('denied');
        }
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setPermissionState('denied');
      }
    } else {
      // For non-iOS devices or environments where this API doesn't exist
      setPermissionState('granted');
    }
  }, []);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({ alpha: event.alpha, beta: event.beta, gamma: event.gamma });
    };

    if (permissionState === 'granted' && typeof window !== 'undefined') {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [permissionState]);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).DeviceOrientationEvent) {
        setPermissionState('unsupported');
    }
  }, []);

  // By memoizing the context value, we ensure it's stable across re-renders
  // unless its dependencies change. This is a performance optimization and
  // makes the state management more robust, preventing unnecessary re-renders.
  const value = useMemo(() => ({
    alpha: orientation.alpha,
    beta: orientation.beta,
    gamma: orientation.gamma,
    permissionState,
    requestPermission,
    hasInteracted,
  }), [orientation.alpha, orientation.beta, orientation.gamma, permissionState, requestPermission, hasInteracted]);


  return (
    <DeviceOrientationContext.Provider value={value}>
      {children}
    </DeviceOrientationContext.Provider>
  );
};

// Create the consumer hook which components will use
const useDeviceOrientation = (): DeviceOrientationContextState => {
  const context = useContext(DeviceOrientationContext);
  if (context === undefined) {
    throw new Error('useDeviceOrientation must be used within a DeviceOrientationProvider');
  }
  return context;
};

export default useDeviceOrientation;
