(async () => {
    let idMember = document.getElementById('idMember');
    let name = document.getElementById('name');
    let lastname = document.getElementById('lastname');
    let cedula = document.getElementById('cedula');
    let email = document.getElementById('email');
    let selectConsejo = document.getElementById('selectConsejo');
    let position = document.getElementById('position');
    let context = document.getElementById('context');
    let tdobyMembers = document.getElementById('tdobyMembers');
    let modalMembers = document.getElementById('modalMembers');

    let btnSearchMembers = document.getElementById('btnSearchMembers');
    let btnClearAll = document.getElementById('btnClearAll');
    let btnSaveArticle = document.getElementById('btnSaveArticle');

    let isEditing = false;

    let URL = `${BaseUrl}api/employee/`;

    let URLCouncil = `${BaseUrl}api/councilType/`;

    let getCouncilsMembers;
    try {
        getCouncilsMembers = await fetch(URL)
        .then(res=>{
            if(res.status >= 400) throw new Error(`Error al traer integrantes del consejo, Error ${res.status}`);
            return res.json();
        }) 
        .catch(err=>{
            console.log(err)
        })
        
    } catch (error) {
        showAlertBanner('danger', error)
    } 

    let getCouncils;
    try {
        getCouncils = await fetch(URLCouncil)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al traer los tipos de consejo, Error ${res.status}`);
                return res.json();
            })
            .catch(err => {
                throw err
            })

    } catch (error) {
        showAlertBanner('danger', error)
    }   

    let fillTableCouncilMembers = (members) => {
        let fragment = document.createDocumentFragment();
        for(let key in members){
            let member = members[key];
            let tr = document.createElement('div');
            tr.classList.add('tr');
            tr.setAttribute('data-key', key);
            let td = `
                <div class="td text-center">${member.employeeId}</div>
                <div class="td">${member.name}</div>
                <div class="td">${member.lastName}</div>
                <div class="td">${member.id}</div>
                <div class="td">${member.position}</div>
            `
            tr.insertAdjacentHTML('afterbegin',td);
            fragment.append(tr);
        }
        tdobyMembers.append(fragment);
    }
    fillTableCouncilMembers(getCouncilsMembers);

    let fillSelectCouncil = (councils) => {
        let fragment = document.createDocumentFragment();
        for (let council of councils) {

            let option = document.createElement('option');
            option.value = council.councilTypeId;
            option.innerText = council.description;
            fragment.append(option);
        }
        selectConsejo.append(fragment);
    }
    fillSelectCouncil(getCouncils);

    let getDataForRequest = () => {

        return {
            councilTypeId: selectConsejo.value,
            name: name.value,
            lastName: lastname.value,
            id: cedula.value,
            email: email.value,
            position: position.value
        }
    }

    let setInputValues = (member) => {
        
        idMember.value = member.employeeId;
        name.value = member.name;
        lastname.value = member.lastName;
        cedula.value = member.id;
        email.value = member.email;
        selectConsejo.value = member.councilTypeId;
        position.value = member.position;

        hideModal(modalMembers);
      
    }

    let clearAllInputs = () => {

        idMember.value = "";
        name.value = "";
        lastname.value = "";
        cedula.value = "";
        email.value = "";
        selectConsejo.value = 0;
        position.value = "";

    }

    let requestUsingFetch = async (method, data) => {

        try {
            return await fetch((method == 'PUT') ? URL + memberId : URL, {
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

    context.addEventListener('change', e => {

        if (e.target.classList.contains('danger')) {
            removeDangerAlert(e.target);
        }

    })

    btnSaveArticle.addEventListener('click', async e => {

        let wasEmpty = validateInput(context);

        if (wasEmpty) {
            showAlertBanner('warning', 'Faltan parametros')
            return;
        }

        let obj = getDataForRequest();

        if (isEditing) {
            let result = await requestUsingFetch('PUT', obj);

        } else {
            let result = await requestUsingFetch('POST', obj);

            console.log(result);
        }



    })

    tableCategory.addEventListener('click',e=>{
        if(e.target.closest('.tr')){
            let key = e.target.closest('.tr').getAttribute('data-key'); 
            setInputValues(getCouncilsMembers[key]) 
        }
    })

    btnSearchMembers.addEventListener('click',e=>{
        showModal(modalMembers)
    })

    closeModal.addEventListener('click',e=>{
        hideModal(modalMembers)
    })

    btnClearAll.addEventListener('click',clearAllInputs);

})()