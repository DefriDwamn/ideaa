import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Form.css';
import API from '../api/axios';


const ForgotPasswordModal = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/forgot-password/', {
        email: email,
      });

      alert('Инструкции по восстановлению пароля отправлены');
      navigate('/login');
    } catch (error) {
      setError('Ошибка: не удалось отправить инструкцию');
    }
  };

  return (
    <div className="forgot-password-modal">
      <h2>Введите адрес эл. почты</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="email"
          placeholder="Введите адрес эл. почты"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="form-button">
          Отправить письмо
        </button>
        <a href="#" className="form-link" onClick={() => navigate('/login')}>
          Назад к входу
        </a>
      </form>
    </div>
  );
};

export default ForgotPasswordModal;
