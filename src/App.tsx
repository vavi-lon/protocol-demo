import { useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Footer, FadeIn, ChevronRight, PageWrapper } from './components/shared';

// Pages
import EvidencePage from './pages/EvidencePage';
import ProtocolPage from './pages/ProtocolPage';
import PartnerPage from './pages/PartnerPage';
import LaunchPage from './pages/LaunchPage';
import DeployPage from './pages/DeployPage';
import AboutPage from './pages/AboutPage';
import ChallengePage from './pages/ChallengePage';
import MonthPage from './pages/MonthPage';
import BlogPage from './pages/BlogPage';

// import WorkInProgress from './components/WorkInProgress'; // preserved, unused in demo build
// import ConversationDemo from './components/ConversationDemo'; // V1 moved to /protocol

/** Scroll to top on route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

// =========================================================
// HOMEPAGE — v2 spec: 11 scroll sections
// =========================================================

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-white px-6 pt-[56px] pb-16 text-center overflow-hidden">
    {/* Subtle butterfly-glyph line animation */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
      <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-accent-light via-transparent to-accent rounded-full blur-3xl" />
    </div>
    <div className="relative container max-w-[900px]">
      <FadeIn>
        <span className="overline mb-6 block">BUTTERFLY FOUNDATION</span>
      </FadeIn>
      <FadeIn delay={0.1}>
        <h1 className="mb-6 text-ink" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.05 }}>
          Mental health is everyone's story.
        </h1>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="text-[18px] md:text-[22px] text-muted max-w-[720px] mx-auto mb-10 leading-relaxed">
          We're building a world where mental health is openly supported, universally accessible, and never faced alone.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://butterflychallenge.com" className="btn-primary px-8 py-4 text-[16px] inline-flex items-center gap-2">
            Join the Movement <ChevronRight size={18} />
          </a>
          <a href="#foundation" className="btn-ghost px-8 py-4 text-[16px] bg-white">
            Our Mission
          </a>
        </div>
      </FadeIn>
    </div>
  </section>
);

const FoundationSection = () => (
  <section id="foundation" className="section bg-white">
    <div className="container text-center max-w-[780px] mx-auto">
      <FadeIn>
        <h2 className="mb-8 mx-auto" style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)' }}>
          What started as One Humanity has become a movement the world can feel.
        </h2>
        <p className="text-[17px] md:text-[18px] text-muted mb-10 leading-relaxed mx-auto">
          Butterfly Foundation is a 501(c)(3) building shared infrastructure for mental health — a universal symbol, a viral challenge, a 30-second protocol, and a month every May. One gesture. One language. One billion stories.
        </p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {[
            "WHO recommended",
            "30+ years research",
            "100+ studies",
            "60 seconds",
          ].map((pill, i) => (
            <span key={i} className="inline-block px-4 py-2 bg-bg-muted rounded-full text-[13px] text-ink font-semibold">
              {pill}
            </span>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

const ManyOneBillion = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <h2 className="mb-16 text-center mx-auto">How one gesture reaches a billion people.</h2>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-6 relative">
        {[
          { label: "MANY", title: "The Challenge", desc: "Millions take the gesture. Creators, athletes, students. A language forms.", link: { to: "/challenge", text: "The Challenge →" } },
          { label: "ONE", title: "The Sign", desc: "Two hands over the chest. A universal symbol anyone can learn in 60 seconds.", link: { to: "/protocol", text: "The Protocol →" } },
          { label: "BILLION", title: "The Impact", desc: "Every classroom, workplace, and community carries a shared response.", link: { to: "/evidence", text: "The Evidence →" } },
        ].map((col, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="card card-hover p-8 md:p-10 h-full flex flex-col border-hair text-center">
              <span className="text-accent font-bold tracking-[0.25em] text-[12px] mb-4">{col.label}</span>
              <h3 className="text-ink font-bold text-[24px] mb-4">{col.title}</h3>
              <p className="text-muted text-[16px] flex-grow mb-6">{col.desc}</p>
              <Link to={col.link.to} className="text-accent font-bold text-[14px] hover:underline">
                {col.link.text}
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const FourPrograms = () => (
  <section className="section bg-white">
    <div className="container">
      <FadeIn>
        <h2 className="mb-14 text-center mx-auto">Four ways we're changing the world.</h2>
      </FadeIn>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { label: "SYMBOL", title: "The Butterfly Symbol", desc: "A universal symbol for mental health — two hands crossed over the chest.", cta: "Learn more →", to: "/protocol", external: false },
          { label: "CHALLENGE", title: "The Butterfly Challenge", desc: "A viral movement. 60-second videos. One gesture. A billion lives.", cta: "butterflychallenge.com →", to: "https://butterflychallenge.com", external: true },
          { label: "MAY", title: "Butterfly Month", desc: "Every May. Starting 2026. Mental Health Awareness Month becomes a global activation.", cta: "See the month →", to: "/month", external: false },
          { label: "2027", title: "ONETOPIA Festival", desc: "Culture, care, community. Coming 2027.", cta: "Coming soon", to: "#", external: false, disabled: true },
        ].map((card, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <div className="card card-hover p-8 md:p-10 h-full flex flex-col border-hair">
              <span className="text-accent font-bold tracking-[0.25em] text-[11px] mb-4">{card.label}</span>
              <h3 className="text-ink font-bold text-[26px] md:text-[28px] mb-4 leading-tight">{card.title}</h3>
              <p className="text-muted text-[16px] flex-grow mb-6">{card.desc}</p>
              {card.disabled ? (
                <span className="text-caption font-bold text-[14px]">{card.cta}</span>
              ) : card.external ? (
                <a href={card.to} className="text-accent font-bold text-[14px] hover:underline">{card.cta}</a>
              ) : (
                <Link to={card.to} className="text-accent font-bold text-[14px] hover:underline">{card.cta}</Link>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const MentalHealthBelongs = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <h2 className="mb-6 text-center mx-auto">Mental health belongs in every space.</h2>
        <p className="text-[17px] md:text-[18px] text-muted text-center max-w-[700px] mx-auto mb-14">
          Whether you lead a classroom, a team, or a brand — we have free tools built for you.
        </p>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: "Schools", desc: "Free classroom kit. 10-minute lesson plan. Teacher guide." },
          { label: "Workplaces", desc: "Deploy the Butterfly Protocol. 90-day rollout. Legal-ready." },
          { label: "Brands", desc: "Category-exclusive partnership. May activation. Founding seat." },
        ].map((card, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <Link to="/partner" className="card card-hover p-8 h-full flex flex-col justify-between border-hair bg-white group">
              <div>
                <span className="text-accent font-bold tracking-[0.25em] text-[11px] mb-4 block">FOR {card.label.toUpperCase()}</span>
                <h3 className="text-ink font-bold text-[22px] mb-3 group-hover:text-accent transition-colors">For {card.label}</h3>
                <p className="text-muted text-[15px]">{card.desc}</p>
              </div>
              <div className="mt-8 flex justify-end">
                <div className="w-10 h-10 rounded-full bg-bg-muted group-hover:bg-accent flex items-center justify-center transition-all">
                  <ChevronRight size={20} className="text-ink group-hover:text-white transition-colors" />
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const TheScale = () => (
  <section className="section bg-ink text-white">
    <div className="container text-center max-w-[960px] mx-auto">
      <FadeIn>
        <span className="overline text-white/60 mb-6 block">THE SCALE</span>
      </FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-14">
        {[
          { stat: "1B", label: "people affected worldwide", source: "WHO" },
          { stat: "1 in 5", label: "young people live with a mental health condition", source: "WHO" },
          { stat: "11 years", label: "average wait from first symptom to help", source: "Multiple studies" },
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="text-center">
              <div className="text-accent-light font-bold text-[48px] md:text-[64px] mb-3 leading-none">{item.stat}</div>
              <p className="text-white/80 text-[16px] mb-2">{item.label}</p>
              <p className="text-white/40 text-[12px] uppercase tracking-widest">{item.source}</p>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.3}>
        <div className="pt-10 border-t border-white/10">
          <span className="overline text-accent-light/70 mb-4 block">THE ANSWER</span>
          <div className="text-accent-light font-bold text-[56px] md:text-[80px] leading-none">60 seconds</div>
          <p className="text-white/70 text-[18px] mt-4">to learn the sign.</p>
        </div>
      </FadeIn>
    </div>
  </section>
);

const FounderScroll = () => (
  <section className="section bg-white">
    <div className="container max-w-[900px]">
      <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-center">
        <FadeIn>
          <div className="w-full aspect-square rounded-[32px] bg-gradient-to-br from-bg-muted to-accent-light/40 border border-hair flex items-center justify-center">
            <span className="text-caption text-[12px] font-bold tracking-widest uppercase">Evan</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <span className="overline mb-4 block">FOUNDER</span>
          <p className="text-[22px] md:text-[26px] text-ink font-medium italic leading-snug mb-6">
            "The pandemic forced me to face something I'd been ignoring my whole life…"
          </p>
          <p className="text-muted text-[16px] leading-relaxed mb-6">
            Evan Klassen founded Butterfly Foundation after his own reckoning with mental health became the catalyst for a new standard of care.
          </p>
          <Link to="/about" className="text-accent font-bold hover:underline inline-flex items-center gap-2 text-[15px]">
            Read the full story <ChevronRight size={16} />
          </Link>
        </FadeIn>
      </div>
    </div>
  </section>
);

const LatestFromUs = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div>
            <span className="overline mb-3 block">LATEST FROM US</span>
            <h2 className="mb-0">News, stories & resources.</h2>
          </div>
          <Link to="/blog" className="text-accent font-bold hover:underline inline-flex items-center gap-1 text-[15px]">
            All posts <ChevronRight size={16} />
          </Link>
        </div>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { cat: "Science", title: "Why the butterfly hug works: the neuroscience", date: "Apr 12, 2026" },
          { cat: "Movement", title: "How May became the most important month in mental health", date: "Apr 8, 2026" },
          { cat: "Partnership", title: "Introducing the Butterfly Protocol for teams", date: "Apr 2, 2026" },
        ].map((p, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <Link to="/blog" className="card card-hover p-8 h-full flex flex-col border-hair group">
              <span className="text-[11px] font-bold uppercase tracking-widest text-accent mb-4">{p.cat}</span>
              <h3 className="text-ink font-bold text-[20px] mb-6 leading-tight group-hover:text-accent transition-colors flex-grow">
                {p.title}
              </h3>
              <p className="caption text-[13px]">{p.date}</p>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const NewsletterSection = () => (
  <section className="section bg-white">
    <div className="container max-w-[700px] text-center mx-auto">
      <FadeIn>
        <span className="overline mb-4 block">NEWSLETTER</span>
        <h2 className="mb-4 mx-auto">Stay connected.</h2>
        <p className="text-[17px] md:text-[18px] text-muted mb-10 mx-auto">Be part of the movement.</p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <form
          className="flex flex-col sm:flex-row gap-3 max-w-[520px] mx-auto"
          onSubmit={(e) => { e.preventDefault(); }}
        >
          <input
            type="email"
            placeholder="your@email.com"
            required
            className="flex-1 px-6 py-3 rounded-full border border-hair focus:border-accent outline-none transition-colors bg-bg-muted/50 text-ink"
          />
          <button type="submit" className="btn-primary px-8 py-3 text-[15px] whitespace-nowrap">Subscribe</button>
        </form>
        <p className="caption text-[12px] mt-4">No spam. One email a month. Unsubscribe anytime.</p>
      </FadeIn>
    </div>
  </section>
);

const FinalCTASection = () => (
  <section className="section bg-accent text-white border-none py-24 md:py-32">
    <div className="container text-center max-w-[800px] mx-auto">
      <FadeIn>
        <h2 className="text-white mb-4 mx-auto" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
          60 seconds.
        </h2>
        <p className="text-white/90 text-[22px] md:text-[28px] font-medium mb-10 mx-auto">
          Be the person who showed up.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://butterflychallenge.com" className="bg-white text-accent font-bold px-8 py-4 text-[16px] rounded-full inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
            Take the Challenge <ChevronRight size={18} />
          </a>
          <Link to="/protocol" className="border border-white/40 text-white font-bold px-8 py-4 text-[16px] rounded-full inline-flex items-center gap-2 hover:bg-white/10 transition-colors">
            Deploy the Protocol <ChevronRight size={18} />
          </Link>
        </div>
      </FadeIn>
    </div>
  </section>
);

const SupportDonate = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <div className="grid md:grid-cols-2 gap-6">
        <FadeIn>
          <div className="card border-hair p-8 md:p-10 h-full">
            <span className="overline mb-4 block">SUPPORT</span>
            <h3 className="text-ink font-bold text-[24px] mb-4">Struggling right now?</h3>
            <p className="text-muted text-[16px] mb-6">You're not alone. Reach out any time.</p>
            <a href="tel:988" className="block text-accent font-bold text-[32px] mb-2">988</a>
            <p className="caption text-[13px] mb-6">Suicide & Crisis Lifeline · 24/7</p>
            <a href="https://findahelpline.com" className="btn-ghost border-accent px-6 py-3 text-[14px] inline-flex items-center gap-2">
              Find Support Now <ChevronRight size={16} />
            </a>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="card border-hair p-8 md:p-10 h-full bg-ink text-white">
            <span className="overline text-white/60 mb-4 block">DONATE</span>
            <h3 className="text-white font-bold text-[24px] mb-4">Every dollar lifts a hand.</h3>
            <p className="text-white/70 text-[16px] mb-6">Butterfly Foundation is a 501(c)(3). Your donation is tax-deductible.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["$25", "$50", "$100", "$500"].map((amt) => (
                <span key={amt} className="inline-block px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[14px] font-semibold">
                  {amt}
                </span>
              ))}
            </div>
            <a href="https://donate.butterfly.one" className="btn-primary px-6 py-3 text-[14px] inline-flex items-center gap-2">
              Donate <ChevronRight size={16} />
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

/** HomePage — v2 spec: 11 scroll sections (wrapped in WIP until ready) */
const HomePage = () => (
  <PageWrapper>
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        {/* <ConversationDemo /> — moved to /protocol */}
        <FoundationSection />
        <ManyOneBillion />
        <FourPrograms />
        <MentalHealthBelongs />
        <TheScale />
        <FounderScroll />
        <LatestFromUs />
        <NewsletterSection />
        <FinalCTASection />
        <SupportDonate />
      </main>
      <Footer />
    </div>
  </PageWrapper>
);

// =========================================================
// ROUTES
// =========================================================

const App = () => (
  <>
    <ScrollToTop />
    <Routes>
      {/* Homepage — live with V1 Conversation demo embedded */}
      <Route path="/" element={<HomePage />} />
      <Route path="/challenge" element={<PageWrapper><ChallengePage /></PageWrapper>} />
      <Route path="/protocol" element={<PageWrapper><ProtocolPage /></PageWrapper>} />
      <Route path="/evidence" element={<PageWrapper><EvidencePage /></PageWrapper>} />
      <Route path="/month" element={<PageWrapper><MonthPage /></PageWrapper>} />
      <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
      <Route path="/partner" element={<PageWrapper><PartnerPage /></PageWrapper>} />
      <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
      {/* Legacy routes preserved for inbound links */}
      <Route path="/team" element={<Navigate to="/about" replace />} />
      <Route path="/launch" element={<PageWrapper><LaunchPage /></PageWrapper>} />
      <Route path="/deploy" element={<PageWrapper><DeployPage /></PageWrapper>} />
    </Routes>
  </>
);

export default App;
