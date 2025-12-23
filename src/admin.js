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

    // SECURITY NOTE: These credentials are stored client-side and are visible in the source code.
    // This is a limitation of static sites without a backend server.
    // For production use with sensitive content, consider:
    // 1. Using a backend authentication service
    // 2. Using a service like Firebase Auth or Auth0
    // 3. Hosting behind a server with proper authentication
    // The admin should change these default credentials after initial setup.
    const ADMIN_USERNAME = localStorage.getItem('adminUsername') || 'admin';
    const ADMIN_PASSWORD = localStorage.getItem('adminPassword') || 'metaladmin666';

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

    // Admin credentials form
    const adminCredentialsForm = document.getElementById('admin-credentials-form');
    const newAdminUsername = document.getElementById('new-admin-username');
    const newAdminPassword = document.getElementById('new-admin-password');
    const credentialsSuccess = document.getElementById('credentials-success');

    // Derive a non-reversible hash of the password before storing it.
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    
    if (adminCredentialsForm) {
        adminCredentialsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = newAdminUsername.value.trim();
            const password = newAdminPassword.value;
            
            if (username.length >= 3 && password.length >= 6) {
                const hashedPassword = await hashPassword(password);
                localStorage.setItem('adminUsername', username);
                localStorage.setItem('adminPassword', hashedPassword);
                credentialsSuccess.style.display = 'block';
                newAdminUsername.value = '';
                newAdminPassword.value = '';
                
                setTimeout(() => {
                    credentialsSuccess.style.display = 'none';
                }, 3000);
            } else {
                alert('Username must be at least 3 characters and password at least 6 characters.');
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

        // Clear existing content
        adminResourcesList.innerHTML = '';

        resources.forEach((resource, index) => {
            const card = document.createElement('div');
            card.className = 'resource-card admin-resource-card';

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
            dateEl.textContent = 'Added: ' + new Date(resource.dateAdded).toLocaleDateString();

            const fileEl = document.createElement('span');
            fileEl.className = 'resource-file';
            fileEl.textContent = resource.fileName || 'Unknown file';

            info.appendChild(titleEl);
            info.appendChild(descriptionEl);
            info.appendChild(dateEl);
            info.appendChild(fileEl);

            const actions = document.createElement('div');
            actions.className = 'resource-actions';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-delete';
            deleteButton.type = 'button';
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fas fa-trash';
            deleteButton.appendChild(deleteIcon);
            deleteButton.appendChild(document.createTextNode(' Delete'));
            deleteButton.addEventListener('click', function() {
                deleteResource(index, loadAdminResources);
            });

            actions.appendChild(deleteButton);

            card.appendChild(iconContainer);
            card.appendChild(info);
            card.appendChild(actions);

            adminResourcesList.appendChild(card);
        });
    }
});

// Delete resource function (global scope for onclick)
function deleteResource(index, refreshCallback) {
    if (confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
        const resources = JSON.parse(localStorage.getItem('pdfResources') || '[]');
        resources.splice(index, 1);
        localStorage.setItem('pdfResources', JSON.stringify(resources));
        
        // Refresh the resources list using the provided callback
        if (typeof refreshCallback === 'function') {
            refreshCallback();
        } else {
            // Fallback: rebuild the list manually
            const adminResourcesList = document.getElementById('admin-resources-list');
            if (adminResourcesList) {
                if (resources.length === 0) {
                    const noResourcesMsg = document.createElement('p');
                    noResourcesMsg.className = 'no-resources';
                    noResourcesMsg.textContent = 'No resources uploaded yet.';
                    adminResourcesList.innerHTML = '';
                    adminResourcesList.appendChild(noResourcesMsg);
                }
                // If there are still resources but no callback, the list will be stale
                // This fallback scenario should rarely occur since we always pass the callback
            }
        }
    }
}
