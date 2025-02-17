const db = require('../config.js/connection');
const util = require('util');
const query = util.promisify(db.query).bind(db);
// Fetch all todos
async function getAllTodo(req, res) {
    try {
        const allUserTask = await query('SELECT * FROM `todo_user`');
        res.render('home', { task: allUserTask, 
            email: req.user.email});
    }
    catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).json({ error: 'Database error' });
    }
}
// insert
async function insertAllUsers(req, res) {
    const { task_title } = req.body;

    if (!task_title) {
        return res.status(400).json({ message: "Task title is required" });
    }

    try {
        const insertSql = 'INSERT INTO `todo_user` (`task_title`) VALUES (?)';
        const insertVal = [task_title];
        await query(insertSql, insertVal);
        console.log('Task added successfully');
        res.redirect('/');
    } catch (err) {
        console.error("Error adding task:", err);
        res.status(500).json({ message: "Error adding task" });
    }
}
async function getTaskById(req, res) {
    const task_id = Number(req.params.id);
    try {
        const result = await query('SELECT * FROM `todo_user` WHERE `task_id` = ?', [task_id]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.render('edit', { task: result[0] });
    } catch (err) {
        console.error("Error fetching task:", err);
        res.status(500).json({ message: "Error fetching task" });
    }
}
// update 
async function updateAllUser(req, res) {
    const task_id = Number(req.params.id);
    const { task_title } = req.body;
    try {
        const updateSql = 'UPDATE `todo_user` SET `task_title`= ? WHERE `task_id` = ? ';
        const updateVal = [task_title, task_id];
        await query(updateSql, updateVal)
        console.log('Task  updated successfully');
        res.redirect('/');

    } catch (err) {
        console.error("Error updated task:", err);
        res.status(500).json({ message: "Error updated task" });
    }
}
// delete
async function deleteAllUser(req, res) {
    const task_id = Number(req.params.id);
    try {
        const deleteSql = 'DELETE FROM `todo_user` WHERE `task_id` = ?';
        const deleteVal = [task_id];
        await query(deleteSql, deleteVal);
        console.log(`Task  deleted successfully`);
        res.json({ success: true, message: "Task deleted successfully" });
    }
    catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ success: false, message: "Error deleting task" });
    }
}
// cpmplete and pending backend logic 
async function updateTaskStatus(req,res){
const task_id = Number(req.params.id);
const {task_checked} = req.body;
if(isNaN(task_id) || (task_checked !== 0 && task_checked !== 1)){
    return res.status(400).json({ message: "Invalid Task ID or Status" });
}
try{
    const checkedSql = 'UPDATE `todo_user` SET `task_checked` = ? WHERE `task_id` = ?';
    const checkedVal = [task_checked ,task_id];
    const result = await query(checkedSql, checkedVal);
   if(result.affectedRows > 0 ){
    console.log(`Task ${task_id} status updated to ${task_checked}`);
    res.json({
        success : true,
        updatedRows: result.affectedRows,
    })
   }else{
    res.status(404).json({ message: "Task not found" });
   }
} catch(err){
    console.error("Error updating task status:", err);
    res.status(500).json({ message: "Database update error" });
}
}




module.exports = {
    getAllTodo,
    insertAllUsers,
    updateAllUser,
    getTaskById,
    deleteAllUser,
    updateTaskStatus,
}