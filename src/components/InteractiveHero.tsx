'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useParallaxEffect } from '@/hooks/useParallaxEffect';

interface InteractiveHeroProps {
  avatarSrc: string;
  avatarAlt: string;
}

export default function InteractiveHero({ avatarSrc, avatarAlt }: InteractiveHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  
  const {
    containerRef,
    backgroundRef,
    foregroundRef,
    mousePosition
  } = useParallaxEffect({
    backgroundIntensity: 15,
    foregroundIntensity: 30,
    smoothness: 0.08
  });

  // Dynamic background animation using Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Blob animation parameters
    const blobs: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      hue: number;
      alpha: number;
      phase: number;
    }> = [];

    // Initialize blobs with more organic movement
    for (let i = 0; i < 12; i++) {
      blobs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 120 + 60,
        hue: Math.random() * 80 + 180, // Blue to purple range
        alpha: Math.random() * 0.08 + 0.03,
        phase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    // Animation loop
    const animate = () => {
      time += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw blobs
      blobs.forEach((blob, index) => {
        // Organic movement with sine waves
        blob.x += blob.vx + Math.sin(time + blob.phase) * 0.2;
        blob.y += blob.vy + Math.cos(time + blob.phase * 0.7) * 0.2;
        
        // Soft boundary wrapping
        if (blob.x < -blob.radius) blob.x = canvas.width + blob.radius;
        if (blob.x > canvas.width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = canvas.height + blob.radius;
        if (blob.y > canvas.height + blob.radius) blob.y = -blob.radius;
        
        // Create gradient with multiple stops for more organic look
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        
        gradient.addColorStop(0, `hsla(${blob.hue}, 80%, 70%, ${blob.alpha})`);
        gradient.addColorStop(0.3, `hsla(${blob.hue}, 60%, 60%, ${blob.alpha * 0.7})`);
        gradient.addColorStop(0.7, `hsla(${blob.hue}, 40%, 50%, ${blob.alpha * 0.3})`);
        gradient.addColorStop(1, `hsla(${blob.hue}, 20%, 40%, 0)`);
        
        // Draw main blob
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle glow effect
        ctx.shadowColor = `hsl(${blob.hue}, 70%, 60%)`;
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {/* Dynamic Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ background: 'transparent' }}
      />
      
      {/* Avatar Container */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        {/* Background Layer - Full Avatar */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="relative w-full h-full max-w-7xl">
            <Image
              src={avatarSrc}
              alt={avatarAlt}
              fill
              className="object-contain drop-shadow-2xl"
              style={{
                filter: 'contrast(1.15) saturate(1.2) brightness(1.08)',
                borderRadius: '12px',
                imageRendering: 'high-quality',
                WebkitImageRendering: 'high-quality'
              }}
            />
          </div>
        </motion.div>


        {/* Interactive Glow Effect */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 30%, transparent 70%)`,
          }}
        />

        {/* Subtle 3D Border Effect */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            borderRadius: '12px',
            boxShadow: `
              inset 0 0 0 1px rgba(255, 255, 255, 0.1),
              0 0 40px rgba(59, 130, 246, 0.1),
              0 0 80px rgba(147, 51, 234, 0.05)
            `,
          }}
        />
      </div>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full z-0"
          style={{
            left: `${15 + i * 12}%`,
            top: `${25 + i * 8}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}
