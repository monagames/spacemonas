import {Phaser as ph} from "phaser";
import {Space} from "src/phases/space";

export class Ovni extends ph.Sprite {

    constructor(private space: Space, x: number, y: number) {
        super(space.game, x, y, "ufo");
        space.game.physics.arcade.enable(this);
        this.body.gravity.y = 150;
        this.body.collideWorldBounds = true;
        this.body.bounce.y = 1;
        this.body.bounce.x = 1;

        space.game.add.existing(this);
    }

    update() {
        this.game.physics.arcade.collide(this, this.space.platforms);

        if (this.body.x < this.space.player.x)
            this.body.velocity.x += 5;

        if (this.body.x > this.space.player.x)
            this.body.velocity.x -= 5;

        if (this.body.y < this.space.player.y)
            this.body.velocity.y += 5;

        if (this.body.y > this.space.player.y)
            this.body.velocity.y -= 5;
    }
}