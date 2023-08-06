(async() => {

    let productName = document.getElementById('productName'); 
    let titleProduct = document.getElementById('titleProduct');
    let productDetail = document.getElementById('productDetail');

    let btnClearAll = document.getElementById('btnClearAll');
    let btnSearchProduct = document.getElementById('btnSearchProduct');
    let btnSaveProduct = document.getElementById('btnSaveProduct');
     
    let inputContent = document.getElementById('inputContent');

    let principalImg = document.getElementById('principalImg');
    let principalImgContent = document.getElementById('principalImgContent');

    let URL = `${BaseUrl}api/products`;

    principalImg.addEventListener("change", function (e) {
        let imgRoot = e.target.files[0];
        let fileR = new FileReader();
        fileR.readAsDataURL(imgRoot);

        fileR.addEventListener("load", function (e) {
            principalImgContent.setAttribute("src", e.target.result);
        });
    });

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
      
        productName.value = "";
        titleProduct.value = "";
        productDetail.value = "";
        principalImgContent.src = './src/img/add.png';

        removeAllDangerAlert(inputContent);

    }

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

})()