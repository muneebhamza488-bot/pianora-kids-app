import { motion } from 'motion/react';
import { Song } from '../types';
import { SONGS } from '../data';
import { BookOpen, Star, Sparkles, Check, RotateCcw } from 'lucide-react';

interface SongBookProps {
  selectedSong: Song | null;
  currentNoteIdx: number;
  onSelectSong: (song: Song | null) => void;
  onResetSong: () => void;
  songComplete: boolean;
}

export default function SongBook({
  selectedSong,
  currentNoteIdx,
  onSelectSong,
  onResetSong,
  songComplete,
}: SongBookProps) {
  return (
    <div id="songbook-panel" className="bg-gradient-to-b from-indigo-50 to-violet-50 rounded-3xl p-6 border border-indigo-200">
      
      {/* Selector screen if no song is active */}
      {!selectedSong ? (
        <div id="song-selector-grid" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-indigo-500 rounded-xl text-white">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-bold font-mono text-indigo-700 tracking-widest uppercase">Learn Mode</span>
              <h3 className="text-lg font-black text-slate-800">Starry Songbook</h3>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 max-w-sm">
            Pick a classic nursery rhyme. Follow the golden stars on the keys to play the song yourself! 🎶
          </p>

          <div id="song-catalogue" className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {SONGS.map((song) => {
              // Map difficulties to nice badges
              let diffBadge = 'bg-emerald-100 text-emerald-800';
              if (song.difficulty === 'Medium') diffBadge = 'bg-amber-100 text-amber-800';
              if (song.difficulty === 'Fun') diffBadge = 'bg-pink-100 text-pink-800';

              return (
                <motion.button
                  key={song.id}
                  id={`song-card-btn-${song.id}`}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectSong(song)}
                  className="p-4 bg-white rounded-2xl border-2 border-indigo-100 hover:border-indigo-300 shadow-sm flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow">{song.emoji}</span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug">{song.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${diffBadge}`}>
                          {song.difficulty}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {song.notes.length} Notes
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm border border-indigo-100">
                    ▶
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active playing tutorial panel */
        <div id="playing-song-workspace" className="space-y-6">
          
          {/* Header detail */}
          <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl filter drop-shadow">{selectedSong.emoji}</span>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-800 m-0 leading-none">
                  {selectedSong.title}
                </h4>
                <button
                  onClick={() => onSelectSong(null)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors mt-1 cursor-pointer"
                >
                  ← Pitch another song
                </button>
              </div>
            </div>

            <button
              onClick={onResetSong}
              className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold text-xs uppercase rounded-full flex items-center gap-1 shadow-sm cursor-pointer"
              title="Restart Song"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>

          {!songComplete ? (
            <div id="melody-carousel-dashboard" className="space-y-4">
              {/* Note Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-indigo-700 font-bold font-mono uppercase tracking-wide">
                  <span>Progress</span>
                  <span>{currentNoteIdx} / {selectedSong.notes.length} Notes</span>
                </div>
                <div className="h-3 w-full bg-indigo-100 rounded-full overflow-hidden border border-indigo-200 shadow-inner">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentNoteIdx / selectedSong.notes.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Horizontal scrollable notes train to play */}
              <div className="flex flex-col">
                <p className="text-xs font-bold font-mono text-indigo-500 mb-2 uppercase tracking-wide">
                  👉 CHIME THE TRAIN FROM LEFT TO RIGHT:
                </p>
                <div 
                  id="notes-staff-scrollbox" 
                  className="flex items-center gap-2.5 overflow-x-auto py-4 px-2 bg-white rounded-2xl border border-indigo-100 shadow-inner scroll-smooth"
                >
                  {selectedSong.notes.map((noteObj, idx) => {
                    const isPlayed = idx < currentNoteIdx;
                    const isActive = idx === currentNoteIdx;
                    
                    return (
                      <motion.div
                        key={idx}
                        id={`song-note-bubble-${idx}`}
                        animate={isActive ? { scale: [1, 1.15, 1], y: [0, -4, 0] } : {}}
                        transition={isActive ? { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } : {}}
                        className={`
                          flex-shrink-0 w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center select-none shadow relative
                          ${isPlayed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : ''}
                          ${isActive ? 'bg-amber-100 text-amber-950 border-amber-400 ring-4 ring-amber-300/40 font-black' : ''}
                          ${(!isPlayed && !isActive) ? 'bg-slate-50 text-slate-400 border-slate-200' : ''}
                        `}
                      >
                        <span className="text-xs font-bold leading-none">{noteObj.note}</span>
                        {isPlayed && (
                          <div className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-600 text-white rounded-full">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute -top-3.5 flex items-center justify-center">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500 animate-spin" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Nursery complete cards */
            <motion.div 
              id="melody-victory-box" 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex flex-col items-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="w-8 h-8 animate-bounce fill-emerald-100 stroke-emerald-950" />
              </div>

              <div>
                <h4 className="text-lg font-black text-emerald-950">Awesome Performance! 🎓👑</h4>
                <p className="text-xs text-emerald-700/80 max-w-sm mt-1">
                  You completed playing <strong>{selectedSong.title}</strong> note-for-note! Your internal concert star-meter is soaring!
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  id="reset-tune-advance"
                  onClick={onResetSong}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider uppercase rounded-full shadow cursor-pointer"
                >
                  Play Tune Again
                </button>
                <button
                  id="back-book-selection"
                  onClick={() => onSelectSong(null)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold tracking-wider uppercase border border-slate-200 rounded-full cursor-pointer"
                >
                  Main Directory
                </button>
              </div>
            </motion.div>
          )}

        </div>
      )}

    </div>
  );
}
