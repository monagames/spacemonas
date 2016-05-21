import {Phaser as ph} from "phaser";
import {SimpleCursor} from "./simpleCursor";

export class Astro extends ph.Sprite {
    private jetpack: ph.Sound;
    private jetpackOn: boolean;
    private cursors: SimpleCursor;
    private vaIzquierda: boolean;

    constructor(game: ph.Game, key: string) {
        super(game, 32, game.world.height - 150, key);
        this.jetpackOn = false;
        this.jetpack = game.add.sound("jetpack", 0.5, true);
        this.jetpack.allowMultiple = false;
        this.jetpack.addMarker("jetpack-start", 0, 0.5, 0.5, false);
        this.jetpack.addMarker("jetpack-loop", 0.5, 1, 0.5, true);

        this.cursors = new SimpleCursor(this.game);
        game.physics.arcade.enable(this);
        this.body.gravity.y = 300;
        this.body.collideWorldBounds = true;
        this.body.bounce.y = 0.5;

        this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        this.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        this.animations.add('air-left', [16, 17, 18, 19, 20, 21], 10, true);
        this.animations.add('air-right', [22, 23, 24, 25, 26, 27], 10, true);
        
        game.add.existing(this);
    }

    update() {
        if (this.body.touching.down) {
            if (this.cursors.left) {
                this.body.velocity.x = -150;
                this.vaIzquierda = true;
                this.animations.play("left");
            }
            else if (this.cursors.right) {
                this.body.velocity.x = 150;
                this.vaIzquierda = false;
                this.animations.play("right");
            }
            else {
                this.body.velocity.x = 0;
                this.animations.stop();
                if (this.vaIzquierda)
                    this.frame = 0;
                else
                    this.frame = 8;
            }
        }
        else {
            if (this.cursors.left) {
                if (this.body.velocity.x > -200)
                    this.body.velocity.x -= 5;
                this.vaIzquierda = true;
                if (this.jetpackOn)
                    this.animations.play("air-left");
                else
                    this.frame = 16;
            }
            else if (this.cursors.right) {
                if (this.body.velocity.x < 200)
                    this.body.velocity.x += 5;
                this.vaIzquierda = false;
                if (this.jetpackOn)
                    this.animations.play("air-right");
                else
                    this.frame = 22;
            }

        }

        if (this.cursors.up) {
            if (!this.jetpackOn) {
                this.jetpackOn = true;
                this.jetpack.play("jetpack-start").onStop.addOnce(() => {
                    if (this.jetpackOn)
                        this.jetpack.play("jetpack-loop")
                });
            }
            this.body.velocity.y = -150;
            if (this.vaIzquierda) {
                this.animations.play("air-left");
            }
            else {
                this.animations.play("air-right");
            }

        }
        else {
            if (this.jetpackOn) {
                this.jetpackOn = false;
                this.jetpack.fadeOut(0.25);
                this.animations.stop();
                this.frame = this.vaIzquierda ? 16 : 22;
            }
        }

    }

}