import express from 'express'

import Task from './task.js'

const router= express.Router();

router.get("/", (req, res)=> {
    let tasks= Task.getAllTasks();
    res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/style.css">
    <title>Document</title>
</head>
<body>
<div class="container">
<div class="row">
  <div class="col-md-8 offset-md-2">
    <form action="/add-task" method="post">
      <div class="form-group">
        <label for="exampleInputEmail1">Task Title</label>
        <input type="text" name="title" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
      </div>
      <div class="form-group form-check">
        <input type="checkbox" name="completed" class="form-check-input" id="exampleCheck1">
        <label class="form-check-label" for="exampleCheck1">Check me out</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
  </form>
  <ul class="list-group">
  ${ tasks.map((task)=> {
   return `<li class="list-group-item d-flex justify-content-between align-items-center data-id=${ task.id }">
   <div>
      ${ task.title }
      </div>

      <div class="action-buttons">
      <span class="badge 
      ${ task.completed ? 'badge-primary' : 'bg-secondary'}
      badge-pill">
        ${ task.completed ? 'Compeleted' : 'Inprogress' }
      </span>
      <span class="badge 
      ${ task.completed ? 'badge-primary' : 'bg-secondary'}
      badge-pill">
        ${ task.completed ? 'Compeleted' : 'Inprogress' }
      </span>
      <span class="badge 
      ${ task.completed ? 'badge-primary' : 'bg-secondary'}
      badge-pill">
        ${ task.completed ? 'Compeleted' : 'Inprogress' }
      </span>
      <span class="badge 
      ${ task.completed ? 'badge-primary' : 'bg-secondary'}
      badge-pill">
        ${ task.completed ? 'Compeleted' : 'Inprogress' }
      </span>
</div>
    </li>`
  })
.join("") }
    
  </ul>
  </div>
</div>
</div>
</body>
</html>
    `)
})

export default router;
