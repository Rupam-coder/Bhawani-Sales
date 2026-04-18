document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    
    function openNav() {
        mobileNav.style.transform = 'translateX(0)';
        mobileNavOverlay.style.display = 'block';
        setTimeout(() => {
            mobileNavOverlay.style.opacity = '1';
        }, 10);
    }
    
    function closeNav() {
        mobileNav.style.transform = 'translateX(100%)';
        mobileNavOverlay.style.opacity = '0';
        setTimeout(() => {
            mobileNavOverlay.style.display = 'none';
        }, 300);
    }

    if(hamburger) hamburger.addEventListener('click', openNav);
    if(mobileNavClose) mobileNavClose.addEventListener('click', closeNav);
    if(mobileNavOverlay) mobileNavOverlay.addEventListener('click', closeNav);

    // Close mobile nav on link click
    const mobileLinks = document.querySelectorAll('.mobile-nav-list a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let currentSlide = 0;
    let slideInterval;

    function initSlider() {
        if(slides.length === 0) return;
        showSlide(currentSlide);
        startSlideTimer();
    }

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active');
            // reset animation for child content
            const elements = slide.querySelectorAll('.reveal-up');
            elements.forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; /* trigger reflow */
                el.style.animation = null;
            });
        });
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideTimer() {
        slideInterval = setInterval(nextSlide, 4000);
    }

    function resetSlideTimer() {
        clearInterval(slideInterval);
        startSlideTimer();
    }

    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideTimer();
        });
    }

    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideTimer();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            resetSlideTimer();
        });
    });

    initSlider();

    // Scroll Reveal (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if(!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const counterOptions = {
        threshold: 0.5,
        rootMargin: "0px"
    };
    
    let statsAnimated = false;

    const counterObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if(!entry.isIntersecting || statsAnimated) return;
            
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if(current < target) {
                        counter.innerText = Math.ceil(current) + (counter.getAttribute('data-suffix') || '');
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + (counter.getAttribute('data-suffix') || '');
                    }
                };
                updateCounter();
            });
            statsAnimated = true;
            observer.unobserve(entry.target);
        });
    }, counterOptions);

    const statsSection = document.querySelector('.stats-container');
    if(statsSection) {
        counterObserver.observe(statsSection);
    }
});
