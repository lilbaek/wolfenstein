import {Map} from './map';
import {TileType} from './tile-type';

export class Player {
    /// <summary>
    /// X position
    /// </summary>
    public x: number;
    /// <summary>
    /// Y position
    /// </summary>
    public y: number;
    /// <summary>
    /// Facing direction x
    /// </summary>
    public dx: number;
    /// <summary>
    /// Facing direction y
    /// </summary>
    public dy: number;
    /// <summary>
    /// Walking speed
    /// </summary>
    public speed = 0.065;
    /// <summary>
    /// Turning speed
    /// </summary>
    public speedA = 0.05;
    /// <summary>
    /// Player radius
    /// </summary>
    public radius = 0.25;
    private map: Map;

    constructor(map: Map) {
        this.map = map;
    }

    public turn(alpha: number): void {
        const dx = this.dx * Math.cos(alpha) - this.dy * Math.sin(alpha);
        this.dy = (this.dx * Math.sin(alpha) + this.dy * Math.cos(alpha));
        this.dx = dx;
    }

    public getPositionInWorld(): { worldX: number, worldY: number, dx: number, dy: number } {
        let worldX = ~~this.x;
        let worldY = ~~this.y;
        let dx = 0;
        let dy = 0;
        if (Math.abs(this.dx) >= Math.abs(this.dy)) {
            dx = this.dx >= 0 ? 1 : -1;
            worldX += dx;
        } else {
            dy = this.dy >= 0 ? 1 : -1;
            worldY += dy;
        }
        return {
            worldX,
            worldY,
            dx,
            dy
        };
    }

    public move(length: number): void {
        const x = this.x + this.dx * length;
        const y = this.y + this.dy * length;
        if (this.canMoveTo(x, this.y)) {
            this.x = x;
        }
        if (this.canMoveTo(this.x, y)) {
            this.y = y;
        }
    }

    private canMoveTo(x: number, y: number): boolean {
        const r = this.radius;
        const fx = x % 1;
        const xi = ~~x;
        const fy = y % 1;
        const yi = ~~y;
        if (this.canMoveInto(xi, yi)) {
            return false;
        }
        //Check if we are getting too close to a wall/solid/entity
        if (fx < r) {
            if (this.canMoveInto(xi - 1, yi)) {
                return false;
            }
            if (fy < r && this.canMoveInto(xi - 1, yi - 1)) {
                return false;
            }
            if (fy > 1 - r && this.canMoveInto(xi - 1, yi + 1)) {
                return false;
            }
        }
        if (fx > 1 - r) {
            if (this.canMoveInto(xi + 1, yi)) {
                return false;
            }
            if (fy < r && this.canMoveInto(xi + 1, yi - 1)) {
                return false;
            }
            if (fy > 1 - r && this.canMoveInto(xi + 1, yi + 1)) {
                return false;
            }
        }
        if (fy < r && this.canMoveInto(xi, yi - 1)) {
            return false;
        }
        if (fy > 1 - r && this.canMoveInto(xi, yi + 1)) {
            return false;
        }
        return true;
    }

    private canMoveInto(x: number, y: number): boolean {
        //Check if we are allowed to pass trough a door
        if (this.map.doors.containsKey(x.toFixed() + y.toFixed())) {
            const door = this.map.doors.get(x.toFixed() + y.toFixed());
            return !door.isOpen;
        }
        //Check impassable tile types
        const tileType = this.map.tileMap[x][y];
        const blocking = tileType === TileType.WALL_TILE || tileType === TileType.BLOCK_TILE || tileType === TileType.PUSHWALL_TILE;
        if (blocking) {
            return true;
        }
        //Check entities
        if (this.map.entityLocations[x][y] !== undefined) {
            return true;
        }
        return false;
    }

    public handleInput(keys: any): void {
        if (keys['ArrowRight']) {
            this.turn(this.speedA);
        }
        if (keys['ArrowLeft']) {
            this.turn(-this.speedA);
        }
        if (keys['ArrowUp']) {
            this.move(this.speed);
        }
        if (keys['ArrowDown']) {
            this.move(-this.speed);
        }
    }
}
