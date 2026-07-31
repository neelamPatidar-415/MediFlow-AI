const jwt = require("jsonwebtoken");

function createAuthMiddleware(roles = ["patient"]) {

    return function authMiddleware(req, res, next) {

        const token =
            req.cookies?.token ||
            req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                error: "Access denied. No token provided.",
            });
        }

        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = decoded;

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({
                    error: "Access denied. Insufficient permissions.",
                });
            }

            next();

        } catch (err) {

            return res.status(401).json({
                error: "Invalid token.",
            });

        }

    };

}

module.exports = {
    createAuthMiddleware,
};