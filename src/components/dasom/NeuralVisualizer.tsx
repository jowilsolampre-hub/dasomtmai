import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface NeuralVisualizerProps {
  isActive?: boolean;
  isProcessing?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function NeuralVisualizer({
  isActive = false,
  isProcessing = false,
  size = "md",
  className,
}: NeuralVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const sizeMap = {
    sm: 80,
    md: 150,
    lg: 220,
  };

  const dimension = sizeMap[size];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, dimension, dimension);
      const centerX = dimension / 2;
      const centerY = dimension / 2;
      const maxRadius = dimension / 2 - 10;

      // Background glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius
      );
      gradient.addColorStop(0, isActive ? "rgba(0, 212, 255, 0.15)" : "rgba(0, 212, 255, 0.05)");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, dimension, dimension);

      // Draw waveform bars
      const bars = 20;
      const barWidth = 3;
      const gap = (dimension - bars * barWidth) / (bars + 1);

      for (let i = 0; i < bars; i++) {
        const x = gap + i * (barWidth + gap);
        
        let height: number;
        if (isProcessing) {
          // Active processing animation
          height = Math.abs(Math.sin(time * 0.1 + i * 0.5)) * (maxRadius * 0.8) + 10;
        } else if (isActive) {
          // Idle but active
          height = Math.abs(Math.sin(time * 0.03 + i * 0.3)) * 30 + 5;
        } else {
          // Dormant
          height = 3;
        }

        const y = centerY - height / 2;

        // Create gradient for bars
        const barGradient = ctx.createLinearGradient(x, y, x, y + height);
        const opacity = isProcessing ? 0.9 : isActive ? 0.5 : 0.2;
        barGradient.addColorStop(0, `rgba(0, 212, 255, ${opacity * 0.5})`);
        barGradient.addColorStop(0.5, `rgba(0, 212, 255, ${opacity})`);
        barGradient.addColorStop(1, `rgba(0, 212, 255, ${opacity * 0.5})`);

        ctx.fillStyle = barGradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 1.5);
        ctx.fill();

        // Glow effect
        if (isProcessing) {
          ctx.shadowColor = "rgba(0, 212, 255, 0.8)";
          ctx.shadowBlur = 10;
        }
      }

      ctx.shadowBlur = 0;
      time++;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isProcessing, dimension]);

  return (
    <div className={cn("relative", className)}>
      <canvas
        ref={canvasRef}
        width={dimension}
        height={dimension}
        className="rounded-lg"
      />
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-tech text-primary/80 animate-pulse">
            PROCESSING
          </span>
        </div>
      )}
    </div>
  );
}
