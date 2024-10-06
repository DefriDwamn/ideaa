import React from 'react';
import './Form.css';

const LoginForm = ({ onLogin, onRegister, onForgotPassword }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-form">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-input" type="text" placeholder="Логин" required />
        <input className="form-input" type="password" placeholder="Пароль" required />
        <button type="submit" className="form-button">Войти</button>
        <a href="#" className="form-link" onClick={onForgotPassword}>
          Забыли пароль?
        </a>
        <a href="#" className="form-link" onClick={onRegister}>
          Регистрация
        </a>
      </form>
    </div>
  );
};

export default LoginForm;
