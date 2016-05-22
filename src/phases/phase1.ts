import {Phaser as ph} from "phaser";
import {Space} from "./space";
import {Astro} from "src/sprites/astro";
import {Ovni} from "src/sprites/ovni";
import {Prize} from "src/sprites/prize";
//import {BrightFilter} from "src/filters/bright";

export class Phase1 extends Space {

    constructor() {
        super();
    }

    create() {
        // Fondo
        let background = this.add.sprite(0, 0, "sky");
        background.alpha = 0.5;
        // let brightFilter = new BrightFilter(0.5);        
        // background.filters = [brightFilter];     
        // this.add.tween()   
        
        super.create();
        
        // Suelo
        let ground = this.platforms.create(0, this.world.height - 64, "platform2");
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        // Plataformas
        let ledge1 = this.platforms.create(400, 400, 'ground');
        let ledge2 = this.platforms.create(-150, 250, 'ground');
        ledge2.body.immovable = true;
        ledge1.body.immovable = true;
        
        // Jugador
        this.player = new Astro(this, 32, this.world.height - 150);
        
        // Enemigos
        this.enemies.add(new Ovni(this, this.world.width - 150, 150));

        // Premios
        for (let i = 0; i < 12; i++) {
            this.prizes.add(new Prize(this, i* 70, 0));
        }

    }
}

