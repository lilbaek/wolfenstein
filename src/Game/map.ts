import {DoorConsts} from '../Defs/door-const';
import {DoorType} from '../Defs/door-type';
import {Door} from '../Entities/door';
import {Dictionary} from '../Helpers/dictionary';
import {Player} from './player';
import {TileType} from './tile-type';

export class Map {
    /*
    Data from GAMEMAPS.WL6
     */
    public plane0: DataView;
    /*
    Data from GAMEMAPS.WL6
     */
    public plane1: DataView;
    /*
    Map of each tile in map
     */
    public tileMap: TileType[][];
    /*
    Doors in the level
     */
    public doors: IDictionary<Door> = new Dictionary();
    public player: Player;
    public wallTextureOffset: number;

    constructor(plane0: DataView, plane1: DataView, wallTextureOffset: number) {
        this.plane0 = plane0;
        this.plane1 = plane1;
        this.wallTextureOffset = wallTextureOffset;
    }

    public setup(): void {
        this.player = new Player(this);
        this.setupTileMap();
        for (let y = 0; y < 64; y++) {
            for (let x = 0; x < 64; x++) {
                this.setupWorld(x, y);
                this.EntitiesAndProps(x, y);
            }
        }
    }

    private EntitiesAndProps(x: number, y: number): void {
        const tile = this.map1(x, y);
        switch (tile) {
            case 19:
            case 20:
            case 21:
            case 22:
                this.spawnPlayer(x, y, tile);
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

    private spawnPlayer(x: number, y: number, m1: number): void {
        // player starting position
        this.player.x = x + .5;
        this.player.y = y + .5;
        if (m1 === 19) {
            this.player.dx = 0;
            this.player.dy = -1;
        } else if (m1 === 20) {
            this.player.dx = 1;
            this.player.dy = 0;
        } else if (m1 === 21) {
            this.player.dx = 0;
            this.player.dy = 1;
        } else if (m1 === 22) {
            this.player.dx = -1;
            this.player.dy = 0;
        }
    }

    private setupWorld(x: number, y: number): void {
        const tile = this.map0(x, y);
        if (tile <= 63) {
            // wall
            this.tileMap[x][y] |= TileType.WALL_TILE;
        } else if (90 <= tile && tile <= 101) {
            // door
            this.spawnDoor(x, y, tile);
        }
    }

    private spawnDoor(x: number, y: number, tile: number): void {
        if (this.doors.count() >= DoorConsts.MAXDOORS) {
            throw new Error('Too many Doors on level!');
        }
        this.tileMap[x][y] |= TileType.DOOR_TILE;
        const door = new Door(x, y, this.player);
        this.doors.add(x.toFixed() + y.toFixed(), door);
        switch (tile) {
            case 90:
                door.Type = DoorType.DOOR_VERT;
                door.Vertical = true;
                door.TextureIndex = DoorConsts.TEX_DDOOR + 1;
                break;
            case 91:
                door.Type = DoorType.DOOR_HORIZ;
                door.Vertical = false;
                door.TextureIndex = DoorConsts.TEX_DDOOR;
                break;
            case 92:
                door.Type = DoorType.DOOR_G_VERT;
                door.Vertical = true;
                door.TextureIndex = DoorConsts.TEX_DLOCK;
                break;
            case 93:
                door.Type = DoorType.DOOR_G_HORIZ;
                door.Vertical = false;
                door.TextureIndex = DoorConsts.TEX_DLOCK;
                break;
            case 94:
                door.Type = DoorType.DOOR_S_VERT;
                door.Vertical = true;
                door.TextureIndex = DoorConsts.TEX_DLOCK + 1;
                break;
            case 95:
                door.Type = DoorType.DOOR_G_HORIZ;
                door.Vertical = false;
                door.TextureIndex = DoorConsts.TEX_DLOCK + 1;
                break;
            case 100:
                door.Type = DoorType.DOOR_G_VERT;
                door.Vertical = true;
                door.TextureIndex = DoorConsts.TEX_DELEV + 1;
                break;
            case 101:
                door.Type = DoorType.DOOR_E_HORIZ;
                door.Vertical = false;
                door.TextureIndex = DoorConsts.TEX_DELEV;
                break;
            default:
                throw new Error('Unknown door type: ' + tile);
        }
    }

    public map0(x: number, y: number): number {
        return this.plane0.getUint16(2 * (x + 64 * y), true);
    }

    public map1(x: number, y: number): number {
        return this.plane1.getUint16(2 * (x + 64 * y), true);
    }

    private setupTileMap(): void {
        this.tileMap = [];
        for (let i = 0; i < 64; i++) {
            const line = Array(64);
            line.fill(0);
            this.tileMap.push(line);
        }
    }

    public handleInput(keys: any): void {
        this.doors.keys().forEach((key) => {
            this.doors.get(key).update(keys);
        });
    }

    public tick(): void {
        this.doors.keys().forEach((key) => {
            this.doors.get(key).tick();
        });
    }
}
