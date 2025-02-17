const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3005;
// cookies parser
const cookieParser = require('cookie-parser');
//path
const path = require('path');
//router
const router = require("./rotues/todorotes");
const routes = require('./rotues/auth-routes');
//cookies
// const cookieParser = require('cookie-parser');

// middleware 
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//set view engine
app.set('view engine', 'ejs');
// routes
app.use(routes);
app.use( router);
// start the server 
app.listen(PORT , ()=>{
    console.log(`server is running  on http://localhost:${PORT} `);
})