// Shared Utility Functions
// This file contains common functionality used across multiple pages

/**
 * Hash a password using SHA-256
 * @param {string} password - The plaintext password to hash
 * @returns {Promise<string>} The hex-encoded hash
 * @throws {Error} If Web Crypto API is unavailable or hashing fails
 */
async function hashPassword(password) {
    // Ensure Web Crypto API is available before attempting to use it
    if (typeof crypto === 'undefined' || !crypto.subtle || typeof crypto.subtle.digest !== 'function') {
        throw new Error('Secure password hashing is not supported in this environment.');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    } catch (err) {
        console.error('Error computing password hash using Web Crypto API:', err);
        throw new Error('Failed to compute password hash.');
    }
}

/**
 * Initialize mobile menu toggle functionality
 * Sets up click handler for mobile menu button to show/hide navigation
 */
function initMobileMenuToggle() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

/**
 * Update the copyright year element with the current year
 * @param {string} [elementId='current-year'] - The ID of the element to update
 */
function updateCopyrightYear(elementId = 'current-year') {
    const yearElement = document.getElementById(elementId);
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize common page elements (copyright year and mobile menu)
 * Call this from DOMContentLoaded event handler
 */
function initCommonElements() {
    updateCopyrightYear();
    initMobileMenuToggle();
}

// Export functions for use in other modules (if using ES modules)
// For now, these are available globally when shared.js is included
