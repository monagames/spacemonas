import {Phaser} from "phaser";

export class Loader extends Phaser.State {
    preload() {
        this.load.image('ground', 'assets/platform.png');
        this.load.image('diamond', 'assets/diamond.png');
        this.load.spritesheet('dude', 'assets/astro.png', 32, 48);
        this.load.image('sky', 'assets/space.jpg');
        this.load.image('platform2', 'assets/platform 2.png');
        this.load.image('ufo', "assets/ufo.png");
        this.load.image('star', 'assets/star-sheet.png');

        this.load.audio("get-star", "assets/key.wav");
        this.load.audio("explosion", "assets/explosion.wav");
        //loadAudio(this.load, "get-star", "assets/key");
        //loadAudio(this.load, "explosion", "assets/explosion");
    }
    
    create() {
        let star = this.game.add.audio("get-star");
        let explosion = this.game.add.audio("explosion");
        this.sound.setDecodedCallback([star, explosion], this.start, this);
    }
    
    start() {
        this.game.state.start("game");
    }

    
}