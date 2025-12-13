/**
 * Wireframe Carousel Component
 * Handles navigation for Low Fidelity and High Fidelity wireframe carousels
 */

class WireframeCarousel {
    constructor(carouselId) {
        this.carousel = document.getElementById(carouselId);
        if (!this.carousel) return;

        this.trackId = carouselId.replace('Carousel', 'Track');
        this.dotsId = carouselId.replace('Carousel', 'Dots');

        this.track = document.getElementById(this.trackId);
        this.dotsContainer = document.getElementById(this.dotsId);
        this.images = this.track.querySelectorAll('.carousel-image');
        this.prevBtn = this.carousel.querySelector('.carousel-btn-prev');
        this.nextBtn = this.carousel.querySelector('.carousel-btn-next');

        this.currentIndex = 0;
        this.totalImages = this.images.length;

        this.init();
    }

    init() {
        // Create dots
        this.createDots();

        // Add event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Add click listeners to images for lightbox
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => {
                const imageSources = Array.from(this.images).map(img => img.src);
                openLightbox(imageSources, index);
            });
        });

        // Keyboard navigation - Check if carousel is active/visible first? 
        // Or strictly scoped? The current implementation adds global listener which is okay but simple.
        // Keeping it simple as per original logic.

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        if (this.track) {
            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            }, { passive: true });

            this.track.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                if (startX - endX > 50) {
                    this.next();
                } else if (endX - startX > 50) {
                    this.prev();
                }
            }, { passive: true });
        }

        // Initial update
        this.updateCarousel();
    }

    createDots() {
        for (let i = 0; i < this.totalImages; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateCarousel() {
        // Update track position
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;

        // Update dots
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentIndex === this.totalImages - 1;
        }
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }

    next() {
        if (this.currentIndex < this.totalImages - 1) {
            this.currentIndex++;
            this.updateCarousel();
        }
    }

    goToSlide(index) {
        if (index >= 0 && index < this.totalImages) {
            this.currentIndex = index;
            this.updateCarousel();
        }
    }
}

/**
 * Lightbox Component
 * Handles full-screen image viewing with navigation
 */

let lightboxImages = [];
let lightboxCurrentIndex = 0;

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

function openLightbox(images, startIndex = 0) {
    lightboxImages = images;
    lightboxCurrentIndex = startIndex;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function updateLightbox() {
    lightboxImage.src = lightboxImages[lightboxCurrentIndex];
    lightboxCounter.textContent = `${lightboxCurrentIndex + 1} / ${lightboxImages.length}`;

    // Update button states
    lightboxPrev.disabled = lightboxCurrentIndex === 0;
    lightboxNext.disabled = lightboxCurrentIndex === lightboxImages.length - 1;
}

function prevLightboxImage() {
    if (lightboxCurrentIndex > 0) {
        lightboxCurrentIndex--;
        updateLightbox();
    }
}

function nextLightboxImage() {
    if (lightboxCurrentIndex < lightboxImages.length - 1) {
        lightboxCurrentIndex++;
        updateLightbox();
    }
}

// Lightbox event listeners
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevLightboxImage);
lightboxNext.addEventListener('click', nextLightboxImage);

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
    } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
    }
});

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Low Fidelity carousel
    const lfCarousel = new WireframeCarousel('lfCarousel');

    // Initialize High Fidelity carousel
    const hfCarousel = new WireframeCarousel('hfCarousel');
});
