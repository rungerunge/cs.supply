import React, { useState } from 'react';
import { Skin } from '@/types/skin';
import Link from 'next/link';

interface SkinCardProps {
  skin: Skin;
}

const SkinCard: React.FC<SkinCardProps> = ({ skin }) => {
  const [imageError, setImageError] = useState(false);

  // Function to determine rarity color
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

  // Function to determine float color
  const getFloatColor = (float: number): string => {
    if (float <= 0.07) return 'text-blue-400';
    if (float <= 0.15) return 'text-green-400';
    if (float <= 0.37) return 'text-yellow-400';
    if (float <= 0.44) return 'text-orange-400';
    return 'text-red-400';
  };

  // Fallback image for when the real image fails to load
  const fallbackImage = 'https://steamcommunity-a.akamaihd.net/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZYMUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz56P7fiDzZ2TQXJVfdhX_o45gnTBCI24dJuGtay8-MEew_n5YCQZeQlMIpKH8GCUPXVNVj_4khpXaFfd5aKpCu9iBw/';

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative">
        <img
          src={imageError ? fallbackImage : skin.imageUrl}
          alt={skin.name}
          className="w-full h-48 object-contain bg-gray-900"
          loading="lazy"
          onError={() => setImageError(true)}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {skin.isStatTrak && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              StatTrak™
            </span>
          )}
          {skin.isSouvenir && (
            <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">
              Souvenir
            </span>
          )}
        </div>

        {/* Float Value */}
        {skin.float && (
          <span className={`absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs ${getFloatColor(skin.float)}`}>
            Float: {skin.float.toFixed(4)}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Name and Type */}
        <div className="mb-2">
          <h3 className={`text-lg font-semibold ${getRarityColor(skin.rarity)} truncate`} title={skin.name}>
            {skin.name}
          </h3>
          <p className="text-gray-400 text-sm">{skin.exterior}</p>
        </div>

        {/* Stickers */}
        {skin.stickers && skin.stickers.length > 0 && (
          <div className="flex space-x-1 mb-3 overflow-x-auto pb-1">
            {skin.stickers.map((sticker, index) => (
              <div key={index} className="relative group flex-shrink-0">
                <img
                  src={sticker.imageUrl}
                  alt={sticker.name}
                  className="w-6 h-6 rounded"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {sticker.name}
                  {sticker.wear && ` (${(sticker.wear * 100).toFixed(1)}%)`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phase/Pattern */}
        {(skin.phase || skin.pattern) && (
          <div className="mb-2 text-sm">
            {skin.phase && (
              <span className="text-purple-400 mr-2">
                Phase: {skin.phase}
              </span>
            )}
            {skin.pattern && (
              <span className="text-blue-400">
                Pattern: {skin.pattern}
              </span>
            )}
          </div>
        )}

        {/* Spacer to push price to the bottom */}
        <div className="flex-grow"></div>

        {/* Price */}
        <div className="flex justify-between items-center mt-3">
          <div>
            <p className="text-gray-400 text-sm line-through">
              ${skin.price.toFixed(2)}
            </p>
            <p className="text-white font-bold">
              ${skin.marketPrice.toFixed(2)}
            </p>
          </div>
          <Link href={`/skins/${skin.id}`}>
            <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
              Buy Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SkinCard; 