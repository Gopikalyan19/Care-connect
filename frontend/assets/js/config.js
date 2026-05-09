const API_BASE_URL = 'https://care-connect-lmwi.onrender.com/api';

async function api(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}
