import { useState } from "react";
import { DataItem, FilterState, DEFAULT_DATA } from "./types";
import StreamlitPreview from "./components/StreamlitPreview";
import CodeExporter from "./components/CodeExporter";
import { Terminal, Code2, Layers, GitBranch, Sparkles } from "lucide-react";

export default function App() {
  // State for dataset (preset loaded first, can be modified inside app)
  const [data, setData] = useState<DataItem[]>(DEFAULT_DATA);

  // Filter state
  const [filterState, setFilterState] = useState<FilterState>({
    category: "Të gjitha",
    minValue: 0,
    minQuantity: 1
  });

  // Action: Add a new data item
  const handleAddItem = (newItem: Omit<DataItem, "id">) => {
    const id = (Math.max(...data.map(item => Number(item.id)), 0) + 1).toString();
    setData(prev => [...prev, { id, ...newItem }]);
  };

  // Action: Delete an item from dataset
  const handleDeleteItem = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  // Action: Reset dataset to original defaults
  const handleResetData = () => {
    setData(DEFAULT_DATA);
    setFilterState({
      category: "Të gjitha",
      minValue: 0,
      minQuantity: 1
    });
  };  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] flex flex-col font-sans select-none antialiased">
      
      {/* Dynamic Header */}
      <header className="bg-[#121212] border-b border-[#2A2A2A] sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#C5A267] to-[#8a6a3b] text-[#0A0A0A] p-2.5 rounded-xl shadow-lg shadow-gold-500/10 flex items-center justify-center">
              <Terminal className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-serif italic text-[#C5A267] tracking-wide">
                  Vizualizuesi Streamlit
                </h1>
                <span className="bg-[#C5A267]/10 text-[#C5A267] border border-[#C5A267]/30 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase font-mono">
                  v1.2
                </span>
              </div>
              <p className="text-[10px] text-[#666] uppercase tracking-wider font-semibold">Platformë simulimi dhe gjenerimi të kodit Python</p>
            </div>
          </div>

          {/* Quick Technical Badges */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-[#999]">
            <div className="flex items-center gap-1.5 bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#2A2A2A]">
              <Code2 className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>Python 3.10+</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1A1A] px-3 py-1.5 rounded-lg border border-[#2A2A2A]">
              <Layers className="w-3.5 h-3.5 text-[#C5A267]" />
              <span>Streamlit Cloud</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 min-h-0">
        
        {/* Welcome Pitch Board */}
        <div className="bg-gradient-to-r from-[#121212] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-3xl flex flex-col gap-1.5 z-10">
            <h2 className="text-xl font-serif text-[#C5A267] italic tracking-wide flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A267]" />
              Ndërto Aplikacionin tënd të parë Python në Streamlit!
            </h2>
            <p className="text-xs text-[#999] leading-relaxed">
              Përdorni menunë anësore (sidebar) për të shtuar dhe filtruar vlerat dinamike direkt në këtë simulator. Çdo herë që kryeni ndryshime të dhënave, kodi përkatës Python i plotësuar me kontributun tuaj përditësohet në kohë reale në panelin e djathtë, gati për t'u shkarkuar së bashku me skedarin <code className="bg-[#1A1A1A] px-1.5 py-0.5 border border-[#333] rounded font-mono font-bold text-[#C5A267] text-[10px]">requirements.txt</code>!
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 z-10">
            <button 
              onClick={handleResetData}
              className="px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] text-[#C5A267] font-semibold border border-[#333] hover:border-[#C5A267]/50 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md transition duration-250 active:scale-95 text-center mt-2 sm:mt-0 font-mono"
            >
              <GitBranch className="w-4 h-4 text-[#C5A267]" />
              RIVENDOS DATASETIN
            </button>
          </div>
          
          {/* Visual decorative accents */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gradient-to-tr from-[#C5A267]/5 to-transparent rounded-full filter blur-2xl opacity-80" />
        </div>

        {/* WORKSPACE SIDE BY SIDE SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch flex-1 min-h-0">
          
          {/* COLUMN 1: Live Interactive Streamlit Simulator */}
          <div className="flex flex-col h-full min-h-[500px]">
            <StreamlitPreview
              data={data}
              onAdd={handleAddItem}
              onDelete={handleDeleteItem}
              onReset={handleResetData}
              filterState={filterState}
              setFilterState={setFilterState}
            />
          </div>

          {/* COLUMN 2: Python Code & Deployment Station */}
          <div className="flex flex-col h-full min-h-[500px]">
            <CodeExporter
              data={data}
            />
          </div>

        </div>

      </main>

      {/* Simple Footer */}
      <footer className="bg-[#121212] border-t border-[#2A2A2A] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="text-xs text-[#666] uppercase tracking-widest font-mono">
            © 2026 Vizualizuesi Streamlit. Ndërtuar për zhvilluesit e Python.
          </p>
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#444] tracking-widest uppercase">
            <span>app.py & requirements.txt u krijuan me sukses</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
