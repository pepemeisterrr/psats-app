import React, { useState } from 'react';
import Login from './components/Login';
import OperatorDashboard from './components/OperatorDashboard';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const handleLogin = (loggedUser) => setUser(loggedUser);
  const handleLogout = () => setUser(null);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className={theme}>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : user.role === 'operator' ? (
        <OperatorDashboard user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      ) : (
        <AdminDashboard user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      )}
    </div>
  );
};

export default App;