
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
}

const Header = ({ onAdminClick }: HeaderProps) => {
  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="font-retro font-bold text-xl text-retro-yellow">
            A DITA HISTÓRIA DO VIDEOGAME
          </span>
        </div>
        
        <nav className="flex items-center gap-6">
          <a 
            href="#timeline" 
            className="font-mono text-gray-300 hover:text-retro-yellow transition-colors"
          >
            Timeline
          </a>
          <a 
            href="#sobre" 
            className="font-mono text-gray-300 hover:text-retro-yellow transition-colors hidden sm:block"
          >
            Sobre
          </a>
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
