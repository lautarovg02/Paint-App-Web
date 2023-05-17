"use strict";
class Pen {

    /**
     * @constructor
     * @param {number} posX 
     * @param {number} posY 
     * @param {String} fill 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} style 
     * @see ctx - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D 
     */

    constructor(posX, posY, fill, ctx, style) {
        /**
         * @type antX -{number}
         */
        this.antX = posX;
        /**
         * @type antY - {number}
         */
        this.antY = posY;
        /**
         * posX
         * @type{number}
         */
        this.posX = posX;
        /**
         * @type posY - {number}
         */
        this.posY = posY;
        /**
         * @type ctx - {CanvasRenderingContext2D}
         */
        this.ctx = ctx;
        /**
         * @type  style - {CanvasRenderingContext2D} 
         */
        this.style = style;
        /**
         * @type fill - {string}
         */
        this.fill = fill;
    }

    moveTo(x, y){
        this.antX = this.posX;
        this.antY = this.posY;
        this.posX = x;
        this.posY = y;
    }

    /**
    *@author Lautaro Gallo https://github.com/lautarovg02
    *@description Method in charge of drawing the stroke
    */
    draw(){
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.fill;
        this.ctx.lineWidth = this.style;
        this.ctx.lineCap='round';
        this.ctx.lineJoin='round';
        this.ctx.blur = 'flat';
        this.ctx.shadowBlur = 0;
        this.ctx.moveTo(this.antX, this.antY);
        this.ctx.lineTo(this.posX, this.posY);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    /**
    *@author Lautaro Gallo https://github.com/lautarovg02
    *@description Method in charge of drawing the stroke, simulating a graffiti-like stroke
    */
    drawGraffiti(){
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.fill;
        this.ctx.lineWidth = this.style + 1;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowColor = this.fill;
        this.ctx.shadowBlur = 10;
        this.ctx.moveTo(this.antX, this.antY);
        this.ctx.lineTo(this.posX, this.posY);
        this.ctx.stroke();
        this.ctx.closePath();
        this.posX += Math.floor(Math.random() * 16) - 8;
        this.posY += Math.floor(Math.random() * 16) - 8;
    }

}