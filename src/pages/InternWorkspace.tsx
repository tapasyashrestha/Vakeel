import { useState } from "react";
import { CheckCircle2, Clock, UploadCloud, Search, FileText, ChevronRight, File } from "lucide-react";

interface InternWorkspaceProps {
  language?: string;
}

export function InternWorkspace({ language: _language = "en" }: InternWorkspaceProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const MOCK_ASSIGNMENTS = [
    { id: 1, title: "Verify Zenith E-Way bills invoices", status: "In Progress", due: "Today, 5:00 PM" },
    { id: 2, title: "Research SC precedents on Sec 74 Liquidated Damages", status: "To Do", due: "Tomorrow, 10:00 AM" },
    { id: 3, title: "Draft reply to GST Show Cause Notice (Client A)", status: "Completed", due: "Yesterday" }
  ];

  const MOCK_RESEARCH = [
    { id: 1, query: "GST Input Tax Credit mismatch Zenith Tech", corpus: "Public + Private", time: "2 hours ago", match: "High" },
    { id: 2, query: "Apex Retailers internal billing hours", corpus: "Private Files", time: "4 hours ago", match: "Medium" },
    { id: 3, query: "Liquidated damages unreasonable penalty Supreme Court", corpus: "Public Corpus", time: "Yesterday", match: "High" }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0].name);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1a1408]/90 backdrop-blur-md p-6 rounded-xl border border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
        <div>
          <h1 className="text-2xl font-semibold text-primary tracking-wide flex items-center gap-2">
            INTERN WORKSPACE
          </h1>
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-wide">
            My Assignments, Drafting & Research Logs
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg text-sm text-primary font-medium flex items-center gap-2 shadow-[0_0_10px_rgba(212,175,55,0.1)]">
          <Clock className="w-4 h-4" /> Shift Started: 09:30 AM
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assignments & Draft Submission */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Assignments */}
          <div className="bg-[#1a1408]/80 backdrop-blur-md rounded-xl border border-primary/20 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.03)]">
            <div className="border-b border-primary/20 px-6 py-4 flex items-center gap-3 bg-gradient-to-r from-primary/5 to-transparent">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground tracking-wide">My Active Assignments</h2>
            </div>
            <div className="p-6 space-y-4">
              {MOCK_ASSIGNMENTS.map(task => (
                <div key={task.id} className="group relative border border-primary/10 bg-black/40 hover:bg-black/60 rounded-lg p-4 transition-all duration-300">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-medium text-primary/90 text-[15px]">{task.title}</h3>
                      <div className="flex items-center gap-4 mt-3">
                        <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border ${
                          task.status === 'Completed' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                          task.status === 'In Progress' ? 'border-primary/30 text-primary bg-primary/10' :
                          'border-muted-foreground/30 text-muted-foreground bg-muted/10'
                        }`}>
                          {task.status}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 opacity-70" /> Due: {task.due}
                        </span>
                      </div>
                    </div>
                    {task.status !== 'Completed' && (
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded p-2 text-xs font-medium flex items-center gap-1">
                        Update <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Draft */}
          <div className="bg-[#1a1408]/80 backdrop-blur-md rounded-xl border border-primary/20 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.03)]">
            <div className="border-b border-primary/20 px-6 py-4 flex items-center gap-3 bg-gradient-to-r from-primary/5 to-transparent">
              <UploadCloud className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground tracking-wide">Submit Draft for Review</h2>
            </div>
            <div className="p-6">
              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-primary/20 hover:border-primary/50 hover:bg-[#1a1408]'
                }`}
              >
                {!uploadedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-foreground text-sm font-medium">Drag & drop your drafted document here</p>
                    <p className="text-muted-foreground text-xs">Supports .docx, .pdf, .txt for Senior Review</p>
                    <button className="mt-4 bg-[#1a1408] border border-primary/30 text-primary hover:bg-primary/10 px-6 py-2 rounded-lg text-sm font-medium transition-colors uppercase tracking-wider">
                      Browse Files
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-500">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium flex items-center gap-2 justify-center">
                        <File className="w-4 h-4 text-primary" /> {uploadedFile}
                      </p>
                      <p className="text-green-400 text-xs mt-1">Successfully submitted to Senior queue</p>
                    </div>
                    <button onClick={() => setUploadedFile(null)} className="text-xs text-muted-foreground hover:text-primary mt-2 underline decoration-primary/30 underline-offset-4">
                      Submit another draft
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Research History */}
        <div className="bg-[#1a1408]/80 backdrop-blur-md rounded-xl border border-primary/20 overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.03)] h-fit">
          <div className="border-b border-primary/20 px-6 py-4 flex items-center gap-3 bg-gradient-to-r from-primary/5 to-transparent">
            <Search className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground tracking-wide">My Research History</h2>
          </div>
          <div className="p-0">
            <div className="divide-y divide-primary/10">
              {MOCK_RESEARCH.map(log => (
                <div key={log.id} className="p-5 hover:bg-white/[0.02] transition-colors">
                  <p className="text-sm text-primary/90 font-medium leading-relaxed">"{log.query}"</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Target:</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                        {log.corpus}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-primary/10 bg-black/20 text-center">
              <button className="text-xs text-primary hover:text-primary/80 uppercase tracking-widest font-medium transition-colors">
                View Full Logs →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
