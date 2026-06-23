import React, { useState } from 'react';
import { CATEGORIES } from '../data';
import { DataItem, FilterState } from '../types';
import { PlusCircle, Filter, RotateCcw, Sparkles, Terminal } from 'lucide-react';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onAddItem: (item: Omit<DataItem, 'id' | 'date'>) => void;
  onResetData: () => void;
  onShowPythonCode: () => void;
  maxPriceInData: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  filters,
  setFilters,
  onAddItem,
  onResetData,
  onShowPythonCode,
  maxPriceInData,
}) => {
  // Local state for Add Item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Elektronikë');
  const [price, setPrice] = useState('120');
  const [quantity, setQuantity] = useState('10');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isNaN(Number(price)) || isNaN(Number(quantity))) return;

    onAddItem({
      name: name.trim(),
      category,
      price: Math.max(1, parseFloat(price)),
      quantity: Math.max(1, parseInt(quantity, 10)),
    });

    setName('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <aside className="w-80 shrink-0 bg-slate-100 border-r border-slate-200 flex flex-col h-full overflow-y-auto">
      {/* Streamlit App Brand */}
      <div className="p-6 pb-4 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-red-500/30">
            st
          </div>
          <div>
            <span className="font-bold text-slate-800 tracking-tight block leading-tight">Streamlit App</span>
            <span className="text-[10px] text-slate-400 font-mono">v1.32.0 Python Engine</span>
          </div>
        </div>
        <button
          onClick={onShowPythonCode}
          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Shikoni kodin Python Streamlit"
        >
          <Terminal className="w-3.5 h-3.5 text-red-500" />
          <span>app.py</span>
        </button>
      </div>

      <div className="p-6 space-y-8 flex-1">
        {/* Section 1: Shtimi i të Dhënave (st.sidebar.text_input & number_input) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <PlusCircle className="w-4 h-4 text-red-500" />
            <span>1. Shtimi i të Dhënave</span>
          </div>

          <form onSubmit={handleAddItem} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="space-y-1">
              <label htmlFor="prod-name" className="text-xs font-medium text-slate-700 flex justify-between">
                <span>Emri i produktit</span>
                <span className="text-[10px] font-mono text-slate-400">text_input()</span>
              </label>
              <input
                id="prod-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="p.sh. Tablet iPad Air"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="prod-cat" className="text-xs font-medium text-slate-700 flex justify-between">
                <span>Kategoria</span>
                <span className="text-[10px] font-mono text-slate-400">selectbox()</span>
              </label>
              <select
                id="prod-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              >
                {CATEGORIES.filter((c) => c !== 'Të gjitha').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label htmlFor="prod-price" className="text-xs font-medium text-slate-700 block truncate">
                  Çmimi (€) <span className="text-[9px] font-mono text-slate-400">number_input</span>
                </label>
                <input
                  id="prod-price"
                  type="number"
                  min="1"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="prod-qty" className="text-xs font-medium text-slate-700 block truncate">
                  Sasia <span className="text-[9px] font-mono text-slate-400">number_input</span>
                </label>
                <input
                  id="prod-qty"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-red-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shto Artikull Në Tabelë</span>
            </button>

            {successMsg && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded text-center animate-fade-in font-medium">
                ✔ Artikulli u shto me sukses!
              </div>
            )}
          </form>
        </div>

        {/* Section 2: Filtrimi i të Dhënave (st.sidebar.selectbox & slider) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-red-500" />
            <span>2. Filtrimi Dinamik</span>
          </div>

          <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            {/* Search Input */}
            <div className="space-y-1">
              <label htmlFor="filter-search" className="text-xs font-medium text-slate-700 flex justify-between">
                <span>Kërko sipas emrit</span>
                <span className="text-[10px] font-mono text-slate-400">text_input()</span>
              </label>
              <input
                id="filter-search"
                type="text"
                placeholder="Filtro produktet..."
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>

            {/* Selectbox for category */}
            <div className="space-y-1">
              <label htmlFor="filter-cat" className="text-xs font-medium text-slate-700 flex justify-between">
                <span>Zgjidh Kategorinë</span>
                <span className="text-[10px] font-mono text-slate-400">selectbox()</span>
              </label>
              <select
                id="filter-cat"
                value={filters.category}
                onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-medium text-slate-700">
                <span>Çmimi Maksimal (€)</span>
                <span className="text-[10px] font-mono text-slate-400">slider()</span>
              </div>
              <div className="pt-1">
                <input
                  type="range"
                  min="0"
                  max={Math.max(500, maxPriceInData)}
                  step="50"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: [prev.priceRange[0], parseFloat(e.target.value)],
                    }))
                  }
                  className="w-full accent-red-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-500 font-semibold">
                <span>€0</span>
                <span className="text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                  ≤ €{filters.priceRange[1]}
                </span>
                <span>€{Math.max(500, Math.ceil(maxPriceInData))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Reset Button */}
      <div className="p-4 border-t border-slate-200 bg-slate-200/50">
        <button
          onClick={onResetData}
          className="w-full py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kthe të Dhënat Fillestare</span>
        </button>
      </div>
    </aside>
  );
};
