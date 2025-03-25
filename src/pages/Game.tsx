import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import PlayerSelection from '@/components/PlayerSelection';

type Player = 'X' | 'O';
type GameMode = 'single' | 'multi';
type Board = (Player | null)[][];
type GameStatus = 'selecting' | 'playing' | 'won' | 'draw';

const initialBoard: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

// Updated story lines with humor about a student who codes manually vs. using AI
const storyLines = [
  "Meet Faiza, a software engineering student who loves coding...",
  "She's passionate about learning and building things from scratch...",
  "While her friends breeze through assignments with AI tools...",
  "She spends hours debugging, failing to see the bigger picture...",
  "The top devs now spend less time coding, more time guiding AI...",
  "Maybe it's time to embrace the new way of software development?"
];

const Game = () => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [board, setBoard] = useState<Board>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('selecting');
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[][]>([]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyVisible, setStoryVisible] = useState(false);
  const [moveCount, setMoveCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [playerMoveCount, setPlayerMoveCount] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showEndGameInfo, setShowEndGameInfo] = useState(false);
  const [endGameStep, setEndGameStep] = useState(0);

  const { toast } = useToast();
  const navigate = useNavigate();

  const endGameMessages = [
    "Hi Faiza... Abdallah here! 👋",
    "I coded this entire game in just 18 minutes...",
    "Using AI tools like Cursor and GitHub Copilot 🚀",
    "The world of employment isn't like Pelumi...",
    "Who will ask you to code a calculator from scratch 😂",
    "Let me show you the future of development...",
    "Here's your roadmap to modern coding! 🗺️"
  ];

  useEffect(() => {
    if (gameStatus === 'playing' && isGameStarted) {
      const storyTimer = setInterval(() => {
        setStoryIndex((prevIndex) => (prevIndex + 1) % storyLines.length);
        setStoryVisible(true);
      }, 3500);

      return () => clearInterval(storyTimer);
    }
  }, [gameStatus, isGameStarted]);

  useEffect(() => {
    if (gameStatus === 'playing' && moveCount === 0) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }

    if (gameMode === 'single' && currentPlayer === 'O' && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameStatus, gameMode, moveCount]);

  useEffect(() => {
    if (showEndGameInfo) {
      const timer = setInterval(() => {
        setEndGameStep(prev => {
          if (prev < endGameMessages.length - 1) {
            return prev + 1;
          }
          clearInterval(timer);
          return prev;
        });
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [showEndGameInfo]);

  const handlePlayerSelection = (mode: GameMode) => {
    setGameMode(mode);
    setGameStatus('playing');
    setStoryVisible(false);
    setShowPrompt(true);
    setTimeout(() => {
      setIsGameStarted(true);
      setStoryVisible(true);
    }, 2000);
  };

  const makeComputerMove = () => {
    if (gameStatus !== 'playing') return;
    
    const winningMove = findWinningMove(board, 'O');
    if (winningMove) {
      makeMove(winningMove.row, winningMove.col);
      return;
    }
    
    const blockingMove = findWinningMove(board, 'X');
    if (blockingMove) {
      makeMove(blockingMove.row, blockingMove.col);
      return;
    }
    
    if (board[1][1] === null) {
      makeMove(1, 1);
      return;
    }
    
    const corners = [
      [0, 0], [0, 2], [2, 0], [2, 2]
    ];
    
    const availableCorners = corners.filter(([row, col]) => board[row][col] === null);
    if (availableCorners.length > 0) {
      const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
      makeMove(randomCorner[0], randomCorner[1]);
      return;
    }
    
    const availableMoves = getAvailableMoves(board);
    if (availableMoves.length > 0) {
      const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      makeMove(randomMove.row, randomMove.col);
    }
  };

  const findWinningMove = (board: Board, player: Player): {row: number, col: number} | null => {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          const boardCopy = board.map(r => [...r]);
          boardCopy[row][col] = player;
          
          const result = checkWinner(boardCopy);
          if (result.winner === player) {
            return { row, col };
          }
        }
      }
    }
    return null;
  };

  const getAvailableMoves = (board: Board): {row: number, col: number}[] => {
    const moves = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  };

  const makeMove = (row: number, col: number) => {
    if (board[row][col] !== null || gameStatus !== 'playing') return;

    const newBoard = [...board.map(r => [...r])];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setMoveCount(prev => prev + 1);
    
    if (currentPlayer === 'X') {
      setPlayerMoveCount(prev => prev + 1);
    }

    const result = checkWinner(newBoard);
    if (result.winner) {
      setGameStatus('won');
      setWinner(result.winner);
      setWinningLine(result.line);
      
      toast({
        title: `${result.winner} wins!`,
        description: result.winner === 'X' ? "Manual coding for the win!" : "AI efficiency wins again!",
      });
      
      // Show end game info after a delay
      setTimeout(() => {
        setShowEndGameInfo(true);
      }, 1500);
    } else if (moveCount === 8) {
      setGameStatus('draw');
      
      toast({
        title: "It's a draw!",
        description: "Just like the debate between manual coding and AI assistance!",
      });
      
      // Show end game info after a delay
      setTimeout(() => {
        setShowEndGameInfo(true);
      }, 1500);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameMode === 'single' && currentPlayer === 'O') return;
    
    makeMove(row, col);
  };

  const checkWinner = (board: Board): { winner: Player | null, line: number[][] } => {
    for (let i = 0; i < 3; i++) {
      if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        return { winner: board[i][0], line: [[i, 0], [i, 1], [i, 2]] };
      }
    }

    for (let i = 0; i < 3; i++) {
      if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
        return { winner: board[0][i], line: [[0, i], [1, i], [2, i]] };
      }
    }

    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      return { winner: board[0][0], line: [[0, 0], [1, 1], [2, 2]] };
    }
    
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      return { winner: board[0][2], line: [[0, 2], [1, 1], [2, 0]] };
    }

    return { winner: null, line: [] };
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer('X');
    setGameStatus('selecting');
    setWinner(null);
    setWinningLine([]);
    setMoveCount(0);
    setPlayerMoveCount(0);
    setStoryIndex(0);
    setStoryVisible(false);
    setGameMode(null);
    setIsGameStarted(false);
  };

  const isWinningCell = (row: number, col: number) => {
    return winningLine.some(([r, c]) => r === row && c === col);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="flex justify-between items-center w-full max-w-md mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="text-white/70 hover:text-white flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-white">Tic Tac Toe</h1>
          <p className="text-sm text-white/70">A Story of Code</p>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {gameStatus === 'selecting' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <PlayerSelection onSelect={handlePlayerSelection} />
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md"
            >
              <div className="grid grid-cols-3 gap-4">
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <motion.button
                      key={`${rowIndex}-${colIndex}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={cn(
                        "aspect-square rounded-lg bg-white/10 hover:bg-white/20 transition-colors",
                        "flex items-center justify-center text-4xl font-bold",
                        "border border-white/10",
                        isWinningCell(rowIndex, colIndex) && "bg-green-500/20 border-green-500/50",
                        cell === 'X' ? "text-blue-400" : "text-red-400"
                      )}
                    >
                      {cell}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Reset Game
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleHint}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </motion.button>
            </motion.div>

            <AnimatePresence mode="wait">
              {storyVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-md text-center"
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 relative overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                    />
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"
                    />
                    <p className="text-white/90 text-lg font-medium relative z-10">{storyLines[storyIndex]}</p>
                    <motion.div
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ duration: 3.5, ease: "linear" }}
                      className="h-1 bg-white/20 rounded-full mt-2"
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1"
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 + i * 0.2 }}
                          className="w-1 h-1 bg-white/30 rounded-full"
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 relative overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"
                  />
                  <p className="text-white/90 relative z-10">
                    {currentPlayer === 'X' ? "Your turn!" : "Computer's turn!"}
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {showEndGameInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-3xl w-full mx-4 relative overflow-hidden"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEndGameInfo(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </motion.button>

              <div className="relative">
                {/* Animated background elements */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
                />
                
                {/* Animated path */}
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <path
                    d="M50,50 L200,50 L200,200 L50,200 L50,350"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="5,5"
                  />
                  <motion.circle
                    initial={{ r: 0 }}
                    animate={{ r: 5 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    cx="50"
                    cy="50"
                    fill="white"
                  />
                  <motion.circle
                    initial={{ r: 0 }}
                    animate={{ r: 5 }}
                    transition={{ duration: 0.5, delay: 2 }}
                    cx="200"
                    cy="50"
                    fill="white"
                  />
                  <motion.circle
                    initial={{ r: 0 }}
                    animate={{ r: 5 }}
                    transition={{ duration: 0.5, delay: 3 }}
                    cx="200"
                    cy="200"
                    fill="white"
                  />
                  <motion.circle
                    initial={{ r: 0 }}
                    animate={{ r: 5 }}
                    transition={{ duration: 0.5, delay: 4 }}
                    cx="50"
                    cy="200"
                    fill="white"
                  />
                  <motion.circle
                    initial={{ r: 0 }}
                    animate={{ r: 5 }}
                    transition={{ duration: 0.5, delay: 5 }}
                    cx="50"
                    cy="350"
                    fill="white"
                  />
                </motion.svg>

                {/* Messages with staggered animation */}
                <div className="space-y-4">
                  {endGameMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ 
                        opacity: endGameStep >= index ? 1 : 0,
                        x: endGameStep >= index ? 0 : -50
                      }}
                      transition={{ duration: 0.5, delay: index * 0.3 }}
                      className="relative"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: endGameStep >= index ? "100%" : "0%"
                        }}
                        transition={{ duration: 0.5, delay: index * 0.3 }}
                        className="absolute inset-0 bg-white/5 rounded-lg"
                      />
                      <p className="text-white text-xl relative z-10">{message}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Resources section with enhanced animations */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ 
                    opacity: endGameStep === endGameMessages.length - 1 ? 1 : 0,
                    y: endGameStep === endGameMessages.length - 1 ? 0 : 50
                  }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 relative overflow-hidden group"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <h3 className="text-lg font-semibold text-white mb-2">Vibe Coding</h3>
                    <p className="text-white/70 text-sm mb-4">The art of creating software with AI assistance, focusing on high-level concepts rather than low-level implementation.</p>
                    <div className="flex flex-wrap gap-2">
                      <a href="https://www.tiktok.com/@vibecoding" target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 text-sm transition-colors">TikTok</a>
                      <a href="https://dev.to/t/vibecoding" target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 text-sm transition-colors">Dev.to</a>
                      <a href="https://discord.gg/vibecoding" target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 text-sm transition-colors">Discord</a>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 relative overflow-hidden group"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <h3 className="text-lg font-semibold text-white mb-2">No-Code Movement</h3>
                    <p className="text-white/70 text-sm mb-4">Building applications without traditional programming, using visual interfaces and pre-built components.</p>
                    <div className="flex flex-wrap gap-2">
                      <a href="https://www.nocode.tech" target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300 text-sm transition-colors">Resources</a>
                      <a href="https://www.producthunt.com/topics/no-code" target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300 text-sm transition-colors">Tools</a>
                      <a href="https://www.nocode.community" target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 hover:text-purple-300 text-sm transition-colors">Community</a>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 relative overflow-hidden group"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <h3 className="text-lg font-semibold text-white mb-2">Getting Started</h3>
                    <ul className="text-white/70 text-sm space-y-2">
                      <li>
                        <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">• Learn AI tools like GitHub Copilot</a>
                      </li>
                      <li>
                        <a href="https://www.bubble.io" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">• Explore no-code platforms</a>
                      </li>
                      <li>
                        <a href="https://discord.gg/vibecoding" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">• Follow vibe coding communities</a>
                      </li>
                      <li>
                        <a href="https://www.cursor.sh" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">• Start with simple projects</a>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 relative overflow-hidden group"
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                    <ul className="text-white/70 text-sm space-y-2">
                      <li>
                        <a href="https://www.cursor.sh" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">• Cursor - AI-Powered IDE</a>
                      </li>
                      <li>
                        <a href="https://www.udemy.com/course/no-code-development" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">• No-Code Development Course</a>
                      </li>
                      <li>
                        <a href="https://discord.gg/vibecoding" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">• Vibe Coding Discord</a>
                      </li>
                      <li>
                        <a href="https://www.coursera.org/specializations/ai-for-everyone" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">• AI for Everyone Course</a>
                      </li>
                    </ul>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
