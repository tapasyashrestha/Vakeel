import { useState, useRef, useEffect } from "react";
import { Send, User, MessageSquare, ChevronRight, Paperclip } from "lucide-react";
import { ScalesOfJustice } from "../components/LegalIcons";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatPortalProps {
  language?: string;
}

export function ChatPortal({ language = "en" }: ChatPortalProps) {
  const TRANSLATIONS = {
    en: {
      pageTitle: "AI Conversation",
      pageSub: "Context-aware legal chat.",
      recentTitle: "Recent Conversations",
      assistantName: "Vakeel Legal Assistant",
      onlineStatus: "Online",
      exportChat: "Export Chat",
      saveToCase: "Save to Case",
      newChatBtn: "+ New Chat",
      inputPlaceholder: "Ask a legal question, request a draft, or upload a document...",
      send: "Send",
      disclaimer: "Vakeel can make mistakes. Verify important legal information before filing.",
      typing: "Vakeel is thinking..."
    },
    hi: {
      pageTitle: "एआई वार्तालाप",
      pageSub: "संदर्भ-जागरूक कानूनी चैट।",
      recentTitle: "हालिया बातचीत",
      assistantName: "वकील कानूनी सहायक",
      onlineStatus: "ऑनलाइन",
      exportChat: "चैट निर्यात करें",
      saveToCase: "केस में सहेजें",
      newChatBtn: "+ नई चैट",
      inputPlaceholder: "एक कानूनी प्रश्न पूछें, मसौदे का अनुरोध करें, या दस्तावेज़ अपलोड करें...",
      send: "भेजें",
      disclaimer: "वकील गलतियाँ कर सकता है। दाखिल करने से पहले महत्वपूर्ण कानूनी जानकारी सत्यापित करें।",
      typing: "वकील सोच रहा है..."
    },
    ur: {
      pageTitle: "اے آئی گفتگو",
      pageSub: "سیاق و سباق سے آگاہ قانونی بات چیت۔",
      recentTitle: "حالیہ گفتگو",
      assistantName: "وکیل قانونی معاون",
      onlineStatus: "آن لائن",
      exportChat: "گفتگو برآمد کریں",
      saveToCase: "کیس میں محفوظ کریں",
      newChatBtn: "+ نئی گفتگو",
      inputPlaceholder: "قانونی سوال پوچھیں، مسودے کی درخواست کریں، یا کوئی دستاویز اپ لوڈ کریں...",
      send: "بھیجیں",
      disclaimer: "وکیل غلطیاں کر سکتا ہے۔ فائل کرنے سے پہلے اہم قانونی معلومات کی تصدیق کریں۔",
      typing: "وکیل سوچ رہا ہے..."
    },
    mr: {
      pageTitle: "एआय संभाषण",
      pageSub: "संदर्भ-संवेदनशील कायदेशीर चॅट.",
      recentTitle: "अलीकडील संभाषणे",
      assistantName: "वकील कायदेशीर सहाय्यक",
      onlineStatus: "ऑनलाइन",
      exportChat: "चॅट निर्यात करा",
      saveToCase: "खटल्यात जतन करा",
      newChatBtn: "+ नवीन चॅट",
      inputPlaceholder: "कायदेशीर प्रश्न विचारा, मसुद्याची विनंती करा किंवा दस्तऐवज अपलोड करा...",
      send: "पाठवा",
      disclaimer: "वकील चुका करू शकतो. सादर करण्यापूर्वी महत्त्वाची कायदेशीर माहिती पडताळून पहा.",
      typing: "वकील विचार करत आहे..."
    },
    bn: {
      pageTitle: "এআই কথোপকথন",
      pageSub: "প্রসঙ্গ-সচেতন আইনি চ্যাট।",
      recentTitle: "সাম্প্রতিক কথোপকথন",
      assistantName: "উকিল আইনি সহকারী",
      onlineStatus: "অনলাইন",
      exportChat: "চ্যাট এক্সপোর্ট করুন",
      saveToCase: "মামলায় সংরক্ষণ করুন",
      newChatBtn: "+ নতুন চ্যাট",
      inputPlaceholder: "একটি আইনি প্রশ্ন জিজ্ঞাসা করুন, খসড়ার অনুরোধ করুন, অথবা কোনো নথি আপলোড করুন...",
      send: "পাঠান",
      disclaimer: "উকিল ভুল করতে পারে। সাবমিট করার আগে গুরুত্বপূর্ণ আইনি তথ্য যাচাই করে নিন।",
      typing: "উকিল চিন্তা করছে..."
    }
  };

  const activeLang = (language && TRANSLATIONS[language as keyof typeof TRANSLATIONS]) ? language : "en";
  const t = TRANSLATIONS[activeLang as keyof typeof TRANSLATIONS];

  // Dynamic chat threads with custom history histories
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "gst",
      title: "GST Notice Reply (Client ...",
      messages: [
        {
          id: "m1",
          sender: "ai",
          text: "Hello Advocate Sharma. I am Vakeel, your legal assistant. I can help you with case research, draft clauses, or answer legal queries based on the latest precedents. How can I assist you today?",
          timestamp: "12:00 PM"
        },
        {
          id: "m2",
          sender: "user",
          text: "I need to respond to a GST notice demanding an explanation for input tax credit mismatch for FY 2024-25. Our client is a manufacturing firm.",
          timestamp: "12:02 PM"
        },
        {
          id: "m3",
          sender: "ai",
          text: "Under Section 73 of the CGST Act, an officer can issue a show cause notice for mismatch in ITC. Based on our private chamber knowledge, we recently handled a similar case (Client: XYZ Manufacturing) where the mismatch was due to a delayed GSTR-1 filing by the supplier.",
          timestamp: "12:03 PM"
        }
      ]
    },
    {
      id: "bail",
      title: "Bail Research (Sec 498A)",
      messages: [
        {
          id: "b1",
          sender: "ai",
          text: "Hello Advocate Sharma. How can I help you with your criminal defense or bail procedure queries today?",
          timestamp: "03:10 PM"
        },
        {
          id: "b2",
          sender: "user",
          text: "Can you draft a bail application under Section 498A IPC/438 CrPC?",
          timestamp: "03:11 PM"
        },
        {
          id: "b3",
          sender: "ai",
          text: "Under Section 438 of the CrPC, anticipatory bail can be sought. For Section 498A IPC allegations, the Supreme Court in Arnesh Kumar vs State of Bihar established clear guidelines preventing automatic arrest. I have generated a template for the petition based on your chamber preferences.",
          timestamp: "03:12 PM"
        }
      ]
    },
    {
      id: "contract",
      title: "Contract Clause Review",
      messages: [
        {
          id: "c1",
          sender: "ai",
          text: "Hello Advocate Sharma. I can review contract agreements, analyze indemnity clauses, or draft specific riders. What document shall we inspect?",
          timestamp: "10:15 AM"
        },
        {
          id: "c2",
          sender: "user",
          text: "Review the arbitration clause in our client's supplier agreement.",
          timestamp: "10:16 AM"
        },
        {
          id: "c3",
          sender: "ai",
          text: "I have analyzed the clause. Under Section 7 of the Arbitration and Conciliation Act, the agreement must be in writing. The current draft lacks a seat of arbitration definition; I recommend specifying 'New Delhi' to avoid future jurisdictional disputes.",
          timestamp: "10:18 AM"
        }
      ]
    },
    {
      id: "arbitration",
      title: "Query on Arbitration Act",
      messages: [
        {
          id: "a1",
          sender: "ai",
          text: "Hello Advocate Sharma. How can I assist with your arbitration proceedings or jurisdictional queries today?",
          timestamp: "11:22 AM"
        },
        {
          id: "a2",
          sender: "user",
          text: "Does an unsigned contract invalidate an arbitration agreement?",
          timestamp: "11:24 AM"
        },
        {
          id: "a3",
          sender: "ai",
          text: "The Supreme Court has ruled that an unsigned contract is valid if the parties have acted in accordance with its terms and intent. Under Section 7(4) of the Arbitration Act, an exchange of letters or emails can constitute a valid arbitration agreement.",
          timestamp: "11:26 AM"
        }
      ]
    }
  ]);

  const [activeThreadIndex, setActiveThreadIndex] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const activeThread = threads[activeThreadIndex];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // Update active thread messages
    const updatedThreads = [...threads];
    updatedThreads[activeThreadIndex].messages.push(userMsg);
    setThreads(updatedThreads);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let responseText = "I have indexed your query. Let me look up matching legal references in the database.";
      const lower = userMsg.text.toLowerCase();

      if (lower.includes("audit") || lower.includes("notice") || lower.includes("gst")) {
        responseText = "Under the GST framework, mismatch notices typically call for a comparison between GSTR-2A and GSTR-3B. Let me draft a suitable reply seeking extension of time or submitting ledger reconciliation sheets.";
      } else if (lower.includes("bail") || lower.includes("court") || lower.includes("arrest")) {
        responseText = "Bail applications should highlight the applicant's cooperation with investigation. I can compile the required personal bond formats and draft the affidavit.";
      } else if (lower.includes("arbitration") || lower.includes("agreement") || lower.includes("clause")) {
        responseText = "Let's review the clause. Specifying a clear seat and venue prevents prolonged litigation. I recommend setting New Delhi as seat and LCIA or DIAC rules for governing arbitration.";
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      updatedThreads[activeThreadIndex].messages.push(aiMsg);
      setThreads(updatedThreads);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread.messages, isTyping]);

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

      {/* Main Grid Layout matching the reference */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-230px)] min-h-[500px]">
        
        {/* Left Side: Recent Conversations (4 Columns) */}
        <div className="md:col-span-4 flex flex-col bg-[#221c0e]/40 border border-[#c9a84c]/20 rounded-xl p-4 justify-between h-full">
          <div className="space-y-4">
            <h3 className="text-xs font-bold font-mono text-[#c9a84c] uppercase tracking-widest border-b border-[#c9a84c]/10 pb-2">
              {t.recentTitle}
            </h3>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {threads.map((thread, idx) => (
                <button
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadIndex(idx);
                    setIsTyping(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg border text-xs font-mono transition-all cursor-pointer text-left ${
                    activeThreadIndex === idx
                      ? "bg-[#c9a84c]/15 border-[#c9a84c] text-[#f0e8d0] font-semibold"
                      : "bg-[#1c160a]/20 border-[#c9a84c]/10 text-[#c2b69a]/70 hover:border-[#c9a84c]/25 hover:text-[#f0e8d0]"
                  }`}
                >
                  <span className="truncate pr-2">{thread.title}</span>
                  <ChevronRight size={13} className={activeThreadIndex === idx ? "text-[#c9a84c]" : "opacity-40"} />
                </button>
              ))}
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              const newId = `chat-${Date.now()}`;
              const newTitle = `New Query Thread ${threads.length + 1}`;
              const newThread: ChatThread = {
                id: newId,
                title: newTitle,
                messages: [
                  {
                    id: `m-${Date.now()}`,
                    sender: "ai",
                    text: "Hello Advocate Sharma. I am ready for a new research session. Ask me a legal question, request a draft, or upload a document to begin.",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  }
                ]
              };
              setThreads([...threads, newThread]);
              setActiveThreadIndex(threads.length);
              setIsTyping(false);
            }}
            className="w-full py-2.5 bg-transparent border border-[#c9a84c]/40 hover:border-[#c9a84c] text-[#c9a84c] hover:text-[#f0e8d0] transition-colors rounded-lg text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {t.newChatBtn}
          </button>
        </div>

        {/* Right Side: Main Chat Interface (8 Columns) */}
        <div className="md:col-span-8 flex flex-col bg-[#221c0e]/30 border border-[#c9a84c]/20 rounded-xl overflow-hidden h-full shadow-lg">
          
          {/* Chat Window Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#c9a84c]/15 bg-[#221c0e]/50 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#c9a84c]/5 border border-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c]">
                <MessageSquare size={16} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-[#f0e8d0]">{t.assistantName}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-[#c2b69a]/70 font-mono">{t.onlineStatus}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <button
                onClick={() => alert("Chat history exported.")}
                className="text-[#c2b69a]/80 hover:text-[#c9a84c] hover:underline transition-all cursor-pointer"
              >
                {t.exportChat}
              </button>
              <span className="text-[#c9a84c]/20">|</span>
              <button
                onClick={() => alert("Saved to active case profile.")}
                className="text-[#c2b69a]/80 hover:text-[#c9a84c] hover:underline transition-all cursor-pointer"
              >
                {t.saveToCase}
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {activeThread.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-[#c9a84c]/25 border-[#c9a84c]/45 text-[#c9a84c]"
                      : "bg-[#1c160a] border-[#c9a84c]/25 text-[#c9a84c]"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User size={14} />
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center">
                      <ScalesOfJustice className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Bubble Container */}
                <div
                  className={`p-4 rounded-2xl border text-sm font-sans text-left space-y-1 relative shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#c9a84c] border-[#c9a84c]/10 text-[#1a1408] font-medium"
                      : "bg-[#221c0e] border-[#c9a84c]/15 text-[#f0e8d0] leading-relaxed"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[9px] text-right font-mono mt-1 ${
                      msg.sender === "user" ? "text-[#1a1408]/60" : "text-[#c2b69a]/50"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-9 h-9 rounded-full bg-[#1c160a] border border-[#c9a84c]/25 flex items-center justify-center text-[#c9a84c]">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <ScalesOfJustice className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                </div>
                <div className="p-4 bg-[#221c0e] border border-[#c9a84c]/15 rounded-2xl flex items-center gap-1.5 py-3">
                  <span className="text-[10px] text-[#c2b69a]/70 font-mono tracking-wider animate-pulse">
                    {t.typing}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#c9a84c]/15 bg-[#221c0e]/50 text-sans">
            <div className="bg-[#130f06] border border-[#c9a84c]/20 focus-within:border-[#c9a84c]/50 rounded-xl p-1.5 flex gap-2 items-center shadow-inner">
              
              {/* Paperclip Button */}
              <button
                type="button"
                onClick={() => alert("Upload document attachment is simulated.")}
                className="w-9 h-9 flex items-center justify-center text-[#c2b69a]/50 hover:text-[#c9a84c] transition-colors cursor-pointer rounded-lg hover:bg-[#c9a84c]/5"
              >
                <Paperclip size={16} />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t.inputPlaceholder}
                className="flex-1 bg-transparent border-none text-sm text-[#f0e8d0] focus:outline-none placeholder:text-[#9a8c6a]/40 font-sans px-2"
              />

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`px-5 py-2.5 rounded-lg font-mono font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputText.trim()
                    ? "bg-[#c9a84c] text-[#1a1408] hover:bg-[#c9a84c]/95"
                    : "bg-[#1c160a] text-[#c2b69a]/30 border border-[#c9a84c]/10 cursor-not-allowed"
                }`}
              >
                <Send size={11} />
                {t.send}
              </button>
            </div>

            {/* Disclaimer Text */}
            <p className="text-[9px] text-[#c2b69a]/40 font-mono text-center mt-2.5 tracking-wider uppercase leading-normal">
              {t.disclaimer}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
