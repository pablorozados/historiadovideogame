
import React from 'react';
import { Episode } from '@/hooks/useEpisodes';

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

interface MobileTimelineProps {
  yearGroups: YearGroup[];
  selectedYear: YearGroup | null;
  onEpisodeClick: (episode: Episode) => void;
  onYearClick: (yearGroup: YearGroup) => void;
}

const MobileTimeline = ({ yearGroups, selectedYear, onEpisodeClick, onYearClick }: MobileTimelineProps) => {
  const separateEventsByType = (events: YearGroup['events']) => {
    const episodes = events.filter(e => e.isMainEpisode);
    const historicalEvents = events.filter(e => !e.isMainEpisode);
    return { episodes, historicalEvents };
  };

  return (
    <div className="lg:hidden space-y-4">
      {yearGroups.map((yearGroup) => (
        <div key={yearGroup.year} className="space-y-2">
          {/* Cabeçalho do ano */}
          <div 
            className="flex items-center gap-4 p-4 retro-card rounded-lg cursor-pointer"
            onClick={() => onYearClick(yearGroup)}
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
  );
};

export default MobileTimeline;
