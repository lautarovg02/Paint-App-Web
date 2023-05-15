"use strict"
// * -----------------------------
// * Cuerpo principal del proyecto.
// * -----------------------------
const canvas = document.querySelector('#screen');
const ctx =  canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();
const canvasWidth = canvas.width;
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
// * Botones.
// * -----------------------------

const pencilRange = document.getElementById('pencilRange');
const btnPencil = document.getElementById('btn-pencil');
const btnPaint = document.getElementById('btn-paint');
const btnGraffitti = document.getElementById('btn-grafitti');
const btnDelete = document.getElementById('btn-delete');
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
// * Constantes que definen funciones que se ejecutarán cuando se dispare un evento determinado.
// * -----------------------------

/* 

*La constante " handlePencilClick " define una funcion que establece el valor de la variable "btnPencilClick" en true
* y el valor de la variable "btnGraffittiClick" en false, para  "activar" el trazo de lapiz*/
const handlePencilClick = () => {
    btnPencilClick = true;
    btnGraffittiClick = false;
}
/* 
*La constante " handleGraffittiClick " define una funcion que hace a la inversa lo que hace la funcion "handlePencilClick".
*En vez de "activar" el trazo de lapiz, activa el de graffiti */
const handleGraffittiClick = () => {
    btnGraffittiClick = true;
    btnPencilClick = false;
};
/*
*La constante "handleDeleteClick" define una funcion que cambia el color del trazo del Lapiz a blanco,
*para dibujar en blanco y dar la sensacion de borrar*/
const handleDeleteClick = () => {
    btnPencilClick = true;
    toolsColor = startColor;
};

//*La constante "changeWidthPencil" define una funcion encargada de cambiar el ancho de una herramienta
const changeWidthPencil = (width) =>{
    toolsWidth = width;
}

// * -----------------------------
// * Comportamiento del mouse.
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
// * Comportamiento de los botones.
// * -------------------------------------------------

// * Presiona el boton [Agregar imagen]
uploadPhoto.addEventListener('change', (e) => {
    let route = URL.createObjectURL(e.target.files[0]);
    myImage = null;
    myPen = null;
    myImage = new Imagen(canvas, canvasWidth, canvasHeight, route, ctx);
});

// * Presiona el boton [Limpiar Hoja]
addButtonClickEvent(btnClear,clearCanvas);

// * Presiona el boton [lapiz]
addButtonClickEvent(btnPencil,handlePencilClick);

// * Presiona el boton [Pintar]
addButtonClickEvent(btnPaint,paintCanvas);

// * Presiona el boton [grafitti]
addButtonClickEvent(btnGraffitti,handleGraffittiClick);

// * Presiona el boton [borrar]
addButtonClickEvent(btnDelete,handleDeleteClick);

// * Presiona el boton [Guardar]
addButtonClickEvent(btnSave,exportAsImage);

// * Presiona el boton [borrar ultimo trazo]
addButtonClickEvent(btnUndoLast,deleteLastStroke);

// * Presiona el boton [Filtro saturation]
addButtonClickEvent(btnFilterSaturation, () => {
    imageWithFilter = myImage;
    imageWithFilter.applyFilterSaturation();});

// * Presiona el boton [Filtro negativo]
addButtonClickEvent(btnFilterNegative, () => {
    imageWithFilter = myImage;
    imageWithFilter.applyNegativeFilter();});

// * Presiona el boton [Sepia]
addButtonClickEvent(btnFilterSepia, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applySepiaFilter();});

//* Presiona el boton [Brillo]
addButtonClickEvent(btnFilterBrightness, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyBrightness();});

//* Presiona el boton [Binarizacion]
addButtonClickEvent(btnFilterBinarization, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyBinarizationFilter();});

// * Presiona el boton [Deteccion de bordes]
addButtonClickEvent(btnFilterEdgeDetection, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterEdgeDetection();});

//* Presiona el boton [Difuminar]
addButtonClickEvent(btnFilterBlur, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterBlur();});

//* Presiona el boton [Enfocar]
addButtonClickEvent(btnFilterFocus, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterFocus();});

//* Presiona el boton [Afilado]
addButtonClickEvent(btnFilterSharpening , () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterSharpening();});

//* Presiona el boton [Perfilado]
addButtonClickEvent(btnFilterProfiling, () => { 
    imageWithFilter = myImage;
    imageWithFilter.applyFilterProfiling();});

// * -----------------------------
// * Comportamiento de las funciones.
// * -----------------------------

//*Esta es una función genérica para agregar un evento de clic a los botones de filtro
function addButtonClickEvent(button, functionX ){
        button.addEventListener('click', functionX);
}
//*Funcion encargada de rellena el canvas con el color que quiera el usuario
function paintCanvas() {        
        //* Rellenamos todo el canvas con el color seleccionado en la paleta de colores
        if(toolsColor == startColor) {
            toolsColor = 'black';
        }
        ctx.fillStyle = toolsColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//*Funcion encargda de eliminar el ultimo trazo realizado 
function deleteLastStroke(){
    //* Si solamente hay uno, llama a la funcion limpiar canvas
    if(index <= 0){
        clearCanvas();
    }else{
        //*Si hay mas de uno
        index--;//*Decrece en uno el index
        restoreArray.pop(); //* Removemos el ultimo elemento del array 
        ctx.putImageData(restoreArray[index],0,0); //* Restauramos la imagen desde la ultima posicion
    }
}

//*función encargada de exportar una imagen de un elemento canvas en formato PNG.
function exportAsImage() {
    //* creamos un elemento "a" utilizando document.createElement('a'). Este elemento se usará para descargar la imagen.
    let link = document.createElement('a');
    link.download = "paint.png";//* establecemos el nombre del archivo de la imagen 
    link.href = canvas.toDataURL(); //*establecemos la URL de la imagen utilizando la función 
    link.click();//*Por ultimo,se activa la descarga de la imagen haciendo clic en el elemento "a" utilizando link.click()
}

//*Esta funcion se encarga de borrar todo lo que se ah dibujado en el canvas
function clearCanvas(){
    ctx.fillStyle = startColor;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);//* Limpia el canvas borrando todo el contenido del canvas
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);//* Vuelve a dibujar el fondo del canvas con el color de relleno actual.
    restoreArray = [];//* Reiniciamos el arreglo restoreArray a un arreglo vacío. Este arreglo se utiliza para almacenar el estado del canvas antes de cada cambio, lo que permite al usuario deshacer las acciones anteriores.
    index = -1; //* Establece el índice actual en -1, lo que indica que no se ha guardado ningún estado en el arreglo restoreArray.
}

// * Funcion encargada de cambiar el color de una herramienta
function changeColorPencil(element){
    //*Este atributo data-color contiene un valor de color hexadecimal 
    //* luego establece la variable toolsColor en el valor del atributo data-color 
    let newColor = element.dataset.color;
    toolsColor = newColor;
}

// * -----------------------------
// * Entrada principal del proyecto.
// * -----------------------------

function main(){
    ctx.fillStyle = startColor;
    ctx.fillRect(0,0, canvasWidth, canvasHeight);
}
