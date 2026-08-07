function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  let bgContainer = null;
  let dockContainer = null;
  let dockItems = [];

  const splashScreen = document.getElementById('splash-screen');
  const splashSparks = document.getElementById('splash-sparks');
  const mainContent = document.querySelector('main');
  
  if (splashScreen) {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const enableAmbientEffects = !isReduced && window.innerWidth > 768;

    if (sessionStorage.getItem('portfolio-loaded')) {
      splashScreen.remove();
      const curtain = document.getElementById('story-curtain');
      if (curtain) {
        curtain.classList.add('fade-out-portal');
        curtain.classList.remove('slide-to-center');
      }
      if (mainContent) mainContent.classList.add('loader-reveal-active');
      document.body.classList.remove('transition-freeze');
    } else {
      document.body.classList.add('transition-freeze');
      
      setTimeout(() => {
        if (splashSparks && enableAmbientEffects) {
          const sparkCount = 12;
          for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('span');
            spark.className = 'loader-spark-particle';
            
            const size = Math.random() * 3 + 1.5; 
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;
            
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.animationDelay = `${Math.random() * 2000}ms`;
            spark.style.animationDuration = `${Math.random() * 2000 + 2000}ms`;
            spark.style.setProperty('--target-opacity', Math.random() * 0.4 + 0.3);
            spark.style.setProperty('--drift-x', `${Math.random() * 40 - 20}px`);
            
            spark.style.animationName = 'loaderSparkRise';
            spark.style.animationTimingFunction = 'ease-out';
            spark.style.animationIterationCount = 'infinite';
            
            splashSparks.appendChild(spark);
          }
        }
      }, 50);

      const nameEl = document.getElementById('splash-name');
      const loaderBar = document.getElementById('boot-loader-bar');
      const loaderPercent = document.getElementById('boot-loader-percentage');
      const loaderSubtext = document.getElementById('boot-loader-subtext');
      
      const flashEl = document.getElementById('splash-lightning-flash');
      const svgContainer = document.getElementById('splash-lightning-svg-container');

      function triggerLightningStrike(durationMs = 200) {
        if (isReduced) return;
        if (flashEl && svgContainer) {
          flashEl.style.opacity = '0.35';
          svgContainer.style.opacity = '0.9';
          document.body.classList.add('lightning-illuminated');
          
          setTimeout(() => {
            flashEl.style.opacity = '0';
            svgContainer.style.opacity = '0';
            document.body.classList.remove('lightning-illuminated');
          }, durationMs);
        }
      }

      setTimeout(() => triggerLightningStrike(150), 400);
      setTimeout(() => triggerLightningStrike(200), 2000);

      const loaderDuration = 1200;
      const startTime = performance.now();

      function updateLoader(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / loaderDuration, 1);
        const percentage = Math.floor(progress * 100);

        if (loaderBar) loaderBar.style.width = `${percentage}%`;
        if (loaderPercent) loaderPercent.textContent = `${percentage}%`;

        if (loaderSubtext) {
          if (percentage < 30) {
            loaderSubtext.textContent = 'LOADING...';
          } else if (percentage < 65) {
            loaderSubtext.textContent = 'CONNECTING PROTOCOLS...';
          } else if (percentage < 90) {
            loaderSubtext.textContent = 'LOADING ASSETS...';
          } else {
            loaderSubtext.textContent = 'SYSTEM READY';
          }
        }

        if (progress < 1) {
          requestAnimationFrame(updateLoader);
        } else {
          triggerLightningStrike(300);

          sessionStorage.setItem('portfolio-loaded', 'true');

          if (splashScreen) {
            splashScreen.classList.add('fade-out');
          }

          document.documentElement.classList.add('splash-bypassed');

          const curtain = document.getElementById('story-curtain');
          if (curtain) {
            curtain.classList.add('fade-out-portal');
            curtain.classList.remove('slide-to-center');
          }

          setTimeout(() => {
            if (mainContent) {
              mainContent.classList.add('loader-reveal-active');
            }
            document.body.classList.remove('transition-freeze');
          }, 350);

          setTimeout(() => {
            if (splashScreen) splashScreen.remove();
          }, 600);
        }
      }

      requestAnimationFrame(updateLoader);
    }
  } else {
    const curtain = document.getElementById('story-curtain');
    if (curtain) {
      curtain.classList.add('fade-out-portal');
      curtain.classList.remove('slide-to-center');
    }
    if (mainContent) {
      mainContent.classList.add('loader-reveal-active');
    }
  }

  const onMainPage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname.endsWith('/') || 
                     !window.location.pathname.includes('.html');
  const pathPrefix = onMainPage ? '' : 'index.html';

  const initDecorativeWidgets = () => {
    const dockNav = document.createElement('nav');
    dockNav.className = 'macos-dock-nav';
    dockNav.setAttribute('aria-label', 'Quick Navigation Dock');
    dockNav.innerHTML = `
      <div class="macos-dock-container">
        <a href="${pathPrefix}#home" class="macos-dock-item active" data-label="Home" aria-label="Navigate to Home">
          <div class="dock-icon-wrapper">
            <svg viewBox="0 0 24 24" class="dock-svg-icon">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor"/>
            </svg>
          </div>
          <span class="dock-label">Home</span>
          <span class="dock-indicator"></span>
        </a>
        <a href="${pathPrefix}#projects" class="macos-dock-item" data-label="Projects" aria-label="Navigate to Projects">
          <div class="dock-icon-wrapper">
            <svg viewBox="0 0 24 24" class="dock-svg-icon">
              <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" fill="currentColor"/>
            </svg>
          </div>
          <span class="dock-label">Projects</span>
          <span class="dock-indicator"></span>
        </a>
        <a href="${pathPrefix}#resume" class="macos-dock-item" data-label="Resume" aria-label="Navigate to Resume">
          <div class="dock-icon-wrapper">
            <svg viewBox="0 0 24 24" class="dock-svg-icon">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/>
            </svg>
          </div>
          <span class="dock-label">Resume</span>
          <span class="dock-indicator"></span>
        </a>
        <a href="${pathPrefix}#about" class="macos-dock-item" data-label="About" aria-label="Navigate to About">
          <div class="dock-icon-wrapper">
            <svg viewBox="0 0 24 24" class="dock-svg-icon">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </div>
          <span class="dock-label">About</span>
          <span class="dock-indicator"></span>
        </a>
        <a href="${pathPrefix}#skills" class="macos-dock-item" data-label="Skills" aria-label="Navigate to Skills">
          <div class="dock-icon-wrapper">
            <svg viewBox="0 0 24 24" class="dock-svg-icon">
              <path d="M7 2v11h3v9l7-12h-4l4-8z" fill="currentColor"/>
            </svg>
          </div>
          <span class="dock-label">Skills</span>
          <span class="dock-indicator"></span>
        </a>
        <a href="${pathPrefix}#contact" class="macos-dock-item" data-label="Contact" aria-label="Navigate to Contact">
          <div class="dock-icon-wrapper">
            <svg viewBox="0 0 24 24" class="dock-svg-icon">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
            </svg>
          </div>
          <span class="dock-label">Contact</span>
          <span class="dock-indicator"></span>
        </a>
      </div>
    `;
    document.body.appendChild(dockNav);

    dockContainer = dockNav.querySelector('.macos-dock-container');
    dockItems = dockNav.querySelectorAll('.macos-dock-item');

    const utilityBar = document.createElement('div');
    utilityBar.className = 'top-utility-bar';
    utilityBar.innerHTML = `
      <div class="live-clock-container">
        <div class="clock-time" id="clock-time">
          <span class="clock-unit" id="clock-hours">--</span>
          <span class="clock-separator">:</span>
          <span class="clock-unit" id="clock-minutes">--</span>
          <span class="clock-separator">:</span>
          <span class="clock-unit" id="clock-seconds">--</span>
          <span class="clock-unit" id="clock-ampm" style="margin-left: 6px;">--</span>
        </div>
        <div class="clock-date" id="clock-date">----------</div>
      </div>
    `;
    document.body.appendChild(utilityBar);

    const exploreWrapper = utilityBar.querySelector('.floating-explore-wrapper');
    const exploreTrigger = document.getElementById('floating-explore-trigger');
    if (exploreTrigger) {
      exploreTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = exploreWrapper.classList.contains('active');
        exploreWrapper.classList.toggle('active');
        exploreTrigger.setAttribute('aria-expanded', !isActive);
      });

      document.addEventListener('click', (e) => {
        if (!exploreWrapper.contains(e.target)) {
          exploreWrapper.classList.remove('active');
          exploreTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    function updateClock() {
      const clockHours = document.getElementById('clock-hours');
      const clockMinutes = document.getElementById('clock-minutes');
      const clockSeconds = document.getElementById('clock-seconds');
      const clockAmpm = document.getElementById('clock-ampm');
      const clockDate = document.getElementById('clock-date');
      if (!clockHours || !clockMinutes || !clockSeconds || !clockAmpm || !clockDate) return;

      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      const hoursStr = String(hours).padStart(2, '0');
      const minutesStr = String(now.getMinutes()).padStart(2, '0');
      const secondsStr = String(now.getSeconds()).padStart(2, '0');
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const dateString = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

      function updateDigit(element, val) {
        if (element.textContent !== val) {
          element.style.transform = 'translateY(-2px)';
          element.style.opacity = '0.35';
          setTimeout(() => {
            element.textContent = val;
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
          }, 80);
        }
      }

      updateDigit(clockHours, hoursStr);
      updateDigit(clockMinutes, minutesStr);
      updateDigit(clockSeconds, secondsStr);
      updateDigit(clockAmpm, ampm);

      if (clockDate.textContent !== dateString) {
        clockDate.textContent = dateString;
      }
    }

    setInterval(updateClock, 1000);
    updateClock();

    if (dockContainer && window.innerWidth > 768) {
      let cachedDockItems = [];
      let dockContainerRect = null;
      let dockTicking = false;
      let mouseNearDock = false;

      function cacheDockPositions() {
        dockContainerRect = dockContainer.getBoundingClientRect();
        cachedDockItems = Array.from(dockItems).map(item => {
          const rect = item.getBoundingClientRect();
          const iconWrapper = item.querySelector('.dock-icon-wrapper');
          return {
            element: item,
            iconWrapper: iconWrapper,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2
          };
        });
      }

      cacheDockPositions();
      window.addEventListener('resize', debounce(cacheDockPositions, 200), { passive: true });

      let lastMouseX = 0;
      let lastMouseY = 0;
      let lastDockUpdate = 0;

      document.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        if (dockTicking) return;
        dockTicking = true;

        requestAnimationFrame(() => {
          if (!dockContainerRect) cacheDockPositions();

          const rect = dockContainerRect;
          const verticalBuffer = 220;
          const withinZone =
            lastMouseY >= rect.top - verticalBuffer && lastMouseY <= rect.bottom + verticalBuffer &&
            lastMouseX >= rect.left - verticalBuffer && lastMouseX <= rect.right + verticalBuffer;

          if (withinZone) {
            mouseNearDock = true;
            const now = performance.now();
            if (now - lastDockUpdate > 16) {
              lastDockUpdate = now;
              cachedDockItems.forEach(item => {
                const dist = Math.hypot(lastMouseX - item.centerX, lastMouseY - item.centerY);
                const maxDist = 140;
                let scale = 1;
                let lift = 0;

                if (dist < maxDist) {
                  const ratio = (maxDist - dist) / maxDist;
                  scale = 1 + ratio * 0.3;
                  lift = ratio * -10;
                }

                if (item.iconWrapper) {
                  item.iconWrapper.style.transform = `scale(${scale}) translateY(${lift}px)`;
                }
              });
            }
          } else if (mouseNearDock) {
            mouseNearDock = false;
            cachedDockItems.forEach(item => {
              if (item.iconWrapper) item.iconWrapper.style.transform = '';
            });
          }

          dockTicking = false;
        });
      }, { passive: true });

      dockContainer.addEventListener('mouseleave', () => {
        mouseNearDock = false;
        cachedDockItems.forEach(item => {
          if (item.iconWrapper) item.iconWrapper.style.transform = '';
        });
      });
    }
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(initDecorativeWidgets, { timeout: 800 });
  } else {
    setTimeout(initDecorativeWidgets, 250);
  }

  let isNavigationTransitioning = false;
    function triggerNeonThunderTransition(destinationName, callback) {
    if (isNavigationTransitioning) return; 
    isNavigationTransitioning = true;

    const curtain = document.getElementById('story-curtain');
    if (!curtain) {
      callback();
      isNavigationTransitioning = false;
      return;
    }
    document.body.classList.add('transition-freeze');

    curtain.className = '';
    curtain.style.opacity = '1';
    curtain.style.display = 'flex';
    curtain.classList.add('slide-to-center');

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      curtain.style.opacity = '1';
      setTimeout(() => {
        callback();
        curtain.classList.add('fade-out-portal');
        curtain.classList.remove('slide-to-center');
        setTimeout(() => {
          document.body.classList.remove('transition-freeze');
          isNavigationTransitioning = false;
        }, 300);
      }, 400);
      return;
    }

    const subtitleEl = document.getElementById('story-intro-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = 'INITIALIZING PORTAL PROTOCOLS...';
    }

    let displayTitle = destinationName.toUpperCase().replace('#', '');
    if (displayTitle === 'HOME') displayTitle = 'WELCOME';
    const titleEl = document.getElementById('story-intro-title');
    if (titleEl) {
      titleEl.textContent = displayTitle;
      titleEl.setAttribute('data-text', displayTitle);
    }

    curtain.classList.add('stage-0');

    setTimeout(() => {
      curtain.classList.add('stage-1');
    }, 200);

    setTimeout(() => {
      curtain.classList.add('stage-2');
      if (subtitleEl) {
        subtitleEl.textContent = 'PORTAL SECURED. TRANSFERRING DATA...';
      }
    }, 400);

    setTimeout(() => {
      curtain.classList.add('stage-3');
    }, 600);

    setTimeout(() => {
      curtain.classList.add('stage-4');
      if (subtitleEl) {
        subtitleEl.textContent = 'DECRYPTING NEW SPACE INTERFACE...';
      }
    }, 800);

    setTimeout(() => {
      callback();
      
      curtain.classList.add('fade-out-portal');
      curtain.classList.remove('slide-to-center');

      setTimeout(() => {
        curtain.classList.remove('stage-0', 'stage-1', 'stage-2', 'stage-3', 'stage-4', 'fade-out-portal');
        document.body.classList.remove('transition-freeze');
        isNavigationTransitioning = false;
      }, 600);
    }, 1000);
  }

  const pendingTransition = sessionStorage.getItem('portfolio-transition');
  const pendingTransitionLabel = sessionStorage.getItem('portfolio-transition-label');

  if (pendingTransition === 'true' && pendingTransitionLabel) {
    setTimeout(() => {
      triggerNeonThunderTransition(pendingTransitionLabel, () => {
        sessionStorage.removeItem('portfolio-transition');
        sessionStorage.removeItem('portfolio-transition-label');
      });
    }, 80);
  }

  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      
      const hash = href.substring(hashIndex);
      const targetPath = href.substring(0, hashIndex);
      
      const isTargetCurrent = targetPath === '' || 
                              (targetPath === 'index.html' && onMainPage) || 
                              window.location.pathname.endsWith(targetPath);
      
      if (isTargetCurrent) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
          e.preventDefault();
          
          let cleanLabel = hash.replace('#', '').toUpperCase();
          if (cleanLabel === 'HOME') cleanLabel = 'WELCOME';
          
          triggerNeonThunderTransition(cleanLabel, () => {
            targetSection.scrollIntoView({ behavior: 'auto' });
            history.pushState(null, null, hash);
            
            dockItems.forEach(item => {
              if (item.getAttribute('href').endsWith(hash)) {
                item.classList.add('active');
              } else {
                item.classList.remove('active');
              }
            });
          });
        }
      }
    });
  });

  document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.getAttribute('target') === '_blank' || href.includes('//')) {
      return;
    }
    if (href.includes('#')) {
      const hashIndex = href.indexOf('#');
      const targetPath = href.substring(0, hashIndex);
      const isTargetCurrent = targetPath === '' || 
                              (targetPath === 'index.html' && onMainPage) || 
                              window.location.pathname.endsWith(targetPath);
      if (isTargetCurrent) return;
    }
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      let pageTitle = 'LOADING';
      if (href.includes('project')) pageTitle = 'PROJECTS';
      else if (href.includes('resume')) pageTitle = 'RESUME';
      else if (href.includes('about')) pageTitle = 'ABOUT';
      else if (href.includes('skills')) pageTitle = 'SKILLS';
      else if (href.includes('contact')) pageTitle = 'CONTACT';
      else if (href.includes('experience')) pageTitle = 'EXPERIENCE';
      else if (href.includes('certification')) pageTitle = 'CERTIFICATIONS';
      else if (href === 'index.html' || href === '/') pageTitle = 'PORTFOLIO';
      
      sessionStorage.setItem('portfolio-transition', 'true');
      sessionStorage.setItem('portfolio-transition-label', pageTitle);

      triggerNeonThunderTransition(pageTitle, () => {
        window.location.href = href;
      });
    });
  });

  if (onMainPage) {
    const sections = document.querySelectorAll('section[id]');
    const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-item, .floating-explore-item');
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0.15
    };

    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      const entry = visible[visible.length - 1];
      const activeId = `#${entry.target.id}`;

      dockItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        item.classList.toggle('active', itemHref.endsWith(activeId));
      });

      allNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.toggle('active', Boolean(linkHref && linkHref.endsWith(activeId)));
      });
    }, observerOptions);

    sections.forEach(section => activeObserver.observe(section));
  }

  bgContainer = document.createElement('div');
  bgContainer.className = 'neon-thunder-bg';
  bgContainer.innerHTML = `
    <div class="engine-gradient-layer"></div>
    <div class="engine-aurora-layer"></div>
    <div class="engine-grid-layer"><div class="engine-grid-content"></div></div>
    <div class="engine-storm-clouds"></div>
    <div class="engine-plasma-overlay"></div>
    <div class="engine-particles-layer">
      <span class="bg-particle bp-1"></span>
      <span class="bg-particle bp-2"></span>
      <span class="bg-particle bp-3"></span>
      <span class="bg-particle bp-4"></span>
      <span class="bg-particle bp-5"></span>
      <span class="bg-particle bp-6"></span>
      <span class="bg-particle bp-7"></span>
      <span class="bg-particle bp-8"></span>
    </div>
    <svg class="engine-lightning-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path class="engine-lightning-bolt" d="" />
      <path class="engine-lightning-bolt-branch-1" d="" />
      <path class="engine-lightning-bolt-branch-2" d="" />
    </svg>
    <div class="engine-flash-overlay"></div>
    <div class="engine-film-grain"></div>
  `;
  document.body.prepend(bgContainer);

  const bgLightningBolt = bgContainer.querySelector('.engine-lightning-bolt');
  const bgBranch1 = bgContainer.querySelector('.engine-lightning-bolt-branch-1');
  const bgBranch2 = bgContainer.querySelector('.engine-lightning-bolt-branch-2');
  const flashOverlay = bgContainer.querySelector('.engine-flash-overlay');
  const gridLayer = bgContainer.querySelector('.engine-grid-layer');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lightningTimeout = null;
  
  function triggerAmbientLightning() {
    if (prefersReducedMotion || document.hidden) {
      lightningTimeout = setTimeout(triggerAmbientLightning, 3000);
      return;
    }

    const startX = 20 + Math.random() * 60;
    let mainPath = `M ${startX},0`;
    let curX = startX;
    let curY = 0;
    const segmentCount = 8 + Math.floor(Math.random() * 6);
    const segmentHeight = 100 / segmentCount;
    
    const forkNodeIndex1 = Math.floor(segmentCount * 0.35);
    const forkNodeIndex2 = Math.floor(segmentCount * 0.7);
    let branch1Start = null;
    let branch2Start = null;

    for (let i = 1; i <= segmentCount; i++) {
      curY += segmentHeight;
      curX += (Math.random() - 0.5) * 16;
      curX = Math.max(5, Math.min(95, curX));
      mainPath += ` L ${curX},${curY}`;

      if (i === forkNodeIndex1) branch1Start = { x: curX, y: curY };
      if (i === forkNodeIndex2) branch2Start = { x: curX, y: curY };
    }

    let branch1Path = "";
    if (branch1Start) {
      branch1Path = `M ${branch1Start.x},${branch1Start.y}`;
      let bX = branch1Start.x;
      let bY = branch1Start.y;
      const steps = 4;
      const dy = (100 - bY) / steps;
      for (let j = 0; j < steps; j++) {
        bY += dy;
        bX += (Math.random() - 0.2) * 12;
        bX = Math.max(5, Math.min(95, bX));
        branch1Path += ` L ${bX},${bY}`;
      }
    }

    let branch2Path = "";
    if (branch2Start) {
      branch2Path = `M ${branch2Start.x},${branch2Start.y}`;
      let bX = branch2Start.x;
      let bY = branch2Start.y;
      const steps = 4;
      const dy = (100 - bY) / steps;
      for (let j = 0; j < steps; j++) {
        bY += dy;
        bX += (Math.random() - 0.8) * 12;
        bX = Math.max(5, Math.min(95, bX));
        branch2Path += ` L ${bX},${bY}`;
      }
    }

    bgLightningBolt.setAttribute('d', mainPath);
    if (bgBranch1) bgBranch1.setAttribute('d', branch1Path);
    if (bgBranch2) bgBranch2.setAttribute('d', branch2Path);

    bgLightningBolt.classList.add('flash');
    if (bgBranch1) bgBranch1.classList.add('flash');
    if (bgBranch2) bgBranch2.classList.add('flash');
    flashOverlay.classList.add('flash');
    gridLayer.classList.add('lightning-active');
    document.body.classList.add('lightning-illuminated');

    setTimeout(() => {
      bgLightningBolt.classList.remove('flash');
      if (bgBranch1) bgBranch1.classList.remove('flash');
      if (bgBranch2) bgBranch2.classList.remove('flash');
      flashOverlay.classList.remove('flash');
      gridLayer.classList.remove('lightning-active');
      document.body.classList.remove('lightning-illuminated');
      
      bgLightningBolt.setAttribute('d', '');
      if (bgBranch1) bgBranch1.setAttribute('d', '');
      if (bgBranch2) bgBranch2.setAttribute('d', '');
    }, 200);

    const nextInterval = 3000 + Math.random() * 3000;
    lightningTimeout = setTimeout(triggerAmbientLightning, nextInterval);
  }

  lightningTimeout = setTimeout(triggerAmbientLightning, 3500);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (lightningTimeout) clearTimeout(lightningTimeout);
    } else {
      triggerAmbientLightning();
    }
  });

});
