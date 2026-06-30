import { useState, useEffect } from "react";
import { ChevronRight, BrainCircuit, Search, ShieldCheck } from "lucide-react";

const LATIN_MAXIMS = [
  { text: "Fiat justitia ruat caelum", translation: {
      en: "Let justice be done though the heavens fall",
      hi: "चाहे आसमान गिर जाए लेकिन न्याय होना चाहिए",
      ur: "چاہے آسمان گر جائے لیکن انصاف ہونا چاہیے",
      mr: "आकाश कोसळले तरी न्याय झालाच पाहिजे",
      bn: "আকাশ ভেঙে পড়লেও যেন ন্যায়বিচার প্রতিষ্ঠিত হয়"
    }
  },
  { text: "Audi alteram partem", translation: {
      en: "Hear the other side",
      hi: "दूसरी पक्ष को भी सुनें",
      ur: "دوسرے فریق کی بات بھی سنیں",
      mr: "दुसऱ्या बाजूचेही ऐकून घ्या",
      bn: "অপর পক্ষের কথাও শুনুন"
    }
  },
  { text: "Nemo judex in causa sua", translation: {
      en: "No one shall be a judge in their own cause",
      hi: "कोई भी अपने मामले में खुद न्यायाधीश नहीं हो सकता",
      ur: "کوئی بھی اپنے معاملے میں خود جج نہیں ہو سکتا",
      mr: "कोणीही स्वतःच्या खटल्यात स्वतः न्यायाधीश असू नये",
      bn: "কেউ নিজের মামলার বিচারক হতে পারবে না"
    }
  },
];

const TRANSLATIONS = {
  en: {
    engineActive: "VAKEEL Engine Active",
    heroTitle: "Where Law Meets Intelligence",
    heroDesc: "VAKEEL combines AI-powered legal research, chamber management, document intelligence, and citation verification into one secure platform built for Indian advocates.",
    accessWorkspace: "Get Started",
    ingestNotice: "Login",
    systemLayers: "SYSTEM LAYERS",
    verifiableResearch: "Verifiable Citation-Traceable Legal Research",
    verifiableResearchSub: "Unlike generic LLM systems, Vakeel focuses on provenance. Every fact is mapped back to the public record or private chamber files.",
    routerTitle: "1. Router & Planner Agent",
    routerDesc: "Automatically routes incoming questions to the Public Corpus (e.g. Indian Kanoon), Private Corpus (chamber documents), or both, based on intent confidence.",
    ragTitle: "2. Strict RAG Synthesis",
    ragDesc: "Constraints answer generation exclusively to retrieved text chunks. If the retrieved case law is insufficient to answer a query, the agent states it explicitly rather than hallucinating.",
    citationTitle: "3. Citation Verification Gate",
    citationDesc: "Before output is incorporated into a filed draft, a mechanical checker runs semantic tests to confirm every claim exactly matches the source case citation.",
    buildSequence: "Build Sequence & Functional Layers",
    steps: [
      { name: "Query Router", desc: "Monitors incoming query classification." },
      { name: "Vector Retrieval", desc: "Performs similarity search with tenant filters." },
      { name: "RAG Synthesis", desc: "Drafts replies constrained to chunks." },
      { name: "Verification Gate", desc: "Runs double-pass mechanical verification." },
      { name: "Provenance Log", desc: "Audits citation edits end-to-end." },
    ]
  },
  hi: {
    engineActive: "वकील इंजन सक्रिय",
    heroTitle: "जहाँ कानून और बुद्धिमत्ता का मिलन होता है",
    heroDesc: "वकील (VAKEEL) एआई-संचालित कानूनी अनुसंधान, चैंबर प्रबंधन, दस्तावेज़ बुद्धिमत्ता और उद्धरण सत्यापन को भारतीय अधिवक्ताओं के लिए बनाए गए एक सुरक्षित मंच में जोड़ता है।",
    accessWorkspace: "शुरू करें",
    ingestNotice: "लॉगिन",
    systemLayers: "सिस्टम परतें",
    verifiableResearch: "सत्यापन योग्य उद्धरण-ट्रैसेबल कानूनी अनुसंधान",
    verifiableResearchSub: "जेनेरिक एलएलएम प्रणालियों के विपरीत, वकील स्रोत (उत्पत्ति) पर ध्यान केंद्रित करता है। प्रत्येक तथ्य को सार्वजनिक रिकॉर्ड या निजी चैंबर फाइलों से मैप किया जाता है।",
    routerTitle: "1. राउटर और प्लानर एजेंट",
    routerDesc: "इरादे के आत्मविश्वास के आधार पर आने वाले प्रश्नों को सार्वजनिक कॉर्पस (जैसे इंडियन कानून), निजी कॉर्पस (चैंबर दस्तावेज़), या दोनों पर स्वचालित रूप से रूट करता है।",
    ragTitle: "2. सख्त आरएजी संश्लेषण",
    ragDesc: "उत्तर निर्माण को विशेष रूप से पुनर्प्राप्त पाठ अंशों तक सीमित करता है। यदि पुनर्प्राप्त केस कानून किसी प्रश्न का उत्तर देने के लिए अपर्याप्त है, तो एजेंट भ्रम पैदा करने के बजाय इसे स्पष्ट रूप से बताता है।",
    citationTitle: "3. उद्धरण सत्यापन गेट",
    citationDesc: "दस्तावेज़ में आउटपुट शामिल करने से पहले, एक मैकेनिकल चेकर यह पुष्टि करने के लिए शब्दार्थ परीक्षण चलाता है कि प्रत्येक दावा स्रोत केस उद्धरण से बिल्कुल मेल खाता है।",
    buildSequence: "बिल्ड अनुक्रम और कार्यात्मक परतें",
    steps: [
      { name: "क्वेरी राउटर", desc: "आने वाले प्रश्नों के वर्गीकरण की निगरानी करता है।" },
      { name: "वेक्टर पुनर्प्राप्ति", desc: "किरायेदार फिल्टर के साथ समानता खोज करता है।" },
      { name: "आरएजी संश्लेषण", desc: "पुनर्प्राप्त अंशों तक सीमित उत्तरों का मसौदा तैयार करता है।" },
      { name: "सत्यापन गेट", desc: "डबल-पास मैकेनिकल सत्यापन चलाता है।" },
      { name: "उत्पत्ति लॉग", desc: "उत्पत्ति ऑडिट का शुरू से अंत तक विश्लेषण करता है।" },
    ]
  },
  ur: {
    engineActive: "وکیل انجن فعال",
    heroTitle: "جہاں قانون اور ذہانت کا ملاپ ہوتا ہے",
    heroDesc: "وکیل (VAKEEL) مصنوعی ذہانت سے چلنے والی قانونی تحقیق، چیمبر مینجمنٹ، دستاویزی ذہانت، اور حوالہ جات کی تصدیق کو ہندوستانی وکلاء کے لیے تیار کردہ ایک محفوظ پلیٹ فارم میں یکجا کرتا ہے۔",
    accessWorkspace: "شروع کریں",
    ingestNotice: "لاگ ان",
    systemLayers: "سسٹم کی تہیں",
    verifiableResearch: "حوالہ جات کے ساتھ قابل تصدیق قانونی تحقیق",
    verifiableResearchSub: "عام ایل ایل ایم سسٹمز کے برعکس، وکیل معلومات کے بنیادی ماخذ پر توجہ مرکوز کرتا ہے۔ ہر حقیقت کو عوامی ریکارڈ یا نجی چیمبر کی فائلوں سے جوڑا جاتا ہے۔",
    routerTitle: "1. راؤٹر اور پلانر ایجنٹ",
    routerDesc: "سوالات کی نوعیت کے مطابق انہیں عوامی کارپس (مثلاً انڈین قانون)، نجی کارپس (چیمبر دستاویزات) یا دونوں کی طرف خودکار طور پر بھیجتا ہے۔",
    ragTitle: "2. سخت آر اے جی ترکیب",
    ragDesc: "جوابات کی تیاری کو صرف حاصل کردہ متن के टुकड़ों تک محدود رکھتا ہے۔ اگر حاصل کردہ عدالتی نظائر ناکافی ہوں تو ایجنٹ خود سے جواب بنانے کے بجائے واضح طور پر لاعلمی کا اظہار کرتا ہے۔",
    citationTitle: "3. حوالہ جات کی تصدیق کا گیٹ",
    citationDesc: "حتمی مسودے میں شامل کرنے سے پہلے، ایک مکینیکل چیکر اس بات کی تصدیق کے لیے ٹیسٹ چلاتا ہے کہ ہر دعویٰ اصل عدالتی فیصلے سے بالکل مطابقت رکھتا ہے۔",
    buildSequence: "سلسلہ وار ترتیب اور عملی تہیں",
    steps: [
      { name: "راؤٹر سوالات", desc: "آنے والے سوالات کی زمرہ بندی کی نگرانی کرتا ہے۔" },
      { name: "ویکٹر کی بازیافت", desc: "مطلوبہ فلٹرز کے साथ مماثلت کی تلاش کرتا ہے۔" },
      { name: "آر اے جی ترکیب", desc: "جوابات کا مسودہ مخصوص ٹکڑوں تک محدود رکھ کر تیار کرتا ہے۔" },
      { name: "تصدیقی گیट", desc: "دوبارہ مکینیکل تصدیق کا عمل چلاتا ہے۔" },
      { name: "ماخذ کا اندراج", desc: "حوالہ جاتی ترامیم کا شروع سے آخر تک جائزہ لیتا ہے۔" },
    ]
  },
  mr: {
    engineActive: "वकील इंजिन सक्रिय",
    heroTitle: "जिथे कायदा आणि बुद्धिमत्ता एकत्र येतात",
    heroDesc: "वकील (VAKEEL) एआय-आधारित कायदेशीर संशोधन, चेंबर व्यवस्थापन, दस्तऐवज बुद्धिमत्ता आणि संदर्भ पडताळणी एकत्र करून भारतीय वकिलांसाठी एक सुरक्षित व्यासपीठ प्रदान करते.",
    accessWorkspace: "सुरू करा",
    ingestNotice: "लॉगिन",
    systemLayers: "सिस्टम स्तर",
    verifiableResearch: "पडताळणी योग्य संदर्भ-मागोवा कायदेशीर संशोधन",
    verifiableResearchSub: "इतर एआय प्रणालींसारखे नाही, वकील मूळ स्रोतांवर लक्ष केंद्रित करतो. प्रत्येक विधान सार्वजनिक नोंदी किंवा खाजगी चेंबर फाइल्सशी जोडले जाते.",
    routerTitle: "1. राउटर आणि प्लॅनर एजंट",
    routerDesc: "आलेले प्रश्न सार्वजनिक संग्रह (उदा. इंडियन कानून), खाजगी संग्रह (चेंबर दस्तऐवज) किंवा दोन्हीकडे स्वयंचलितपणे वर्ग करतो.",
    ragTitle: "2. अचूक RAG संश्लेषण",
    ragDesc: "उत्तर निर्मिती फक्त प्राप्त माहितीच्या तुकड्यांपुरती मर्यादित ठेवतो. जर प्राप्त झालेली माहिती अपुरी असेल, तर एजंट चुकीचे उत्तर देण्यापेक्षा स्पष्टपणे तसे सांगतो.",
    citationTitle: "3. संदर्भ पडताळणी गेट",
    citationDesc: "अंतिम मसुद्यात समाविष्ट करण्यापूर्वी, प्रत्येक दावा मूळ संदर्भ खटल्याशी तंतोतंत जुळतो की नाही याची पडताळणी करतो.",
    buildSequence: "बिल्ड क्रम आणि कार्यात्मक स्तर",
    steps: [
      { name: "क्वेरी राउटर", desc: "येणाऱ्या प्रश्नांच्या वर्गीकरणावर लक्ष ठेवतो." },
      { name: "वेक्टर पुनर्प्राप्ती", desc: "फिल्टरसह साम्य शोध मोहीम राबवतो." },
      { name: "RAG संश्लेषण", desc: "प्राप्त माहितीच्या चौकटीत राहून उत्तर मसुदा तयार करतो." },
      { name: "पडताळणी गेट", desc: "दुहेरी यांत्रिक पडताळणी प्रक्रिया चालवतो." },
      { name: "मूळ नोंद वही", desc: "संदर्भ बदलांचे संपूर्ण ऑडिट करतो." },
    ]
  },
  bn: {
    engineActive: "উকিল ইঞ্জিন সক্রিয়",
    heroTitle: "যেখানে আইন ও বুদ্ধিমত্তা মিলিত হয়",
    heroDesc: "উকিল (VAKEEL) এআই-চালিত আইনি গবেষণা, চেম্বার পরিচালনা, নথি বুদ্ধিমত্তা এবং উদ্ধৃতি যাচাইকরণকে ভারতীয় আইনজীবীদের জন্য তৈরি একটি নিরাপদ প্ল্যাটফর্মে একত্রিত করে।",
    accessWorkspace: "শুরু করুন",
    ingestNotice: "লগইন",
    systemLayers: "সিস্টেম লেয়ার",
    verifiableResearch: "যাচাইযোগ্য উদ্ধৃতি-অনুসন্ধানযোগ্য আইনি গবেষণা",
    verifiableResearchSub: "সাধারণ এআই সিস্টেমের মতো নয়, উকিল তথ্যের মূল উৎসের ওপর জোর দেয়। প্রতিটি তথ্য পাবলিক রেকর্ড বা ব্যক্তিগত চেম্বারের ফাইলের সাথে মেলানো হয়।",
    routerTitle: "১. রাউটার এবং প্ল্যানার এজেন্ট",
    routerDesc: "প্রশ্নগুলির ধরণ অনুযায়ী সেগুলিকে পাবলিক কর্পাস (যেমন ইন্ডিয়ান কানুন), ব্যক্তিগত চেম্বার নথি বা উভয় দিকেই স্বয়ংক্রিয়ভাবে পাঠায়।",
    ragTitle: "২. কঠোর আরএজি সংশ্লেষণ",
    ragDesc: "উত্তর তৈরিকে শুধুমাত্র সংগৃহীত পাঠ্যের অংশের মধ্যে সীমাবদ্ধ রাখে। সংগৃহীত নথিপত্র যদি উত্তর দেওয়ার জন্য অপর্যাপ্ত হয়, তবে ভুল তথ্য দেওয়ার চেয়ে এআই তা স্পষ্টভাবে জানায়।",
    citationTitle: "৩. উদ্ধৃতি যাচাইকরণ গেট",
    citationDesc: "খসড়া প্রস্তুত করার আগে, একটি মেকানিক্যাল চেকার নিশ্চিত করে যে প্রতিটি দাবি মূল রেফারেন্স মামলার সাথে পুরোপুরি মিলে যাচ্ছে কিনা।",
    buildSequence: "বিকাশের ধাপ ও কার্যকরী লেয়ার সমূহ",
    steps: [
      { name: "কোয়েরি রাউটার", desc: "আগত প্রশ্নগুলির শ্রেণীবিভাগ পর্যবেক্ষণ করে।" },
      { name: "ভেক্টর রিট্রিভাল", desc: "ফিল্টার প্রয়োগ করে প্রাসঙ্গিক তথ্য অনুসন্ধান করে।" },
      { name: "আরএজি সংশ্লেষণ", desc: "সংগৃহীত তথ্যের ওপর ভিত্তি করে খসড়া উত্তর প্রস্তুত করে।" },
      { name: "যাচাইকরণ গেট", desc: "দ্বি-স্তরের স্বয়ংক্রিয় যাচাইকরণ প্রক্রিয়া চালায়।" },
      { name: "উৎস লগ", desc: "উদ্ধৃতির পরিবর্তনগুলি শুরু থেকে শেষ পর্যন্ত অডিট করে।" },
    ]
  }
};

interface LandingProps {
  onNavigate: (view: "landing" | "workspace" | "dashboard", authMode?: "login" | "signup") => void;
  language?: string;
}

export function Landing({ onNavigate, language = "en" }: LandingProps) {
  const [maxim, setMaxim] = useState(0);
  const [fade, setFade] = useState(true);

  const activeLang = (language && TRANSLATIONS[language as keyof typeof TRANSLATIONS]) ? language : "en";
  const t = TRANSLATIONS[activeLang as keyof typeof TRANSLATIONS];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMaxim((p) => (p + 1) % LATIN_MAXIMS.length);
        setFade(true);
      }, 350);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const maximTranslation = LATIN_MAXIMS[maxim].translation[activeLang as keyof typeof LATIN_MAXIMS[number]["translation"]];

  return (
    <div className="min-h-screen w-full bg-transparent text-foreground flex flex-col relative overflow-x-hidden">

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center pt-8 md:pt-16 pb-16 font-sans">
        {/* Subtle glow behind figures */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 50% 70% at 25% 50%, rgba(201,168,76,0.05) 0%, transparent 65%)" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Content space */}
          <div className="lg:col-span-8 flex flex-col justify-center text-left items-start">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1 text-xs text-primary mb-6 w-fit font-mono tracking-widest uppercase">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-1 animate-pulse"></span>
              {t.engineActive}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-foreground font-serif">
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#f3dfab]">
                {t.heroTitle}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              {t.heroDesc}
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <button
                onClick={() => onNavigate("dashboard", "signup")}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.18em] uppercase font-bold bg-primary text-background hover:bg-primary/90 transition-all rounded shadow-lg shadow-primary/10 font-mono animate-bounce cursor-pointer"
              >
                {t.accessWorkspace} <ChevronRight size={14} />
              </button>
              <button
                onClick={() => onNavigate("dashboard", "login")}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.18em] uppercase font-bold border border-primary/30 text-foreground hover:bg-secondary transition-all rounded font-mono cursor-pointer"
              >
                {t.ingestNotice}
              </button>
            </div>

            {/* Rotating Latin Maxims */}
            <div className="border-t border-primary/15 pt-5 max-w-xl w-full">
              <p
                className="text-sm italic text-muted-foreground transition-opacity duration-500 min-h-[40px] flex items-center gap-2"
                style={{ opacity: fade ? 1 : 0, fontFamily: "'Playfair Display', serif" }}
              >
                <span>&ldquo;{LATIN_MAXIMS[maxim].text}&rdquo;</span>
                <span className="not-italic text-xs tracking-wider opacity-60 text-primary font-mono uppercase">
                  — {maximTranslation}
                </span>
              </p>
            </div>
          </div>

          {/* Right column remains empty to reveal background watermark */}
          <div className="lg:col-span-4 hidden lg:block"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-card border-t border-b border-primary/15 py-16 md:py-24 font-sans">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3 font-mono">
              {t.systemLayers}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground font-serif">
              {t.verifiableResearch}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-3 leading-relaxed">
              {t.verifiableResearchSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-secondary/30 rounded-xl border border-primary/10 hover:border-primary/30 transition-all group">
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/5 text-primary border border-primary/20 group-hover:bg-primary/10 transition-colors">
                <BrainCircuit size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3 uppercase tracking-wider font-serif">
                {t.routerTitle}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t.routerDesc}
              </p>
            </div>

            <div className="p-8 bg-secondary/30 rounded-xl border border-primary/10 hover:border-primary/30 transition-all group">
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/5 text-primary border border-primary/20 group-hover:bg-primary/10 transition-colors">
                <Search size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3 uppercase tracking-wider font-serif">
                {t.ragTitle}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t.ragDesc}
              </p>
            </div>

            <div className="p-8 bg-secondary/30 rounded-xl border border-primary/10 hover:border-primary/30 transition-all group">
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/5 text-primary border border-primary/20 group-hover:bg-primary/10 transition-colors">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-3 uppercase tracking-wider font-serif">
                {t.citationTitle}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t.citationDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Build Sequence Strip */}
      <section className="py-16 max-w-7xl mx-auto px-6 sm:px-12 font-sans">
        <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center text-foreground tracking-wider uppercase font-serif">
          {t.buildSequence}
        </h2>
        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/10 -translate-y-1/2 hidden md:block"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {t.steps.map((s, idx) => (
              <div key={idx} className="bg-card border border-primary/10 rounded-lg p-5 flex flex-col relative z-10 hover:border-primary/35 transition-colors">
                <span className="text-2xl font-bold text-primary font-mono leading-none mb-2">0{idx + 1}</span>
                <h4 className="text-sm font-bold text-foreground tracking-wider mb-1 uppercase font-serif">{s.name}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
