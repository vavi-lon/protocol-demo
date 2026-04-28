import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, RotateCcw, Check } from 'lucide-react';
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
//   public/images/protocol/frame-01-see.png
//   public/images/protocol/frame-02-stay.png
//   public/images/protocol/frame-03-ask.png
//   public/images/protocol/frame-04-connect.png
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

type Variant = {
  /** Human-readable name for the route — shown in the "Route N of 3 · {label}" caption. */
  label: string;
  /** Bubbles unique to this variant — appended to the frame's base bubbles when active. */
  bubbles: Bubble[];
  /** Frame 4 only — receipt morphs its "Routed to" + status rows per variant. */
  receiptRoute?: {
    routedTo: string;
    statusLabel: string;
    statusValue: string;
  };
  /** Optional background image override for this variant. When the carousel
   *  rotates to this variant the FullBleedMedia crossfades to this image.
   *  Falls back to frame.imagePath if not set or if the file is missing. */
  imagePath?: string;
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
  /** Optional carousel of branching outcomes (Frames 3 + 4). Each variant cycles
   *  every ~5s; the active one renders alongside the base bubbles. */
  variants?: Variant[];
  /** When true, the variant carousel loops back to V1 after the final variant
   *  instead of clamping at the last. Used by Frame 4 (no auto-advance to next). */
  loopVariants?: boolean;
  /** When true, the carousel cycles variantIndex (driving image swaps) but
   *  hides all carousel UI: variant-specific bubbles and the "Route N of 3"
   *  caption are not rendered. Frame's base bubbles render as usual. Used
   *  by Frames 1 + 2 where only the background image should rotate. */
  silentVariants?: boolean;
  /** ms — how long this frame plays before auto-advancing */
  duration: number;
  /** Which side of the screen the chat / receipt overlay sits on. The
   *  opposite side now hosts only the step badge + headline (the body
   *  card explainer was removed in the context-toggle restructure). */
  bodyPlacement: 'left' | 'right';
  /** When true, render the ReceiptOverlay panel instead of bubbles (used by Frame 4) */
  receipt?: boolean;
};

// ──────────────────────────────────────────────────────────────────────────
// CONTEXTS — three settings the user can toggle between at the top of the
// walkthrough. Each context owns its own 4-frame array with tailored
// dialogue, system signals, scene captions and image paths. The protocol
// structure (4 steps, 3 variants per step where applicable) stays the same
// across all three.
// ──────────────────────────────────────────────────────────────────────────

type ContextKey = 'work' | 'school' | 'home';

type Context = {
  key: ContextKey;
  label: string;
  /** Subject of the opening card — "A colleague" / "A student" / "A loved one". */
  openingPerson: string;
};

const CONTEXTS: Context[] = [
  { key: 'work',   label: 'At Work',   openingPerson: 'A colleague' },
  { key: 'school', label: 'At School', openingPerson: 'A student'   },
  { key: 'home',   label: 'At Home',   openingPerson: 'A loved one' },
];

// ──────────────────────────────────────────────────────────────────────────
// FRAMES_BY_CONTEXT — frame data keyed by context. Image paths under
// `school` and `sports` use prefixed filenames (e.g. school-frame-01-…);
// if those files haven't been generated yet, FullBleedMedia silently falls
// back to `frame.imagePath` (set to the canonical workplace image) so the
// walkthrough never breaks visually. Drop the per-context image files in
// to populate each context's visual track.
// ──────────────────────────────────────────────────────────────────────────

const FRAMES_BY_CONTEXT: Record<ContextKey, FrameDef[]> = {
  work: [
  {
    n: 1,
    step: 'SEE',
    overline: 'STEP 01 · SEE',
    headline: 'Notice without speaking.',
    imagePath: '/images/protocol/frame-01-see.png',
    imageAlt: 'A colleague at her desk, head lowered, withdrawn from the room around her.',
    fallbackGradient: 'linear-gradient(135deg, #2a2c34 0%, #3f4452 50%, #5a6076 100%)',
    sceneCaption: 'Tuesday, 9:47 AM · Before any words',
    duration: 17000,
    bodyPlacement: 'right',
    loopVariants: true,
    silentVariants: true,
    bubbles: [
      { speaker: 'system', text: 'Posture withdraws — shoulders close inward', delay: 700 },
      { speaker: 'system', text: 'Eyes off-screen for a long beat',            delay: 1700 },
      { speaker: 'system', text: 'Them missed Monday 10am standup',            delay: 2900 },
      { speaker: 'system', text: 'Them missed Thursday 10am standup',          delay: 3800 },
      { speaker: 'system', text: 'Them logged off Tuesday 2:14 PM',            delay: 4700 },
    ],
    variants: [
      { label: 'Withdrawal',       imagePath: '/images/protocol/frame-01-see-withdrawal.png',       bubbles: [] },
      { label: 'Behavioral shift', imagePath: '/images/protocol/frame-01-see-behavioral-shift.png', bubbles: [] },
    ],
  },
  {
    n: 2,
    step: 'STAY',
    overline: 'STEP 02 · STAY',
    headline: 'Close the distance.',
    imagePath: '/images/protocol/frame-02-stay.png',
    imageAlt: 'A manager stands beside a seated colleague who has pressed her hand to her chest — the silent sign.',
    fallbackGradient: 'linear-gradient(135deg, #1f2932 0%, #354253 50%, #4f5d72 100%)',
    sceneCaption: 'Tuesday, 9:48 AM · The first 30 seconds',
    duration: 17000,
    bodyPlacement: 'left',
    loopVariants: true,
    bubbles: [],
    // Each variant enacts one of the body card's 3 scripts.
    // V1 = OPEN script. V2 = RELEASE PRESSURE script. V3 = OFFER OPTIONS script.
    variants: [
      {
        label: 'Direct check-in',
        imagePath: '/images/protocol/frame-02-stay-direct.png',
        bubbles: [
          {
            speaker: 'you',
            text: "Hey — I've noticed you've been quiet this week. You missed both standups. You okay?",
            delay: 200,
            annotations: [
              'You stop — physical presence first',
              'Distance kept — closeness without invasion',
            ],
          },
          {
            speaker: 'them',
            text: "yeah, just tired. i'm fine.",
            delay: 2400,
            annotations: [
              'Hand to chest — the silent sign',
              "Words say fine. Body says otherwise. You don't walk away.",
            ],
          },
        ],
      },
      {
        label: 'No pressure',
        imagePath: '/images/protocol/frame-02-stay-no-pressure.png',
        bubbles: [
          {
            speaker: 'you',
            text: "you don't have to explain anything right now. just here if you need it.",
            delay: 200,
            annotations: ['Release the pressure — make space, not silence'],
          },
          {
            speaker: 'system',
            text: "She nods. Doesn't speak.",
            delay: 2400,
          },
        ],
      },
      {
        label: 'Offer options',
        imagePath: '/images/protocol/frame-02-stay-offer-options.png',
        bubbles: [
          {
            speaker: 'you',
            text: "coffee, walk, or quiet — what'd help most?",
            delay: 200,
            annotations: ['Concrete options — easier to pick than to invent'],
          },
          {
            speaker: 'them',
            text: '…a walk, maybe.',
            delay: 2400,
            annotations: ['She picks one. The choice itself eases.'],
          },
        ],
      },
    ],
  },
  {
    n: 3,
    step: 'ASK',
    overline: 'STEP 03 · ASK',
    headline: 'Ask the real question.',
    imagePath: '/images/protocol/frame-03-ask.png',
    imageAlt: 'The manager and colleague speaking face-to-face at the desk — the manager listening, not solving.',
    fallbackGradient: 'linear-gradient(135deg, #1f2630 0%, #364452 50%, #56657a 100%)',
    sceneCaption: 'Tuesday, 9:49 AM · Three answers, three routes',
    duration: 17000,
    bodyPlacement: 'right',
    loopVariants: true,
    bubbles: [
      {
        speaker: 'you',
        text: 'no pressure — what would help most right now?',
        delay: 700,
        annotations: ["Open question — listen, don't evaluate"],
      },
    ],
    variants: [
      {
        // First variant uses a longer delay (1500ms) so the base "You" question
        // lands first on initial frame load. V2/V3 use a short delay (200ms)
        // because by then You is already onscreen — snappier swap. After the
        // first full cycle, Frame's `firstCycleDone` flag overrides V1 to a
        // snappy delay too, so loop-backs don't lag.
        label: 'Soft retreat',
        imagePath: '/images/protocol/frame-03-ask-soft-retreat.png',
        bubbles: [
          { speaker: 'them', text: "honestly i just need a quiet hour. i'll be ok.", delay: 1500 },
        ],
      },
      {
        label: 'Wants support',
        imagePath: '/images/protocol/frame-03-ask-wants-support.png',
        bubbles: [
          { speaker: 'them', text: 'i think i need to talk to someone.', delay: 200 },
        ],
      },
      {
        label: 'Risk signal',
        imagePath: '/images/protocol/frame-03-ask-risk-signal.png',
        bubbles: [
          { speaker: 'them', text: "i don't know if i can keep going.", delay: 200 },
        ],
      },
    ],
  },
  {
    n: 4,
    step: 'CONNECT',
    overline: 'STEP 04 · CONNECT',
    headline: 'Close the loop — three ways.',
    imagePath: '/images/protocol/frame-04-connect.png',
    imageAlt: 'The manager stands with the colleague at her desk; a phone is held to make the call. The line is open.',
    fallbackGradient: 'linear-gradient(135deg, #1c2530 0%, #34465c 50%, #5b7090 100%)',
    sceneCaption: 'Tuesday, 9:51 AM · One protocol, three endings',
    duration: 17000,
    bodyPlacement: 'left',
    bubbles: [],
    loopVariants: true,
    variants: [
      {
        label: 'Soft retreat',
        imagePath: '/images/protocol/frame-04-connect-soft-retreat.png',
        bubbles: [
          { speaker: 'you',    text: "okay. i'll find you at 2:30 — no pressure.", delay: 200 },
          { speaker: 'system', text: 'reminder set · 2:30 PM ✓',                   delay: 1500 },
        ],
        receiptRoute: { routedTo: 'Self-managed', statusLabel: 'Follow-up', statusValue: '2:30 PM today' },
      },
      {
        label: 'Wants support',
        imagePath: '/images/protocol/frame-04-connect-wants-support.png',
        bubbles: [
          { speaker: 'you',  text: "let's open the resource map together. i'll stay while you pick.", delay: 200 },
          { speaker: 'them', text: 'ok.',                                                              delay: 2200 },
        ],
        receiptRoute: { routedTo: 'Resource Map', statusLabel: 'EAP referral', statusValue: 'Pending' },
      },
      {
        label: 'Risk signal',
        imagePath: '/images/protocol/frame-04-connect-risk-signal.png',
        bubbles: [
          { speaker: 'you',    text: "let's call 988 together. i'll stay on the line.", delay: 200 },
          { speaker: 'system', text: '988 connected · responder remained',              delay: 2400 },
        ],
        receiptRoute: { routedTo: '988 Lifeline', statusLabel: 'Responder', statusValue: 'Stayed on line' },
      },
    ],
  },
  ],
  // ────────────────────────────────────────────────────────────────────────
  // SCHOOL — teacher / student, between periods. Routes to school counselor
  // for "Wants support" instead of EAP/Resource Map.
  // ────────────────────────────────────────────────────────────────────────
  school: [
    {
      n: 1,
      step: 'SEE',
      overline: 'STEP 01 · SEE',
      headline: 'Notice without speaking.',
      imagePath: '/images/protocol/school-frame-01-see.png',
      imageAlt: 'A student at her desk, head lowered, withdrawn from the classroom around her.',
      fallbackGradient: 'linear-gradient(135deg, #2a2c34 0%, #3f4452 50%, #5a6076 100%)',
      sceneCaption: 'Wednesday, between periods · Before any words',
      duration: 17000,
      bodyPlacement: 'right',
      loopVariants: true,
      silentVariants: true,
      bubbles: [
        { speaker: 'system', text: "Quiet during today's discussion",   delay: 700 },
        { speaker: 'system', text: 'Eyes off the page for a long beat', delay: 1700 },
        { speaker: 'system', text: "Them missed Monday's class",        delay: 2900 },
        { speaker: 'system', text: "Them missed Wednesday's class",     delay: 3800 },
        { speaker: 'system', text: 'Skipped lunch in the cafeteria',    delay: 4700 },
      ],
      variants: [
        { label: 'Withdrawal',       imagePath: '/images/protocol/school-frame-01-see-withdrawal.png',       bubbles: [] },
        { label: 'Behavioral shift', imagePath: '/images/protocol/school-frame-01-see-behavioral-shift.png', bubbles: [] },
      ],
    },
    {
      n: 2,
      step: 'STAY',
      overline: 'STEP 02 · STAY',
      headline: 'Close the distance.',
      imagePath: '/images/protocol/school-frame-02-stay.png',
      imageAlt: 'A teacher stands beside a seated student who has pressed her hand to her chest — the silent sign.',
      fallbackGradient: 'linear-gradient(135deg, #1f2932 0%, #354253 50%, #4f5d72 100%)',
      sceneCaption: 'Wednesday, after class · The first 30 seconds',
      duration: 17000,
      bodyPlacement: 'left',
      loopVariants: true,
      bubbles: [],
      variants: [
        {
          label: 'Direct check-in',
          imagePath: '/images/protocol/school-frame-02-stay-direct.png',
          bubbles: [
            {
              speaker: 'you',
              text: "Hey — I've noticed you've been quiet this week. You missed both classes. You okay?",
              delay: 200,
              annotations: [
                'You stop — physical presence first',
                'Distance kept — closeness without invasion',
              ],
            },
            {
              speaker: 'them',
              text: "yeah, just tired. i'm fine.",
              delay: 2400,
              annotations: [
                'Hand to chest — the silent sign',
                "Words say fine. Body says otherwise. You don't walk away.",
              ],
            },
          ],
        },
        {
          label: 'No pressure',
          imagePath: '/images/protocol/school-frame-02-stay-no-pressure.png',
          bubbles: [
            {
              speaker: 'you',
              text: "you don't have to talk about anything right now. just here if you need me.",
              delay: 200,
              annotations: ['Release the pressure — make space, not silence'],
            },
            {
              speaker: 'system',
              text: "She nods. Doesn't speak.",
              delay: 2400,
            },
          ],
        },
        {
          label: 'Offer options',
          imagePath: '/images/protocol/school-frame-02-stay-offer-options.png',
          bubbles: [
            {
              speaker: 'you',
              text: "study hall, walk outside, or just sit here — what'd help?",
              delay: 200,
              annotations: ['Concrete options — easier to pick than to invent'],
            },
            {
              speaker: 'them',
              text: '…a walk, maybe.',
              delay: 2400,
              annotations: ['She picks one. The choice itself eases.'],
            },
          ],
        },
      ],
    },
    {
      n: 3,
      step: 'ASK',
      overline: 'STEP 03 · ASK',
      headline: 'Ask the real question.',
      imagePath: '/images/protocol/school-frame-03-ask.png',
      imageAlt: 'The teacher and student speaking face-to-face — the teacher listening, not solving.',
      fallbackGradient: 'linear-gradient(135deg, #1f2630 0%, #364452 50%, #56657a 100%)',
      sceneCaption: 'Wednesday, end of period · Three answers, three routes',
      duration: 17000,
      bodyPlacement: 'right',
      loopVariants: true,
      bubbles: [
        {
          speaker: 'you',
          text: 'no pressure — what would help most right now?',
          delay: 700,
          annotations: ["Open question — listen, don't evaluate"],
        },
      ],
      variants: [
        {
          label: 'Soft retreat',
          imagePath: '/images/protocol/school-frame-03-ask-soft-retreat.png',
          bubbles: [
            { speaker: 'them', text: "honestly i just need a quiet hour. i'll be ok.", delay: 1500 },
          ],
        },
        {
          label: 'Wants support',
          imagePath: '/images/protocol/school-frame-03-ask-wants-support.png',
          bubbles: [
            { speaker: 'them', text: 'i think i need to talk to the counselor.', delay: 200 },
          ],
        },
        {
          label: 'Risk signal',
          imagePath: '/images/protocol/school-frame-03-ask-risk-signal.png',
          bubbles: [
            { speaker: 'them', text: "i don't know if i can keep going.", delay: 200 },
          ],
        },
      ],
    },
    {
      n: 4,
      step: 'CONNECT',
      overline: 'STEP 04 · CONNECT',
      headline: 'Close the loop — three ways.',
      imagePath: '/images/protocol/school-frame-04-connect.png',
      imageAlt: 'The teacher stands with the student; a phone is on the desk. The line is open.',
      fallbackGradient: 'linear-gradient(135deg, #1c2530 0%, #34465c 50%, #5b7090 100%)',
      sceneCaption: "Wednesday, in the counselor's office · One protocol, three endings",
      duration: 17000,
      bodyPlacement: 'left',
      bubbles: [],
      loopVariants: true,
      variants: [
        {
          label: 'Soft retreat',
          imagePath: '/images/protocol/school-frame-04-connect-soft-retreat.png',
          bubbles: [
            { speaker: 'you',    text: "okay. i'll find you in study hall — no pressure.", delay: 200 },
            { speaker: 'system', text: 'reminder set · 4th period ✓',                       delay: 1500 },
          ],
          receiptRoute: { routedTo: 'Self-managed', statusLabel: 'Follow-up', statusValue: '4th period today' },
        },
        {
          label: 'Wants support',
          imagePath: '/images/protocol/school-frame-04-connect-wants-support.png',
          bubbles: [
            { speaker: 'you',  text: "let's walk to the counselor's office together. i'll wait while you talk.", delay: 200 },
            { speaker: 'them', text: 'ok.',                                                                       delay: 2200 },
          ],
          receiptRoute: { routedTo: 'School counselor', statusLabel: 'Referral', statusValue: 'In progress' },
        },
        {
          label: 'Risk signal',
          imagePath: '/images/protocol/school-frame-04-connect-risk-signal.png',
          bubbles: [
            { speaker: 'you',    text: "let's call 988 together. i'll stay with you.", delay: 200 },
            { speaker: 'system', text: '988 connected · counselor on the way',          delay: 2400 },
          ],
          receiptRoute: { routedTo: '988 Lifeline', statusLabel: 'Counselor', statusValue: 'En route' },
        },
      ],
    },
  ],
  // ────────────────────────────────────────────────────────────────────────
  // HOME — household setting. The "you" is a partner / parent / family
  // member; "them" is a loved one. Routes to a personal therapist for
  // "Wants support" (the closest household analogue of EAP / counselor /
  // team psychologist).
  // ────────────────────────────────────────────────────────────────────────
  home: [
    {
      n: 1,
      step: 'SEE',
      overline: 'STEP 01 · SEE',
      headline: 'Notice without speaking.',
      imagePath: '/images/protocol/home-frame-01-see.png',
      imageAlt: 'A loved one in the kitchen, head lowered, withdrawn from the household around them.',
      fallbackGradient: 'linear-gradient(135deg, #2a2c34 0%, #3f4452 50%, #5a6076 100%)',
      sceneCaption: 'Sunday evening, the kitchen · Before any words',
      duration: 17000,
      bodyPlacement: 'right',
      loopVariants: true,
      silentVariants: true,
      bubbles: [
        { speaker: 'system', text: 'Posture withdraws — shoulders close inward', delay: 700 },
        { speaker: 'system', text: 'Eyes off the room for a long beat',           delay: 1700 },
        { speaker: 'system', text: 'Skipped Sunday dinner',                        delay: 2900 },
        { speaker: 'system', text: 'Skipped Tuesday dinner',                       delay: 3800 },
        { speaker: 'system', text: 'Bedroom door stayed shut all afternoon',       delay: 4700 },
      ],
      variants: [
        { label: 'Withdrawal',       imagePath: '/images/protocol/home-frame-01-see-withdrawal.png',       bubbles: [] },
        { label: 'Behavioral shift', imagePath: '/images/protocol/home-frame-01-see-behavioral-shift.png', bubbles: [] },
      ],
    },
    {
      n: 2,
      step: 'STAY',
      overline: 'STEP 02 · STAY',
      headline: 'Close the distance.',
      imagePath: '/images/protocol/home-frame-02-stay.png',
      imageAlt: 'You sit beside a loved one at the kitchen table — they have pressed a hand to their chest, the silent sign.',
      fallbackGradient: 'linear-gradient(135deg, #1f2932 0%, #354253 50%, #4f5d72 100%)',
      sceneCaption: 'Sunday evening, after dinner · The first 30 seconds',
      duration: 17000,
      bodyPlacement: 'left',
      loopVariants: true,
      bubbles: [],
      variants: [
        {
          label: 'Direct check-in',
          imagePath: '/images/protocol/home-frame-02-stay-direct.png',
          bubbles: [
            {
              speaker: 'you',
              text: "Hey — I've noticed you've been quiet this week. You missed dinner twice. You okay?",
              delay: 200,
              annotations: [
                'You sit down — physical presence first',
                'Distance kept — closeness without invasion',
              ],
            },
            {
              speaker: 'them',
              text: "yeah, just tired. i'm fine.",
              delay: 2400,
              annotations: [
                'Hand to chest — the silent sign',
                "Words say fine. Body says otherwise. You don't walk away.",
              ],
            },
          ],
        },
        {
          label: 'No pressure',
          imagePath: '/images/protocol/home-frame-02-stay-no-pressure.png',
          bubbles: [
            {
              speaker: 'you',
              text: "you don't have to get into it tonight. just here if you need me.",
              delay: 200,
              annotations: ['Release the pressure — make space, not silence'],
            },
            {
              speaker: 'system',
              text: "She nods. Doesn't speak.",
              delay: 2400,
            },
          ],
        },
        {
          label: 'Offer options',
          imagePath: '/images/protocol/home-frame-02-stay-offer-options.png',
          bubbles: [
            {
              speaker: 'you',
              text: "tea, a walk around the block, or just sitting — what'd help?",
              delay: 200,
              annotations: ['Concrete options — easier to pick than to invent'],
            },
            {
              speaker: 'them',
              text: '…a walk, maybe.',
              delay: 2400,
              annotations: ['She picks one. The choice itself eases.'],
            },
          ],
        },
      ],
    },
    {
      n: 3,
      step: 'ASK',
      overline: 'STEP 03 · ASK',
      headline: 'Ask the real question.',
      imagePath: '/images/protocol/home-frame-03-ask.png',
      imageAlt: 'You and a loved one on the couch, face-to-face — you listening, not solving.',
      fallbackGradient: 'linear-gradient(135deg, #1f2630 0%, #364452 50%, #56657a 100%)',
      sceneCaption: 'Sunday evening, on the couch · Three answers, three routes',
      duration: 17000,
      bodyPlacement: 'right',
      loopVariants: true,
      bubbles: [
        {
          speaker: 'you',
          text: 'no pressure — what would help most right now?',
          delay: 700,
          annotations: ["Open question — listen, don't evaluate"],
        },
      ],
      variants: [
        {
          label: 'Soft retreat',
          imagePath: '/images/protocol/home-frame-03-ask-soft-retreat.png',
          bubbles: [
            { speaker: 'them', text: "honestly i just need a quiet hour. i'll be ok.", delay: 1500 },
          ],
        },
        {
          label: 'Wants support',
          imagePath: '/images/protocol/home-frame-03-ask-wants-support.png',
          bubbles: [
            { speaker: 'them', text: 'i think i need to talk to my therapist.', delay: 200 },
          ],
        },
        {
          label: 'Risk signal',
          imagePath: '/images/protocol/home-frame-03-ask-risk-signal.png',
          bubbles: [
            { speaker: 'them', text: "i don't know if i can keep going.", delay: 200 },
          ],
        },
      ],
    },
    {
      n: 4,
      step: 'CONNECT',
      overline: 'STEP 04 · CONNECT',
      headline: 'Close the loop — three ways.',
      imagePath: '/images/protocol/home-frame-04-connect.png',
      imageAlt: 'You sit with a loved one in the kitchen; a phone is on the counter. The line is open.',
      fallbackGradient: 'linear-gradient(135deg, #1c2530 0%, #34465c 50%, #5b7090 100%)',
      sceneCaption: 'Sunday evening, by the kitchen counter · One protocol, three endings',
      duration: 17000,
      bodyPlacement: 'left',
      bubbles: [],
      loopVariants: true,
      variants: [
        {
          label: 'Soft retreat',
          imagePath: '/images/protocol/home-frame-04-connect-soft-retreat.png',
          bubbles: [
            { speaker: 'you',    text: "okay. i'll come knock at 7 — no pressure.", delay: 200 },
            { speaker: 'system', text: 'reminder set · 7 PM tonight ✓',              delay: 1500 },
          ],
          receiptRoute: { routedTo: 'Self-managed', statusLabel: 'Follow-up', statusValue: '7 PM tonight' },
        },
        {
          label: 'Wants support',
          imagePath: '/images/protocol/home-frame-04-connect-wants-support.png',
          bubbles: [
            { speaker: 'you',  text: "let's call your therapist together. i'll wait while you talk.", delay: 200 },
            { speaker: 'them', text: 'ok.',                                                            delay: 2200 },
          ],
          receiptRoute: { routedTo: 'Therapist', statusLabel: 'Referral', statusValue: 'In progress' },
        },
        {
          label: 'Risk signal',
          imagePath: '/images/protocol/home-frame-04-connect-risk-signal.png',
          bubbles: [
            { speaker: 'you',    text: "let's call 988 together. i'll stay with you.", delay: 200 },
            { speaker: 'system', text: '988 connected · staying with you',              delay: 2400 },
          ],
          receiptRoute: { routedTo: '988 Lifeline', statusLabel: 'Stayed with', statusValue: 'You' },
        },
      ],
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// FULL-BLEED MEDIA — fills entire frame area; image now, video-ready.
// ──────────────────────────────────────────────────────────────────────────

const MASK_GRADIENT = 'radial-gradient(ellipse 92% 96% at 50% 50%, #000 60%, transparent 100%)';

const FullBleedMedia = ({
  frame,
  revealed,
  imagePath,
}: {
  frame: FrameDef;
  revealed: boolean;
  imagePath: string;
}) => {
  // Sequential fade swap: when the requested path changes, the current image
  // fades to opacity 0 over ~320ms, *then* activePath updates and the new src
  // begins loading; once it's decoded, onLoad flips imgLoaded back on and
  // the new image fades from 0 to 1. The two phases never overlap, so the
  // previous image is fully gone before the new one appears — no lingering,
  // no hard cut. If a variant image fails to load (file not added yet), we
  // fall back silently to frame.imagePath.
  const FADE_MS = 320;

  const [failedPaths, setFailedPaths] = useState<Set<string>>(() => new Set());
  const targetPath = failedPaths.has(imagePath) ? frame.imagePath : imagePath;
  const allFailed = failedPaths.has(frame.imagePath);

  const [activePath, setActivePath] = useState(targetPath);
  const [imgLoaded, setImgLoaded] = useState(false);

  // When the requested target diverges from the active path, run the fade-out
  // (set imgLoaded false → opacity 0), wait for the fade to finish, then
  // swap activePath so the new src begins loading.
  useEffect(() => {
    if (targetPath === activePath) return;
    setImgLoaded(false);
    const t = setTimeout(() => setActivePath(targetPath), FADE_MS);
    return () => clearTimeout(t);
  }, [targetPath, activePath]);

  const markFailed = (path: string) =>
    setFailedPaths((prev) => {
      if (prev.has(path)) return prev;
      const next = new Set(prev);
      next.add(path);
      return next;
    });

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: allFailed || !imgLoaded ? frame.fallbackGradient : '#0b0b10' }}
    >
      {!allFailed && (
        <>
          {/* Blurred backdrop — second copy of the same image scaled & blurred
              to fill the entire frame. Eliminates the visible letterbox bands
              that object-contain leaves on the sides; the foreground image
              now feathers into its own out-of-focus colour field instead of
              into white/gray. Browser fetches the src once (cache) so this
              costs no extra network. */}
          <img
            src={activePath}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: imgLoaded ? 1 : 0,
              filter: 'blur(48px) brightness(0.78) saturate(1.05)',
              transform: 'scale(1.18)',
              transition: `opacity ${FADE_MS}ms ease`,
            }}
          />
          {/* Sharp foreground — contained at original aspect ratio with the
              radial feather, so the focused subject reads cleanly while its
              edges dissolve into the blurred backdrop. */}
          <img
            src={activePath}
            alt={frame.imageAlt}
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: imgLoaded ? 1 : 0,
              transform: revealed ? 'scale(1.02)' : 'scale(1)',
              transition: `opacity ${FADE_MS}ms ease, transform 12000ms cubic-bezier(0.4,0,0.2,1)`,
              maskImage: MASK_GRADIENT,
              WebkitMaskImage: MASK_GRADIENT,
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => markFailed(activePath)}
          />
        </>
      )}

      {/* Symmetric edge darkening: both sides darker so the chat overlay and
          the body card both have legible contrast against the now-busier
          blurred backdrop. The central 30–70% range stays lightly darkened
          so the focused subject still reads. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      {/* Top + bottom vignette — keeps caption + watermark legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 14%, transparent 86%, rgba(0,0,0,0.35) 100%)',
        }}
      />

      {(allFailed || !imgLoaded) && (
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
            background: 'rgba(252,246,234,0.94)',
            color: 'rgba(60,42,22,0.92)',
            fontSize: '0.78rem',
            maxWidth: '92%',
            boxShadow: '0 4px 14px -8px rgba(0,0,0,0.45)',
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
          color: 'rgba(255,248,232,0.92)',
          textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 8px rgba(0,0,0,0.35)',
        }}
      >
        {isYou ? 'You' : 'Them'}
      </span>

      {/* Bubble */}
      <div
        className="px-4 py-2.5"
        style={{
          maxWidth: '92%',
          background: isYou ? '#2563eb' : '#efe4cf',
          color: isYou ? '#ffffff' : 'rgba(50,30,10,0.92)',
          borderRadius: isYou ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          fontSize: 14.5,
          lineHeight: 1.45,
          fontWeight: isYou ? 500 : 400,
          boxShadow: '0 4px 14px -8px rgba(80,60,40,0.25)',
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
                color: 'rgba(255,248,232,0.82)',
                lineHeight: 1.4,
                textShadow: '0 1px 3px rgba(0,0,0,0.55), 0 0 8px rgba(0,0,0,0.35)',
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

// Renders a variant's bubbles with a fresh reveal each time it mounts, so swapping
// variants re-triggers the fade-in transition instead of looking static.
const VariantBubbles = ({ variant, indexOffset = 0 }: { variant: Variant; indexOffset?: number }) => {
  const [vRevealed, setVRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVRevealed(true), 50);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      {variant.bubbles.map((b, i) => (
        <ChatMessage key={i} bubble={b} index={indexOffset + i} revealed={vRevealed} />
      ))}
    </>
  );
};

// Computes the delay (ms) at which the route caption should fade in for a
// given variant — i.e. AFTER the longest bubble has fully landed, and after
// the receipt rows have finished morphing on receipt frames. Falls back to
// 0 when there's nothing to wait for.
const computeCaptionDelay = (
  baseBubbles: Bubble[],
  variantBubbles: Bubble[],
  hasReceipt: boolean,
): number => {
  const maxBubbleDelay = Math.max(
    0,
    ...baseBubbles.map((b) => b.delay ?? 0),
    ...variantBubbles.map((b) => b.delay ?? 0),
  );
  const bubbleTime = maxBubbleDelay + 500; // ChatMessage's opacity/translate transition
  const receiptTime = hasReceipt ? 1200 + 460 : 0; // receipt row delay + duration
  return Math.max(bubbleTime, receiptTime) + 250; // 250ms breathing room before caption
};

// "Route N of 3 · Soft retreat" chip — morphs whenever variantIndex changes.
const RouteCaption = ({
  variantIndex,
  total,
  label,
  delay = 0,
}: {
  variantIndex: number;
  total: number;
  label: string;
  delay?: number;
}) => (
  <div
    key={variantIndex}
    className="inline-flex items-center gap-2 self-center px-3 py-1.5 rounded-full"
    style={{
      background: 'rgba(252,246,234,0.92)',
      border: '1px solid rgba(180,150,100,0.32)',
      animation: `bf-fade-up 500ms cubic-bezier(0.16,1,0.3,1) ${delay}ms both`,
    }}
  >
    <span className="text-[9.5px] font-bold tracking-[0.14em] uppercase tabular-nums" style={{ color: TEAL }}>
      Route {variantIndex + 1} of {total}
    </span>
    <span className="text-[10px]" style={{ color: 'rgba(80,55,30,0.4)' }}>·</span>
    <span className="text-[11px] font-semibold text-ink">{label}</span>
  </div>
);

const ChatColumn = ({
  frame,
  revealed,
  variantIndex,
  activeVariant,
}: {
  frame: FrameDef;
  revealed: boolean;
  variantIndex: number;
  activeVariant?: Variant;
}) => {
  // Place chat column on the side opposite the body-card so they don't overlap
  const side: 'left' | 'right' = frame.bodyPlacement === 'right' ? 'left' : 'right';
  const variants = frame.variants;

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
      {activeVariant && !frame.silentVariants && (
        <VariantBubbles
          key={variantIndex}
          variant={activeVariant}
          indexOffset={frame.bubbles.length}
        />
      )}
      {variants && activeVariant && !frame.silentVariants && (
        <RouteCaption
          variantIndex={variantIndex}
          total={variants.length}
          label={activeVariant.label}
          delay={computeCaptionDelay(frame.bubbles, activeVariant.bubbles, frame.receipt ?? false)}
        />
      )}
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

const ReceiptOverlay = ({
  revealed,
  side,
  variants,
  variantIndex,
  activeVariant,
}: {
  revealed: boolean;
  side: 'left' | 'right';
  variants?: Variant[];
  variantIndex: number;
  activeVariant?: Variant;
}) => {
  // Position the receipt in the exact same slot the ChatColumn occupies on the
  // other frames — opposite the body card, vertically centred, same horizontal
  // offset and width.
  const route = activeVariant?.receiptRoute ?? {
    routedTo: '988 Lifeline',
    statusLabel: 'Resource',
    statusValue: 'Accepted',
  };

  return (
    <div
      className="absolute z-20 flex flex-col items-stretch gap-3"
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
      {/* Per-variant bubbles render above the receipt — message lands first,
          then the receipt rows morph ~1.2s later. Mount-keyed so each variant
          re-triggers a fresh fade-in. */}
      {activeVariant && activeVariant.bubbles.length > 0 && (
        <div key={`bubbles-${variantIndex}`} className="flex flex-col gap-2.5">
          <VariantBubbles variant={activeVariant} />
        </div>
      )}

      <div
        className={`rounded-2xl p-5 shadow-2xl w-full ${revealed ? 'bf-receipt-content' : ''}`}
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
          <ReceiptRow label="Event" value="Check-in completed" />
          {/* Routed-to + status rows morph per variant. Delay 1200ms so the
              chat bubble above lands first — the message arrives, *then* the
              receipt updates. */}
          <div
            key={`route-${variantIndex}`}
            className="space-y-2"
            style={{ animation: 'bf-fade-up 460ms cubic-bezier(0.16,1,0.3,1) 1200ms both' }}
          >
            <ReceiptRow label="Routed to" value={route.routedTo} />
            <ReceiptRow label={route.statusLabel} value={route.statusValue} />
          </div>
          <ReceiptRow label="Hash" value="0x7a3e…b91d" mono color={TEAL} />
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

      {variants && activeVariant && (
        <RouteCaption
          variantIndex={variantIndex}
          total={variants.length}
          label={activeVariant.label}
          delay={computeCaptionDelay([], activeVariant.bubbles, true)}
        />
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// INTRO CARD — opening title (before Step 1) and closing title (after Step 4).
// Plays as a brief, full-screen narrative bookend so the walkthrough reads
// like a short film: setup → four-minute scene → takeaway.
// ──────────────────────────────────────────────────────────────────────────

const IntroCard = ({
  variant,
  context,
  onComplete,
  duration,
}: {
  variant: 'opening' | 'closing';
  context: Context;
  onComplete: () => void;
  duration: number;
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const r = setTimeout(() => setRevealed(true), 60);
    const c = setTimeout(onComplete, duration);
    return () => {
      clearTimeout(r);
      clearTimeout(c);
    };
  }, [onComplete, duration]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12 text-center"
      style={{
        background:
          'radial-gradient(ellipse 90% 70% at 50% 35%, #fbf4ea 0%, #f1e7d4 55%, #e6d9c2 100%)',
      }}
    >
      {/* Faint paper-grain — same recipe used on the Live Demo overlay so the
          two bookend surfaces feel like the same physical material. */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
          opacity: 0.16,
          mixBlendMode: 'multiply',
        }}
      />

      <div
        className="relative z-10 max-w-[840px] flex flex-col items-center gap-5"
        style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 700ms ease, transform 700ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {variant === 'opening' ? (
          <>
            <p className="text-[10px] md:text-[11px] font-bold tracking-[0.22em] uppercase text-caption">
              The Protocol · {context.label}
            </p>
            <h2 className="text-[26px] md:text-[40px] lg:text-[52px] font-semibold leading-[1.08] tracking-tight text-ink">
              {context.openingPerson} is struggling.
              <br className="hidden md:block" /> You're the one who notices.
            </h2>
            <p className="text-[14px] md:text-[16px] italic" style={{ color: 'rgba(80,55,30,0.7)' }}>
              Four minutes. Four steps.
            </p>
          </>
        ) : (
          <>
            <p className="text-[10px] md:text-[11px] font-bold tracking-[0.22em] uppercase text-caption">
              What the protocol teaches
            </p>
            <h2 className="text-[26px] md:text-[40px] lg:text-[52px] font-semibold leading-[1.08] tracking-tight text-ink">
              One protocol.
              <br className="hidden md:block" /> Four steps. Three valid endings.
            </h2>
            <p className="text-[14px] md:text-[16px] italic" style={{ color: 'rgba(80,55,30,0.7)' }}>
              None of them walk away.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// FRAME — single visible panel: full-bleed image with all overlays on top
// ──────────────────────────────────────────────────────────────────────────

const Frame = ({
  frame,
  direction,
  paused,
}: {
  frame: FrameDef;
  direction: 'forward' | 'backward';
  paused: boolean;
}) => {
  const [revealed, setRevealed] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);
  // True once the carousel has completed one full pass (V_last → V0 wrap).
  // Used to snappy-up V1's reveal delay on subsequent loops, since by then
  // the base "You" bubble is already onscreen and doesn't need lead time.
  const [firstCycleDone, setFirstCycleDone] = useState(false);
  const variants = frame.variants;

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Variant carousel — steps through routes every ~5s while the frame plays.
  // Frames with `loopVariants` (Frames 3 + 4) cycle continuously; others
  // would clamp at the final variant. Frame remounts on entry (key={frame.n}),
  // so variantIndex + firstCycleDone start fresh each visit.
  useEffect(() => {
    if (!variants || variants.length <= 1 || paused) return;
    const loop = frame.loopVariants;
    const last = variants.length - 1;
    const interval = setInterval(() => {
      setVariantIndex((i) => {
        const next = loop ? (i + 1) % variants.length : Math.min(i + 1, last);
        if (loop && i === last && next === 0) {
          setFirstCycleDone(true);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [variants, paused, frame.loopVariants]);

  // After the first full cycle, override V1's delay so its loop-back is
  // snappy — but only when the frame has base bubbles that V1 needed to wait
  // for on first show (Frame 3 ASK). Frames whose variants are self-contained
  // (Frames 1, 2, 4) keep their natural cinematic delays on every cycle.
  const baseActiveVariant = variants?.[variantIndex];
  const hasBaseBubbles = frame.bubbles.length > 0;
  const activeVariant: Variant | undefined =
    baseActiveVariant && firstCycleDone && variantIndex === 0 && hasBaseBubbles
      ? {
          ...baseActiveVariant,
          bubbles: baseActiveVariant.bubbles.map((b) => ({
            ...b,
            delay: Math.min(b.delay ?? 200, 300),
          })),
        }
      : baseActiveVariant;

  // Background image follows the active variant when one is set; otherwise it
  // stays on the frame's main image. FullBleedMedia handles the crossfade and
  // falls back to frame.imagePath if a variant image is missing.
  const activeImagePath = activeVariant?.imagePath ?? frame.imagePath;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        animation: `${direction === 'forward' ? 'bf-frame-in-right' : 'bf-frame-in-left'} 600ms cubic-bezier(0.4,0,0.2,1) both`,
      }}
    >
      {/* ════════════════════════ MOBILE LAYOUT (< md) ════════════════════════
          Vertical stack with internal scroll. Image hero at top, then step
          badge / headline / chat (or receipt) / body card / scene caption,
          all inline. */}
      <div className="md:hidden h-full flex flex-col overflow-y-auto bf-warm-scroll">
        {/* Image hero */}
        <div
          className="relative shrink-0 w-full"
          style={{ height: '38vh', minHeight: 220, background: '#ffffff' }}
        >
          <FullBleedMedia frame={frame} revealed={revealed} imagePath={activeImagePath} />
          {/* Frame number watermark */}
          <div
            className="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full bg-white text-ink text-[13px] font-bold tabular-nums shadow border border-hair"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'scale(1)' : 'scale(0.7)',
              transition: 'opacity 500ms ease 200ms, transform 500ms cubic-bezier(0.2,0.9,0.3,1.2) 200ms',
            }}
          >
            {frame.n}
          </div>
        </div>

        {/* Content stack */}
        <div
          className="px-4 py-5 space-y-4"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 700ms ease 200ms, transform 700ms ease 200ms',
          }}
        >
          {/* Step badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-light/40 border border-accent/20">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-accent">
              {frame.overline}
            </span>
          </div>

          {/* Headline */}
          <h3 className="text-[22px] font-semibold leading-tight tracking-tight text-ink">
            {frame.headline}
          </h3>

          {/* Chat preview (or receipt for Frame 4) — inline */}
          {frame.receipt ? (
            <div className="flex flex-col gap-3">
              {activeVariant && activeVariant.bubbles.length > 0 && (
                <div key={`bubbles-${variantIndex}`} className="flex flex-col gap-2.5">
                  <VariantBubbles variant={activeVariant} />
                </div>
              )}
              <ReceiptInline variants={variants} variantIndex={variantIndex} />
              {variants && activeVariant && (
                <div className="flex justify-center pt-1">
                  <RouteCaption
                    variantIndex={variantIndex}
                    total={variants.length}
                    label={activeVariant.label}
                    delay={computeCaptionDelay([], activeVariant.bubbles, true)}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {frame.bubbles.map((b, i) => (
                <ChatMessage key={i} bubble={b} index={i} revealed={revealed} />
              ))}
              {activeVariant && !frame.silentVariants && (
                <VariantBubbles
                  key={variantIndex}
                  variant={activeVariant}
                  indexOffset={frame.bubbles.length}
                />
              )}
              {variants && activeVariant && !frame.silentVariants && (
                <div className="flex justify-center pt-1">
                  <RouteCaption
                    variantIndex={variantIndex}
                    total={variants.length}
                    label={activeVariant.label}
                    delay={computeCaptionDelay(frame.bubbles, activeVariant.bubbles, frame.receipt ?? false)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Scene caption */}
          <p
            className="text-center text-[11px] italic pb-2"
            style={{ color: 'rgba(80,60,40,0.7)' }}
          >
            {frame.sceneCaption}
          </p>
        </div>
      </div>

      {/* ════════════════════════ DESKTOP LAYOUT (md+) ════════════════════════
          Image full-bleed; chat column + body card overlay on opposite sides;
          watermark and scene caption pinned absolutely. */}
      <div className="hidden md:block absolute inset-0">
        {/* Layer 1 — full-bleed image */}
        <FullBleedMedia frame={frame} revealed={revealed} imagePath={activeImagePath} />

        {/* Layer 2 — chat column (or receipt panel for Frame 4) */}
        {frame.receipt ? (
          <ReceiptOverlay
            revealed={revealed}
            side={frame.bodyPlacement === 'left' ? 'right' : 'left'}
            variants={variants}
            variantIndex={variantIndex}
            activeVariant={activeVariant}
          />
        ) : (
          <ChatColumn
            frame={frame}
            revealed={revealed}
            variantIndex={variantIndex}
            activeVariant={activeVariant}
          />
        )}

        {/* Layer 3 — frame number watermark */}
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

        {/* Layer 4 — body content overlay */}
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
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-light/40 border border-accent/20 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-accent">
                  {frame.overline}
                </span>
              </div>

              <h3
                className="text-[28px] md:text-[34px] lg:text-[40px] font-semibold leading-[1.05] tracking-tight"
                style={{
                  color: 'rgba(255,248,232,0.96)',
                  textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 0 16px rgba(0,0,0,0.35)',
                }}
              >
                {frame.headline}
              </h3>
            </div>
          </div>
        </div>

        {/* Layer 5 — scene caption */}
        <p
          className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11.5px] italic whitespace-nowrap"
          style={{
            color: 'rgba(255,248,232,0.85)',
            textShadow: '0 1px 3px rgba(0,0,0,0.6), 0 0 8px rgba(0,0,0,0.35)',
            opacity: revealed ? 1 : 0,
            transition: 'opacity 700ms ease 700ms',
          }}
        >
          {frame.sceneCaption}
        </p>
      </div>
    </div>
  );
};

// Inline receipt for mobile — same content as ReceiptOverlay but rendered in
// document flow rather than absolute-positioned.
const ReceiptInline = ({
  variants,
  variantIndex,
}: {
  variants?: Variant[];
  variantIndex: number;
}) => {
  const activeVariant = variants?.[variantIndex];
  const route = activeVariant?.receiptRoute ?? {
    routedTo: '988 Lifeline',
    statusLabel: 'Resource',
    statusValue: 'Accepted',
  };
  return (
  <div
    className="rounded-2xl p-4 shadow-md w-full"
    style={{
      background: 'rgba(252,246,234,0.96)',
      border: '1px solid rgba(180,150,100,0.32)',
    }}
  >
    <p className="text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: TEAL }}>
      Protocol complete
    </p>
    <div className="flex items-baseline gap-2 mt-1 mb-3">
      <span className="text-[28px] font-semibold leading-none text-ink">17.5s</span>
      <span className="text-[12px] text-muted">total</span>
    </div>
    <div
      className="rounded-xl p-3 mb-3 space-y-2"
      style={{ background: 'rgba(255,251,240,0.7)', border: '1px solid rgba(180,150,100,0.18)' }}
    >
      <ReceiptRow label="Event" value="Check-in completed" />
      <div
        key={`route-${variantIndex}`}
        className="space-y-2"
        style={{ animation: 'bf-fade-up 460ms cubic-bezier(0.16,1,0.3,1) 1200ms both' }}
      >
        <ReceiptRow label="Routed to" value={route.routedTo} />
        <ReceiptRow label={route.statusLabel} value={route.statusValue} />
      </div>
      <ReceiptRow label="Hash" value="0x7a3e…b91d" mono color={TEAL} />
    </div>
    <ul className="space-y-1 text-[11px]" style={{ color: 'rgba(70,50,30,0.85)' }}>
      <li className="flex items-center gap-2"><Check size={11} className="text-accent shrink-0" /> No name recorded</li>
      <li className="flex items-center gap-2"><Check size={11} className="text-accent shrink-0" /> No notes, no diagnosis</li>
      <li className="flex items-center gap-2"><Check size={11} className="text-accent shrink-0" /> Auto-purges in 90 days</li>
    </ul>
    <div className="mt-3 flex items-center justify-between pt-2 border-t" style={{ borderColor: 'rgba(180,150,100,0.18)' }}>
      <span className="text-[9px] font-bold tracking-[0.14em] uppercase" style={{ color: 'rgba(90,60,30,0.6)' }}>
        Compliant by Design
      </span>
      <span className="text-[10px] font-bold tracking-[0.06em] text-ink">OSHA · ADA · HIPAA</span>
    </div>
  </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// MAIN — auto-playing slideshow shell. After the last frame, the user clicks
// "Finish" to open the step-ladder directly (no intermediate prompt).
// ──────────────────────────────────────────────────────────────────────────

const ProtocolStoryboard = () => {
  const [activeContext, setActiveContext] = useState<ContextKey>('work');
  // Narrative phase: 'opening' = title card, 'playing' = the four-step
  // walkthrough, 'closing' = takeaway card before the Live Demo.
  const [phase, setPhase] = useState<'opening' | 'playing' | 'closing'>('opening');
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [showStepper, setShowStepper] = useState(false);
  const [paused, setPaused] = useState(false);

  const frames = FRAMES_BY_CONTEXT[activeContext];
  const total = frames.length;
  const frame = frames[activeIndex];
  const context = CONTEXTS.find((c) => c.key === activeContext)!;

  // Switch context — resets to first step, clears pause, replays the
  // opening card so the new setting starts as its own short film.
  const switchContext = (key: ContextKey) => {
    if (key === activeContext) return;
    setActiveContext(key);
    setActiveIndex(0);
    setDirection('forward');
    setPaused(false);
    setPhase('opening');
  };

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
      // Last frame's Next plays the closing card before the Live Demo.
      setPhase('closing');
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
    setPhase('opening');
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
      style={{ background: '#ffffff' }}
    >
      <style>{`
        @keyframes bf-frame-in-right { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bf-frame-in-left  { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bf-fade-up        { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bf-pulse-ring     { 0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.35); } 50% { box-shadow: 0 0 0 14px rgba(16,185,129,0); } }
        @keyframes bf-progress-fill  { from { width: 0%; } to { width: 100%; } }
        /* Frame 4 receipt panel — stagger each direct child + each checkmark
           in for a "credits roll" reveal once the panel itself has slid in.
           Direct children of .bf-receipt-content (in document order):
             1. Drag-handle whisker
             2. "PROTOCOL COMPLETE" overline
             3. "17.5s · total" headline row
             4. Info panel (Event/Routed to/Resource/Hash)
             5. <ul> with 3 checkmark items (animated per-li, not as a whole)
             6. "COMPLIANT BY DESIGN · OSHA · ADA · HIPAA" footer */
        .bf-receipt-content > *:not(ul) {
          animation: bf-fade-up 540ms cubic-bezier(0.16,1,0.3,1) both;
        }
        .bf-receipt-content > *:nth-child(1) { animation-delay: 1300ms; }
        .bf-receipt-content > *:nth-child(2) { animation-delay: 1430ms; }
        .bf-receipt-content > *:nth-child(3) { animation-delay: 1560ms; }
        .bf-receipt-content > *:nth-child(4) { animation-delay: 1720ms; }
        .bf-receipt-content > *:nth-child(6) { animation-delay: 2240ms; }
        .bf-receipt-content ul > li {
          animation: bf-fade-up 480ms cubic-bezier(0.16,1,0.3,1) both;
        }
        .bf-receipt-content ul > li:nth-child(1) { animation-delay: 1900ms; }
        .bf-receipt-content ul > li:nth-child(2) { animation-delay: 2010ms; }
        .bf-receipt-content ul > li:nth-child(3) { animation-delay: 2120ms; }
        /* Body card on Frames 1–4 — stagger the inner content sections so
           paragraphs / safety checks / scripts / tables / data rules cascade
           in rather than appearing all at once. Selector reaches through the
           outer space-y wrapper to the actual content blocks. */
        .bf-body-card > div > * {
          animation: bf-fade-up 480ms cubic-bezier(0.16,1,0.3,1) both;
        }
        .bf-body-card > div > *:nth-child(1) { animation-delay: 700ms; }
        .bf-body-card > div > *:nth-child(2) { animation-delay: 850ms; }
        .bf-body-card > div > *:nth-child(3) { animation-delay: 1000ms; }
        .bf-body-card > div > *:nth-child(4) { animation-delay: 1150ms; }
        .bf-body-card > div > *:nth-child(5) { animation-delay: 1300ms; }
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
      <header className="relative z-30 shrink-0 px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 md:py-4 flex items-center justify-between gap-2 bg-white/85 backdrop-blur-md border-b border-hair">
        {/* Left spacer — mirrors the width of the right-side controls so the
            centered title stays on viewport-axis. Invisible on mobile (title
            hidden anyway). */}
        <div className="hidden sm:block w-[80px]" aria-hidden />

        <div className="text-center hidden sm:block min-w-0">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-caption mb-0.5">The Protocol · v1.0</p>
          <p className="text-[13px] md:text-[14px] font-semibold text-ink leading-tight truncate">
            Four steps. Thirty seconds. <span className="hidden md:inline text-muted font-normal">— You are the first responder, not the therapist.</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-hair shadow-sm hover:border-accent transition-colors"
            aria-label={paused ? 'Resume' : 'Pause'}
            title={paused ? 'Resume' : 'Pause'}
          >
            {paused ? <Play size={12} className="text-muted" /> : <Pause size={12} className="text-muted" />}
          </button>
          <div className="text-[12px] font-semibold tabular-nums">
            <span className="text-ink">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="text-caption/50 mx-1">/</span>
            <span className="text-muted">{String(total).padStart(2, '0')}</span>
          </div>
        </div>
      </header>

      {/* ── CONTEXT TOGGLE ── three pills, first active by default. Switching
          smoothly resets the walkthrough to step 1 of the chosen setting. */}
      <div className="relative z-30 shrink-0 flex items-center justify-center gap-2 px-3 sm:px-5 md:px-8 py-2.5 bg-white/85 backdrop-blur-md border-b border-hair">
        {CONTEXTS.map((ctx) => {
          const isActive = ctx.key === activeContext;
          return (
            <button
              key={ctx.key}
              onClick={() => switchContext(ctx.key)}
              className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-white text-muted border border-hair hover:border-accent hover:text-ink'
              }`}
            >
              {ctx.label}
            </button>
          );
        })}
      </div>

      {/* ── SEGMENTED PROGRESS BAR ── */}
      <div className="relative z-30 shrink-0 flex items-center gap-1 px-3 sm:px-5 md:px-8 py-2 bg-white/85 backdrop-blur-md border-b border-hair">
        {frames.map((f, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <div key={f.n} className="flex-1 h-[3px] rounded-full overflow-hidden bg-hair">
              {isActive ? (
                <div
                  key={`bar-${activeIndex}-${paused ? 'p' : 'r'}`}
                  className="h-full bg-accent"
                  style={{
                    animation: `bf-progress-fill ${f.duration}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              ) : (
                <div className="h-full bg-accent" style={{ width: isPast ? '100%' : '0%' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── FRAME STAGE ── */}
      <main className="relative flex-1 min-h-0 overflow-hidden">
        {phase === 'opening' ? (
          <IntroCard
            key={`opening-${activeContext}`}
            variant="opening"
            context={context}
            duration={3500}
            onComplete={() => setPhase('playing')}
          />
        ) : phase === 'closing' ? (
          <IntroCard
            key="closing"
            variant="closing"
            context={context}
            duration={2800}
            onComplete={() => setShowStepper(true)}
          />
        ) : (
          <Frame key={`${activeContext}-${frame.n}`} frame={frame} direction={direction} paused={paused} />
        )}
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
          {/* Paper-grain texture — faint SVG fractal noise multiplied over the
              cream gradient for warmth. pointer-events-none so it never blocks
              the embedded chat. */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
              opacity: 0.16,
              mixBlendMode: 'multiply',
            }}
          />

          {/* Header — live-activity badge + title + Replay */}
          <header className="relative z-10 shrink-0 px-5 md:px-8 py-3 flex items-center justify-between gap-2 border-b border-hair/60 bg-white/80 backdrop-blur-md">
            {/* Live activity badge — mirrors the Replay button width so the title stays centred */}
            <div className="hidden sm:flex items-center gap-2.5 w-[170px] shrink-0">
              <span
                className="relative inline-flex h-2 w-2 rounded-full shrink-0"
                style={{
                  background: '#10b981',
                  animation: 'bf-pulse-ring 2200ms cubic-bezier(0.4,0,0.6,1) infinite',
                }}
              />
              <span className="text-[11px] font-medium text-muted whitespace-nowrap leading-tight">
                In use at <span className="text-ink font-semibold tabular-nums">12 orgs</span> this week
              </span>
            </div>
            <div className="text-center min-w-0">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-caption mb-0.5">Live demo</p>
              <p className="text-[13px] font-semibold text-ink">Try the protocol yourself</p>
            </div>
            <button
              onClick={replay}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-semibold text-ink bg-white border border-hair hover:border-accent hover:text-accent transition-colors shrink-0"
            >
              <RotateCcw size={12} /> <span className="hidden sm:inline">Replay walkthrough</span>
            </button>
          </header>

          {/* Live demo stage — embedded ProtocolConversationSection (the original
              immersive scene) with step callouts + recent check-ins hidden so it
              fits the viewport with no scrolling. */}
          <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
            <ProtocolConversationSection embedded />
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      <footer className="relative z-30 shrink-0 px-3 sm:px-5 md:px-8 py-2.5 sm:py-3 md:py-4 flex items-center justify-between gap-2 bg-white/85 backdrop-blur-md border-t border-hair">
        <button
          onClick={goPrev}
          disabled={activeIndex === 0}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[13px] font-semibold border border-hair bg-white text-ink hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-hair disabled:hover:text-ink shrink-0"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-2">
          {frames.map((f, i) => {
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
                    background: isActive ? TEAL : isVisited ? '#0b0b0f' : 'rgba(0,0,0,0.18)',
                  }}
                />
                <span
                  className={`text-[10.5px] font-bold tracking-[0.14em] uppercase tabular-nums hidden md:inline transition-colors ${
                    isActive ? 'text-accent' : isVisited ? 'text-ink/85' : 'text-caption/60'
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
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[13px] font-semibold bg-accent text-white hover:opacity-90 transition-opacity shrink-0"
          >
            <span>Next</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={() => setPhase('closing')}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[13px] font-semibold bg-accent text-white hover:opacity-90 transition-opacity shadow-md shrink-0"
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
