import { useState } from "react";
import { Save, Sparkles, Bell, Shield, User } from "lucide-react";

export function SettingsConfiguration() {
  const [chamberName, setChamberName] = useState("Singhania & Partners");
  const [seniorAdvocate, setSeniorAdvocate] = useState("Aditya Singhania");
  const [primaryCourt, setPrimaryCourt] = useState("High Court of Delhi");
  
  // AI config
  const [aiModel, setAiModel] = useState("gpt-4o");
  const [aiTemperature, setAiTemperature] = useState(0.2);
  const [strictRAG, setStrictRAG] = useState(true);

  // Notifications
  const [emailDigest, setEmailDigest] = useState(true);
  const [smsLimitationAlerts, setSmsLimitationAlerts] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground uppercase tracking-wider">
            CHAMBER CONFIGURATIONS
          </h1>
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-wide">
            Admin Settings, API Integrations &amp; Custom Rules
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Left column (8 Columns): settings forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Box 1: Chamber Profile */}
          <div className="bg-card border border-primary/15 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/10 pb-3">
              <User size={14} />
              Chamber Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-primary/70 font-bold block">Chamber Name</label>
                <input
                  type="text"
                  value={chamberName}
                  onChange={(e) => setChamberName(e.target.value)}
                  className="w-full p-2.5 bg-background border border-primary/25 rounded focus:outline-none text-foreground font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="text-primary/70 font-bold block">Senior Advocate Principal</label>
                <input
                  type="text"
                  value={seniorAdvocate}
                  onChange={(e) => setSeniorAdvocate(e.target.value)}
                  className="w-full p-2.5 bg-background border border-primary/25 rounded focus:outline-none text-foreground font-sans"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-primary/70 font-bold block">Primary Court Registry</label>
                <input
                  type="text"
                  value={primaryCourt}
                  onChange={(e) => setPrimaryCourt(e.target.value)}
                  className="w-full p-2.5 bg-background border border-primary/25 rounded focus:outline-none text-foreground font-sans"
                />
              </div>
            </div>
          </div>

          {/* Box 2: AI Config */}
          <div className="bg-card border border-primary/15 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/10 pb-3">
              <Sparkles size={14} />
              AI Search &amp; Synthesis Customizer
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-primary/70 font-bold block">Language Model Engine</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full p-2.5 bg-background border border-primary/25 rounded focus:outline-none text-foreground"
                >
                  <option value="gpt-4o">GPT-4o (High-precision citations)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini (Fast responses)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-primary/70 font-bold block">Generation Temperature: {aiTemperature}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiTemperature}
                  onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 bg-background border border-primary/25 rounded cursor-pointer accent-primary"
                />
              </div>
              <div className="sm:col-span-2 flex items-center justify-between p-3 bg-secondary/35 border border-primary/5 rounded">
                <div>
                  <div className="font-bold text-foreground">Enforce Strict Citation Validation</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    Requires all drafting citations to pass mechanical validation before exporting.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={strictRAG}
                  onChange={(e) => setStrictRAG(e.target.checked)}
                  className="w-4 h-4 rounded border-primary/25 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column (4 Columns): actions & notifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notification toggles */}
          <div className="bg-card border border-primary/15 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/10 pb-3">
              <Bell size={14} />
              Notification Settings
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-1">
                <div>
                  <div className="font-bold text-foreground">Email Daily Digest</div>
                  <div className="text-[9px] text-muted-foreground">Summarizes tasks &amp; deadlines</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-primary"
                />
              </div>

              <div className="flex items-center justify-between p-1">
                <div>
                  <div className="font-bold text-foreground">SMS Limitation Alerts</div>
                  <div className="text-[9px] text-muted-foreground">Urgent alert warnings via SMS</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsLimitationAlerts}
                  onChange={(e) => setSmsLimitationAlerts(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Action trigger */}
          <div className="bg-card border border-primary/15 rounded-xl p-6 shadow-xl space-y-4 text-center">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center justify-center gap-1.5 border-b border-primary/10 pb-3">
              <Shield size={14} />
              Save Actions
            </h3>
            
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-primary text-background disabled:bg-secondary disabled:text-muted-foreground font-bold uppercase rounded-lg hover:bg-primary/95 transition-all flex items-center justify-center gap-1.5"
            >
              <Save size={14} />
              {isSaving ? "Saving..." : "Apply Configurations"}
            </button>

            {saveSuccess && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded text-[10px] text-emerald-400 font-mono animate-fadeIn">
                Chamber configurations successfully applied.
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
