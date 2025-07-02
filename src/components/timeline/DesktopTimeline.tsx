
import React from 'react';
import { Episode } from '@/hooks/useEpisodes';
import TimelinePoint from './TimelinePoint';

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
    date_is_approximate?: boolean;
  }>;
}

interface DesktopTimelineProps {
  yearGroups: YearGroup[];
  onEpisodeClick: (episode: Episode) => void;
  onYearClick: (yearGroup: YearGroup) => void;
  onMouseEnter: (yearGroup: YearGroup, e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}

const DesktopTimeline = ({
  yearGroups,
  onEpisodeClick,
  onYearClick,
  onMouseEnter,
  onMouseLeave
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
    </div>
  );
};

export default DesktopTimeline;
