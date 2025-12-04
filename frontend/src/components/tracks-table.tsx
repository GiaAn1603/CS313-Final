import { useEffect, useState } from "react";
import type { StormTrack } from "@/api/types";
import { formatIsoTime } from "@/helpers/format-isotime";
import { MapModal } from "./map-modal";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface TracksTableProps {
  tracks: StormTrack[];
  itemsPerPage?: number;
}

export function TracksTable({ tracks, itemsPerPage = 10 }: TracksTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showMap, setShowMap] = useState(false);

  if (!tracks || tracks.length === 0) return null;

  const sortedTracks = [...tracks].sort(
    (a, b) => new Date(a.iso_time).getTime() - new Date(b.iso_time).getTime()
  );

  const totalPages = Math.ceil(sortedTracks.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentTracks = sortedTracks.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    if (showMap) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [showMap]);

  return (
    <Card>
      {showMap && <MapModal tracks={sortedTracks} onClose={() => setShowMap(false)} />}

      <CardContent>
        <Button className="mb-4" onClick={() => setShowMap(true)}>
          View On Map
        </Button>

        <div className="my-6 min-h-[450px] overflow-x-auto">
          <table className="min-w-full rounded border border-current shadow">
            <thead>
              <tr>
                <th className="border px-4 py-2">Year</th>
                <th className="border px-4 py-2">ISO Time</th>
                <th className="border px-4 py-2">Basin</th>
                <th className="border px-4 py-2">Subbasin</th>
                <th className="border px-4 py-2">Nature</th>
                <th className="border px-4 py-2">Lat</th>
                <th className="border px-4 py-2">Lon</th>
                <th className="border px-4 py-2">Speed</th>
                <th className="border px-4 py-2">Direction</th>
                <th className="border px-4 py-2">Dist2Land</th>
              </tr>
            </thead>
            <tbody>
              {currentTracks.map((track, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{track.year}</td>
                  <td className="border px-4 py-2">{formatIsoTime(track.iso_time)}</td>
                  <td className="border px-4 py-2">{track.nature}</td>
                  <td className="border px-4 py-2">{track.basin}</td>
                  <td className="border px-4 py-2">{track.subbasin}</td>
                  <td className="border px-4 py-2">{track.lat}</td>
                  <td className="border px-4 py-2">{track.lon}</td>
                  <td className="border px-4 py-2">{track.storm_speed}</td>
                  <td className="border px-4 py-2">{track.storm_dir}</td>
                  <td className="border px-4 py-2">{track.dist2land}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>

          <span className="px-3 py-1 text-sm font-medium">
            {currentPage} / {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
