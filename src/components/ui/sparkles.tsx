"use client";
import React, { useId } from "react";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};
export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  
  const controls = useAnimation();
  const generatedId = useId();

  // Simplified CSS-based sparkles animation instead of heavy TSParticles
  React.useEffect(() => {
    controls.start({
      opacity: 1,
      transition: {
        duration: 1,
      },
    });
  }, [controls]);

  return (
    <motion.div 
      animate={controls} 
      className={cn("opacity-0 h-full w-full relative overflow-hidden", className)}
      style={{ backgroundColor: background || "#0d47a1" }}
    >
      {/* CSS-based sparkles animation */}
      <div className="absolute inset-0">
        {Array.from({ length: particleDensity || 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: particleColor || "#ffffff",
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: (speed || 2) + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
