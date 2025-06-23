"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchBreweryDetails } from "@/services/open_brewery_db";
import type { BreweryResult } from "@/services/open_brewery_db";
import { BreweryDetails } from "@/ui/pages/details/details";
import { Header } from "@/ui/base/header/header";

// Extend Window interface for our custom property
declare global {
  interface Window {
    __NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
  }
}

// Try multiple ways to get the API key
const GOOGLE_MAPS_API_KEY = 
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
  (typeof window !== 'undefined' ? window.__NEXT_PUBLIC_GOOGLE_MAPS_API_KEY : undefined);

// Debug logging (remove in production)
if (typeof window !== 'undefined') {
  console.log('Google Maps API Key available:', !!GOOGLE_MAPS_API_KEY);
  console.log('Google Maps API Key length:', GOOGLE_MAPS_API_KEY?.length || 0);
  console.log('Window API key available:', !!window.__NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
}

export default function BreweryDetailsContainer() {
  return (
    <Suspense fallback={<div>Loading brewery details...</div>}>
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

  // Calculate Google Maps URLs
  const googleMapsUrl: string | undefined = brewery?.latitude && brewery?.longitude
    ? `https://www.google.com/maps?q=${brewery.latitude},${brewery.longitude}`
    : undefined;

  const embedUrl: string | undefined = brewery?.latitude && brewery?.longitude && GOOGLE_MAPS_API_KEY
    ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${brewery.latitude},${brewery.longitude}`
    : undefined;

  // Debug logging for embed URL
  useEffect(() => {
    if (brewery?.latitude && brewery?.longitude) {
      console.log('Brewery has coordinates:', brewery.latitude, brewery.longitude);
      console.log('Google Maps API Key available for embed:', !!GOOGLE_MAPS_API_KEY);
      console.log('Embed URL will be generated:', !!embedUrl);
    }
  }, [brewery, embedUrl]);

  return (
    <>
      <Header title="Brewery Details" />
      <BreweryDetails
        brewery={brewery}
        loading={loading}
        error={error}
        breweryId={breweryId}
        googleMapsUrl={googleMapsUrl}
        embedUrl={embedUrl}
      />
    </>
  );
} 