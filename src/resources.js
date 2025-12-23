// Resources Page - Password Protected Content

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
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const enteredPassword = passwordInput.value;
            // SECURITY NOTE: The default password is visible in source code.
            // Admin should set a custom password via the admin panel before sharing resources.
            // For true security, implement server-side authentication.
            const storedPassword = localStorage.getItem('resourcePassword') || 'metal666';
            
            if (enteredPassword === storedPassword) {
                // Success - show protected content
                sessionStorage.setItem('resourcesAuthenticated', 'true');
                showProtectedContent();
                passwordError.style.display = 'none';
                passwordInput.value = '';
            } else {
                // Failed - show error
                passwordError.style.display = 'block';
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
        const resources = JSON.parse(localStorage.getItem('pdfResources') || '[]');
        
        if (resources.length === 0) {
            resourcesList.innerHTML = '<p class="no-resources">No resources available yet. Check back soon!</p>';
            return;
        }

        resourcesList.innerHTML = resources.map((resource, index) => `
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="resource-info">
                    <h4>${escapeHtml(resource.title)}</h4>
                    <p>${escapeHtml(resource.description || 'No description provided.')}</p>
                    <span class="resource-date">Added: ${new Date(resource.dateAdded).toLocaleDateString()}</span>
                </div>
                <div class="resource-actions">
                    <button class="btn btn-view" onclick="viewPdf(${index})">
                        <i class="fas fa-eye"></i> View
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

// View PDF function (global scope for onclick)
function viewPdf(index) {
    const resources = JSON.parse(localStorage.getItem('pdfResources') || '[]');
    const resource = resources[index];
    
    if (resource && resource.data) {
        // Create modal for PDF viewing
        const modal = document.createElement('div');
        modal.className = 'pdf-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'pdf-modal-content';
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
            document.body.classList.remove('modal-open');
        });
        
        // PDF title
        const title = document.createElement('h3');
        title.textContent = resource.title;
        title.className = 'pdf-title';
        
        // PDF embed
        const pdfEmbed = document.createElement('iframe');
        pdfEmbed.src = resource.data;
        pdfEmbed.className = 'pdf-viewer';
        pdfEmbed.title = resource.title;
        
        // Download button
        const downloadBtn = document.createElement('a');
        downloadBtn.href = resource.data;
        downloadBtn.download = resource.title + '.pdf';
        downloadBtn.className = 'btn btn-primary download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download PDF';
        
        // Append elements
        modalContent.appendChild(closeBtn);
        modalContent.appendChild(title);
        modalContent.appendChild(pdfEmbed);
        modalContent.appendChild(downloadBtn);
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
    }
}
