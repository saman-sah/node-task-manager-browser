import Task from '../models/task.js'

export default class GetController {
    static homeController (req, res) {
        let tasks= Task.getAllTasks();
        res.render('home', { tasks })
    }
}