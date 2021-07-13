import {Map} from '../Game/map';
import {Entity} from './entity';

export class Enemy extends Entity {
    /**
     * List of sprite indexes of the enemy's dying animation
     */
    public deathSprites: any;
    /**
     * Whether the enemy is currently alive
     */
    public alive: boolean = true;

    constructor(map: Map, x: number, y: number, spriteIndex: number, deathSprites: any, orientable: boolean = false, direction: number = 0) {
        super(map, x, y, spriteIndex, false, orientable);
        this.direction = direction;
        this.deathSprites = deathSprites;
    }
}
