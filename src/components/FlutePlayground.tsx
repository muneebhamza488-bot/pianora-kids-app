import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NOTES_MAP, playSynthesizedNote } from '../utils/audio';
import { Star, Wind } from 'lucide-react';

interface FlutePlaygroundProps {
  targetNote?: string;
  onNotePlayed?: (noteLabel: string) => void;
}

export default function FlutePlayground({ targetNote, onNotePlayed }: FlutePlaygroundProps) {
  const [clouds, setClouds] = useState<{ id: number; color: string; label: string }[]>([]);

  const handleHoleClick = (note: typeof NOTES_MAP[0]) => {
    // Play warm woodwind whistle
    playSynthesizedNote('woodwind', note.frequency, 0.7);

    // Spawn a cute wind drift cloud on the right
    const newCloud = {
      id: Date.now(),
      color: note.color,
      label: note.displayName.split(' ')[0],
    };

    setClouds((prev) => [...prev, newCloud].slice(-4)); // keep last 4 clouds
    setTimeout(() => {
      setClouds((prev) => prev.filter((c) => c.id !== newCloud.id));
    }, 1500);

    if (onNotePlayed) {
      onNotePlayed(note.label);
    }
  };

  return (
    <div id="flute-container" className="flex flex-col items-center justify-center p-6 w-full">
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-slate-500 font-mono">
          💨 WOODWIND MODE • TAP HOLES TO VENT WIND
        </p>
      </div>

      {/* Flute casing / bamboo tube */}
      <div 
        id="flute-pipe-assembly"
        className="relative bg-[#111827] p-8 py-12 rounded-3xl shadow-xl border-4 border-slate-900 w-full max-w-2xl flex items-center justify-between overflow-visible"
      >
        {/* Mouthpiece blow guide on the Left */}
        <div id="mouthpiece" className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-amber-500 rounded-l-xl border-l-4 border-[#3d2417] shadow-lg flex items-center justify-center">
          <Wind className="w-4 h-4 text-amber-950 animate-pulse" />
        </div>

        {/* Long flute main body stem */}
        <div 
          id="flute-stem"
          className="relative bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-700 h-14 w-full rounded-full border-t border-b-4 border-white/20 flex items-center justify-around px-4 sm:px-6 shadow-inner"
        >
          {/* Note holes on the stem body */}
          {NOTES_MAP.map((note) => {
            const isTarget = targetNote === note.label;

            return (
              <div 
                key={note.label} 
                id={`flute-hole-slot-${note.label}`}
                className="relative flex flex-col items-center"
              >
                {/* Visual learning marker */}
                {isTarget && (
                  <div className="absolute -top-14 flex flex-col items-center pointer-events-none z-30">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-md" />
                    </motion.div>
                  </div>
                )}

                {/* The actual tactile hole button */}
                <motion.button
                  id={`flute-hole-btn-${note.label}`}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleHoleClick(note)}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-black/30 shadow-inner cursor-pointer
                    ${note.color} flex items-center justify-center select-none
                  `}
                >
                  {/* Inside opening dot */}
                  <div className="w-4 h-4 rounded-full bg-black/40 border border-black/10 flex items-center justify-center">
                    <span className="text-[7px] font-bold text-white/50">{note.label}</span>
                  </div>
                </motion.button>
                
                {/* Note name display */}
                <span className="absolute -bottom-7 text-[10px] font-bold text-teal-100 uppercase tracking-tight font-mono">
                  {note.displayName.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Fun blowing outlet wind vents on the Right */}
        <div id="whistle-outlet" className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-indigo-900 rounded-r-xl border-r-4 border-[#1e1b4b] shadow-lg flex items-center justify-center">
          {/* Outlet venting clouds container */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-1 pointer-events-none">
            <AnimatePresence>
              {clouds.map((cloud) => (
                <motion.div
                  key={cloud.id}
                  initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                  animate={{ opacity: [1, 0.8, 0], scale: [1, 2.2, 3], x: [10, 50, 100], y: [-15, 0, 15] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className={`px-2 py-0.5 rounded-full text-white text-[9px] font-bold border border-white/20 shadow flex items-center gap-1 bg-gradient-to-r from-teal-400 to-indigo-500`}
                >
                  💨 {cloud.label}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
