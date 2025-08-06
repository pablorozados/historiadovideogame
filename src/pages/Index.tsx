
import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Calendar, ExternalLink } from 'lucide-react';
import TimelineSection from '@/components/TimelineSection';
import Header from '@/components/Header';
import SearchFilter from '@/components/SearchFilter';
import { useEpisodes, Episode } from '@/hooks/useEpisodes';

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

const Index = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { episodes, loading } = useEpisodes();

  // Filtrar episódios baseado no termo de busca
  const filteredEpisodes = useMemo(() => {
    if (!searchTerm.trim()) return episodes;
    
    const term = searchTerm.toLowerCase();
    return episodes.filter(episode => {
      // Buscar no título e descrição do episódio
      const titleMatch = episode.title?.toLowerCase().includes(term);
      const descMatch = episode.description?.toLowerCase().includes(term);
      
      // Buscar nos eventos da timeline
      const timelineEvents = Array.isArray(episode.timeline_events) 
        ? episode.timeline_events 
        : JSON.parse(episode.timeline_events || '[]');
      
      const timelineMatch = timelineEvents.some((event: any) => 
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term)
      );
      
      return titleMatch || descMatch || timelineMatch;
    });
  }, [episodes, searchTerm]);

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
    setSelectedYear(null);
  };

  const handleYearClick = (yearGroup: YearGroup) => {
    if (yearGroup.events.length === 1) {
      // Se só tem um evento, abre diretamente o episódio
      setSelectedEpisode(yearGroup.events[0].episode);
    } else {
      // Se tem múltiplos eventos, abre o seletor
      setSelectedYear(yearGroup);
    }
  };

  const closeDialog = () => {
    setSelectedEpisode(null);
    setSelectedYear(null);
  };

  const handleImageClick = (imageUrl: string, title: string) => {
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

  const separateEventsByType = (events: YearGroup['events']) => {
    const episodes = events.filter(e => e.isMainEpisode);
    const historicalEvents = events.filter(e => !e.isMainEpisode);
    return { episodes, historicalEvents };
  };

  return (
    <div className="min-h-screen bg-retro-black text-white">
      <Header onAdminClick={() => window.location.href = '/admin/login'} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section with Logo */}
        <section className="text-center mb-16 animate-fade-in-up">
          <div className="mb-8">
            <img 
              src="https://i.postimg.cc/wBSDgDnh/a-dita-histpria-do-videogame.jpg"
              alt="A Dita História do Videogame"
              className="mx-auto max-w-md w-full h-auto rounded-lg border-2 border-retro-yellow shadow-lg shadow-retro-yellow/20"
            />
          </div>
          <p className="font-mono text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Uma jornada épica através da história dos videogames. Sem deixar nenhum pixel para trás. 
            Explore nossa timeline interativa e descubra como os games moldaram nossa cultura.
          </p>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="retro-card p-6 text-center rounded-lg">
            <div className="text-3xl font-bold text-retro-yellow mb-2">{episodes.length}</div>
            <div className="text-gray-300 font-mono">Episódios</div>
          </div>
          <div className="retro-card p-6 text-center rounded-lg">
            <div className="text-3xl font-bold text-retro-blue mb-2">
              {episodes.length > 0 ? episodes[episodes.length - 1].year - episodes[0].year + 1 : 0}
            </div>
            <div className="text-gray-300 font-mono">Anos de História</div>
          </div>
          <div className="retro-card p-6 text-center rounded-lg">
            <div className="text-3xl font-bold text-retro-yellow mb-2">∞</div>
            <div className="text-gray-300 font-mono">Nostalgia</div>
          </div>
        </section>


        {/* Search Section */}
        <section className="mb-12 flex justify-center">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Digite para filtrar por console..."
            label="Filtrar por console:"
          />
        </section>

        {/* Timeline Section */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin text-4xl mb-4">🎮</div>
            <p className="font-mono text-gray-400">
              Carregando episódios...
            </p>
          </div>
        ) : filteredEpisodes.length === 0 && searchTerm ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="font-mono text-gray-400 mb-2">
              Nenhum resultado encontrado para "{searchTerm}"
            </p>
            <p className="font-mono text-sm text-gray-500">
              Tente buscar por outro termo
            </p>
          </div>
        ) : (
          <TimelineSection 
            episodes={filteredEpisodes} 
            onEpisodeClick={handleEpisodeClick}
            onYearClick={handleYearClick}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-background/50 backdrop-blur-sm border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="font-mono text-sm text-muted-foreground mb-4">
            © A DITA HISTÓRIA DO VIDEOGAME 2020-2025.
          </div>
          <div className="font-mono text-sm">
            <a 
              href="mailto:aditahitoriadovideogame@gmail.com" 
              className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
            >
              Entre em contato.
            </a>
          </div>
        </div>
      </footer>

      {/* Episode Detail Modal */}
      <Dialog open={!!selectedEpisode} onOpenChange={closeDialog}>
        <DialogContent className="retro-card border-retro-yellow max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEpisode && (
            <>
              <DialogHeader>
                <DialogTitle className="font-retro text-2xl text-retro-yellow mb-4">
                  {selectedEpisode.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Detalhes do episódio {selectedEpisode.title}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedEpisode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                    alt={selectedEpisode.title}
                    className="w-full aspect-square object-cover rounded-lg border-2 border-retro-blue"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-retro-blue font-mono">
                    <Calendar size={16} />
                    <span>Ano: {selectedEpisode.year}</span>
                  </div>
                  
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedEpisode.description}
                  </div>
                  
                  {selectedEpisode.listen_url && (
                    <Button
                      onClick={() => window.open(selectedEpisode.listen_url!, '_blank')}
                      className="retro-button w-full font-mono font-bold text-retro-black"
                    >
                      <Play size={16} className="mr-2" />
                      Escutar Episódio
                      <ExternalLink size={16} className="ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Year Events Modal */}
      <Dialog open={!!selectedYear} onOpenChange={closeDialog}>
        <DialogContent className="retro-card border-retro-yellow max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedYear && (
            <>
              <DialogHeader>
                <DialogTitle className="font-retro text-2xl text-retro-yellow mb-4">
                  Eventos de {selectedYear.year}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Lista de eventos do ano {selectedYear.year}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {(() => {
                  const { episodes, historicalEvents } = separateEventsByType(selectedYear.events);
                  
                  return (
                    <>
                      {/* Seção de Episódios */}
                      {episodes.length > 0 && (
                        <div>
                          <h4 className="font-mono text-lg text-retro-yellow mb-4 flex items-center gap-2">
                            🎧 Episódios ({episodes.length})
                          </h4>
                          <div className="grid gap-4">
                            {episodes.map((event) => (
                              <div
                                key={`${event.episode.id}-${event.id}`}
                                className="flex items-start gap-4 p-4 bg-gradient-to-r from-retro-yellow/10 to-retro-blue/10 border border-retro-yellow/30 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-retro-yellow/20 hover:to-retro-blue/20 transition-all"
                                onClick={() => handleEpisodeClick(event.episode)}
                              >
                                <img
                                  src={event.image_url || event.episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                                  alt={event.title}
                                  className="w-16 h-16 object-cover rounded border-2 border-retro-yellow flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-mono text-base text-retro-yellow font-bold mb-2">
                                    {event.title}
                                  </h5>
                                  <p className="font-mono text-sm text-retro-blue mb-2">
                                    {new Date(event.date).toLocaleDateString('pt-BR')}
                                  </p>
                                  {event.description && (
                                    <div className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                                      {event.description}
                                    </div>
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
                          <h4 className="font-mono text-lg text-gray-400 mb-4 flex items-center gap-2">
                            📅 Eventos Históricos ({historicalEvents.length})
                          </h4>
                          <div className="grid gap-3">
                            {historicalEvents.map((event) => (
                               <div
                                key={`${event.episode.id}-${event.id}`}
                                className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors border border-gray-600/30"
                              >
                                <img
                                  src={event.image_url || event.episode.cover_image_url || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center'}
                                  alt={event.title}
                                  className="w-12 h-12 object-cover rounded border border-retro-blue flex-shrink-0 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageClick(event.image_url || event.episode.cover_image_url || '', event.title);
                                  }}
                                />
                                <div 
                                  className="flex-1 min-w-0 cursor-pointer"
                                  onClick={() => handleEpisodeClick(event.episode)}
                                >
                                  <h5 className="font-mono text-sm text-gray-300 font-bold mb-1">
                                    {event.title}
                                  </h5>
                                  <p className="font-mono text-xs text-gray-500 mb-2">
                                    {new Date(event.date).toLocaleDateString('pt-BR')} | {event.episode.title}
                                  </p>
                                  {event.description && (
                                    <div className="font-mono text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
                                      {event.description}
                                    </div>
                                  )}
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
