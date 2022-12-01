function loadProductsImages() {
    loaded_bkg = false; 
    loaded_frgd = false;

    bkg_img = new Image();
    frgd_img = new Image();

    bkg_img.src = '../resources/products/' + Items[getItem()].image_src;
    frgd_img.src = '../resources/products/contours/' + Items[getItem()].contour_src;

    bkg_img.onload =  () => {
        loaded_bkg=true;
        drawImages();
    }

    frgd_img.onload = () => {
        loaded_frgd=true;
        drawImages();
    }
}

function loadTextures() {
    loaded_clay = false;
    loaded_wood = false;

    wood_texture = new Image();
    clay_texture = new Image();

    wood_texture.src = '../resources/textures/wood.jpg';
    clay_texture.src = '../resources/textures/clay.jpg';

    wood_texture.onload =  () => {
        loaded_wood=true;
        drawImages();
    }

    clay_texture.onload = () => {
        loaded_clay=true;
        drawImages();
    }

} 
function drawImages() {
    if (loaded_bkg && loaded_frgd &&loaded_clay && loaded_wood) {
        let filters = getFormResults();
        //console.log(filters);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(bkg_img, 0.05*canvas.width, 0.05*canvas.height, 0.9*canvas.width, 0.9*canvas.height);

        context.fillStyle = filters['color'].value + '44';

        switch (filters['material'].id) {
            case ('wood'):
                context.drawImage(wood_texture, 0.05*canvas.width, 0.05*canvas.height, 0.9*canvas.width, 0.9*canvas.height);
                break;
            case ('clay'):
                context.drawImage(clay_texture, 0.05*canvas.width, 0.05*canvas.height, 0.9*canvas.width, 0.9*canvas.height);
                break;
        }

        context.fillRect(0.05*canvas.width, 0.05*canvas.height, 0.9*canvas.width, 0.9*canvas.height);
        context.drawImage(frgd_img, 0.05*canvas.width, 0.05*canvas.height, 0.9*canvas.width, 0.9*canvas.height);
    }
}