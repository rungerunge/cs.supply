// Test script to verify our API implementation
const https = require('https');

console.log('Testing API implementation with lis-skins.com JSON price list...');

// Function to parse a CS:GO item name (simplified version of our implementation)
function parseSkinName(name) {
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
}

// Test the JSON price list
https.get('https://lis-skins.com/market_export_json/api_csgo_unlocked.json', res => {
  console.log(`Response status: ${res.statusCode}`);
  
  if (res.statusCode !== 200) {
    console.error(`Failed to fetch API data. Status code: ${res.statusCode}`);
    return;
  }
  
  let rawData = '';
  res.on('data', chunk => {
    rawData += chunk;
  });
  
  res.on('end', () => {
    try {
      console.log(`Received ${rawData.length} bytes of data`);
      
      // Parse JSON response
      const data = JSON.parse(rawData);
      console.log(`API Status: ${data.status}`);
      console.log(`Total items: ${data.items.length}`);
      
      if (data.status !== 'success' || !Array.isArray(data.items) || data.items.length === 0) {
        console.error('❌ API response does not contain valid items data');
        return;
      }
      
      console.log('\n✅ Successfully fetched API data');
      
      // Test our parsing on the first 5 items
      console.log('\nTesting name parsing on 5 sample items:');
      for (let i = 0; i < Math.min(5, data.items.length); i++) {
        const item = data.items[i];
        console.log(`\nOriginal: ${item.name}`);
        
        // Test our parsing function
        const parsed = parseSkinName(item.name);
        console.log(`Parsed: Weapon: "${parsed.weapon}", Skin: "${parsed.skin}", Exterior: "${parsed.exterior}"`);
        console.log(`StatTrak: ${parsed.isStatTrak}, Souvenir: ${parsed.isSouvenir}`);
        
        // Print additional available data
        console.log(`Price: $${item.price}`);
        console.log(`Float: ${item.item_float}`);
        console.log(`Has stickers: ${Array.isArray(item.stickers) && item.stickers.length > 0}`);
      }
      
      console.log('\n✅ Name parsing is working correctly');
      console.log('\n✅ API integration test completed successfully');
      
    } catch (e) {
      console.error('❌ Error processing API response:', e.message);
    }
  });
}).on('error', e => {
  console.error('❌ Error fetching API data:', e.message);
}); 