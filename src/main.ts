import {Phaser} from "phaser";

let game = new Phaser.Game(800, 600, Phaser.AUTO, "content", { preload: preload, create: create, update: update });
let platforms;
let diamonds;
let player: Phaser.Sprite;
let ufo: Phaser.Sprite;
let cursors: Phaser.CursorKeys;
let score: number = 0;
let textScore: Phaser.Text;
let getDiamondSound: Phaser.Sound;
let explosion: Phaser.Sound;
let vaIzquierda = true;


function preload() {

    game.load.image('ground', 'assets/platform.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.spritesheet('dude', 'assets/astro.png', 32, 48);
    game.load.audio("get-star", "assets/key.wav");
    game.load.image('sky', 'assets/space.jpg');
    game.load.image('platform2', 'assets/platform 2.png');
    game.load.image('ufo', "assets/ufo.png");
    game.load.image('star', 'assets/star-sheet.png');
    game.load.audio("explosion", "assets/explosion.wav");

}

function create() {
    cursors = game.input.keyboard.createCursorKeys();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, "sky");
    game.add.sprite(0, 0, "star");

    getDiamondSound = game.add.audio("get-star");
    explosion = game.add.audio("explosion", 0.5);

    textScore = game.add.text(16, 16, "0 PUNTOS", { fontSize: '32px', fill: '#FFF' });

    platforms = game.add.group();
    platforms.enableBody = true;
    let ground = platforms.create(0, game.world.height - 64, "platform2");
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

    player = game.add.sprite(32, game.world.height - 150, "dude");
    game.physics.arcade.enable(player);
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.body.bounce.y = 0.5;

    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    player.animations.add('air-left', [16, 17, 18, 19, 20, 21], 10, true);
    player.animations.add('air-right', [22, 23, 24, 25, 26, 27], 10, true);

    ufo = game.add.sprite(game.world.width - 150, 150, "ufo");
    game.physics.arcade.enable(ufo);
    ufo.body.gravity.y = 150;
    ufo.body.collideWorldBounds = true;
    ufo.body.bounce.y = 1;
    ufo.body.bounce.x = 1;

    diamonds = game.add.group();
    diamonds.enableBody = true;
    for (let i = 0; i < 12; i++) {
        let diamond = diamonds.create(i * 70, 0, 'diamond');

        diamond.body.gravity.y = 150;
        diamond.body.collideWorldBounds = true;
        game.physics.arcade.enable(diamond);
        diamond.body.bounce.y = 0.2 + 0.3 * Math.random();
        diamond.body.bounce.x = 0.2 + 0.3 * Math.random();
    }
}

function update() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(ufo, platforms);
    game.physics.arcade.collide(diamonds, diamonds);
    game.physics.arcade.collide(diamonds, platforms);


    game.physics.arcade.overlap(player, ufo, die, null, this);

    game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);

    if (ufo.body.x < player.body.x)
        ufo.body.velocity.x += 5;

    if (ufo.body.x > player.body.x)
        ufo.body.velocity.x -= 5;

    if (ufo.body.y < player.body.y)
        ufo.body.velocity.y += 5;

    if (ufo.body.y > player.body.y)
        ufo.body.velocity.y -= 5;



    if (player.body.touching.down) {
        if (cursors.left.isDown) {
            player.body.velocity.x = -150;
            vaIzquierda = true;
            player.animations.play("left");
        }
        else if (cursors.right.isDown) {
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
        if (cursors.left.isDown) {
            if (player.body.velocity.x > -200)
                player.body.velocity.x -= 5;
            vaIzquierda = true;
            player.animations.play("air-left");
        }
        else if (cursors.right.isDown) {
            if (player.body.velocity.x < 200)
                player.body.velocity.x += 5;
            vaIzquierda = false;
            player.animations.play("air-right");
        }

    }

    if (cursors.up.isDown) {
        player.body.velocity.y = -150;
        if (vaIzquierda) {
            player.animations.play("air-left");
        }
        else {
            player.animations.play("air-right");
        }

    }

}

function collectDiamond(player: Phaser.Sprite, diamond: Phaser.Sprite) {
    diamond.kill();
    score = score + 20;
    textScore.text = `${score} PUNTOS`;
    getDiamondSound.play();
}

function die(player: Phaser.Sprite, ufo: Phaser.Sprite) {
    player.kill();
    explosion.play(undefined, 0.5);

}