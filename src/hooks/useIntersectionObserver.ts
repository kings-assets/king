
'use client';

import { useEffect, useRef, useState } from 'react';

interface IntersectionObserverHookOptions extends IntersectionObserverInit {
  // No custom options needed for now, but can be extended
}

/**
 * Custom hook to detect when an element is intersecting with the viewport.
 * Can be used to trigger animations or highlight active navigation links.
 * 
 * @param setActiveId Callback function to set the ID of the currently active (intersecting) element.
 * @param sectionIds Array of IDs of the sections to observe.
 * @param options IntersectionObserver options (threshold, rootMargin, etc.).
 * @returns A ref to attach to the parent container of the observed sections, 
 *          or individual refs can be managed within the component using this hook.
 *          For nav highlighting, it's common to observe multiple sections.
 */
const useIntersectionObserver = (
  setActiveId: (id: string | null) => void,
  sectionIds: string[],
  options?: IntersectionObserverHookOptions
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElementsRef = useRef<Map<Element, string>>(new Map());

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observedElementsRef.current.clear();
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = observedElementsRef.current.get(entry.target);
          if (id) {
            setActiveId(id);
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: options?.rootMargin ?? '-50% 0px -50% 0px', // Adjust rootMargin to activate when section is roughly in middle of viewport
      threshold: options?.threshold ?? 0.2, // Trigger when 20% of the section is visible
      ...options,
    });

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
        observedElementsRef.current.set(element, id);
      } else {
        console.warn(`[useIntersectionObserver] Element with ID "${id}" not found.`);
      }
    });

    return () => {
      observerRef.current?.disconnect();
      observedElementsRef.current.clear();
    };
  }, [sectionIds, setActiveId, options]); // Re-run effect if sectionIds or options change

  // This hook doesn't return a ref directly, as it sets up observers internally.
  // The component using this hook will be responsible for ensuring elements with `sectionIds` exist.
};

export default useIntersectionObserver;
