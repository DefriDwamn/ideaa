import React from 'react';
import './Form.css';

const RegisterForm = ({ onRegister }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister();
  };

  return (
    <div className="register-form">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-input" type="email" placeholder="Адрес эл. почты" required />
        <input className="form-input" type="text" placeholder="Логин" required />
        <input className="form-input" type="password" placeholder="Придумайте пароль" required />
        <input className="form-input" type="password" placeholder="Подтвердите пароль" required />
        <button type="submit" className="form-button">Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default RegisterForm;
