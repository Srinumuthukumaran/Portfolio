
const registerServiceWorker = () => {
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('./service-worker.js')
                .catch(() => {});
        });
    }
};

registerServiceWorker();


document.addEventListener('DOMContentLoaded', () => {

    const typedTextElement = document.getElementById('typed-text');

    if (typedTextElement) {

        const phrases = [
            "Computer Science Engineering Student",
            "Aspiring Software Engineer",
            "AI & Full Stack Developer"
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
                charIndex = Math.min(
                    charIndex + 1,
                    currentPhrase.length
                );
            }
            typedTextElement.textContent =
                currentPhrase.slice(0, charIndex);
            let delay =
                isDeleting
                    ? deletingDelay
                    : typingDelay;
            if (
                !isDeleting &&
                charIndex === currentPhrase.length
            ) {
                isDeleting = true;
                delay = pauseAfterTyping;
            } else if (
                isDeleting &&
                charIndex === 0
            ) {
                isDeleting = false;
                phraseIndex =
                    (phraseIndex + 1) % phrases.length;
                delay = pauseAfterDeleting;
            }
            setTimeout(type, delay);
        }
        if (
            document.getElementById('splash-screen') &&
            !sessionStorage.getItem('portfolio-loaded')
        ) {
            setTimeout(type, 4500);
        } else {
            type();
        }
    }
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x =
                e.clientX - rect.left;
            const y =
                e.clientY - rect.top;
            const circle =
                document.createElement('span');
            circle.classList.add('ripple');
            circle.style.left = `${x}px`;
            circle.style.top = `${y}px`;
            this.appendChild(circle);
            setTimeout(() => {
                circle.remove();
            }, 600);
        });
    });
    const EMAILJS_PUBLIC_KEY = "-h9rBneCcHnlxJ1WP";
    const EMAILJS_SERVICE_ID = "service_arszjpy";
    const EMAILJS_TEMPLATE_ID = "template_c52dmr6";
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });
    } else {
        console.error(
            'EmailJS SDK is not loaded. Check index.html.'
        );
    }
    const contactForm =
        document.getElementById('contact-form');
    const formStatus =
        document.getElementById('form-status');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name =
            document.getElementById('name')?.value.trim();
        const email =
            document.getElementById('email')?.value.trim();
        const subject =
            document.getElementById('subject')?.value.trim();
        const message =
            document.getElementById('message')?.value.trim();
        if (!name) {
            showStatus(
                'Name is required.',
                '#EF4444',
                'error'
            );
            return;
        }
        if (!email) {
            showStatus(
                'Email is required.',
                '#EF4444',
                'error'
            );
            return;
        }
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showStatus(
                'Please enter a valid email address.',
                '#EF4444',
                'error'
            );

            return;
        }
        if (!subject) {
            showStatus(
                'Subject is required.',
                '#EF4444',
                'error'
            );
            return;
        }
        if (!message) {
            showStatus(
                'Message is required.',
                '#EF4444',
                'error'
            );
            return;
        }
        const submitBtn =
            contactForm.querySelector(
                'button[type="submit"]'
            );
        if (submitBtn?.disabled) {
            return;
        }
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
        if (typeof emailjs === 'undefined') {
            showStatus(
                'Email service is not loaded. Please refresh the page.',
                '#EF4444',
                'error'
            );
            restoreButton();
            return;
        }
        emailjs.sendForm(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            contactForm
        )
        .then(() => {
            showStatus(
                'Message sent successfully!',
                '#10B981',
                'success'
            );
            contactForm.reset();
            restoreButton();
        })
        .catch((error) => {
            console.error(
                'EmailJS Error details:',
                error
            );
            showStatus(
                'Unable to send message. Please try again.',
                '#EF4444',
                'error'
            )
            restoreButton();
        });
        function showStatus(
            text,
            color,
            className
        ) {
            if (formStatus) {
                formStatus.textContent = text;
                formStatus.className =
                    `form-status ${className}`;
                formStatus.style.color = color;
                formStatus.style.display = 'block';
            }
        }
        function restoreButton() {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML =
                    '<i class="fas fa-paper-plane"></i> Send Message';
            }
        }
    });
});