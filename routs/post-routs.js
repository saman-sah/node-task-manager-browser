import express from 'express'
import PostController from '../controllers/post-controllers.js';


const router= express.Router();

router.post('/add-task', PostController.addTask)

router.post("/toggle-task", PostController.toggleTask)

router.post("/edit-task", PostController.editTask)


router.post("/delete-task", PostController.deleteTask)


export default router