import ph from "phaser";
import {Space} from "src/phases/space";

export class Ovni extends ph.Sprite {

    private expSound: ph.Sound;

    constructor(private space: Space, x: number, y: number) {
        super(space.game, x, y, "ufo");
        space.game.physics.arcade.enable(this);
        this.body.gravity.y = 150;
        this.body.bounce.y = 1;
        this.body.bounce.x = 1;

        space.game.add.existing(this);

        this.expSound = this.game.add.audio("explosion", 0.3);
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
        this.space.score += 100;

        let body = this.body as ph.Physics.Arcade.Body;
        let emitter = this.game.add.emitter(body.x, body.y);
        let piece = this.game.make.bitmapData(5, 5);
        let lifeSpan = 2000;

        piece.rect(0, 0, 5, 5, "#FFFF22");
        piece.update();

        emitter.setSize(10, 5);
        emitter.makeParticles(piece);
        emitter.setAlpha(0.8, 0, lifeSpan, Phaser.Easing.Linear.None);
        emitter.setScale(0.5, 2, 0.5, 2, lifeSpan, Phaser.Easing.Linear.None);

        emitter.start(true, 1000, null, 20);

        ovni.kill();
        laser.kill();
        this.expSound.play();
    }

}