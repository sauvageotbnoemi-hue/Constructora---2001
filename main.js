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

  /* ---------- Visor del proceso: 8 pasos con burbuja 3D ---------- */
  var GICONS={
    lupa:'<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>',
    monedas:'<svg viewBox="0 0 24 24"><ellipse cx="12" cy="6.5" rx="7" ry="3"/><path d="M5 6.5v5.5c0 1.66 3.13 3 7 3s7-1.34 7-3V6.5"/><path d="M5 12v5.5c0 1.66 3.13 3 7 3s7-1.34 7-3V12"/></svg>',
    sello:'<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="M9.3 9l1.9 1.9L15 7.2"/><path d="M8.6 14.3L7 21l5-2.2L17 21l-1.6-6.7"/></svg>',
    megafono:'<svg viewBox="0 0 24 24"><path d="M4 9.5v5h3.2L15 19V5L7.2 9.5H4z"/><path d="M18 9.2a4.5 4.5 0 0 1 0 5.6"/></svg>',
    ojo:'<svg viewBox="0 0 24 24"><path d="M2 12s3.8-6.2 10-6.2S22 12 22 12s-3.8 6.2-10 6.2S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/></svg>',
    cohete:'<svg viewBox="0 0 24 24"><path d="M12 2.5c3 2.2 4.6 5.3 4.6 9.2L15 19H9l-1.6-7.3C7.4 7.8 9 4.7 12 2.5z"/><circle cx="12" cy="9.5" r="1.7"/><path d="M9 18l-2.3 3.5M15 18l2.3 3.5"/></svg>',
    llave:'<svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="4.2"/><path d="M12 12h9M18 12v3.2M21 12v4"/></svg>',
    escritura:'<svg viewBox="0 0 24 24"><path d="M7 3.2h6.5L18 7.6V13"/><path d="M13.5 3.2v4.4H18"/><path d="M5.5 20.8l8.2-8.2 2.4 2.4-8.2 8.2H5.5z"/></svg>'
  };
  function initGrow(){
    var g=document.querySelector("[data-grow]"); if(!g) return;
    var img=g.querySelector("[data-grow-img]"), fill=g.querySelector("[data-grow-fill]"),
        titleEl=g.querySelector("[data-grow-title]"), textEl=g.querySelector("[data-grow-text]"),
        idxEl=g.querySelector("[data-grow-idx]"), badgeEl=g.querySelector("[data-grow-idx-badge]"),
        orb=g.querySelector("[data-grow-orb]"), iconEl=g.querySelector("[data-grow-icon]");
    var nodes=[].slice.call(g.querySelectorAll(".gnode"));
    var STEPS=[
      {gray:1,   color:"#1E3A2E", icon:"lupa",      badge:"Estudiamos",            title:"Estudiamos", text:"Miramos su terreno y vemos qué se puede hacer, antes de gastar un peso."},
      {gray:.88, color:"#A9832B", icon:"monedas",   badge:"Compramos o invertimos",title:"Compramos o invertimos", text:"Le compramos ahora, o invertimos y desarrollamos su terreno junto a usted."},
      {gray:.74, color:"#ff690f", icon:"sello",     badge:"Aprobamos",             title:"Aprobamos", text:"Conseguimos los permisos y las aprobaciones. Los trámites son nuestros."},
      {gray:.6,  color:"#687021", icon:"megafono",  badge:"Damos a conocer",       title:"Damos a conocer", text:"Armamos el plan de venta para llegar a quienes sí compran."},
      {gray:.45, color:"#2a6f57", icon:"ojo",       badge:"Controlamos",           title:"Controlamos", text:"Supervisamos la obra y los plazos de principio a fin."},
      {gray:.3,  color:"#c24700", icon:"cohete",    badge:"Ponemos en marcha",     title:"Ponemos en marcha", text:"Arrancan las obras, y no empiezan hasta que la inversión está asegurada."},
      {gray:.15, color:"#35543f", icon:"llave",     badge:"Entregamos",            title:"Entregamos", text:"Su terreno queda desarrollado: servicios y urbanización listos."},
      {gray:0,   color:"#A9832B", icon:"escritura", badge:"Escrituramos",          title:"Escrituramos", text:"Usted firma la escritura, con lo legal y bancario resuelto."}
    ];
    var cur=0;
    function set(i){
      i=Math.max(0,Math.min(STEPS.length-1,i)); cur=i; var s=STEPS[i];
      nodes.forEach(function(n,idx){ n.classList.toggle("is-active",idx===i); n.classList.toggle("is-done",idx<i); });
      if(img) img.style.filter="grayscale("+s.gray+") brightness("+(0.72+0.18*(1-s.gray)).toFixed(2)+")";
      if(fill) fill.style.width=(i/(STEPS.length-1)*100)+"%";
      if(orb){ orb.style.setProperty("--orb", s.color); orb.classList.remove("is-pop"); void orb.offsetWidth; orb.classList.add("is-pop"); }
      if(iconEl){ iconEl.innerHTML=GICONS[s.icon]||""; iconEl.style.animation="none"; void iconEl.offsetWidth; iconEl.style.animation=""; }
      if(titleEl) titleEl.textContent=s.title;
      if(textEl) textEl.textContent=s.text;
      if(idxEl) idxEl.textContent=(i+1);
      if(badgeEl) badgeEl.textContent=s.badge;
    }
    nodes.forEach(function(n){ n.addEventListener("click", function(){ g.classList.add("is-touched"); set(parseInt(n.getAttribute("data-grow-node"),10)); }); });
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
