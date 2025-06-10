
import React from 'react';
import { Episode } from '@/hooks/useEpisodes';
import TimelinePoint from './TimelinePoint';
import TimelineEventSelector from './TimelineEventSelector';

interface YearGroup {
  year: number;
  events: Array<{
    id: string;
    date: string;
    title: string;
    description?: string;
    image_url?: string;
    episode: Episode;
    isMainEpisode: boolean;
  }>;
}

interface DesktopTimelineProps {
  yearGroups: YearGroup[];
  selectedYear: YearGroup | null;
  onEpisodeClick: (episode: Episode) => void;
  onYearClick: (yearGroup: YearGroup) => void;
  onMouseEnter: (yearGroup: YearGroup, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onCloseSelector: () => void;
}

const DesktopTimeline = ({
  yearGroups,
  selectedYear,
  onEpisodeClick,
  onYearClick,
  onMouseEnter,
  onMouseLeave,
  onCloseSelector
}: DesktopTimelineProps) => {
  return (
    <div className="hidden lg:block relative px-12 mx-4">
      <div className="timeline-line h-1 w-full mb-8 rounded-full"></div>
      
      <div className="relative">
        {yearGroups.map((yearGroup, index) => (
          <TimelinePoint
            key={yearGroup.year}
            yearGroup={yearGroup}
            index={index}
            totalGroups={yearGroups.length}
            onYearClick={onYearClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        ))}
      </div>

      {/* Seletor de eventos para anos com múltiplos eventos */}
      {selectedYear && (
        <TimelineEventSelector
          selectedYear={selectedYear}
          onEpisodeClick={onEpisodeClick}
          onClose={onCloseSelector}
        />
      )}
    </div>
  );
};

export default DesktopTimeline;
