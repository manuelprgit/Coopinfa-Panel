window.BaseUrl = 'http://10.0.0.5:3123/';
// window.BaseUrl = 'http://localhost:3123/';

let modalContainerBackground = document.getElementById('modalContainerBackground');
let modalContent = document.getElementById('modalContent');
let textHeader = document.getElementById('textHeader');
let textP = document.getElementById('textP');
let acceptButtton = document.getElementById('acceptButtton');
let rejectButton = document.getElementById('rejectButton');

// alert banner variables
let alertBanner = document.getElementById('alertBanner');
let messageContent = document.getElementById('messageContent');
let closeBanner = document.getElementById('closeBanner');
let iconContent = document.getElementById('iconContent');
// alert banner variables

let loaderControler = {
    enable: () => {
        loader.classList.add('show')
    },
    disable: () => {
        loader.classList.remove('show')
    }
}

function showAcceptRejectModal(headerText, text) {
    return new Promise((resolve, reject) => {

        modalContainerBackground.classList.add('show');
        textHeader.textContent = headerText;
        textP.innerHTML = text;

        acceptButtton.addEventListener('click', e => {
            resolve(true);
            hideRejectModal()
        })
        rejectButton.addEventListener('click', e => {
            hideRejectModal();
        })

    })
}

let hideRejectModal = () => modalContainerBackground.classList.remove('show');

function showAlertBanner(type, message) {

    alertBanner.classList.remove('show');

    setTimeout(() => {
        iconContent.textContent = '';
    
        if (alertBanner.classList.contains('danger')) alertBanner.classList.remove('danger');
        if (alertBanner.classList.contains('warning')) alertBanner.classList.remove('warning');
        if (alertBanner.classList.contains('success')) alertBanner.classList.remove('success');
    
        messageContent.textContent = '';
    
        switch (type) {
            case 'danger':
                alertBanner.classList.add('danger');
                iconContent.insertAdjacentHTML('afterbegin','<i class="fa-solid fa-circle-xmark"></i>');
                break;
            case 'warning':
                alertBanner.classList.add('warning');
                iconContent.insertAdjacentHTML('afterbegin','<i class="fa-solid fa-circle-exclamation"></i>');
                break;
            case 'success':
                alertBanner.classList.add('success');
                iconContent.insertAdjacentHTML('afterbegin','<i class="fa-solid fa-circle-check"></i>');
                break;
        }
    
        messageContent.textContent = message;
        
    }, 300);

    setTimeout(() => {
        alertBanner.classList.add('show');
    }, 400);
}

let hideAlertBanner = () => alertBanner.classList.remove('show');

let validateInput = (context) => {
    
    let isEmpty = false;

    context.querySelectorAll('.required').forEach(input=>{
        if(input.value == "" 
        || input.value == 0){
            input.classList.add('danger');
            isEmpty = true;
        }
    })
  
    return isEmpty;
}

let removeDangerAlert = (input) => input.classList.remove('danger')

let removeAllDangerAlert = (context) => {

    context.querySelectorAll('.danger').forEach(input=>{
        input.classList.remove('danger')
    })
  
}

let showModal = (modal) => modal.classList.add('show');

let hideModal = (modal) => modal.classList.remove('show');

closeBanner.addEventListener('click',hideAlertBanner);