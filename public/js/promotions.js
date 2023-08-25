(() => {
    let promotionsContent = document.getElementById('promotionsContent');
    let multipleImages = document.getElementById('multipleImages');

    let imageArray;

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

    let setImagesOnContent = (images) => {
      
        const div = document.createElement("div");
        div.classList.add("promo-img","active");
        // div.setAttribute('data-id')
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
})()