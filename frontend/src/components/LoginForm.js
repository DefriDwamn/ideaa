import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Form.css';

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post('/users/login/', {
        email: email,
        password: password,
      });

      // Сохраняем токены в localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      onLogin();
      navigate('/main');
    } catch (error) {
      setError('Ошибка входа: проверьте email и пароль');
    }
  };

  return (
    <div className="login-form">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="email"
          placeholder="Адрес эл. почты"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="form-button">
          Войти
        </button>
        <a href="#" className="form-link" onClick={() => navigate('/forgot-password')}>
          Забыли пароль?
        </a>
        <a href="#" className="form-link" onClick={() => navigate('/register')}>
          Регистрация
        </a>
      </form>
    </div>
  );
};

export default LoginForm;
