import { useState, useEffect } from "react";
import { Save, Sparkles, Bell, Shield, User } from "lucide-react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

interface SettingsConfigurationProps {
  chamberId: string | null;
  onProfileUpdate?: (newName: string) => void;
}

export function SettingsConfiguration({ chamberId, onProfileUpdate }: SettingsConfigurationProps) {
  // User profile state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userBarNumber, setUserBarNumber] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const [chamberName, setChamberName] = useState(() => {
    return localStorage.getItem("vakeel_chamber_name") || "Singhania & Partners";
  });
  const [seniorAdvocate, setSeniorAdvocate] = useState(() => {
    return localStorage.getItem("vakeel_senior_advocate") || "Aditya Singhania";
  });
  const [primaryCourt, setPrimaryCourt] = useState(() => {
    return localStorage.getItem("vakeel_primary_court") || "High Court of Delhi";
  });
  
  // AI config
  const [aiModel, setAiModel] = useState(() => {
    return localStorage.getItem("vakeel_ai_model") || "gpt-4o";
  });
  const [aiTemperature, setAiTemperature] = useState(() => {
    const val = localStorage.getItem("vakeel_ai_temperature");
    return val ? parseFloat(val) : 0.2;
  });
  const [strictRAG, setStrictRAG] = useState(() => {
    const val = localStorage.getItem("vakeel_strict_rag");
    return val === null ? true : val === "true";
  });

  // Notifications
  const [emailDigest, setEmailDigest] = useState(() => {
    const val = localStorage.getItem("vakeel_email_digest");
    return val === null ? true : val === "true";
  });
  const [smsLimitationAlerts, setSmsLimitationAlerts] = useState(() => {
    const val = localStorage.getItem("vakeel_sms_alerts");
    return val === null ? true : val === "true";
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Fetch User Data
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const udata = userDocSnap.data();
          if (udata.name) setUserName(udata.name);
          if (udata.email) setUserEmail(udata.email);
          if (udata.barNumber) setUserBarNumber(udata.barNumber);
          if (udata.phone) setUserPhone(udata.phone);

          // Default senior principal to user's name if not configured yet
          if (udata.name && !localStorage.getItem("vakeel_senior_advocate")) {
            setSeniorAdvocate(udata.name);
          }
        } else {
          if (user.displayName) setUserName(user.displayName);
          if (user.email) setUserEmail(user.email);
        }
      } catch (err) {
        console.error("Error fetching user data from Firestore:", err);
      }
    };

    // 2. Fetch Chamber Data
    const fetchChamberData = async () => {
      if (!chamberId) return;
      try {
        const docRef = doc(db, "chambers", chamberId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name) setChamberName(data.name);
          if (data.seniorAdvocate) setSeniorAdvocate(data.seniorAdvocate);
          if (data.primaryCourt) setPrimaryCourt(data.primaryCourt);
          if (data.aiModel) setAiModel(data.aiModel);
          if (data.aiTemperature !== undefined) setAiTemperature(data.aiTemperature);
          if (data.strictRAG !== undefined) setStrictRAG(data.strictRAG);
          if (data.emailDigest !== undefined) setEmailDigest(data.emailDigest);
          if (data.smsLimitationAlerts !== undefined) setSmsLimitationAlerts(data.smsLimitationAlerts);
        }
      } catch (err) {
        console.error("Error fetching chamber profile data from Firestore:", err);
      }
    };

    fetchUserData();
    fetchChamberData();
  }, [chamberId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSaveSuccess(false);

    try {
      // 1. Update User Profile
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: userName });
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          name: userName,
          barNumber: userBarNumber,
          phone: userPhone
        });
        if (onProfileUpdate) {
          onProfileUpdate(userName);
        }
      }

      // 2. Update Chamber Profile
      if (chamberId) {
        const docRef = doc(db, "chambers", chamberId);
        await updateDoc(docRef, {
          name: chamberName,
          seniorAdvocate,
          primaryCourt,
          aiModel,
          aiTemperature,
          strictRAG,
          emailDigest,
          smsLimitationAlerts
        });
      }

      // Also save to localStorage as a client-side backup
      localStorage.setItem("vakeel_chamber_name", chamberName);
      localStorage.setItem("vakeel_senior_advocate", seniorAdvocate);
      localStorage.setItem("vakeel_primary_court", primaryCourt);
      localStorage.setItem("vakeel_ai_model", aiModel);
      localStorage.setItem("vakeel_ai_temperature", aiTemperature.toString());
      localStorage.setItem("vakeel_strict_rag", strictRAG.toString());
      localStorage.setItem("vakeel_email_digest", emailDigest.toString());
      localStorage.setItem("vakeel_sms_alerts", smsLimitationAlerts.toString());

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error updating configurations:", err);
      setError(err.message || "Failed to save configurations.");
    } finally {
      setIsSaving(false);
    }
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
          
          {/* Box 0: Personal Profile */}
          <div className="bg-card border border-primary/15 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/10 pb-3">
              <User size={14} />
              Personal Profile (Credentials)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-primary/70 font-bold block">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2.5 bg-background border border-primary/25 rounded focus:outline-none text-foreground font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="text-primary/70 font-bold block">Email Address (Read-only)</label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full p-2.5 bg-[#1a1408]/40 border border-primary/10 rounded focus:outline-none text-muted-foreground font-sans cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-primary/70 font-bold block">Bar Council Registration Number</label>
                <input
                  type="text"
                  value={userBarNumber}
                  onChange={(e) => setUserBarNumber(e.target.value)}
                  className="w-full p-2.5 bg-background border border-primary/25 rounded focus:outline-none text-foreground font-sans"
                />
              </div>
              <div className="space-y-1">
                <label className="text-primary/70 font-bold block">Phone Number</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full p-2.5 bg-background border border-primary/25 rounded focus:outline-none text-foreground font-sans"
                />
              </div>
            </div>
          </div>

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

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-500/30 rounded text-[10px] text-red-400 font-mono animate-fadeIn mt-2">
                {error}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
