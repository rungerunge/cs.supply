import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { api_functions } from '@/lib/api';
import { Skin } from '@/types/skin';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SkinDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [skin, setSkin] = useState<Skin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchSkinDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const [skinResponse, priceHistoryResponse] = await Promise.all([
          api_functions.getSkinDetails(id as string),
          api_functions.getPriceHistory(id as string),
        ]);

        if (skinResponse.success && skinResponse.data) {
          setSkin(skinResponse.data);
        } else {
          setError(skinResponse.error || 'Failed to fetch skin details');
        }

        if (priceHistoryResponse.success) {
          setPriceHistory(priceHistoryResponse.data);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching skin details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkinDetails();
  }, [id]);

  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'consumer grade':
        return 'text-gray-400';
      case 'industrial grade':
        return 'text-blue-400';
      case 'mil-spec':
        return 'text-blue-500';
      case 'restricted':
        return 'text-purple-500';
      case 'classified':
        return 'text-pink-500';
      case 'covert':
        return 'text-red-500';
      case 'contraband':
        return 'text-amber-500';
      default:
        return 'text-white';
    }
  };

  const getFloatColor = (float: number): string => {
    if (float <= 0.07) return 'text-blue-400';
    if (float <= 0.15) return 'text-green-400';
    if (float <= 0.37) return 'text-yellow-400';
    if (float <= 0.44) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !skin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-red-500 text-lg mb-4">{error || 'Skin not found'}</p>
          <Link
            href="/"
            className="flex items-center space-x-2 text-white hover:text-orange-500 transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${skin.name} | CS.Supply`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image and Basic Info */}
          <div>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={skin.imageUrl}
                alt={skin.name}
                className="w-full h-96 object-contain"
              />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {skin.isStatTrak && (
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                  StatTrak™
                </span>
              )}
              {skin.isSouvenir && (
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm">
                  Souvenir
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm ${getRarityColor(skin.rarity)} bg-opacity-20 bg-current`}>
                {skin.rarity}
              </span>
              <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                {skin.exterior}
              </span>
            </div>

            {/* Stickers */}
            {skin.stickers && skin.stickers.length > 0 && (
              <div className="mt-8">
                <h3 className="text-white text-lg font-semibold mb-4">Applied Stickers</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {skin.stickers.map((sticker, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4">
                      <img
                        src={sticker.imageUrl}
                        alt={sticker.name}
                        className="w-full h-24 object-contain mb-2"
                      />
                      <p className="text-white text-sm text-center">{sticker.name}</p>
                      {sticker.wear && (
                        <p className="text-gray-400 text-xs text-center">
                          Wear: {(sticker.wear * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Details and Purchase */}
          <div>
            <h1 className={`text-3xl font-bold ${getRarityColor(skin.rarity)} mb-2`}>
              {skin.name}
            </h1>
            <p className="text-gray-400 text-lg mb-6">{skin.weapon}</p>

            {/* Float Value */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-white text-lg font-semibold mb-4">Float Value</h3>
              <div className="flex items-center space-x-4">
                <span className={`text-2xl font-bold ${getFloatColor(skin.float)}`}>
                  {skin.float.toFixed(4)}
                </span>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getFloatColor(skin.float).replace('text-', 'bg-')}`}
                    style={{ width: `${skin.float * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>Factory New</span>
                <span>Battle-Scarred</span>
              </div>
            </div>

            {/* Pattern/Phase */}
            {(skin.pattern || skin.phase) && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-white text-lg font-semibold mb-4">Pattern Info</h3>
                {skin.phase && (
                  <p className="text-purple-400 mb-2">
                    Phase: {skin.phase}
                  </p>
                )}
                {skin.pattern && (
                  <p className="text-blue-400">
                    Pattern ID: {skin.pattern}
                  </p>
                )}
              </div>
            )}

            {/* Price and Purchase */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-gray-400 text-sm line-through">
                    ${skin.price.toFixed(2)}
                  </p>
                  <p className="text-3xl font-bold text-white">
                    ${skin.marketPrice.toFixed(2)}
                  </p>
                </div>
                <button className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition">
                  Buy Now
                </button>
              </div>
              <p className="text-gray-400 text-sm">
                Price includes 5% marketplace fee
              </p>
            </div>

            {/* Price History Chart would go here */}
            {priceHistory.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 mt-6">
                <h3 className="text-white text-lg font-semibold mb-4">Price History</h3>
                {/* Add your preferred charting library here */}
                <p className="text-gray-400">Price history visualization coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 