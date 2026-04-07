const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gigshield_local';
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected correctly.');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
