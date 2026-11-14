import { useEffect, useRef, useState } from 'react';
import { Game, type RunState } from './Game';

const fresh = (): RunState => ({ lane: 0, distance: 0, elapsed: 0, jumpAt: -10, slideUntil: -1, running: false });
export function App() {
  const state = useRef(fresh());
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [distance, setDistance] = useState(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const toggle = () => { state.current.running = !state.current.running; setRunning(state.current.running); setStarted(true); };
  const action = (direction: string) => {
    const s = state.current;
    if (!s.running) return;
    if (direction === 'left') s.lane = Math.max(-1, s.lane - 1);
    if (direction === 'right') s.lane = Math.min(1, s.lane + 1);
    if (direction === 'up' && s.elapsed - s.jumpAt >= 0.8 && s.elapsed >= s.slideUntil) s.jumpAt = s.elapsed;
    if (direction === 'down' && s.elapsed - s.jumpAt >= 0.8) s.slideUntil = s.elapsed + 0.7;
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && ['BUTTON', 'INPUT'].includes(event.target.tagName)) return;
      const controls: Record<string, string> = { ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right', ArrowUp: 'up', w: 'up', ' ': 'up', ArrowDown: 'down', s: 'down' };
      const direction = controls[event.key];
      if (direction || event.key.toLowerCase() === 'p' || event.key === 'Escape') event.preventDefault();
      if (event.repeat) return;
      if (direction) action(direction);
      if (event.key.toLowerCase() === 'p' || event.key === 'Escape') toggle();
    };
    const blur = () => { state.current.running = false; setRunning(false); };
    const timer = window.setInterval(() => setDistance(Math.floor(state.current.distance)), 100);
    window.addEventListener('keydown', key); window.addEventListener('blur', blur);
    return () => { clearInterval(timer); window.removeEventListener('keydown', key); window.removeEventListener('blur', blur); };
  }, []);
  return <main>
    <div className="scene" onPointerDown={e => { pointer.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerCancel={() => { pointer.current = null; }} onPointerUp={e => {
      const start = pointer.current; pointer.current = null; if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
      action(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy < 0 ? 'up' : 'down');
    }}><Game state={state}/></div>
    <header><div><span className="eyebrow">A LITTLE LAGOS. A LOT OF MOTION.</span><h1>LAGOS<span>RUSH</span></h1></div><div className="badge">DAY 01 / FREE RUN</div></header>
    <aside className="hud"><span>DISTANCE</span><strong>{distance.toLocaleString()}<small> m</small></strong><span>MARINA → THE CITY</span></aside>
    <div className="toolbar"><button onClick={toggle}>{running ? 'Pause' : started ? 'Resume run' : 'Start running'} <span>{running ? 'Ⅱ' : '↗'}</span></button>{started && <button className="secondary" onClick={() => { state.current = fresh(); setRunning(false); setStarted(false); setDistance(0); }}>Reset</button>}</div>
    {!running && <section className="intro"><span className="eyebrow">WELCOME TO THE STREETS</span><h2>{started ? 'Catch your breath.' : 'Oya, let’s go.'}</h2><p>Three lanes. Golden skies. Danfos on the roadside.<br/>Find your rhythm in this first playable Lagos scene.</p><p className="note">Day 1 sandbox · obstacles and scoring come later.</p></section>}
    <footer><span><b>← → / A D</b> change lanes</span><span><b>↑ / SPACE</b> jump</span><span><b>↓ / S</b> slide</span><span><b>P / ESC</b> pause</span><span className="touch-hint">Swipe to move, jump or slide</span></footer>
    <nav aria-label="Touch controls" className="mobile-controls">{[['left','←'],['up','↑'],['down','↓'],['right','→']].map(([dir,label]) => <button key={dir} aria-label={dir} onClick={() => action(dir)}>{label}</button>)}</nav>
  </main>;
}
