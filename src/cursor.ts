import ph from "phaser";

export class SimpleCursor {
    private cursors: ph.CursorKeys;
    private _fire: ph.Key;
    private threshold = 0;

    constructor(private game: ph.Game) {
        this.cursors = game.input.keyboard.createCursorKeys();
        this._fire = game.input.keyboard.addKey(ph.Keyboard.X);
    }

    get up() {
        return this.cursors.up.isDown || this.rightPointer.isDown;
    }

    get left() {
        let p = this.leftPointer;
        return this.cursors.left.isDown || ((p.isDown && p.positionDown.x - p.position.x > this.threshold));
    }

    get right() {
        let p = this.leftPointer;
        return this.cursors.right.isDown || (p.isDown && (p.position.x - p.positionDown.x > this.threshold));
    }
    
    get fire() {
        return this._fire.justDown;
    }

    get leftPointer(): ph.Pointer {
        let p1 = this.game.input.pointer1;
        let p2 = this.game.input.pointer2;

        if (this.isInLeftArea(p1))
            return p1;
        else if (this.isInLeftArea(p2))
            return p2;
        else
            return p1;
    }

    get rightPointer(): ph.Pointer {
        let p1 = this.game.input.pointer1;
        let p2 = this.game.input.pointer2;

        if (this.isInRightArea(p1))
            return p1;
        else if (this.isInRightArea(p2))
            return p2;
        else
            return p2;
    }

    isInLeftArea(pointer: ph.Pointer) {
        return pointer.positionDown.y > 0 && pointer.positionDown.x < this.game.world.width / 2;
    }

    isInRightArea(pointer: ph.Pointer) {
        return pointer.positionDown.y > 0 && pointer.positionDown.x >= this.game.world.width / 2;
    }
}
