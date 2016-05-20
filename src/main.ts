import {Phaser} from "phaser";
import {Loader} from "./loader";
import {Game} from "./space";

class Boot extends Phaser.State {
    init() {
        // make the game occuppy all available space, but respecting
        // aspect ratio – with letterboxing if needed
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
    }

    preload() {
        this.load.image('intro', 'assets/intro.png');
        this.load.image("loading", "assets/loading.png");
    }

    create() {
        let intro = this.game.add.sprite(0, 0, "intro");
        intro.height = this.game.height;
        intro.width = this.game.width;

        this.game.state.start("loader", false);
    }

}

function start() {
    document.querySelector(".overlay").style.display = "none";
    let game = new Phaser.Game(800, 600, Phaser.AUTO);
    game.state.add("boot", Boot);
    game.state.add("loader", Loader);
    game.state.add("game", Game);
    game.state.start("boot");
}

if (document.readyState === "complete") {
    start();
}
else {
    window.onload = start;
}
