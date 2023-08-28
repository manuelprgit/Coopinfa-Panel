(async () => {
    loaderControler.enable();
    let mainNumber = document.getElementById('mainNumber');
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
    let categoriesContainer = document.getElementById('categoriesContainer');
    let context = document.getElementById('context');

    let URL = `${BaseUrl}api/news/`;
    let URLCategory = `${BaseUrl}api/categories/`;
    let URLTags = `${BaseUrl}api/tags/`;

    let idNew = 0;
    let imageArray = [];
    let imageName;
    
    let categoriesObj = {};
    let tagObj = {};

    let getAllNews;
    let getCategories;
    let getAllTags;

    try {
        await Promise.all([
            fetch(URL),
            fetch(URLCategory),
            fetch(URLTags)
        ])
        .then( async ( [ news,categories,tags ] )=>{
            getAllNews = await news.json();
            getCategories = await categories.json();
            getAllTags = await tags.json(); 
        })
        
    } catch (error) {
        showAlertBanner('danger',error)
    }

    let createRowOnTable = (dataRow,idNews) => {
        let tr = document.createElement('div');
        tr.classList.add('tr');
        tr.setAttribute('data-idNews', idNews);
        td = ` 
            <div class="td text-center">${dataRow.newsId}</div>
            <div class="td">${dataRow.title}</div>
            <div class="td">${dataRow.autor}</div>
            <div class="td text-center">${dataRow.date}</div> 
        `;
        tr.insertAdjacentHTML('afterbegin', td);
        return tr;
    }

    let fillTableNews = (news) => {

        let fragment = document.createDocumentFragment();
        // news = news.sort((a,b)=>b.newsId-a.newsId)
        for (let key in news) {
            console.log(news);
            let thisNew = news[key];
            let row = createRowOnTable(thisNew,news[key].newsId)
            fragment.append(row);
        }
        tdobyMembers.append(fragment);

    }
    fillTableNews(getAllNews);

    let fillSelectCategories = (categories) => {

        if(categories instanceof Array){
            let fragment = document.createDocumentFragment();
            for (let category of categories) {
                let option = document.createElement('option');
                option.innerText = category.description;
                option.value = category.categoryId;
                fragment.append(option);
            }
            selectCategory.append(fragment)
        }

    }
    fillSelectCategories(getCategories);

    let fillSelectTags = (tags) => {

        if(tags instanceof Array){

            let fragment = document.createDocumentFragment();
            for (let tag of tags) {
                let option = document.createElement('option');
                option.innerText = tag.description;
                option.value = tag.tagId;
                fragment.append(option);
            }
            selectTags.append(fragment)
        }

    }
    fillSelectTags(getAllTags);

    let insertCategoryOnContent = (categoryData) => { 

        let category = document.createElement('div');
        category.classList.add('tag');
        category.setAttribute('data-id', categoryData.categoryId);
        let ps = `
            <p>${categoryData.description}</p>
            <p data-action="close">x</p>
        `;
        category.insertAdjacentHTML('afterbegin', ps);
        categoriesContainer.insertAdjacentElement('afterbegin', category);

    }

    let insertIntoCategoryList = (category) => {
        
        if(!categoriesObj[category.categoryId]){
            categoriesObj[category.categoryId];
        }else{
            showAlertBanner('warning',`La categoria ${category.description} ya ha sido insertada`);
            return false;
        }

        categoriesObj[category.categoryId] = category;
        console.log(categoriesObj);
        return true;
    } 

    let insertTagOnContent = (tagData) => { 

        let tag = document.createElement('div');
        tag.classList.add('tag');
        tag.setAttribute('data-id', tagData.tagId);
        let ps = `
            <p>${tagData.description}</p>
            <p data-action="close">x</p>
        `;
        tag.insertAdjacentHTML('afterbegin', ps);
        tagsContainer.insertAdjacentElement('afterbegin', tag);

    }

    let insertIntoTagList = (tag) => {

        if(!tagObj[tag.tagId]){
            tagObj[tag.tagId];
        }else{
            showAlertBanner('warning',`La categoria ${tag.description} ya ha sido insertada`);
            return false;
        }

        tagObj[tag.tagId] = tag;
        console.log(tagObj);
        return true;
    } 

    let getDataForRequest = () => { 
        
        let numberRandom = Math.floor(Math.random() * (200 - 1 + 1)) + 1

        let formData = new FormData();
        formData.append("image", principalImg.files[0]);
        formData.append("title", mainTitle.value);
        formData.append("coments", numberRandom);
        formData.append("description", articleDetail.value);
        formData.append("autor", inputAuthor.value);

        if(imageArray.length > 0){
            for (let i = 0; i < imageArray.length; i++) {
                formData.append("images[]", imageArray[i]);
            }
        }

        
        let categoryList = convertObjToList(categoriesObj).map(cat=>cat.categoryId);
        formData.append("categories", JSON.stringify(categoryList));

        let tagList = convertObjToList(tagObj).map(tag=>tag.tagId);
        formData.append("tags", JSON.stringify(tagList));

        return formData;

    }

    let setAllInputsValue = (data) => {

        mainNumber.value = data.newsId;
        mainTitle.value = data.title;
        articleDetail.value = data.description;
        idNew = data.newsId;
    }

    let clearAllInputs = () => {
        
        idNew = 0;
        mainNumber.value = 0;
        mainTitle.value = "";
        selectCategory.value = 0;
        categoriesContainer.textContent = '';
        inputAuthor.value = "";
        imagesContent.textContent = '';
        articleDetail.value = '';
        selectTags.value = 0;
        tagsContainer.textContent = '';
        principalImgContent.src = './src/img/add.png';
        categoriesObj = {};
        tagObj = {};
    }

    let getNewById = async (newsId) => {

        return await fetch(`${URL}${newsId}`)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res.json();
            })
            .catch(err => {
                showAlertBanner('danger',err);
            })

    }

    let getImgNews = async (imgName) => {

        if(!imgName){
            return;
        }

        imageName = imgName; 

        return await fetch(`${URL}image/${imgName}`)
            .then(res => {
                if (res.status >= 400) {
                    throw new Error(`Error al traer la imagen principal`);
                };
                return res;
            })
            .catch(err => { 
                showAlertBanner('danger',err);
            })
    }
    
    let setImagesOnContent = (images) => {
      
        const div = document.createElement("div");
        div.classList.add("images");
        const image = `
            <figure>
               <img src="${images}" alt="">
            </figure>
        `;
        div.insertAdjacentHTML("afterbegin", image);
        imagesContent.insertAdjacentElement("beforeend", div);

    }

    let removeFromTagList = (id,list) => delete list[id];

    let convertObjToList = (obj) => Object.entries(obj).map(item=> item[1]);

    btnSearchArticles.addEventListener('click', e => {
        showModal(modalNews);
    });

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
        imageArray = Array.from(selectedImages);

        for (const imgRoot of selectedImages) {
            const fileR = new FileReader();

            fileR.readAsDataURL(imgRoot);

            fileR.addEventListener("load", function (e) {
                setImagesOnContent(e.target.result);
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


        let isInserted = insertIntoTagList(tag);
        
        if(!isInserted){
            return;
        }

        insertTagOnContent(tag); 

    })

    selectCategory.addEventListener('change', e => {

        let categoryId = e.target.value;

        if (categoryId == 0) {
            return;
        } 

        let category = getCategories.find(category => {
            return category.categoryId == categoryId;
        })
        
        let isInserted = insertIntoCategoryList(category);
        
        if(!isInserted){
            return;
        }
        insertCategoryOnContent(category);

    });

    btnSaveArticle.addEventListener('click', async e => {

        let result = await showAcceptRejectModal('Desea guardar?', 'Se guardara los cambios que desea realizar');
        if (!result) {
            return;
        }
        let dataRequest = getDataForRequest();
        
        if (idNew > 0) {

            await fetch(`${URL}${idNew}`, {
                method: 'PUT',
                body: dataRequest
            })
                .then(async res => {
                    console.log(await res.text());
                    if (res.status >= 400) throw Error('Error al actualizar');
                    return res;
                })
                .then(res => {
                    console.log(res);
                    showAlertBanner('success', 'Se ha modificado el articulo')

                })
                .catch(err => {
                    showAlertBanner('danger',err)
                })
        } else {

            await fetch(URL, {
                method: 'POST',
                body: dataRequest,
                headers: {
                    'Content-Disposition': `attachment; filename="${imageName}"`
                }
            })
                .then(async res => {
                    
                    if (res.status >= 400) {
                        throw 'Error al hacer la peticion'
                    };
                    return res.json();
                })
                .then(async res => {
                    showAlertBanner('success', 'Se ha creado el articulo');             
                    let newRow = createRowOnTable(res,res.newsId);
                    tdobyMembers.insertAdjacentElement('afterbegin',newRow);

                    getAllNews = await fetch(URL).then(res=>res.json());
                    clearAllInputs();

                })
                .catch(err => {
                    showAlertBanner('danger',err)
                })
        }

    });

    tableCategory.addEventListener('click', async e => {

        
        if (e.target.closest('[data-idNews]')) {

            clearAllInputs();

            let idNews = e.target.closest('[data-idNews]').getAttribute('data-idNews');

            let newsById = await getNewById(idNews);
            console.log(newsById); 

            let image = await getImgNews(newsById.image); 

            if (image) {
                principalImgContent.setAttribute('src', image.url);
            } else {
                principalImgContent.setAttribute('src', './src/img/add.png');
            }

            for(let img of newsById.Images){
                let image = await getImgNews(img);
                setImagesOnContent(image.url);
            }

            for (let category of newsById.Categories){

                insertCategoryOnContent(category);
                insertIntoCategoryList(category);

            }
            
            for (let tag of newsById.Tags){

                insertTagOnContent(tag);
                insertIntoTagList(tag);
                
            }

            setAllInputsValue(newsById);
            
            hideModal(modalNews);
        }

    });

    btnClearAll.addEventListener('click', e => {
        clearAllInputs();
    });

    tagsContainer.addEventListener('click',e=>{
        if(e.target.matches('[data-action="close"]')){
            let elementTag = e.target.parentElement;
            
            elementTag.remove();

            removeFromTagList(elementTag.getAttribute('data-id'),tagObj);
        }
    });

    categoriesContainer.addEventListener('click',e=>{

        if(e.target.matches('[data-action="close"]')){
            let elementTag = e.target.parentElement;
            
            elementTag.remove();

            removeFromTagList(elementTag.getAttribute('data-id'),categoriesObj);
        }
    });

    loaderControler.disable();
})()
