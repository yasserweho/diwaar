import { useEffect, useRef } from "react";
import type { Property } from "@/lib/types";
import { getApproxCoords, scatterAround } from "@/lib/geo";
import { formatPrice } from "@/lib/format";

declare global {
  interface Window {
    L: any;
  }
}

export function MapSearch({
  properties,
  city,
  location,
}: {
  properties: Property[];
  city?: string;
  location?: string;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const init = () => {
      if (!window.L || !mapRef.current) return;
      if (mapInstance.current) mapInstance.current.remove();

      const center = getApproxCoords(city, location);
      const map = window.L.map(mapRef.current).setView(center, city ? 12 : 6);
      mapInstance.current = map;

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const markers = properties.map((p, i) => {
        let latlng: [number, number];
        if (typeof p.lat === "number" && typeof p.lng === "number") {
          latlng = [p.lat, p.lng];
        } else {
          latlng = scatterAround(getApproxCoords(p.city, p.location), i, properties.length);
        }
        const price = formatPrice(p.price, p.purpose);
        const marker = window.L.marker(latlng).addTo(map);
        marker.bindPopup(
          `<div class="text-sm"><strong>${p.title}</strong><br/>${price}<br/>${p.location}, ${p.city}</div>`,
        );
        return marker;
      });

      if (markers.length > 0) {
        const group = window.L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
      }
    };

    script.onload = init;
    if (window.L) init();

    return () => {
      if (mapInstance.current) mapInstance.current.remove();
      script.remove();
      link.remove();
    };
  }, [properties, city, location]);

  return (
    <div
      ref={mapRef}
      className="h-[520px] w-full rounded-2xl overflow-hidden border border-border shadow-card"
    />
  );
}
