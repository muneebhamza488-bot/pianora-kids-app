import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Trophy, 
  Keyboard,
  Disc,
  Wind
} from 'lucide-react';

import { INSTRUMENTS } from './data';
import { Song } from './types';
import { getAudioContext } from './utils/audio';

// Import our custom instrument playgrounds
import PianoPlayground from './components/PianoPlayground';
import XylophonePlayground from './components/XylophonePlayground';
import GuitarPlayground from './components/GuitarPlayground';
import DrumsPlayground from './components/DrumsPlayground';
import FlutePlayground from './components/FlutePlayground';

// Import our interactive support mode panels
import SongBook from './components/SongBook';
import SafariGame from './components/SafariGame';

export default function App() {
  // Navigation states
  const [activeMode, setActiveMode] = useState<'playroom' | 'learn' | 'safari'>('playroom');
  const [activeInstrumentId, setActiveInstrumentId] = useState<string>('piano');
  
  // Auditory activation helper
  const [unmuted, setUnmuted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // Songbook learning progression state
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [currentNoteIdx, setCurrentNoteIdx] = useState(0);
  const [songComplete, setSongComplete] = useState(false);

  // Audio activation assistant
  const activateAudio = () => {
    try {
      getAudioContext();
      setUnmuted(true);
      setShowWelcome(false);
    } catch (err) {
      console.error('Failed to wake sound engine: ', err);
    }
  };

  // Central note validation engine for Learn Mode
  const handleNotePlayed = (noteLabel: string) => {
    if (activeMode !== 'learn' || !selectedSong || songComplete) return;

    const expectedNote = selectedSong.notes[currentNoteIdx];
    
    // Normalize and match play
    if (noteLabel.toLowerCase() === expectedNote.note.toLowerCase()) {
      if (currentNoteIdx === selectedSong.notes.length - 1) {
        setSongComplete(true);
      } else {
        setCurrentNoteIdx((prev) => prev + 1);
      }
    }
  };

  const handleSelectSong = (song: Song | null) => {
    setSelectedSong(song);
    setCurrentNoteIdx(0);
    setSongComplete(false);
  };

  const handleResetSong = () => {
    setCurrentNoteIdx(0);
    setSongComplete(false);
  };

  // Map the instrument active selection to its specific layout
  const activeInstrument = INSTRUMENTS.find((inst) => inst.id === activeInstrumentId) || INSTRUMENTS[0];
  const targetNoteLabel = (activeMode === 'learn' && selectedSong && !songComplete) 
    ? selectedSong.notes[currentNoteIdx].note 
    : undefined;

  // Map animal avatars to instrument index
  const animalAvatars: Record<string, { emoji: string; name: string }> = {
    piano: { emoji: '🐘', name: 'Elsa the Elephant' },
    xylophone: { emoji: '🐼', name: 'Pip the Panda' },
    guitar: { emoji: '🐵', name: 'Max the Monkey' },
    drums: { emoji: '🦁', name: 'Leo the Lion' },
    woodwind: { emoji: '🦊', name: 'Frankie the Fox' },
  };

  return (
    <div 
      id="app-workspace" 
      className="bg-amber-50/30 min-h-screen text-slate-800 pb-16 flex flex-col justify-between font-sans selection:bg-rose-100"
    >
      <header id="primary-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-100/60 shadow-sm px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <span className="text-4xl filter drop-shadow animate-bounce">🌈</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-rose-500 tracking-tight flex items-center gap-1.5 leading-none">
                <span>Kid Instrument Playground</span>
              </h1>
              <p className="text-[11px] font-bold text-slate-500 font-mono tracking-widest uppercase mt-0.5">
                🍭 Let's Play & Learn Music Together!
              </p>
            </div>
          </div>

          {/* Core Applet Control Modes - Free Play, Learn, or Guessing Trivia */}
          <div id="navigation-tabs" className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
            <button
               id="tab-freeplay"
               onClick={() => setActiveMode('playroom')}
               className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                 activeMode === 'playroom'
                   ? 'bg-rose-500 text-white shadow-md'
                   : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
               }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Playroom</span>
            </button>

            <button
              id="tab-learn"
              onClick={() => setActiveMode('learn')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'learn'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learn Song</span>
            </button>

            <button
              id="tab-safari"
              onClick={() => {
                setActiveMode('safari');
                activateAudio(); // precheck audio context on click
              }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'safari'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Sound Quest</span>
            </button>
          </div>

          {/* Sound Master Mute checklist option */}
          <button
            id="sound-igniter"
            onClick={activateAudio}
            className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 transition-shadow cursor-pointer ${
              unmuted 
                ? 'bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-200' 
                : 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
            }`}
          >
            {unmuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 animate-bounce" />}
            <span>{unmuted ? 'Sound: Loud & clear' : 'Click to Unmute Speaker'}</span>
          </button>

        </div>
      </header>

      {/* Main Container Core Layout */}
      <main id="primary-main-viewport" className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 sm:px-8">
        <AnimatePresence mode="wait">
          
          {/* WELCOME / UNMUTE COMPLIANCE WIZARD POPUP */}
          {showWelcome && (
            <motion.div
              key="welcome-card"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-rose-500 via-pink-500 to-indigo-600 p-[3px] rounded-3xl shadow-xl max-w-lg mx-auto mb-8 relative"
            >
              <div className="bg-white rounded-[21px] p-6 text-center space-y-4">
                <span className="text-5xl filter drop-shadow block animate-bounce">🎬🥁🎸</span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800">Ready to play some music?</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Welcome to the magical musical playhouse! Before making cozy notes, we need your hand gesture to awaken our instrument synthesizers.
                  </p>
                </div>
                <button
                  id="welcome-start-button"
                  onClick={activateAudio}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-black tracking-widest uppercase rounded-2xl shadow-lg border-2 border-white transition-all transform hover:scale-[1.01] cursor-pointer"
                >
                  🎶 AWAKEN MAGIC INSTRUMENTS 🎶
                </button>
              </div>
            </motion.div>
          )}

          {activeMode === 'safari' ? (
            /* SAFARI TRIVIA GAME BOARD */
            <motion.div
              key="safari-game-mode"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-3xl mx-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-slate-800">🦁 Safari Sound Quest! 🦒</h2>
                <p className="text-xs font-bold text-emerald-700/80 tracking-wide uppercase mt-0.5">
                  Listen to secret notes and help our jungle travel companions guess the instrument!
                </p>
              </div>
              <SafariGame />
            </motion.div>
          ) : (
            /* INSTRUMENTS AND SONGLIST WORKSPACE MODE (Playroom / Learn Mode) */
            <motion.div
              key="instrument-layout-workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start"
            >
              {/* LEFT / TOP RAIL: Instrument Cards Selector */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Mode description panel */}
                <div id="mode-legend-panel" className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
                  <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-slate-400">
                    {activeMode === 'playroom' ? '🧸 Playroom mode' : '🌟 Learn Song Mode'}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeMode === 'playroom' 
                      ? "Select any toy instrument on the cards below and start drumming, wiggling strings, or blowing air in absolute free-play!"
                      : "Open the Starry Songbook, tap your favorite melody, and follow the magical golden stars glowing on the playing board."
                    }
                  </p>
                </div>

                {/* Vertical lists of Instrument animal buttons */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-slate-400 px-1">
                    🎷 SELECT YOUR MUSIC BUDDY:
                  </span>

                  {INSTRUMENTS.map((ins) => {
                    const avatar = animalAvatars[ins.id];
                    const isActive = activeInstrumentId === ins.id;
                    return (
                      <button
                        key={ins.id}
                        id={`select-instrument-${ins.id}`}
                        onClick={() => {
                          setActiveInstrumentId(ins.id);
                          activateAudio(); // keep audio alive
                        }}
                        className={`
                          p-3 rounded-2xl border-2 text-left flex items-center justify-between gap-3 transition-all cursor-pointer select-none
                          ${isActive 
                            ? 'bg-white border-rose-400 shadow shadow-rose-100/50 scale-[1.01]' 
                            : 'bg-white/50 border-slate-100 hover:border-slate-200 opacity-80'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl filter drop-shadow">{avatar.emoji}</span>
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-tight text-slate-400 leading-none">
                              {avatar.name}
                            </span>
                            <h4 className="font-extrabold text-sm sm:text-base text-slate-800 leading-tight">
                              {ins.name}
                            </h4>
                          </div>
                        </div>

                        {/* Miniature instrument badges */}
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                          {ins.id === 'piano' && <Keyboard className="w-4 h-4 text-indigo-500" />}
                          {ins.id === 'xylophone' && <Sparkles className="w-4 h-4 text-amber-500" />}
                          {ins.id === 'guitar' && <Music className="w-4 h-4 text-emerald-500" />}
                          {ins.id === 'drums' && <Disc className="w-4 h-4 text-rose-500" />}
                          {ins.id === 'woodwind' && <Wind className="w-4 h-4 text-cyan-500" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Starry tutorials songbook renders if inside active Learn mode */}
                {activeMode === 'learn' && (
                  <SongBook
                    selectedSong={selectedSong}
                    currentNoteIdx={currentNoteIdx}
                    onSelectSong={handleSelectSong}
                    onResetSong={handleResetSong}
                    songComplete={songComplete}
                  />
                )}
              </div>

              {/* RIGHT / MAIN RAIL: Playing Instrument Stage Board */}
              <div className="lg:col-span-8 flex flex-col items-center gap-6">
                
                {/* Active instrument card description box & Factoid bubble */}
                <div 
                  id="instrument-curtain-card"
                  className={`w-full p-6 rounded-3xl border-2 ${activeInstrument.bgColor} ${activeInstrument.borderColor} transition-all duration-300 relative`}
                >
                  <div className="flex gap-4 items-start">
                    <span className="text-4xl sm:text-5xl filter drop-shadow">
                      {animalAvatars[activeInstrument.id]?.emoji}
                    </span>
                    <div className="flex-1">
                      <span className="text-[10.5px] font-bold font-mono text-slate-400 uppercase tracking-widest leading-none">
                        ACTIVE INSTRUMENT
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-snug">
                        {activeInstrument.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 font-medium">
                        {activeInstrument.description}
                      </p>
                    </div>
                  </div>

                  {/* Fun animal fact drop list */}
                  <div className="mt-4 bg-white/75 p-3.5 rounded-2xl border border-black/5 text-xs">
                    <div className="flex items-center gap-1.5 text-rose-500 font-bold uppercase tracking-wider text-[10px]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Magical Trivia Fun Fact!</span>
                    </div>
                    <p className="text-slate-600 mt-1 italic font-medium">
                      "{activeInstrument.funFact}"
                    </p>
                  </div>
                </div>

                {/* THE ACTIVE INSTRUMENT PLAYGROUND STAGE */}
                <div 
                  id="playing-instrument-surface" 
                  className="w-full bg-white rounded-3xl border-2 border-slate-100 shadow-sm min-h-[300px] flex items-center justify-center relative overflow-hidden"
                >
                  {/* Backdrop canvas decor elements */}
                  <div className="absolute top-2 left-3 text-[10px] font-mono font-bold tracking-widest text-slate-300 pointer-events-none uppercase">
                    🧸 STUDIO STAGE • {activeInstrument.name}
                  </div>
                  
                  {activeInstrumentId === 'piano' && (
                    <PianoPlayground 
                      targetNote={targetNoteLabel} 
                      onNotePlayed={handleNotePlayed} 
                    />
                  )}
                  {activeInstrumentId === 'xylophone' && (
                    <XylophonePlayground 
                      targetNote={targetNoteLabel} 
                      onNotePlayed={handleNotePlayed} 
                    />
                  )}
                  {activeInstrumentId === 'guitar' && (
                    <GuitarPlayground 
                      targetNote={targetNoteLabel} 
                      onNotePlayed={handleNotePlayed} 
                    />
                  )}
                  {activeInstrumentId === 'drums' && (
                    <DrumsPlayground 
                      targetNote={targetNoteLabel} 
                      onNotePlayed={handleNotePlayed} 
                    />
                  )}
                  {activeInstrumentId === 'woodwind' && (
                    <FlutePlayground 
                      targetNote={targetNoteLabel} 
                      onNotePlayed={handleNotePlayed} 
                    />
                  )}
                </div>

                {/* Play controls / instructions footer */}
                <div className="text-center max-w-sm px-6">
                  <p className="text-xs text-slate-400 font-medium text-center">
                     🎯 <strong>Instructions:</strong> {activeInstrument.instructions}
                  </p>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Humble craft platform footer */}
      <footer id="primary-footer" className="text-center mt-12 px-6">
        <p className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">
          ★ Playroom Workspace • Built with pure care & magic elements ★
        </p>
      </footer>
    </div>
  );
}
