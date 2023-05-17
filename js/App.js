"use strict"
// * -----------------------------
// * The principal body of the proyect.
// * -----------------------------
const canvas = document.querySelector('#screen');
/**
 * @type {CanvasRenderingContext2D} ctx
 * @see ctx - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D  canvasWidth
 */
const ctx =  canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();
/**
 * @type {number} canvasWidth
 */
const canvasWidth = canvas.width;
/**
 * @type {number} canvasHeight
 */
const canvasHeight = canvas.height;
const scale = 1;
const startColor = 'white';
let toolsColor = 'black';
let toolsWidth = '1'; 
let isDrawing = false;
let restoreArray = [];
let index = -1;
let myPen = null;
let myImage = null;
let imageWithFilter = null;
let btnGraffittiClick = false;
let btnPencilClick = false;
let btnDeleteClick = false;

// * -----------------------------
// * Buttons.
// * -----------------------------

const pencilRange = document.getElementById('pencilRange');
const btnPencil = document.getElementById('btn-pencil');
const btnPaint = document.getElementById('btn-paint');
const btnGraffitti = document.getElementById('btn-grafitti');
const btnEraser = document.getElementById('btn-eraser');
const btnSave = document.getElementById('btn-save');
const btnUndoLast = document.getElementById('btn-undo-last');
const btnClear = document.getElementById('btn-clear');
const uploadPhoto = document.getElementById('upload-photo');
const btnFilterNegative = document.getElementById('btn-filter-negative');
const btnFilterSepia = document.getElementById('btn-filter-sepia');
const btnFilterBrightness = document.getElementById('btn-filter-brightness');
const btnFilterBinarization= document.getElementById('btn-filter-binarization');
const btnFilterEdgeDetection = document.getElementById('btn-edge-detection');
const btnFilterBlur = document.getElementById('btn-filter-blur');
const btnFilterFocus = document.getElementById('btn-filter-focus');
const btnFilterSharpening= document.getElementById('btn-filter-sharpening');
const btnFilterProfiling = document.getElementById('btn-filter-profiling');
const btnFilterSaturation = document.getElementById('btn-filter-saturation');

// * -----------------------------
// * Constants defining functions
// * -----------------------------

/** 
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description define a function that sets the value of the variable 'btnPencilClick' to true 
    * and the value of the variable 'btnGraffitiClick' to false, to 'activate' the pencil stroke.
 */
const handlePencilClick = () => {
    btnPencilClick = true;
    btnGraffittiClick = false;
}

/** 
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description  define a function that sets the value of the variable 'btnGraffitiClick' to true 
    * and the value of the variable 'btnPencilClick' to false, to 'activate' the pencil stroke.
 */
const handleGraffittiClick = () => {
    btnGraffittiClick = true;
    btnPencilClick = false;
};

/** 
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description defines a function that changes the color of the pencil stroke to white,
    *to draw in white and give the sensation of erasing 
 */
const handleDeleteClick = () => {
    btnPencilClick = true;
    toolsColor = startColor;
};

/** 
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description defines a function in charge of changing the width of a tool
 */
const changeWidthPencil = (width) =>{
    toolsWidth = width;
}

// * -----------------------------
// * Behaviour of the mouse.
// * -----------------------------

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    myPen = new Pen(e.offsetX ,e.offsetY,toolsColor,ctx,toolsWidth);
})

canvas.addEventListener('mouseup', (e) => {
    isDrawing = false;
    myPen = null;
    restoreArray.push(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
    index++;
})

canvas.addEventListener('mousemove', (e) => {
    if(isDrawing){
        myPen.moveTo(e.offsetX,e.offsetY);
        if(btnPencilClick){
            myPen.draw();
        }else if(btnGraffittiClick){
            myPen.drawGraffiti();
        }
    }
})

// * --------------------------------------------------
// * Behaviour of the buttons.
// * -------------------------------------------------

// *Pressed the button [add image]
uploadPhoto.addEventListener('change', (e) => {
    let route = URL.createObjectURL(e.target.files[0]);
    myImage = null;
    myPen = null;
    myImage = new Imagen(canvas, canvasWidth, canvasHeight, route, ctx);
});

//* Pressed the button [Clean Sheet]
addButtonClickEvent(btnClear,clearCanvas);

//* Pressed the button [Pencil]
addButtonClickEvent(btnPencil,handlePencilClick);

//* Pressed the button [Paint]
addButtonClickEvent(btnPaint,paintCanvas);

//* Pressed the button [grafitti]
addButtonClickEvent(btnGraffitti,handleGraffittiClick);

//* Pressed the button [Eraser]
addButtonClickEvent(btnEraser,handleDeleteClick);

//* Pressed the button [Save]
addButtonClickEvent(btnSave,exportAsImage);

//* Pressed the button [Delete the last stroke]
addButtonClickEvent(btnUndoLast,deleteLastStroke);

//* Pressed the button [Saturation filter]
addButtonClickEvent(btnFilterSaturation, () => {
    imageWithFilter = myImage;
    imageWithFilter.applyFilterSaturation();});

//* Pressed the button [Negative filter]
addButtonClickEvent(btnFilterNegative, () => {
    imageWithFilter = myImage;
    imageWithFilter.applyNegativeFilter();});

//* Pressed the button [Sepia]
addButtonClickEvent(btnFilterSepia, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applySepiaFilter();});

//* Pressed the button [Brightness]
addButtonClickEvent(btnFilterBrightness, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyBrightness();});

//* Pressed the button [Binarizacion]
addButtonClickEvent(btnFilterBinarization, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyBinarizationFilter();});

//* Pressed the button [Edge detection]
addButtonClickEvent(btnFilterEdgeDetection, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterEdgeDetection();});

//* Pressed the button [Blur]
addButtonClickEvent(btnFilterBlur, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterBlur();});

//* Pressed the button [Focus]
addButtonClickEvent(btnFilterFocus, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterFocus();});

//* Pressed the button [Sharpening]
addButtonClickEvent(btnFilterSharpening , () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterSharpening();});

//* Pressed the button [Profiling]
addButtonClickEvent(btnFilterProfiling, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterProfiling();});

// * -----------------------------
// * Behaviour of the functions.
// * -----------------------------

/**
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description This is a generic function to add a click event to the filter buttons.
 * @param {HTMLElement} button 
 * @param {ArrowFunction}  function x This is anonymous function 
 */
function addButtonClickEvent(button, functionX ){
        button.addEventListener('click', functionX);
}

/**
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description Function in charge of filling the canvas with the color that the user wants.
 */
function paintCanvas() {        
        if(toolsColor == startColor) {
            toolsColor = 'black';
        }
        ctx.fillStyle = toolsColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description Function in charge of deleting the last trace made .
 */
function deleteLastStroke(){
    //*If there is only one, call the clear canvas function
    if(index <= 0){
        clearCanvas();
    }else{
        index--;
        restoreArray.pop();
        ctx.putImageData(restoreArray[index],0,0); //* We restore the image from the last position.
    }
}

/**
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description Function in charge of exporting an image of a canvas element in png format.
 */
function exportAsImage() {
    let link = document.createElement('a');
    link.download = "paint.png";//* File name.
    link.href = canvas.toDataURL(); //* Image url.
    link.click();
}

/**
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description This function is responsible for erasing everything that has been drawn on the canvas.
 */
function clearCanvas(){
    ctx.fillStyle = startColor;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    restoreArray = [];
    index = -1;
}

/**
 * @author Lautaro Gallo https://github.com/lautarovg02
 * @description This function is responsible for changing the color of a tool.
 */
function changeColorPencil(element){
    let newColor = element.dataset.color;
    toolsColor = newColor;
}

// * -----------------------------
// * The principal entrance of the project.
// * -----------------------------

function main(){
    ctx.fillStyle = startColor;
    ctx.fillRect(0,0, canvasWidth, canvasHeight);
}
