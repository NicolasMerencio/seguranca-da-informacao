(function () {
  'use strict';

  /* ------------------ UTIL ------------------ */
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const throttle = (fn, wait = 120) => {
    let last = 0, scheduled = null;
    return function (...args) {
      const now = Date.now();
      const remaining = wait - (now - last);
      if (remaining <= 0) { if (scheduled) cancelAnimationFrame(scheduled); scheduled = null; last = now; fn.apply(this, args); }
      else if (!scheduled) scheduled = requestAnimationFrame(() => { last = Date.now(); scheduled = null; fn.apply(this, args); });
    };
  };

  const debounce = (fn, wait = 120) => { let t; return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); }; };

  /* ------------------ ELEMENTOS ------------------ */
  const header = $('header');
  const main = $('main') || document.body;
  const desktopNavList = $('#navList');
  const backToTopBtn = $('#backToTop');
  const canvasBg = $('#backgroundParticles');
  const canvasVideo = $('#particles');
  let navToggle = $('.nav-toggle');
  let mobileNav = $('.mobile-nav');

  /* ------------------ ESTADO ------------------ */
  let headerHeight = 0;
  let lastScrollY = window.scrollY || 0;

  /* ------------------ FUNÇÕES GERAIS ------------------ */
  function updateHeaderHeight() {
    if (!header) return;
    const h = Math.ceil(header.getBoundingClientRect().height);
    headerHeight = h;
    document.documentElement.style.setProperty('--header-height', `${h}px`);
    if (main) main.style.paddingTop = `var(--header-height, ${h}px)`;
  }

  function handleHeaderOnScroll() {
    if (!header) return;
    const currentY = window.scrollY || 0;

    // scrolled class
    if (currentY > 20) header.classList.add('scrolled'); else header.classList.remove('scrolled');

    // hide/show
    const delta = currentY - lastScrollY;
    if (Math.abs(delta) > 12) {
      if (delta > 0 && currentY > headerHeight + 60) header.classList.add('hidden');
      else header.classList.remove('hidden');
      lastScrollY = currentY;
    }

    // back to top
    if (backToTopBtn) currentY > 320 ? backToTopBtn.classList.add('visible') : backToTopBtn.classList.remove('visible');
  }

  /* ------------------ SMOOTH SCROLL ------------------ */
  function initSmoothScroll() {
    document.addEventListener('click', (ev) => {
      const a = ev.target.closest && ev.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      ev.preventDefault();
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 8);
      if (isReducedMotion) window.scrollTo(0, top);
      else window.scrollTo({ top, behavior: 'smooth' });
      if (document.body.classList.contains('nav-open')) closeMobileNav();
      target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
    });
  }

  /* ------------------ FADE-UP ------------------ */
  function initFadeUp() {
    const els = $$('.fade-up');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); } });
    }, { threshold: 0.18 });
    els.forEach(el => observer.observe(el));
  }

  /* ------------------ BACK TO TOP ------------------ */
  function initBackToTop() {
    if (!backToTopBtn) return;
    backToTopBtn.addEventListener('click', () => {
      isReducedMotion ? window.scrollTo(0,0) : window.scrollTo({top:0, behavior:'smooth'});
      main.setAttribute('tabindex','-1'); main.focus({preventScroll:true});
    });
  }

  /* ------------------ MOBILE NAV ------------------ */
  function createMobileNav() {
    const headerInner = $('.header-inner');
    if (!headerInner) return;

    // toggle
    if (!navToggle) {
      navToggle = document.createElement('button');
      navToggle.className = 'nav-toggle';
      navToggle.setAttribute('aria-label','Abrir menu');
      navToggle.setAttribute('aria-expanded','false');
      navToggle.innerHTML = `<svg width="22" height="14"><rect width="22" height="2"/><rect y="6" width="22" height="2"/><rect y="12" width="22" height="2"/></svg>`;
      headerInner.insertBefore(navToggle, $('nav')||null);
    }

    // mobile nav overlay
    if (!mobileNav) {
      mobileNav = document.createElement('nav');
      mobileNav.className = 'mobile-nav';
      mobileNav.setAttribute('id','mobile-nav');
      const clone = desktopNavList ? desktopNavList.cloneNode(true) : document.createElement('ul');
      clone.id='mobileNavList'; mobileNav.appendChild(clone);

      const closeBtn = document.createElement('button'); closeBtn.className='close-btn'; closeBtn.innerHTML='&times;'; mobileNav.appendChild(closeBtn);
      closeBtn.addEventListener('click',()=>{closeMobileNav(); navToggle.focus();});

      mobileNav.addEventListener('click',(ev)=>{if(ev.target.closest('a')) closeMobileNav();});
      document.body.appendChild(mobileNav);
    }

    navToggle.addEventListener('click', toggleMobileNav);
  }

  function openMobileNav(){document.body.classList.add('nav-open'); navToggle.setAttribute('aria-expanded','true'); }
  function closeMobileNav(){document.body.classList.remove('nav-open'); navToggle.setAttribute('aria-expanded','false'); }
  function toggleMobileNav(){ document.body.classList.contains('nav-open') ? closeMobileNav() : openMobileNav(); }

  /* ------------------ MODO ESCURO ------------------ */
  function initDarkMode() {
    const toggle = $('#darkModeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode')?'on':'off');
    });
    if(localStorage.getItem('darkMode')==='on') document.body.classList.add('dark-mode');
  }

  /* ------------------ IDIOMAS ------------------ */
  function initLanguages() {
    const toggle = $('#langToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      document.documentElement.setAttribute('lang', document.documentElement.getAttribute('lang')==='pt'?'en':'pt');
    });
  }

  /* ------------------ PARTICULAS ------------------ */
  function initParticles(canvas) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.clientWidth, H = canvas.clientHeight, particles=[], raf;
    const deviceRatio = Math.max(1, window.devicePixelRatio||1);

    function create(){ W=canvas.clientWidth*deviceRatio; H=canvas.clientHeight*deviceRatio; canvas.width=W; canvas.height=H;
      particles=[]; const count=Math.max(12,Math.floor(W*H/30000));
      for(let i=0;i<count;i++){particles.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+0.3,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4,a:0.04+Math.random()*0.35});}}
    function draw(){ctx.clearRect(0,0,W,H);for(const p of particles){ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(160,200,200,${p.a})`;ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10;}raf=requestAnimationFrame(draw);}
    create(); draw();
    window.addEventListener('resize', debounce(()=>{cancelAnimationFrame(raf); create(); draw();},140),{passive:true});
  }

  /* ------------------ ACTIVE LINKS ------------------ */
  function setupActiveSectionObserver() {
    const sections = $$('section[id]'); if(!sections.length || !desktopNavList) return;
    const map = new Map(); $$('a', desktopNavList).forEach(a=>{ const id = a.getAttribute('href').split('#')[1]; if(id) map.set(id,a);});
    const obs = new IntersectionObserver((entries)=>{entries.forEach(e=>{const link=map.get(e.target.id); if(!link)return; if(e.isIntersecting&&e.intersectionRatio>0.35){map.forEach(l=>l.classList.remove('active')); link.classList.add('active');}else link.classList.remove('active');});},{root:null, rootMargin:`-${Math.round(headerHeight*0.25)}px 0px -40% 0px`,threshold:[0.25,0.35,0.6]});
    sections.forEach(s=>obs.observe(s));
  }

  /* ------------------ INIT ------------------ */
  function init() {
    updateHeaderHeight();
    createMobileNav();
    initSmoothScroll();
    initFadeUp();
    initBackToTop();
    initParticles(canvasBg);
    initParticles(canvasVideo);
    setupActiveSectionObserver();
    initDarkMode();
    initLanguages();

    window.addEventListener('scroll', throttle(handleHeaderOnScroll,100),{passive:true});
    window.addEventListener('resize', debounce(updateHeaderHeight,150),{passive:true});
    document.addEventListener('click', (e)=>{ if(document.body.classList.contains('nav-open') && !mobileNav.contains(e.target) && !navToggle.contains(e.target)) closeMobileNav();});
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape' && document.body.classList.contains('nav-open')) closeMobileNav(); if(e.key==='Home') window.scrollTo({top:0,behavior:isReducedMotion?'auto':'smooth'}); });
    if(backToTopBtn) backToTopBtn.setAttribute('aria-label','Voltar ao topo');
    handleHeaderOnScroll();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();

})();
