import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SkinCard from '@/components/skins/SkinCard';
import SkinFilters from '@/components/filters/SkinFilters';
import { api_functions } from '@/lib/api';
import { Skin, FilterOptions, SortOptions } from '@/types/skin';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'price', direction: 'asc' });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Fetch skins on component mount and when filters/sort change
  useEffect(() => {
    const fetchSkins = async () => {
      try {
        setLoading(true);
        const response = await api_functions.getInventory(filters, sort, { page: 1, limit: 24 });
        if (response.success) {
          setSkins(response.data.items);
        } else {
          setError(response.error || 'Failed to fetch skins');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching skins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkins();
  }, [filters, sort]);

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
    <Layout>
      <div className="flex flex-col space-y-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            The Most Trusted CS:GO Skin Marketplace
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Buy and sell CS:GO skins at the best prices. Instant delivery, secure transactions.
          </p>
        </section>

        {/* Filters and Sort */}
        <section className="flex justify-between items-center">
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-4">
            <select
              value={sort.field}
              onChange={handleSortChange}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {skins.map((skin) => (
                <SkinCard key={skin.id} skin={skin} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Filters Modal */}
      <SkinFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </Layout>
  );
}
