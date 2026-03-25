/* ============================================================
   User Management Screen – Client-Side Logic
   ============================================================ */

(function () {
  'use strict';

  // -------------------- Seed Data --------------------
  let users = [
    { id: 1, userName: 'AdminUser', displayName: 'Admin User', phone: '', email: 'admin@piworks.net', userRoles: ['admin'], enabled: true },
    { id: 2, userName: 'Test User', displayName: 'Test User', phone: '', email: 'testuser@piworks.net', userRoles: ['guest'], enabled: true },
  ];

  let nextId = 3;
  let selectedUserId = null;

  // -------------------- Sort / Filter State --------------------
  let sortState = { key: 'id', dir: 'asc' }; // default sort
  let filterState = { id: '', userName: '', email: '', enabled: '' };

  // -------------------- DOM References --------------------
  const btnNew = document.getElementById('btnNewUser');
  const btnSave = document.getElementById('btnSaveUser');
  const chkHide = document.getElementById('chkHideDisabled');
  const tbody = document.getElementById('userTableBody');
  const formTitle = document.getElementById('formTitle');

  const inputUsername = document.getElementById('inputUsername');
  const inputDisplayName = document.getElementById('inputDisplayName');
  const inputPhone = document.getElementById('inputPhone');
  const inputEmail = document.getElementById('inputEmail');
  const inputEnabled = document.getElementById('inputEnabled');

  const errUsername = document.getElementById('errUsername');
  const errDisplayName = document.getElementById('errDisplayName');
  const errPhone = document.getElementById('errPhone');
  const errEmail = document.getElementById('errEmail');
  const errUserRoles = document.getElementById('errUserRoles');

  const msUserRoles = document.getElementById('msUserRoles');
  const msTrigger = msUserRoles.querySelector('.multiselect__trigger');
  const msText = msUserRoles.querySelector('.multiselect__text');
  const msOptions = msUserRoles.querySelectorAll('.multiselect__option');

  const toastContainer = document.getElementById('toastContainer');

  // -------------------- Multi-Select Dropdown --------------------
  let selectedRoles = [];

  msTrigger.addEventListener('click', () => {
    msUserRoles.classList.toggle('open');
  });

  msUserRoles.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') msUserRoles.classList.remove('open');
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      msUserRoles.classList.toggle('open');
    }
  });

  msOptions.forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = opt.dataset.value;
      if (selectedRoles.includes(val)) {
        selectedRoles = selectedRoles.filter((r) => r !== val);
        opt.classList.remove('selected');
      } else {
        selectedRoles.push(val);
        opt.classList.add('selected');
      }
      updateRolesDisplay();
      clearFieldError(msTrigger, errUserRoles);
    });
  });

  function updateRolesDisplay() {
    if (selectedRoles.length === 0) {
      msText.textContent = 'Select user roles…';
      msTrigger.classList.add('placeholder');
    } else {
      const labels = selectedRoles.map((r) => {
        const opt = msUserRoles.querySelector(`[data-value="${r}"]`);
        return opt ? opt.textContent : r;
      });
      msText.textContent = labels.join(', ');
      msTrigger.classList.remove('placeholder');
    }
  }

  function setSelectedRoles(roles) {
    selectedRoles = [...roles];
    msOptions.forEach((opt) => {
      opt.classList.toggle('selected', selectedRoles.includes(opt.dataset.value));
    });
    updateRolesDisplay();
  }

  // Close multiselect when clicking outside
  document.addEventListener('click', (e) => {
    if (!msUserRoles.contains(e.target)) {
      msUserRoles.classList.remove('open');
    }
  });

  // -------------------- Table Rendering --------------------
  function getFilteredUsers() {
    let list = [...users];

    // Hide disabled
    if (chkHide.checked) {
      list = list.filter((u) => u.enabled);
    }

    // Apply filters
    Object.keys(filterState).forEach((key) => {
      const val = filterState[key];
      if (!val) return;
      if (key === 'enabled') {
        list = list.filter((u) => String(u.enabled) === val);
      } else {
        const lower = val.toLowerCase();
        list = list.filter((u) => String(u[key]).toLowerCase().includes(lower));
      }
    });

    // Sort
    if (sortState.key) {
      list.sort((a, b) => {
        let av = a[sortState.key];
        let bv = b[sortState.key];
        if (typeof av === 'string') av = av.toLowerCase();
        if (typeof bv === 'string') bv = bv.toLowerCase();
        if (av < bv) return sortState.dir === 'asc' ? -1 : 1;
        if (av > bv) return sortState.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return list;
  }

  function renderTable() {
    const list = getFilteredUsers();
    tbody.innerHTML = '';

    if (list.length === 0) {
      const tr = document.createElement('tr');
      tr.className = 'empty-row';
      tr.innerHTML = '<td colspan="4">No users found.</td>';
      tbody.appendChild(tr);
      return;
    }

    list.forEach((user) => {
      const tr = document.createElement('tr');
      tr.dataset.id = user.id;
      if (user.id === selectedUserId) tr.classList.add('selected');

      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${escapeHtml(user.userName)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td>${user.enabled}</td>
      `;

      tr.addEventListener('click', () => selectUser(user.id));
      tbody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // -------------------- Row Selection --------------------
  function selectUser(id) {
    selectedUserId = id;
    const user = users.find((u) => u.id === id);
    if (!user) return;

    formTitle.textContent = 'Edit User';
    inputUsername.value = user.userName;
    inputDisplayName.value = user.displayName;
    inputPhone.value = user.phone;
    inputEmail.value = user.email;
    inputEnabled.checked = user.enabled;
    setSelectedRoles(user.userRoles);
    clearAllErrors();
    renderTable();
  }

  // -------------------- New User --------------------
  btnNew.addEventListener('click', () => {
    selectedUserId = null;
    formTitle.textContent = 'New User';
    inputUsername.value = '';
    inputDisplayName.value = '';
    inputPhone.value = '';
    inputEmail.value = '';
    inputEnabled.checked = false;
    setSelectedRoles([]);
    clearAllErrors();
    renderTable();
    inputUsername.focus();
  });

  // -------------------- Save User --------------------
  btnSave.addEventListener('click', () => {
    if (!validateForm()) return;

    const data = {
      userName: inputUsername.value.trim(),
      displayName: inputDisplayName.value.trim(),
      phone: inputPhone.value.trim(),
      email: inputEmail.value.trim(),
      userRoles: [...selectedRoles],
      enabled: inputEnabled.checked,
    };

    if (selectedUserId) {
      // Update existing
      const user = users.find((u) => u.id === selectedUserId);
      if (user) Object.assign(user, data);
      showToast('User updated successfully!', 'success');
    } else {
      // Create new
      data.id = nextId++;
      users.push(data);
      selectedUserId = data.id;
      formTitle.textContent = 'Edit User';
      showToast('User created successfully!', 'success');
    }

    renderTable();
  });

  // -------------------- Hide Disabled --------------------
  chkHide.addEventListener('change', () => {
    // If selected user becomes hidden, reset form
    if (chkHide.checked && selectedUserId) {
      const user = users.find((u) => u.id === selectedUserId);
      if (user && !user.enabled) {
        btnNew.click();
      }
    }
    renderTable();
  });

  // -------------------- Sorting --------------------
  document.querySelectorAll('.sort-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.key;
      if (sortState.key === key) {
        // Cycle: asc → desc → none
        if (sortState.dir === 'asc') sortState.dir = 'desc';
        else if (sortState.dir === 'desc') { sortState.key = null; sortState.dir = null; }
      } else {
        sortState.key = key;
        sortState.dir = 'asc';
      }
      // Update active class
      document.querySelectorAll('.sort-btn').forEach((b) => b.classList.remove('active'));
      if (sortState.key === key) btn.classList.add('active');
      renderTable();
    });
  });

  // -------------------- Filtering --------------------
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.key;
      // Close all other popovers
      document.querySelectorAll('.filter-popover').forEach((p) => {
        if (p.id !== `filter-${key}`) p.classList.remove('open');
      });
      const popover = document.getElementById(`filter-${key}`);
      popover.classList.toggle('open');
      const input = popover.querySelector('input, select');
      if (input && popover.classList.contains('open')) input.focus();
    });
  });

  // Filter input handlers
  document.querySelectorAll('.filter-popover input').forEach((input) => {
    input.addEventListener('input', (e) => {
      filterState[e.target.dataset.filterKey] = e.target.value;
      renderTable();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.target.closest('.filter-popover').classList.remove('open');
      }
    });
  });

  document.querySelectorAll('.filter-popover select').forEach((sel) => {
    sel.addEventListener('change', (e) => {
      filterState[e.target.dataset.filterKey] = e.target.value;
      renderTable();
    });

    sel.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.target.closest('.filter-popover').classList.remove('open');
      }
    });
  });

  // Close popovers on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.filter-popover') && !e.target.closest('.filter-btn')) {
      document.querySelectorAll('.filter-popover').forEach((p) => p.classList.remove('open'));
    }
  });

  // -------------------- Validation --------------------
  function validateForm() {
    let valid = true;
    clearAllErrors();

    const username = inputUsername.value.trim();
    const displayName = inputDisplayName.value.trim();
    const phone = inputPhone.value.trim();
    const email = inputEmail.value.trim();

    // Username
    if (!username || username.length < 3 || username.length > 50 || !/^[a-zA-Z0-9._]+$/.test(username)) {
      showFieldError(inputUsername, errUsername, 'Username is required and must be 3–50 alphanumeric characters (dots and underscores allowed).');
      valid = false;
    } else if (users.some((u) => u.userName.toLowerCase() === username.toLowerCase() && u.id !== selectedUserId)) {
      showFieldError(inputUsername, errUsername, 'This username is already taken.');
      valid = false;
    }

    // Display Name
    if (!displayName || displayName.length < 2 || displayName.length > 100) {
      showFieldError(inputDisplayName, errDisplayName, 'Display Name is required (2–100 characters).');
      valid = false;
    }

    // Phone (optional)
    if (phone && !/^[+]?[\d\s\-()]{0,20}$/.test(phone)) {
      showFieldError(inputPhone, errPhone, 'Please enter a valid phone number.');
      valid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFieldError(inputEmail, errEmail, 'A valid email address is required.');
      valid = false;
    } else if (users.some((u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== selectedUserId)) {
      showFieldError(inputEmail, errEmail, 'This email is already in use.');
      valid = false;
    }

    // User Roles
    if (selectedRoles.length === 0) {
      msTrigger.classList.add('invalid');
      errUserRoles.textContent = 'Please select at least one user role.';
      errUserRoles.classList.add('visible');
      valid = false;
    }

    // Focus first invalid
    if (!valid) {
      const firstInvalid = document.querySelector('.form-body input.invalid, .multiselect__trigger.invalid');
      if (firstInvalid) firstInvalid.focus();
    }

    return valid;
  }

  function showFieldError(input, errEl, msg) {
    input.classList.add('invalid');
    errEl.textContent = msg;
    errEl.classList.add('visible');
    errEl.id && input.setAttribute('aria-describedby', errEl.id);
  }

  function clearFieldError(input, errEl) {
    input.classList.remove('invalid');
    errEl.classList.remove('visible');
    errEl.textContent = '';
  }

  function clearAllErrors() {
    document.querySelectorAll('.form-body input').forEach((i) => i.classList.remove('invalid'));
    msTrigger.classList.remove('invalid');
    document.querySelectorAll('.error-msg').forEach((e) => { e.classList.remove('visible'); e.textContent = ''; });
  }

  // Clear errors on input
  [inputUsername, inputDisplayName, inputPhone, inputEmail].forEach((input) => {
    const errEl = document.getElementById('err' + input.id.replace('input', ''));
    input.addEventListener('input', () => clearFieldError(input, errEl));
  });

  // -------------------- Toast --------------------
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 3200);
  }

  // -------------------- Init --------------------
  renderTable();
})();
