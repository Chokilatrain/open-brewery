"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchBreweryDetails } from "@/services/open_brewery_db";
import type { BreweryResult } from "@/services/open_brewery_db";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function BreweryDetailsPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow border border-gray-700">Loading brewery details...</div>}>
      <BreweryDetailsPageInner />
    </Suspense>
  );
}

function BreweryDetailsPageInner() {
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
      .then((data) => setBrewery(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [breweryId]);

  if (!breweryId) {
    return <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow border border-gray-700">No brewery ID provided.</div>;
  }

  if (loading) {
    return <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow border border-gray-700">Loading brewery details...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow border border-gray-700 text-red-400">Error: {error}</div>;
  }

  if (!brewery) {
    return null;
  }

  const googleMapsUrl: string | undefined = brewery.latitude && brewery.longitude
    ? `https://www.google.com/maps?q=${brewery.latitude},${brewery.longitude}`
    : undefined;

  const embedUrl: string | undefined = brewery.latitude && brewery.longitude && GOOGLE_MAPS_API_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${brewery.latitude},${brewery.longitude}`
    : undefined;

  return (
    <div className="w-full max-w-screen-lg mx-auto mt-10 p-4 sm:p-6 md:p-8 bg-gray-900 text-white rounded shadow border border-gray-700">
      <h1 className="text-3xl font-bold mb-4">{brewery.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column: General info */}
        <div className="min-w-0">
          <div className="mb-3">
            <span className="font-semibold">Brewery URL:</span>{" "}
            {brewery.website_url ? (
              <a href={brewery.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline break-all">{brewery.website_url}</a>
            ) : (
              "N/A"
            )}
          </div>
          <div className="mb-3">
            <span className="font-semibold">Type:</span> {brewery.brewery_type?.toUpperCase() || "N/A"}
          </div>
        </div>
        {/* Right column: Location info */}
        <div className="min-w-0">
          <div className="mb-3">
            <span className="font-semibold">Street:</span> {brewery.street || "N/A"}
          </div>
          <div className="mb-3">
            <span className="font-semibold">City:</span> {brewery.city || "N/A"}
          </div>
          <div className="mb-3">
            <span className="font-semibold">State/Province:</span> {brewery.state_province || brewery.state || "N/A"}
          </div>
          <div className="mb-3">
            <span className="font-semibold">Postal Code:</span> {brewery.postal_code || "N/A"}
          </div>
          <div className="mb-3">
            <span className="font-semibold">Country:</span> {brewery.country || "N/A"}
          </div>
        </div>
      </div>
      {/* Google Map */}
      {embedUrl && (
        <div className="mt-8 w-full">
          <span className="font-semibold">Location Map:</span>
          <div className="mt-2 w-full">
            <iframe
              title="Google Map"
              width="100%"
              height="300"
              style={{ border: 0, width: '100%' }}
              loading="lazy"
              allowFullScreen
              src={embedUrl}
            ></iframe>
            <div className="mt-2">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">View on Google Maps</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 