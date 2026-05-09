function getToken() {
  return localStorage.getItem('nau_token');
}

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem('nau_profile') || '{}');
  } catch (_error) {
    return {};
  }
}

async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const savedToken = getToken();
  if (savedToken) {
    headers.Authorization = `Bearer ${savedToken}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (_error) {
    throw new Error('Failed to connect to backend. Start backend with: cd backend && npm install && npm run dev');
  }

  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (_error) {
    data = { success: false, message: text || 'Invalid server response.' };
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

function logout() {
  localStorage.removeItem('nau_token');
  localStorage.removeItem('nau_profile');
  window.location.href = '../index.html';
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '../pages/login.html';
  }
}

function fillUserLabel() {
  const el = document.getElementById('userLabel');
  if (el) {
    const p = getProfile();
    el.textContent = p.full_name || p.email || 'NAU User';
  }
}
