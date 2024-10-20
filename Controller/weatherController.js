const axios = require('axios');
require('dotenv').config();

const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata'];
const apiKey = process.env.OPENWEATHER_API_KEY;

const weatherCtrl = {
    current_weather: async (req, res) => {
        try {
            
            const weatherData = [];

            for (const city of CITIES) {
                try {
                    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                    
                    weatherData.push({
                        name: city,
                        temperature: response.data.main.temp,
                        feels_like: response.data.main.feels_like,
                        weather_condition: response.data.weather[0].main
                    });
                } catch (error) {
                    console.error(`Error fetching weather data for ${city}:`, error.message);
                    weatherData.push({
                        name: city,
                        error: "Failed to fetch data"
                    });
                }
            }

            res.status(200).json({
                success: true,
                msg: "Weather data fetched successfully!",
                result: weatherData
            });
        }
        catch (error) {
            res.status(500).json({ 
                success: false, 
                msg: "An error occurred while fetching weather data.",
                error: error.message 
            });
            console.error("Error in current_weather:", error);
        }
    },
};

module.exports = weatherCtrl;