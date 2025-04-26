import axios from 'axios';
import { ApiResponse, Skin, InventoryResponse, FilterOptions, SortOptions, PaginationOptions } from '../types/skin';

const API_KEY = '181ae483-7513-4c2a-8230-3c4e48333f01';
const BASE_URL = 'https://api.lis-skins.ru';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Calculate markup price (5% increase)
const calculateMarkupPrice = (basePrice: number): number => {
  return basePrice * 1.05;
};

// Format skin data from API response
const formatSkinData = (rawSkin: any): Skin => {
  return {
    id: rawSkin.id,
    name: rawSkin.name,
    type: rawSkin.type,
    weapon: rawSkin.weapon,
    rarity: rawSkin.rarity,
    exterior: rawSkin.exterior,
    price: rawSkin.price,
    marketPrice: calculateMarkupPrice(rawSkin.price),
    float: rawSkin.float,
    imageUrl: rawSkin.imageUrl,
    stickers: rawSkin.stickers,
    isStatTrak: rawSkin.isStatTrak || false,
    isSouvenir: rawSkin.isSouvenir || false,
    phase: rawSkin.phase,
    pattern: rawSkin.pattern,
  };
};

// API functions
export const api_functions = {
  // Get available skins with filtering, sorting, and pagination
  getInventory: async (
    filters?: FilterOptions,
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<ApiResponse<InventoryResponse>> => {
    try {
      const response = await api.get('/inventory', {
        params: {
          ...filters,
          ...sort,
          ...pagination,
        },
      });

      const formattedItems = response.data.items.map(formatSkinData);

      return {
        success: true,
        data: {
          items: formattedItems,
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        data: { items: [], total: 0, page: 1, totalPages: 0 },
        error: error.message,
      };
    }
  },

  // Get detailed information for a specific skin
  getSkinDetails: async (skinId: string): Promise<ApiResponse<Skin>> => {
    try {
      const response = await api.get(`/skins/${skinId}`);
      return {
        success: true,
        data: formatSkinData(response.data),
      };
    } catch (error: any) {
      return {
        success: false,
        data: {} as Skin,
        error: error.message,
      };
    }
  },

  // Get price history for a specific skin
  getPriceHistory: async (skinId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get(`/skins/${skinId}/price-history`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }
  },
};

export default api; 