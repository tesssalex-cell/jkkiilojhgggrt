import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CosmoStoneLanding() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = async () => {
      try { await v.play(); setIsPlaying(!v.paused); } catch {}
    };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  const togglePlay = async () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { await v.play(); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); }
  };

  const toggleMute = async () => {
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
    if (!v.muted && v.paused) { try { await v.play(); setIsPlaying(true); } catch {} }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)] antialiased" style={{"--bg":"#0B1030","--bg-2":"#10173D","--text":"#E8F1FF","--muted":"#A9B4CF","--accent-1":"#26E5C0","--accent-2":"#8453FF","--button":"#2B2F52","--button-hover":"#3A3F6B","--pause":"#5E5BFF","--border":"rgba(255,255,255,.08)"}}>
      {/* Animated Aurora styles */}
      <style>{`@keyframes auroraSpin { to { transform: rotate(360deg); } }
      .aurora-spin{position:absolute;inset:-10% -20%;filter:blur(80px);opacity:.6;background:conic-gradient(from 180deg at 50% 50%, rgba(38,229,192,.30), rgba(132,83,255,.25), rgba(38,229,192,.30));animation:auroraSpin 18s linear infinite;pointer-events:none;}`}</style>
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--bg)]" />
        <div className="absolute -top-40 -left-32 h-[60vh] w-[65vw] rounded-full blur-[120px] opacity-50" style={{background:"radial-gradient(ellipse at center, var(--accent-1), transparent)"}} />
        <div className="absolute -bottom-40 -right-20 h-[60vh] w-[65vw] rounded-full blur-[120px] opacity-50" style={{background:"radial-gradient(ellipse at center, var(--accent-2), transparent)"}} />
        <div className="aurora-spin" />
      </div>

      <main className="relative mx-auto max-w-[1160px] px-8 md:px-8 sm:px-5 pb-24">
        {/* HERO */}
        <section className="relative flex flex-col items-center justify-center text-center pt-24">
          <motion.img
            src="./assets/cosmo-hero.png"
            alt="Cosmo Hero"
            className="h-[360px] w-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)] md:h-[360px] sm:h-[260px]"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <h1 className="mt-6 text-[64px] md:text-[64px] sm:text-[40px] font-[900] tracking-[0.03em] uppercase font-['Montserrat_Alternates']">COSMO STONE</h1>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[15px] leading-[1.7] text-[var(--muted)] font-['Inter']">
            A simple meme coin in gem form, who takes itself (but taxes; too)
          </p>
          <div className="mt-6 flex gap-5">
            {['x','discord','telegram'].map((icon,i)=>(
              <button key={i} className="h-11 w-11 rounded-full bg-[var(--button)] hover:bg-[var(--button-hover)] flex items-center justify-center transition-transform duration-200 hover:scale-105 cursor-pointer">
                <img src={`./assets/icon-${icon}.svg`} alt={icon} className="h-5 w-5" />
              </button>
            ))}
          </div>
        </section>

        {/* ORIGIN OF GEM */}
        <section className="mt-14 sm:mt-10">
          <h2 className="text-[20px] font-bold font-['Inter']">Origin of GEM</h2>
          <div className="mt-4 rounded-[24px] bg-[var(--bg-2)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[var(--border)]">
            <p className="text-[16px] sm:text-[15px] leading-[1.7] text-[var(--muted)] font-['Inter']">
              Hay among the farts: All aftry contrict is naching across the sky, it pletosed the heavennes, a rushed tovend's Earth: it greeks off and <em>Abiol</em>y 2013 just in the mid 9. Tham — ithe — allead 2 — Earth nembes from is, ifax heek overaving <em>indoo Aond</em> — there — the — freaible — deact l'ore. Earth Wakeome: from its tery heat, <em>Uncover end u second soudwaves</em> am, a little diamond married (GEM — an appear — a's i)!
            </p>
          </div>
        </section>

        {/* ANIMATION */}
        <section className="mt-14 sm:mt-10">
          <h2 className="text-[20px] font-bold font-['Inter']">Animation</h2>
          <div className="mt-4 relative rounded-[24px] bg-[var(--bg-2)] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[var(--border)] aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="./assets/anim.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="h-10 w-10 rounded-full bg-[var(--pause)] text-white font-bold flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105">{isPlaying ? "II" : "▶"}</button>
              <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"} title={isMuted ? "Включить звук" : "Выключить звук"} className="h-10 w-10 rounded-full bg-[var(--button)] hover:bg-[var(--button-hover)] text-white font-bold flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105">{isMuted ? "🔇" : "🔊"}</button>
            </div>
          </div>
        </section>

        {/* MEMES */}
        <section className="mt-14 sm:mt-10">
          <h2 className="text-[20px] font-bold font-['Inter']">Memes</h2>
          <div className="mt-4 grid grid-cols-4 sm:grid-cols-2 gap-6">
            {[1,2,3,4].map((n)=>(
              <div key={n} className="group rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[var(--border)] aspect-square cursor-pointer">
                <img src={`./assets/meme-${n}.png`} alt={`meme-${n}`} className="w-full h-full object-cover transition duration-200 ease-linear brightness-[.55] saturate-0 group-hover:brightness-100 group-hover:saturate-100" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
