import ph from "phaser";

export class Loader extends ph.State {

    started: boolean;
    loading: ph.Text;
    startSprite: ph.Text;

    init() {
        this.sound.boot();
    }

    preload() {
        this.started = false;
        this.loading = this.add.text(this.game.width / 2, this.game.height * 0.7, "LOADING", { fontSize: "64px", fill: "#FDF", align: "right" });
        this.loading.anchor.x = 0.5;
        this.loading.anchor.y = 0.5;
        this.load.setPreloadSprite(this.loading);

        this.load.image("ground", "assets/platform.png");
        this.load.image("diamond", "assets/diamond.png");
        this.load.spritesheet("astro", "assets/astro.png", 32, 48);
        this.load.image("sky", "assets/space.jpg");
        this.load.image("platform2", "assets/platform 2.png");
        this.load.image("ufo", "assets/ufo.png");
        this.load.image("star", "assets/star-sheet.png");
        this.load.image("laser", "assets/laser.png");

        this.load.audio("get-star", "assets/key.mp3");
        this.load.audio("explosion", "assets/explosion.mp3");
        this.load.audio("space-monas", "assets/space-monas.mp3");
        this.load.audio("silence", "assets/silence.mp3");
        this.load.audio("jetpack", "assets/jetpack.mp3");
        this.load.audio("laser", "assets/laser.wav");
        this.load.audio("aaah", "assets/aaah.mp3");
    }

    create() {
        this.loading.destroy();
        this.startSprite = this.add.text(this.game.width / 2, this.game.height * 0.7, "START", { fontSize: "64px", fill: "#FDF", align: "right" });
        this.startSprite.setShadow(5, 5);
        this.startSprite.font = "moonhouseregular";
        this.startSprite.anchor.x = 0.5;
        this.startSprite.anchor.y = 0.5;
        this.startSprite.inputEnabled = true;
        this.startSprite.events.onInputDown.addOnce(this.start, this);

        this.add.tween(this.startSprite.scale).to( { x: 1.25, y: 1.25 }, 500, "Sine", true, 0, -1, true);
    }

    update() {
        if (this.input.keyboard.lastKey)
            this.start();
    }

    start() {
        if (!this.started) {
            this.started = true;            
            this.add.tween(this.startSprite.scale).to({ x: 0, y: 0 }, 1000, ph.Easing.Bounce.Out, true);
            this.add.audio("space-monas").play();
            let timer = this.time.create(true);
            setTimeout(() => this.game.state.start("game"), 500);
        }
    }


}