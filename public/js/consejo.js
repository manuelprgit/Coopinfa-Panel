(async () => {
    loaderControler.enable();

    let consejoId = document.getElementById('consejoId');
    let consejoDescription = document.getElementById('consejoDescription');
    let tdobyConsejo = document.getElementById('tdobyConsejo');
    let btnSaveArticle = document.getElementById('btnSaveArticle');
    let counsilContext = document.getElementById('counsilContext');

    let isEditing = false;
    let tgId = 0;

    let URL = `${BaseUrl}api/councilType/`

    let getCounsil;
    try {
        
        getCounsil = await fetch(URL)
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
        div.setAttribute('data-id',data.councilTypeId)

        let td = `
            <div class="td text-center">${data.councilTypeId}</div>
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

    let updateCounsilList = async() => {
        getCounsil = await fetch(URL)
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
        consejoId.value = 0;
        consejoDescription.value = "";
        tgId = 0;
        isEditing = false;
    }

    let fillTableCounsil = (counsil) => { 
        let fragment = document.createDocumentFragment();

        for (let key in counsil) {
            let element = counsil[key]; 
            let row = createRow(element, key);

            fragment.append(row);
        }

        tdobyConsejo.append(fragment);

    }
    fillTableCounsil(getCounsil);

    let getDataForRequest = () => {
        if (isEditing) {
            return {
                description: consejoDescription.value
            }
        } else {
            return {
                description: consejoDescription.value
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

                updateCounsilList();

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
        
        let isEmpty = await validateInput(counsilContext)

        if (isEmpty) {
            showAlertBanner('warning','Debe de introducir una descripcion');
            consejoDescription.focus();
            return;
        }

        let wasAccepted = await showAcceptRejectModal('Crear tipo de consejo',`Se creara el tipo de consejo <span class="strong">${consejoDescription.value}</span>`);

        if(wasAccepted){
            
            let counsilObj = getDataForRequest();
    
            if (isEditing) {
    
                await requestUsingFetch('PUT', counsilObj);
                let row = tdobyConsejo.querySelector(`[data-id="${tgId}"] .description`); 
                row.textContent = consejoDescription.value;
                showAlertBanner('success',`El registro se ha modificado de manera exitosa`)

    
            } else {
    
                let dataReturn = await requestUsingFetch('POST', counsilObj); 
                let row = createRow(dataReturn,getCounsil.length);
               
                tdobyConsejo.append(row);

                showAlertBanner('success',`Se ha creado el documento No. ${dataReturn.consejoId}`)
            }
    
            clearInput();
        }

    });

    tdobyConsejo.addEventListener('click', e => {

        let key = e.target.closest('[data-key]').getAttribute('data-key');

        if(e.target.closest('button.btn-edit')){
            consejoId.value = getCounsil[key].councilTypeId;
            consejoDescription.value = getCounsil[key].description;
            tgId = getCounsil[key].councilTypeId;
            consejoDescription.select()
            isEditing = true;
        }

    });

    btnClearAll.addEventListener('click',clearInput);
    loaderControler.disable();

})()
