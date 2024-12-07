const jwt = require('jsonwebtoken');
const User = require('../models/captain.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');
require('dotenv').config();


module.exports.userAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[ 1 ];

        if (!token) {
            return res.status(401).json({ message: 'no token' });
        }

        const isBlacklisted = await blacklisttokenModel.find({ token });

        if (isBlacklisted.length) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.captain = user;

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}