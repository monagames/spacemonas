import {Phaser} from "phaser";
import {Game} from "./space";
let game = new Phaser.Game(800, 600, Phaser.AUTO, "content");
game.state.add("game", Game);
game.state.start("game");
