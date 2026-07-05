// Mock Data for Initial Load
const MOCK_DATA = [
  {
    id: '1',
    formType: 'Latest Job',
    postName: 'UPSC Civil Services Exam 2024',
    departmentName: 'UPSC',
    submittedBy: 'Admin',
    timestamp: Date.now() - 3600000 * 5,
    importantDates: 'Apply by: 05/08/2024',
    applyLink: 'https://upsc.gov.in',
    status: 'Active'
  },
  {
    id: '2',
    formType: 'Admit Card',
    postName: 'SSC CGL Tier 1 Hall Ticket',
    departmentName: 'SSC',
    submittedBy: 'Rahul Kumar',
    timestamp: Date.now() - 3600000 * 24,
    importantDates: 'Exam: 15/09/2024',
    applyLink: 'https://ssc.nic.in',
    status: 'Active'
  },
  {
    id: '3',
    formType: 'Result',
    postName: 'IBPS PO Prelims Result',
    departmentName: 'IBPS',
    submittedBy: 'Admin',
    timestamp: Date.now() - 3600000 * 48,
    importantDates: 'Released: 01/07/2024',
    applyLink: 'https://ibps.in',
    status: 'Active'
  }
];

// State management
let state = {
  isLoggedIn: false,
  activeTab: 'dashboard',
  sidebarOpen: false,
  stats: { total: 0, recent: [], all: [] },
  loading: false,
  submitting: false,
  editingId: null,
  adminName: localStorage.getItem('admin_name') || ''
};

// Persistence Logic
function saveLocalData(data) {
  localStorage.setItem('sarkarisetu_data', JSON.stringify(data));
}

function loadLocalData() {
  const saved = localStorage.getItem('sarkarisetu_data');
  if (saved) return JSON.parse(saved);
  saveLocalData(MOCK_DATA);
  return MOCK_DATA;
}

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
  exportCsv: document.getElementById('export-csv'),
  
  recordStatTotal: document.getElementById('record-stat-total'),
  recordStatJobs: document.getElementById('record-stat-jobs'),
  recordStatAdmit: document.getElementById('record-stat-admit'),
  recordStatResults: document.getElementById('record-stat-results'),
  
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
  const isDark = savedTheme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

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
    elements.adminView.style.display = 'flex';
  } else {
    elements.loginView.classList.remove('hidden');
    elements.adminView.classList.add('hidden');
    elements.adminView.style.display = 'none';
  }
}

function switchTab(tabId) {
  if (tabId === 'new_post' && !state.editingId) {
    elements.adminForm.reset();
    elements.submitText.textContent = 'Execute Deployment';
  }
  
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

// Logic: Auth (Static for demo)
async function handleLogin(e) {
  e.preventDefault();
  const mobile = document.getElementById('mobile').value;
  const name = "Administrator"; // Static for static code mode
  
  setLoginLoading(true);
  elements.loginError.classList.add('hidden');
  
  // Artificial delay for realism
  setTimeout(() => {
    const session = { mobile, name };
    localStorage.setItem('admin_session', JSON.stringify(session));
    state.isLoggedIn = true;
    state.adminName = name;
    if (elements.adminDisplayName) elements.adminDisplayName.textContent = state.adminName;
    showView('admin');
    fetchStats();
    setLoginLoading(false);
  }, 800);
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

// Logic: Stats (Local State)
function fetchStats() {
  if (!state.isLoggedIn) return;
  
  elements.refreshIcon.classList.add('animate-spin');
  
  // Artificial delay for local interactions
  setTimeout(() => {
    const records = loadLocalData();
    // Sort by timestamp desc
    records.sort((a, b) => b.timestamp - a.timestamp);
    
    state.stats.all = records;
    state.stats.recent = records.slice(0, 5);
    state.stats.total = records.length;
    
    renderStats();
    renderAllRecords();
    renderPayouts();
    elements.refreshIcon.classList.remove('animate-spin');
  }, 300);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  lucide.createIcons();
}

function updateRecordStats() {
  if (!state.stats.all) return;
  
  const all = state.stats.all;
  elements.recordStatTotal.textContent = all.length;
  elements.recordStatJobs.textContent = all.filter(r => r.formType === 'Latest Job').length;
  elements.recordStatAdmit.textContent = all.filter(r => r.formType === 'Admit Card').length;
  elements.recordStatResults.textContent = all.filter(r => r.formType === 'Result').length;
}

function handleDelete(id) {
  if (!confirm('Are you sure you want to delete this record?')) return;
  
  const records = loadLocalData();
  const filtered = records.filter(r => r.id !== id);
  saveLocalData(filtered);
  fetchStats();
}

function handleEdit(id) {
  const record = state.stats.all.find(r => r.id === id);
  if (!record) return;
  
  // Fill form
  const form = elements.adminForm;
  form.formType.value = record.formType || 'Latest Job';
  form.postName.value = record.postName || '';
  form.departmentName.value = record.departmentName || '';
  form.importantDates.value = record.importantDates || '';
  form.applicationFees.value = record.applicationFees || '';
  form.ageLimit.value = record.ageLimit || '';
  form.eligibility.value = record.eligibility || '';
  form.applyLink.value = record.applyLink || '';
  form.notificationLink.value = record.notificationLink || '';
  form.officialWebsite.value = record.officialWebsite || '';
  form.postWiseDetails.value = record.postWiseDetails || '';
  form.howToFill.value = record.howToFill || '';
  form.remark.value = record.remark || '';
  
  // Set editing state
  state.editingId = id;
  elements.submitText.textContent = 'Update Deployment';
  switchTab('new_post');
}

function exportToCSV() {
  if (!state.stats.all || state.stats.all.length === 0) return;
  
  const headers = ['Post Name', 'Type', 'Department', 'Author', 'Date'];
  const rows = state.stats.all.map(r => [
    `"${r.postName}"`,
    `"${r.formType}"`,
    `"${r.departmentName}"`,
    `"${r.submittedBy}"`,
    `"${new Date(r.timestamp).toLocaleDateString()}"`
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `SarkariSetu_Records_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
}

function renderStats() {
  elements.statTotal.textContent = state.stats.total || 0;
  updateRecordStats();
  
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
  const records = state.stats.all || [];
  const searchTerm = elements.recordSearch.value.toLowerCase();
  
  const filtered = records.filter(r => 
    r.postName?.toLowerCase().includes(searchTerm) || 
    r.submittedBy?.toLowerCase().includes(searchTerm) ||
    r.formType?.toLowerCase().includes(searchTerm)
  );

  if (filtered.length > 0) {
    elements.allRecordsTableBody.innerHTML = filtered.map(entry => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/30">
        <td class="px-5 py-3"><p class="line-clamp-1 text-slate-900 dark:text-white font-bold text-[10px]">${entry.postName || 'N/A'}</p></td>
        <td class="px-5 py-3"><span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 text-[8px] font-black uppercase tracking-wider border border-emerald-500/20">${entry.formType || 'N/A'}</span></td>
        <td class="px-5 py-3 text-slate-400 dark:text-slate-500 font-bold text-[10px]">${entry.submittedBy || 'N/A'}</td>
        <td class="px-5 py-3 text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-widest">${entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'N/A'}</td>
        <td class="px-5 py-3 text-right">
          <div class="flex items-center justify-end gap-2">
            <button onclick="window.adminActions.edit('${entry.id}')" class="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md text-blue-600 dark:text-blue-400 transition-colors" title="Edit">
              <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="window.adminActions.delete('${entry.id}')" class="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md text-red-600 dark:text-red-400 transition-colors" title="Delete">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  } else {
    elements.allRecordsTableBody.innerHTML = `
      <tr><td colspan="5" class="p-16 text-center text-slate-400 font-black uppercase tracking-widest text-[9px]">Zero matches in registry.</td></tr>
    `;
  }
  lucide.createIcons();
}

// Expose actions to global scope for onclick handlers
window.adminActions = {
  edit: handleEdit,
  delete: handleDelete
};

function renderPayouts() {
  const records = state.stats.all || [];
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

// Logic: Form Submission (Local)
function handleFormSubmit(e) {
  e.preventDefault();
  if (state.submitting) return;
  
  const formData = new FormData(elements.adminForm);
  const session = JSON.parse(localStorage.getItem('admin_session') || '{}');
  
  const data = {
    ...Object.fromEntries(formData),
    submittedBy: session.name || 'Admin',
    timestamp: Date.now()
  };
  
  state.submitting = true;
  setFormSubmitting(true);
  hideFormStatus();
  
  // Artificial delay for UI feedback
  setTimeout(() => {
    const records = loadLocalData();
    
    if (state.editingId) {
      const index = records.findIndex(r => r.id === state.editingId);
      if (index !== -1) {
        records[index] = { ...records[index], ...data };
      }
      state.editingId = null;
    } else {
      data.id = Date.now().toString();
      records.push(data);
    }
    
    saveLocalData(records);
    
    elements.adminForm.reset();
    elements.submitText.textContent = 'Execute Deployment';
    showFormStatus('DEPLOYMENT SUCCESSFUL', 'emerald');
    fetchStats();
    
    state.submitting = false;
    setFormSubmitting(false);
  }, 1000);
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
elements.exportCsv.addEventListener('click', exportToCSV);
elements.adminForm.addEventListener('submit', handleFormSubmit);
elements.recordSearch.addEventListener('input', renderAllRecords);

elements.tabBtns.forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Run
init();
