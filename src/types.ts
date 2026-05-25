export type InstrumentId = 'piano' | 'xylophone' | 'guitar' | 'drums' | 'woodwind';

export interface Instrument {
  id: InstrumentId;
  name: string;
  category: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  funFact: string;
  instructions: string;
}

export interface MusicalNote {
  label: string; // e.g. "C4", "D4"
  displayName: string; // e.g. "Do", "Re"
  frequency: number;
  color: string;
}

export interface Song {
  id: string;
  title: string;
  emoji: string;
  difficulty: 'Easy' | 'Medium' | 'Fun';
  notes: { note: string; duration: number }[];
}

export interface QuizQuestion {
  soundId: string; // Which sound option is correct
  instrumentId: InstrumentId;
  prompt: string;
  options: {
    instrumentId: InstrumentId;
    name: string;
    emoji: string;
  }[];
}
