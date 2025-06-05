
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Upload, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEpisodes } from '@/hooks/useEpisodes';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, signOut } = useAuth();
  const { episodes, addEpisode, uploadImage } = useEpisodes();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    listen_url: '',
    historical_date: '',
    year: new Date().getFullYear(),
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let coverImageUrl = null;
      
      if (coverFile) {
        coverImageUrl = await uploadImage(coverFile);
        if (!coverImageUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      const episodeData = {
        title: formData.title,
        description: formData.description,
        listen_url: formData.listen_url,
        cover_image_url: coverImageUrl,
        historical_date: formData.historical_date,
        year: formData.year,
      };

      const { error } = await addEpisode(episodeData);
      
      if (!error) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          listen_url: '',
          historical_date: '',
          year: new Date().getFullYear(),
        });
        setCoverFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('cover-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error submitting episode:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-retro-black p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => window.location.href = '/'}
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
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year" className="font-mono text-gray-300">
                      Ano Histórico *
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="bg-black border-retro-blue text-white"
                      placeholder="1977"
                      min="1970"
                      max="2030"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="historical_date" className="font-mono text-gray-300">
                      Data Específica *
                    </Label>
                    <Input
                      id="historical_date"
                      type="date"
                      value={formData.historical_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, historical_date: e.target.value }))}
                      className="bg-black border-retro-blue text-white"
                      required
                    />
                  </div>
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
                  <Label htmlFor="listen_url" className="font-mono text-gray-300">
                    Link para Escutar
                  </Label>
                  <Input
                    id="listen_url"
                    type="url"
                    value={formData.listen_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, listen_url: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                    placeholder="https://spotify.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="cover-upload" className="font-mono text-gray-300">
                    Imagem de Capa
                  </Label>
                  <Input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                    className="bg-black border-retro-blue text-white"
                  />
                  {coverFile && (
                    <p className="text-sm text-retro-yellow mt-1">
                      Arquivo selecionado: {coverFile.name}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="retro-button w-full font-mono font-bold"
                >
                  <Plus size={16} className="mr-2" />
                  {isSubmitting ? 'Adicionando...' : 'Adicionar Episódio'}
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
                          Ano: {episode.year} | Data: {new Date(episode.historical_date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-300 line-clamp-2 mt-1">
                          {episode.description}
                        </p>
                        {episode.listen_url && (
                          <a 
                            href={episode.listen_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-retro-blue hover:text-retro-yellow"
                          >
                            Link para escutar
                          </a>
                        )}
                      </div>
                      {episode.cover_image_url && (
                        <img 
                          src={episode.cover_image_url} 
                          alt={episode.title}
                          className="w-12 h-12 object-cover rounded border border-retro-blue"
                        />
                      )}
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

export default Admin;
