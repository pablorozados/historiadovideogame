
import React, { useState, useRef, useEffect } from 'react';
import { Episode } from '@/hooks/useEpisodes';

interface TimelineSectionProps {
  episodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
}

const TimelineSection = ({ episodes, onEpisodeClick }: TimelineSectionProps) => {
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
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
        isMainEpisode: true
      },
      // Adicionar eventos específicos da timeline
      ...(episode.timeline_events?.map(event => ({
        ...event,
        episode,
        year: new Date(event.date).getFullYear(),
        isMainEpisode: false
      })) || [])
    ];
    return events;
  });
  
  // Ordenar por data
  const sortedEvents = allTimelineEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
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

  const handleMouseEnter = (event: any, e: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setHoveredEvent(event);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredEvent(null);
    }, 100);
  };

  const handleTooltipMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = () => {
    setHoveredEvent(null);
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
      <div className="hidden lg:block relative px-12 mx-4">
        <div className="timeline-line h-1 w-full mb-8 rounded-full"></div>
        
        <div className="relative">
          {sortedEvents.map((event, index) => (
            <div
              key={`${event.episode.id}-${event.id}`}
              className="absolute transform -translate-x-1/2"
              style={{ 
                left: `${8 + (index / Math.max(1, sortedEvents.length - 1)) * 84}%`,
                top: '-60px'
              }}
            >
              {/* Área de hover expandida */}
              <div 
                className="cursor-pointer relative w-16 h-16 flex items-center justify-center"
                onClick={() => onEpisodeClick(event.episode)}
                onMouseEnter={(e) => handleMouseEnter(event, e)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Timeline Point */}
                <div className={`timeline-point w-6 h-6 rounded-full border-4 relative ${
                  event.isMainEpisode 
                    ? 'bg-retro-yellow border-retro-blue' 
                    : 'bg-retro-blue border-retro-yellow'
                }`}>
                </div>
              </div>
              
              {/* Year Label */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                <div className={`font-retro text-lg font-bold ${
                  event.isMainEpisode ? 'text-retro-yellow' : 'text-retro-blue'
                }`}>
                  {event.year}
                </div>
                <div className="font-mono text-xs text-gray-400 max-w-20 truncate">
                  {event.title.length > 15 ? `${event.title.slice(0, 15)}...` : event.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden space-y-6">
        {sortedEvents.map((event) => (
          <div
            key={`${event.episode.id}-${event.id}`}
            className="flex items-center gap-4 p-4 retro-card rounded-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onEpisodeClick(event.episode)}
          >
            <div className="flex-shrink-0">
              <div className={`timeline-point w-12 h-12 rounded-full border-4 flex items-center justify-center ${
                event.isMainEpisode 
                  ? 'bg-retro-yellow border-retro-blue' 
                  : 'bg-retro-blue border-retro-yellow'
              }`}>
                <span className={`font-retro text-sm font-bold ${
                  event.isMainEpisode ? 'text-retro-black' : 'text-retro-yellow'
                }`}>
                  {event.year.toString().slice(-2)}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-retro text-lg text-retro-yellow truncate">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                  {event.description}
                </p>
              )}
              <p className="font-mono text-sm text-gray-400">
                {new Date(event.date).toLocaleDateString('pt-BR')} | Episódio: {event.episode.title}
              </p>
            </div>

            <div className="flex-shrink-0">
              <img
                src={event.image_url || event.episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                alt={event.title}
                className="w-16 h-16 object-cover rounded border-2 border-retro-blue cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const imageUrl = event.image_url || event.episode.cover_image_url;
                  if (imageUrl) {
                    handleImageClick(imageUrl, event.title, e);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {sortedEvents.length === 0 && (
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
      {hoveredEvent && (
        <div 
          className="fixed pointer-events-none z-[50]"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div 
            className="bg-black border-2 border-retro-yellow rounded-lg p-4 whitespace-normal w-72 shadow-2xl pointer-events-auto"
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <div className="font-retro text-sm text-retro-yellow mb-2">
              {new Date(hoveredEvent.date).toLocaleDateString('pt-BR')}
            </div>
            <div className="font-mono text-sm text-white mb-2 break-words">
              {hoveredEvent.title}
            </div>
            {hoveredEvent.description && (
              <div className="font-mono text-xs text-gray-300 mb-2 break-words">
                {hoveredEvent.description}
              </div>
            )}
            <div className="font-mono text-xs text-gray-400 mb-3 break-words">
              - Escute em {hoveredEvent.episode.title}
            </div>
            {hoveredEvent.image_url && (
              <div className="relative">
                <img 
                  src={hoveredEvent.image_url} 
                  alt={hoveredEvent.title}
                  className="w-24 h-24 object-cover rounded border border-retro-blue cursor-pointer hover:scale-105 transition-transform"
                  onClick={(e) => handleImageClick(hoveredEvent.image_url!, hoveredEvent.title, e)}
                  title="Clique para ampliar"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TimelineSection;
