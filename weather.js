// Weather widget configuration
const WEATHER_CONFIG = {
    latitude: 39.70525,  // Denver coordinates
    longitude: -104.92597,
    timezone: 'America/Denver'
};

// Weather code descriptions
const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
};

// Fetch weather data
async function fetchWeather() {
    const params = new URLSearchParams({
        latitude: WEATHER_CONFIG.latitude,
        longitude: WEATHER_CONFIG.longitude,
        current_weather: true,
        temperature_unit: 'fahrenheit',
        windspeed_unit: 'mph',
        precipitation_unit: 'inch',
        timezone: WEATHER_CONFIG.timezone
    });

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        
        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

// Update the weather display
function updateWeatherDisplay(weatherData) {
    const container = document.getElementById('weather-widget');
    const current = weatherData.current_weather;
    
    const weatherDescription = weatherCodes[current.weathercode] || 'Unknown';
    
    container.innerHTML = `
        <div class="weather-content">
            <h3>Current Weather</h3>
            <div class="weather-temp">${Math.round(current.temperature)}°F</div>
            <div class="weather-description">${weatherDescription}</div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="detail-label">Wind</div>
                    <div class="detail-value">${Math.round(current.windspeed)} mph</div>
                </div>
                <div class="weather-detail">
                    <div class="detail-label">Direction</div>
                    <div class="detail-value">${current.winddirection}°</div>
                </div>
            </div>
        </div>
    `;
}

// Handle errors
function showWeatherError(message) {
    const container = document.getElementById('weather-widget');
    container.innerHTML = `
        <div class="weather-error">
            <p>Unable to load weather data</p>
            <p>${message}</p>
        </div>
    `;
}

// Initialize weather widget
async function initWeatherWidget() {
    try {
        const weatherData = await fetchWeather();
        updateWeatherDisplay(weatherData);
    } catch (error) {
        showWeatherError(error.message);
    }
}

// Load weather when page loads
document.addEventListener('DOMContentLoaded', initWeatherWidget);