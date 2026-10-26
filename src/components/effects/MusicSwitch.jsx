import { useEffect, useRef, useState } from "react";

// Audio3 leads, then audio2, then audio1; the first track is the one that autoplays.
const SONGS = ["/audio/song3.mp3", "/audio/song2.mp3", "/audio/song1.mp3"];

const Speaker = ({ muted }) => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
    {muted ? <path d="m16 9 5 6m0-6-5 6" /> : <path d="M16 9a4 4 0 0 1 0 6m2.5-9a8 8 0 0 1 0 12" />}
  </svg>
);

// Top-right player: switch between the three tracks, mute (fixed 50% volume). Same iOS
// liquid-glass lens as the nav capsule (.liquid-glass in index.css). Autoplays on mount
// (unmuted; if the browser refuses, it starts on the first interaction). Clicking the active track pauses/resumes it. The label is dark
// over the light hero and light everywhere else.
export default function MusicSwitch() {
  const audio = useRef(null);
  const box = useRef(null);
  const [blocked, setBlocked] = useState(false);
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [onHero, setOnHero] = useState(false);

  useEffect(() => {
    const a = audio.current;
    a.volume = 0.5;
    // Browsers block sound until the visitor interacts, so if autoplay is
    // refused, start on the first click/key (a click on the player itself is
    // left to its own buttons). Always unmuted.
    const EVENTS = ["pointerdown", "pointerup", "mousedown", "touchend", "click", "keydown"];
    const start = (e) => {
      if (box.current.contains(e.target)) return;
      a.play().then(() => EVENTS.forEach((t) => window.removeEventListener(t, start))).catch(() => {});
    };
    a.play().catch(() => setBlocked(true));
    EVENTS.forEach((t) => window.addEventListener(t, start));
    const hero = document.getElementById("hero");
    const io = hero && new IntersectionObserver(([e]) => setOnHero(e.intersectionRatio > 0.15), { threshold: [0.15] });
    io?.observe(hero);
    return () => {
      EVENTS.forEach((t) => window.removeEventListener(t, start));
      io?.disconnect();
      a.pause();
    };
  }, []);

  useEffect(() => {
    audio.current.muted = muted;
  }, [muted]);

  const pick = (i) => {
    const a = audio.current;
    if (i === track) return a.paused ? a.play() : a.pause();
    setTrack(i);
    a.src = SONGS[i];
    a.play().catch(() => {});
  };

  return (
    <div
      ref={box}
      className={`liquid-glass fixed right-4 top-4 z-50 flex items-center gap-1 rounded-full p-1 font-code text-[11px] uppercase transition-colors ${
        onHero ? "text-void" : "text-snow"
      }`}
    >
      <audio ref={audio} src={SONGS[0]} loop onPlay={() => { setPlaying(true); setBlocked(false); }} onPause={() => setPlaying(false)} />
      {blocked && !playing && <span className="hidden animate-pulse pl-3 sm:inline">Click anywhere for music</span>}
      {SONGS.map((_, i) => (
        <button
          key={i}
          onClick={() => pick(i)}
          aria-label={`Song ${i + 1}${i === track && playing ? " (pause)" : ""}`}
          aria-pressed={i === track && playing}
          className={`rounded-full px-3 py-1 transition-colors ${i === track ? "bg-white/35 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)]" : "hover:bg-white/20"}`}
        >
          {i === track && playing ? "II" : "▶"} {i + 1}
        </button>
      ))}
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute" : "Mute"}
        aria-pressed={muted}
        className="rounded-full p-1.5 transition-colors hover:bg-white/20"
      >
        <Speaker muted={muted} />
      </button>
    </div>
  );
}
