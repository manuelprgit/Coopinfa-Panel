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
    let modalNews = document.getElementById('modalNews');
    let closeModal = document.getElementById('closeModal');
    let tdobyMembers = document.getElementById('tdobyMembers');
    let tagsContainer = document.getElementById('tagsContainer');
    let selectTags = document.getElementById('selectTags');

    let URL = `${BaseUrl}api/news/`
    let URLCategory = `${BaseUrl}api/categories/`
    let URLTags = `${BaseUrl}api/tags/`;

    let idNew = 0;

    let imageName;

    let getAllNews = await fetch(URL)
        .then(res => {
            if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
            return res.json();
        })
        .catch(err => {
            console.log(err)
        })

    let getCategories
    try {
        getCategories = await fetch(URLCategory)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res.json();
            })
            .catch(err => {
                throw err;
            })
    } catch (error) {
        showAlertBanner('danger', error);
    }

    let getAllTags;
    try {
        getAllTags = await fetch(URLTags)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res.json();
            })
            .catch(err => {
                throw err;
            })
    } catch (error) {
        showAlertBanner('danger', error)
    }

    btnSearchArticles.addEventListener('click', e => {
        showModal(modalNews);
    })

    let fillSelectCategories = (categories) => {
        
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

    let fillTableNews = (news) => {
        
        let fragment = document.createDocumentFragment();

        for (let key in news) {

            let thisNew = news[key];

            let tr = document.createElement('div');
            tr.classList.add('tr');
            tr.setAttribute('data-key', key);
            td = ` 
                <div class="td text-center">${thisNew.newsId}</div>
                <div class="td">${thisNew.title}</div>
                <div class="td text-center">${thisNew.date}</div> 
            `;
            tr.insertAdjacentHTML('afterbegin', td);
            fragment.append(tr);
        }
        tdobyMembers.append(fragment);

    }
    fillTableNews(getAllNews);

    let fillSelectTags = (tags) => {
        let fragment = document.createDocumentFragment();
        for (let tag of tags) {
            let option = document.createElement('option');
            option.innerText = tag.description;
            option.value = tag.tagId;
            fragment.append(option);
        }
        selectTags.append(fragment)
    }
    fillSelectTags(getAllTags);

    let insertTagOnContent = (tagData) => {

        let tag = document.createElement('div');
        tag.classList.add('tag');
        tag.setAttribute('data-id', tagData.tagId);
        let ps = `
            <p>${tagData.description}</p>
            <p>x</p>
        `;
        tag.insertAdjacentHTML('afterbegin', ps);
        tagsContainer.insertAdjacentElement('afterbegin', tag);

    }

    let insertIntoTagList = (tag) => {

    }

    let getDataForRequest = () => {

        if(!imageName) imageName = principalImg.files[0].name;

        console.log(mainTitle.value);
        console.log(120);
        console.log(articleDetail.value);
        console.log(principalImg.files[0]);

        let formData = new FormData();
        formData.append("image", principalImg.files[0]);
        formData.append("title", mainTitle.value);
        formData.append("coments", 120);
        formData.append("description", articleDetail.value);

        return formData;

    }

    let setAllInputsValue = (data) => {
        
        mainTitle.value = data.title;
        articleDetail.value = data.description;
        idNew = data.newsId;
    }

    let clearAllInputs = () => {
        mainTitle.value = "";
        selectCategory.value = 0;
        inputAuthor.value = "";
        imagesContent.textContent = '';
        articleDetail.value = '';
        selectTags.value = 0;
        tagsContainer.textContent = '';
        principalImgContent.src = './src/img/add.png';
    }

    let getNewById = async (newsId) => {

        return await fetch(`${URL}${newsId}`)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res.json();
            })
            .catch(err => {
                console.log(err)
            })

    }

    let getImgNews = async (imgName) => {
        
        imageName = imgName;

        console.log('nombre imagen');
        console.log(imgName);

        return await fetch(`${URL}image/${imgName}`)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res;
            })
            .catch(err => {
                console.log(err)
            })
    }

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

    closeModal.addEventListener('click', e => {
        hideModal(modalNews);
    });

    selectTags.addEventListener('change', e => {

        let tagId = e.target.value;

        if (tagId == 0) {
            return;
        }
        let tag = getAllTags.find(tag => {
            return tag.tagId == tagId;
        })

        insertTagOnContent(tag);

    })

    btnSaveArticle.addEventListener('click', async e => {

        let dataRequest = getDataForRequest(); 
        if (idNew > 0) {
            await fetch(`${URL}${idNew}`, {
                method: 'PUT',
                body: dataRequest,                
            })
                .then(res => {
                    if (res.status >= 400) { 
                        throw new Error(`Error al hacer la petición, Error ${res.status}`)
                    };
                    return res.text();
                })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            await fetch(URL, {
                method: 'POST',
                body: dataRequest,
                headers: {
                    'Content-Disposition': `attachment; filename="${imageName}"`
                }
            })
                .then(res => {
                    if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                    return res.json();
                })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err)
                })
        }

    });

    tableCategory.addEventListener('click', async e => {

        if (e.target.closest('[data-key]')) {

            let key = e.target.closest('[data-key]').getAttribute('data-key');

            let newById = await getNewById(getAllNews[key].newsId);
            
            let image = await getImgNews(newById.image);
            console.log(image);
            if (image) {
                principalImgContent.setAttribute('src', image.url);
            } else {
                principalImgContent.setAttribute('src', './src/img/add.png');
            }

            setAllInputsValue(newById);

            hideModal(modalNews);
        }

    });

    btnClearAll.addEventListener('click', e => {
        clearAllInputs();
    });

})()


