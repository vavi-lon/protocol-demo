import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Shield, X, ArrowLeft, ArrowRight, Download, Play, Pause, RotateCcw, Check } from 'lucide-react';
import ProtocolConversationSection from './ProtocolConversationSection';

const TEAL = '#0A4AD6';

// ──────────────────────────────────────────────────────────────────────────
// PROTOCOL STORYBOARD — auto-playing 4-frame intro with overlays-over-image,
// growth.design's click-through DNA + aeratechnology.com's overlay-on-visual.
//
// Each frame plays for a tuned duration, then auto-advances. Annotations and
// dialog bubbles cascade in over the image; the body content (paragraphs,
// scripts, tables, lists) lives in a glassmorphic card overlaid on the same
// image — no side panel, just one cinematic stage. After the last frame,
// the reader gets a "Would you like to try it yourself?" prompt; tapping it
// reveals the original interactive ProtocolStepper as a slide-up overlay.
//
// Drop the four storyboard images at:
//   public/images/protocol/frame-01-see.jpeg
//   public/images/protocol/frame-02-stay.jpeg
//   public/images/protocol/frame-03-ask.jpeg
//   public/images/protocol/frame-04-connect.jpeg
// (Or swap <img> for <video> in FullBleedMedia for moving footage.)
// Until the asset exists, each frame falls back to a moody gradient.
// ──────────────────────────────────────────────────────────────────────────

type Bubble = {
  text: string;
  /** 'system' renders centered italic without a label — for ambient signals like missed-standup logs. */
  speaker: 'you' | 'them' | 'system';
  /** Optional explicit reveal delay (ms) so two bubbles in a frame visibly take turns */
  delay?: number;
  /** Italic subtitle lines that render under this bubble */
  annotations?: string[];
};

type FrameDef = {
  n: number;
  step: 'SEE' | 'STAY' | 'ASK' | 'CONNECT';
  overline: string;
  headline: string;
  imagePath: string;
  imageAlt: string;
  fallbackGradient: string;
  sceneCaption: string;
  bubbles: Bubble[];
  body: ReactNode;
  /** ms — how long this frame plays before auto-advancing */
  duration: number;
  /** Which side of the screen the body card overlay sits on */
  bodyPlacement: 'left' | 'right';
  /** When true, render the ReceiptOverlay panel instead of bubbles (used by Frame 4) */
  receipt?: boolean;
};

// ──────────────────────────────────────────────────────────────────────────
// FRAMES — every line from the original ProtocolStepper preserved verbatim,
// distributed across the 4 frames as overlays over each image.
// ──────────────────────────────────────────────────────────────────────────

const FRAMES: FrameDef[] = [
  {
    n: 1,
    step: 'SEE',
    overline: 'STEP 01 · SEE',
    headline: 'Recognize the signals.',
    imagePath: '/images/protocol/frame-01-see.jpeg',
    imageAlt: 'A colleague at her desk, head lowered, withdrawn from the room around her.',
    fallbackGradient: 'linear-gradient(135deg, #2a2c34 0%, #3f4452 50%, #5a6076 100%)',
    sceneCaption: 'Tuesday, 9:47 AM · The signal',
    duration: 10500,
    bodyPlacement: 'right',
    bubbles: [
      {
        speaker: 'them',
        text: 'heading out early today, not feeling great',
        delay: 700,
        annotations: [
          'Posture withdraws — shoulders close inward',
          'Hand on the wall — needs the surface to stand',
          'Crowd flows past — no one breaks stride',
        ],
      },
      { speaker: 'you',    text: 'of course, feel better',                delay: 2400 },
      { speaker: 'system', text: 'Them missed Monday 10am standup',      delay: 3700 },
      { speaker: 'system', text: 'Them missed Thursday 10am standup',    delay: 4500 },
    ],
    body: (
      <div className="space-y-4">
        <p className="text-[14.5px] leading-relaxed text-ink">
          Recognize signals — withdrawal, behavioral shift, distress, or the gesture.
          Your obligation: respond within the hour. <span className="font-semibold">Do not wait for someone else.</span>
        </p>
        <div className="rounded-xl bg-bg-muted/70 p-3.5 border border-hair/60">
          <h4 className="font-bold mb-2 flex items-center gap-1.5 text-ink text-[12.5px]">
            <AlertCircle size={14} className="text-accent" /> Quick safety check
          </h4>
          <ul className="space-y-1.5 text-[12.5px]">
            <li className="flex gap-2"><span className="text-ink font-bold">•</span><span>Immediate danger → <span className="font-semibold">911 first</span></span></li>
            <li className="flex gap-2"><span className="text-ink font-bold">•</span><span>Safe and accessible → Proceed to <span className="font-semibold">STAY</span></span></li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    n: 2,
    step: 'STAY',
    overline: 'STEP 02 · STAY',
    headline: 'Close the distance.',
    imagePath: '/images/protocol/frame-02-stay.jpeg',
    imageAlt: 'A manager stands beside a seated colleague who has pressed her hand to her chest — the silent sign.',
    fallbackGradient: 'linear-gradient(135deg, #1f2932 0%, #354253 50%, #4f5d72 100%)',
    sceneCaption: 'Tuesday, 9:48 AM · The first 30 seconds',
    duration: 11500,
    bodyPlacement: 'left',
    bubbles: [
      {
        speaker: 'you',
        text: "Hey — I've noticed you've been quiet this week. You missed both standups. You okay?",
        delay: 700,
        annotations: [
          'You stop — physical presence first',
          'Distance kept — closeness without invasion',
        ],
      },
      {
        speaker: 'them',
        text: "yeah honestly it's been a rough stretch. family stuff. thanks for asking, means a lot",
        delay: 2700,
        annotations: ['Hand to chest — the silent sign'],
      },
    ],
    body: (
      <div className="space-y-3.5">
        <p className="text-[14px] leading-relaxed text-ink">
          Your presence communicates before your words. Use the structure, but keep your own language.
        </p>
        <div className="space-y-2">
          {[
            { label: 'OPEN',             text: '"I noticed something. I wanted to check in."' },
            { label: 'RELEASE PRESSURE', text: '"You don\'t have to explain anything right now."' },
            { label: 'OFFER OPTIONS',    text: '"What would help most?"' },
          ].map((block, i) => (
            <div key={i} className="border-l-2 border-accent pl-3 py-0.5">
              <span className="block font-bold text-caption text-[10px] tracking-[0.14em] uppercase mb-0.5">{block.label}</span>
              <span className="block text-ink font-medium text-[13.5px] leading-snug">{block.text}</span>
            </div>
          ))}
        </div>
        <p className="text-[11.5px] italic text-muted leading-snug">
          Note: "These are not magic words. They are the structure. Keep the sequence."
        </p>
      </div>
    ),
  },
  {
    n: 3,
    step: 'ASK',
    overline: 'STEP 03 · ASK',
    headline: 'Recognize and route.',
    imagePath: '/images/protocol/frame-03-ask.jpeg',
    imageAlt: 'The manager and colleague speaking face-to-face at the desk — the manager listening, not solving.',
    fallbackGradient: 'linear-gradient(135deg, #1f2630 0%, #364452 50%, #56657a 100%)',
    sceneCaption: 'Tuesday, 9:49 AM · Listening, not solving',
    duration: 12000,
    bodyPlacement: 'right',
    bubbles: [
      {
        speaker: 'you',
        text: 'no pressure — but if things ever feel worse, 988 is free, confidential, and 24/7. text or call.',
        delay: 700,
        annotations: ['Open question — "What would help most?"'],
      },
      {
        speaker: 'them',
        text: 'ok. thank you.',
        delay: 2700,
        annotations: ["They answer — route, don't evaluate"],
      },
    ],
    body: (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-hair/60">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hair/60 bg-bg-muted/40">
                <th className="py-2 px-2.5 font-bold text-caption text-[9.5px] uppercase tracking-wider">Response</th>
                <th className="py-2 px-2.5 font-bold text-caption text-[9.5px] uppercase tracking-wider">Your action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair/60 text-[11.5px]">
              <tr><td className="py-2 px-2.5 font-medium italic text-ink">"I just need a moment"</td><td className="py-2 px-2.5">"I'll check back in 30 minutes."</td></tr>
              <tr><td className="py-2 px-2.5 font-medium italic text-ink">"I'd like to talk to someone"</td><td className="py-2 px-2.5">Open Resource Map together.</td></tr>
              <tr><td className="py-2 px-2.5 font-medium italic text-ink">Signs of immediate risk</td><td className="py-2 px-2.5">"Let's call 988 together." Stay.</td></tr>
              <tr><td className="py-2 px-2.5 font-medium italic text-ink">Refuses all support</td><td className="py-2 px-2.5">Document. Escalate today.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11.5px] italic text-muted leading-snug">
          Note: "Do not attempt to assess suicide risk. Do not ask clinical questions. Your job is recognition and routing — not evaluation."
        </p>
      </div>
    ),
  },
  {
    n: 4,
    step: 'CONNECT',
    overline: 'STEP 04 · CONNECT',
    headline: 'Close the loop.',
    imagePath: '/images/protocol/frame-04-connect.jpeg',
    imageAlt: 'The manager stands with the colleague at her desk; a phone is held to make the call. The line is open.',
    fallbackGradient: 'linear-gradient(135deg, #1c2530 0%, #34465c 50%, #5b7090 100%)',
    sceneCaption: 'Tuesday, 9:51 AM · 988 connected',
    duration: 12500,
    bodyPlacement: 'left',
    receipt: true,
    bubbles: [],
    body: (
      <div className="space-y-3.5">
        <p className="text-[13.5px] leading-relaxed text-ink">
          Log without PII/PHI: date, that a check-in occurred, routing offered, whether accepted.
        </p>
        <div className="rounded-xl border border-accent/20 bg-accent-light/30 p-3.5">
          <h4 className="font-bold text-ink mb-2 flex items-center gap-1.5 text-[12px]">
            <Shield size={14} className="text-accent" /> Non-negotiable data rules
          </h4>
          <ul className="space-y-1 text-[11.5px] leading-snug">
            <li className="flex gap-1.5"><span className="text-accent font-bold shrink-0">/</span><span>Logs stored in <span className="font-semibold">SEPARATE system</span> from HR records — never in HRIS</span></li>
            <li className="flex gap-1.5"><span className="text-accent font-bold shrink-0">/</span><span>Automatic <span className="font-semibold">90-day retention limit</span> — then purged</span></li>
            <li className="flex gap-1.5"><span className="text-accent font-bold shrink-0">/</span><span>May <span className="font-semibold">NOT</span> be referenced in performance reviews, PIPs, or termination</span></li>
            <li className="flex gap-1.5"><span className="text-accent font-bold shrink-0">/</span><span>Model data governance policy included in the deployment kit for your GC</span></li>
          </ul>
        </div>
        <div>
          <p className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-caption mb-1.5">Take it with you</p>
          <div className="flex flex-wrap gap-1.5">
            {['Full Protocol — PDF', 'Pocket Card', 'Common-Areas Poster'].map((label) => (
              <button
                key={label}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold border border-hair hover:border-accent hover:text-accent transition-colors text-ink bg-white"
              >
                <Download size={11} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
  },
];

// ──────────────────────────────────────────────────────────────────────────
// FULL-BLEED MEDIA — fills entire frame area; image now, video-ready.
// ──────────────────────────────────────────────────────────────────────────

const FullBleedMedia = ({ frame, revealed }: { frame: FrameDef; revealed: boolean }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: frame.fallbackGradient }}
    >
      {!imgFailed && (
        <img
          src={frame.imagePath}
          alt={frame.imageAlt}
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            opacity: imgLoaded ? 1 : 0,
            transform: revealed ? 'scale(1.02)' : 'scale(1)',
            transition: 'opacity 700ms ease, transform 12000ms cubic-bezier(0.4,0,0.2,1)',
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgFailed(true)}
        />
      )}

      {/* Asymmetric darkening: stronger on the body-card side so overlay text is legible,
          lighter on the annotation side so the image still reads. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            frame.bodyPlacement === 'right'
              ? 'linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.55) 100%)'
              : 'linear-gradient(270deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* Top + bottom vignette — keeps caption + watermark legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 14%, transparent 86%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {(imgFailed || !imgLoaded) && (
        <div
          className="absolute inset-x-0 bottom-12 px-8 text-center pointer-events-none"
          style={{ opacity: revealed ? 1 : 0, transition: 'opacity 600ms ease 600ms' }}
        >
          <p className="text-white/70 text-[13px] italic max-w-[640px] mx-auto">
            {frame.imageAlt}
          </p>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// CHAT MESSAGE — single bubble row in the conversation column.
// Layout: [LABEL above] → [bubble] → [italic annotations below].
// THEM = left-aligned, near-white bubble with 4px top-left corner.
// YOU  = right-aligned, blue bubble with 4px top-right corner.
// ──────────────────────────────────────────────────────────────────────────

const ChatMessage = ({
  bubble: b,
  index,
  revealed,
}: {
  bubble: Bubble;
  index: number;
  revealed: boolean;
}) => {
  const isYou = b.speaker === 'you';
  const isSystem = b.speaker === 'system';
  const delay = b.delay ?? 600 + index * 1400;

  // System lines = ambient signal (missed standups, sealed receipts) — centered,
  // italic, no speaker label. Mirrors the live demo's `kind: 'system'` styling.
  if (isSystem) {
    return (
      <div
        className="flex justify-center w-full"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translate(0, 0)' : 'translate(0, 8px)',
          transition: `opacity 500ms ease ${delay}ms, transform 500ms cubic-bezier(0.2,0.9,0.3,1.1) ${delay}ms`,
        }}
      >
        <div
          className="rounded-md px-3 py-1 text-center italic"
          style={{
            background: 'rgba(120,90,60,0.10)',
            color: 'rgba(255,255,255,0.72)',
            fontSize: '0.78rem',
            textShadow: '0 1px 3px rgba(0,0,0,0.55)',
            maxWidth: '92%',
          }}
        >
          {b.text}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col w-full ${isYou ? 'items-end' : 'items-start'}`}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed
          ? 'translate(0, 0)'
          : isYou
            ? 'translate(12px, 8px)'
            : 'translate(-12px, 8px)',
        transition: `opacity 500ms ease ${delay}ms, transform 500ms cubic-bezier(0.2,0.9,0.3,1.1) ${delay}ms`,
      }}
    >
      {/* Label above bubble */}
      <span
        className="font-bold uppercase tracking-[0.14em] mb-1.5"
        style={{
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.72)',
          textShadow: '0 1px 3px rgba(0,0,0,0.55)',
        }}
      >
        {isYou ? 'You' : 'Them'}
      </span>

      {/* Bubble */}
      <div
        className="px-4 py-2.5"
        style={{
          maxWidth: '92%',
          background: isYou ? '#2563eb' : 'rgba(255,255,255,0.96)',
          color: isYou ? '#ffffff' : '#0b0b0f',
          borderRadius: isYou ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          fontSize: 14.5,
          lineHeight: 1.45,
          fontWeight: isYou ? 500 : 400,
          boxShadow: '0 6px 20px -8px rgba(0,0,0,0.45)',
          whiteSpace: 'pre-line',
        }}
      >
        {b.text}
      </div>

      {/* Annotations below bubble — italic subtitle lines */}
      {b.annotations && b.annotations.length > 0 && (
        <div
          className={`mt-1.5 ${isYou ? 'text-right' : 'text-left'}`}
          style={{ maxWidth: '92%' }}
        >
          {b.annotations.map((a, j) => (
            <p
              key={j}
              className="italic"
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.62)',
                textShadow: '0 1px 3px rgba(0,0,0,0.55)',
                lineHeight: 1.4,
              }}
            >
              {a}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// CHAT COLUMN — flex-column container that holds all messages for a frame.
// Positioned on the side opposite the body card (which holds step descriptions).
// ──────────────────────────────────────────────────────────────────────────

const ChatColumn = ({ frame, revealed }: { frame: FrameDef; revealed: boolean }) => {
  // Place chat column on the side opposite the body-card so they don't overlap
  const side: 'left' | 'right' = frame.bodyPlacement === 'right' ? 'left' : 'right';

  return (
    <div
      className="absolute z-20 flex flex-col gap-4"
      style={{
        [side]: 'clamp(24px, 5vw, 72px)',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 'min(480px, 36vw)',
        maxWidth: 480,
      }}
    >
      {frame.bubbles.map((b, i) => (
        <ChatMessage key={i} bubble={b} index={i} revealed={revealed} />
      ))}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// RECEIPT OVERLAY — for Frame 4. Renders the PROTOCOL COMPLETE receipt
// (text rendered as UI, exactly matching Image 5) over the image, in place
// of dialog bubbles.
// ──────────────────────────────────────────────────────────────────────────

const ReceiptRow = ({
  label,
  value,
  mono = false,
  color,
}: {
  label: string;
  value: string;
  mono?: boolean;
  color?: string;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[11.5px]" style={{ color: 'rgba(80,55,30,0.7)' }}>{label}</span>
    <span
      className={`text-[12.5px] font-semibold ${mono ? 'font-mono' : ''}`}
      style={{ color: color || '#1a1a1f', letterSpacing: mono ? '-0.01em' : 'normal' }}
    >
      {value}
    </span>
  </div>
);

const ReceiptOverlay = ({ revealed, side }: { revealed: boolean; side: 'left' | 'right' }) => {
  // Position the receipt in the exact same slot the ChatColumn occupies on the
  // other frames — opposite the body card, vertically centred, same horizontal
  // offset and width.
  return (
    <div
      className="absolute z-20"
      style={{
        [side]: 'clamp(24px, 5vw, 72px)',
        top: '50%',
        width: 'min(480px, 36vw)',
        maxWidth: 480,
        opacity: revealed ? 1 : 0,
        transform: revealed
          ? 'translateY(-50%) scale(1)'
          : 'translateY(-46%) scale(0.96)',
        transition: 'opacity 700ms ease 900ms, transform 800ms cubic-bezier(0.16,1,0.3,1) 900ms',
      }}
    >
      <div
        className="rounded-2xl p-5 shadow-2xl"
        style={{
          background: 'rgba(252,246,234,0.96)',
          border: '1px solid rgba(180,150,100,0.35)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        {/* Drag-handle whisker — reads as a sealed receipt panel */}
        <div className="flex justify-center -mt-1 mb-1">
          <span className="block h-[3px] w-9 rounded-full" style={{ background: 'rgba(120,90,60,0.25)' }} />
        </div>

        <p className="text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: TEAL }}>
          Protocol complete
        </p>
        <div className="flex items-baseline gap-2 mt-1 mb-4">
          <span className="text-[34px] font-semibold leading-none text-ink">17.5s</span>
          <span className="text-[12.5px] text-muted">total</span>
        </div>

        <div
          className="rounded-xl p-3.5 mb-4 space-y-2"
          style={{ background: 'rgba(255,251,240,0.7)', border: '1px solid rgba(180,150,100,0.18)' }}
        >
          <ReceiptRow label="Event"     value="Check-in completed" />
          <ReceiptRow label="Routed to" value="988 Lifeline" />
          <ReceiptRow label="Resource"  value="Accepted" />
          <ReceiptRow label="Hash"      value="0x7a3e…b91d" mono color={TEAL} />
        </div>

        <ul className="space-y-1.5 mb-4 text-[11.5px]" style={{ color: 'rgba(70,50,30,0.85)' }}>
          <li className="flex items-center gap-2">
            <Check size={12} className="text-accent shrink-0" /> No name recorded
          </li>
          <li className="flex items-center gap-2">
            <Check size={12} className="text-accent shrink-0" /> No notes, no diagnosis
          </li>
          <li className="flex items-center gap-2">
            <Check size={12} className="text-accent shrink-0" /> Auto-purges in 90 days
          </li>
        </ul>

        <div
          className="flex items-center justify-between pt-2 border-t"
          style={{ borderColor: 'rgba(180,150,100,0.18)' }}
        >
          <span className="text-[9.5px] font-bold tracking-[0.14em] uppercase" style={{ color: 'rgba(90,60,30,0.6)' }}>
            Compliant by Design
          </span>
          <span className="text-[10.5px] font-bold tracking-[0.06em] text-ink">OSHA · ADA · HIPAA</span>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// FRAME — single visible panel: full-bleed image with all overlays on top
// ──────────────────────────────────────────────────────────────────────────

const Frame = ({ frame, direction }: { frame: FrameDef; direction: 'forward' | 'backward' }) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        animation: `${direction === 'forward' ? 'bf-frame-in-right' : 'bf-frame-in-left'} 600ms cubic-bezier(0.4,0,0.2,1) both`,
      }}
    >
      {/* Layer 1 — full-bleed image (or video, when you swap it in) */}
      <FullBleedMedia frame={frame} revealed={revealed} />

      {/* Layer 2 — chat column (or receipt panel for Frame 4) */}
      {frame.receipt ? (
        <ReceiptOverlay
          revealed={revealed}
          side={frame.bodyPlacement === 'left' ? 'right' : 'left'}
        />
      ) : (
        <ChatColumn frame={frame} revealed={revealed} />
      )}

      {/* Layer 3 — frame number watermark (top-left or top-right depending on body side) */}
      <div
        className="absolute top-5 flex items-center justify-center w-9 h-9 rounded-full bg-white/95 text-ink text-[14px] font-bold tabular-nums shadow-lg backdrop-blur-sm"
        style={{
          [frame.bodyPlacement === 'right' ? 'left' : 'right']: 20,
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'scale(1)' : 'scale(0.7)',
          transition: 'opacity 500ms ease 200ms, transform 500ms cubic-bezier(0.2,0.9,0.3,1.2) 200ms',
        }}
      >
        {frame.n}
      </div>

      {/* Layer 4 — body content overlay: glassmorphic card on body side */}
      <div className="absolute inset-0 grid grid-cols-12 px-6 md:px-12 lg:px-16 py-8 pointer-events-none">
        <div
          className={`col-span-12 lg:col-span-5 flex flex-col justify-center pointer-events-auto ${
            frame.bodyPlacement === 'right' ? 'lg:col-start-8' : 'lg:col-start-1'
          }`}
        >
          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed
                ? 'translateX(0)'
                : `translateX(${frame.bodyPlacement === 'right' ? 24 : -24}px)`,
              transition: 'opacity 800ms ease 250ms, transform 800ms ease 250ms',
            }}
          >
            {/* Step badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/92 backdrop-blur-sm border border-white/50 shadow mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-accent">
                {frame.overline}
              </span>
            </div>

            {/* Headline — large, white, drop-shadowed, sits directly on image */}
            <h3
              className="text-[28px] md:text-[34px] lg:text-[40px] font-semibold leading-[1.05] tracking-tight text-white mb-5"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)' }}
            >
              {frame.headline}
            </h3>

            {/* Body — glassmorphic card overlaying the image */}
            <div
              className="rounded-2xl p-4 md:p-5"
              style={{
                background: 'rgba(255,255,255,0.93)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '1px solid rgba(255,255,255,0.55)',
                boxShadow: '0 14px 44px -14px rgba(0,0,0,0.45)',
              }}
            >
              {frame.body}
            </div>
          </div>
        </div>
      </div>

      {/* Layer 5 — scene caption pinned bottom */}
      <p
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11.5px] italic text-white/75 whitespace-nowrap"
        style={{
          opacity: revealed ? 1 : 0,
          transition: 'opacity 700ms ease 700ms',
          textShadow: '0 1px 6px rgba(0,0,0,0.6)',
        }}
      >
        {frame.sceneCaption}
      </p>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// MAIN — auto-playing slideshow shell. After the last frame, the user clicks
// "Finish" to open the step-ladder directly (no intermediate prompt).
// ──────────────────────────────────────────────────────────────────────────

const ProtocolStoryboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [showStepper, setShowStepper] = useState(false);
  const [paused, setPaused] = useState(false);

  const total = FRAMES.length;
  const frame = FRAMES[activeIndex];

  // Lock body scroll for the entire walkthrough lifetime
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Auto-advance — each frame plays for its tuned duration, then steps forward.
  // The last frame does NOT auto-trigger anything; the user must click "Finish"
  // to manually open the step-ladder.
  useEffect(() => {
    if (showStepper || paused) return;
    if (activeIndex >= total - 1) return;
    const timer = setTimeout(() => {
      setDirection('forward');
      setActiveIndex(activeIndex + 1);
    }, frame.duration);
    return () => clearTimeout(timer);
  }, [activeIndex, showStepper, paused, frame.duration, total]);

  const goNext = () => {
    if (activeIndex < total - 1) {
      setDirection('forward');
      setActiveIndex(activeIndex + 1);
    } else {
      // Last frame's Next opens the step-ladder directly
      setShowStepper(true);
    }
  };
  const goPrev = () => {
    if (activeIndex > 0) {
      setDirection('backward');
      setActiveIndex(activeIndex - 1);
    }
  };
  const jumpTo = (i: number) => {
    if (i === activeIndex) return;
    setDirection(i > activeIndex ? 'forward' : 'backward');
    setActiveIndex(i);
  };
  const replay = () => {
    setShowStepper(false);
    setActiveIndex(0);
    setDirection('forward');
    setPaused(false);
  };

  // Keyboard: ←/→ advance, Space pauses
  useEffect(() => {
    if (showStepper) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, showStepper]);

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: '#0b0b0f' }}
    >
      <style>{`
        @keyframes bf-frame-in-right { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bf-frame-in-left  { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bf-fade-up        { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bf-pulse-ring     { 0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.35); } 50% { box-shadow: 0 0 0 14px rgba(16,185,129,0); } }
        @keyframes bf-progress-fill  { from { width: 0%; } to { width: 100%; } }
        @keyframes bf-stepper-slide-up {
          0%   { opacity: 0; transform: translateY(60px); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bf-stepper-slide-down {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(60px); }
        }
      `}</style>

      {/* ── TOP BAR ── */}
      <header className="relative z-30 shrink-0 px-5 md:px-8 py-3 md:py-4 flex items-center justify-between bg-black/30 backdrop-blur-md">
        <Link to="/protocol" className="flex items-center gap-2 group" aria-label="Back to /protocol">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-colors">
            <X size={14} className="text-white/85" />
          </span>
          <span className="hidden md:inline text-[12px] font-medium text-white/75 group-hover:text-white transition-colors">
            Close
          </span>
        </Link>

        <div className="text-center">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-0.5">The Protocol · v1.0</p>
          <p className="text-[13px] md:text-[14px] font-semibold text-white leading-tight">
            Four steps. Thirty seconds. <span className="hidden sm:inline text-white/60 font-normal">— You are the first responder, not the therapist.</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-colors"
            aria-label={paused ? 'Resume' : 'Pause'}
            title={paused ? 'Resume' : 'Pause'}
          >
            {paused ? <Play size={12} fill="white" className="text-white" /> : <Pause size={12} fill="white" className="text-white" />}
          </button>
          <div className="text-[12px] font-semibold tabular-nums text-white/85">
            <span className="text-white">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/40 mx-1">/</span>
            <span className="text-white/60">{String(total).padStart(2, '0')}</span>
          </div>
        </div>
      </header>

      {/* ── SEGMENTED PROGRESS BAR ── */}
      <div className="relative z-30 shrink-0 flex items-center gap-1 px-5 md:px-8 py-2 bg-black/30 backdrop-blur-md">
        {FRAMES.map((f, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          const isLast = i === total - 1;
          return (
            <div key={f.n} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/15">
              {isActive && !isLast ? (
                <div
                  key={`bar-${activeIndex}-${paused ? 'p' : 'r'}`}
                  className="h-full bg-accent"
                  style={{
                    animation: `bf-progress-fill ${f.duration}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              ) : (
                <div className="h-full bg-accent" style={{ width: isPast || isActive ? '100%' : '0%' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── FRAME STAGE ── */}
      <main className="relative flex-1 min-h-0 overflow-hidden">
        <Frame key={frame.n} frame={frame} direction={direction} />
      </main>

      {/* ── LIVE DEMO OVERLAY ── slides up from below over the walkthrough.
          Renders the V1 ButterflyConversation inside a PhoneFrame, centered and sized
          so the whole thing fits the viewport with no scrolling at all. */}
      {showStepper && (
        <div
          className="absolute inset-0 z-50 overflow-hidden flex flex-col"
          style={{
            animation: 'bf-stepper-slide-up 800ms cubic-bezier(0.16,1,0.3,1) both',
            background: 'radial-gradient(ellipse 90% 70% at 50% 35%, #fbf4ea 0%, #f1e7d4 55%, #e6d9c2 100%)',
          }}
        >
          {/* Header — Close + title + Replay */}
          <header className="shrink-0 px-5 md:px-8 py-3 flex items-center justify-between border-b border-hair/60 bg-white/80 backdrop-blur-md">
            <button
              onClick={() => setShowStepper(false)}
              className="inline-flex items-center gap-2 group"
              aria-label="Close live demo"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-hair shadow-sm group-hover:border-accent transition-colors">
                <ArrowLeft size={14} className="text-muted group-hover:text-accent transition-colors" />
              </span>
              <span className="hidden md:inline text-[12px] font-medium text-muted group-hover:text-ink transition-colors">
                Back to walkthrough
              </span>
            </button>
            <div className="text-center">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-caption mb-0.5">Live demo</p>
              <p className="text-[13px] font-semibold text-ink">Try the protocol yourself</p>
            </div>
            <button
              onClick={replay}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold text-ink bg-white border border-hair hover:border-accent hover:text-accent transition-colors"
            >
              <RotateCcw size={12} /> <span className="hidden sm:inline">Replay walkthrough</span>
            </button>
          </header>

          {/* Live demo stage — embedded ProtocolConversationSection (the original
              immersive scene) with step callouts + recent check-ins hidden so it
              fits the viewport with no scrolling. */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            <ProtocolConversationSection embedded />
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      <footer className="relative z-30 shrink-0 px-5 md:px-8 py-3 md:py-4 flex items-center justify-between bg-black/30 backdrop-blur-md">
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 transition-colors disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-white/10 disabled:hover:border-white/20"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {FRAMES.map((f, i) => {
            const isActive = i === activeIndex;
            const isVisited = i < activeIndex;
            return (
              <button
                key={f.n}
                onClick={() => jumpTo(i)}
                aria-label={`Go to ${f.step}`}
                className="group flex items-center gap-1.5"
              >
                <span
                  className="block rounded-full transition-all"
                  style={{
                    width: isActive ? 28 : 8,
                    height: 8,
                    background: isActive ? TEAL : isVisited ? '#ffffff' : 'rgba(255,255,255,0.25)',
                  }}
                />
                <span
                  className={`text-[10.5px] font-bold tracking-[0.14em] uppercase tabular-nums hidden md:inline transition-colors ${
                    isActive ? 'text-accent-light' : isVisited ? 'text-white/85' : 'text-white/45'
                  }`}
                >
                  {f.step}
                </span>
              </button>
            );
          })}
        </div>

        {activeIndex < total - 1 ? (
          <button
            onClick={goNext}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold bg-accent text-white hover:opacity-90 transition-opacity"
          >
            <span>Next</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={() => setShowStepper(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold bg-accent text-white hover:opacity-90 transition-opacity shadow-md"
          >
            <span>Finish</span>
            <ArrowRight size={14} />
          </button>
        )}
      </footer>
    </div>
  );
};

export default ProtocolStoryboard;
