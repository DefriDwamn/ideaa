import React, { useState } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import MainContent from './components/MainContent';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('welcome');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('main');
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
    setCurrentView('main');
  };

  const handleForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  return (
    <div className="App">
      {currentView === 'welcome' && (
        <WelcomeScreen onJoin={() => setCurrentView('login')} />
      )}
      {currentView === 'login' && (
        <LoginForm
          onLogin={handleLogin}
          onRegister={() => setCurrentView('register')}
          onForgotPassword={handleForgotPassword}
        />
      )}
      {currentView === 'register' && (
        <RegisterForm onRegister={handleRegister} />
      )}
      {currentView === 'forgot-password' && (
        <ForgotPasswordModal onClose={() => setCurrentView('login')} />
      )}
      {isLoggedIn && currentView === 'main' && <MainContent />}
    </div>
  );
}

export default App;