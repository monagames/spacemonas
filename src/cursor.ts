import ph from "phaser";

export class SimpleCursor {
    private cleft : Button;
    private cright : Button;
    private cup : Button;
    private cfire : Button;

    constructor(private game: ph.Game) {
        game.input.addPointer();
        game.input.addPointer();
        let y = game.height - 96;
        this.cleft = new Button(game, ph.Keyboard.LEFT, 0, y, 2);
        this.cright = new Button(game, ph.Keyboard.RIGHT, 150, y, 4);
        this.cfire = new Button(game, ph.Keyboard.CONTROL, game.world.width - 128 - 150, y, 0);
        this.cup = new Button(game, ph.Keyboard.UP, game.world.width - 128, y, 6);        
    }

    get up() {
        return this.cup.isDown;
    }

    get left() {
        return this.cleft.isDown;
    }

    get right() {
        return this.cright.isDown;
    }
    
    get fire() {
        return this.cfire.justDown;
    }
}


class Button {
    isDown: boolean;
    public get justDown(): boolean {
        if (this.justPressed) {
            this.justPressed = false;
            return true;
        }
        else {
            return false;
        }
    }

    private justPressed = false;
    private button: ph.Button;
    
    constructor(game: ph.Game, keyNumber: number, x: number, y: number, private frame: number) {
        let key = game.input.keyboard.addKey(keyNumber);
        this.button = game.add.button(x, y, "cursors");
        this.onInputUp();
        this.button.onInputDown.add(this.onInputDown, this);
        this.button.onInputUp.add(this.onInputUp, this);
        key.onDown.add( this.onInputDown, this);
        key.onUp.add( this.onInputUp, this);
    }

    private onInputDown() {
        this.button.frame = this.frame + 1;
        this.isDown = true;
        this.justPressed = true;
    }

    private onInputUp() {
        this.button.frame = this.frame;
        this.isDown = false;
    }

}
