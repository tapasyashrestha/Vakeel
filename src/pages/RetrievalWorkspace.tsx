import { useState, useEffect } from "react";
import type { UserRole } from "../components/RoleSimulator";
import { ALL_CHUNKS } from "../data/mockData";
import type { TextChunk } from "../data/mockData";
import { Search, Brain, FileText, AlertTriangle, GitFork, History } from "lucide-react";

interface RetrievalWorkspaceProps {
  currentRole: UserRole;
  isDraftDestination: boolean;
  routerConfidence: "High" | "Low";
  strictSynthesis: boolean;
  language?: string;
}

export function RetrievalWorkspace({
  currentRole,
  isDraftDestination,
  routerConfidence,
  strictSynthesis,
  language = "en",
}: RetrievalWorkspaceProps) {
  const [queryText, setQueryText] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [sourcePublic, setSourcePublic] = useState(true);
  const [sourcePrivate, setSourcePrivate] = useState(true);

  const TRANSLATIONS = {
    en: {
      workspaceTitle: "Legal Intelligence Engine",
      workspaceSub: "Multi-Agent RAG search across Public & Private Corpus.",
      search: "Search",
      history: "History",
      sourcesLabel: "Sources:",
      publicCorpusPill: "Public Corpus (Supreme Court)",
      privateCorpusPill: "Private Chamber Docs",
      advancedFilters: "Advanced Filters",
      startSessionTitle: "Start a Research Session",
      startSessionDesc: "Vakeel searches thousands of verified judgments and your private chamber knowledge base to synthesize accurate answers.",
      connected: "IKANOON SOURCE CONNECTED",
      routerTitle: "Router & Planner Agent",
      routerClass: "Routing Classification",
      confidence: "Confidence",
      publicCorpus: "PUBLIC CORPUS",
      publicCorpusDesc: "Indian Kanoon / Case Law",
      privateCorpus: "PRIVATE CORPUS",
      privateCorpusDesc: "Chamber Documents",
      bothCorpora: "BOTH CORPORA",
      bothCorporaDesc: "Default Fallback",
      retrievalTitle: "Vector Retrieval Results",
      topChunks: "Top-{count} Chunks",
      securityEnforced: "SECURITY ENFORCED:",
      confidentialFiltered: "confidential files marked as is_private: true filtered pre-ranking for current Intern role.",
      noMatchingChunks: "No matching chunks found. Try another query or toggle role settings.",
      poweredByKanoon: "powered by IKanoon",
      verifyPass: "Verify: Pass",
      verifyFailed: "Verify: Failed",
      pendingVerify: "Pending Verify",
      publicCorpusBadge: "Public Corpus",
      chamberFileBadge: "Chamber File",
      synthesisTitle: "Synthesis Agent",
      strictSynthesisMode: "Strict Synthesis Mode Enforced (No Hallucinations)",
      destinationContext: "Destination Context",
      filedDraft: "Filed Draft (Verify On)",
      draftEditor: "Draft Editor (Verify Off)",
      verificationTitle: "Verification Gate",
      verifyingCitations: "Verifying citations against source document text...",
      citationVerifySummary: "Citation Verification Summary",
      passedCount: "Passed",
      failedCount: "Failed",
      verifyPassDesc: "All citations verified. Safe to submit file.",
      verifyFailDesc: "Citation verification failed! The drafted text contains arguments not supported by the retrieved case chunk. Please revise draft.",
      provenanceTitle: "Provenance Chain Audit",
      provenanceStep: "Step {step}",
      provenanceLog: "Provenance Log",
    },
    hi: {
      workspaceTitle: "लीगल इंटेलिजेंस इंजन",
      workspaceSub: "सार्वजनिक और निजी कॉर्पस में मल्टी-एजेंट आरएजी खोज।",
      search: "खोजें",
      history: "इतिहास",
      sourcesLabel: "स्रोत:",
      publicCorpusPill: "सार्वजनिक संग्रह (सुप्रीम कोर्ट)",
      privateCorpusPill: "निजी चैंबर दस्तावेज़",
      advancedFilters: "उन्नत फ़िल्टर",
      startSessionTitle: "एक शोध सत्र शुरू करें",
      startSessionDesc: "वकील सटीक उत्तरों को संश्लेषित करने के लिए हजारों सत्यापित निर्णयों और आपके निजी चैंबर ज्ञान आधार को खोजता है।",
      connected: "कानून स्रोत जुड़ा हुआ है",
      routerTitle: "राउटर और प्लानर एजेंट",
      routerClass: "रूटिंग वर्गीकरण",
      confidence: "विश्वास स्तर",
      publicCorpus: "सार्वजनिक संग्रह",
      publicCorpusDesc: "भारतीय कानून / केस लॉ",
      privateCorpus: "निजी संग्रह",
      privateCorpusDesc: "चैंबर दस्तावेज़",
      bothCorpora: "दोनों संग्रह",
      bothCorporaDesc: "डिफ़ॉल्ट फ़ॉलबैक",
      retrievalTitle: "वेक्टर पुनर्प्राप्ति परिणाम",
      topChunks: "शीर्ष-{count} अंश",
      securityEnforced: "सुरक्षा लागू:",
      confidentialFiltered: "गोपनीय फाइलें जिन्हें is_private: true के रूप में चिह्नित किया गया है, उन्हें वर्तमान इंटर्न भूमिका के लिए प्री-रैंकिंग फ़िल्टर किया गया है।",
      noMatchingChunks: "कोई मिलान अंश नहीं मिला। दूसरा प्रश्न आज़माएं या भूमिका सेटिंग्स बदलें।",
      poweredByKanoon: "इंडियन कानून द्वारा संचालित",
      verifyPass: "सत्यापित: पास",
      verifyFailed: "सत्यापित: विफल",
      pendingVerify: "सत्यापन लंबित",
      publicCorpusBadge: "सार्वजनिक संग्रह",
      chamberFileBadge: "चैंबर फ़ाइल",
      synthesisTitle: "संश्लेषण एजेंट",
      strictSynthesisMode: "सख्त संश्लेषण मोड लागू (कोई भ्रम नहीं)",
      destinationContext: "गंतव्य संदर्भ",
      filedDraft: "दाखिल मसौदा (सत्यापन चालू)",
      draftEditor: "मसौदा संपादक (सत्यापन बंद)",
      verificationTitle: "सत्यापन गेट",
      verifyingCitations: "स्रोत दस्तावेज़ पाठ के विरुद्ध उद्धरणों का सत्यापन किया जा रहा है...",
      citationVerifySummary: "उद्धरण सत्यापन सारांश",
      passedCount: "उत्तीर्ण",
      failedCount: "विफल",
      verifyPassDesc: "सभी उद्धरण सत्यापित। फ़ाइल जमा करना सुरक्षित है।",
      verifyFailDesc: "उद्धरण सत्यापन विफल! तैयार किए गए पाठ में ऐसे तर्क शामिल हैं जो पुनर्प्राप्त केस अंश द्वारा समर्थित नहीं हैं। कृपया मसौदे में संशोधन करें।",
      provenanceTitle: "उत्पत्ति श्रृंखला ऑडिट",
      provenanceStep: "चरण {step}",
      provenanceLog: "उत्पत्ति लॉग",
    },
    ur: {
      workspaceTitle: "قانونی ذہانت کا انجن",
      workspaceSub: "عوامی اور نجی کارپس میں ملٹی ایجنٹ آر اے جی تلاش۔",
      search: "تلاش کریں",
      history: "تاریخ",
      sourcesLabel: "مصادر:",
      publicCorpusPill: "عوامی کارپس (سپریم کورٹ)",
      privateCorpusPill: "نجی چیمبر دستاویزات",
      advancedFilters: "جدید فلٹرز",
      startSessionTitle: "تحقیقی سیشن شروع کریں",
      startSessionDesc: "وکیل درست جوابات کی تیاری کے لیے ہزاروں تصدیق شدہ فیصلوں اور آپ کے نجی چیمبر کی معلومات کے ماخذ کو تلاش کرتا ہے۔",
      connected: "آئی قانون ماخذ منسلک ہے",
      routerTitle: "راؤٹر اور پلانر ایجنٹ",
      routerClass: "روٹنگ درجہ بندی",
      confidence: "اعتماد",
      publicCorpus: "عوامی کارپس",
      publicCorpusDesc: "ہندوستانی قانون / عدالتی فیصلے",
      privateCorpus: "نجی کارپس",
      privateCorpusDesc: "چیمبر کی دستاویزات",
      bothCorpora: "دونوں کارپس",
      bothCorporaDesc: "پہلے سے طے شدہ ماخذ",
      retrievalTitle: "ویکٹر بازیافت کے نتائج",
      topChunks: "بہترین {count} اقتباسات",
      securityEnforced: "سیکیورٹی لاگو:",
      confidentialFiltered: "خفیہ فائلیں جن پر is_private: true کا نشان لگا ہوا ہے، انہیں انٹرن کے عہدے کے لیے فلٹر کیا گیا ہے۔",
      noMatchingChunks: "کوئی مماثل اقتباس نہیں ملا۔ کوئی اور سوال پوچھیں یا کردار تبدیل کریں۔",
      poweredByKanoon: "انڈین قانون کے تعاون سے",
      verifyPass: "تصدیق: پاس",
      verifyFailed: "تصدیق: ناکام",
      pendingVerify: "تصدیق باقی ہے",
      publicCorpusBadge: "عوامی کارپس",
      chamberFileBadge: "چیمبر فائل",
      synthesisTitle: "ترکیبی ایجنٹ",
      strictSynthesisMode: "سخت ترکیبی موڈ لاگو (بغیر کسی بناوٹ کے)",
      destinationContext: "ہدف کا سیاق و سباق",
      filedDraft: "داخل کردہ مسودہ (تصدیق فعال)",
      draftEditor: "مسودہ ایڈیٹر (تصدیق غیر فعال)",
      verificationTitle: "تصدیقی گیٹ",
      verifyingCitations: "اصل دستاویز کے متن سے حوالہ جات کی تصدیق کی جا رہی ہے...",
      citationVerifySummary: "حوالہ جات کی تصدیق کا خلاصہ",
      passedCount: "کامیاب",
      failedCount: "ناکام",
      verifyPassDesc: "تمام حوالہ جات کی تصدیق ہو گئی ہے۔ فائل جمع کرنا محفوظ ہے۔",
      verifyFailDesc: "حوالہ جات کی تصدیق ناکام ہو گئی! تیار کردہ متن میں ایسے دلائل شامل ہیں جن کی تائید حاصل کردہ عدالتی فیصلے سے نہیں ہوتی۔ براہ کرم مسودے پر نظر ثانی کریں۔",
      provenanceTitle: "ماخذ اور عمل درآمد کا لاگ",
      provenanceStep: "مرحلہ {step}",
      provenanceLog: "ماخذ کا لاگ",
    },
    mr: {
      workspaceTitle: "कायदेशीर बुद्धिमत्ता इंजिन",
      workspaceSub: "सार्वजनिक आणि खाजगी संग्रहांमध्ये मल्टी-एजंट RAG शोध।",
      search: "शोधा",
      history: "इतिहास",
      sourcesLabel: "स्रोत:",
      publicCorpusPill: "सार्वजनिक संग्रह (सर्वोच्च न्यायालय)",
      privateCorpusPill: "खाजगी चेंबर दस्तऐवज",
      advancedFilters: "प्रगत गाळण्या",
      startSessionTitle: "संशोधन सत्र सुरू करा",
      startSessionDesc: "वकील अचूक उत्तरे शोधण्यासाठी हजारो पडताळणी केलेले निर्णय आणि तुमच्या खाजगी चेंबर माहितीचा शोध घेतो।",
      connected: "इकानून स्रोत जोडलेला आहे",
      routerTitle: "राउटर आणि प्लॅनर एजंट",
      routerClass: "राउटर वर्गीकरण",
      confidence: "विश्वासार्हता",
      publicCorpus: "सार्वजनिक संग्रह",
      publicCorpusDesc: "भारतीय कायदा / खटले",
      privateCorpus: "खाजगी संग्रह",
      privateCorpusDesc: "चेंबर दस्तऐवज",
      bothCorpora: "दोन्ही संग्रह",
      bothCorporaDesc: "डीफॉल्ट फॉलबॅक",
      retrievalTitle: "वेक्टर पुनर्प्राप्ती निकाल",
      topChunks: "शीर्ष-{count} तुकडे",
      securityEnforced: "सुरक्षा लागू:",
      confidentialFiltered: "खाजगी म्हणून चिन्हांकित (is_private: true) केलेल्या फाइल्स सद्य इंटर्न भूमिकेसाठी गाळण्यात आल्या आहेत.",
      noMatchingChunks: "एकही जुळणारा तुकडा आढळला नाही. दुसरा प्रश्न विचारा किंवा भूमिका बदला.",
      poweredByKanoon: "इकानून द्वारा संचलित",
      verifyPass: "पडताळणी: यशस्वी",
      verifyFailed: "पडताळणी: अयशस्वी",
      pendingVerify: "पडताळणी प्रलंबित",
      publicCorpusBadge: "सार्वजनिक संग्रह",
      chamberFileBadge: "चेंबर फाईल",
      synthesisTitle: "संश्लेषण एजंट",
      strictSynthesisMode: "कठोर संश्लेषण मोड लागू (कोणताही भ्रम नाही)",
      destinationContext: "गंतव्य संदर्भ",
      filedDraft: "दाखल केलेला मसुदा (पडताळणी चालू)",
      draftEditor: "मसुदा संपादक (पडताळणी बंद)",
      verificationTitle: "पडताळणी गेट",
      verifyingCitations: "मूळ दस्तऐवज मजकुराविरुद्ध उद्धरणांची पडताळणी केली जात आहे...",
      citationVerifySummary: "उद्धरण पडताळणी सारांश",
      passedCount: "यशस्वी",
      failedCount: "अयशस्वी",
      verifyPassDesc: "सर्व उद्धरणांची पडताळणी झाली आहे. फाईल सबमिशन सुरक्षित आहे.",
      verifyFailDesc: "उद्धरण पडताळणी अयशस्वी! तयार केलेल्या मजकुरामध्ये असे युक्तिवाद आहेत जे प्राप्त केलेल्या खटल्याच्या भागाद्वारे समर्थित नाहीत. कृपया मसुद्यात सुधारणा करा.",
      provenanceTitle: "उत्पत्ती साखळी ऑडिट",
      provenanceStep: "पायरी {step}",
      provenanceLog: "उत्पत्ती लॉग",
    }
  };

  const activeLang = (language && TRANSLATIONS[language as keyof typeof TRANSLATIONS]) ? language : "en";
  const t = TRANSLATIONS[activeLang as keyof typeof TRANSLATIONS];
  const [routingClass, setRoutingClass] = useState<"public" | "private" | "both">("both");
  const [routingConfidence, setRoutingConfidence] = useState(0.95);
  const [retrievedChunks, setRetrievedChunks] = useState<TextChunk[]>([]);
  const [filteredCount, setFilteredCount] = useState(0);
  const [synthesisText, setSynthesisText] = useState("");
  const [insufficientChunks, setInsufficientChunks] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<{ [key: string]: "passed" | "failed" | "unverified" }>({});
  const [provenanceChain, setProvenanceChain] = useState<any[]>([]);

  // Starting Mock queries (matching reference)
  const STARTING_SUGGESTIONS = [
    { text: "Quashing of FIR under Section 482 CrPC" },
    { text: "Arbitration clause validity in unsigned contracts" }
  ];

  const handleSearch = (overrideQueryText?: string) => {
    const q = overrideQueryText !== undefined ? overrideQueryText : queryText;
    if (!q.trim()) return;

    // Simulate Agent 1: Router & Planner
    let routing: "public" | "private" | "both" = "both";
    let confidence = routerConfidence === "Low" ? 0.45 : 0.95;

    const lowerQ = q.toLowerCase();

    if (routerConfidence === "High") {
      if (lowerQ.includes("apex") || lowerQ.includes("billing") || lowerQ.includes("matrix") || lowerQ.includes("gupta")) {
        routing = "private";
      } else if (lowerQ.includes("diya") || lowerQ.includes("refex") || lowerQ.includes("circular") || lowerQ.includes("constitution")) {
        routing = "public";
      } else {
        routing = "both";
      }
    } else {
      routing = "both";
    }

    setRoutingClass(routing);
    setRoutingConfidence(confidence);

    // Simulate Agent 2: Retrieval
    let candidates = ALL_CHUNKS.filter(chunk => {
      const textMatch = chunk.chunk_text.toLowerCase().includes(lowerQ.split(" ")[0]) ||
        chunk.metadata.title.toLowerCase().includes(lowerQ.split(" ")[0]) ||
        (chunk.metadata.case_name && chunk.metadata.case_name.toLowerCase().includes(lowerQ.split(" ")[0])) ||
        chunk.chunk_text.toLowerCase().includes("gst") && lowerQ.includes("gst");
      return textMatch;
    });

    if (candidates.length === 0 && (lowerQ.includes("gst") || lowerQ.includes("credit") || lowerQ.includes("mismatch"))) {
      candidates = ALL_CHUNKS.filter(c => c.chunk_text.toLowerCase().includes("gst") || c.chunk_text.toLowerCase().includes("itc"));
    }

    // Apply sources toggle filter
    if (sourcePublic && !sourcePrivate) {
      candidates = candidates.filter(c => c.source_corpus === "public");
    } else if (!sourcePublic && sourcePrivate) {
      candidates = candidates.filter(c => c.source_corpus === "private");
    } else if (!sourcePublic && !sourcePrivate) {
      candidates = [];
    }

    // Apply pre-ranking role visibility filter
    let filteredOut = 0;
    const finalCandidates = candidates.filter(chunk => {
      if (currentRole === "Intern" && chunk.is_private) {
        filteredOut++;
        return false;
      }
      return true;
    });

    setRetrievedChunks(finalCandidates);
    setFilteredCount(filteredOut);

    // Simulate Agent 3: Synthesis
    let answer = "";
    let isInsufficient = false;

    if (finalCandidates.length === 0 || lowerQ.includes("bail") || lowerQ.includes("criminal") || lowerQ.includes("quashing") || lowerQ.includes("arbitration")) {
      isInsufficient = true;
      answer = "INSUFFICIENT RETRIEVED CHUNKS: Vakeel cannot answer this query because no matching legal precedents or client case documents exist in the database. Hallucinations are strictly restricted.";
    } else {
      const containsPrivate = finalCandidates.some(c => c.source_corpus === "private");
      const containsPublic = finalCandidates.some(c => c.source_corpus === "public");

      if (containsPrivate && containsPublic) {
        answer = `Based on client case files and Indian precedent, Singhania & Partners recently defended a similar GST DRC-01 Input Tax Credit (ITC) mismatch case for Apex Retailers. In that matter, the supplier Zenith India Ltd. failed to upload invoices. However, we successfully argued using the Kerala HC judgment in Diya Agencies vs State Tax Officer [Diya Agencies Para 14] that the ITC cannot be denied solely due to GSTR-2A mismatch, provided the buyer can prove genuine purchase and payment [Apex Retailers S-73 Case Notes]. We reconciled Apex's ledger using the CBIC Circular 183 [Circular 183 Section 3.1] procedure.`;
      } else if (containsPrivate) {
        const titles = finalCandidates.map(c => c.metadata.title).join(", ");
        answer = `Based on internal records from ${titles}: The chamber notes indicate fixed-fee client representations (e.g. Apex Retailers billed at ₹1,50,000) where billing logs show Senior Advocate Aditya Singhania billing at ₹25,000/hr and Associate Advocate Priya Sen at ₹10,000/hr. Our defense strategy involves collecting supplier tax declarations before drafting replies to SCNs.`;
      } else {
        const hasDiya = finalCandidates.some(c => c.id === "pub_chk_1");
        const hasRefex = finalCandidates.some(c => c.id === "pub_chk_4");

        if (hasDiya) {
          answer = `Under Indian GST jurisprudence, the Kerala High Court in Diya Agencies vs State Tax Officer [Diya Agencies Para 14] established that Input Tax Credit (ITC) cannot be denied to a purchasing buyer solely due to mismatch between GSTR-3B and GSTR-2A, unless collusion or fraud is proven [Diya Agencies Para 19]. The CBIC Circular 183/15/2022-GST [Circular 183 Section 3.1] outlines CA certification procedures to resolve such discrepancies.`;
        } else if (hasRefex) {
          answer = `Regarding interest on delayed GST filings, the Madras High Court in Refex Industries Ltd [Refex Industries Para 8] ruled that interest under Section 50 of the CGST Act is payable only on the net tax liability paid through the cash ledger, rather than the gross tax liability including ITC.`;
        } else {
          answer = `Retrieved precedents indicate strict compliance guidelines for GST proceedings. Show cause notices must carry detailed computations [NKAS Services Para 30], and bank account attachments under Section 83 must meet high thresholds of emergency [Radha Krishan Para 45].`;
        }
      }
    }

    setInsufficientChunks(isInsufficient);
    setSynthesisText(answer);

    // Simulate Agent 4: Citation Verification Gate
    const initialVerify: { [key: string]: "passed" | "failed" | "unverified" } = {};
    finalCandidates.forEach(c => {
      initialVerify[c.id] = "unverified";
    });
    setVerificationResults(initialVerify);

    if (isDraftDestination && !isInsufficient) {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        const results: { [key: string]: "passed" | "failed" | "unverified" } = {};
        finalCandidates.forEach((c, idx) => {
          if (idx === 1 && c.source_corpus === "private" && strictSynthesis) {
            results[c.id] = "failed";
          } else {
            results[c.id] = "passed";
          }
        });
        setVerificationResults(results);

        const chain = finalCandidates.map(c => ({
          chunkId: c.id,
          title: c.metadata.title || c.metadata.case_name,
          retrievedBy: currentRole,
          draftDoc: "Reply_Draft_v1.docx",
          status: results[c.id] === "failed" ? "Flagged/Failed" : "Verified"
        }));
        setProvenanceChain(chain);
      }, 1500);
    } else {
      setProvenanceChain([]);
    }
  };

  useEffect(() => {
    if (hasSearched) {
      handleSearch();
    }
  }, [currentRole, isDraftDestination, routerConfidence, strictSynthesis, sourcePublic, sourcePrivate]);

  const handleSearchAction = (overrideText?: string) => {
    setHasSearched(true);
    handleSearch(overrideText);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between font-sans">
        <div>
          <h1 className="text-2xl font-bold text-[#f0e8d0] uppercase tracking-wider font-serif">
            {t.workspaceTitle}
          </h1>
          <p className="text-[#c2b69a] text-xs font-mono uppercase tracking-wide">
            {t.workspaceSub}
          </p>
        </div>
        
        {/* History Button */}
        <button
          onClick={() => alert("Search history is simulated.")}
          className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#c9a84c]/70 hover:text-[#f0e8d0] transition-colors cursor-pointer bg-[#221c0e]/30 border border-[#c9a84c]/20 hover:border-[#c9a84c] px-3.5 py-2 rounded-lg backdrop-blur-sm"
        >
          <History size={14} className="text-[#c9a84c]" />
          {t.history}
        </button>
      </div>

      {/* Unified Search Card (styled as reference) */}
      <div className="bg-[#221c0e] border border-[#c9a84c]/20 rounded-xl p-5 shadow-lg space-y-4">
        {/* Search Bar Input + Button */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c9a84c] opacity-70 w-5 h-5" />
            <input
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchAction()}
              placeholder="Describe your legal query, case facts, or required precedents..."
              className="w-full pl-12 pr-4 py-3 bg-[#130f06] border border-[#c9a84c]/25 rounded-lg text-[#f0e8d0] focus:outline-none focus:border-[#c9a84c] font-sans text-base placeholder:text-[#9a8c6a]/50 placeholder:italic"
            />
          </div>
          <button
            onClick={() => handleSearchAction()}
            className="px-8 py-3 bg-[#130f06] hover:bg-[#1a1408] border border-[#c9a84c]/30 hover:border-[#c9a84c]/65 text-[#f0e8d0] font-bold uppercase tracking-wider rounded-lg transition-all text-sm font-mono flex items-center gap-2 cursor-pointer"
          >
            {t.search}
          </button>
        </div>

        {/* Sources Selection + Advanced Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[#c2b69a] uppercase tracking-wider font-bold">{t.sourcesLabel}</span>
            
            {/* Public Corpus Pill */}
            <button
              onClick={() => setSourcePublic(!sourcePublic)}
              className={`px-4 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
                sourcePublic
                  ? "bg-[#130f06] border-[#c9a84c] text-[#c9a84c] font-bold shadow-md"
                  : "bg-transparent border-[#c9a84c]/20 text-[#c2b69a]/60 hover:border-[#c9a84c]/40"
              }`}
            >
              {t.publicCorpusPill}
            </button>

            {/* Private Chamber Docs Pill */}
            <button
              onClick={() => setSourcePrivate(!sourcePrivate)}
              className={`px-4 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
                sourcePrivate
                  ? "bg-[#130f06] border-[#c9a84c] text-[#c9a84c] font-bold shadow-md"
                  : "bg-transparent border-[#c9a84c]/20 text-[#c2b69a]/60 hover:border-[#c9a84c]/40"
              }`}
            >
              {t.privateCorpusPill}
            </button>
          </div>

          {/* Advanced Filters Button */}
          <button
            onClick={() => alert("Advanced filters dialog is simulated.")}
            className="flex items-center gap-1.5 text-[#c2b69a]/80 hover:text-[#f0e8d0] transition-colors font-mono tracking-wider text-[11px] cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-[#c9a84c]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            {t.advancedFilters}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {!hasSearched ? (
        /* Empty State: Start a Research Session */
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-[#221c0e]/10 border border-[#c9a84c]/10 rounded-xl p-8">
          <div className="w-16 h-16 rounded-full bg-[#c9a84c]/5 flex items-center justify-center text-[#c9a84c]/40 mb-2 border border-[#c9a84c]/10">
            <svg className="w-8 h-8 text-[#c9a84c]/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#f0e8d0] font-serif uppercase tracking-wide">
            {t.startSessionTitle}
          </h3>
          <p className="text-xs text-[#c2b69a]/80 max-w-lg leading-relaxed font-sans">
            {t.startSessionDesc}
          </p>
          
          {/* Quick suggestions chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 pt-6 border-t border-[#c9a84c]/10 w-full max-w-xl">
            {STARTING_SUGGESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQueryText(q.text);
                  handleSearchAction(q.text);
                }}
                className="text-xs px-4 py-2 bg-[#1c160a]/80 border border-[#c9a84c]/15 hover:border-[#c9a84c]/40 rounded-lg text-[#c2b69a] hover:text-[#f0e8d0] transition-all cursor-pointer font-sans"
              >
                &ldquo;{q.text}&rdquo;
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Search Results Workspace Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Left Side: Router, Retrieved Chunks (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Agent 1: Router Panel */}
            <div className="bg-[#221c0e] border border-[#c9a84c]/20 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#c9a84c]/15 pb-3 mb-4 font-sans">
                <h3 className="text-xs font-bold font-mono text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
                  <Brain size={14} className="text-[#c9a84c] animate-pulse" />
                  {t.routerTitle}
                </h3>
                <span className="text-[10px] font-mono bg-[#140f06] border border-[#c9a84c]/20 px-2 py-0.5 rounded text-[#c9a84c]">
                  Confidence: {(routingConfidence * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className={`p-3 rounded-lg border font-mono text-xs ${routingClass === "public"
                    ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#f3eacb]"
                    : "bg-[#221c0e] border-[#c9a84c]/10 text-[#c2b69a]"
                  }`}>
                  <div className="font-bold">{t.publicCorpus}</div>
                  <div className="text-[9px] opacity-70 mt-1">{t.publicCorpusDesc}</div>
                </div>
                <div className={`p-3 rounded-lg border font-mono text-xs ${routingClass === "private"
                    ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#f3eacb]"
                    : "bg-[#221c0e] border-[#c9a84c]/10 text-[#c2b69a]"
                  }`}>
                  <div className="font-bold">{t.privateCorpus}</div>
                  <div className="text-[9px] opacity-70 mt-1">{t.privateCorpusDesc}</div>
                </div>
                <div className={`p-3 rounded-lg border font-mono text-xs ${routingClass === "both"
                    ? "bg-[#c9a84c]/20 border-[#c9a84c] text-[#f3eacb]"
                    : "bg-[#221c0e] border-[#c9a84c]/10 text-[#c2b69a]"
                  }`}>
                  <div className="font-bold">{t.bothCorpora}</div>
                  <div className="text-[9px] opacity-70 mt-1">{t.bothCorporaDesc}</div>
                </div>
              </div>
            </div>

            {/* Agent 2: Retrieval Panel */}
            <div className="bg-[#221c0e] border border-[#c9a84c]/20 rounded-xl p-5 shadow-lg space-y-4 font-sans">
              <div className="flex items-center justify-between border-b border-[#c9a84c]/15 pb-3">
                <h3 className="text-xs font-bold font-mono text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} />
                  {t.retrievalTitle}
                </h3>
                <span className="text-[10px] font-mono text-[#c2b69a]">
                  {t.topChunks.replace("{count}", retrievedChunks.length.toString())}
                </span>
              </div>

              {/* Intern Filter Warning */}
              {filteredCount > 0 && (
                <div className="bg-[#8b2020]/15 border border-[#8b2020]/30 rounded-lg p-3 text-xs flex items-start gap-2 text-[#f0e8d0] font-mono">
                  <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-red-400 font-bold">{t.securityEnforced}</span> {filteredCount} {t.confidentialFiltered}
                  </div>
                </div>
              )}

              {retrievedChunks.length === 0 ? (
                <div className="text-center py-10 text-[#c2b69a] text-sm italic">
                  {t.noMatchingChunks}
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {retrievedChunks.map((chunk) => {
                    const status = verificationResults[chunk.id] || "unverified";
                    const translatedStatus = status === "passed" ? t.verifyPass : status === "failed" ? t.verifyFailed : t.pendingVerify;
                    return (
                      <div
                        key={chunk.id}
                        className={`p-4 rounded-lg border text-xs relative transition-all ${status === "passed"
                          ? "bg-[#062f1a] border-emerald-500/40 text-[#f3eacb]"
                          : status === "failed"
                            ? "bg-[#3f0f0f] border-red-500/40 text-[#f3eacb] animate-pulse"
                            : "bg-[#1c160a] border-[#c9a84c]/20 text-[#f3eacb]"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase ${chunk.source_corpus === "public"
                            ? "bg-[#c9a84c]/25 text-[#c9a84c] border border-[#c9a84c]/30"
                            : "bg-purple-950/40 text-purple-300 border border-purple-800/40"
                            }`}>
                            {chunk.source_corpus === "public" ? t.publicCorpusBadge : t.chamberFileBadge}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {chunk.source_corpus === "public" && (
                              <span className="text-[#c2b69a]/70">{t.poweredByKanoon}</span>
                            )}

                            {isDraftDestination && (
                              <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${status === "passed"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : status === "failed"
                                  ? "bg-red-950 text-red-400 border border-red-500/30"
                                  : "bg-[#221c0e] text-[#c2b69a] border border-[#c9a84c]/10"
                                }`}>
                                {translatedStatus}
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="font-bold text-[#f0e8d0] mb-1">
                          {chunk.source_corpus === "public"
                            ? `${chunk.metadata.case_name} (${chunk.metadata.court}, ${chunk.metadata.year}) — ${chunk.metadata.paragraph_reference}`
                            : `${chunk.metadata.title}`}
                        </h4>

                        <p className="text-[#c2b69a] leading-relaxed font-serif text-sm">
                          {chunk.chunk_text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Synthesis & Verification (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Agent 3: Synthesis Output */}
            <div className="bg-[#221c0e] border border-[#c9a84c]/20 rounded-xl p-5 shadow-lg flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between border-b border-[#c9a84c]/15 pb-3 mb-4 font-sans">
                <h3 className="text-xs font-bold font-mono text-[#c9a84c] uppercase tracking-wider flex items-center gap-2">
                  <Brain size={14} className="text-primary animate-pulse" />
                  {t.synthesisTitle}
                </h3>
                <span className={`h-2.5 w-2.5 rounded-full ${insufficientChunks ? "bg-amber-500" : "bg-emerald-500"}`} />
              </div>

              {isVerifying ? (
                <div className="flex-1 flex flex-col justify-center items-center py-10 space-y-4 text-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest animate-pulse">
                    {activeLang === "en" ? "Running Citation Verification..." : activeLang === "hi" ? "उद्धरण सत्यापन चलाया जा रहा है..." : activeLang === "ur" ? "حوالہ جاتی تصدیق چل رہی ہے..." : activeLang === "mr" ? "संदर्भ पडताळणी चालू आहे..." : "উদ্ধৃতি যাচাইকরণ চালানো হচ্ছে..."}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-4 font-sans">
                    {insufficientChunks && (
                      <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-300 font-mono flex items-start gap-2">
                        <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>{activeLang === "en" ? "WARNING:" : activeLang === "hi" ? "चेतावनी:" : activeLang === "ur" ? "انتباہ:" : activeLang === "mr" ? "इशारा:" : "সতর্কতা:"}</strong> {activeLang === "en" ? "Retrieved chunks are insufficient. System refused to generate answers to prevent hallucination (FR-1.10)." : activeLang === "hi" ? "पुनर्प्राप्त अंश अपर्याप्त हैं। मतिभ्रम को रोकने के लिए सिस्टम ने उत्तर उत्पन्न करने से इनकार कर दिया (FR-1.10)।" : activeLang === "ur" ? "حاصل کردہ اقتباسات ناکافی ہیں۔ بناوٹی جواب سے بچنے کے لیے سسٹم نے جواب تیار کرنے سے انکار کر دیا (FR-1.10)۔" : activeLang === "mr" ? "प्राप्त माहिती अपुरी आहे. चुकीची उत्तरे देणे टाळण्यासाठी प्रणालीने उत्तर देण्यास नकार दिला (FR-1.10)." : "সংগৃহীত অংশগুলি অপর্যাপ্ত। মনগড়া উত্তর দেওয়া এড়াতে সিস্টেম উত্তর তৈরি করতে অস্বীকৃতি জানিয়েছে (FR-1.10)।"}
                        </div>
                      </div>
                    )}

                    <div className="text-sm leading-relaxed font-serif text-foreground whitespace-pre-wrap">
                      {synthesisText ? (
                        synthesisText.split(/(\[[^\]]+\])/g).map((part, index) => {
                          if (part.startsWith("[") && part.endsWith("]")) {
                            const isFailed = Object.entries(verificationResults).some(
                              ([key, val]) => val === "failed" && retrievedChunks.find(c => c.id === key)?.metadata.title?.includes(part.slice(1, -1).split(" ")[0])
                            );
                            return (
                              <span
                                key={index}
                                className={`px-1 py-0.5 rounded text-xs font-mono font-bold select-all ${isFailed
                                    ? "bg-red-950 text-red-400 border border-red-500/30"
                                    : isDraftDestination
                                      ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                      : "bg-primary/10 text-primary border border-primary/20"
                                  }`}
                              >
                                {part}
                              </span>
                            );
                          }
                          return part;
                        })
                      ) : (
                        <span className="text-muted-foreground italic">{activeLang === "en" ? "Input a query and search to synthesize an answer." : activeLang === "hi" ? "उत्तर संश्लेषित करने के लिए एक प्रश्न इनपुट करें और खोजें।" : activeLang === "ur" ? "جواب حاصل کرنے کے لیے سوال درج کریں اور تلاش کریں۔" : activeLang === "mr" ? "उत्तर मिळवण्यासाठी प्रश्न टाका आणि शोधा." : "উত্তর সংশ্লেষণ করতে একটি কোয়েরি লিখুন এবং অনুসন্ধান করুন।"}</span>
                      )}
                    </div>
                  </div>

                  {synthesisText && !insufficientChunks && (
                    <div className="border-t border-primary/10 pt-4 mt-6">
                      <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wide mb-2">
                        PROVENANCE METADATA INCLUDED:
                      </p>
                      <div className="text-[10px] font-mono text-primary/70 bg-secondary/50 p-2.5 rounded border border-primary/5 leading-relaxed">
                        {"{"}
                        <br />
                        &nbsp;&nbsp;origin_role: &ldquo;{currentRole}&rdquo;,
                        <br />
                        &nbsp;&nbsp;verified_gate: &ldquo;{isDraftDestination ? "true" : "false"}&rdquo;,
                        <br />
                        &nbsp;&nbsp;linked_chunks: [{retrievedChunks.map(c => `"${c.id}"`).join(", ")}]
                        <br />
                        {"}"}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Agent 4: Provenance Chain Visualizer */}
            {provenanceChain.length > 0 && (
              <div className="bg-card border border-primary/15 rounded-xl p-5 shadow-lg space-y-4 font-sans">
                <h3 className="text-xs font-bold font-mono text-primary uppercase tracking-wider flex items-center gap-2 font-serif">
                  <GitFork size={14} />
                  {t.provenanceTitle}
                </h3>

                <div className="space-y-3">
                  {provenanceChain.map((chain, index) => (
                    <div key={index} className="p-3 bg-secondary/30 rounded border border-primary/5 text-xs font-mono">
                      <div className="flex items-center gap-2 text-foreground font-bold mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {chain.title}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground leading-relaxed pl-3 border-l border-primary/15">
                        <div>
                          <span className="text-primary/70">{activeLang === "en" ? "Retrieved By:" : activeLang === "hi" ? "पुनर्प्राप्तकर्ता:" : activeLang === "ur" ? "حاصل کنندہ:" : activeLang === "mr" ? "पुनर्प्राप्तकर्ता:" : "পুনরুদ্ধারকারী:"}</span> {chain.retrievedBy}
                        </div>
                        <div>
                          <span className="text-primary/70">{activeLang === "en" ? "Target Draft:" : activeLang === "hi" ? "लक्ष्य मसौदा:" : activeLang === "ur" ? "مسودہ فائل:" : activeLang === "mr" ? "लक्ष्य मसुदा:" : "টার্গেট খসড়া:"}</span> {chain.draftDoc}
                        </div>
                        <div className="col-span-2">
                          <span className="text-primary/70">{activeLang === "en" ? "Verification Status:" : activeLang === "hi" ? "सत्यापन स्थिति:" : activeLang === "ur" ? "تصدیقی حالت:" : activeLang === "mr" ? "पडताळणी स्थिती:" : "যাচাইকরণের অবস্থা:"}</span>{" "}
                          <span className={chain.status === "Verified" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                            {chain.status === "Verified" ? (activeLang === "en" ? "Verified" : activeLang === "hi" ? "सत्यापित" : activeLang === "ur" ? "تصدیق شدہ" : activeLang === "mr" ? "पडताळणी पूर्ण" : "যাচাইকৃত") : (activeLang === "en" ? "Flagged/Failed" : activeLang === "hi" ? "ध्वजांकित/विफल" : activeLang === "ur" ? "نشان زد/ناکام" : activeLang === "mr" ? "अयशस्वी/चिन्हांकित" : "চিহ্নিত/ব্যর্থ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
