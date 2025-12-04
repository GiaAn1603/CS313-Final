import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import type { StormTrack } from "@/api/types";
import { extractStormName } from "@/helpers/extract-name";
import { formatIsoTime } from "@/helpers/format-isotime";
import { Button } from "./ui/button";

interface MapModalProps {
  tracks: StormTrack[];
  onClose: () => void;
}

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

function MapAutoResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 0);
  }, [map]);
  return null;
}

export function MapModal({ tracks, onClose }: MapModalProps) {
  if (!tracks.length) return null;

  const stormName = extractStormName(tracks[0].storm_name);
  const positions = tracks.map((t) => [Number(t.lat), Number(t.lon)]) as [number, number][];

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4">
      <div className="relative h-[80vh] w-full max-w-[90vw] rounded bg-white shadow-lg">
        <Button
          className="absolute top-2 right-2 z-1000 bg-red-500 px-2 py-1 text-white hover:bg-red-600"
          onClick={onClose}
        >
          Close
        </Button>

        <div className="pointer-events-none absolute top-4 left-1/2 z-999 -translate-x-1/2 text-xl font-bold text-black">
          {stormName} Storm
        </div>

        <MapContainer center={positions[0]} zoom={6} style={{ width: "100%", height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={positions} />
          {positions.map((pos, idx) => (
            <Marker key={idx} position={pos} icon={defaultIcon}>
              <Popup>
                {formatIsoTime(tracks[idx].iso_time)}
                <br />
                Lat: {tracks[idx].lat}, Lon: {tracks[idx].lon}
              </Popup>
            </Marker>
          ))}
          <MapAutoResize />
        </MapContainer>
      </div>
    </div>
  );
}
