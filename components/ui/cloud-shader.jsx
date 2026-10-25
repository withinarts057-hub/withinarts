"use client";
import React from "react";
import { cn } from "@/lib/utils";

/*
 * Pure CSS Cloud Animation — no WebGL, works everywhere.
 *
 * Multiple cloud layers drift horizontally at different speeds.
 * Each cloud is built from overlapping CSS circles (pseudo-elements)
 * over a sky gradient background. Fully GPU-accelerated via
 * CSS transforms & will-change.
 */

const cloudStyles = `
/* ── Sky gradient base ── */
.cloud-sky {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* ── Individual cloud shape ── */
.cloud {
  position: absolute;
  background: var(--cloud-color, #ffffff);
  border-radius: 9999px;
  will-change: transform;
  filter: blur(0.5px);
}

.cloud::before,
.cloud::after {
  content: "";
  position: absolute;
  background: inherit;
  border-radius: inherit;
}

/* Cloud variant 1 — big puffy */
.cloud--v1 {
  width: 280px;
  height: 70px;
}
.cloud--v1::before {
  width: 120px;
  height: 120px;
  top: -60px;
  left: 50px;
}
.cloud--v1::after {
  width: 160px;
  height: 100px;
  top: -50px;
  left: 110px;
}

/* Cloud variant 2 — wide flat */
.cloud--v2 {
  width: 220px;
  height: 52px;
}
.cloud--v2::before {
  width: 90px;
  height: 90px;
  top: -48px;
  left: 30px;
}
.cloud--v2::after {
  width: 120px;
  height: 76px;
  top: -38px;
  left: 90px;
}

/* Cloud variant 3 — small puff */
.cloud--v3 {
  width: 160px;
  height: 44px;
}
.cloud--v3::before {
  width: 70px;
  height: 70px;
  top: -38px;
  left: 20px;
}
.cloud--v3::after {
  width: 96px;
  height: 62px;
  top: -30px;
  left: 60px;
}

/* Cloud variant 4 — tiny wisp */
.cloud--v4 {
  width: 120px;
  height: 34px;
}
.cloud--v4::before {
  width: 54px;
  height: 54px;
  top: -28px;
  left: 16px;
}
.cloud--v4::after {
  width: 72px;
  height: 48px;
  top: -22px;
  left: 44px;
}

/* Cloud variant 5 — tall towering */
.cloud--v5 {
  width: 240px;
  height: 60px;
}
.cloud--v5::before {
  width: 110px;
  height: 130px;
  top: -80px;
  left: 40px;
}
.cloud--v5::after {
  width: 130px;
  height: 90px;
  top: -48px;
  left: 100px;
}

/* ── Drift animation ── */
@keyframes drift {
  from {
    transform: translateX(var(--start-x));
  }
  to {
    transform: translateX(var(--end-x));
  }
}

.cloud--animate {
  animation: drift var(--duration) linear infinite;
  opacity: var(--cloud-opacity, 0.92);
}

/* ── Responsive scaling ── */
@media (max-width: 768px) {
  .cloud--v1 { transform: scale(0.55); }
  .cloud--v2 { transform: scale(0.5); }
  .cloud--v3 { transform: scale(0.5); }
  .cloud--v4 { transform: scale(0.45); }
  .cloud--v5 { transform: scale(0.5); }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .cloud--v1 { transform: scale(0.75); }
  .cloud--v2 { transform: scale(0.7); }
  .cloud--v5 { transform: scale(0.7); }
}
`;

/*
 * Cloud configuration: each layer defines a cloud's variant,
 * vertical position, speed, opacity, and z-index.
 * Clouds start off-screen right and drift to off-screen left.
 */
const CLOUD_LAYERS = [
  // Far layer (high, slow, translucent)
  { variant: 4, top: "8%",  duration: "120s", opacity: 0.45, delay: "0s",   z: 1 },
  { variant: 3, top: "14%", duration: "100s", opacity: 0.5,  delay: "-40s", z: 1 },
  // Mid layer
  { variant: 2, top: "24%", duration: "80s",  opacity: 0.7,  delay: "-15s", z: 2 },
  { variant: 5, top: "30%", duration: "90s",  opacity: 0.65, delay: "-55s", z: 2 },
  // Near layer (low, fast, opaque)
  { variant: 1, top: "42%", duration: "60s",  opacity: 0.88, delay: "-25s", z: 3 },
  { variant: 2, top: "55%", duration: "70s",  opacity: 0.82, delay: "-50s", z: 3 },
];

export const CloudShader = ({
  className,
  children,
  speed = 1,
  count = 6,
  cloudColor = "#fbf8f2",
  skyTopColor = "#3876ba",
  skyBottomColor = "#8cbfe8",
}) => {
  const visibleLayers = CLOUD_LAYERS.slice(0, Math.min(count, CLOUD_LAYERS.length));

  // Adjust duration by speed factor
  const adjustDuration = (dur) => {
    const seconds = parseFloat(dur);
    return `${Math.round(seconds / speed)}s`;
  };

  return (
    <div
      className={cn("relative h-full min-h-80 w-full overflow-hidden", className)}
      style={{
        background: `linear-gradient(to bottom, ${skyTopColor}, ${skyBottomColor})`,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: cloudStyles }} />

      {/* Sun glow */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          right: "15%",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,248,220,0.45) 0%, rgba(255,248,220,0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Cirrus wisps (thin high clouds) */}
      <div
        style={{
          position: "absolute",
          top: "2%",
          left: 0,
          right: 0,
          height: "18%",
          background: `repeating-linear-gradient(
            92deg,
            transparent,
            transparent 120px,
            rgba(255,255,255,0.08) 120px,
            rgba(255,255,255,0.08) 240px
          )`,
          opacity: 0.6,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Animated cloud layers */}
      <div className="cloud-sky">
        {visibleLayers.map((layer, i) => (
          <div
            key={i}
            className={`cloud cloud--v${layer.variant} cloud--animate`}
            style={{
              "--cloud-color": cloudColor,
              "--cloud-opacity": layer.opacity,
              "--start-x": "calc(100vw + 300px)",
              "--end-x": "calc(-400px)",
              "--duration": adjustDuration(layer.duration),
              top: layer.top,
              right: "-320px",
              zIndex: layer.z,
              animationDelay: layer.delay,
            }}
          />
        ))}
      </div>

      {/* Haze near horizon */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: `linear-gradient(to top, rgba(255,255,255,0.35), transparent)`,
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      {children ? (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  );
};
