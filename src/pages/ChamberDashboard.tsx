import { useState } from "react";
import { Briefcase, Calendar, Clock, FileText, Search, User, ChevronRight, Plus, Upload, Activity } from "lucide-react";

export function ChamberDashboard({ currentRole = "Senior", language = "en" }: { currentRole?: string; language?: string }) {
  const [searchQuery, setSearchQuery] = useState("");

  const MOCK_HEARINGS = [
    {
      id: "h1",
      caseNo: "WP(C) No. 29769/2026",
      title: "Apex Retailers vs State Tax Officer",
      court: "Kerala High Court",
      date: "2026-07-02",
      time: "10:30 AM",
      itemNo: "24",
      bench: "Justice K. Harilal"
    },
    {
      id: "h2",
      caseNo: "WA No. 841/2026",
      title: "Refex Industries vs Union of India",
      court: "Madras High Court",
      date: "2026-07-05",
      time: "11:45 AM",
      itemNo: "12",
      bench: "Chief Justice S.V. Gangapurwala"
    },
    {
      id: "h3",
      caseNo: "WP(C) No. 1105/2026",
      title: "Zenith Tech vs Assistant Commissioner",
      court: "Delhi High Court",
      date: "2026-07-12",
      time: "02:15 PM",
      itemNo: "38",
      bench: "Justice Yashwant Varma"
    }
  ];

  const MOCK_ACTIVITIES = [
    {
      id: "a1",
      user: "Advocate Aditya Singhania",
      role: "Senior Partner",
      action: "Approved filed draft reply",
      details: "Apex Retailers GST SCN DRC-01 reply (Sec 73)",
      timestamp: "10 mins ago"
    },
    {
      id: "a2",
      user: "Advocate Priya Sen",
      role: "Associate",
      action: "Queried RAG Database",
      details: "Search: 'Diya Agencies vs STO Kerala HC'",
      timestamp: "1 hour ago"
    },
    {
      id: "a3",
      user: "Rohan Kumar",
      role: "Intern",
      action: "Uploaded Notice Document",
      details: "Matrix_Logistics_SCN_74.pdf successfully ingested",
      timestamp: "3 hours ago"
    },
    {
      id: "a4",
      user: "Advocate Priya Sen",
      role: "Associate",
      action: "Created Appeal Draft",
      details: "Radha Krishan Industries SC Writ Appeal",
      timestamp: "5 hours ago"
    }
  ];

  const TRANSLATIONS = {
    en: {
      activeCases: "Active Cases",
      upcomingHearings: "Upcoming Hearings",
      pendingDeadlines: "Pending Deadlines",
      draftsInReview: "Drafts in Review",
      createDraft: "Create Draft",
      uploadDocument: "Upload Document",
      askAi: "Ask AI",
      legalIntelTitle: "Vakeel Legal Intelligence",
      legalIntelSub: "Ask a question, search cases, or prompt for a draft. Vakeel will search through public records and your private chamber knowledge.",
      placeholder: "E.g., What are the latest precedents on anticipatory bail in 498A?",
      viewAll: "View All",
      viewLog: "View Log",
      recentActivity: "Recent Activity",
      hearings: {
        Senior: "Good Morning, Advocate Sharma",
        Associate: "Good Morning, Advocate Priya Sen",
        Intern: "Good Morning, Rohan Kumar",
      },
      subtexts: {
        Senior: "Here is your chamber overview for today.",
        Associate: "Here is your associate desk overview for today.",
        Intern: "Here is your intern workspace overview for today.",
      }
    },
    hi: {
      activeCases: "सक्रिय मामले",
      upcomingHearings: "आगामी सुनवाई",
      pendingDeadlines: "लंबित समय सीमा",
      draftsInReview: "समीक्षाधीन मसौदे",
      createDraft: "मसौदा तैयार करें",
      uploadDocument: "दस्तावेज़ अपलोड करें",
      askAi: "एआई से पूछें",
      legalIntelTitle: "वकील कानूनी बुद्धिमत्ता",
      legalIntelSub: "कोई प्रश्न पूछें, मामले खोजें, या मसौदे के लिए संकेत दें। वकील सार्वजनिक रिकॉर्ड और आपके निजी चैंबर ज्ञान के माध्यम से खोज करेगा।",
      placeholder: "जैसे, 498A में अग्रिम जमानत पर नवीनतम मिसालें क्या हैं?",
      viewAll: "सभी देखें",
      viewLog: "लॉग देखें",
      recentActivity: "हाल की गतिविधि",
      hearings: {
        Senior: "सुप्रभात, अधिवक्ता शर्मा",
        Associate: "सुप्रभात, अधिवक्ता प्रिया सेन",
        Intern: "सुप्रभात, रोहन कुमार",
      },
      subtexts: {
        Senior: "यहाँ आज के लिए आपके चैंबर का विवरण है।",
        Associate: "यहाँ आज के लिए आपके सहयोगी डेस्क का विवरण है।",
        Intern: "यहाँ आज के लिए आपके इंटर्न कार्यक्षेत्र का विवरण है।",
      }
    },
    ur: {
      activeCases: "فعال مقدمات",
      upcomingHearings: "آنے والی سماعتیں",
      pendingDeadlines: "زیر التواء آخری تاریخیں",
      draftsInReview: "زیرِ جائزہ مسودات",
      createDraft: "مسودہ بنائیں",
      uploadDocument: "دستاویز اپ لوڈ کریں",
      askAi: "آرٹیفیشل انٹیلیجنس سے پوچھیں",
      legalIntelTitle: "وکیل قانونی ذہانت",
      legalIntelSub: "ایک سوال پوچھیں، مقدمات تلاش کریں، یا مسودہ کا اشارہ دیں۔ وکیل عوامی ریکارڈ اور آپ کے نجی چیمبر کے علم میں تلاش کرے گا۔",
      placeholder: "جیسے، 498A میں پیشگی ضمانت پر تازہ ترین نظیریں کیا ہیں؟",
      viewAll: "سب دیکھیں",
      viewLog: "لاگ دیکھیں",
      recentActivity: "حالیہ سرگرمی",
      hearings: {
        Senior: "صبح بخیر، ایڈووکیٹ شرما",
        Associate: "صبح بخیر، ایڈووکیٹ پریا سین",
        Intern: "صبح بخیر، روہن کمار",
      },
      subtexts: {
        Senior: "یہاں آج کے لیے آپ کے چیمبر کا جائزہ ہے۔",
        Associate: "یہاں آج کے لیے آپ के एसोसिएट डेस्क का جائزہ ہے۔",
        Intern: "یہاں آج کے لیے آپ के इंटरन वर्कस्पेस का جائزہ ہے۔",
      }
    },
    mr: {
      activeCases: "सक्रिय खटले",
      upcomingHearings: "आगामी सुनावणी",
      pendingDeadlines: "प्रलंबित मुदत",
      draftsInReview: "पुनरावलोकनातील मसुदे",
      createDraft: "मसुदा तयार करा",
      uploadDocument: "दस्तऐवज अपलोड करा",
      askAi: "एआई ला विचारा",
      legalIntelTitle: "वकील कायदेशीर बुद्धिमत्ता",
      legalIntelSub: "प्रश्न विचारा, खटले शोधा किंवा मसुद्यासाठी सांगा. वकील सार्वजनिक नोंदी आणि तुमच्या खाजगी चेंबरच्या ज्ञानाचा शोध घेईल.",
      placeholder: "उदा., 498A मधील अटकपूर्व जामिनावरील नवीनतम कायदेशीर निकाल काय आहेत?",
      viewAll: "सर्व पहा",
      viewLog: "लॉग पहा",
      recentActivity: "अलीकडील क्रियाकलाप",
      hearings: {
        Senior: "शुभ सकाळ, अधिवक्ता शर्मा",
        Associate: "शुभ सकाळ, अधिवक्ता प्रिया सेन",
        Intern: "शुभ सकाळ, रोहन कुमार",
      },
      subtexts: {
        Senior: "येथे आजच्या दिवसासाठी आपल्या चेंबरचे विहंगावलोकन आहे.",
        Associate: "येथे आजच्या दिवसासाठी आपल्या सहयोगी डेस्कचे विहंगावलोकन आहे.",
        Intern: "येथे आजच्या दिवसासाठी आपल्या इंटर्न कार्यक्षेत्राचे विहंगावलोकन आहे.",
      }
    },
    bn: {
      activeCases: "সক্রিয় মামলা",
      upcomingHearings: "আসন্ন শুনানি",
      pendingDeadlines: "মুলতুবি সময়সীমা",
      draftsInReview: "পর্যালোচনায় খসড়া",
      createDraft: "খসড়া তৈরি করুন",
      uploadDocument: "নথি আপলোড করুন",
      askAi: "এআই কে জিজ্ঞাসা করুন",
      legalIntelTitle: "উকিল আইনি বুদ্ধিমত্তা",
      legalIntelSub: "একটি প্রশ্ন জিজ্ঞাসা করুন, মামলা খুঁজুন, বা একটি খসড়া অনুরোধ করুন। উকিল পাবলিক রেকর্ড এবং আপনার ব্যক্তিগত চেম্বারের তথ্য থেকে আলোচনা করবে।",
      placeholder: "যেমন, ৪৯৮এ-তে আগাম জামিনের সর্বশেষ নজিরগুলো কী কী?",
      viewAll: "সব দেখুন",
      viewLog: "লগ দেখুন",
      recentActivity: "সাম্প্রতিক কার্যক্রম",
      hearings: {
        Senior: "শুভ সকাল, অ্যাডভোকেট শর্মা",
        Associate: "শুভ সকাল, অ্যাডভোকেট প্রিয়া সেন",
        Intern: "শুভ সকাল, রোহন কুমার",
      },
      subtexts: {
        Senior: "এখানে আজকে আপনার চেম্বারের সংক্ষিপ্ত বিবরণ দেওয়া হলো।",
        Associate: "এখানে আজকে আপনার সহযোগী ডেস্কের সংক্ষিপ্ত বিবরণ দেওয়া হলো।",
        Intern: "এখানে আজকে আপনার ইন্টার্ন ওয়ার্কস্পেসের সংক্ষিপ্ত বিবরণ দেওয়া হলো।",
      }
    }
  };

  const activeLang = (language && TRANSLATIONS[language as keyof typeof TRANSLATIONS]) ? language : "en";
  const t = TRANSLATIONS[activeLang as keyof typeof TRANSLATIONS];

  const welcomeGreeting = t.hearings[currentRole as keyof typeof t.hearings] || t.hearings.Senior;
  const welcomeSubtext = t.subtexts[currentRole as keyof typeof t.subtexts] || t.subtexts.Senior;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/15 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider uppercase">
            {welcomeGreeting}
          </h1>
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-wide mt-1">
            {welcomeSubtext}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="px-4 py-2 bg-secondary/80 hover:bg-secondary border border-primary/30 text-primary hover:text-foreground text-xs font-mono font-bold uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer">
            <Plus size={14} />
            {t.createDraft}
          </button>
          <button className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-mono font-bold uppercase rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md">
            <Upload size={14} />
            {t.uploadDocument}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-card border border-primary/20 rounded-xl p-5 shadow-lg flex items-center gap-4 hover:border-primary/40 transition-all duration-200">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Briefcase size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.activeCases}</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">42</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-card border border-primary/20 rounded-xl p-5 shadow-lg flex items-center gap-4 hover:border-primary/40 transition-all duration-200">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.upcomingHearings}</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">8</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card border border-primary/20 rounded-xl p-5 shadow-lg flex items-center gap-4 hover:border-primary/40 transition-all duration-200">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.pendingDeadlines}</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">3</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-card border border-primary/20 rounded-xl p-5 shadow-lg flex items-center gap-4 hover:border-primary/40 transition-all duration-200">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{t.draftsInReview}</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">12</p>
          </div>
        </div>
      </div>

      {/* Central Search Section */}
      <div className="bg-card border border-dashed border-primary/30 rounded-2xl p-8 shadow-xl text-center space-y-6 max-w-4xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mx-auto shadow-md">
          <Search size={22} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">
            {t.legalIntelTitle}
          </h2>
          <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-xl mx-auto font-sans">
            {t.legalIntelSub}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 px-4 py-3 bg-[#130f06] border border-primary/20 focus:border-primary rounded-lg text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none font-sans"
          />
          <button className="px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-lg hover:bg-primary/95 transition-all text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer shadow-md animate-pulse">
            {t.askAi}
          </button>
        </div>
      </div>

      {/* Bottom Dual Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Hearings */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-primary/10 pb-3">
            <h3 className="text-xs font-bold font-mono text-primary uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} />
              {t.upcomingHearings}
            </h3>
            <button className="text-[10px] font-mono text-primary hover:text-foreground uppercase flex items-center gap-0.5 cursor-pointer transition-colors">
              {t.viewAll}
              <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {MOCK_HEARINGS.map((hearing) => (
              <div key={hearing.id} className="p-3 bg-[#1c160a]/40 border border-primary/10 rounded-lg hover:border-primary/30 transition-all duration-200 text-xs font-mono space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-foreground">{hearing.caseNo}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 border border-primary/25 rounded text-primary font-bold">
                    {hearing.date}
                  </span>
                </div>
                <h4 className="font-serif italic text-sm text-foreground/95">{hearing.title}</h4>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-primary/5">
                  <span>{hearing.court}</span>
                  <span>Bench: {hearing.bench}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-primary/20 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-primary/10 pb-3">
            <h3 className="text-xs font-bold font-mono text-primary uppercase tracking-wider flex items-center gap-2">
              <Activity size={14} />
              {t.recentActivity}
            </h3>
            <button className="text-[10px] font-mono text-primary hover:text-foreground uppercase flex items-center gap-0.5 cursor-pointer transition-colors">
              {t.viewLog}
              <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {MOCK_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="p-3 bg-[#1c160a]/40 border border-primary/10 rounded-lg hover:border-primary/30 transition-all duration-200 text-xs font-mono space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-primary" />
                    <span className="font-bold text-foreground">{activity.user}</span>
                    <span className="text-[9px] text-muted-foreground/70">({activity.role})</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground/50 font-mono">{activity.timestamp}</span>
                </div>
                <div className="text-sm font-serif italic text-foreground border-l-2 border-primary/30 pl-3">
                  {activity.action}: {activity.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
