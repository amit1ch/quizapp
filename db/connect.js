const mongoose = require('mongoose');

const URL = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(URL, {
            
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);  
    }
};

module.exports = connectDB;
