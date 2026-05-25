// Custom Web Audio API synthesizer for the instruments playground
export const NOTES_MAP = [
  { label: 'C4', displayName: 'Do 🔴', frequency: 261.63, color: 'bg-rose-500 hover:bg-rose-400 text-rose-50' },
  { label: 'D4', displayName: 'Re 🟠', frequency: 293.66, color: 'bg-orange-500 hover:bg-orange-400 text-orange-50' },
  { label: 'E4', displayName: 'Mi 🟡', frequency: 329.63, color: 'bg-amber-400 hover:bg-amber-300 text-amber-950' },
  { label: 'F4', displayName: 'Fa 🟢', frequency: 349.23, color: 'bg-emerald-500 hover:bg-emerald-400 text-emerald-50' },
  { label: 'G4', displayName: 'So 🔵', frequency: 392.00, color: 'bg-blue-500 hover:bg-blue-400 text-blue-50' },
  { label: 'A4', displayName: 'La 🟣', frequency: 440.00, color: 'bg-indigo-500 hover:bg-indigo-400 text-indigo-50' },
  { label: 'B4', displayName: 'Ti 🌸', frequency: 493.88, color: 'bg-purple-500 hover:bg-purple-400 text-purple-50' },
  { label: 'C5', displayName: 'Do ⭐', frequency: 523.25, color: 'bg-pink-500 hover:bg-pink-400 text-pink-50' },
];

let audioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Generate a random noise memory buffer for snare drum snap and hi-hat rattle
let noiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const size = ctx.sampleRate * 1.5; // 1.5 seconds of noise
    noiseBuffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
}

// Master volume node
let masterGain: GainNode | null = null;

function setupAudioNodes(ctx: AudioContext) {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.45, ctx.currentTime); // Gentle play volume
    masterGain.connect(ctx.destination);
  }
}

// Synthesizer note player
export function playSynthesizedNote(
  instrumentId: string,
  frequency: number,
  durationLength: number = 0.5
) {
  try {
    const ctx = getAudioContext();
    setupAudioNodes(ctx);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    gainNode.connect(masterGain!);

    if (instrumentId === 'piano') {
      // Gentle layered piano chords
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 2, now); // Sweet high octave
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.18, now);
      osc2.connect(osc2Gain);
      osc2Gain.connect(gainNode);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.22);
      
      osc.connect(filter);
      filter.connect(gainNode);

      // Cute piano string envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.65, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.16, now + 0.28);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationLength * 1.4);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + durationLength * 1.5);
      osc2.stop(now + durationLength * 1.5);

    } else if (instrumentId === 'xylophone') {
      // Extremely sharp pure chimes
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(frequency * 3.01, now); // Metallic wood rattle
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.06, now);
      osc2.connect(osc2Gain);
      osc2Gain.connect(gainNode);

      osc.connect(gainNode);

      // Super fast decay
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.8, now + 0.003);
      gainNode.gain.exponentialRampToValueAtTime(0.008, now + 0.2);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.24);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 0.28);
      osc2.stop(now + 0.28);

    } else if (instrumentId === 'guitar') {
      // Strummed string vibration
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, now);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(frequency, now);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.12, now);
      osc2.connect(filter);
      osc.connect(filter);
      filter.connect(gainNode);

      // Vibrato effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.8, now);
      lfoGain.gain.setValueAtTime(2.0, now);
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfoGain.connect(osc2.frequency);

      lfo.start(now);
      lfo.stop(now + durationLength * 1.6);

      // Acoustic envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.6, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationLength * 1.8);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + durationLength * 1.9);
      osc2.stop(now + durationLength * 1.9);

    } else if (instrumentId === 'woodwind') {
      // Soft flute-like whistle
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency, now);
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.08, now);
      osc2.connect(osc2Gain);
      osc2Gain.connect(gainNode);

      // Breath puff
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuffer(ctx);
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(frequency * 1.3, now);
      noiseFilter.Q.setValueAtTime(5, now);
      
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.003, now + 0.18);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(gainNode);

      osc.connect(gainNode);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(6.2, now);
      lfoGain.gain.setValueAtTime(1.5, now);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      lfo.start(now);
      lfo.stop(now + durationLength * 1.4);

      // Soft flow envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gainNode.gain.setValueAtTime(0.5, now + durationLength * 0.5);
      gainNode.gain.exponentialRampToValueAtTime(0.005, now + durationLength * 1.2);

      noise.start(now);
      osc.start(now);
      osc2.start(now);

      noise.stop(now + durationLength * 1.3);
      osc.stop(now + durationLength * 1.3);
      osc2.stop(now + durationLength * 1.3);
    }
  } catch (err) {
    console.error('Failed to play note synthesized: ', err);
  }
}

// Drums audio engine
export function playDrumTap(drumType: 'kick' | 'snare' | 'hihat' | 'tom') {
  try {
    const ctx = getAudioContext();
    setupAudioNodes(ctx);
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    gainNode.connect(masterGain!);

    if (drumType === 'kick') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.1);

      osc.connect(gainNode);

      gainNode.gain.setValueAtTime(0.85, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.22);

    } else if (drumType === 'snare') {
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuffer(ctx);

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1000, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(gainNode);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      
      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.3, now);
      snapGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(snapGain);
      snapGain.connect(gainNode);

      gainNode.gain.setValueAtTime(0.9, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.22);
      osc.stop(now + 0.22);

    } else if (drumType === 'hihat') {
      const noise = ctx.createBufferSource();
      noise.buffer = getNoiseBuffer(ctx);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, now);

      osc.type = 'square';
      osc.frequency.setValueAtTime(10500, now);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.07, now);

      noise.connect(filter);
      filter.connect(gainNode);
      osc.connect(oscGain);
      oscGain.connect(gainNode);

      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.07);
      osc.stop(now + 0.07);

    } else if (drumType === 'tom') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.14);

      osc.connect(gainNode);

      gainNode.gain.setValueAtTime(0.7, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch (err) {
    console.error('Failed to play drum synth: ', err);
  }
}
