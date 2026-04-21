import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Check,
  ArrowRight,
  Shield,
  BarChart3,
  Users,
  Scale,
  FileText,
  Clock,
  Target,
  Globe,
  Lock,
  AlertCircle,
  BookOpen,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Apple-style animation variants */
export const APPLE_EASE = [0.25, 0.1, 0.25, 1.0] as any;

export const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: APPLE_EASE }}
  >
    {children}
  </motion.div>
);

export const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: APPLE_EASE }}
    className={className}
  >
    {children}
  </motion.div>
);

/** Page entrance animation wrapper */
export const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: APPLE_EASE }}
  >
    {children}
  </motion.div>
);

/** Page-level CTA that links to /partner */
export const PartnerCTA = ({ headline = "Ready to partner?", buttonText = "Partner with us", secondaryText }: { headline?: string; buttonText?: string; secondaryText?: string }) => (
  <section className="section bg-accent-light/50 border-none py-32">
    <div className="container text-center max-w-[800px] mx-auto">
      <FadeIn>
        <h2 className="mb-8 mx-auto">{headline}</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link to="/partner" className="btn-primary px-6 md:px-10 py-3 md:py-5 text-base md:text-lg h-auto">{buttonText}</Link>
          {secondaryText && (
            <Link to="/partner" className="btn-ghost px-6 md:px-10 py-3 md:py-5 text-base md:text-lg h-auto bg-white border-accent">{secondaryText}</Link>
          )}
        </div>
        <p className="mt-12 caption font-bold mx-auto">Questions: hello@butterfly.one · Response within 24 business hours</p>
      </FadeIn>
    </div>
  </section>
);

// --- Navbar ---

export const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Challenge', href: '/challenge' },
    { name: 'Protocol', href: '/protocol' },
    { name: 'About', href: '/about' },
    { name: 'Partner', href: '/partner' },
  ];

  return (
    <>
      <nav className="block top-0 left-0 right-0 z-40 h-[56px] bg-transparent">
        <div className="container h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoSvg} alt="butterfly.one" className="w-6 h-6" />
            <span className="font-semibold text-ink tracking-tight">butterfly.one</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-caption hover:text-ink text-[14px] font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a href="https://donate.butterfly.one" className="btn-primary py-2 px-5 text-[13px]">Donate</a>
          </div>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isSticky && (
          <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.4, ease: APPLE_EASE }}
            className="fixed top-0 left-0 right-0 z-50 h-[56px] border-b border-hair bg-white/80 backdrop-blur-md shadow-sm"
          >
            <div className="container h-full flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <img src={logoSvg} alt="butterfly.one" className="w-5 h-5" />
                <span className="font-semibold text-ink tracking-tight text-sm">butterfly.one</span>
              </Link>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-caption hover:text-ink text-[12px] font-medium transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <a href="https://donate.butterfly.one" className="btn-primary py-1 px-4 text-[12px]">Donate</a>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[56px] left-0 right-0 bottom-0 z-50 bg-white p-6 flex flex-col gap-4 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-ink text-lg font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-auto border-t border-hair">
              <a
                href="https://donate.butterfly.one"
                className="btn-primary w-full py-3 text-[15px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Donate
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Hero ---

// @ts-ignore
import videoSrc from '../gestu.mp4';
// @ts-ignore
import graphicImg from '../graphic.jpg';
// @ts-ignore
import logoSvg from '../OneHumanity_logo_symbol_black.svg';

export const Hero = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const now = new Date();
    const may2026 = new Date('2026-05-01');
    if (now >= may2026) {
      setShowBanner(true);
    }
  }, []);

  return (
    <section id="overview" className="relative md:h-screen flex flex-col justify-end overflow-hidden pt-[56px] pb-12 md:pb-24 bg-white">
      <div className="relative md:absolute inset-0 z-0 h-[240px] md:h-full">
        <video
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
          onEnded={(e) => (e.currentTarget.pause())}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 backdrop-blur-md z-10 hidden md:block"
          style={{
            maskImage: 'linear-gradient(to top, black, transparent)',
            WebkitMaskImage: 'linear-gradient(to top, black, transparent)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent z-10 pointer-events-none" />
      </div>

      <div className="container relative z-20 mt-8 md:mt-0">
        {showBanner && (
          <Reveal delay={0.4}>
            <div className="mb-8 inline-flex items-center gap-3 bg-accent-light/50 border border-accent/20 px-4 py-2 rounded-full">
              <span className="text-accent text-sm font-bold">📊 [X] people raised their hand in May 2026.</span>
              <a href="https://butterflychallenge.com" className="text-accent text-sm font-bold underline">Here's what happens next at work.</a>
            </div>
          </Reveal>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12">
          <div className="max-w-[700px] text-left">
            <Reveal delay={0.5}>
              <span className="overline mb-2 block font-bold text-caption">THE STANDARD</span>
            </Reveal>
            <Reveal delay={0.6}>
              <h1 className="mb-4 text-ink leading-tight">The Butterfly Movement makes it safe to be human at work.</h1>
            </Reveal>
            <Reveal delay={0.7}>
              <p className="text-[18px] md:text-[22px] text-muted font-medium leading-tight">
                A 30-second protocol. See. Stay. Ask. Connect.
              </p>
            </Reveal>
            <Reveal delay={0.72}>
              <p className="text-[16px] md:text-[18px] text-muted font-semibold italic mt-2">
                Show up.
              </p>
            </Reveal>
            <Reveal delay={0.8}>
              <p className="text-[15px] text-muted mt-4 leading-relaxed max-w-[600px]">
                The Butterfly Challenge teaches the world to recognize the sign. This site shows organizations what to do when they see it.{' '}
                <a href="https://butterflychallenge.com" className="text-accent font-bold hover:underline">butterflychallenge.com →</a>
              </p>
            </Reveal>

            {/* 4-Step Protocol Diagram: SEE → STAY → ASK → CONNECT */}
            <Reveal delay={0.85}>
              <div className="flex flex-wrap items-center gap-y-2 mt-6">
                {[
                  { num: "1", label: "SEE" },
                  { num: "2", label: "STAY" },
                  { num: "3", label: "ASK" },
                  { num: "4", label: "CONNECT" },
                ].map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold text-[12px] sm:text-[13px] shrink-0">
                        {step.num}
                      </div>
                      <span className="text-ink font-semibold text-[13px] sm:text-[14px] whitespace-nowrap tracking-wider">{step.label}</span>
                    </div>
                    {i < 3 && (
                      <ChevronRight size={14} className="text-caption/40 mx-1 sm:mx-2 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col items-start md:items-end gap-6">
            <Reveal delay={0.9}>
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-bg-muted/40 md:backdrop-blur-lg md:p-2 rounded-2xl md:rounded-[32px] md:border border-white/20 md:shadow-sm">
                <Link to="/partner" className="btn-primary px-8 py-3.5 text-[16px] shadow-lg shadow-accent/20 whitespace-nowrap">
                  Request Implementation Brief
                </Link>
                <Link
                  to="/evidence"
                  className="group px-6 py-3.5 text-ink font-semibold flex items-center justify-start gap-2 text-[16px] hover:text-accent transition-colors whitespace-nowrap"
                >
                  View the Evidence
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={1.2}>
              <div className="text-caption text-[11px] font-bold uppercase tracking-[0.2em] opacity-50">
                Protocol v1.0 · One Humanity Foundation · 501(c)(3) · Effective May 2026
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Highlights ---

const HighlightModal = ({ item, onClose }: { item: any; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="bg-white rounded-[32px] p-8 md:p-12 max-w-[540px] w-full relative shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-bg-muted hover:bg-hair transition-colors"
      >
        <X size={20} />
      </button>
      <div className="mb-8 p-4 bg-bg-muted rounded-2xl inline-block">
        <item.icon size={32} className="text-accent" />
      </div>
      <span className="overline mb-2 block">{item.metric}</span>
      <h2 className="text-[32px] md:text-[40px] leading-tight mb-6 text-ink">{item.modalTitle || item.metric}</h2>
      <p className="text-[18px] md:text-[20px] text-muted leading-relaxed mb-8">
        {item.longDesc || item.desc}
      </p>
      <Link to="/evidence" className="flex items-center gap-2 text-accent font-bold text-[18px] hover:underline">
        Learn more <ChevronRight size={20} />
      </Link>
    </motion.div>
  </motion.div>
);

export const Highlights = () => {
  const [activeItem, setActiveItem] = useState<any>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const items = [
    { metric: '30 seconds', desc: 'From signal to support in under a minute.', icon: Clock, modalTitle: 'Speed saves lives.', longDesc: 'The Butterfly Protocol is built on the scientific principle of implementation intentions. By reducing the time between a signal and a response, we eliminate the "bystander effect" and provide immediate stability before a situation escalates.' },
    { metric: '£4.70 return', desc: 'Average ROI in workplace mental health programs.', icon: BarChart3, footnote: '1', modalTitle: 'The Business Case', longDesc: 'Mental health turnover and attrition costs organizations billions annually. Research by Deloitte UK indicates that for every £1 spent on mental health support, organizations see a £4.70 return through reduced absenteeism and higher engagement.' },
    { metric: 'Upstream adoption', desc: 'Designed for the 97% who never call EAP.', icon: Users, modalTitle: 'Broad Coverage', longDesc: 'Most workplace mental health programs (EAPs) have a utilization rate of less than 3%. The Butterfly Protocol is designed for everyone else — the 97% who are struggling but haven\'t yet reached a clinical crisis point.' },
    { metric: 'Governed standard', desc: 'Versioned. Auditable. Improvable.', icon: Shield, modalTitle: 'Safety Registry', longDesc: 'Unlike "wellbeing workshops," the Butterfly Protocol is an operational safety standard. It is version-controlled, auditable, and designed to be integrated into existing risk management frameworks (ISO 45003).' },
    { metric: 'Privacy-first', desc: 'No PII. No diagnosis. No surveillance.', icon: Lock, modalTitle: 'Absolute Privacy', longDesc: 'By strictly separating "recognition and routing" from clinical "therapy," we ensure that no personally identifiable information (PII) is ever recorded in HR systems. This protects the employee and reduces organization liability.' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="section !px-0 bg-bg-muted/50 overflow-hidden pb-32">
      <div className="container mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <FadeIn>
            <span className="overline mb-4 block">AT A GLANCE</span>
            <h2 className="mb-0 pb-1 leading-[1.2] text-transparent bg-clip-text bg-gradient-to-r from-ink to-accent">Get the highlights.</h2>
          </FadeIn>
          <Link to="/evidence" className="flex self-start items-center gap-1 text-accent font-bold hover:underline mb-2">
            Read the white paper <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12 cursor-grab active:cursor-grabbing w-full">
          <div className="shrink-0 snap-start pointer-events-none" style={{ width: 'calc(max(24px, calc((100vw - 1536px) / 2 + 24px)) - 24px)' }} />
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 0.1} className="shrink-0 snap-start">
              <div
                className="card card-hover h-full w-[calc(100vw-48px)] sm:w-[280px] md:w-[360px] min-h-[360px] md:min-h-[440px] flex flex-col justify-between bg-white hover:shadow-xl transition-all border-none p-6 md:p-10 cursor-pointer group"
                onClick={() => setActiveItem(item)}
              >
                <div className="mb-auto">
                  <div className="mb-10 w-12 h-12 flex items-center justify-center bg-bg-muted rounded-2xl group-hover:bg-accent-light/30 transition-colors">
                    <item.icon size={26} className="text-ink stroke-[1.5px] group-hover:text-accent transition-colors" />
                  </div>
                  <div className="font-bold text-[28px] md:text-[32px] mb-4 leading-tight">{item.metric}</div>
                  <div className="text-[18px] md:text-[20px] text-muted leading-snug">
                    {item.desc} {item.footnote && <sup className="text-[12px] text-accent font-bold">{item.footnote}</sup>}
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center transition-all">
                    <Plus size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
          <div className="shrink-0 snap-start pointer-events-none" style={{ width: 'calc(max(24px, calc((100vw - 1536px) / 2 + 24px)) - 24px)' }} />
        </div>

        <div className="container">
          <div className="flex justify-start md:justify-end gap-3 mt-4">
            <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-hair bg-white flex items-center justify-center hover:bg-bg-muted transition-colors shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-hair bg-white flex items-center justify-center hover:bg-bg-muted transition-colors shadow-sm">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeItem && <HighlightModal item={activeItem} onClose={() => setActiveItem(null)} />}
      </AnimatePresence>
    </section>
  );
};

// --- Context + Chart ---

const VolatilityChart = () => {
  useEffect(() => {
    // @ts-ignore
    if (!window.AmCharts) return;
    // Read brand accent colors from CSS variables so chart matches design system
    const rootStyles = getComputedStyle(document.documentElement);
    const accent = rootStyles.getPropertyValue('--accent').trim() || '#0A4AD6';
    const accentLight = rootStyles.getPropertyValue('--accent-light').trim() || '#E8EEFB';
    const chartData = [
      { year: "2018", attrition: 8, incidents: 4, stress: 30 },
      { year: "2019", attrition: 10, incidents: 6, stress: 35 },
      { year: "2020", attrition: 15, incidents: 10, stress: 50 },
      { year: "2021", attrition: 18, incidents: 15, stress: 62 },
      { year: "2022", attrition: 24, incidents: 22, stress: 75 },
      { year: "2023", attrition: 32, incidents: 35, stress: 88 },
      { year: "2024", attrition: 41, incidents: 50, stress: 95 },
      { year: "2025", attrition: 52, incidents: 68, stress: 110 },
      { year: "2026", attrition: 65, incidents: 85, stress: 130 }
    ];
    // @ts-ignore
    const chart = window.AmCharts.makeChart("chartdiv", {
      type: "serial", fontFamily: "system-ui, -apple-system, sans-serif", autoMargins: true, addClassNames: true, zoomOutText: "",
      defs: {
        filter: [
          { x: "-50%", y: "-50%", width: "200%", height: "200%", id: "blur", feGaussianBlur: { in: "SourceGraphic", stdDeviation: "50" } },
          { id: "shadow", width: "150%", height: "150%", feOffset: { result: "offOut", in: "SourceAlpha", dx: "2", dy: "2" }, feGaussianBlur: { result: "blurOut", in: "offOut", stdDeviation: "10" }, feColorMatrix: { result: "blurOut", type: "matrix", values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .2 0" }, feBlend: { in: "SourceGraphic", in2: "blurOut", mode: "normal" } }
        ]
      },
      fontSize: 12, dataProvider: chartData, dataDateFormat: "YYYY", marginTop: 0, marginRight: 1, marginLeft: 0, autoMarginOffset: 5, categoryField: "year",
      categoryAxis: { gridAlpha: 0.07, axisColor: "#DADADA", startOnAxis: true, tickLength: 0, parseDates: true, minPeriod: "YYYY" },
      valueAxes: [{ ignoreAxisWidth: true, stackType: "regular", gridAlpha: 0.07, axisAlpha: 0, inside: true }],
      graphs: [
        { id: "g1", type: "line", title: "Attrition", valueField: "attrition", fillColors: ["#E9E9EF", "#D6D6DF"], lineAlpha: 0, fillAlphas: 0.8, showBalloon: false },
        { id: "g2", type: "line", title: "Incidents", valueField: "incidents", lineAlpha: 0, fillAlphas: 0.8, lineColor: accentLight, showBalloon: false },
        { id: "g3", title: "Volatility Signals", valueField: "stress", lineAlpha: 0.5, lineColor: accent, bullet: "round", dashLength: 2, bulletBorderAlpha: 1, bulletAlpha: 1, bulletSize: 10, stackable: false, bulletColor: "#0B0B0F", bulletBorderColor: "#FFFFFF", bulletBorderThickness: 3, balloonText: "<div style='margin-bottom:30px;text-shadow: 2px 2px rgba(0, 0, 0, 0.1); font-weight:600;font-size:24px; color:#000000'>[[value]]</div>" }
      ],
      chartCursor: { cursorAlpha: 1, zoomable: false, cursorColor: accent, categoryBalloonColor: "#0B0B0F", fullWidth: true, categoryBalloonDateFormat: "YYYY", balloonPointerOrientation: "vertical" },
      balloon: { borderAlpha: 0, fillAlpha: 0, shadowAlpha: 0, offsetX: 40, offsetY: -50 }
    });
    chart.addListener("dataUpdated", () => { chart.zoomToIndexes(1, chartData.length - 1); });
    return () => { if (chart) chart.clear(); };
  }, []);
  return <div id="chartdiv"></div>;
};

export const Context = () => (
  <section className="section">
    <div className="container">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <FadeIn>
            <span className="overline mb-4 block uppercase tracking-widest font-bold">THE GAP</span>
            <h2 className="mb-6">Volatility is rising.</h2>
            <p className="mb-0">
              Work is faster. Feedback is louder. AI is rewriting identity. Small emotional misses compound into attrition, incidents, and reputational risk. Support exists — but utilization doesn't.
            </p>
          </FadeIn>
        </div>
        <div className="flex-1 w-full">
          <FadeIn delay={0.2} className="w-full">
            <div className="relative h-[280px] sm:h-[350px] md:h-[400px] flex items-center justify-center w-full">
              <VolatilityChart />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  </section>
);

// --- Category ---

export const Category = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn className="text-center mb-16">
        <h2 className="text-[#111] text-[28px] md:text-[64px] font-bold mb-4 md:mb-6 tracking-tight leading-tight max-w-4xl mx-auto w-[90%] md:w-full">
          A standard, not a program.
        </h2>
        <p className="max-w-2xl mx-auto text-[14px] md:text-[20px] text-[#444] font-medium leading-relaxed">
          Programs are optional. Standards are operational. The Butterfly Protocol is a shared micro-behavior designed to be trained, measured, audited, and improved — like any safety system. Visible care, built into the workday.
        </p>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-10 lg:gap-16 max-w-5xl mx-auto">
        {[
          { title: 'Scope', text: 'Workplace, education, sport, community', icon: Globe },
          { title: 'Definition', text: 'A structured check-in triggered by observable signals', icon: Target },
          { title: 'Interfaces', text: 'Integrates with EAP, crisis lines, HR systems', icon: Lock }
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <item.icon size={24} className="text-[#111] mb-2 md:mb-6" strokeWidth={1.5} />
            <p className="text-[12px] md:text-[14px] leading-relaxed text-[#555]">
              <span className="text-[#111] font-bold">{item.title}</span> — {item.text}.
            </p>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// --- Protocol Stepper ---

export const ProtocolStepper = () => {
  const [activeTab, setActiveTab] = useState(0);
  const steps = [
    {
      title: "1. SEE", overline: "STEP 1", headline: "Recognize the signals.",
      content: (
        <div className="space-y-6">
          <p>Recognize signals — withdrawal, behavioral shift, distress, or the gesture. Your obligation: respond within the hour. Do not wait for someone else.</p>
          <div className="card bg-bg-muted border-none p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2"><AlertCircle size={18} className="text-accent" /> Quick safety check:</h4>
            <ul className="space-y-3">
              <li className="flex gap-3"><span className="text-ink font-bold">•</span><span>Immediate danger → 911 first</span></li>
              <li className="flex gap-3"><span className="text-ink font-bold">•</span><span>Safe and accessible → Proceed to STAY</span></li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "2. STAY", overline: "STEP 2", headline: "Close the distance.",
      content: (
        <div className="space-y-6">
          <p>Your presence communicates before your words. Use the structure, but keep your own language.</p>
          <div className="space-y-4">
            {[
              { label: 'OPEN', text: '"I noticed something. I wanted to check in."' },
              { label: 'RELEASE PRESSURE', text: '"You don\'t have to explain anything right now."' },
              { label: 'OFFER OPTIONS', text: '"What would help most?"' }
            ].map((block, i) => (
              <div key={i} className="flex flex-col md:flex-row border-l-2 border-accent pl-6 py-2">
                <span className="w-40 font-bold text-caption text-[12px] pt-1">{block.label}</span>
                <span className="text-ink font-medium text-[20px]">{block.text}</span>
              </div>
            ))}
          </div>
          <p className="caption">Note: "These are not magic words. They are the structure. Keep the sequence."</p>
        </div>
      )
    },
    {
      title: "3. ASK", overline: "STEP 3", headline: "Recognize and route.",
      content: (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="border-b border-hair"><th className="py-4 font-bold text-caption text-[12px] uppercase">Response</th><th className="py-4 font-bold text-caption text-[12px] uppercase">Your Action</th></tr></thead>
              <tbody className="divide-y divide-hair">
                <tr><td className="py-4 font-medium italic pr-4">"I just need a moment"</td><td className="py-4">"I'll check back in 30 minutes."</td></tr>
                <tr><td className="py-4 font-medium italic pr-4">"I'd like to talk to someone"</td><td className="py-4">Open Resource Map together.</td></tr>
                <tr><td className="py-4 font-medium italic pr-4">Signs of immediate risk</td><td className="py-4">"Let's call 988 together." Stay.</td></tr>
                <tr><td className="py-4 font-medium italic pr-4">Refuses all support</td><td className="py-4">Document. Escalate today.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="caption mt-4">Note: "Do not attempt to assess suicide risk. Do not ask clinical questions. Your job is recognition and routing — not evaluation."</p>
        </div>
      )
    },
    {
      title: "4. CONNECT", overline: "STEP 4", headline: "Close the loop.",
      content: (
        <div className="space-y-6">
          <p>Log without PII/PHI: date, that a check-in occurred, routing offered, whether accepted.</p>
          <div className="card border-accent/20 bg-accent-light/20 p-8">
            <h4 className="font-bold text-ink mb-4 flex items-center gap-2"><Shield size={20} className="text-accent" /> NON-NEGOTIABLE DATA RULES:</h4>
            <ul className="space-y-3 text-[15px]">
              <li className="flex gap-3"><span className="text-accent font-bold">/</span><span>Logs stored in SEPARATE system from HR performance records — never in HRIS</span></li>
              <li className="flex gap-3"><span className="text-accent font-bold">/</span><span>Automatic 90-day retention limit — then purged</span></li>
              <li className="flex gap-3"><span className="text-accent font-bold">/</span><span>Logs may NOT be referenced in performance reviews, disciplinary actions, PIPs, or termination proceedings</span></li>
              <li className="flex gap-3"><span className="text-accent font-bold">/</span><span>Model data governance policy included in deployment kit for your GC</span></li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="protocol" className="section bg-white">
      <div className="container">
        <FadeIn>
          <span className="overline mb-4 block">THE PROTOCOL (V1.0)</span>
          <h2 className="mb-12 max-w-[800px]">Four steps. Thirty seconds. You are the first responder, not the therapist.</h2>
        </FadeIn>
        <div className="flex flex-col gap-8 md:gap-12">
          <div className="flex border-b border-hair overflow-x-auto no-scrollbar">
            {steps.map((step, i) => (
              <button key={i} onClick={() => setActiveTab(i)} className={cn("px-6 py-4 text-[14px] font-bold tracking-wider transition-all border-b-2 whitespace-nowrap", activeTab === i ? "border-accent text-accent" : "border-transparent text-caption hover:text-ink")}>
                {step.title}
              </button>
            ))}
          </div>
          <div className="min-h-[300px] md:min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
                <span className="overline mb-4 block text-accent">{steps[activeTab].overline}</span>
                <h3 className="mb-8 text-[32px]">{steps[activeTab].headline}</h3>
                <div className="max-w-[800px]">{steps[activeTab].content}</div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex flex-wrap gap-4 pt-8">
            <button className="btn-ghost px-6 py-3 text-[15px] font-semibold border-hair hover:border-accent">Download Full Protocol — PDF</button>
            <button className="btn-ghost px-6 py-3 text-[15px] font-semibold border-hair hover:border-accent">Print the Pocket Card</button>
            <button className="btn-ghost px-6 py-3 text-[15px] font-semibold border-hair hover:border-accent">Download Poster for Common Areas</button>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Comparison ---

export const Comparison = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn><h2 className="mb-12">What it is. What it isn't.</h2></FadeIn>
      <div className="grid md:grid-cols-2 gap-px bg-hair border border-hair rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-white p-8 md:p-12">
          <h3 className="text-ok text-[20px] mb-8 font-bold">What it does</h3>
          <ul className="space-y-4">
            {["Repeatable 3-step script", "Routes to 988, EAP, counselor", "Auditable record without PII/PHI", "10-minute training", "Strengthens EPLI defense posture"].map(item => (
              <li key={item} className="flex gap-3 text-ink"><Check size={18} className="text-ok mt-1 shrink-0" /><span>{item}</span></li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-8 md:p-12">
          <h3 className="text-ink text-[20px] mb-8 font-bold">What it does NOT do</h3>
          <ul className="space-y-4">
            {["Diagnose mental health conditions", "Replace your Employee Assistance Program", "Require clinical staff to administer", "Collect personal health information", "Create new clinical liability"].map(item => (
              <li key={item} className="flex gap-3 text-muted"><X size={18} className="text-muted mt-1 shrink-0 opacity-40" /><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-12 mb-12 text-center">
        <p className="text-[24px] md:text-[28px] text-ink font-medium italic max-w-[640px] mx-auto leading-snug">
          "This is not therapy. It is the doorbell, not the house."
        </p>
      </div>
      <div className="mt-12 p-8 card border-hair/50">
        <p className="caption uppercase tracking-widest font-bold mb-4">Regulatory note</p>
        <p className="text-[16px] mb-6">"This is a behavioral response framework, not a medical device. Analogous to first-aid training — not HIPAA-governed, not ADA-triggering on its own."</p>
        <div className="pt-6 border-t border-hair">
          <p className="caption uppercase tracking-widest font-bold mb-4">Good Samaritan framework</p>
          <p className="text-[16px]">"This protocol operates as a peer-to-peer recognition framework. Logging a check-in does not constitute formal medical knowledge or create clinical liability. Responders operate within a 'recognition and routing' boundary explicitly defined in training."</p>
        </div>
      </div>
    </div>
  </section>
);

// --- Evidence ---

export const Evidence = () => {
  const data = [
    { claim: "Scripts improve response consistency", evidence: "Implementation intentions: d = 0.65 across 94 studies. Gollwitzer & Sheeran, 2006." },
    { claim: "Stress reduces improvisation capacity", evidence: "PFC suppression under acute stress. Arnsten, 2009. Nature Reviews Neuroscience." },
    { claim: "Checklists reduce adverse outcomes", evidence: "WHO Surgical Safety Checklist: 11% → 7%. Haynes et al., NEJM 2009." },
    { claim: "Bystander inaction is structural", evidence: "g = -0.35 across 7,700 participants. Fischer et al., 2011. Psychological Bulletin." },
    { claim: "Workplace programs generate ROI", evidence: "£4.70 returned per £1 invested. Deloitte UK, 2024." },
    { claim: "Manager training specifically", evidence: "£9.98 returned per £1. Milligan-Saville RCT, 2017." }
  ];

  return (
    <section id="evidence" className="section">
      <div className="container">
        <FadeIn>
          <span className="overline mb-4 block">THE SCIENCE</span>
          <h2 className="mb-12">Why it works — the science, plainly stated.</h2>
        </FadeIn>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b-2 border-ink"><th className="py-4 md:py-6 font-bold text-ink text-[14px] md:text-[16px] pr-4 md:pr-8">Claim</th><th className="py-4 md:py-6 font-bold text-ink text-[14px] md:text-[16px]">Evidence</th></tr></thead>
            <tbody className="divide-y divide-hair">
              {data.map((row, i) => (
                <tr key={i} className="group hover:bg-[rgba(0,0,0,0.04)]" style={{ transition: 'background-color 0.2s ease' }}>
                  <td className="py-4 md:py-8 font-bold text-ink pr-4 md:pr-8 align-top text-[15px] md:text-[18px]">{row.claim}</td>
                  <td className="py-4 md:py-8 text-muted align-top text-[14px] md:text-[16px]">{row.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12 md:mt-20 p-6 md:p-12 card bg-bg-muted border-none max-w-[800px]">
          <h3 className="text-[18px] mb-6 font-bold uppercase tracking-wider text-caption">What we do not claim</h3>
          <ul className="space-y-3 mb-8">
            <li className="flex gap-3 text-muted">• This reduces suicide rates (no outcome study yet)</li>
            <li className="flex gap-3 text-muted">• This replaces clinical intervention</li>
            <li className="flex gap-3 text-muted">• Universal applicability without cultural adaptation</li>
          </ul>
          <Link to="/evidence" className="text-accent font-bold hover:underline flex items-center gap-2">Read the Full White Paper <ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
};

// --- ROI Calculator ---

export const ROICalculator = () => {
  const [employees, setEmployees] = useState(500);
  const [eapUtilization, setEapUtilization] = useState(5.5);
  const [turnoverCost, setTurnoverCost] = useState(15000);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get('e'); const u = params.get('u'); const t = params.get('t');
    if (e) setEmployees(parseInt(e));
    if (u) setEapUtilization(parseFloat(u));
    if (t) setTurnoverCost(parseInt(t));
  }, []);

  const updateParams = (e: number, u: number, t: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('e', e.toString()); params.set('u', u.toString()); params.set('t', t.toString());
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const stats = useMemo(() => {
    const totalImpact = (employees * 0.15) * (turnoverCost * 0.1) * (eapUtilization / 100 + 1);
    const cost = 0 + (employees / 50 * 72);
    const roiRatio = Math.round(totalImpact / cost);
    return { savings: totalImpact.toLocaleString(undefined, { maximumFractionDigits: 0 }), cost: cost.toLocaleString(), roi: roiRatio, laborHrs: Math.round(employees / 50 * 1.2) };
  }, [employees, eapUtilization, turnoverCost]);

  return (
    <section className="section bg-ink text-white">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
          <div className="flex-1">
            <FadeIn>
              <h2 className="text-white mb-8">What this saves your organization.</h2>
              <p className="text-white/60 mb-12">Based on published industry research. First-party data collection begins with your pilot. Sources: Deloitte 2024, Milligan-Saville 2017.</p>
            </FadeIn>
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex justify-between items-center"><span className="font-bold">How many employees?</span><span className="text-accent font-bold text-[20px]">{employees.toLocaleString()}</span></div>
                <input type="range" min="50" max="10000" step="50" value={employees} onChange={(e) => { const val = parseInt(e.target.value); setEmployees(val); updateParams(val, eapUtilization, turnoverCost); }} className="w-full accent-accent bg-white/10 h-1 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-white/40 text-[12px]"><span>50</span><span>10,000+</span></div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center"><span className="font-bold">Current EAP utilization rate?</span><span className="text-accent font-bold text-[20px]">{eapUtilization}%</span></div>
                <input type="range" min="1" max="20" step="0.5" value={eapUtilization} onChange={(e) => { const val = parseFloat(e.target.value); setEapUtilization(val); updateParams(employees, val, turnoverCost); }} className="w-full accent-accent bg-white/10 h-1 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-white/40 text-[12px]"><span>1%</span><span>20% (national avg)</span></div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center"><span className="font-bold">Average employee turnover cost?</span><span className="text-accent font-bold text-[20px]">${turnoverCost.toLocaleString()}</span></div>
                <input type="range" min="5000" max="50000" step="1000" value={turnoverCost} onChange={(e) => { const val = parseInt(e.target.value); setTurnoverCost(val); updateParams(employees, eapUtilization, val); }} className="w-full accent-accent bg-white/10 h-1 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-white/40 text-[12px]"><span>$5K</span><span>$50K+ (industry avg)</span></div>
              </div>
            </div>
          </div>
          <div className="lg:w-[440px] shrink-0">
            <FadeIn delay={0.2}>
              <div className="card bg-white/5 border-white/10 p-6 md:p-10 flex flex-col items-center text-center">
                <span className="overline text-white/40 mb-8 tracking-[0.2em]">YOUR PROJECTED IMPACT</span>
                <div className="w-full space-y-4 mb-12">
                  <div className="flex justify-between text-[14px]"><span className="text-white/60">Protocol deployment cost</span><span className="font-bold">$0</span></div>
                  <div className="flex justify-between text-[14px]"><span className="text-white/60">Training time (10 min/manager)</span><span className="font-bold">{stats.laborHrs} hrs</span></div>
                  <div className="flex justify-between text-[14px]"><span className="text-white/60">Loaded labor cost</span><span className="font-bold text-accent">${stats.cost}</span></div>
                </div>
                <div className="w-full card bg-accent p-10 border-none">
                  <span className="text-white/80 block mb-2 font-bold text-sm">Projected annual savings:</span>
                  <div className="text-[48px] font-bold mb-6 leading-tight">${stats.savings}</div>
                  <div className="pt-6 border-t border-white/20"><span className="text-white/80 font-bold">ROI: {stats.roi}:1</span></div>
                </div>
                <Link to="/partner" className="btn-primary w-full mt-10 h-14 text-lg">Request a Pilot Briefing</Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Training ---

export const Training = () => {
  const blocks = [
    { name: "Why people freeze", time: "2 min", desc: "Stress physiology + bystander effect" },
    { name: "What you are (and aren't)", time: "2 min", desc: "Scope, liability, \"you are the router\"" },
    { name: "Protocol walkthrough", time: "3 min", desc: "Steps 1-4 with role-play scenario" },
    { name: "Red flags + routing", time: "2 min", desc: "When to escalate, how to use 988" },
    { name: "Documentation", time: "1 min", desc: "What to log, where to log it" }
  ];

  return (
    <section id="training" className="section bg-white">
      <div className="container">
        <FadeIn>
          <span className="overline mb-4 block">TRAINING</span>
          <h2 className="mb-12">10 minutes. No certification required.</h2>
        </FadeIn>
        <div className="overflow-x-auto mb-16">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-hair"><th className="py-6 font-bold text-caption text-[12px] uppercase">Block</th><th className="py-6 font-bold text-caption text-[12px] uppercase">Duration</th><th className="py-6 font-bold text-caption text-[12px] uppercase">Content</th></tr></thead>
            <tbody className="divide-y divide-hair">
              {blocks.map((block, i) => (
                <tr key={i}><td className="py-4 md:py-8 font-bold text-ink pr-4 md:pr-8 align-top text-[15px] md:text-[18px]">{block.name}</td><td className="py-4 md:py-8 text-accent font-bold align-top text-[14px] md:text-[16px]">{block.time}</td><td className="py-4 md:py-8 text-muted align-top text-[14px] md:text-[16px]">{block.desc}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Facilitator slide deck", type: "PPT / Google Slides" },
            { title: "Self-guided module", type: "PDF" },
            { title: "Video walkthrough", type: "Coming Q3 2026", disabled: true },
            { title: "Train-the-trainer kit", type: "For team leads" }
          ].map((item, i) => (
            <div key={i} className={cn("card p-6 flex flex-col justify-between", item.disabled && "opacity-50 grayscale")}>
              <div><h4 className="font-bold mb-1">{item.title}</h4><p className="caption">{item.type}</p></div>
              {!item.disabled && <button className="text-accent text-sm font-bold mt-6 flex items-center gap-1">Download <ChevronRight size={14} /></button>}
            </div>
          ))}
        </div>
        <div className="mt-16 flex justify-center"><button className="btn-primary px-8 py-4">Download Training Kit — Free</button></div>
      </div>
    </section>
  );
};

// --- Legal ---

export const Legal = () => (
  <section id="legal" className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">LEGAL POSITION</span>
        <h2 className="mb-12">For your HR director and general counsel.</h2>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { title: "OSHA", content: "General Duty Clause: documented protocol = reasonable care evidence." },
          { title: "ADA", content: "Failure to engage on mental health disclosure = primary litigation trigger. Structured framework = good-faith compliance." },
          { title: "HIPAA", content: "Behavioral logs are NOT health records. No PHI collected. Not HIPAA-governed." }
        ].map((item, i) => (
          <div key={i} className="card card-hover p-8 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-full bg-bg-muted flex items-center justify-center mb-6"><Scale size={20} className="text-ink" /></div>
            <h3 className="text-ink mb-4 font-bold uppercase tracking-widest text-[16px]">{item.title}</h3>
            <p className="text-[16px] text-muted">{item.content}</p>
          </div>
        ))}
      </div>
      <div className="card border-none bg-ink text-white p-6 md:p-12 mb-12">
        <h3 className="text-white mb-8 text-[24px]">What the protocol does NOT create:</h3>
        <ul className="grid md:grid-cols-2 gap-4">
          {["A duty to diagnose or treat", "HIPAA obligations", "Clinical liability for non-licensed responders", "Documentation usable in performance reviews", "Documentation usable in termination proceedings"].map(item => (
            <li key={item} className="flex gap-3 text-white/70"><span className="text-accent font-bold">•</span><span>{item}</span></li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-12 bg-white card border-hair shadow-sm">
        <div className="flex-1">
          <h3 className="mb-4">EPLI positioning</h3>
          <p className="text-[16px] text-muted">"Documented response protocols strengthen your Employment Practices Liability Insurance defense posture. When an employer can demonstrate a standardized, trained response to emotional risk signals — with documented data governance controls — it materially improves their position in discrimination and accommodation claims."</p>
        </div>
        <button className="btn-ghost shrink-0 border-accent whitespace-nowrap px-8 h-14 font-bold flex gap-2"><FileText size={20} /> Download Legal One-Pager for GC</button>
      </div>
    </div>
  </section>
);

// --- Organizations ---

export const Organizations = () => {
  const orgs = [
    { title: "Workplaces", who: "Managers, HR, team leads", connect: "EAP + 988", icon: Globe, btn: "Download Workplace Kit" },
    { title: "Schools (K-12)", who: "Teachers, counselors, coaches", connect: "School counselor + 988", icon: BookOpen, btn: "Download K-12 Kit" },
    { title: "Sports organizations", who: "Coaches, trainers, captains", connect: "Team psychologist + 988", icon: Target, btn: "Download Sports Kit" },
    { title: "Faith communities", who: "Clergy, pastoral staff", connect: "Pastoral counsel + 988", icon: Users, btn: "Download Faith Kit" }
  ];

  return (
    <section id="orgs" className="section bg-white">
      <div className="container">
        <FadeIn>
          <span className="overline mb-4 block">FOR YOUR ORGANIZATION</span>
          <h2 className="mb-12">Same protocol. Adapted for your context.</h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orgs.map((org, i) => (
            <div key={i} className="card flex flex-col items-start hover:bg-bg-muted transition-colors border-hair/50 p-8 h-full">
              <div className="w-12 h-12 rounded-2xl bg-bg-muted flex items-center justify-center mb-8"><org.icon size={24} className="text-ink" /></div>
              <h3 className="text-ink mb-6 font-bold text-[22px]">{org.title}</h3>
              <div className="space-y-4 mb-10 flex-grow">
                <div><div className="caption uppercase tracking-wider font-bold mb-1">Who trains</div><div className="text-ink font-medium">{org.who}</div></div>
                <div><div className="caption uppercase tracking-wider font-bold mb-1">What they connect to</div><div className="text-accent font-bold">→ {org.connect}</div></div>
              </div>
              <button className="btn-ghost w-full border-hair hover:border-accent text-sm font-bold">{org.btn}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Sponsors ---

export const Sponsors = () => (
  <section id="sponsors" className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">THREE TIERS</span>
        <h2 className="mb-6">Founding partnership. Year 1 of a permanent platform.</h2>
        <p className="text-[18px] md:text-[20px] mb-12 font-medium max-w-[640px]">Annual commitment. Year 1 of a long-term cultural platform.</p>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { tier: "Founding Partner", price: "$1M/year", seats: "Category exclusive", features: ["Category exclusive", "All activations", "Documentary consideration", "Full access"] },
          { tier: "Campaign Partner", price: "$500K/year", seats: "Shared category", features: ["Challenge integration", "Shared category", "Event presence"] },
          { tier: "Community Partner", price: "$250K/year", seats: "Internal deployment", features: ["Employee protocol", "Internal deployment", "Brand association"] }
        ].map((tier, i) => (
          <div key={i} className={cn("card card-hover p-8 flex flex-col", i === 0 ? "border-accent shadow-lg ring-1 ring-accent/20" : "border-hair shadow-sm")}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[20px] font-bold">{tier.tier}</h3>
              <span className="text-[12px] bg-accent/10 text-accent font-bold px-3 py-1 rounded-full uppercase tracking-widest">{tier.seats}</span>
            </div>
            <div className="text-accent font-bold text-[24px] mb-6">{tier.price}</div>
            <ul className="space-y-4 mb-10 flex-grow">
              {tier.features.map(f => (
                <li key={f} className="flex gap-3 text-[15px] text-muted"><Check size={16} className="text-accent mt-0.5 shrink-0" /><span>{f}</span></li>
              ))}
            </ul>
            <Link to="/partner" className={cn("w-full py-4 rounded-full font-bold transition-all text-center block", i === 0 ? "bg-accent text-white" : "border border-hair hover:border-accent text-accent")}>
              Request Sponsorship Brief
            </Link>
          </div>
        ))}
      </div>
      <div className="card border-none bg-white p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-[20px] font-bold mb-2">53% of Gen Z</h3>
          <p className="text-muted">wants your brand to support mental health — more than any other cause.</p>
        </div>
        <div className="flex gap-12 opacity-30 grayscale items-center">
          <div className="w-24 h-8 bg-ink rounded-sm"></div>
          <div className="w-24 h-8 bg-ink rounded-sm"></div>
          <div className="w-24 h-8 bg-ink rounded-sm"></div>
        </div>
      </div>
    </div>
  </section>
);

// --- Timeline ---

export const DeployTimeline = () => (
  <section className="section bg-white">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">DEPLOYMENT</span>
        <h2 className="mb-12">Deploy in 90 days.</h2>
      </FadeIn>
      <div className="max-w-[800px] space-y-px bg-hair border border-hair rounded-3xl overflow-hidden">
        {[
          { phase: "Phase 1", range: "Days 1–30", title: "Foundation", items: ["Designate protocol lead", "Customize script", "Configure routing (EAP, 988, internal)"] },
          { phase: "Phase 2", range: "Days 31–60", title: "Training", items: ["Manager training (10 min/person)", "Materials distribution", "Data governance setup"] },
          { phase: "Phase 3", range: "Days 61–90", title: "Activation", items: ["Go-live", "First RE-AIM measurement", "Feedback + refinement"] }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 flex flex-col md:flex-row gap-6 md:gap-12 hover:bg-bg-muted transition-colors">
            <div className="md:w-32 shrink-0">
              <span className="block font-bold text-accent uppercase tracking-widest text-[14px]">{item.phase}</span>
              <span className="block caption text-[12px] mt-1">{item.range}</span>
            </div>
            <div>
              <h4 className="font-bold text-ink mb-3 text-[18px]">{item.title}</h4>
              <ul className="space-y-1.5">
                {item.items.map((it, j) => (
                  <li key={j} className="flex gap-2 text-muted text-[15px]"><span className="text-accent font-bold">•</span><span>{it}</span></li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <button className="btn-ghost border-hair hover:border-accent px-8 h-14 font-bold">Download 90-Day Deployment Checklist — PDF</button>
      </div>
    </div>
  </section>
);

// --- Measurement ---

export const Measurement = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">MEASUREMENT</span>
        <h2 className="mb-12">What you measure. What you don't.</h2>
      </FadeIn>
      <div className="overflow-x-auto mb-16">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-hair"><th className="py-6 font-bold text-caption text-[12px] uppercase">Metric</th><th className="py-6 font-bold text-caption text-[12px] uppercase">What it tells you</th><th className="py-6 font-bold text-caption text-[12px] uppercase">How to collect</th></tr></thead>
          <tbody className="divide-y divide-hair">
            {[
              { m: "Trainings completed", t: "Deployment rate", c: "Sign-in sheet or LMS log" },
              { m: "Kit downloads", t: "Awareness reach", c: "Download link analytics" },
              { m: "QR scans on Resource Map", t: "Routing engagement", c: "QR analytics (aggregate)" },
              { m: "Responder confidence survey", t: "Behavior shift", c: "Anonymous 3-question pulse" },
              { m: "EAP utilization trend", t: "Downstream impact", c: "Your EAP provider's aggregate report" }
            ].map((row, i) => (
              <tr key={i}><td className="py-4 md:py-8 font-bold text-ink pr-4 md:pr-8 align-top text-[15px] md:text-[18px]">{row.m}</td><td className="py-4 md:py-8 text-ink font-medium align-top text-[14px] md:text-[16px]">{row.t}</td><td className="py-4 md:py-8 text-muted align-top text-[14px] md:text-[16px]">{row.c}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card bg-white p-6 md:p-12">
        <h3 className="text-ink mb-8 text-[20px] font-bold uppercase tracking-widest">ESG reporting alignment:</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "GRI 403-9/403-10", desc: "Psychosocial hazard documentation" },
            { title: "SEC Reg S-K", desc: "Human capital management data point" },
            { title: "ISO 45003", desc: "Psychological health and safety framework" }
          ].map((item, i) => (
            <div key={i}><h4 className="font-bold text-accent mb-2">{item.title}</h4><p className="text-sm text-muted">{item.desc}</p></div>
          ))}
        </div>
        <button className="btn-ghost border-hair hover:border-accent mt-10 px-8 h-12 font-bold text-sm">Download Metrics Pack — PDF</button>
      </div>
    </div>
  </section>
);

// --- FAQ ---

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "Is this a clinical intervention?", a: "No. Behavioral response framework. Same category as first-aid training." },
    { q: "Does training create a duty to act?", a: "Your duty already exists. The protocol gives bounded response that reduces liability." },
    { q: "Does this conflict with our EAP?", a: "No. It routes TO your EAP. It's the bridge." },
    { q: "Is the data HIPAA-regulated?", a: "No. Behavioral records, not health records. Stored separately. 90-day retention." },
    { q: "Can logs be used in termination decisions?", a: "No. Model data governance policy explicitly prohibits this." },
    { q: "Is this free permanently?", a: "Yes. Open standard. Implementation consulting is where we engage commercially." },
    { q: "How does this affect our EPLI posture?", a: "Documented response protocols strengthen your defense in accommodation and discrimination claims. This is risk mitigation the CFO can calculate." }
  ];

  return (
    <section className="section bg-white">
      <div className="container max-w-[800px]">
        <FadeIn><span className="overline mb-4 block">FAQ</span><h2 className="mb-12">Frequently Asked Questions</h2></FadeIn>
        <div className="space-y-px bg-hair border border-hair rounded-3xl overflow-hidden shadow-sm">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-8 text-left hover:bg-bg-muted transition-colors">
                <span className="font-bold text-[18px] text-ink">{faq.q}</span>
                <ChevronDown className={cn("text-muted transition-transform", open === i && "rotate-180")} size={20} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-8 pt-0 text-muted leading-relaxed">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Contact Form ---

export const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="section bg-bg-muted/30">
      <div className="container max-w-[600px]">
        <FadeIn>
          <span className="overline mb-4 block uppercase tracking-widest font-bold">CONTACT</span>
          <h2 className="mb-12">Implementation inquiry.</h2>
        </FadeIn>
        <form
          className="space-y-6 md:space-y-8"
          action="mailto:protocol@butterfly.one"
          method="post"
          encType="text/plain"
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        >
          {[
            { label: "Name", type: "text", name: "name" },
            { label: "Title", type: "text", name: "title" },
            { label: "Organization", type: "text", name: "organization" },
            { label: "Email (organization email)", type: "email", name: "email" },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-2">
              <label className="text-ink font-serif font-medium">{field.label}</label>
              <input type={field.type} name={field.name} required className="bg-transparent border-b border-hair py-3 outline-none focus:border-accent transition-colors" />
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <label className="text-ink font-serif font-medium">Tier interest</label>
            <select name="tier" className="bg-transparent border-b border-hair py-3 outline-none focus:border-accent transition-colors text-ink">
              <option value="">Select a tier</option>
              <option value="founding">Founding Partner — $1M/year</option>
              <option value="campaign">Campaign Partner — $500K/year</option>
              <option value="community">Community Partner — $250K/year</option>
              <option value="exploring">Just exploring</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-ink font-serif font-medium">Message</label>
            <textarea name="message" rows={4} className="bg-transparent border-b border-hair py-3 outline-none focus:border-accent transition-colors resize-none" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-ink font-serif font-medium">What are we missing? Tell us what matters to your brand.</label>
            <textarea name="missing" rows={3} placeholder="Share any context that would help us tailor the brief..." className="bg-transparent border-b border-hair py-3 outline-none focus:border-accent transition-colors resize-none" />
          </div>
          <div className="space-y-4">
            <button type="submit" className="btn-primary w-full h-14 text-lg font-bold shadow-xl shadow-accent/20">
              {submitted ? "Thank you. The implementation team will respond within 48 hours." : "Send Inquiry"}
            </button>
          </div>
          {!submitted && <p className="text-center text-caption text-sm mt-4">Response within 48 business hours. Please use your primary organization email.</p>}
        </form>
      </div>
    </section>
  );
};

// --- Footer ---

export const Footer = () => (
  <footer className="bg-white pt-24 pb-12 border-t border-hair">
    <div className="container">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-6">
            <img src={logoSvg} alt="butterfly.one" className="w-7 h-7" />
            <span className="font-bold text-ink tracking-tight text-[20px]">butterfly.one</span>
          </Link>
          <p className="caption leading-relaxed mb-2">Butterfly Foundation · 501(c)(3)</p>
          <p className="caption text-accent font-bold">hello@butterfly.one</p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Explore</h4>
          <ul className="space-y-3 caption font-medium">
            <li><Link to="/challenge" className="hover:text-ink">Challenge</Link></li>
            <li><Link to="/protocol" className="hover:text-ink">Protocol</Link></li>
            <li><Link to="/evidence" className="hover:text-ink">Evidence</Link></li>
            <li><Link to="/month" className="hover:text-ink">Month</Link></li>
            <li><Link to="/about" className="hover:text-ink">About</Link></li>
            <li><Link to="/partner" className="hover:text-ink">Partner</Link></li>
            <li><Link to="/blog" className="hover:text-ink">Blog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Support</h4>
          <ul className="space-y-3 caption font-medium">
            <li><a href="tel:988" className="hover:text-ink">988 — Suicide & Crisis Lifeline</a></li>
            <li><a href="https://findahelpline.com" className="hover:text-ink">findahelpline.com</a></li>
          </ul>
          <h4 className="font-bold mt-8 mb-6">Legal</h4>
          <ul className="space-y-3 caption font-medium">
            <li><a href="#" className="hover:text-ink">Privacy</a></li>
            <li><a href="#" className="hover:text-ink">Terms</a></li>
            <li><a href="#" className="hover:text-ink">Accessibility</a></li>
            <li><a href="#" className="hover:text-ink">Safeguarding</a></li>
          </ul>
        </div>
        <div>
          <div className="card bg-bg-muted border-none p-6">
            <h4 className="font-bold mb-3 text-ink">Not a crisis line.</h4>
            <p className="text-[14px] text-muted mb-4">Call or text 988 — Suicide & Crisis Lifeline — 24/7</p>
            <a href="tel:988" className="text-accent font-bold text-[20px] block mb-4">988</a>
            <a href="https://findahelpline.com" className="text-accent text-[13px] font-bold hover:underline">findahelpline.com →</a>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-hair flex flex-col md:flex-row justify-between gap-4 text-[13px] text-caption font-medium">
        <div className="uppercase tracking-widest">Butterfly Foundation · 501(c)(3)</div>
        <div>For the Challenge: <a href="https://butterflychallenge.com" className="underline hover:text-ink">butterflychallenge.com</a></div>
      </div>
    </div>
  </footer>
);

// Re-export icons for pages that need them
export { ChevronRight, ChevronDown, Check, ArrowRight, Shield, BarChart3, Users, Scale, FileText, Clock, Target, Globe, Lock, AlertCircle, BookOpen, Plus, ArrowLeft, X, Menu };
export { Link };
export { motion, AnimatePresence };
export { useState, useEffect };
