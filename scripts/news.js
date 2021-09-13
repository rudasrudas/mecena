const modal = document.getElementById("article-modal");
const modalTitle = modal.getElementsByClassName("title")[0];
const modalImage = modal.getElementsByClassName("article-modal-image")[0];
const modalText = modal.getElementsByClassName("article-modal-text")[0];

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
    const div = document.createElement("div");
    const image = `https://api.mecena.net/image/${article_info.image_name}?type=article`
    div.innerHTML = `
    <div class="article">
        <img class="article-image" src="${image}" alt="">
        <div class="article-content-wrapper">
            <h3 class="article-title">${article_info.title}</h3>
            <div class="article-text-separator"></div>
            <p class="article-summary">${article_info.summary}</p>
            <span onclick="openModal(this)" data-modal-target="#article-modal" class="article-read-more">Read more</span>
        </div>
    </div>`.trim();
    const article = div.firstChild;
    container.appendChild(article);
    const readMore = article.querySelectorAll("[data-modal-target]")[0];
    setupReadMore(readMore, article_info.title, image, article_info.content.replace("\n", "<br>"))
}

function setupReadMore(readMore, title, image, text){
    readMore.addEventListener("click", ()=>{
        modalTitle.innerHTML = title;
        modalImage.src = image;
        modalText.innerHTML = text;
    })
}
