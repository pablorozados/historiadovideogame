import React, { useState, useRef, useEffect } from 'react';
import { Episode } from '@/hooks/useEpisodes';
import DesktopTimeline from './timeline/DesktopTimeline';
import MobileTimeline from './timeline/MobileTimeline';
import TimelineTooltip from './timeline/TimelineTooltip';

interface TimelineSectionProps {
  episodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
}

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

const TimelineSection = ({ episodes, onEpisodeClick }: TimelineSectionProps) => {
  const [hoveredYear, setHoveredYear] = useState<YearGroup | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearGroup | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Expandir todos os eventos da timeline de todos os episódios + o próprio episódio
  const allTimelineEvents = episodes.flatMap(episode => {
    const events = [
      // Adicionar o próprio episódio como evento principal
      {
        id: `episode-${episode.id}`,
        date: episode.historical_date,
        title: episode.title,
        description: episode.description || '',
        image_url: episode.cover_image_url,
        episode,
        year: episode.year,
        isMainEpisode: true,
        date_is_approximate: episode.date_is_approximate
      },
      // Adicionar eventos específicos da timeline
      ...(episode.timeline_events?.map(event => ({
        ...event,
        episode,
        year: new Date(event.date).getFullYear(),
        isMainEpisode: false,
        date_is_approximate: event.date_is_approximate || false
      })) || [])
    ];
    return events;
  });
  
  // Agrupar eventos por ano
  const eventsByYear = allTimelineEvents.reduce((acc, event) => {
    const year = event.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, typeof allTimelineEvents>);

  // Converter para array ordenado de grupos por ano
  const yearGroups: YearGroup[] = Object.entries(eventsByYear)
    .map(([year, events]) => ({
      year: parseInt(year),
      // Ordenar: episódios principais primeiro, depois eventos históricos, ambos por data
      events: events.sort((a, b) => {
        // Primeiro por tipo (episódios principais primeiro)
        if (a.isMainEpisode && !b.isMainEpisode) return -1;
        if (!a.isMainEpisode && b.isMainEpisode) return 1;
        // Depois por data
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
    }))
    .sort((a, b) => a.year - b.year);
  
  const handleImageClick = (imageUrl: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Criar modal para ampliar imagem
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/95 z-[10000] flex items-center justify-center p-4 cursor-pointer';
    modal.onclick = () => modal.remove();
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title;
    img.className = 'max-w-[90vw] max-h-[90vh] object-contain rounded border-2 border-retro-yellow';
    img.onclick = (e) => e.stopPropagation();
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'absolute top-4 right-4 text-white text-2xl cursor-pointer hover:text-retro-yellow font-bold bg-black/50 w-10 h-10 rounded-full flex items-center justify-center';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = () => modal.remove();
    
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
  };

  const handleMouseEnter = (yearGroup: YearGroup, e: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredYear(yearGroup);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredYear(null);
    }, 100);
  };

  const handleTooltipMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = () => {
    setHoveredYear(null);
  };

  const handleYearClick = (yearGroup: YearGroup) => {
    if (yearGroup.events.length === 1) {
      // Se tem apenas um evento, abrir diretamente
      onEpisodeClick(yearGroup.events[0].episode);
    } else {
      // Se tem múltiplos eventos, mostrar seletor
      setSelectedYear(selectedYear?.year === yearGroup.year ? null : yearGroup);
    }
  };

  const handleCloseSelector = () => {
    setSelectedYear(null);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);
  
  return (
    <section id="timeline" className="mb-16">
      <h2 className="font-retro text-3xl md:text-4xl text-center mb-12 text-retro-yellow">
        TIMELINE INTERATIVA
      </h2>
      
      {/* Desktop Timeline */}
      <DesktopTimeline
        yearGroups={yearGroups}
        selectedYear={selectedYear}
        onEpisodeClick={onEpisodeClick}
        onYearClick={handleYearClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onCloseSelector={handleCloseSelector}
      />

      {/* Mobile Timeline */}
      <MobileTimeline
        yearGroups={yearGroups}
        selectedYear={selectedYear}
        onEpisodeClick={onEpisodeClick}
        onYearClick={handleYearClick}
      />

      {yearGroups.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎮</div>
          <p className="font-mono text-gray-400">
            Nenhum evento na timeline ainda...
          </p>
          <p className="font-mono text-gray-500 text-sm mt-2">
            Use o painel administrativo para adicionar episódios com eventos
          </p>
        </div>
      )}

      {/* Tooltip renderizado como portal no documento */}
      {hoveredYear && (
        <TimelineTooltip
          yearGroup={hoveredYear}
          position={tooltipPosition}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          onImageClick={handleImageClick}
        />
      )}
    </section>
  );
};

export default TimelineSection;
