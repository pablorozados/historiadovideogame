import React, { useState, useRef, useCallback } from 'react';
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
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Função para calcular o fit inicial da imagem
  const calculateInitialFit = useCallback(() => {
    if (!imageRef.current) return;
    
    const container = imageRef.current.parentElement;
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imageWidth = imageRef.current.naturalWidth;
    const imageHeight = imageRef.current.naturalHeight;
    
    // Calcula o scale para fit na tela
    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;
    const initialScale = Math.min(scaleX, scaleY, 1); // Não aumenta além do tamanho original
    
    setScale(initialScale);
    setPosition({ x: 0, y: 0 });
    setImageSize({ width: imageWidth, height: imageHeight });
  }, []);

  const resetView = useCallback(() => {
    calculateInitialFit();
  }, [calculateInitialFit]);

  const zoomIn = useCallback(() => {
    setScale(prev => {
      const newScale = Math.min(prev * 1.2, 5);
      // Centraliza ao dar zoom in também
      setPosition({ x: 0, y: 0 });
      return newScale;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev / 1.2, 0.1);
      // Centraliza ao dar zoom out
      setPosition({ x: 0, y: 0 });
      return newScale;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [scale, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, scale, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, [zoomIn, zoomOut]);

  React.useEffect(() => {
    if (!isOpen) {
      resetView();
    }
  }, [isOpen, resetView]);

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
            >
              <ZoomIn size={20} />
            </Button>
            <Button
              onClick={zoomOut}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <ZoomOut size={20} />
            </Button>
            <Button
              onClick={resetView}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              title="Resetar zoom"
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
            className="w-full h-full flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt={imageAlt}
              className="max-w-none transition-transform duration-100"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              onLoad={calculateInitialFit}
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