import { useState } from 'react';
import {
  Navbar, Footer, FadeIn, Link,
  Sponsors, ContactForm, AlertCircle, FileText, Check, BookOpen, Globe, Target
} from '../components/shared';
// import PassDemo from '../components/PassDemo'; // V3 hidden — only V1 used in project

/** v2: 3 audience tabs */
type TabKey = 'schools' | 'workplaces' | 'brands';

const tabContent: Record<TabKey, { icon: any; label: string; headline: string; desc: string; bullets: string[]; cta: string }> = {
  schools: {
    icon: BookOpen,
    label: "For Schools",
    headline: "Free classroom kit. 10-minute lesson plan.",
    desc: "Age-appropriate curriculum for middle + high school. Teacher guide, poster, and parent letter included.",
    bullets: [
      "Complete lesson plan (10 min, no specialist required)",
      "Teacher facilitation guide",
      "Counselor + 988 routing worksheet",
      "Parent-home bridge letter",
      "Assembly-ready 3-minute video script",
    ],
    cta: "Download Classroom Kit",
  },
  workplaces: {
    icon: Globe,
    label: "For Workplaces",
    headline: "Deploy the Butterfly Protocol in 90 days.",
    desc: "A 30-second check-in standard for managers, HR, and team leads — built for OSHA, ADA, HIPAA review.",
    bullets: [
      "Full Protocol PDF + pocket card + poster",
      "10-minute manager training module",
      "Legal one-pager for General Counsel",
      "Data governance policy template",
      "RE-AIM measurement toolkit",
    ],
    cta: "Request Deployment Brief",
  },
  brands: {
    icon: Target,
    label: "For Brands",
    headline: "Category-exclusive partnership. May activation.",
    desc: "Founding, Campaign, or Community tier — each aligned to measurable deployment milestones, not marketing decoration.",
    bullets: [
      "Category exclusivity (Founding tier)",
      "Co-branded Butterfly Month content",
      "Founding event presence (Miami, April 30, F1 Weekend)",
      "Documentary consideration",
      "Anti-washing clause protection",
    ],
    cta: "Request Partnership Brief",
  },
};

const ThreeTabs = () => {
  const [active, setActive] = useState<TabKey>('workplaces');
  const tabs: TabKey[] = ['schools', 'workplaces', 'brands'];
  const current = tabContent[active];
  const Icon = current.icon;

  return (
    <section className="section bg-bg-muted/30">
      <div className="container">
        <FadeIn>
          <span className="overline mb-4 block">BRING THIS TO YOUR WORLD</span>
          <h2 className="mb-12">Three audiences. One protocol.</h2>
        </FadeIn>
        <div className="flex border-b border-hair overflow-x-auto no-scrollbar mb-10">
          {tabs.map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-6 py-4 text-[14px] font-bold tracking-wider transition-all border-b-2 whitespace-nowrap ${
                active === key
                  ? "border-accent text-accent"
                  : "border-transparent text-caption hover:text-ink"
              }`}
            >
              {tabContent[key].label.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-accent-light flex items-center justify-center mb-6">
              <Icon size={24} className="text-accent" strokeWidth={1.8} />
            </div>
            <h3 className="text-ink font-bold text-[28px] md:text-[32px] mb-4 leading-tight">{current.headline}</h3>
            <p className="text-muted text-[17px] leading-relaxed mb-8">{current.desc}</p>
            <Link to="/partner" className="btn-primary px-6 py-3 text-[15px]">
              {current.cta}
            </Link>
          </div>
          <div className="card border-hair p-8 md:p-10">
            <span className="overline mb-6 block">What you get</span>
            <ul className="space-y-4">
              {current.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-ink text-[16px]">
                  <Check size={18} className="text-accent shrink-0 mt-1" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

/** The Alliance — roles grid */
const TheAlliance = () => (
  <section className="section bg-white">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">THE ALLIANCE</span>
        <h2 className="mb-12">1,000+ leaders showing up.</h2>
      </FadeIn>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          "Creators", "Celebrities", "Athletes", "Educators", "Founders", "Clinicians",
          "Journalists", "Producers", "Designers", "Engineers", "Counselors", "Community leaders",
        ].map((role, i) => (
          <FadeIn key={i} delay={i * 0.03}>
            <div className="card card-hover p-4 md:p-5 border-hair text-center text-ink font-semibold text-[14px] md:text-[15px]">
              {role}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/** Governance */
const Governance = () => (
  <section className="section bg-bg-muted/30">
    <div className="container max-w-[900px]">
      <FadeIn>
        <span className="overline mb-4 block">GOVERNANCE</span>
        <h2 className="mb-6">The Butterfly Movement is governed by the Butterfly Constitution.</h2>
        <p className="caption mb-12 font-bold tracking-widest">OHF-BC-2026-001</p>
      </FadeIn>
      <div className="card border-hair p-8 md:p-10 mb-8">
        <ul className="space-y-4">
          {[
            "Non-political. Non-religious. Non-commercial in its soul.",
            "No partner may own the mark.",
            "Capital serves the movement. The movement does not serve capital.",
            "No editorial control granted to any partner.",
            "Political neutrality written into every agreement.",
            "Anti-washing clause: no reputational cover without genuine deployment.",
            "Safety before scale. Always.",
            "Young people are a protected priority.",
          ].map((point, i) => (
            <li key={i} className="flex gap-3 text-ink text-[16px]">
              <span className="text-accent font-bold mt-0.5">/</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <a href="#" className="text-accent font-bold hover:underline inline-flex items-center gap-2 text-[16px]">
        <FileText size={18} /> Download the full Butterfly Constitution
      </a>
    </div>
  </section>
);

/** Anti-washing + 53% stat */
const AntiWashingStat = () => (
  <section className="section bg-white">
    <div className="container max-w-[900px]">
      <FadeIn>
        <div className="card border-ink/10 bg-bg-muted/50 p-8 md:p-10 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle size={20} className="text-accent" />
            <h3 className="text-[22px] font-bold mb-0">Anti-washing clause</h3>
          </div>
          <p className="text-muted text-[16px]">
            We do not accept partners who use mental health alignment for marketing purposes without operational commitment.
            Partnering means deploying — not decorating. Every partner agrees to measurable deployment milestones.
          </p>
        </div>
      </FadeIn>
      <FadeIn>
        <div className="card bg-ink text-white border-none p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="text-accent-light font-bold text-[64px] md:text-[80px] leading-none shrink-0">53%</div>
          <p className="text-white/80 text-[18px] md:text-[20px] leading-relaxed">
            of Gen Z wants your brand to support mental health — more than any other cause.
          </p>
        </div>
      </FadeIn>
    </div>
  </section>
);

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-12 md:pb-20 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">PARTNER</span>
              <h1 className="mb-6 text-white">Mental health belongs in <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">every space.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70">
                Schools. Workplaces. Brands. Free tools, deployable standards, and category-exclusive partnerships — all anchored by one gesture.
              </p>
            </FadeIn>
          </div>
        </section>
        <ThreeTabs />
        <TheAlliance />
        <Sponsors />
        <Governance />
        {/* <PassDemo /> — V3 hidden, only V1 used in project */}
        <AntiWashingStat />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
