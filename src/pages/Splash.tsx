import { Link } from "react-router-dom";
import logo from "@/assets/mitti-mitra-logo.jpg";

const Splash = () => {
  return (
    <div className="splash-shell min-h-screen bg-[#ececeb] px-4 py-6 text-foreground sm:px-5 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1200px] items-center justify-center">
        <div className="w-full max-w-[980px]">
          <div className="splash-brand-row flex flex-col items-center gap-5 text-center md:flex-row md:items-center md:justify-center md:gap-8 md:text-left">
            <div className="logo-wrap logo-inline">
              <img src={logo} alt="Mitti Mitra AI logo" className="logo-image" />
            </div>

            <div className="brand-copy">
              <h2 className="animated-subtitle splash-subtitle font-black leading-[0.95] text-[#2d4739]">
                Turning Gestures into
                <span className="block text-[#2d4739]">Farming Intelligence</span>
              </h2>

              <div className="mt-5 flex justify-center md:justify-start">
                <Link
                  to="/login"
                  className="cta-button splash-cta inline-flex items-center justify-center rounded-[1.25rem] border border-[#2d4739]/10 bg-[#cfe0d6] px-6 py-3 font-black text-[#2d4739] shadow-soft transition-transform hover:scale-[1.01]"
                >
                  Get Started <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
