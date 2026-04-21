import type { ReactNode } from 'react';

/**
 * Realistic iPhone 17 Pro mockup.
 * - Titanium frame (gradient-rendered metallic ring)
 * - Dynamic Island with camera / Face ID sensor dots
 * - Side buttons: Action Button, Volume Up, Volume Down (left) · Side Button (right)
 * - Thin inner screen bezel, proper aspect ratio (19.5:9-ish)
 * - Soft floor shadow + subtle top specular highlight
 */
export default function PhoneFrame({
  children,
  width = 400,
}: {
  children: ReactNode;
  width?: number;
}) {
  // iPhone 17 Pro aspect ratio (~ 2.165:1)
  const height = Math.round(width * 2.082);
  const frameBorder = 9; // titanium frame thickness
  const bezel = 4;        // black bezel between titanium and screen
  const screenInset = frameBorder + bezel;
  const screenW = width - screenInset * 2;
  const screenH = height - screenInset * 2;
  const outerRadius = Math.round(width * 0.155); // ~62px at 400w
  const innerRadius = outerRadius - frameBorder - bezel + 2;

  return (
    <div
      className="relative"
      style={{ width, height, filter: 'drop-shadow(0 40px 60px rgba(11,11,15,0.28))' }}
    >
      {/* Soft glow pool under the device */}
      <div
        className="absolute inset-x-10 -bottom-6 h-10 rounded-full blur-2xl"
        style={{ background: 'rgba(10,74,214,0.18)', pointerEvents: 'none' }}
      />

      {/* ============ SIDE BUTTONS (behind frame) ============ */}
      {/* Action Button — top-left */}
      <div
        className="absolute"
        style={{
          left: -3,
          top: Math.round(height * 0.11),
          width: 4,
          height: 30,
          background: 'linear-gradient(90deg, #3a3a3d, #5a5a5d 50%, #2a2a2d)',
          borderRadius: '2px 0 0 2px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}
      />
      {/* Volume Up */}
      <div
        className="absolute"
        style={{
          left: -3,
          top: Math.round(height * 0.19),
          width: 4,
          height: 50,
          background: 'linear-gradient(90deg, #3a3a3d, #5a5a5d 50%, #2a2a2d)',
          borderRadius: '2px 0 0 2px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}
      />
      {/* Volume Down */}
      <div
        className="absolute"
        style={{
          left: -3,
          top: Math.round(height * 0.27),
          width: 4,
          height: 50,
          background: 'linear-gradient(90deg, #3a3a3d, #5a5a5d 50%, #2a2a2d)',
          borderRadius: '2px 0 0 2px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}
      />
      {/* Side Button (power) — right */}
      <div
        className="absolute"
        style={{
          right: -3,
          top: Math.round(height * 0.21),
          width: 4,
          height: 80,
          background: 'linear-gradient(270deg, #3a3a3d, #5a5a5d 50%, #2a2a2d)',
          borderRadius: '0 2px 2px 0',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}
      />

      {/* ============ TITANIUM FRAME ============ */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: outerRadius,
          background: `
            linear-gradient(135deg,
              #4a4a4d 0%,
              #6e6e72 15%,
              #8a8a8f 30%,
              #5a5a5d 50%,
              #3e3e41 70%,
              #6e6e72 88%,
              #4a4a4d 100%
            )
          `,
          boxShadow: `
            0 1px 0 rgba(255,255,255,0.25) inset,
            0 -1px 0 rgba(0,0,0,0.4) inset,
            0 0 0 0.5px rgba(0,0,0,0.6),
            0 20px 50px -15px rgba(11,11,15,0.35)
          `,
        }}
      />

      {/* Polished metal highlight ring — subtle top-left glint */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 1,
          borderRadius: outerRadius - 1,
          background: `
            radial-gradient(ellipse at 10% 0%, rgba(255,255,255,0.4), transparent 30%),
            radial-gradient(ellipse at 100% 100%, rgba(255,255,255,0.12), transparent 40%)
          `,
          mixBlendMode: 'overlay',
        }}
      />

      {/* ============ BLACK BEZEL ============ */}
      <div
        className="absolute"
        style={{
          top: frameBorder,
          left: frameBorder,
          right: frameBorder,
          bottom: frameBorder,
          borderRadius: outerRadius - frameBorder,
          background: '#020203',
          boxShadow: '0 0 0 0.5px rgba(255,255,255,0.06) inset',
        }}
      />

      {/* ============ SCREEN ============ */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: screenInset,
          left: screenInset,
          width: screenW,
          height: screenH,
          borderRadius: innerRadius,
          background: '#000',
        }}
      >
        {/* The embedded content — rendered at iPhone 17 Pro logical width (390px)
            and scaled down to fit exactly inside the screen cavity.
            Using an inverse height so the scaled layout fills the screen exactly — no empty void. */}
        <div
          className="absolute top-0 left-0 overflow-hidden"
          style={{
            transform: `scale(${screenW / 390})`,
            transformOrigin: 'top left',
            width: 390,
            height: screenH * (390 / screenW),
          }}
        >
          {children}
        </div>

        {/* Subtle screen reflection gradient — top-left sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 30%),
              linear-gradient(225deg, rgba(255,255,255,0.02) 0%, transparent 20%)
            `,
          }}
        />

        {/* iOS Home Indicator — pill at the bottom */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none z-10"
          style={{
            bottom: 8,
            width: Math.round(screenW * 0.35),
            height: 4,
            background: 'rgba(11,11,15,0.9)',
          }}
        />
      </div>

      {/* ============ DYNAMIC ISLAND ============ */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1"
        style={{
          top: screenInset + 10,
          width: 120,
          height: 34,
          borderRadius: 20,
          background: '#000',
          boxShadow: '0 0 0 0.5px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Front camera lens — subtle reflection */}
        <div
          className="relative rounded-full"
          style={{
            width: 8,
            height: 8,
            background: 'radial-gradient(circle at 30% 30%, #1a1a2e 0%, #050510 70%)',
            boxShadow: 'inset 0 0 0 0.5px rgba(60,80,120,0.5), 0 0 1px rgba(80,120,180,0.3)',
          }}
        >
          <div
            className="absolute rounded-full"
            style={{ top: 1.5, left: 1.5, width: 2, height: 2, background: 'rgba(120,150,200,0.6)' }}
          />
        </div>
        {/* Face ID TrueDepth sensor cluster */}
        <div
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            background: 'radial-gradient(circle at 30% 30%, #0f0f1a 0%, #000 70%)',
            boxShadow: 'inset 0 0 0 0.5px rgba(40,40,55,0.6)',
          }}
        />
      </div>

      {/* Ambient reflection — top of frame */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          top: 2,
          width: '55%',
          height: 4,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.5), transparent)',
          borderRadius: '9999px',
          filter: 'blur(1.5px)',
        }}
      />
    </div>
  );
}
