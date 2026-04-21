import { Navbar, Footer, FadeIn, Link, ChevronRight } from '../components/shared';

const Participation = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">HOW TO PARTICIPATE</span>
        <h2 className="mb-12">Four ways in.</h2>
      </FadeIn>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Individual", title: "Take the Challenge", desc: "Film the gesture. Tag three people. 60 seconds.", to: "https://butterflychallenge.com", external: true, cta: "Take the Challenge →" },
          { label: "Schools", title: "Classroom kit", desc: "Free curriculum. 10-minute lesson plan. Teacher guide.", to: "/partner", cta: "Get the kit →" },
          { label: "Workplaces", title: "Deploy the Protocol", desc: "30-second check-in. Manager training. Legal brief.", to: "/protocol", cta: "See the protocol →" },
          { label: "Brands", title: "Join the Alliance", desc: "Category-exclusive partnership. May activation. Founding seat.", to: "/partner", cta: "Partner with us →" },
        ].map((card, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <div className="card card-hover p-8 h-full flex flex-col border-hair">
              <span className="text-[11px] font-bold text-accent uppercase tracking-[0.2em] mb-4">{card.label}</span>
              <h3 className="text-ink font-bold text-[20px] mb-3">{card.title}</h3>
              <p className="text-muted text-[15px] mb-6 flex-grow">{card.desc}</p>
              {card.external ? (
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

const MayCalendar = () => (
  <section className="section bg-white">
    <div className="container max-w-[900px]">
      <FadeIn>
        <span className="overline mb-4 block">MAY CALENDAR</span>
        <h2 className="mb-12">Five moments that build the month.</h2>
      </FadeIn>
      <div className="space-y-px bg-hair border border-hair rounded-3xl overflow-hidden">
        {[
          { date: "April 30", title: "One Night For One Humanity", desc: "Queen Miami Beach. F1 Weekend. 10 founding faces film the gesture.", accent: true },
          { date: "May 1", title: "Butterfly Month launches", desc: "Globally. The gesture enters circulation." },
          { date: "May 10", title: "Mother's Day", desc: "Post it for the woman who showed up first." },
          { date: "May 15", title: "School competition", desc: "Classrooms across the country submit their Butterfly reels." },
          { date: "May 31", title: "Campaign month ends", desc: "Gesture stays. Protocol continues. Month returns in 2027." },
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 0.06}>
            <div className={`bg-white p-6 md:p-8 flex flex-col md:flex-row gap-3 md:gap-12 hover:bg-bg-muted transition-colors ${item.accent ? 'border-l-4 border-accent' : ''}`}>
              <span className="md:w-32 shrink-0 font-bold text-accent uppercase tracking-widest text-[14px]">{item.date}</span>
              <div>
                <h4 className="font-bold text-ink text-[18px]">{item.title}</h4>
                <p className="text-muted text-[15px] mt-1">{item.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const Vision = () => (
  <section className="section bg-ink text-white">
    <div className="container max-w-[800px] text-center">
      <FadeIn>
        <span className="overline text-white/70 mb-4 block">THE VISION</span>
        <h2 className="text-white mb-8">One humanity. Many flags. One butterfly.</h2>
        <p className="text-white/70 text-[18px] md:text-[20px] leading-relaxed max-w-[640px] mx-auto">
          Every May, the world sees a gesture that speaks every language. Different flags. Different industries. Different faces. Same hands crossed over the same chest — for the same reason.
        </p>
      </FadeIn>
    </div>
  </section>
);

export default function MonthPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-12 md:pb-20 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">BUTTERFLY MONTH</span>
              <h1 className="mb-6 text-white">Every May. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">Starting 2026.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70">
                Mental Health Awareness Month becomes Butterfly Month — a global activation anchored by one gesture, one protocol, one moment on April 30.
              </p>
            </FadeIn>
          </div>
        </section>
        <Participation />
        <MayCalendar />
        <Vision />
        <section className="section bg-accent-light/40 border-none">
          <div className="container text-center max-w-[800px] mx-auto">
            <FadeIn>
              <h2 className="mb-8 mx-auto">Be part of May.</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://butterflychallenge.com" className="btn-primary px-8 py-4 text-[16px] inline-flex items-center gap-2">
                  Take the Challenge <ChevronRight size={18} />
                </a>
                <Link to="/partner" className="btn-ghost px-8 py-4 text-[16px] bg-white border-accent">
                  Deploy in your organization
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
