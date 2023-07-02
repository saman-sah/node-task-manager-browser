import express from 'express'
import TaskController from '../controllers/task.js';

const router= express.Router();

// Get Routs
router.get("/tasks", TaskController.getAllTasks)
router.get("/tasks/:id", TaskController.getTaskById)

// Post Routs
router.post("/tasks", TaskController.addTask)

// Put Routs
router.put("/tasks/:id", TaskController.updateTask)


// Delete Routs
router.delete("/tasks/:id", TaskController.deleteTask)

export default router;
