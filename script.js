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
      if (remaining <= 0) {
        if (scheduled) cancelAnimationFrame(scheduled);
        scheduled = null;
        last = now;
        fn.apply(this, args);
      } else if (!scheduled) {
        scheduled = requestAnimationFrame(() => {
          last = Date.now();
          scheduled = null;
          fn.apply(this, args);
        });
      }
    };
  };

  const debounce = (fn, wait = 120) => {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  /* ------------------ ELEMENTOS ------------------ */
  const header = $('header');
  const main = $('main') || document.body;
  const desktopNavList = $('#navList');
  const backToTopBtn = $('#backToTop');
  const canvasBg = $('#backgroundParticles');
  const canvasVideo = $('#particles');
  let navToggle = $('.nav-toggle');
  let mobileNav = $('.mobile-nav');
  const videoElement = $('video');
  const videoMuteBtn = $('#videoMute');

  /* ------------------ ESTADO ------------------ */
  let headerHeight = 0;
  let lastScrollY = window.scrollY || 0;
  let currentLanguage = 'pt';

  /* ------------------ TRADUÇÕES COMPLETAS ------------------ */
  const translations = {
    pt: {
      // Títulos
      'site-title': 'Especialista de Segurança da Informação',
      'intro-title': 'O que é um Especialista de Segurança da Informação?',
      'pillars-title': 'Os 3 Pilares da Segurança da Informação',
      'career-title': 'Explorando a Carreira',
      
      // Navegação
      'nav-formacao': 'Formação e Habilidades',
      'nav-areas': 'Áreas de Atuação',
      'nav-leis': 'Leis e Proteção de Dados',
      
      // Introdução
      'intro-paragraph1': 'Um especialista em segurança da informação é, basicamente, o profissional que protege os dados e os sistemas de uma empresa contra ameaças digitais — como vírus, invasões e golpes virtuais. Ele funciona como um guarda-costas digital, garantindo que as informações importantes fiquem seguras e só possam ser acessadas por quem tem permissão.',
      'intro-paragraph2': 'Esse profissional identifica pontos fracos nos sistemas, cria barreiras de proteção — como senhas seguras, antivírus e criptografia — e monitora tudo o tempo todo para detectar qualquer atividade estranha. Além disso, ele também ensina os usuários a se protegerem, mostrando a importância de não clicar em links suspeitos ou compartilhar senhas.',
      'intro-paragraph3': 'Hoje em dia, com a tecnologia presente em quase tudo que fazemos, esse trabalho é essencial. Graças a esse especialista, conseguimos manter a privacidade, evitar prejuízos e garantir mais confiança no mundo digital — tanto para empresas quanto para pessoas comuns.',
      
      // Pilares
      'pillar1-title': 'Confidencialidade',
      'pillar1-text': 'Garante que as informações sejam acessadas somente por pessoas autorizadas. Exemplo: manter senhas seguras e evitar que dados pessoais vazem.',
      'pillar2-title': 'Integridade',
      'pillar2-text': 'Assegura que os dados não sejam alterados ou corrompidos sem permissão. Exemplo: garantir que um documento ou um sistema continue igual ao original, sem modificações indevidas.',
      'pillar3-title': 'Disponibilidade',
      'pillar3-text': 'Garante que as informações e sistemas estejam sempre acessíveis quando forem necessários. Exemplo: evitar que um site ou sistema saia do ar por falhas ou ataques.',
      
      // Cards
      'card-formacao-title': 'Formação e Habilidades',
      'card-formacao-text': 'Um especialista precisa de conhecimento técnico, habilidades práticas, competências comportamentais e entendimento das leis de proteção de dados.',
      'card-formacao-btn': 'Saiba Mais',
      'card-areas-title': 'Áreas de Atuação',
      'card-areas-text': 'O especialista pode trabalhar em empresas de tecnologia, bancos, hospitais, órgãos públicos, startups e consultorias. Há alta demanda e vagas remotas.',
      'card-areas-btn': 'Saiba Mais',
      'card-leis-title': 'Leis e Proteção de Dados',
      'card-leis-text': 'Inclui LGPD, criptografia e boas práticas de proteção de dados. Ajuda a manter a privacidade, prevenir prejuízos e garantir confiança no mundo digital.',
      'card-leis-btn': 'Saiba Mais',

      // Footer
      'footer-text': '© 2025 Especialista em Segurança da Informação. Todos os direitos reservados.',

      // Acessibilidade
      'back-to-top': 'Voltar ao topo',
      'menu-toggle': 'Abrir menu mobile',
      'close-menu': 'Fechar menu',
      'video-mute': 'Ativar/desativar som do vídeo',
      'dark-mode': 'Ativar/Desativar modo escuro',
      'language-select': 'Selecionar idioma'
    },
    en: {
      // Titles
      'site-title': 'Information Security Specialist',
      'intro-title': 'What is an Information Security Specialist?',
      'pillars-title': 'The 3 Pillars of Information Security',
      'career-title': 'Exploring the Career',
      
      // Navigation
      'nav-formacao': 'Education and Skills',
      'nav-areas': 'Areas of Expertise',
      'nav-leis': 'Laws and Data Protection',
      
      // Introduction
      'intro-paragraph1': 'An information security specialist is essentially the professional who protects a company\'s data and systems against digital threats — such as viruses, intrusions, and virtual scams. They function as a digital bodyguard, ensuring that important information remains secure and can only be accessed by authorized individuals.',
      'intro-paragraph2': 'This professional identifies weaknesses in systems, creates protective barriers — such as secure passwords, antivirus software, and encryption — and constantly monitors everything to detect any suspicious activity. Additionally, they also teach users how to protect themselves, showing the importance of not clicking on suspicious links or sharing passwords.',
      'intro-paragraph3': 'Nowadays, with technology present in almost everything we do, this work is essential. Thanks to this specialist, we can maintain privacy, avoid losses, and ensure more trust in the digital world — both for companies and ordinary people.',
      
      // Pillars
      'pillar1-title': 'Confidentiality',
      'pillar1-text': 'Ensures that information is accessed only by authorized individuals. Example: maintaining secure passwords and preventing personal data leaks.',
      'pillar2-title': 'Integrity',
      'pillar2-text': 'Ensures that data is not altered or corrupted without permission. Example: ensuring that a document or system remains unchanged from the original, without unauthorized modifications.',
      'pillar3-title': 'Availability',
      'pillar3-text': 'Ensures that information and systems are always accessible when needed. Example: preventing a website or system from going down due to failures or attacks.',
      
      // Cards
      'card-formacao-title': 'Education and Skills',
      'card-formacao-text': 'A specialist needs technical knowledge, practical skills, behavioral competencies, and understanding of data protection laws.',
      'card-formacao-btn': 'Learn More',
      'card-areas-title': 'Areas of Expertise',
      'card-areas-text': 'The specialist can work in technology companies, banks, hospitals, government agencies, startups, and consultancies. There is high demand and remote positions available.',
      'card-areas-btn': 'Learn More',
      'card-leis-title': 'Laws and Data Protection',
      'card-leis-text': 'Includes GDPR, encryption, and data protection best practices. Helps maintain privacy, prevent losses, and ensure trust in the digital world.',
      'card-leis-btn': 'Learn More',

      // Footer
      'footer-text': '© 2025 Information Security Specialist. All rights reserved.',

      // Accessibility
      'back-to-top': 'Back to top',
      'menu-toggle': 'Open mobile menu',
      'close-menu': 'Close menu',
      'video-mute': 'Toggle video sound',
      'dark-mode': 'Toggle dark mode',
      'language-select': 'Select language'
    }
  };

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
    if (currentY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // hide/show header
    const delta = currentY - lastScrollY;
    if (Math.abs(delta) > 12) {
      if (delta > 0 && currentY > headerHeight + 60) header.classList.add('hidden');
      else header.classList.remove('hidden');
      lastScrollY = currentY;
    }

    // back to top
    if (backToTopBtn) {
      if (currentY > 320) backToTopBtn.classList.add('visible');
      else backToTopBtn.classList.remove('visible');
    }
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
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ------------------ FADE-UP ------------------ */
  function initFadeUp() {
    const els = $$('.fade-up');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    els.forEach(el => observer.observe(el));
  }

  /* ------------------ BACK TO TOP ------------------ */
  function initBackToTop() {
    if (!backToTopBtn) return;
    
    // Atualizar label com tradução
    updateElementAccessibility(backToTopBtn, 'back-to-top');
    
    backToTopBtn.addEventListener('click', () => {
      if (isReducedMotion) window.scrollTo(0, 0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      main.setAttribute('tabindex', '-1');
      main.focus({ preventScroll: true });
    });
  }

  /* ------------------ MOBILE NAV ------------------ */
  function initMobileNav() {
    navToggle = $('.nav-toggle');
    mobileNav = $('.mobile-nav');
    
    if (!navToggle || !mobileNav) return;

    const closeBtn = $('.close-btn', mobileNav);

    // Atualizar labels com traduções
    updateElementAccessibility(navToggle, 'menu-toggle');
    updateElementAccessibility(closeBtn, 'close-menu');

    navToggle.addEventListener('click', toggleMobileNav);
    closeBtn.addEventListener('click', closeMobileNav);

    // Fechar menu ao clicar em um link
    const mobileLinks = $$('a', mobileNav);
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  function openMobileNav() {
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
  }

  function closeMobileNav() {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    navToggle.focus();
  }

  function toggleMobileNav() {
    if (document.body.classList.contains('nav-open')) closeMobileNav();
    else openMobileNav();
  }

  /* ------------------ MODO ESCURO ------------------ */
  function initDarkMode() {
    const toggle = $('#darkModeToggle');
    if (!toggle) return;

    // Atualizar label com tradução
    updateElementAccessibility(toggle, 'dark-mode');

    // Verificar preferência salva
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'on') {
      document.body.classList.add('dark-mode');
      toggle.textContent = '☀️';
    }

    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDarkMode ? 'on' : 'off');
      toggle.textContent = isDarkMode ? '☀️' : '🌙';
    });
  }

  /* ------------------ IDIOMAS ------------------ */
  function initLanguages() {
    const toggle = $('#langToggle');
    if (!toggle) return;

    // Atualizar label com tradução
    updateElementAccessibility(toggle, 'language-select');

    // Verificar idioma salvo
    const savedLang = localStorage.getItem('preferredLang') || 'pt';
    toggle.value = savedLang;
    currentLanguage = savedLang;
    document.documentElement.setAttribute('lang', savedLang);

    toggle.addEventListener('change', (e) => {
      const lang = e.target.value;
      currentLanguage = lang;
      document.documentElement.setAttribute('lang', lang);
      localStorage.setItem('preferredLang', lang);
      updatePageLanguage(lang);
    });
  }

  function updatePageLanguage(lang) {
    const elements = $$('[data-text-key]');
    elements.forEach(element => {
      const key = element.getAttribute('data-text-key');
      if (translations[lang] && translations[lang][key]) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.value = translations[lang][key];
        } else {
          element.textContent = translations[lang][key];
        }
      }
    });

    // Atualizar atributos de acessibilidade
    updateAccessibilityLabels(lang);
  }

  function updateElementAccessibility(element, key) {
    if (element && translations[currentLanguage] && translations[currentLanguage][key]) {
      element.setAttribute('aria-label', translations[currentLanguage][key]);
    }
  }

  function updateAccessibilityLabels(lang) {
    const elements = {
      'backToTop': 'back-to-top',
      'navToggle': 'menu-toggle',
      'closeBtn': 'close-menu',
      'videoMuteBtn': 'video-mute',
      'darkModeToggle': 'dark-mode',
      'langToggle': 'language-select'
    };

    Object.keys(elements).forEach(id => {
      const element = $(`#${id}`);
      if (element) {
        element.setAttribute('aria-label', translations[lang][elements[id]]);
      }
    });

    // Atualizar botão close do mobile nav
    const closeBtn = $('.close-btn');
    if (closeBtn) {
      closeBtn.setAttribute('aria-label', translations[lang]['close-menu']);
    }
  }

  /* ------------------ CONTROLES DE VÍDEO CORRIGIDOS ------------------ */
  function initVideoControls() {
    if (!videoMuteBtn || !videoElement) return;

    // Atualizar label com tradução
    updateElementAccessibility(videoMuteBtn, 'video-mute');

    // Estado inicial do vídeo - SEM muted para funcionar
    videoElement.muted = false;
    videoMuteBtn.textContent = '🔊';

    videoMuteBtn.addEventListener('click', () => {
      if (videoElement.muted) {
        videoElement.muted = false;
        videoMuteBtn.textContent = '🔊';
      } else {
        videoElement.muted = true;
        videoMuteBtn.textContent = '🔇';
      }
    });

    // Tentar reproduzir quando visível (com permissão do usuário)
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Tentar play mas capturar erro se autoplay não for permitido
          videoElement.play().catch(e => {
            console.log('Autoplay não permitido:', e);
            // Não faz nada - usuário precisará clicar manualmente
          });
        } else {
          videoElement.pause();
        }
      });
    }, { threshold: 0.5 });

    videoObserver.observe(videoElement);

    // Fallback: permitir que o usuário clique no vídeo para dar play
    videoElement.addEventListener('click', function() {
      if (videoElement.paused) {
        videoElement.play().catch(e => {
          console.log('Play manual não permitido:', e);
        });
      } else {
        videoElement.pause();
      }
    });

    // Adicionar tratamento de erro para o vídeo
    videoElement.addEventListener('error', function(e) {
      console.error('Erro no vídeo:', e);
      // Tentar carregar o source alternativo
      const sources = videoElement.querySelectorAll('source');
      let currentSource = 0;
      
      videoElement.addEventListener('loadstart', function tryNextSource() {
        if (currentSource < sources.length - 1) {
          currentSource++;
          videoElement.src = sources[currentSource].src;
          videoElement.load();
        } else {
          videoElement.removeEventListener('loadstart', tryNextSource);
          console.error('Todos os sources de vídeo falharam');
        }
      });
    });
  }

  /* ------------------ PARTICULAS SIMPLIFICADAS ------------------ */
  function initParticles(canvas) {
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.clientWidth, H = canvas.clientHeight, particles = [], raf;
    const deviceRatio = Math.max(1, window.devicePixelRatio || 1);

    function create() {
      W = canvas.clientWidth * deviceRatio;
      H = canvas.clientHeight * deviceRatio;
      canvas.width = W;
      canvas.height = H;
      particles = [];
      
      // Número de partículas baseado no tamanho do canvas
      const count = canvas.id === 'particles' 
        ? Math.max(15, Math.floor(W * H / 25000))  // Mais partículas no vídeo
        : Math.max(20, Math.floor(W * H / 20000)); // Menos partículas no fundo
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.5 + 0.5, // Partículas um pouco maiores
          vx: (Math.random() - 0.5) * 0.6, // Velocidade moderada
          vy: (Math.random() - 0.5) * 0.6,
          a: 0.1 + Math.random() * 0.3 // Opacidade
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        
        // Cores diferentes para cada canvas
        if (canvas.id === 'particles') {
          // Partículas azuis para o vídeo
          ctx.fillStyle = `rgba(160, 200, 255, ${p.a})`;
        } else {
          // Partículas suaves para o fundo
          ctx.fillStyle = `rgba(200, 220, 255, ${p.a * 0.5})`;
        }
        
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        
        // Reposicionar quando sair da tela
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }
      raf = requestAnimationFrame(draw);
    }

    create();
    draw();
    
    window.addEventListener('resize', debounce(() => {
      cancelAnimationFrame(raf);
      create();
      draw();
    }, 200), { passive: true });
  }

  /* ------------------ ACTIVE LINKS ------------------ */
  function setupActiveSectionObserver() {
    const sections = $$('section[id]');
    if (!sections.length || !desktopNavList) return;
    
    const map = new Map();
    $$('a', desktopNavList).forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const id = href.slice(1);
        if (id) map.set(id, a);
      }
    });

    const mobileMap = new Map();
    const mobileLinks = $$('a', mobileNav);
    mobileLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        const id = href.slice(1);
        if (id) mobileMap.set(id, a);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const link = map.get(e.target.id);
        const mobileLink = mobileMap.get(e.target.id);
        
        if (link) {
          if (e.isIntersecting && e.intersectionRatio > 0.35) {
            map.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
        
        if (mobileLink) {
          if (e.isIntersecting && e.intersectionRatio > 0.35) {
            mobileMap.forEach(l => l.classList.remove('active'));
            mobileLink.classList.add('active');
          } else {
            mobileLink.classList.remove('active');
          }
        }
      });
    }, {
      root: null,
      rootMargin: `-${Math.round(headerHeight * 0.25)}px 0px -40% 0px`,
      threshold: [0.25, 0.35, 0.6]
    });

    sections.forEach(s => observer.observe(s));
  }

  /* ------------------ DESTACAR PÁGINA ATUAL ------------------ */
  function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = $$('nav a, .mobile-nav a');
    
    navLinks.forEach(link => {
      const linkHref = link.getAttribute('href');
      // Remove a classe active de todos os links primeiro
      link.classList.remove('active');
      
      // Verifica se é a página atual
      if (linkHref === currentPage) {
        link.classList.add('active');
      }
      
      // Caso especial para a página inicial
      if (currentPage === 'index.html' && (linkHref === 'index.html' || linkHref === './')) {
        link.classList.add('active');
      }
    });
  }

  /* ------------------ OTIMIZAÇÃO DE IMAGENS ------------------ */
  function optimizeImages() {
    const images = $$('img[loading="lazy"]');
    
    images.forEach(img => {
      // Adicionar transição suave no carregamento
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      
      img.addEventListener('load', function() {
        this.style.opacity = '1';
      });
      
      // Fallback para caso a imagem não carregue
      img.addEventListener('error', function() {
        this.style.opacity = '1';
        console.warn('Imagem não carregada:', this.src);
      });
    });
  }

  /* ------------------ INICIALIZAÇÃO DE PÁGINAS ------------------ */
  function initPageSpecificFeatures() {
    // Verificar se estamos em uma página de conteúdo
    const isContentPage = window.location.pathname.includes('formacao.html') || 
                         window.location.pathname.includes('areas.html') || 
                         window.location.pathname.includes('leis.html');
    
    if (isContentPage) {
      // Adicionar classe específica para páginas de conteúdo
      document.body.classList.add('content-page');
      
      // Inicializar animações específicas para conteúdo
      initContentAnimations();
    }
  }

  function initContentAnimations() {
    // Animações específicas para páginas de conteúdo
    const contentCards = $$('.content-card, .skill-item, .behavioral-item');
    
    if (contentCards.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, { threshold: 0.1 });
      
      contentCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
      });
    }
  }

  /* ------------------ MANIPULAÇÃO DE ERROS ------------------ */
  function initErrorHandling() {
    // Capturar erros globais não tratados
    window.addEventListener('error', (e) => {
      console.error('Erro global:', e.error);
    });
    
    // Capturar promessas rejeitadas não tratadas
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Promessa rejeitada não tratada:', e.reason);
    });
  }

  /* ------------------ INIT PRINCIPAL ------------------ */
  function init() {
    try {
      updateHeaderHeight();
      initMobileNav();
      initSmoothScroll();
      initFadeUp();
      initBackToTop();
      initDarkMode();
      initLanguages();
      initVideoControls();
      optimizeImages();
      highlightCurrentPage();
      initPageSpecificFeatures();
      initErrorHandling();
      
      // Inicializar partículas
      if (canvasBg) initParticles(canvasBg);
      if (canvasVideo) initParticles(canvasVideo);
      
      setupActiveSectionObserver();

      // Event Listeners
      window.addEventListener('scroll', throttle(handleHeaderOnScroll, 100), { passive: true });
      window.addEventListener('resize', debounce(updateHeaderHeight, 150), { passive: true });
      
      document.addEventListener('click', (e) => {
        if (document.body.classList.contains('nav-open') && 
            !mobileNav.contains(e.target) && 
            !navToggle.contains(e.target)) {
          closeMobileNav();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
          closeMobileNav();
        }
        if (e.key === 'Home') {
          window.scrollTo({ top: 0, behavior: isReducedMotion ? 'auto' : 'smooth' });
        }
      });

      // Inicializar estado
      handleHeaderOnScroll();
      
      console.log('Site inicializado com sucesso!');

    } catch (error) {
      console.error('Erro durante a inicialização:', error);
    }
  }

  // Inicialização segura
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM já carregado
    setTimeout(init, 100); // Pequeno delay para garantir que tudo está pronto
  }

})();