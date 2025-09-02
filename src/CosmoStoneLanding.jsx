
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CosmoStoneLanding() {
  const [playing, setPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Theme tokens
  const theme = {"--bg":"#0B1030","--bg-2":"#10173D","--text":"#E8F1FF","--muted":"#A9B4CF","--accent-1":"#26E5C0","--accent-2":"#8453FF","--button":"#2B2F52","--button-hover":"#3A3F6B","--pause":"#5E5BFF","--border":"rgba(255,255,255,.08)"};

  // Parallax
  const [par, setPar] = useState({ x: 0, y: 0, s: 0 });
  useEffect(() => {
    const onScroll = () => setPar(p => ({ ...p, s: window.scrollY }));
    const onMouse = (e) => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 24;
      const ry = (e.clientY / window.innerHeight - 0.5) * 24;
      setPar(p => ({ ...p, x: rx, y: ry }));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); };
  }, []);

  // Video controls
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = async () => { try { await v.play(); } catch {} };
    v.addEventListener("loadedmetadata", onLoaded);
    return () => v.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  // Stars + comets with center aiming and sparks
  useEffect(() => {
    const c = document.getElementById('cs-stars');
    if (!c) return;
    const ctx = c.getContext('2d');
    let w=0,h=0,dpr=window.devicePixelRatio||1, rafId=0;
    const rand = (a,b)=>a+Math.random()*(b-a);
    const stars = [], comets = [], sparks = [];

    const resetCanvas=()=>{ w=innerWidth; h=innerHeight; c.width=w*dpr; c.height=h*dpr; c.style.width=w+'px'; c.style.height=h+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); };
    resetCanvas(); addEventListener('resize', resetCanvas);

    const STAR_COUNT = Math.min(180, Math.floor(innerWidth/6));
    for(let i=0;i<STAR_COUNT;i++) stars.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.2+0.2, a: rand(.3,.9), tw: rand(.5,1.5) });

    let t=0, px=0, py=0, sy=0;
    addEventListener('mousemove', e=>{ px=(e.clientX/w-.5)*8; py=(e.clientY/h-.5)*8; }, {passive:true});
    addEventListener('scroll', ()=>{ sy = scrollY; }, {passive:true});

    function spawnComet(){
      const side = Math.random()<.5?'left':'right';
      const margin = 60;
      const startX = side==='left' ? -margin : w + margin;
      const startY = rand(h*0.25, h*0.75);
      const targetX = w/2 + rand(-w*0.08, w*0.08);
      const targetY = h/2 + rand(-h*0.08, h*0.08);
      const dx = targetX - startX, dy = targetY - startY;
      const len = Math.hypot(dx, dy) || 1;
      const speed = rand(3,5);
      const vx = (dx/len)*speed, vy=(dy/len)*speed;
      comets.push({ x:startX, y:startY, vx, vy, life:1, hit:false });
      cometTimer = setTimeout(spawnComet, rand(9000,15000));
    }
    let cometTimer = setTimeout(spawnComet, 2500);

    function draw(){
      rafId = requestAnimationFrame(draw);
      t+=0.016; ctx.clearRect(0,0,w,h);
      for(const s of stars){
        const tw = (Math.sin(t*s.tw)+1)/2;
        const x = s.x + px*2 - sy*0.02;
        const y = s.y + py*2 + sy*0.04;
        ctx.globalAlpha = s.a*(0.6+tw*0.4);
        ctx.beginPath(); ctx.arc(x,y,s.r*(1+tw*0.2),0,Math.PI*2);
        ctx.fillStyle = '#E8F1FF'; ctx.fill();
      }
      ctx.globalAlpha = 1;
      for(let i=comets.length-1;i>=0;i--){
        const cmt = comets[i];
        cmt.x += cmt.vx; cmt.y += cmt.vy; cmt.life -= 0.006;
        const cx=w/2, cy=h/2; const dist=Math.hypot(cmt.x-cx, cmt.y-cy);
        if(!cmt.hit && dist < Math.min(w,h)*0.08){
          cmt.hit = true;
          const count = Math.floor(12 + Math.random()*12);
          for(let k=0;k<count;k++){ const a=Math.random()*Math.PI*2, sp=2+Math.random()*4; sparks.push({x:cmt.x,y:cmt.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1}); }
        }
        const grad=ctx.createRadialGradient(cmt.x,cmt.y,0,cmt.x,cmt.y,160);
        grad.addColorStop(0,'rgba(38,229,192,.8)'); grad.addColorStop(.4,'rgba(132,83,255,.4)'); grad.addColorStop(1,'rgba(11,16,48,0)');
        ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(cmt.x,cmt.y,90,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(cmt.x,cmt.y,2.2,0,Math.PI*2); ctx.fillStyle='#E8F1FF'; ctx.fill();
        if(cmt.life<=0 || cmt.x<-200 || cmt.x>w+200 || cmt.y>h+200) comets.splice(i,1);
      }
      for(let s=sparks.length-1;s>=0;s--){
        const p=sparks[s]; p.x+=p.vx; p.y+=p.vy; p.life-=.02;
        ctx.globalAlpha=Math.max(p.life,0);
        ctx.beginPath(); ctx.arc(p.x,p.y,1.4,0,Math.PI*2);
        ctx.fillStyle=(s%2)?'rgba(38,229,192,1)':'rgba(132,83,255,1)'; ctx.fill();
        if(p.life<=0) sparks.splice(s,1);
      }
      ctx.globalAlpha=1;
    }
    draw();

    return ()=>{ cancelAnimationFrame(rafId); removeEventListener('resize', resetCanvas); clearTimeout(cometTimer); };
  }, []);

  const CONTRACT = "YOUR_SOLANA_CONTRACT_ADDRESS";
  const [copied, setCopied] = useState(false);
  const copyContract = async () => {
    try { await navigator.clipboard.writeText(CONTRACT); setCopied(true); setTimeout(()=>setCopied(false), 1500); }
    catch(e){
      const tmp=document.createElement('textarea'); tmp.value=CONTRACT; document.body.appendChild(tmp); tmp.select(); document.execCommand('copy'); document.body.removeChild(tmp);
      setCopied(true); setTimeout(()=>setCopied(false),1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)] antialiased"
         style={theme}>
      {/* Animated aurora background */}
      <style>{`@keyframes auroraSpin { to { transform: rotate(360deg); } }
      .aurora-parallax{position:absolute;inset:-10% -20%;pointer-events:none;z-index:-10}
      .aurora-spin{position:absolute;inset:0;filter:blur(80px);opacity:.6;background:conic-gradient(from 180deg at 50% 50%, rgba(38,229,192,.30), rgba(132,83,255,.25), rgba(38,229,192,.30));animation:auroraSpin 18s linear infinite;pointer-events:none;}
      `}</style>
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-32 h-[60vh] w-[65vw] rounded-full blur-[120px] opacity-50"
             style={{background:"radial-gradient(ellipse at center, var(--accent-1), transparent)", transform:`translate3d(${-par.x*.4}px, ${-par.y*.4 + par.s*.05}px,0)`}}/>
        <div className="absolute -bottom-40 -right-20 h-[60vh] w-[65vw] rounded-full blur-[120px] opacity-50"
             style={{background:"radial-gradient(ellipse at center, var(--accent-2), transparent)", transform:`translate3d(${par.x*.5}px, ${par.y*.5 - par.s*.04}px,0)`}}/>
        <div className="aurora-parallax" style={{ transform:`translate3d(${par.x*.3}px, ${par.y*.3}px,0)`}}>
          <div className="aurora-spin" />
        </div>
      </div>

      {/* Stars + comets canvas */}
      <canvas id="cs-stars" className="pointer-events-none fixed inset-0 z-[1]" />

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
            Gem is a diamond born from the light and energy of the Solana blockchain. He is not just a mineral, but a digital being — the embodiment of resilience, purity, and the strength of community.
          </p>
          <div className="mt-6 flex gap-5">
            {['x','discord','telegram'].map((icon,i)=>(
              <a key={i} className="h-11 w-11 rounded-full bg-[var(--button)] hover:bg-[var(--button-hover)] flex items-center justify-center transition-transform duration-200 hover:scale-105 cursor-pointer">
                <img src={`./assets/icon-${icon}.svg`} alt={icon} className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* CONTRACT */}
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-2)] px-4 py-2 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <code className="font-mono text-sm text-[var(--text)]/90 select-all">{CONTRACT}</code>
              <button onClick={copyContract} className="h-8 px-3 rounded-full bg-[var(--button)] hover:bg-[var(--button-hover)] text-xs font-semibold text-white transition duration-200 cursor-pointer">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </section>

        {/* ORIGIN OF GEM */}
        <section className="mt-14 sm:mt-10">
          <h2 className="text-[20px] font-bold font-['Inter']">Origin of GEM</h2>
          <div className="mt-4 rounded-[24px] bg-[var(--bg-2)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[var(--border)]">
            <p className="text-[16px] sm:text-[15px] leading-[1.7] text-[var(--muted)] font-['Inter']">
              Gem is a diamond born from the light and energy of the Solana blockchain. He is not just a mineral, but a digital being — the embodiment of resilience, purity, and the strength of community.
            </p>
            <p className="mt-4 text-[16px] sm:text-[15px] leading-[1.7] text-[var(--muted)] font-['Inter']">
              His form is a crystal glowing with soft blue-violet light, reflecting the balance between stability and innovation. Gem radiates powerful strength and boundless energy that fuels the ecosystem and unlocks new possibilities for its participants.
            </p>
            <p className="mt-4 text-[16px] sm:text-[15px] leading-[1.7] text-[var(--muted)] font-['Inter']">
              Created in the metaverse, Gem represents the idea that “diamonds are forever.” His mission is to unite people in a decentralized ecosystem and provide them with a reliable tool for growth and prosperity.
            </p>
            <p className="mt-4 text-[16px] sm:text-[15px] leading-[1.7] text-[var(--muted)] font-['Inter']">
              Gem is not just a coin. He is a character with a story and a soul. He embodies trust, honesty, and rarity. Every token holder becomes part of a legend where the diamond shines brightest in the hands of the community.
            </p>
          </div>
        </section>

        {/* ANIMATION */}
        <section className="mt-14 sm:mt-10">
          <h2 className="text-[20px] font-bold font-['Inter']">Animation</h2>
          <div className="mt-4 relative rounded-[24px] bg-[var(--bg-2)] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[var(--border)] aspect-video flex items-center justify-center">
            <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover">
              <source src="./assets/anim.mp4" type="video/mp4" />
            </video>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <button onClick={()=>{ const v=videoRef.current; if(!v) return; if(v.paused){v.play(); setPlaying(true);} else {v.pause(); setPlaying(false);} }} className="h-10 w-10 rounded-full bg-[var(--pause)] flex items-center justify-center text-white font-bold cursor-pointer">{playing ? 'II' : '▶'}</button>
              <button onClick={()=>{ setIsMuted(m=>!m); const v=videoRef.current; if(v && !v.paused) v.play(); }} className="h-10 w-10 rounded-full bg-[var(--button)] hover:bg-[var(--button-hover)] flex items-center justify-center text-white cursor-pointer">{isMuted?'🔇':'🔊'}</button>
            </div>
          </div>
        </section>

        {/* MEMES */}
        <section className="mt-14 sm:mt-10">
          <h2 className="text-[20px] font-bold font-['Inter']">Memes</h2>
          <div className="mt-4 grid grid-cols-4 sm:grid-cols-2 gap-6">
            {[1,2,3,4].map((n)=>(
              <div key={n} className="rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[var(--border)] aspect-square">
                <img src={`./assets/meme-${n}.png`} alt={`meme-${n}`} className="w-full h-full object-cover" style={{filter:"brightness(.55) saturate(0)", transition:"filter .2s ease"}} onMouseOver={e=>e.currentTarget.style.filter="none"} onMouseOut={e=>e.currentTarget.style.filter="brightness(.55) saturate(0)"} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
