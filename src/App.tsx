import { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'leaflet/dist/leaflet.css';
import {
  allStations,
  Station,
  Pollutant,
  organizationNames,
  stationTypeNames,
  generatePollutantData,
  calculateAQI,
  getAQIColor,
  getAQILabel,
  generateHistoricalData,
  generateWeeklyData,
  generateForecastData,
  getMainPollutant,
  pollutantInfo,
} from './data/stations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Центр Уфы
const UFA_CENTER: [number, number] = [54.735147, 55.958727];

// Создание иконок маркеров
const createIcon = (color: string, shape: 'circle' | 'square' | 'triangle') => {
  const size = 24;
  let svgPath = '';
  
  if (shape === 'circle') {
    svgPath = `<circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>`;
  } else if (shape === 'square') {
    svgPath = `<rect x="2" y="2" width="20" height="20" rx="3" fill="${color}" stroke="white" stroke-width="2"/>`;
  } else {
    svgPath = `<polygon points="12,2 22,22 2,22" fill="${color}" stroke="white" stroke-width="2"/>`;
  }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">${svgPath}</svg>`;
  
  return L.divIcon({
    html: svg,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Данные станции
interface StationData {
  station: Station;
  pollutants: Pollutant[];
  aqi: number;
  historical: number[];
  weekly: number[];
  forecast: number[];
}

// Зоны AQI для карты
const aqiZones = [
  { lat: 54.745, lng: 55.945, radius: 0.015, aqi: 35 },
  { lat: 54.725, lng: 55.965, radius: 0.012, aqi: 75 },
  { lat: 54.755, lng: 55.985, radius: 0.018, aqi: 45 },
  { lat: 54.765, lng: 55.935, radius: 0.014, aqi: 120 },
  { lat: 54.715, lng: 55.950, radius: 0.016, aqi: 55 },
];

// Компонент для обновления вида карты
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [map, center]);
  return null;
}

export function App() {
  const [stationsData, setStationsData] = useState<StationData[]>([]);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPollutant, setSelectedPollutant] = useState<string>('PM2.5');
  const [activeTab, setActiveTab] = useState<'current' | 'charts' | 'forecast'>('current');
  const [selectedChartStation, setSelectedChartStation] = useState<string>(allStations[0].id);
  const [showSidebar, setShowSidebar] = useState(false);

  // Генерация данных для всех станций
  const generateAllData = useCallback(() => {
    return allStations.map(station => {
      const pollutants = station.pollutants
        .map(p => generatePollutantData(p))
        .filter((p): p is Pollutant => p !== null);
      const aqi = calculateAQI(pollutants);
      
      return {
        station,
        pollutants,
        aqi,
        historical: generateHistoricalData(aqi),
        weekly: generateWeeklyData(aqi),
        forecast: generateForecastData(aqi),
      };
    });
  }, []);

  // Инициализация данных
  useEffect(() => {
    setStationsData(generateAllData());
  }, [generateAllData]);

  // Обновление данных
  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newData = generateAllData();
    setStationsData(newData);
    if (selectedStation) {
      const updated = newData.find(d => d.station.id === selectedStation.station.id);
      if (updated) setSelectedStation(updated);
    }
    setIsLoading(false);
  };

  // Клик по станции
  const handleStationClick = (data: StationData) => {
    setSelectedStation(data);
    setShowSidebar(true);
    setActiveTab('current');
  };

  // Расчёт среднего AQI
  const averageAQI = stationsData.length > 0
    ? Math.round(stationsData.reduce((sum, d) => sum + d.aqi, 0) / stationsData.length)
    : 0;

  // Основной загрязнитель (по всем станциям)
  const allPollutants = stationsData.flatMap(d => d.pollutants);
  const mainPollutant = getMainPollutant(allPollutants);

  // Тренд за сутки
  const trend = Math.random() > 0.5;
  const trendPercent = Math.round(Math.random() * 15 + 1);

  // Цвет маркера в зависимости от выбранного показателя
  const getMarkerColor = (data: StationData) => {
    if (selectedPollutant === 'AQI') {
      return getAQIColor(data.aqi);
    }
    const pollutant = data.pollutants.find(p => p.name === selectedPollutant);
    if (pollutant) {
      const ratio = pollutant.value / pollutant.pdk;
      if (ratio <= 0.5) return '#22c55e';
      if (ratio <= 1) return '#eab308';
      if (ratio <= 1.5) return '#f97316';
      return '#ef4444';
    }
    return '#9ca3af';
  };

  // Форма маркера по типу организации
  const getMarkerShape = (org: string): 'circle' | 'square' | 'triangle' => {
    switch (org) {
      case 'rosgidromet': return 'circle';
      case 'mineco': return 'square';
      case 'fbuz': return 'triangle';
      default: return 'circle';
    }
  };

  // Данные для графика 24 часа
  const hours24Labels = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() - 23 + i);
    return `${hour.getHours()}:00`;
  });

  // Данные для графика прогноза
  const forecast72Labels = Array.from({ length: 72 }, (_, i) => {
    const hour = new Date();
    hour.setHours(hour.getHours() + i);
    return i % 6 === 0 ? `${hour.getDate()}.${hour.getMonth() + 1} ${hour.getHours()}:00` : '';
  });

  // Данные для недельного графика
  const weekLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Конфигурация графика
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'AQI',
        },
      },
    },
  };

  // Найти данные выбранной станции для графика
  const chartStationData = stationsData.find(d => d.station.id === selectedChartStation);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Верхняя панель */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Цифровой двойник городской воздушной среды</h1>
                <p className="text-xs text-gray-500">г. Уфа, Республика Башкортостан</p>
              </div>
            </div>

            {/* Статистика */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Средний AQI</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: getAQIColor(averageAQI) }}>
                      {averageAQI}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: getAQIColor(averageAQI) + '20', color: getAQIColor(averageAQI) }}>
                      {getAQILabel(averageAQI)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">Основной загрязнитель</p>
                <p className="text-lg font-semibold text-gray-900">{mainPollutant}</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">Тренд за сутки</p>
                <div className="flex items-center gap-1">
                  <span className={`text-lg font-semibold ${trend ? 'text-red-500' : 'text-green-500'}`}>
                    {trend ? '↑' : '↓'} {trendPercent}%
                  </span>
                </div>
              </div>

              <div className="text-right max-w-48">
                <p className="text-xs text-gray-500">Прогноз</p>
                <p className="text-sm text-gray-700">
                  {trend ? 'Ожидается ухудшение из-за роста ' + mainPollutant : 'Улучшение качества воздуха'}
                </p>
              </div>

              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isLoading ? 'Загрузка...' : 'Обновить'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <div className="flex flex-1 relative">
        {/* Карта */}
        <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'mr-96' : ''}`}>
          {/* Контролы карты */}
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
            <label className="block text-xs text-gray-500 mb-1">Показатель на карте:</label>
            <select
              value={selectedPollutant}
              onChange={(e) => setSelectedPollutant(e.target.value)}
              className="w-40 px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AQI">AQI (общий индекс)</option>
              {Object.keys(pollutantInfo).slice(0, 15).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Легенда */}
          <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3" style={{ marginRight: showSidebar ? '24rem' : '0' }}>
            <p className="text-xs font-medium text-gray-700 mb-2">Легенда</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" fill="#3b82f6" />
                </svg>
                <span>Росгидромет (ПНЗ)</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2" fill="#22c55e" />
                </svg>
                <span>Минэкологии (АСКЗА)</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <polygon points="12,4 20,20 4,20" fill="#f97316" />
                </svg>
                <span>ФБУЗ «ЦГиЭ»</span>
              </div>
              <hr className="my-2" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>0-50 (хорошо)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>51-100 (умеренно)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span>101-150 (вредно)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>151+ (опасно)</span>
              </div>
            </div>
          </div>

          <MapContainer
            center={UFA_CENTER}
            zoom={12}
            className="w-full h-[500px]"
            style={{ minHeight: '500px' }}
          >
            <MapUpdater center={UFA_CENTER} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Цветовые зоны AQI */}
            {aqiZones.map((zone, idx) => {
              const points: [number, number][] = [];
              for (let i = 0; i < 36; i++) {
                const angle = (i * 10) * Math.PI / 180;
                points.push([
                  zone.lat + zone.radius * Math.cos(angle),
                  zone.lng + zone.radius * 1.5 * Math.sin(angle)
                ]);
              }
              return (
                <Polygon
                  key={idx}
                  positions={points}
                  pathOptions={{
                    fillColor: getAQIColor(zone.aqi),
                    fillOpacity: 0.2,
                    color: getAQIColor(zone.aqi),
                    weight: 1,
                  }}
                />
              );
            })}

            {/* Маркеры станций */}
            {stationsData.map((data) => (
              <Marker
                key={data.station.id}
                position={[data.station.lat, data.station.lng]}
                icon={createIcon(getMarkerColor(data), getMarkerShape(data.station.organization))}
                eventHandlers={{
                  click: () => handleStationClick(data),
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{data.station.name}</strong>
                    <br />
                    {data.station.address}
                    <br />
                    <span style={{ color: getAQIColor(data.aqi) }}>AQI: {data.aqi}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Нижняя панель с графиками */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Динамика AQI за неделю</h3>
              <select
                value={selectedChartStation}
                onChange={(e) => setSelectedChartStation(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allStations.map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.address}</option>
                ))}
              </select>
            </div>
            
            {chartStationData && (
              <div className="h-64">
                <Line
                  data={{
                    labels: weekLabels,
                    datasets: [{
                      label: 'AQI',
                      data: chartStationData.weekly,
                      borderColor: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      fill: true,
                      tension: 0.4,
                    }],
                  }}
                  options={chartOptions}
                />
              </div>
            )}
          </div>

          {/* Справочная информация */}
          <div className="p-4 bg-gray-100 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Справочник загрязняющих веществ</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Object.entries(pollutantInfo).slice(0, 12).map(([name, info]) => (
                <div
                  key={name}
                  className="group relative bg-white p-2 rounded-lg shadow-sm cursor-help hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">ПДК: {info.pdk} {info.unit}</p>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-50">
                    {info.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Боковая панель */}
        <div
          className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 z-[1001] overflow-y-auto ${
            showSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ top: '0' }}
        >
          {selectedStation && (
            <>
              {/* Заголовок */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedStation.station.name}</h2>
                    <p className="text-sm text-gray-500">{selectedStation.station.address}</p>
                  </div>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* AQI индикатор */}
                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: getAQIColor(selectedStation.aqi) }}
                  >
                    {selectedStation.aqi}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Индекс качества воздуха</p>
                    <p className="font-medium" style={{ color: getAQIColor(selectedStation.aqi) }}>
                      {getAQILabel(selectedStation.aqi)}
                    </p>
                  </div>
                </div>

                {/* Метаданные */}
                <div className="mt-3 flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {organizationNames[selectedStation.station.organization]}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {stationTypeNames[selectedStation.station.type]}
                  </span>
                </div>
              </div>

              {/* Вкладки */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  {(['current', 'charts', 'forecast'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab === 'current' && 'Значения'}
                      {tab === 'charts' && 'Графики'}
                      {tab === 'forecast' && 'Прогноз'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Содержимое вкладок */}
              <div className="p-4">
                {activeTab === 'current' && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Текущие концентрации</h3>
                    {selectedStation.pollutants.map((pollutant) => {
                      const ratio = pollutant.value / pollutant.pdk;
                      const isExceeded = ratio > 1;
                      
                      return (
                        <div
                          key={pollutant.name}
                          className={`p-3 rounded-lg border ${
                            isExceeded ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="group relative cursor-help">
                              <span className="font-medium text-gray-900">{pollutant.name}</span>
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-56 z-50">
                                {pollutant.description}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`font-bold ${isExceeded ? 'text-red-600' : 'text-gray-900'}`}>
                                {pollutant.value} {pollutant.unit}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>ПДК: {pollutant.pdk} {pollutant.unit}</span>
                              <span className={isExceeded ? 'text-red-600 font-medium' : ''}>
                                {(ratio * 100).toFixed(0)}% от ПДК
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  ratio > 1.5 ? 'bg-red-500' : ratio > 1 ? 'bg-orange-500' : ratio > 0.5 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    <button className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Подробнее →
                    </button>
                  </div>
                )}

                {activeTab === 'charts' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">AQI за последние 24 часа</h3>
                    <div className="h-48">
                      <Line
                        data={{
                          labels: hours24Labels,
                          datasets: [{
                            label: 'AQI',
                            data: selectedStation.historical,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.3,
                            pointRadius: 2,
                          }],
                        }}
                        options={{
                          ...chartOptions,
                          scales: {
                            ...chartOptions.scales,
                            x: {
                              ticks: {
                                maxTicksLimit: 8,
                                font: { size: 10 },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'forecast' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Прогноз AQI на 72 часа</h3>
                    <div className="h-48">
                      <Line
                        data={{
                          labels: forecast72Labels,
                          datasets: [{
                            label: 'Прогноз AQI',
                            data: selectedStation.forecast,
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            fill: true,
                            tension: 0.3,
                            pointRadius: 0,
                            borderDash: [5, 5],
                          }],
                        }}
                        options={{
                          ...chartOptions,
                          scales: {
                            ...chartOptions.scales,
                            x: {
                              ticks: {
                                maxTicksLimit: 6,
                                font: { size: 9 },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                    <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Прогноз:</strong> {selectedStation.forecast[71] > selectedStation.forecast[0]
                          ? 'Ожидается ухудшение качества воздуха'
                          : 'Ожидается улучшение качества воздуха'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Анимация загрузки */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-xl p-6 shadow-xl flex items-center gap-4">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-gray-700 font-medium">Обновление данных...</span>
          </div>
        </div>
      )}
    </div>
  );
}
