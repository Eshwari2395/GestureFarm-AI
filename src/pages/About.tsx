import Header from "@/components/Header";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl bg-card p-8 shadow-soft border border-border">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">About</p>
          <h1 className="mt-3 text-4xl font-bold">Built for modern farming</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            GestureFarm-AI is designed to make agricultural support more accessible by combining gesture recognition,
            voice interaction, and AI-powered guidance for farmers.
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-6">
            <p className="text-muted-foreground">
              The goal is simple: help farmers get weather updates, crop advice, market information, and pest alerts
              through a natural and easy-to-use interface.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
