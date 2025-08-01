
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  onAdminClick: () => void;
}

const Header = ({ onAdminClick }: HeaderProps) => {
  const location = useLocation();

  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-retro font-bold text-xl text-retro-yellow hover:text-retro-yellow/80 transition-colors">
            A DITA HISTÓRIA DO VIDEOGAME
          </Link>
        </div>
        
        <nav className="flex items-center gap-6">
          <a 
            href="https://pod.link/1513923155" 
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-gray-400 hover:text-retro-yellow transition-colors hidden md:block"
          >
            🎧 Escute o último episódio
          </a>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-retro-yellow transition-colors font-mono text-xs hidden sm:flex items-center gap-2"
              >
                <Heart size={16} />
                Apoie o podcast
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-retro-yellow max-w-md">
              <DialogHeader>
                <DialogTitle className="font-retro text-retro-yellow text-center">
                  Ajude a manter o podcast
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 p-4">
                <img 
                  src="/lovable-uploads/8861bd33-a7a0-400d-82ac-8bdb7175ab83.png"
                  alt="QR Code Pix para doação"
                  className="w-64 h-64 object-contain"
                />
                <p className="font-mono text-gray-300 text-center text-sm">
                  Use o Pix para contribuir com qualquer valor e ajudar a manter o podcast no ar!
                </p>
              </div>
            </DialogContent>
          </Dialog>
          <a 
            href="/#timeline" 
            className="font-mono text-gray-300 hover:text-retro-yellow transition-colors"
          >
            Timeline
          </a>
          <Link 
            to="/propagandas" 
            className={`font-mono transition-colors ${
              location.pathname === '/propagandas' 
                ? 'text-retro-yellow' 
                : 'text-gray-300 hover:text-retro-yellow'
            }`}
          >
            Propagandas
          </Link>
          <Link 
            to="/sobre" 
            className={`font-mono transition-colors ${
              location.pathname === '/sobre' 
                ? 'text-retro-yellow' 
                : 'text-gray-300 hover:text-retro-yellow'
            }`}
          >
            Sobre
          </Link>
          <Button
            onClick={onAdminClick}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-retro-yellow"
          >
            <Settings size={16} />
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
