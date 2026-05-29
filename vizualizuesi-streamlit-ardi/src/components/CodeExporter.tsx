import React, { useState } from "react";
import { DataItem } from "../types";
import { generateStreamlitCode, generateRequirementsTxt } from "../utils/codeGenerator";
import { FileCode, Download, Copy, Check, Terminal, ExternalLink, Github, Cloud, BookOpen, AlertCircle } from "lucide-react";

interface CodeExporterProps {
  data: DataItem[];
}

export default function CodeExporter({ data }: CodeExporterProps) {
  const [activeTab, setActiveTab] = useState<"app_py" | "requirements_txt" | "deploy_guide">("app_py");
  const [copied, setCopied] = useState(false);

  // Dynamic code generation based on active items in table
  const appPyCode = generateStreamlitCode(data);
  const requirementsCode = generateRequirementsTxt();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Dështoi kopjimi i kodit: ", err);
    }
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#121212] text-[#E0E0E0] rounded-xl overflow-hidden border border-[#2A2A2A] shadow-2xl flex flex-col h-full font-sans">
      
      {/* Exporter Header & Tabs */}
      <div className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#C5A267]/10 rounded-lg text-[#C5A267]">
            <Terminal className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-white uppercase font-mono text-[#C5A267]">Qendra e Kodit & Publikimit</h2>
            <p className="text-xs text-[#999]">Shkarko kodin Python të instaluar dhe shpërndaje</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-[#121212] border border-[#2D2D2D] rounded-lg p-0.5 text-xs text-slate-300">
          <button
            onClick={() => setActiveTab("app_py")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition cursor-pointer ${activeTab === "app_py" ? "bg-[#C5A267] font-bold text-[#0A0A0A] shadow-sm" : "hover:text-white"}`}
          >
            <FileCode className="w-3.5 h-3.5" />
            app.py
          </button>
          <button
            onClick={() => setActiveTab("requirements_txt")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition cursor-pointer ${activeTab === "requirements_txt" ? "bg-[#C5A267] font-bold text-[#0A0A0A] shadow-sm" : "hover:text-white"}`}
          >
            <Terminal className="w-3.5 h-3.5" />
            requirements.txt
          </button>
          <button
            onClick={() => setActiveTab("deploy_guide")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition cursor-pointer ${activeTab === "deploy_guide" ? "bg-[#C5A267] font-bold text-[#0A0A0A] shadow-sm" : "hover:text-white"}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Udhëzuesi i Publikimit
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 p-5 min-h-0 overflow-y-auto">
        
        {/* === TAB 1: app.py === */}
        {activeTab === "app_py" && (
          <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#C5A267] uppercase tracking-widest block mb-0.5 font-mono">Programi Python</span>
                <h3 className="text-sm font-semibold text-white">Kodi i gatshëm për Streamlit App</h3>
                <p className="text-xs text-[#999] mt-1">Ky kod ndryshon dinamikisht sipas elementeve që shtoni në dataset.</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(appPyCode)}
                  className="bg-[#1A1A1A] hover:bg-[#222] text-[#C5A267] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#2D2D2D] hover:border-[#C5A267]/40 transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "U kopjua!" : "Kopjo"}
                </button>
                <button
                  onClick={() => handleDownload("app.py", appPyCode)}
                  className="bg-[#C5A267] hover:bg-[#D5B277] font-bold text-[#0A0A0A] text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Shkarko app.py
                </button>
              </div>
            </div>

            {/* Code Block Container */}
            <div className="relative border border-[#2A2A2A] rounded-xl overflow-hidden bg-[#0D0D0D]/95 max-h-[420px] overflow-y-auto">
              <pre className="p-4 text-xs font-mono text-[#CCC] leading-relaxed overflow-x-auto whitespace-pre">
                {appPyCode}
              </pre>
            </div>
            
            <div className="bg-[#1A1A1A] p-3 rounded-lg border border-[#2A2A2A] flex items-start gap-2 text-xs text-zinc-400">
              <AlertCircle className="w-4 h-4 text-[#C5A267] shrink-0 mt-0.5" />
              <p>
                <strong>Vini re:</strong> Kodi përmban të gjithë rekordet aktuelle të shtuara nga faqja si të dhëna fillestare (seed data) për Pandas DataFrame! Çdo shtim apo fshirje pasqyrohet këtu.
              </p>
            </div>
          </div>
        )}

        {/* === TAB 2: requirements.txt === */}
        {activeTab === "requirements_txt" && (
          <div className="flex flex-col gap-4 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#C5A267] uppercase tracking-widest block mb-0.5 font-mono">Skedari i Varësive</span>
                <h3 className="text-sm font-semibold text-white">requirements.txt</h3>
                <p className="text-xs text-[#999] mt-1">Ky skedar është i domosdoshëm për Streamlit Cloud që të instalojë paketat.</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy(requirementsCode)}
                  className="bg-[#1A1A1A] hover:bg-[#222] text-[#C5A267] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#2D2D2D] hover:border-[#C5A267]/40 transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "U kopjua!" : "Kopjo"}
                </button>
                <button
                  onClick={() => handleDownload("requirements.txt", requirementsCode)}
                  className="bg-[#C5A267] hover:bg-[#D5B277] font-bold text-[#0A0A0A] text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Shkarko_req.txt
                </button>
              </div>
            </div>

            {/* Code Block Container */}
            <div className="relative border border-[#2A2A2A] rounded-xl overflow-hidden bg-[#0D0D0D]/95 p-4">
              <pre className="text-xs font-mono text-[#CCC] whitespace-pre">
                {requirementsCode}
              </pre>
            </div>

            <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A] text-xs text-zinc-400 flex flex-col gap-2">
              <p className="font-semibold text-white font-mono uppercase text-[#C5A267] text-[10px] tracking-wider">Çfarë ka në requirements.txt?</p>
              <ul className="list-disc list-inside space-y-1.5 text-zinc-400">
                <li><span className="text-[#C5A267] font-semibold font-mono">streamlit</span>: Paketa kryesore për krijimin e aplikacionit UI.</li>
                <li><span className="text-[#C5A267] font-semibold font-mono">pandas</span>: Për strukturimin e të dhënave në DataFrames.</li>
                <li><span className="text-[#C5A267] font-semibold font-mono">plotly</span>: Për vizualizimin interaktiv të grafikëve Bar, Line, dhe Pie që përputhen me kodin.</li>
              </ul>
            </div>
          </div>
        )}

        {/* === TAB 3: Guide === */}
        {activeTab === "deploy_guide" && (
          <div className="flex flex-col gap-5 text-[#E0E0E0]">
            <div>
              <span className="text-xs font-bold text-[#C5A267] uppercase tracking-widest block mb-0.5 font-mono">Udhëzuesi i Publikimit</span>
              <h3 className="text-lg font-bold text-white font-serif italic text-xl">Si të vendosni aplikacionin tuaj live në internet</h3>
              <p className="text-xs text-[#999] mt-1">Ndiqni hapat e thjeshtë më poshtë për të publikuar kodin e gjeneruar në Streamlit Cloud:</p>
            </div>

            {/* Timeline Steps */}
            <div className="relative pl-6 border-l border-[#2D2D2D] flex flex-col gap-6 font-sans">
              
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-[35px] top-0 bg-[#0F0F0F] border-2 border-[#C5A267] text-[#C5A267] rounded-full w-6 h-6 flex items-center justify-center text-xs font-extrabold shadow-sm font-mono">
                  1
                </span>
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-[#C5A267]" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-xs">Ruaje kodin në GitHub</h4>
                </div>
                <div className="mt-2 text-xs text-zinc-400 flex flex-col gap-2 bg-[#161616] p-4 rounded-xl border border-[#242424]">
                  <p>
                    1. Hyni në llogarinë tuaj në <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[#C5A267] hover:underline font-semibold inline-flex items-center gap-0.5">GitHub.com <ExternalLink className="w-3 h-3" /></a> (krijoni një nëse nuk keni).
                  </p>
                  <p>
                    2. Kliko butonin <strong>"New"</strong> ose <strong>"New repository"</strong>.
                  </p>
                  <p>
                    3. Vendosni një emër te bukur, p.sh., <code className="bg-[#1C1C1C] border border-[#2D2D2D] px-1.5 py-0.5 rounded text-[#C5A267] text-[11px] font-mono">streamlit-vizualizuesi</code>, bëjeni atë <strong>Public</strong>, dhe klikoni <strong>"Create Repository"</strong>.
                  </p>
                  <p>
                    4. Ngarkoni dy skedarët e shkarkuar: <code className="text-[#C5A267] font-mono font-semibold">app.py</code> dhe <code className="text-[#C5A267] font-mono font-semibold">requirements.txt</code> direkt në degën kryesore (branch <code className="bg-[#1C1C1C] px-1.5 py-0.5 rounded border border-[#2D2D2D] text-[#CCC] text-[11px] font-mono font-semibold">main</code>).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-[35px] top-0 bg-[#0F0F0F] border-2 border-[#C5A267] text-[#C5A267] rounded-full w-6 h-6 flex items-center justify-center text-xs font-extrabold shadow-sm font-mono">
                  2
                </span>
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-[#C5A267]" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-xs">Lidhu me Streamlit Cloud</h4>
                </div>
                <div className="mt-2 text-xs text-zinc-400 flex flex-col gap-2 bg-[#161616] p-4 rounded-xl border border-[#242424]">
                  <p>
                    1. Shkoni te <a href="https://share.streamlit.io" target="_blank" rel="noopener noreferrer" className="text-[#C5A267] hover:underline font-semibold inline-flex items-center gap-0.5">Streamlit Community Cloud <ExternalLink className="w-3 h-3" /></a> dhe klikoni <strong>"Sign In"</strong>.
                  </p>
                  <p>
                    2. Zgjidhni <strong>"Continue with GitHub"</strong> për të lidhur llogarinë tuaj në mënyrë të drejtpërdrejtë.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span className="absolute -left-[35px] top-0 bg-[#0F0F0F] border-2 border-[#C5A267] text-[#C5A267] rounded-full w-6 h-6 flex items-center justify-center text-xs font-extrabold shadow-sm font-mono">
                  3
                </span>
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#C5A267]" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-xs">Publikoni Aplikacionin (Deploy)</h4>
                </div>
                <div className="mt-2 text-xs text-zinc-400 flex flex-col gap-2 bg-[#161616] p-4 rounded-xl border border-[#242424]">
                  <p>
                    1. Klikoni butonin <strong className="text-[#0A0A0A] bg-[#C5A267] px-2 py-0.5 rounded text-[11px] font-bold">"New App"</strong> në panelin tuaj të Streamlit Community Cloud.
                  </p>
                  <p>
                    2. Zgjidhni repository-n tuaj të ri, degën (<code className="text-slate-250 font-mono">main</code>), dhe vendosni emrin e skedarit kryesor si <code className="text-[#C5A267] font-mono font-semibold">app.py</code>.
                  </p>
                  <p>
                    3. Klikoni butonin e madh <strong>"Deploy!"</strong>.
                  </p>
                  <p>
                    4. Streamlit do te instalojë bibliotekat nga <code className="text-slate-300 font-mono">requirements.txt</code> dhe aplikacioni juaj do të jetë LIVE në një URL të veçantë!
                  </p>
                </div>
              </div>

            </div>

            <div className="p-4 bg-[#122116] text-[#A6E2B7] rounded-xl border border-[#1F3E26] text-xs flex items-center gap-2.5">
              <span>🚀 Aplikacioni juaj u krye! Duke bërë këto tre hapa, ju mund ta shpërndani projektin tuaj kudo që të dëshironi dhe ai do të jetë plotësisht funksional.</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
