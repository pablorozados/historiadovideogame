
import React from 'react';

interface YearGroup {
  year: number;
  events: Array<{
    id: string;
    date: string;
    title: string;
    description?: string;
    image_url?: string;
    episode: any;
    isMainEpisode: boolean;
    date_is_approximate?: boolean;
  }>;
}

interface TimelinePointProps {
  yearGroup: YearGroup;
  index: number;
  totalGroups: number;
  onYearClick: (yearGroup: YearGroup) => void;
  onMouseEnter: (yearGroup: YearGroup, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

const TimelinePoint = ({ 
  yearGroup, 
  index, 
  totalGroups, 
  onYearClick, 
  onMouseEnter, 
  onMouseLeave 
}: TimelinePointProps) => {
  const hasApproximateDate = yearGroup.events.some(e => 
    e.isMainEpisode ? e.episode?.date_is_approximate : e.date_is_approximate
  );
  
  // Calcular posição com mais espaço quando há muitos pontos
  const spacing = totalGroups > 15 ? 92 : totalGroups > 10 ? 88 : 84;
  const leftPosition = `${8 + (index / Math.max(1, totalGroups - 1)) * spacing}%`;

  return (
    <div
      className="absolute transform -translate-x-1/2"
      style={{ 
        left: leftPosition,
        top: '-60px'
      }}
    >
      {/* Área de hover expandida */}
      <div 
        className="cursor-pointer relative w-16 h-16 flex items-center justify-center"
        onClick={() => onYearClick(yearGroup)}
        onMouseEnter={(e) => onMouseEnter(yearGroup, e)}
        onMouseLeave={onMouseLeave}
      >
        {/* Timeline Point */}
        <div className={`timeline-point w-8 h-8 rounded-full border-4 relative ${
          yearGroup.events.some(e => e.isMainEpisode)
            ? hasApproximateDate 
              ? 'bg-red-500 border-red-300' 
              : 'bg-retro-yellow border-retro-blue'
            : 'bg-retro-blue border-retro-yellow'
        }`}>
          {yearGroup.events.length > 1 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-retro-yellow text-retro-black rounded-full flex items-center justify-center text-xs font-bold">
              {yearGroup.events.length}
            </div>
          )}
        </div>
      </div>
      
      {/* Year Label */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
        <div className={`font-retro text-lg font-bold ${
          yearGroup.events.some(e => e.isMainEpisode) 
            ? hasApproximateDate 
              ? 'text-red-400' 
              : 'text-retro-yellow'
            : 'text-retro-blue'
        }`}>
          {yearGroup.year}
          {hasApproximateDate && (
            <span className="text-xs ml-1 text-red-400">*</span>
          )}
        </div>
        <div className="font-mono text-xs text-gray-400">
          {yearGroup.events.length} evento{yearGroup.events.length > 1 ? 's' : ''}
        </div>
        {hasApproximateDate && (
          <div className="font-mono text-xs text-red-400">
            data imprecisa
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePoint;
