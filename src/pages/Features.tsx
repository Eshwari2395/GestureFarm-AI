import Header from "@/components/Header";

const Features = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl bg-card p-8 shadow-soft border border-border">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Features</p>
          <h1 className="mt-3 text-4xl font-bold">Smart tools for every farmer</h1>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <h2 className="text-xl font-semibold">Weather Insights</h2>
              <p className="mt-2 text-muted-foreground">Get real-time weather guidance to plan irrigation and farming safely.</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <h2 className="text-xl font-semibold">Crop Guidance</h2>
              <p className="mt-2 text-muted-foreground">Receive crop growth tips and recommendations through voice or gesture commands.</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-5">
              <h2 className="text-xl font-semibold">Market Prices</h2>
              <p className="mt-2 text-muted-foreground">Check local market trends and E-NAM-based price updates quickly.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Features;
