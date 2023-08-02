(async () => {
    alert
    let categoryId = document.getElementById('categoryId');
    let categoryDescription = document.getElementById('categoryDescription');
    let tableCategory = document.getElementById('tableCategory');
    let tdobyCategory = document.getElementById('tdobyCategory');
    let btnSaveArticle = document.getElementById('btnSaveArticle');

    let isEditing = false;
    let catId = 0;

    let URL = `${BaseUrl}api/categories/`

    let getCategories = await fetch(URL)
        .then(res => {
            if (res.status >= 400) {
                console.error(`Error al hacer la petición, Error ${res.status}`);
            }
            return res.json();
        })
        .catch(err => {
            console.log(err)
        })

    let createRow = (data, key) => {

        let div = document.createElement('div');
        div.classList.add('tr');
        div.setAttribute('data-key', key);
        div.setAttribute('data-id',data.categoryId)

        let td = `
            <div class="td text-center">${data.categoryId}</div>
            <div class="td description">${data.description}</div>
            <div class="td text-center">
                <button class="btn-edit">
                    <i class="fa-regular fa-pen-to-square"></i>
                </button>
            </div>
        `;

        div.insertAdjacentHTML('afterbegin', td);

        return div;
    }

    let updateRow = (data) => {

    }

    let updateCategorieList = async() => {
        getCategories = await fetch(URL)
        .then(res => {
            if (res.status >= 400) {
                console.error(`Error al hacer la petición, Error ${res.status}`);
            }
            return res.json();
        })
        .catch(err => {
            console.log(err)
        }) 
    }

    let clearInput = () => {
        categoryId.value = 0;
        categoryDescription.value = "";
    }

    fillTableCategories = (categories) => {
        console.log(categories);
        let fragment = document.createDocumentFragment();

        for (let key in categories) {
            let element = categories[key];
            console.log(element);
            let row = createRow(element, key);

            fragment.append(row);
        }

        tdobyCategory.append(fragment);

    }
    fillTableCategories(getCategories);

    let getDataForRequest = () => {
        if (isEditing) {
            return {
                description: categoryDescription.value
            }
        } else {
            return {
                description: categoryDescription.value
            }
        }
    }

    let requestUsingFetch = async (method, data) => {
        
        try {
            return await fetch((method == 'PUT') ? URL + catId : URL, {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                console.log(res);
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res.text();
            })
            .then(async res => { 
                isEditing = false;
                
                if(method == 'POST'){
                    res = JSON.parse(res);
                }

                updateCategorieList();

                return res;
            })
            .catch(err => {
                console.log(err);
            })
        } catch (error) {
            console.error(error);
        }
    }

    btnSaveArticle.addEventListener('click', async e => {

        if (categoryDescription.value == '') {
            console.error('Debe de introducir una descripcion');
            return;
        }

        let wasAccepted = await showAcceptRejectModal('Crear la categoria',`Se creara la categoria <span class="strong">${categoryDescription.value}</span>`);

        if(wasAccepted){
            
            let categoriesObj = getDataForRequest();
    
            if (isEditing) {
    
                await requestUsingFetch('PUT', categoriesObj);
                let row = tdobyCategory.querySelector(`[data-id="${catId}"] .description`); 
                row.textContent = categoryDescription.value;
    
            } else {
    
                let dataReturn = await requestUsingFetch('POST', categoriesObj);
                let row = createRow(dataReturn,getCategories.length);
                
                tdobyCategory.append(row);
            }
    
            clearInput();
        }

    });

    tdobyCategory.addEventListener('click', e => {

        let key = e.target.closest('[data-key]').getAttribute('data-key');

        if(e.target.closest('button.btn-edit')){
            categoryId.value = getCategories[key].categoryId;
            categoryDescription.value = getCategories[key].description;
            catId = getCategories[key].categoryId;
            categoryDescription.select()
            isEditing = true;
        }

    });

    btnClearAll.addEventListener('click',clearInput)


})()
