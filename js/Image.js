"use strict";

class Imagen {
    constructor(canvasWidth, canvasHeight, route, ctx) {
        this.ctx = ctx;
        this.img = new Image();
        this.img.src = route;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.kernel;
        this.filters = {
            edgeDetection: { kernel : [-1, -1, -1, -1, 8, -1, -1, -1, -1]},
            blur: { kernel : [ 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]},
            sharpening : { kernel : [0, -0.5, 0, -0.5, 3, -0.5, 0, -0.5, 0]},
            focus : { kernel : [0, -1, 0, -1, 5, -1, 0, -1, 0]},
            profiling : { kernel : [-1, -1, -1, -1, 9, -1, -1, -1, -1]},
        };
        this.img.onload = () => {
        this.draw();
        };
    }

    

    draw() {
        this.calculateSize();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
    }

    calculateSize() {
        let ratio = Math.min(
        this.canvasWidth / this.img.width,
        this.canvasHeight / this.img.height
        );
        this.width = this.img.width * ratio;
        this.height = this.img.height * ratio;
    }

  //*metodo encargado de aplicar un filtro negativo a la imagen
    applyNegativeFilter() {
        //* getImageData =  Este método devuelve un objeto ImageData que representa los datos de píxeles de la imagen.
        let imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        let data = imageData.data;
        //*recorre cada píxel de la imagen
        for (let pixel = 0; pixel < data.length; pixel += 4) {
            //*calculamos un nuevo valor para cada componente de color RGB utilizando la fórmula del filtro negativo.
            data[pixel] = 255 - data[pixel];
            data[pixel + 1] = 255 - data[pixel + 1];
            data[pixel + 2] = 255 - data[pixel + 2];
        }

        ctx.putImageData(imageData, 0, 0);
    }

  //*metodo encargado de aplicar brillo a la imagen
    applyBrightness() {
        //* getImageData =  Este método devuelve un objeto ImageData que representa los datos de píxeles de la imagen.
        let imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        let data = imageData.data;

        //*recorre cada píxel de la imagen
        for (let pixel = 0; pixel < data.length; pixel += 4) {
            if (data[pixel] < 120) {
                data[pixel] = data[pixel] + 20; //red
            }
            if (data[pixel + 1] < 120) {
                data[pixel + 1] = data[pixel + 1] + 20; //green
            }
            if (data[pixel + 2] < 120) {
                data[pixel + 2] = data[pixel + 2] + 20; //blue
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    applyFilterAccordingToKernel(kernelFilter){
        //* getImageData = Este método devuelve un objeto ImageData que representa los datos de píxeles de la imagen.
        let imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        let data = imageData.data;
        //* Creamos una nueva matriz de píxeles, con la misma longitud que la imagen original.
        let filteredPixels = new Uint8ClampedArray(data.length);
        //* Convertir el objeto JSON en un objeto JavaScript
        let objFilters = JSON.parse(JSON.stringify(this.filters));       
        //* Matriz de convolución que se utiliza para la detección de bordes.
        let kernel = objFilters[kernelFilter].kernel;//* Obtener la matriz correspondiente al nombre del objeto
        let kernelSize = 3; //* tamaño del kernel.
        for (let y = 1; y < this.canvasHeight - 1; y++) {//* recorremos todos los píxeles de la imagen, excepto los bordes.
            for (let x = 1; x < this.canvasWidth - 1; x++) {//*recorremos sobre todos los píxeles de la fila actual, excepto los bordes.
                //* Índice del píxel actual.
                let pixelIndex = (y * this.canvasWidth + x) * 4; //*calculamos el índice del píxel 
                //* Valores iniciales para los componentes de color RGB.
                let r = 0;
                let g = 0;
                let b = 0;
                //* Aplicamos la matriz de convolución al píxel actual y sus ocho vecinos.
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        //* Índice del píxel vecino.
                        let neighborIndex = ((y + i) * this.canvasWidth + (x + j)) * 4;
                        //* Valores de la matriz de convolución y componentes de color del píxel vecino.
                        let kernelValue = kernel[(i + 1) * kernelSize + (j + 1)];
                        let neighborR = data[neighborIndex];
                        let neighborG = data[neighborIndex + 1];
                        let neighborB = data[neighborIndex + 2];
                        //* Sumamos el producto de la matriz de convolución y los componentes de color del píxel vecino.
                        r += kernelValue * neighborR;
                        g += kernelValue * neighborG;
                        b += kernelValue * neighborB;
                    }
                }
                //* Asignamos los valores finales para los componentes de color RGB al píxel filtrado.
                filteredPixels[pixelIndex] = r;
                filteredPixels[pixelIndex + 1] = g;
                filteredPixels[pixelIndex + 2] = b;
                filteredPixels[pixelIndex + 3] = 255; //* Valor fijo para el componente alfa.
                }
        }
        //* Creamos una nueva imagen con los píxeles filtrados.
        let filteredImageData = new ImageData(filteredPixels, this.canvasWidth, this.canvasHeight);
        this.ctx.putImageData(filteredImageData, 0, 0);
    }

    
    //*Este método utiliza la fórmula de luminosidad para calcular el brillo de cada píxel y luego binariza cada píxel en blanco o negro dependiendo de su brillo. 
    applyBinarizationFilter() {
        //* Obtener los datos de la imagen
        let imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        let data = imageData.data;
        //* Recorrer los píxeles de la imagen
        for (let i = 0; i < data.length; i += 4) {
          //* Calcular la luminosidad del píxel
            let luminosity = (data[i] + data[i + 1] + data[i + 2]) / 3; 
            //* Binarizar el píxel
            if (luminosity >= 128) {
                data[i] = data[i + 1] = data[i + 2] = 255; // Si es blanco
            } else {
                data[i] = data[i + 1] = data[i + 2] = 0; //Si es negro
            }
        }
        //* Colocar los datos de la imagen binarizada en el canvas
        this.ctx.putImageData(imageData, 0, 0);
    }

    //*metodo encargado  de aplicar el filtro sepia  a la imagen 
    applySepiaFilter(){
        //* getImageData =  Este método devuelve un objeto ImageData que representa los datos de píxeles de la imagen.
        let imageData = ctx.getImageData(0,0,this.canvasWidth,this.canvasHeight);
        let data = imageData.data;
        //*recorre cada píxel de la imagen 
        for(let pixel = 0; pixel < data.length; pixel+=4){
            const r = data[pixel] ;
            const g = data[pixel + 1] ;
            const b = data[pixel + 2] ;
            //*calculamos un nuevo valor para cada componente de color RGB utilizando la fórmula del filtro sepia. 
            data[pixel] = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
            data[pixel + 1] =  Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
            data[pixel + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
        }
        this.ctx.putImageData(imageData,0,0);
    }
}
