import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchBreweryDetails, BreweryResult } from "@/services/open_brewery_db";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function Details() {
  const searchParams = useSearchParams();
  const breweryId = searchParams.get("id");
  const [brewery, setBrewery] = useState<BreweryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!breweryId) return;
    setLoading(true);
    setError(null);
    fetchBreweryDetails(breweryId)
      .then((data) => {
        setBrewery(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load brewery details.");
        setLoading(false);
      });
  }, [breweryId]);

  let mapUrl = "";
  if (brewery && GOOGLE_MAPS_API_KEY) {
    const address = encodeURIComponent(
      `${brewery.street || brewery.address_1 || ""}, ${brewery.city}, ${brewery.state} ${brewery.postal_code}`
    );
    // Use the first letter of the brewery name for the marker label (Google Maps Embed API limitation)
    const markerLabel = encodeURIComponent(brewery.name.charAt(0));
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${address}&markers=label:${markerLabel}|${address}`;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-neutral-900 text-white">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-2xl">
        {loading && <div>Loading brewery details...</div>}
        {error && <div className="text-red-400">{error}</div>}
        {!loading && !error && brewery && (
          <>
            <h1 className="text-3xl font-bold mb-2">{brewery.name}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div>
                <div className="mb-2">
                  <span className="font-semibold">Address:</span><br />
                  {brewery.street || brewery.address_1}<br />
                  {brewery.city}, {brewery.state} {brewery.postal_code}<br />
                  {brewery.country}
                </div>
                {brewery.phone && (
                  <div className="mb-2">
                    <span className="font-semibold">Phone:</span> {brewery.phone}
                  </div>
                )}
                {brewery.website_url && (
                  <div className="mb-2">
                    <span className="font-semibold">Website:</span> <a href={brewery.website_url} target="_blank" rel="noopener noreferrer" className="underline text-blue-300">{brewery.website_url}</a>
                  </div>
                )}
              </div>
              <div>
                {mapUrl && (
                  <iframe
                    width="100%"
                    height="250"
                    frameBorder="0"
                    style={{ border: 0, borderRadius: "8px" }}
                    src={mapUrl}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={0}
                    title="Google Map"
                  />
                )}
              </div>
            </div>
          </>
        )}
        {!loading && !error && !brewery && <div>No brewery found.</div>}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Do we want a footer?
      </footer>
    </div>
  );
}