const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

exports.isAuthenticatedUser = async (req, res, next) => {
    const bearerToken  = req.headers['authorization'];

    if (!bearerToken) {
        return res.status(401).json({
            error: "Login to access this resource",
        });
    }
    // bearerToken contains "bearer <token>", so we split it to get the token
    const bearer = bearerToken.split(" ")[1];
    const decoded = jwt.verify(bearer, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    next();
}