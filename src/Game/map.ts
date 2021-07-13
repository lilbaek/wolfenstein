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
    Locations in the wold where entities are located
    */
    public entityLocations: any[][];
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
        this.setupTileMapAndEntityMap();
        for (let y = 0; y < 64; y++) {
            for (let x = 0; x < 64; x++) {
                this.setupWorld(x, y);
                const tile = this.map1(x, y);
                switch (tile) {
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                        this.spawnPlayer(x, y, tile);
                        break;
                }
            }
        }
    }

    private spawnPlayer(x: number, y: number, m1: number): void {
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

    private setupTileMapAndEntityMap(): void {
        this.tileMap = [];
        this.entityLocations = [];
        for (let i = 0; i < 64; i++) {
            const line = Array(64);
            line.fill(0);
            this.tileMap.push(line);
            const x = Array(64);
            x.fill(undefined);
            this.entityLocations.push(x);
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
