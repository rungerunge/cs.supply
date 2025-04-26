// Types for CS:GO skins and marketplace data

export interface Skin {
  id: string;
  name: string;
  type: string;
  weapon: string;
  rarity: string;
  exterior: string;
  price: number;
  marketPrice: number; // Price with 5% markup
  float: number;
  imageUrl: string;
  stickers?: Sticker[];
  isStatTrak: boolean;
  isSouvenir: boolean;
  phase?: string;
  pattern?: string;
}

export interface Sticker {
  id: string;
  name: string;
  wear?: number;
  imageUrl: string;
}

export interface PriceHistory {
  date: string;
  price: number;
}

export interface FilterOptions {
  type?: string[];
  rarity?: string[];
  exterior?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  float?: {
    min: number;
    max: number;
  };
  hasStickers?: boolean;
  isStatTrak?: boolean;
  isSouvenir?: boolean;
}

export interface SortOptions {
  field: 'price' | 'float' | 'name';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface InventoryResponse {
  items: Skin[];
  total: number;
  page: number;
  totalPages: number;
} 