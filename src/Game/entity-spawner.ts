import {GuardEnemy} from '../Entities/guardEnemy';
import {Map} from './map';
import {Player} from './player';

export class EntitySpawner {
    private plane0: DataView;
    private plane1: DataView;
    private entities: Array<IEntity>;
    private map: Map;

    constructor(plane0: DataView, plane1: DataView) {
        this.plane0 = plane0;
        this.plane1 = plane1;
    }

    public setup(map: Map): Array<IEntity> {
        this.map = map;
        this.entities = [];
        for (let y = 0; y < 64; y++) {
            for (let x = 0; x < 64; x++) {
                this.EntitiesAndProps(x, y);
            }
        }
        return this.entities;
    }

    private EntitiesAndProps(x: number, y: number): void {
        const tile = this.map1(x, y);
        switch (tile) {
            case 19:
            case 20:
            case 21:
            case 22:
                break;
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28:
            case 29:
            case 30:
            case 31:
            case 32:
            case 33:
            case 34:
            case 35:
            case 36:
            case 37:
            case 38:
            case 39:
            case 40:
            case 41:
            case 42:
            case 43:
            case 44:
            case 45:
            case 46:
            case 47:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 58:
            case 59:
            case 60:
            case 61:
            case 62:
            case 63:
            case 64:
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
                /*
                    TODO? - see wl_game.cpp - what are those?
                    case 71:
                    case 72:
                    #ifdef SPEAR
                        case 73:                        // TRUCK AND SPEAR!
                        case 74:
                    #endif
                    */
                this.spawnStatic(x, y, tile);
                break;
            case 98: //Secret
                //gamestate.secrettotal++;
                break;
            case 124:
                //Dead guard
                this.spawnDeadGuard(x, y);
                break;
            default:
                if (tile >= 108) {
                    this.spawnEnemiesAndGuards(x, y, tile);
                }
                break;
        }
    }

    private spawnEnemiesAndGuards(x: number, y: number, tile: number): void {
        if ((108 <= tile && tile < 116)) {
            this.entities.push(new GuardEnemy(this.map, x, y, (tile - 108) % 4));
        }
        //TODO: This needs to be changed to handle difficulty - see wl_game.cpp
        /*
        // enemy
        if ((108 <= tile && tile < 116))
        {
            things.push(new GuardEnemy(x, y, (tile - 108) % 4));
        }
        else if ((144 <= tile && tile < 152))
        {
            things.push(new GuardEnemy(x, y, (tile - 144) % 4));
        }
        else if ((116 <= tile && tile < 124))
        {
            things.push(new OfficerEnemy(x, y, (tile - 116) % 4));
        }
        else if ((152 <= tile && tile < 160))
        {
            things.push(new OfficerEnemy(x, y, (tile - 152) % 4));
        }
        else if ((126 <= tile && tile < 134))
        {
            things.push(new SSEnemy(x, y, (tile - 126) % 4));
        }
        else if ((162 <= tile && tile < 170))
        {
            things.push(new SSEnemy(x, y, (tile - 162) % 4));
        }
        else if ((134 <= tile && tile < 142))
        {
            things.push(new DogEnemy(x, y, (tile - 134) % 4));
        }
        else if ((170 <= tile && tile < 178))
        {
            things.push(new DogEnemy(x, y, (tile - 170) % 4));
        }
        else if ((216 <= tile && tile < 224))
        {
            things.push(new ZombieEnemy(x, y, (tile - 116) % 4));
        }
        else if ((234 <= tile && tile < 242))
        {
            things.push(new ZombieEnemy(x, y, (tile - 144) % 4));
        }
        else if (tile == 160)
        {
            things.push(new FakeHitlerEnemy(x, y));
        }
        else if (tile == 178)
        {
            things.push(new HitlerEnemy(x, y));
        }
        else if (tile == 179)
        {
            things.push(new FettgesichtEnemy(x, y));
        }
        else if (tile == 196)
        {
            things.push(new SchabbsEnemy(x, y));
        }
        else if (tile == 197)
        {
            things.push(new GretelEnemy(x, y));
        }
        else if (tile == 214)
        {
            things.push(new HansEnemy(x, y));
        }
        else if (tile == 215)
        {
            things.push(new OttoEnemy(x, y));
        }
        else if (224 <= tile && tile < 228)
        {
            // Ghost
            var ghost = new Thing(x, y, 0);
            var spriteIndex = 288 + 2 * (tile - 224);
            ghost.startAnimation(new Animation([spriteIndex, spriteIndex + 1], true));
            things.push(ghost);
        }*/
    }

    private spawnDeadGuard(i: number, tile: number): void {
        //things.push(new Thing(x, y, 95));
    }

    private spawnStatic(x: number, y: number, tile: number): void {
        /*
        // props
        var collectible = false;
        if ([29, 43, 44, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56].indexOf(tile) >= 0) {
            // collectible
            collectible = true;
            if (52 <= tile && tile <= 56) {
                score.totalTreasures += 1;
            }
        }
        if ([24, 25, 26, 28, 30, 31, 33, 34, 35, 36, 39, 40, 41, 45, 58, 59, 60, 62, 63, 68,
            69].indexOf(tile) >= 0) {
            // blocking prop
            things.push(new Thing(x, y, tile - 21, collectible, false, true));
            plane2[x][y] = true;
        } else {
            things.push(new Thing(x, y, tile - 21, collectible, false, false));
        }*/
    }

    public map0(x: number, y: number): number {
        return this.plane0.getUint16(2 * (x + 64 * y), true);
    }

    public map1(x: number, y: number): number {
        return this.plane1.getUint16(2 * (x + 64 * y), true);
    }
}
