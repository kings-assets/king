'use client';

import { useRef, useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, type MotionStyle, type MotionValue } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-is-mobile';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';

interface UseInteractive3DProps {
  stiffness?: number;
  damping?: number;
  rotationRangeX?: number;
  rotationRangeY?: number;
}

interface UseInteractive3DReturn {
  ref: React.RefObject<HTMLDivElement>;
  style: MotionStyle;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  onClick: (() => Promise<void>) | undefined;
  xSpring: MotionValue<number>;
  ySpring: MotionValue<number>;
  isPermissionPromptVisible: boolean;
}

/**
 * The Aura Core Interactive Engine.
 * A centralized hook for creating consistent, "mind-boggling" 3D tilt effects.
 * It handles mouse tracking on desktop and gyroscope data on mobile, including
 * the permission request flow for iOS devices.
 *
 * @param {UseInteractive3DProps} props - Configuration for the spring and rotation.
 * @returns An object containing the ref to attach, style objects, motion values, and event handlers.
 */
export const useInteractive3D = ({
  stiffness = 150,
  damping = 20,
  rotationRangeX = 15,
  rotationRangeY = 15
}: UseInteractive3DProps = {}): UseInteractive3DReturn => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { beta, gamma, requestPermission, permissionState, hasInteracted } = useDeviceOrientation();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness, damping });
  const ySpring = useSpring(y, { stiffness, damping });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], [`${rotationRangeX}deg`, `-${rotationRangeX}deg`]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [`-${rotationRangeY}deg`, `${rotationRangeY}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      x.set(0);
      y.set(0);
    }
  };

  useEffect(() => {
    if (isMobile && permissionState === 'granted' && gamma !== null && beta !== null) {
      const normalizedGamma = Math.max(-30, Math.min(30, gamma)) / 60; // Left-to-right tilt
      const normalizedBeta = Math.max(-30, Math.min(30, beta - 45)) / 60; // Front-to-back tilt, adjusted
      x.set(normalizedGamma);
      y.set(normalizedBeta);
    }
  }, [isMobile, permissionState, beta, gamma, x, y]);

  // The main style object to apply to the motion component.
  const style: MotionStyle = {
    rotateX,
    rotateY,
    transformStyle: "preserve-3d",
  };

  // The onClick handler for requesting mobile permissions.
  const onClick = isMobile && permissionState === 'prompt' ? requestPermission : undefined;
  
  const isPermissionPromptVisible = isMobile && permissionState === 'prompt' && !hasInteracted;
  
  return {
    ref,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: onClick,
    xSpring,
    ySpring,
    isPermissionPromptVisible
  };
};
