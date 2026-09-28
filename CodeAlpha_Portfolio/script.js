const sliderTrack = document.querySelector('.slider-track');
const previousButton = document.querySelector('.slider-prev');
const nextButton = document.querySelector('.slider-next');
const projectCards = [...sliderTrack.querySelectorAll('.project-card')];

const snapCommitDistance = 48;
const coarsePointer = window.matchMedia('(pointer: coarse), (max-width: 768px)');

let activeCardFrame = 0;
let isSnapping = false;
let gestureStart = 0;

function getScrollStep() {
    if (projectCards.length < 2) {
        return projectCards[0].offsetWidth;
    }

    return projectCards[1].offsetLeft - projectCards[0].offsetLeft;
}

function clampIndex(index) {
    return Math.max(0, Math.min(projectCards.length - 1, index));
}

function updateActiveCard() {
    const trackRect = sliderTrack.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let closestCard = null;
    let closestDistance = Infinity;

    projectCards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const distance = Math.abs(trackCenter - (cardRect.left + cardRect.width / 2));

        if (distance < closestDistance) {
            closestDistance = distance;
            closestCard = card;
        }
    });

    projectCards.forEach(card => card.classList.remove('active'));
    if (closestCard) closestCard.classList.add('active');
}

function getSnapTarget() {
    const step = getScrollStep();
    const currentScroll = sliderTrack.scrollLeft;
    const delta = currentScroll - gestureStart;
    const startIndex = clampIndex(Math.round(gestureStart / step));

    if (!coarsePointer.matches) {
        return clampIndex(Math.round(currentScroll / step)) * step;
    }

    if (Math.abs(delta) < snapCommitDistance) {
        return startIndex * step;
    }

    const progress = (currentScroll - startIndex * step) / step;
    const shift = delta > 0
        ? Math.max(1, Math.round(progress))
        : Math.min(-1, Math.round(progress));

    return clampIndex(startIndex + shift) * step;
}

function snapToClosestCard() {
    const target = getSnapTarget();

    if (Math.abs(sliderTrack.scrollLeft - target) < 2) {
        updateActiveCard();
        return;
    }

    isSnapping = true;
    sliderTrack.scrollTo({ left: target, behavior: 'smooth' });
}

function onSliderScrollEnd() {
    if (isSnapping) {
        isSnapping = false;
        updateActiveCard();
        return;
    }

    snapToClosestCard();
}

function scrollSlider(direction) {
    gestureStart = sliderTrack.scrollLeft;
    isSnapping = false;
    sliderTrack.scrollBy({ left: direction * getScrollStep(), behavior: 'smooth' });
}

function initSlider() {
    previousButton.addEventListener('click', () => scrollSlider(-1));
    nextButton.addEventListener('click', () => scrollSlider(1));

    sliderTrack.addEventListener('pointerdown', () => {
        gestureStart = sliderTrack.scrollLeft;
        isSnapping = false;
    });

    sliderTrack.addEventListener('scroll', () => {
        cancelAnimationFrame(activeCardFrame);
        activeCardFrame = requestAnimationFrame(updateActiveCard);
    });

    if ('onscrollend' in window) {
        sliderTrack.addEventListener('scrollend', onSliderScrollEnd);
    } else {
        let settleTimer;

        sliderTrack.addEventListener('scroll', () => {
            clearTimeout(settleTimer);
            settleTimer = setTimeout(onSliderScrollEnd, 140);
        });
    }

    updateActiveCard();
}

function initSectionAnimation() {
    const sections = document.querySelectorAll('.animate-section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
    });

    sections.forEach(section => observer.observe(section));
}

function initNavHighlight() {
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, {
        rootMargin: '-40% 0px -50% 0px',
    });

    sections.forEach(section => observer.observe(section));
}

function initPointerParallax() {
    const shapes = document.querySelectorAll('.global-parallax-bg [data-speed]');
    const mobile = window.matchMedia('(pointer: coarse), (max-width: 768px)');

    if (mobile.matches) return;

    document.addEventListener('mousemove', event => {
        if (mobile.matches) return;

        const offsetX = event.clientX - window.innerWidth / 2;
        const offsetY = event.clientY - window.innerHeight / 2;

        shapes.forEach(shape => {
            const speed = Number(shape.dataset.speed) / 100;
            const moveX = offsetX * speed * 0.2;
            const moveY = offsetY * speed * 0.2;

            shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

function initScrollParallax() {
    const layers = document.querySelectorAll('[data-scroll-speed]');

    function updateLayers() {
        layers.forEach(layer => {
            const parentRect = layer.parentElement.getBoundingClientRect();
            const isOffscreen = parentRect.bottom < 0 || parentRect.top > window.innerHeight;

            if (isOffscreen) return;

            const speed = Number(layer.dataset.scrollSpeed) * 3;
            layer.style.transform = `translateY(${parentRect.top * speed}px)`;
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateLayers);
    });

    updateLayers();
}

initSlider();
initSectionAnimation();
initNavHighlight();
initPointerParallax();
initScrollParallax();
