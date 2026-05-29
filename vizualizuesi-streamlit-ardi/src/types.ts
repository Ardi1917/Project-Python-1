export interface DataItem {
  id: string;
  name: string;
  category: string;
  value: number;
  quantity: number;
}

export interface FilterState {
  category: string; // "Të gjitha" or a specific category
  minValue: number;
  minQuantity: number;
}

export const CATEGORIES = [
  "Shitje",
  "Marketing",
  "Zhvillim",
  "Operacionale",
  "Logjistikë",
  "Tjera"
];

export const DEFAULT_DATA: DataItem[] = [
  { id: "1", name: "Produkti Premium", category: "Shitje", value: 1500, quantity: 12 },
  { id: "2", name: "Fushata Google Ads", category: "Marketing", value: 450, quantity: 5 },
  { id: "3", name: "Licenca Serverash", category: "Zhvillim", value: 950, quantity: 8 },
  { id: "4", name: "Mbështetje Teknike", category: "Operacionale", value: 300, quantity: 15 },
  { id: "5", name: "Kosto Logjistike", category: "Logjistikë", value: 600, quantity: 3 },
  { id: "6", name: "Produkti Standard", category: "Shitje", value: 800, quantity: 20 },
  { id: "7", name: "Fushata Social Media", category: "Marketing", value: 350, quantity: 4 },
  { id: "8", name: "Trajnim Pune", category: "Tjera", value: 200, quantity: 10 }
];
