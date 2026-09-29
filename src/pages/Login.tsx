import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/mitti-mitra-logo.jpg";

type AuthMode = "signIn" | "signUp";

const Login = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setFormError("Your password must contain at least 6 characters.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);
    let result;

    try {
      result = mode === "signIn"
        ? await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
        : await supabase.auth.signUp({ email: normalizedEmail, password });
    } catch {
      setIsSubmitting(false);
      setFormError("Internet connection problem. Please check your connection and try again.");
      return;
    }
    setIsSubmitting(false);

    if (result.error) {
      const message = result.error.message.toLowerCase();
      if (message.includes("invalid login credentials")) {
        setFormError("Email or password is incorrect. Try again or create an account.");
      } else if (message.includes("already registered") || message.includes("already been registered")) {
        setFormError("This email already has an account. Please choose Sign in.");
      } else if (message.includes("signup is disabled") || message.includes("signups not allowed")) {
        setFormError("New accounts are currently disabled. Please ask the app administrator to enable sign up.");
      } else {
        setFormError(`We could not complete that request: ${result.error.message}`);
      }
      return;
    }

    if (mode === "signUp" && !result.data.session) {
      toast.success("Account created. Check your email to verify your account.");
      return;
    }

    toast.success("Welcome to GestureFarm-AI.");
    navigate("/app");
  };

  return (
    <main className="login-shell min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1120px] items-center justify-center">
        <section className="login-layout grid w-full overflow-hidden rounded-[2rem] border border-[#2d4739]/10 bg-[#f7f8f5]/90 shadow-[0_24px_70px_rgba(45,71,57,0.14)] md:grid-cols-[0.9fr_1.1fr]">
          <div className="login-intro hidden flex-col justify-between bg-[#2d4739] p-10 text-[#f5f1e8] md:flex lg:p-14">
            <div>
              <img src={logo} alt="Mitti Mitra AI logo" className="h-28 w-28 rounded-2xl object-cover" />
              <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-[#d7e4d8]">GestureFarm-AI</p>
              <h1 className="mt-4 max-w-sm text-4xl font-black leading-[0.98] lg:text-5xl">
                Farming intelligence, made simpler.
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#d7e4d8]">
              Sign in to continue to your weather, crop, market, and gesture-powered farming tools.
            </p>
          </div>

          <div className="p-6 sm:p-10 lg:p-14">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#2d4739] hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>

            <div className="mt-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#6b806f]">Farmer access</p>
              <h2 className="mt-2 text-3xl font-black text-[#2d4739] sm:text-4xl">
                {mode === "signIn" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#647267]">
                {mode === "signIn" ? "Use your email to enter GestureFarm-AI." : "Use your email and create a password to get started."}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 rounded-xl bg-[#e9eee9] p-1">
              <button type="button" onClick={() => setMode("signIn")} className={`rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${mode === "signIn" ? "bg-white text-[#2d4739] shadow-sm" : "text-[#6b806f]"}`}>
                Sign in
              </button>
              <button type="button" onClick={() => setMode("signUp")} className={`rounded-lg px-3 py-2.5 text-sm font-bold transition-colors ${mode === "signUp" ? "bg-white text-[#2d4739] shadow-sm" : "text-[#6b806f]"}`}>
                Create account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block text-sm font-bold text-[#2d4739]">
                Email address
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b806f]" />
                  <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="farmer@example.com" inputMode="email" autoComplete="email" className="h-12 rounded-xl border-[#cbd8cd] bg-white pl-11" required />
                </div>
                <span className="mt-1.5 block text-xs font-normal text-[#718076]">Use an email address you can open</span>
              </label>

              <label className="block text-sm font-bold text-[#2d4739]">
                Password
                <div className="relative mt-2">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#6b806f]" />
                  <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" autoComplete={mode === "signIn" ? "current-password" : "new-password"} className="h-12 rounded-xl border-[#cbd8cd] bg-white pl-11" required />
                </div>
              </label>

              <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl bg-[#2d4739] text-base font-black text-white hover:bg-[#20362a]">
                {isSubmitting ? "Please wait..." : mode === "signIn" ? "Sign in" : "Create account"}
              </Button>
              {formError && (
                <p role="alert" className="rounded-xl border border-[#d8a39a] bg-[#fff1ee] px-4 py-3 text-sm font-semibold leading-5 text-[#8a3f35]">
                  {formError}
                </p>
              )}
            </form>

            <p className="mt-6 text-center text-xs leading-5 text-[#718076]">
              Your email will be used for account verification and secure sign-in.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;