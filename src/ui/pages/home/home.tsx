"use client";

import { BreweryAutocompleteSuggestion, fetchAutocompleteSuggestionsDebounced, testApiConnection } from "@/services/open_brewery_db";
import { FlyoutMenu } from "@/ui/base/flyout_menu/flyout_menu";
import { TextInput } from "@/ui/base/text_input/text_input";
import { useEffect, useState } from "react";

export const HomePage = ({ Header = null, Footer = null }: { Header?: React.ReactNode, Footer?: React.ReactNode }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<BreweryAutocompleteSuggestion[]>([]);
  const [apiStatus, setApiStatus] = useState<string>("Testing...");
  /*const suggestions = useMemo(() => {
    return search.length % 2 === 0 ? ["Even"] : ["Odd"];
  }, [search]); */

  const handleSetSearch = (value: string) => {
    setSearch(value);
  };

  // Test API connection on component mount
  useEffect(() => {
    testApiConnection().then((isAccessible) => {
      setApiStatus(isAccessible ? "✅ API Connected" : "❌ API Not Accessible");
    });
  }, []);

  useEffect(() => {
    if (!!search && search.length > 0) {
      fetchAutocompleteSuggestionsDebounced(search, setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [search]);

  return (
        <div className="flex flex-col gap-4">
          {Header}  
          <div className="text-sm text-gray-600">{apiStatus}</div>
          <TextInput placeholder="Search" value={search} onChange={handleSetSearch} suggestions={suggestions.map((suggestion) => suggestion.name)} />
          <FlyoutMenu buttonLabel="Filter" menuItems={[{ label: "Filter 1", onClick: () => {} }, { label: "Filter 2", onClick: () => {} }]} />  
          {/* TODO: Add filter options here */}
          {/* TODO: Add sort options here */}
          {/* TODO: Add brewery results list here */}
          HOME PAGE CONTENT GOES HERE
          {/* TODO: Add pagination here */}
          {/* TODO: Add view options here */}
          {Footer}
        </div>
    )
}





