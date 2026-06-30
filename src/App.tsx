import { useState } from "react";
import { Landing } from "./pages/Landing";
import { RetrievalWorkspace } from "./pages/RetrievalWorkspace";
import { ChamberDashboard } from "./pages/ChamberDashboard";
import { ChatPortal } from "./pages/ChatPortal";
import { DraftingPanel } from "./pages/DraftingPanel";
import { DocumentRepository } from "./pages/DocumentRepository";
import { SmartCalendar } from "./pages/SmartCalendar";
import { InternDashboard } from "./pages/InternDashboard";
import { SettingsConfiguration } from "./pages/SettingsConfiguration";
import { BillingInvoicing } from "./pages/BillingInvoicing";
import type { UserRole } from "./components/RoleSimulator";
import { ScalesOfJustice } from "./components/LegalIcons";
import { Login } from "./pages/Login";
import {
  Menu,
  X,
  LayoutDashboard,
  Search,
  MessageSquare,
  FileText,
  LogOut,
  FolderOpen,
  Users,
  Calendar,
  Settings,
  Receipt,
  Languages
} from "lucide-react";

const viewLabels: Record<string, string> = {
  landing: "Home",
  dashboard: "Dashboard",
  workspace: "Legal Intelligence",
  chat: "AI Conversation",
  drafting: "AI Drafting Engine",
  repository: "Document Intelligence",
  interns: "Intern Management",
  calendar: "Smart Calendar",
  settings: "Settings Configuration",
  billing: "Billing & Invoices",
};

const NAVBAR_TRANSLATIONS = {
  en: {
    features: "Features",
    demo: "Book Demo",
    pricing: "Pricing",
    support: "Support",
    blog: "Blog",
    about: "About",
    login: "Login",
    startFree: "Start Free"
  },
  hi: {
    features: "विशेषताएं",
    demo: "डेमो बुक करें",
    pricing: "मूल्य निर्धारण",
    support: "सहायता",
    blog: "ब्लॉग",
    about: "हमारे बारे में",
    login: "लॉगिन",
    startFree: "शुरू करें"
  },
  ur: {
    features: "خصوصیات",
    demo: "ڈیمو بک کریں",
    pricing: "قیمتیں",
    support: "سپورٹ",
    blog: "بلاگ",
    about: "ہمارے بارے میں",
    login: "لاگ ان",
    startFree: "مفت شروع کریں"
  },
  mr: {
    features: "वैशिष्ट्ये",
    demo: "डेमो बुक करा",
    pricing: "किंमत",
    support: "मदत",
    blog: "ब्लॉग",
    about: "आमच्याबद्दल",
    login: "लॉगिन",
    startFree: "विनामूल्य सुरू करा"
  },
  bn: {
    features: "বৈশিষ্ট্য",
    demo: "ডেমো বুক করুন",
    pricing: "মূল্য নির্ধারণ",
    support: "সহায়তা",
    blog: "ব্লগ",
    about: "আমাদের সম্পর্কে",
    login: "লগইন",
    startFree: "বিনামূল্যে শুরু করুন"
  }
};

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<
    | "landing"
    | "workspace"
    | "dashboard"
    | "chat"
    | "drafting"
    | "repository"
    | "calendar"
    | "interns"
    | "settings"
    | "billing"
  >("landing");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModeIsSignUp, setAuthModeIsSignUp] = useState(false);

  // Language State
  const [language, setLanguage] = useState<"en" | "hi" | "ur" | "mr" | "bn">("en");

  // Role & RAG Simulator Settings
  const [currentRole, setCurrentRole] = useState<UserRole>("Senior");
  const isDraftDestination = true;
  const routerConfidence = "High";
  const strictSynthesis = true;

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "workspace", label: "Legal Intelligence", icon: Search },
    { id: "chat", label: "AI Conversation", icon: MessageSquare },
    { id: "drafting", label: "AI Drafting Engine", icon: FileText },
    { id: "repository", label: "Document Intelligence", icon: FolderOpen },
    ...(currentRole !== "Intern" ? [{ id: "interns", label: "Intern Management", icon: Users }] : []),
    { id: "calendar", label: "Smart Calendar", icon: Calendar },
  ];

  const getProfileData = () => {
    switch (currentRole) {
      case "Senior":
        return { name: "Advocate Sharma", role: "Senior Partner", initials: "AS" };
      case "Associate":
        return { name: "Advocate Priya Sen", role: "Associate", initials: "PS" };
      case "Intern":
      default:
        return { name: "Rohan Kumar", role: "Intern", initials: "RK" };
    }
  };

  const profile = getProfileData();

  if (currentView !== "landing" && !isAuthenticated) {
    return (
      <Login
        onLoginSuccess={(role) => {
          setCurrentRole(role);
          setIsAuthenticated(true);
        }}
        onBackToLanding={() => setCurrentView("landing")}
        initialIsSignUp={authModeIsSignUp}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-serif select-none relative">
      {/* Global Background Image: Lady Justice High-Res Artwork */}
      <div className="fixed inset-0 pointer-events-none z-[-10] select-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-right md:bg-right-bottom opacity-[0.04]"
          style={{
            backgroundImage: "url('/lady_justice_bg.png')"
          }}
        />
        {/* Deep shadow radial gradient overlay to blend the image seamlessly into the luxury theme */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 75% 50%, transparent 15%, #1a1408 80%)"
          }}
        />
      </div>

      {currentView === "landing" ? (
        <>
          {/* Landing Header */}
          <nav className="sticky top-0 z-50 bg-[#1a1408]/90 backdrop-blur-md border-b border-primary/20 px-6 sm:px-10 py-4 flex items-center justify-between font-sans">
            {/* Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView("landing")}>
              <ScalesOfJustice className="w-8 h-8 text-primary" />
              <div>
                <p className="text-base font-semibold tracking-widest text-foreground leading-none uppercase">
                  VAKEEL
                </p>
                <p className="text-[9px] tracking-[0.25em] text-primary opacity-80 uppercase mt-0.5 font-bold">
                  Legal Intelligence
                </p>
              </div>
            </div>

            {/* Center Navigation Links (Reference Mock) */}
            <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest font-bold text-muted-foreground">
              <button className="hover:text-primary transition-colors cursor-pointer">{NAVBAR_TRANSLATIONS[language as keyof typeof NAVBAR_TRANSLATIONS]?.features || NAVBAR_TRANSLATIONS.en.features}</button>
              <button className="hover:text-primary transition-colors cursor-pointer">{NAVBAR_TRANSLATIONS[language as keyof typeof NAVBAR_TRANSLATIONS]?.demo || NAVBAR_TRANSLATIONS.en.demo}</button>
              <button className="hover:text-primary transition-colors cursor-pointer">{NAVBAR_TRANSLATIONS[language as keyof typeof NAVBAR_TRANSLATIONS]?.pricing || NAVBAR_TRANSLATIONS.en.pricing}</button>
              <button className="hover:text-primary transition-colors cursor-pointer">{NAVBAR_TRANSLATIONS[language as keyof typeof NAVBAR_TRANSLATIONS]?.support || NAVBAR_TRANSLATIONS.en.support}</button>
              <button className="hover:text-primary transition-colors cursor-pointer">{NAVBAR_TRANSLATIONS[language as keyof typeof NAVBAR_TRANSLATIONS]?.blog || NAVBAR_TRANSLATIONS.en.blog}</button>
              <button className="hover:text-primary transition-colors cursor-pointer">{NAVBAR_TRANSLATIONS[language as keyof typeof NAVBAR_TRANSLATIONS]?.about || NAVBAR_TRANSLATIONS.en.about}</button>
            </div>

            {/* Quick access buttons */}
            <div className="flex items-center gap-5 text-xs tracking-wider uppercase font-bold text-muted-foreground">
              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-secondary/80 border border-primary/20 rounded-lg px-2.5 py-1.5 text-[#f0e8d0] backdrop-blur-sm">
                <Languages size={13} className="text-primary" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-transparent text-[10px] font-mono tracking-wider focus:outline-none cursor-pointer uppercase border-none text-[#f0e8d0]"
                >
                  <option value="en" className="bg-[#1a1408]">EN</option>
                  <option value="hi" className="bg-[#1a1408]">HI</option>
                  <option value="ur" className="bg-[#1a1408]">UR</option>
                  <option value="mr" className="bg-[#1a1408]">MR</option>
                  <option value="bn" className="bg-[#1a1408]">BN</option>
                </select>
              </div>

              {/* Login Link */}
              <button
                onClick={() => {
                  setAuthModeIsSignUp(false);
                  setCurrentView("dashboard");
                }}
                className="hover:text-primary transition-colors cursor-pointer text-xs uppercase tracking-widest font-bold text-muted-foreground"
              >
                {NAVBAR_TRANSLATIONS[language as keyof typeof NAVBAR_TRANSLATIONS]?.login || NAVBAR_TRANSLATIONS.en.login}
              </button>

              {/* Start Free Pill Button */}
              <button
                onClick={() => {
                  setAuthModeIsSignUp(true);
                  setCurrentView("dashboard");
                }}
                className="px-6 py-2.5 bg-primary text-background hover:bg-primary/95 transition-all rounded-full text-xs font-bold uppercase tracking-widest cursor-pointer shadow-lg shadow-primary/10"
              >
                {NAVBAR_TRANSLATIONS[language as keyof typeof NAVBAR_TRANSLATIONS]?.startFree || NAVBAR_TRANSLATIONS.en.startFree}
              </button>
            </div>
          </nav>
          
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-10 py-6 relative z-10">
            <Landing
              onNavigate={(view, authMode) => {
                if (authMode === "signup") {
                  setAuthModeIsSignUp(true);
                } else if (authMode === "login") {
                  setAuthModeIsSignUp(false);
                }
                setCurrentView(view);
              }}
              language={language}
            />
          </main>

          {/* Footer */}
          <footer className="bg-[#140f06] border-t border-primary/10 py-10 mt-auto text-xs font-sans">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2 text-foreground">
                <ScalesOfJustice className="w-6 h-6 text-primary" />
                <span className="text-lg font-bold tracking-widest font-sans">Vakeel</span>
              </div>
              <p className="text-muted-foreground/60 text-center md:text-right font-mono">
                © {new Date().getFullYear()} Vakeel Legal Intelligence Platform · B2B Chamber RAG. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      ) : (
        <div className="flex flex-1 relative min-h-screen">
          {/* Desktop Left Sidebar */}
          <aside className="hidden md:flex flex-col w-72 bg-[#221c0e]/95 border-r border-primary/20 h-screen sticky top-0 shrink-0 z-30 font-sans">
            {/* Brand Logo Header */}
            <div className="p-6 border-b border-primary/10 flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView("landing")}>
              <ScalesOfJustice className="w-8 h-8 text-primary" />
              <div>
                <p className="text-lg font-bold tracking-widest text-foreground leading-none uppercase font-sans">
                  VAKEEL
                </p>
                <p className="text-[10px] tracking-[0.2em] text-primary opacity-80 uppercase mt-1 font-bold font-sans">
                  LEGAL OS
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
              <p className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">
                Main Workspace
              </p>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Language Selector */}
            <div className="px-6 py-3 border-t border-primary/10 bg-[#1a1408]/20 flex items-center justify-between gap-2 text-xs font-sans">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Languages size={14} className="text-primary" />
                <span>Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-secondary border border-primary/20 rounded px-2 py-1 text-[#f0e8d0] focus:outline-none cursor-pointer text-xs"
              >
                <option value="en" className="bg-[#221c0e]">English</option>
                <option value="hi" className="bg-[#221c0e]">हिंदी (Hindi)</option>
                <option value="ur" className="bg-[#221c0e]">اردو (Urdu)</option>
                <option value="mr" className="bg-[#221c0e]">मराठी (Marathi)</option>
                <option value="bn" className="bg-[#221c0e]">বাংলা (Bangla)</option>
              </select>
            </div>

            {/* Bottom Profile Section */}
            <div className="p-4 border-t border-primary/10 bg-[#1a1408]/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary shrink-0 text-sm">
                  {profile.initials}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-foreground truncate">{profile.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5 truncate">{profile.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
                <button
                  onClick={() => setCurrentView("settings")}
                  className={`p-1.5 hover:text-primary hover:bg-secondary/50 rounded transition-colors cursor-pointer ${
                    currentView === "settings" ? "text-primary bg-primary/10" : ""
                  }`}
                  title="Settings"
                >
                  <Settings size={15} />
                </button>
                <button
                  onClick={() => setCurrentView("billing")}
                  className={`p-1.5 hover:text-primary hover:bg-secondary/50 rounded transition-colors cursor-pointer ${
                    currentView === "billing" ? "text-primary bg-primary/10" : ""
                  }`}
                  title="Billing"
                >
                  <Receipt size={15} />
                </button>
                <button
                  onClick={() => { setIsAuthenticated(false); setCurrentView("landing"); }}
                  className="p-1.5 hover:text-destructive hover:bg-secondary/50 rounded transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Navigation Header */}
          <div className="md:hidden w-full h-16 bg-[#1a1408] border-b border-primary/20 flex items-center justify-between px-6 fixed top-0 left-0 z-40 font-sans">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView("landing")}>
              <ScalesOfJustice className="w-6 h-6 text-primary" />
              <span className="text-sm font-bold tracking-widest text-foreground uppercase">Vakeel</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary uppercase font-bold tracking-wide">
                {currentView}
              </span>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 text-foreground hover:text-primary rounded-lg border border-primary/10 cursor-pointer"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Overlay */}
          {isSidebarOpen && (
            <div className="md:hidden fixed inset-0 z-30 flex">
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
              <aside className="relative flex flex-col w-72 bg-[#221c0e] border-r border-primary/20 h-full z-40 font-sans">
                {/* Brand Header */}
                <div className="p-6 border-b border-primary/10 flex items-center gap-3">
                  <ScalesOfJustice className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-lg font-bold tracking-widest text-foreground leading-none uppercase">
                      VAKEEL
                    </p>
                    <p className="text-[10px] tracking-[0.2em] text-primary opacity-80 uppercase mt-1 font-bold">
                      LEGAL OS
                    </p>
                  </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
                  <p className="px-3 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-3">
                    Main Workspace
                  </p>
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentView(item.id as any);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        <Icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Language Selector */}
                <div className="px-6 py-3 border-t border-primary/10 bg-[#1a1408]/20 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Languages size={14} className="text-primary" />
                    <span>Language</span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="bg-secondary border border-primary/20 rounded px-2 py-1 text-[#f0e8d0] focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="en" className="bg-[#221c0e]">English</option>
                    <option value="hi" className="bg-[#221c0e]">हिंदी (Hindi)</option>
                    <option value="ur" className="bg-[#221c0e]">اردو (Urdu)</option>
                    <option value="mr" className="bg-[#221c0e]">मराठी (Marathi)</option>
                    <option value="bn" className="bg-[#221c0e]">বাংলা (Bangla)</option>
                  </select>
                </div>

                {/* Profile Section */}
                <div className="p-4 border-t border-primary/10 bg-[#1a1408]/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary shrink-0 text-sm">
                      {profile.initials}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-foreground truncate">{profile.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5 truncate">{profile.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <button
                      onClick={() => { setCurrentView("settings"); setIsSidebarOpen(false); }}
                      className={`p-1.5 hover:text-primary hover:bg-secondary/50 rounded transition-colors cursor-pointer ${
                        currentView === "settings" ? "text-primary bg-primary/10" : ""
                      }`}
                    >
                      <Settings size={15} />
                    </button>
                    <button
                      onClick={() => { setCurrentView("billing"); setIsSidebarOpen(false); }}
                      className={`p-1.5 hover:text-primary hover:bg-secondary/50 rounded transition-colors cursor-pointer ${
                        currentView === "billing" ? "text-primary bg-primary/10" : ""
                      }`}
                    >
                      <Receipt size={15} />
                    </button>
                    <button
                      onClick={() => { setIsAuthenticated(false); setCurrentView("landing"); setIsSidebarOpen(false); }}
                      className="p-1.5 hover:text-destructive hover:bg-secondary/50 rounded transition-colors cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut size={15} />
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Main Area Wrapper */}
          <div className="flex-1 flex flex-col min-w-0 md:pt-0 pt-16">
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 relative z-10">
              {/* Breadcrumb Navigator */}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest mb-6 font-sans border-b border-primary/10 pb-3 select-none">
                <button
                  onClick={() => setCurrentView("landing")}
                  className="hover:text-primary transition-colors cursor-pointer font-bold"
                >
                  Vakeel
                </button>
                <span className="text-primary/30">/</span>
                {currentView !== "dashboard" ? (
                  <>
                    <button
                      onClick={() => setCurrentView("dashboard")}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      OS Portal
                    </button>
                    <span className="text-primary/30">/</span>
                  </>
                ) : null}
                <span className="text-primary font-bold">{viewLabels[currentView] || currentView}</span>
              </div>

              {/* View Router */}
              {currentView === "workspace" && (
                <RetrievalWorkspace
                  currentRole={currentRole}
                  isDraftDestination={isDraftDestination}
                  routerConfidence={routerConfidence}
                  strictSynthesis={strictSynthesis}
                  language={language}
                />
              )}
              {currentView === "dashboard" && <ChamberDashboard currentRole={currentRole} language={language} />}
              {currentView === "chat" && <ChatPortal language={language} />}
              {currentView === "drafting" && <DraftingPanel language={language} />}
              {currentView === "repository" && <DocumentRepository currentRole={currentRole} language={language} />}
              {currentView === "calendar" && <SmartCalendar language={language} />}
              {currentView === "interns" && currentRole !== "Intern" && <InternDashboard language={language} />}
              {currentView === "settings" && <SettingsConfiguration />}
              {currentView === "billing" && <BillingInvoicing />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
