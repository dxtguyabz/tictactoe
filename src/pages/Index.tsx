
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const startGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/game');
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-12 bg-gradient-to-br from-background via-background/95 to-background/90">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glass-morphism flex flex-col items-center max-w-md w-full p-8 rounded-2xl space-y-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-20 h-20 relative mb-4"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="x-mark opacity-70"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="o-mark opacity-70"></div>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold text-gradient tracking-tight text-center"
        >
          Welcome, Faiza
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg text-white/80 text-center"
        >
          To a world where AI coding revolutionizes everything
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full max-w-xs"
        >
          <Button 
            onClick={startGame} 
            disabled={isLoading}
            className="w-full py-6 text-lg font-medium bg-white/10 hover:bg-white/15 border border-white/10 backdrop-blur-md transition-all duration-300 ease-out hover:shadow-lg"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Begin Your AI Coding Intervention'}
          </Button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-sm text-white/50 text-center"
        >
          A playful jab at those who still type every line of code by hand!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Index;
