"use strict";
class Pen {

    constructor(posX, posY, fill, ctx, estilo) {
        this.antX = posX;
        this.antY = posY;
        this.posX = posX;
        this.posY = posY;
        this.ctx = ctx;
        this.estilo = estilo;
        this.fill = fill;
        this.scale = 1;
    }

    moveTo(x, y){
        this.antX = this.posX;
        this.antY = this.posY;
        this.posX = x;
        this.posY = y;
    }

    //* Metodo encargado de dibujar el trazo
    draw(){
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.fill;
        this.ctx.lineWidth = this.estilo;
        this.ctx.lineCap='round';
        this.ctx.lineJoin='round';
        this.blur = 'flat';
        this.ctx.shadowBlur = 0;
        this.ctx.moveTo(this.antX, this.antY);
        this.ctx.lineTo(this.posX * this.scale, this.posY * this.scale);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    zoomIn() {
        this.ctx.scale(1.5, 1.5);
        this.ctx.stroke();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.draw();

    }

    zoomOut() {
        ctx.scale(0.5, 0.5);
        // ctx.stroke();
        console.log("zoomOut lapiz");

        this.draw();
    }

    //* Metodo encargado de dibujar el trazo, simulando un trazo tipo grafitti
    drawGraffiti(){
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.fill;
        this.ctx.lineWidth = 1 + this.estilo;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowColor = this.fill;
        this.ctx.shadowBlur = 10;
        this.ctx.moveTo(this.antX, this.antY);
        this.ctx.lineTo(this.posX, this.posY);
        this.ctx.stroke();
        this.ctx.closePath();
        this.posX += Math.floor(Math.random() * 16) - 8; // movemos la posición del trazo de manera aleatoria
        this.posY += Math.floor(Math.random() * 16) - 8;
    }

}//* Fin de la clase PEN