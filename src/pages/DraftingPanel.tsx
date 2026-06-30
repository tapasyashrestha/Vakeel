import { useState } from "react";
import { FileText, Sparkles, Copy, Download } from "lucide-react";

interface DraftingPanelProps {
  language?: string;
}

export function DraftingPanel({ language = "en" }: DraftingPanelProps) {
  const TRANSLATIONS = {
    en: {
      pageTitle: "AI Drafting Engine",
      pageSub: "Generate court-ready legal documents.",
      docType: "Document Type",
      caseContext: "Client / Case Context",
      toneStyle: "Tone & Style",
      generateBtn: "Generate Draft",
      docPreview: "Document Preview",
      copy: "Copy",
      exportWord: "Export Word",
      emptyState: "Fill out the parameters and generate a draft.",
      generating: "Drafting court document..."
    },
    hi: {
      pageTitle: "एआई ड्राफ्टिंग इंजन",
      pageSub: "अदालत-तैयार कानूनी दस्तावेज उत्पन्न करें।",
      docType: "दस्तावेज़ प्रकार",
      caseContext: "क्लाइंट / केस संदर्भ",
      toneStyle: "टोन और शैली",
      generateBtn: "मसौदा तैयार करें",
      docPreview: "दस्तावेज़ पूर्वावलोकन",
      copy: "कॉपी करें",
      exportWord: "वर्ड में सहेजें",
      emptyState: "पैरामीटर भरें और एक मसौदा तैयार करें।",
      generating: "मसौदा तैयार किया जा रहा है..."
    },
    ur: {
      pageTitle: "اے آئی ڈرافٹنگ انجن",
      pageSub: "عدالت کے لیے تیار قانونی دستاویزات تیار کریں۔",
      docType: "دستاویز کی قسم",
      caseContext: "کلائنٹ / کیس کا سیاق و سباق",
      toneStyle: "لہجہ اور انداز",
      generateBtn: "مسودہ تیار کریں",
      docPreview: "دستاویز کا پیش نظارہ",
      copy: "کاپی کریں",
      exportWord: "ورڈ فائل ڈاؤن لوڈ کریں",
      emptyState: "پیرامیٹرز پُر کریں اور مسودہ تیار کریں۔",
      generating: "قانونی دستاویز ڈرافٹ ہو رہی ہے..."
    },
    mr: {
      pageTitle: "एआय ड्राफ्टिंग इंजिन",
      pageSub: "न्यायालयासाठी आवश्यक कायदेशीर कागदपत्रे तयार करा.",
      docType: "दस्तऐवज प्रकार",
      caseContext: "अशील / खटला संदर्भ",
      toneStyle: "टोन आणि शैली",
      generateBtn: "मसुदा तयार करा",
      docPreview: "दस्तऐवज पूर्वावलोकन",
      copy: "प्रत बनवा",
      exportWord: "वर्ड फाईल डाऊनलोड करा",
      emptyState: "पॅरामीटर्स भरा आणि मसुदा तयार करा.",
      generating: "कायदेशीर दस्तऐवज मसुदा तयार होत आहे..."
    },
    bn: {
      pageTitle: "এআই ড্রাফটিং ইঞ্জিন",
      pageSub: "আদালত-প্রস্তুত আইনি নথি তৈরি করুন।",
      docType: "নথির ধরণ",
      caseContext: "ক্লায়েন্ট / মামলার প্রসঙ্গ",
      toneStyle: "টোন ও শৈলী",
      generateBtn: "খসড়া তৈরি করুন",
      docPreview: "নথি প্রিভিউ",
      copy: "কপি করুন",
      exportWord: "ওয়ার্ড এক্সপোর্ট করুন",
      emptyState: "প্যারামিটারগুলি পূরণ করুন এবং একটি খসড়া তৈরি করুন।",
      generating: "আইনি খসড়া তৈরি হচ্ছে..."
    }
  };

  const activeLang = (language && TRANSLATIONS[language as keyof typeof TRANSLATIONS]) ? language : "en";
  const t = TRANSLATIONS[activeLang as keyof typeof TRANSLATIONS];

  const [docType, setDocType] = useState("Bail Application (Anticipatory)");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState("Standard Court Format");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState("");

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let draftText = "";

      if (docType.includes("Bail")) {
        draftText = `IN THE COURT OF THE SESSIONS JUDGE AT NEW DELHI\n` +
          `BAIL APPLICATION NO. ______ OF 2026\n\n` +
          `IN THE MATTER OF:\n` +
          `Rahul Kumar\n` +
          `S/o Sh. Ramesh Kumar\n` +
          `R/o B-45, Vasant Vihar, New Delhi ... APPLICANT\n\n` +
          `VERSUS\n` +
          `State (N.C.T. of Delhi) ... RESPONDENT\n\n` +
          `APPLICATION UNDER SECTION 438 OF THE CODE OF CRIMINAL PROCEDURE, 1973 FOR GRANT OF ANTICIPATORY BAIL IN FIR NO. 123/2026 UNDER SECTION 420/406 IPC AT P.S. VASANT VIHAR.\n\n` +
          `MOST RESPECTFULLY SHOWETH:\n` +
          `1. That the Applicant is a law-abiding citizen of India running a genuine retail manufacturing business, and has been falsely implicated in the above-mentioned FIR due to commercial disputes.\n` +
          `2. That the dispute in question is purely civil and commercial in nature, arising out of non-payment of invoice values, which the complainant has maliciously sought to color as criminal breach of trust.\n` +
          `3. That the Applicant has clean precedents and commits to fully cooperate with the ongoing police investigation at all times.\n` +
          `4. That the Applicant submits that no custodial interrogation is required as the evidence is documentary.\n\n` +
          `PRAYER:\n` +
          `It is therefore most respectfully prayed that this Court may be pleased to direct the release of the Applicant on bail in the event of arrest in FIR 123/2026 on such terms as deemed fit.\n\n` +
          `New Delhi\n` +
          `Date: ${new Date().toLocaleDateString()}\n\n` +
          `APPLICANT\n` +
          `THROUGH\n` +
          `ADVOCATE S. SHARMA`;
      } else if (docType.includes("GST")) {
        draftText = `BEFORE THE APPELLATE AUTHORITY UNDER THE GST ACT, NEW DELHI\n` +
          `APPEAL NO. ______ / GST / 2026\n\n` +
          `IN THE MATTER OF:\n` +
          `M/s Apex Retailers Private Limited ... APPELLANT\n\n` +
          `VERSUS\n` +
          `State Tax Officer, Ward 12 ... RESPONDENT\n\n` +
          `PETITION OF APPEAL UNDER SECTION 107 OF THE CGST ACT AGAINST SCN DRC-01 IN RELATION TO INPUT TAX CREDIT MISMATCH FOR FY 2024-25.\n\n` +
          `The Appellant respectfully submits as under:\n` +
          `1. The Appellant challenges the denial of Input Tax Credit on GSTR-2A vs GSTR-3B mismatch grounds.\n` +
          `2. It is submitted that the Appellant paid the tax values along with purchase prices through official bank RTGS. Credit cannot be denied solely due to supplier delay in uploading filings, as held in Diya Agencies vs STO.\n` +
          `3. Reconciliations are attached in compliance with CBIC guidelines.\n\n` +
          `PRAYER:\n` +
          `The Appellant prays that the demand order be set aside and credit be allowed in full.\n\n` +
          `APPELLANT`;
      } else if (docType.includes("Written")) {
        draftText = `IN THE COURT OF THE CIVIL JUDGE, SAKET COURTS, NEW DELHI\n` +
          `SUIT NO. ______ OF 2026\n\n` +
          `IN THE MATTER OF:\n` +
          `ABC Finance Corp ... PLAINTIFF\n\n` +
          `VERSUS\n` +
          `XYZ Retailers ... DEFENDANT\n\n` +
          `WRITTEN STATEMENT ON BEHALF OF THE DEFENDANT UNDER ORDER VIII RULE 1 OF THE CODE OF CIVIL PROCEDURE.\n\n` +
          `The Defendant submits as under:\n` +
          `1. The suit filed by the Plaintiff is not maintainable as it suppresses material facts.\n` +
          `2. Paragraph 1 of the plaint is denied in as much as no outstanding dues remain payable under the agreement.\n` +
          `3. The Defendant has duly settled all invoices through digital bank clearance.\n\n` +
          `DEFENDANT`;
      } else {
        draftText = `SUPPLIER & VENDOR SERVICE AGREEMENT\n\n` +
          `This Agreement is made on this ${new Date().toLocaleDateString()} between:\n` +
          `1. M/s ABC Manufacturing Co. ... CLIENT\n` +
          `2. M/s XYZ Logistics Ltd ... CONTRACTOR\n\n` +
          `TERMS:\n` +
          `1. The Contractor shall supply transportation services at the rates specified in Schedule A.\n` +
          `2. Disputes shall be referred to Arbitration under the Arbitration and Conciliation Act. The seat of Arbitration shall be New Delhi.`;
      }

      setGeneratedDraft(draftText);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    alert("Draft copied to clipboard!");
  };

  const handleExport = () => {
    alert("Word Document (.docx) export triggered.");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f0e8d0] uppercase tracking-wider font-serif">
          {t.pageTitle}
        </h1>
        <p className="text-[#c2b69a] text-xs font-mono uppercase tracking-wide">
          {t.pageSub}
        </p>
      </div>

      {/* Split Layout Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-230px)] min-h-[500px]">
        
        {/* Left Pane: Parameters Configuration (5 Columns) */}
        <div className="md:col-span-5 bg-[#221c0e]/40 border border-[#c9a84c]/20 rounded-xl p-5 space-y-5 flex flex-col justify-between h-full shadow-lg">
          
          <div className="space-y-4">
            {/* Document Type Dropdown */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-bold font-mono text-[#c2b69a] uppercase tracking-wider">
                {t.docType}
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                disabled={isGenerating}
                className="w-full px-3 py-2.5 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c] rounded-lg text-xs text-[#f0e8d0] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Bail Application (Anticipatory)">Bail Application (Anticipatory)</option>
                <option value="GST Appeal Petition">GST Appeal Petition</option>
                <option value="Written Statement (Civil Suit)">Written Statement (Civil Suit)</option>
                <option value="Contract Agreement">Contract Agreement</option>
              </select>
            </div>

            {/* Case Context Input */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-bold font-mono text-[#c2b69a] uppercase tracking-wider">
                {t.caseContext}
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                disabled={isGenerating}
                rows={6}
                placeholder="E.g., Client is Rahul Kumar, FIR 123/2026 under section 420/406 IPC at PS Vasant Vihar. Dispute is actually civil commercial regarding non-payment of goods."
                className="w-full p-3.5 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c] rounded-lg text-xs text-[#f0e8d0] focus:outline-none placeholder:text-[#9a8c6a]/30 resize-none font-sans leading-relaxed shadow-inner"
              />
            </div>

            {/* Tone Selection */}
            <div className="space-y-2 text-left">
              <label className="text-[11px] font-bold font-mono text-[#c2b69a] uppercase tracking-wider">
                {t.toneStyle}
              </label>
              <div className="flex gap-2.5">
                {["Standard Court Format", "Aggressive", "Concise"].map((tStyle) => (
                  <button
                    key={tStyle}
                    onClick={() => setTone(tStyle)}
                    disabled={isGenerating}
                    className={`px-3.5 py-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                      tone === tStyle
                        ? "bg-[#130f06] border-[#c9a84c] text-[#c9a84c] font-bold"
                        : "bg-transparent border-[#c9a84c]/20 text-[#c2b69a]/60 hover:border-[#c9a84c]/40"
                    }`}
                  >
                    {tStyle === "Standard Court Format" ? "Standard" : tStyle}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3.5 rounded-lg font-mono font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isGenerating
                ? "bg-[#c9a84c]/70 text-[#1a1408]/60 cursor-not-allowed"
                : "bg-[#c9a84c] text-[#1a1408] hover:bg-[#c9a84c]/95"
            }`}
          >
            <Sparkles size={14} className={isGenerating ? "animate-pulse" : ""} />
            {t.generateBtn}
          </button>
        </div>

        {/* Right Pane: Document Preview Sheet (7 Columns) */}
        <div className="md:col-span-7 flex flex-col bg-[#221c0e]/30 border border-[#c9a84c]/20 rounded-xl overflow-hidden h-full shadow-lg">
          
          {/* Header Action Menu */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#c9a84c]/15 bg-[#221c0e]/50 font-sans">
            <div className="flex items-center gap-2.5">
              <FileText size={15} className="text-[#c9a84c]" />
              <h4 className="text-xs font-bold font-mono text-[#f0e8d0] uppercase tracking-wider">
                {t.docPreview}
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={handleCopy}
                disabled={!generatedDraft}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                  generatedDraft
                    ? "bg-[#130f06] border-[#c9a84c]/30 text-[#f0e8d0] hover:border-[#c9a84c]"
                    : "border-transparent text-[#c2b69a]/20 cursor-not-allowed"
                }`}
              >
                <Copy size={12} />
                {t.copy}
              </button>
              <button
                onClick={handleExport}
                disabled={!generatedDraft}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                  generatedDraft
                    ? "bg-[#130f06] border-[#c9a84c]/30 text-[#f0e8d0] hover:border-[#c9a84c]"
                    : "border-transparent text-[#c2b69a]/20 cursor-not-allowed"
                }`}
              >
                <Download size={12} />
                {t.exportWord}
              </button>
            </div>
          </div>

          {/* Document Sheet Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-[#130f06]/40 flex justify-center items-center">
            {isGenerating ? (
              /* Loading Spinner */
              <div className="flex flex-col justify-center items-center py-10 space-y-3.5 text-center">
                <div className="w-9 h-9 border-4 border-[#c9a84c] border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs text-[#c2b69a]/80 font-mono uppercase tracking-widest animate-pulse">
                  {t.generating}
                </div>
              </div>
            ) : generatedDraft ? (
              /* High-premium Court Paper mockup */
              <div className="w-full max-w-2xl bg-[#fdfaf2] text-[#2c2214] border border-[#e2d5bd] rounded shadow-lg p-10 font-serif leading-relaxed text-sm select-text text-left min-h-[450px]">
                {/* Court paper margin lines */}
                <div className="border-l border-red-200 pl-6 h-full min-h-[400px]">
                  <textarea
                    value={generatedDraft}
                    onChange={(e) => setGeneratedDraft(e.target.value)}
                    className="w-full h-full min-h-[380px] bg-transparent border-none text-[#2c2214] font-serif text-xs leading-relaxed focus:outline-none resize-none"
                  />
                </div>
              </div>
            ) : (
              /* Empty Placeholder State */
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 bg-[#221c0e]/5 border border-[#c9a84c]/5 rounded-xl p-8 w-full max-w-md">
                <div className="w-14 h-14 rounded-full bg-[#c9a84c]/5 flex items-center justify-center text-[#c9a84c]/40 mb-1 border border-[#c9a84c]/10">
                  <FileText className="w-6 h-6 text-[#c9a84c]/50" />
                </div>
                <p className="text-xs text-[#c2b69a]/60 leading-relaxed font-sans">
                  {t.emptyState}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
