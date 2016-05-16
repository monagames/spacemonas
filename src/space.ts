import {Phaser as ph} from "phaser";

let platforms;
let diamonds;
let player: ph.Sprite;
let ufo: ph.Sprite;
let cursors: SimpleCursor;
let score: number = 0;
let textScore: ph.Text;
let getDiamondSound: ph.Sound;
let explosion: ph.Sound;
let vaIzquierda = true;

function loadAudio(loader: ph.Loader, id: string, url: string) {
    loader.audio(id, [url + ".ogg", url + ".m4a", url + ".mp3"]);
}


class SimpleCursor {
    private cursors: ph.CursorKeys;
    private game: ph.Game;
    private threshold = 0;

    constructor(game: ph.Game) {
        this.cursors = game.input.keyboard.createCursorKeys();
        this.game = game;
    }

    get up() {
        return this.cursors.up.isDown || this.rightPointer.isDown;
    }

    get left() {
        let p = this.leftPointer;
        return this.cursors.left.isDown || ((p.isDown && p.positionDown.x - p.position.x > this.threshold));
    }

    get right() {
        let p = this.leftPointer;
        return this.cursors.right.isDown || (p.isDown && (p.position.x - p.positionDown.x > this.threshold));
    }

    get leftPointer(): ph.Pointer {
        let p1 = this.game.input.pointer1;
        let p2 = this.game.input.pointer2;

        if (this.isInLeftArea(p1))
            return p1;
        else if (this.isInLeftArea(p2))
            return p2;
        else
            return p1;
    }

    get rightPointer(): ph.Pointer {
        let p1 = this.game.input.pointer1;
        let p2 = this.game.input.pointer2;

        if (this.isInRightArea(p1))
            return p1;
        else if (this.isInRightArea(p2))
            return p2;
        else
            return p2;
    }

    isInLeftArea(pointer: ph.Pointer) {
        return pointer.positionDown.y > 0 && pointer.positionDown.x < this.game.world.width / 2;
    }

    isInRightArea(pointer: ph.Pointer) {
        return pointer.positionDown.y > 0 && pointer.positionDown.x >= this.game.world.width / 2;
    }
}

export class Game extends ph.State {

    constructor() {
        super();
    }

    preload() {
        this.load.image('ground', 'assets/platform.png');
        this.load.image('diamond', 'assets/diamond.png');
        this.load.spritesheet('dude', 'assets/astro.png', 32, 48);
        this.load.image('sky', 'assets/space.jpg');
        this.load.image('platform2', 'assets/platform 2.png');
        this.load.image('ufo', "assets/ufo.png");
        this.load.image('star', 'assets/star-sheet.png');

        this.load.audio("get-star", "assets/key.mp3");
        this.load.audio("explosion", "assets/explosion.mp3");
        //loadAudio(this.load, "get-star", "assets/key");
        //loadAudio(this.load, "explosion", "assets/explosion");
    }


    create() {
        getDiamondSound = this.add.audio("get-star");
        explosion = this.add.audio("explosion");
        this.sound.setDecodedCallback([getDiamondSound, explosion], this.start, this);        
       
        cursors = new SimpleCursor(this.game);
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

        player = this.add.sprite(32, this.world.height - 150, "dude");
        this.physics.arcade.enable(player);
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.body.bounce.y = 0.5;

        player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
        player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
        player.animations.add('air-left', [16, 17, 18, 19, 20, 21], 10, true);
        player.animations.add('air-right', [22, 23, 24, 25, 26, 27], 10, true);

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
    
    start() {
        alert("Decoded");
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



        if (player.body.touching.down) {
            if (cursors.left) {
                player.body.velocity.x = -150;
                vaIzquierda = true;
                player.animations.play("left");
            }
            else if (cursors.right) {
                player.body.velocity.x = 150;
                vaIzquierda = false;
                player.animations.play("right");
            }
            else {
                player.body.velocity.x = 0;
                player.animations.stop();
                if (vaIzquierda)
                    player.frame = 0;
                else
                    player.frame = 8;
            }
        }
        else {
            if (cursors.left) {
                if (player.body.velocity.x > -200)
                    player.body.velocity.x -= 5;
                vaIzquierda = true;
                player.animations.play("air-left");
            }
            else if (cursors.right) {
                if (player.body.velocity.x < 200)
                    player.body.velocity.x += 5;
                vaIzquierda = false;
                player.animations.play("air-right");
            }

        }

        if (cursors.up) {
            player.body.velocity.y = -150;
            if (vaIzquierda) {
                player.animations.play("air-left");
            }
            else {
                player.animations.play("air-right");
            }

        }

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

