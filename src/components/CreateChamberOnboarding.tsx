import { useState } from "react";
import { auth } from "../firebase";
import { ScalesOfJustice } from "./LegalIcons";
import { LogOut, ArrowRight, ShieldAlert } from "lucide-react";

interface CreateChamberOnboardingProps {
  onChamberCreated: (chamberId: string, role: string) => void;
  onSignOut: () => void;
}

export function CreateChamberOnboarding({ onChamberCreated, onSignOut }: CreateChamberOnboardingProps) {
  const [chamberName, setChamberName] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chamberName.trim()) {
      setError("Chamber Name is required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated.");
        setIsLoading(false);
        return;
      }

      const token = await user.getIdToken();
      const response = await fetch("http://localhost:8000/chambers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: chamberName,
          bar_number: barNumber || null
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to create chamber");
      }

      const data = await response.json();
      
      // Force refresh user ID token so client receives the new claims
      await user.getIdToken(true);
      
      onChamberCreated(data.chamber_id, data.role);
    } catch (err: any) {
      setError(err.message || "Failed to create chamber.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1408] text-[#f0e8d0] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.03]"
          style={{ backgroundImage: "url('/lady_justice_bg.png')" }}
        />
      </div>

      <div className="w-full max-w-md bg-[#221c0e]/80 border border-[#c9a84c]/20 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-full flex items-center justify-center mx-auto shadow-md">
            <ScalesOfJustice className="w-6 h-6 text-[#c9a84c]" />
          </div>
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider font-serif text-[#f0e8d0]">Create Your Chamber</h1>
            <p className="text-xs text-[#c2b69a]/70 uppercase font-mono tracking-widest mt-1">Onboarding Flow · Aegis Shield</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/30 rounded-lg flex items-center gap-2.5 text-xs text-red-400">
            <ShieldAlert size={14} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="text-[#c2b69a] uppercase tracking-wider">Chamber/Firm Name *</label>
            <input
              type="text"
              value={chamberName}
              onChange={(e) => setChamberName(e.target.value)}
              placeholder="E.g., Singhania & Partners"
              className="w-full px-3 py-2.5 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c]/50 rounded-lg text-[#f0e8d0] focus:outline-none placeholder:text-[#9a8c6a]/30"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#c2b69a] uppercase tracking-wider">Bar Registration Number (Optional)</label>
            <input
              type="text"
              value={barNumber}
              onChange={(e) => setBarNumber(e.target.value)}
              placeholder="E.g., MAH/1234/2026"
              className="w-full px-3 py-2.5 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c]/50 rounded-lg text-[#f0e8d0] focus:outline-none placeholder:text-[#9a8c6a]/30"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#c9a84c] hover:bg-[#d6b75e] text-[#1a1408] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Chamber..." : "Set Up Chamber"}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="border-t border-[#c9a84c]/10 pt-4 flex justify-between items-center text-[10px] font-mono">
          <span className="text-[#c2b69a]/40">{auth.currentUser?.email}</span>
          <button
            onClick={onSignOut}
            className="text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <LogOut size={12} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
