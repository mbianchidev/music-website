// Metal Singer Portfolio - Scripts

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("2FT4effYC4SSjt4jV"); // Replace with your actual EmailJS public key
    
    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Video Carousel functionality
    const carousel = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Initial setup - hide all slides except the first one
    function initCarousel() {
        slides.forEach((slide, index) => {
            if (index !== 0) {
                slide.style.display = 'none';
            }
        });
    }
    
    // Call initial setup
    initCarousel();

    // Set up carousel
    function updateCarousel() {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Show only the current slide
        slides[currentIndex].style.display = 'block';
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
    let carouselInterval = setInterval(nextSlide, 5000);

    // Pause auto-advance on mouse hover
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            clearInterval(carouselInterval);
            carouselInterval = setInterval(nextSlide, 5000);
        });
    }

    // YouTube Video functionality
    const carouselSlide = document.querySelectorAll('.carousel-slide');
    
    carouselSlide.forEach(slide => {
        slide.addEventListener('click', function() {
            // Get the video ID from the carousel slide
            const videoWrapper = this.querySelector('.video-wrapper');
  
            // Get the 'data-video-id' attribute value
            const videoId = videoWrapper.getAttribute('data-video-id');
  
            // Get the video title from the h4 element
            const videoTitle = this.parentElement.querySelector('h4').textContent;
            
            // Create a modal for the YouTube video
            const modal = document.createElement('div');
            modal.className = 'video-modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            
            // Close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                document.body.classList.remove('modal-open');
            });
            
            // YouTube iframe
            const iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            iframe.title = videoTitle;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            
            // Append elements
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(iframe);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            document.body.classList.add('modal-open');
            
            // Close modal on background click
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    document.body.classList.remove('modal-open');
                }
            });
        });
    });

    // Form submission with EmailJS
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = "SENDING...";
            submitButton.disabled = true;
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const request = document.getElementById('request').value;
            const message = document.getElementById('message').value;
            
            // Prepare template parameters
            const templateParams = {
                name: "Matteo Bianchi",
                email: "black.corekid00@gmail.com",
                from_name: name,
                from_email: email,
                form_request: request,
                message: message,
                reply_to: email
            };
            
            // Send email using EmailJS
            emailjs.send('service_7k7zuyd', 'template_pgu0qr7', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    alert(`🤘 HELL YEAH, ${name}! 🤘\n\nYour request has been sent. I'll contact you at ${email} to ask you questions or directly schedule an introductory call. PREPARE YOURSELF!`);
                    
                    // Reset form
                    bookingForm.reset();
                    
                    // Reset button
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    alert('Failed to send your message. Please try again or contact me directly at black.corekid00@gmail.com');
                    
                    // Reset button
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
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