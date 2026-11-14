/**
 * ClusterMarker plugin for Leaflet.
 *
 * Wraps leaflet.markercluster with Diwaar's branded cluster icons and a simple
 * API for adding property markers.
 *
 * Usage (after Leaflet + markercluster scripts are loaded):
 *   const cluster = new ClusterMarker(map, { maxClusterRadius: 50 });
 *   cluster.addMarker(latlng, popupHtml);
 *   cluster.fitBounds();
 *   cluster.destroy();
 */

declare global {
  interface Window {
    L: any;
  }
}

export interface ClusterMarkerOptions {
  maxClusterRadius?: number;
  spiderfyOnMaxZoom?: boolean;
  showCoverageOnHover?: boolean;
  zoomToBoundsOnClick?: boolean;
}

export class ClusterMarker {
  private group: any;
  private map: any;

  constructor(map: any, options: ClusterMarkerOptions = {}) {
    if (!window.L?.markerClusterGroup) {
      throw new Error("leaflet.markercluster is not loaded");
    }
    this.map = map;
    this.group = window.L.markerClusterGroup({
      maxClusterRadius: options.maxClusterRadius ?? 50,
      spiderfyOnMaxZoom: options.spiderfyOnMaxZoom ?? true,
      showCoverageOnHover: options.showCoverageOnHover ?? false,
      zoomToBoundsOnClick: options.zoomToBoundsOnClick ?? true,
      iconCreateFunction: createClusterIcon,
    });
    this.map.addLayer(this.group);
  }

  addMarker(latlng: [number, number], popupHtml: string): any {
    const marker = window.L.marker(latlng);
    if (popupHtml) marker.bindPopup(popupHtml);
    this.group.addLayer(marker);
    return marker;
  }

  addMarkers(items: { latlng: [number, number]; popupHtml: string }[]): void {
    const markers = items.map(({ latlng, popupHtml }) => {
      const marker = window.L.marker(latlng);
      if (popupHtml) marker.bindPopup(popupHtml);
      return marker;
    });
    this.group.addLayers(markers);
  }

  fitBounds(padding = 0.1): void {
    const bounds = this.group.getBounds();
    if (bounds?.isValid()) {
      this.map.fitBounds(bounds.pad(padding));
    }
  }

  clear(): void {
    this.group.clearLayers();
  }

  destroy(): void {
    if (this.map && this.group) {
      this.map.removeLayer(this.group);
    }
    this.group = null;
    this.map = null;
  }
}

/** Circular cluster icon sized and colored by listing count. */
function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount();
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
