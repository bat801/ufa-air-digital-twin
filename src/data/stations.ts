// Типы станций и организаций
export type StationType = 'background' | 'industrial' | 'auto' | 'automatic';
export type OrganizationType = 'rosgidromet' | 'mineco' | 'fbuz';

export interface Pollutant {
  name: string;
  value: number;
  unit: string;
  pdk: number;
  description: string;
}

export interface Station {
  id: string;
  name: string;
  address: string;
  organization: OrganizationType;
  type: StationType;
  lat: number;
  lng: number;
  pollutants: string[];
}

// Справочник загрязняющих веществ с ПДК
export const pollutantInfo: Record<string, { unit: string; pdk: number; description: string }> = {
  'PM2.5': { unit: 'мкг/м³', pdk: 35, description: 'Мелкодисперсные частицы диаметром менее 2.5 мкм. Проникают глубоко в лёгкие и кровоток.' },
  'PM10': { unit: 'мкг/м³', pdk: 60, description: 'Взвешенные частицы диаметром до 10 мкм. Раздражают дыхательные пути.' },
  'O₃': { unit: 'мкг/м³', pdk: 160, description: 'Озон — мощный окислитель, вызывает воспаление дыхательных путей.' },
  'NO₂': { unit: 'мкг/м³', pdk: 200, description: 'Диоксид азота — образуется при сгорании топлива, раздражает дыхательные пути.' },
  'NO': { unit: 'мкг/м³', pdk: 400, description: 'Оксид азота — прекурсор диоксида азота и озона.' },
  'SO₂': { unit: 'мкг/м³', pdk: 500, description: 'Диоксид серы — образуется при сжигании угля и нефти, вызывает кислотные дожди.' },
  'CO': { unit: 'мг/м³', pdk: 5, description: 'Оксид углерода — угарный газ, блокирует перенос кислорода кровью.' },
  'H₂S': { unit: 'мкг/м³', pdk: 8, description: 'Сероводород — токсичный газ с запахом тухлых яиц.' },
  'NH₃': { unit: 'мкг/м³', pdk: 200, description: 'Аммиак — едкий газ, раздражает слизистые оболочки.' },
  'Бензол': { unit: 'мкг/м³', pdk: 100, description: 'Канцероген, содержится в выхлопных газах и табачном дыме.' },
  'Толуол': { unit: 'мкг/м³', pdk: 600, description: 'Растворитель, при высоких концентрациях угнетает ЦНС.' },
  'Ксилолы': { unit: 'мкг/м³', pdk: 200, description: 'Смесь изомеров ксилола, раздражает дыхательные пути.' },
  'Этилбензол': { unit: 'мкг/м³', pdk: 20, description: 'Компонент бензина, потенциально канцерогенен.' },
  'Стирол': { unit: 'мкг/м³', pdk: 40, description: 'Используется в производстве пластиков, раздражает дыхательные пути.' },
  'Формальдегид': { unit: 'мкг/м³', pdk: 50, description: 'Канцероген, выделяется из строительных материалов.' },
  'Фенол': { unit: 'мкг/м³', pdk: 10, description: 'Токсичное вещество, раздражает кожу и слизистые.' },
  'Бенз(а)пирен': { unit: 'нг/м³', pdk: 1, description: 'Сильный канцероген, образуется при неполном сгорании топлива.' },
  'Хлорбензол': { unit: 'мкг/м³', pdk: 100, description: 'Растворитель, токсичен для печени и почек.' },
  'Ацетон': { unit: 'мкг/м³', pdk: 350, description: 'Растворитель, раздражает глаза и дыхательные пути.' },
  'Метанол': { unit: 'мкг/м³', pdk: 500, description: 'Токсичный спирт, вызывает слепоту и поражает ЦНС.' },
  'Этанол': { unit: 'мкг/м³', pdk: 5000, description: 'Этиловый спирт, при высоких концентрациях угнетает ЦНС.' },
  'HCl': { unit: 'мкг/м³', pdk: 200, description: 'Хлорид водорода — едкий газ, раздражает дыхательные пути.' },
  'Cu': { unit: 'мкг/м³', pdk: 2, description: 'Медь — в пыли токсична для дыхательных путей.' },
  'Zn': { unit: 'мкг/м³', pdk: 50, description: 'Цинк — вызывает металлическую лихорадку при вдыхании.' },
  'Pb': { unit: 'мкг/м³', pdk: 0.5, description: 'Свинец — нейротоксин, накапливается в организме.' },
  'Fe': { unit: 'мкг/м³', pdk: 40, description: 'Железо — пыль вызывает сидероз лёгких.' },
  'Mn': { unit: 'мкг/м³', pdk: 1, description: 'Марганец — нейротоксин при длительном воздействии.' },
  'Изопропилбензол': { unit: 'мкг/м³', pdk: 50, description: 'Кумол — углеводород, используется как растворитель и компонент топлива. Обладает наркотическим действием.' },
  'Бутанол': { unit: 'мкг/м³', pdk: 100, description: 'Бутиловый спирт — растворитель, раздражает слизистые оболочки глаз и дыхательных путей.' },
  'Этилацетат': { unit: 'мкг/м³', pdk: 100, description: 'Этиловый эфир уксусной кислоты — растворитель с резким запахом, раздражает дыхательные пути.' },
  'Бутилацетат': { unit: 'мкг/м³', pdk: 100, description: 'Бутиловый эфир уксусной кислоты — растворитель, используется в лакокрасочной промышленности.' },
  'Альфаметилстирол': { unit: 'мкг/м³', pdk: 40, description: 'α-метилстирол — мономер для производства пластмасс, токсичен при вдыхании.' },
  'Изопропанол': { unit: 'мкг/м³', pdk: 600, description: 'Изопропиловый спирт — растворитель, угнетает центральную нервную систему.' },
  'Пропанол': { unit: 'мкг/м³', pdk: 300, description: 'Пропиловый спирт — раздражает слизистые, обладает наркотическим действием.' },
  'Изобутанол': { unit: 'мкг/м³', pdk: 100, description: 'Изобутиловый спирт — токсичен, поражает печень и почки.' },
  '2-этоксиэтанол': { unit: 'мкг/м³', pdk: 7, description: 'Этилцеллозольв — гликолевый эфир, токсичен для крови и почек.' },
  'Метилэтилкетон': { unit: 'мкг/м³', pdk: 200, description: 'Бутанон — растворитель, раздражает дыхательные пути и роговицу глаз.' },
  'Cd': { unit: 'нг/м³', pdk: 3, description: 'Кадмий — тяжелый металл, канцероген, накапливается в почках.' },
  'Mg': { unit: 'мкг/м³', pdk: 50, description: 'Магний — в виде оксида (жженая магнезия) вызывает литейную лихорадку.' },
  'Ni': { unit: 'нг/м³', pdk: 10, description: 'Никель — тяжелый металл, канцероген, вызывает дерматиты и астму.' },
  'Cr': { unit: 'нг/м³', pdk: 1.5, description: 'Хром (VI) — сильный канцероген, поражает дыхательные пути.' },
  'м-п-Ксилол': { unit: 'мкг/м³', pdk: 200, description: 'Смесь мета- и пара-ксилола — углеводороды, угнетают нервную систему.' },
  'о-Ксилол': { unit: 'мкг/м³', pdk: 200, description: 'Орто-ксилол — изомер ксилола, раздражает кожу и слизистые.' },
  'PM 1': { unit: 'мкг/м³', pdk: 35, description: 'Сверхмелкие частицы диаметром менее 1 мкм. Проникают в кровоток.' },
  'PM 4': { unit: 'мкг/м³', pdk: 60, description: 'Взвешенные частицы диаметром до 4 мкм. Поражают альвеолы легких.' },
};

// Станции Росгидромета (ПНЗ)
export const rosgidromet: Station[] = [
  { id: 'pnz-1', name: 'ПНЗ №1', address: 'ул. Минская, 64', organization: 'rosgidromet', type: 'background', lat: 54.711733, lng: 55.812374, pollutants: ['PM10', 'SO₂', 'CO', 'NO₂', 'NO', 'H₂S', 'Бенз(а)пирен'] },
  { id: 'pnz-2', name: 'ПНЗ №2', address: 'ул. Свободы, 44', organization: 'rosgidromet', type: 'auto', lat: 54.819186, lng: 56.108862, pollutants: ['PM10', 'CO', 'NO₂', 'NO', 'Фенол', 'HCl', 'SO₂'] },
  { id: 'pnz-5', name: 'ПНЗ №5', address: 'пр. Октября, 141', organization: 'rosgidromet', type: 'auto', lat: 54.797648, lng: 56.038515, pollutants: ['PM10', 'CO', 'NO₂', 'H₂S', 'Формальдегид', 'Бензол', 'Ксилолы', 'Толуол', 'Этилбензол', 'Хлорбензол', 'Изопропилбензол', 'Бенз(а)пирен', 'Pb', 'Mn', 'Cu', 'Fe', 'Zn', 'Cd', 'Cr', 'Ni', 'Mg'] },
  { id: 'pnz-12', name: 'ПНЗ №12', address: 'ул. Мира, 11', organization: 'rosgidromet', type: 'background', lat: 54.814766, lng: 56.065770, pollutants: ['PM10', 'CO', 'NO₂', 'Фенол', 'HCl', 'NH₃', 'H₂S'] },
  { id: 'pnz-14', name: 'ПНЗ №14', address: 'ул. Ульяновых, 57', organization: 'rosgidromet', type: 'industrial', lat: 54.825514, lng: 56.081311, pollutants: ['PM10', 'CO', 'NO₂', 'H₂S', 'HCl', 'Формальдегид', 'Бензол', 'Ксилолы', 'Толуол', 'Этилбензол', 'Хлорбензол', 'Изопропилбензол', 'Бенз(а)пирен'] },
  { id: 'pnz-16', name: 'ПНЗ №16', address: 'пр. Октября, 65/4', organization: 'rosgidromet', type: 'background', lat: 54.760823, lng: 56.004254, pollutants: ['PM10', 'SO₂', 'CO', 'NO₂', 'NO', 'NH₃'] },
  { id: 'pnz-17', name: 'ПНЗ №17', address: 'ул. Гафури, 101', organization: 'rosgidromet', type: 'background', lat: 54.734924, lng: 55.931975, pollutants: ['PM10', 'CO', 'NO₂', 'Фенол', 'Бензол', 'Ксилолы', 'Толуол', 'Этилбензол', 'Хлорбензол', 'Изопропилбензол', 'Бенз(а)пирен', 'HCl'] },
  { id: 'pnz-18', name: 'ПНЗ №18', address: 'ул. Достоевского, 102/1', organization: 'rosgidromet', type: 'industrial', lat: 54.731243, lng: 55.957928, pollutants: ['PM10', 'CO', 'NO₂', 'NO', 'H₂S', 'Формальдегид'] },
  { id: 'pnz-23', name: 'ПНЗ №23', address: 'ул. Злобина, 11', organization: 'rosgidromet', type: 'auto', lat: 54.719908, lng: 55.996878, pollutants: ['PM10', 'SO₂', 'CO', 'NO₂', 'Формальдегид', 'Бенз(а)пирен', 'Pb', 'Mn', 'Cu', 'Fe', 'Zn', 'Cd', 'Cr', 'Ni', 'Mg'] },
];

// Станции Минэкологии (АСКЗА)
export const mineco: Station[] = [
  { id: 'askza-1', name: 'АСКЗА №1', address: 'ПКиО «Кашкадан»', organization: 'mineco', type: 'background', lat: 54.774981, lng: 56.059941, pollutants: ['CO', 'Бензол', 'Толуол', 'м-п-Ксилол', 'о-Ксилол', 'Ацетон', 'Фенол', 'Этилбензол', 'Изопропилбензол', 'Бутанол', 'Метанол', 'Этанол', 'Бутилацетат', 'Этилацетат', 'Альфаметилстирол', 'Изопропанол', 'Изобутанол', '2-этоксиэтанол', 'Стирол'] },
  { id: 'askza-2', name: 'АСКЗА №2', address: 'ул. Вологодская, д.79', organization: 'mineco', type: 'background', lat: 54.818740, lng: 56.125643, pollutants: ['SO₂', 'CO', 'Изобутанол', 'Бутанол', 'Изопропанол', 'Пропанол', 'Метанол', 'Метилэтилкетон', 'Ацетон', 'Альфаметилстирол', 'Изопропилбензол', 'Этанол', 'PM10', 'PM2.5', 'PM 1', 'PM 4'] },
  { id: 'askza-3', name: 'АСКЗА №3', address: 'ул. Новочеркасская, 7', organization: 'mineco', type: 'background', lat: 54.827288, lng: 56.067657, pollutants: ['CO', 'SO₂'] },
  { id: 'askza-4', name: 'АСКЗА №4', address: 'ПКиО «Нефтехимик»', organization: 'mineco', type: 'background', lat: 54.817749, lng: 56.090537, pollutants: ['SO₂'] },
];

// Точки ФБУЗ
export const fbuz: Station[] = [
  { id: 'fbuz-1', name: 'ФБУЗ №1', address: 'ул. Вологодская, д.23', organization: 'fbuz', type: 'background', lat: 54.812748, lng: 56.128724, pollutants: ['Формальдегид', 'Бензол', 'Фенол', 'Ацетон', 'HCl', 'H₂S', 'Этилбензол', 'NH₃', 'Ксилолы', 'Толуол', 'Хлорбензол', 'Изопропилбензол'] },
  { id: 'fbuz-2', name: 'ФБУЗ №2', address: 'ул. Сельская Богородская, д.39', organization: 'fbuz', type: 'background', lat: 54.787718, lng: 56.130251, pollutants: ['Формальдегид', 'Бензол', 'Фенол', 'Ацетон', 'HCl', 'H₂S', 'Этилбензол', 'NH₃', 'Ксилолы', 'Толуол', 'Хлорбензол', 'Изопропилбензол'] },
  { id: 'fbuz-3', name: 'ФБУЗ №3', address: 'ул. Ак-Идель, д.16', organization: 'fbuz', type: 'background', lat: 54.744898, lng: 55.902115, pollutants: ['Формальдегид', 'Бензол', 'Фенол', 'Ацетон', 'HCl', 'H₂S', 'Этилбензол', 'NH₃', 'Ксилолы', 'Толуол', 'Хлорбензол', 'Изопропилбензол'] },
  { id: 'fbuz-4', name: 'ФБУЗ №4', address: 'ул. Юрия Гагарина, д.56', organization: 'fbuz', type: 'background', lat: 54.772484, lng: 56.079191, pollutants: ['Формальдегид', 'Бензол', 'Фенол', 'Ацетон', 'HCl', 'H₂S', 'Этилбензол', 'NH₃', 'Ксилолы', 'Толуол', 'Хлорбензол', 'Изопропилбензол'] },
  { id: 'fbuz-5', name: 'ФБУЗ №5', address: 'ул. Архитектурная, д.5а', organization: 'fbuz', type: 'background', lat: 54.818138, lng: 56.079820, pollutants: ['Формальдегид', 'Бензол', 'Фенол', 'Ацетон', 'HCl', 'H₂S', 'Этилбензол', 'NH₃', 'Ксилолы', 'Толуол', 'Хлорбензол', 'Изопропилбензол'] },
];

export const allStations: Station[] = [...rosgidromet, ...mineco, ...fbuz];

// Названия организаций
export const organizationNames: Record<OrganizationType, string> = {
  rosgidromet: 'Росгидромет',
  mineco: 'Минэкологии РБ',
  fbuz: 'ФБУЗ «ЦГиЭ»',
};

// Названия типов станций
export const stationTypeNames: Record<StationType, string> = {
  background: 'Фоновая',
  industrial: 'Промышленная',
  auto: 'Автотранспортная',
  automatic: 'Автоматическая',
};

// Генерация случайного значения в диапазоне
export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Генерация данных загрязнителя
export function generatePollutantData(pollutantName: string): Pollutant | null {
  const info = pollutantInfo[pollutantName];
  if (!info) return null;
  
  // Генерируем значение от 0 до 3 ПДК
  const maxMultiplier = Math.random() > 0.8 ? 3 : (Math.random() > 0.5 ? 1.5 : 1);
  const value = Math.round(randomInRange(0, info.pdk * maxMultiplier) * 100) / 100;
  
  return {
    name: pollutantName,
    value,
    unit: info.unit,
    pdk: info.pdk,
    description: info.description,
  };
}

// Расчёт AQI по упрощённой формуле
export function calculateAQI(pollutants: Pollutant[]): number {
  if (pollutants.length === 0) return 0;
  
  const ratios = pollutants.map(p => (p.value / p.pdk) * 50);
  const maxRatio = Math.max(...ratios);
  
  return Math.min(Math.round(maxRatio), 500);
}

// Определение цвета по AQI
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#22c55e'; // green
  if (aqi <= 100) return '#eab308'; // yellow
  if (aqi <= 150) return '#f97316'; // orange
  if (aqi <= 200) return '#ef4444'; // red
  return '#a855f7'; // purple
}

// Текстовое описание AQI
export function getAQILabel(aqi: number): string {
  if (aqi <= 50) return 'Хорошее';
  if (aqi <= 100) return 'Умеренное';
  if (aqi <= 150) return 'Вредное для чувствительных групп';
  if (aqi <= 200) return 'Вредное';
  return 'Очень вредное';
}

// Генерация исторических данных (24 часа)
export function generateHistoricalData(baseAQI: number): number[] {
  const data: number[] = [];
  let current = baseAQI;
  
  for (let i = 0; i < 24; i++) {
    const change = randomInRange(-15, 15);
    current = Math.max(10, Math.min(200, current + change));
    data.push(Math.round(current));
  }
  
  return data;
}

// Генерация недельных данных
export function generateWeeklyData(baseAQI: number): number[] {
  const data: number[] = [];
  let current = baseAQI;
  
  for (let i = 0; i < 7; i++) {
    const change = randomInRange(-20, 20);
    current = Math.max(15, Math.min(180, current + change));
    data.push(Math.round(current));
  }
  
  return data;
}

// Генерация прогноза (72 часа)
export function generateForecastData(baseAQI: number): number[] {
  const data: number[] = [];
  let current = baseAQI;
  
  // Добавляем тренд
  const trend = Math.random() > 0.5 ? 1 : -1;
  
  for (let i = 0; i < 72; i++) {
    const change = randomInRange(-8, 8) + (trend * 0.5);
    current = Math.max(10, Math.min(250, current + change));
    data.push(Math.round(current));
  }
  
  return data;
}

// Определение основного загрязнителя
export function getMainPollutant(pollutants: Pollutant[]): string {
  if (pollutants.length === 0) return 'Н/Д';
  
  let maxRatio = 0;
  let mainPollutant = pollutants[0].name;
  
  for (const p of pollutants) {
    const ratio = p.value / p.pdk;
    if (ratio > maxRatio) {
      maxRatio = ratio;
      mainPollutant = p.name;
    }
  }
  
  return mainPollutant;
}
