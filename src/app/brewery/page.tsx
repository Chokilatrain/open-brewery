"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchBreweryDetails } from "@/services/open_brewery_db";
import type { BreweryResult } from "@/services/open_brewery_db";
import { BreweryDetails } from "@/ui/pages/details/details";
import { Header } from "@/ui/base/header/header";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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