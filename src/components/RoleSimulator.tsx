import { User, HelpCircle } from "lucide-react";

export type UserRole = "Senior" | "Associate" | "Intern";

interface RoleSimulatorProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  routerConfidence: "High" | "Low";
  onChangeConfidence: (val: "High" | "Low") => void;
}

export function RoleSimulator({
  currentRole,
  onChangeRole,
  routerConfidence,
  onChangeConfidence,
}: RoleSimulatorProps) {
  return (
    <div className="bg-secondary/70 border border-primary/20 backdrop-blur-md rounded-xl p-4 mb-6 shadow-lg text-xs md:text-sm font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section: Role Selection */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-primary font-bold tracking-wider font-mono">
            <User size={14} className="text-primary animate-pulse" />
            <span>ROLE &amp; PERMISSION SIMULATOR</span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-md">
            Simulate role-based access for search queries. Interns are barred from viewing files marked as private.
          </p>
          <div className="flex gap-2 mt-1">
            {(["Senior", "Associate", "Intern"] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => onChangeRole(role)}
                className={`px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                  currentRole === role
                    ? "bg-primary text-background border-primary shadow-md font-semibold"
                    : "border-primary/25 text-muted-foreground hover:text-foreground hover:border-primary/50"
                }`}
              >
                {role === "Senior" ? "Senior Advocate" : role === "Associate" ? "Associate" : "Intern"}
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Router Confidence Toggle */}
        <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-primary/10 pt-4 md:pt-0 md:pl-4 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider flex items-center gap-1">
            <HelpCircle size={12} className="text-primary" /> Router Confidence
          </label>
          <div className="flex bg-secondary border border-primary/20 rounded-lg p-0.5 mt-1">
            {(["High", "Low"] as const).map((conf) => (
              <button
                key={conf}
                onClick={() => onChangeConfidence(conf)}
                className={`flex-1 py-1.5 rounded text-center font-medium transition-all cursor-pointer ${
                  routerConfidence === conf
                    ? "bg-primary/20 text-primary border border-primary/30 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {conf}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
