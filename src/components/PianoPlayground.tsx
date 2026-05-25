import { motion } from 'motion/react';
import { NOTES_MAP, playSynthesizedNote } from '../utils/audio';
import { Star } from 'lucide-react';

interface PianoPlaygroundProps {
  targetNote?: string; // The note label currently highlighted in Learn mode
  onNotePlayed?: (noteLabel: string) => void;
}

export default function PianoPlayground({ targetNote, onNotePlayed }: PianoPlaygroundProps) {
  
  const handleKeyClick = (note: typeof NOTES_MAP[0]) => {
    // Play sound
    playSynthesizedNote('piano', note.frequency, 0.6);
    // Callback to advance song
    if (onNotePlayed) {
      onNotePlayed(note.label);
    }
  };

  return (
    <div id="piano-container" className="flex flex-col items-center justify-center p-6 w-full">
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-slate-500 font-mono">
          🎵 PIANO MODE • TAP TO PLAY
        </p>
      </div>

      {/* Styled Wooden casing for the toy piano */}
      <div 
        id="piano-case"
        className="relative bg-amber-800 p-6 rounded-3xl shadow-xl border-4 border-amber-900 w-full max-w-2xl"
      >
        {/* Decorative branding logo */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-amber-100/35 text-xs tracking-widest font-bold">
          ★ RAINBOW HARMONY ★
        </div>

        {/* Keyboard Bed */}
        <div 
          id="keyboard-bed"
          className="flex bg-slate-900 p-2 pt-4 rounded-xl shadow-inner gap-1 px-1 sm:px-3"
        >
          {NOTES_MAP.map((note) => {
            const isTarget = targetNote === note.label;
            
            return (
              <motion.button
                key={note.label}
                id={`piano-key-${note.label}`}
                whileTap={{ scaleY: 0.94, y: 4 }}
                onClick={() => handleKeyClick(note)}
                className={`
                  relative flex-1 select-none flex flex-col items-center justify-end
                  h-48 sm:h-56 pb-6 rounded-b-xl cursor-pointer shadow-md transition-shadow
                  border-b-[8px] border-black/25 active:border-b-0
                  ${note.color}
                `}
              >
                {/* Visual guideline highlight if this is the target note in tutorial */}
                {isTarget && (
                  <div className="absolute top-4 flex flex-col items-center">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="bg-yellow-300 text-yellow-900 p-1.5 rounded-full shadow-md shadow-yellow-500/50 border-2 border-white"
                    >
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    </motion.div>
                    <span className="text-[10px] mt-1 font-bold bg-white text-slate-800 px-1 rounded shadow-sm animate-pulse">
                      Tap Me!
                    </span>
                  </div>
                )}

                {/* Simulated mechanical key split / shadow */}
                <div className="absolute inset-y-0 right-0 w-[2px] bg-black/10 rounded-r" />

                {/* Key Labels */}
                <div className="flex flex-col items-center pointer-events-none mt-auto">
                  <span className="text-sm sm:text-base font-bold tracking-wider leading-none drop-shadow-sm select-none">
                    {note.displayName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] uppercase font-mono mt-1 opacity-85 px-1 bg-black/10 rounded-full">
                    {note.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Decorative shadow grid */}
        <div className="flex justify-between px-6 mt-3 text-amber-200/40 text-xs">
          <span>♩ Low Notes</span>
          <span>♪ High Notes</span>
        </div>
      </div>
    </div>
  );
}
