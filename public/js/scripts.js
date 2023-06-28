const list= document.querySelector(".list-group")

list.addEventListener("click",async (event)=> {
    let target= event.target;
    let liElement= target.parentElement.parentElement
    const id= parseInt(liElement.dataset.id)
    if(target.classList.contains('toggle-btn')) {
        try {
            const response= await axios.post("/toggle-task", { id })
            if(response.data === true) {
                location.reload();
            }else {
                alert(response.data)
            }
        } catch (err) {
            alert(err.response.data)
        }
    }else if(target.classList.contains('edit-btn')) {
        const text= liElement.querySelector("span").innerText;
        const answer= prompt("Please enter new title: ", text)
        if(answer) {
            try {
                const response= await axios.post("/edit-task", { id,title: answer })
                if(response.data === true) {
                    location.reload();
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
                    location.reload();
                }else {
                    alert(response.data)
                }
            } catch (err) {
                alert(err.response.data)
            }
        }
    }
    
})