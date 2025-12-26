// Resources Page - Password Protected Content

// Hash a password using SHA-256 (async)
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
        // Re-throw a clearer error while preserving original error for debugging
        console.error('Error computing password hash using Web Crypto API:', err);
        throw new Error('Failed to compute password hash.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Mobile menu toggle
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

    // DOM Elements
    const passwordGate = document.getElementById('password-gate');
    const protectedContent = document.getElementById('protected-content');
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('resource-password');
    const passwordError = document.getElementById('password-error');
    const logoutBtn = document.getElementById('logout-btn');
    const resourcesList = document.getElementById('resources-list');

    // Check if user is already authenticated
    checkAuthentication();

    // Password form submission
    if (passwordForm) {
        passwordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const enteredPassword = passwordInput.value;
            const storedPassword = localStorage.getItem('resourcePassword');

            // If no password has been configured, do not allow access with a hardcoded default.
            if (!storedPassword) {
                if (passwordError) {
                    passwordError.textContent = 'Resources are not yet configured. Please contact the site administrator.';
                    passwordError.style.display = 'block';
                }
                passwordInput.value = '';
                return;
            }
            
            // Hash the entered password to compare with stored hash
            let hashedPassword;
            try {
                hashedPassword = await hashPassword(enteredPassword);
            } catch (err) {
                console.error('Failed to hash entered password:', err);
                if (passwordError) {
                    passwordError.textContent = 'Unable to verify password in this browser. Please try again later or use a different device.';
                    passwordError.style.display = 'block';
                }
                passwordInput.value = '';
                return;
            }
            
            // Determine whether the stored password is a SHA-256 hash (64 hex chars) or legacy plaintext
            const isStoredHash = /^[0-9a-f]{64}$/i.test(storedPassword);

            // Check if password matches (hashed by default; support legacy plaintext only for migration)
            const isValid = isStoredHash
                ? hashedPassword === storedPassword
                : enteredPassword === storedPassword;
            
            if (isValid) {
                // If we just authenticated against a legacy plaintext password, migrate it to a hash
                if (!isStoredHash) {
                    localStorage.setItem('resourcePassword', hashedPassword);
                }
                // Success - show protected content
                sessionStorage.setItem('resourcesAuthenticated', 'true');
                showProtectedContent();
                if (passwordError) {
                    passwordError.style.display = 'none';
                }
                passwordInput.value = '';
            } else {
                // Failed - show error
                if (passwordError) {
                    passwordError.textContent = 'Incorrect password. Try again, mortal!';
                    passwordError.style.display = 'block';
                }
                passwordInput.value = '';
                passwordInput.focus();
            }
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('resourcesAuthenticated');
            hideProtectedContent();
        });
    }

    // Check if user is authenticated
    function checkAuthentication() {
        const isAuthenticated = sessionStorage.getItem('resourcesAuthenticated') === 'true';
        if (isAuthenticated) {
            showProtectedContent();
        } else {
            hideProtectedContent();
        }
    }

    // Show protected content
    function showProtectedContent() {
        if (passwordGate) passwordGate.style.display = 'none';
        if (protectedContent) protectedContent.style.display = 'block';
        loadResources();
    }

    // Hide protected content
    function hideProtectedContent() {
        if (passwordGate) passwordGate.style.display = 'block';
        if (protectedContent) protectedContent.style.display = 'none';
    }

    // Load resources from localStorage
    function loadResources() {
        // Check if resourcesList element exists
        if (!resourcesList) {
            console.error('resourcesList element not found in the DOM.');
            return;
        }
        
        let resources = [];
        const storedResources = localStorage.getItem('pdfResources');

        if (storedResources) {
            try {
                resources = JSON.parse(storedResources);
            } catch (err) {
                console.error('Failed to parse pdfResources from localStorage:', err);
                resources = [];
            }
        }
        
        // Clear existing content
        while (resourcesList.firstChild) {
            resourcesList.removeChild(resourcesList.firstChild);
        }

        if (resources.length === 0) {
            const noResourcesMessage = document.createElement('p');
            noResourcesMessage.className = 'no-resources';
            noResourcesMessage.textContent = 'No resources available yet. Check back soon!';
            resourcesList.appendChild(noResourcesMessage);
            return;
        }

        resources.forEach((resource, index) => {
            const card = document.createElement('div');
            card.className = 'resource-card';

            const iconContainer = document.createElement('div');
            iconContainer.className = 'resource-icon';
            const icon = document.createElement('i');
            icon.className = 'fas fa-file-pdf';
            iconContainer.appendChild(icon);

            const info = document.createElement('div');
            info.className = 'resource-info';

            const titleEl = document.createElement('h4');
            titleEl.textContent = resource.title;

            const descriptionEl = document.createElement('p');
            descriptionEl.textContent = resource.description || 'No description provided.';

            const dateEl = document.createElement('span');
            dateEl.className = 'resource-date';
            dateEl.textContent = `Added: ${new Date(resource.dateAdded).toLocaleDateString()}`;

            info.appendChild(titleEl);
            info.appendChild(descriptionEl);
            info.appendChild(dateEl);

            const actions = document.createElement('div');
            actions.className = 'resource-actions';

            const viewButton = document.createElement('button');
            viewButton.className = 'btn btn-view';
            viewButton.type = 'button';
            const viewIcon = document.createElement('i');
            viewIcon.className = 'fas fa-eye';
            viewButton.appendChild(viewIcon);
            viewButton.appendChild(document.createTextNode(' View'));
            viewButton.addEventListener('click', function() {
                viewPdf(index);
            });

            actions.appendChild(viewButton);

            card.appendChild(iconContainer);
            card.appendChild(info);
            card.appendChild(actions);

            resourcesList.appendChild(card);
        });
    }
});

// View PDF function (global scope for onclick)
function viewPdf(index) {
    let resources = [];
    const storedResources = localStorage.getItem('pdfResources');
    
    if (storedResources) {
        try {
            resources = JSON.parse(storedResources);
        } catch (err) {
            console.error('Failed to parse pdfResources from localStorage:', err);
            return;
        }
    }
    
    const resource = resources[index];
    
    if (resource && resource.data) {
        // Store reference to the button that opened the modal for focus return
        const triggerButton = document.activeElement;
        
        // Create modal for PDF viewing with accessibility attributes
        const modal = document.createElement('div');
        modal.className = 'pdf-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'pdf-modal-title');
        
        const modalContent = document.createElement('div');
        modalContent.className = 'pdf-modal-content';
        
        // Close button with accessibility (use textContent instead of innerHTML for security)
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.textContent = '×';
        
        // Function to close modal and restore focus
        const closeModal = () => {
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
            // Return focus to the button that opened the modal
            if (triggerButton && typeof triggerButton.focus === 'function') {
                triggerButton.focus();
            }
        };
        
        closeBtn.addEventListener('click', closeModal);
        
        // PDF title with id for aria-labelledby
        const title = document.createElement('h3');
        title.textContent = resource.title;
        title.className = 'pdf-title';
        title.id = 'pdf-modal-title';
        
        // PDF embed with sandbox for security (omit allow-same-origin so untrusted content cannot access localStorage)
        const pdfEmbed = document.createElement('iframe');
        pdfEmbed.src = resource.data;
        pdfEmbed.className = 'pdf-viewer';
        pdfEmbed.title = resource.title;
        pdfEmbed.setAttribute('sandbox', 'allow-popups allow-forms');
        
        // Download button (using DOM manipulation instead of innerHTML for security consistency)
        const downloadBtn = document.createElement('a');
        downloadBtn.href = resource.data;
        downloadBtn.download = `${resource.title}.pdf`;
        downloadBtn.className = 'btn btn-primary download-btn';
        const downloadIcon = document.createElement('i');
        downloadIcon.className = 'fas fa-download';
        downloadBtn.appendChild(downloadIcon);
        downloadBtn.appendChild(document.createTextNode(' Download PDF'));
        
        // Append elements
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(pdfEmbed);
        modalContent.appendChild(downloadBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
        
        // Focus the close button when modal opens for keyboard accessibility
        closeBtn.focus();
        
        // Trap focus within modal
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                
                // Guard against empty focusableElements
                if (focusableElements.length === 0) {
                    e.preventDefault();
                    return;
                }
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
        
        // Close modal on background click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}
