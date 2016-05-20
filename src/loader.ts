import {Phaser} from "phaser";

export class Loader extends Phaser.State {

    loading: Phaser.Sprite;
    startSprite: Phaser.Sprite;

    preload() {
        this.loading = this.add.sprite(this.game.width / 2, this.game.height * 0.7, "loading");
        this.loading.anchor.x = 0.5;
        this.loading.anchor.y = 0.5;
        //this.loading.tint = 0xff00ff;
        this.load.setPreloadSprite(this.loading);

        this.load.image('ground', 'assets/platform.png');
        this.load.image('diamond', 'assets/diamond.png');
        this.load.spritesheet('dude', 'assets/astro.png', 32, 48);
        this.load.image('sky', 'assets/space.jpg');
        this.load.image('platform2', 'assets/platform 2.png');
        this.load.image('ufo', "assets/ufo.png");
        this.load.image('star', 'assets/star-sheet.png');

        this.load.image('start', 'assets/start.png');

        this.load.audio("get-star", "assets/key.mp3");
        this.load.audio("explosion", "assets/explosion.mp3");
        this.load.audio("space-monas", "assets/space-monas.mp3");
        this.load.audio("silence", "assets/silence.mp3");
        this.load.audio("jetpack", "assets/jetpack.mp3");

    }

    create() {
        this.loading.destroy();
        this.startSprite = this.add.sprite(this.game.width / 2, this.game.height * 0.7, "start");
        this.startSprite.anchor.x = 0.5;
        this.startSprite.anchor.y = 0.5;
        this.startSprite.inputEnabled = true;     
        this.startSprite.events.onInputDown.add(this.start, this);
    }

    start() {
        this.add.audio("space-monas").play();
        this.add.tween(this.startSprite.scale).to( { x: 0, y: 0 }, 500, "Linear", true );
        let timer = this.time.create(true);
        setTimeout(() => this.game.state.start("game"), 500);
        //this.game.state.start("game");
    }


}