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
  timeout: 15000, // 15 seconds timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params || {});
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Error handling interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.statusText}`, 
      response.data ? { items: response.data.items?.length || 0, total: response.data.total } : {});
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
    }
    console.error('API Error Config:', error.config);
    return Promise.reject(error);
  }
);

// Calculate markup price (5% increase)
const calculateMarkupPrice = (basePrice: number): number => {
  return basePrice * 1.05;
};

// Format skin data from API response
const formatSkinData = (rawSkin: any): Skin => {
  try {
    return {
      id: rawSkin.id || `unknown-${Math.random().toString(36).substring(2, 9)}`,
      name: rawSkin.name || 'Unknown Skin',
      type: rawSkin.type || 'Unknown',
      weapon: rawSkin.weapon || 'Unknown',
      rarity: rawSkin.rarity || 'Unknown',
      exterior: rawSkin.exterior || 'Unknown',
      price: parseFloat(rawSkin.price) || 0,
      marketPrice: calculateMarkupPrice(parseFloat(rawSkin.price) || 0),
      float: parseFloat(rawSkin.float) || 0,
      imageUrl: rawSkin.imageUrl || '',
      stickers: Array.isArray(rawSkin.stickers) ? rawSkin.stickers.map((sticker: any) => ({
        id: sticker.id || `sticker-${Math.random().toString(36).substring(2, 9)}`,
        name: sticker.name || 'Unknown Sticker',
        wear: parseFloat(sticker.wear) || 0,
        imageUrl: sticker.imageUrl || '',
      })) : [],
      isStatTrak: Boolean(rawSkin.isStatTrak),
      isSouvenir: Boolean(rawSkin.isSouvenir),
      phase: rawSkin.phase || undefined,
      pattern: rawSkin.pattern || undefined,
    };
  } catch (error) {
    console.error('Error formatting skin data:', error, rawSkin);
    // Return a minimal valid skin object if formatting fails
    return {
      id: `error-${Math.random().toString(36).substring(2, 9)}`,
      name: 'Error Loading Skin',
      type: 'Unknown',
      weapon: 'Unknown',
      rarity: 'Unknown',
      exterior: 'Unknown',
      price: 0,
      marketPrice: 0,
      float: 0,
      imageUrl: '',
      stickers: [],
      isStatTrak: false,
      isSouvenir: false,
    };
  }
};

// Prepare filter parameters for API request
const prepareFilterParams = (filters?: FilterOptions) => {
  if (!filters) return {};
  
  const params: Record<string, any> = {};
  
  // Handle arrays of strings
  if (filters.type?.length) params.type = filters.type.join(',');
  if (filters.rarity?.length) params.rarity = filters.rarity.join(',');
  if (filters.exterior?.length) params.exterior = filters.exterior.join(',');
  
  // Handle price range
  if (filters.priceRange) {
    if (filters.priceRange.min !== undefined) params.minPrice = filters.priceRange.min;
    if (filters.priceRange.max !== undefined && filters.priceRange.max !== Infinity) params.maxPrice = filters.priceRange.max;
  }
  
  // Handle float range
  if (filters.float) {
    if (filters.float.min !== undefined) params.minFloat = filters.float.min;
    if (filters.float.max !== undefined) params.maxFloat = filters.float.max;
  }
  
  // Handle boolean filters
  if (filters.hasStickers !== undefined) params.hasStickers = filters.hasStickers;
  if (filters.isStatTrak !== undefined) params.isStatTrak = filters.isStatTrak;
  if (filters.isSouvenir !== undefined) params.isSouvenir = filters.isSouvenir;
  
  return params;
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
      const params = {
        ...prepareFilterParams(filters),
        sortBy: sort?.field || 'price',
        sortDirection: sort?.direction || 'asc',
        page: pagination?.page || 1,
        limit: pagination?.limit || 24,
      };
      
      const response = await api.get('/inventory', { params });
      
      // Guard for unexpected API response format
      if (!response.data || !Array.isArray(response.data.items)) {
        console.error('Unexpected API response format:', response.data);
        return {
          success: false,
          data: { items: [], total: 0, page: params.page, totalPages: 0 },
          error: 'Unexpected API response format',
        };
      }

      const formattedItems = response.data.items.map(formatSkinData);

      return {
        success: true,
        data: {
          items: formattedItems,
          total: response.data.total || formattedItems.length,
          page: response.data.page || params.page,
          totalPages: response.data.totalPages || Math.ceil((response.data.total || formattedItems.length) / params.limit),
        },
      };
    } catch (error: any) {
      console.error('Error in getInventory:', error.message);
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
      
      // Guard for unexpected API response format
      if (!response.data) {
        console.error('Unexpected API response format:', response.data);
        return {
          success: false,
          data: {} as Skin,
          error: 'Unexpected API response format',
        };
      }
      
      return {
        success: true,
        data: formatSkinData(response.data),
      };
    } catch (error: any) {
      console.error('Error in getSkinDetails:', error.message);
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
      
      // Guard for unexpected API response format
      if (!response.data) {
        console.error('Unexpected API response format:', response.data);
        return {
          success: false,
          data: [],
          error: 'Unexpected API response format',
        };
      }
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Error in getPriceHistory:', error.message);
      return {
        success: false,
        data: [],
        error: error.message,
      };
    }
  },
};

export default api; 