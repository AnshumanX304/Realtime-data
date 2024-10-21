const express = require('express');
const app = express();
const dbconnection = require("./dbconnect/dbconnection");
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const WeatherModel = require('./models/dataSchema'); 

require('dotenv').config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOrigin = {
    origin: 'http://localhost:5174',
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOrigin));

dbconnection();

const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata'];

cron.schedule('*/5 * * * *', async () => {
    try {
        const weatherData = await fetchWeatherData();
        console.log(weatherData)
        await updateWeatherData(weatherData);
        console.log('Weather data updated successfully');
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});


async function fetchWeatherData() {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherData = [];

    for (const city of CITIES) {
        try {
            console.log(city)
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);

            weatherData.push({
                name: city,
                temperature: response.data.main.temp,
                feels_like: response.data.main.feels_like,
                weather_condition: response.data.weather[0].main
            });
        } catch (error) {
            console.error(`Error fetching weather data for ${city}:`, error);
        }
    }

    return weatherData;
}

async function updateWeatherData(weatherData) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let weatherDoc = await WeatherModel.findOne({ date: today });

    if (!weatherDoc) {
        weatherDoc = new WeatherModel({
            date: today,
            cities: CITIES.map(city => ({
                name: city,
                avg_temperature: 0,
                max_temperature: -Infinity,
                min_temperature: Infinity,
                dominant_condition: '',
                weatherData: []
            }))
        });
    }

    for (const cityData of weatherData) {
        const city = weatherDoc.cities.find(c => c.name === cityData.name);
        if (city) {
            city.weatherData.push({
                timestamp: now,
                temperature: cityData.temperature,
                feels_like: cityData.feels_like,
                weather_condition: cityData.weather_condition
            });

            const temperatures = city.weatherData.map(wd => wd.temperature);
            city.avg_temperature = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
            city.max_temperature = Math.max(...temperatures);
            city.min_temperature = Math.min(...temperatures);

            const conditionCounts = {};
            city.weatherData.forEach(wd => {
                conditionCounts[wd.weather_condition] = (conditionCounts[wd.weather_condition] || 0) + 1;
            });
            city.dominant_condition = Object.entries(conditionCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        }
    }

    await weatherDoc.save();
}

app.use("/user",require('./Router/userRouter'))

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});