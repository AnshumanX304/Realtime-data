const UserModel = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userCtrl = {
    signup: async (req, res) => {
        try {
            let { username, useremail, userpassword } = req.body;
            useremail = useremail.toLowerCase();
            
            const passwordHash = await bcrypt.hash(userpassword, 12);
            
            const existingUser = await UserModel.findOne({ useremail });
            
            if (!existingUser) {
                
                const newUser = new UserModel({
                    username,
                    useremail,
                    userpassword: passwordHash
                });
                await newUser.save();
                
                const accesstoken = createAccessToken({ id: newUser._id });
                
                res.status(200).json({
                    success: true,
                    msg: "Signup successful!",
                    accesstoken,
                    user: newUser.username
                });
            } else {
                res.status(400).json({ success: false, msg: "User already exists!" });
            }
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
            console.error(error);
        }
    },
    
    signin: async (req, res) => {
        try {
            let { useremail, userpassword } = req.body;
            useremail = useremail.toLowerCase();
            
            const getUser = await UserModel.findOne({ useremail });
            
            if (!getUser) {
                throw new Error("User not found!");
            }
            
            const passwordMatch = await bcrypt.compare(userpassword, getUser.userpassword);
            if (!passwordMatch) {
                throw new Error("Password did not match!");
            }
            
            const accesstoken = createAccessToken({ id: getUser._id });
            
            res.status(200).json({
                success: true,
                msg: "Signin successful!",
                accesstoken,
                user: getUser.username
            });
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
            console.error(error);
        }
    },

    set_threshold: async (req, res) => {
        try {
            
            let token = req.header('accesstoken') || req.headers['authorization'];
            token = token.replace(/^Bearer\s+/, "");
            const decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const _id = decode.id;
            
            const id = new mongoose.Types.ObjectId(_id);
            
            const { threshold_temperature } = req.body;
            
            if (typeof threshold_temperature !== 'number') {
                throw new Error("Invalid threshold temperature. Must be a number.");
            }
            
            const updatedUser = await UserModel.findByIdAndUpdate(
                id,
                { threshold_temperature },
                { new: true, runValidators: true }
            );
            
            if (!updatedUser) {
                throw new Error("User not found");
            }
            
            res.status(200).json({
                success: true,
                msg: "Threshold temperature updated successfully",
                threshold_temperature: updatedUser.threshold_temperature
            });
        } catch (error) {
            res.status(400).json({ success: false, msg: error.message });
            console.error(error);
        }
    }

};

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
};

module.exports = userCtrl;