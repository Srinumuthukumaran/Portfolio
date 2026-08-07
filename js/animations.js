if (typeof window.debounce === 'undefined') {
  window.debounce = function(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };
}
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reduceData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
  const enableComplexEffects = !reduceMotion && !reduceData && window.innerWidth > 768;
  const addReveal = (selector, variant, delay = 0) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal', `reveal-${variant}`);
      if (delay) element.style.setProperty('--reveal-delay', `${delay * index}ms`);
    });
  };

  if (!reduceMotion) {
    addReveal('.section-title, .hero-name', 'heading');
    addReveal('.section-subtitle, .typing-container', 'subheading');
    addReveal('.section-desc, .hero-bio, .about-description, .timeline-desc', 'paragraph');
    addReveal('.hero-buttons, .contact-form .btn, .cta-buttons', 'button');
    addReveal('.hero-image-wrapper, .about-image, .resume-preview, .project-thumb', 'image');
    addReveal('.services-grid .glass-card, .projects-grid .project-card, .skills-grid .glass-card, .timeline .timeline-item, .certs-grid .glass-card, .achieve-grid .glass-card, .contact-info .glass-card', 'card', 120);
  }
  const revealElements = document.querySelectorAll('.reveal');
  if (reduceMotion) revealElements.forEach(element => element.classList.add('active'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px"
  });

  if (!reduceMotion) revealElements.forEach(el => revealObserver.observe(el));
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsTriggered = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        const startStats = () => {
          statNumbers.forEach(stat => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;
            const duration = 800;
            const startedAt = performance.now();
            const animate = (now) => {
              const progress = Math.min(1, (now - startedAt) / duration);
              const current = target * (1 - Math.pow(1 - progress, 3));
              stat.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(startStats, { timeout: 500 });
        } else {
          setTimeout(startStats, 120);
        }
      }
    });
  }, { threshold: 0.2 });

  const statsBanner = document.querySelector('.stats-banner');
  if (statsBanner) statsObserver.observe(statsBanner);
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  if (enableComplexEffects && cursorGlow && cursorDot) {
    if (!cursorDot.querySelector('.cursor-dot-inner')) {
      const inner = document.createElement('div');
      inner.className = 'cursor-dot-inner';
      cursorDot.appendChild(inner);
    }

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let glowX = window.innerWidth / 2, glowY = window.innerHeight / 2;
    let activeGlow = false;
    let lastSparkTime = 0;
    const particleInterval = 60;
    const starPoolSize = 12;
    const starPool = [];
    let starPoolIdx = 0;

    for (let i = 0; i < starPoolSize; i++) {
      const el = document.createElement('div');
      el.className = 'cursor-trail-star';
      el.style.display = 'none';
      el.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" style="width: 100%; height: 100%; display: block;">
          <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
        </svg>
      `;
      document.body.appendChild(el);
      starPool.push({
        element: el,
        x: 0, y: 0,
        vx: 0, vy: 0,
        rot: 0, rotSpeed: 0,
        size: 0,
        alpha: 0,
        active: false,
        age: 0,
        maxAge: 0
      });
    }

    function createCursorStar(x, y) {
      const star = starPool[starPoolIdx];
      starPoolIdx = (starPoolIdx + 1) % starPoolSize;

      star.active = true;
      star.x = x;
      star.y = y;
      star.vx = (Math.random() - 0.5) * 2;
      star.vy = (Math.random() - 0.5) * 2;
      star.rot = Math.random() * 360;
      star.rotSpeed = (Math.random() - 0.5) * 5;
      star.size = 6 + Math.random() * 8; 
      star.alpha = 1;
      star.age = 0;
      star.maxAge = 35 + Math.random() * 15; 
      star.element.style.display = 'block';
      star.element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${star.rot}deg) scale(${star.size / 12})`;
      star.element.style.opacity = '1';
    }
    let hoveredCard = null;
    let hoveredCardRect = null;
    let isTiltTarget = false;
    let isCursorMoving = false;
    let cursorAnimId = null;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isCursorMoving = true;
      
      if (!activeGlow) {
        cursorGlow.style.opacity = '1';
        cursorDot.style.opacity = '1';
        activeGlow = true;
      }
      const now = performance.now();
      if (now - lastSparkTime > particleInterval && !reduceMotion) {
        createCursorStar(mouseX, mouseY);
        lastSparkTime = now;
      }

      if (!cursorAnimId) {
        cursorAnimId = requestAnimationFrame(renderUnifiedFrame);
      }

      clearTimeout(window.cursorMoveTimeout);
      window.cursorMoveTimeout = setTimeout(() => {
        isCursorMoving = false;
      }, 120);
    }, { passive: true });
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .filter-btn, .glass-card, .macos-dock-item, .floating-explore-btn, .live-clock-container');
      if (target) {
        if (!cursorDot.classList.contains('hovered')) {
          cursorDot.classList.add('hovered');
          if (!reduceMotion) {
            const rect = target.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            for (let i = 0; i < 3; i++) {
              createCursorStar(centerX, centerY);
            }
          }
        }
      } else {
        cursorDot.classList.remove('hovered');
      }

      const card = e.target.closest('.project-card, .profile-frame, .about-card, .cert-card, .glass-card, .btn');
      if (card) {
        if (hoveredCard !== card) {
          if (hoveredCard) {
            hoveredCard.style.transform = '';
            hoveredCard.style.transition = 'transform 300ms ease-out';
          }
          hoveredCard = card;
          hoveredCardRect = card.getBoundingClientRect();
          isTiltTarget = card.matches('.project-card, .profile-frame, .about-card, .cert-card');
          if (isTiltTarget) {
            hoveredCard.style.transition = 'transform 100ms ease-out';
          }
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget) {
        cursorGlow.style.opacity = '0';
        cursorDot.style.opacity = '0';
        activeGlow = false;
        if (hoveredCard) {
          hoveredCard.style.transform = '';
          hoveredCard.style.transition = 'transform 300ms ease-out';
          hoveredCard = null;
          hoveredCardRect = null;
        }
      } else if (hoveredCard && !hoveredCard.contains(e.relatedTarget)) {
        hoveredCard.style.transform = '';
        hoveredCard.style.transition = 'transform 300ms ease-out';
        hoveredCard = null;
        hoveredCardRect = null;
      }
    });

    function renderUnifiedFrame() {
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      const dx = mouseX - glowX;
      const dy = mouseY - glowY;
      glowX += dx * 0.16;
      glowY += dy * 0.16;
      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate3d(-50%, -50%, 0)`;
      let anyStarActive = false;
      starPool.forEach(star => {
        if (!star.active) return;
        anyStarActive = true;
        star.x += star.vx;
        star.y += star.vy;
        star.rot += star.rotSpeed;
        star.age++;
        const progress = star.age / star.maxAge;
        star.alpha = 1 - progress;
        const currentScale = (star.size / 12) * (1 - progress);
        star.element.style.transform = `translate3d(${star.x}px, ${star.y}px, 0) translate(-50%, -50%) rotate(${star.rot}deg) scale(${currentScale})`;
        star.element.style.opacity = star.alpha;
        
        if (star.age >= star.maxAge) {
          star.active = false;
          star.element.style.display = 'none';
        }
      });
      if (hoveredCard) {
        if (!hoveredCardRect) hoveredCardRect = hoveredCard.getBoundingClientRect();
        const rx = mouseX - hoveredCardRect.left;
        const ry = mouseY - hoveredCardRect.top;
        
        hoveredCard.style.setProperty('--mouse-x', `${rx}px`);
        hoveredCard.style.setProperty('--mouse-y', `${ry}px`);
        
        if (isTiltTarget) {
          const cardWidth = hoveredCardRect.width;
          const cardHeight = hoveredCardRect.height;
          const cx = rx - (cardWidth / 2);
          const cy = ry - (cardHeight / 2);
          const tiltX = -(cy / (cardHeight / 2)) * 6;
          const tiltY = (cx / (cardWidth / 2)) * 6;
          hoveredCard.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        }
      }
      if (isCursorMoving || Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || anyStarActive) {
        cursorAnimId = requestAnimationFrame(renderUnifiedFrame);
      } else {
        cursorAnimId = null;
      }
    }
    cursorAnimId = requestAnimationFrame(renderUnifiedFrame);
  } else {
    if (cursorGlow) cursorGlow.style.display = 'none';
    if (cursorDot) cursorDot.style.display = 'none';
  }
  const timeline = document.querySelector('.timeline');
  const progressLine = document.querySelector('.timeline-progress-line');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (timeline && progressLine && timelineItems.length > 0) {
    let timelineTop = 0;
    let timelineHeight = 0;

    function cacheTimelineGeometry() {
      const rect = timeline.getBoundingClientRect();
      timelineTop = rect.top + window.scrollY;
      timelineHeight = rect.height;
    }
    
    cacheTimelineGeometry();
    
    let timelineTicking = false;
    function updateTimelineProgress() {
      if (timelineTicking) return;
      timelineTicking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const startPoint = (timelineTop - scrollTop) - (viewportHeight * 0.45);
        let progress = 0;

        if (startPoint < 0) {
          progress = Math.min(100, Math.max(0, (-startPoint / timelineHeight) * 100));
        }

        progressLine.style.transform = `scaleY(${progress / 100})`;
        timelineTicking = false;
      });
    }

    const itemObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: "0px 0px -20% 0px"
    });

    timelineItems.forEach(item => itemObserver.observe(item));

    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', debounce(() => {
      cacheTimelineGeometry();
      updateTimelineProgress();
    }, 150), { passive: true });
    
    setTimeout(updateTimelineProgress, 300);
  }

  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', debounce(() => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }, 150), { passive: true });

    let isCanvasVisible = true;
    let canvasAnimFrameId = null;

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 140, 255, ${p.alpha})`;
        ctx.fill();
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 6400) { 
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(123, 97, 255, ${0.15 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      if (isCanvasVisible) {
        canvasAnimFrameId = requestAnimationFrame(renderParticles);
      } else {
        canvasAnimFrameId = null;
      }
    }

    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible) {
          if (!canvasAnimFrameId) {
            canvasAnimFrameId = requestAnimationFrame(renderParticles);
          }
        } else {
          if (canvasAnimFrameId) {
            cancelAnimationFrame(canvasAnimFrameId);
            canvasAnimFrameId = null;
          }
        }
      });
    }, { threshold: 0 });
    canvasObserver.observe(canvas);

    const particles = [];
    const particleCount = window.innerWidth > 1200 ? 18 : 12;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.4 + 0.1
      });
    }
    canvasAnimFrameId = requestAnimationFrame(renderParticles);
  }

});
