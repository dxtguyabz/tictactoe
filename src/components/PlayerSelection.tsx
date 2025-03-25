
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PlayerSelectionProps {
  onSelect: (mode: 'single' | 'multi') => void;
}

const PlayerSelection = ({ onSelect }: PlayerSelectionProps) => {
  const [selected, setSelected] = React.useState<'single' | 'multi'>('single');

  const handleSelect = () => {
    onSelect(selected);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-morphism p-6 rounded-xl max-w-md w-full mx-auto"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="text-2xl font-bold text-gradient mb-6 text-center"
      >
        Choose Game Mode
      </motion.h2>

      <RadioGroup 
        value={selected} 
        onValueChange={(value) => setSelected(value as 'single' | 'multi')}
        className="space-y-4 mb-6"
      >
        <div className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-white/5">
          <RadioGroupItem value="single" id="single" className="border-white/20" />
          <Label htmlFor="single" className="flex items-center gap-2 cursor-pointer font-medium">
            <span className="text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              vs
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="5" y="5" rx="2"/>
                <path d="M14 5v14"/>
                <path d="M5 14h14"/>
              </svg>
            </span>
            <span className="text-white/80">1 Player (vs Computer)</span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-white/5">
          <RadioGroupItem value="multi" id="multi" className="border-white/20" />
          <Label htmlFor="multi" className="flex items-center gap-2 cursor-pointer font-medium">
            <span className="text-white flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              vs
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <span className="text-white/80">2 Players</span>
          </Label>
        </div>
      </RadioGroup>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button 
          onClick={handleSelect}
          className="w-full py-6 text-lg font-medium bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md transition-all duration-300 ease-out hover:shadow-lg"
        >
          Start Game
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default PlayerSelection;
