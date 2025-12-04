import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { extractStormName } from "@/helpers/extract-name";
import { formatIsoTime } from "@/helpers/format-isotime";

interface StormTrack {
  lat: number;
  lon: number;
  iso_time: string;
  storm_name?: string;
}

interface PredictionPoint {
  lat: number;
  lon: number;
  point_index: number;
}

interface PredictionResult {
  predictions: PredictionPoint[];
}

interface MapCardProps {
  tracks: StormTrack[];
  tracksLoading?: boolean;
  predictionResult?: PredictionResult | null;
}

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const predictedIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [30, 46],
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  shadowSize: [46, 46],
  className: "predicted-marker",
});

L.Marker.prototype.options.icon = defaultIcon;

function MapAutoResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 0);
  }, [map]);
  return null;
}

function MapControlsFix() {
  useEffect(() => {
    const mapContainer = document.querySelector(".leaflet-container");
    if (!mapContainer) return;

    const controls = mapContainer.querySelectorAll(".leaflet-control");
    controls.forEach((ctrl) => {
      (ctrl as HTMLElement).style.zIndex = "1000";
    });
  }, []);

  return null;
}

export function MapCard({ tracks, tracksLoading, predictionResult }: MapCardProps) {
  if (tracksLoading) {
    return (
      <Card className="h-[500px] w-full">
        <CardContent className="h-full w-full p-4">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!tracks.length) {
    return (
      <Card className="flex h-[500px] w-full items-center justify-center">
        <p className="text-muted-foreground">No storm selected.</p>
      </Card>
    );
  }

  const stormName = extractStormName(tracks[0]?.storm_name || "");
  const positions = tracks.map((t) => [Number(t.lat), Number(t.lon)]) as [number, number][];

  const predictionStartIndex = 2;
  const predictionStartPoint =
    positions.length > predictionStartIndex
      ? positions[predictionStartIndex]
      : positions[positions.length - 1];

  const predictedPositions =
    predictionResult?.predictions?.map((p) => [p.lat, p.lon] as [number, number]) || [];

  const calculateCenter = () => {
    const allPositions = [...positions, ...predictedPositions];
    if (allPositions.length === 0) return positions[0] || [0, 0];

    const avgLat = allPositions.reduce((sum, pos) => sum + pos[0], 0) / allPositions.length;
    const avgLon = allPositions.reduce((sum, pos) => sum + pos[1], 0) / allPositions.length;

    return [avgLat, avgLon] as [number, number];
  };

  const mapCenter = calculateCenter();

  return (
    <Card className="mb-6 w-full">
      <CardContent className="relative h-[500px] w-full overflow-hidden rounded-lg p-0">
        <div className="pointer-events-none absolute top-4 left-1/2 z-1000 -translate-x-1/2 text-xl font-bold text-black">
          {stormName} Storm
          {predictionResult && (
            <div className="text-sm font-normal">
              (Predictions start from point {predictionStartIndex + 1})
            </div>
          )}
        </div>

        <MapContainer
          center={mapCenter}
          zoom={5}
          style={{ width: "100%", height: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Polyline
            positions={positions}
            pathOptions={{
              color: "blue",
              weight: 3,
              opacity: 0.8,
            }}
          />

          {positions.length > predictionStartIndex && (
            <Polyline
              positions={positions.slice(0, predictionStartIndex + 1)}
              pathOptions={{
                color: "darkblue",
                weight: 5,
                opacity: 1,
              }}
            />
          )}

          {predictionResult && predictedPositions.length > 0 && (
            <>
              {predictionStartPoint && predictedPositions[0] && (
                <Polyline
                  positions={[predictionStartPoint, predictedPositions[0]]}
                  pathOptions={{
                    color: "red",
                    weight: 2,
                    dashArray: "5, 5",
                    opacity: 0.7,
                  }}
                />
              )}

              <Polyline
                positions={predictedPositions}
                pathOptions={{
                  color: "red",
                  weight: 3,
                  dashArray: "10, 10",
                  opacity: 0.8,
                }}
              />
            </>
          )}

          {tracks.map((track, idx) => (
            <Marker
              key={`true-${idx}`}
              position={[Number(track.lat), Number(track.lon)]}
              icon={idx === predictionStartIndex ? predictedIcon : defaultIcon}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <b>
                    {idx === predictionStartIndex ? "Prediction Start Point" : "Actual Position"}
                  </b>
                  <div className="mt-1 text-sm">
                    <b>{formatIsoTime(track.iso_time)}</b>
                  </div>
                  <div className="mt-1">
                    Lat: {track.lat}, Lon: {track.lon}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Point: {idx + 1} of {tracks.length}
                    {idx < 3 && <div className="mt-1 text-green-600">Input Data</div>}
                    {idx >= 3 && <div className="mt-1 text-blue-600">Actual Data</div>}
                    {idx === predictionStartIndex && (
                      <div className="mt-1 font-semibold text-red-600">
                        ← Predictions start from here
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {predictionResult?.predictions?.map((prediction, idx) => (
            <Marker
              key={`pred-${idx}`}
              position={[prediction.lat, prediction.lon]}
              icon={predictedIcon}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <b className="text-red-600">Predicted Position</b>
                  <div className="mt-1">
                    <b>Point: {prediction.point_index}</b>
                  </div>
                  <div className="mt-1">Prediction Step: {idx + 1}</div>
                  <div className="mt-1">Lat: {prediction.lat.toFixed(4)}</div>
                  <div className="mt-1">Lon: {prediction.lon.toFixed(4)}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          <MapAutoResize />
          <MapControlsFix />
        </MapContainer>

        <div className="absolute right-4 bottom-4 z-1000 mb-5 flex flex-col gap-1.5 rounded-lg bg-white/95 p-3 text-xs shadow-lg">
          <div className="mb-1 text-xs font-semibold text-gray-800">Legend</div>

          <div className="flex items-center gap-2">
            <div className="h-2.5 w-5 bg-blue-500"></div>
            <span className="text-gray-700">Actual Data</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2.5 w-5 border border-dashed border-red-600 bg-red-500"></div>
            <span className="text-gray-700">Predicted</span>
            {!predictionResult && (
              <span className="text-xs text-gray-500 italic">(click Predict)</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
