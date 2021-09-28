function openModal(button){
    const modalOverlay = document.querySelector(button.dataset.modalTarget);
    modalOverlay.scrollTop = 0;
    modalOverlay.classList.add("active");
    document.body.classList.add("noscroll");
}

function closeModal(clickedTarget, event){
    let modalOverlay;

    //overlay onclick fired
    if(event !== undefined){
        //overlay wasn't clicked
        if(event.target !== clickedTarget)
            return
        //overlay was clicked
        else
            modalOverlay = clickedTarget;
    }
    //button onclick fired
    else
        modalOverlay = clickedTarget.closest(".modal-overlay");
    
    $(modalOverlay).removeClass("active").trigger("close");
    modalOverlay.classList.remove("active");
    document.body.classList.remove("noscroll");
}