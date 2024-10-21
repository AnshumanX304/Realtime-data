const axios = require('axios');
require('dotenv').config();
const WeatherModel=require('../models/dataSchema')
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userSchema');
const mongoose = require('mongoose');


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
    cityWeatherHistory: async (req, res) => {
        try {
            const { city } = req.query;

            if (!city) {
                return res.status(400).json({
                    success: false,
                    msg: "City name is required in the URL parameters."
                });
            }

            const weatherHistory = await WeatherModel.aggregate([
                { $unwind: "$cities" },
                { $match: { "cities.name": city } },
                { $sort: { date: -1 } },
                { $project: {
                    _id: 0,
                    date: 1,
                    max_temperature: "$cities.max_temperature",
                    min_temperature: "$cities.min_temperature",
                    avg_temperature: "$cities.avg_temperature",
                    dominant_condition: "$cities.dominant_condition"
                }}
            ]);

            if (weatherHistory.length === 0) {
                return res.status(404).json({
                    success: false,
                    msg: `No weather data found for ${city}.`
                });
            }

            res.status(200).json({
                success: true,
                msg: `Weather history for ${city} retrieved successfully.`,
                result: weatherHistory
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                msg: "An error occurred while fetching weather history.",
                error: error.message
            });
            console.error("Error in cityWeatherHistory:", error);
        }
    },
    getAlerts: async (req, res) => {
        try {
            console.log("Alert request polled !!");
            
           
            let token = req.header('accesstoken') || req.headers['authorization'];
            token = token.replace(/^Bearer\s+/, "");
            
            let decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            

            const _id = decode.id;
            const id = new mongoose.Types.ObjectId(_id);
            
        
            const user = await UserModel.findById(id);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    msg: "User not found."
                });
            }

            const TEMPERATURE_THRESHOLD = user.threshold_temperature;
            
            const alerts = [];
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const weatherDoc = await WeatherModel.findOne({ date: today });

            if (!weatherDoc) {
                return res.status(404).json({
                    success: false,
                    msg: "No weather data found for today."
                });
            }

            for (const city of weatherDoc.cities) {
                const latestReadings = city.weatherData.slice(-2);
                
                if (latestReadings.length === 2 &&
                    latestReadings[0].temperature > TEMPERATURE_THRESHOLD &&
                    latestReadings[1].temperature > TEMPERATURE_THRESHOLD) {
                    alerts.push({
                        city: city.name,
                        latestTemperature: latestReadings[1].temperature,
                        timestamp: latestReadings[1].timestamp
                    });
                }
            }

            res.status(200).json({
                success: true,
                msg: "Alerts fetched successfully",
                alerts: alerts,
                thresholdTemperature: TEMPERATURE_THRESHOLD  
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                msg: "An error occurred while fetching alerts.",
                error: error.message
            });
            console.error("Error in getAlerts:", error);
        }
    }
};

module.exports = weatherCtrl;