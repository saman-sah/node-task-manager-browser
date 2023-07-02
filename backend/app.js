
import express from 'express';
import "dotenv/config";

import taskRouts from './routs/task.js'

const app= express();

app.use((req, res, next)=> {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Headers", "*")
    res.setHeader("Access-Control-Allow-Methods", "*")
    next();
})

app.use(express.json())
app.use(taskRouts);
app.listen(3000);