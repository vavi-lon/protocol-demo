import { Navbar, Footer, FadeIn, ChevronRight } from '../components/shared';

const HowItWorks = () => (
  <section className="section bg-bg-muted/30">
    <div className="container">
      <FadeIn>
        <span className="overline mb-4 block">HOW IT WORKS</span>
        <h2 className="mb-12">Three steps. One gesture.</h2>
      </FadeIn>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { num: "01", title: "Take", desc: "Film yourself doing the Butterfly gesture — hands crossed over chest." },
          { num: "02", title: "Show", desc: "Post it. Tag three people who have shown up for you." },
          { num: "03", title: "Lift", desc: "Those three tag three more. The signal multiplies into a language." },
        ].map((step, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div className="card card-hover p-8 h-full border-hair">
              <div className="text-accent font-bold text-[14px] tracking-[0.2em] mb-4">{step.num}</div>
              <h3 className="text-ink font-bold text-[22px] mb-3">{step.title}</h3>
              <p className="text-muted text-[16px]">{step.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const Story = () => (
  <section className="section bg-white">
    <div className="container max-w-[900px]">
      <FadeIn>
        <span className="overline mb-4 block">THE STORY</span>
        <h2 className="mb-12">Where the sign came from.</h2>
      </FadeIn>
      <div className="space-y-px bg-hair border border-hair rounded-3xl overflow-hidden">
        {[
          { year: "1998", title: "Lucina Artigas", desc: "Mexican psychologist develops the Butterfly Hug for trauma survivors of Hurricane Pauline. Bilateral self-soothing — hands crossed, tap alternately." },
          { year: "2024", title: "Prince Harry", desc: "Uses the Butterfly gesture publicly to speak about grief and mental health. The sign begins to spread as a shared language." },
          { year: "2026", title: "The Challenge", desc: "April 30. 10 founding faces. Miami. F1 Weekend. The gesture becomes a global movement." },
        ].map((item, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <div className="bg-white p-8 flex flex-col md:flex-row gap-6 md:gap-12 hover:bg-bg-muted transition-colors">
              <span className="md:w-24 shrink-0 font-bold text-accent uppercase tracking-widest text-[14px]">{item.year}</span>
              <div>
                <h4 className="font-bold text-ink mb-2 text-[18px]">{item.title}</h4>
                <p className="text-muted">{item.desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <section className="bg-ink text-white pt-20 md:pt-32 pb-16 md:pb-24 px-6">
          <div className="container">
            <FadeIn>
              <span className="overline mb-4 block text-white/60">THE CHALLENGE</span>
              <h1 className="mb-6 text-white">Two hands. One signal. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-accent">A billion lives.</span></h1>
              <p className="text-[20px] font-medium max-w-[700px] text-white/70 mb-10">
                The Butterfly Challenge is a 60-second video. A gesture anyone can learn. A language everyone can share.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://butterflychallenge.com" className="btn-primary px-8 py-4 text-[16px] inline-flex items-center gap-2">
                  Take the Challenge <ChevronRight size={18} />
                </a>
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-accent-light animate-pulse" />
                  <span className="text-white/80 text-[14px] font-medium">Counter live at butterflychallenge.com</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
        <HowItWorks />
        <Story />
        <section className="section bg-accent-light/40 border-none">
          <div className="container text-center max-w-[700px] mx-auto">
            <FadeIn>
              <h2 className="mb-6 mx-auto">Be the person who showed up.</h2>
              <p className="text-[18px] text-muted mb-8 mx-auto">60 seconds. One gesture. A chain that lifts a billion lives.</p>
              <a href="https://butterflychallenge.com" className="btn-primary px-10 py-4 text-[16px] inline-flex items-center gap-2">
                Take the Challenge <ChevronRight size={18} />
              </a>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
