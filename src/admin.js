// Admin Page - Manage Resources

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
    const adminLogin = document.getElementById('admin-login');
    const adminDashboard = document.getElementById('admin-dashboard');
    const loginForm = document.getElementById('admin-login-form');
    const usernameInput = document.getElementById('admin-username');
    const passwordInput = document.getElementById('admin-password');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('admin-logout-btn');
    
    const passwordSettingsForm = document.getElementById('password-settings-form');
    const newResourcePassword = document.getElementById('new-resource-password');
    const passwordSuccess = document.getElementById('password-success');
    
    const pdfUploadForm = document.getElementById('pdf-upload-form');
    const pdfTitle = document.getElementById('pdf-title');
    const pdfDescription = document.getElementById('pdf-description');
    const pdfFile = document.getElementById('pdf-file');
    const fileName = document.getElementById('file-name');
    const uploadSuccess = document.getElementById('upload-success');
    const uploadError = document.getElementById('upload-error');
    
    const adminResourcesList = document.getElementById('admin-resources-list');

    // Admin credentials (in production, this should be server-side)
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'metaladmin666';

    // Check if admin is already logged in
    checkAdminAuth();

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = usernameInput.value;
            const password = passwordInput.value;
            
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                // Success - show dashboard
                sessionStorage.setItem('adminAuthenticated', 'true');
                showDashboard();
                loginError.style.display = 'none';
                usernameInput.value = '';
                passwordInput.value = '';
            } else {
                // Failed - show error
                loginError.style.display = 'block';
                passwordInput.value = '';
            }
        });
    }

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('adminAuthenticated');
            hideDashboard();
        });
    }

    // Password settings form
    if (passwordSettingsForm) {
        passwordSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = newResourcePassword.value;
            
            if (newPassword.length >= 4) {
                localStorage.setItem('resourcePassword', newPassword);
                passwordSuccess.style.display = 'block';
                newResourcePassword.value = '';
                
                setTimeout(() => {
                    passwordSuccess.style.display = 'none';
                }, 3000);
            }
        });
    }

    // File input change handler
    if (pdfFile) {
        pdfFile.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                fileName.textContent = this.files[0].name;
            } else {
                fileName.textContent = 'No file chosen';
            }
        });
    }

    // PDF upload form
    if (pdfUploadForm) {
        pdfUploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = pdfTitle.value.trim();
            const description = pdfDescription.value.trim();
            const file = pdfFile.files[0];
            
            if (!file) {
                uploadError.textContent = 'Please select a PDF file.';
                uploadError.style.display = 'block';
                return;
            }
            
            if (file.type !== 'application/pdf') {
                uploadError.textContent = 'Please select a valid PDF file.';
                uploadError.style.display = 'block';
                return;
            }
            
            // Check file size (limit to 5MB for localStorage)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                uploadError.textContent = 'File size exceeds 5MB limit. Please use a smaller file.';
                uploadError.style.display = 'block';
                return;
            }
            
            // Read file as base64
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const pdfData = event.target.result;
                    
                    // Get existing resources
                    const resources = JSON.parse(localStorage.getItem('pdfResources') || '[]');
                    
                    // Add new resource
                    resources.push({
                        title: title,
                        description: description,
                        data: pdfData,
                        dateAdded: new Date().toISOString(),
                        fileName: file.name
                    });
                    
                    // Save to localStorage
                    localStorage.setItem('pdfResources', JSON.stringify(resources));
                    
                    // Show success message
                    uploadSuccess.style.display = 'block';
                    uploadError.style.display = 'none';
                    
                    // Reset form
                    pdfUploadForm.reset();
                    fileName.textContent = 'No file chosen';
                    
                    // Refresh resources list
                    loadAdminResources();
                    
                    setTimeout(() => {
                        uploadSuccess.style.display = 'none';
                    }, 3000);
                } catch (error) {
                    console.error('Error saving PDF:', error);
                    uploadError.textContent = 'Error saving PDF. Storage might be full.';
                    uploadError.style.display = 'block';
                }
            };
            
            reader.onerror = function() {
                uploadError.textContent = 'Error reading file. Please try again.';
                uploadError.style.display = 'block';
            };
            
            reader.readAsDataURL(file);
        });
    }

    // Check admin authentication
    function checkAdminAuth() {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
        if (isAuthenticated) {
            showDashboard();
        } else {
            hideDashboard();
        }
    }

    // Show dashboard
    function showDashboard() {
        if (adminLogin) adminLogin.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'block';
        loadAdminResources();
    }

    // Hide dashboard
    function hideDashboard() {
        if (adminLogin) adminLogin.style.display = 'block';
        if (adminDashboard) adminDashboard.style.display = 'none';
    }

    // Load resources for admin view
    function loadAdminResources() {
        const resources = JSON.parse(localStorage.getItem('pdfResources') || '[]');
        
        if (resources.length === 0) {
            adminResourcesList.innerHTML = '<p class="no-resources">No resources uploaded yet.</p>';
            return;
        }

        adminResourcesList.innerHTML = resources.map((resource, index) => `
            <div class="resource-card admin-resource-card">
                <div class="resource-icon">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="resource-info">
                    <h4>${escapeHtml(resource.title)}</h4>
                    <p>${escapeHtml(resource.description || 'No description provided.')}</p>
                    <span class="resource-date">Added: ${new Date(resource.dateAdded).toLocaleDateString()}</span>
                    <span class="resource-file">${escapeHtml(resource.fileName || 'Unknown file')}</span>
                </div>
                <div class="resource-actions">
                    <button class="btn btn-delete" onclick="deleteResource(${index})">
                        <i class="fas fa-trash"></i> Delete
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

// Delete resource function (global scope for onclick)
function deleteResource(index) {
    if (confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
        const resources = JSON.parse(localStorage.getItem('pdfResources') || '[]');
        resources.splice(index, 1);
        localStorage.setItem('pdfResources', JSON.stringify(resources));
        
        // Refresh the list
        const adminResourcesList = document.getElementById('admin-resources-list');
        if (resources.length === 0) {
            adminResourcesList.innerHTML = '<p class="no-resources">No resources uploaded yet.</p>';
        } else {
            location.reload(); // Simple refresh to update indices
        }
    }
}
