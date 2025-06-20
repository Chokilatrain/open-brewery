import debounce from "lodash.debounce";

export type BreweryAutocompleteSuggestion = {
  id: string;
  name: string;
  brewery_type: string;
  address_1: string | null;
  address_2: string | null;
  address_3: string | null;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  longitude: number | null;
  latitude: number | null;
  phone: string | null;
  website_url: string | null;
  state: string;
  street: string | null;
};

// Mock data for local development
const MOCK_BREWERIES: BreweryAutocompleteSuggestion[] = [
  {
    id: "1",
    name: "Anchor Brewing Company",
    brewery_type: "micro",
    address_1: "1705 Mariposa St",
    address_2: null,
    address_3: null,
    city: "San Francisco",
    state_province: "California",
    postal_code: "94107",
    country: "United States",
    longitude: -122.4016,
    latitude: 37.7633,
    phone: "415-863-8350",
    website_url: "https://www.anchorbrewing.com",
    state: "California",
    street: "1705 Mariposa St"
  },
  {
    id: "2",
    name: "Sierra Nevada Brewing Co",
    brewery_type: "regional",
    address_1: "1075 E 20th St",
    address_2: null,
    address_3: null,
    city: "Chico",
    state_province: "California",
    postal_code: "95928",
    country: "United States",
    longitude: -121.8375,
    latitude: 39.7285,
    phone: "530-893-3520",
    website_url: "https://www.sierranevada.com",
    state: "California",
    street: "1075 E 20th St"
  },
  {
    id: "3",
    name: "Stone Brewing Co",
    brewery_type: "regional",
    address_1: "1999 Citracado Pkwy",
    address_2: null,
    address_3: null,
    city: "Escondido",
    state_province: "California",
    postal_code: "92029",
    country: "United States",
    longitude: -117.0864,
    latitude: 33.1192,
    phone: "760-471-4999",
    website_url: "https://www.stonebrewing.com",
    state: "California",
    street: "1999 Citracado Pkwy"
  },
  {
    id: "4",
    name: "Lagunitas Brewing Company",
    brewery_type: "regional",
    address_1: "1280 N McDowell Blvd",
    address_2: null,
    address_3: null,
    city: "Petaluma",
    state_province: "California",
    postal_code: "94954",
    country: "United States",
    longitude: -122.6378,
    latitude: 38.2324,
    phone: "707-769-4495",
    website_url: "https://lagunitas.com",
    state: "California",
    street: "1280 N McDowell Blvd"
  },
  {
    id: "5",
    name: "Russian River Brewing Company",
    brewery_type: "micro",
    address_1: "725 4th St",
    address_2: null,
    address_3: null,
    city: "Santa Rosa",
    state_province: "California",
    postal_code: "95404",
    country: "United States",
    longitude: -122.7144,
    latitude: 38.4405,
    phone: "707-545-2337",
    website_url: "https://russianriverbrewing.com",
    state: "California",
    street: "725 4th St"
  },
  {
    id: "6",
    name: "Firestone Walker Brewing Company",
    brewery_type: "regional",
    address_1: "1400 Ramada Dr",
    address_2: null,
    address_3: null,
    city: "Paso Robles",
    state_province: "California",
    postal_code: "93446",
    country: "United States",
    longitude: -120.6914,
    latitude: 35.6267,
    phone: "805-225-5911",
    website_url: "https://www.firestonewalker.com",
    state: "California",
    street: "1400 Ramada Dr"
  },
  {
    id: "7",
    name: "Ballast Point Brewing Company",
    brewery_type: "regional",
    address_1: "9045 Carroll Way",
    address_2: null,
    address_3: null,
    city: "San Diego",
    state_province: "California",
    postal_code: "92121",
    country: "United States",
    longitude: -117.2074,
    latitude: 32.8328,
    phone: "858-790-2739",
    website_url: "https://www.ballastpoint.com",
    state: "California",
    street: "9045 Carroll Way"
  },
  {
    id: "8",
    name: "Green Flash Brewing Co",
    brewery_type: "regional",
    address_1: "6550 Mira Mesa Blvd",
    address_2: null,
    address_3: null,
    city: "San Diego",
    state_province: "California",
    postal_code: "92121",
    country: "United States",
    longitude: -117.2074,
    latitude: 32.8328,
    phone: "858-622-0085",
    website_url: "https://www.greenflashbrew.com",
    state: "California",
    street: "6550 Mira Mesa Blvd"
  }
];

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
const useMockData = isDevelopment && process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

/**
 * Mock API function for local development
 */
const mockFetchAutocompleteSuggestions = async (query: string): Promise<BreweryAutocompleteSuggestion[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter breweries based on query
  const filteredBreweries = MOCK_BREWERIES.filter(brewery =>
    brewery.name.toLowerCase().includes(query.toLowerCase()) ||
    brewery.city.toLowerCase().includes(query.toLowerCase()) ||
    brewery.state.toLowerCase().includes(query.toLowerCase())
  );
  
  console.log('Mock API Response:', filteredBreweries);
  return filteredBreweries;
};

/**
 * Test function to check if the API is accessible
 */
export const testApiConnection = async (): Promise<boolean> => {
  if (useMockData) {
    console.log('Using mock API - connection test passed');
    return true;
  }

  try {
    const response = await fetch('https://api.openbrewerydb.org/v1/breweries?per_page=1');
    console.log('API test response:', response.status, response.statusText);
    return response.ok;
  } catch (error) {
    console.error('API test failed:', error);
    return false;
  }
};

/**
 * Fetch autocomplete suggestions for breweries based on a query string.
 * @param query The search query string
 * @returns Promise resolving to an array of suggestions
 */
export const fetchAutocompleteSuggestions = async (query: string): Promise<BreweryAutocompleteSuggestion[]> => {
  // API requires at least 3 characters
  if (!query || query.trim().length < 3) {
    console.log('Query too short, skipping API call:', query);
    return [];
  }

  // Use mock data in development if enabled
  if (useMockData) {
    console.log('Using mock API for query:', query);
    return mockFetchAutocompleteSuggestions(query.trim());
  }

  // Use the autocomplete endpoint which is specifically designed for search suggestions
  const url = `https://api.openbrewerydb.org/v1/breweries/autocomplete?query=${encodeURIComponent(query.trim())}`;
  
  try {
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Allow redirects
      redirect: 'follow',
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('Response not ok:', response.status, response.statusText);
      throw new Error(`Failed to fetch brewery suggestions: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('API Response data:', data);
    
    if (!Array.isArray(data)) {
      console.error('Unexpected response format:', data);
      return [];
    }
    
    return data.map((item: BreweryAutocompleteSuggestion) => {
      return {
        id: item.id,
        name: item.name,
        brewery_type: item.brewery_type,
        address_1: item.address_1,
        address_2: item.address_2,
        address_3: item.address_3,
        city: item.city,
        state_province: item.state_province,
        postal_code: item.postal_code,
        country: item.country,
        longitude: item.longitude,
        latitude: item.latitude,
        phone: item.phone,
        website_url: item.website_url,
        state: item.state,
        street: item.street,
      };
    });
  } catch (error) {
    console.error('API call failed:', error);
    return [];
  }
};

export const fetchAutocompleteSuggestionsDebounced = (query: string, setSuggestions: (suggestions: BreweryAutocompleteSuggestion[]) => void) => {
  debounce(() => {
    fetchAutocompleteSuggestions(query).then((suggestions) => {
      setSuggestions(suggestions ?? []);
    });
  }, 300)();
}






