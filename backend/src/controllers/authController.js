const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, phone, password, city, deliveryZone, platformType, avgWeeklyEarnings, workingHoursPerDay, role } = req.body;
        
        let user = await User.findOne({ phone });
        if (user) return res.status(400).json({ error: "User already exists with this phone number." });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = new User({
            name, phone, passwordHash, city, deliveryZone, platformType, 
            avgWeeklyEarnings, workingHoursPerDay, role: role || 'worker'
        });

        await user.save();
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role, zone: user.deliveryZone }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
