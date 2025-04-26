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
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 24;

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
    
    // Calculate pagination for mock data
    const totalFilteredItems = filteredSkins.length;
    const totalFilteredPages = Math.ceil(totalFilteredItems / itemsPerPage);
    
    setTotalItems(totalFilteredItems);
    setTotalPages(totalFilteredPages);
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredSkins.slice(startIndex, endIndex);
  };

  // Fetch skins on component mount and when filters/sort/page change
  useEffect(() => {
    const fetchSkins = async () => {
      setLoading(true);
      
      if (useMockData) {
        // Use mock data with client-side filtering/sorting/pagination
        const filteredSkins = filterAndSortMockSkins();
        setSkins(filteredSkins);
        setError(null);
        setLoading(false);
        return;
      }
      
      try {
        // Use real API
        const response = await api_functions.getInventory(
          filters, 
          sort, 
          { page: currentPage, limit: itemsPerPage }
        );
        
        if (response.success) {
          setSkins(response.data.items);
          setTotalItems(response.data.total);
          setTotalPages(response.data.totalPages);
          setError(null);
        } else {
          console.error('API error:', response.error);
          setError('Failed to fetch skins. Please try again.');
          
          // Only fall back to mock data after explicit user action
          // Don't automatically switch to mock data
        }
      } catch (err) {
        console.error('Error fetching skins:', err);
        setError('Network error. Please check your connection and try again.');
        
        // Only fall back to mock data after explicit user action
        // Don't automatically switch to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchSkins();
  }, [filters, sort, currentPage, useMockData]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setIsFiltersOpen(false);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort({
      ...sort,
      field: e.target.value as 'price' | 'float' | 'name',
    });
    setCurrentPage(1); // Reset to first page on sort change
  };

  const toggleSortDirection = () => {
    setSort({
      ...sort,
      direction: sort.direction === 'asc' ? 'desc' : 'asc',
    });
    setCurrentPage(1); // Reset to first page on sort direction change
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleFallbackToMockData = () => {
    setUseMockData(true);
    setCurrentPage(1);
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
          <p>Showing sample data for demonstration. Currently using offline mock data.</p>
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
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                Try Again
              </button>
              {!useMockData && (
                <button
                  onClick={handleFallbackToMockData}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Use Demo Data
                </button>
              )}
            </div>
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {skins.map((skin) => (
                <SkinCard key={skin.id} skin={skin} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Display logic for pagination numbers
                  let pageNumber: number;
                  
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    // Near the start
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // Near the end
                    pageNumber = totalPages - 4 + i;
                  } else {
                    // In the middle
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-1 rounded ${
                        currentPage === pageNumber
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
            
            {/* Results summary */}
            <div className="text-center mt-4 text-gray-400 text-sm">
              Showing {skins.length} of {totalItems} skins
            </div>
          </>
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
