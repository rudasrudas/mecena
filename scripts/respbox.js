const c1 = '#d6d6d6 20%';
const c2 = '#f5f5f5';
const b1 = '#808080 50%';
const b2 = '#b0b0b0';
const b3 = '#d4d4d4';

const g1 = '#f7ae12';
const g2 = '#f7d23f';
const g3 = '#d9980b';
const g4 = '#eca91c';

function callResponsiveBoxes() {
    const boxes = document.querySelectorAll('.resp-box');
    initializeResponsiveBoxes(boxes);
}

function initializeResponsiveBoxes(boxes) {
    for(let i = 0; i < boxes.length; i++){
        initializeResponsiveBox(boxes[i]);
    }
}

function initializeResponsiveBox(box){
        box.addEventListener("mousemove", function(event){ if(!event){ event = window.event; } updateRespBoxMouseMove(event, box); }, false);
        box.addEventListener("mouseout", function(){ updateRespBoxMouseOut(box); }, false);
}

function updateRespBoxMouseMove(event, box){
    if(!box.classList.contains('no-touch')){
        let a = c1;
        let b = c2;
        let c = b1;
        let d = b2;

        if(box.classList.contains('primary') || box.classList.contains('primary-mimic')){
            a = g1;
            b = g2;
            c = g3;
            d = g4;
        }
        
        const xPost = event.pageX - box.getBoundingClientRect().left + document.body.getBoundingClientRect().left;
        const yPost = event.pageY - box.getBoundingClientRect().top + document.body.getBoundingClientRect().top;

        if(!box.classList.contains('no-bg-anim')){
            box.style.background = 'radial-gradient(circle ' + box.offsetWidth + 'px at ' + xPost + 'px ' + yPost + 'px, ' + a + ', ' + b + ')';
        }

        box.style.borderImageSource = 'radial-gradient(circle ' + box.offsetWidth + 'px at ' + xPost + 'px ' + yPost + 'px, ' + c + ', ' + d + ')';
    }
}

function updateRespBoxMouseOut(box){
    let a = c2;
    let b = b3;

    if(box.classList.contains('primary')){
        a = g2;
        b = g4;
    }

    if(!box.classList.contains('no-bg-anim')){
        box.style.background = a;
    }

    box.style.borderImageSource = 'radial-gradient(circle, ' + b + ', ' + b + ')';
}