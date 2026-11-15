import { useEffect, useRef } from "react";
import type { Property } from "@/lib/types";
import { getApproxCoords, scatterAround } from "@/lib/geo";
import { formatPrice } from "@/lib/format";

declare global {
  interface Window {
    L: any;
    Supercluster: any;
  }
}

const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const SUPERCLUSTER_JS = "https://unpkg.com/supercluster@8.0.1/dist/supercluster.min.js";

const PIN_COLORS: Record<string, string> = {
  house: "#0ea5e9",
  flat: "#8b5cf6",
  plot: "#22c55e",
  commercial: "#f59e0b",
  portion: "#06b6d4",
  farmhouse: "#84cc16",
};

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

function pinIcon(category?: string) {
  const fill = (category && PIN_COLORS[category]) || "#0ea5e9";
  const html = `
    <div style="width:28px;height:36px;filter:drop-shadow(0 2px 4px rgb(0 0 0 / 0.3));">
      <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 9.5 14 22 14 22s14-12.5 14-22C28 6.268 21.732 0 14 0z" fill="${fill}"/>
        <circle cx="14" cy="14" r="6" fill="#fff"/>
      </svg>
    </div>`;
  return window.L.divIcon({
    html,
    className: "diwaar-pin-icon",
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
}

function clusterIcon(count: number) {
  let size = 36;
  let bg = "#0ea5e9";
  if (count >= 50) {
    size = 52;
    bg = "#0369a1";
  } else if (count >= 20) {
    size = 46;
    bg = "#0284c7";
  } else if (count >= 10) {
    size = 42;
    bg = "#0ea5e9";
  }
  const html = `
    <div style="
      width:${size}px;height:${size}px;
      border-radius:9999px;
      background:${bg};
      color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-weight:700;font-size:${size < 42 ? 13 : 15}px;
      border:3px solid #fff;
      box-shadow:0 2px 8px rgb(0 0 0 / 0.25);
      font-family:system-ui,sans-serif;
    ">${count}</div>`;
  return window.L.divIcon({
    html,
    className: "diwaar-cluster-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
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
  const indexRef = useRef<any>(null);
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    loadCss(LEAFLET_CSS);

    (async () => {
      try {
        await loadScript(LEAFLET_JS);
        await loadScript(SUPERCLUSTER_JS);
      } catch {
        return;
      }
      if (cancelled || !window.L || !window.Supercluster || !mapRef.current) return;

      if (mapInstance.current) mapInstance.current.remove();

      const center = getApproxCoords(city, location);
      const map = window.L.map(mapRef.current).setView(center, city ? 12 : 6);
      mapInstance.current = map;

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
      }).addTo(map);

      const points = properties.map((p, i) => {
        let latlng: [number, number];
        if (typeof p.lat === "number" && typeof p.lng === "number") {
          latlng = [p.lat, p.lng];
        } else {
          latlng = scatterAround(getApproxCoords(p.city, p.location), i, properties.length);
        }
        const price = formatPrice(p.price, p.purpose);
        return {
          type: "Feature",
          properties: {
            title: p.title,
            price,
            location: p.location,
            city: p.city,
            category: p.category,
          },
          geometry: { type: "Point", coordinates: [latlng[1], latlng[0]] },
        };
      });

      const index = new window.Supercluster({
        radius: 60,
        maxZoom: 16,
      });
      index.load(points);
      indexRef.current = index;

      const layer = window.L.layerGroup().addTo(map);
      layerRef.current = layer;

      function update() {
        layer.clearLayers();
        const b = map.getBounds();
        const zoom = Math.round(map.getZoom());
        const clusters = index.getClusters(
          [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
          zoom,
        );
        clusters.forEach((c: any) => {
          const [lng, lat] = c.geometry.coordinates;
          if (c.properties.cluster) {
            const count = c.properties.point_count;
            const marker = window.L.marker([lat, lng], { icon: clusterIcon(count) });
            marker.on("click", () => {
              const expansion = index.getClusterExpansionZoom(c.properties.cluster_id);
              map.setView([lat, lng], expansion);
            });
            layer.addLayer(marker);
          } else {
            const props = c.properties;
            const marker = window.L.marker([lat, lng], { icon: pinIcon(props.category) });
            marker.bindPopup(
              `<div class="text-sm"><strong>${props.title}</strong><br/>${props.price}<br/>${props.location}, ${props.city}</div>`,
            );
            layer.addLayer(marker);
          }
        });
      }

      map.on("moveend", update);
      map.on("zoomend", update);

      if (points.length > 0) {
        const bounds = window.L.latLngBounds(points.map((pt: any) => [pt.geometry.coordinates[1], pt.geometry.coordinates[0]]));
        map.fitBounds(bounds.pad(0.1));
      }
      update();
    })();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      indexRef.current = null;
      layerRef.current = null;
    };
  }, [properties, city, location]);

  return (
    <div
      ref={mapRef}
      className="h-[520px] w-full rounded-2xl overflow-hidden border border-border shadow-card"
    />
  );
}
