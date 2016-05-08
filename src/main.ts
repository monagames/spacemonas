// function createAudioContext(desiredSampleRate = 44100) {
//     var AudioCtor = window.AudioContext || window.webkitAudioContext;
//     var context = new AudioCtor();
//     if (/(iPhone|iPad)/i.test(navigator.userAgent) &&
//         context.sampleRate !== desiredSampleRate) {
//         var buffer = context.createBuffer(1, 1, desiredSampleRate);
//         var dummy = context.createBufferSource();
//         dummy.buffer = buffer;
//         dummy.connect(context.destination);
//         dummy.start(0);
//         dummy.disconnect();

//         context.close();
//         context = new AudioCtor();
//     }

//     return context;
// }

// window.PhaserGlobal = {
//     audioContext: createAudioContext(44100)
// };



import {Phaser} from "phaser";
import {Game} from "./space";

let game = new Phaser.Game(800, 600, Phaser.AUTO, "content");
game.state.add("game", Game);
game.state.start("game");
