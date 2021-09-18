function initializeResponsiveBoxes() {
    const boxes = document.getElementsByClassName('resp-box');
    const c1 = '#d6d6d6 20%';
    const c2 = '#f5f5f5';
    const b1 = '#808080 50%';
    const b2 = '#b0b0b0';
    const b3 = '#d4d4d4';

    for(let i = 0; i < boxes.length; i++){
        boxes[i].addEventListener("mousemove", function(event){
            const xPost = event.pageX - boxes[i].getBoundingClientRect().left + document.body.getBoundingClientRect().left;
            const yPost = event.pageY - boxes[i].getBoundingClientRect().top + document.body.getBoundingClientRect().top;

            boxes[i].style.background = 'radial-gradient(circle ' + boxes[i].offsetWidth + 'px at ' + xPost + 'px ' + yPost + 'px, ' + c1 + ', ' + c2 + ')';
            boxes[i].style.borderImageSource = 'radial-gradient(circle ' + boxes[i].offsetWidth + 'px at ' + xPost + 'px ' + yPost + 'px, ' + b1 + ', ' + b2 + ')';
        }, false);

        boxes[i].addEventListener("mouseout", function(){
            boxes[i].style.background = c2;
            boxes[i].style.borderImageSource = 'radial-gradient(circle, ' + b3 + ', ' + b3 + ')';
        }, false);
    }
}