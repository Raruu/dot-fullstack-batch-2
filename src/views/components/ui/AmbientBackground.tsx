"use client";
import { cn } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Orb {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  color: string;
  maxAlpha: number;
}

interface AmbientBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const AmbientBackground = ({
  children,
  className = "",
}: AmbientBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (isDarkMode: boolean) => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = isDarkMode ? "#06060a" : "#f8fafc";
      ctx.fillRect(0, 0, w, h);

      const orbs: Orb[] = isDarkMode
        ? [
            {
              x: 0.04,
              y: 0.92,
              radiusX: 0.65,
              radiusY: 0.58,
              color: "rgba(0, 120, 160, ",
              maxAlpha: 0.42,
            },
            {
              x: 0.97,
              y: 0.06,
              radiusX: 0.65,
              radiusY: 0.58,
              color: "rgba(80, 120, 120, ",
              maxAlpha: 0.58,
            },
            {
              x: 0.46,
              y: 0.54,
              radiusX: 0.6,
              radiusY: 0.52,
              color: "rgba(0, 120, 160, ",
              maxAlpha: 0.28,
            },
          ]
        : [
            {
              x: 0.06,
              y: 0.9,
              radiusX: 0.62,
              radiusY: 0.56,
              color: "rgba(14, 165, 233, ",
              maxAlpha: 0.22,
            },
            {
              x: 0.95,
              y: 0.08,
              radiusX: 0.62,
              radiusY: 0.56,
              color: "rgba(36, 72, 153, ",
              maxAlpha: 0.2,
            },
            {
              x: 0.46,
              y: 0.54,
              radiusX: 0.58,
              radiusY: 0.5,
              color: "rgba(14, 165, 233, ",
              maxAlpha: 0.16,
            },
          ];

      orbs.forEach((orb) => {
        const cx = orb.x * w;
        const cy = orb.y * h;

        const passes = [
          { scale: 1.0, alpha: orb.maxAlpha },
          { scale: 1.6, alpha: orb.maxAlpha * 0.4 },
          { scale: 2.4, alpha: orb.maxAlpha * 0.16 },
        ];

        passes.forEach(({ scale, alpha }) => {
          const rx = orb.radiusX * w * scale;
          const ry = orb.radiusY * h * scale;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(1, ry / rx);

          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
          grad.addColorStop(0, orb.color + alpha + ")");
          grad.addColorStop(0.28, orb.color + alpha * 0.5 + ")");
          grad.addColorStop(0.6, orb.color + alpha * 0.15 + ")");
          grad.addColorStop(0.82, orb.color + alpha * 0.04 + ")");
          grad.addColorStop(1, orb.color + "0)");

          ctx.globalCompositeOperation = isDarkMode ? "screen" : "multiply";
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, rx, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      });

      // Vignette
      const vignette = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        0,
        w * 0.5,
        h * 0.5,
        h * 1.1,
      );
      if (isDarkMode) {
        vignette.addColorStop(0, "rgba(0,0,0,0.18)");
        vignette.addColorStop(0.42, "rgba(0,0,0,0.48)");
        vignette.addColorStop(0.72, "rgba(0,0,0,0.76)");
        vignette.addColorStop(1, "rgba(0,0,0,0.94)");
      } else {
        vignette.addColorStop(0, "rgba(255,255,255,0.02)");
        vignette.addColorStop(0.42, "rgba(255,255,255,0.08)");
        vignette.addColorStop(0.72, "rgba(15,23,42,0.08)");
        vignette.addColorStop(1, "rgba(15,23,42,0.14)");
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    };

    const getIsDarkMode = () =>
      document.documentElement.classList.contains("dark");

    const redraw = () => draw(getIsDarkMode());

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      redraw();
    };

    const observer = new MutationObserver(() => {
      redraw();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-screen bg-background overflow-hidden",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0.1, scale: 2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.2,
        }}
        className="absolute inset-0 w-full h-full block"
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </motion.div>

      <div className="relative z-10">{children}</div>
    </div>
  );
};
