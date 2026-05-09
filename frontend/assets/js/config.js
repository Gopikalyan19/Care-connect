
const API_BASE_URL = 'https://your-render-backend-url.onrender.com/api';

const api = {
  post: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    return response.json();
  }
};
