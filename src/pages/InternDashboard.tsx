import { useState } from "react";
import { User, ClipboardList, ShieldAlert, Clock, Plus, CheckCircle } from "lucide-react";

interface InternInfo {
  id: string;
  name: string;
  tasksCount: number;
  searchCount: number;
  lastActive: string;
  currentTask: string;
  loginTime: string;
  isActive: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  internName: string;
  query: string;
  corpus: string;
  status: "Passed" | "Blocked (Confidential)";
}

interface InternDashboardProps {
  language?: string;
}

export function InternDashboard({ language = "en" }: InternDashboardProps) {
  const TRANSLATIONS = {
    en: {
      pageTitle: "INTERN MANAGEMENT & AUDITS",
      pageSub: "Junior Advocates Assignments & Audit Logs",
      delegateTitle: "Delegate Research Task",
      selectIntern: "Select Intern",
      taskDesc: "Task Description",
      assignBtn: "Assign Task",
      registryTitle: "Active Intern Registry",
      auditTitle: "Search Audit Logs",
      lastLogin: "Last Login",
      lastActive: "Last Active",
      active: "Active",
      offline: "Offline",
      tasksLabel: "Tasks",
      queriesLabel: "Queries",
      currentAssignment: "Current Assignment",
      colTimestamp: "Timestamp",
      colIntern: "Intern",
      colQuery: "Search Query",
      colTarget: "Target",
      colStatus: "Status"
    },
    hi: {
      pageTitle: "इंटर्न प्रबंधन और ऑडिट",
      pageSub: "लेयर 4 · जूनियर वकीलों के असाइनमेंट और ऑडिट लॉग",
      delegateTitle: "शोध कार्य सौंपें",
      selectIntern: "इंटर्न चुनें",
      taskDesc: "कार्य विवरण",
      assignBtn: "कार्य सौंपें",
      registryTitle: "सक्रिय इंटर्न रजिस्ट्री",
      auditTitle: "खोज ऑडिट लॉग",
      lastLogin: "पिछला लॉगिन",
      lastActive: "पिछली सक्रियता",
      active: "सक्रिय",
      offline: "ऑफ़लाइन",
      tasksLabel: "कार्य",
      queriesLabel: "प्रश्न",
      currentAssignment: "वर्तमान असाइनमेंट",
      colTimestamp: "समय",
      colIntern: "इंटर्न",
      colQuery: "खोज प्रश्न",
      colTarget: "लक्ष्य",
      colStatus: "स्थिति"
    },
    ur: {
      pageTitle: "انٹرن مینجمنٹ اور آڈٹ",
      pageSub: "لیئر 4 · جونیئر وکلاء کے اسائنمنٹس اور آڈٹ لاگز",
      delegateTitle: "تحقیقی کام سونپیں",
      selectIntern: "انٹرن منتخب کریں",
      taskDesc: "کام کی تفصیل",
      assignBtn: "کام سونپیں",
      registryTitle: "سرگرم انٹرن رجسٹری",
      auditTitle: "تلاش آڈٹ لاگ",
      lastLogin: "آخری لاگ ان",
      lastActive: "آخری سرگرمی",
      active: "سرگرم",
      offline: "آف لائن",
      tasksLabel: "کام",
      queriesLabel: "سوالات",
      currentAssignment: "موجودہ اسائنمنٹ",
      colTimestamp: "وقت",
      colIntern: "انٹرن",
      colQuery: "تلاش کا سوال",
      colTarget: "ٹارگट",
      colStatus: "حیثیت"
    },
    mr: {
      pageTitle: "इंटर्न व्यवस्थापन आणि ऑडिट",
      pageSub: "स्तर ४ · कनिष्ठ वकीलांची नियुक्ती आणि ऑडिट लॉग",
      delegateTitle: "संशोधन कार्य सोपवा",
      selectIntern: "इंटर्न निवडा",
      taskDesc: "कामाचे वर्णन",
      assignBtn: "कार्य सोपवा",
      registryTitle: "सक्रिय इंटर्न नोंदणी",
      auditTitle: "शोध ऑडिट लॉग",
      lastLogin: "शेवटचा लॉगिन",
      lastActive: "शेवटची सक्रियता",
      active: "सक्रिय",
      offline: "ऑफलाईन",
      tasksLabel: "कार्ये",
      queriesLabel: "प्रश्न",
      currentAssignment: "सध्याचे कार्य",
      colTimestamp: "वेळ",
      colIntern: "इंटर्न",
      colQuery: "शोध प्रश्न",
      colTarget: "लक्ष्य",
      colStatus: "स्थिती"
    },
    bn: {
      pageTitle: "ইন্টার্ন ম্যানেজমেন্ট এবং অডিট",
      pageSub: "লেয়ার ৪ · জুনিয়র অ্যাডভোকেটদের অ্যাসাইনমেন্ট এবং অডিট লগ",
      delegateTitle: "গবেষণার দায়িত্ব অর্পণ করুন",
      selectIntern: "ইন্টার্ন নির্বাচন করুন",
      taskDesc: "কাজের বিবরণ",
      assignBtn: "দায়িত্ব অর্পণ করুন",
      registryTitle: "সক্রিয় ইন্টার্ন রেজিস্ট্রি",
      auditTitle: "অনুসন্ধান অডিট লগ",
      lastLogin: "শেষ লগইন",
      lastActive: "শেষ সক্রিয়",
      active: "সক্রিয়",
      offline: "অফলাইন",
      tasksLabel: "কাজ",
      queriesLabel: "কোয়েরি",
      currentAssignment: "বর্তমান এসাইনমেন্ট",
      colTimestamp: "সময়",
      colIntern: "ইন্টার্ন",
      colQuery: "অনুসন্ধান কোয়েরি",
      colTarget: "টার্গেট",
      colStatus: "অবস্থা"
    }
  };

  const activeLang = (language && TRANSLATIONS[language as keyof typeof TRANSLATIONS]) ? language : "en";
  const t = TRANSLATIONS[activeLang as keyof typeof TRANSLATIONS];

  const [interns, setInterns] = useState<InternInfo[]>([
    {
      id: "int1",
      name: "Rohan Kumar",
      tasksCount: 2,
      searchCount: 45,
      lastActive: "10 mins ago",
      currentTask: "Verify Zenith E-Way bills invoices",
      loginTime: "09:30 AM",
      isActive: true
    },
    {
      id: "int2",
      name: "Sameer Malhotra",
      tasksCount: 0,
      searchCount: 28,
      lastActive: "2 hours ago",
      currentTask: "None",
      loginTime: "08:15 AM",
      isActive: false
    }
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    {
      id: "a1",
      timestamp: "2026-06-30 17:40:11",
      internName: "Rohan Kumar",
      query: "GST Input Tax Credit mismatch Zenith Tech",
      corpus: "Private + Public",
      status: "Passed"
    },
    {
      id: "a2",
      timestamp: "2026-06-30 15:35:10",
      internName: "Rohan Kumar",
      query: "Apex Retailers internal billing hours",
      corpus: "Private Files",
      status: "Blocked (Confidential)"
    },
    {
      id: "a3",
      timestamp: "2026-06-30 11:20:00",
      internName: "Sameer Malhotra",
      query: "Diya Agencies Kerala HC ITC mismatch",
      corpus: "Public Corpus",
      status: "Passed"
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedInternId, setSelectedInternId] = useState("int1");
  const [showStatus, setShowStatus] = useState<string | null>(null);

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setInterns((prev) =>
      prev.map((i) => {
        if (i.id === selectedInternId) {
          return {
            ...i,
            tasksCount: i.tasksCount + 1,
            currentTask: newTaskTitle
          };
        }
        return i;
      })
    );

    const name = interns.find(i => i.id === selectedInternId)?.name || "Intern";
    setShowStatus(`Task assigned to ${name}`);
    setTimeout(() => setShowStatus(null), 3000);
    setNewTaskTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-left">
        <h1 className="text-2xl font-bold text-[#f0e8d0] uppercase tracking-wider font-serif">
          {t.pageTitle}
        </h1>
        <p className="text-[#c2b69a] text-xs font-mono uppercase tracking-wide">
          {t.pageSub}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Task Delegation Form (4 columns) */}
        <div className="lg:col-span-4 bg-[#221c0e]/40 border border-[#c9a84c]/20 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold font-mono text-[#c9a84c] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#c9a84c]/10 pb-3">
            <ClipboardList size={14} />
            {t.delegateTitle}
          </h3>

          <form onSubmit={handleAssignTask} className="space-y-3 font-mono text-xs text-left">
            <div className="space-y-1">
              <label className="text-[#c2b69a] font-bold block">{t.selectIntern}</label>
              <select
                value={selectedInternId}
                onChange={(e) => setSelectedInternId(e.target.value)}
                className="w-full p-2.5 bg-[#130f06] border border-[#c9a84c]/20 rounded focus:outline-none text-[#f0e8d0] cursor-pointer"
              >
                {interns.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[#c2b69a] font-bold block">{t.taskDesc}</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Verify Supreme Court precedents..."
                className="w-full p-2.5 bg-[#130f06] border border-[#c9a84c]/20 rounded focus:outline-none text-[#f0e8d0] placeholder:text-[#9a8c6a]/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#c9a84c] text-[#1a1408] font-bold uppercase rounded hover:bg-[#c9a84c]/95 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono text-xs"
            >
              <Plus size={14} /> {t.assignBtn}
            </button>
          </form>

          {showStatus && (
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded text-xs text-emerald-400 font-mono text-center animate-fadeIn">
              {showStatus}
            </div>
          )}
        </div>

        {/* Right: Intern List & Audit Trails (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Intern directory */}
          <div className="bg-[#221c0e]/30 border border-[#c9a84c]/15 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold font-mono text-[#c9a84c] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#c9a84c]/10 pb-3">
              <User size={14} />
              {t.registryTitle}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {interns.map((i) => (
                <div key={i.id} className="p-4 bg-[#221c0e]/40 border border-[#c9a84c]/10 hover:border-[#c9a84c]/30 rounded-lg space-y-3.5 text-xs font-mono text-left">
                  <div className="flex justify-between items-start font-bold text-[#f0e8d0]">
                    <span className="text-sm">{i.name}</span>
                    {i.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/20 font-bold uppercase select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {t.active}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded bg-[#1c160a] text-[#c2b69a]/40 border border-[#c9a84c]/10 font-bold uppercase select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]/20"></span>
                        {t.offline}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-[#c9a84c]/70 bg-[#130f06]/40 p-2 rounded border border-[#c9a84c]/5">
                    <div>{t.tasksLabel}: <span className="text-[#f0e8d0] font-bold">{i.tasksCount}</span></div>
                    <div>{t.queriesLabel}: <span className="text-[#f0e8d0] font-bold">{i.searchCount}</span></div>
                  </div>

                  <div className="text-[10px] text-[#c2b69a]/70 space-y-1">
                    <div className="flex justify-between">
                      <span>{t.lastLogin}:</span>
                      <span className="text-[#f0e8d0] font-semibold">{i.loginTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.lastActive}:</span>
                      <span className="text-[#f0e8d0]">{i.lastActive}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#c2b69a]/70 border-t border-[#c9a84c]/10 pt-2 mt-1">
                    {t.currentAssignment}: <span className="text-[#f0e8d0] italic font-sans">&ldquo;{i.currentTask}&rdquo;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit trail */}
          <div className="bg-[#221c0e]/30 border border-[#c9a84c]/15 rounded-xl p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold font-mono text-[#c9a84c] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#c9a84c]/10 pb-3">
              <ShieldAlert size={14} />
              {t.auditTitle}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[#c9a84c] uppercase opacity-85">
                  <tr className="border-b border-[#c9a84c]/10">
                    <th className="pb-2 pr-6">{t.colTimestamp}</th>
                    <th className="pb-2 pr-6">{t.colIntern}</th>
                    <th className="pb-2 pr-6">{t.colQuery}</th>
                    <th className="pb-2 pr-6">{t.colTarget}</th>
                    <th className="pb-2 text-center">{t.colStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c9a84c]/5">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#221c0e]/20 transition-colors">
                      <td className="py-2.5 pr-6 text-[#c2b69a]/50">
                        <div className="flex items-center gap-1.5">
                          <Clock size={11} />
                          <span>{log.timestamp.split(" ")[1]}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-6 text-[#f0e8d0]">{log.internName}</td>
                      <td className="py-2.5 pr-6 text-[#f0e8d0] italic max-w-xs truncate">&ldquo;{log.query}&rdquo;</td>
                      <td className="py-2.5 pr-6 text-[#c2b69a]/50">{log.corpus}</td>
                      <td className="py-2.5">
                        <span className={`flex justify-center items-center gap-1 mx-auto text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase w-fit ${
                          log.status === "Passed"
                            ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20"
                            : "bg-red-950/20 text-red-400 border-red-500/20 animate-pulse"
                        }`}>
                          {log.status === "Passed" ? <CheckCircle size={9} /> : <ShieldAlert size={9} />}
                          {log.status.split(" ")[0]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
