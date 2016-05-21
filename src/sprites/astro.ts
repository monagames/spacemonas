import {Space} from "src/phases/space";
import {Phaser as ph} from "phaser";
import {SimpleCursor} from "../cursor";

export class Astro extends ph.Sprite {
    private jetpackSound: ph.Sound;
    private jetpackOn: boolean;
    private cursors: SimpleCursor;
    private vaIzquierda: boolean;
    private getPrizeSound: ph.Sound;
    private explosionSound: ph.Sound;

    constructor(private space: Space, x: number, y: number) {
        super(space.game, x, y, "astro");
        this.jetpackOn = false;
        this.jetpackSound = space.game.add.sound("jetpack", 0.5, true);
        this.jetpackSound.allowMultiple = false;
        this.jetpackSound.addMarker("jetpack-start", 0, 0.5, 0.5, false);
        this.jetpackSound.addMarker("jetpack-loop", 0.5, 1, 0.5, true);

        this.cursors = new SimpleCursor(this.game);
        space.game.physics.arcade.enable(this);
        this.body.gravity.y = 300;
        this.body.collideWorldBounds = true;
        this.body.bounce.y = 0.5;

        this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        this.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        this.animations.add('air-left', [17, 18, 19, 20, 21], 10, true);
        this.animations.add('air-right', [23, 24, 25, 26, 27], 10, true);

        space.game.add.existing(this);
        
        this.getPrizeSound = this.game.add.audio("get-star");
        this.explosionSound = this.game.add.audio("explosion");

    }

    update() {
        if (this.alive) {
            this.move();
        }
    }

    move() {
        this.space.physics.arcade.collide(this, this.space.platforms);
        this.space.physics.arcade.overlap(this, this.space.enemies, this.die, null, this);
        this.space.physics.arcade.overlap(this, this.space.prizes, this.collectDiamond, null, this);
        

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
                this.jetpackSound.play("jetpack-start").onStop.addOnce(() => {
                    if (this.jetpackOn)
                        this.jetpackSound.play("jetpack-loop")
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
                this.jetpackSound.fadeOut(0.25);
                this.animations.stop();
                this.frame = this.vaIzquierda ? 16 : 22;
            }
        }
    }
    
    collectDiamond(player: ph.Sprite, diamond: ph.Sprite) {
        diamond.kill();
        this.space.score += 20;
        this.getPrizeSound.play();
    }

    die(player: ph.Sprite, ufo: ph.Sprite) {
        player.alive = false;
        player.kill();
        this.explosionSound.play(undefined, 0.5);
        this.jetpackSound.fadeOut(1);

    }
    

}