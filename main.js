/* ============================================================
   CONSTRUCTORA 2001 — main.js (v5)  IIFE, sin dependencias
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
    var els=document.querySelectorAll("[data-reveal],[data-ruta]");
    if(!("IntersectionObserver" in window)){ els.forEach(function(e){e.classList.add("is-in")}); return; }
    var io=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("is-in"); io.unobserve(e.target);} }); }, {threshold:0.05, rootMargin:"0px 0px -8% 0px"});
    els.forEach(function(el){ io.observe(el); });
    setTimeout(function(){ els.forEach(function(el){ if(el.getBoundingClientRect().top<innerHeight) el.classList.add("is-in"); }); },6000);
  }

  /* ---------- Dos rutas: desplegar cada una ---------- */
  function initRutas(){
    document.querySelectorAll("[data-ruta-toggle]").forEach(function(btn){
      btn.addEventListener("click", function(){
        var card=btn.closest("[data-ruta]"); if(!card) return;
        var open=card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open?"true":"false");
        btn.firstChild.textContent = open ? "Ocultar " : "Ver cómo funciona ";
      });
    });
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

  /* ---------- Mini-test ¿cuál ruta? ---------- */
  function initQuiz(){
    var q=document.querySelector("[data-quiz]"); if(!q) return;
    var steps=q.querySelectorAll("[data-quiz-step]");
    var result=q.querySelector("[data-quiz-result]");
    var intro=q.querySelector(".quiz__intro");
    var answers=[];
    function show(i){ steps.forEach(function(s,idx){ s.hidden=idx!==i; }); result.hidden=true; if(intro) intro.style.display=""; }
    function finish(){
      steps.forEach(function(s){ s.hidden=true; }); if(intro) intro.style.display="none"; result.hidden=false;
      var valor=answers.filter(function(a){ return a==="valor"; }).length;
      var name=q.querySelector("[data-quiz-name]"), note=q.querySelector("[data-quiz-note]");
      if(valor>=2){ name.textContent="Vivienda social"; note.textContent="Su disposición a proyectar a mayor plazo permite capturar la máxima plusvalía: desarrollamos el proyecto y el Estado adquiere el terreno ya aprobado."; }
      else { name.textContent="Vender subdividiendo"; note.textContent="Su prioridad de liquidez apunta a la vía más ágil: subdividimos y valorizamos su terreno para una venta más rápida y rentable."; }
    }
    q.querySelectorAll(".quiz__opt").forEach(function(btn){
      btn.addEventListener("click", function(){
        var step=btn.closest("[data-quiz-step]"); var idx=parseInt(step.getAttribute("data-quiz-step"),10);
        answers[idx]=btn.getAttribute("data-v");
        if(idx+1<steps.length) show(idx+1); else finish();
      });
    });
    var again=q.querySelector("[data-quiz-again]");
    if(again) again.addEventListener("click", function(){ answers=[]; show(0); });
  }

  /* ---------- Antes / Después ---------- */
  function initBA(){
    document.querySelectorAll("[data-ba]").forEach(function(ba){
      var frame=ba.querySelector(".ba__frame"); if(!frame) return;
      var split=0.5, dragging=false;
      function apply(){ frame.style.setProperty("--split",(split*100)+"%"); }
      function set(v){ split=Math.max(0.04,Math.min(0.96,v)); apply(); }
      function frac(x){ var r=frame.getBoundingClientRect(); return (x-r.left)/r.width; }
      function down(e){ dragging=true; ba.classList.add("is-touched"); move(e); }
      function move(e){ if(!dragging) return; var x=(e.touches?e.touches[0].clientX:e.clientX); set(frac(x)); }
      function up(){ dragging=false; }
      apply();
      frame.addEventListener("pointerdown", down);
      addEventListener("pointermove", move); addEventListener("pointerup", up);
    });
  }

  /* ---------- Separador que se dibuja ---------- */
  function initSep(){
    document.querySelectorAll("[data-sep]").forEach(function(sep){
      var paths=sep.querySelectorAll(".sep-line path");
      paths.forEach(function(p){ var l=0; try{ l=p.getTotalLength(); }catch(e){ l=1200; } p.style.strokeDasharray=l; p.style.strokeDashoffset=l; p.style.transitionDelay=(Math.random()*0.35).toFixed(2)+"s"; });
      if(!("IntersectionObserver" in window)){ paths.forEach(function(p){ p.style.strokeDashoffset=0; }); return; }
      var io=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ e.target.querySelectorAll(".sep-line path").forEach(function(p){ p.style.strokeDashoffset=0; }); io.unobserve(e.target); } }); }, {threshold:0.3});
      io.observe(sep);
    });
  }

  /* ---------- Calculadora ---------- */
  function initCalc(){
    var c=document.querySelector("[data-calc]"); if(!c) return;
    var range=c.querySelector("[data-calc-range]"); if(!range) return;
    var out=c.querySelector("[data-calc-out]"), hoy=c.querySelector("[data-calc-hoy]"), gap=c.querySelector("[data-calc-gap]"), dev=c.querySelector("[data-calc-dev]");
    function m(n){ return "$"+n+"M"; }
    function upd(){
      var v=parseInt(range.value,10);
      var lo=Math.round(v*1.8), hi=Math.round(v*2.5);
      if(out) out.textContent="$"+v+" millones";
      if(hoy) hoy.textContent=m(v);
      if(gap) gap.textContent="+"+m(lo-v)+" a +"+m(hi-v);
      if(dev) dev.textContent=m(lo)+" a "+m(hi);
    }
    range.addEventListener("input", upd); upd();
  }

  /* ---------- Hotspots (puntos de valor) ---------- */
  var HS_ICONS={
    agua:'<path d="M12 3c3 4 5 6.5 5 9a5 5 0 0 1-10 0c0-2.5 2-5 5-9z"/>',
    luz:'<path d="M13 3 6 13h5l-1 8 8-11h-5l1-7z"/>',
    sub:'<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 12h16M12 4v16"/>',
    permiso:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 13l2 2 4-4"/>',
    acceso:'<path d="M5 20 10 4M19 20 14 4M9 12h6M8 16h8"/>'
  };
  function hsvg(n){ return '<svg viewBox="0 0 24 24">'+(HS_ICONS[n]||"")+'</svg>'; }
  var HS=[
    {icon:"agua",title:"Agua",text:"Derechos de agua y factibilidad. Sin agua no se puede subdividir ni construir."},
    {icon:"luz",title:"Luz",text:"Factibilidad y conexión de la red eléctrica hasta el terreno."},
    {icon:"sub",title:"Subdivisión",text:"Planos, SAG e inscripción en el Conservador. Cada lote con su propio rol."},
    {icon:"permiso",title:"Permisos",text:"Certificado de uso de suelo e informes al día en la Municipalidad."},
    {icon:"acceso",title:"Accesos",text:"Caminos y servidumbres de paso legalizados para cada lote."}
  ];
  function initVcards(){
    var host=document.querySelector("[data-vcards]"); if(!host || host.children.length) return;
    HS.forEach(function(p,i){
      var card=document.createElement("div"); card.className="vcard"+(i===0?" is-open":"");
      card.innerHTML=
        '<button class="vcard__toggle" type="button" aria-expanded="'+(i===0?"true":"false")+'">'+
          '<span class="vcard__top"><span class="vcard__ic">'+hsvg(p.icon)+'</span><span class="vcard__chev" aria-hidden="true">+</span></span>'+
          '<span class="vcard__title">'+p.title+'</span>'+
          '<span class="vcard__txt">'+p.text+'</span>'+
        '</button>';
      var btn=card.querySelector(".vcard__toggle");
      btn.addEventListener("click", function(){
        var open=card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open?"true":"false");
      });
      host.appendChild(card);
    });
  }

  /* ---------- Carrusel Ruta de valor ---------- */
  function initGrow(){
    var g=document.querySelector("[data-grow]"); if(!g) return;
    var img=g.querySelector("[data-grow-img]"), fill=g.querySelector("[data-grow-fill]"),
        numEl=g.querySelector("[data-grow-num]"), titleEl=g.querySelector("[data-grow-title]"), textEl=g.querySelector("[data-grow-text]"),
        idxEl=g.querySelector("[data-grow-idx]"), badgeEl=g.querySelector("[data-grow-idx-badge]");
    var nodes=[].slice.call(g.querySelectorAll(".gnode")), layers=[].slice.call(g.querySelectorAll(".glayer"));
    var STEPS=[
      {v:50, gray:1,  badge:"En crudo",     title:"Terreno en crudo", text:"Hoy su terreno se vende como una hoja en blanco: sin accesos, sin servicios y sin papeles al día. Por eso le ofrecen tan poco."},
      {v:62, gray:.75,badge:"Accesos",      title:"Accesos y caminos", text:"Definimos y legalizamos los caminos y las servidumbres de paso. Cada lote necesita por dónde entrar y salir."},
      {v:78, gray:.5, badge:"Agua y luz",   title:"Agua y luz", text:"Gestionamos las factibilidades de agua y electricidad. Sin servicios no se puede construir —ni vender bien."},
      {v:95, gray:.22,badge:"Subdivisión",  title:"Subdivisión aprobada", text:"Subdividimos ante el SAG y el Conservador. Su paño grande pasa a ser varios lotes, cada uno con su propio rol."},
      {v:110,gray:0,  badge:"Listo",        title:"Listo para vender", text:"Con todo aprobado, su terreno vale cerca del doble que en crudo —y se vende mucho más rápido."}
    ];
    var cur=0, raf;
    function fmt(n){ return "$"+n+"M"; }
    function tween(target, animate){
      if(!numEl) return;
      if(animate===false || reduced){ numEl.textContent=fmt(target); return; }
      cancelAnimationFrame(raf);
      var start=parseInt((numEl.textContent||"$0M").replace(/\D/g,""),10)||0, t0=performance.now(), dur=520;
      (function stp(t){ var p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);
        numEl.textContent=fmt(Math.round(start+(target-start)*e)); if(p<1) raf=requestAnimationFrame(stp); })(performance.now());
    }
    function set(i, animate){
      i=Math.max(0,Math.min(STEPS.length-1,i)); cur=i; var s=STEPS[i];
      nodes.forEach(function(n,idx){ n.classList.toggle("is-active",idx===i); n.classList.toggle("is-done",idx<i); });
      layers.forEach(function(l){ l.classList.toggle("is-on", parseInt(l.getAttribute("data-layer"),10)<=i); });
      if(img) img.style.filter="grayscale("+s.gray+") brightness("+(0.9+0.1*(1-s.gray)).toFixed(2)+")";
      if(fill) fill.style.width=(i/(STEPS.length-1)*100)+"%";
      if(titleEl) titleEl.textContent=s.title;
      if(textEl) textEl.textContent=s.text;
      if(idxEl) idxEl.textContent=(i+1);
      if(badgeEl) badgeEl.textContent=s.badge;
      tween(s.v, animate);
    }
    nodes.forEach(function(n){ n.addEventListener("click", function(){ g.classList.add("is-touched"); set(parseInt(n.getAttribute("data-grow-node"),10)); }); });
    g.addEventListener("keydown", function(e){
      if(e.key==="ArrowRight"){ e.preventDefault(); g.classList.add("is-touched"); set(cur+1); }
      else if(e.key==="ArrowLeft"){ e.preventDefault(); g.classList.add("is-touched"); set(cur-1); }
    });
    set(0,false);
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

  /* ---------- Subrayado de la frase-gancho que se dibuja ---------- */
  function initMarkReveal(){
    var m=document.querySelector(".mk"); if(!m) return;
    if(reduced || !("IntersectionObserver" in window)){ m.classList.add("is-drawn"); return; }
    var io=new IntersectionObserver(function(en){ en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add("is-drawn"); io.unobserve(e.target); } }); }, {threshold:.6});
    io.observe(m);
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
    safe(initRutas,"rutas"); safe(initQuiz,"quiz"); safe(initGrow,"grow"); safe(initCalc,"calc"); safe(initVcards,"vcards");
    safe(initAnchors,"anchors"); safe(initForm,"form");
    safe(initHeroParallax,"heroParallax"); safe(initMagnetic,"magnetic"); safe(initMarkReveal,"markReveal"); safe(initTilt,"tilt");
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();
})();
