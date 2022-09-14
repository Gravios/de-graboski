import { Player } from './player';


export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.groundMargin = 50;
        this.speed = 0;
        this.maxSpeed = 5;

        this.debug = true;
        this.fontColor = 'black';


        this.player = new Player(this)
    }
}