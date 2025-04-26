// Simple script to test the website locally
const http = require('http');

// Function to make a GET request to the local Next.js server
function testLocalWebsite() {
  console.log('Testing local website...');
  const options = {
    hostname: 'localhost',
    port: 3002, // Next.js server is running on port 3002
    path: '/',
    method: 'GET',
    headers: {
      'User-Agent': 'Node.js Test Script'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response length: ${data.length} bytes`);
      
      // Check if the response contains key indicators that the site is working
      const containsNoSkins = data.includes('No skins found matching your criteria');
      const containsNetworkError = data.includes('Failed to fetch skins');
      const containsTryAgain = data.includes('Try Again');
      const containsDemoData = data.includes('Use Demo Data');
      
      // Basic HTML title check
      const titleMatch = data.match(/<title>(.*?)<\/title>/);
      console.log(`Page title: ${titleMatch ? titleMatch[1] : 'Not found'}`);
      
      // Check for indicators of main page content
      const hasMostTrustedTitle = data.includes('The Most Trusted CS:GO Skin Marketplace');
      const hasFiltersButton = data.includes('Filters');
      
      // Check for API communication
      const hasApiLogs = data.includes('API Request:') || data.includes('API Response:');
      
      console.log('\nSite Status Indicators:');
      console.log(`- Has marketplace title: ${hasMostTrustedTitle}`);
      console.log(`- Has filters button: ${hasFiltersButton}`);
      console.log(`- Shows "No skins" message: ${containsNoSkins}`);
      console.log(`- Shows network error: ${containsNetworkError}`);
      console.log(`- Shows "Try Again" button: ${containsTryAgain}`);
      console.log(`- Shows "Use Demo Data" button: ${containsDemoData}`);
      console.log(`- Has API communication logs: ${hasApiLogs}`);
      
      // Make a determination about the site's functionality
      if (hasMostTrustedTitle && hasFiltersButton) {
        console.log('\n✅ Basic site structure is loading correctly.');
        
        if (containsNetworkError) {
          console.log('❌ The site is showing a network error. API integration is not working.');
        } else if (containsNoSkins) {
          console.log('⚠️ The site is not showing any skins. Filtering might be too restrictive or the API response is empty.');
        } else if (data.includes('id="skins-grid"') || data.includes('class="grid')) {
          console.log('✅ The site appears to be loading the skin grid correctly.');
        }
      } else {
        console.log('\n❌ The site is not loading correctly. Basic structure is missing.');
      }
    });
  });
  
  req.on('error', (error) => {
    console.error(`Error testing website: ${error.message}`);
  });
  
  req.end();
}

// Wait a moment for the server to start, then test
setTimeout(testLocalWebsite, 3000); 