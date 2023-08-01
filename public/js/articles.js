let mainTitle = document.getElementById('mainTitle');
let principalImg = document.getElementById('principalImg');
let selectCategory = document.getElementById('selectCategory');
let inputAuthor = document.getElementById('inputAuthor');
let btnClearAll = document.getElementById('btnClearAll');
let btnSearchArticles = document.getElementById('btnSearchArticles');
let btnSaveArticle = document.getElementById('btnSaveArticle');
let articleDetail = document.getElementById('articleDetail');
let imagesContent = document.getElementById('imagesContent');
let imageSelector = document.getElementById('imageSelector');
let principalImgContent = document.getElementById('principalImgContent');

imageSelector.addEventListener("change", function (e) {
    let imgRoot = e.target.files[0];
    let fileR = new FileReader();
    fileR.readAsDataURL(imgRoot);

    fileR.addEventListener("load", function (e) {

        let div = document.createElement('div');
        div.classList.add('images');
        let image = ` 
            <figure>
                <img src="${e.target.result}" alt="">
            </figure> 
        `;
        div.insertAdjacentHTML('afterbegin', image);
        imagesContent.insertAdjacentElement('beforeend', div);
    });
});

principalImg.addEventListener("change", function (e) {
    let imgRoot = e.target.files[0];
    let fileR = new FileReader();
    fileR.readAsDataURL(imgRoot);

    fileR.addEventListener("load", function (e) {
        principalImgContent.setAttribute("src", e.target.result);
    });
});
