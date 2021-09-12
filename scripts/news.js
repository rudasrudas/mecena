const modal = document.getElementById("article-modal");
const modalTitle = modal.getElementsByClassName("article-modal-title")[0];
const closeModalButton = document.getElementById("article-modal-close");
const modalImage = modal.getElementsByClassName("article-modal-image")[0];
const modalText = modal.getElementsByClassName("article-modal-text")[0];
const overlay = document.getElementById("article-modal-overlay");
const posts = document.getElementsByClassName("article");

;(function(){
    renderArticles();
})();


function renderArticles(){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/articles`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            const articles = JSON.parse(xhr.response);

            const innerNews = document.querySelector(".inner-news");

            for(let i = 0; i < Object.keys(articles).length; i++){
                addArticle(articles[i], innerNews);
            }

        }
        else {
            alert('Request failed.  Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function addArticle(article_info, container){
    const article = document.createElement("div");
    article.innerHTML = `
        <div class="article">
            <img class="article-image" src="https://api.mecena.net/article/${article_info.image_name}" alt="">
            <div class="article-content-wrapper">
                <h3 class="article-title">${article_info.title}</h3>
                <div class="article-text-separator"></div>
                <p class="article-summary">${article_info.summary}</p>
                <span class="article-read-more">Read more</span>
            </div>
        </div>
    `;
    container.appendChild(article);
    const readMore = article.getElementsByClassName("article-read-more")[0];

    setupReadMore(readMore, article_info)
}

function setupReadMore(readMore, article_info){
    const image = `https://api.mecena.net/article/${article_info.image_name}`;
    readMore.addEventListener("click", ()=>{
        openModal(article_info.title, image, article_info.content.replace("\n", "<br>"));
    })
}

closeModalButton.addEventListener("click", ()=>{
    closeModal();
})

overlay.addEventListener("click", ()=>{
    closeModal();
})

function openModal(title, image, text){
    modalTitle.innerHTML = title;
    modalImage.src = image;
    modalText.innerHTML = text;
    modal.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("noscroll");
}

function closeModal(){
    modal.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("noscroll");
}
