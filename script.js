document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Scroll Animation Observer for rich dynamic experience
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Carousel Logic
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        let images = Array.from(track.querySelectorAll('.carousel-img'));
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        let currentIndex = 0;

        const updateButtons = () => {
            if (images.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }
        };

        const updateCarousel = () => {
            images.forEach((img, index) => {
                if (index === currentIndex) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });
        };

        // Dynamically load additional images in the folder (2.jpeg, 3.jpeg, etc.)
        const firstImg = images[0];
        if (firstImg) {
            const srcAttr = firstImg.getAttribute('src');
            const srcMatch = srcAttr.match(/(.*\/)1\.(jpeg|jpg|png)$/i);
            
            if (srcMatch) {
                const basePath = srcMatch[1];
                const ext = srcMatch[2];
                let imgIndex = 2;
                
                const loadNextImage = () => {
                    const img = new Image();
                    img.src = `${basePath}${imgIndex}.${ext}`;
                    
                    img.onload = () => {
                        img.className = 'carousel-img';
                        img.alt = firstImg.alt;
                        track.appendChild(img);
                        images.push(img);
                        imgIndex++;
                        updateButtons();
                        loadNextImage(); // try loading the next one
                    };
                    
                    img.onerror = () => {
                        // Stop attempting to load when an image is not found
                        updateButtons();
                    };
                };
                
                loadNextImage();
            }
        }

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (images.length <= 1) return;
            currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (images.length <= 1) return;
            currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        });
        
        // Initial setup
        updateButtons();
    });
});
