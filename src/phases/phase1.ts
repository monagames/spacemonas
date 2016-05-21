import {Phaser as ph} from "phaser";
import {Space} from "./space";
import {Astro} from "src/astro";
import {Ovni} from "src/enemies/ovni";

let score: number = 0;
let textScore: ph.Text;
let getDiamondSound: ph.Sound;
let explosion: ph.Sound;


export class Phase1 extends Space {

    constructor() {
        super();
    }

    init() {
        this.game.sound.boot();
    }

    preload() {
    }


    create() {
        this.add.sprite(0, 0, "sky");

        super.create();
        
        let silence = this.add.audio("silence");
        getDiamondSound = this.add.audio("get-star");
        explosion = this.add.audio("explosion");

        this.game.sound.volume = 10;
        this.game.input.onDown.addOnce(() => silence.play());
        //this.sound.setDecodedCallback([getDiamondSound, explosion], this.start, this);        

        this.add.sprite(0, 0, "star");

        textScore = this.add.text(16, 16, "0 PUNTOS", { fontSize: '32px', fill: '#FFF' });
        let ground = this.platforms.create(0, this.world.height - 64, "platform2");
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        let ledge1 = this.platforms.create(400, 400, 'ground');
        let ledge2 = this.platforms.create(-150, 250, 'ground');
        ledge2.body.immovable = true;
        ledge1.body.immovable = true;
        
        this.player = new Astro(this, 32, this.world.height - 150, "dude");
        this.enemies.add(new Ovni(this, this.world.width - 150, 150, "ufo"));

        for (let i = 0; i < 12; i++) {
            let diamond = this.prizes.create(i * 70, 0, 'diamond');

            diamond.body.gravity.y = 150;
            diamond.body.collideWorldBounds = true;
            this.physics.arcade.enable(diamond);
            diamond.body.bounce.y = 0.2 + 0.3 * Math.random();
            diamond.body.bounce.x = 0.2 + 0.3 * Math.random();
        }

    }

    update() {
        this.physics.arcade.collide(this.prizes, this.platforms);
        this.physics.arcade.overlap(this.player, this.enemies, this.die, null, this);
        this.physics.arcade.overlap(this.player, this.prizes, this.collectDiamond, null, this);
    }

    collectDiamond(player: ph.Sprite, diamond: ph.Sprite) {
        diamond.kill();
        score = score + 20;
        textScore.text = `${score} PUNTOS`;
        getDiamondSound.play();
    }

    die(player: ph.Sprite, ufo: ph.Sprite) {
        player.alive = false;
        player.kill();
        explosion.play(undefined, 0.5);

    }
}

