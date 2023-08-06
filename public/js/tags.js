(async () => {
    alert
    let tagId = document.getElementById('tagId');
    let tagDescription = document.getElementById('tagDescription');
    let tdobyTag = document.getElementById('tdobyTag');
    let btnSaveArticle = document.getElementById('btnSaveArticle');

    let isEditing = false;
    let tgId = 0;

    let URL = `${BaseUrl}api/tags/`

    let getTags
    try {
        
        getTags = await fetch(URL)
            .then(res => {
                if (res.status >= 400) {
                    throw new Error(`Error al hacer la petición, Error ${res.status}`);
                }
                return res.json();
            })
            .catch(err => {
                showAlertBanner('danger',err);
            })
    } catch (error) {
        showAlertBanner('danger',error);
    }

    let createRow = (data, key) => {

        let div = document.createElement('div');
        div.classList.add('tr');
        div.setAttribute('data-key', key);
        div.setAttribute('data-id',data.tagId)

        let td = `
            <div class="td text-center">${data.tagId}</div>
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

    let updateTagsList = async() => {
        getTags = await fetch(URL)
        .then(res => {
            if (res.status >= 400) {
                throw new Error(`Error al hacer la petición, Error ${res.status}`);
            }
            return res.json();
        })
        .catch(err => {
            showAlertBanner(danger,err);
        }) 
    }

    let clearInput = () => {
        tagId.value = 0;
        tagDescription.value = "";
        tgId = 0;
        isEditing = false;
    }

    let fillTabletags = (tags) => { 
        let fragment = document.createDocumentFragment();

        for (let key in tags) {
            let element = tags[key]; 
            let row = createRow(element, key);

            fragment.append(row);
        }

        tdobyTag.append(fragment);

    }
    fillTabletags(getTags);

    let getDataForRequest = () => {
        if (isEditing) {
            return {
                description: tagDescription.value
            }
        } else {
            return {
                description: tagDescription.value
            }
        }
    }

    let requestUsingFetch = async (method, data) => {
        
        try {
            return await fetch((method == 'PUT') ? URL + tgId : URL, {
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

                updateTagsList();

                return res;
            })
            .catch(err => {
                throw new Error(`Error al hacer la petición, Error ${res.status}`);
            })
        } catch (error) {
            showAlertBanner('danger',error);
        }
    }

    btnSaveArticle.addEventListener('click', async e => {

        if (tagDescription.value == '') {
            showAlertBanner('warning','Debe de introducir una descripcion');
            tagDescription.focus();
            return;
        }

        let wasAccepted = await showAcceptRejectModal('Crear tag',`Se creara el tag <span class="strong">${tagDescription.value}</span>`);

        if(wasAccepted){
            
            let tagObj = getDataForRequest();
    
            if (isEditing) {
    
                await requestUsingFetch('PUT', tagObj);
                let row = tdobyTag.querySelector(`[data-id="${tgId}"] .description`); 
                row.textContent = tagDescription.value;
                showAlertBanner('success',`El registro se ha modificado de manera exitosa`)

    
            } else {
    
                let dataReturn = await requestUsingFetch('POST', tagObj); 
                let row = createRow(dataReturn,getTags.length);
               
                tdobyTag.append(row);

                showAlertBanner('success',`Se ha creado el documento No. ${dataReturn.tagId}`)
            }
    
            clearInput();
        }

    });

    tdobyTag.addEventListener('click', e => {

        let key = e.target.closest('[data-key]').getAttribute('data-key');

        if(e.target.closest('button.btn-edit')){
            tagId.value = getTags[key].tagId;
            tagDescription.value = getTags[key].description;
            tgId = getTags[key].tagId;
            tagDescription.select()
            isEditing = true;
        }

    });

    btnClearAll.addEventListener('click',clearInput);

})()
