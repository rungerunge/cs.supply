import axios from 'axios';
import { ApiResponse, Skin, InventoryResponse, FilterOptions, SortOptions, PaginationOptions } from '../types/skin';

// Use the public JSON price lists instead of the API
const BASE_URL = 'https://lis-skins.com/market_export_json';
const FULL_PRICE_LIST_URL = `${BASE_URL}/api_csgo_full.json`;
const UNLOCKED_PRICE_LIST_URL = `${BASE_URL}/api_csgo_unlocked.json`;

// Create axios instance with default config
const api = axios.create({
  timeout: 15000, // 15 seconds timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
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
      response.data ? { status: response.data.status, items: response.data.items?.length || 0 } : {});
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

// Parse the CS:GO item name to extract useful information
const parseSkinName = (name: string): { weapon: string, skin: string, exterior: string, isStatTrak: boolean, isSouvenir: boolean } => {
  const isStatTrak = name.includes('StatTrak™');
  const isSouvenir = name.includes('Souvenir');
  
  // Remove StatTrak™ and Souvenir prefixes
  let cleanName = name.replace('StatTrak™ ', '').replace('Souvenir ', '');
  
  // Extract exterior in parentheses
  const exteriorMatch = cleanName.match(/\((.*?)\)$/);
  const exterior = exteriorMatch ? exteriorMatch[1] : 'Not Specified';
  
  // Remove exterior from name
  cleanName = cleanName.replace(/\s*\(.*?\)$/, '');
  
  // Split weapon and skin name (separated by | character)
  const parts = cleanName.split(' | ');
  const weapon = parts[0] || 'Unknown Weapon';
  const skin = parts.length > 1 ? parts[1] : 'Vanilla';
  
  return { weapon, skin, exterior, isStatTrak, isSouvenir };
};

// Determine item type based on weapon name
const determineItemType = (weapon: string): string => {
  const knives = ['Karambit', 'Bayonet', 'Butterfly', 'Flip', 'Gut', 'Huntsman', 'Falchion', 'Shadow Daggers', 'Bowie', 'Ursus', 'Navaja', 'Stiletto', 'Talon', 'Classic', 'Paracord', 'Survival', 'Skeleton', 'Nomad'];
  const rifles = ['AK-47', 'M4A4', 'M4A1-S', 'FAMAS', 'Galil AR', 'AUG', 'SG 553', 'AWP', 'SSG 08', 'G3SG1', 'SCAR-20'];
  const smgs = ['P90', 'MP7', 'MP9', 'MAC-10', 'UMP-45', 'PP-Bizon', 'MP5-SD'];
  const pistols = ['Desert Eagle', 'Five-SeveN', 'Glock-18', 'USP-S', 'P2000', 'P250', 'CZ75-Auto', 'Dual Berettas', 'Tec-9', 'R8 Revolver'];
  const shotguns = ['Nova', 'XM1014', 'MAG-7', 'Sawed-Off'];
  const heavies = ['M249', 'Negev'];
  const gloves = ['Gloves', 'Wraps', 'Driver Gloves', 'Moto Gloves', 'Specialist Gloves', 'Sport Gloves', 'Bloodhound Gloves', 'Hydra Gloves', 'Broken Fang Gloves'];
  
  if (knives.some(knife => weapon.includes(knife))) return 'Knife';
  if (gloves.some(glove => weapon.includes(glove))) return 'Gloves';
  if (rifles.includes(weapon)) return 'Rifle';
  if (smgs.includes(weapon)) return 'SMG';
  if (pistols.includes(weapon)) return 'Pistol';
  if (shotguns.includes(weapon)) return 'Shotgun';
  if (heavies.includes(weapon)) return 'Machinegun';
  
  return 'Other';
};

// Determine rarity based on weapon and skin name
const determineRarity = (weapon: string, skin: string): string => {
  const knives = ['Karambit', 'Bayonet', 'Butterfly', 'Flip', 'Gut', 'Huntsman', 'Falchion', 'Shadow Daggers', 'Bowie', 'Ursus', 'Navaja', 'Stiletto', 'Talon', 'Classic', 'Paracord', 'Survival', 'Skeleton', 'Nomad'];
  const gloves = ['Gloves', 'Wraps', 'Driver Gloves', 'Moto Gloves', 'Specialist Gloves', 'Sport Gloves', 'Bloodhound Gloves', 'Hydra Gloves', 'Broken Fang Gloves'];
  
  // Special cases
  if (knives.some(knife => weapon.includes(knife))) return 'Covert';
  if (gloves.some(glove => weapon.includes(glove))) return 'Extraordinary';
  if (weapon === 'M4A4' && skin === 'Howl') return 'Contraband';
  
  // For regular skins, we'll use a heuristic based on price
  // This is just an approximation, ideally you'd have a database of skin rarities
  return 'Classified'; // Default fallback
};

// Calculate markup price (5% increase)
const calculateMarkupPrice = (basePrice: number): number => {
  return basePrice * 1.05;
};

// Format item data from JSON price list to our Skin type
const formatLisSkinData = (item: any): Skin => {
  try {
    // Parse the name to extract useful information
    const { weapon, skin, exterior, isStatTrak, isSouvenir } = parseSkinName(item.name);
    
    // Generate a unique ID if not provided
    const id = item.id ? item.id.toString() : `item-${Math.random().toString(36).substring(2, 9)}`;
    
    // Determine item type and rarity
    const type = determineItemType(weapon);
    const rarity = determineRarity(weapon, skin);
    
    // Parse price and float
    const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
    const float = typeof item.item_float === 'string' ? parseFloat(item.item_float) : 
                 (typeof item.item_float === 'number' ? item.item_float : 0);
    
    // Generate a Steam image URL based on weapon and skin name
    // This is a fallback as the API doesn't provide image URLs directly
    const imageUrl = `https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJegJO7c6_NL-0m_7zO6-fw24HvcQi37nHpdii3lHj-UVoY2GlI4_EdwU9YFuC_FLvwevn0JXu75yfmXo37HfUyUbjgw/`;
    
    // Process stickers if available
    const stickers = Array.isArray(item.stickers) ? item.stickers.map((sticker: any) => ({
      id: `sticker-${Math.random().toString(36).substring(2, 9)}`,
      name: sticker.name || 'Unknown Sticker',
      wear: typeof sticker.wear === 'number' ? sticker.wear : 0,
      imageUrl: sticker.image || '',
    })) : [];
    
    return {
      id,
      name: `${weapon} | ${skin}`,
      type,
      weapon,
      rarity,
      exterior,
      price,
      marketPrice: calculateMarkupPrice(price),
      float,
      imageUrl,
      stickers,
      isStatTrak,
      isSouvenir,
      phase: undefined, // Not provided in the price list
      pattern: undefined, // Not provided in the price list
      nameTag: item.name_tag || undefined,
      unlockAt: item.unlock_at ? new Date(item.unlock_at).toISOString() : undefined,
    };
  } catch (error) {
    console.error('Error formatting skin data:', error, item);
    // Return a minimal valid skin object if formatting fails
    return {
      id: `error-${Math.random().toString(36).substring(2, 9)}`,
      name: item.name || 'Error Loading Skin',
      type: 'Unknown',
      weapon: 'Unknown',
      rarity: 'Unknown',
      exterior: 'Unknown',
      price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
      marketPrice: typeof item.price === 'number' ? item.price * 1.05 : parseFloat(item.price) * 1.05 || 0,
      float: 0,
      imageUrl: '',
      stickers: [],
      isStatTrak: false,
      isSouvenir: false,
    };
  }
};

// Filter items based on user-selected filters
const filterItems = (items: any[], filters?: FilterOptions): any[] => {
  if (!filters || Object.keys(filters).length === 0) return items;
  
  return items.filter(item => {
    // Parse the item name to get weapon, skin, exterior, etc
    const { weapon, skin, exterior, isStatTrak, isSouvenir } = parseSkinName(item.name);
    const type = determineItemType(weapon);
    
    // Filter by type
    if (filters.type?.length && !filters.type.includes(type)) return false;
    
    // Filter by exterior
    if (filters.exterior?.length && !filters.exterior.includes(exterior)) return false;
    
    // Filter by price range
    if (filters.priceRange) {
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      if (price < (filters.priceRange.min || 0)) return false;
      if (filters.priceRange.max !== undefined && filters.priceRange.max !== Infinity && price > filters.priceRange.max) return false;
    }
    
    // Filter by float range
    if (filters.float) {
      const float = typeof item.item_float === 'string' ? parseFloat(item.item_float) : 
                   (typeof item.item_float === 'number' ? item.item_float : 0);
      if (float < (filters.float.min || 0)) return false;
      if (filters.float.max !== undefined && float > filters.float.max) return false;
    }
    
    // Filter by stickers
    if (filters.hasStickers && (!item.stickers || item.stickers.length === 0)) return false;
    
    // Filter by StatTrak
    if (filters.isStatTrak !== undefined && filters.isStatTrak !== isStatTrak) return false;
    
    // Filter by Souvenir
    if (filters.isSouvenir !== undefined && filters.isSouvenir !== isSouvenir) return false;
    
    return true;
  });
};

// Sort items based on user-selected sort options
const sortItems = (items: any[], sort?: SortOptions): any[] => {
  if (!sort) return items;
  
  return [...items].sort((a, b) => {
    let comparison = 0;
    
    switch (sort.field) {
      case 'price':
        const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0;
        const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
        comparison = priceA - priceB;
        break;
      case 'float':
        const floatA = typeof a.item_float === 'string' ? parseFloat(a.item_float) : 
                      (typeof a.item_float === 'number' ? a.item_float : 0);
        const floatB = typeof b.item_float === 'string' ? parseFloat(b.item_float) : 
                      (typeof b.item_float === 'number' ? b.item_float : 0);
        comparison = floatA - floatB;
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
    }
    
    return sort.direction === 'asc' ? comparison : -comparison;
  });
};

// Apply pagination to items
const paginateItems = (items: any[], pagination?: PaginationOptions): any[] => {
  if (!pagination) return items.slice(0, 24);
  
  const page = pagination.page || 1;
  const limit = pagination.limit || 24;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return items.slice(startIndex, endIndex);
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
      // Determine which price list to use based on filters
      // For simplicity, we'll always use the full price list for now
      const response = await api.get(FULL_PRICE_LIST_URL);
      
      // Guard for unexpected API response format
      if (!response.data || response.data.status !== 'success' || !Array.isArray(response.data.items)) {
        console.error('Unexpected API response format:', response.data);
        return {
          success: false,
          data: { items: [], total: 0, page: pagination?.page || 1, totalPages: 0 },
          error: 'Unexpected API response format',
        };
      }

      // Apply filters, sorting, and pagination on the client side
      const filteredItems = filterItems(response.data.items, filters);
      const sortedItems = sortItems(filteredItems, sort);
      const paginatedItems = paginateItems(sortedItems, pagination);
      
      // Format items to our Skin type
      const formattedItems = paginatedItems.map(formatLisSkinData);
      
      // Calculate pagination info
      const total = filteredItems.length;
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 24;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          items: formattedItems,
          total,
          page,
          totalPages,
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
      // Fetch the full price list
      const response = await api.get(FULL_PRICE_LIST_URL);
      
      // Guard for unexpected API response format
      if (!response.data || response.data.status !== 'success' || !Array.isArray(response.data.items)) {
        console.error('Unexpected API response format:', response.data);
        return {
          success: false,
          data: {} as Skin,
          error: 'Unexpected API response format',
        };
      }
      
      // Find the specific item by ID
      const item = response.data.items.find((item: any) => item.id.toString() === skinId);
      
      if (!item) {
        return {
          success: false,
          data: {} as Skin,
          error: 'Skin not found',
        };
      }
      
      // Format the item to our Skin type
      const formattedItem = formatLisSkinData(item);
      
      return {
        success: true,
        data: formattedItem,
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
    // Price history is not available in the JSON price lists
    // We'll return a mock response for now
    return {
      success: false,
      data: [],
      error: 'Price history not available',
    };
  },
};

export default api; 