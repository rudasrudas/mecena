const overlay = document.getElementById("overlay");

function openModal(button){
    const modal = document.querySelector(button.dataset.modalTarget);
    modal.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("noscroll");
}

function closeModal(button){
    if(button == null){
        //closed by clicking overlay
        const modals = document.querySelectorAll(".modal.active");
        modals.forEach(modal => {
            modal.classList.remove("active");
        })
    }
    else{
        //closed by clicking button
        const modal = button.closest(".modal");
        modal.classList.remove("active");
    }

    overlay.classList.remove("active");
    document.body.classList.remove("noscroll");
}


