"use client";

import React from "react";
import styles from "./details.module.css";
import type { BreweryResult } from "@/services/open_brewery_db";
import { WebsiteIcon } from "@/ui/base/website_icon/website_icon";

export interface BreweryDetailsProps {
  brewery: BreweryResult | null;
  loading: boolean;
  error: string | null;
  breweryId: string | null;
  googleMapsUrl: string | undefined;
  embedUrl: string | undefined;
}

export const BreweryDetails: React.FC<BreweryDetailsProps> = ({
  brewery,
  loading,
  error,
  breweryId,
  googleMapsUrl,
  embedUrl,
}) => {
  if (!breweryId) {
    return <div className={styles.container}>No brewery ID provided.</div>;
  }

  if (loading) {
    return <div className={styles.container}>Loading brewery details...</div>;
  }

  if (error) {
    return <div className={styles.container} style={{ color: '#f87171' }}>Error: {error}</div>;
  }

  if (!brewery) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{brewery.name}</h1>
      <div className={styles.grid}>
        {/* Left column: General info */}
        <div className={styles.column}>
          <div className={styles.field}>
            <span className={styles.label}>Brewery URL:</span>{" "}
            {brewery.website_url ? (
              <>
                <span className={styles.urlText}>{brewery.website_url}</span>
                <WebsiteIcon url={brewery.website_url} size="large" className={styles.websiteIcon} />
              </>
            ) : (
              "N/A"
            )}
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Type:</span> {brewery.brewery_type?.toUpperCase() || "N/A"}
          </div>
        </div>
        {/* Right column: Location info */}
        <div className={styles.column}>
          <div className={styles.field}>
            <span className={styles.label}>Street:</span> {brewery.street || "N/A"}
          </div>
          <div className={styles.field}>
            <span className={styles.label}>City:</span> {brewery.city || "N/A"}
          </div>
          <div className={styles.field}>
            <span className={styles.label}>State/Province:</span> {brewery.state_province || brewery.state || "N/A"}
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Postal Code:</span> {brewery.postal_code || "N/A"}
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Country:</span> {brewery.country || "N/A"}
          </div>
        </div>
      </div>
      {/* Google Map */}
      {embedUrl && (
        <div className={styles.mapContainer}>
          <span className={styles.mapLabel}>Location Map:</span>
          <div className={styles.mapWrapper}>
            <iframe
              title="Google Map"
              width="100%"
              height="300"
              style={{ border: 0, width: '100%' }}
              loading="lazy"
              allowFullScreen
              src={embedUrl}
            ></iframe>
            <div className={styles.mapLink}>
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>View on Google Maps</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
