const list= document.querySelector(".list-group")

list.addEventListener("click",async (event)=> {
    let target= event.target;
    let liElement= target.parentElement.parentElement
    const id= parseInt(liElement.dataset.id)
    console.log(id);
    if(target.classList.contains('toggle-btn')) {
        let response;
        try {
            response= await axios.post("/toggle-task", { id })
            if(response.data === true) {
                location.reload();
            }else {
                alert(response.data)
            }
        } catch (err) {
            alert(err.response.data)
        }
    }
    
})