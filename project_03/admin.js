// Admin Panel JavaScript
// This handles the admin login, dashboard, and data management

let isAdminAuthenticated = false;

// Check auth status on page load
async function checkAdminAuth() {
  try {
    const response = await fetch('/api/admin/check');
    const result = await response.json();
    if (result.authenticated) {
      isAdminAuthenticated = true;
      showAdminDashboard();
    } else {
      showAdminLogin();
    }
  } catch (error) {
    showAdminLogin();
  }
}

function showAdminLogin() {
  const loginDiv = document.getElementById('adminLogin');
  const dashboardDiv = document.getElementById('adminDashboard');
  if (loginDiv) loginDiv.style.display = 'block';
  if (dashboardDiv) dashboardDiv.style.display = 'none';
}

function showAdminDashboard() {
  const loginDiv = document.getElementById('adminLogin');
  const dashboardDiv = document.getElementById('adminDashboard');
  if (loginDiv) loginDiv.style.display = 'none';
  if (dashboardDiv) dashboardDiv.style.display = 'block';
  loadAdminData();
}

// Login handler
async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  const statusEl = document.getElementById('adminLoginStatus');

  try {
    statusEl.textContent = 'Logging in...';
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    
    if (result.success) {
      isAdminAuthenticated = true;
      showAdminDashboard();
    } else {
      statusEl.textContent = result.message || 'Login failed';
      statusEl.style.color = 'var(--error)';
    }
  } catch (error) {
    statusEl.textContent = 'Login error';
    statusEl.style.color = 'var(--error)';
  }
}

// Load admin data
async function loadAdminData() {
  try {
    const response = await fetch('/api/admin/submissions');
    const result = await response.json();
    
    if (result.success) {
      displaySubmissions(result.data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function displaySubmissions(data) {
  // Display contacts
  const contactList = document.getElementById('contactList');
  const contactCount = document.getElementById('contactCount');
  if (contactList && data.contacts) {
    contactList.innerHTML = data.contacts.map(c => `
      <div class="admin-item">
        <strong>${c.name}</strong> - ${c.email}<br>
        <small>${c.message.substring(0, 100)}...</small>
        <small class="admin-date">${new Date(c.createdAt).toLocaleDateString()}</small>
      </div>
    `).join('');
    if (contactCount) contactCount.textContent = `(${data.contacts.length})`;
  }

  // Display inquiries
  const inquiryList = document.getElementById('inquiryList');
  const inquiryCount = document.getElementById('inquiryCount');
  if (inquiryList && data.serviceInquiries) {
    inquiryList.innerHTML = data.serviceInquiries.map(i => `
      <div class="admin-item">
        <strong>${i.name}</strong> - ${i.email}<br>
        <small>${i.serviceType}</small>
        <small class="admin-date">${new Date(i.createdAt).toLocaleDateString()}</small>
      </div>
    `).join('');
    if (inquiryCount) inquiryCount.textContent = `(${data.serviceInquiries.length})`;
  }

  // Display newsletter
  const subscriberList = document.getElementById('subscriberList');
  const subscriberCount = document.getElementById('subscriberCount');
  if (subscriberList && data.newsletters) {
    subscriberList.innerHTML = data.newsletters.map(n => `
      <div class="admin-item">
        ${n.email}
        <span class="admin-badge">${n.status}</span>
        <small class="admin-date">${new Date(n.createdAt).toLocaleDateString()}</small>
      </div>
    `).join('');
    if (subscriberCount) subscriberCount.textContent = `(${data.newsletters.length})`;
  }

  // Display stats
  const stats = data.stats;
  if (document.getElementById('contactCount')) {
    // Stats already shown in counts above
  }
}

// Tab switching
function initAdminTabs() {
  const tabs = document.querySelectorAll('[data-admin-tab]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Hide all tab contents
      document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.style.display = 'none';
      });
      
      // Show selected tab
      const tabName = tab.dataset.adminTab;
      const content = document.getElementById(`tab-${tabName}`);
      if (content) content.style.display = 'block';
    });
  });
}

// Settings form
async function handleSettingsUpdate(e) {
  e.preventDefault();
  const email = document.getElementById('newEmail').value;
  const password = document.getElementById('newPassword').value;
  const statusEl = document.getElementById('adminSettingsStatus');

  try {
    const response = await fetch('/api/admin/update-credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    
    if (result.success) {
      statusEl.textContent = 'Credentials updated!';
      statusEl.style.color = 'var(--success)';
    } else {
      statusEl.textContent = result.message || 'Update failed';
      statusEl.style.color = 'var(--error)';
    }
  } catch (error) {
    statusEl.textContent = 'Error updating credentials';
    statusEl.style.color = 'var(--error)';
  }
}

// Logout
async function handleLogout() {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
    isAdminAuthenticated = false;
    showAdminLogin();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Only run on admin page
  if (document.getElementById('adminLogin') || document.getElementById('adminDashboard')) {
    checkAdminAuth();
    initAdminTabs();
    
    // Attach event listeners
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) loginForm.addEventListener('submit', handleAdminLogin);
    
    const settingsForm = document.getElementById('adminSettingsForm');
    if (settingsForm) settingsForm.addEventListener('submit', handleSettingsUpdate);
    
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  }
});
