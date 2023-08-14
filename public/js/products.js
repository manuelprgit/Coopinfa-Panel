(async () => {
    loaderControler.enable();
    let productId = document.getElementById('productId');
    let productName = document.getElementById('productName');
    let titleProduct = document.getElementById('titleProduct');
    let productDetail = document.getElementById('productDetail');
    let principalImg = document.getElementById('principalImg');
    let principalImgContent = document.getElementById('principalImgContent');

    let closeModal = document.getElementById('closeModal');
    let btnClearAll = document.getElementById('btnClearAll');
    let btnSearchProduct = document.getElementById('btnSearchProduct');
    let btnSaveProduct = document.getElementById('btnSaveProduct');
    let modalProduct = document.getElementById('modalProduct');
    let tdobyProduct = document.getElementById('tdobyProduct');

    let inputContent = document.getElementById('inputContent');

    let isEditing = false;

    let prodId = 0;

    let URL = `${BaseUrl}api/products`;

    principalImg.addEventListener("change", function (e) {
        let imgRoot = e.target.files[0];
        let fileR = new FileReader();
        fileR.readAsDataURL(imgRoot);

        fileR.addEventListener("load", function (e) {
            principalImgContent.setAttribute("src", e.target.result);
        });
    });
    let getAllProducts
    try {
        getAllProducts = await fetch(URL)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res.json();
            })
            .catch(err => {
                console.log(err)
            })

    } catch (error) {
        showAlertBanner(error)
    }

    let getDataForRequest = () => {
        // return {
        //     name: productName.value,
        //     title: titleProduct.value,
        //     description: productDetail.value
        // }
        // TODO: //usar formdata para hacer el post
        let formData = new FormData();
        formData.append("image", principalImg.files[0]);
        formData.append("name", productName.value);
        formData.append("title",  titleProduct.value);
        formData.append("description", productDetail.value);
        return formData;

    }

    let clearAllInputs = () => {

        productId.value = 0;
        productName.value = "";
        titleProduct.value = "";
        productDetail.value = "";
        principalImgContent.src = './src/img/add.png';

        removeAllDangerAlert(inputContent);

        isEditing = false;

    }

    let insertRowOnTable = (dataRow, key) => {
        let tr = document.createElement('div');
        tr.classList.add('tr');
        tr.setAttribute('data-key', key);
        tr.setAttribute('data-id', dataRow.productId);
        td = ` 
            <div class="td text-center">${dataRow.productId}</div>
            <div class="td">${dataRow.name}</div> 
        `;
        tr.insertAdjacentHTML('afterbegin', td);
        return tr;
    }

    let updateRow = () => {
        let row = tdobyProduct.querySelector(`[data-id="${prodId}"]`);
        row.querySelector('.td:nth-child(2)').textContent = productName.value;
    }

    let fillTableProducts = (products) => {

        let fragment = document.createDocumentFragment();

        for (let key in products) {

            let product = products[key];
            let row = insertRowOnTable(product, key)
            fragment.append(row);
        }
        tdobyProduct.append(fragment);
    }
    fillTableProducts(getAllProducts);

    let requestUsingFetch = async (method, data) => {

        try {
            return await fetch((method == 'PUT') ? `${URL}/${prodId}` : URL, {
                method: method,
                body: data,
                // headers: {
                //     'Content-Type': 'application/json'
                // }
            })
                .then(res => {
                    if (res.status >= 400) throw new Error(`Error al hacer ${method}, Error ${res.status}`);
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

    let getProductById = async (productId) => {

        return await fetch(`${URL}/${productId}`)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res.json();
            })
            .catch(err => {
                showAlertBanner('danger', err);
            })

    }

    let fillAllInputs = async (product) => {
        
        productId.value = product.productId;
        productName.value = product.name;
        titleProduct.value = product.title;
        productDetail.value = product.description;
        prodId = product.productId;
        
        if(product.image){
            try {
                imagen = await fetch(`${BaseUrl}api/news/image/${product.image}`)
                    .then(res => {
                        if (res.status >= 400) {
                            throw new Error(`Error al hacer la petición, Error ${res.status}`);
                        }
                        return res;
                    }).then(res=>{ 
                        principalImgContent.src = res.url
                    })
                    .catch(err => {
                        console.log(err)
                    }) 
                
            } catch (error) {
                console.log(error);
            } 

        }

    }

    btnSaveProduct.addEventListener('click', async e => {

        let isEmpty = validateInput(inputContent);

        if (isEmpty) {
            showAlertBanner('warning', 'Faltan parametros');
            return;
        }

        let wasAccepted = await showAcceptRejectModal('Guardar el registro', `Si acepta procedera a guardar el registro`)

        if (!wasAccepted) {
            return;
        }

        let data = getDataForRequest();

        if (isEditing) {

            await requestUsingFetch('PUT', data);
            showAlertBanner('success', 'Se ha editado el producto');
            updateRow();
            clearAllInputs();
            removeAllDangerAlert(inputContent);

        } else {

            let productCreated = await requestUsingFetch('POST', data);
            console.log(productCreated);
            tdobyProduct.append(insertRowOnTable(productCreated, getAllProducts.length));
            showAlertBanner('success', 'Se ha creado el producto');
            clearAllInputs();
            getAllProducts = await fetch(URL)
                .then(res => {
                    if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                    return res.json();
                })
                .catch(err => {
                    console.log(err)
                })
            removeAllDangerAlert(inputContent);

        }

        isEditing = false;


    })

    inputContent.addEventListener('keydown', e => removeDangerAlert(e.target));

    btnClearAll.addEventListener('click', clearAllInputs);

    btnSearchProduct.addEventListener('click', e => {
        showModal(modalProduct);
    })

    closeModal.addEventListener('click', e => {
        hideModal(modalProduct);
    })

    tdobyProduct.addEventListener('click', async e => {

        if (e.target.closest('[data-key]')) {

            clearAllInputs();

            let key = e.target.closest('[data-key]').getAttribute('data-key');
            let productById = await getProductById(getAllProducts[key].productId);
            fillAllInputs(productById);
            isEditing = true;
            hideModal(modalProduct)
        }
    })

    loaderControler.disable();
})()