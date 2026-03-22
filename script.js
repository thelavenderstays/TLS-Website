document.addEventListener('DOMContentLoaded', () => {
    // 0. Scroll Animations (Intersection Observer)
    const animateElements = document.querySelectorAll('.fade-up, .fade-in');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animateElements.forEach(el => observer.observe(el));

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

    // 7. Dynamic Room & Guest Selection
    const roomsContainer = document.getElementById('rooms-container');
    const addRoomBtn = document.getElementById('add-room-btn');
    let roomCount = 1;
    const MAX_ROOMS = 5;

    // Generate Age Select HTML
    function getAgeSelectHTML(index) {
        return `
            <div class="form-group" style="flex: 1 1 120px; animation: fadeIn 0.3s ease;">
                <label>Child ${index} Age</label>
                <select required style="height: 100%;">
                    <option value="" disabled selected>Select Age</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="4">4 Years</option>
                    <option value="5">5 Years</option>
                    <option value="6">6 Years</option>
                </select>
            </div>
        `;
    }

    // Handle Children Change
    function handleChildrenChange(e) {
        if (!e.target.classList.contains('children-select')) return;

        const count = parseInt(e.target.value);
        const roomEntry = e.target.closest('.room-entry');
        const agesContainer = roomEntry.querySelector('.children-ages-container');

        agesContainer.innerHTML = ''; // Clear existing

        for (let i = 1; i <= count; i++) {
            agesContainer.insertAdjacentHTML('beforeend', getAgeSelectHTML(i));
        }
    }

    if (roomsContainer) {
        // Attach delegated event listener for children selects
        roomsContainer.addEventListener('change', handleChildrenChange);

        // Handle Remove Room
        roomsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-room-btn')) {
                const roomEntry = e.target.closest('.room-entry');
                roomEntry.remove();
                roomCount--;

                // Re-index remaining rooms
                const entries = roomsContainer.querySelectorAll('.room-entry');
                entries.forEach((entry, index) => {
                    const roomNum = index + 1;
                    entry.dataset.room = roomNum;
                    entry.querySelector('h4 span').textContent = 'Room ' + roomNum;
                });

                if (roomCount < MAX_ROOMS && addRoomBtn) {
                    addRoomBtn.style.display = 'block';
                }
            }
        });
    }

    // Handle Add Room
    if (addRoomBtn && roomsContainer) {
        addRoomBtn.addEventListener('click', () => {
            if (roomCount >= MAX_ROOMS) return;

            roomCount++;

            const newRoom = document.createElement('div');
            newRoom.className = 'room-entry';
            newRoom.dataset.room = roomCount;
            newRoom.style.cssText = 'display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; background: #f8f6fc; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--lavender-100); animation: fadeIn 0.5s ease;';

            newRoom.innerHTML = `
                <h4 style="flex: 1 1 100%; margin: 0; color: var(--indigo); display: flex; justify-content: space-between; align-items: center;">
                    <span>Room ${roomCount}</span>
                    <button type="button" class="remove-room-btn" style="background: transparent; border: none; color: #dc3545; cursor: pointer; font-size: 0.9rem; text-decoration: underline;">Remove</button>
                </h4>
                <div class="form-group" style="flex: 1 1 120px;">
                    <label>Adults</label>
                    <select class="adults-select" required style="height: 100%;">
                        <option value="1">1</option>
                        <option value="2" selected>2</option>
                        <option value="3">3</option>
                    </select>
                </div>
                <div class="form-group" style="flex: 1 1 120px;">
                    <label>Children</label>
                    <select class="children-select" required style="height: 100%;">
                        <option value="0" selected>0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>
                <!-- Age selects injected here by JS -->
                <div class="children-ages-container" style="flex: 1 1 100%; display: flex; flex-wrap: wrap; gap: 1rem;"></div>
            `;

            roomsContainer.appendChild(newRoom);

            if (roomCount >= MAX_ROOMS) {
                addRoomBtn.style.display = 'none';
            }
        });
    }

    // 8. Date Constraints
    const checkInInput = document.getElementById('checkInInput');
    const checkOutInput = document.getElementById('checkOutInput');

    if (checkInInput && checkOutInput) {
        const today = new Date();
        // Flatpickr setup to force DD/MM/YYYY and maintain restrictions safely across all browsers
        const checkOutPicker = flatpickr(checkOutInput, {
            dateFormat: "d/m/Y",
            minDate: "today",
            maxDate: new Date().fp_incr(180), // 180 days from now
            disableMobile: true // Forces the rich flatpickr UI even on mobile
        });

        flatpickr(checkInInput, {
            dateFormat: "d/m/Y",
            minDate: "today",
            maxDate: new Date().fp_incr(180),
            disableMobile: true,
            onChange: function (selectedDates, dateStr, instance) {
                // Dynamically update checkout minDate when checkin is selected
                checkOutPicker.set('minDate', dateStr);

                // If the selected checkIn is after the current checkOut, clear checkOut
                const currentCheckOutStr = checkOutInput.value;
                if (currentCheckOutStr) {
                    const checkInDate = selectedDates[0];
                    const outParts = currentCheckOutStr.split('/');
                    const outDate = new Date(outParts[2], outParts[1] - 1, outParts[0]);

                    if (checkInDate > outDate) {
                        checkOutPicker.clear();
                    }
                }
            }
        });
    }

    // Handle Booking Form Submission directly to Google Sheets
    const stayBookingForm = document.getElementById('stay-booking-form');
    // Important: Replace this URL with your actual Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzySamHjKgy4YlEEB1fKTt_alMdo_q6XiMXNx1CZpdkYxV7ih1lw-XZ8tTB6D08MGpT/exec';

    if (stayBookingForm) {
        stayBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = stayBookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            // 1. Gather basic input fields
            const formData = new FormData(stayBookingForm);
            // Dates are already formatted as DD/MM/YYYY natively by Flatpickr!

            // 2. Serialize the complex Rooms UI into a single clear text string
            let roomDetailsText = '';
            const roomEntries = roomsContainer.querySelectorAll('.room-entry');
            roomEntries.forEach((entry) => {
                const roomNum = entry.dataset.room;
                const adults = entry.querySelector('.adults-select').value;
                const children = entry.querySelector('.children-select').value;

                roomDetailsText += `Room ${roomNum}: [${adults} Adults, ${children} Children`;

                if (parseInt(children) > 0) {
                    const ageSelects = entry.querySelectorAll('.children-ages-container select');
                    const ages = Array.from(ageSelects).map(s => s.value).join(', ');
                    roomDetailsText += ` (Ages: ${ages})`;
                }
                roomDetailsText += `] | `;
            });

            // Append the serialized room data to the payload
            formData.append('roomDetails', roomDetailsText.replace(/ \| $/, '')); // Trim trailing pipe

            // Convert to URLSearchParams for x-www-form-urlencoded format
            const params = new URLSearchParams(formData);

            // 3. Send to Google Sheets Web App
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            })
                // When using no-cors mode, the response is opaque. We can assume success if the promise resolves.
                .then(() => {
                    // Calculate details for dynamic notification popup
                    const custName = formData.get('customerName') || 'Guest';
                    const cinStr = formData.get('checkIn');
                    const coutStr = formData.get('checkOut');
                    
                    let totalNights = 0;
                    if (cinStr && coutStr) {
                        const cinParts = cinStr.split('/');
                        const coutParts = coutStr.split('/');
                        const d1 = new Date(cinParts[2], cinParts[1] - 1, cinParts[0]);
                        const d2 = new Date(coutParts[2], coutParts[1] - 1, coutParts[0]);
                        const diffTime = d2 - d1;
                        totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                    }

                    let totalAdults = 0;
                    let totalChildren = 0;
                    let numRooms = 0;
                    
                    roomsContainer.querySelectorAll('.room-entry').forEach(room => {
                        numRooms++;
                        totalAdults += parseInt(room.querySelector('.adults-select').value) || 0;
                        totalChildren += parseInt(room.querySelector('.children-select').value) || 0;
                    });

                    const totalPeople = totalAdults + totalChildren;

                    const successHtml = `
                        <div style="text-align: center; margin-bottom: 20px;">
                            <h3 style="color: var(--lavender-dark);">Booking Enquiry Sent! ✓</h3>
                        </div>
                        <p style="font-size: 1.1rem; color: var(--text-dark);">Dear <strong>${custName}</strong>,</p>
                        <p style="color: var(--text-light);">Thank you for your enquiry. We will get back to you with the details in sometime.</p>
                        <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--lavender-200);">
                        <p style="color: var(--text-dark); margin-bottom: 10px;"><strong>Your enquiry summary is:</strong></p>
                        <ul style="list-style: none; padding: 0; line-height: 2; margin-bottom: 20px; color: var(--text-light);">
                            <li><strong style="color: var(--text-dark);">Date:</strong> ${cinStr} to ${coutStr}</li>
                            <li><strong style="color: var(--text-dark);">Total no of nights:</strong> ${totalNights}</li>
                            <li><strong style="color: var(--text-dark);">Total No of rooms:</strong> ${numRooms}</li>
                            <li><strong style="color: var(--text-dark);">Total number of people:</strong> ${totalPeople} (${totalAdults} Adults, ${totalChildren} Children)</li>
                        </ul>
                        <button id="book-another-btn" class="btn primary-btn" style="width: 100%; height: 50px; cursor: pointer;">Submit Another Enquiry</button>
                    `;

                    const successBox = document.getElementById('booking-success-message');
                    if (successBox) {
                        successBox.innerHTML = successHtml;
                        successBox.style.display = 'block';
                        stayBookingForm.style.display = 'none';

                        // Setup Reset Button
                        document.getElementById('book-another-btn').addEventListener('click', () => {
                            successBox.style.display = 'none';
                            stayBookingForm.style.display = 'flex';
                            stayBookingForm.reset();
                            roomsContainer.innerHTML = '';
                            roomCount = 0;
                            if (addRoomBtn) addRoomBtn.style.display = 'block';
                            addRoomBtn.click();
                        });
                    } else {
                        // Fallback highly unlikely
                        alert(`Dear ${custName},\nThank you for your enquiry.\nWe will get back to you with the details in sometime.\n\nYour enquiry summary is:\nDate: ${cinStr} to ${coutStr}\nTotal no of nights: ${totalNights}\nTotal No of rooms: ${numRooms}\nTotal number of people: ${totalPeople} (${totalAdults} Adults, ${totalChildren} Children)`);
                        stayBookingForm.reset();
                        // Reset rooms UI back to 1 room
                        roomsContainer.innerHTML = '';
                        roomCount = 0;
                        if (addRoomBtn) addRoomBtn.style.display = 'block';
                        addRoomBtn.click();
                    }
                })
                .catch(error => {
                    console.error('Submission Error:', error);
                    alert('There was an issue testing the network connection, but your booking inquiry may have routed safely. Please try again later.');
                    stayBookingForm.reset();
                    roomsContainer.innerHTML = '';
                    roomCount = 0;
                    if (addRoomBtn) addRoomBtn.style.display = 'block';
                    addRoomBtn.click();
                })
                .finally(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
