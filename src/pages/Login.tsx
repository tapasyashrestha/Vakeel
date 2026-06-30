import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Key, User, FileText, Phone, ArrowLeft } from "lucide-react";
import { ScalesOfJustice } from "../components/LegalIcons";

interface LoginProps {
  onLoginSuccess: (role: "Senior" | "Associate" | "Intern") => void;
  onBackToLanding: () => void;
  initialIsSignUp?: boolean;
}

export function Login({ onLoginSuccess, onBackToLanding, initialIsSignUp = false }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"Senior" | "Associate" | "Intern">("Senior");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!name || !barNumber || !phone || !email || !password) {
        setError("Please fill in all registration fields.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(role);
      }, 1500);
    } else {
      if (!email || !password) {
        setError("Please fill in all credentials.");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        const lowerEmail = email.toLowerCase();
        if (lowerEmail === "sharma@vakeel.ai" && password === "password") {
          setIsLoading(false);
          onLoginSuccess("Senior");
        } else if (lowerEmail === "priya@vakeel.ai" && password === "password") {
          setIsLoading(false);
          onLoginSuccess("Associate");
        } else if (lowerEmail === "rohan@vakeel.ai" && password === "password") {
          setIsLoading(false);
          onLoginSuccess("Intern");
        } else {
          // Allow custom user inputs to succeed as the selected role
          setIsLoading(false);
          onLoginSuccess(role);
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1408] text-[#f0e8d0] flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden font-sans select-none">
      {/* Floating Back to Home Button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#c9a84c]/70 hover:text-[#f0e8d0] transition-colors cursor-pointer bg-[#221c0e]/30 border border-[#c9a84c]/20 hover:border-[#c9a84c] px-3.5 py-2 rounded-lg backdrop-blur-sm z-20"
      >
        <ArrowLeft size={14} />
        Back to Home
      </button>

      {/* Global Background Image: Lady Justice Artwork */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-right md:bg-center opacity-[0.04]"
          style={{
            backgroundImage: "url('/lady_justice_bg.png')"
          }}
        />
        {/* Radial dark vignette to frame the split screen box */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, transparent 10%, #1a1408 85%)"
          }}
        />
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#c9a84c]/5 blur-[120px] pointer-events-none" />

      {/* Split-Screen Login/Register Card */}
      <div className="relative z-10 w-full max-w-5xl bg-[#221c0e]/80 border border-[#c9a84c]/20 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        
        {/* Left Column: Ivory Branding & Scales (Desktop Only) */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 bg-gradient-to-b from-[#f5efdf] to-[#dfd5be] text-[#1a1408] border-r border-[#c9a84c]/25 relative">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#a3822a]/10 border border-[#a3822a]/30 flex items-center justify-center text-[#a3822a]">
              <ScalesOfJustice className="w-6 h-6 text-[#a3822a]" />
            </div>
            <div>
              <p className="text-base font-bold tracking-widest text-[#1a1408] leading-none uppercase">VAKEEL</p>
              <p className="text-[9px] tracking-[0.2em] text-[#a3822a] font-bold uppercase mt-0.5 font-mono">Legal OS</p>
            </div>
          </div>

          {/* Animated Weighing Scale */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#c9a84c]/10 rounded-full blur-xl animate-pulse" />
              <svg className="w-36 h-36 text-[#a3822a] filter drop-shadow-[0_4px_8px_rgba(78,60,17,0.15)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                {/* Base Stand */}
                <path d="M 5 21 L 19 21" />
                <path d="M 12 21 L 12 4" />
                <path d="M 10 4 L 14 4" />
                
                {/* Wiggling Main Beam */}
                <g className="origin-[12px_7px] animate-wiggle">
                  <path d="M 5 7 L 19 7" />
                  {/* Left Pan Strings & Dish */}
                  <path d="M 5 7 L 2.5 14 L 7.5 14 Z" />
                  <path d="M 2.5 14 C 2.5 15.5 7.5 15.5 7.5 14" />
                  
                  {/* Right Pan Strings & Dish */}
                  <path d="M 19 7 L 16.5 14 L 21.5 14 Z" />
                  <path d="M 16.5 14 C 16.5 15.5 21.5 15.5 21.5 14" />
                </g>
                
                {/* Center Dial Needle */}
                <path d="M 12 7 L 12 5.5" />
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-wide uppercase font-serif text-[#4e3c11] px-4 leading-snug">
              Where Law Meets Intelligence
            </h2>
            <p className="text-[11px] text-[#6e5a2a] max-w-[240px] mt-2.5 leading-relaxed font-serif">
              A unified sandbox built for Indian advocates. Access citation-traceable research, secure private RAG, and automated compliance.
            </p>
          </div>

          {/* Bottom Stamp */}
          <div className="text-[9px] font-mono text-[#8c7438] uppercase tracking-widest">
            © {new Date().getFullYear()} VAKEEL OS · SECURE CHAMBER GATEWAY
          </div>
        </div>

        {/* Right Column: Interactive Forms */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-between p-8 bg-[#1a1408]/95 relative">
          <div>
            {/* Header & Subtitle */}
            <div className="flex items-center justify-between mb-5 border-b border-[#c9a84c]/10 pb-4">
              <div>
                <h1 className="text-xl font-bold tracking-wider text-[#f0e8d0] uppercase font-serif">
                  {isSignUp ? "Create Account" : "Login"}
                </h1>
                <p className="text-[9px] tracking-widest text-[#c9a84c] uppercase font-bold font-mono mt-1">
                  {isSignUp ? "Create a new advocate account" : "Sign in to your account"}
                </p>
              </div>

              {!isSignUp && (
                <div className="hidden sm:block text-right text-[9px] font-mono text-[#c2b69a]/70 leading-normal">
                  <div>User: <strong className="text-[#c9a84c]">sharma@vakeel.ai</strong></div>
                  <div>Pass: <strong className="text-[#c9a84c]">password</strong></div>
                </div>
              )}
            </div>

            {/* Sandbox Credentials Box */}
            {!isSignUp && (
              <div className="mb-4 p-3 bg-[#c9a84c]/5 border border-[#c9a84c]/10 rounded-lg text-left text-[11px] text-[#c2b69a] leading-relaxed font-mono">
                <div className="flex flex-wrap justify-between gap-2">
                  <span>Email: <strong className="text-[#f0e8d0]">sharma@vakeel.ai</strong></span>
                  <span>Password: <strong className="text-[#f0e8d0]">password</strong></span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 bg-red-950/40 border border-red-500/30 rounded-lg flex items-start gap-2.5 text-xs text-red-200 leading-normal">
                <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  {/* Full Name */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold font-mono text-[#c2b69a] uppercase tracking-widest">
                      Advocate Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#c9a84c]/50">
                        <User size={14} />
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        placeholder="e.g. Advocate Dev Sharma"
                        className="w-full pl-9 pr-4 py-2 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c] rounded-lg text-sm text-[#f0e8d0] placeholder:text-[#9a8c6a]/30 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Bar Number */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold font-mono text-[#c2b69a] uppercase tracking-widest">
                      Bar Enrollment Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#c9a84c]/50">
                        <FileText size={14} />
                      </span>
                      <input
                        type="text"
                        value={barNumber}
                        onChange={(e) => setBarNumber(e.target.value)}
                        disabled={isLoading}
                        placeholder="e.g. MAH/2984/2024"
                        className="w-full pl-9 pr-4 py-2 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c] rounded-lg text-sm text-[#f0e8d0] placeholder:text-[#9a8c6a]/30 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold font-mono text-[#c2b69a] uppercase tracking-widest">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#c9a84c]/50">
                        <Phone size={14} />
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isLoading}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-9 pr-4 py-2 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c] rounded-lg text-sm text-[#f0e8d0] placeholder:text-[#9a8c6a]/30 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Chamber Role Selection */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold font-mono text-[#c2b69a] uppercase tracking-widest">
                      Chamber Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      disabled={isLoading}
                      className="w-full px-3 py-2 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c] rounded-lg text-sm text-[#f0e8d0] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="Senior" className="bg-[#1a1408]">Senior Partner / Advocate</option>
                      <option value="Associate" className="bg-[#1a1408]">Associate Advocate</option>
                      <option value="Intern" className="bg-[#1a1408]">Junior / Intern Advocate</option>
                    </select>
                  </div>
                </>
              )}

              {/* Email / ID */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold font-mono text-[#c2b69a] uppercase tracking-widest">
                  Chamber ID / Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#c9a84c]/50">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="counselor@vakeel.ai"
                    className="w-full pl-9 pr-4 py-2 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c] rounded-lg text-sm text-[#f0e8d0] placeholder:text-[#9a8c6a]/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold font-mono text-[#c2b69a] uppercase tracking-widest">
                    Chamber Password
                  </label>
                  {!isSignUp && (
                    <a href="#" onClick={(e) => { e.preventDefault(); alert("Please request a password reset from your Chamber Registrar."); }} className="text-[10px] text-[#c9a84c] hover:text-[#f0e8d0] transition-colors font-mono">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#c9a84c]/50">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c] rounded-lg text-sm text-[#f0e8d0] placeholder:text-[#9a8c6a]/30 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 mt-2 bg-[#c9a84c] text-[#1a1408] font-bold uppercase tracking-widest text-[11px] font-mono rounded-lg transition-all shadow-lg shadow-[#c9a84c]/10 flex items-center justify-center gap-2 cursor-pointer ${
                  isLoading
                    ? "bg-[#c9a84c]/70 text-[#1a1408]/60 cursor-not-allowed"
                    : "hover:bg-[#c9a84c]/95"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#1a1408]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M 4 12 a 8 8 0 0 1 8 -8 V 0 C 5.373 0 0 5.373 0 12 h 4 z"></path>
                    </svg>
                    {isSignUp ? "Creating Account..." : "Logging In..."}
                  </>
                ) : (
                  <>
                    {isSignUp ? "Create Account" : "Login"}
                  </>
                )}
              </button>
            </form>

            {/* Option to Swap Views */}
            <div className="mt-4 text-center text-xs border-t border-[#c9a84c]/10 pt-3">
              <span className="text-[#c2b69a]/60">
                {isSignUp ? "Already registered? " : "New to Vakeel? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-[#c9a84c] hover:text-[#f0e8d0] font-bold underline cursor-pointer transition-colors"
              >
                {isSignUp ? "Login Now" : "Register Now"}
              </button>
            </div>
          </div>

          {/* Social SSO Section */}
          <div>
            <div className="relative my-4 text-center">
              <div className="absolute inset-y-1/2 left-0 right-0 border-t border-[#c9a84c]/10" />
              <span className="relative z-10 px-3 bg-[#1a1408] text-[9px] text-[#c2b69a]/50 uppercase tracking-widest font-mono">
                Alternative Gateways
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => alert("SSO Bar Association identity check is simulated.")}
                className="py-2 px-3 border border-[#c9a84c]/20 hover:border-[#c9a84c]/50 bg-[#130f06]/40 hover:bg-[#130f06]/80 text-[#c2b69a] hover:text-[#f0e8d0] rounded-lg transition-all text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Key size={12} className="text-[#c9a84c]" />
                Bar ID SSO
              </button>
              <button
                type="button"
                onClick={() => alert("Google SSO is simulated.")}
                className="py-2 px-3 border border-[#c9a84c]/20 hover:border-[#c9a84c]/50 bg-[#130f06]/40 hover:bg-[#130f06]/80 text-[#c2b69a] hover:text-[#f0e8d0] rounded-lg transition-all text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <svg className="w-3 h-3 text-[#c9a84c]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.77-6.228-6.19s2.788-6.19 6.228-6.19c1.683 0 3.118.608 4.223 1.693l3.073-3.073C19.24 2.807 15.96 1.8 12.24 1.8 6.474 1.8 1.8 6.474 1.8 12.24s4.674 10.44 10.44 10.44c6.19 0 10.44-4.35 10.44-10.44 0-.705-.084-1.385-.24-1.955H12.24z"/>
                </svg>
                Google SSO
              </button>
            </div>


            {/* Bottom Ingress Footer */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[9px] font-mono text-[#c2b69a]/40 tracking-wider border-t border-[#c9a84c]/10 pt-3">
              <ShieldCheck size={12} className="text-[#c9a84c]/40" />
              <span>AES-256 SECURED INGRESS · BAR CERTIFIED PLATFORM</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
