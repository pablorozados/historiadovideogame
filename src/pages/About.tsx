
import React, { useEffect, useRef } from 'react';
import Header from '@/components/Header';

const About = () => {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    });

    cardsRef.current.forEach(card => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <Header onAdminClick={() => window.location.href = '/admin/login'} />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="hero-section bg-white/95 backdrop-blur-sm rounded-3xl p-12 mb-8 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-teal-400 via-blue-400 to-yellow-400 animate-pulse"></div>
          
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 uppercase tracking-tight">
            A Dita História do Videogame
          </h1>
          <p className="text-xl text-gray-600 font-light mb-8 italic">
            Desvendando a teia complexa da história dos games
          </p>
          
          <div className="flex justify-center gap-8 opacity-60">
            {['🎮', '🕹️', '👾', '🎯'].map((icon, index) => (
              <div 
                key={index}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl animate-bounce"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        <div className="content-section bg-white/95 backdrop-blur-sm rounded-2xl p-10 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="section-title text-3xl font-bold text-gray-800 mb-6 relative pb-2">
            Onde Escutar
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Spotify', url: 'https://open.spotify.com/show/5h8Vp3X89gUBXEi7VCI6xs', icon: 'S', color: 'from-green-500 to-green-600' },
              { name: 'Pocket Casts', url: 'https://pca.st/73o2nx84', icon: 'PC', color: 'from-red-500 to-red-600' },
              { name: 'Amazon Music', url: 'https://music.amazon.com.br/podcasts/281bd375-3bc4-4b65-a930-85b687128666/a-dita-história-do-videogame', icon: 'A', color: 'from-orange-500 to-orange-600' },
              { name: 'Apple Podcast', url: 'https://podcasts.apple.com/br/podcast/a-dita-hist%C3%B3ria-do-videogame/id1513923155', icon: '🍎', color: 'from-gray-800 to-gray-900' },
              { name: 'Overcast', url: 'https://overcast.fm/itunes1513923155/a-dita-hist-ria-do-videogame', icon: 'OC', color: 'from-orange-600 to-orange-700' },
              { name: 'Deezer', url: 'https://dzr.page.link/T63CpEyHqzob2K437', icon: 'D', color: 'from-pink-500 to-pink-600' }
            ].map((platform, index) => (
              <a 
                key={index}
                href={platform.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-gray-700 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-2 border-transparent hover:border-blue-500 no-underline"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                  {platform.icon}
                </div>
                <span>{platform.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="content-section bg-white/95 backdrop-blur-sm rounded-2xl p-10 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="section-title text-3xl font-bold text-gray-800 mb-6 relative pb-2">
            Sobre o Host
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
          </h2>
          
          <div className="host-name text-2xl font-semibold text-gray-700 mb-2">Pablo Prime</div>
          <p className="text-lg text-gray-600 leading-relaxed">
            <span className="bg-gradient-to-r from-yellow-200 to-orange-200 px-2 py-1 rounded font-semibold text-gray-800">
              Jornalista de formação
            </span>, repórter, apresentador, editor, redator, podcaster e produtor. 
            Com mais de <strong>15 anos dedicados ao jornalismo de games</strong>, Pablo mudou de área de atuação, 
            mas não de paixão. Todo esse tempo mexendo com games deu uma visão bem particular sobre as histórias 
            que moldaram essa indústria bilionária.
          </p>
        </div>

        <div className="content-section bg-white/95 backdrop-blur-sm rounded-2xl p-10 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="section-title text-3xl font-bold text-gray-800 mb-6 relative pb-2">
            O Propósito do Podcast
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            <strong>A Dita História do Videogame</strong> tem o propósito ambicioso de criar uma{' '}
            <span className="bg-gradient-to-r from-yellow-200 to-orange-200 px-2 py-1 rounded font-semibold text-gray-800">
              linha do tempo detalhada
            </span>{' '}
            sobre a história do videogame, por mais complexo que isso possa ser. Este não é apenas mais um podcast sobre games - 
            é uma jornada profunda pelas conexões inesperadas que moldaram nossa paixão.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 my-8 rounded-lg italic text-lg relative">
            <div className="text-4xl text-blue-500 absolute -top-2 left-4 font-serif">"</div>
            A história não é uma linha como parece, ela é uma teia. 
            Muitas vezes, uma coisa nada a ver tem ligação com um acontecimento, mudando totalmente nossa história.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div 
              ref={addToRefs}
              className="bg-gradient-to-r from-pink-400 to-red-500 text-white p-6 rounded-xl text-center transform perspective-1000 transition-all duration-300 hover:rotate-x-1 hover:-translate-y-2 hover:shadow-lg"
            >
              <h3 className="text-xl mb-2 font-semibold">🤝 Conexões Inesperadas</h3>
              <p>Como uma amizade pode criar uma das empresas mais bem-sucedidas do entretenimento eletrônico?</p>
            </div>
            <div 
              ref={addToRefs}
              className="bg-gradient-to-r from-pink-400 to-red-500 text-white p-6 rounded-xl text-center transform perspective-1000 transition-all duration-300 hover:rotate-x-1 hover:-translate-y-2 hover:shadow-lg"
            >
              <h3 className="text-xl mb-2 font-semibold">📈 Ascensão e Queda</h3>
              <p>E como essa mesma empresa pode fracassar de tal forma que quase a extinguiu completamente?</p>
            </div>
          </div>
        </div>

        <div className="content-section bg-white/95 backdrop-blur-sm rounded-2xl p-10 mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
          <h2 className="section-title text-3xl font-bold text-gray-800 mb-6 relative pb-2">
            O Formato
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            <strong>Sem imagens, mas muita conversa.</strong> O podcast privilegia a narrativa oral, onde cada episódio 
            é uma conversa sobre os momentos que definiram os videogames.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Todo conteúdo é meticulosamente pesquisado, trazendo não apenas os fatos, mas o <em>contexto</em> - 
            aqueles detalhes que transformam informação em compreensão verdadeira.
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-white/10 to-transparent animate-pulse"></div>
          <p className="text-xl font-semibold relative z-10">
            📻 Descubra como <strong>reviravoltas incríveis</strong> criaram a <strong>DITA HISTÓRIA DO VIDEOGAME</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
