function initializeResponsiveBoxes() {
    const boxes = document.getElementsByClassName('resp-box');
    const c1 = '#d6d6d6 20%';
    const c2 = '#f5f5f5';
    const b1 = '#808080 50%';
    const b2 = '#b0b0b0';
    const b3 = '#d4d4d4';

    const g1 = '#f7ae12';
    const g2 = '#f7d23f';
    const g3 = '#d9980b';
    const g4 = '#e8a20f';

    for(let i = 0; i < boxes.length; i++){
        boxes[i].addEventListener("mousemove", function(event){

            let a = c1;
            let b = c2;
            let c = b1;
            let d = b2;

            if(boxes[i].classList.contains('primary')){
                a = g1;
                b = g2;
                c = g3;
                d = g4;
            }
            
            const xPost = event.pageX - boxes[i].getBoundingClientRect().left + document.body.getBoundingClientRect().left;
            const yPost = event.pageY - boxes[i].getBoundingClientRect().top + document.body.getBoundingClientRect().top;

            boxes[i].style.background = 'radial-gradient(circle ' + boxes[i].offsetWidth + 'px at ' + xPost + 'px ' + yPost + 'px, ' + a + ', ' + b + ')';
            boxes[i].style.borderImageSource = 'radial-gradient(circle ' + boxes[i].offsetWidth + 'px at ' + xPost + 'px ' + yPost + 'px, ' + c + ', ' + d + ')';
        }, false);

        boxes[i].addEventListener("mouseout", function(){
            let a = c2;
            let b = b3;

            if(boxes[i].classList.contains('primary')){
                a = g2;
                b = g4;
            }

            boxes[i].style.background = a;
            boxes[i].style.borderImageSource = 'radial-gradient(circle, ' + b + ', ' + b + ')';
        }, false);
    }
}