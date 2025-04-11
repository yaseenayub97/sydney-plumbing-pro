/**
 * Sydney Plumbing Pro - Main JavaScript
 * Author: Sydney Plumbing Pro
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation menu toggle for mobile
    initMobileNav();
    
    // Initialize dropdown menus for mobile
    initDropdowns();
    
    // Initialize testimonials carousel
    initTestimonialsCarousel();
    
    // Initialize form validation
    initFormValidation();
    
    // Add smooth scrolling for anchor links
    initSmoothScroll();

    // Initialize FAQ accordion for service pages
    initFaqAccordion();
});

/**
 * Initialize mobile navigation menu toggle
 */
function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger to X
        const bars = menuToggle.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.toggle('active'));
        
        // Toggle aria-expanded attribute for accessibility
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !expanded);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navMenu.contains(event.target) || menuToggle.contains(event.target);
        
        if (!isClickInside && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.querySelectorAll('.bar').forEach(bar => bar.classList.remove('active'));
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Initialize dropdown menus for mobile view
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        // For mobile: toggle dropdown on click
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                // Only apply this behavior on mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
        
        // Add keyboard accessibility
        dropdown.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdown.classList.remove('active');
                dropdown.querySelector('.dropdown-toggle').focus();
            }
        });
    });
}

/**
 * Initialize testimonials carousel
 */
function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    const prevButton = document.querySelector('.prev-testimonial');
    const nextButton = document.querySelector('.next-testimonial');
    
    if (!carousel || !prevButton || !nextButton) return;
    
    let currentIndex = 0;
    const testimonials = carousel.querySelectorAll('.testimonial-card');
    const totalItems = testimonials.length;
    
    // Set initial position
    updateCarouselPosition();
    
    // Add event listeners for the next and previous buttons
    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarouselPosition();
    });
    
    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarouselPosition();
    });
    
    // Function to update carousel position
    function updateCarouselPosition() {
        // Determine how many items to show based on screen width
        let itemsToShow = 3;
        if (window.innerWidth <= 1024 && window.innerWidth > 768) {
            itemsToShow = 2;
        } else if (window.innerWidth <= 768) {
            itemsToShow = 1;
        }
        
        // For small screens, slide one at a time
        if (itemsToShow === 1) {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        } else {
            // For larger screens, handle multiple visible items
            // Only scroll to the next set when reaching the end of the current set
            const maxIndex = totalItems - itemsToShow;
            const adjustedIndex = Math.min(currentIndex, maxIndex);
            carousel.style.transform = `translateX(-${adjustedIndex * (100 / itemsToShow)}%)`;
        }
        
        // Update ARIA attributes for accessibility
        testimonials.forEach((testimonial, index) => {
            const isVisible = (index >= currentIndex && index < currentIndex + itemsToShow);
            testimonial.setAttribute('aria-hidden', !isVisible);
        });
    }
    
    // Update carousel on window resize
    window.addEventListener('resize', updateCarouselPosition);
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const contactForm = document.getElementById('quick-contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const service = document.getElementById('service');
        const message = document.getElementById('message');
        
        // Basic validation
        let isValid = true;
        
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        } else {
            removeError(name);
        }
        
        if (!phone.value.trim()) {
            showError(phone, 'Please enter your phone number');
            isValid = false;
        } else if (!isValidPhone(phone.value.trim())) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        } else {
            removeError(phone);
        }
        
        if (!email.value.trim()) {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            removeError(email);
        }
        
        if (!service.value) {
            showError(service, 'Please select a service');
            isValid = false;
        } else {
            removeError(service);
        }
        
        // If form is valid, submit via AJAX
        if (isValid) {
            // In a real implementation, you would use AJAX to submit the form
            // For this example, we'll simulate a successful submission
            submitForm(contactForm);
        }
    });
    
    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
        
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorElement);
        }
        
        input.setAttribute('aria-invalid', 'true');
        formGroup.classList.add('has-error');
    }
    
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.setAttribute('aria-invalid', 'false');
        formGroup.classList.remove('has-error');
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    
    function isValidPhone(phone) {
        // Basic validation for Australian phone numbers
        const re = /^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
        return re.test(phone);
    }
    
    function submitForm(form) {
        // Show loading indicator
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Simulate AJAX request with timeout
        setTimeout(function() {
            // Hide the form
            form.style.display = 'none';
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = `
                <h3>Thank You!</h3>
                <p>Your request has been submitted successfully. One of our team members will contact you shortly.</p>
                <p>For emergencies, please call our emergency line directly at <a href="tel:+61XXXXXXXXX">0XXX XXX XXX</a>.</p>
            `;
            
            form.parentNode.insertBefore(successMessage, form.nextSibling);
            
            // Reset form
            form.reset();
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }, 1500);
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Get the target's position, accounting for header height
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
                
                // Set focus to the target element for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                targetElement.removeAttribute('tabindex');
            }
        });
    });
}

/**
 * Detect emergency hours and update CTA accordingly
 * Considers emergency hours as outside 7:00 AM - 6:00 PM Monday-Friday
 */
function updateEmergencyStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    // Define business hours (7:00 AM - 6:00 PM, Monday-Friday)
    const isWeekend = day === 0 || day === 6; // Sunday or Saturday
    const isAfterHours = hour < 7 || hour >= 18;
    
    // Check if current time is outside business hours
    const isEmergencyHours = isWeekend || isAfterHours;
    
    // Update elements based on emergency hours
    const emergencyElements = document.querySelectorAll('.emergency-highlight');
    
    emergencyElements.forEach(element => {
        if (isEmergencyHours) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

// Run once on page load
updateEmergencyStatus();

// Run every minute to keep updated
setInterval(updateEmergencyStatus, 60000);

/**
 * Initialize FAQ accordion functionality for service pages
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', function() {
            // Toggle current item
            item.classList.toggle('active');
            
            // Update toggle icon
            if (item.classList.contains('active')) {
                toggle.textContent = '-';
            } else {
                toggle.textContent = '+';
            }
        });
    });
} 