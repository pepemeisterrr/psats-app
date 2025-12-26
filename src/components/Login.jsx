import React, { useState } from 'react';

const users = [
  { login: 'operator1', password: '1234', role: 'operator', name: 'Оператор 1' },
  { login: 'operator2', password: '1234', role: 'operator', name: 'Оператор 2' },
  { login: 'operator3', password: '1234', role: 'operator', name: 'Оператор 3' },
  { login: 'supervisor1', password: '1234', role: 'admin', name: 'Руководитель 1' },
];

const Login = ({ onLogin }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundUser = users.find(u => u.login === login && u.password === password);
    if (foundUser) {
      onLogin({ role: foundUser.role, name: foundUser.name, id: foundUser.login });
      setError('');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">ПсАТС - Автоматическая телефонная станция</h1>
        <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">Система для обработки вызовов о пожарах в Москве (подсистема Системы-101).</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">Войти</button>
        </form>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Тестовые аккаунты: operator1-3 (операторы), supervisor1 (админ). Пароль: 1234</p>
      </div>
    </div>
  );
};

export default Login;