

const API_BASE = 'http://localhost:5000/api';

const api = {
  auth: {
    login: async (data) => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    // registration endpoint removed; attempt to call will immediately reject
    register: async (data) => {
      return { message: 'Registration is disabled' };
    }
  },
  password: {
    change: async (data) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/password/change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    forgot: async (email) => {
      const response = await fetch(`${API_BASE}/password/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return response.json();
    },
    reset: async (data) => {
      const response = await fetch(`${API_BASE}/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  },
  notes: {
    // fetch all notes (no year filter)
    getNotes: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/notes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    upload: async (formData) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/notes/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      return response.json();
    },
    delete: async (id) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    }
  },
  // quiz: {
  //   getQuiz: async (year) => {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`${API_BASE}/quiz/${year}`, {
  //       headers: { 'Authorization': `Bearer ${token}` }
  //     });
  //     return response.json();
  //   },
  //   submit: async (data) => {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch(`${API_BASE}/quiz/submit`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(data)
  //     });
  //     return response.json();
  //   }
  // },

  quiz: {
  getSubjects: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/quiz/subjects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  getQuiz: async (subject) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/quiz/${encodeURIComponent(subject)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  submit: async (data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  getScores: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/quiz/scores/my`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
},


  lostfound: {
    getPosts: async (type = '', search = '') => {
      const token = localStorage.getItem('token');
      let url = `${API_BASE}/lostfound?`;
      if (type) url += `type=${type}&`;
      if (search) url += `search=${search}`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    create: async (formData) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/lostfound/create`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      return response.json();
    },
    delete: async (id) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/lostfound/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    forget: async (id) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/lostfound/${id}/forget`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    }
  },
  chatbot: {
    sendMessage: async (message, userId = null) => {
      const body = { message };
      if (userId) body.userId = userId;
      
      const response = await fetch(`${API_BASE}/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return response.json();
    },
    getHistory: async (userId = null) => {
      let url = `${API_BASE}/chatbot/history`;
      if (userId) url += `?userId=${userId}`;
      
      const response = await fetch(url);
      return response.json();
    },
    clearChat: async (userId = null) => {
      const body = {};
      if (userId) body.userId = userId;
      
      const response = await fetch(`${API_BASE}/chatbot/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return response.json();
    },
    getSuggestions: async () => {
      const response = await fetch(`${API_BASE}/chatbot/suggestions`);
      return response.json();
    },
    analyzeIntent: async (message) => {
      const response = await fetch(`${API_BASE}/chatbot/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      return response.json();
    }
  },
  admin: {
    getAllStudents: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    getStudentById: async (id) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/students/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    createStudent: async (data) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    updateStudent: async (id, data) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    deleteStudent: async (id) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    }
  }
};

export default api;
