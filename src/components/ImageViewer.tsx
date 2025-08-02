import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  imageAlt 
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialScale, setInitialScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateFitScale = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return 1;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const imageWidth = imageRef.current.naturalWidth;
    const imageHeight = imageRef.current.naturalHeight;
    
    if (imageWidth === 0 || imageHeight === 0) return 1;
    
    // Calcula o scale para fit na tela com 90% do espaço disponível
    const scaleX = (containerWidth * 0.9) / imageWidth;
    const scaleY = (containerHeight * 0.9) / imageHeight;
    return Math.min(scaleX, scaleY, 1); // Não aumenta além do tamanho original
  }, []);

  const resetView = useCallback(() => {
    const fitScale = calculateFitScale();
    setInitialScale(fitScale);
    setScale(fitScale);
    setPosition({ x: 0, y: 0 });
  }, [calculateFitScale]);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.2, 3));
    setPosition({ x: 0, y: 0 });
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.2, initialScale * 0.5));
    setPosition({ x: 0, y: 0 });
  }, [initialScale]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > initialScale) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [scale, position, initialScale]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > initialScale) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, scale, dragStart, initialScale]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev * 1.1, 3));
    } else {
      setScale(prev => Math.max(prev / 1.1, initialScale * 0.5));
    }
    setPosition({ x: 0, y: 0 });
  }, [initialScale]);

  const handleImageLoad = useCallback(() => {
    // Pequeno delay para garantir que o container está renderizado
    setTimeout(() => {
      resetView();
    }, 100);
  }, [resetView]);

  // Reset quando o modal abre
  useEffect(() => {
    if (isOpen) {
      // Reset inicial
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setInitialScale(1);
    }
  }, [isOpen, imageUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          >
            <X size={24} />
          </Button>

          {/* Controls */}
          <div className="absolute top-4 left-4 z-50 flex gap-2">
            <Button
              onClick={zoomIn}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </Button>
            <Button
              onClick={zoomOut}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </Button>
            <Button
              onClick={resetView}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              title="Ajustar à tela"
            >
              <RotateCcw size={20} />
            </Button>
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-4 z-50 bg-black/50 text-white px-3 py-1 rounded font-mono text-sm">
            {Math.round(scale * 100)}%
          </div>

          {/* Image container */}
          <div 
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={imageAlt}
              className="transition-transform duration-150 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: isDragging ? 'grabbing' : (scale > initialScale ? 'grab' : 'default'),
                maxWidth: 'none',
                maxHeight: 'none'
              }}
              onLoad={handleImageLoad}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              draggable={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;