
import React, { useState, useRef, useEffect } from 'react';
import { Episode } from '@/hooks/useEpisodes';

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

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Separar eventos por tipo para exibição organizada
  const separateEventsByType = (events: YearGroup['events']) => {
    const episodes = events.filter(e => e.isMainEpisode);
    const historicalEvents = events.filter(e => !e.isMainEpisode);
    return { episodes, historicalEvents };
  };
  
  return (
    <section id="timeline" className="mb-16">
      <h2 className="font-retro text-3xl md:text-4xl text-center mb-12 text-retro-yellow">
        TIMELINE INTERATIVA
      </h2>
      
      {/* Desktop Timeline */}
      <div className="hidden lg:block relative px-12 mx-4">
        <div className="timeline-line h-1 w-full mb-8 rounded-full"></div>
        
        <div className="relative">
          {yearGroups.map((yearGroup, index) => (
            <div
              key={yearGroup.year}
              className="absolute transform -translate-x-1/2"
              style={{ 
                left: `${8 + (index / Math.max(1, yearGroups.length - 1)) * 84}%`,
                top: '-60px'
              }}
            >
              {/* Área de hover expandida */}
              <div 
                className="cursor-pointer relative w-16 h-16 flex items-center justify-center"
                onClick={() => handleYearClick(yearGroup)}
                onMouseEnter={(e) => handleMouseEnter(yearGroup, e)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Timeline Point */}
                <div className={`timeline-point w-8 h-8 rounded-full border-4 relative ${
                  yearGroup.events.some(e => e.isMainEpisode)
                    ? 'bg-retro-yellow border-retro-blue' 
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
                  yearGroup.events.some(e => e.isMainEpisode) ? 'text-retro-yellow' : 'text-retro-blue'
                }`}>
                  {yearGroup.year}
                </div>
                <div className="font-mono text-xs text-gray-400">
                  {yearGroup.events.length} evento{yearGroup.events.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seletor de eventos para anos com múltiplos eventos */}
        {selectedYear && (
          <div className="mt-20 bg-retro-black border-2 border-retro-yellow rounded-lg p-6">
            <h3 className="font-retro text-xl text-retro-yellow mb-4">
              Eventos de {selectedYear.year}
            </h3>
            
            {(() => {
              const { episodes, historicalEvents } = separateEventsByType(selectedYear.events);
              
              return (
                <div className="space-y-6">
                  {/* Seção de Episódios */}
                  {episodes.length > 0 && (
                    <div>
                      <h4 className="font-mono text-sm text-retro-yellow mb-3 flex items-center gap-2">
                        🎧 Episódios ({episodes.length})
                      </h4>
                      <div className="grid gap-3">
                        {episodes.map((event) => (
                          <div
                            key={`${event.episode.id}-${event.id}`}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-retro-yellow/10 to-retro-blue/10 border border-retro-yellow/30 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-retro-yellow/20 hover:to-retro-blue/20 transition-all"
                            onClick={() => onEpisodeClick(event.episode)}
                          >
                            <img
                              src={event.image_url || event.episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                              alt={event.title}
                              className="w-14 h-14 object-cover rounded border-2 border-retro-yellow"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-mono text-base text-retro-yellow font-bold truncate">
                                {event.title}
                              </h5>
                              <p className="font-mono text-sm text-gray-300">
                                {new Date(event.date).toLocaleDateString('pt-BR')}
                              </p>
                              {event.description && (
                                <p className="font-mono text-xs text-gray-400 mt-1 line-clamp-1">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Seção de Eventos Históricos */}
                  {historicalEvents.length > 0 && (
                    <div>
                      <h4 className="font-mono text-sm text-gray-400 mb-3 flex items-center gap-2">
                        📅 Eventos Históricos ({historicalEvents.length})
                      </h4>
                      <div className="grid gap-2">
                        {historicalEvents.map((event) => (
                          <div
                            key={`${event.episode.id}-${event.id}`}
                            className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors border border-gray-600/30"
                            onClick={() => onEpisodeClick(event.episode)}
                          >
                            <img
                              src={event.image_url || event.episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                              alt={event.title}
                              className="w-10 h-10 object-cover rounded border border-retro-blue"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-mono text-sm text-gray-300 truncate">
                                {event.title}
                              </h5>
                              <p className="font-mono text-xs text-gray-500">
                                {new Date(event.date).toLocaleDateString('pt-BR')} | {event.episode.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            
            <button
              onClick={() => setSelectedYear(null)}
              className="mt-4 font-mono text-sm text-gray-400 hover:text-retro-yellow"
            >
              Fechar
            </button>
          </div>
        )}
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden space-y-4">
        {yearGroups.map((yearGroup) => (
          <div key={yearGroup.year} className="space-y-2">
            {/* Cabeçalho do ano */}
            <div 
              className="flex items-center gap-4 p-4 retro-card rounded-lg cursor-pointer"
              onClick={() => handleYearClick(yearGroup)}
            >
              <div className={`timeline-point w-12 h-12 rounded-full border-4 flex items-center justify-center relative ${
                yearGroup.events.some(e => e.isMainEpisode)
                  ? 'bg-retro-yellow border-retro-blue' 
                  : 'bg-retro-blue border-retro-yellow'
              }`}>
                <span className={`font-retro text-sm font-bold ${
                  yearGroup.events.some(e => e.isMainEpisode) ? 'text-retro-black' : 'text-retro-yellow'
                }`}>
                  {yearGroup.year.toString().slice(-2)}
                </span>
                {yearGroup.events.length > 1 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-retro-yellow text-retro-black rounded-full flex items-center justify-center text-xs font-bold">
                    {yearGroup.events.length}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-retro text-lg text-retro-yellow">
                  {yearGroup.year}
                </h3>
                <p className="font-mono text-sm text-gray-400">
                  {yearGroup.events.length} evento{yearGroup.events.length > 1 ? 's' : ''}
                  {yearGroup.events.length > 1 ? ' - Toque para ver todos' : ''}
                </p>
              </div>
            </div>

            {/* Lista de eventos (expandida no mobile se selecionado) */}
            {selectedYear?.year === yearGroup.year && yearGroup.events.length > 1 && (
              <div className="ml-8 space-y-4">
                {(() => {
                  const { episodes, historicalEvents } = separateEventsByType(yearGroup.events);
                  
                  return (
                    <>
                      {/* Episódios no Mobile */}
                      {episodes.length > 0 && (
                        <div>
                          <h4 className="font-mono text-sm text-retro-yellow mb-2 flex items-center gap-2">
                            🎧 Episódios
                          </h4>
                          <div className="space-y-2">
                            {episodes.map((event) => (
                              <div
                                key={`${event.episode.id}-${event.id}`}
                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-retro-yellow/10 to-retro-blue/10 border border-retro-yellow/30 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-retro-yellow/20 hover:to-retro-blue/20 transition-all"
                                onClick={() => onEpisodeClick(event.episode)}
                              >
                                <img
                                  src={event.image_url || event.episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                                  alt={event.title}
                                  className="w-12 h-12 object-cover rounded border-2 border-retro-yellow"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-mono text-sm text-retro-yellow font-bold truncate">
                                    {event.title}
                                  </h5>
                                  <p className="font-mono text-xs text-gray-400">
                                    {new Date(event.date).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Eventos Históricos no Mobile */}
                      {historicalEvents.length > 0 && (
                        <div>
                          <h4 className="font-mono text-sm text-gray-400 mb-2 flex items-center gap-2">
                            📅 Eventos Históricos
                          </h4>
                          <div className="space-y-2">
                            {historicalEvents.map((event) => (
                              <div
                                key={`${event.episode.id}-${event.id}`}
                                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                                onClick={() => onEpisodeClick(event.episode)}
                              >
                                <img
                                  src={event.image_url || event.episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                                  alt={event.title}
                                  className="w-10 h-10 object-cover rounded border border-retro-blue"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-mono text-sm text-gray-300 truncate">
                                    {event.title}
                                  </h4>
                                  <p className="font-mono text-xs text-gray-500">
                                    {new Date(event.date).toLocaleDateString('pt-BR')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        ))}
      </div>

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
        <div 
          className="fixed pointer-events-none z-[50]"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div 
            className="bg-black border-2 border-retro-yellow rounded-lg p-4 whitespace-normal w-80 shadow-2xl pointer-events-auto max-h-96 overflow-y-auto"
            onMouseEnter={handleTooltipMouseEnter}
            onMouseLeave={handleTooltipMouseLeave}
          >
            <div className="font-retro text-lg text-retro-yellow mb-3">
              {hoveredYear.year} ({hoveredYear.events.length} evento{hoveredYear.events.length > 1 ? 's' : ''})
            </div>
            
            {(() => {
              const { episodes, historicalEvents } = separateEventsByType(hoveredYear.events);
              
              return (
                <div className="space-y-4">
                  {/* Episódios no Tooltip */}
                  {episodes.length > 0 && (
                    <div>
                      <div className="font-mono text-sm text-retro-yellow mb-2 flex items-center gap-2">
                        🎧 Episódios
                      </div>
                      <div className="space-y-3">
                        {episodes.map((event) => (
                          <div key={`${event.episode.id}-${event.id}`} className="border-b border-retro-yellow/30 pb-2 last:border-b-0">
                            <div className="font-mono text-xs text-retro-blue mb-1">
                              {new Date(event.date).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="font-mono text-sm text-retro-yellow font-bold mb-1 break-words">
                              {event.title}
                            </div>
                            {event.description && (
                              <div className="font-mono text-xs text-gray-300 mb-1 break-words line-clamp-2">
                                {event.description}
                              </div>
                            )}
                            {event.image_url && (
                              <div className="mt-2">
                                <img 
                                  src={event.image_url} 
                                  alt={event.title}
                                  className="w-16 h-16 object-cover rounded border-2 border-retro-yellow cursor-pointer hover:scale-105 transition-transform"
                                  onClick={(e) => handleImageClick(event.image_url!, event.title, e)}
                                  title="Clique para ampliar"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Eventos Históricos no Tooltip */}
                  {historicalEvents.length > 0 && (
                    <div>
                      <div className="font-mono text-sm text-gray-400 mb-2 flex items-center gap-2">
                        📅 Eventos Históricos
                      </div>
                      <div className="space-y-2">
                        {historicalEvents.map((event) => (
                          <div key={`${event.episode.id}-${event.id}`} className="border-b border-gray-600/30 pb-2 last:border-b-0">
                            <div className="font-mono text-xs text-retro-blue mb-1">
                              {new Date(event.date).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="font-mono text-sm text-gray-300 mb-1 break-words">
                              {event.title}
                            </div>
                            {event.description && (
                              <div className="font-mono text-xs text-gray-400 mb-1 break-words line-clamp-2">
                                {event.description}
                              </div>
                            )}
                            <div className="font-mono text-xs text-gray-500 break-words">
                              - {event.episode.title}
                            </div>
                            {event.image_url && (
                              <div className="mt-2">
                                <img 
                                  src={event.image_url} 
                                  alt={event.title}
                                  className="w-16 h-16 object-cover rounded border border-retro-blue cursor-pointer hover:scale-105 transition-transform"
                                  onClick={(e) => handleImageClick(event.image_url!, event.title, e)}
                                  title="Clique para ampliar"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            
            <div className="mt-3 pt-2 border-t border-gray-700 font-mono text-xs text-gray-400">
              {hoveredYear.events.length === 1 ? 'Clique para ver episódio' : 'Clique para ver todos os eventos'}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TimelineSection;
