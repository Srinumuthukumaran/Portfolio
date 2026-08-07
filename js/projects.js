
document.addEventListener('DOMContentLoaded', () => {

  const projectCards = document.querySelectorAll('.project-card');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('project-search');

  let activeCategory = 'all';
  let filterFrame = 0;
  const cardSearchText = new Map([...projectCards].map(card => [card,
    `${card.dataset.category || ''} ${card.querySelector('.project-title')?.textContent || ''} ${card.querySelector('.project-desc')?.textContent || ''} ${card.querySelector('.project-tech')?.textContent || ''}`.toLowerCase()
  ]));

  function filterProjects() {
    const searchQuery = searchInput?.value.toLowerCase().trim() || '';

    projectCards.forEach(card => {
      const cardCategory = card.dataset.category || '';
      const matchesCategory = activeCategory === 'all' || cardCategory.includes(activeCategory);
      const matchesSearch = cardSearchText.get(card).includes(searchQuery);
      card.hidden = !(matchesCategory && matchesSearch);
    });

    const grids = document.querySelectorAll('.projects-grid');
    grids.forEach(grid => {
      grid.scrollLeft = 0;
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter || 'all';
      filterProjects();
    });
  });

  searchInput?.addEventListener('input', () => {
    cancelAnimationFrame(filterFrame);
    filterFrame = requestAnimationFrame(filterProjects);
  }, { passive: true });

  const projectDetailsMap = {
    'student-management': {
      title: 'Student Management System',
      image: 'StudentManagementSystem-img.webp',
      fullDesc: 'A full-stack enterprise portal built with Java Spring Boot and MySQL for managing student enrollments, course transcripts, attendance metrics, and grade reports.',
      tech: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'Hibernate', 'HTML5/CSS3'],
      github: 'https://github.com/Srinumuthukumaran/student-management-system',
      demo: '#contact'
    },
    'ai-voice-assistant': {
      title: 'AI Chatbot',
      image: 'Ai-chatbotimg.webp',
      fullDesc: 'An intelligent AI chatbot integration built with Spring Boot backend and OpenAI API to support real-time user prompts and automate interactive system responses.',
      tech: ['Java', 'Spring Boot', 'OpenAI API', 'REST API', 'AI integration'],
      github: 'https://github.com/Srinumuthukumaran/Ai-Chatbot',
      demo: '#contact'
    },
    'RAK-SPORTS': {
      title: 'RAK-SPORTS',
      image: 'RAK-SPORTSimg.webp',
      fullDesc: 'A fully responsive sports club portal and landing page detailing training slots, membership pricing sheets, and instructor profiles. Built with custom interactive UI elements.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design'],
      github: 'https://github.com/Srinumuthukumaran/RAK-SPORTS.git',
      demo: 'https://rak-sports.netlify.app/'
    },
    'portfolio': {
      title: 'Portfolio Website',
      image: 'portfolio.img.webp',
      fullDesc: 'A polished single-page portfolio showcasing my work, technical strengths, and contact details through animated transitions and responsive UI design.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      github: 'https://github.com/Srinumuthukumaran',
      demo: '#contact'
    },
    'crime-gpt': {
      title: 'CrimeGPT Intelligence Tool',
      image: 'images/crime-gpt.webp',
      fullDesc: 'LLM-powered forensic investigation system that extracts relationships across case documents and generates automated criminal intelligence summaries.',
      tech: ['AI / LLMs', 'Python', 'FastAPI', 'Vector DB', 'OpenAI API'],
      github: 'https://github.com/Srinumuthukumaran',
      demo: '#contact'
    }
  };

  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const modalGithub = document.getElementById('modal-github');
  const modalDemo = document.getElementById('modal-demo');

  const closeModal = () => {
    modalOverlay?.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  document.addEventListener('click', (e) => {
      const btn = e.target.closest('.open-modal-btn');
      if (!btn) return;
      e.preventDefault();
      const projectKey = btn.dataset.project;
      const data = projectDetailsMap[projectKey] || {
        title: 'Project Overview',
        image: 'Prof-image.webp',
        fullDesc: 'More details about this project will be shared soon. Reach out for a walkthrough or collaboration request.',
        tech: ['Responsive Design', 'Modern Web Stack'],
        github: 'https://github.com/Srinumuthukumaran',
        demo: '#contact'
      };

      if (modalOverlay) {
        if (modalTitle) modalTitle.textContent = data.title;
        if (modalImage) {
          modalImage.src = data.image;
          modalImage.alt = data.title;
        }
        if (modalDesc) modalDesc.textContent = data.fullDesc;
        
        if (modalTech) {
          modalTech.innerHTML = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
        }

        if (modalGithub) modalGithub.href = data.github;
        if (modalDemo) modalDemo.href = data.demo;

        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
  });

  modalCloseBtn?.addEventListener('click', closeModal);

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
      closeModal();
    }
  });

  const showGrids = document.querySelectorAll('.projects-grid');
  showGrids.forEach(grid => {
    let pointerId = null, startX = 0, startScroll = 0;
    grid.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') return;
      if (event.target.closest('a') || event.target.closest('button')) return;
      
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = grid.scrollLeft;
      grid.setPointerCapture(pointerId);
      grid.classList.add('grabbing');
    });
    grid.addEventListener('pointermove', (event) => {
      if (event.pointerId !== pointerId) return;
      grid.scrollLeft = startScroll - (event.clientX - startX);
    });
    const endDrag = (event) => {
      if (event.pointerId !== pointerId) return;
      if (grid.hasPointerCapture(pointerId)) grid.releasePointerCapture(pointerId);
      pointerId = null;
      grid.classList.remove('grabbing');
    };
    grid.addEventListener('pointerup', endDrag);
    grid.addEventListener('pointercancel', endDrag);
  });

  document.querySelectorAll('.project-card[data-live-url]').forEach(card => {
    card.style.cursor = 'pointer';
    let startX = 0;
    let startY = 0;

    card.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
    });

    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      const diffX = Math.abs(e.clientX - startX);
      const diffY = Math.abs(e.clientY - startY);
      if (diffX > 5 || diffY > 5) {
        return;
      }

      e.preventDefault();
      const url = card.dataset.liveUrl;
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });

});
