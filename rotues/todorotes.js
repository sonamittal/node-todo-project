const express = require('express');
const router = express.Router();
const { getAllTodo,
    insertAllUsers,updateAllUser ,getTaskById ,deleteAllUser ,updateTaskStatus} = require('../controller/todo.controller');
router.get('/', getAllTodo);
router.post('/todos', insertAllUsers);
router.get('/edit/:id' , getTaskById);
router.post('/edit/:id' , updateAllUser);
router.delete('/delete/:id',deleteAllUser);
router.post('/update-task-status/:id', updateTaskStatus);
module.exports = router;
