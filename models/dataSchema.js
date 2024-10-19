const mongoose = require("mongoose");

const weatherDataSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  },
  feels_like: {
    type: Number,
    required: true
  },
  weather_condition: {
    type: String,
    required: true
  }
});

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  avg_temperature: {
    type: Number,
    required: true
  },
  max_temperature: {
    type: Number,
    required: true
  },
  min_temperature: {
    type: Number,
    required: true
  },
  dominant_condition: {
    type: String,
    required: true
  },
  weatherData: [weatherDataSchema]
});

const weatherSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  cities: [citySchema]
});

const WeatherModel = mongoose.model("Weather", weatherSchema);

module.exports = WeatherModel;