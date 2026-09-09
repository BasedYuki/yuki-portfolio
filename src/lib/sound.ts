export type SoundName = "move" | "confirm" | "back" | "boot" | "error";

let ctx: AudioContext | null = null;

export function ensureAudio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  ac: AudioContext,
  o: { f0: number; f1: number; dur: number; type: OscillatorType; gain: number; delay?: number }
) {
  const t0 = ac.currentTime + (o.delay ?? 0);
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = o.type;
  osc.frequency.setValueAtTime(o.f0, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(o.f1, 1), t0 + o.dur);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(o.gain, t0 + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  osc.connect(g);
  g.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + o.dur + 0.05);
}

function noise(
  ac: AudioContext,
  o: {
    dur: number;
    f0: number;
    f1: number;
    gain: number;
    delay?: number;
    q?: number;
    type?: BiquadFilterType;
  }
) {
  const t0 = ac.currentTime + (o.delay ?? 0);
  const len = Math.max(1, Math.floor(ac.sampleRate * o.dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const f = ac.createBiquadFilter();
  f.type = o.type ?? "bandpass";
  f.Q.value = o.q ?? 1.2;
  f.frequency.setValueAtTime(o.f0, t0);
  f.frequency.exponentialRampToValueAtTime(Math.max(o.f1, 1), t0 + o.dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(o.gain, t0 + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
  src.connect(f);
  f.connect(g);
  g.connect(ac.destination);
  src.start(t0);
}

// Persona 5 Royal main-menu flavor:
// move  = sharp rising swish + snare tick
// confirm = cut transient + distorted jazzy stab (C7 voicing) with vinyl snap
// back  = vinyl-stop pitch drop + muted thud
// boot  = big swell + riser landing on a stab
export function playSound(name: SoundName) {
  const ac = ensureAudio();
  if (!ac) return;
  switch (name) {
    case "move":
      noise(ac, { dur: 0.06, f0: 1000, f1: 6500, gain: 0.05, q: 1.8 });
      tone(ac, { f0: 340, f1: 190, dur: 0.05, type: "triangle", gain: 0.018 });
      break;
    case "confirm":
      noise(ac, { dur: 0.05, f0: 6500, f1: 1800, gain: 0.07, q: 0.9 });
      tone(ac, { f0: 262, f1: 262, dur: 0.16, type: "sawtooth", gain: 0.014, delay: 0.01 });
      tone(ac, { f0: 330, f1: 330, dur: 0.16, type: "sawtooth", gain: 0.013, delay: 0.012 });
      tone(ac, { f0: 392, f1: 392, dur: 0.16, type: "sawtooth", gain: 0.013, delay: 0.014 });
      tone(ac, { f0: 466, f1: 466, dur: 0.22, type: "square", gain: 0.015, delay: 0.016 });
      tone(ac, { f0: 932, f1: 660, dur: 0.14, type: "triangle", gain: 0.016, delay: 0.02 });
      break;
    case "back":
      tone(ac, { f0: 900, f1: 55, dur: 0.26, type: "sawtooth", gain: 0.03 });
      noise(ac, { dur: 0.18, f0: 2200, f1: 300, gain: 0.03, q: 1 });
      tone(ac, { f0: 140, f1: 80, dur: 0.12, type: "sine", gain: 0.045, delay: 0.1 });
      break;
    case "boot":
      noise(ac, { dur: 0.6, f0: 400, f1: 5600, gain: 0.032, q: 1 });
      tone(ac, { f0: 170, f1: 720, dur: 0.6, type: "sawtooth", gain: 0.024 });
      noise(ac, { dur: 0.05, f0: 6500, f1: 1800, gain: 0.07, q: 0.9, delay: 0.6 });
      tone(ac, { f0: 262, f1: 262, dur: 0.18, type: "sawtooth", gain: 0.016, delay: 0.61 });
      tone(ac, { f0: 392, f1: 392, dur: 0.18, type: "sawtooth", gain: 0.014, delay: 0.62 });
      tone(ac, { f0: 466, f1: 466, dur: 0.24, type: "square", gain: 0.016, delay: 0.63 });
      break;
    case "error":
      tone(ac, { f0: 165, f1: 105, dur: 0.22, type: "sawtooth", gain: 0.045 });
      noise(ac, { dur: 0.16, f0: 320, f1: 170, gain: 0.03, q: 0.8, type: "lowpass" });
      break;
  }
}
