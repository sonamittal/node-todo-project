require('dotenv').config();
const secretKey = process.env.JWT_SECRET || "monu234!!";
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    console.log("token received:" , token);
    if (!token) {
        // return res.status(401).json({ error: 'Access denied' });
        return res.redirect("/login");
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded);
        req.user = decoded;
        console.log(" Verified Token:", decoded);
        next();
    }
    catch (err) {
        console.error(" JWT Verification Failed:", err.message);
        return res.redirect("/login");
    }
    
}
module.exports = verifyToken;