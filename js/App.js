"use strict"
// * -----------------------------
// * Cuerpo principal del proyecto
// * -----------------------------

const canvas = document.querySelector('#screen');
let ctx =  canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();
let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

// let canvasHelper = new CanvasHelper();

let isDrawing = false;

let restoreArray = [];
let index = -1;

let startColor = 'white';
let toolsColor  = 'black';
let toolsWidth = '1'; 

let myPen = null;
let myImage = null;

let btnGraffittiClick = false;
let btnPencilClick = false;
let btnDeleteClick = false;

// * -----------------------------
// * Comportamiento del mouse
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
        if(btnPencilClick){
            myPen.moveTo(e.offsetX,e.offsetY);
            myPen.draw();
        }else if(btnGraffittiClick){
            myPen.moveTo(e.offsetX,e.offsetY);
            myPen.drawGraffiti();
        }
    }
})

// * --------------------------------------------------
// * Comportamiento de los botones
// * -------------------------------------------------

// * Presiona el boton [lapiz]
document.getElementById('btn-pencil').addEventListener('click', () =>{
    btnPencilClick = true;
    btnGraffittiClick = false;
});

// * Presiona el boton [Pintar]
document.getElementById('btn-paint').addEventListener('click', paintCanvas);

// * Presiona el boton [grafitti]
document.getElementById('btn-grafitti').addEventListener('click', () =>{
    btnGraffittiClick = true;
    btnPencilClick = false;
});

// * Presiona el boton [borrar]
document.getElementById('btn-delete').addEventListener('click', () =>{
    btnPencilClick = true;
    toolsColor = startColor;
});

// * Presiona el boton [Guardar]
document.getElementById('btn-save').addEventListener('click', exportAsImage);

// * Presiona el boton [borrar ultimo trazo]
document.getElementById('btn-undo-last').addEventListener('click', deleteLastStroke);

// * Presiona el boton [limpiar hoja]
document.getElementById('btn-clear').addEventListener('click', clearCanvas);


// * Presiona el boton [Agregar imagen]
document.getElementById('upload-photo').addEventListener('change', (e) => {
    let route = URL.createObjectURL(e.target.files[0]);
    console.log(route);
    console.log("hola");
    myImage = null;
    myImage = new Imagen(canvasWidth, canvasHeight , route, ctx);
    restoreArray.push(ctx.getImageData(0, 0, canvasWidth, canvasHeight));
    index++;
});

// * Presiona el boton [ + zoom ]
document.getElementById('btn-more-zoom').addEventListener('click', () => {zoomIn(ctx,2)});

// * Presiona el boton [ - zoom ]
document.getElementById('btn-less-zoom').addEventListener('click', () => {zoomIn(ctx,0.5)});

// * Presiona el boton [Filtro negativo]
document.getElementById('btn-filter-negative').addEventListener('click', () =>{myImage.applyNegativeFilter();})

// * Presiona el boton [Sepia]
document.getElementById('btn-filter-sepia').addEventListener('click',() => {myImage.applySepiaFilter()})

//* Presiona el boton [Brillo]
document.getElementById('btn-filter-brightness').addEventListener('click',() => {myImage.applyBrightness()})

//* Presiona el boton [Binarizacion]
document.getElementById('btn-filter-binarization').addEventListener('click',() => {myImage.applyBinarizationFilter()})

// * Presiona el boton [Deteccion de bordes]
document.getElementById('btn-edge-detection').addEventListener('click',() => {myImage.applyFilterAccordingToKernel("edgeDetection")})

//* Presiona el boton [Difuminar]
document.getElementById('btn-filter-blur').addEventListener('click',() => {myImage.applyFilterAccordingToKernel("blur");});

//* Presiona el boton [Enfocar]
document.getElementById('btn-filter-focus').addEventListener('click',() => {myImage.applyFilterAccordingToKernel("focus");});

//* Presiona el boton [Afilado]
document.getElementById('btn-filter-sharpening').addEventListener('click',() => {myImage.applyFilterAccordingToKernel("sharpening");});

//* Presiona el boton [Perfilado]
document.getElementById('btn-filter-profiling').addEventListener('click',() => {myImage.applyFilterAccordingToKernel("profiling");});

// * -----------------------------
// * Comportamiento de las funciones
// * -----------------------------

function zoomIn(ctx,zoomFactor) {
    //* Guardar el estado actual del contexto de dibujo
    ctx.save();
    //* Calcular las nuevas dimensiones del canvas después del zoom
    const newWidth = canvasWidth * zoomFactor;
    const newHeight = canvasHeight * zoomFactor;
    //* Ajustar la escala de dibujo del contexto para hacer zoom en el dibujo
    ctx.scale(zoomFactor, zoomFactor);
    //* Redibujar el dibujo en las nuevas dimensiones
    ctx.clearRect(0, 0, canvasWidth,canvasHeight);
    ctx.drawImage(canvas, 0, 0, canvasWidth, canvasHeight, 0, 0, newWidth, newHeight);
    //*Restaurar el estado del contexto de dibujo
    ctx.restore();
}

//*Funcion encargada de rellena el canvas con el color que quiera el usuario
function paintCanvas() {        
        //* Rellenamos todo el canvas con el color seleccionado en la paleta de colores
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

// *Funcion encargada de cambiar el ancho de una herramienta
function changeWidthPencil(width){
    toolsWidth = width;
}

function rgbAHex(r,g,b){
    return((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// * -----------------------------
// * Entrada principal del proyecto
// * -----------------------------

function main(){
    ctx.fillStyle = startColor;
    ctx.fillRect(0,0, canvasWidth, canvasHeight);
}
