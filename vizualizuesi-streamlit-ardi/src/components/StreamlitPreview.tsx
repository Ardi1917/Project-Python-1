import React, { useState } from "react";
import { DataItem, FilterState, CATEGORIES } from "../types";
import { Trash2, Plus, RefreshCw, BarChart2, TrendingUp, PieChart as PieIcon, TableProperties, CircleAlert } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

interface StreamlitPreviewProps {
  data: DataItem[];
  onAdd: (item: Omit<DataItem, "id">) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Shitje": "#C5A267", // Warm Gold
  "Marketing": "#D5B277", // Bright Warm Gold
  "Zhvillim": "#A38350", // Antique Gold
  "Operacionale": "#876B3F", // Deep Bronze
  "Logjistikë": "#6C542E", // Dark Olive Gold
  "Tjera": "#4E3C1E" // Intense Dark Amber
};

export default function StreamlitPreview({
  data,
  onAdd,
  onDelete,
  onReset,
  filterState,
  setFilterState
}: StreamlitPreviewProps) {
  // Local state for sidebar input values (adding new item)
  const [newName, setNewName] = useState("Aktiviteti i Ri");
  const [newCategory, setNewCategory] = useState("Shitje");
  const [newValue, setNewValue] = useState(500);
  const [newQuantity, setNewQuantity] = useState(5);
  
  // Alert message simulators
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Categories list derived from current data
  const uniqueCategories = ["Të gjitha", ...Array.from(new Set(data.map(item => item.category)))];

  // Active chart type state
  const [chartType, setChartType] = useState<"bar" | "pie" | "line">("bar");

  // Filtering data based on FilterState
  const filteredData = data.filter(item => {
    const categoryMatch = filterState.category === "Të gjitha" || item.category === filterState.category;
    const valueMatch = item.value >= filterState.minValue;
    return categoryMatch && valueMatch;
  });

  // Calculation of statistics
  const totalValue = filteredData.reduce((sum, item) => sum + item.value, 0);
  const totalQuantity = filteredData.reduce((sum, item) => sum + item.quantity, 0);
  const averageValue = filteredData.length > 0 ? totalValue / filteredData.length : 0;

  // Chart aggregation for Pie Chart (value sum grouped by category)
  const pieData = Object.entries(
    filteredData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.value;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAdd({
      name: newName,
      category: newCategory,
      value: newValue,
      quantity: newQuantity
    });

    setSuccessMessage(`✓ '${newName}' u shtua me sukses!`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);

    // Reset some values
    setNewName("Aktiviteti i Ri");
    setNewValue(500);
    setNewQuantity(5);
  };

  return (
    <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden shadow-2xl flex flex-col h-full font-sans">
      {/* Streamlit Top Red Line Decoration */}
      <div className="h-1 w-full bg-[#C5A267]" />

      {/* Frame Header mimicking a deployed URL preview or tab */}
      <div className="bg-[#1A1A1A] border-b border-[#2A2A2A] px-4 py-2.5 flex items-center justify-between text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff4b4b]/20 border border-[#ff4b4b]/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/20 border border-yellow-400/50" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/20 border border-green-400/50" />
          <span className="ml-2 font-semibold text-zinc-400">streamlit_app.py</span>
        </div>
        <div className="bg-[#121212] border border-[#2A2A2A] text-[#C5A267] rounded px-2.5 py-0.5">
          Localhost:8501
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row min-h-0">
        
        {/* === SIMULATED SIDEBAR === */}
        <div className="w-full md:w-80 bg-[#161616] p-5 border-r border-[#2A2A2A] overflow-y-auto flex flex-col gap-6 select-none sm:max-h-[500px] md:max-h-none">
          <div>
            <h2 className="text-xs font-mono tracking-widest text-[#C5A267] uppercase mb-1">⚙️ Konfigurimi & Filtrimi</h2>
            <p className="text-[10px] text-[#666]">Pjesa e kontrollit nga st.sidebar</p>
          </div>

          {/* Add Data Section */}
          <div className="bg-[#121212] p-4 rounded-xl border border-[#2A2A2A]">
            <h3 className="text-[11px] font-mono font-semibold text-slate-300 uppercase flex items-center gap-1.5 mb-3">
              <Plus className="w-3.5 h-3.5 text-[#C5A267]" />
              Shto të Dhëna të Reja
            </h3>
            
            <form onSubmit={handleAddNewItem} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#888] mb-1">
                  Emri i Aktivitetit/Produktit <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C5A267] focus:border-[#C5A267] transition"
                  placeholder="P.sh. Produkt i ri"
                />
                <span className="text-[9px] text-[#555] font-mono mt-0.5 block">st.sidebar.text_input()</span>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#888] mb-1">Kategoria</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C5A267] transition cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <span className="text-[9px] text-[#555] font-mono mt-0.5 block">st.sidebar.selectbox()</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#888] mb-1">Vlera (Euro)</label>
                  <input
                    type="number"
                    min="0"
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C5A267] transition"
                  />
                  <span className="text-[9px] text-[#555] font-mono mt-0.5 block">st.sidebar.number_input()</span>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#888] mb-1">Sasia</label>
                  <input
                    type="number"
                    min="1"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C5A267] transition"
                  />
                  <span className="text-[9px] text-[#555] font-mono mt-0.5 block">st.sidebar.number_input()</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-1.5 w-full bg-[#C5A267] hover:bg-[#D5B277] text-[#0A0A0A] text-xs font-bold py-1.5 rounded transition tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Shto në Dataset
              </button>
            </form>
          </div>

          {/* Filtering Section */}
          <div className="bg-[#121212] p-4 rounded-xl border border-[#2A2A2A] shadow-md flex flex-col gap-4">
            <div>
              <h3 className="text-[11px] font-mono font-semibold text-slate-300 uppercase flex items-center gap-1.5 mb-1">
                Filtro të Dhënat
              </h3>
              <p className="text-[10px] text-[#666]">Filtrat ndryshojnë visualizimin në kohë reale</p>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#888] mb-1">Filtro sipas Kategorisë</label>
              <select
                value={filterState.category}
                onChange={(e) => setFilterState(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#C5A267] transition cursor-pointer"
              >
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span className="text-[9px] text-[#555] font-mono mt-0.5 block">st.sidebar.selectbox()</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#888]">Vlera Minimale</label>
                <span className="text-xs font-bold font-mono text-[#C5A267]">{filterState.minValue} €</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={filterState.minValue}
                onChange={(e) => setFilterState(prev => ({ ...prev, minValue: Number(e.target.value) }))}
                className="w-full accent-[#C5A267] cursor-pointer"
              />
              <span className="text-[9px] text-[#555] font-mono mt-0.5 block">st.sidebar.slider()</span>
            </div>
            
            <button
              onClick={onReset}
              className="mt-1 border border-[#2B2B2B] hover:border-[#C5A267]/30 bg-[#121212] hover:bg-[#1A1A1A] text-[#999] hover:text-[#C5A267] text-[10px] font-mono tracking-wider uppercase py-1.5 rounded transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#C5A267]" />
              Rivendos defaultet
            </button>
          </div>
        </div>

        {/* === MAIN STREAMLIT APP WINDOW === */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-[#121212]">
          
          {/* Main Title Block */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-[#C5A267]/10 text-[#C5A267] border border-[#C5A267]/20 rounded text-[9px] font-mono font-bold tracking-widest uppercase">
                Streamlit App
              </span>
            </div>
            <h1 className="text-2xl font-serif text-white tracking-wide">
              📊 Vizualizuesi i të Dhënave Streamlit
            </h1>
            <p className="text-xs text-[#999] mt-1 max-w-2xl leading-relaxed">
              Ky panel simulon saktësisht se si punon kodi Python i Streamlit që do të shkarkoni. Të dhënat mund të shtohen, fshihen dhe filtrohen në kohë reale.
            </p>
          </div>

          {/* Toast Message Simulator */}
          {successMessage && (
            <div className="bg-[#172E1F] border border-emerald-500/20 text-emerald-400 rounded-xl p-3 text-xs flex items-center justify-between shadow-md animate-fade-in font-mono">
              <span className="font-semibold">{successMessage}</span>
              <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 border border-emerald-500/30 rounded text-emerald-300 ml-4 shrink-0">
                st.sidebar.success()
              </span>
            </div>
          )}

          {/* STATISTICS METRICS GRID */}
          <div>
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">
              ⚡ st.columns() Metrikat
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#161616] border border-[#2A2A2A] p-4 rounded-xl relative overflow-hidden flex flex-col shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#666]">Totali i Vlerës</span>
                <span className="text-xl font-serif text-[#C5A267] mt-1">
                  {totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })} €
                </span>
                <span className="text-[9px] text-[#444] font-mono absolute top-2 right-2">st.metric()</span>
              </div>

              <div className="bg-[#161616] border border-[#2A2A2A] p-4 rounded-xl relative overflow-hidden flex flex-col shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#666]">Sasia Totale</span>
                <span className="text-xl font-serif text-[#C5A267] mt-1">
                  {totalQuantity.toLocaleString()} njësi
                </span>
                <span className="text-[9px] text-[#444] font-mono absolute top-2 right-2">st.metric()</span>
              </div>

              <div className="bg-[#161616] border border-[#2A2A2A] p-4 rounded-xl relative overflow-hidden flex flex-col shadow-sm">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#666]">Mesatarja e Vlerës</span>
                <span className="text-xl font-serif text-[#C5A267] mt-1">
                  {averageValue.toLocaleString("en-US", { minimumFractionDigits: 2 })} €
                </span>
                <span className="text-[9px] text-[#444] font-mono absolute top-2 right-2">st.metric()</span>
              </div>
            </div>
          </div>

          {/* SCREEN CONTENT GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Table Representation */}
            <div className="xl:col-span-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <TableProperties className="w-4 h-4 text-[#C5A267]" strokeWidth={1.5} />
                  Tabela Dinamike
                </h3>
                <span className="text-[10px] font-mono text-[#C5A267] bg-[#C5A267]/10 px-1.5 rounded py-0.5 border border-[#C5A267]/20">
                  st.dataframe()
                </span>
              </div>

              <div className="border border-[#2A2A2A] rounded-xl overflow-hidden bg-[#161616] max-h-[300px] overflow-y-auto shadow-inner">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1A1A1A] text-[#999] font-mono uppercase text-[10px] border-b border-[#2A2A2A] select-none text-left">
                      <th className="p-2.5">Emri</th>
                      <th className="p-2.5">Kategoria</th>
                      <th className="p-2.5 text-right font-normal">Vlera</th>
                      <th className="p-2.5 text-right font-normal block lg:table-cell">Sasi</th>
                      <th className="p-2.5 text-center font-normal">Fshi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242424] font-mono text-[#CCC]">
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-[#1E1E1E] transition-colors">
                          <td className="p-2.5 font-sans font-medium text-white truncate max-w-[120px]" title={item.name}>
                            {item.name}
                          </td>
                          <td className="p-2.5">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-mono border text-white truncate inline-block"
                              style={{ 
                                backgroundColor: `${CATEGORY_COLORS[item.category]}20` || "#1a1a1a",
                                borderColor: CATEGORY_COLORS[item.category] || "#333",
                                color: CATEGORY_COLORS[item.category] || "#CCC"
                              }}
                            >
                              {item.category}
                            </span>
                          </td>
                          <td className="p-2.5 text-right font-bold text-[#C5A267]">{item.value} €</td>
                          <td className="p-2.5 text-right text-slate-400">{item.quantity}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => onDelete(item.id)}
                              className="text-zinc-650 hover:text-red-400 transition-colors p-1 rounded hover:bg-[#222] inline-flex items-center justify-center cursor-pointer"
                              title="Fshi këtë aktivitet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-[#555] font-sans">
                          Nuk u gjet asnjë rekord që përputhet me filtrat e zgjedhur.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 bg-[#C5A267]/5 border border-[#C5A267]/10 rounded px-3 py-2 mt-1 font-sans">
                <CircleAlert className="w-3.5 h-3.5 text-[#C5A267] shrink-0" />
                <span>Mund të fshini rreshta direkt duke klikuar koshin për të ndryshuar datasetin.</span>
              </div>
            </div>

            {/* Graphics Representation (Recharts) */}
            <div className="xl:col-span-7 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    📈 Vizualizimi Grafik
                  </h3>
                  <div className="flex bg-[#161616] border border-[#2A2A2A] rounded-lg p-0.5 text-xs text-zinc-400 ml-2">
                    <button
                      onClick={() => setChartType("bar")}
                      className={`px-2 py-0.5 rounded flex items-center gap-1.5 transition cursor-pointer ${chartType === "bar" ? "bg-[#C5A267] font-bold text-[#0A0A0A] shadow-sm" : "hover:text-white"}`}
                    >
                      <BarChart2 className="w-3.5 h-3.5" /> Bar
                    </button>
                    <button
                      onClick={() => setChartType("pie")}
                      className={`px-2 py-0.5 rounded flex items-center gap-1.5 transition cursor-pointer ${chartType === "pie" ? "bg-[#C5A267] font-bold text-[#0A0A0A] shadow-sm" : "hover:text-white"}`}
                    >
                      <PieIcon className="w-3.5 h-3.5" /> Pie
                    </button>
                    <button
                      onClick={() => setChartType("line")}
                      className={`px-2 py-0.5 rounded flex items-center gap-1.5 transition cursor-pointer ${chartType === "line" ? "bg-[#C5A267] font-bold text-[#0A0A0A] shadow-sm" : "hover:text-white"}`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" /> Line
                    </button>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#C5A267] bg-[#C5A267]/10 px-1.5 rounded py-0.5 border border-[#C5A267]/20">
                  st.plotly_chart()
                </span>
              </div>

              <div className="border border-[#2A2A2A] rounded-xl p-4 bg-[#161616] min-h-[300px] flex items-center justify-center shadow-lg">
                {filteredData.length > 0 ? (
                  <div className="w-full h-72">
                    
                    {chartType === "bar" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#666" }} stroke="#333" />
                          <YAxis tick={{ fontSize: 10, fill: "#666" }} stroke="#333" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", color: "#FFF", borderRadius: "8px", fontSize: "11px" }}
                            formatter={(value: any) => [`${value} €`, "Vlera"]}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {filteredData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || "#C5A267"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {chartType === "pie" && (
                      pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || "#C5A267"} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", color: "#FFF", borderRadius: "8px", fontSize: "11px" }}
                              formatter={(value: any) => [`${value} €`, "Suma e vlerave"]}
                            />
                            <Legend wrapperStyle={{ fontSize: "11px", marginTop: "10px", color: "#888" }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-center text-[#555] text-xs">Ska të dhëna të mjaftueshme</div>
                      )
                    )}

                    {chartType === "line" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#666" }} stroke="#333" />
                          <YAxis tick={{ fontSize: 10, fill: "#666" }} stroke="#333" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#1A1A1A", border: "1px solid #333", color: "#FFF", borderRadius: "8px", fontSize: "11px" }}
                            formatter={(value: any) => [value, "Sasia"]}
                          />
                          <Line
                            type="monotone"
                            dataKey="quantity"
                            stroke="#C5A267"
                            strokeWidth={2}
                            activeDot={{ r: 6, fill: "#D5B277" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}

                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center justify-center p-8 gap-1">
                    <BarChart2 className="w-10 h-10 text-zinc-700 stroke-[1.5]" />
                    <p className="text-sm font-medium text-[#666]">Nuk ka të dhëna për vizualizim</p>
                    <p className="text-xs text-[#444]">Rregulloni filtrat ose shtoni të dhëna në sidebar</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
