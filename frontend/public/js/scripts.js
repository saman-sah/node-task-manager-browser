const list= document.querySelector(".list-group")
const messageNoTask= document.querySelector(".no-task")
axios.defaults.baseURL="http://localhost:3000"
const input= document.getElementById("input")
const checkbox= document.getElementById("checkbox")
const submit= document.getElementById("submit")

list.addEventListener("click",async (event)=> {
    let target= event.target;
    let liElement= target.parentElement.parentElement
    let title= liElement.querySelector(".title").innerText
    const id= parseInt(liElement.dataset.id)
    
    if(target.classList.contains('toggle-btn')) {
        let status= liElement.querySelector(".status")
        let completed;
        status.innerHTML === "Inprogress" ? completed= true : completed= false
        try {
            const { data }= await axios.put("/tasks/"+ id, { title, completed })
            if(data.success) {
                if(status.innerHTML === "Completed") {
                    status.innerHTML= "Inprogress"
                    status.classList.remove("bg-primary")
                    status.classList.add("bg-secondary")
                }else {
                    status.innerHTML= "Completed"
                    status.classList.remove("bg-secondary")
                    status.classList.add("bg-primary")
                }
            }else {
                alert(data.message)
            }
        } catch (err) {
            alert(err.response.data.message)
        }
    }else if(target.classList.contains('edit-btn')) {
        const label= liElement.querySelector(".title");
        const text= label.innerText;
        const answer= prompt("Please enter new title: ", text)
        if(answer) {
            try {
                let status= liElement.querySelector(".status")
                let completed;
                status.innerHTML === "Inprogress" ? completed= false : completed= true
                const { data }= await axios.put("/tasks/"+ id, { title: answer, completed })
                if(data.success) {
                    label.innerText= answer
                }else {
                    alert(data.message)
                }
            } catch (err) {
                alert(err.response.data.message)
            }
        }
    }else if(target.classList.contains('delete-btn')) {
        if(confirm("Are you sure?")) {
            try {
                const { data }= await axios.delete("/tasks/"+ id)
                if(data.success) {
                    liElement.remove();
                    if(!list.children.length) {
                        list.classList.add("d-none")
                        messageNoTask.classList.remove("d-none")
                    }
                }else {
                    alert(data.message)
                }
            } catch (err) {
                alert(err.response.data.message)
            }
        }
    }
    
})

document.addEventListener("DOMContentLoaded", async()=> {
    try {
        const response= await axios.get("/tasks");
        
        const data= response.data;
        if(data.success) {
            if(data.body.length) {
                list.classList.remove("d-none");
                let str= "";
                for(let task of data.body) {
                    str+= `
                    <li class="list-group-item d-flex justify-content-between align-items-center" data-id=${ task.id}>
                        <span class="title"> 
                        ${ task.title }
                        </span>
                        <div class="action-buttons">
                            <span class="badge status 
                            ${ task.completed ? 'bg-primary' : 'bg-secondary' }
                            badge-pill">
                            ${ task.completed ? 'Compeleted' : 'Inprogress' }
                            </span>
                            <span class="badge badge-pill toggle-btn">
                                Toggle
                            </span>
                            <span class="badge badge-pill edit-btn">
                                Edit
                            </span>
                            <span class="badge badge-pill delete-btn">
                                Delete
                            </span>
                        </div>
                    </li>
                    `
                }
                list.innerHTML= str
            }else {
                messageNoTask.classList.remove("d-none")
            }
        }else {
            alert(data.message)
        }
    } catch (err) {
        alert.apply(err.response.data.message)
    }
})

submit.addEventListener("click", addTask);
input.addEventListener("keydown", (event)=> {
    if(event.key === "Enter") {
        addTask();
    }
})

async function addTask() {
    const title= input.value;
    const completed= checkbox.checked;
    if(title.length < 3){
        alert("Title must be at least 3 character")
        return;
    }

    try {
        const { data }= await axios.post('/tasks', {title, completed});
        if(data.success) {
            messageNoTask.classList.add("d-none");
            list.classList.remove("d-none")
            const newItem= `
                <li class="list-group-item d-flex justify-content-between align-items-center" data-id=${data.body.id}>
                    <span class="title"> 
                        ${ title }
                    </span>
                    <div class="action-buttons">
                        <span class="badge status badge-pill ${ completed ? 'bg-primary' : 'bg-secondary' }">
                            ${ completed ? 'Compeleted' : 'Inprogress' }
                        </span>
                        <span class="badge badge-pill toggle-btn">
                            Toggle
                        </span>
                        <span class="badge badge-pill edit-btn">
                            Edit
                        </span>
                        <span class="badge badge-pill delete-btn">
                            Delete
                        </span>
                    </div>
                </li>
            `;
            list.innerHTML += newItem;
            input.value= "";
       }else {
        alert(data.message)
       }
    } catch (err) {
        alert(err.response.data.message)
    }
}