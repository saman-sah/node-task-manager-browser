import express from 'express'

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
            res.status(400).send(`<h2>${ err.message }</h2>`)
        }
    }else {
        res.status(400).send("<h2>Invalid Request</h2>")
    }
})

export default router