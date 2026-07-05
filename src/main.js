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
  adminDisplayName: document.getElementById('admin-display-name'),
  
  dashboardContent: document.getElementById('dashboard-content'),
  newPostContent: document.getElementById('new-post-content'),
  recordsContent: document.getElementById('records-content'),
  payoutContent: document.getElementById('payout-content'),
  
  statTotal: document.getElementById('stat-total'),
  recentTableBody: document.getElementById('recent-table-body'),
  allRecordsTableBody: document.getElementById('all-records-table-body'),
  payoutTableBody: document.getElementById('payout-table-body'),
  recordSearch: document.getElementById('record-search'),
  estEarnings: document.getElementById('est-earnings'),
  refreshStats: document.getElementById('refresh-stats'),
  refreshIcon: document.getElementById('refresh-icon'),
  themeToggle: document.getElementById('theme-toggle'),
  
  adminForm: document.getElementById('admin-form'),
  submitBtn: document.getElementById('submit-btn'),
  submitText: document.getElementById('submit-text'),
  submitIcon: document.getElementById('submit-icon'),
  formStatus: document.getElementById('form-status'),
  formStatusText: document.getElementById('form-status-text')
};

// Initialize
function init() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');

  const session = localStorage.getItem('admin_session');
  if (session) {
    const sessionData = JSON.parse(session);
    state.isLoggedIn = true;
    state.adminName = sessionData.name;
    if (elements.adminDisplayName) elements.adminDisplayName.textContent = state.adminName;
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
    elements.adminView.classList.add('lg:flex');
    elements.adminView.classList.remove('hidden');
    // Ensure flex is used for main layout
    elements.adminView.style.display = 'flex';
  } else {
    elements.loginView.classList.remove('hidden');
    elements.adminView.classList.add('hidden');
    elements.adminView.style.display = 'none';
  }
}

function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Update UI
  elements.tabBtns.forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-900/20');
      btn.classList.remove('text-slate-400', 'hover:bg-slate-800/50', 'hover:text-white');
    } else {
      btn.classList.remove('bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-900/20');
      btn.classList.add('text-slate-400', 'hover:bg-slate-800/50', 'hover:text-white');
    }
  });
  
  // Toggle content
  const contentMap = {
    'dashboard': elements.dashboardContent,
    'new_post': elements.newPostContent,
    'records': elements.recordsContent,
    'payout': elements.payoutContent
  };
  
  Object.keys(contentMap).forEach(key => {
    if (key === tabId) {
      contentMap[key].classList.remove('hidden');
    } else {
      contentMap[key].classList.add('hidden');
    }
  });

  const titles = {
    'dashboard': 'Dashboard',
    'new_post': 'Post Deployment',
    'records': 'User Registry',
    'payout': 'Financials'
  };
  elements.viewTitle.textContent = titles[tabId] || 'Admin';
  
  if (tabId === 'dashboard' || tabId === 'records' || tabId === 'payout') {
    fetchStats();
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
    setTimeout(() => elements.sidebarOverlay.classList.add('opacity-100'), 10);
  } else {
    elements.sidebar.classList.add('-translate-x-full');
    elements.sidebarOverlay.classList.remove('opacity-100');
    setTimeout(() => elements.sidebarOverlay.classList.add('hidden'), 300);
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
      if (elements.adminDisplayName) elements.adminDisplayName.textContent = state.adminName;
      showView('admin');
      fetchStats();
    } else {
      showLoginError(result.message || 'Invalid credentials');
    }
  } catch (err) {
    showLoginError('System offline. Verify endpoint.');
    console.error(err);
  } finally {
    setLoginLoading(false);
  }
}

function setLoginLoading(loading) {
  elements.loginBtn.disabled = loading;
  elements.loginText.textContent = loading ? 'Authenticating...' : 'Initialize Session';
  if (loading) {
    elements.loginIcon.classList.add('animate-spin');
    elements.loginIcon.setAttribute('data-lucide', 'loader-2');
  } else {
    elements.loginIcon.classList.remove('animate-spin');
    elements.loginIcon.setAttribute('data-lucide', 'terminal');
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
    renderAllRecords();
    renderPayouts();
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  } finally {
    state.loading = false;
    elements.refreshIcon.classList.remove('animate-spin');
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  lucide.createIcons();
}

function renderStats() {
  elements.statTotal.textContent = state.stats.total || 0;
  
  if (state.stats.recent && state.stats.recent.length > 0) {
    elements.recentTableBody.innerHTML = state.stats.recent.map(entry => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
        <td class="px-5 py-3">
          <div class="flex items-center gap-2.5">
             <div class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.submittedBy}" class="w-5 h-5">
             </div>
             <span class="text-slate-900 dark:text-white font-bold text-[10px]">${entry.submittedBy || 'N/A'}</span>
          </div>
        </td>
        <td class="px-5 py-3">
           <p class="text-slate-900 dark:text-white font-bold line-clamp-1 text-[10px]">${entry.postName || 'N/A'}</p>
           <p class="text-[8px] text-slate-400 dark:text-slate-500 uppercase mt-0.5">${entry.formType || 'POST'}</p>
        </td>
        <td class="px-5 py-3">
          <span class="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase border border-blue-500/20">Active</span>
        </td>
      </tr>
    `).join('');
  } else {
    elements.recentTableBody.innerHTML = `<tr><td colspan="3" class="p-8 text-center text-slate-400 font-bold text-[10px]">No active submissions.</td></tr>`;
  }
}

function renderAllRecords() {
  const records = state.stats.allRecords || [];
  const searchTerm = elements.recordSearch.value.toLowerCase();
  
  const filtered = records.filter(r => 
    r.postName?.toLowerCase().includes(searchTerm) || 
    r.submittedBy?.toLowerCase().includes(searchTerm) ||
    r.formType?.toLowerCase().includes(searchTerm)
  );

  if (filtered.length > 0) {
    elements.allRecordsTableBody.innerHTML = filtered.map(entry => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/30">
        <td class="px-6 py-4"><p class="line-clamp-1 text-slate-900 dark:text-white font-bold text-[10px]">${entry.postName || 'N/A'}</p></td>
        <td class="px-6 py-4"><span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[8px] font-black uppercase tracking-wider border border-emerald-500/20">${entry.formType || 'N/A'}</span></td>
        <td class="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-[10px]">${entry.submittedBy || 'N/A'}</td>
        <td class="px-6 py-4 text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-widest">${entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'N/A'}</td>
      </tr>
    `).join('');
  } else {
    elements.allRecordsTableBody.innerHTML = `
      <tr><td colspan="4" class="p-16 text-center text-slate-400 font-black uppercase tracking-widest text-[9px]">Zero matches in registry.</td></tr>
    `;
  }
}

function renderPayouts() {
  const records = state.stats.allRecords || [];
  const contributorMap = {};
  
  records.forEach(r => {
    const author = r.submittedBy || 'Unknown';
    if (!contributorMap[author]) {
      contributorMap[author] = 0;
    }
    contributorMap[author]++;
  });

  const session = JSON.parse(localStorage.getItem('admin_session') || '{}');
  const myPosts = contributorMap[session.name] || 0;
  elements.estEarnings.textContent = `₹ ${myPosts * 10}`;

  const tableData = Object.entries(contributorMap).map(([name, count]) => ({
    name,
    count,
    amount: count * 10
  }));

  if (tableData.length > 0) {
    elements.payoutTableBody.innerHTML = tableData.map(row => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors border-b border-slate-100 dark:border-slate-800/20">
        <td class="px-5 py-3 text-slate-900 dark:text-white font-bold text-[10px]">${row.name}</td>
        <td class="px-5 py-3 text-slate-900 dark:text-white font-black text-[10px]">₹ ${row.amount}</td>
        <td class="px-5 py-3">
          <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase border border-emerald-500/20">Paid</span>
        </td>
      </tr>
    `).join('');
  } else {
    elements.payoutTableBody.innerHTML = `<tr><td colspan="3" class="p-8 text-center text-slate-400 font-bold text-[10px]">Financial ledger is empty.</td></tr>`;
  }
  lucide.createIcons();
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
      showFormStatus('DATA DEPLOYED SUCCESSFULLY', 'emerald');
      elements.adminForm.reset();
    } else {
      showFormStatus('DEPLOYMENT FAILED', 'red');
    }
  } catch (err) {
    showFormStatus('NETWORK ERROR', 'red');
    console.error(err);
  } finally {
    state.submitting = false;
    setFormSubmitting(false);
  }
}

function setFormSubmitting(loading) {
  elements.submitBtn.disabled = loading;
  elements.submitText.textContent = loading ? 'Processing...' : 'Execute Deployment';
  if (loading) {
    elements.submitIcon.classList.add('animate-spin');
    elements.submitIcon.setAttribute('data-lucide', 'loader-2');
  } else {
    elements.submitIcon.classList.remove('animate-spin');
    elements.submitIcon.setAttribute('data-lucide', 'upload-cloud');
  }
  lucide.createIcons();
}

function showFormStatus(msg, color) {
  if (elements.formStatusText) elements.formStatusText.textContent = msg;
  elements.formStatus.className = `flex items-center gap-3 px-4 py-2 rounded-xl bg-${color}-500/10 border border-${color}-500/20`;
  elements.formStatus.classList.remove('hidden');
  setTimeout(hideFormStatus, 4000);
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
elements.themeToggle.addEventListener('click', toggleTheme);
elements.adminForm.addEventListener('submit', handleFormSubmit);
elements.recordSearch.addEventListener('input', renderAllRecords);

elements.tabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Run
init();
