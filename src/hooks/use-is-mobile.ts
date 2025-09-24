
"use client";

import { useState, useEffect } from "react"

const MOBILE_BREAKPOINT = 768

/**
 * A hook to determine if the current viewport is mobile-sized.
 * This version is SSR-safe, initializing to `false` on the server
 * and checking the actual width on the client after mounting.
 * @returns {boolean} - True if the viewport width is less than the mobile breakpoint.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This code now only runs on the client, where `window` is available.
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check on mount
    checkDevice();

    // Add resize listener
    window.addEventListener('resize', checkDevice);

    // Cleanup listener
    return () => window.removeEventListener('resize', checkDevice);
  }, []); // Empty dependency array ensures this runs once on mount

  return isMobile;
}
