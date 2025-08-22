
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoList from './pages/TodoList';
import './App.css';

const API_BASE = 'http://localhost:5000/api';


function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  // Helper for API calls
  const fetchAPI = async (url, options = {}) => {
    options.headers = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
    };
    options.credentials = 'include'; // for cookies
    const res = await fetch(url, options);
    return res.json();
  };

  // Auth
  const handleRegister = async (username, password) => {
    setError('');
    const res = await fetchAPI(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.message === 'User registered') {
      setError('Registered! Please login.');
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  const handleLogin = async (username, password) => {
    setError('');
    const res = await fetchAPI(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.message === 'Login successful') {
      setIsLogin(true);
      setError('');
      fetchTodos();
    } else {
      setError(res.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    await fetchAPI(`${API_BASE}/auth/logout`, { method: 'POST' });
    setIsLogin(false);
    setTodos([]);
    setError('Logged out');
  };

  // Todos
  const fetchTodos = async () => {
    const res = await fetchAPI(`${API_BASE}/todos`);
    setTodos(Array.isArray(res) ? res : []);
  };

  const handleAddTodo = async (title) => {
    if (!title) return;
    const res = await fetchAPI(`${API_BASE}/todos`, {
      method: 'POST',
      body: JSON.stringify({ title })
    });
    if (res._id) {
      setTodos([...todos, res]);
    } else {
      setError(res.message || 'Add failed');
    }
  };

  const handleUpdateTodo = async (id, completed, newTitle) => {
    const res = await fetchAPI(`${API_BASE}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed, title: newTitle })
    });
    if (res._id) {
      setTodos(todos.map(t => t._id === id ? res : t));
    } else {
      setError(res.message || 'Update failed');
    }
  };

  const handleDeleteTodo = async (id) => {
    const res = await fetchAPI(`${API_BASE}/todos/${id}`, {
      method: 'DELETE'
    });
    if (res.message === 'Todo deleted') {
      setTodos(todos.filter(t => t._id !== id));
    } else {
      setError(res.message || 'Delete failed');
    }
  };

  useEffect(() => {
    // Try to refresh access token on mount
    const tryRefresh = async () => {
      const res = await fetchAPI(`${API_BASE}/auth/refresh`, { method: 'POST' });
      if (res.message === 'Token refreshed') {
        setIsLogin(true);
        fetchTodos();
      } else {
        setIsLogin(false);
      }
    };
    tryRefresh();
  }, []);

  return (
    <Router>
      <nav style={{ textAlign: 'center', margin: '20px 0' }}>
        <Link to="/login" style={{ marginRight: 20 }}>Login</Link>
        <Link to="/register" style={{ marginRight: 20 }}>Register</Link>
        {isLogin && <Link to="/todos">Todos</Link>}
      </nav>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} error={error} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} error={error} />} />
        <Route path="/todos" element={isLogin ? <TodoList todos={todos} onAdd={handleAddTodo} onUpdate={handleUpdateTodo} onDelete={handleDeleteTodo} onLogout={handleLogout} /> : <Login onLogin={handleLogin} error={error} />} />
        <Route path="*" element={<Login onLogin={handleLogin} error={error} />} />
      </Routes>
    </Router>
  );
}

export default App;
