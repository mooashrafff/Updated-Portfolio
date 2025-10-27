'use client';

import { useEffect, useState, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

interface ParallaxOptions {
  backgroundIntensity?: number;
  foregroundIntensity?: number;
  smoothness?: number;
}

export function useParallaxEffect(options: ParallaxOptions = {}) {
  const {
    backgroundIntensity = 20,
    foregroundIntensity = 40,
    smoothness = 0.1
  } = options;

  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [smoothedPosition, setSmoothedPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Smooth the mouse position for more natural movement
  useEffect(() => {
    const smoothPosition = () => {
      setSmoothedPosition(prev => ({
        x: prev.x + (mousePosition.x - prev.x) * smoothness,
        y: prev.y + (mousePosition.y - prev.y) * smoothness
      }));
    };

    const interval = setInterval(smoothPosition, 16); // ~60fps
    return () => clearInterval(interval);
  }, [mousePosition, smoothness]);

  // Apply transforms to layers
  useEffect(() => {
    if (backgroundRef.current) {
      const bgX = smoothedPosition.x * backgroundIntensity;
      const bgY = smoothedPosition.y * backgroundIntensity;
      backgroundRef.current.style.transform = `translate3d(${bgX}px, ${bgY}px, 0)`;
    }

    if (foregroundRef.current) {
      const fgX = smoothedPosition.x * foregroundIntensity;
      const fgY = smoothedPosition.y * foregroundIntensity;
      foregroundRef.current.style.transform = `translate3d(${fgX}px, ${fgY}px, 0)`;
    }
  }, [smoothedPosition, backgroundIntensity, foregroundIntensity]);

  return {
    containerRef,
    backgroundRef,
    foregroundRef,
    mousePosition: smoothedPosition
  };
}
