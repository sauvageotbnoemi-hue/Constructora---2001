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
    safe(initAnchors,"anchors"); safe(initForm,"form");
    safe(initHeroParallax,"heroParallax"); safe(initMagnetic,"magnetic"); safe(initMarkReveal,"markReveal");
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot);
  else boot();
})();
