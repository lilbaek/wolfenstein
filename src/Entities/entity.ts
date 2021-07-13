import {Map} from '../Game/map';
import {Player} from '../Game/player';

export abstract class Entity implements IEntity {
    public blocking: boolean;
    public collectible: boolean;
    public orientable: boolean;
    public spriteIndex: number;
    public animation: any;
    public x: number;
    public rx: number;
    public y: number;
    public ry: number;
    public direction: number;
    private player: Player;
    private map: Map;

    constructor(map: Map, x: number, y: number, spriteIndex: number, collectible: boolean = false, orientable: boolean = false, blocking: boolean = false) {
        this.map = map;
        this.player = map.player;
        this.x = x;
        this.y = y;
        this.spriteIndex = spriteIndex;
        this.collectible = collectible;
        this.orientable = orientable;
        this.blocking = blocking;
    }

    public startAnimation(animation: any): void {
        this.animation = animation;
        this.spriteIndex = animation.sprites[0];
    }

    public tick(): void {
        //Remove from previous location
        this.map.entityLocations[this.x][this.y] = undefined;
        this.rx = this.x - this.player.x;
        this.ry = this.y - this.player.y;
        const rx = this.rx * this.player.dx + this.ry * this.player.dy;
        this.ry = -this.rx * this.player.dy + this.ry * this.player.dx;
        this.rx = rx;
        if (this.animation) {
            const a = this.animation;
            a.timer += 1;
            if (a.timer >= 8) {
                a.timer = 0;
                if (a.spriteIndex >= a.sprites.length - 1) {
                    if (a.loop) {
                        // animation loops
                        a.spriteIndex = 0;
                    } else {
                        // animation ended
                        this.animation = undefined;
                    }
                } else {
                    a.spriteIndex += 1;
                }
                this.spriteIndex = a.sprites[a.spriteIndex];
            }
        }
        this.map.entityLocations[this.x][this.y] = this;
    }

    public update(keys: any): void {
    }
}
