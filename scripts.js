// Metal Singer Portfolio - Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Video Carousel functionality
    const carousel = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Set up carousel
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Event listeners for carousel buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Auto-advance carousel every 5 seconds
    const carouselInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on mouse hover
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            clearInterval(carouselInterval);
            setInterval(nextSlide, 5000);
        });
    }

    // Video play functionality (in a real scenario, these would open YouTube embeds)
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function() {
            // This is a placeholder - in a real site this would open a YouTube video
            // or a modal with an embedded video
            const videoTitle = this.parentElement.querySelector('h4').textContent;
            alert(`Playing video: ${videoTitle}\n\nIn a live site, this would open the actual YouTube video.`);
        });
    });

    // Form submission
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const experience = document.getElementById('experience').value;
            const message = document.getElementById('message').value;
            
            // In a real scenario, this would send data to a server
            // For now, just show a confirmation
            alert(`🤘 HELL YEAH, ${name}! 🤘\n\nYour request to join the vocal slaughter has been received. We'll contact you at ${email} to schedule your introductory session. PREPARE YOUR THROAT!`);
            
            // Reset form
            bookingForm.reset();
        });
    }

    // Add scroll reveal animation
    document.addEventListener('scroll', revealOnScroll);
    
    function revealOnScroll() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('revealed');
            }
        });
    }
    
    // Call once to check for elements already in view
    revealOnScroll();

    // Add some metal-themed cursor effects for extra brutality
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        // Create a subtle effect on mouse move
        const effect = document.createElement('div');
        effect.className = 'cursor-effect';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        document.body.appendChild(effect);
        
        // Remove after animation completes
        setTimeout(() => {
            effect.remove();
        }, 500);
    });

    // Add headbanging animation to header on click
    const header = document.querySelector('header');
    if (header) {
        header.addEventListener('click', function() {
            this.classList.add('headbang');
            setTimeout(() => {
                this.classList.remove('headbang');
            }, 1000);
        });
    }
});