import Task from '../models/task.js'
import DB from '../models/db.js'
export default class TaskController {

    static getAllTasks(req, res) {
        try {
            const tasks= Task.getAllTasks(true);
            res.json({
                success: true,
                body: tasks,
                message: "All tasks fetched"
            });
        } catch (err) {
            res.status(500).json({
                success: false,
                body: null,
                message: "Internal Server Error"
            })
        }
    }
    
    static getTaskById(req, res) {
        try {
            const task= Task.getTaskById(req.params.id);
            if(task) {
                res.json({
                    success: true,
                    body: task,
                    message: "Tasks fetched"
                });
            }else {
                res.status(404).json({
                    success: false,
                    body: null,
                    message: "Task not found"
                })
            }
            
        } catch (err) {
            res.status(500).json({
                success: false,
                body: null,
                message: "Internal Server Error"
            })
        }
    }

    // Add Task 
    static addTask(req, res) {
        if(req.body.title) {
            const title= req.body.title
            const completed= req.body.completed ? true : false;
            if(title.length < 3) {
                return res.status(400).json({
                    success: false,
                    body: null,
                    message: "Title must be at least 3 character"
                })
            }else if(Task.getTaskByTitle(title)) {
                return res.status(409).json({
                    success: false,
                    body: null,
                    message: "A Task already exists eith this title"
                })
            }
            try {
                const task= new Task(title, completed)
                task.save();
                res.status(201).json({
                    success: true,
                    body: task,
                    message: "Task created successfully"
                })
            } catch (err) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: "Internal server error"
                })
            }
        }else {
            res.status(400).json({
                success: false,
                body: null,
                message: "Please send new task title"
            })
        }
    }
    
    // Edit Task
    static updateTask (req, res) {
        if(req.body.title && req.body.completed !== undefined) {
            const { title, completed }= req.body;

            if(title.length < 3) {
                return res.status(400).json({
                    success: false,
                    body: null,
                    message: "Title must be at least 3 character"
                })
            }
            
            let task= Task.getTaskByTitle(title);
            if(task && task.id != req.params.id ) {
                return res.status(409).json({
                    success: false,
                    body: null,
                    message: "A Task already exists eith this title"
                })
            }

            task= Task.getTaskById(req.body.id);
            if(task) {
                try {
                    task.title= title;
                    task.completed= completed;
                    task.save();
                    res.json({
                        success: true,
                        body: null,
                        message: "Task Updated"
                    });
                } catch (err) {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: "Internal Server Error"
                    });
                }
            }else {
                res.status(404).json({
                    success:false,
                    body:null,
                    message:"No such Task found."
                });
            }
        }else {
            res.status(400).json({
                success: false,
                body: null,
                message: 'Invalid Request'
            });
        }
    }

    // Delete Task
    static deleteTask (req, res) {
        try {
            if(DB.deleteTask(req.params.id)) {
                res.status(404).json({
                    success:true,
                    body:null,
                    message:"Task Deleted successfully"
                });
            }else {
                res.status(404).json({
                    success:false,
                    body:null,
                    message:"Task Not found"
                });
            }
        } catch (err) {
            res.status(500).json({
                success:false,
                body:null,
                message:"Internal Server error"
            });
        }
    }


}