import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

export function YearsOverview() {
  const years = Array.from({ length: 2025 - 1975 + 1 }, (_, i) => 1975 + i);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Years Overview</h1>
        <p className="mx-auto max-w-2xl text-lg">
          Select a year to explore detailed storm data, including tracks, intensity changes, and
          historical patterns across different seasons.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
        {years.map((year) => (
          <Link key={year} to={`/data/storms-list/${year}`}>
            <Card className="h-16 cursor-pointer transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
              <CardContent className="flex h-full items-center justify-center p-0">
                <div className="text-sm font-bold">{year}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
