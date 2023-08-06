(async () => {

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

    let URL = `${BaseUrl}api/categories/`


    let getCategories = await fetch(URL)
        .then(res => {
            if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
            return res.json();
        })
        .catch(err => {
            console.log(err)
        })

    let fillSelectCategories = (categories) => {
        console.log(categories);
        let fragment = document.createDocumentFragment();
        for (let category of categories) {
            let option = document.createElement('option');
            option.innerText = category.description;
            option.value = category.categoryId;
            fragment.append(option);
        }
        selectCategory.append(fragment)
    }

    fillSelectCategories(getCategories);

    // imageSelector.addEventListener("change", function (e) {

    //     let imgRoot = e.target.files[0];
    //     let fileR = new FileReader();
    //     fileR.readAsDataURL(imgRoot);

    //     fileR.addEventListener("load", function (e) {

    //         let div = document.createElement('div');
    //         div.classList.add('images');
    //         let image = ` 
    //             <figure>
    //                 <img src="${e.target.result}" alt="">
    //             </figure> 
    //         `;
    //         div.insertAdjacentHTML('afterbegin', image);
    //         imagesContent.insertAdjacentElement('beforeend', div);
    //     });
    // });

    principalImg.addEventListener("change", function (e) {
        let imgRoot = e.target.files[0];
        let fileR = new FileReader();
        fileR.readAsDataURL(imgRoot);

        fileR.addEventListener("load", function (e) {
            principalImgContent.setAttribute("src", e.target.result);
        });
    });

    imageSelector.addEventListener("change", function (e) {
        const selectedImages = e.target.files;

        for (const imgRoot of selectedImages) {
            const fileR = new FileReader();

            fileR.readAsDataURL(imgRoot);

            fileR.addEventListener("load", function (e) {
                const div = document.createElement("div");
                div.classList.add("images");
                const image = `
                    <figure>
                    <img src="${e.target.result}" alt="">
                    </figure>
                `;
                div.insertAdjacentHTML("afterbegin", image);
                imagesContent.insertAdjacentElement("beforeend", div);
            });
        }
    });

})()


