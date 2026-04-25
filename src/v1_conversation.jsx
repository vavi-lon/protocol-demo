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
const BUBBLE_IN_NAKED = '#ece2cb'; // warm taupe — reads on the message-card surface
const CARD_CREAM = '#fbf4ea'; // matches ProtocolConversationSection message-card bg (which matches section cream)
const CHAT_BG = '#FFFFFF';
const SHEET_BG = '#F2F2F7';

const Mark = ({ size = 18, color = TEAL }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 100 86" fill="none">
    <path d="M50 60 C 40 12, 8 12, 8 38 C 8 62, 34 72, 50 60 Z" fill={color} opacity="0.92" />
    <path d="M50 60 C 60 12, 92 12, 92 38 C 92 62, 66 72, 50 60 Z" fill={color} opacity="0.68" />
    <line x1="50" y1="16" x2="50" y2="78" stroke={color} strokeWidth="1" opacity="0.3" />
  </svg>
);

export default function ButterflyConversation({ naked = false, onFirstMessage, onPhaseChange, onElapsed, onReceiptVisibleChange, minHeight } = {}) {
  // Backdrop color used by DoneOverlay — warm dim for naked mode, neutral black otherwise
  const overlayBackdrop = naked ? 'rgba(48,28,10,0.55)' : 'rgba(0,0,0,0.45)';
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

  // Notify parent on every phase change — lets the scene react (bg tone, Jamie's status, etc.)
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  // Notify parent of elapsed-timer updates + whether the timer is currently running
  useEffect(() => {
    const active = startedAt !== null && phase !== 'done';
    onElapsed?.(elapsed, active);
  }, [elapsed, startedAt, phase, onElapsed]);

  // Notify parent when the receipt overlay opens/closes — lets the scene fade Jamie's header
  // out of the way so the notification/receipt can hold the spotlight
  useEffect(() => {
    onReceiptVisibleChange?.(phase === 'done' && receiptVisible);
  }, [phase, receiptVisible, onReceiptVisibleChange]);

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
    onFirstMessage?.();
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

  // ── Memory Purge (Phase 1 of the Reset Ritual) ─────────────────────────
  //
  // Instead of snapping back to the idle state, `reset()` kicks off a choreographed
  // dissolve: every message breaks apart character-by-character into dust, a muted
  // "Local memory purged" confirmation fades in at centre while the content evaporates,
  // and only *after* the animation settles does state actually wipe. This makes the
  // invisible compliance guarantee (no PII, auto-purge) visually legible.
  //
  // Timings are tuned for users who can see the motion; prefers-reduced-motion skips
  // straight to the instant reset so we don't strand anyone behind an animation.
  const [dissolving, setDissolving] = useState(false);
  const [purgeConfirmVisible, setPurgeConfirmVisible] = useState(false);
  const dissolveTimersRef = useRef([]);

  const clearDissolveTimers = () => {
    dissolveTimersRef.current.forEach((t) => clearTimeout(t));
    dissolveTimersRef.current = [];
  };

  // Instant reset — used under prefers-reduced-motion and as the final wipe at the end
  // of the dissolve sequence.
  const instantReset = () => {
    setPhase('idle');
    setMessages(initialMessages);
    setStartedAt(null);
    setElapsed(0);
    setChosenRoute(null);
    setAccepted(null);
    setReceiptVisible(false);
  };

  const reset = () => {
    clearDissolveTimers();

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      instantReset();
      return;
    }

    // Close the receipt immediately so the dissolve can own the stage
    setReceiptVisible(false);
    setDissolving(true);

    // 500ms in: fade the purge confirmation in over the dissolving chat (earlier so it's visible before the chat fully evaporates)
    dissolveTimersRef.current.push(setTimeout(() => setPurgeConfirmVisible(true), 500));

    // 2400ms in: confirmation starts fading out
    dissolveTimersRef.current.push(setTimeout(() => setPurgeConfirmVisible(false), 2400));

    // 2800ms in: animation is done, the stage is empty — wipe state and un-dissolve
    dissolveTimersRef.current.push(
      setTimeout(() => {
        instantReset();
        setDissolving(false);
      }, 2800),
    );
  };

  // Clear any in-flight timers on unmount so we don't setState on a dead component
  useEffect(() => () => clearDissolveTimers(), []);

  return (
    <div
      className="w-full flex items-stretch justify-center"
      style={{
        background: naked ? 'transparent' : '#EFEFEF',
        height: naked ? 'auto' : '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes bf-slideup { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes bf-slidedown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bf-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bf-bubble-in { from { opacity: 0; transform: translateY(6px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes bf-msg-in-right {
          0%   { opacity: 0; transform: translate(10px, 14px) scale(0.9); filter: blur(3px); }
          55%  { opacity: 1; transform: translate(0, 0) scale(1.025); filter: blur(0); }
          100% { opacity: 1; transform: translate(0, 0) scale(1); }
        }
        @keyframes bf-msg-in-left {
          0%   { opacity: 0; transform: translate(-10px, 14px) scale(0.9); filter: blur(3px); }
          55%  { opacity: 1; transform: translate(0, 0) scale(1.025); filter: blur(0); }
          100% { opacity: 1; transform: translate(0, 0) scale(1); }
        }
        @keyframes bf-send-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(10,74,214,0.45); }
          100% { box-shadow: 0 0 0 18px rgba(10,74,214,0); }
        }
        @keyframes bf-caret-blink { 0%,55% { opacity: 1; } 60%,100% { opacity: 0; } }
        @keyframes bf-dot { 0%,60%,100% { opacity: 0.3; } 30% { opacity: 1; } }
        @keyframes bf-breathe {
          0%,100% { opacity: 1; transform: scale(1); }
          50%     { opacity: 0.72; transform: scale(0.992); }
        }
        .bf-breathe { animation: bf-breathe 3.2s ease-in-out infinite; }
        @keyframes bf-credits-roll {
          0%   { opacity: 0; transform: translateY(36px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .bf-credits-roll > * { animation: bf-credits-roll 900ms cubic-bezier(0.16,1,0.3,1) both; }
        .bf-credits-roll > *:nth-child(1) { animation-delay: 300ms; }
        .bf-credits-roll > *:nth-child(2) { animation-delay: 480ms; }
        .bf-credits-roll > *:nth-child(3) { animation-delay: 640ms; }
        .bf-credits-roll > *:nth-child(4) { animation-delay: 780ms; }
        .bf-credits-roll > *:nth-child(5) { animation-delay: 900ms; }
        @keyframes bf-dissolve-char {
          0%   { opacity: 1; transform: translate(0,0) scale(1) rotate(0deg); filter: blur(0); }
          40%  { opacity: 0.85; transform: translate(calc(var(--bf-dx,0px) * 0.5), -4px) scale(1.08) rotate(calc(var(--bf-dr,0deg) * 0.4)); filter: blur(0.5px); }
          100% { opacity: 0; transform: translate(var(--bf-dx,0px), 40px) scale(0.4) rotate(var(--bf-dr,0deg)); filter: blur(6px); }
        }
        .bf-dissolving .bf-dchar {
          display: inline-block;
          animation: bf-dissolve-char 1200ms cubic-bezier(0.55,0,0.4,1) both;
          will-change: opacity, transform, filter;
        }
        .bf-dissolving .bf-bubble-shell {
          animation: bf-dissolve-bubble 700ms cubic-bezier(0.4,0,0.2,1) 1600ms both;
        }
        @keyframes bf-dissolve-bubble {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.92); }
        }
        /* Whole chat body visibly drains: desaturates + dims so the "this is being destroyed"
           feeling is legible even before individual characters finish their particle dissolve. */
        @keyframes bf-purge-drain {
          0%   { filter: saturate(1) brightness(1); transform: translateY(0); }
          60%  { filter: saturate(0.3) brightness(0.96); transform: translateY(-2px); }
          100% { filter: saturate(0) brightness(0.9); transform: translateY(-6px); opacity: 0; }
        }
        .bf-dissolving { animation: bf-purge-drain 2400ms cubic-bezier(0.4,0,0.2,1) both; }
        .bf-bubble { animation: bf-bubble-in 260ms cubic-bezier(0.2,0.9,0.3,1.2) both; }
        .bf-msg-right { animation: bf-msg-in-right 520ms cubic-bezier(0.2,0.9,0.3,1.15) both; }
        .bf-msg-left  { animation: bf-msg-in-left  520ms cubic-bezier(0.2,0.9,0.3,1.15) both; }
        .bf-send-pulse { animation: bf-send-pulse 700ms ease-out both; }
        .bf-caret { display: inline-block; width: 2px; height: 1em; margin-left: 1px; vertical-align: -2px; background: currentColor; animation: bf-caret-blink 900ms infinite; border-radius: 1px; }
        .bf-sheet  { animation: bf-slideup 340ms cubic-bezier(0.2,0.9,0.3,1) both; }
        .bf-banner { animation: bf-slidedown 400ms cubic-bezier(0.2,0.9,0.3,1) both; }
        .bf-fade   { animation: bf-fade 500ms ease both; }
        .bf-no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .bf-no-scrollbar::-webkit-scrollbar { width: 0; height: 0; display: none; }
        /* Warm-toned subtle scrollbar — matches the cream/taupe palette of the scene.
           Track is transparent, thumb is muted brown that slightly deepens on hover. */
        .bf-warm-scroll { scrollbar-width: thin; scrollbar-color: rgba(120,90,60,0.22) transparent; }
        .bf-warm-scroll::-webkit-scrollbar { width: 6px; }
        .bf-warm-scroll::-webkit-scrollbar-track { background: transparent; }
        .bf-warm-scroll::-webkit-scrollbar-thumb {
          background: rgba(120,90,60,0.22);
          border-radius: 999px;
          transition: background 200ms ease;
        }
        .bf-warm-scroll::-webkit-scrollbar-thumb:hover { background: rgba(120,90,60,0.42); }
      `}</style>

      <div
        className={`relative flex w-full ${naked ? '' : 'max-w-[430px]'} flex-col overflow-hidden`}
        style={{
          background: naked ? 'transparent' : CHAT_BG,
          // When `minHeight` prop is explicitly passed (embedded mode), treat it as
          // a FIXED height — the chat body inside needs a constrained-height parent
          // so its `overflow-y-auto` actually engages and scrolls.
          // When not passed, fall back to the original auto-grow with min 620.
          height: !naked
            ? '100%'
            : minHeight !== undefined
              ? minHeight
              : 'auto',
          minHeight: naked && minHeight === undefined ? 620 : undefined,
        }}
      >
        {/* iOS status bar — time left, signal/wifi/battery right (Dynamic Island occupies the middle via the phone frame) */}
        {!naked && (
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
        )}

        {/* Messages nav bar — hidden entirely in naked mode (Jamie's presence lives in the scene wrapper instead) */}
        {!naked && (
        <div
          className="relative z-10 backdrop-blur-xl shrink-0"
          style={{ background: 'rgb(255, 255, 255)', borderBottom: `0.5px solid ${HAIR}` }}
        >
          <div className="flex items-center justify-between px-3 pt-2 pb-2.5">
            <button className="flex items-center gap-0 pl-1 py-1" aria-label="Back" style={{ color: IOS_BLUE }}>
              <svg width="12" height="19" viewBox="0 0 12 19" fill="none" aria-hidden>
                <path d="M10 2L2 9.5L10 17" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="ml-0.5 text-[10px] font-semibold tabular-nums" style={{ background: IOS_BLUE, borderRadius: '999px', color: 'white', padding: '1px 5px', letterSpacing: 0 }}>2</span>
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
        )}

        {/* Chat body — scrollable in both modes. In naked mode the scroll uses a
            subtle warm-toned scrollbar (`bf-warm-scroll`) that matches the cream
            palette. During the memory purge, `bf-dissolving` triggers per-character
            dissolve animations on every text bubble inside. */}
        <div
          ref={scrollRef}
          className={`${
            naked
              ? 'flex-1 min-h-0 overflow-y-auto bf-warm-scroll px-4 pt-4'
              : 'flex-1 overflow-y-auto px-3 pt-2 min-h-0 pb-[120px]'
          } ${dissolving ? 'bf-dissolving' : ''}`}
          style={{ background: naked ? 'transparent' : CHAT_BG }}
        >
          {messages.map((m, i) => {
            // Stagger only the *initial* messages so they appear sequentially when the
            // demo first mounts. Anything added after first mount (live messages from
            // your interactions) animates immediately with no extra delay.
            const isInitial = i < initialMessages.length;
            const revealDelay = isInitial ? i * 220 : 0;
            return (
            <MessageRow
              key={i}
              m={m}
              naked={naked}
              isFresh={i >= initialMessages.length}
              distanceFromEnd={messages.length - 1 - i}
              dissolving={dissolving}
              revealDelay={revealDelay}
            />
            );
          })}
        </div>

        {/* Compose bar + suggestion — rendered across all phases (including `done`, which shows a post-protocol action bar).
            In naked mode it flows after the messages instead of anchoring to the bottom. */}
        <div
          className={`${naked ? 'relative mt-auto' : 'absolute bottom-0 left-0 right-0'} z-20`}
          style={
            naked
              ? { background: 'transparent', paddingTop: 8 }
              : { background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderTop: `0.5px solid ${HAIR}` }
          }
        >
          {phase === 'idle' && <SuggestionBar label="Open with what you noticed" sublabel="Butterfly · Step 1 Approach" onTap={openApproachSheet} />}
          {phase === 'replied' && <SuggestionBar label="Offer one specific resource" sublabel="Butterfly · Step 3 Route" onTap={openRouteSheet} />}
          {phase === 'outcome' && <OutcomeBar onAccept={() => logOutcome(true)} onDecline={() => logOutcome(false)} />}
          {(phase === 'waiting' || phase === 'sheet1' || phase === 'sheet3' || phase === 'sent') && <ComposeBarPlaceholder />}
          {phase === 'done' && <DoneActionBar elapsed={elapsed} onViewReceipt={reopenReceipt} onReset={reset} />}
          {/* Home indicator provided by PhoneFrame — bottom padding instead */}
          <div className="pb-5" />
        </div>

        {/* Live-activity timer pill — only shown in framed mode; in naked mode the timer is
            rendered in the scene's Jamie header for consistent placement. */}
        {!naked && startedAt !== null && phase !== 'done' && (
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
            backdropColor={overlayBackdrop}
            naked={naked}
          />
        )}

        {/* Purge confirmation — fades in over the dissolving chat during the reset ritual.
            role=status + aria-live so assistive tech announces the purge even when motion is reduced. */}
        {dissolving && (
          <div
            className="pointer-events-none absolute inset-0 z-60 flex items-center justify-center"
            aria-hidden={!purgeConfirmVisible}
          >
            <div
              role="status"
              aria-live="polite"
              className="flex flex-col items-center gap-2 px-6 py-5 rounded-2xl"
              style={{
                background: naked ? 'rgba(251,244,234,0.95)' : 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(180,150,100,0.30)',
                boxShadow: naked
                  ? '0 10px 40px -10px rgba(90,60,30,0.35), 0 0 0 4px rgba(16,185,129,0.08)'
                  : '0 10px 40px -10px rgba(0,0,0,0.25)',
                opacity: purgeConfirmVisible ? 1 : 0,
                transform: purgeConfirmVisible ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(8px)',
                transition: 'opacity 500ms ease, transform 500ms cubic-bezier(0.2,0.9,0.3,1.15)',
                minWidth: 280,
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path d="M3 9 L7.5 13.5 L15 5" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex items-center gap-2 text-[13px] font-bold tracking-wider uppercase" style={{ color: naked ? 'rgba(60,40,20,0.92)' : INK, letterSpacing: '0.12em' }}>
                Local memory purged
              </div>
              <div className="text-[11.5px] text-center" style={{ color: naked ? 'rgba(100,75,45,0.72)' : INK_2, letterSpacing: '0.02em' }}>
                Session closed · no traces kept · hash sealed
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Render a string as per-character spans with a staggered dissolve animation —
// only animates when the surrounding container has `.bf-dissolving`. In all other
// states this is just transparent markup that behaves like normal text.
function DissolveText({ text }) {
  // Fixed horizontal drift seeded off the char index so layout is stable across renders.
  return text.split('').map((ch, i) => {
    const dx = ((i * 37) % 19) - 9; // deterministic -9..+9 px horizontal drift
    const dr = (((i * 29) % 21) - 10) * 1.6; // deterministic -16°..+16° rotation
    return (
      <span
        key={i}
        className="bf-dchar"
        style={{ animationDelay: `${i * 3}ms`, '--bf-dx': `${dx}px`, '--bf-dr': `${dr}deg` }}
      >
        {ch === ' ' ? ' ' : ch}
      </span>
    );
  });
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

function MessageRow({ m, naked = false, isFresh = false, distanceFromEnd = 0, dissolving = false, revealDelay = 0 }) {
  // Focus Mode — in naked scene, older messages fade so the eye stays on the "living" exchange.
  // Typing indicators always show full opacity (they're ephemeral).
  const focusOpacity =
    !naked || m.from === 'typing'
      ? 1
      : distanceFromEnd <= 1
        ? 1
        : distanceFromEnd === 2
          ? 0.7
          : distanceFromEnd === 3
            ? 0.45
            : 0.28;
  const focusStyle = {
    opacity: focusOpacity,
    transition: 'opacity 700ms ease',
    animationDelay: revealDelay ? `${revealDelay}ms` : undefined,
  };

  if (m.kind === 'date') {
    return <div className="bf-fade my-3 text-center text-[11px] font-semibold" style={{ ...focusStyle, color: naked ? 'rgba(90,60,30,0.7)' : INK_2, letterSpacing: '0.02em' }}>{m.text}</div>;
  }
  if (m.kind === 'system') {
    const sysBg = naked ? 'rgba(120,80,40,0.08)' : '#F5F5F7';
    const sysColor = naked ? 'rgba(90,60,30,0.75)' : INK_2;
    return <div className="bf-fade mx-auto my-2 max-w-[85%] rounded-md px-3 py-1 text-center text-[10.5px] italic" style={{ ...focusStyle, background: sysBg, color: sysColor }}>{m.text}</div>;
  }
  if (m.from === 'typing') {
    const dotBg = naked ? BUBBLE_IN_NAKED : BUBBLE_IN;
    const dotColor = naked ? 'rgba(90,60,30,0.6)' : INK_2;
    return (
      <div className="bf-msg-left mb-1 flex justify-start" style={focusStyle}>
        <div className="flex gap-1 rounded-[18px] px-3.5 py-3" style={{ background: dotBg }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor, animation: 'bf-dot 1.2s infinite' }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor, animation: 'bf-dot 1.2s infinite 0.2s' }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor, animation: 'bf-dot 1.2s infinite 0.4s' }} />
        </div>
      </div>
    );
  }
  if (m.kind === 'resource') {
    return (
      <div className="bf-msg-right mb-1 flex justify-end" style={focusStyle}>
        <div
          className={`bf-bubble-shell max-w-[76%] overflow-hidden rounded-[18px] ${isFresh ? 'bf-send-pulse' : ''}`}
          style={{ background: IOS_BLUE }}
        >
          <p className="px-3.5 pt-2.5 text-[15.5px] leading-[1.35] text-white">
            {dissolving ? <DissolveText text={m.resource.msg} /> : m.resource.msg}
          </p>
          <div className="mt-2 flex items-center gap-2 px-3.5 py-2" style={{ background: 'rgba(0,0,0,0.12)' }}>
            <Mark size={12} color="white" />
            <p className="text-[11.5px] font-medium text-white">
              {dissolving ? <DissolveText text={m.resource.title} /> : m.resource.title}
            </p>
          </div>
        </div>
      </div>
    );
  }
  const isYou = m.from === 'you';
  const inBg = naked ? BUBBLE_IN_NAKED : BUBBLE_IN;
  const inColor = naked ? 'rgba(50,30,10,0.92)' : INK;
  return (
    <div className={`${isYou ? 'bf-msg-right' : 'bf-msg-left'} mb-1 flex ${isYou ? 'justify-end' : 'justify-start'}`} style={focusStyle}>
      <div
        className={`bf-bubble-shell max-w-[76%] rounded-[18px] px-3.5 py-2 text-[15.5px] leading-[1.35] ${isYou && isFresh ? 'bf-send-pulse' : ''}`}
        style={{
          background: isYou ? IOS_BLUE : inBg,
          color: isYou ? 'white' : inColor,
        }}
      >
        {dissolving ? <DissolveText text={m.text} /> : m.text}
      </div>
    </div>
  );
}

function SuggestionBar({ label, sublabel, onTap }) {
  return (
    <button onClick={onTap} className="w-full px-3 pt-3 pb-2 text-left transition-transform active:scale-[0.99]">
      <div className="bf-breathe flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}33` }}>
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
      <div className="bf-breathe rounded-2xl p-3" style={{ background: `${TEAL}10`, border: `1px solid ${TEAL}33` }}>
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
function DoneOverlay({ visible, elapsed, route, accepted, onReset, onDismiss, backdropColor = 'rgba(0,0,0,0.45)', naked = false }) {
  const [dragY, setDragY] = useState(0);
  const dragRef = useRef({ startY: 0, active: false });

  // Warm palette used when the overlay renders inside the immersive scene
  const cardBg = naked ? '#fbf4ea' : 'white';
  const panelBg = naked ? 'rgba(120,80,40,0.06)' : '#F5F5F7';
  const buttonBg = naked ? 'rgba(120,80,40,0.08)' : '#F5F5F7';
  const bannerBg = naked ? 'rgba(255,249,235,0.96)' : 'rgba(255,255,255,0.96)';
  const borderCol = naked ? 'rgba(180,150,100,0.25)' : HAIR;
  const mutedText = naked ? 'rgba(90,60,30,0.78)' : INK_2;

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
        background: visible ? backdropColor : 'rgba(0,0,0,0)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'background-color 340ms cubic-bezier(0.2,0.9,0.3,1)',
      }}
      onClick={onDismiss}
    >
      {/* Notification banner — fades with the backdrop. In naked mode, Jamie's avatar + name
          IS the notification's subject (so the profile sits inside it rather than floating above
          a separate floating card). In framed mode, it stays as the classic iOS Butterfly push. */}
      <div
        className={naked ? 'px-4 pt-4' : 'px-3 pt-2'}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-16px)',
          transition: 'opacity 300ms ease, transform 300ms ease',
        }}
      >
        <div
          className={`flex items-center rounded-2xl ${naked ? 'gap-3 px-4 py-3' : 'gap-3 p-3'}`}
          style={{
            background: bannerBg,
            backdropFilter: 'blur(24px)',
            border: naked ? `1px solid ${borderCol}` : 'none',
            boxShadow: naked ? '0 6px 20px -10px rgba(90,60,30,0.2)' : 'none',
          }}
        >
          {naked ? (
            <div
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-semibold text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #d912bb, #70046e)',
                boxShadow: '0 4px 12px -4px rgba(112,4,110,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              J
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg h-9 w-9" style={{ background: TEAL }}>
              <Mark size={16} color="white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <p className={`font-semibold ${naked ? 'text-[13px]' : 'text-[12px]'}`} style={{ color: INK }}>
                {naked ? 'Jamie' : 'BUTTERFLY'}
              </p>
              <p className={`shrink-0 ${naked ? 'text-[11px]' : 'text-[11px]'}`} style={{ color: naked ? mutedText : INK_2 }}>
                {naked ? 'just now · sealed' : 'now'}
              </p>
            </div>
            <p className={`font-semibold truncate ${naked ? 'text-[13px] mt-0.5' : 'text-[13.5px]'}`} style={{ color: INK }}>
              Check-in logged · no names saved
            </p>
            <p className={`truncate ${naked ? 'text-[11.5px]' : 'text-[12.5px]'}`} style={{ color: naked ? mutedText : INK_2 }}>
              Sealed to audit ledger · auto-purges in 90 days
            </p>
          </div>
        </div>
      </div>

      {/* Receipt card — slides up from bottom, slides down to dismiss. In naked mode the slide
          is slower and inner rows stagger in like end-credits, giving a reflective beat. */}
      <div
        className={`mt-auto rounded-t-[20px] ${naked && visible ? 'bf-credits-roll' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: cardBg,
          transform: visible ? `translateY(${dragY}px)` : 'translateY(100%)',
          transition: dragRef.current.active
            ? 'none'
            : naked
              ? 'transform 1100ms cubic-bezier(0.16,1,0.3,1)'
              : 'transform 360ms cubic-bezier(0.2,0.9,0.3,1)',
          boxShadow: naked ? '0 -14px 44px -12px rgba(90,60,30,0.22)' : '0 -10px 40px -10px rgba(0,0,0,0.12)',
          borderTop: naked ? `1px solid ${borderCol}` : 'none',
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

        <div className={naked ? 'px-5 pb-3' : 'px-6 pb-5'}>
          <p className="text-[11px] font-semibold uppercase" style={{ color: TEAL, letterSpacing: '0.12em' }}>Protocol complete</p>
          <div className={`flex items-baseline gap-3 ${naked ? 'mt-1' : 'mt-2'}`}>
            <h2 className={`${naked ? 'text-[30px]' : 'text-[40px]'} font-semibold leading-none`} style={{ color: INK, letterSpacing: '-0.03em' }}>{elapsed.toFixed(1)}s</h2>
            <p className="text-[14px]" style={{ color: INK_2 }}>total</p>
          </div>

          <div className={`rounded-2xl ${naked ? 'mt-3 p-3' : 'mt-5 p-4'}`} style={{ background: panelBg }}>
            <div className={`text-[13px] ${naked ? 'space-y-1.5' : 'space-y-2.5'}`}>
              <Row k="Event" v="Check-in completed" />
              <Row k="Routed to" v={route?.title} />
              <Row k="Resource" v={accepted ? 'Accepted' : 'Declined'} />
              <Row k="Hash" v="0x7a3e…b91d" mono color={TEAL} />
            </div>
            <div className={`border-t ${naked ? 'mt-2.5 space-y-1 pt-2' : 'mt-3.5 space-y-1.5 pt-3'}`} style={{ borderColor: borderCol }}>
              <Fact>No name recorded</Fact>
              <Fact>No notes, no diagnosis</Fact>
              <Fact>Auto-purges in 90 days</Fact>
            </div>
          </div>

          <div className={`flex items-center justify-between px-1 text-[11px] font-semibold ${naked ? 'mt-2' : 'mt-3'}`} style={{ color: mutedText, letterSpacing: '0.02em' }}>
            <span>COMPLIANT BY DESIGN</span>
            <span style={{ color: INK }}>OSHA · ADA · HIPAA</span>
          </div>
        </div>

        <div className={`flex gap-2 ${naked ? 'px-5 pb-3' : 'px-5 pb-7'}`}>
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss?.(); }}
            className={`flex-1 rounded-2xl text-[15px] font-medium active:scale-[0.98] ${naked ? 'py-2.5' : 'py-3.5'}`}
            style={{ background: buttonBg, color: INK, border: naked ? `1px solid ${borderCol}` : 'none' }}
          >
            Close
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onReset(); }}
            className={`flex-1 rounded-2xl text-[15px] font-semibold active:scale-[0.98] ${naked ? 'py-2.5' : 'py-3.5'}`}
            style={{ background: TEAL, color: 'white' }}
          >
            Run it again
          </button>
        </div>
        <p className={`text-center text-[11px] ${naked ? 'pb-2' : 'pb-3'}`} style={{ color: mutedText }}>butterfly.one</p>
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
