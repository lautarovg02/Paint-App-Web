"use strict";

class Imagen {

    /**
     * @constructor
     * @param {HTMLElement} canvas 
     * @param {number} canvasWidth 
     * @param {number} canvasHeight 
     * @param {String} route 
     * @param {CanvasRenderingContext2D} ctx
     * @see ctx - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D 
     */
    constructor(canvas, canvasWidth, canvasHeight, route, ctx) {
        /**
         * @type canvas - {HTMLElement} 
         * */
        this.canvas = canvas;
        /**
         * @type ctx - {CanvasRenderingContext2D}
         */
        this.ctx = ctx;
        /**
         * @type img - {Image}
         */
        this.img = new Image();
        this.img.src = route;
        /**
         * @type canvasWidth -  {number}
         */
        this.canvasWidth = canvasWidth;
        /**
         * @type canvasHeight - {number}
         */
        this.canvasHeight = canvasHeight;
        /**
         * @type kernel - {array}
         */
        this.kernel;
        this.img.onload = () => {
        this.draw();
        };
    }

    /**
     *@autor Lautaro Gallo https://github.com/lautarovg02
     *@description Method in charge of drawing the image of the canvas.
     */
    draw() {
        this.calculateSize();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
    }

    /**
     * @autor Lautaro Gallo https://github.com/lautarovg02
     * @description This method perfoms a calculation to determine the size of an image relative to the dimensions of the
        * canvas on which it is to be displayed
     */
    calculateSize() {
        /*
        *We calculate the minimum aspect ratio to ensure that the image fits completely within the
        *canvas without distorting its original aspect ratio.*/
        let ratio = Math.min(
        this.canvasWidth / this.img.width,
        this.canvasHeight / this.img.height
        );
        this.width = this.img.width * ratio;
        this.height = this.img.height * ratio;
    }

    /**
     * @autor Lautaro Gallo https://github.com/lautarovg02
     * @description This method instantiates the attribute of the class with the corresponding array for the blur filter  
     */
    applyFilterBlur(){
        this.kernel =  [ 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9];
        this.applyFilterAccordingToKernel();
    }

    /**
     * @autor Lautaro Gallo https://github.com/lautarovg02
     * @description This method instantiates the attribute of the class with the corresponding array for the sharpening filter  
     */
    applyFilterSharpening(){
        this.kernel = [0, -0.5, 0, -0.5, 3, -0.5, 0, -0.5, 0];
        this.applyFilterAccordingToKernel();
    }

    /**
     * @autor Lautaro Gallo https://github.com/lautarovg02
     * @description This method instantiates the attribute of the class with the corresponding array for the edge detection filter  
     */
    applyFilterEdgeDetection(){
        this.kernel =  [-1, -1, -1, -1, 8, -1, -1, -1, -1];
        this.applyFilterAccordingToKernel();
    }

    /**
     * @autor Lautaro Gallo https://github.com/lautarovg02
     * @description This method instantiates the attribute of the class with the corresponding array for the focus filter  
     */
    applyFilterFocus(){
        this.kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
        this.applyFilterAccordingToKernel();
    }

    /**
     * @autor Lautaro Gallo https://github.com/lautarovg02
     * @description This method instantiates the attribute of the class with the corresponding array for the profiling filter  
     */
    applyFilterProfiling(){
        this.kernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
        this.applyFilterAccordingToKernel();
    }

    /**
     * @autor Lautaro Gallo https://github.com/lautarovg02
     * @description Method in charge of appplying a negative filter to the image.
     */
    applyNegativeFilter() {
        let imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        let data = imageData.data;

        for (let pixel = 0; pixel < data.length; pixel += 4) { //* Walk through each pixel of the image.

            //* We calculate a new value for each RGB color component using the negative filter formula.
            data[pixel] = 255 - data[pixel];
            data[pixel + 1] = 255 - data[pixel + 1];
            data[pixel + 2] = 255 - data[pixel + 2];
        
        }

        this.ctx.putImageData(imageData, 0, 0);//* We place the datas of the image with the negative filter on canvas.
    }

    /**
     * @autor Lautaro Gallo https://github.com/lautarovg02
     * @description Method in charge of applying teh brightnees of the image
     * @type {Uint8ClampedArray} data - stores the pixel data of an image in RGBA (red, green, blue, and alpha) format in a one-dimensional array.
     */
    applyBrightness() {
        let imageData = ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        let data = imageData.data;

        for (let pixel = 0; pixel < data.length; pixel += 4) {//* Walk through each pixel of the image.            
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
        this.ctx.putImageData(imageData, 0, 0);//*We place the image data with the applied brightness filter.
    }

    /**
    *@author Lautaro Gallo https://github.com/lautarovg02
    *@description Generic method to apply any filter that we manage with a kernel.
    *@const {number} kernelSize - the size of the kernel
    *@const {array} kernel - A small array of numbers used to apply a filter to the image.
    *@type {Uint8ClampedArray} data - stores the pixel data of an image in RGBA (red, green, blue, and alpha) format in a one-dimensional array.
    */
    applyFilterAccordingToKernel(){
        let imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        let data = imageData.data;
        let filteredPixels = new Uint8ClampedArray(data.length); //*We create a new array of pixels, with the same length as the original image.
        const kernel = this.kernel;
        const kernelSize = 3; 
        
        for (let y = 1; y < this.canvasHeight - 1; y++) {
            
            for (let x = 1; x < this.canvasWidth - 1; x++) {
                
                //* Index of the current pixel.
                let pixelIndex = (y * this.canvasWidth + x) * 4; //* We calculate the pixel index.
                let r = 0;
                let g = 0;
                let b = 0;
            
                for (let i = -1; i <= 1; i++) {//* We apply the convolution matrix to the current pixel and its eight neighbors.
                    
                    for (let j = -1; j <= 1; j++) {
                        //* Values of the convolution matrix and color components of the neighboring pixel.
                        let neighborIndex = ((y + i) * this.canvasWidth + (x + j)) * 4;//* Neighbor pixel index.
                        //* Values of the convolution matrix and color components of the neighboring pixel.
                        let kernelValue = kernel[(i + 1) * kernelSize + (j + 1)];
                        let neighborR = data[neighborIndex];
                        let neighborG = data[neighborIndex + 1];
                        let neighborB = data[neighborIndex + 2]; 
                        //* We add the product of the convolution matrix and the color components of the neighboring pixel.
                        r += kernelValue * neighborR;
                        g += kernelValue * neighborG;
                        b += kernelValue * neighborB;
                    
                    }
                }

                //* We assign the final values for the RGB color components to the filtered pixel.
                filteredPixels[pixelIndex] = r;
                filteredPixels[pixelIndex + 1] = g;
                filteredPixels[pixelIndex + 2] = b;
                filteredPixels[pixelIndex + 3] = 255;
            }
        }
        let filteredImageData = new ImageData(filteredPixels, this.canvasWidth, this.canvasHeight);
        this.ctx.putImageData(filteredImageData, 0, 0);//* We place the updated img with the chosen filter on the canvas.
    }

    /**
     * @autor Lautaro Gallo https://github.com/lautarovg02
     * @description Method in charge of applying the saturation filter, modifying the intensity of the colors depending on the real saturation.
     * @const {float} saturacionAmount - The amount of saturation that we apply to the image.
     * @type {Uint8ClampedArray} data - stores the pixel data of an image in RGBA (red, green, blue, and alpha) format in a one-dimensional array.
     */
    applyFilterSaturation() {
        let imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight); 
        let data = imageData.data; 
        const saturacionAmount = 1.5; 

        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
    
            let max = Math.max(r, g, b);//*Math.max(r, g, b) This method returns the maximum of the numbers that we pass to it as input parameters.
            let min = Math.min(r, g, b);//*Math.min(r, g, b) This method returns the minimum of the numbers that we pass to it as input paraments.
            let saturation = 0;
            
            if (max !== min) {
                saturation = 0.5 * ((max + min) / 255); //*Formula to calculate the saturation value of each pixel.
            }
            
            let factor = (saturacionAmount - 1) * 0.5; //*Formula for scale factor .
                
            //*We apply a scale factor to each color component (red, green, and blue) to increase or decrease their intensity.
            r = r + (r - saturation * 255) * factor;
            g = g + (g - saturation * 255) * factor;
            b = b + (b - saturation * 255) * factor;
            
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
    
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }
    
        this.ctx.putImageData(imageData, 0, 0);//*We place the saturated image data on the canvas.
    }
    
    /**
     * @author Lautaro Gallo  https://github.com/lautarovg02
     * @description This method uses the luminosity formula to calculate the brightness of each pixel, 
        *  and then binarizes each pixel into black or white depending on its brightness.
     * @type {Uint8ClampedArray} data - stores the pixel data of an image in RGBA (red, green, blue, and alpha) format in a one-dimensional array.
     */
    applyBinarizationFilter() {
        let imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        let data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            let luminosity = (data[i] + data[i + 1] + data[i + 2]) / 3;//*Calculate the luminosity of the pixel.

            if (luminosity >= 128) {
                data[i] = data[i + 1] = data[i + 2] = 255; //*If it is white.
            } else {
                data[i] = data[i + 1] = data[i + 2] = 0; //*If it is black.
            }

        }

        this.ctx.putImageData(imageData, 0, 0); //*We place the data of the binarized image on the canvas.
    }

    /**
     * @autor Lautaro Gallo  https://github.com/lautarovg02
     * @description This method is responsible for applying the sepia filter to the image. 
     * @type {Uint8ClampedArray} data - stores the pixel data of an image in RGBA (red, green, blue, and alpha) format in a one-dimensional array.
     */
    applySepiaFilter(){
        let imageData = ctx.getImageData(0,0,this.canvasWidth,this.canvasHeight); 
        let data = imageData.data;
        
        
        for(let pixel = 0; pixel < data.length; pixel+=4){ 
            let r = data[pixel] ;
            let g = data[pixel + 1] ;
            let b = data[pixel + 2] ;

            //*We calculate a new value for each RGB color component using the sepia filter formula.
            data[pixel] = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
            data[pixel + 1] =  Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
            data[pixel + 2] = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);
        }

        this.ctx.putImageData(imageData,0,0);//*Update the image with the sepia filter.
    }
}
