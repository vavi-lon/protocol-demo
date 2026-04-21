import { useState, useEffect } from 'react';

// ────────────────────────────────────────────────────────────────────
// BUTTERFLY — V3 THE PASS
// Apple Wallet-style pass that builds itself as you run the protocol.
// The pass is the hero. It gains fields live. At the end, it's sealed.
// Actions below shift form — buttons, resource list, binary choice.
// ────────────────────────────────────────────────────────────────────

const TEAL = '#0A4AD6';
const MINT = '#7BA7F5';
const INK = '#0A0A0C';
const INK_2 = '#6E6E73';
const INK_3 = '#A1A1A6';
const HAIR = '#E5E5EA';
const PASS_DARK = '#111113';
const SURFACE = '#F5F5F7';
const WALLET_BG = '#E8E8EC';

const Mark = ({ size = 18, color = TEAL, opacity = 1 }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 100 86" fill="none" style={{ opacity }}>
    <path d="M50 60 C 40 12, 8 12, 8 38 C 8 62, 34 72, 50 60 Z" fill={color} opacity="0.92" />
    <path d="M50 60 C 60 12, 92 12, 92 38 C 92 62, 66 72, 50 60 Z" fill={color} opacity="0.68" />
    <line x1="50" y1="16" x2="50" y2="78" stroke={color} strokeWidth="1" opacity="0.3" />
  </svg>
);

export default function ButterflyPass() {
  const [phase, setPhase] = useState('idle');
  // idle → approach → listen → route → outcome → sealed
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [route, setRoute] = useState(null);
  const [accepted, setAccepted] = useState(null);

  useEffect(() => {
    if (startedAt === null || phase === 'sealed') return;
    const id = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 100);
    return () => clearInterval(id);
  }, [startedAt, phase]);

  const begin = () => { setStartedAt(Date.now()); setPhase('approach'); };
  const reset = () => { setPhase('idle'); setStartedAt(null); setElapsed(0); setRoute(null); setAccepted(null); };

  const steps = {
    idle: 0, approach: 1, listen: 2, route: 3, outcome: 4, sealed: 5,
  };
  const stepN = steps[phase];

  return (
    <div
      className="min-h-screen w-full flex items-stretch justify-center"
      style={{
        background: '#DCDCE0',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
        color: INK,
      }}
    >
      <style>{`
        @keyframes bfp-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bfp-field-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bfp-stamp { 0% { opacity: 0; transform: scale(1.6) rotate(-12deg); } 60% { opacity: 1; transform: scale(0.96) rotate(-12deg); } 100% { opacity: 1; transform: scale(1) rotate(-12deg); } }
        @keyframes bfp-draw { to { stroke-dashoffset: 0; } }
        @keyframes bfp-shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
        .bfp-up    { animation: bfp-fade-up 500ms cubic-bezier(0.16,1,0.3,1) both; }
        .bfp-up-1  { animation: bfp-fade-up 500ms cubic-bezier(0.16,1,0.3,1) 80ms both; }
        .bfp-field { animation: bfp-field-in 400ms cubic-bezier(0.2,1,0.3,1) both; }
        .bfp-stamp { animation: bfp-stamp 700ms cubic-bezier(0.3,1.4,0.4,1) 200ms both; }
      `}</style>

      <div className="relative flex w-full max-w-[430px] flex-col overflow-hidden" style={{ background: WALLET_BG, minHeight: '100vh' }}>
        {/* Wallet-style header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <div className="flex items-center gap-1.5">
            <Mark size={14} color={INK} />
            <span className="text-[11.5px] font-semibold tracking-tight" style={{ color: INK }}>Butterfly</span>
          </div>
          <p className="text-[11px] font-semibold uppercase tabular-nums" style={{ color: INK_2, letterSpacing: '0.1em' }}>
            {phase === 'idle' && 'New Pass'}
            {phase === 'approach' && 'Building · 1/4'}
            {phase === 'listen' && 'Building · 2/4'}
            {phase === 'route' && 'Building · 3/4'}
            {phase === 'outcome' && 'Building · 4/4'}
            {phase === 'sealed' && 'Sealed'}
          </p>
        </div>

        {/* Pass — the hero */}
        <div className="px-5">
          <PassCard stepN={stepN} phase={phase} elapsed={elapsed} route={route} accepted={accepted} />
        </div>

        {/* Action panel below */}
        <div className="flex flex-1 flex-col justify-end px-5 pb-8 pt-6">
          {phase === 'idle' && <IdlePanel onBegin={begin} />}
          {phase === 'approach' && <ApproachPanel onNext={() => setPhase('listen')} />}
          {phase === 'listen' && <ListenPanel onNext={() => setPhase('route')} />}
          {phase === 'route' && <RoutePanel onPick={(r) => { setRoute(r); setPhase('outcome'); }} />}
          {phase === 'outcome' && <OutcomePanel route={route} onPick={(a) => { setAccepted(a); setElapsed((Date.now() - startedAt) / 1000); setPhase('sealed'); }} />}
          {phase === 'sealed' && <SealedPanel onReset={reset} />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── THE PASS ───────────────────────────

function PassCard({ stepN, phase, elapsed, route, accepted }) {
  const sealed = phase === 'sealed';
  return (
    <div className="relative">
      {/* The pass */}
      <div
        className="relative overflow-hidden rounded-[22px] bfp-up"
        style={{
          background: PASS_DARK,
          boxShadow: '0 20px 50px -20px rgba(0,0,0,0.35), 0 2px 0 rgba(255,255,255,0.4) inset',
        }}
      >
        {/* Header strip */}
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="flex items-center gap-1.5">
            <Mark size={14} color={MINT} />
            <span className="text-[10px] font-semibold uppercase" style={{ color: MINT, letterSpacing: '0.14em' }}>
              Check-in Pass
            </span>
          </div>
          <span className="text-[10px] tabular-nums" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
            {phase === 'idle' ? 'DRAFT' : phase === 'sealed' ? 'SEALED' : 'LIVE'}
          </span>
        </div>

        {/* Primary field — the timer, dominant */}
        <div className="px-5 pt-5">
          <p className="text-[9.5px] font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em' }}>
            Elapsed
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className="text-[54px] font-semibold leading-none tabular-nums"
              style={{ color: sealed ? MINT : 'white', letterSpacing: '-0.035em' }}
            >
              {elapsed.toFixed(1)}
            </span>
            <span className="text-[18px]" style={{ color: 'rgba(255,255,255,0.35)' }}>s</span>
          </div>
        </div>

        {/* Step fields — fill in as we go */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 px-5 pt-6 pb-5">
          <StepField n="01" label="Approach" active={stepN >= 1} />
          <StepField n="02" label="Listen" active={stepN >= 2} />
          <StepField n="03" label="Route" active={stepN >= 3} value={stepN >= 3 ? (route?.short || '—') : null} />
          <StepField n="04" label="Log" active={stepN >= 4} value={stepN >= 4 ? (accepted === null ? '—' : accepted ? 'Accepted' : 'Declined') : null} />
        </div>

        {/* Perforation */}
        <div className="relative mx-5 my-0.5" style={{ borderTop: '1px dashed rgba(255,255,255,0.18)' }}>
          <span className="absolute -left-[20px] -top-[8px] h-4 w-4 rounded-full" style={{ background: WALLET_BG }} />
          <span className="absolute -right-[20px] -top-[8px] h-4 w-4 rounded-full" style={{ background: WALLET_BG }} />
        </div>

        {/* Footer: hash + compliance */}
        <div className="flex items-center justify-between px-5 pb-4 pt-4">
          <div>
            <p className="text-[9px] font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em' }}>Hash</p>
            <p className="mt-0.5 text-[11px] tabular-nums" style={{ color: sealed ? MINT : 'rgba(255,255,255,0.6)', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
              {sealed ? '0x7a3e…b91d' : '—'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-semibold uppercase" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.14em' }}>Compliance</p>
            <p className="mt-0.5 text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>
              OSHA · ADA · HIPAA
            </p>
          </div>
        </div>

        {/* Sealed stamp */}
        {sealed && (
          <div className="pointer-events-none absolute right-5 top-[52%] bfp-stamp" style={{ transformOrigin: 'center' }}>
            <div className="rounded-md border-2 px-3 py-1.5 text-[13px] font-black uppercase" style={{ borderColor: MINT, color: MINT, letterSpacing: '0.14em', transform: 'rotate(-12deg)' }}>
              Sealed
            </div>
          </div>
        )}
      </div>

      {/* Ghost "next pass" peeking below (Wallet vibe) */}
      <div className="mx-2 mt-[-6px] h-4 rounded-b-[22px]" style={{ background: 'rgba(0,0,0,0.06)' }} />
      <div className="mx-4 mt-[-2px] h-3 rounded-b-[22px]" style={{ background: 'rgba(0,0,0,0.04)' }} />
    </div>
  );
}

function StepField({ n, label, active, value }) {
  return (
    <div className={active ? 'bfp-field' : ''} style={{ opacity: active ? 1 : 0.38 }}>
      <div className="flex items-center gap-1.5">
        <span className="text-[9.5px] font-semibold tabular-nums" style={{ color: active ? MINT : 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>
          {n}
        </span>
        {active && (
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7.5 L5.5 10.5 L11.5 4"
              stroke={MINT}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 18, strokeDashoffset: 18, animation: 'bfp-draw 300ms ease-out forwards' }}
            />
          </svg>
        )}
      </div>
      <p className="mt-0.5 text-[13.5px] font-medium" style={{ color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em' }}>
        {label}
      </p>
      {value !== undefined && value !== null && (
        <p className="mt-0.5 text-[10.5px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{value}</p>
      )}
    </div>
  );
}

// ─────────────────────────── PANELS ───────────────────────────

function IdlePanel({ onBegin }) {
  return (
    <div className="bfp-up">
      <h1 className="text-[28px] font-semibold leading-[1.1]" style={{ letterSpacing: '-0.025em' }}>
        A pass that builds<br />as you act.
      </h1>
      <p className="mt-3 text-[14px] leading-[1.45]" style={{ color: INK_2 }}>
        Run the Butterfly protocol once. Watch it seal itself into an audit-ready, privacy-preserving receipt.
      </p>
      <div className="mt-7 flex gap-3">
        <Chip>30 seconds</Chip>
        <Chip>Zero PII</Chip>
        <Chip>Auto-purge 90d</Chip>
      </div>
      <button
        onClick={onBegin}
        className="mt-8 w-full rounded-2xl py-[18px] text-[17px] font-semibold transition-transform active:scale-[0.98]"
        style={{ background: INK, color: 'white', letterSpacing: '-0.005em', boxShadow: `0 8px 20px -6px rgba(0,0,0,0.35)` }}
      >
        Begin the protocol
      </button>
    </div>
  );
}

function ApproachPanel({ onNext }) {
  return (
    <div className="bfp-up">
      <ActionOverline>Step 1 · Approach</ActionOverline>
      <h2 className="mt-2 text-[22px] font-semibold leading-[1.2]" style={{ letterSpacing: '-0.018em' }}>
        Say what you noticed. Specifically.
      </h2>
      <div className="mt-4 rounded-2xl p-4" style={{ background: 'white', border: `1px solid ${HAIR}` }}>
        <p className="text-[10px] font-semibold uppercase" style={{ color: INK_2, letterSpacing: '0.12em' }}>Try saying</p>
        <p className="mt-2 text-[15px] leading-[1.4] font-medium" style={{ color: INK }}>
          "Hey — I've noticed you've been quiet this week. You missed both standups. You okay?"
        </p>
      </div>
      <button onClick={onNext} className="mt-5 w-full rounded-2xl py-[16px] text-[16px] font-semibold transition-transform active:scale-[0.98]" style={{ background: TEAL, color: 'white', letterSpacing: '-0.005em' }}>
        I said it
      </button>
    </div>
  );
}

function ListenPanel({ onNext }) {
  return (
    <div className="bfp-up">
      <ActionOverline>Step 2 · Listen</ActionOverline>
      <h2 className="mt-2 text-[22px] font-semibold leading-[1.2]" style={{ letterSpacing: '-0.018em' }}>
        Don't fix. Don't diagnose.
      </h2>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {['Let them talk', 'No advice', 'Silence is fine'].map((t) => (
          <div key={t} className="rounded-xl p-3 text-center" style={{ background: 'white', border: `1px solid ${HAIR}` }}>
            <p className="text-[11.5px] font-medium leading-[1.3]" style={{ color: INK }}>{t}</p>
          </div>
        ))}
      </div>
      <button onClick={onNext} className="mt-5 w-full rounded-2xl py-[16px] text-[16px] font-semibold transition-transform active:scale-[0.98]" style={{ background: TEAL, color: 'white', letterSpacing: '-0.005em' }}>
        I listened
      </button>
    </div>
  );
}

function RoutePanel({ onPick }) {
  const resources = [
    { key: '988', title: '988 Lifeline', sub: 'Call or text · 24/7', short: '988', badge: 'Crisis' },
    { key: 'eap', title: 'Lyra Health (EAP)', sub: 'Free confidential therapy', short: 'Lyra Health', badge: 'Therapy' },
    { key: 'counselor', title: 'Dr. Kim · on-site', sub: 'Wed & Fri, walk-in', short: 'Dr. Kim', badge: 'On-site' },
  ];
  return (
    <div className="bfp-up">
      <ActionOverline>Step 3 · Route</ActionOverline>
      <h2 className="mt-2 text-[22px] font-semibold leading-[1.2]" style={{ letterSpacing: '-0.018em' }}>
        Offer one resource.
      </h2>
      <div className="mt-4 space-y-2">
        {resources.map((r) => (
          <button key={r.key} onClick={() => onPick(r)} className="w-full rounded-2xl px-4 py-3 text-left transition-all active:scale-[0.99]" style={{ background: 'white', border: `1px solid ${HAIR}` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14.5px] font-semibold" style={{ color: INK, letterSpacing: '-0.005em' }}>{r.title}</p>
                <p className="text-[11.5px]" style={{ color: INK_2 }}>{r.sub}</p>
              </div>
              <span className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase" style={{ background: `${TEAL}15`, color: TEAL, letterSpacing: '0.06em' }}>{r.badge}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function OutcomePanel({ route, onPick }) {
  return (
    <div className="bfp-up">
      <ActionOverline>Step 4 · Log</ActionOverline>
      <h2 className="mt-2 text-[22px] font-semibold leading-[1.2]" style={{ letterSpacing: '-0.018em' }}>
        Did they accept {route?.short}?
      </h2>
      <p className="mt-2 text-[12.5px]" style={{ color: INK_2 }}>
        One tap — that's the whole log. Either answer records the same.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={() => onPick(true)} className="rounded-2xl py-5 text-[16px] font-semibold transition-transform active:scale-[0.97]" style={{ background: TEAL, color: 'white' }}>Accepted</button>
        <button onClick={() => onPick(false)} className="rounded-2xl py-5 text-[16px] font-semibold transition-transform active:scale-[0.97]" style={{ background: 'white', color: INK, border: `1px solid ${HAIR}` }}>Declined</button>
      </div>
    </div>
  );
}

function SealedPanel({ onReset }) {
  return (
    <div className="bfp-up">
      <h2 className="text-[26px] font-semibold leading-[1.1]" style={{ letterSpacing: '-0.022em' }}>
        Pass sealed to the ledger.
      </h2>
      <div className="mt-4 space-y-1.5">
        <Fact>No name recorded</Fact>
        <Fact>No notes, no diagnosis</Fact>
        <Fact>Cannot be used in performance reviews</Fact>
        <Fact>Auto-purges in 90 days</Fact>
      </div>
      <button onClick={onReset} className="mt-6 w-full rounded-2xl py-[16px] text-[15px] font-semibold transition-transform active:scale-[0.98]" style={{ background: SURFACE, color: INK }}>
        Build a new pass
      </button>
      <p className="mt-4 text-center text-[11px]" style={{ color: INK_3 }}>butterfly.one</p>
    </div>
  );
}

function ActionOverline({ children }) {
  return <p className="text-[10.5px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.14em' }}>{children}</p>;
}

function Chip({ children }) {
  return (
    <span className="rounded-full px-3 py-1.5 text-[11px] font-medium" style={{ background: 'white', color: INK, border: `1px solid ${HAIR}`, letterSpacing: '-0.005em' }}>
      {children}
    </span>
  );
}

function Fact({ children }) {
  return (
    <div className="flex items-center gap-2">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7.5 L5.5 10.5 L11.5 4" stroke={TEAL} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[13px]" style={{ color: INK_2 }}>{children}</span>
    </div>
  );
}
