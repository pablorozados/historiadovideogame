
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Episode {
  id: string;
  title: string;
  description: string | null;
  listen_url: string | null;
  cover_image_url: string | null;
  historical_date: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export const useEpisodes = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .order('year', { ascending: true });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar episódios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addEpisode = async (episodeData: Omit<Episode, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .insert([episodeData])
        .select()
        .single();

      if (error) throw error;

      setEpisodes(prev => [...prev, data].sort((a, b) => a.year - b.year));
      toast({
        title: "Sucesso",
        description: "Episódio adicionado com sucesso!",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error adding episode:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar episódio",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateEpisode = async (id: string, episodeData: Partial<Omit<Episode, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .update({ ...episodeData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEpisodes(prev => prev.map(ep => ep.id === id ? data : ep).sort((a, b) => a.year - b.year));
      toast({
        title: "Sucesso",
        description: "Episódio atualizado com sucesso!",
      });
      return { data, error: null };
    } catch (error) {
      console.error('Error updating episode:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar episódio",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteEpisode = async (id: string) => {
    try {
      const { error } = await supabase
        .from('episodes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEpisodes(prev => prev.filter(ep => ep.id !== id));
      toast({
        title: "Sucesso",
        description: "Episódio excluído com sucesso!",
      });
      return { error: null };
    } catch (error) {
      console.error('Error deleting episode:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir episódio",
        variant: "destructive",
      });
      return { error };
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('episode-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('episode-covers')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload da imagem",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, []);

  return {
    episodes,
    loading,
    addEpisode,
    updateEpisode,
    deleteEpisode,
    uploadImage,
    refetch: fetchEpisodes,
  };
};
