import "phaser/filters/pixi/ColorMatrixFilter";

export class BrightFilter extends PIXI.ColorMatrixFilter {
    constructor(bright: number) {
        super();
        
        this.bright = bright;
    }
    
    get bright(): number {
        return this.matrix[0];
    }
    
    set bright(value: number) {
        this.matrix = [
            value, 0, 0, 0,
            0, value, 0, 0,
            0, 0, value, 0,
            0, 0, 0, 1 ];
    }
}

