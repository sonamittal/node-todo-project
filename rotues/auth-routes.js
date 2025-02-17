const express = require('express');
const router = express.Router();
const { userSignUp ,userLogin}= require('../controller/auth.controller');
 const todoController = require('../controller/todo.controller');
const verifyToken = require('../middleware/auth-middleware');
router.get('/signup', (req, res) => {
    res.render('signup'); 
});
router.get('/login',(req,res)=>{
    res.render('login');  
})
router.post('/signup', userSignUp);
router.post('/login',userLogin);
// Protected route
router.get("/", verifyToken, todoController.getAllTodo);
// logout
router.get('/logout' , (req,res)=>{
    res.clearCookie('token');
    return res.redirect('/');
});
module.exports=router;

