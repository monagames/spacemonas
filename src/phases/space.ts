import {Phaser as ph} from "phaser";

export abstract class Space extends ph.State {

    player: ph.Sprite;
    enemies: ph.Group;
    platforms: ph.Group;
    prizes: ph.Group;

    constructor() {
        super();
    }

    create() {
        this.physics.startSystem(ph.Physics.ARCADE);
        
        this.platforms = this.add.group();
        this.platforms.enableBody = true;
        
        this.prizes = this.add.group();
        this.prizes.enableBody = true;
        
        this.enemies = this.add.group();
    }

}

