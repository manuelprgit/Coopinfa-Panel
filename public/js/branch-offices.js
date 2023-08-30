(async()=>{
    loaderControler.enable();

    let principalImgContent = document.getElementById('principalImgContent');
    let principalImg = document.getElementById('principalImg');
    let branchId = document.getElementById('branchId');
    let branchName = document.getElementById('branchName');
    let address = document.getElementById('address');
    let phone = document.getElementById('phone');
    let mapLocation = document.getElementById('mapLocation');
    let modalSucursales = document.getElementById('modalSucursales');
    let tdobySucursal = document.getElementById('tdobySucursal');
    let closeModal = document.getElementById('closeModal');

    let btnClearAll = document.getElementById('btnClearAll');
    let btnSearchSucursal = document.getElementById('btnSearchSucursal');
    let btnSaveSucursal = document.getElementById('btnSaveSucursal');

    let isEditing = false;
    let branId

    let URL = `${BaseUrl}api/branch`
    let getAllBranches;
    try {
        getAllBranches = await fetch(URL)
        .then(res=>{
            if(res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
            return res.json();
        }) 
        .catch(err=>{
            throw err
        })
        
    } catch (error) {
        showAlertBanner('danger',error)
    }

    let clearAllInputs = () => {
        principalImgContent.setAttribute('src','./src/img/add.png');
        //TODO: Revisar si el valor de la iamgen se resetea
        principalImg.value = '';
        branchId.value = 0;
        branchName.value = "";
        address.value = "";
        phone.value = "";
        mapLocation.value = "";
    }
    
    let setImagesOnContent = async (content, image) => {
        try {
            await fetch(`${BaseUrl}api/news/image/${image}`)
                .then(res => {
                    if (res.status >= 400) {
                        throw new Error(`Error al hacer la petición, Error ${res.status}`);
                    }
                    return res;
                }).then(res => {
                    content.src = res.url;
                })
                .catch(err => {
                    throw err;
                })

        } catch (error) {
            showAlertBanner('danger',error);
        }
    }

    let getDataForRequest = () => {
        
        let formData = new FormData();
        formData.append("imgBranch", principalImg.files[0]);
        formData.append("nameBranch", branchName.value);
        formData.append("direction", address.value);
        formData.append("phone", phone.value);
        formData.append("mapLocation", mapLocation.value);
        return formData;

    }

    let insertRowOnTable = (dataRow, key) => {
        console.log(dataRow);
        let tr = document.createElement('div');
        tr.classList.add('tr');
        tr.setAttribute('data-key', key);
        tr.setAttribute('data-id', dataRow.branchId);
        td = ` 
            <div class="td text-center">${dataRow.branchId}</div>
            <div class="td">Aqui hiria el nombre de la sucursal</div> 
            <div class="td text-center">${dataRow.direction}</div>
            <div class="td text-center">${dataRow.phone}</div>

        `;
        tr.insertAdjacentHTML('afterbegin', td);
        return tr;
    }

    let fillTableProducts = (products) => {

        let fragment = document.createDocumentFragment();

        for (let key in products) {

            let product = products[key];
            let row = insertRowOnTable(product, key)
            fragment.append(row);
        }
        tdobySucursal.append(fragment);
    };
    fillTableProducts(getAllBranches);

    let fillAllInputs = async (sucursal) => {
        console.log(sucursal);
        branchId.value = sucursal.branchId;
        branchName.value = 'nombre'//sucursal.name;
        address.value = sucursal.direction;
        phone.value = sucursal.phone;
        mapLocation.value = sucursal.mapLocation;

        //if (sucursal.image) await setImagesOnContent(principalImgContent, sucursal.image);

    }

    let requestUsingFetch = async (method, data) => {

        try {
            return await fetch((method == 'PUT') ? `${URL}/${branId}` : URL, {
                method: method,
                body: data
            })
                .then(res => {
                    if (res.status >= 400) throw new Error(`Error al hacer ${method}, Error ${res.status}`);
                    loaderControler.disable();
                    return res.text();
                })
                .then(async res => {

                    if (method == 'POST') {
                        res = JSON.parse(res);
                    }

                    return res;
                })
                .catch(err => {
                    throw new Error(`Error al hacer la petición, Error ${res.status}`);
                })
        } catch (error) {
            showAlertBanner('danger', error);
        }
    }

    principalImg.addEventListener("change", function (e) {
        let imgRoot = e.target.files[0];
        let fileR = new FileReader();
        fileR.readAsDataURL(imgRoot);

        fileR.addEventListener("load", function (e) {
            principalImgContent.setAttribute("src", e.target.result);
        });
    });
        
    btnClearAll.addEventListener('click',e=>{
        clearAllInputs()
    });

    btnSaveSucursal.addEventListener('click',async e=>{

        let wasAccepted = await showAcceptRejectModal('Guardar el registro', `Si acepta procedera a guardar el registro`)
        
        if(!wasAccepted) return;

        loaderControler.enable();

        let data = getDataForRequest();

        if (isEditing) {

            await requestUsingFetch('PUT', data);
            showAlertBanner('success', 'Se ha editado el producto');
            updateRow();
            clearAllInputs();
            removeAllDangerAlert(inputContent);

        } else {

            let branchCreate = await requestUsingFetch('POST', data);
            tdobyProduct.append(insertRowOnTable(branchCreate, getAllBranches.length));
            showAlertBanner('success', 'Se ha creado el producto');
            clearAllInputs();
            getAllProducts = await fetch(URL)
                .then(res => {
                    if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                    loaderControler.disable();
                    return res.json();
                })
                .catch(err => {
                    console.log(err)
                })
            removeAllDangerAlert(inputContent);

        }

        //TODO: se cuarda varias veces si le damos a cancelar varias veces
    });

    tdobySucursal.addEventListener('click',e=>{

        if(e.target.closest('.tr')){
            let key = e.target.closest('.tr').getAttribute('data-key');
            fillAllInputs(getAllBranches[key]);
            hideModal(modalSucursales)
        }

    });

    btnSearchSucursal.addEventListener('click',e=> showModal(modalSucursales));
    closeModal.addEventListener('click',e=> hideModal(modalSucursales));

    loaderControler.disable();
})()