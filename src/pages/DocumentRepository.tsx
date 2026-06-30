import { useState } from "react";
import { FolderOpen, Search, Eye, Download, Trash, Shield, Lock, FileText, User, Upload } from "lucide-react";

interface ChamberFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploader: string;
  isPrivate: boolean;
  dateAdded: string;
}

interface DocumentRepositoryProps {
  currentRole?: string;
  language?: string;
}

export function DocumentRepository({ currentRole = "Senior", language = "en" }: DocumentRepositoryProps) {
  const TRANSLATIONS = {
    en: {
      pageTitle: "CHAMBER DOCUMENT REPOSITORY",
      pageSub: "Layer 3 · Secure Chamber File System & OCR Index",
      roleSecurity: "ROLE LEVEL SECURITY ENFORCED",
      searchPlaceholder: "Search documents by name or category...",
      allFiles: "All Files",
      publicFiles: "Public Files",
      privateFiles: "Private Files",
      tableName: "File Name",
      tableType: "Type",
      tableSize: "Size",
      tableUploader: "Uploader",
      tableAccess: "Access Level",
      tableDate: "Date Added",
      tableActions: "Actions",
      noFiles: "No documents found matching search filters.",
      uploadBtn: "Upload Document",
      publicBadge: "Public Chamber",
      privateBadge: "Private (RBAC)"
    },
    hi: {
      pageTitle: "चैंबर दस्तावेज़ भंडार",
      pageSub: "लेयर 3 · सुरक्षित चैंबर फ़ाइल सिस्टम और ओसीआर इंडेक्स",
      roleSecurity: "भूमिका स्तर सुरक्षा लागू",
      searchPlaceholder: "नाम या श्रेणी के अनुसार दस्तावेज़ खोजें...",
      allFiles: "सभी दस्तावेज़",
      publicFiles: "सार्वजनिक दस्तावेज़",
      privateFiles: "निजी दस्तावेज़",
      tableName: "फ़ाइल का नाम",
      tableType: "प्रकार",
      tableSize: "आकार",
      tableUploader: "अपलोडर",
      tableAccess: "पहुंच स्तर",
      tableDate: "जोड़ने की तिथि",
      tableActions: "कार्रवाई",
      noFiles: "खोज फ़िल्टर से मेल खाने वाले कोई दस्तावेज़ नहीं मिले।",
      uploadBtn: "दस्तावेज़ अपलोड करें",
      publicBadge: "सार्वजनिक चैंबर",
      privateBadge: "निजी (RBAC)"
    },
    ur: {
      pageTitle: "چیمبر دستاویز کا ذخیرہ",
      pageSub: "لیئر 3 · محفوظ چیمبر فائل سسٹم اور او سی آر انڈیکس",
      roleSecurity: "رول لیول سیکیورٹی لاگو ہے",
      searchPlaceholder: "نام یا زمرہ کے لحاظ سے دستاویزات تلاش کریں...",
      allFiles: "تمام فائلیں",
      publicFiles: "عوامی فائلیں",
      privateFiles: "نجی فائلیں",
      tableName: "فائل کا نام",
      tableType: "قسم",
      tableSize: "سائز",
      tableUploader: "اپ لوڈ کنندہ",
      tableAccess: "رسائی کی سطح",
      tableDate: "شامل کرنے کی تاریخ",
      tableActions: "اقدامات",
      noFiles: "تلاش کے فلٹرز سے مماثل کوئی دستاویزات نہیں ملیں۔",
      uploadBtn: "دस्तावेज़ اپ لوڈ کریں",
      publicBadge: "عوامی چیمبر",
      privateBadge: "نجی (RBAC)"
    },
    mr: {
      pageTitle: "चेंबर दस्तऐवज भांडार",
      pageSub: "स्तर ३ · सुरक्षित चेंबर फाईल सिस्टम आणि ओसीआर इंडेक्स",
      roleSecurity: "भूमिका पातळी सुरक्षा लागू",
      searchPlaceholder: "नाव किंवा श्रेणीनुसार दस्तऐवज शोधा...",
      allFiles: "सर्व फाइल्स",
      publicFiles: "सार्वजनिक फाइल्स",
      privateFiles: "खाजगी फाइल्स",
      tableName: "फाईलचे नाव",
      tableType: "प्रकार",
      tableSize: "आकार",
      tableUploader: "अपलोडर",
      tableAccess: "प्रवेश स्तर",
      tableDate: "जोडल्याची तारीख",
      tableActions: "कृती",
      noFiles: "शोध निकषांशी जुळणारे कोणतेही दस्तऐवज आढळले नाहीत.",
      uploadBtn: "दस्तऐवज अपलोड करा",
      publicBadge: "सार्वजनिक चेंबर",
      privateBadge: "खाजगी (RBAC)"
    },
    bn: {
      pageTitle: "চেম্বার নথি সংগ্রহশালা",
      pageSub: "লেয়ার ৩ · সুরক্ষিত চেম্বার ফাইল সিস্টেম এবং ওসিআর ইনডেক্স",
      roleSecurity: "রোল লেভেল সিকিউরিটি বলবৎ",
      searchPlaceholder: "নাম বা বিভাগ দ্বারা নথি অনুসন্ধান করুন...",
      allFiles: "সমস্ত ফাইল",
      publicFiles: "পাবলিক ফাইল",
      privateFiles: "প্রাইভেট ফাইল",
      tableName: "ফাইলের নাম",
      tableType: "ধরণ",
      tableSize: "সাইজ",
      tableUploader: "আপলোডার",
      tableAccess: "অ্যাক্সেস লেভেল",
      tableDate: "যোগ করার তারিখ",
      tableActions: "অ্যাকশন",
      noFiles: "অনুসন্ধানের সাথে সামঞ্জस्यপূর্ণ কোনো নথি পাওয়া যায়নি।",
      uploadBtn: "নথি আপলোড করুন",
      publicBadge: "পাবলিক চেম্বার",
      privateBadge: "প্রাইভেট (RBAC)"
    }
  };

  const activeLang = (language && TRANSLATIONS[language as keyof typeof TRANSLATIONS]) ? language : "en";
  const t = TRANSLATIONS[activeLang as keyof typeof TRANSLATIONS];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Public" | "Private">("All");

  const [files, setFiles] = useState<ChamberFile[]>([
    {
      id: "f1",
      name: "GST_DRC_01_Apex_Retailers.pdf",
      size: "1.2 MB",
      type: "SCN Notice",
      uploader: "Priya Sen (Associate)",
      isPrivate: false,
      dateAdded: "2026-06-15"
    },
    {
      id: "f2",
      name: "Matrix_Logistics_SCN_74.pdf",
      size: "2.4 MB",
      type: "SCN Notice",
      uploader: "Rohan (Intern)",
      isPrivate: false,
      dateAdded: "2026-06-20"
    },
    {
      id: "f3",
      name: "Zenith_India_ITC_Challans.xlsx",
      size: "480 KB",
      type: "Client Account Files",
      uploader: "Priya Sen (Associate)",
      isPrivate: true,
      dateAdded: "2026-06-22"
    },
    {
      id: "f4",
      name: "Apex_Retailers_Billing_Memo.pdf",
      size: "310 KB",
      type: "Internal Memo",
      uploader: "Aditya S (Senior)",
      isPrivate: true,
      dateAdded: "2026-06-25"
    },
    {
      id: "f5",
      name: "CBIC_Circular_183_CA_Cert.pdf",
      size: "1.8 MB",
      type: "CBIC Circular",
      uploader: "System Ingestion",
      isPrivate: false,
      dateAdded: "2026-06-01"
    }
  ]);

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Enforce Role Level Security: Interns cannot see private files!
    const isVisibleByRole = currentRole !== "Intern" || !f.isPrivate;

    const matchesTab = activeTab === "All" || 
                       (activeTab === "Public" && !f.isPrivate) || 
                       (activeTab === "Private" && f.isPrivate);
    return matchesSearch && isVisibleByRole && matchesTab;
  });

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = file.name;
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = parseFloat(sizeInMB) > 0.1 ? `${sizeInMB} MB` : `${Math.round(file.size / 1024)} KB`;
    
    let docType = "Chamber File";
    if (name.toLowerCase().includes("invoice") || name.toLowerCase().includes("bill")) {
      docType = "Internal Memo";
    } else if (name.toLowerCase().includes("notice") || name.toLowerCase().includes("scn")) {
      docType = "SCN Notice";
    } else if (name.toLowerCase().includes("appeal") || name.toLowerCase().includes("petition")) {
      docType = "GST Appeal Petition";
    } else if (name.toLowerCase().includes("challan") || name.toLowerCase().includes("tax")) {
      docType = "Client Account Files";
    }

    const newFile: ChamberFile = {
      id: `f-${Date.now()}`,
      name: name,
      size: sizeStr,
      type: docType,
      uploader: `${currentRole === "Senior" ? "Aditya S" : currentRole === "Associate" ? "Priya Sen" : "Rohan"} (${currentRole})`,
      isPrivate: activeTab === "Private", // sets private default depending on currently active tab
      dateAdded: new Date().toISOString().split("T")[0]
    };

    setFiles((prev) => [newFile, ...prev]);
    alert(`File "${name}" uploaded successfully!`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-[#f0e8d0] uppercase tracking-wider font-serif">
            {t.pageTitle}
          </h1>
          <p className="text-[#c2b69a] text-xs font-mono uppercase tracking-wide">
            {t.pageSub}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] bg-[#221c0e]/80 border border-[#c9a84c]/20 rounded-lg py-2 px-3">
            <Shield size={12} className="text-[#c9a84c]" />
            <span className="font-mono text-[#c9a84c] uppercase font-bold tracking-wider">{t.roleSecurity}</span>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            id="chamber-file-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="chamber-file-upload"
            className="px-4 py-2.5 bg-[#c9a84c] hover:bg-[#c9a84c]/95 text-[#1a1408] font-bold uppercase rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer select-none"
          >
            <Upload size={13} />
            {t.uploadBtn}
          </label>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-[#221c0e]/40 border border-[#c9a84c]/15 rounded-xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c] opacity-60 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-[#130f06] border border-[#c9a84c]/20 focus:border-[#c9a84c]/50 rounded-lg text-sm text-[#f0e8d0] focus:outline-none placeholder:text-[#9a8c6a]/40 font-sans"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex bg-[#130f06] p-1 border border-[#c9a84c]/15 rounded-lg text-xs font-mono w-full md:w-auto justify-center">
          {(["All", "Public", "Private"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md transition-all font-bold cursor-pointer ${
                activeTab === tab
                  ? "bg-[#c9a84c]/25 text-[#f0e8d0] border border-[#c9a84c]/30"
                  : "text-[#c2b69a]/50 hover:text-[#f0e8d0]"
              }`}
            >
              {tab === "All" ? t.allFiles : tab === "Public" ? t.publicFiles : t.privateFiles}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid/List */}
      <div className="bg-[#221c0e]/30 border border-[#c9a84c]/15 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#221c0e]/50 border-b border-[#c9a84c]/15 text-[#c9a84c] uppercase tracking-wider">
              <tr>
                <th className="p-4">{t.tableName}</th>
                <th className="p-4">{t.tableType}</th>
                <th className="p-4">{t.tableSize}</th>
                <th className="p-4">{t.tableUploader}</th>
                <th className="p-4">{t.tableAccess}</th>
                <th className="p-4">{t.tableDate}</th>
                <th className="p-4 text-center">{t.tableActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9a84c]/10 text-left">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-[#c2b69a]/50 italic font-serif text-sm">
                    {t.noFiles}
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-[#221c0e]/20 transition-colors">
                    {/* Name */}
                    <td className="p-4 flex items-center gap-2.5 font-bold text-[#f0e8d0] max-w-xs truncate">
                      <FileText size={16} className="text-[#c9a84c] flex-shrink-0" />
                      <span>{file.name}</span>
                    </td>
                    {/* Type */}
                    <td className="p-4 text-[#c2b69a]/70">{file.type}</td>
                    {/* Size */}
                    <td className="p-4 text-[#c2b69a]/70">{file.size}</td>
                    {/* Uploader */}
                    <td className="p-4 flex items-center gap-1.5 text-[#f0e8d0]">
                      <User size={12} className="text-[#c9a84c]/70" />
                      <span>{file.uploader}</span>
                    </td>
                    {/* Access Level */}
                    <td className="p-4">
                      {file.isPrivate ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-800/20 font-bold uppercase">
                          <Lock size={10} /> {t.privateBadge}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/20 font-bold uppercase">
                          <FolderOpen size={10} /> {t.publicBadge}
                        </span>
                      )}
                    </td>
                    {/* Date */}
                    <td className="p-4 text-[#c2b69a]/70">{file.dateAdded}</td>
                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => alert(`Opening preview of "${file.name}"...`)}
                          className="p-1.5 hover:bg-[#130f06] border border-[#c9a84c]/20 hover:border-[#c9a84c] rounded text-[#c9a84c] hover:text-[#f0e8d0] transition-all cursor-pointer"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => alert(`Downloading file "${file.name}"...`)}
                          className="p-1.5 hover:bg-[#130f06] border border-[#c9a84c]/20 hover:border-[#c9a84c] rounded text-[#c9a84c] hover:text-[#f0e8d0] transition-all cursor-pointer"
                        >
                          <Download size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="p-1.5 hover:bg-red-950/30 border border-[#c9a84c]/10 hover:border-red-500/30 rounded text-[#c2b69a]/50 hover:text-red-400 transition-all cursor-pointer"
                        >
                          <Trash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
