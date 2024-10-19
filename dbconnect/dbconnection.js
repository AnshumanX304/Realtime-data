const mongoose = require('mongoose');

const dbconnection = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.dbconfig); 
    console.log("DB connection successful");
  } catch (err) {
    console.log("DB connection error:", err);
  }
};

module.exports = dbconnection;
