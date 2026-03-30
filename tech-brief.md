# Tech Brief: Implementing Open-Meteo Weather Widget

## Overview
Open-Meteo is an excellent choice for adding weather functionality to your website. It's completely free, requires no API key, and provides reliable weather data through a simple REST API.

---

## Technical Specifications

### API Details
- **Base URL:** `https://api.open-meteo.com/v1/forecast`
- **Authentication:** None required (completely open)
- **Rate Limits:** 10,000 requests per day per IP (very generous)
- **Data Format:** JSON
- **CORS:** Enabled (can be called directly from browser)

### Key Features
- Current weather conditions
- 7-day forecast
- Hourly data
- Multiple weather variables (temperature, precipitation, wind, etc.)
- Timezone support
- No registration required

---

## Implementation Plan

### Phase 1: Basic Weather Display (Current Conditions)

#### Step 1: Create HTML Structure
Add a container for the weather widget in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Your existing content -->
    
    <!-- Weather Widget Container -->
    <div id="weather-widget" class="weather-container">
        <div class="weather-loading">Loading weather...</div>
    </div>
    
    <!-- Your existing content -->
    
    <script src="weather.js"></script>
</body>
</html>
```

#### Step 2: Add Basic CSS Styling
Create or update your CSS file:

```css
/* Weather Widget Styles */
.weather-container {
    background: #f0f4f8;
    border-radius: 10px;
    padding: 20px;
    margin: 20px auto;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    font-family: Arial, sans-serif;
}

.weather-loading {
    text-align: center;
    color: #666;
}

.weather-content h3 {
    margin: 0 0 10px 0;
    color: #333;
}

.weather-temp {
    font-size: 2.5em;
    font-weight: bold;
    color: #0066cc;
    margin: 10px 0;
}

.weather-description {
    color: #666;
    margin: 5px 0;
}

.weather-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 15px;
}

.weather-detail {
    background: white;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
}

.weather-error {
    color: #d32f2f;
    text-align: center;
}
```

#### Step 3: Create JavaScript File (weather.js)
Create a new JavaScript file with the weather functionality:

```javascript
// Weather widget configuration
const WEATHER_CONFIG = {
    latitude: 47.6062,  // Seattle coordinates (change to your location)
    longitude: -122.3321,
    timezone: 'America/Los_Angeles'
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
            <div class="weather-update">
                Last updated: ${new Date(current.time).toLocaleTimeString()}
            </div>
        </div>
    `;
}

// Show error message
function showError(message) {
    const container = document.getElementById('weather-widget');
    container.innerHTML = `<div class="weather-error">${message}</div>`;
}

// Initialize weather widget
async function initWeather() {
    try {
        const weatherData = await fetchWeather();
        updateWeatherDisplay(weatherData);
    } catch (error) {
        showError('Unable to load weather data');
    }
}

// Load weather when page loads
document.addEventListener('DOMContentLoaded', initWeather);

// Optional: Refresh weather every 10 minutes
setInterval(initWeather, 600000);
```

#### Step 4: Get Your Location Coordinates
1. Go to [Google Maps](https://maps.google.com)
2. Search for your location
3. Right-click on the map and select "What's here?"
4. Copy the latitude and longitude from the popup
5. Update the `WEATHER_CONFIG` object in weather.js

#### Step 5: Test Locally
1. Open your HTML file in a browser
2. Check that the weather widget loads
3. Verify the data is correct for your location

#### Step 6: Deploy to Vercel
1. Commit your changes to git
2. Push to your repository
3. Vercel will automatically deploy the updates

---

### Phase 2: Enhancements (Optional)

#### Add 7-Day Forecast
Update the fetch parameters to include daily forecast:

```javascript
const params = new URLSearchParams({
    latitude: WEATHER_CONFIG.latitude,
    longitude: WEATHER_CONFIG.longitude,
    current_weather: true,
    daily: 'temperature_2m_max,temperature_2m_min,weathercode',
    temperature_unit: 'fahrenheit',
    timezone: WEATHER_CONFIG.timezone
});
```

#### Add Weather Icons
You can use emoji or icon fonts for weather conditions:

```javascript
const weatherIcons = {
    0: '☀️',
    1: '🌤️',
    2: '⛅',
    3: '☁️',
    // ... add more
};
```

#### Add Location Detection
Use browser geolocation API:

```javascript
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                WEATHER_CONFIG.latitude = position.coords.latitude;
                WEATHER_CONFIG.longitude = position.coords.longitude;
                initWeather();
            },
            error => {
                console.error('Geolocation error:', error);
                initWeather(); // Fall back to default location
            }
        );
    }
}
```

---

## Troubleshooting

### Common Issues and Solutions

1. **Weather not loading**
   - Check browser console for errors
   - Verify coordinates are correct
   - Ensure you have internet connection

2. **CORS errors**
   - Open-Meteo should work directly from browser
   - If issues persist, check if you're using HTTPS

3. **Styling issues**
   - Ensure CSS file is properly linked
   - Check for CSS conflicts with existing styles

---

## Performance Considerations

- The widget makes one API call on page load
- Data is cached by browser for subsequent visits
- Consider implementing localStorage caching for offline support
- API response is typically < 5KB

---

## Next Steps

1. Customize the styling to match your website
2. Add more weather parameters (humidity, UV index, etc.)
3. Implement forecast display
4. Add user location selection
5. Create weather animations or transitions

This implementation provides a solid foundation that you can build upon based on your specific needs!