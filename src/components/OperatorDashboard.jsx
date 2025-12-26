import React, { useState, useEffect } from 'react';

const moscowAddresses = [
  { address: 'ул. Тверская, 1', coords: [55.7574, 37.6114] },
  { address: 'Красная площадь, 3', coords: [55.7539, 37.6208] },
  { address: 'ул. Арбат, 10', coords: [55.7522, 37.5931] },
  // Расширьте
];

const generateRandomCall = (id) => {
  const randomAddress = moscowAddresses[Math.floor(Math.random() * moscowAddresses.length)];
  return {
    id,
    phone: `+7(${Math.floor(900 + Math.random() * 100)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(10 + Math.random() * 90)}`,
    address: randomAddress.address,
    coords: randomAddress.coords,
    timestamp: Date.now(),
    status: 'waiting',
    waitTime: 0,
  };
};

const OperatorDashboard = ({ user, onLogout, theme, toggleTheme }) => {
  const [calls, setCalls] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, false: 0, inQueue: 0, inProgress: 0, avgResponse: 0 });
  const [map, setMap] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=1163255e-bb23-48e7-aeb1-be5c1cc1be33&lang=ru_RU';  // Ключ из ATCC.html
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.ymaps.ready(() => {
        const newMap = new window.ymaps.Map('map', {
          center: [55.7558, 37.6173],
          zoom: 10,
        });
        setMap(newMap);
      });
    };

    return () => document.head.removeChild(script);
  }, []);

  useEffect(() => {
    if (map) {
      calls.forEach((call) => {
        const color = call.status === 'waiting' ? (call.waitTime > 60 ? 'red' : call.waitTime > 30 ? 'yellow' : 'green') :
          call.status === 'accepted' ? 'blue' : call.status === 'in-progress' ? 'purple' : 'gray';
        const marker = new window.ymaps.Placemark(call.coords, {}, { iconColor: color });
        map.geoObjects.add(marker);
      });
    }
  }, [map, calls]);

  // Симуляция вызовов и handlers как раньше

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Панель Оператора: {user.name}</h1>
        <div>
          <button onClick={toggleTheme} className="mr-4 bg-gray-300 dark:bg-gray-700 p-2 rounded">Toggle Theme</button>
          <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Выйти</button>
        </div>
      </header>
      {/* Список вызовов, статистика, логи */}
      <div id="map" className="w-full h-96 mt-6"></div>
    </div>
  );
};

export default OperatorDashboard;