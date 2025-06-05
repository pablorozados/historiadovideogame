
import React from 'react';
import { Episode } from '@/hooks/useEpisodes';

interface TimelineSectionProps {
  episodes: Episode[];
  onEpisodeClick: (episode: Episode) => void;
}

const TimelineSection = ({ episodes, onEpisodeClick }: TimelineSectionProps) => {
  const sortedEpisodes = [...episodes].sort((a, b) => a.year - b.year);
  
  return (
    <section id="timeline" className="mb-16">
      <h2 className="font-retro text-3xl md:text-4xl text-center mb-12 text-retro-yellow">
        TIMELINE INTERATIVA
      </h2>
      
      {/* Desktop Timeline */}
      <div className="hidden lg:block relative">
        <div className="timeline-line h-1 w-full mb-8 rounded-full"></div>
        
        <div className="relative">
          {sortedEpisodes.map((episode, index) => (
            <div
              key={episode.id}
              className="absolute transform -translate-x-1/2 cursor-pointer group"
              style={{ 
                left: `${(index / Math.max(1, sortedEpisodes.length - 1)) * 100}%`,
                top: '-60px'
              }}
              onClick={() => onEpisodeClick(episode)}
            >
              {/* Timeline Point */}
              <div className="timeline-point w-6 h-6 bg-retro-yellow rounded-full border-4 border-retro-blue relative">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black border-2 border-retro-yellow rounded-lg p-2 whitespace-nowrap">
                    <div className="font-retro text-sm text-retro-yellow">{episode.year}</div>
                    <div className="font-mono text-xs text-gray-300">{episode.title}</div>
                  </div>
                </div>
              </div>
              
              {/* Year Label */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                <div className="font-retro text-lg text-retro-yellow font-bold">
                  {episode.year}
                </div>
                <div className="font-mono text-xs text-gray-400 max-w-24 truncate">
                  {episode.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden space-y-6">
        {sortedEpisodes.map((episode) => (
          <div
            key={episode.id}
            className="flex items-center gap-4 p-4 retro-card rounded-lg cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onEpisodeClick(episode)}
          >
            <div className="flex-shrink-0">
              <div className="timeline-point w-12 h-12 bg-retro-yellow rounded-full border-4 border-retro-blue flex items-center justify-center">
                <span className="font-retro text-sm text-retro-black font-bold">
                  {episode.year.toString().slice(-2)}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-retro text-lg text-retro-yellow truncate">
                {episode.title}
              </h3>
              <p className="font-mono text-sm text-gray-400">
                Ano: {episode.year}
              </p>
              <p className="text-sm text-gray-300 line-clamp-2 mt-1">
                {episode.description}
              </p>
            </div>

            <div className="flex-shrink-0">
              <img
                src={episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                alt={episode.title}
                className="w-16 h-16 object-cover rounded border-2 border-retro-blue"
              />
            </div>
          </div>
        ))}
      </div>

      {episodes.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎮</div>
          <p className="font-mono text-gray-400">
            Nenhum episódio disponível ainda...
          </p>
          <p className="font-mono text-gray-500 text-sm mt-2">
            Use o painel administrativo para adicionar episódios
          </p>
        </div>
      )}
    </section>
  );
};

export default TimelineSection;
