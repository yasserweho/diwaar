import { useEffect, useRef } from "react";

declare global {
  interface Window {
    L: any;
  }
}

export function PinPicker({
  lat,
  lng,
  onChange,
}: {
  lat?: number;
  lng?: number;
  onChange: (lat: number, lng: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

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

      const center: [number, number] = lat && lng ? [lat, lng] : [31.52, 74.36];
      const map = window.L.map(mapRef.current).setView(center, lat && lng ? 15 : 12);
      mapInstance.current = map;

      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      const marker = window.L.marker(center, { draggable: true }).addTo(map);
      markerRef.current = marker;

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange(pos.lat, pos.lng);
      });

      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        onChange(e.latlng.lat, e.latlng.lng);
      });
    };

    script.onload = init;
    if (window.L) init();

    return () => {
      if (mapInstance.current) mapInstance.current.remove();
      script.remove();
      link.remove();
    };
  }, []);

  useEffect(() => {
    if (markerRef.current && lat && lng && mapInstance.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstance.current.setView([lat, lng], 15);
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      className="h-64 w-full rounded-xl overflow-hidden border border-border"
    />
  );
}
