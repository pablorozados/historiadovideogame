
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Upload, Calendar, Type, FileText } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
  image_url?: string;
}

interface MultipleTimestampsProps {
  events: TimelineEvent[];
  onEventsChange: (events: TimelineEvent[]) => void;
  onImageUpload: (eventId: string, file: File) => Promise<string | null>;
}

const MultipleTimestamps = ({ events, onEventsChange, onImageUpload }: MultipleTimestampsProps) => {
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());

  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      date: '',
      title: '',
      description: '',
    };
    onEventsChange([...events, newEvent]);
  };

  const removeEvent = (eventId: string) => {
    onEventsChange(events.filter(event => event.id !== eventId));
  };

  const updateEvent = (eventId: string, field: keyof TimelineEvent, value: string) => {
    onEventsChange(events.map(event => 
      event.id === eventId ? { ...event, [field]: value } : event
    ));
  };

  const handleImageUpload = async (eventId: string, file: File) => {
    setUploadingImages(prev => new Set(prev).add(eventId));
    
    try {
      const imageUrl = await onImageUpload(eventId, file);
      if (imageUrl) {
        updateEvent(eventId, 'image_url', imageUrl);
      }
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="font-retro text-lg text-retro-blue flex items-center gap-2">
          <Calendar size={20} />
          Eventos da Timeline
        </CardTitle>
        <p className="text-sm text-gray-400 font-mono">
          Adicione datas e eventos específicos que aparecerão na timeline interativa
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="bg-black/30 border border-retro-blue/30 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-retro-yellow">
                Evento #{index + 1}
              </span>
              <Button
                onClick={() => removeEvent(event.id)}
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={14} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`date-${event.id}`} className="font-mono text-gray-300 flex items-center gap-2">
                  <Calendar size={14} />
                  Data do Evento *
                </Label>
                <Input
                  id={`date-${event.id}`}
                  type="date"
                  value={event.date}
                  onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                  className="bg-black border-retro-blue text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor={`title-${event.id}`} className="font-mono text-gray-300 flex items-center gap-2">
                  <Type size={14} />
                  Título do Evento *
                </Label>
                <Input
                  id={`title-${event.id}`}
                  value={event.title}
                  onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                  className="bg-black border-retro-blue text-white"
                  placeholder="Ex: Lançamento do Pac-Man"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${event.id}`} className="font-mono text-gray-300 flex items-center gap-2">
                <FileText size={14} />
                Descrição do Evento
              </Label>
              <Textarea
                id={`description-${event.id}`}
                value={event.description || ''}
                onChange={(e) => updateEvent(event.id, 'description', e.target.value.slice(0, 120))}
                className="bg-black border-retro-blue text-white resize-none"
                placeholder="Breve descrição do evento (máx. 120 caracteres)..."
                rows={2}
                maxLength={120}
              />
              <div className="text-xs text-gray-500 mt-1">
                {(event.description || '').length}/120 caracteres
              </div>
            </div>

            <div>
              <Label className="font-mono text-gray-300 flex items-center gap-2">
                <Upload size={14} />
                Imagem do Evento
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(event.id, file);
                    }
                  }}
                  className="bg-black border-retro-blue text-white flex-1"
                  disabled={uploadingImages.has(event.id)}
                />
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-12 h-12 object-cover rounded border border-retro-blue"
                  />
                )}
              </div>
              {uploadingImages.has(event.id) && (
                <p className="text-sm text-retro-yellow mt-1">
                  Fazendo upload da imagem...
                </p>
              )}
            </div>
          </div>
        ))}

        <Button
          onClick={addEvent}
          className="retro-button w-full font-mono font-bold"
          type="button"
        >
          <Plus size={16} className="mr-2" />
          Adicionar Evento na Timeline
        </Button>

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-400 font-mono">
            <Calendar size={32} className="mx-auto mb-2 opacity-50" />
            <p>Nenhum evento adicionado ainda</p>
            <p className="text-sm">Clique no botão acima para adicionar um evento</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultipleTimestamps;
