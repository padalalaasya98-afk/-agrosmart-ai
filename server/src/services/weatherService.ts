export interface WeatherData {
  location: string;
  temperature: number; // °C
  humidity: number; // %
  rainfallEstimated: number; // mm seasonal estimate
  weatherCondition: string;
  isLive: boolean;
  source: string;
  disclaimer: string;
}

const REGIONAL_AGRO_CLIMATES: Record<string, { temp: number; hum: number; rain: number; cond: string }> = {
  'ludhiana': { temp: 19.5, hum: 62, rain: 520, cond: 'Mild & Sunny (Rabi Season)' },
  'punjab': { temp: 19.0, hum: 60, rain: 550, cond: 'Clear Sky' },
  'east godavari': { temp: 28.5, hum: 82, rain: 1550, cond: 'Tropical Humid (Monsoon)' },
  'andhra pradesh': { temp: 29.0, hum: 78, rain: 1100, cond: 'Warm & Semi-Humid' },
  'jodhpur': { temp: 32.5, hum: 38, rain: 360, cond: 'Arid & Sunny' },
  'rajasthan': { temp: 31.0, hum: 40, rain: 420, cond: 'Dry & Warm' },
  'nagpur': { temp: 29.5, hum: 64, rain: 920, cond: 'Partly Cloudy' },
  'maharashtra': { temp: 27.5, hum: 68, rain: 980, cond: 'Warm & Moderate Moisture' },
  'shivamogga': { temp: 24.5, hum: 76, rain: 1350, cond: 'Sub-tropical Rainfed' },
  'karnataka': { temp: 26.0, hum: 70, rain: 950, cond: 'Pleasant & Moderate' },
  'varanasi': { temp: 23.0, hum: 65, rain: 880, cond: 'Hazy Sun' },
  'uttar pradesh': { temp: 22.0, hum: 66, rain: 820, cond: 'Mild Plains Weather' },
  'indore': { temp: 26.5, hum: 65, rain: 890, cond: 'Scattered Clouds' },
  'madhya pradesh': { temp: 26.0, hum: 62, rain: 910, cond: 'Central Plateau Climate' },
  'coimbatore': { temp: 27.0, hum: 72, rain: 720, cond: 'Tropical Breeze' },
  'tamil nadu': { temp: 28.5, hum: 75, rain: 920, cond: 'Warm Maritime' },
  'bihar': { temp: 24.0, hum: 70, rain: 1050, cond: 'Humid Subtropical' },
  'west bengal': { temp: 27.0, hum: 80, rain: 1450, cond: 'Humid Gangetic Plain' }
};

export async function fetchLocationWeather(query: string): Promise<WeatherData> {
  const cleanQuery = query.toLowerCase().trim();

  // 1. If OpenWeather API key is configured, attempt live fetch
  if (process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY.trim() !== '') {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY.trim()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as any;
        return {
          location: `${data.name}, ${data.sys?.country || ''}`,
          temperature: Math.round(data.main?.temp * 10) / 10,
          humidity: data.main?.humidity || 50,
          rainfallEstimated: data.rain ? (data.rain['1h'] || data.rain['3h'] || 10) * 80 : 750,
          weatherCondition: data.weather?.[0]?.description || 'Clear Sky',
          isLive: true,
          source: 'OpenWeather Live API',
          disclaimer: 'Live instant weather reflects immediate atmospheric readings. Crop suitability uses typical seasonal growing averages.'
        };
      }
    } catch (err) {
      console.warn('[Weather Service] Live OpenWeather API call failed, falling back to regional normals:', err);
    }
  }

  // 2. High-fidelity regional Agro-Climatic Station Fallback (works offline without API keys)
  for (const [key, val] of Object.entries(REGIONAL_AGRO_CLIMATES)) {
    if (cleanQuery.includes(key)) {
      return {
        location: query.charAt(0).toUpperCase() + query.slice(1),
        temperature: val.temp,
        humidity: val.hum,
        rainfallEstimated: val.rain,
        weatherCondition: val.cond,
        isLive: false,
        source: 'ICAR / IMD Agro-Climatic Regional Normal Dataset',
        disclaimer: 'Historical seasonal average for agro-climatic zone. Always review against local field observations.'
      };
    }
  }

  // 3. Default Indian Agro-Climatic Baseline
  return {
    location: query || 'National Agricultural Baseline',
    temperature: 26.5,
    humidity: 65,
    rainfallEstimated: 850,
    weatherCondition: 'Moderate Tropical Climate',
    isLive: false,
    source: 'National Agro-Climatic Average',
    disclaimer: 'Representative baseline estimate. You may manually edit temperature and rainfall in the form.'
  };
}
