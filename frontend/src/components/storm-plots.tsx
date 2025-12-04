import { useEffect, useState } from "react";
import type { StormTrack } from "@/api/types";
import { StormPlotItem } from "./plot-item";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface StormPlotsProps {
  track: StormTrack;
}

export function StormPlots({ track }: StormPlotsProps) {
  const [modalImg, setModalImg] = useState<string | null>(null);

  useEffect(() => {
    if (modalImg) {
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
  }, [modalImg]);

  let plotsObj: { track?: string; intensity?: string; radial?: string } = {};
  if (track.plots) {
    if (typeof track.plots === "string") {
      try {
        plotsObj = JSON.parse(track.plots.replace(/'/g, '"'));
      } catch (err) {
        console.warn("Invalid plots string, fallback to empty object", err);
        plotsObj = {};
      }
    } else {
      plotsObj = track.plots;
    }
  }

  const plots = [
    { name: "Track", url: plotsObj.track },
    { name: "Intensity", url: plotsObj.intensity },
    { name: "Radial", url: plotsObj.radial },
  ];

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex items-center justify-center py-4">
          <CardTitle className="text-2xl font-bold">Storm Plots</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4 text-center text-base sm:grid-cols-3">
          {plots.map((plot) => (
            <StormPlotItem key={plot.name} plot={plot} onClick={setModalImg} />
          ))}
        </CardContent>
      </Card>

      {modalImg && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-4">
          <div className="relative">
            <img
              src={modalImg}
              alt="Plot"
              className="max-h-[90vh] max-w-[95vw] rounded shadow-lg"
            />
            <Button
              className="absolute top-2 right-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
              onClick={() => setModalImg(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
