// Background Music Control
let isPlaying = false;
const backgroundMusic = document.getElementById('backgroundMusic');

// Initialize Audio
function initializeAudio() {
    if (backgroundMusic) {
        backgroundMusic.volume = 0.4;
    }
}

// Toggle Music
function toggleMusic() {
    if (!isPlaying && backgroundMusic) {
        backgroundMusic.play()
            .then(() => {
                isPlaying = true;
            })
            .catch(e => {
                console.log('Music playback prevented:', e);
            });
    }
}

// Create Stars Animation
function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;

    // Clear existing stars
    starsContainer.innerHTML = '';

    // Create new stars
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 8}s`;
        star.style.animationDuration = `${Math.random() * 3 + 5}s`;
        starsContainer.appendChild(star);
    }
}

// Update Content
function updateContent() {
    const contentDiv = document.getElementById('content');
    const image = document.getElementById('beautyImage');
    const quote = document.getElementById('quote');
    const loader = document.getElementById('loader');

    // Start music on first interaction
    if (!isPlaying) {
        toggleMusic();
    }

    // Fade out content
    if (contentDiv) {
        contentDiv.style.opacity = "0";
        setTimeout(() => {
            contentDiv.classList.add('hidden');
            if (loader) loader.classList.remove('hidden');

            fetch('/get_content')
                .then(response => response.json())
                .then(data => {
                    const img = new Image();
                    img.onload = () => {
                        if (image) image.src = img.src;
                        if (quote) animateText(quote, data.quote);

                        if (loader) loader.classList.add('hidden');
                        contentDiv.classList.remove('hidden');

                        requestAnimationFrame(() => {
                            contentDiv.style.opacity = "1";
                        });
                    };
                    img.src = '/static/images/' + data.image;
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (loader) loader.classList.add('hidden');
                    if (quote) quote.textContent = "✧ Loading beauty... ✧";

                    contentDiv.classList.remove('hidden');
                    contentDiv.style.opacity = "1";
                });
        }, 300);
    }
}

// Text Animation
function animateText(element, text) {
    if (!element) return;

    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';

    setTimeout(() => {
        element.textContent = text;
        requestAnimationFrame(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }, 100);
}

// Parallax Effect
function initParallax() {
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            // Move background elements
            const luxuryBg = document.querySelector('.luxury-background');
            const nebula = document.querySelector('.nebula');

            if (luxuryBg) {
                luxuryBg.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
            }

            if (nebula) {
                nebula.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
            }
        });
    });
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeAudio();
    createStars();
    initParallax();

    // Button handler
    const elegantButton = document.getElementById('showLove');
    if (elegantButton) {
        let isProcessing = false;

        elegantButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (isProcessing) return;

            isProcessing = true;
            elegantButton.classList.add('clicked');

            setTimeout(() => {
                elegantButton.classList.remove('clicked');
            }, 200);

            updateContent();

            setTimeout(() => {
                isProcessing = false;
            }, 1000);
        });
    }

    // Periodic stars recreation
    setInterval(createStars, 20000);

    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createStars, 200);
    });
});