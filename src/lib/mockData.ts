import { Skin } from '../types/skin';

// Mock data for CS:GO skins
export const mockSkins: Skin[] = [
  {
    id: '1',
    name: 'AK-47 | Asiimov',
    type: 'Rifle',
    weapon: 'AK-47',
    rarity: 'Covert',
    exterior: 'Field-Tested',
    price: 87.65,
    marketPrice: 92.03,
    float: 0.21,
    imageUrl: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UdsZGHyd4_Bd1RvNQ7T_FDrw-_ng5K4u57NmyAwpGB8spXSgVwr',
    stickers: [
      {
        id: 's1',
        name: 'Ninjas in Pyjamas | Stockholm 2021',
        wear: 0.08,
        imageUrl: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulReQ0HdUuqkw9aDAhJkIAVNpbO3LR4uieMck21Lvoi--ImXksnlMoPSkGoJsZMn3OnEoNyjjVawrUVtNj2nLdCQc1c9Yg7TqFG_wbjm0MC_vIOJlyW55g8v'
      }
    ],
    isStatTrak: true,
    isSouvenir: false
  },
  {
    id: '2',
    name: 'AWP | Dragon Lore',
    type: 'Sniper Rifle',
    weapon: 'AWP',
    rarity: 'Covert',
    exterior: 'Factory New',
    price: 10325.75,
    marketPrice: 10842.04,
    float: 0.01,
    imageUrl: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot621FAR17P7NdTRH-t26q4SZlvD7PYTQgXtu5cB1g_zMyoD0mlrn_RVtZD_3ctOQew5vZg2E-wW3kO_t0J-4uZ7NzHI27CchtHva0hS_hxlSLrs4GzzPWDY',
    stickers: [],
    isStatTrak: false,
    isSouvenir: true
  },
  {
    id: '3',
    name: 'Karambit | Doppler',
    type: 'Knife',
    weapon: 'Karambit',
    rarity: 'Covert',
    exterior: 'Factory New',
    price: 1234.56,
    marketPrice: 1296.29,
    float: 0.009,
    imageUrl: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf2PLacDBA5ciJlY20k_jkI7fUhFRB4MRij7j--YXygED6-EtrNmihLYaXJABoNArRrFS3wOzogJa_u5-YzHM17ihw53_Ulwv330_FCJ4pDA',
    stickers: [],
    isStatTrak: true,
    isSouvenir: false,
    phase: 'Ruby'
  },
  {
    id: '4',
    name: 'Glock-18 | Fade',
    type: 'Pistol',
    weapon: 'Glock-18',
    rarity: 'Restricted',
    exterior: 'Factory New',
    price: 875.23,
    marketPrice: 918.99,
    float: 0.024,
    imageUrl: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposbaqKAxf0v73dS9D69O4q4eHmPT_DLfYkWNF18lwmO7Eu4mh2lXj-RJtajjxJoWcIVA5ZA2G81W_lOe9jcPpus_MzXtg6CRzsX2LlxC0n1gSOaO9UE6N',
    stickers: [],
    isStatTrak: false,
    isSouvenir: false,
    pattern: 'Full Fade'
  },
  {
    id: '5',
    name: 'M4A4 | Howl',
    type: 'Rifle',
    weapon: 'M4A4',
    rarity: 'Contraband',
    exterior: 'Minimal Wear',
    price: 3568.29,
    marketPrice: 3746.70,
    float: 0.08,
    imageUrl: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou-6kejhjxszFJTwW09-vloWZh-L6OITZk2pH8fp9i_vG8MKs3VHi8kc_ZWrzI4CVJAY4NVHT-Fm7xO-81J61up7MzHZluCQq4XvYyUGpwUYbdFiGJiw',
    stickers: [],
    isStatTrak: false,
    isSouvenir: false
  },
  {
    id: '6',
    name: 'USP-S | Kill Confirmed',
    type: 'Pistol',
    weapon: 'USP-S',
    rarity: 'Covert',
    exterior: 'Well-Worn',
    price: 178.50,
    marketPrice: 187.43,
    float: 0.41,
    imageUrl: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpoo6m1FBRp3_bGcjhQ09-jq5WYh8j_OrfdqWhe5sN4mOTE8bP4jVC9vh5yYGvxdY6SIwA4aV7Y-Ae5wOft18C-tJubnXNqs3Jw7S3YgVXp1mIB25El',
    stickers: [],
    isStatTrak: false,
    isSouvenir: false
  },
  {
    id: '7',
    name: 'Desert Eagle | Blaze',
    type: 'Pistol',
    weapon: 'Desert Eagle',
    rarity: 'Restricted',
    exterior: 'Factory New',
    price: 456.78,
    marketPrice: 479.62,
    float: 0.015,
    imageUrl: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgposr-kLAtl7PLZTjlH_9mkgIWKkPvxDLDEm2JS4Mp1mOjG-oLKhVKwogYxfTv3I4fGJFI3YA2F-VG-w-nohsPt78nKziRqvyJ34GGdwUJBSSPu4g',
    stickers: [],
    isStatTrak: true,
    isSouvenir: false
  },
  {
    id: '8',
    name: 'AK-47 | Fire Serpent',
    type: 'Rifle',
    weapon: 'AK-47',
    rarity: 'Covert',
    exterior: 'Battle-Scarred',
    price: 678.90,
    marketPrice: 712.85,
    float: 0.68,
    imageUrl: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5gZKKkPLLMrfFqWdY781lteXA54vwxlew_hJvMGH2coCTIQU2ZQmF_FG8wunq15G17sjJznQ2unZ24SvD30vg7m-c9vE',
    stickers: [],
    isStatTrak: false,
    isSouvenir: false
  }
];

// Generate more skins by modifying existing ones with different properties
export const generateMoreSkins = (count: number): Skin[] => {
  const weapons = ['AK-47', 'M4A4', 'M4A1-S', 'AWP', 'Desert Eagle', 'USP-S', 'Glock-18', 'P250', 'Karambit', 'Butterfly Knife'];
  const skins = ['Asiimov', 'Fade', 'Doppler', 'Crimson Web', 'Slaughter', 'Case Hardened', 'Hyper Beast', 'Neo-Noir', 'Dragon Lore', 'Medusa'];
  const exteriors = ['Factory New', 'Minimal Wear', 'Field-Tested', 'Well-Worn', 'Battle-Scarred'];
  const rarities = ['Consumer Grade', 'Industrial Grade', 'Mil-Spec', 'Restricted', 'Classified', 'Covert', 'Contraband'];
  
  const result: Skin[] = [...mockSkins];
  
  for (let i = mockSkins.length; i < count; i++) {
    const baseSkin = mockSkins[i % mockSkins.length];
    const weapon = weapons[Math.floor(Math.random() * weapons.length)];
    const skin = skins[Math.floor(Math.random() * skins.length)];
    const exterior = exteriors[Math.floor(Math.random() * exteriors.length)];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const float = Math.random();
    const price = Math.floor(Math.random() * 5000) + 1;
    
    const newSkin: Skin = {
      ...baseSkin,
      id: `generated-${i}`,
      name: `${weapon} | ${skin}`,
      weapon,
      exterior,
      rarity,
      float,
      price,
      marketPrice: price * 1.05,
      isStatTrak: Math.random() > 0.7,
      isSouvenir: Math.random() > 0.9,
    };
    
    result.push(newSkin);
  }
  
  return result;
};

// Generate a total of 50 skins for the mock data
export const allMockSkins = generateMoreSkins(50); 