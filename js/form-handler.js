/**
 * Sydney Plumbing Pro - Contact Form Handler
 * This script handles form submissions via Ajax
 * 
 * Author: Sydney Plumbing Pro
 * Version: 1.0
 */

$(document).ready(function() {
    // Handle the main contact form submission
    $("#contact-form").submit(function(e) {
        e.preventDefault();
        handleFormSubmission($(this), 'contact');
    });
    
    // Handle the quick contact form submission (on homepage and service pages)
    $("#quick-contact-form").submit(function(e) {
        e.preventDefault();
        handleFormSubmission($(this), 'quick');
    });
    
    /**
     * Process form submission
     * 
     * @param {jQuery} form - The form jQuery object
     * @param {string} formType - Type of form ('contact' or 'quick')
     */
    function handleFormSubmission(form, formType) {
        // Validate form
        if (!validateForm(form)) {
            return false;
        }
        
        // Show loading state
        const submitButton = form.find('button[type="submit"]');
        const originalButtonText = submitButton.text();
        submitButton.prop('disabled', true).text('Sending...');
        
        // Collect form data
        const formData = {
            name: form.find('#name').val(),
            phone: form.find('#phone').val(),
            email: form.find('#email').val(),
            service: form.find('#service').val(),
            message: form.find('#message').val()
        };
        
        // Add additional fields based on form type
        if (formType === 'contact') {
            formData.address = form.find('#address').val();
            formData.urgency = form.find('#urgency').val();
            formData.preferredContact = form.find('input[name="preferred-contact"]:checked').val();
        }
        
        // In a real implementation, this would be an AJAX call to a server endpoint
        // For this demo, we'll simulate the AJAX call with a timeout
        setTimeout(function() {
            // Simulate successful submission
            showSuccessMessage(form, formType);
            
            // Reset form and button
            form.trigger('reset');
            submitButton.prop('disabled', false).text(originalButtonText);
            
            // Log the data that would be sent to the server
            console.log('Form data submitted:', formData);
        }, 1500);
        
        return false;
    }
    
    /**
     * Validate form fields
     * 
     * @param {jQuery} form - The form jQuery object
     * @return {boolean} - Whether the form is valid
     */
    function validateForm(form) {
        let isValid = true;
        
        // Reset previous error messages
        form.find('.error-message').remove();
        form.find('.has-error').removeClass('has-error');
        
        // Validate name
        const nameField = form.find('#name');
        if (!nameField.val().trim()) {
            showError(nameField, 'Please enter your name');
            isValid = false;
        }
        
        // Validate phone
        const phoneField = form.find('#phone');
        const phoneValue = phoneField.val().trim();
        if (!phoneValue) {
            showError(phoneField, 'Please enter your phone number');
            isValid = false;
        } else if (!isValidPhone(phoneValue)) {
            showError(phoneField, 'Please enter a valid Australian phone number');
            isValid = false;
        }
        
        // Validate email
        const emailField = form.find('#email');
        const emailValue = emailField.val().trim();
        if (!emailValue) {
            showError(emailField, 'Please enter your email');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate service selection
        const serviceField = form.find('#service');
        if (serviceField.length && !serviceField.val()) {
            showError(serviceField, 'Please select a service');
            isValid = false;
        }
        
        // Validate message field
        const messageField = form.find('#message');
        if (!messageField.val().trim()) {
            showError(messageField, 'Please enter a brief description of your plumbing needs');
            isValid = false;
        }
        
        // Check terms and conditions if it exists
        const termsCheckbox = form.find('input[name="terms"]');
        if (termsCheckbox.length && !termsCheckbox.is(':checked')) {
            showError(termsCheckbox.closest('.form-group'), 'You must agree to the terms and conditions');
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Display error message for a form field
     * 
     * @param {jQuery} field - The field with the error
     * @param {string} message - The error message to display
     */
    function showError(field, message) {
        const formGroup = field.closest('.form-group');
        const errorElement = $('<div class="error-message"></div>').text(message);
        
        formGroup.addClass('has-error');
        formGroup.append(errorElement);
        
        // Set ARIA attributes for accessibility
        field.attr('aria-invalid', 'true');
        
        // Focus the first field with an error
        if (!$('.has-error input, .has-error select, .has-error textarea').is(':focus')) {
            field.focus();
        }
    }
    
    /**
     * Display success message after form submission
     * 
     * @param {jQuery} form - The form jQuery object
     * @param {string} formType - Type of form ('contact' or 'quick')
     */
    function showSuccessMessage(form, formType) {
        // Create success message
        const successMessage = $('<div class="form-success"></div>');
        
        if (formType === 'contact') {
            successMessage.html(`
                <h3>Thank You for Contacting Us!</h3>
                <p>Your message has been sent successfully. One of our team members will get back to you as soon as possible.</p>
                <p>For urgent plumbing emergencies, please call our emergency line directly at <a href="tel:+61XXXXXXXXX">0XXX XXX XXX</a>.</p>
            `);
        } else {
            successMessage.html(`
                <h3>Thank You!</h3>
                <p>Your request has been submitted successfully. One of our plumbers will contact you shortly.</p>
                <p>For emergencies, please call our emergency line directly at <a href="tel:+61XXXXXXXXX">0XXX XXX XXX</a>.</p>
            `);
        }
        
        // Hide the form and show success message
        form.fadeOut(300, function() {
            form.after(successMessage);
            successMessage.hide().fadeIn(300);
            
            // If this is the homepage quick form, scroll to the success message
            if (formType === 'quick' && window.location.pathname === '/index.html') {
                $('html, body').animate({
                    scrollTop: successMessage.offset().top - 100
                }, 500);
            }
        });
    }
    
    /**
     * Validate email format
     * 
     * @param {string} email - Email to validate
     * @return {boolean} - Whether the email is valid
     */
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    
    /**
     * Validate Australian phone number format
     * 
     * @param {string} phone - Phone number to validate
     * @return {boolean} - Whether the phone number is valid
     */
    function isValidPhone(phone) {
        // Basic Australian phone number validation
        // Accepts formats: 04XXXXXXXX, +61 4XX XXX XXX, 02 XXXX XXXX, etc.
        const re = /^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
        return re.test(phone);
    }
    
    /**
     * Add custom styling for form fields on focus
     */
    $('.contact-form input, .contact-form select, .contact-form textarea').on('focus', function() {
        $(this).closest('.form-group').addClass('focused');
    }).on('blur', function() {
        $(this).closest('.form-group').removeClass('focused');
    });
    
    /**
     * Clear error messages on input
     */
    $('.contact-form input, .contact-form select, .contact-form textarea').on('input change', function() {
        const formGroup = $(this).closest('.form-group');
        if (formGroup.hasClass('has-error')) {
            formGroup.removeClass('has-error');
            formGroup.find('.error-message').remove();
            $(this).attr('aria-invalid', 'false');
        }
    });
    
    /**
     * Service selection changes form behaviour
     */
    $('#service').on('change', function() {
        const value = $(this).val();
        
        // If emergency service is selected, highlight the emergency contact details
        if (value === 'emergency') {
            $('.emergency-procedure').addClass('highlighted');
            setTimeout(function() {
                $('.emergency-procedure').removeClass('highlighted');
            }, 3000);
        }
        
        // Update urgency field if it exists based on selected service
        const urgencyField = $('#urgency');
        if (urgencyField.length) {
            if (value === 'emergency') {
                urgencyField.val('emergency');
            } else if (value === 'quote' || value === 'bathroom') {
                urgencyField.val('flexible');
            } else {
                urgencyField.val('standard');
            }
        }
    });
}); 