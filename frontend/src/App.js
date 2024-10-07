import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import MainContent from './components/MainContent';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Проверка токенов при первой загрузке
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
      navigate('/main'); // Перенаправляем на основную страницу, если токены существуют
    } else {
      setIsLoggedIn(false);
      navigate('/login'); // Перенаправляем на страницу входа, если токены отсутствуют
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/main');
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    navigate('/main');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleLogout = () => {
    // Удаляем токены из localStorage и перенаправляем на страницу входа
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomeScreen onJoin={() => navigate('/login')} />} />
        <Route
          path="/login"
          element={<LoginForm onLogin={handleLogin} onRegister={() => navigate('/register')} onForgotPassword={handleForgotPassword} />}
        />
        <Route path="/register" element={<RegisterForm onRegister={handleRegister} />} />
        <Route path="/forgot-password" element={<ForgotPasswordModal onClose={() => navigate('/login')} />} />
        {isLoggedIn && <Route path="/main" element={<MainContent onLogout={handleLogout} />} />}
      </Routes>
    </div>
  );
}

export default App;
