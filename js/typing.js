document.addEventListener('DOMContentLoaded', () => {
  const typedTextElement = document.getElementById('typed-text');
  if (!typedTextElement) return;

  const phrases = [
    "Computer Science Engineering Student",
    "Aspiring Software Engineer",
    "AI & Full Stack Developer",
    "Problem Solver & Tech Enthusiast"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingDelay = 70;
  const deletingDelay = 40;
  const pauseAfterTyping = 1600;
  const pauseAfterDeleting = 550;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex = Math.max(charIndex - 1, 0);
    } else {
      charIndex = Math.min(charIndex + 1, currentPhrase.length);
    }

    typedTextElement.textContent = currentPhrase.slice(0, charIndex);
    let delay = isDeleting ? deletingDelay : typingDelay;

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      delay = pauseAfterTyping;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = pauseAfterDeleting;
    }

    setTimeout(type, delay);
  }

  type();
});
