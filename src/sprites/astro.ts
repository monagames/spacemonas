import {Space} from "src/phases/space";
import ph from "phaser";
import {SimpleCursor} from "../cursor";
import {Laser} from "./laser";

export class Astro extends ph.Sprite {
    private jetpackSound: ph.Sound;
    private laserSound: ph.Sound;
    private jetpackOn: boolean;
    private cursors: SimpleCursor;
    private vaIzquierda: boolean;
    private getPrizeSound: ph.Sound;
    private explosionSound: ph.Sound;
    private smokeEmitter: ph.Particles.Arcade.Emitter;

    constructor(private space: Space, x: number, y: number) {
        super(space.game, x, y, "astro");
        this.jetpackOn = false;
        this.jetpackSound = space.game.add.sound("jetpack", 0.5, true);
        this.jetpackSound.allowMultiple = false;
        this.jetpackSound.addMarker("jetpack-start", 0, 0.5, 0.5, false);
        this.jetpackSound.addMarker("jetpack-loop", 0.5, 1, 0.5, true);

        this.laserSound = space.game.add.sound("laser");

        this.cursors = new SimpleCursor(this.game);
        space.game.physics.arcade.enable(this);
        let body = this.body as ph.Physics.Arcade.Body;
        body.gravity.y = 300;
        body.collideWorldBounds = true;
        body.bounce.y = 0.5;

        this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        this.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        this.animations.add('air-left', [17, 18, 19, 20, 21], 10, true);
        this.animations.add('air-right', [23, 24, 25, 26, 27], 10, true);

        space.game.add.existing(this);

        this.getPrizeSound = this.game.add.audio("get-star");
        this.explosionSound = this.game.add.audio("aaah");

        this.vaIzquierda = false;
        this.frame = 22;

        this.addSmokeEmitter();

        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }

    addSmokeEmitter() {
        let lifespan = 500;
        let smokeParticle = this.space.make.bitmapData(11, 11);
        smokeParticle.circle(5, 5, 5, "#555555");
        smokeParticle.update();

        this.smokeEmitter = this.space.add.emitter(this.x, this.y, 100);
        this.smokeEmitter.setSize(10, 5);
        this.smokeEmitter.setRotation();
        this.smokeEmitter.particleAnchor.set(0);
        this.smokeEmitter.setXSpeed(-50, 50);
        this.smokeEmitter.setYSpeed(50, 100);
        this.smokeEmitter.makeParticles(smokeParticle);
        this.smokeEmitter.setAlpha(0.8, 0, lifespan, Phaser.Easing.Linear.None);
        this.smokeEmitter.setScale(0.5, 2, 0.5, 2, lifespan, Phaser.Easing.Linear.None);
        this.smokeEmitter.gravity = -100;
        this.smokeEmitter.flow(lifespan, 20, 2, -1, true);
        this.smokeEmitter.on = false;
    }

    update() {
        if (this.alive) {
            this.space.physics.arcade.collide(this, this.space.platforms);
            this.space.physics.arcade.overlap(this, this.space.enemies, this.die, null, this);
            this.space.physics.arcade.overlap(this, this.space.prizes, this.collectDiamond, null, this);
            
            if (this.alive)
                this.move();
        }
    }

    move() {
        let body = this.body as ph.Physics.Arcade.Body;

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
                body.velocity.x = 0;
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

            this.smokeEmitter.y = this.y - 10;
            this.smokeEmitter.x = this.x + 10 * (this.vaIzquierda ? +1 : -1);
            this.smokeEmitter.on = true;

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
            this.stopJetPack();
        }

        if (this.cursors.fire) {
            this.shoot();
        }
    }

    stopJetPack() {
        if (this.jetpackOn) {
            this.jetpackOn = false;
            this.jetpackSound.fadeOut(0.25);
            this.jetpackSound.onStop.removeAll();

            this.animations.stop();
            this.frame = this.vaIzquierda ? 16 : 22;
            this.smokeEmitter.on = false;

            //this.jetpackSound.fadeOut(100);
        }

    }

    shoot() {
        this.laserSound.play();
        let sentido = this.vaIzquierda ? -1 : 1;
        let laser = new Laser(this.space, this.x + this.width * sentido / 2, this.y - this.height / 2, 1000 * sentido);
        laser.anchor.x = 0.5;
        let body = this.body as ph.Physics.Arcade.Body;
        // Retroceso
        body.velocity.x -= sentido * 50;
            

        this.space.lasers.add(laser);
    }

    collectDiamond(player: ph.Sprite, diamond: ph.Sprite) {
        diamond.kill();
        this.space.score += 20;
        this.getPrizeSound.play();
    }

    die(player: Astro, ufo: ph.Sprite) {
        this.alive = false;
        this.stopJetPack();
        this.explosionSound.play();
        this.kill();
    }


}