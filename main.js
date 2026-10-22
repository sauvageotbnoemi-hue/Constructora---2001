/* ============================================================
   CONSTRUCTORA 2001 — main.js (v6 · copy v3)  IIFE, sin dependencias
   ============================================================ */
(function () {
  "use strict";
  function safe(fn, name){ try{ fn(); }catch(e){ console.warn("["+name+"]", e); } }
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initProgress(){
    var bar=document.querySelector("[data-progress]"); if(!bar) return;
    function upd(){ var h=document.documentElement.scrollHeight-innerHeight; bar.style.width=(h>0?(scrollY/h*100):0)+"%"; }
    addEventListener("scroll",upd,{passive:true}); upd();
  }

  function initNav(){
    var nav=document.querySelector("[data-nav]");
    var burger=document.querySelector("[data-burger]");
    var menu=document.querySelector("[data-menu]");
    if(nav){ var o=function(){ nav.classList.toggle("is-stuck", scrollY>40); }; addEventListener("scroll",o,{passive:true}); o(); }
    if(!burger||!menu) return;
    function toggle(open){
      var isOpen=(open===undefined)?!menu.classList.contains("is-open"):open;
      menu.classList.toggle("is-open",isOpen);
      burger.setAttribute("aria-expanded",isOpen?"true":"false");
      document.body.classList.toggle("no-scroll",isOpen);
    }
    burger.addEventListener("click",function(){ toggle(); });
    menu.querySelectorAll("a").forEach(function(a){ a.addEventListener("click",function(){ toggle(false); }); });
  }

  function initReveals(){
    var els=document.querySelectorAll("[data-reveal]");
    if(!("IntersectionObserver" in window)){ els.forEach(function(e){e.classList.add("is-in")}); return; }
    var io=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target);} }); }, {threshold:0.05, rootMargin:"0px 0px -8% 0px"});
    els.forEach(function(el){ io.observe(el); });
    setTimeout(function(){ els.forEach(function(el){ if(el.getBoundingClientRect().top<innerHeight) el.classList.add("is-in"); }); },6000);
  }

  function initAnchors(){
    document.addEventListener("click", function(e){
      var a=e.target.closest('a[href^="#"]'); if(!a) return;
      var id=a.getAttribute("href"); if(!id||id==="#") return;
      var el=document.querySelector(id); if(!el) return;
      e.preventDefault();
      scrollTo({ top: el.getBoundingClientRect().top+scrollY-70, behavior: reduced?"auto":"smooth" });
    });
  }

  /* ---------- Parallax del hero al mover el cursor ---------- */
  function initHeroParallax(){
    if(reduced || matchMedia("(hover:none)").matches) return;
    var hero=document.querySelector(".hero"); if(!hero) return;
    var img=hero.querySelector(".hero__bg img"), inner=hero.querySelector(".hero__inner");
    if(img) img.style.transform="scale(1.05)";
    var tx=0,ty=0,cx=0,cy=0,raf=null;
    function loop(){
      cx+=(tx-cx)*.07; cy+=(ty-cy)*.07;
      if(img) img.style.transform="scale(1.05) translate("+(cx*-16).toFixed(2)+"px,"+(cy*-11).toFixed(2)+"px)";
      if(inner) inner.style.transform="translate("+(cx*11).toFixed(2)+"px,"+(cy*7).toFixed(2)+"px)";
      if(Math.abs(tx-cx)>.0005||Math.abs(ty-cy)>.0005){ raf=requestAnimationFrame(loop); } else { raf=null; }
    }
    hero.addEventListener("mousemove", function(e){
      var r=hero.getBoundingClientRect();
      tx=(e.clientX-r.left)/r.width-.5; ty=(e.clientY-r.top)/r.height-.5;
      if(!raf) raf=requestAnimationFrame(loop);
    });
    hero.addEventListener("mouseleave", function(){ tx=0; ty=0; if(!raf) raf=requestAnimationFrame(loop); });
  }

  /* ---------- Botones magnéticos ---------- */
  function initMagnetic(){
    if(reduced || matchMedia("(hover:none)").matches) return;
    document.querySelectorAll(".btn--primary").forEach(function(el){
      el.addEventListener("mousemove", function(e){
        var r=el.getBoundingClientRect();
        el.style.transform="translate("+((e.clientX-r.left-r.width/2)*.18).toFixed(1)+"px,"+((e.clientY-r.top-r.height/2)*.3).toFixed(1)+"px)";
      });
      el.addEventListener("mouseleave", function(){ el.style.transform=""; });
    });
  }

  /* ---------- Subrayado de frases-gancho que se dibujan ---------- */
  function initMarkReveal(){
    var marks=[].slice.call(document.querySelectorAll(".mk")); if(!marks.length) return;
    if(reduced || !("IntersectionObserver" in window)){ marks.forEach(function(m){ m.classList.add("is-drawn"); }); return; }
    var io=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("is-drawn"); io.unobserve(e.target); } }); }, {threshold:.6});
    marks.forEach(function(m){ io.observe(m); });
  }

  /* ---------- Visor del proceso: oruga curva + imagen 3D por paso ---------- */
  function initGrow(){
    var g=document.querySelector("[data-grow]"); if(!g) return;
    var titleEl=g.querySelector("[data-grow-title]"), textEl=g.querySelector("[data-grow-text]"),
        idxEl=g.querySelector("[data-grow-idx]"), badgeEl=g.querySelector("[data-grow-idx-badge]"),
        emojiEl=g.querySelector("[data-grow-emoji]"), artEl=g.querySelector(".scene3d__art"),
        glowEl=g.querySelector("[data-grow-glow]"), cater=g.querySelector("[data-cater]");
    if(!cater) return;
    var STEPS=[
      {emoji:"🔍", color:"#1E3A2E", label:"Estudiamos",   badge:"Estudiamos",            title:"Estudiamos", text:"Miramos su terreno y vemos qué se puede hacer, antes de gastar un peso."},
      {emoji:"💰", color:"#A9832B", label:"Invertimos",   badge:"Compramos o invertimos",title:"Compramos o invertimos", text:"Le compramos ahora, o invertimos y desarrollamos su terreno junto a usted."},
      {emoji:"📜", color:"#ff690f", label:"Aprobamos",    badge:"Aprobamos",             title:"Aprobamos", text:"Conseguimos los permisos y las aprobaciones. Los trámites son nuestros."},
      {emoji:"📣", color:"#687021", label:"Difundimos",   badge:"Damos a conocer",       title:"Damos a conocer", text:"Armamos el plan de venta para llegar a quienes sí compran."},
      {emoji:"📋", color:"#2a6f57", label:"Controlamos",  badge:"Controlamos",           title:"Controlamos", text:"Supervisamos la obra y los plazos de principio a fin."},
      {emoji:"🏗️", color:"#c24700", label:"En marcha",    badge:"Ponemos en marcha",     title:"Ponemos en marcha", text:"Arrancan las obras, y no empiezan hasta que la inversión está asegurada."},
      {emoji:"🔑", color:"#35543f", label:"Entregamos",   badge:"Entregamos",            title:"Entregamos", text:"Su terreno queda desarrollado: servicios y urbanización listos."},
      {emoji:"📝", color:"#A9832B", label:"Escrituramos", badge:"Escrituramos",          title:"Escrituramos", text:"Usted firma la escritura, con lo legal y bancario resuelto."}
    ];
    var N=STEPS.length, W=1000, H=190, x0=64, x1=936, cur=0;
    var pts=STEPS.map(function(s,i){ return {x:x0+(x1-x0)*i/(N-1), y:92+40*Math.sin(i*Math.PI/2)}; });
    var span=(x1-x0)/(N-1), ns="http://www.w3.org/2000/svg";
    var d="M"+pts[0].x+","+pts[0].y;
    for(var k=1;k<N;k++){ var p0=pts[k-1],p1=pts[k]; d+=" C"+(p0.x+span/2)+","+p0.y+" "+(p1.x-span/2)+","+p1.y+" "+p1.x+","+p1.y; }
    var svg=document.createElementNS(ns,"svg"); svg.setAttribute("viewBox","0 0 "+W+" "+H); svg.setAttribute("class","cater__svg");
    var base=document.createElementNS(ns,"path"); base.setAttribute("d",d); base.setAttribute("class","cater__base");
    var prog=document.createElementNS(ns,"path"); prog.setAttribute("d",d); prog.setAttribute("class","cater__prog");
    svg.appendChild(base); svg.appendChild(prog); cater.appendChild(svg);
    var L=prog.getTotalLength(); prog.style.strokeDasharray=L; prog.style.strokeDashoffset=L;
    var nodes=STEPS.map(function(s,i){
      var b=document.createElement("button"); b.type="button"; b.className="cbead";
      b.setAttribute("aria-label","Paso "+(i+1)+": "+s.badge);
      b.style.left=(pts[i].x/W*100)+"%"; b.style.top=(pts[i].y/H*100)+"%";
      b.innerHTML='<span class="cbead__dot"></span><span class="cbead__lbl">'+s.label+'</span>';
      b.addEventListener("click", function(){ g.classList.add("is-touched"); set(i); });
      cater.appendChild(b); return b;
    });
    function set(i){
      i=Math.max(0,Math.min(N-1,i)); cur=i; var s=STEPS[i];
      nodes.forEach(function(n,idx){ n.classList.toggle("is-active",idx===i); n.classList.toggle("is-done",idx<i); });
      prog.style.strokeDashoffset = L*(1 - i/(N-1));
      if(glowEl) glowEl.style.setProperty("--c", s.color);
      if(emojiEl){ emojiEl.textContent=s.emoji; emojiEl.style.animation="none"; void emojiEl.offsetWidth; emojiEl.style.animation=""; }
      if(titleEl) titleEl.textContent=s.title;
      if(textEl) textEl.textContent=s.text;
      if(idxEl) idxEl.textContent=(i+1);
      if(badgeEl) badgeEl.textContent=s.badge;
    }
    g.setAttribute("tabindex","0");
    g.addEventListener("keydown", function(e){
      if(e.key==="ArrowRight"){ e.preventDefault(); g.classList.add("is-touched"); set(cur+1); }
      else if(e.key==="ArrowLeft"){ e.preventDefault(); g.classList.add("is-touched"); set(cur-1); }
    });
    set(0);
  }

  /* ---------- Tilt 3D al mover el cursor ---------- */
  function initTilt(){
    if(reduced || matchMedia("(hover:none)").matches) return;
    document.querySelectorAll("[data-tilt]").forEach(function(el){
      var raf=null,tx=0,ty=0,cx=0,cy=0;
      function loop(){
        cx+=(tx-cx)*.12; cy+=(ty-cy)*.12;
        el.style.transform="perspective(1000px) rotateX("+(cy*-4.5).toFixed(2)+"deg) rotateY("+(cx*5.5).toFixed(2)+"deg)";
        if(Math.abs(tx-cx)>.001||Math.abs(ty-cy)>.001) raf=requestAnimationFrame(loop); else raf=null;
      }
      el.addEventListener("mousemove", function(e){
        var r=el.getBoundingClientRect();
        tx=(e.clientX-r.left)/r.width-.5; ty=(e.clientY-r.top)/r.height-.5;
        if(!raf) raf=requestAnimationFrame(loop);
      });
      el.addEventListener("mouseleave", function(){ tx=0; ty=0; if(!raf) raf=requestAnimationFrame(loop); });
    });
  }

  /* ---------- Conteo animado de los números del ejemplo ---------- */
  function initCountUp(){
    var host=document.querySelector(".formula"); if(!host) return;
    var els=[].slice.call(host.querySelectorAll("[data-count]")); if(!els.length) return;
    function dots(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."); }
    function render(el,v){ el.textContent=(el.getAttribute("data-prefix")||"")+dots(v)+(el.getAttribute("data-suffix")||""); }
    function run(){
      els.forEach(function(el){
        var target=parseInt(el.getAttribute("data-count"),10)||0;
        if(reduced){ render(el,target); return; }
        var t0=performance.now(), dur=1000;
        (function stp(t){ var p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3); render(el,Math.round(target*e)); if(p<1) requestAnimationFrame(stp); })(performance.now());
      });
    }
    if(!("IntersectionObserver" in window)){ run(); return; }
    var io=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ run(); io.disconnect(); } }); }, {threshold:.4});
    io.observe(host);
  }

  /* ---------- Botón flotante "Hablemos" ---------- */
  function initFab(){
    var f=document.querySelector("[data-fab]"); if(!f) return;
    function upd(){ f.classList.toggle("is-show", scrollY>innerHeight*0.7); }
    addEventListener("scroll",upd,{passive:true}); upd();
  }

  function initForm(){
    var form=document.querySelector("[data-form]"); if(!form) return;
    form.addEventListener("submit", function(e){
      e.preventDefault(); if(!form.reportValidity()) return;
      var ok=form.querySelector("[data-form-ok]"), btn=form.querySelector('button[type="submit"]');
      if(btn){ btn.textContent="Enviado ✓"; btn.disabled=true; btn.style.opacity=".7"; }
      if(ok) ok.hidden=false;
    });
  }

  function boot(){
    safe(initProgress,"progress"); safe(initNav,"nav"); safe(initReveals,"reveals");
    safe(initAnchors,"anchors"); safe(initForm,"form"); safe(initGrow,"grow"); safe(initCountUp,"countUp"); safe(initFab,"fab");
    safe(initHeroParallax,"heroParallax"); safe(initMagnetic,"magnetic"); safe(initMarkReveal,"markReveal"); safe(initTilt,"tilt");
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();
})();
