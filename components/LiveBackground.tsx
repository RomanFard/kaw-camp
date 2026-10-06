"use client";

import { useEffect, useRef } from "react";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  phase: number;
  wobble: number;
};

type NightStar = {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  baseAlpha: number;
  amp: number;
  tint: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
};

export default function LiveBackground({
  variant = "sparks",
  color,
  particleCount = 60,
  className = "",
  quality = "high",
  sky = true,
}: {
  variant?: "sparks" | "night";
  color?: string;
  particleCount?: number;
  className?: string;
  quality?: "high" | "medium" | "low";
  sky?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const animationRef = useRef<number>(0);

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

    let width = 0;
    let height = 0;
    let t = 0;

    const sparks: Spark[] = [];
    const nightStars: NightStar[] = [];
    const meteors: Meteor[] = [];
    let nextMeteorAt = 200;
    let milky: HTMLCanvasElement | null = null;
    let skySize = 0;

    const OMEGA = 0.000012;
    const TILT = -0.55;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function hexToRgb(hex: string): [number, number, number] {
      return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ];
    }

    // ═══ sparks ═══
    function spawnSpark(randomAge: boolean): Spark {
      const maxLife = 140 + Math.random() * 200;
      const age = randomAge ? Math.random() * maxLife : 0;
      return {
        x: Math.random() * width,
        y: randomAge ? Math.random() * height : height + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.5 + Math.random() * 1.8),
        size: Math.random() * 1.8 + 0.6,
        life: maxLife - age,
        maxLife,
        phase: Math.random() * Math.PI * 2,
        wobble: 0.02 + Math.random() * 0.04,
      };
    }

    function initSparks() {
      sparks.length = 0;
      const count = Math.max(
        15,
        Math.min(particleCount, Math.floor((width * height) / 9000))
      );
      for (let i = 0; i < count; i++) sparks.push(spawnSpark(true));
    }

    function fireColor(progress: number): [number, number, number] {
      if (progress < 0.35) {
        const k = progress / 0.35;
        return [255, 235 - k * 85, 160 - k * 120];
      }
      const k = (progress - 0.35) / 0.65;
      return [255 - k * 70, 150 - k * 120, 40 - k * 30];
    }

    function drawSparks() {
      const mouse = mouseRef.current;

      ctx.globalCompositeOperation = isLight ? "source-over" : "lighter";

      for (let i = 0; i < sparks.length; i++) {
        const p = sparks[i];
        p.life -= 1;
        const progress = 1 - p.life / p.maxLife;

        p.vx += Math.sin(t * p.wobble + p.phase) * 0.012;
        p.vx *= 0.99;
        p.vy *= 0.998;

        if (mouse && quality === "high") {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            p.vx += (dx / dist) * 0.06;
            p.vy += (dy / dist) * 0.04;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.life <= 0 || p.y < -10 || p.x < -20 || p.x > width + 20) {
          sparks[i] = spawnSpark(false);
          continue;
        }

        const [r, g, b] = color ? hexToRgb(color) : fireColor(progress);
        const flicker = 0.8 + 0.2 * Math.sin(t * 0.3 + p.phase * 5);
        const alpha = Math.max(0, 1 - progress * progress) * flicker;
        const size = p.size * (1 - progress * 0.6);
        const rgba = (a: number) =>
          `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a * (isLight ? 0.9 : 1)})`;

        if (quality !== "low") {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 6);
          glow.addColorStop(0, rgba(alpha * 0.5));
          glow.addColorStop(1, rgba(0));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        if (quality === "high") {
          ctx.strokeStyle = rgba(alpha * 0.6);
          ctx.lineWidth = size * 0.9;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6);
          ctx.stroke();
        }

        ctx.fillStyle = rgba(alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    }

    // ═══ night ═══
    function gauss() {
      return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
    }

    function buildMilkyWay(S: number): HTMLCanvasElement {
      const scale = 0.6;
      const c = document.createElement("canvas");
      c.width = Math.ceil(S * scale);
      c.height = Math.ceil(S * scale);
      const g = c.getContext("2d");
      if (!g) return c;
      g.scale(scale, scale);
      g.translate(S / 2, S / 2);

      const bw = S * 0.16;

      const band = g.createLinearGradient(0, -bw, 0, bw);
      band.addColorStop(0, "rgba(90, 80, 170, 0)");
      band.addColorStop(0.3, "rgba(110, 100, 190, 0.07)");
      band.addColorStop(0.5, "rgba(185, 190, 255, 0.16)");
      band.addColorStop(0.7, "rgba(205, 130, 160, 0.06)");
      band.addColorStop(1, "rgba(0, 0, 0, 0)");
      g.fillStyle = band;
      g.fillRect(-S / 2, -bw, S, bw * 2);

      const tones: [number, number, number][] = [
        [200, 205, 255],
        [170, 160, 230],
        [230, 170, 190],
      ];
      for (let i = 0; i < 90; i++) {
        const bx = (Math.random() - 0.5) * S;
        const by = gauss() * bw * 0.5;
        const br = S * (0.03 + Math.random() * 0.06);
        const [r, gg, b] = tones[Math.floor(Math.random() * tones.length)];
        const a = 0.03 + Math.random() * 0.06;
        const rg = g.createRadialGradient(bx, by, 0, bx, by, br);
        rg.addColorStop(0, `rgba(${r}, ${gg}, ${b}, ${a})`);
        rg.addColorStop(1, `rgba(${r}, ${gg}, ${b}, 0)`);
        g.fillStyle = rg;
        g.fillRect(bx - br, by - br, br * 2, br * 2);
      }

      g.globalCompositeOperation = "destination-out";
      for (let i = 0; i < 26; i++) {
        const bx = (Math.random() - 0.5) * S;
        const by = gauss() * bw * 0.3;
        const br = S * (0.02 + Math.random() * 0.03);
        const rg = g.createRadialGradient(bx, by, 0, bx, by, br);
        rg.addColorStop(0, `rgba(0, 0, 0, ${0.2 + Math.random() * 0.25})`);
        rg.addColorStop(1, "rgba(0, 0, 0, 0)");
        g.fillStyle = rg;
        g.fillRect(bx - br, by - br, br * 2, br * 2);
      }
      g.globalCompositeOperation = "source-over";

      const n = Math.min(4000, Math.floor((S * S) / 700));
      for (let i = 0; i < n; i++) {
        const x = (Math.random() - 0.5) * S;
        const y = gauss() * bw * 0.55;
        const a = 0.12 + Math.random() * 0.5;
        const size = Math.random() < 0.05 ? 1.4 : 0.6 + Math.random() * 0.5;
        g.fillStyle = `rgba(235, 240, 255, ${a})`;
        g.fillRect(x, y, size, size);
      }
      return c;
    }

    function initNight() {
      nightStars.length = 0;
      const R = Math.hypot(width, height) / 2;
      skySize = Math.ceil(R * 2);
      const discArea = Math.PI * R * R;
      const factor = quality === "low" ? 0.5 : 1;
      const count = Math.floor(
        Math.min(particleCount * 14, discArea / 2000) * factor
      );

      for (let i = 0; i < count; i++) {
        const d = R * Math.sqrt(Math.random());
        const a = Math.random() * Math.PI * 2;
        const mag = Math.pow(Math.random(), 5);
        const pick = Math.random();
        nightStars.push({
          x: Math.cos(a) * d,
          y: Math.sin(a) * d,
          radius: 0.25 + mag * 2.0,
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.06,
          baseAlpha: Math.min(1, 0.25 + mag * 0.75 + Math.random() * 0.2),
          amp: 0.5 + Math.random() * 0.5,
          tint: pick < 0.2 ? 0 : pick < 0.65 ? 1 : pick < 0.88 ? 2 : 3,
        });
      }

      milky = quality === "low" ? null : buildMilkyWay(skySize);
    }

    function starRgb(tint: number, darkSky: boolean): [number, number, number] {
      if (color) return hexToRgb(color);
      if (!darkSky) return [30, 41, 90];
      if (tint === 0) return [175, 198, 255];
      if (tint === 2) return [255, 236, 196];
      if (tint === 3) return [255, 204, 160];
      return [255, 252, 248];
    }

    function spawnMeteor() {
      const maxLife = 40 + Math.random() * 25;
      const speed = 9 + Math.random() * 6;
      const angle = Math.PI / 6 + Math.random() * 0.4;
      meteors.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.35,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        length: 90 + Math.random() * 90,
      });
    }

    function drawNight() {
      const darkSky = sky || !isLight;
      const mouse = mouseRef.current;
      const cx = width / 2;
      const cy = height / 2;
      const px = mouse && quality === "high" ? -(mouse.x - cx) * 0.012 : 0;
      const py = mouse && quality === "high" ? -(mouse.y - cy) * 0.012 : 0;
      const angle = t * OMEGA;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      if (sky) {
        const bg = ctx.createLinearGradient(0, 0, 0, height);
        bg.addColorStop(0, "#01020a");
        bg.addColorStop(0.6, "#050a20");
        bg.addColorStop(1, "#0d1633");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        if (quality !== "low") {
          const hz = ctx.createRadialGradient(
            cx, height * 1.05, 0, cx, height * 1.05, height * 0.7
          );
          hz.addColorStop(0, "rgba(70, 90, 160, 0.28)");
          hz.addColorStop(1, "rgba(70, 90, 160, 0)");
          ctx.fillStyle = hz;
          ctx.fillRect(0, 0, width, height);
        }
      }

      const m = milky;
      if (m && darkSky) {
        ctx.save();
        ctx.translate(cx + px * 0.3, cy + py * 0.3);
        ctx.rotate(TILT + angle);
        ctx.drawImage(m, -skySize / 2, -skySize / 2, skySize, skySize);
        ctx.restore();
      }

      const k = darkSky ? 1 : 0.8;
      for (const s of nightStars) {
        const par = 0.4 + s.radius * 0.3;
        const wx = cx + s.x * cos - s.y * sin + px * par;
        const wy = cy + s.x * sin + s.y * cos + py * par;
        if (wx < -20 || wx > width + 20 || wy < -20 || wy > height + 20) continue;

        const tw =
          1 +
          Math.sin(t * s.speed + s.phase) * 0.25 * s.amp +
          Math.sin(t * s.speed * 2.7 + s.phase * 1.3) * 0.1 * s.amp;
        const alpha = Math.max(0, Math.min(1, s.baseAlpha * tw)) * k;
        const [r, g, b] = starRgb(s.tint, darkSky);

        if (quality !== "low" && s.radius > 0.9) {
          const gr = s.radius * 6;
          const glow = ctx.createRadialGradient(wx, wy, 0, wx, wy, gr);
          glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.35})`);
          glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = glow;
          ctx.fillRect(wx - gr, wy - gr, gr * 2, gr * 2);
        }

        if (quality === "high" && s.radius > 1.7) {
          const L = s.radius * 9;
          const hg = ctx.createLinearGradient(wx - L, wy, wx + L, wy);
          hg.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
          hg.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.55})`);
          hg.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = hg;
          ctx.fillRect(wx - L, wy - 0.4, L * 2, 0.8);

          const vg = ctx.createLinearGradient(wx, wy - L, wx, wy + L);
          vg.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
          vg.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.55})`);
          vg.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = vg;
          ctx.fillRect(wx - 0.4, wy - L, 0.8, L * 2);
        }

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        if (s.radius < 0.6) {
          const sz = s.radius * 1.8;
          ctx.fillRect(wx - sz / 2, wy - sz / 2, sz, sz);
        } else {
          ctx.beginPath();
          ctx.arc(wx, wy, s.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (quality !== "low") {
        if (t >= nextMeteorAt) {
          spawnMeteor();
          nextMeteorAt = t + 240 + Math.random() * 420;
        }
        for (let i = meteors.length - 1; i >= 0; i--) {
          const mt = meteors[i];
          mt.x += mt.vx;
          mt.y += mt.vy;
          mt.life -= 1;
          if (mt.life <= 0) {
            meteors.splice(i, 1);
            continue;
          }
          const a = Math.sin((mt.life / mt.maxLife) * Math.PI);
          const sp = Math.sqrt(mt.vx * mt.vx + mt.vy * mt.vy);
          const tx = mt.x - (mt.vx / sp) * mt.length;
          const ty = mt.y - (mt.vy / sp) * mt.length;
          const [r, g, b] = darkSky ? [255, 255, 255] : [30, 41, 90];
          const grad = ctx.createLinearGradient(mt.x, mt.y, tx, ty);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
          grad.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${a * 0.35})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(mt.x, mt.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();

          const head = ctx.createRadialGradient(mt.x, mt.y, 0, mt.x, mt.y, 6);
          head.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
          head.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = head;
          ctx.fillRect(mt.x - 6, mt.y - 6, 12, 12);
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      t += 1;
      if (variant === "night") drawNight();
      else drawSparks();
      animationRef.current = requestAnimationFrame(draw);
    }

    function setup() {
      resize();
      if (variant === "night") initNight();
      else initSparks();
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
  }, [variant, color, particleCount, quality, sky]);

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