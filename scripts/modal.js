const overlay = document.getElementById("overlay");

function openModal(button){
    const modal = document.querySelector(button.dataset.modalTarget);
    modal.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("noscroll");
}

function closeModal(button){
    let modal;
    if(button == null){
        //closed by clicking overlay
        // const modals = document.querySelectorAll(".modal.active");
        // modals.forEach(modal => {
        //     modal.classList.remove("active");
        // })
        modal = document.querySelector(".modal.active");
    }
    else{
        //closed by clicking button
        modal = button.closest(".modal");
    }
    $(modal).removeClass("active").trigger("close");
    overlay.classList.remove("active");
    document.body.classList.remove("noscroll");
}


