import Header from "@/components/Header";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl bg-card p-8 shadow-soft border border-border">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">How it works</p>
          <h1 className="mt-3 text-4xl font-bold">From gesture to action</h1>
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <h2 className="text-xl font-semibold">1. Use your voice or hand</h2>
              <p className="mt-2 text-muted-foreground">Speak naturally or use simple gestures like a fist, open palm, or pointing hand.</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <h2 className="text-xl font-semibold">2. AI understands the intent</h2>
              <p className="mt-2 text-muted-foreground">GestureFarm-AI interprets your command and maps it to the right farming action.</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <h2 className="text-xl font-semibold">3. Get instant support</h2>
              <p className="mt-2 text-muted-foreground">Receive weather updates, crop advice, pest guidance, and market price insights in seconds.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
