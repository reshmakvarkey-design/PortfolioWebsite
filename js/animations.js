// ===================================
// ANIMATIONS & INTERACTIONS
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    initParallax();
    initCursorEffects();
    initHoverAnimations();
});

// ===================================
// PARALLAX EFFECTS
// ===================================

function initParallax() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    // Subtle parallax effect on hero background
    window.addEventListener('scroll', throttle(function () {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }, 10));
}

// ===================================
// CURSOR EFFECTS (Optional Premium Touch)
// ===================================

function initCursorEffects() {
    // Only enable on devices with mouse (not touch)
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = createCustomCursor();

        document.addEventListener('mousemove', function (e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Enlarge cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', function () {
                cursor.classList.add('cursor-hover');
            });

            el.addEventListener('mouseleave', function () {
                cursor.classList.remove('cursor-hover');
            });
        });
    }
}

function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(160, 100, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease, border-color 0.2s ease;
        transform: translate(-50%, -50%);
    `;

    document.body.appendChild(cursor);

    // Add hover state styles
    const style = document.createElement('style');
    style.textContent = `
        .custom-cursor.cursor-hover {
            transform: translate(-50%, -50%) scale(1.5);
            border-color: rgba(160, 100, 255, 0.8);
        }
    `;
    document.head.appendChild(style);

    return cursor;
}

// ===================================
// HOVER ANIMATIONS
// ===================================

function initHoverAnimations() {
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // Add tilt effect to project cards
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
}

// ===================================
// TEXT ANIMATIONS
// ===================================

// Animate text on scroll
function animateTextOnScroll() {
    const textElements = document.querySelectorAll('.hero-title, .section-title');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateText(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    textElements.forEach(el => observer.observe(el));
}

function animateText(element) {
    const text = element.textContent;
    element.textContent = '';

    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.animation = `fadeInChar 0.5s ease forwards ${index * 0.03}s`;
        element.appendChild(span);
    });
}

// Add keyframe animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInChar {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================

function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, hsl(260, 70%, 60%), hsl(200, 80%, 55%));
        z-index: 9999;
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', throttle(function () {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.pageYOffset / windowHeight);
        progressBar.style.transform = `scaleX(${scrolled})`;
        progressBar.style.width = '100%';
    }, 10));
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', initScrollProgress);

// ===================================
// UTILITY: Throttle Function
// ===================================

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// PAGE TRANSITION EFFECTS
// ===================================

function initPageTransitions() {
    // Fade in page on load
    document.body.style.opacity = '0';

    window.addEventListener('load', function () {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });

    // Smooth transition when navigating away
    const links = document.querySelectorAll('a:not([href^="#"]):not([target="_blank"])');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip external links and special cases
            if (href && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                e.preventDefault();

                document.body.style.opacity = '0';

                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}

// Initialize page transitions
document.addEventListener('DOMContentLoaded', initPageTransitions);

// ===================================
// GRADIENT ANIMATION
// ===================================

function initGradientAnimation() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    let hue = 260;

    setInterval(() => {
        hue = (hue + 1) % 360;
        hero.style.background = `
            radial-gradient(ellipse at top, hsla(${hue}, 70%, 60%, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, hsla(${(hue + 60) % 360}, 80%, 55%, 0.1) 0%, transparent 50%),
            hsl(240, 15%, 8%)
        `;
    }, 100);
}

// Uncomment to enable animated gradient (can be performance-intensive)
// document.addEventListener('DOMContentLoaded', initGradientAnimation);
