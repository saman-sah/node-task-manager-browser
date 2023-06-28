import express from 'express'

import DB from './db.js'
import Task from './task.js'

const router= express.Router();

router.post('/add-task', (req, res)=> {
    if(req.body.title) {
        const title= req.body.title
        const completed= req.body.completed ? true : false;
        try {
            const task= new Task(title, completed)
            task.save();
            res.redirect("/")
        } catch (err) {
            res.status(400).send(`<h2>${ err.message }`)
        }
    }else {
        res.status(400).send("<h2>Invalid Request")
    }
})

router.post("/toggle-task", (req, res)=> {
    if(req.body.id) {
        const task= Task.getTaskById(req.body.id)
        if(task){
            task.completed = !task.completed
            task.save();
            res.json(true)
        }else{
            res.status(400).send("<h2>Task not Found")
        }
    }else{
        res.status(400).send("<h2>Invalid Request")
    }    
})

router.post("/edit-task", (req, res)=> {
    if(req.body.id && req.body.title) {
        const task= Task.getTaskById(req.body.id);
        if(task) {
            try {
                task.title= req.body.title;
                task.save();
                res.json(true);
            } catch (err) {
                res.status(400).json(e.message);
            }
        }else {
            res.status(400).json("<h2>Task Not found");
        }
    }else {
        res.status(400).json("Invalid Request");
    }
})


router.post("/delete-task", (req, res)=> {
    if(req.body.id) {
        try {
            if(DB.deleteTask(req.body.id)) {
                res.json(true)
            }else {
                res.status(400).json("Task Not found");
            }
        } catch (err) {
            res.status(500).json("Server error");
        }
        
    }else {
        res.status(400).json("Invalid Request");
    }
})


export default router