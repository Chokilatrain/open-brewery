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

/**
 * Test function to check if the API is accessible
 */
export const testApiConnection = async (): Promise<boolean> => {
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






