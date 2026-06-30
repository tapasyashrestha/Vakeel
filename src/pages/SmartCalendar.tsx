import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, ChevronRight as ChevronIcon, AlertTriangle, Trash } from "lucide-react";

interface CalendarEvent {
  id: string;
  day: number;
  type: "Hearing" | "Meeting" | "Limitation" | "Conference";
  title: string;
  subtitle: string;
  time: string;
  location: string;
}

interface ComplianceAlert {
  id: string;
  type: "Deadline" | "Approval" | "System";
  text: string;
  daysRemaining?: number;
  priority: "High" | "Medium" | "Low";
}

interface SmartCalendarProps {
  language?: string;
}

export function SmartCalendar({ language = "en" }: SmartCalendarProps) {
  const TRANSLATIONS = {
    en: {
      pageTitle: "Smart Legal Calendar",
      pageSub: "Manage hearings, filings, and schedules.",
      today: "Today",
      addEvent: "+ Add Event",
      upcomingTitle: "Upcoming Events",
      complianceTitle: "Limitation & Compliance Alerts",
      monthYear: "October 2026",
      sun: "Sun",
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      hearing: "Hearing",
      meeting: "Meeting",
      limitation: "Limitation",
      conference: "Conference",
      noEvents: "No scheduled activities for this day.",
      noAlerts: "No active compliance alerts.",
      daysLeft: "days left"
    },
    hi: {
      pageTitle: "स्मार्ट कानूनी कैलेंडर",
      pageSub: "सुनवाई, दाखिलों और कार्यक्रमों का प्रबंधन करें।",
      today: "आज",
      addEvent: "+ कार्यक्रम जोड़ें",
      upcomingTitle: "आगामी कार्यक्रम",
      complianceTitle: "समय सीमा और अनुपालन अलर्ट",
      monthYear: "अक्टूबर 2026",
      sun: "रवि",
      mon: "सोम",
      tue: "मंगल",
      wed: "बुध",
      thu: "गुरु",
      fri: "शुक्र",
      sat: "शनि",
      hearing: "सुनवाई",
      meeting: "बैठक",
      limitation: "सीमा अवधि",
      conference: "सम्मेलन",
      noEvents: "इस दिन के लिए कोई निर्धारित गतिविधि नहीं है।",
      noAlerts: "कोई सक्रिय अनुपालन अलर्ट नहीं।",
      daysLeft: "दिन शेष"
    },
    ur: {
      pageTitle: "اسمارٹ قانونی کیلنڈر",
      pageSub: "سماعتوں، فائلنگوں اور نظام الاوقات کا انتظام کریں۔",
      today: "آج",
      addEvent: "+ تقریب شامل کریں",
      upcomingTitle: "آنے والی تقاریب",
      complianceTitle: "آخری تاریخ اور تعمیل کے انتباہات",
      monthYear: "اکتوبر 2026",
      sun: "اتوار",
      mon: "پیر",
      tue: "منگل",
      wed: "بدھ",
      thu: "جمعرات",
      fri: "جمعہ",
      sat: "ہفتہ",
      hearing: "سماعت",
      meeting: "ملاقات",
      limitation: "آخری تاریخ",
      conference: "کانفرنس",
      noEvents: "اس دن کے لئے کوئی طے شدہ سرگرمی نہیں ہے۔",
      noAlerts: "کوئی فعال تعمیلی الرٹ نہیں ہے۔",
      daysLeft: "دن باقی"
    },
    mr: {
      pageTitle: "स्मार्ट कायदेशीर कॅलेंडर",
      pageSub: "सुनावणी, दाखल करणे आणि वेळापत्रक व्यवस्थापित करा.",
      today: "आज",
      addEvent: "+ कार्यक्रम जोडा",
      upcomingTitle: "आगामी कार्यक्रम",
      complianceTitle: "मुदत आणि अनुपालन अलर्ट",
      monthYear: "ऑक्टोबर २०२६",
      sun: "रवि",
      mon: "सोम",
      tue: "मंगळ",
      wed: "बुध",
      thu: "गुरु",
      fri: "शुक्र",
      sat: "शनी",
      hearing: "सुनावणी",
      meeting: "बैठक",
      limitation: "मर्यादा तारीख",
      conference: "परिषद",
      noEvents: "या दिवसासाठी कोणतेही नियोजित कार्यक्रम नाहीत.",
      noAlerts: "कोणतेही सक्रिय अनुपालन अलर्ट नाहीत.",
      daysLeft: "दिवस शिल्लक"
    },
    bn: {
      pageTitle: "স্মার্ট আইনি ক্যালেন্ডার",
      pageSub: "শুনানি, ফাইলিং এবং সময়সূচী পরিচালনা করুন।",
      today: "আজ",
      addEvent: "+ ইভেন্ট যোগ করুন",
      upcomingTitle: "আসন্ন ইভেন্ট",
      complianceTitle: "সীমা এবং কমপ্লায়েন্স অ্যালার্ট",
      monthYear: "অক্টোবর ২০২৬",
      sun: "রবি",
      mon: "সোম",
      tue: "মঙ্গল",
      wed: "বুধ",
      thu: "বৃহঃ",
      fri: "শুক্র",
      sat: "শনি",
      hearing: "শুনানি",
      meeting: "বৈঠক",
      limitation: "সীমা তারিখ",
      conference: "কনফারেন্স",
      noEvents: "এই দিনের জন্য কোনো নির্ধারিত ইভেন্ট নেই।",
      noAlerts: "কোনো সক্রিয় কমপ্লায়েন্স অ্যালার্ট নেই।",
      daysLeft: "দিন বাকি"
    }
  };

  const activeLang = (language && TRANSLATIONS[language as keyof typeof TRANSLATIONS]) ? language : "en";
  const t = TRANSLATIONS[activeLang as keyof typeof TRANSLATIONS];

  const [selectedDay, setSelectedDay] = useState<number>(24);

  // October 2026 calendar days layout
  const septemberDays = [27, 28, 29, 30];
  const octoberDays: number[] = [];
  for (let i = 1; i <= 31; i++) {
    octoberDays.push(i);
  }

  // Pre-configured Events
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "e1",
      day: 24,
      type: "Hearing",
      title: "Sharma vs State (Bail)",
      subtitle: "FIR 123/2026 U/s 420 IPC",
      time: "Today, 10:30 AM",
      location: "High Court, Court No. 4"
    },
    {
      id: "e2",
      day: 24,
      type: "Meeting",
      title: "Client Briefing: TechCorp",
      subtitle: "Discussing WP(C) 1024/2025",
      time: "Today, 4:00 PM",
      location: "Chamber"
    },
    {
      id: "e3",
      day: 15,
      type: "Hearing",
      title: "Apex Retailers GST Case",
      subtitle: "SCN DRC-01 Input Tax Credit",
      time: "11:00 AM",
      location: "Appellate Authority Office"
    },
    {
      id: "e4",
      day: 28,
      type: "Limitation",
      title: "Limitation Deadline: Matrix Reply",
      subtitle: "Due under Section 73",
      time: "05:00 PM",
      location: "Saket Courts"
    }
  ]);

  // Compliance & Limitation alerts state (Merged from NotificationCenter)
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([
    {
      id: "n1",
      type: "Deadline",
      text: "LIMITATION DEADLINE SCN: Reply to Apex Retailers SCN (Section 73) is due in 3 days (October 27).",
      daysRemaining: 3,
      priority: "High"
    },
    {
      id: "n2",
      type: "Deadline",
      text: "LIMITATION DEADLINE DGGI: Matrix Logistics reply (Section 74) is due in 8 days (November 1).",
      daysRemaining: 8,
      priority: "High"
    },
    {
      id: "n3",
      type: "Approval",
      text: "Draft reply 'Zenith_ITC_Appeal_v1.docx' approved by Senior Advocate Aditya Singhania.",
      priority: "Medium"
    },
    {
      id: "n4",
      type: "System",
      text: "System Ingestion: Scanned e-way bill log PDF processed successfully. OCR index updated.",
      priority: "Low"
    }
  ]);

  const activeDayEvents = events.filter((e) => e.day === selectedDay);

  const handleAddEvent = () => {
    const title = prompt("Enter event title:");
    if (!title) return;
    const time = prompt("Enter event time (e.g. 11:30 AM):", "11:30 AM");
    const loc = prompt("Enter location:", "Chamber");

    const newEv: CalendarEvent = {
      id: `ev-${Date.now()}`,
      day: selectedDay,
      type: "Meeting",
      title: title,
      subtitle: "Manual Calendar Entry",
      time: time || "11:30 AM",
      location: loc || "Chamber"
    };

    setEvents((prev) => [...prev, newEv]);
    alert("Event added successfully to day " + selectedDay);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Calendar Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-[#f0e8d0] uppercase tracking-wider font-serif">
            {t.pageTitle}
          </h1>
          <p className="text-[#c2b69a] text-xs font-mono uppercase tracking-wide">
            {t.pageSub}
          </p>
        </div>

        {/* Calendar Nav Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedDay(24)}
            className="px-4 py-2 bg-[#221c0e]/60 border border-[#c9a84c]/20 hover:border-[#c9a84c] text-[#f0e8d0] font-mono text-xs rounded-lg transition-colors cursor-pointer"
          >
            {t.today}
          </button>
          
          <div className="flex items-center bg-[#130f06] border border-[#c9a84c]/20 rounded-lg p-0.5">
            <button
              onClick={() => alert("Previous month")}
              className="p-1.5 hover:bg-[#c9a84c]/10 rounded text-[#c9a84c] transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-4 py-1 text-xs font-mono font-bold text-[#f0e8d0] min-w-[110px] text-center select-none">
              {t.monthYear}
            </span>
            <button
              onClick={() => alert("Next month")}
              className="p-1.5 hover:bg-[#c9a84c]/10 rounded text-[#c9a84c] transition-all cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-[#c9a84c] hover:bg-[#c9a84c]/95 text-[#1a1408] font-bold uppercase rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={13} />
            {t.addEvent}
          </button>
        </div>
      </div>

      {/* Grid: Calendar vs Sidebar Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-230px)] min-h-[500px]">
        
        {/* Left Side: Calendar Grid (8 Columns) */}
        <div className="md:col-span-8 bg-[#221c0e]/30 border border-[#c9a84c]/20 rounded-xl p-5 shadow-lg flex flex-col h-full overflow-y-auto">
          <div className="grid grid-cols-7 gap-2.5 text-center text-xs font-mono flex-1">
            
            {/* Weekdays */}
            {[t.sun, t.mon, t.tue, t.wed, t.thu, t.fri, t.sat].map((wd) => (
              <div key={wd} className="text-[#c9a84c] font-bold uppercase py-2 border-b border-[#c9a84c]/10 select-none">
                {wd}
              </div>
            ))}

            {/* September Days (Dimmed) */}
            {septemberDays.map((d) => (
              <div
                key={`sep-${d}`}
                className="aspect-square p-2 bg-transparent text-[#c2b69a]/20 border border-[#c9a84c]/5 rounded-lg flex flex-col justify-start items-start font-mono text-[10px] select-none"
              >
                <span>{d}</span>
              </div>
            ))}

            {/* October Days */}
            {octoberDays.map((day) => {
              const isSelected = selectedDay === day;
              const hasEvents = events.filter((e) => e.day === day);

              return (
                <button
                  key={`oct-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square p-2 border rounded-lg flex flex-col justify-between items-start transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-[#c9a84c]/15 border-[#c9a84c] text-[#f0e8d0] font-bold"
                      : "bg-[#221c0e]/20 border-[#c9a84c]/5 hover:border-[#c9a84c]/30 text-[#c2b69a]"
                  }`}
                >
                  {/* Day Number */}
                  <span
                    className={`text-[10px] flex items-center justify-center w-5 h-5 rounded-full font-mono select-none ${
                      isSelected
                        ? "bg-[#c9a84c] text-[#1a1408] font-bold shadow-md shadow-[#c9a84c]/20"
                        : ""
                    }`}
                  >
                    {day}
                  </span>

                  {/* Day Event Flags */}
                  <div className="w-full space-y-0.5 mt-1.5">
                    {hasEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[7px] font-bold px-1 py-0.5 rounded truncate text-left w-full select-none ${
                          ev.type === "Hearing"
                            ? "bg-red-950/70 text-red-400 border border-red-500/10"
                            : "bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/10"
                        }`}
                      >
                        {ev.type === "Hearing" ? "10:30 A..." : "2:00 PM"}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Split View for Events & Compliance Alerts (4 Columns) */}
        <div className="md:col-span-4 flex flex-col gap-6 h-full min-h-[500px]">
          
          {/* Section 1: Upcoming Events (Flexible Height) */}
          <div className="bg-[#221c0e]/40 border border-[#c9a84c]/20 rounded-xl p-5 shadow-lg flex-1 overflow-y-auto max-h-[50%] flex flex-col">
            <h3 className="text-xs font-bold font-mono text-[#c9a84c] uppercase tracking-widest border-b border-[#c9a84c]/10 pb-2 text-left mb-3">
              {t.upcomingTitle}
            </h3>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {activeDayEvents.length === 0 ? (
                <div className="text-center py-10 text-[#c2b69a]/40 text-xs italic font-serif select-none">
                  {t.noEvents}
                </div>
              ) : (
                activeDayEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => alert(`Inspecting Event: ${ev.title}`)}
                    className="w-full p-3.5 bg-[#221c0e]/50 border border-[#c9a84c]/15 hover:border-[#c9a84c]/35 rounded-xl text-left transition-all flex justify-between items-center group cursor-pointer"
                  >
                    <div className="space-y-2 text-left pr-2 flex-1">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wider ${
                          ev.type === "Hearing"
                            ? "bg-red-950 text-red-400 border border-red-500/20"
                            : "bg-[#c9a84c]/25 text-[#f0e8d0] border border-[#c9a84c]/30"
                        }`}
                      >
                        {ev.type === "Hearing" ? t.hearing : t.meeting}
                      </span>

                      <div>
                        <h4 className="text-xs font-bold text-[#f0e8d0] font-sans tracking-wide group-hover:text-[#c9a84c] transition-colors leading-snug">
                          {ev.title}
                        </h4>
                        <p className="text-[9px] text-[#c2b69a]/60 font-mono mt-0.5 truncate">
                          {ev.subtitle}
                        </p>
                      </div>

                      <div className="border-t border-[#c9a84c]/10 pt-2 space-y-1 text-[9px] text-[#c2b69a]/70 font-mono">
                        <div className="flex items-center gap-1.5">
                          <Clock size={10} className="text-[#c9a84c]" />
                          <span>{ev.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={10} className="text-[#c9a84c]" />
                          <span>{ev.location}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronIcon size={12} className="text-[#c9a84c] opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Limitation & Compliance Alerts (Flexible Height) */}
          <div className="bg-[#221c0e]/40 border border-[#c9a84c]/20 rounded-xl p-5 shadow-lg flex-1 overflow-y-auto max-h-[50%] flex flex-col">
            <h3 className="text-xs font-bold font-mono text-[#c9a84c] uppercase tracking-widest border-b border-[#c9a84c]/10 pb-2 text-left mb-3">
              {t.complianceTitle}
            </h3>

            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
              {alerts.length === 0 ? (
                <div className="text-center py-10 text-[#c2b69a]/40 text-xs italic font-serif select-none">
                  {t.noAlerts}
                </div>
              ) : (
                alerts.map((al) => (
                  <div
                    key={al.id}
                    className={`p-3 rounded-lg border text-left flex gap-2.5 items-start relative transition-all ${
                      al.type === "Deadline"
                        ? "bg-red-950/20 border-red-500/20 text-[#f0e8d0]"
                        : al.type === "Approval"
                        ? "bg-emerald-950/20 border-emerald-500/20 text-[#f0e8d0]"
                        : "bg-[#130f06]/40 border-[#c9a84c]/10 text-[#c2b69a]"
                    }`}
                  >
                    {/* Icon */}
                    <div className="mt-0.5 flex-shrink-0">
                      <AlertTriangle
                        size={13}
                        className={al.priority === "High" ? "text-red-400 animate-pulse" : "text-[#c9a84c]"}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pr-4">
                      <div className="flex justify-between items-center text-[8px] font-mono font-bold uppercase tracking-wider mb-1">
                        <span className={al.type === "Deadline" ? "text-red-400" : al.type === "Approval" ? "text-emerald-400" : "text-[#c9a84c]"}>
                          {al.type}
                        </span>
                        {al.daysRemaining !== undefined && (
                          <span className="text-red-400/80">
                            {al.daysRemaining} {t.daysLeft}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-sans leading-relaxed text-left">
                        {al.text}
                      </p>
                    </div>

                    {/* Actions: Dismiss */}
                    <button
                      onClick={() => handleDismissAlert(al.id)}
                      className="absolute right-2 top-2 p-1 hover:bg-[#130f06] border border-transparent hover:border-[#c9a84c]/20 rounded text-[#c2b69a]/40 hover:text-[#f0e8d0] transition-all cursor-pointer"
                    >
                      <Trash size={9} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
