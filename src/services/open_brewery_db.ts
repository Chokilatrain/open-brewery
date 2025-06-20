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
 * Fetch autocomplete suggestions for breweries based on a query string.
 * @param query The search query string
 * @returns Promise resolving to an array of suggestions
 */
export const fetchAutocompleteSuggestions = async (query: string): Promise<BreweryAutocompleteSuggestion[]> => {
  // Use the external Open Brewery DB API directly for static export compatibility
  const url = `https://api.openbrewerydb.org/v1/breweries/autocomplete?query=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch autocomplete suggestions: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('API Response:', data);
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
    console.error('Error fetching autocomplete suggestions:', error);
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






