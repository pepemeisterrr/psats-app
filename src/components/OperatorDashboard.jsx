import React, { useState, useEffect, useRef } from 'react';

const moscowAddresses = [
  { address: 'ул. Тверская, 1', coords: [55.7574, 37.6114] },
  { address: 'Красная площадь, 3', coords: [55.7539, 37.6208] },
  { address: 'ул. Арбат, 10', coords: [55.7522, 37.5931] },
  // Расширьте список
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
  const mapRef = useRef(null);
  const mapInitialized = useRef(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?apikey=1163255e-bb23-48e7-aeb1-be5c1cc1be33&lang=ru_RU';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.ymaps.ready(() => {
        if (!mapInitialized.current) {
          mapRef.current = new window.ymaps.Map('map', {
            center: [55.7558, 37.6173],
            zoom: 10,
          });
          mapInitialized.current = true;
        }
      });
    };

    return () => {
      document.head.removeChild(script);
      if (mapRef.current) {
        mapRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.geoObjects.removeAll();
      calls.forEach((call) => {
        const color = call.status === 'waiting' ? (call.waitTime > 60 ? 'red' : call.waitTime > 30 ? 'yellow' : 'green') :
          call.status === 'accepted' ? 'blue' : call.status === 'in-progress' ? 'purple' : 'gray';
        const marker = new window.ymaps.Placemark(call.coords, {}, { iconColor: color });
        mapRef.current.geoObjects.add(marker);
      });
    }
  }, [calls]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCall = generateRandomCall(calls.length + 1);
      setCalls((prev) => [...prev, newCall]);
      setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: Новый вызов от ${newCall.phone}`]);
    }, Math.floor(10000 + Math.random() * 50000));

    const timer = setInterval(() => {
      setCalls((prev) =>
        prev.map((call) => call.status === 'waiting' ? { ...call, waitTime: Math.floor((Date.now() - call.timestamp) / 1000) } : call)
      );
    }, 1000);

    const updateStats = () => {
      const total = calls.length;
      const falseCalls = calls.filter(c => c.status === 'false').length;
      const inQueue = calls.filter(c => c.status === 'waiting').length;
      const inProgress = calls.filter(c => c.status === 'in-progress').length;
      const avgResponse = calls.reduce((sum, c) => sum + (c.responseTime || 0), 0) / (total || 1);
      setStats({ total, false: falseCalls, inQueue, inProgress, avgResponse: Math.floor(avgResponse) });
    };
    updateStats();

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [calls]);

  const handleAccept = (callId) => {
    setCalls((prev) =>
      prev.map((c) =>
        c.id === callId ? { ...c, status: 'accepted', responseTime: Math.floor((Date.now() - c.timestamp) / 1000) } : c
      )
    );
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: Вызов ${callId} принят`]);
  };

  const handleReject = (callId) => {
    setCalls((prev) => prev.map((c) => c.id === callId ? { ...c, status: 'false' } : c));
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: Вызов ${callId} отклонен (ложный)`]);
  };

  const handleTransfer = (callId) => {
    setCalls((prev) => prev.map((c) => c.id === callId ? { ...c, status: 'transferred' } : c));
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: Вызов ${callId} переведен`]);
  };

  const handleInProgress = (callId) => {
    setCalls((prev) => prev.map((c) => c.id === callId ? { ...c, status: 'in-progress' } : c));
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: Вызов ${callId} в работе`]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Панель Оператора: {user.name}</h1>
        <div>
          <button onClick={toggleTheme} className="mr-4 bg-gray-300 dark:bg-gray-700 p-2 rounded">Toggle Theme</button>
          <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Выйти</button>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4 text-gray-800 dark:text-white">Ожидающие вызовы</h2>
          <ul className="space-y-4">
            {calls.map((call) => (
              <li key={call.id} className={`p-4 border rounded ${call.waitTime > 60 ? 'bg-red-100 dark:bg-red-900' : call.waitTime > 30 ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`}>
                <p className="text-gray-800 dark:text-white">Номер: {call.phone}</p>
                <p className="text-gray-800 dark:text-white">Адрес: {call.address}</p>
                <p className="text-gray-800 dark:text-white">Ожидание: {call.waitTime} сек</p>
                {call.status === 'waiting' && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleAccept(call.id)} className="bg-green-500 text-white px-2 py-1 rounded">Принять</button>
                    <button onClick={() => handleReject(call.id)} className="bg-red-500 text-white px-2 py-1 rounded">Ложный</button>
                    <button onClick={() => handleTransfer(call.id)} className="bg-blue-500 text-white px-2 py-1 rounded">Перевести</button>
                  </div>
                )}
                {call.status === 'accepted' && (
                  <button onClick={() => handleInProgress(call.id)} className="bg-blue-500 text-white px-2 py-1 rounded">В работу</button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4 text-gray-800 dark:text-white">Карта вызовов (Москва)</h2>
          <div id="map" className="w-full h-[500px]"></div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4 text-gray-800 dark:text-white">Статистика</h2>
          <p className="text-gray-800 dark:text-white">Всего вызовов: {stats.total}</p>
          <p className="text-gray-800 dark:text-white">Ложные: {stats.false}</p>
          <p className="text-gray-800 dark:text-white">В очереди: {stats.inQueue}</p>
          <p className="text-gray-800 dark:text-white">В работе: {stats.inProgress}</p>
          <p className="text-gray-800 dark:text-white">Среднее время ответа: {stats.avgResponse} сек</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4 text-gray-800 dark:text-white">Логи</h2>
          <ul className="space-y-2 overflow-y-auto h-40 text-gray-800 dark:text-white">
            {logs.map((log, idx) => <li key={idx}>{log}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;