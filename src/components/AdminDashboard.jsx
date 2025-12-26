import React, { useState, useEffect } from 'react';

// Симуляция операторов
const operators = [
  { id: 'operator1', name: 'Оператор 1', status: 'ожидает', callsHandled: 5 },
  { id: 'operator2', name: 'Оператор 2', status: 'занят', callsHandled: 3 },
  { id: 'operator3', name: 'Оператор 3', status: 'ожидает', callsHandled: 7 },
];

const AdminDashboard = ({ user, onLogout, theme, toggleTheme }) => {
  const [stats, setStats] = useState({ totalCalls: 0, falseCalls: 0, inQueue: 0, inWork: 0 });
  const [reportPeriod, setReportPeriod] = useState('today');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        totalCalls: Math.floor(Math.random() * 100),
        falseCalls: Math.floor(Math.random() * 20),
        inQueue: Math.floor(Math.random() * 10),
        inWork: Math.floor(Math.random() * 15),
      });
      setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: Оператор 1 принял вызов`]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const generateReport = () => {
    const report = `Отчет за ${reportPeriod}:\nВсего вызовов: ${stats.totalCalls}\nЛожные: ${stats.falseCalls}`;
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${reportPeriod}.txt`;
    a.click();
  };

  const markCompleted = (callId) => {
    alert(`Вызов ${callId} завершен`);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-white">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Панель Администратора: {user.name}</h1>
        <div>
          <button onClick={toggleTheme} className="mr-4 bg-gray-300 dark:bg-gray-700 p-2 rounded">Toggle Theme</button>
          <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Выйти</button>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4">Мониторинг операторов</h2>
          <ul className="space-y-4">
            {operators.map((op) => (
              <li key={op.id} className="p-4 border rounded dark:border-gray-700">
                <p>Имя: {op.name}</p>
                <p>Статус: {op.status}</p>
                <p>Обработано вызовов: {op.callsHandled}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4">Общая статистика</h2>
          <p>Всего вызовов: {stats.totalCalls}</p>
          <p>Ложные: {stats.falseCalls}</p>
          <p>В очереди: {stats.inQueue}</p>
          <p>В работе: {stats.inWork}</p>
        </div>
      </div>
      <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-xl mb-4">Формирование отчетов</h2>
        <select
          value={reportPeriod}
          onChange={(e) => setReportPeriod(e.target.value)}
          className="p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
        >
          <option value="today">Сегодня</option>
          <option value="yesterday">Вчера</option>
          <option value="week">Неделя</option>
          <option value="month">Месяц</option>
        </select>
        <button onClick={generateReport} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Сформировать и экспортировать
        </button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4">История действий</h2>
          <ul className="space-y-2 overflow-y-auto h-40">
            {logs.map((log, idx) => <li key={idx}>{log}</li>)}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4">Завершить вызовы в работе</h2>
          <button onClick={() => markCompleted(1)} className="bg-blue-500 text-white px-4 py-2 rounded">Завершить вызов 1</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;