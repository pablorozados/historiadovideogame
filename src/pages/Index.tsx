
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Calendar, ExternalLink } from 'lucide-react';
import TimelineSection from '@/components/TimelineSection';
import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';

// Mock data for demonstration
const mockEpisodes = [
  {
    id: '1',
    title: 'O Nascimento dos Arcades',
    year: 1972,
    description: 'A história de Pong e como tudo começou no mundo dos videogames.',
    listenUrl: 'https://spotify.com/episode1',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center',
    date: '1972-11-29'
  },
  {
    id: '2',
    title: 'A Revolução do Atari 2600',
    year: 1977,
    description: 'Como o Atari 2600 trouxe os videogames para casa e mudou tudo.',
    listenUrl: 'https://spotify.com/episode2',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&crop=center',
    date: '1977-09-11'
  },
  {
    id: '3',
    title: 'O Crash de 1983',
    year: 1983,
    description: 'A grande crise da indústria dos videogames e suas consequências.',
    listenUrl: 'https://spotify.com/episode3',
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop&crop=center',
    date: '1983-12-01'
  },
  {
    id: '4',
    title: 'A Era Dourada do NES',
    year: 1985,
    description: 'Como o Nintendo Entertainment System salvou a indústria.',
    listenUrl: 'https://spotify.com/episode4',
    coverImage: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=400&fit=crop&crop=center',
    date: '1985-10-18'
  },
  {
    id: '5',
    title: 'A Guerra dos 16-bits',
    year: 1989,
    description: 'Sega Genesis vs Super Nintendo: a batalha épica dos anos 90.',
    listenUrl: 'https://spotify.com/episode5',
    coverImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop&crop=center',
    date: '1989-08-14'
  },
  {
    id: '6',
    title: 'A Revolução PlayStation',
    year: 1995,
    description: 'Como a Sony mudou o jogo com CDs e gráficos 3D.',
    listenUrl: 'https://spotify.com/episode6',
    coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop&crop=center',
    date: '1995-12-03'
  },
];

export interface Episode {
  id: string;
  title: string;
  year: number;
  description: string;
  listenUrl: string;
  coverImage: string;
  date: string;
}

const Index = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>(mockEpisodes);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleEpisodeClick = (episode: Episode) => {
    setSelectedEpisode(episode);
  };

  const closeDialog = () => {
    setSelectedEpisode(null);
  };

  const addEpisode = (newEpisode: Omit<Episode, 'id'>) => {
    const episode: Episode = {
      ...newEpisode,
      id: Date.now().toString(),
    };
    setEpisodes(prev => [...prev, episode].sort((a, b) => a.year - b.year));
  };

  if (isAdmin) {
    return (
      <AdminPanel 
        episodes={episodes}
        onAddEpisode={addEpisode}
        onBackToSite={() => setIsAdmin(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-retro-black text-white">
      <Header onAdminClick={() => setIsAdmin(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-fade-in-up">
          <h1 className="font-retro font-black text-4xl md:text-6xl lg:text-7xl mb-6 text-retro-yellow drop-shadow-lg">
            A DITA HISTÓRIA DO
            <br />
            <span className="text-retro-blue">VIDEOGAME</span>
          </h1>
          <p className="font-mono text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Uma jornada épica através da história dos videogames, episódio por episódio, 
            ano por ano. Explore nossa timeline interativa e descubra como os games 
            moldaram nossa cultura.
          </p>
        </section>

        {/* Timeline Section */}
        <TimelineSection 
          episodes={episodes} 
          onEpisodeClick={handleEpisodeClick} 
        />

        {/* Statistics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="retro-card p-6 text-center rounded-lg">
            <div className="text-3xl font-bold text-retro-yellow mb-2">{episodes.length}</div>
            <div className="text-gray-300 font-mono">Episódios</div>
          </div>
          <div className="retro-card p-6 text-center rounded-lg">
            <div className="text-3xl font-bold text-retro-blue mb-2">
              {episodes.length > 0 ? episodes[episodes.length - 1].year - episodes[0].year : 0}
            </div>
            <div className="text-gray-300 font-mono">Anos de História</div>
          </div>
          <div className="retro-card p-6 text-center rounded-lg">
            <div className="text-3xl font-bold text-retro-yellow mb-2">∞</div>
            <div className="text-gray-300 font-mono">Nostalgia</div>
          </div>
        </section>
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
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedEpisode.coverImage}
                    alt={selectedEpisode.title}
                    className="w-full h-48 object-cover rounded-lg border-2 border-retro-blue"
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
                  
                  <Button
                    onClick={() => window.open(selectedEpisode.listenUrl, '_blank')}
                    className="retro-button w-full font-mono font-bold text-retro-black"
                  >
                    <Play size={16} className="mr-2" />
                    Escutar Episódio
                    <ExternalLink size={16} className="ml-2" />
                  </Button>
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
