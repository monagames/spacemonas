import {Phaser as ph} from "phaser";

export abstract class Space extends ph.State {

    player: ph.Sprite;
    enemies: ph.Group;
    platforms: ph.Group;
    prizes: ph.Group;
    
    private _score: number = 0;
    private textScore: ph.Text;


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
        
        this.textScore = this.add.text(this.world.width / 2, 16, "0", { fontSize: '32px', fill: '#FFF', align: "center" });
        
        let silence = this.add.audio("silence");

        this.game.sound.volume = 10;
        this.game.input.onDown.addOnce(() => silence.play());

    }
    
    get score() { return this._score; }
    set score(value: number) {
        this._score = value;
        this.textScore.setText(value.toString());
     } 

}

