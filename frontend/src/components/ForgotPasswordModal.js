import React from 'react';
import './Form.css';

const ForgotPasswordForm = ({ onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="forgot-password-modal">
      <h2>Введите адрес эл. почты</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-input" type="email" placeholder="Введите адрес эл. почты" required />
        <button type="submit" className="form-button">Отправить письмо</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
