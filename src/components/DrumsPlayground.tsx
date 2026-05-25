import { useState } from 'react';
import { motion } from 'motion/react';
import { playDrumTap } from '../utils/audio';
import { Star } from 'lucide-react';

interface DrumsPlaygroundProps {
  targetNote?: string;
  onNotePlayed?: (noteLabel: string) => void;
}

export default function DrumsPlayground({ targetNote, onNotePlayed }: DrumsPlaygroundProps) {
  const [activeDrums, setActiveDrums] = useState<Record<string, boolean>>({});

  const hitDrum = (drumId: 'kick' | 'snare' | 'hihat' | 'tom', noteMap: string) => {
    // Play physical drum tap sound
    playDrumTap(drumId);

    // Trigger visual pop highlight
    setActiveDrums((prev) => ({ ...prev, [drumId]: true }));
    setTimeout(() => {
      setActiveDrums((prev) => ({ ...prev, [drumId]: false }));
    }, 150);

    // Progress if learning
    if (onNotePlayed) {
      onNotePlayed(noteMap);
    }
  };

  const drumItems = [
    {
      id: 'hihat',
      name: 'Shiny Star Cymbal',
      noteMap: 'G4',
      emoji: '⭐',
      color: 'from-amber-300 to-yellow-500 border-yellow-600',
      size: 'w-24 h-6 sm:w-28 sm:h-8',
      position: 'absolute -top-4 right-[10%] sm:right-[12%]',
      animation: { rotate: [-2, 4, -2] }
    },
    {
      id: 'tom',
      name: 'Happy Tom Drum',
      noteMap: 'E4',
      emoji: '🥁',
      color: 'from-cyan-400 to-teal-500 border-teal-600',
      size: 'w-28 h-20 sm:w-32 sm:h-24',
      position: 'absolute top-10 left-[10%] sm:left-[16%]',
      animation: { y: [0, 4, 0] }
    },
    {
      id: 'snare',
      name: 'Snappy Snare',
      noteMap: 'D4',
      emoji: '🥁',
      color: 'from-blue-400 to-indigo-500 border-indigo-600',
      size: 'w-32 h-20 sm:w-36 sm:h-24',
      position: 'absolute top-24 right-[10%] sm:right-[16%]',
      animation: { scaleY: [1, 0.9, 1.05, 1] }
    },
    {
      id: 'kick',
      name: 'Big Boom Kick Drum',
      noteMap: 'C4',
      emoji: '🦁',
      color: 'from-rose-500 to-pink-600 border-rose-700',
      size: 'w-44 h-44 sm:w-52 sm:h-52',
      position: 'relative mt-24 z-10',
      animation: { scale: [1, 0.94, 1.04, 1] }
    }
  ];

  return (
    <div id="drums-container" className="flex flex-col items-center justify-center p-6 w-full">
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-slate-500 font-mono">
          🥁 PERCUSSION PLAYGROUND • TAP EACH ON STAGE
        </p>
      </div>

      {/* Styled Stage Mat */}
      <div 
        id="drums-stage"
        className="relative bg-slate-800 p-6 pt-12 pb-8 rounded-3xl shadow-xl border-4 border-slate-900 w-full max-w-2xl min-h-[400px] flex flex-col items-center justify-center overflow-visible"
      >
        {/* Spotlight beam backdrop glow effect */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-yellow-300/10 to-transparent blur-xl pointer-events-none" />

        {/* Floating Drum components relative grid */}
        <div id="drums-relative-grid" className="w-full relative flex flex-col items-center justify-center">
          
          {drumItems.map((drum) => {
            const isActive = activeDrums[drum.id];
            const isTarget = targetNote === drum.noteMap;

            return (
              <motion.button
                key={drum.id}
                id={`drum-pad-${drum.id}`}
                whileTap={{ scale: 0.92 }}
                onClick={() => hitDrum(drum.id as any, drum.noteMap)}
                className={`
                  ${drum.position} ${drum.size}
                  rounded-2xl cursor-pointer shadow-lg select-none
                  bg-gradient-to-b ${drum.color} border-b-[6px] active:border-b-0
                  flex flex-col items-center justify-center transition-shadow
                  ${isActive ? 'brightness-125 shadow-inner' : 'hover:brightness-105 shadow-md'}
                `}
                animate={isActive ? drum.animation : {}}
                transition={{ duration: 0.15 }}
              >
                {/* Visual indicator target for songs */}
                {isTarget && (
                  <div className="absolute -top-10 flex flex-col items-center pointer-events-none z-30">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="bg-yellow-300 text-yellow-900 p-1.5 rounded-full shadow border-2 border-white"
                    >
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    </motion.div>
                    <span className="text-[9px] font-bold bg-white text-slate-800 px-1 rounded shadow-sm">
                      BANG ME!
                    </span>
                  </div>
                )}

                {/* Snare wire texture helper visual */}
                {drum.id === 'snare' && (
                  <div className="absolute bottom-2 inset-x-4 h-1.5 border-t border-b border-black/10 opacity-40 mx-auto" />
                )}

                {/* Cymbal concentric ring groove texture lines */}
                {drum.id === 'hihat' && (
                  <div className="absolute inset-2 border border-black/15 rounded-full opacity-35" />
                )}

                {/* Center graphic inside the major Kick Drum */}
                {drum.id === 'kick' && (
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-pink-100/90 flex flex-col items-center justify-center shadow-inner border-4 border-rose-300">
                    <span className="text-4xl text-rose-500 filter drop-shadow">{drum.emoji}</span>
                    <span className="text-[12px] font-bold text-rose-700/80 mt-1 uppercase tracking-widest animate-pulse">
                      KICK BOOM
                    </span>
                    <span className="text-[9px] font-mono text-rose-500 mt-0.5">
                      {drum.noteMap}
                    </span>
                  </div>
                )}

                {/* Generic label for secondary smaller drums */}
                {drum.id !== 'kick' && (
                  <div className="flex flex-col items-center pointer-events-none">
                    <span className="text-xl filter drop-shadow">{drum.emoji}</span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-sm leading-none mt-1">
                      {drum.name.split(' ')[0]}
                    </span>
                    <span className="text-[8px] font-mono text-white/70">
                      {drum.noteMap}
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}

        </div>

        {/* Floor Stand supports to ground the drums visually */}
        <div className="absolute bottom-2 left-1/4 w-1.5 h-10 bg-slate-600" />
        <div className="absolute bottom-2 right-1/4 w-1.5 h-10 bg-slate-600" />
      </div>
    </div>
  );
}
