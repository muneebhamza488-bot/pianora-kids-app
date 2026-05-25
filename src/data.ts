import { Instrument, Song, QuizQuestion } from './types';

export const INSTRUMENTS: Instrument[] = [
  {
    id: 'piano',
    name: 'Magic Rainbow Piano',
    category: 'Keyboards',
    icon: 'Keyboard',
    color: 'indigo',
    bgColor: 'bg-indigo-50/85',
    borderColor: 'border-indigo-300 shadow-indigo-100',
    description: 'Press any rainbow key to play beautiful chiming notes!',
    funFact: 'Inside a real giant piano, tiny soft felt hammers tap metal strings to make them sing when your fingers press down.',
    instructions: 'Tap the piano keys at the bottom. You can tap fast or hold them to let the sound float gracefully!'
  },
  {
    id: 'xylophone',
    name: 'Sparkle Mallet Xylophone',
    category: 'Percussion',
    icon: 'Sparkles',
    color: 'amber',
    bgColor: 'bg-amber-50/85',
    borderColor: 'border-amber-300 shadow-amber-100',
    description: 'Ding, Dong! Tap the wooden bars to soar musical wood notes up and down the rainbow.',
    funFact: 'Xylophone comes from two greek words: "Xylon" which means wood, and "Phone" which means voice or sound. Wood-Voice!',
    instructions: 'Hit the wooden color bars. The bigger the bar on the left, the deeper and warmer the sound will be!'
  },
  {
    id: 'guitar',
    name: 'Cozy Fireside Guitar',
    category: 'Strings',
    icon: 'Music',
    color: 'emerald',
    bgColor: 'bg-emerald-50/85',
    borderColor: 'border-emerald-300 shadow-emerald-100',
    description: 'Boing! Tap or swipe the wires to make them wiggle, shake, and strum sweet woodsy tones.',
    funFact: 'A guitar body is hollow inside! This design lets the wiggling string air echoes gather strength and sing out loud.',
    instructions: 'Strum or tap direct lines on the guitar strings. See them wig-wag as they render sweet acoustic sound frequencies.'
  },
  {
    id: 'drums',
    name: 'Starry Parade Drums',
    category: 'Percussion',
    icon: 'Disc',
    color: 'rose',
    bgColor: 'bg-rose-50/85',
    borderColor: 'border-rose-300 shadow-rose-100',
    description: 'Thump, snap, and rattle! Strike the foot kick, rattle the snare, or bounce on the gold cymbal!',
    funFact: 'Drums are the oldest instruments in the world! Thousands of years ago, people used loud drum beats to send messages over giant mountains.',
    instructions: 'Click the different drums on the stage to build a beautiful marching parade rhythm of your own!'
  },
  {
    id: 'woodwind',
    name: 'Forest Whispering Flute',
    category: 'Woodwinds',
    icon: 'Wind',
    color: 'cyan',
    bgColor: 'bg-cyan-50/85',
    borderColor: 'border-cyan-300 shadow-cyan-100',
    description: 'Breeze blowing! Press the valve keys to summon lovely forest wind whistles.',
    funFact: 'The oldest flute discoverable was carved from a wild bear bone over 40,000 years ago by ancient campfire players!',
    instructions: 'Tap the color valve key buttons to simulate blowing air. Watch the wind puffs travel out!'
  }
];

export const SONGS: Song[] = [
  {
    id: 'twinkle',
    title: 'Twinkle Twinkle Little Star',
    emoji: '🌟',
    difficulty: 'Easy',
    notes: [
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 },
      { note: 'A4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 }
    ]
  },
  {
    id: 'mary_lamb',
    title: 'Mary Had a Little Lamb',
    emoji: '🐑',
    difficulty: 'Easy',
    notes: [
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 2 },
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 2 },
      { note: 'E4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 2 }
    ]
  },
  {
    id: 'baby_shark',
    title: 'Baby Shark Song',
    emoji: '🦈',
    difficulty: 'Medium',
    notes: [
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'E4', duration: 2 }
    ]
  },
  {
    id: 'ode_to_joy',
    title: 'Ode to Joy',
    emoji: '🇪🇺',
    difficulty: 'Fun',
    notes: [
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1.5 },
      { note: 'D4', duration: 0.5 },
      { note: 'D4', duration: 2 }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    soundId: 'kick',
    instrumentId: 'drums',
    prompt: '🔊 Thump! Boom! Which part of the drum set makes this low heartbeat sound when you step on it?',
    options: [
      { instrumentId: 'drums', name: 'Bass Drum Stomp', emoji: '🥁' },
      { instrumentId: 'piano', name: 'Rainbow Piano', emoji: '🎹' },
      { instrumentId: 'woodwind', name: 'Wispy Flute', emoji: '💨' }
    ]
  },
  {
    soundId: 'synthesized_xylophone_c5',
    instrumentId: 'xylophone',
    prompt: '🔊 Dingggg! Listen to this sparkling high note that sounds like metal stars colliding. Who sang it?',
    options: [
      { instrumentId: 'guitar', name: 'Strummy Guitar', emoji: '🎸' },
      { instrumentId: 'xylophone', name: 'Sparkle Xylophone', emoji: '🎵' },
      { instrumentId: 'drums', name: 'Snare Snapper', emoji: '🥁' }
    ]
  },
  {
    soundId: 'guitar_chord',
    instrumentId: 'guitar',
    prompt: '🔊 Boingggg! Which cozy warm instrument has six friendly strings that dance together when we strum them?',
    options: [
      { instrumentId: 'piano', name: 'Tickle Piano', emoji: '🎹' },
      { instrumentId: 'guitar', name: 'Fireside Guitar', emoji: '🎸' },
      { instrumentId: 'woodwind', name: 'Windy Flute', emoji: '🎺' }
    ]
  },
  {
    soundId: 'hihat',
    instrumentId: 'drums',
    prompt: '🔊 Tizzz, tizz! This sounds like tiny magical golden coins rattling. Who is clapping?',
    options: [
      { instrumentId: 'drums', name: 'Shiny Cymbal (Hi-Hat)', emoji: '⭐' },
      { instrumentId: 'xylophone', name: 'Wood Xylophone', emoji: '🪵' },
      { instrumentId: 'woodwind', name: 'Breezy Flute', emoji: '💨' }
    ]
  },
  {
    soundId: 'woodwind_wind',
    instrumentId: 'woodwind',
    prompt: '🔊 Whistle, breeze! This instrument takes a deep breath and lets out sweet sound-birds into the forest.',
    options: [
      { instrumentId: 'piano', name: 'Pounding Piano', emoji: '🎹' },
      { instrumentId: 'drums', name: 'Parade Snare', emoji: '🥁' },
      { instrumentId: 'woodwind', name: 'Whispering Flute', emoji: '🎺' }
    ]
  }
];
