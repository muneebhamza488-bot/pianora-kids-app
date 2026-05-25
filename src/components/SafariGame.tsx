import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSynthesizedNote, playDrumTap } from '../utils/audio';
import { QUIZ_QUESTIONS } from '../data';
import { Volume2, Trophy, RotateCcw, Check, ChevronRight } from 'lucide-react';

export default function SafariGame() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestionIdx];

  const triggerSound = (soundId: string) => {
    // Map soundId to specific synthetic cues
    if (soundId === 'kick') {
      playDrumTap('kick');
    } else if (soundId === 'synthesized_xylophone_c5') {
      playSynthesizedNote('xylophone', 523.25, 0.45); // C5
    } else if (soundId === 'guitar_chord') {
      // Arpeggiate a lovely guitar chord
      playSynthesizedNote('guitar', 261.63, 0.82); // C4
      setTimeout(() => playSynthesizedNote('guitar', 329.63, 0.82), 100); // E4
      setTimeout(() => playSynthesizedNote('guitar', 392.00, 0.82), 200); // G4
    } else if (soundId === 'hihat') {
      playDrumTap('hihat');
    } else if (soundId === 'woodwind_wind') {
      playSynthesizedNote('woodwind', 392.00, 0.9); // G4
    }
  };

  // Play the sound automatically when a new question loads
  useEffect(() => {
    if (!gameComplete && question) {
      const timer = setTimeout(() => {
        triggerSound(question.soundId);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIdx, gameComplete]);

  const handleOptionClick = (optionId: string) => {
    if (selectedOption !== null) return; // Prevent double taps

    setSelectedOption(optionId);
    const correct = optionId === question.instrumentId;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
      // Play a happy rising arpeggio reward sound
      playSynthesizedNote('xylophone', 261.63, 0.2); // C4
      setTimeout(() => playSynthesizedNote('xylophone', 329.63, 0.2), 80); // E4
      setTimeout(() => playSynthesizedNote('xylophone', 392.00, 0.2), 160); // G4
      setTimeout(() => playSynthesizedNote('xylophone', 523.25, 0.5), 240); // C5
      setShowConfetti(true);
    } else {
      // Play a gentle low buzzer-like tone
      playSynthesizedNote('piano', 150.00, 0.4);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowConfetti(false);

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setGameComplete(true);
      // Play final victory theme
      setTimeout(() => playSynthesizedNote('piano', 261.63, 0.5), 0);
      setTimeout(() => playSynthesizedNote('piano', 329.63, 0.5), 150);
      setTimeout(() => playSynthesizedNote('piano', 392.00, 0.5), 300);
      setTimeout(() => playSynthesizedNote('piano', 523.25, 1.2), 450);
    }
  };

  const resetGame = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setGameComplete(false);
    setShowConfetti(false);
  };

  return (
    <div id="safari-quiz-workspace" className="p-6 bg-gradient-to-b from-emerald-50 to-teal-50 rounded-3xl shadow-lg border border-emerald-200">
      
      {/* HUD Header */}
      <div id="quiz-hud" className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-emerald-500 rounded-xl text-white">
            <Trophy className="w-5 h-5 fill-yellow-300 stroke-yellow-300" />
          </span>
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest font-mono">Safari Score</span>
            <p className="text-lg font-black text-slate-800 tracking-tight leading-none">{score * 10} Stars ✨</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 font-mono">QUESTION</span>
          <p className="text-base font-bold text-emerald-700">
            {currentQuestionIdx + 1} / {QUIZ_QUESTIONS.length}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!gameComplete ? (
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center text-center space-y-6"
          >
            {/* Speaker Board */}
            <div id="speaker-card" className="w-full max-w-md bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex flex-col items-center">
              <span className="text-xs font-bold font-mono text-emerald-500 tracking-widest uppercase mb-3">
                👂 LISTEN CAREFULLY
              </span>
              
              <motion.button
                id="listen-speaker-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => triggerSound(question.soundId)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center border-4 border-white transition-colors hover:bg-emerald-400 cursor-pointer"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <Volume2 className="w-12 h-12" />
                </motion.div>
              </motion.button>
              
              <button 
                onClick={() => triggerSound(question.soundId)}
                className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors underline decoration-dotted cursor-pointer"
              >
                Click to Hear Sound Again
              </button>
            </div>

            {/* Prompt */}
            <h3 className="text-base sm:text-lg font-bold text-slate-800 max-w-md">
              {question.prompt}
            </h3>

            {/* Visual Confetti reward */}
            {showConfetti && (
              <div className="text-2xl animate-bounce text-emerald-600 font-black">
                🎉 CORRECT! YOU ARE AMAZING! ✨
              </div>
            )}

            {/* Answer Options list */}
            <div id="quiz-options-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
              {question.options.map((opt) => {
                const isSelected = selectedOption === opt.instrumentId;
                const isThisCorrect = opt.instrumentId === question.instrumentId;
                
                let buttonStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm';
                if (selectedOption !== null) {
                  if (isSelected) {
                    buttonStyle = isCorrect 
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200'
                      : 'bg-rose-500 text-white border-rose-600 shadow-rose-200';
                  } else if (isThisCorrect) {
                    buttonStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300';
                  } else {
                    buttonStyle = 'opacity-45 bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed';
                  }
                }

                return (
                  <motion.button
                    key={opt.instrumentId}
                    id={`quiz-option-${opt.instrumentId}`}
                    whileTap={{ scale: selectedOption === null ? 0.95 : 1 }}
                    onClick={() => handleOptionClick(opt.instrumentId)}
                    disabled={selectedOption !== null}
                    className={`
                      p-4 rounded-2xl border-2 flex flex-col items-center justify-between text-center gap-2 select-none
                      transition-all duration-150 relative h-32 cursor-pointer
                      ${buttonStyle}
                    `}
                  >
                    <span className="text-3xl filter drop-shadow">{opt.emoji}</span>
                    <span className="text-sm font-bold tracking-tight">{opt.name}</span>

                    {/* Checkmark inside option button */}
                    {selectedOption !== null && isThisCorrect && (
                      <div className="absolute top-2 right-2 p-0.5 bg-emerald-600 text-white rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Next question transition button */}
            {selectedOption !== null && (
              <motion.button
                id="go-next-quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNextQuestion}
                className="mt-4 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold tracking-wider uppercase rounded-full shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {currentQuestionIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Claim Reward!'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        ) : (
          /* Finished Quiz State card */
          <motion.div 
            id="quiz-victory-screen"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center text-center p-6 space-y-6"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-30 animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 shadow-xl border-4 border-white flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white fill-yellow-105 animate-bounce" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Sound Master Certificate! 🏅</h2>
              <p className="text-sm font-medium text-slate-500 max-w-sm mt-1">
                You possess an outstanding musical ear! You correctly matched{' '}
                <span className="text-emerald-600 font-bold">{score}</span> out of{' '}
                <span className="font-bold">{QUIZ_QUESTIONS.length}</span> instrument audio riddles!
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm px-8">
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">Grand Explorer Total</span>
              <p className="text-3xl font-black text-emerald-600">{score * 10} Stars</p>
            </div>

            <button
              id="replay-safari-btn"
              onClick={resetGame}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold tracking-wider uppercase rounded-full shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Adventuring Again!</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
