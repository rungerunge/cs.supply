import React from 'react';
import { FilterOptions } from '@/types/skin';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SkinFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const WEAPON_TYPES = [
  'Knife',
  'Pistol',
  'Rifle',
  'SMG',
  'Shotgun',
  'Machinegun',
  'Sniper Rifle',
];

const RARITIES = [
  'Consumer Grade',
  'Industrial Grade',
  'Mil-Spec',
  'Restricted',
  'Classified',
  'Covert',
  'Contraband',
];

const EXTERIORS = [
  'Factory New',
  'Minimal Wear',
  'Field-Tested',
  'Well-Worn',
  'Battle-Scarred',
];

const SkinFilters: React.FC<SkinFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}) => {
  const handleTypeChange = (type: string) => {
    const newTypes = filters.type?.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...(filters.type || []), type];
    
    onFilterChange({
      ...filters,
      type: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const handleRarityChange = (rarity: string) => {
    const newRarities = filters.rarity?.includes(rarity)
      ? filters.rarity.filter(r => r !== rarity)
      : [...(filters.rarity || []), rarity];
    
    onFilterChange({
      ...filters,
      rarity: newRarities.length > 0 ? newRarities : undefined,
    });
  };

  const handleExteriorChange = (exterior: string) => {
    const newExteriors = filters.exterior?.includes(exterior)
      ? filters.exterior.filter(e => e !== exterior)
      : [...(filters.exterior || []), exterior];
    
    onFilterChange({
      ...filters,
      exterior: newExteriors.length > 0 ? newExteriors : undefined,
    });
  };

  const handlePriceRangeChange = (min: string, max: string) => {
    onFilterChange({
      ...filters,
      priceRange: {
        min: Number(min) || 0,
        max: Number(max) || Infinity,
      },
    });
  };

  const handleFloatRangeChange = (min: string, max: string) => {
    onFilterChange({
      ...filters,
      float: {
        min: Number(min) || 0,
        max: Number(max) || 1,
      },
    });
  };

  const handleCheckboxChange = (key: 'hasStickers' | 'isStatTrak' | 'isSouvenir') => {
    onFilterChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Filters</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                {/* Weapon Types */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Weapon Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {WEAPON_TYPES.map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.type?.includes(type) || false}
                          onChange={() => handleTypeChange(type)}
                          className="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-gray-300">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rarities */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Rarity</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {RARITIES.map((rarity) => (
                      <label key={rarity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.rarity?.includes(rarity) || false}
                          onChange={() => handleRarityChange(rarity)}
                          className="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-gray-300">{rarity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Exteriors */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Exterior</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {EXTERIORS.map((exterior) => (
                      <label key={exterior} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.exterior?.includes(exterior) || false}
                          onChange={() => handleExteriorChange(exterior)}
                          className="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-gray-300">{exterior}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Price Range ($)</h4>
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange?.min || ''}
                      onChange={(e) => handlePriceRangeChange(e.target.value, filters.priceRange?.max?.toString() || '')}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange?.max === Infinity ? '' : filters.priceRange?.max || ''}
                      onChange={(e) => handlePriceRangeChange(filters.priceRange?.min?.toString() || '', e.target.value)}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>

                {/* Float Range */}
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Float Range</h4>
                  <div className="flex space-x-4">
                    <input
                      type="number"
                      placeholder="Min"
                      min="0"
                      max="1"
                      step="0.0001"
                      value={filters.float?.min || ''}
                      onChange={(e) => handleFloatRangeChange(e.target.value, filters.float?.max?.toString() || '')}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      min="0"
                      max="1"
                      step="0.0001"
                      value={filters.float?.max || ''}
                      onChange={(e) => handleFloatRangeChange(filters.float?.min?.toString() || '', e.target.value)}
                      className="bg-gray-700 text-white rounded px-3 py-2 w-full"
                    />
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.hasStickers || false}
                      onChange={() => handleCheckboxChange('hasStickers')}
                      className="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-300">Has Stickers</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.isStatTrak || false}
                      onChange={() => handleCheckboxChange('isStatTrak')}
                      className="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-300">StatTrak™</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.isSouvenir || false}
                      onChange={() => handleCheckboxChange('isSouvenir')}
                      className="rounded border-gray-600 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-gray-300">Souvenir</span>
                  </label>
                </div>

                {/* Apply/Reset Buttons */}
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => onFilterChange({})}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                  >
                    Reset
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                  >
                    Apply
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SkinFilters; 