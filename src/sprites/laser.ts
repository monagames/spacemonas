import ph from "phaser";
import {Space} from "src/phases/space";

export class Laser extends ph.Sprite {
    constructor(space: Space, x: number, y: number, vx: number) {
        super(space.game, x, y, "laser");
        space.game.physics.arcade.enable(this);
        this.body.velocity.x = vx;
        this.checkWorldBounds = true;
        this.events.onOutOfBounds.add(() => this.destroy());
    }
}