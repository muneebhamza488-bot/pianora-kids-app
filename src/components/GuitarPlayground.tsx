import { useState } from 'react';
import { motion } from 'motion/react';
import { NOTES_MAP, playSynthesizedNote } from '../utils/audio';
import { Star } from 'lucide-react';

interface GuitarPlaygroundProps {
  targetNote?: string;
  onNotePlayed?: (noteLabel: string) => void;
}

export default function GuitarPlayground({ targetNote, onNotePlayed }: GuitarPlaygroundProps) {
  // Track wiggling state for each string
  const [vibrating, setVibrating] = useState<Record<number, boolean>>({});

  // Map strings to standard notes
  const guitarStrings = [
    { id: 0, note: NOTES_MAP[0], thickness: 'h-2.5', name: 'Thick E-String', colorClass: 'bg-amber-600' },
    { id: 1, note: NOTES_MAP[1], thickness: 'h-2', name: 'A-String', colorClass: 'bg-amber-500' },
    { id: 2, note: NOTES_MAP[2], thickness: 'h-1.5', name: 'D-String', colorClass: 'bg-amber-400' },
    { id: 3, note: NOTES_MAP[3], thickness: 'h-1.25', name: 'G-String', colorClass: 'bg-yellow-400' },
    { id: 4, note: NOTES_MAP[4], thickness: 'h-1', name: 'B-String', colorClass: 'bg-yellow-300' },
    { id: 5, note: NOTES_MAP[5], thickness: 'h-0.75', name: 'Thin E-String', colorClass: 'bg-yellow-200' },
  ];

  const triggerString = (id: number, note: typeof NOTES_MAP[0]) => {
    if (vibrating[id]) return; // Debounce slightly while it vibrates

    // Play guitar sound
    playSynthesizedNote('guitar', note.frequency, 0.95);

    // Set vibrating state to true
    setVibrating((prev) => ({ ...prev, [id]: true }));

    // Reset vibration animation after 900ms
    setTimeout(() => {
      setVibrating((prev) => ({ ...prev, [id]: false }));
    }, 900);

    // Playback validator
    if (onNotePlayed) {
      onNotePlayed(note.label);
    }
  };

  return (
    <div id="guitar-container" className="flex flex-col items-center justify-center p-6 w-full">
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-slate-500 font-mono">
          🎸 STRINGS MODE • STRUM OR SWIPE WIRES
        </p>
      </div>

      {/* Styled Guitar Neck / Fretboard */}
      <div 
        id="guitar-neck"
        className="relative bg-[#5a3825] p-6 py-10 rounded-3xl shadow-2xl border-4 border-[#3d2417] w-full max-w-2xl min-h-[300px] flex flex-col justify-between overflow-hidden"
      >
        {/* Fret Markers (Metal lines) */}
        <div className="absolute inset-y-0 left-1/4 w-[2px] bg-amber-400/40" />
        <div className="absolute inset-y-0 left-2/4 w-[2px] bg-amber-400/40" />
        <div className="absolute inset-y-0 left-3/4 w-[2px] bg-amber-400/40" />

        <div id="guitar-fretboard-strings" className="flex flex-col gap-6 relative z-10">
          {guitarStrings.map((str) => {
            const isVibrating = vibrating[str.id];
            const isTarget = targetNote === str.note.label;

            return (
              <div 
                key={str.id}
                id={`guitar-string-track-${str.id}`}
                className="relative flex items-center h-8 group select-none"
              >
                {/* Clickable strum corridor zone */}
                <div 
                  onClick={() => triggerString(str.id, str.note)}
                  onMouseEnter={(e) => {
                    // Strum on hover if clicking or just moving over
                    if (e.buttons === 1 || e.buttons === 0) {
                      triggerString(str.id, str.note);
                    }
                  }}
                  className="absolute inset-y-0 left-0 w-full cursor-pointer z-20"
                />

                {/* String visual model */}
                <motion.div
                  id={`guitar-string-line-${str.id}`}
                  animate={isVibrating ? {
                    y: [0, -8, 8, -6, 6, -3, 3, -1, 1, 0],
                    scaleY: [1, 1.3, 0.7, 1.2, 0.8, 1.1, 0.9, 1]
                  } : {}}
                  transition={{ duration: 0.95, ease: 'easeInOut' }}
                  className={`
                    w-full rounded shadow-md pointer-events-none transition-all duration-100
                    ${str.thickness} ${str.colorClass}
                    ${isVibrating ? 'brightness-125' : 'group-hover:brightness-110'}
                  `}
                />

                {/* Left Note Label Marker */}
                <div className="absolute left-2 flex items-center gap-1.5 pointer-events-none z-30">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow select-none ${str.note.color}`}>
                    {str.note.displayName.charAt(0)}
                  </span>
                  <span className="text-[10px] font-bold text-amber-200 font-mono tracking-tight bg-[#2f1c12] px-1.5 py-0.5 rounded shadow">
                    {str.note.label}
                  </span>
                </div>

                {/* Helper prompt light for learning-mode targets */}
                {isTarget && (
                  <div className="absolute right-12 flex items-center gap-2 pointer-events-none z-30">
                    <span className="text-[10px] bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-full font-bold animate-pulse">
                      STRUM HERE
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="bg-yellow-400 p-1 rounded-full shadow-md shadow-yellow-500/50 pointer-events-none"
                    >
                      <Star className="w-3.5 h-3.5 fill-yellow-900 text-yellow-950" />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
