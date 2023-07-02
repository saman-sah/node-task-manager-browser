const list= document.querySelector(".list-group")
const messageNoTask= document.querySelector(".no-task")
const input= document.getElementById("input")
const checkbox= document.getElementById("checkbox")
const submit= document.getElementById("submit")

const pagination=document.getElementById("pagination")
const nextButton= document.getElementById("next-btn")
const prevButton= document.getElementById("prev-btn")
const pageLabel= document.getElementById("page-label")
const radioAll= document.getElementById("radio-all")
const radioCompleted= document.getElementById("radio-completed")
const radioInprogress= document.getElementById("radio-inprogress")


axios.defaults.baseURL="http://localhost:3000"

const limit=3;
let currentPage=1;
let finished= undefined;
let totalTasks, totalPages;

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
                    if(list.children.length=== 1 && currentPage >1) {
                        currentPage--;
                    }
                    loadTask();
                }else {
                    alert(data.message)
                }
            } catch (err) {
                alert(err.response.data.message)
            }
        }
    }
    
})

document.addEventListener("DOMContentLoaded", ()=> {
    loadTask();
})

nextButton.addEventListener("click", ()=> {
    currentPage++;
    loadTask();
})
prevButton.addEventListener("click", ()=> {
    currentPage--;
    loadTask();
})

radioAll.addEventListener("change", ()=> {
    finished= undefined;
    currentPage= 1;
    loadTask();
})
radioCompleted.addEventListener("change", ()=> {
    finished= true;
    currentPage= 1;
    loadTask();
})
radioInprogress.addEventListener("change", ()=> {
    finished= false;
    currentPage= 1;
    loadTask();
})


async function loadTask() {
    prevButton.classList.remove("disabled")
    nextButton.classList.remove("disabled")
    try {
        const response= await axios.get(
            `/tasks?page=${currentPage}&limit=${limit}&finished=${finished}`
        );
        
        const data= response.data;
        if(data.success) {
            if(data.body.length) {
                list.classList.remove("d-none");
                messageNoTask.classList.add("d-none")
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
                list.classList.add("d-none")
                list.innerHTML= ''
            }

            totalTasks= data.totalTasks;
            if(totalTasks > limit) {
                pagination.classList.remove("d-none")
                totalPages= Math.ceil( totalTasks / limit);                              
                if(currentPage=== 1) {
                    prevButton.classList.add("disabled")
                }else if(currentPage=== totalPages) {
                    nextButton.classList.add("disabled")
                }
                pageLabel.innerHTML= `Page ${ currentPage } of ${ totalPages }`
            }else {
                pagination.classList.add("d-none")
                totalPages= 1;
            }
        }else {
            alert(data.message)
        }
    } catch (err) {
        alert.apply(err.response.data.message)
    }
}



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
            if(totalTasks == 0) {
                currentPage= 1;
            }else if(totalTasks % limit) {
                currentPage= totalPages
            }else {
                currentPage= totalPages+1
            }
            loadTask();
            input.value= "";
       }else {
        alert(data.message)
       }
    } catch (err) {
        alert(err.response.data.message)
    }
}