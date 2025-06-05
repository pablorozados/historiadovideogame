
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Episode } from '@/pages/Index';

interface AdminPanelProps {
  episodes: Episode[];
  onAddEpisode: (episode: Omit<Episode, 'id'>) => void;
  onBackToSite: () => void;
}

const AdminPanel = ({ episodes, onAddEpisode, onBackToSite }: AdminPanelProps) => {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    description: '',
    listenUrl: '',
    coverImage: '',
    date: ''
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo login - in production, use proper authentication
    if (loginData.username === 'admin' && loginData.password === 'podcast123') {
      setIsLoggedIn(true);
    } else {
      alert('Credenciais inválidas! Use: admin / podcast123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.year || !formData.description) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onAddEpisode({
      title: formData.title,
      year: parseInt(formData.year),
      description: formData.description,
      listenUrl: formData.listenUrl || '#',
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop&crop=center',
      date: formData.date || `${formData.year}-01-01`
    });

    setFormData({
      title: '',
      year: '',
      description: '',
      listenUrl: '',
      coverImage: '',
      date: ''
    });

    alert('Episódio adicionado com sucesso!');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-retro-black flex items-center justify-center p-4">
        <Card className="retro-card w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-retro text-2xl text-retro-yellow text-center">
              LOGIN ADMIN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="font-mono text-gray-300">
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  className="bg-black border-retro-blue text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="font-mono text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-black border-retro-blue text-white"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={onBackToSite}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="retro-button flex-1 font-mono"
                >
                  Entrar
                </Button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center font-mono">
              Demo: admin / podcast123
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-black p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBackToSite}
            variant="outline"
            className="border-retro-yellow text-retro-yellow"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao Site
          </Button>
          <h1 className="font-retro text-3xl text-retro-yellow">
            PAINEL ADMINISTRATIVO
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Episode Form */}
          <Card className="retro-card">
            <CardHeader>
              <CardTitle className="font-retro text-xl text-retro-blue flex items-center gap-2">
                <Plus size={20} />
                Adicionar Episódio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="font-mono text-gray-300">
                    Nome do Episódio *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                    placeholder="Ex: A Era do Atari 2600"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="year" className="font-mono text-gray-300">
                    Ano Histórico *
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                    placeholder="Ex: 1977"
                    min="1970"
                    max="2030"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date" className="font-mono text-gray-300">
                    Data Específica
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="font-mono text-gray-300">
                    Descrição *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                    placeholder="Descreva o episódio..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="listenUrl" className="font-mono text-gray-300">
                    Link para Escutar
                  </Label>
                  <Input
                    id="listenUrl"
                    type="url"
                    value={formData.listenUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, listenUrl: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                    placeholder="https://spotify.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="coverImage" className="font-mono text-gray-300">
                    URL da Capa
                  </Label>
                  <Input
                    id="coverImage"
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <Button
                  type="submit"
                  className="retro-button w-full font-mono font-bold"
                >
                  <Plus size={16} className="mr-2" />
                  Adicionar Episódio
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Episodes List */}
          <Card className="retro-card">
            <CardHeader>
              <CardTitle className="font-retro text-xl text-retro-yellow">
                Episódios ({episodes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="bg-black/50 border border-retro-blue rounded p-3"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-mono text-sm text-retro-yellow truncate">
                          {episode.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          Ano: {episode.year}
                        </p>
                        <p className="text-xs text-gray-300 line-clamp-2 mt-1">
                          {episode.description}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {episodes.length === 0 && (
                  <p className="text-gray-400 text-center py-8 font-mono">
                    Nenhum episódio cadastrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
