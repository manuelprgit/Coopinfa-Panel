(async () => {
    loaderControler.enable();
    let promotionsContent = document.getElementById('promotionsContent');
    let multipleImages = document.getElementById('multipleImages');
    let btnSavePromotion = document.getElementById('btnSavePromotion');

    let imageArray = [];

    const BASEURL = `${BaseUrl}api/promotions`;

    let setImagesOnContentByResponse = async (image) => {

        try {
            await fetch(`${BaseUrl}api/news/image/${image.documentName}`)
                .then(res => {
                    if (res.status >= 400) {
                        throw new Error(`Error al hacer la petición, Error ${res.status}`);
                    }
                    return res;
                }).then(res => {
                    setImagesOnContent(res.url, image.id);
                })
                .catch(err => {
                    throw err;
                })

        } catch (error) {
            showAlertBanner('danger', error);
        }
    }
    let getAllImages;
    try {
        getAllImages = await fetch(BASEURL)
            .then(res => {
                if (res.status >= 400) throw new Error(`Error al hacer la petición, Error ${res.status}`);
                return res.json();
            })
            .then(res => {
                for (let image of res) {
                    setImagesOnContentByResponse(image);
                }
                return res;
            })
            .catch(err => {
                console.log(err)
            })
    } catch (error) {
        console.log(error);
    }

    let setActiveCotent = (wasChecked, imgContent) => {

        let input = imgContent.querySelector('input[type="checkbox"]');

        if (wasChecked) {
            imgContent.classList.remove('active');
            input.checked = false;
        } else {
            imgContent.classList.add('active');
            input.checked = true;
        }
    }

    let getDataForRequest = () => {

        let formData = new FormData();

        if (imageArray.length > 0) {
            for (let i = 0; i < imageArray.length; i++) {
                formData.append("images", imageArray[i]);
            }
        }

        let imagesist = [];

        promotionsContent
            .querySelectorAll('[data-id]')
            .forEach((images) => {
                let inputChk = images.querySelector('input');
                if (inputChk.checked) {
                    imagesist.push(Number(images.getAttribute('data-id')));
                }
            })
        formData.append("keepImages[]", imagesist);
        console.log(formData);
        return formData;

    }

    let requestUsingFetch = async (method, data) => {

        try {
            await fetch(BASEURL, {
                method: method,
                body: data
            })
                .then(res => {
                    if (res.status >= 400) {
                        throw new Error(`Error al hacer ${method}, Error ${res.status}`)
                    };
                    return res.json();
                    // loaderControler.disable();
                    // return res;
                })
                .then(res => {
                    debugger;
                    console.log(res);
                })
                .catch(err => {
                    throw err;
                })
        } catch (error) {
            showAlertBanner('danger', error);
        }
    }

    let setImagesOnContent = (images, id) => {

        let div = document.createElement("div");
        div.classList.add("promo-img", "active");
        if (id) {

            let imageName = getAllImages.find(imagenes => {
                return imagenes.id == id;
            })
            console.log(imageName);
            div.setAttribute('data-id', id);
            div.setAttribute('data-idImange', imageName.documentName)
        };

        const image = `
            <div class="check-content">
                <input type="checkbox" checked>
            </div>
            <figure>
                <img src="${images}" alt="">
            </figure>
        `;

        div.insertAdjacentHTML("afterbegin", image);
        promotionsContent.insertAdjacentElement("beforeend", div);

    }

    promotionsContent.addEventListener('click', e => {

        if (e.target.closest('.promo-img')) {

            let imgContent = e.target.closest('.promo-img');

            (imgContent.classList.contains('active'))
                ? setActiveCotent(true, imgContent)
                : setActiveCotent(false, imgContent);

        }

    });

    multipleImages.addEventListener("change", function (e) {

        const selectedImages = e.target.files;
        imageArray = Array.from(selectedImages);

        for (const imgRoot of selectedImages) {
            const fileR = new FileReader();

            fileR.readAsDataURL(imgRoot);

            fileR.addEventListener("load", function (e) {
                setImagesOnContent(e.target.result);
            });
        }

    });

    btnSavePromotion.addEventListener('click', async e => {
        let dataImages = getDataForRequest();
        console.log(dataImages);
        let result = await requestUsingFetch('POST', dataImages);
        console.log(result);

    })
    loaderControler.disable();
})()