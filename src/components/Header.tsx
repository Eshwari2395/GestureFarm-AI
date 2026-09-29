import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import mittiMitraLogo from "@/assets/mitti-mitra-logo.jpg";
import { NavLink } from "./NavLink";

const Header = () => {
  const { t } = useLanguage();

  const navItems = [
    { label: t.home, to: "/" },
    { label: t.features, to: "/features" },
    { label: t.howItWorks, to: "/how-it-works" },
    { label: t.about, to: "/about" },
  ];

  return (
    <header className="w-full px-4 py-4 md:py-6 relative z-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-soft">
            <img 
              src={mittiMitraLogo} 
              alt="GestureFarm-AI Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">{t.appName}</h1>
            <p className="text-xs md:text-sm text-muted-foreground">{t.appSubtitle}</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2 md:gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeClassName="bg-primary/10 text-primary"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

export default Header;
