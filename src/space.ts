import {Phaser as ph} from "phaser";
import {Astro} from "./astro";

let platforms;
let diamonds;
let ufo: ph.Sprite;
let score: number = 0;
let textScore: ph.Text;
let getDiamondSound: ph.Sound;
let explosion: ph.Sound;
let player: ph.Sprite;


export class Game extends ph.State {

    jetpack: ph.Sound;
    jetpackOn: boolean;

    constructor() {
        super();
    }

    init() {
        this.game.sound.boot();
    }

    preload() {
    }


    create() {
        this.jetpackOn = false;
        this.jetpack = this.add.sound("jetpack", 0.5, true);
        this.jetpack.allowMultiple = false;
        this.jetpack.addMarker("jetpack-start", 0, 0.5, 0.5, false);
        this.jetpack.addMarker("jetpack-loop", 0.5, 1, 0.5, true);

        let silence = this.add.audio("silence");
        getDiamondSound = this.add.audio("get-star");
        explosion = this.add.audio("explosion");

        this.game.sound.volume = 10;
        this.game.input.onDown.addOnce(() => silence.play());
        //this.sound.setDecodedCallback([getDiamondSound, explosion], this.start, this);        

        this.physics.startSystem(ph.Physics.ARCADE);
        this.add.sprite(0, 0, "sky");
        this.add.sprite(0, 0, "star");

        textScore = this.add.text(16, 16, "0 PUNTOS", { fontSize: '32px', fill: '#FFF' });
        platforms = this.add.group();
        platforms.enableBody = true;
        let ground = platforms.create(0, this.world.height - 64, "platform2");
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        let ledge1 = platforms.create(400, 400, 'ground');
        let ledge2 = platforms.create(-150, 250, 'ground');
        ledge1.body.collideWorldBounds = true;
        ledge2.body.collideWorldBounds = true;
        ledge2.body.immovable = true;
        ledge1.body.immovable = true;
        ledge1.body.bounce.y = 1;
        ledge2.body.bounce.y = 1;
        ledge1.body.bounce.x = 1;
        ledge2.body.bounce.x = 1;

        player = new Astro(this.game, "dude");

        ufo = this.add.sprite(this.world.width - 150, 150, "ufo");
        this.physics.arcade.enable(ufo);
        ufo.body.gravity.y = 150;
        ufo.body.collideWorldBounds = true;
        ufo.body.bounce.y = 1;
        ufo.body.bounce.x = 1;

        diamonds = this.add.group();
        diamonds.enableBody = true;
        for (let i = 0; i < 12; i++) {
            let diamond = diamonds.create(i * 70, 0, 'diamond');

            diamond.body.gravity.y = 150;
            diamond.body.collideWorldBounds = true;
            this.physics.arcade.enable(diamond);
            diamond.body.bounce.y = 0.2 + 0.3 * Math.random();
            diamond.body.bounce.x = 0.2 + 0.3 * Math.random();
        }

    }

    update() {
        this.physics.arcade.collide(player, platforms);
        this.physics.arcade.collide(ufo, platforms);
        this.physics.arcade.collide(diamonds, diamonds);
        this.physics.arcade.collide(diamonds, platforms);


        this.physics.arcade.overlap(player, ufo, this.die, null, this);

        this.physics.arcade.overlap(player, diamonds, this.collectDiamond, null, this);

        if (ufo.body.x < player.body.x)
            ufo.body.velocity.x += 5;

        if (ufo.body.x > player.body.x)
            ufo.body.velocity.x -= 5;

        if (ufo.body.y < player.body.y)
            ufo.body.velocity.y += 5;

        if (ufo.body.y > player.body.y)
            ufo.body.velocity.y -= 5;
    }

    collectDiamond(player: ph.Sprite, diamond: ph.Sprite) {
        diamond.kill();
        score = score + 20;
        textScore.text = `${score} PUNTOS`;
        getDiamondSound.play();
    }

    die(player: ph.Sprite, ufo: ph.Sprite) {
        player.kill();
        explosion.play(undefined, 0.5);

    }
}

