
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Calendar, ExternalLink } from 'lucide-react';
import TimelineSection from '@/components/TimelineSection';
import Header from '@/components/Header';
import { useEpisodes, Episode } from '@/hooks/useEpisodes';

const Index = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const { episodes, loading } = useEpisodes();

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const closeDialog = () => {
    setSelectedEpisode(null);
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
            Uma jornada épica através da história dos videogames, episódio por episódio, 
            ano por ano. Explore nossa timeline interativa e descubra como os games 
            moldaram nossa cultura.
          </p>
        </section>

        {/* Statistics - Movido para antes da timeline */}
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

        {/* Timeline Section */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin text-4xl mb-4">🎮</div>
            <p className="font-mono text-gray-400">
              Carregando episódios...
            </p>
          </div>
        ) : (
          <TimelineSection 
            episodes={episodes} 
            onEpisodeClick={handleEpisodeClick} 
          />
        )}
      </main>

      {/* Episode Detail Modal */}
      <Dialog open={!!selectedEpisode} onOpenChange={closeDialog}>
        <DialogContent className="retro-card border-retro-yellow max-w-2xl">
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
                  
                  <p className="text-gray-300 leading-relaxed">
                    {selectedEpisode.description}
                  </p>
                  
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
    </div>
  );
};

export default Index;
