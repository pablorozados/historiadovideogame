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
  const imageRef = useRef<HTMLImageElement>(null);

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev * 1.2, 5));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
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
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
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