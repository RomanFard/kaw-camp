"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

export default function LiveBackground({
  color = "#6ECB9E",
  particleCount = 60,
  connectionDistance = 150,
  className = "",
  quality = "high",
}: {
  color?: string;
  particleCount?: number;
  connectionDistance?: number;
  className?: string;
  quality?: "high" | "medium" | "low";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
        // ─── تشخیص تم فعلی ───
    let isLight = false;
    function checkTheme() {
      isLight = document.documentElement.classList.contains("light") ||
        !document.documentElement.classList.contains("dark");
    }
    checkTheme();

    // ─── Observer برای تغییر تم ───
    const themeObserver = new MutationObserver(checkTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);
    }

    function initParticles() {
      const count = Math.min(
        particleCount,
        Math.floor((width * height) / 15000)
      );
      particlesRef.current = [];
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // ─── به‌روزرسانی موقعیت ───
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        // جذب به موس — فقط در high
        if (mouse && quality === "high") {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 0) {
            p.x += (dx / dist) * 0.3;
            p.y += (dy / dist) * 0.3;
          }
        }
      }

      // ─── خطوط بین ذرات نزدیک — در high و medium ───
      if (quality === "high" || quality === "medium") {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
              const opacity = (1 - dist / connectionDistance) * 0.4;
              ctx.strokeStyle = hexToRgba(color, opacity);
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // ─── خطوط بین ذرات و موس — فقط در high ───
      if (mouse && quality === "high") {
        for (const p of particles) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const opacity = (1 - dist / 180) * 0.6;
            ctx.strokeStyle = hexToRgba(color, opacity);
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // ─── رسم ذرات ───
      for (const p of particles) {
        // هاله نرم — فقط در high/medium
        if (quality !== "low") {
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.radius * 6
          );
          gradient.addColorStop(0, hexToRgba(color, isLight ? 0.25 : 0.35));
          gradient.addColorStop(1, hexToRgba(color, 0));
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // نقطه مرکزی
            ctx.fillStyle = hexToRgba(color, isLight ? 0.5 : 0.6);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    }

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      // موس فقط در high اهمیت داره
      if (quality !== "high") return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    function handleMouseLeave() {
      mouseRef.current = null;
    }

    resize();
    initParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      initParticles();
    });

    if (quality === "high") {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      themeObserver.disconnect();
    };
  }, [color, particleCount, connectionDistance, quality]);

  return (
    <canvas
      ref={canvasRef}
      className={
        "pointer-events-auto absolute inset-0 h-full w-full " + className
      }
      style={{ display: "block" }}
    />
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
