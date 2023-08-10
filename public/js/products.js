(async() => {

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
        .then(res=>{
            if(res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
            return res.json();
        }) 
        .catch(err=>{
            console.log(err)
        })
        
    } catch (error) {
        showAlertBanner(error)
    }

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

    let clearAllInputs = () => {
      
        productId.value = 0;
        productName.value = "";
        titleProduct.value = "";
        productDetail.value = "";
        principalImgContent.src = './src/img/add.png';

        removeAllDangerAlert(inputContent);

    }

    let insertRowOnTable = (dataRow,key) => {
        let tr = document.createElement('div');
        tr.classList.add('tr');
        tr.setAttribute('data-key', key);
        td = ` 
            <div class="td text-center">${dataRow.productId}</div>
            <div class="td">${dataRow.name}</div> 
        `;
        tr.insertAdjacentHTML('afterbegin', td);
        return tr;
    }

    let fillTableProducts = (products) => {
        
      let fragment = document.createDocumentFragment();

      for(let key in products){

            let product = products[key];
            let row = insertRowOnTable(product,key)
            fragment.append(row);
        }
        tdobyProduct.append(fragment);
    }
    fillTableProducts(getAllProducts);

    let requestUsingFetch = async (method, data) => {
        
        try {
            return await fetch((method == 'PUT') ? `${URL}/2` : URL, {
                method: method,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => { 
                if (res.status >= 400) throw new Error(`Error al hacer ${method}, Error ${res.status}`);
                return res.text();
            })
            .then(async res => {
                
                if(method == 'POST'){
                    res = JSON.parse(res);
                }

                return res;
            })
            .catch(err => {
                throw new Error(`Error al hacer la petición, Error ${res.status}`);
            })
        } catch (error) {
            showAlertBanner('danger',error);
        }
    }

    let getProductById = async (productId) => {
        
        return await fetch(`${URL}/${productId}`)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res.json();
            })
            .catch(err => {
                showAlertBanner('danger',err);
            })

    }

    let fillAllInputs = (product) => {
        
        productId.value = product.productId;
        productName.value = product.name;
        titleProduct.value = product.title;
        productDetail.value = product.description;

    }

    btnSaveProduct.addEventListener('click',async e=>{
    
        let isEmpty = validateInput(inputContent);

        if(isEmpty){
            showAlertBanner('warning','Faltan parametros');
            return
        }

        let wasAccepted = await showAcceptRejectModal('Crear el producto',`Se creara el producto <span class="strong">${productName.value}</span>`) 

        if(wasAccepted){
            showAlertBanner('success','Se ha creado el producto');
            clearAllInputs();
            removeAllDangerAlert(inputContent);
        }


    })

    inputContent.addEventListener('keydown',e=> removeDangerAlert(e.target));
    
    btnClearAll.addEventListener('click', clearAllInputs);

    btnSearchProduct.addEventListener('click',e=>{
        showModal(modalProduct);
    })

    closeModal.addEventListener('click',e=>{
        hideModal(modalProduct);
    })

    tdobyProduct.addEventListener('click',async e=>{

        if (e.target.closest('[data-key]')) {

            clearAllInputs();

            let key = e.target.closest('[data-key]').getAttribute('data-key');
            let productById = await getProductById(getAllProducts[key].productId); 
            fillAllInputs(productById);

            hideModal(modalProduct)
        }
    })
})()