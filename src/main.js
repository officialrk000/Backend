import { APPS_SCRIPT_URL } from './lib/config';

// State management
let state = {
  isLoggedIn: false,
  activeTab: 'dashboard',
  sidebarOpen: false,
  stats: { total: 0, recent: [] },
  loading: false,
  submitting: false,
  adminName: localStorage.getItem('admin_name') || ''
};

// DOM Elements
const elements = {
  loginView: document.getElementById('login-view'),
  adminView: document.getElementById('admin-view'),
  loginForm: document.getElementById('login-form'),
  loginError: document.getElementById('login-error'),
  errorMessage: document.getElementById('error-message'),
  loginBtn: document.getElementById('login-btn'),
  loginText: document.getElementById('login-text'),
  loginIcon: document.getElementById('login-icon'),
  
  sidebar: document.getElementById('sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay'),
  menuToggle: document.getElementById('menu-toggle'),
  viewTitle: document.getElementById('view-title'),
  logoutBtn: document.getElementById('logout-btn'),
  tabBtns: document.querySelectorAll('.tab-btn'),
  
  dashboardContent: document.getElementById('dashboard-content'),
  newPostContent: document.getElementById('new-post-content'),
  
  statTotal: document.getElementById('stat-total'),
  recentTableBody: document.getElementById('recent-table-body'),
  refreshStats: document.getElementById('refresh-stats'),
  refreshIcon: document.getElementById('refresh-icon'),
  
  adminForm: document.getElementById('admin-form'),
  submitBtn: document.getElementById('submit-btn'),
  submitText: document.getElementById('submit-text'),
  submitIcon: document.getElementById('submit-icon'),
  formStatus: document.getElementById('form-status')
};

// Initialize
function init() {
  const session = localStorage.getItem('admin_session');
  if (session) {
    state.isLoggedIn = true;
    state.adminName = JSON.parse(session).name;
    showView('admin');
    fetchStats();
  } else {
    showView('login');
  }
  
  lucide.createIcons();
}

// View Management
function showView(view) {
  if (view === 'admin') {
    elements.loginView.classList.add('hidden');
    elements.adminView.classList.remove('hidden');
    elements.adminView.classList.add('flex');
  } else {
    elements.loginView.classList.remove('hidden');
    elements.adminView.classList.add('hidden');
    elements.adminView.classList.remove('flex');
  }
}

function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Update UI
  elements.tabBtns.forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-100');
      btn.classList.remove('text-gray-500', 'hover:bg-gray-50', 'hover:text-blue-600');
    } else {
      btn.classList.remove('bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-100');
      btn.classList.add('text-gray-500', 'hover:bg-gray-50', 'hover:text-blue-600');
    }
  });
  
  // Toggle content
  if (tabId === 'dashboard') {
    elements.dashboardContent.classList.remove('hidden');
    elements.newPostContent.classList.add('hidden');
    elements.viewTitle.textContent = 'Overview';
    fetchStats();
  } else if (tabId === 'new_post') {
    elements.dashboardContent.classList.add('hidden');
    elements.newPostContent.classList.remove('hidden');
    elements.viewTitle.textContent = 'NEW ENTRY';
  }
  
  // Close sidebar on mobile
  if (window.innerWidth < 1024) {
    toggleSidebar(false);
  }
}

function toggleSidebar(open) {
  state.sidebarOpen = open;
  if (open) {
    elements.sidebar.classList.remove('-translate-x-full');
    elements.sidebarOverlay.classList.remove('hidden');
  } else {
    elements.sidebar.classList.add('-translate-x-full');
    elements.sidebarOverlay.classList.add('hidden');
  }
}

// Logic: Auth
async function handleLogin(e) {
  e.preventDefault();
  const mobile = document.getElementById('mobile').value;
  const password = document.getElementById('password').value;
  
  setLoginLoading(true);
  elements.loginError.classList.add('hidden');
  
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'login',
        data: { mobile, password }
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      const session = { mobile, name: result.name };
      localStorage.setItem('admin_session', JSON.stringify(session));
      state.isLoggedIn = true;
      state.adminName = result.name;
      showView('admin');
      fetchStats();
    } else {
      showLoginError(result.message || 'Invalid credentials');
    }
  } catch (err) {
    showLoginError('Network error. Check console.');
    console.error(err);
  } finally {
    setLoginLoading(false);
  }
}

function setLoginLoading(loading) {
  elements.loginBtn.disabled = loading;
  elements.loginText.textContent = loading ? 'Wait...' : 'Login';
  if (loading) {
    elements.loginIcon.classList.add('animate-spin');
    elements.loginIcon.setAttribute('data-lucide', 'loader-2');
  } else {
    elements.loginIcon.classList.remove('animate-spin');
    elements.loginIcon.setAttribute('data-lucide', 'log-in');
  }
  lucide.createIcons();
}

function showLoginError(msg) {
  elements.errorMessage.textContent = msg;
  elements.loginError.classList.remove('hidden');
}

function handleLogout() {
  localStorage.removeItem('admin_session');
  state.isLoggedIn = false;
  showView('login');
}

// Logic: Stats
async function fetchStats() {
  if (state.loading) return;
  state.loading = true;
  elements.refreshIcon.classList.add('animate-spin');
  
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'getStats' })
    });
    const data = await response.json();
    state.stats = data;
    renderStats();
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  } finally {
    state.loading = false;
    elements.refreshIcon.classList.remove('animate-spin');
  }
}

function renderStats() {
  elements.statTotal.textContent = state.stats.total || 0;
  
  if (state.stats.recent && state.stats.recent.length > 0) {
    elements.recentTableBody.innerHTML = state.stats.recent.map(entry => `
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="px-4 py-3"><p class="line-clamp-1">${entry.postName || 'N/A'}</p></td>
        <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase">${entry.formType || 'N/A'}</span></td>
        <td class="px-4 py-3 text-gray-500">${entry.submittedBy || 'N/A'}</td>
        <td class="px-4 py-3">
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span class="text-[10px] text-gray-600">Live</span>
          </div>
        </td>
      </tr>
    `).join('');
  } else {
    elements.recentTableBody.innerHTML = `
      <tr><td colspan="4" class="p-10 text-center text-gray-400 font-bold">No records found.</td></tr>
    `;
  }
}

// Logic: Form Submission
async function handleFormSubmit(e) {
  e.preventDefault();
  if (state.submitting) return;
  
  const formData = new FormData(elements.adminForm);
  const data = Object.fromEntries(formData.entries());
  
  state.submitting = true;
  setFormSubmitting(true);
  hideFormStatus();
  
  try {
    const session = JSON.parse(localStorage.getItem('admin_session') || '{}');
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'submitData',
        data: {
          ...data,
          submittedBy: session.name || 'Unknown',
          timestamp: new Date().toISOString()
        }
      })
    });
    
    const result = await response.json();
    if (result.success) {
      showFormStatus('Saved!', 'emerald');
      elements.adminForm.reset();
    } else {
      showFormStatus('Error!', 'red');
    }
  } catch (err) {
    showFormStatus('Error!', 'red');
    console.error(err);
  } finally {
    state.submitting = false;
    setFormSubmitting(false);
  }
}

function setFormSubmitting(loading) {
  elements.submitBtn.disabled = loading;
  elements.submitText.textContent = loading ? 'Saving...' : 'Export to Sheet';
  if (loading) {
    elements.submitIcon.classList.add('animate-spin');
    elements.submitIcon.setAttribute('data-lucide', 'loader-2');
  } else {
    elements.submitIcon.classList.remove('animate-spin');
    elements.submitIcon.setAttribute('data-lucide', 'save');
  }
  lucide.createIcons();
}

function showFormStatus(msg, color) {
  elements.formStatus.textContent = msg;
  elements.formStatus.className = `flex items-center gap-1.5 font-bold text-[10px] text-${color}-600`;
  elements.formStatus.classList.remove('hidden');
  setTimeout(hideFormStatus, 3000);
}

function hideFormStatus() {
  elements.formStatus.classList.add('hidden');
}

// Event Listeners
elements.loginForm.addEventListener('submit', handleLogin);
elements.logoutBtn.addEventListener('click', handleLogout);
elements.menuToggle.addEventListener('click', () => toggleSidebar(true));
elements.sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
elements.refreshStats.addEventListener('click', fetchStats);
elements.adminForm.addEventListener('submit', handleFormSubmit);

elements.tabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Run
init();
