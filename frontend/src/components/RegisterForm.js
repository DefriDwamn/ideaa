import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Form.css';

const RegisterForm = ({ onRegister }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const response = await API.post('/users/register/', {
        email: email,
        name: name,
        password: password,
      });

      // Сохраняем токены в localStorage
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      onRegister();
      navigate('/main');
    } catch (error) {
      setError('Ошибка регистрации: проверьте введенные данные');
    }
  };

  return (
    <div className="register-form">
      <h2>Регистрация</h2>
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
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="password"
          placeholder="Придумайте пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="password"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="form-button">
          Зарегистрироваться
        </button>
        <a href="#" className="form-link" onClick={() => navigate('/login')}>
          Назад к входу
        </a>
      </form>
    </div>
  );
};

export default RegisterForm;
