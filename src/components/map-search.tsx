import { useEffect, useRef } from "react";
import type { Property } from "@/lib/types";
import { getApproxCoords, scatterAround } from "@/lib/geo";
import { formatPrice } from "@/lib/format";
import { ClusterMarker } from "@/lib/map/cluster-marker";

declare global {
  interface Window {
    L: any;
  }
}

const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const CLUSTER_JS = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";
const CLUSTER_CSS = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
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
  const clusterRef = useRef<ClusterMarker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    loadCss(LEAFLET_CSS);
    loadCss(CLUSTER_CSS);

    (async () => {
      try {
        await loadScript(LEAFLET_JS);
        await loadScript(CLUSTER_JS);
      } catch {
        return;
      }
      if (cancelled || !window.L || !mapRef.current) return;
      if (mapInstance.current) mapInstance.current.remove();
      clusterRef.current?.destroy();

      const center = getApproxCoords(city, location);
      const map = window.L.map(mapRef.current).setView(center, city ? 12 : 6);
      mapInstance.current = map;

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const cluster = new ClusterMarker(map, { maxClusterRadius: 50 });
      clusterRef.current = cluster;

      const items = properties.map((p, i) => {
        let latlng: [number, number];
        if (typeof p.lat === "number" && typeof p.lng === "number") {
          latlng = [p.lat, p.lng];
        } else {
          latlng = scatterAround(getApproxCoords(p.city, p.location), i, properties.length);
        }
        const price = formatPrice(p.price, p.purpose);
        const popupHtml = `<div class="text-sm"><strong>${p.title}</strong><br/>${price}<br/>${p.location}, ${p.city}</div>`;
        return { latlng, popupHtml };
      });

      cluster.addMarkers(items);

      if (properties.length > 0) {
        cluster.fitBounds(0.1);
      }
    })();

    return () => {
      cancelled = true;
      clusterRef.current?.destroy();
      clusterRef.current = null;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [properties, city, location]);

  return (
    <div
      ref={mapRef}
      className="h-[520px] w-full rounded-2xl overflow-hidden border border-border shadow-card"
    />
  );
}
