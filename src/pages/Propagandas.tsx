import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, LogOut, Trash2, Edit, ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdvertisements, Advertisement } from '@/hooks/useAdvertisements';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ImageViewer from '@/components/ImageViewer';

const Propagandas = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { advertisements, loading: adsLoading, addAdvertisement, updateAdvertisement, deleteAdvertisement, uploadImage } = useAdvertisements();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
  description: '',
  system: '',
  enviada_por: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [viewerImage, setViewerImage] = useState<{url: string, alt: string} | null>(null);

  const handleAdminClick = () => {
    if (!user) {
      window.location.href = '/admin/login';
    } else {
      setShowAdminPanel(!showAdminPanel);
    }
  };

  const resetForm = () => {
    setFormData({
      description: '',
      system: '',
      enviada_por: '',
    });
    setImageFile(null);
    setEditingAd(null);
    
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
  setFormData({
    description: ad.description,
    system: ad.system,
    enviada_por: ad.enviada_por || '',
  });
    setShowAdminPanel(true);
  };

  const handleDelete = async (adId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta propaganda?')) {
      await deleteAdvertisement(adId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile && !editingAd) {
      toast({
        title: "Erro",
        description: "Selecione uma imagem",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = editingAd?.image_url || null;
      
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

  const adData = {
    description: formData.description,
    system: formData.system,
    enviada_por: formData.enviada_por,
    image_url: imageUrl!,
  };

      let error;
      if (editingAd) {
        const result = await updateAdvertisement(editingAd.id, adData);
        error = result.error;
      } else {
        const result = await addAdvertisement(adData);
        error = result.error;
      }
      
      if (!error) {
        resetForm();
        setShowAdminPanel(false);
      }
    } catch (error) {
      console.error('Error submitting advertisement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowAdminPanel(false);
  };

  return (
    <div className="min-h-screen bg-retro-black">
      <Header onAdminClick={handleAdminClick} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-retro text-4xl md:text-6xl text-retro-yellow mb-4">
            PROPAGANDAS NACIONAIS
          </h1>
          <p className="font-mono text-gray-300 text-lg">
            Coleção de propagandas de videogames brasileiras
          </p>
        </div>

        {/* Admin Panel */}
        {showAdminPanel && user && (
          <Card className="retro-card mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-retro text-xl text-retro-blue flex items-center gap-2">
                  {editingAd ? <Edit size={20} /> : <Plus size={20} />}
                  {editingAd ? 'Editar Propaganda' : 'Adicionar Propaganda'}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowAdminPanel(false)}
                    variant="outline"
                    size="sm"
                    className="border-gray-500 text-gray-400"
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="enviada_por" className="font-mono text-gray-300">
                    Enviada por *
                  </Label>
                  <Input
                    id="enviada_por"
                    value={formData.enviada_por}
                    onChange={(e) => setFormData(prev => ({ ...prev, enviada_por: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                    placeholder="Ex: Pablo Prime"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image-upload" className="font-mono text-gray-300">
                    Imagem da Propaganda *
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="bg-black border-retro-blue text-white"
                    required={!editingAd}
                  />
                  {imageFile && (
                    <div className="mt-2">
                      <p className="text-sm text-retro-yellow mb-2">
                        Arquivo selecionado: {imageFile.name}
                      </p>
                      <img 
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded border border-retro-blue"
                      />
                    </div>
                  )}
                  {editingAd && !imageFile && editingAd.image_url && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400 mb-2">
                        Imagem atual será mantida se nenhuma nova for selecionada
                      </p>
                      <img 
                        src={editingAd.image_url}
                        alt="Imagem atual"
                        className="w-32 h-32 object-cover rounded border border-retro-blue"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="font-mono text-gray-300">
                    Descrição *
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                    placeholder="Ex: Sapo Xulé vs. Os Invasores do Brejo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="system" className="font-mono text-gray-300">
                    Sistema *
                  </Label>
                  <Input
                    id="system"
                    value={formData.system}
                    onChange={(e) => setFormData(prev => ({ ...prev, system: e.target.value }))}
                    className="bg-black border-retro-blue text-white"
                    placeholder="Ex: Sega Master System"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="retro-button flex-1 font-mono font-bold"
                  >
                    {editingAd ? <Edit size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                    {isSubmitting ? 'Salvando...' : editingAd ? 'Atualizar Propaganda' : 'Adicionar Propaganda'}
                  </Button>
                  {editingAd && (
                    <Button
                      type="button"
                      onClick={resetForm}
                      variant="outline"
                      className="border-gray-500 text-gray-400"
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Advertisements Grid */}
        {adsLoading ? (
          <div className="text-center py-16">
            <div className="text-retro-yellow font-mono">Carregando propagandas...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map((ad) => (
              <Card key={ad.id} className="retro-card group hover:scale-105 transition-transform">
                <CardContent className="p-4">
                  <div className="relative">
                    <img 
                      src={ad.image_url} 
                      alt={ad.description}
                      className="w-full h-64 object-cover rounded border border-retro-blue mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setViewerImage({url: ad.image_url, alt: ad.description})}
                    />
                    {user && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => handleEdit(ad)}
                          size="sm"
                          variant="outline"
                          className="border-retro-blue text-retro-blue hover:bg-retro-blue hover:text-black p-1"
                        >
                          <Edit size={12} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(ad.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white p-1"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-mono text-retro-yellow text-lg mb-2">
                    {ad.description}
                  </h3>
                  <p className="font-mono text-retro-blue text-sm">
                    {ad.system}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Enviada por: {ad.enviada_por ? ad.enviada_por : 'Pablo Prime'}
                  </p>
                </CardContent>
              </Card>
            ))}
            
            {advertisements.length === 0 && (
              <div className="col-span-full text-center py-16">
                <ImageIcon size={64} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 font-mono">
                  Nenhuma propaganda cadastrada ainda
                </p>
                {user && (
                  <Button
                    onClick={() => setShowAdminPanel(true)}
                    className="retro-button mt-4"
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar Primeira Propaganda
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      <ImageViewer
        isOpen={!!viewerImage}
        onClose={() => setViewerImage(null)}
        imageUrl={viewerImage?.url || ''}
        imageAlt={viewerImage?.alt || ''}
      />
    </div>
  );
};

export default Propagandas;