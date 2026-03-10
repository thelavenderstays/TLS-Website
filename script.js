document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.05)';
            navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        }
    });

    // 2. Trailing Lavender Flowers Effect (Home Page focus, but active on mousemove)
    const flowerContainer = document.getElementById('flower-container');
    const heroSection = document.getElementById('home');
    
    // Simple HTML for the trailing flower using the provided image
    const flowerSvg = `
        <img src="flower_newest.png" alt="" style="width: 100%; height: 100%; object-fit: contain;">
    `;

    let lastFlowerTime = 0;
    const customCursor = document.getElementById('custom-cursor');

    document.addEventListener('mousemove', (e) => {
        // Move the custom cursor
        if (customCursor) {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        }

        // Spawn trailing flowers everywhere (slower breed rate)
        const now = Date.now();
        if (now - lastFlowerTime > 150) { // spawn every 150ms
            createFlower(e.clientX, e.clientY);
            lastFlowerTime = now;
        }
    });

    function createFlower(x, y) {
        const flower = document.createElement('div');
        flower.className = 'trailing-flower';
        flower.innerHTML = flowerSvg;
        
        // Make the trailing flowers size 150px
        const size = 150;
        const rotation = Math.random() * 360;
        
        flower.style.width = `${size}px`;
        flower.style.height = `${size}px`;
        flower.style.left = `${x}px`;
        flower.style.top = `${y}px`;
        flower.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        
        flowerContainer.appendChild(flower);

        // Animate out
        setTimeout(() => {
            flower.style.transform = `translate(-50%, ${-50 + (Math.random() * 100 - 50)}px) rotate(${rotation + 90}deg) scale(0)`;
            flower.style.opacity = '0';
        }, 50);

        // Remove from DOM after longer duration
        setTimeout(() => {
            flower.remove();
        }, 2000);
    }

    // 3. Gallery Parallax Effect
    // The images will subtly shift when the mouse moves over the gallery section
    const gallerySection = document.getElementById('gallery');
    const galleryItems = document.querySelectorAll('.gallery-item');

    gallerySection.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const percentX = (x - centerX) / centerX; // -1 to 1
        const percentY = (y - centerY) / centerY; // -1 to 1

        galleryItems.forEach(item => {
            const speed = parseFloat(item.getAttribute('data-speed')) || 1;
            // Calculate movement based on speed attribute
            const moveX = percentX * speed * 20; // max 20px movement
            const moveY = percentY * speed * 20;
            
            // Apply a slight 3D rotation based on mouse position
            const rotateX = -percentY * speed * 5; 
            const rotateY = percentX * speed * 5;

            item.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });

    gallerySection.addEventListener('mouseleave', () => {
        // Reset transforms when mouse leaves gallery
        galleryItems.forEach(item => {
            item.style.transform = 'translate(0px, 0px) rotateX(0deg) rotateY(0deg)';
        });
    });

    // 4. Form Submission Prevent Default (Placeholder)
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your inquiry! The Lavender Stays team will contact you shortly.');
            bookingForm.reset();
        });
    }

    // 5. Mobile Menu Hamburger
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'rgba(255,255,255,0.98)';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            }
        });
    }
    // 6. Lightbox for Gallery Images
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.lightbox-close');

    if (lightbox && galleryItems) {
        galleryItems.forEach(item => {
            const img = item.querySelector('img');
            // Adding a pointer cursor hint
            item.style.cursor = 'pointer';
            
            item.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = img.src;
            });
        });

        // Close lightbox when clicking the X
        if (closeLightbox) {
            closeLightbox.addEventListener('click', () => {
                lightbox.style.display = 'none';
            });
        }

        // Close lightbox when clicking anywhere outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
});
