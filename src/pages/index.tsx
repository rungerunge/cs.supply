import { useState, useEffect } from 'react';
import { Skin, FilterOptions, SortOptions } from '@/types/skin';
import { api_functions } from '@/lib/api';
import { allMockSkins } from '@/lib/mockData';
import SkinCard from '@/components/skins/SkinCard';
import SkinFilters from '@/components/filters/SkinFilters';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'price', direction: 'asc' });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  // Filter and sort the mock data locally
  const filterAndSortMockSkins = () => {
    let filteredSkins = [...allMockSkins];
    
    // Apply filters
    if (filters.type?.length) {
      filteredSkins = filteredSkins.filter(skin => filters.type?.includes(skin.type));
    }
    
    if (filters.rarity?.length) {
      filteredSkins = filteredSkins.filter(skin => filters.rarity?.includes(skin.rarity));
    }
    
    if (filters.exterior?.length) {
      filteredSkins = filteredSkins.filter(skin => filters.exterior?.includes(skin.exterior));
    }
    
    if (filters.priceRange) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.marketPrice >= (filters.priceRange?.min || 0) && 
        skin.marketPrice <= (filters.priceRange?.max || Infinity)
      );
    }
    
    if (filters.float) {
      filteredSkins = filteredSkins.filter(skin => 
        skin.float >= (filters.float?.min || 0) && 
        skin.float <= (filters.float?.max || 1)
      );
    }
    
    if (filters.hasStickers) {
      filteredSkins = filteredSkins.filter(skin => skin.stickers && skin.stickers.length > 0);
    }
    
    if (filters.isStatTrak) {
      filteredSkins = filteredSkins.filter(skin => skin.isStatTrak);
    }
    
    if (filters.isSouvenir) {
      filteredSkins = filteredSkins.filter(skin => skin.isSouvenir);
    }
    
    // Apply sorting
    filteredSkins.sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'price':
          comparison = a.marketPrice - b.marketPrice;
          break;
        case 'float':
          comparison = a.float - b.float;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return sort.direction === 'asc' ? comparison : -comparison;
    });
    
    return filteredSkins.slice(0, 24); // Limit to 24 items per page
  };

  // Fetch skins on component mount and when filters/sort change
  useEffect(() => {
    const fetchSkins = async () => {
      setLoading(true);
      
      try {
        if (useMockData) {
          // Use mock data with client-side filtering/sorting
          const filteredSkins = filterAndSortMockSkins();
          setSkins(filteredSkins);
          setError(null);
        } else {
          // Try real API first
          const response = await api_functions.getInventory(filters, sort, { page: 1, limit: 24 });
          
          if (response.success) {
            setSkins(response.data.items);
            setError(null);
          } else {
            console.error('API error, falling back to mock data:', response.error);
            setUseMockData(true);
            const filteredSkins = filterAndSortMockSkins();
            setSkins(filteredSkins);
            setError(null);
          }
        }
      } catch (err) {
        console.error('Error fetching skins, falling back to mock data:', err);
        setUseMockData(true);
        const filteredSkins = filterAndSortMockSkins();
        setSkins(filteredSkins);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSkins();
  }, [filters, sort, useMockData]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setIsFiltersOpen(false);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort({
      ...sort,
      field: e.target.value as 'price' | 'float' | 'name',
    });
  };

  const toggleSortDirection = () => {
    setSort({
      ...sort,
      direction: sort.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="flex flex-col space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          The Most Trusted CS:GO Skin Marketplace
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Buy and sell CS:GO skins at the best prices. Instant delivery, secure transactions.
        </p>
      </section>

      {/* Data Source Indicator */}
      {useMockData && (
        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-md p-3 text-yellow-500 text-center">
          <p>Showing sample data for demonstration. Real API connection will be established soon.</p>
        </div>
      )}

      {/* Filters and Sort */}
      <section className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <button
          onClick={() => setIsFiltersOpen(true)}
          className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition w-full sm:w-auto"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          <span>Filters</span>
        </button>

        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <select
            value={sort.field}
            onChange={handleSortChange}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition w-full sm:w-auto"
          >
            <option value="price">Price</option>
            <option value="float">Float</option>
            <option value="name">Name</option>
          </select>
          <button
            onClick={toggleSortDirection}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            {sort.direction === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </section>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <section className="flex flex-wrap gap-2">
          {filters.type?.map((type) => (
            <span key={type} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              {type}
            </span>
          ))}
          {filters.rarity?.map((rarity) => (
            <span key={rarity} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              {rarity}
            </span>
          ))}
          {filters.exterior?.map((exterior) => (
            <span key={exterior} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              {exterior}
            </span>
          ))}
          {filters.priceRange && (
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              ${filters.priceRange.min} - ${filters.priceRange.max === Infinity ? '∞' : filters.priceRange.max}
            </span>
          )}
          {filters.float && (
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              Float: {filters.float.min} - {filters.float.max}
            </span>
          )}
          {filters.hasStickers && (
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              Has Stickers
            </span>
          )}
          {filters.isStatTrak && (
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              StatTrak™
            </span>
          )}
          {filters.isSouvenir && (
            <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
              Souvenir
            </span>
          )}
          <button
            onClick={() => setFilters({})}
            className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
          >
            Clear All
          </button>
        </section>
      )}

      {/* Skins Grid */}
      <section>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading skins...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Try Again
            </button>
          </div>
        ) : skins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No skins found matching your criteria.</p>
            <button
              onClick={() => setFilters({})}
              className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skins.map((skin) => (
              <SkinCard key={skin.id} skin={skin} />
            ))}
          </div>
        )}
      </section>

      {/* Filters Modal */}
      <SkinFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
