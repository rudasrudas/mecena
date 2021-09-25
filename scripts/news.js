const articleModal = document.getElementById("article-modal");
const articleBody = document.querySelector(".modal-body");
const articleTitle = articleModal.querySelector(".article-modal-title");
const articleImage = articleModal.querySelector(".article-modal-image");
const articleText = articleModal.querySelector(".article-modal-text");

renderArticles();
setupModal();

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

            const respBoxes = document.querySelectorAll('.article-read-more.primary.resp-box, .article.resp-box');
            initializeResponsiveBoxes(respBoxes);
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
    <div class="article resp-box no-bg-anim">
        <img class="article-image resp-box no-touch" src="${image}" alt="">
        <div class="article-content-wrapper">
            <h3 class="article-title">${article_info.title}</h3>
            <div class="article-text-separator"></div>
            <p class="article-summary">${article_info.summary}</p>
            <button onclick="openModal(this)" data-modal-target="#article-modal" class="article-read-more primary resp-box">Read more</button>
        </div>
    </div>`.trim();
    const article = div.firstChild;
    container.appendChild(article);
    const readMore = article.querySelector("[data-modal-target]");
    setupReadMore(readMore, article_info.article_id)
}

function setupReadMore(readMore, id){
    readMore.addEventListener("click", ()=>{
        fetchMoreInfo(id, (info) => {
            articleTitle.innerHTML = info.title;
            articleImage.src = `https://api.mecena.net/image/${info.image_name}?type=article`;
            articleText.innerHTML = info.content.replace("\n", "<br>");
            articleBody.classList.remove("hidden");
        })
    })
}

function fetchMoreInfo(id, callback){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.mecena.net/article/${id}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(JSON.parse(xhr.response));
        }
        else {
            alert('Request failed. Returned status of ' + xhr.status);
        }
    };
    xhr.send();
}

function setupModal(){
    $(articleModal).on("close", () => {
        articleBody.classList.add("hidden");
    })
}
