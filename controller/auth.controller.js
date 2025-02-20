const jwt = require('jsonwebtoken');
const db = require('../config.js/connection');
const util = require('util');
const query = util.promisify(db.query).bind(db);
const bcrypt = require('bcrypt');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET || "monu234!!";
//sign up
async function userSignUp(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            error: "All fields are reqired"
        });
    }
    //  Check if user already exists
    try {
        const checkUserData = 'SELECT * FROM `user_table` WHERE `email`= ?';
        const existingUser = await query(checkUserData, [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'User already exists!',
            });
        }
        //salt and hast password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        //insert data
        const userInsertData = 'INSERT INTO `user_table` ( `name`, `email`, `password`) VALUES (?,?,?)';
        const userInsertVal = [name, email, hashPassword];
        await query(userInsertData, userInsertVal)
        //jwt token 
        const token = jwt.sign({ email }, secretKey, { expiresIn: "1h" });
        res.cookie('token', token, { httpOnly: true });
        return res.status(201).json({ message: "User registered successfully!", token });
    } catch (err) {
        console.error("Error adding user data:", err);
        res.status(500).json({ message: "Error adding user data" });
    }
}
// login 
async function userLogin(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400)
            .json({ error: "Email or Password fields cannot be empty!" });
    }
    try {
        const mathchUserData = 'SELECT * FROM `user_table` WHERE `email` = ?';
        const matchUser = await query(mathchUserData, [email]);
        if (matchUser.length === 0) {
            return res.status(400).json({ message: "User not found!" });
        }
        const isPasswordValid = await bcrypt.compare(password, matchUser[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Incorrect password!" });
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        return res.redirect("/");
    } catch (err) {
        console.error("Error user login data:", err);
        res.status(500).json({ message: "Error user login data" + err.message });
    }
}
module.exports = {
    userSignUp,
    userLogin,
}