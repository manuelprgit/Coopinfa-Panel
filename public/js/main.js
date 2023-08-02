window.BaseUrl = 'http://localhost:3000/';

let modalContainerBackground = document.getElementById('modalContainerBackground');
let modalContent = document.getElementById('modalContent');
let textHeader = document.getElementById('textHeader');
let textP = document.getElementById('textP');
let acceptButtton = document.getElementById('acceptButtton');
let rejectButton = document.getElementById('rejectButton');

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

var hideRejectModal = () => {
    modalContainerBackground.classList.remove('show');
}