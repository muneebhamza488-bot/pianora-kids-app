import { motion } from 'motion/react';
import { NOTES_MAP, playSynthesizedNote } from '../utils/audio';
import { Star } from 'lucide-react';

interface XylophonePlaygroundProps {
  targetNote?: string;
  onNotePlayed?: (noteLabel: string) => void;
}

export default function XylophonePlayground({ targetNote, onNotePlayed }: XylophonePlaygroundProps) {
  
  const handleBarClick = (note: typeof NOTES_MAP[0]) => {
    // Play xylophone style sound which has a very rapid chime strike
    playSynthesizedNote('xylophone', note.frequency, 0.45);
    if (onNotePlayed) {
      onNotePlayed(note.label);
    }
  };

  // Dimensions of the bars (height decreases as note pitch goes up)
  const barHeights = [
    'h-64 sm:h-72', // C4 (biggest)
    'h-60 sm:h-66', // D4
    'h-56 sm:h-60', // E4
    'h-52 sm:h-54', // F4
    'h-48 sm:h-48', // G4
    'h-44 sm:h-42', // A4
    'h-40 sm:h-36', // B4
    'h-36 sm:h-30', // C5 (smallest)
  ];

  return (
    <div id="xylophone-container" className="flex flex-col items-center justify-center p-6 w-full">
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-slate-500 font-mono">
          🪵 PERCUSSION MODE • STRIKE WATER-TONES
        </p>
      </div>

      {/* Xylophone Wood stand */}
      <div 
        id="xylophone-stand"
        className="relative bg-amber-100 p-6 pt-8 pb-10 rounded-2xl shadow-xl border-t-8 border-b-8 border-amber-300 w-full max-w-2xl overflow-hidden"
      >
        {/* Felt rails running across under the bars */}
        <div className="absolute top-12 left-0 right-0 h-4 bg-red-400/40 blur-[1px]" />
        <div className="absolute bottom-16 left-0 right-0 h-4 bg-red-400/40 blur-[1px]" />

        {/* The series of metal bars */}
        <div id="xylophone-bars-row" className="flex items-center justify-center gap-2 sm:gap-3 px-1 sm:px-6">
          {NOTES_MAP.map((note, index) => {
            const isTarget = targetNote === note.label;
            const heightClass = barHeights[index];

            return (
              <motion.button
                key={note.label}
                id={`xylophone-bar-${note.label}`}
                whileTap={{ scale: 0.95, y: 3 }}
                onClick={() => handleBarClick(note)}
                className={`
                  relative flex flex-col items-center justify-between cursor-pointer
                  w-10 sm:w-14 rounded-full shadow-lg border-2 border-black/10 select-none
                  transform transition-colors duration-150 pb-6 pt-6
                  ${note.color} ${heightClass}
                `}
              >
                {/* Silver metal fastener peg at the top */}
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 shadow shadow-inner" />

                {/* Star highlight anchor */}
                {isTarget && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                      className="bg-yellow-300 text-yellow-900 p-1.5 rounded-full shadow border border-white"
                    >
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    </motion.div>
                  </div>
                )}

                {/* Display Note names */}
                <div className="flex flex-col items-center pointer-events-none text-center">
                  <span className="text-xs sm:text-sm font-bold tracking-tight drop-shadow-sm leading-none">
                    {note.displayName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono mt-1 opacity-85 px-1 bg-black/10 rounded-full leading-none">
                    {note.label}
                  </span>
                </div>

                {/* Silver metal fastener peg at the bottom */}
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400 shadow shadow-inner" />
              </motion.button>
            );
          })}
        </div>

        {/* Decorative mallet label */}
        <div className="flex justify-center gap-10 mt-6 pt-4 border-t border-amber-200/50">
          <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow" />
            <span>Wooden Wand</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
            <span className="w-24 h-1 bg-amber-800 rounded-full" />
            <span>Tap any bar to play!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
