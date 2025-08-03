import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// Componente principal del dashboard
function Dashboard() {
  const navigate = useNavigate();

  const sensors = [
    { id: 'temperature', name: 'Temperatura', icon: '🌡️', path: '/temperature' },
    { id: 'noise', name: 'Ruido', icon: '🔊', path: '/noise' },
    { id: 'light', name: 'Luz', icon: '💡', path: '/light' },
    { id: 'air', name: 'Pureza del Aire', icon: '🌬️', path: '/air' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Monitoreo de la Biblioteca
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              onClick={() => navigate(sensor.path)}
              className="bg-purple-100 hover:bg-purple-50 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{sensor.icon}</div>
                <h2 className="text-xl font-semibold text-gray-800">{sensor.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente genérico para sensores
function SensorComponent({ title, unit, icon, thresholds, generateValue }) {
  const [currentValue, setCurrentValue] = useState(0);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => setIsLoading(false), 1000);

    // Generar datos cada 3-5 segundos
    const interval = setInterval(() => {
      const newValue = generateValue();
      setCurrentValue(newValue);
      setHistory(prev => {
        const newHistory = [...prev, newValue];
        return newHistory.slice(-10); // Mantener solo los últimos 10 valores
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [generateValue]);

  const getCurrentThreshold = () => {
    return thresholds.find(t => currentValue >= t.value) || thresholds[thresholds.length - 1];
  };

  const getColorForValue = (value) => {
    if (thresholds[0] && value >= thresholds[0].value) return 'text-red-500';
    if (thresholds[1] && value >= thresholds[1].value) return 'text-yellow-500';
    return 'text-blue-500';
  };

  const getProgressWidth = () => {
    const maxValue = thresholds[0]?.value * 1.2 || 100;
    return Math.min((currentValue / maxValue) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del sensor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-block mb-6 text-blue-600 hover:text-blue-800 font-medium">
          ← Volver al Dashboard
        </Link>
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{icon}</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-800 mb-2">
                {currentValue}
                <span className="text-2xl text-gray-600 ml-2">{unit}</span>
              </div>
              <div className={`text-xl font-semibold mb-4 ${getCurrentThreshold().color}`}>
                {getCurrentThreshold().label}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all duration-500 ${getCurrentThreshold().bgColor}`}
                  style={{ width: `${getProgressWidth()}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Historial (últimos 10 valores)
            </h3>
            <div className="flex flex-wrap gap-2">
              {history.map((value, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-lg bg-white shadow-sm font-medium ${getColorForValue(value)}`}
                >
                  {value}{unit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componentes específicos para cada sensor
function TemperatureSensor() {
  const thresholds = [
    { value: 28, color: 'text-red-500', bgColor: 'bg-red-500', label: 'Alto' },
    { value: 25, color: 'text-yellow-500', bgColor: 'bg-yellow-500', label: 'Medio' },
    { value: 23, color: 'text-blue-500', bgColor: 'bg-blue-500', label: 'Normal' }
  ];

  const generateValue = () => Math.floor(Math.random() * 6) + 23; // 23-28°C

  return (
    <SensorComponent
      title="Sensor de Temperatura"
      unit="°C"
      icon="🌡️"
      thresholds={thresholds}
      generateValue={generateValue}
    />
  );
}

function NoiseSensor() {
  const thresholds = [
    { value: 70, color: 'text-red-500', bgColor: 'bg-red-500', label: 'Alto' },
    { value: 50, color: 'text-yellow-500', bgColor: 'bg-yellow-500', label: 'Medio' },
    { value: 30, color: 'text-blue-500', bgColor: 'bg-blue-500', label: 'Normal' }
  ];

  const generateValue = () => Math.floor(Math.random() * 60) + 25; // 25-85 dB

  return (
    <SensorComponent
      title="Sensor de Ruido"
      unit="dB"
      icon="🔊"
      thresholds={thresholds}
      generateValue={generateValue}
    />
  );
}

function LightSensor() {
  const thresholds = [
    { value: 800, color: 'text-red-500', bgColor: 'bg-red-500', label: 'Muy Brillante' },
    { value: 500, color: 'text-yellow-500', bgColor: 'bg-yellow-500', label: 'Brillante' },
    { value: 200, color: 'text-blue-500', bgColor: 'bg-blue-500', label: 'Normal' },
    { value: 50, color: 'text-gray-500', bgColor: 'bg-gray-500', label: 'Tenue' }
  ];

  const generateValue = () => Math.floor(Math.random() * 940) + 10; // 10-950 lux

  return (
    <SensorComponent
      title="Sensor de Luz"
      unit=" lux"
      icon="💡"
      thresholds={thresholds}
      generateValue={generateValue}
    />
  );
}

function AirSensor() {
  const thresholds = [
    { value: 1200, color: 'text-red-500', bgColor: 'bg-red-500', label: 'Alto' },
    { value: 800, color: 'text-yellow-500', bgColor: 'bg-yellow-500', label: 'Medio' },
    { value: 350, color: 'text-blue-500', bgColor: 'bg-blue-500', label: 'Normal' }
  ];

  const generateValue = () => Math.floor(Math.random() * 1100) + 300; // 300-1400 PPM

  return (
    <SensorComponent
      title="Sensor de Pureza del Aire"
      unit=" PPM CO2"
      icon="🌬️"
      thresholds={thresholds}
      generateValue={generateValue}
    />
  );
}

// Aplicación principal
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/temperature" element={<TemperatureSensor />} />
        <Route path="/noise" element={<NoiseSensor />} />
        <Route path="/light" element={<LightSensor />} />
        <Route path="/air" element={<AirSensor />} />
      </Routes>
    </Router>
  );
}

export default App;

