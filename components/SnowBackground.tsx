"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  z: number;
  r: number;
  vy: number;
  phase: number;
  swaySpeed: number;
  swayAmp: number;
  alpha: number;
};

export default function SnowBackground({
  color,
  particleCount = 120,
  className = "",
  quality = "high",
  windStrength = 1,
}: {
  color?: string;
  particleCount?: number;
  className?: string;
  quality?: "high" | "medium" | "low";
  windStrength?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctxEl = canvasEl.getContext("2d");
    if (!ctxEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    let isLight = false;
    function checkTheme() {
      isLight =
        document.documentElement.classList.contains("light") ||
        !document.documentElement.classList.contains("dark");
    }
    checkTheme();
    const themeObserver = new MutationObserver(checkTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    function hexToRgb(hex: string): [number, number, number] {
      return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ];
    }

    function makeSprite(rgb: [number, number, number]): HTMLCanvasElement {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const g = c.getContext("2d");
      if (g) {
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`);
        grad.addColorStop(0.35, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.75)`);
        grad.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
      }
      return c;
    }

    const spriteDark = makeSprite(color ? hexToRgb(color) : [255, 255, 255]);
    const spriteLight = makeSprite(color ? hexToRgb(color) : [120, 150, 200]);

    let width = 0;
    let height = 0;
    let t = 0;
    const flakes: Flake[] = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeFlake(randomY: boolean): Flake {
      const z = Math.pow(Math.random(), 1.6);
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -10 - Math.random() * 30,
        z,
        r: 1 + z * z * 4.5,
        vy: 0.35 + z * 1.3 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.02,
        swayAmp: 0.3 + z * 0.9,
        alpha: 0.35 + z * 0.5,
      };
    }

    function init() {
      flakes.length = 0;
      const factor = quality === "low" ? 0.5 : 1;
      const count = Math.floor(
        Math.min(particleCount * 3, (width * height) / 5000) * factor
      );
      for (let i = 0; i < count; i++) flakes.push(makeFlake(true));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      t += 1;

      const wind =
        (Math.sin(t * 0.002) * 0.6 + Math.sin(t * 0.0071 + 1.3) * 0.3) *
        windStrength;
      const mouse = mouseRef.current;
      const sprite = isLight ? spriteLight : spriteDark;
      const boost = isLight ? 1.25 : 1;

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];

        f.y += f.vy;
        f.x +=
          wind * (0.4 + f.z) +
          Math.sin(t * f.swaySpeed + f.phase) * f.swayAmp * 0.5;

        if (mouse && quality === "high") {
          const dx = f.x - mouse.x;
          const dy = f.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110 && dist > 0) {
            const push = (1 - dist / 110) * 2.2;
            f.x += (dx / dist) * push;
            f.y += (dy / dist) * push * 0.5;
          }
        }

        if (f.y > height + 12) {
          flakes[i] = makeFlake(false);
          continue;
        }
        if (f.x < -12) f.x = width + 10;
        else if (f.x > width + 12) f.x = -10;

        const a = Math.min(1, f.alpha * boost);
        ctx.globalAlpha = a;

        if (quality === "low") {
          ctx.fillStyle = isLight
            ? "rgba(120,150,200,1)"
            : "rgba(255,255,255,1)";
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const size = f.r * (f.z > 0.8 ? 5 : 3.2);
          if (f.z > 0.8) ctx.globalAlpha = a * 0.7;
          ctx.drawImage(sprite, f.x - size / 2, f.y - size / 2, size, size);
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    }

    function setup() {
      resize();
      init();
    }

    function handleResize() {
      setup();
    }

    function handleMouseMove(e: MouseEvent) {
      if (quality !== "high") return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function handleMouseLeave() {
      mouseRef.current = null;
    }

    setup();
    draw();

    window.addEventListener("resize", handleResize);
    if (quality === "high") {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      themeObserver.disconnect();
    };
  }, [color, particleCount, quality, windStrength]);

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