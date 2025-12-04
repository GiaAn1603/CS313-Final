interface StormPlotItemProps {
  plot: { name: string; url?: string };
  onClick: (url: string) => void;
}

export function StormPlotItem({ plot, onClick }: StormPlotItemProps) {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-2 font-medium">{plot.name}</p>
      {plot.url ? (
        <img
          src={plot.url}
          alt={plot.name}
          className="cursor-pointer rounded border shadow transition-transform hover:scale-105"
          onClick={() => onClick(plot.url!)}
          loading="lazy"
        />
      ) : (
        <p className="text-gray-500 italic">No image available</p>
      )}
    </div>
  );
}
