window.BaseUrl = 'http://localhost:3000/';

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

var hideRejectModal = () => modalContainerBackground.classList.remove('show');

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

closeBanner.addEventListener('click',hideAlertBanner)