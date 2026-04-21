import { useState, useEffect, useRef } from 'react';

// ────────────────────────────────────────────────────────────────────
// BUTTERFLY — V1 THE CONVERSATION
// The protocol embedded in iMessage. You watch it happen live.
// Contrasting UI: chat bubbles → action sheets → banners → receipt modal.
// ────────────────────────────────────────────────────────────────────

const TEAL = '#0A4AD6';
const IOS_BLUE = '#007AFF';
const INK = '#000000';
const INK_2 = '#8E8E93';
const INK_3 = '#C7C7CC';
const HAIR = '#E5E5EA';
const BUBBLE_IN = '#E9E9EB';
const CHAT_BG = '#FFFFFF';
const SHEET_BG = '#F2F2F7';

const Mark = ({ size = 18, color = TEAL }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 100 86" fill="none">
    <path d="M50 60 C 40 12, 8 12, 8 38 C 8 62, 34 72, 50 60 Z" fill={color} opacity="0.92" />
    <path d="M50 60 C 60 12, 92 12, 92 38 C 92 62, 66 72, 50 60 Z" fill={color} opacity="0.68" />
    <line x1="50" y1="16" x2="50" y2="78" stroke={color} strokeWidth="1" opacity="0.3" />
  </svg>
);

export default function ButterflyConversation() {
  const [phase, setPhase] = useState('idle');
  // idle → sheet1 → waiting → replied → sheet3 → sent → outcome → done
  const [messages, setMessages] = useState(initialMessages);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [chosenRoute, setChosenRoute] = useState(null);
  const [accepted, setAccepted] = useState(null);
  const [receiptVisible, setReceiptVisible] = useState(false);
  const scrollRef = useRef(null);

  // Timer only runs once the user makes the first tap (startedAt is set there)
  useEffect(() => {
    if (startedAt === null || phase === 'done') return;
    const id = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 100);
    return () => clearInterval(id);
  }, [startedAt, phase]);

  // Auto-scroll the chat to the latest message — iOS Messages behavior
  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    // smooth scroll to the very bottom on any new message
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }, [messages]);

  const openApproachSheet = () => {
    if (startedAt === null) setStartedAt(Date.now());
    setPhase('sheet1');
  };

  const sendApproach = () => {
    setMessages((m) => [
      ...m,
      { from: 'you', text: "Hey — I've noticed you've been quiet this week. You missed both standups. You okay?", ts: 'Now' },
    ]);
    setPhase('waiting');
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'typing' }]);
    }, 700);
    setTimeout(() => {
      setMessages((m) => [
        ...m.filter((x) => x.from !== 'typing'),
        { from: 'jamie', text: "yeah honestly it's been a rough stretch. family stuff. thanks for asking, means a lot" },
      ]);
      setPhase('replied');
    }, 2600);
  };

  const openRouteSheet = () => setPhase('sheet3');

  const pickRoute = (r) => {
    setChosenRoute(r);
    setPhase('sent');
    setMessages((m) => [...m, { from: 'you', kind: 'resource', resource: r }]);
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'typing' }]);
    }, 600);
    setTimeout(() => {
      setMessages((m) => [
        ...m.filter((x) => x.from !== 'typing'),
        { from: 'jamie', text: r.key === '988' ? 'ok. thank you.' : "oh i didn't know we had that. i'll reach out" },
      ]);
      setPhase('outcome');
    }, 2200);
  };

  const logOutcome = (didAccept) => {
    const finalElapsed = (Date.now() - startedAt) / 1000;
    setAccepted(didAccept);
    setElapsed(finalElapsed);
    setPhase('done');
    // Post a closing system line so the chat has a satisfying end state even
    // once the receipt is dismissed
    setMessages((m) => [
      ...m,
      {
        kind: 'system',
        text: `Check-in sealed · ${finalElapsed.toFixed(1)}s · ${didAccept ? 'Accepted' : 'Declined'} · no names saved`,
      },
    ]);
    setReceiptVisible(true);
  };

  const dismissReceipt = () => setReceiptVisible(false);
  const reopenReceipt = () => setReceiptVisible(true);

  const reset = () => {
    setPhase('idle');
    setMessages(initialMessages);
    setStartedAt(null);
    setElapsed(0);
    setChosenRoute(null);
    setAccepted(null);
    setReceiptVisible(false);
  };

  return (
    <div
      className="w-full flex items-stretch justify-center"
      style={{
        background: '#EFEFEF',
        height: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes bf-slideup { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bf-slidedown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bf-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bf-bubble-in { from { opacity: 0; transform: translateY(6px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes bf-dot { 0%,60%,100% { opacity: 0.3; } 30% { opacity: 1; } }
        .bf-bubble { animation: bf-bubble-in 260ms cubic-bezier(0.2,0.9,0.3,1.2) both; }
        .bf-sheet  { animation: bf-slideup 340ms cubic-bezier(0.2,0.9,0.3,1) both; }
        .bf-banner { animation: bf-slidedown 400ms cubic-bezier(0.2,0.9,0.3,1) both; }
        .bf-fade   { animation: bf-fade 500ms ease both; }
      `}</style>

      <div className="relative flex w-full max-w-[430px] flex-col overflow-hidden" style={{ background: CHAT_BG, height: '100%' }}>
        {/* iOS status bar — time left, signal/wifi/battery right (Dynamic Island occupies the middle via the phone frame) */}
        <div className="relative z-20 flex items-center justify-between px-7 pt-3 pb-1 shrink-0" style={{ color: INK, fontSize: 15 }}>
          <span className="font-semibold tabular-nums" style={{ fontSize: 15, letterSpacing: '-0.01em' }}>9:41</span>
          <div className="flex items-center gap-1.5">
            {/* Cellular signal — 4 bars */}
            <svg width="18" height="10" viewBox="0 0 18 10" fill="currentColor" aria-hidden>
              <rect x="0" y="7" width="3" height="3" rx="0.5" />
              <rect x="4.5" y="5" width="3" height="5" rx="0.5" />
              <rect x="9" y="2.5" width="3" height="7.5" rx="0.5" />
              <rect x="13.5" y="0" width="3" height="10" rx="0.5" />
            </svg>
            {/* Wi-Fi */}
            <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden>
              <path d="M8 1.6c-2.85 0-5.45 1.05-7.45 2.8.45.4.85.8 1.3 1.2 1.7-1.45 3.85-2.35 6.15-2.35 2.3 0 4.45.9 6.15 2.35l1.3-1.2C13.45 2.65 10.85 1.6 8 1.6z" />
              <path d="M8 5.2c-1.8 0-3.45.7-4.7 1.8.45.4.85.8 1.3 1.2.95-.85 2.1-1.35 3.4-1.35s2.45.5 3.4 1.35l1.3-1.2C11.45 5.9 9.8 5.2 8 5.2z" />
              <circle cx="8" cy="9.6" r="1.4" />
            </svg>
            {/* Battery — 80% */}
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none" aria-hidden>
              <rect x="0.5" y="0.5" width="22" height="11" rx="3.3" stroke="currentColor" strokeOpacity="0.38" />
              <rect x="2" y="2" width="15" height="8" rx="1.8" fill="currentColor" />
              <rect x="23.5" y="4" width="1.8" height="4" rx="0.5" fill="currentColor" fillOpacity="0.38" />
            </svg>
          </div>
        </div>

        {/* Messages nav bar — back chevron + avatar+name centered + FaceTime icon right */}
        <div
          className="relative z-10 backdrop-blur-xl shrink-0"
          style={{ background: 'rgb(255, 255, 255)', borderBottom: `0.5px solid ${HAIR}` }}
        >
          <div className="flex items-center justify-between px-3 pt-2 pb-2.5">
            <button className="flex items-center gap-0 pl-1 py-1" aria-label="Back" style={{ color: IOS_BLUE }}>
              <svg width="12" height="19" viewBox="0 0 12 19" fill="none" aria-hidden>
                <path d="M10 2L2 9.5L10 17" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-0.5 text-[10px] font-semibold tabular-nums" style={{ color: IOS_BLUE, background: IOS_BLUE, borderRadius: '999px', color: 'white', padding: '1px 5px', letterSpacing: 0 }}>2</span>
            </button>
            <div className="flex flex-col items-center gap-1">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold"
                style={{
                  background: 'linear-gradient(135deg, #d912bb, #70046e)',
                  color: '#ffffff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08) inset',
                }}
              >
                J
              </div>
              <div className="flex items-center gap-0.5">
                <p className="text-[11px] font-medium" style={{ color: INK, letterSpacing: '-0.005em' }}>Jamie</p>
                <svg className='mt-1' width="7" height="11" viewBox="0 0 7 11" fill="currentColor" style={{ color: INK_3 }} aria-hidden>
                  <path d="M1 1l5 4.5-5 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            {/* FaceTime (video) icon */}
            <button className="p-1.5" aria-label="FaceTime">
              <svg width="24" height="15" viewBox="0 0 24 15" fill="currentColor" style={{ color: IOS_BLUE }} aria-hidden>
                <rect x="0" y="0.5" width="17" height="14" rx="3.5" />
                <path d="M17.5 5 L 23.5 1.5 L 23.5 13.5 L 17.5 10 Z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat body — scrollable, flex-fill so it pushes the compose bar to the bottom */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 pb-[120px] pt-2 min-h-0" style={{ background: CHAT_BG }}>
          {messages.map((m, i) => <MessageRow key={i} m={m} />)}
        </div>

        {/* Compose bar + suggestion — rendered across all phases (including `done`, which shows a post-protocol action bar) */}
        <div className="absolute bottom-0 left-0 right-0 z-20" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderTop: `0.5px solid ${HAIR}` }}>
          {phase === 'idle' && <SuggestionBar label="Open with what you noticed" sublabel="Butterfly · Step 1 Approach" onTap={openApproachSheet} />}
          {phase === 'replied' && <SuggestionBar label="Offer one specific resource" sublabel="Butterfly · Step 3 Route" onTap={openRouteSheet} />}
          {phase === 'outcome' && <OutcomeBar onAccept={() => logOutcome(true)} onDecline={() => logOutcome(false)} />}
          {(phase === 'waiting' || phase === 'sheet1' || phase === 'sheet3' || phase === 'sent') && <ComposeBarPlaceholder />}
          {phase === 'done' && <DoneActionBar elapsed={elapsed} onViewReceipt={reopenReceipt} onReset={reset} />}
          {/* Home indicator provided by PhoneFrame — bottom padding instead */}
          <div className="pb-5" />
        </div>

        {/* Live-activity timer pill — below nav bar, right side. Appears after first tap. */}
        {startedAt !== null && phase !== 'done' && (
          <div className="absolute right-3 top-[102px] z-30 bf-fade">
            <div
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] tabular-nums"
              style={{
                color: TEAL,
                background: 'rgba(255,255,255,0.98)',
                border: `1px solid ${TEAL}30`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: TEAL, animation: 'bf-dot 1.2s infinite' }}
              />
              <Mark size={8} color={TEAL} />
              <span className="font-semibold">{elapsed.toFixed(1)}s</span>
            </div>
          </div>
        )}

        {/* Sheet: Approach */}
        {phase === 'sheet1' && (
          <Sheet onDismiss={() => setPhase('idle')}>
            <SheetHeader overline="Protocol · Step 1 Approach" title="Say what you noticed." onCancel={() => setPhase('idle')} />
            <div className="px-5 pb-2">
              <p className="text-[13px] leading-[1.45]" style={{ color: INK_2 }}>
                Be specific. Generic concern feels performative.
              </p>
              <div className="mt-4 rounded-2xl p-4" style={{ background: 'white', border: `0.5px solid ${HAIR}` }}>
                <p className="text-[11px] font-semibold uppercase" style={{ color: INK_2, letterSpacing: '0.1em' }}>Suggested message</p>
                <p className="mt-2 text-[16px] leading-[1.4]" style={{ color: INK }}>
                  "Hey — I've noticed you've been quiet this week. You missed both standups. You okay?"
                </p>
              </div>
            </div>
            <SheetActions>
              <button onClick={sendApproach} className="w-full rounded-2xl py-4 text-[17px] font-semibold transition-transform active:scale-[0.98]" style={{ background: TEAL, color: 'white' }}>
                Send to Jamie
              </button>
              <button onClick={() => setPhase('idle')} className="mt-2 w-full py-3 text-[17px]" style={{ color: IOS_BLUE }}>
                Cancel
              </button>
            </SheetActions>
          </Sheet>
        )}

        {/* Sheet: Route */}
        {phase === 'sheet3' && (
          <Sheet onDismiss={() => setPhase('replied')}>
            <SheetHeader overline="Protocol · Step 3 Route" title="Offer one resource." onCancel={() => setPhase('replied')} />
            <div className="px-4 pb-4">
              <p className="px-1 text-[13px] leading-[1.45]" style={{ color: INK_2 }}>Pre-configured by your HR team.</p>
              <div className="mt-4 space-y-2">
                {resources.map((r) => (
                  <button key={r.key} onClick={() => pickRoute(r)} className="w-full rounded-2xl px-4 py-3.5 text-left transition-all active:scale-[0.99]" style={{ background: 'white', border: `0.5px solid ${HAIR}` }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[15px] font-medium" style={{ color: INK }}>{r.title}</p>
                        <p className="mt-0.5 text-[12px]" style={{ color: INK_2 }}>{r.sub}</p>
                      </div>
                      <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase" style={{ background: `${TEAL}15`, color: TEAL, letterSpacing: '0.06em' }}>{r.badge}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Sheet>
        )}

        {/* Receipt sheet — iOS-style, dismissible. Stays mounted during `done` so
            it can slide back up when the user taps "View receipt" after dismissing. */}
        {phase === 'done' && (
          <DoneOverlay
            visible={receiptVisible}
            elapsed={elapsed}
            route={chosenRoute}
            accepted={accepted}
            onReset={reset}
            onDismiss={dismissReceipt}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── helpers ───────────────────────────

const initialMessages = [
  { kind: 'date', text: 'Monday' },
  { from: 'jamie', text: "heading out early today, not feeling great" },
  { from: 'you', text: "of course, feel better" },
  { kind: 'system', text: 'Jamie missed Monday 10am standup' },
  { kind: 'system', text: 'Jamie missed Thursday 10am standup' },
  { kind: 'date', text: 'Today 2:14 PM' },
];

const resources = [
  { key: '988', title: '988 Lifeline', sub: 'Call or text · 24/7', badge: 'Crisis', msg: 'no pressure — but if things ever feel worse, 988 is free, confidential, and 24/7. text or call.' },
  { key: 'eap', title: 'Lyra Health (EAP)', sub: 'Free · confidential therapy', badge: 'Therapy', msg: "also — i didn't realize we had Lyra through the company. totally confidential, free, and separate from HR. lyrahealth.com if you want." },
  { key: 'counselor', title: 'Dr. Kim', sub: 'On-site · Wed & Fri', badge: 'On-site', msg: "also — Dr. Kim does on-site hours Wed & Fri, totally confidential. you can just walk in." },
];

function MessageRow({ m }) {
  if (m.kind === 'date') {
    return <div className="bf-fade my-3 text-center text-[11px] font-semibold" style={{ color: INK_2, letterSpacing: '0.02em' }}>{m.text}</div>;
  }
  if (m.kind === 'system') {
    return <div className="bf-fade mx-auto my-2 max-w-[85%] rounded-md px-3 py-1 text-center text-[10.5px]" style={{ background: '#F5F5F7', color: INK_2 }}>{m.text}</div>;
  }
  if (m.from === 'typing') {
    return (
      <div className="bf-bubble mb-1 flex justify-start">
        <div className="flex gap-1 rounded-[18px] px-3.5 py-3" style={{ background: BUBBLE_IN }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: INK_2, animation: 'bf-dot 1.2s infinite' }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: INK_2, animation: 'bf-dot 1.2s infinite 0.2s' }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: INK_2, animation: 'bf-dot 1.2s infinite 0.4s' }} />
        </div>
      </div>
    );
  }
  if (m.kind === 'resource') {
    return (
      <div className="bf-bubble mb-1 flex justify-end">
        <div className="max-w-[76%] overflow-hidden rounded-[18px]" style={{ background: IOS_BLUE }}>
          <p className="px-3.5 pt-2.5 text-[15.5px] leading-[1.35] text-white">{m.resource.msg}</p>
          <div className="mt-2 flex items-center gap-2 px-3.5 py-2" style={{ background: 'rgba(0,0,0,0.12)' }}>
            <Mark size={12} color="white" />
            <p className="text-[11.5px] font-medium text-white">{m.resource.title}</p>
          </div>
        </div>
      </div>
    );
  }
  const isYou = m.from === 'you';
  return (
    <div className={`bf-bubble mb-1 flex ${isYou ? 'justify-end' : 'justify-start'}`}>
      <div
        className="max-w-[76%] rounded-[18px] px-3.5 py-2 text-[15.5px] leading-[1.35]"
        style={{
          background: isYou ? IOS_BLUE : BUBBLE_IN,
          color: isYou ? 'white' : INK,
        }}
      >
        {m.text}
      </div>
    </div>
  );
}

function SuggestionBar({ label, sublabel, onTap }) {
  return (
    <button onClick={onTap} className="w-full px-3 pt-3 pb-2 text-left transition-transform active:scale-[0.99]">
      <div className="flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}33` }}>
        <div className="flex items-center gap-2.5">
          <Mark size={16} color={TEAL} />
          <div>
            <p className="text-[10px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.1em' }}>{sublabel}</p>
            <p className="text-[14px] font-medium" style={{ color: INK }}>{label}</p>
          </div>
        </div>
        <span className="text-[18px]" style={{ color: TEAL }}>→</span>
      </div>
    </button>
  );
}

function OutcomeBar({ onAccept, onDecline }) {
  return (
    <div className="px-3 pt-3 pb-2">
      <div className="rounded-2xl p-3" style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}33` }}>
        <p className="mb-2.5 text-[11px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.1em' }}>Butterfly · Step 4 Log</p>
        <p className="mb-3 text-[14px]" style={{ color: INK }}>Did Jamie accept the resource?</p>
        <div className="flex gap-2">
          <button onClick={onAccept} className="flex-1 rounded-xl py-2.5 text-[15px] font-semibold active:scale-[0.98]" style={{ background: TEAL, color: 'white' }}>Accepted</button>
          <button onClick={onDecline} className="flex-1 rounded-xl py-2.5 text-[15px] font-semibold active:scale-[0.98]" style={{ background: 'white', color: INK, border: `1px solid ${HAIR}` }}>Declined</button>
        </div>
      </div>
    </div>
  );
}

function ComposeBarPlaceholder() {
  return (
    <div className="flex items-center gap-2 px-3 pt-2 pb-2">
      <button
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ background: '#F5F5F7', color: INK_2 }}
        aria-label="Add"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <div
        className="flex-1 flex items-center justify-between rounded-full pl-4 pr-1 py-1 text-[14px]"
        style={{ background: 'white', color: INK_3, border: `0.5px solid ${HAIR}` }}
      >
        <span>iMessage</span>
        {/* Voice note mic */}
        <button
          className="flex h-6 w-6 items-center justify-center rounded-full"
          style={{ color: INK_2 }}
          aria-label="Record voice"
        >
          <svg width="11" height="14" viewBox="0 0 11 14" fill="currentColor" aria-hidden>
            <rect x="3" y="0" width="5" height="8" rx="2.5" />
            <path d="M1 6.5v0.5a4.5 4.5 0 009 0v-0.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <line x1="5.5" y1="11.5" x2="5.5" y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Sheet({ children, onDismiss }) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bf-fade">
      <div onClick={onDismiss} className="flex-1" style={{ background: 'rgba(0,0,0,0.35)' }} />
      <div className="rounded-t-[20px] pt-2 pb-6 bf-sheet" style={{ background: SHEET_BG }}>
        <div className="mx-auto mb-2 h-[5px] w-10 rounded-full" style={{ background: INK_3 }} />
        {children}
      </div>
    </div>
  );
}

function SheetHeader({ overline, title, onCancel }) {
  return (
    <div className="px-5 pt-2 pb-3">
      <p className="text-[11px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.12em' }}>{overline}</p>
      <div className="mt-1 flex items-baseline justify-between gap-3">
        <h3 className="text-[22px] font-semibold leading-tight" style={{ color: INK, letterSpacing: '-0.02em' }}>{title}</h3>
      </div>
    </div>
  );
}

function SheetActions({ children }) { return <div className="px-5 pt-2">{children}</div>; }

/**
 * iOS-style bottom-sheet receipt.
 * Dismissible by: tapping the drag handle, tapping the backdrop, or swiping the sheet down.
 * When `visible` is false the sheet slides down and the backdrop fades out — chat underneath becomes visible.
 */
function DoneOverlay({ visible, elapsed, route, accepted, onReset, onDismiss }) {
  const [dragY, setDragY] = useState(0);
  const dragRef = useRef({ startY: 0, active: false });

  const handlePointerDown = (e) => {
    dragRef.current.startY = e.clientY;
    dragRef.current.active = true;
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
  };
  const handlePointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dy = Math.max(0, e.clientY - dragRef.current.startY);
    setDragY(dy);
  };
  const handlePointerUp = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    // If dragged more than 80px, dismiss. Otherwise, snap back.
    if (dragY > 80) {
      setDragY(0);
      onDismiss?.();
    } else {
      setDragY(0);
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col"
      style={{
        background: visible ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'background-color 340ms cubic-bezier(0.2,0.9,0.3,1)',
      }}
      onClick={onDismiss}
    >
      {/* iOS-style notification banner — fades with the backdrop */}
      <div
        className="px-3 pt-2"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-16px)',
          transition: 'opacity 300ms ease, transform 300ms ease',
        }}
      >
        <div className="flex items-center gap-3 rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(24px)' }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: TEAL }}>
            <Mark size={16} color="white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold" style={{ color: INK }}>BUTTERFLY</p>
              <p className="text-[11px]" style={{ color: INK_2 }}>now</p>
            </div>
            <p className="text-[13.5px] font-semibold" style={{ color: INK }}>Check-in logged · no names saved</p>
            <p className="text-[12.5px]" style={{ color: INK_2 }}>Sealed to audit ledger · auto-purges in 90 days</p>
          </div>
        </div>
      </div>

      {/* Receipt card — slides up from bottom, slides down to dismiss */}
      <div
        className="mt-auto rounded-t-[20px]"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          transform: visible ? `translateY(${dragY}px)` : 'translateY(100%)',
          transition: dragRef.current.active ? 'none' : 'transform 360ms cubic-bezier(0.2,0.9,0.3,1)',
          boxShadow: '0 -10px 40px -10px rgba(0,0,0,0.12)',
          touchAction: 'none',
        }}
      >
        {/* Drag handle — tappable + draggable */}
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss?.(); }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex w-full items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          aria-label="Close receipt"
          style={{ touchAction: 'none' }}
        >
          <span className="h-[5px] w-10 rounded-full transition-colors" style={{ background: dragY > 0 ? TEAL : INK_3 }} />
        </button>

        <div className="px-6 pb-5">
          <p className="text-[11px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.12em' }}>Protocol complete</p>
          <div className="mt-2 flex items-baseline gap-3">
            <h2 className="text-[40px] font-semibold leading-none" style={{ color: INK, letterSpacing: '-0.03em' }}>{elapsed.toFixed(1)}s</h2>
            <p className="text-[14px]" style={{ color: INK_2 }}>total</p>
          </div>

          <div className="mt-5 rounded-2xl p-4" style={{ background: '#F5F5F7' }}>
            <div className="space-y-2.5 text-[13px]">
              <Row k="Event" v="Check-in completed" />
              <Row k="Routed to" v={route?.title} />
              <Row k="Resource" v={accepted ? 'Accepted' : 'Declined'} />
              <Row k="Hash" v="0x7a3e…b91d" mono color={TEAL} />
            </div>
            <div className="mt-3.5 space-y-1.5 border-t pt-3" style={{ borderColor: HAIR }}>
              <Fact>No name recorded</Fact>
              <Fact>No notes, no diagnosis</Fact>
              <Fact>Auto-purges in 90 days</Fact>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-1 text-[11px] font-semibold" style={{ color: INK_2, letterSpacing: '0.02em' }}>
            <span>COMPLIANT BY DESIGN</span>
            <span style={{ color: INK }}>OSHA · ADA · HIPAA</span>
          </div>
        </div>

        <div className="px-5 pb-7 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss?.(); }}
            className="flex-1 rounded-2xl py-3.5 text-[15px] font-medium active:scale-[0.98]"
            style={{ background: '#F5F5F7', color: INK }}
          >
            Close
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onReset(); }}
            className="flex-1 rounded-2xl py-3.5 text-[15px] font-semibold active:scale-[0.98]"
            style={{ background: TEAL, color: 'white' }}
          >
            Run it again
          </button>
        </div>
        <p className="pb-3 text-center text-[11px]" style={{ color: INK_2 }}>butterfly.one</p>
      </div>
    </div>
  );
}

/**
 * Post-protocol action bar — shows at the bottom of the chat once the receipt has been dismissed.
 * Lets the user re-open the receipt or start fresh, mirroring SuggestionBar visual language.
 */
function DoneActionBar({ elapsed, onViewReceipt, onReset }) {
  return (
    <div className="px-3 pt-3 pb-2">
      <div className="rounded-2xl p-3" style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}33` }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0" style={{ background: TEAL }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2.5 7.5 L5.5 10.5 L11.5 4" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.1em' }}>Sealed · {elapsed.toFixed(1)}s</p>
              <p className="text-[13px] font-medium truncate" style={{ color: INK }}>Check-in logged. No names saved.</p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onViewReceipt}
              className="rounded-full px-3 py-1.5 text-[12px] font-semibold active:scale-[0.97]"
              style={{ background: 'white', color: TEAL, border: `1px solid ${TEAL}40` }}
            >
              Receipt
            </button>
            <button
              onClick={onReset}
              className="rounded-full px-3 py-1.5 text-[12px] font-semibold active:scale-[0.97]"
              style={{ background: TEAL, color: 'white' }}
            >
              Run again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, mono, color = INK }) {
  return (
    <div className="flex items-baseline justify-between">
      <span style={{ color: INK_2 }}>{k}</span>
      <span className="font-medium" style={{ color, fontFamily: mono ? 'ui-monospace, "SF Mono", Menlo, monospace' : 'inherit' }}>{v}</span>
    </div>
  );
}

function Fact({ children }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7.5 L5.5 10.5 L11.5 4" stroke={TEAL} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[12.5px]" style={{ color: INK_2 }}>{children}</span>
    </div>
  );
}
