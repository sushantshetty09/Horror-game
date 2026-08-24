import { useCallback, useEffect, useRef } from 'react';
import type { HeartbeatRate } from '../types';

const HEARTBEAT_FREQ: Record<HeartbeatRate, number> = {
  off: 0,
  slow: 70,
  fast: 120,
  frantic: 180,
};

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const heartbeatGainRef = useRef<GainNode | null>(null);
  const heartbeatOscRef = useRef<OscillatorNode | null>(null);

  const ensureContext = useCallback(async () => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const ambientOsc = ctx.createOscillator();
      ambientOsc.type = 'sawtooth';
      ambientOsc.frequency.setValueAtTime(55, ctx.currentTime);
      const ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0, ctx.currentTime);
      ambientOsc.connect(ambientGain);
      ambientGain.connect(ctx.destination);
      ambientOsc.start();
      ambientOscRef.current = ambientOsc;
      ambientGainRef.current = ambientGain;

      const hbOsc = ctx.createOscillator();
      hbOsc.type = 'square';
      hbOsc.frequency.setValueAtTime(1, ctx.currentTime);
      const hbGain = ctx.createGain();
      hbGain.gain.setValueAtTime(0, ctx.currentTime);
      hbOsc.connect(hbGain);
      hbGain.connect(ctx.destination);
      hbOsc.start();
      heartbeatOscRef.current = hbOsc;
      heartbeatGainRef.current = hbGain;
    }

    if (audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
  }, []);

  const startAmbient = useCallback(async () => {
    await ensureContext();
    const ctx = audioCtxRef.current;
    const gain = ambientGainRef.current;
    if (!ctx || !gain) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.3);
  }, [ensureContext]);

  const setAmbientVolume = useCallback((volume: number) => {
    const ctx = audioCtxRef.current;
    const gain = ambientGainRef.current;
    if (!ctx || !gain) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(Math.min(0.2, volume * 0.12), ctx.currentTime + 0.2);
  }, []);

  const playStatic = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = 0.08;
    src.buffer = buffer;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }, []);

  const setHeartbeat = useCallback((rate: HeartbeatRate) => {
    const ctx = audioCtxRef.current;
    const osc = heartbeatOscRef.current;
    const gain = heartbeatGainRef.current;
    if (!ctx || !osc || !gain) return;

    const freq = HEARTBEAT_FREQ[rate];
    osc.frequency.cancelScheduledValues(ctx.currentTime);
    osc.frequency.setValueAtTime(Math.max(1, freq / 60), ctx.currentTime);

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(rate === 'off' ? 0 : 0.03, ctx.currentTime + 0.15);
  }, []);

  const onWin = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const ambientGain = ambientGainRef.current;
    const hbGain = heartbeatGainRef.current;
    ambientGain?.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    hbGain?.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(659.25, ctx.currentTime + 0.5);
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  }, []);

  const onQualitySwitch = useCallback(
    (ambientVolume: number, heartbeatRate: HeartbeatRate) => {
      playStatic();
      setAmbientVolume(ambientVolume);
      setHeartbeat(heartbeatRate);
    },
    [playStatic, setAmbientVolume, setHeartbeat],
  );

  useEffect(
    () => () => {
      heartbeatOscRef.current?.stop();
      ambientOscRef.current?.stop();
      void audioCtxRef.current?.close();
    },
    [],
  );

  return {
    ensureContext,
    startAmbient,
    onQualitySwitch,
    onWin,
  };
}
