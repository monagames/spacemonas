import ph from "phaser";
import {Space} from "src/phases/space";

export class Prize extends ph.Sprite {

    constructor(private space: Space, x: number, y: number) {
        super(space.game, x, y, "diamond");
        space.physics.arcade.enable(this);
        this.body.gravity.y = 150;
        space.physics.arcade.enable(this);
        this.body.bounce.y = 0.2 + 0.3 * Math.random();
        this.body.bounce.x = 0.2 + 0.3 * Math.random();

        space.game.add.existing(this);
    }

    update() {
        this.space.physics.arcade.collide(this, this.space.platforms);      
    }
}