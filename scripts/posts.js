const maxTextLength = 365;

function addReadMore(){
    //if()
    const posts = document.getElementsByClassName("post");

    for(let i = 0; i < posts.length; i++){
        var textElement = posts[i].getElementsByClassName("post-text")[0];
        const text = textElement.innerHTML;
        if(text.length > maxTextLength){
            var newText = text.substring(0, maxTextLength);

            //prevents cutting words
            newText = text.substr(0, Math.min(newText.length, newText.lastIndexOf(" ")));
            const removedText = text.substring(newText.length, text.length);

            textElement.innerHTML = newText + "... <span class='read-more'>Read more</span>";

            console.log(newText);
            console.log(removedText);
        }

    }
}
