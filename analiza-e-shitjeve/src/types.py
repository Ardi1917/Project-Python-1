export interface DataItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  date: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  searchQuery: string;
  sortBy: 'name' | 'price' | 'quantity' | 'total';
  sortOrder: 'asc' | 'desc';
}

export type ChartType = 'bar' | 'line' | 'pie';
