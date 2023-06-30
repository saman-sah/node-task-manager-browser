const list= document.querySelector(".list-group")
const messageNoTask= document.querySelector(".no-task")

const input= document.getElementById("input")
const checkbox= document.getElementById("checkbox")
const submit= document.getElementById("submit")

list.addEventListener("click",async (event)=> {
    let target= event.target;
    let liElement= target.parentElement.parentElement
    const id= parseInt(liElement.dataset.id)
    if(target.classList.contains('toggle-btn')) {
        let status= liElement.querySelector(".status")
        try {
            console.log(status);
            const response= await axios.post("/toggle-task", { id })
            if(response.data === true) {
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
                alert(response.data)
            }
        } catch (err) {
            alert(err.response.data)
        }
    }else if(target.classList.contains('edit-btn')) {
        const label= liElement.querySelector(".title");
        const text= label.innerText;
        console.log('text');
        console.log(text);
        const answer= prompt("Please enter new title: ", text)
        if(answer) {
            try {
                const response= await axios.post("/edit-task", { id,title: answer })
                if(response.data === true) {
                    label.innerText= answer
                }else {
                    alert(response.data)
                }
            } catch (err) {
                alert(err.response.data)
            }
        }
    }else if(target.classList.contains('delete-btn')) {
        if(confirm("Are you sure?")) {
            try {
                const response= await axios.post("/delete-task", { id })
                if(response.data === true) {
                    // location.reload();
                    liElement.remove();
                    if(!document.querySelectorAll("li").length) {
                        list.classList.add("d-none")
                        messageNoTask.classList.remove("d-none")
                    }
                }else {
                    alert(response.data)
                }
            } catch (err) {
                alert(err.response.data)
            }
        }
    }
    
})

document.addEventListener("DOMContentLoaded", async()=> {
    try {
        const response= await axios.get("/get-all-tasks");
        
        const data= response.data;
        if(data instanceof Array) {
            if(data.length) {
                list.classList.remove("d-none");
                let str= "";
                for(let task of data) {
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
            alert(data)
        }
    } catch (err) {
        alert.apply(err.response.data)
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
        const { data }= await axios.post('/add-task', {title, completed});
        if(data > 0) {
            messageNoTask.classList.add("d-none");
            list.classList.remove("d-none")
            const newItem= `
                <li class="list-group-item d-flex justify-content-between align-items-center" data-id=${data}>
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
        alert(data)
       }
    } catch (err) {
        alert(err.response.data)
    }
}