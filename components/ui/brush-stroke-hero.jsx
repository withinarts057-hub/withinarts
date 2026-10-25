"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Realistic paint drips fall from top, then eraser wipes clean.

const COLORS = [
  { r:212, g:35,  b:20  },
  { r:15,  g:80,  b:190 },
  { r:222, g:165, b:10  },
  { r:30,  g:140, b:60  },
  { r:150, g:35,  b:170 },
  { r:200, g:95,  b:15  },
  { r:18,  g:150, b:180 },
  { r:200, g:20,  b:85  },
  { r:70,  g:130, b:35  },
  { r:230, g:65,  b:30  },
];

const PR = 250, PG = 246, PB = 238; // paper color

function seededRand(seed) {
  var s = seed;
  return function(a, b) {
    s = (s * 16807) % 2147483647;
    var v = s / 2147483647;
    return a + v * (b - a);
  };
}

function easeOut3(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOut3(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
function clamp(v,a,b) { return Math.max(a, Math.min(b, v)); }

function genDrips(w, h) {
  var count = clamp(Math.floor(w / 115), 7, 13);
  var drips = [];
  for (var i = 0; i < count; i++) {
    var rand = seededRand(i * 8191 + 54321);
    var col = COLORS[i % COLORS.length];
    var bw = rand(22, 60);
    // Generate 2-3 secondary micro-drip positions offset from main
    var microDrips = [];
    var mc = Math.floor(rand(0, 3));
    for (var m = 0; m < mc; m++) {
      microDrips.push({
        ox: rand(-bw * 1.2, bw * 1.2),
        width: rand(5, 12),
        length: rand(0.2, 0.6),
        delay: rand(0.05, 0.25),
      });
    }
    drips.push({
      x:         rand(0.05, 0.95) * w,
      width:     bw,
      color:     col,
      delay:     rand(0, 0.50),
      length:    rand(0.50, 0.98),
      wobble:    rand(-12, 12),
      thickness: rand(0.55, 0.78),
      microDrips: microDrips,
    });
  }
  return drips;
}

// Draw one realistic paint drip as a filled path with 3D shading.
function drawDrip(ctx, drip, tipY, h) {
  if (tipY <= 1) return;
  var x = drip.x;
  var bw = drip.width;
  var col = drip.color;
  var wob = drip.wobble;
  var maxY = h * drip.length;
  var ty = Math.min(tipY, maxY);
  var splatted = ty >= maxY * 0.96;
  var cr = col.r, cg = col.g, cb = col.b;

  ctx.save();

  // === DRAW DRIP AS FILLED OUTLINE PATH ===
  // Shape: wide pool at top --> narrow stream --> teardrop/splat at bottom
  var tw = bw * drip.thickness;   // half-width at top (pool)
  var sw = Math.max(3, bw * 0.13); // stream half-width (narrow)
  var blobR = splatted ? bw * 1.1 : bw * 0.62; // tip blob radius
  var neckY = Math.min(ty * 0.25, 40);  // how far down the pool tapers
  var streamBase = ty - blobR * (splatted ? 0.4 : 0.7);

  // Horizontal wobble offset at stream mid-point
  var midX = x + wob * 0.5;

  ctx.beginPath();
  // --- Left side going down ---
  ctx.moveTo(x - tw, 0);
  ctx.quadraticCurveTo(x - sw, neckY, midX - sw, streamBase);

  if (splatted) {
    // Flat splat: spread wide at bottom
    ctx.quadraticCurveTo(midX - sw * 0.5, maxY - 4, x - blobR * 2.4, maxY);
    ctx.quadraticCurveTo(x, maxY + blobR * 0.35, x + blobR * 2.4, maxY);
    ctx.quadraticCurveTo(midX + sw * 0.5, maxY - 4, midX + sw, streamBase);
  } else {
    // Teardrop tip
    var bx = x + wob * 0.4;
    var by = ty;
    ctx.quadraticCurveTo(midX - sw, by - blobR * 0.5, bx - blobR * 0.85, by);
    ctx.arc(bx, by, blobR, Math.PI, 0, false);
    ctx.quadraticCurveTo(midX + sw, by - blobR * 0.5, midX + sw, streamBase);
  }

  // --- Right side going up ---
  ctx.quadraticCurveTo(x + sw, neckY, x + tw, 0);
  ctx.closePath();

  // Fill with a horizontal gradient to simulate 3D roundness
  var xGrad = ctx.createLinearGradient(x - tw, 0, x + tw, 0);
  var dark  = "rgba(" + Math.max(0,cr-45) + "," + Math.max(0,cg-45) + "," + Math.max(0,cb-45) + ",0.92)";
  var mid   = "rgba(" + cr + "," + cg + "," + cb + ",0.97)";
  var light = "rgba(" + Math.min(255,cr+50) + "," + Math.min(255,cg+50) + "," + Math.min(255,cb+50) + ",0.96)";
  xGrad.addColorStop(0,    dark);
  xGrad.addColorStop(0.22, mid);
  xGrad.addColorStop(0.46, light);
  xGrad.addColorStop(0.72, mid);
  xGrad.addColorStop(1,    dark);
  ctx.fillStyle = xGrad;
  ctx.fill();

  // === SPECULAR HIGHLIGHT (gloss) ===
  ctx.save();
  ctx.clip(); // clip to drip shape
  // Re-draw path for clip -- just fill a semi-transparent white elongated oval
  var hlGrad = ctx.createRadialGradient(
    x - sw * 0.6, ty * 0.18, 0,
    x - sw * 0.6, ty * 0.18, tw * 0.8
  );
  hlGrad.addColorStop(0,   "rgba(255,255,255,0.52)");
  hlGrad.addColorStop(0.4, "rgba(255,255,255,0.12)");
  hlGrad.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = hlGrad;
  ctx.fillRect(x - tw, 0, tw * 2, ty + blobR);
  ctx.restore();

  // === SPLAT SECONDARY DROPS ===
  if (splatted) {
    ctx.fillStyle = "rgba(" + cr + "," + cg + "," + cb + ",0.82)";
    var splatRand = seededRand(cr * 31 + cg * 17 + cb * 7 + Math.floor(x));
    for (var s = 0; s < 9; s++) {
      var ang = splatRand(-0.2, 1.2) * Math.PI;
      var dist = blobR * splatRand(1.4, 3.0);
      var sr = splatRand(1.5, Math.max(2.5, bw * 0.08));
      ctx.beginPath();
      ctx.ellipse(
        x + Math.cos(ang) * dist,
        maxY + Math.sin(ang) * dist * 0.28,
        sr, sr * 0.55, ang, 0, Math.PI * 2
      );
      ctx.fill();
    }
  }

  ctx.restore();

  // === MICRO-DRIPS (secondary thin streams) ===
  drip.microDrips.forEach(function(md) {
    var mdTipY = ty * md.length;
    if (mdTipY < 4) return;
    var mdX = x + md.ox;
    var mdW = md.width;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(mdX - mdW * 0.5, 0);
    ctx.quadraticCurveTo(mdX, mdTipY * 0.5, mdX - mdW * 0.25, mdTipY - mdW * 0.4);
    ctx.arc(mdX, mdTipY, mdW * 0.45, Math.PI, 0, false);
    ctx.quadraticCurveTo(mdX, mdTipY * 0.5, mdX + mdW * 0.5, 0);
    ctx.closePath();
    ctx.fillStyle = "rgba(" + cr + "," + cg + "," + cb + ",0.80)";
    ctx.fill();
    ctx.restore();
  });
}

// Particle system for eraser dust
var dustParticles = [];
var lastLeadX = 0;

function spawnDust(leadX, h, now) {
  if (leadX - lastLeadX < 3) return;
  lastLeadX = leadX;
  var count = Math.floor(Math.random() * 4) + 2;
  for (var i = 0; i < count; i++) {
    dustParticles.push({
      x:    leadX + Math.random() * 12 - 4,
      y:    h * 0.06 + Math.random() * h * 0.88,
      vx:   Math.random() * 2.5 + 0.5,
      vy:   Math.random() * 1.5 - 0.3,
      r:    Math.random() * 3.5 + 1,
      life: 1.0,
      decay: Math.random() * 0.018 + 0.008,
    });
  }
  // trim old
  if (dustParticles.length > 260) dustParticles.splice(0, 60);
}

function updateDust(dt) {
  dustParticles = dustParticles.filter(function(d) {
    d.x  += d.vx * dt * 0.05;
    d.y  += d.vy * dt * 0.05 + 0.12;
    d.vy += 0.08;
    d.life -= d.decay * dt * 0.05;
    return d.life > 0;
  });
}

function drawDustParticles(ctx) {
  dustParticles.forEach(function(d) {
    ctx.save();
    ctx.globalAlpha = d.life * 0.55;
    ctx.fillStyle = "rgba(200,185,170,1)";
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawEraser(ctx, leadX, w, h, eraseElapsed, dt) {
  // Clear erased region with paper color
  if (leadX > 0) {
    ctx.save();
    ctx.fillStyle = "rgb(" + PR + "," + PG + "," + PB + ")";
    ctx.fillRect(0, 0, Math.min(leadX - 2, w), h);
    ctx.restore();
  }

  // Spawn + update dust
  if (leadX > 10 && leadX < w + 50) spawnDust(leadX, h, eraseElapsed);
  updateDust(dt);
  drawDustParticles(ctx);

  if (leadX <= 0 || leadX > w + 180) return;

  // Smear zone: just ahead of eraser, paint is blurred/smeared
  var smearW = 18;
  if (leadX < w) {
    ctx.save();
    ctx.fillStyle = "rgba(" + PR + "," + PG + "," + PB + ",0.35)";
    ctx.fillRect(leadX - 2, 0, smearW, h);
    ctx.restore();
  }

  var eW = Math.min(100, w * 0.11);
  var eH = h * 0.86;
  var eX = leadX - eW;
  var eY = h * 0.07;

  // Slight vertical oscillation to simulate hand movement
  var oscY = Math.sin(eraseElapsed * 0.006) * 4;
  eY += oscY;

  ctx.save();

  // Drop shadow
  ctx.shadowColor = "rgba(0,0,0,0.32)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 7;
  ctx.shadowOffsetY = 3;

  // Main body gradient -- horizontal (3D look)
  var bodyG = ctx.createLinearGradient(eX, 0, eX + eW, 0);
  bodyG.addColorStop(0,    "#c97a86");
  bodyG.addColorStop(0.08, "#e8969f");
  bodyG.addColorStop(0.35, "#f5bec6");
  bodyG.addColorStop(0.55, "#f9cdd4");
  bodyG.addColorStop(0.78, "#eeaab3");
  bodyG.addColorStop(0.92, "#d98890");
  bodyG.addColorStop(1,    "#c07480");
  ctx.fillStyle = bodyG;
  ctx.beginPath();
  ctx.roundRect(eX, eY, eW, eH, 8);
  ctx.fill();

  ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

  // Vertical stripes for texture
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = "#9a4050";
  for (var i = 0; i < 6; i++) {
    ctx.fillRect(eX + eW * (0.08 + i * 0.155), eY, eW * 0.055, eH);
  }

  // Label band in the middle
  ctx.globalAlpha = 1;
  var labelG = ctx.createLinearGradient(eX, 0, eX + eW, 0);
  labelG.addColorStop(0,   "rgba(0,0,0,0)");
  labelG.addColorStop(0.1, "rgba(255,235,238,0.55)");
  labelG.addColorStop(0.5, "rgba(255,245,248,0.65)");
  labelG.addColorStop(0.9, "rgba(255,235,238,0.55)");
  labelG.addColorStop(1,   "rgba(0,0,0,0)");
  ctx.fillStyle = labelG;
  ctx.beginPath();
  ctx.roundRect(eX, eY + eH * 0.30, eW, eH * 0.40, 0);
  ctx.fill();

  // Top specular highlight (gloss)
  var gloss = ctx.createLinearGradient(eX, eY, eX, eY + eH * 0.28);
  gloss.addColorStop(0,   "rgba(255,255,255,0.40)");
  gloss.addColorStop(0.5, "rgba(255,255,255,0.10)");
  gloss.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = gloss;
  ctx.beginPath();
  ctx.roundRect(eX + 2, eY, eW - 4, eH * 0.28, [8,8,0,0]);
  ctx.fill();

  // Metal binding strips (top and bottom)
  ctx.globalAlpha = 1;
  var metalG = ctx.createLinearGradient(eX, 0, eX + eW, 0);
  metalG.addColorStop(0,   "#8a8a8a");
  metalG.addColorStop(0.3, "#d8d8d8");
  metalG.addColorStop(0.6, "#efefef");
  metalG.addColorStop(1,   "#999");
  ctx.fillStyle = metalG;
  ctx.fillRect(eX, eY, eW, Math.max(5, h * 0.016));
  ctx.fillRect(eX, eY + eH - Math.max(5, h * 0.016), eW, Math.max(5, h * 0.016));

  // Leading edge rubber contact zone (slightly darker strip where rubber touches surface)
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "#c06878";
  ctx.fillRect(leadX - 5, eY, 5, eH);

  ctx.restore();
}

export function BrushStrokeHero({ className, children }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let frame   = null;
    let lastNow = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w   = canvas.clientWidth  || window.innerWidth;
      const h   = canvas.clientHeight || window.innerHeight;
      canvas.width  = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Reset dust on resize
      dustParticles.length = 0;
      lastLeadX = 0;
      stateRef.current = { drips: genDrips(w, h), w, h };
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const DRIP_PHASE  = 3400;
    const HOLD_PHASE  = 1000;
    const ERASE_PHASE = 2200;
    const CLEAN_HOLD  = 600;
    const TOTAL       = DRIP_PHASE + HOLD_PHASE + ERASE_PHASE + CLEAN_HOLD;

    const startTime = performance.now();

    const render = (now) => {
      if (!running) return;
      const dt = now - lastNow;
      lastNow = now;
      const state = stateRef.current;
      if (!state) { frame = requestAnimationFrame(render); return; }

      const { drips, w, h } = state;
      const elapsed = (now - startTime) % TOTAL;

      ctx.clearRect(0, 0, w, h);

      if (elapsed < DRIP_PHASE + HOLD_PHASE) {
        // Phase 1+2: Drips falling
        const dripT = Math.min(elapsed / DRIP_PHASE, 1);
        drips.forEach((drip) => {
          const localT = Math.max(0, (dripT - drip.delay) / (1 - drip.delay + 0.001));
          const p = easeOut3(Math.min(localT, 1));
          drawDrip(ctx, drip, p * h * drip.length, h);
        });
      } else if (elapsed < DRIP_PHASE + HOLD_PHASE + ERASE_PHASE) {
        // Phase 3: Eraser sweeps
        const eraseEl = elapsed - DRIP_PHASE - HOLD_PHASE;
        const easedT  = easeInOut3(eraseEl / ERASE_PHASE);
        drips.forEach((drip) => drawDrip(ctx, drip, h * drip.length, h));
        drawEraser(ctx, easedT * (w + 140), w, h, eraseEl, dt);
      } else {
        // Phase 4: blank / update remaining dust
        updateDust(dt);
        drawDustParticles(ctx);
        dustParticles.length = 0; // clear for next cycle
        lastLeadX = 0;
      }

      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={cn("relative h-full min-h-80 w-full overflow-hidden", className)}>
      {/* Warm paper background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg,#faf6ee 0%,#f0e8d8 35%,#f7f2ea 65%,#ede5d5 100%)" }}
      />
      {/* Paper grain */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      {/* Canvas weave */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px),repeating-linear-gradient(90deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)`,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" />
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.06) 100%)" }}
      />
      {children ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}
