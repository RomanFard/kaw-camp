"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

type RouteMapProps = {
  from: { lat: number; lng: number; label: string };
  to: { lat: number; lng: number; label: string };
};

export default function RouteMap({ from, to }: RouteMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [from.lat, from.lng],
      zoom: 7,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.marker([from.lat, from.lng]).addTo(map).bindPopup(`📍 ${from.label}`);
    L.marker([to.lat, to.lng]).addTo(map).bindPopup(`🏁 ${to.label}`);

    const routingControl = (L as any).Routing.control({
      waypoints: [L.latLng(from.lat, from.lng), L.latLng(to.lat, to.lng)],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: "#6ECB9E", weight: 5, opacity: 0.8 }],
      },
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
      map.remove();
      mapRef.current = null;
    };
  }, [from.lat, from.lng, to.lat, to.lng, from.label, to.label]);

  return (
    <div
      ref={containerRef}
      className="h-[400px] w-full overflow-hidden rounded-2xl border border-[#E8DFC8]"
    />
  );
}
