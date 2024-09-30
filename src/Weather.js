import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css'; // Assurez-vous d'importer le fichier CSS

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState('Paris');

    const API_KEY = 'ad48a8f4104f8cbcde956efdc72100a0';

    const conditionTranslation = {
        "clear sky": "ciel dégagé",
        "few clouds": "peu nuageux",
        "scattered clouds": "nuages épars",
        "broken clouds": "nuages fragmentés",
        "shower rain": "averses",
        "rain": "pluie",
        "thunderstorm": "orage",
        "snow": "neige",
        "mist": "brume",
        "light intensity drizzle": "bruine légère",
        "light rain": "pluie légère",
        "overcast clouds": "nuages ​​​​couverts"
        // Ajoutez d'autres conditions si nécessaire
    };

    const getTemperatureColor = (temp) => {
        if (temp < -20) return '#9200c7';
        if (temp < 0) return '#0060b0';
        if (temp < 20) return '#1493ff';
        if (temp < 40) return '#eb6b00';
        return '#e81a03';
    };

    const fetchWeather = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
            setLoading(false);
        } catch (error) {
            setError('Erreur lors de la récupération des données météo');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        setLoading(true);
        // On peut valider la ville ici si nécessaire
        fetchWeather();
      };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>{error}</div>;

    const temperature = weather.main.temp;
    const weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    const conditionFr = conditionTranslation[weather.weather[0].description] || weather.weather[0].description;

    const calculateProgress = (temp) => {
        const minTemp = -40;
        const maxTemp = 60;
        return ((temp - minTemp) / (maxTemp - minTemp)) * 100; // Retourne un pourcentage
    };

    const progress = calculateProgress(temperature);

    return (
        <div className="container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Entrez une ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button type="submit">Rechercher</button>
            </form>
            <h2>Météo à {weather.name} actuellement</h2>
            <img src={weatherIcon} alt={weather.weather[0].description} />
            <p>Condition : {conditionFr}</p>
            <p style={{ color: getTemperatureColor(temperature) }}>
                Température : {weather.main.temp}°C
            </p>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="scale">
                <span>-40°C</span>
                <span>-20°C</span>
                <span>0°C</span>
                <span>20°C</span>
                <span>40°C</span>
                <span>60°C</span>
            </div>
        </div>
    );
};
  
  export default Weather;