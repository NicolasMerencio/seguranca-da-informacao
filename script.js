/**
 * script.js - Segurança da Informação
 * Versão moderna, performática e acessível
 * 
 * Funcionalidades:
 * - Sistema de partículas performático
 * - Navegação mobile acessível
 * - Scroll suave e inteligente
 * - Animações otimizadas
 * - Gerenciamento de estado robusto
 * - Performance otimizada
 */

class SecurityInfoWebsite {
    constructor() {
        // Estado da aplicação
        this.state = {
            scrollY: 0,
            lastScrollY: 0,
            headerHeight: 0,
            isMobileMenuOpen: false,
            reducedMotion: false
        };

        // Elementos DOM
        this.elements = {
            header: null,
            main: null,
            nav: null,
            navList: null,
            menuToggle: null,
            backToTop: null,
            canvasBg: null,
            canvasVideo: null
        };

        // Instâncias
        this.particles = {
            bg: null,
            video: null
        };

        // Configurações
        this.config = {
            scrollThreshold: 300,
            scrollDelta: 10,
            headerHideThreshold: 100,
            intersectionThreshold: 0.1,
            particleCount: {
                bg: 50,
                video: 20
            }
        };

        this.init();
    }

    /**
     * Inicialização principal
     */
    init() {
        // Verificar preferências do usuário
        this.checkUserPreferences();
        
        // Encontrar elementos DOM
        this.findDOMElements();
        
        // Inicializar funcionalidades
        this.initHeader();
        this.initNavigation();
        this.initSmoothScroll();
        this.initScrollAnimations();
        this.initBackToTop();
        this.initParticles();
        this.initIntersectionObservers();

        // Configurar event listeners
        this.setupEventListeners();

        console.log('🚀 Website inicializado com sucesso');
    }

    /**
     * Verificar preferências do usuário
     */
    checkUserPreferences() {
        this.state.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // Log para debugging (remover em produção)
        if (this.state.reducedMotion) {
            console.log('🔧 Movimento reduzido detectado - animações desativadas');
        }
    }

    /**
     * Encontrar elementos DOM
     */
    findDOMElements() {
        this.elements = {
            header: document.querySelector('header'),
            main: document.querySelector('main') || document.body,
            nav: document.querySelector('nav'),
            navList: document.querySelector('#navList'),
            menuToggle: document.querySelector('.menu-toggle'),
            backToTop: document.querySelector('#backToTop'),
            canvasBg: document.querySelector('#backgroundParticles'),
            canvasVideo: document.querySelector('#particles')
        };
    }

    /**
     * Inicializar header e scroll behavior
     */
    initHeader() {
        if (!this.elements.header) return;

        // Calcular altura do header
        this.updateHeaderHeight();

        // Configurar scroll do header
        this.handleHeaderScroll();
    }

    /**
     * Atualizar altura do header
     */
    updateHeaderHeight() {
        const rect = this.elements.header.getBoundingClientRect();
        this.state.headerHeight = Math.ceil(rect.height);
        
        // Atualizar CSS custom property
        document.documentElement.style.setProperty('--header-height', `${this.state.headerHeight}px`);
        
        // Fallback para main
        if (this.elements.main) {
            this.elements.main.style.paddingTop = `var(--header-height, ${this.state.headerHeight}px)`;
        }
    }

    /**
     * Manipular scroll do header
     */
    handleHeaderScroll() {
        const currentY = window.scrollY;
        const delta = currentY - this.state.lastScrollY;

        // Adicionar classe "scrolled" quando passar de um ponto
        if (currentY > 20) {
            this.elements.header.classList.add('scrolled');
        } else {
            this.elements.header.classList.remove('scrolled');
        }

        // Esconder/mostrar header inteligentemente
        if (Math.abs(delta) > this.config.scrollDelta) {
            if (delta > 0 && currentY > this.state.headerHeight + this.config.headerHideThreshold) {
                this.elements.header.classList.add('hidden');
            } else {
                this.elements.header.classList.remove('hidden');
            }
            this.state.lastScrollY = currentY;
        }

        this.state.scrollY = currentY;
    }

    /**
     * Inicializar sistema de navegação
     */
    initNavigation() {
        // Criar menu mobile se necessário
        this.createMobileNavigation();
        
        // Configurar navegação ativa
        this.setupActiveNavigation();
    }

    /**
     * Criar navegação mobile
     */
    createMobileNavigation() {
        if (!this.elements.nav || !this.elements.menuToggle) return;

        // Configurar toggle do menu
        this.elements.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMobileMenu();
        });

        // Fechar menu ao clicar em links
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (this.state.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    /**
     * Alternar menu mobile
     */
    toggleMobileMenu() {
        if (this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    /**
     * Abrir menu mobile
     */
    openMobileMenu() {
        this.elements.nav.classList.add('active');
        this.elements.menuToggle.classList.add('active');
        this.elements.menuToggle.setAttribute('aria-expanded', 'true');
        this.state.isMobileMenuOpen = true;
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
    }

    /**
     * Fechar menu mobile
     */
    closeMobileMenu() {
        this.elements.nav.classList.remove('active');
        this.elements.menuToggle.classList.remove('active');
        this.elements.menuToggle.setAttribute('aria-expanded', 'false');
        this.state.isMobileMenuOpen = false;
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
    }

    /**
     * Configurar navegação ativa
     */
    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
                    const id = entry.target.id;
                    
                    // Remover active de todos os links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Adicionar active ao link correspondente
                    const activeLink = document.querySelector(`nav a[href="#${id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, {
            root: null,
            rootMargin: `-${Math.round(this.state.headerHeight * 0.25)}px 0px -40% 0px`,
            threshold: [0.25, 0.35, 0.6]
        });

        sections.forEach(section => observer.observe(section));
    }

    /**
     * Inicializar scroll suave
     */
    initSmoothScroll() {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            event.preventDefault();
            this.scrollToElement(targetElement);
        });
    }

    /**
     * Scroll suave para elemento
     */
    scrollToElement(element) {
        const rect = element.getBoundingClientRect();
        const targetPosition = rect.top + window.scrollY - this.state.headerHeight - 20;

        if (this.state.reducedMotion) {
            window.scrollTo(0, targetPosition);
        } else {
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }

        // Fechar menu mobile se estiver aberto
        if (this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        }

        // Foco acessível
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
    }

    /**
     * Inicializar animações de scroll
     */
    initScrollAnimations() {
        const fadeElements = document.querySelectorAll('.fade-up');
        if (!fadeElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, {
            threshold: this.config.intersectionThreshold
        });

        fadeElements.forEach(element => observer.observe(element));
    }

    /**
     * Inicializar botão "voltar ao topo"
     */
    initBackToTop() {
        if (!this.elements.backToTop) return;

        this.elements.backToTop.addEventListener('click', () => {
            this.scrollToTop();
        });

        // Suporte a teclado
        this.elements.backToTop.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                this.scrollToTop();
            }
        });
    }

    /**
     * Scroll para o topo
     */
    scrollToTop() {
        if (this.state.reducedMotion) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Foco acessível no main
        if (this.elements.main) {
            this.elements.main.setAttribute('tabindex', '-1');
            this.elements.main.focus({ preventScroll: true });
        }
    }

    /**
     * Inicializar sistema de partículas
     */
    initParticles() {
        if (this.elements.canvasBg) {
            this.particles.bg = new ParticleSystem(
                this.elements.canvasBg,
                this.config.particleCount.bg,
                'background'
            );
        }

        if (this.elements.canvasVideo) {
            this.particles.video = new ParticleSystem(
                this.elements.canvasVideo,
                this.config.particleCount.video,
                'video'
            );
        }
    }

    /**
     * Inicializar observers de interseção
     */
    initIntersectionObservers() {
        // Observer para botão "voltar ao topo"
        if (this.elements.backToTop) {
            const backToTopObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.elements.backToTop.classList.add('visible');
                    } else {
                        this.elements.backToTop.classList.remove('visible');
                    }
                });
            }, { threshold: 0.1 });

            backToTopObserver.observe(document.createElement('div')); // Placeholder
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Scroll com throttle
        window.addEventListener('scroll', this.throttle(() => {
            this.handleHeaderScroll();
            this.handleBackToTopVisibility();
        }, 100), { passive: true });

        // Resize com debounce
        window.addEventListener('resize', this.debounce(() => {
            this.updateHeaderHeight();
            this.handleResize();
        }, 150), { passive: true });

        // Teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Clique fora do menu mobile
        document.addEventListener('click', (e) => {
            this.handleClickOutside(e);
        });
    }

    /**
     * Manipular visibilidade do botão "voltar ao topo"
     */
    handleBackToTopVisibility() {
        if (!this.elements.backToTop) return;

        if (this.state.scrollY > this.config.scrollThreshold) {
            this.elements.backToTop.classList.add('visible');
        } else {
            this.elements.backToTop.classList.remove('visible');
        }
    }

    /**
     * Manipular resize da janela
     */
    handleResize() {
        // Fechar menu mobile em telas maiores
        if (window.innerWidth > 768 && this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
        }

        // Redesenhar partículas
        if (this.particles.bg) this.particles.bg.handleResize();
        if (this.particles.video) this.particles.video.handleResize();
    }

    /**
     * Manipular eventos de teclado
     */
    handleKeyboard(event) {
        // ESC fecha menu mobile
        if (event.key === 'Escape' && this.state.isMobileMenuOpen) {
            this.closeMobileMenu();
            this.elements.menuToggle.focus();
        }

        // Home vai para o topo
        if (event.key === 'Home') {
            event.preventDefault();
            this.scrollToTop();
        }
    }

    /**
     * Manipular clique fora do menu
     */
    handleClickOutside(event) {
        if (!this.state.isMobileMenuOpen) return;

        const isClickInsideNav = this.elements.nav.contains(event.target);
        const isClickOnToggle = this.elements.menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle) {
            this.closeMobileMenu();
        }
    }

    /**
     * Throttle para performance
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce para performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

/**
 * Sistema de Partículas
 */
class ParticleSystem {
    constructor(canvas, particleCount, type = 'background') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particleCount = particleCount;
        this.type = type;
        this.particles = [];
        this.animationId = null;
        this.deviceRatio = Math.max(1, window.devicePixelRatio || 1);

        // Configurações por tipo
        this.config = {
            background: {
                maxSize: 3,
                speed: 0.5,
                color: '165, 167, 214',
                alphaRange: [0.1, 0.6]
            },
            video: {
                maxSize: 2,
                speed: 0.3,
                color: '160, 200, 200',
                alphaRange: [0.05, 0.4]
            }
        }[this.type];

        this.init();
    }

    /**
     * Inicializar sistema de partículas
     */
    init() {
        this.setupCanvas();
        this.createParticles();
        this.startAnimation();

        // Redimensionar
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 100));
    }

    /**
     * Configurar canvas
     */
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.deviceRatio;
        this.canvas.height = rect.height * this.deviceRatio;

        // Aplicar escala para high-DPI displays
        this.ctx.scale(this.deviceRatio, this.deviceRatio);
    }

    /**
     * Criar partículas
     */
    createParticles() {
        this.particles = [];
        const width = this.canvas.width / this.deviceRatio;
        const height = this.canvas.height / this.deviceRatio;

        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * this.config.maxSize + 0.5,
                speedX: (Math.random() - 0.5) * this.config.speed,
                speedY: (Math.random() - 0.5) * this.config.speed,
                alpha: Math.random() * (this.config.alphaRange[1] - this.config.alphaRange[0]) + this.config.alphaRange[0]
            });
        }
    }

    /**
     * Iniciar animação
     */
    startAnimation() {
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width / this.deviceRatio, this.canvas.height / this.deviceRatio);
            
            this.particles.forEach(particle => {
                this.updateParticle(particle);
                this.drawParticle(particle);
            });

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    /**
     * Atualizar partícula
     */
    updateParticle(particle) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Limites com wrap-around
        const width = this.canvas.width / this.deviceRatio;
        const height = this.canvas.height / this.deviceRatio;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
    }

    /**
     * Desenhar partícula
     */
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${this.config.color}, ${particle.alpha})`;
        this.ctx.fill();
    }

    /**
     * Manipular redimensionamento
     */
    handleResize() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.setupCanvas();
        this.createParticles();
        this.startAnimation();
    }

    /**
     * Debounce para performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Destruir instância
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

/**
 * Inicialização quando DOM estiver pronto
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SecurityInfoWebsite();
    });
} else {
    new SecurityInfoWebsite();
}

// Export para uso em módulos (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecurityInfoWebsite, ParticleSystem };
}