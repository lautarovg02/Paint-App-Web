"use strict";

class Imagen {
    constructor(canvas, canvasWidth, canvasHeight, route, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.img = new Image();
        this.img.src = route;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.kernel;
        this.img.onload = () => {
        this.draw();
        };
    }

    //* Metodo encargado de dibujar la imagen en el canvas.
    draw() {
        this.calculateSize();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
    }

    //* Metodo encargado de que el tamaño de la img se adapte al canvas.
    calculateSize() {
        let ratio = Math.min(
        this.canvasWidth / this.img.width,
        this.canvasHeight / this.img.height
        );
        this.width = this.img.width * ratio;
        this.height = this.img.height * ratio;
    }

    /*
    * Los metodos encargados de aplicar filtro, cuyo filtro se logra aplicar con con un determinado kernel, primero
    * setean el atributo "kernel" de la clase 'Imagen' con su nucleo determinado, y luego llamando al metodo generico "applyFilterAccordingToKernel".
     */

    applyFilterBlur(){
        this.kernel =  [ 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9];
        this.applyFilterAccordingToKernel();
    }
    applyFilterSharpening(){
        this.kernel = [0, -0.5, 0, -0.5, 3, -0.5, 0, -0.5, 0];
        this.applyFilterAccordingToKernel();
    }

    applyFilterEdgeDetection(){
        this.kernel =  [-1, -1, -1, -1, 8, -1, -1, -1, -1];
        this.applyFilterAccordingToKernel();
    }

    applyFilterFocus(){
        this.kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        this.applyFilterAccordingToKernel();
    }

    
    applyFilterProfiling(){
        this.kernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
        this.applyFilterAccordingToKernel();
    }

    //* Metodo encargado de aplicar un filtro negativo a la imagen
    applyNegativeFilter() {
        let imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight); //* getImageData =  Este método devuelve un objeto ImageData que representa los datos de píxeles de la imagen.
        let data = imageData.data;

        for (let pixel = 0; pixel < data.length; pixel += 4) { //* Recorre cada píxel de la imagen.

            //* Calculamos un nuevo valor para cada componente de color RGB utilizando la fórmula del filtro negativo.
            data[pixel] = 255 - data[pixel];
            data[pixel + 1] = 255 - data[pixel + 1];
            data[pixel + 2] = 255 - data[pixel + 2];
        
        }

        this.ctx.putImageData(imageData, 0, 0); //* Colocamos los datos de la imagen con el filtro negativo aplicado en el canvas.
    }

    //* Metodo encargado de aplicar brillo a la imagen.
    applyBrightness() {
        //* getImageData =  Este método devuelve un objeto ImageData que representa los datos de píxeles de la imagen.
        let imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        let data = imageData.data;

        //* Recorre cada píxel de la imagen.
        for (let pixel = 0; pixel < data.length; pixel += 4) {
            
            if (data[pixel] < 120) {
                data[pixel] = data[pixel] + 20; //* Red.
            }
            if (data[pixel + 1] < 120) {
                data[pixel + 1] = data[pixel + 1] + 20; //* Green.
            }
            if (data[pixel + 2] < 120) {
                data[pixel + 2] = data[pixel + 2] + 20; //* Blue.
            }

        }
        this.ctx.putImageData(imageData, 0, 0);//* Colocamos los datos de la imagen con el filtro de brillo aplicado en el canvas.
    }

    //* Metodo generico para aplicar cualquier filtro que manejemos con un kernel.
    applyFilterAccordingToKernel(){
        let imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);//* getImageData = Este método devuelve un objeto ImageData que representa los datos de píxeles de la imagen.
        let data = imageData.data;
        let filteredPixels = new Uint8ClampedArray(data.length); //* Creamos una nueva matriz de píxeles, con la misma longitud que la imagen original.
        let kernel = this.kernel;//* Convertir el objeto JSON en un objeto JavaScript.
        let kernelSize = 3; //* Tamaño del kernel.
        
        for (let y = 1; y < this.canvasHeight - 1; y++) {//* Recorremos todos los píxeles de la imagen, excepto los bordes.
            
            for (let x = 1; x < this.canvasWidth - 1; x++) {//* Recorremos sobre todos los píxeles de la fila actual, excepto los bordes.
                
                //* Índice del píxel actual.
                let pixelIndex = (y * this.canvasWidth + x) * 4; //* Calculamos el índice del píxel.
                //* Valores iniciales para los componentes de color RGB.
                let r = 0;
                let g = 0;
                let b = 0;
            
                for (let i = -1; i <= 1; i++) {//* Aplicamos la matriz de convolución al píxel actual y sus ocho vecinos.
                    
                    for (let j = -1; j <= 1; j++) {

                        let neighborIndex = ((y + i) * this.canvasWidth + (x + j)) * 4;//* Índice del píxel vecino.
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

        let filteredImageData = new ImageData(filteredPixels, this.canvasWidth, this.canvasHeight);//* Creamos una nueva imagen con los píxeles filtrados.
        this.ctx.putImageData(filteredImageData, 0, 0);//* Colocamos la img actualizada con el filtro elegido en el canvas.
    }

    //* Metodo encargado de aplicar el filtro de saturacion, modificando la intensidad de los colores en función de la saturación actual.
    applyFilterSaturation() {
        let imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight); //* getImageData = Este método devuelve un objeto ImageData que representa los datos de píxeles de la imagen.
        let data = imageData.data; 
        let saturacionAmount = 1.5; //* La cantidad de saturacion que le aplicamos a la img.

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
    
            let max = Math.max(r, g, b);//* Math.max(r, g, b) devuelve el maximo de los números dados como parámetros de entrada.
            let min = Math.min(r, g, b);//* Math.min(r, g, b) devuelve el menor de los números dados como parámetros de entrada.
            let saturation = 0;
            
            if (max !== min) {
                saturation = 0.5 * ((max + min) / 255); //*  Fórmula para calcular el valor de la saturación de cada píxel.
            }
            
            let factor = (saturacionAmount - 1) * 0.5; //* Formula para el factor de escala.
    
            //*Aplicamos un factor de escala a cada componente de color (rojo, verde y azul) para aumentar o reducir su intensidad. 
            r = r + (r - saturation * 255) * factor;
            g = g + (g - saturation * 255) * factor;
            b = b + (b - saturation * 255) * factor;
            
            //* Utilizamos max() y min() para que no se salga del rango 0 y 255
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
    
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }
    
        this.ctx.putImageData(imageData, 0, 0);//* Colocamos los datos de la imagen saturada en el canvas.
    }
    
    //*Este método utiliza la fórmula de luminosidad para calcular el brillo de cada píxel y luego binariza cada píxel en blanco o negro dependiendo de su brillo. 
    applyBinarizationFilter() {
        let imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);//* Obtener los datos de la imagen.
        let data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {//* Recorrer los píxeles de la imagen.

            let luminosity = (data[i] + data[i + 1] + data[i + 2]) / 3;//* Calcular la luminosidad del píxel.

            //* Determinamos segun la luminosidad que le set el píxel
            if (luminosity >= 128) {
                data[i] = data[i + 1] = data[i + 2] = 255; //* Si es blanco.
            } else {
                data[i] = data[i + 1] = data[i + 2] = 0; //* Si es negro.
            }

        }

        this.ctx.putImageData(imageData, 0, 0); //* Colocamos los datos de la imagen binarizada en el canvas.
    }

    //*Metodo encargado de aplicar el filtro sepia a la imagen. 
    applySepiaFilter(){
        let imageData = ctx.getImageData(0,0,this.canvasWidth,this.canvasHeight); //* getImageData =  Este método devuelve un objeto ImageData que representa los datos de píxeles de la imagen.
        let data = imageData.data;
        
        for(let pixel = 0; pixel < data.length; pixel+=4){ //*Recorre cada píxel de la imagen.
            let r = data[pixel] ;
            let g = data[pixel + 1] ;
            let b = data[pixel + 2] ;

            //*Calculamos un nuevo valor para cada componente de color RGB utilizando la fórmula del filtro sepia. 
            data[pixel] = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
            data[pixel + 1] =  Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
            data[pixel + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
        }

        this.ctx.putImageData(imageData,0,0);//*Actualizar la imagen con el filtro sepia aplicado.
    }
}
