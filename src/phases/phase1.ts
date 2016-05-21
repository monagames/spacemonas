import {Phaser as ph} from "phaser";
import {Space} from "./space";
import {Astro} from "src/sprites/astro";
import {Ovni} from "src/sprites/ovni";
import {Prize} from "src/sprites/prize";

export class Phase1 extends Space {

    constructor() {
        super();
    }

    create() {
        // Fondo
        this.add.sprite(0, 0, "sky");
        
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

