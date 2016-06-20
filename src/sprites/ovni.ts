import ph from "phaser";
import {Space} from "src/phases/space";

export class Ovni extends ph.Sprite {

    private explosionSound: ph.Sound;

    constructor(private space: Space, x: number, y: number) {
        super(space.game, x, y, "ufo");
        space.game.physics.arcade.enable(this);
        this.body.gravity.y = 150;
        this.body.collideWorldBounds = true;
        this.body.bounce.y = 1;
        this.body.bounce.x = 1;

        space.game.add.existing(this);

        this.explosionSound = this.game.add.audio("explosion");
    }

    update() {
        this.game.physics.arcade.collide(this, this.space.platforms);
        this.space.physics.arcade.overlap(this, this.space.lasers, this.die, null, this);

        if (this.body.x < this.space.player.x)
            this.body.velocity.x += 5;

        if (this.body.x > this.space.player.x)
            this.body.velocity.x -= 5;

        if (this.body.y < this.space.player.y)
            this.body.velocity.y += 5;

        if (this.body.y > this.space.player.y)
            this.body.velocity.y -= 5;
    }

    die(ovni: ph.Sprite, laser: ph.Sprite) {
        ovni.kill();
        this.explosionSound.play();
    }
}