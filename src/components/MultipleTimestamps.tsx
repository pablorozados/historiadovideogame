
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  image_url?: string;
}

interface MultipleTimestampsProps {
  events: TimelineEvent[];
  onEventsChange: (events: TimelineEvent[]) => void;
  onImageUpload: (eventId: string, file: File) => Promise<string | null>;
}

const MultipleTimestamps = ({ events, onEventsChange, onImageUpload }: MultipleTimestampsProps) => {
  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: '',
      title: '',
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
    const imageUrl = await onImageUpload(eventId, file);
    if (imageUrl) {
      updateEvent(eventId, 'image_url', imageUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="font-mono text-gray-300 text-lg">
          Eventos da Timeline
        </Label>
        <Button
          type="button"
          onClick={addEvent}
          variant="outline"
          size="sm"
          className="border-retro-blue text-retro-blue hover:bg-retro-blue hover:text-black"
        >
          <Plus size={16} className="mr-2" />
          Adicionar Evento
        </Button>
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-600 rounded-lg">
          <p className="text-gray-400 font-mono">
            Nenhum evento adicionado. Clique em "Adicionar Evento" para começar.
          </p>
        </div>
      )}

      {events.map((event, index) => (
        <div key={event.id} className="bg-black/50 border border-retro-blue rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-retro-yellow text-sm">
              Evento {index + 1}
            </span>
            <Button
              type="button"
              onClick={() => removeEvent(event.id)}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <Trash2 size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`event-date-${event.id}`} className="font-mono text-gray-300 text-sm">
                Data do Evento *
              </Label>
              <Input
                id={`event-date-${event.id}`}
                type="date"
                value={event.date}
                onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                className="bg-black border-retro-blue text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor={`event-title-${event.id}`} className="font-mono text-gray-300 text-sm">
                Título do Evento *
              </Label>
              <Input
                id={`event-title-${event.id}`}
                value={event.title}
                onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                className="bg-black border-retro-blue text-white"
                placeholder="Ex: Nimatron (Nim eletrônico)"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor={`event-image-${event.id}`} className="font-mono text-gray-300 text-sm">
              Imagem do Evento (opcional)
            </Label>
            <Input
              id={`event-image-${event.id}`}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(event.id, file);
                }
              }}
              className="bg-black border-retro-blue text-white"
            />
            {event.image_url && (
              <div className="mt-2">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-16 h-16 object-cover rounded border border-retro-blue"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleTimestamps;
