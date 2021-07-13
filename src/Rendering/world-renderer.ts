import {palette} from '../Defs/palette';
import {GameAssets} from '../Game/game-assets';
import {Map} from '../Game/map';
import {Player} from '../Game/player';

export class WorldRenderer {
    private gameAssets: GameAssets;
    private readonly gameWidth: number;
    private readonly gameHeight: number;
    private map: Map;
    private player: Player;
    private fov = 1;
    private wallHeight: number;
    /**
     * Array containing distance of wall for each pixel column on screen
     */
    public zIndex: Array<number>;
    constructor(gameAssets: GameAssets, map: Map, gameWidth: number, gameHeight: number) {
        this.gameAssets = gameAssets;
        this.map = map;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.wallHeight = this.gameWidth / (2 * this.fov);
        this.player = this.map.player;
        this.zIndex = [];
    }

    public draw(data: DataView): void {
        for (let i = 0; i < this.gameWidth; i++) {
            let isPushwall = false;  // remember if wall is a pushwall to be able to draw it differently if needed
            // cast a ray for each screen column
            // current column position on the camera plane
            const shift = this.fov * ((i << 1) - this.gameWidth) / this.gameWidth;
            // direction of the ray
            let rdx = this.player.dx - shift * this.player.dy;
            let rdy = this.player.dy + shift * this.player.dx;
            // screen point coordinates in the direction of the ray
            const sx = this.player.x + rdx;
            const sy = this.player.y + rdy;
            // direction in which the ray moves along each axis
            const stepx = rdx >= 0 ? 1 : -1;
            const stepy = rdy >= 0 ? 1 : -1;
            // take absolute values of ray direction
            rdx = stepx * rdx;
            rdy = stepy * rdy;
            // map position of the ray on the map (starting from the this.player position)
            let cx = ~~this.player.x;
            let cy = ~~this.player.y;
            // remaining fractional distance from the ray position to the next cell (0 < rfx, rfy <= 1)
            let rfx = stepx > 0 ? 1 - (this.player.x % 1) : this.player.x % 1;
            if (rfx === 0) {
                rfx = 1;
                cx += stepx;
            }
            let rfy = stepy > 0 ? 1 - (this.player.y % 1) : this.player.y % 1;
            if (rfy === 0) {
                rfy = 1;
                cy += stepy;
            }
            // location of the ray collision on a solid surface
            let rx,
                ry;
            // total time traveled by the ray
            let t = 0;
            // plane0 value of the cell visited by the ray
            let m0;
            // coordinate on the wall tile where the ray hit (0 <= tx <= 1)
            let tx;
            // index of tile to display
            let textureIndex;
            while (true) {
                m0 = this.map.map0(cx, cy);
                if (m0 <= 63) {
                    // hit a wall
                    let wallShift = 0;
                    if (this.map.map1(cx, cy) === 98) {
                        isPushwall = true;
                        // pushwall
                        let timer: any;
                        timer = undefined;
                        /*
                        let timer = wallTimers.find(function (obj) {
                            return obj.x === cx && obj.y === cy;
                        });*/
                        if (timer !== undefined) {
                            wallShift = timer.t / 64;
                            if (timer.dx !== 0) {
                                // wall moves horizontally
                                if (rdx * rfy >= rdy * wallShift) {
                                    // ray hits wall
                                    const dt = wallShift / rdx;
                                    t += dt;
                                    rfy -= dt * rdy;
                                    rfx -= wallShift;
                                } else {
                                    // ray moves to next cell
                                    isPushwall = false;
                                    const dt = rfy / rdy;
                                    t += dt;
                                    rfy = 1;
                                    cy += stepy;
                                    rfx -= dt * rdx;
                                    continue;
                                }
                            } else {
                                // wall moves vertically
                                if (rdy * rfx >= rdx * wallShift) {
                                    // ray hits wall
                                    const dt = wallShift / rdy;
                                    t += dt;
                                    rfx -= dt * rdx;
                                    rfy -= wallShift;
                                } else {
                                    // ray moves to next cell
                                    isPushwall = false;
                                    const dt = rfx / rdx;
                                    t += dt;
                                    rfx = 1;
                                    cx += stepx;
                                    rfy -= dt * rdy;
                                    continue;
                                }
                            }
                        }
                    }
                    if (rfx === 1 - wallShift) {
                        // NS wall
                        textureIndex = 2 * m0 - 1;
                        // fix texture orientation depending on ray direction
                        tx = stepx * stepy > 0 ? 1 - rfy : rfy;
                    } else {
                        // EW wall
                        textureIndex = 2 * m0 - 2;
                        // fix texture orientation depending on ray direction
                        tx = stepx * stepy < 0 ? 1 - rfx : rfx;
                    }
                    break;
                } else if (m0 <= 101) {
                    // hit a door
                    const door = this.map.doors.get(cx.toFixed() + cy.toFixed());
                    let doorShift = 0;
                    const timer = door.getTimer();
                    if (timer) {
                        if (timer.opening) {
                            doorShift = timer.t / 64;
                        } else {
                            doorShift = 1 - timer.t / 64;
                        }
                    }
                    if (door.isOpen) {
                        doorShift = 1;
                    }
                    if (m0 % 2 === 0) {
                        // NS door
                        if (rfx >= .5 && (rfx - .5) * rdy < rfy * rdx) {
                            // ray hits the central door line
                            const dt = (rfx - .5) / rdx;
                            t += dt;
                            rfy -= dt * rdy;
                            rfx = .5;
                            tx = stepy > 0 ? 1 - rfy : rfy;
                            tx -= doorShift;
                            if (tx >= 0) {
                                // ray hits the door
                                switch (m0) {
                                    case 90:
                                        textureIndex = 99;
                                        break;
                                    case 92:
                                        textureIndex = 105;
                                        break;
                                    case 94:
                                        textureIndex = 105;
                                        break;
                                    case 100:
                                        textureIndex = 103;
                                        break;
                                }
                                break;
                            }
                        }
                        if (rfx * rdy >= rfy * rdx) {
                            // hit the side wall
                            const dt = rfy / rdy;
                            t += dt;
                            rfx -= dt * rdx;
                            rfy = 1;
                            cy += stepy;
                            textureIndex = 100;
                            tx = stepx > 0 ? 1 - rfx : rfx;
                            break;
                        } else {
                            // pass through
                            const dt = rfx / rdx;
                            t += dt;
                            rfy -= dt * rdy;
                            rfx = 1;
                            cx += stepx;
                        }
                    } else {
                        // EW door
                        if (rfy >= .5 && (rfy - .5) * rdx < rfx * rdy) {
                            // ray hits the central door line
                            const dt = (rfy - .5) / rdy;
                            t += dt;
                            rfx -= dt * rdx;
                            rfy = .5;
                            tx = stepx > 0 ? 1 - rfx : rfx;
                            tx -= doorShift;
                            if (tx >= 0) {
                                // ray hits the door
                                switch (m0) {
                                    case 91:
                                        textureIndex = 98;
                                        break;
                                    case 93:
                                        textureIndex = 104;
                                        break;
                                    case 95:
                                        textureIndex = 104;
                                        break;
                                    case 101:
                                        textureIndex = 102;
                                        break;
                                }
                                break;
                            }
                        }
                        if (rfy * rdx >= rfx * rdy) {
                            // hit the side wall
                            const dt = rfx / rdx;
                            t += dt;
                            rfy -= dt * rdy;
                            rfx = 1;
                            cx += stepx;
                            textureIndex = 101;
                            tx = stepy > 0 ? 1 - rfy : rfy;
                            break;
                        } else {
                            // pass through
                            const dt = rfy / rdy;
                            t += dt;
                            rfx -= dt * rdx;
                            rfy = 1;
                            cy += stepy;
                        }
                    }
                }
                // move to the next cell
                if (rfx * rdy <= rfy * rdx) {
                    // move to next cell horizontally
                    const dt = rfx / rdx;
                    t += dt;
                    rfx = 1;
                    cx += stepx;
                    rfy -= dt * rdy;
                } else {
                    // move to next cell vertically
                    const dt = rfy / rdy;
                    t += dt;
                    rfy = 1;
                    cy += stepy;
                    rfx -= dt * rdx;
                }
            }
            // compute ray location
            rx = stepx > 0 ? cx + 1 - rfx : cx + rfx;
            ry = stepy > 0 ? cy + 1 - rfy : cy + rfy;
            const h = this.wallHeight / (2 * t); // height of the line representing the wall on the current column
            this.zIndex[i] = t;
            let yi = ~~(this.gameHeight / 2 - h);
            let yf = (this.gameHeight / 2 - h) % 1;
            const stepi = ~~(h / 32);
            const stepf = (h / 32) % 1;
            const texelOffset = this.map.wallTextureOffset + 4096 * textureIndex + 64 * ~~(64 * tx);
            for (let j = 0; j <= yi; j++) {
                data.setUint32((this.gameWidth * j + i) << 2, palette[29], true);
                data.setUint32((this.gameWidth * (this.gameHeight - 1 - j) + i) << 2, palette[25], true);
            }
            for (let j = texelOffset; j < texelOffset + 64; j++) {
                let col;
                col = palette[this.gameAssets.wsMap.getUint8(j)];
                yf += stepf;
                if (yf >= 1) {
                    for (let k = Math.max(0, yi); k < Math.min(this.gameHeight, yi + stepi + 1); k++) {
                        data.setUint32((this.gameWidth * k + i) << 2, col, true);
                    }
                    yi += stepi + 1;
                    yf -= 1;
                } else {
                    for (let k = Math.max(0, yi); k < Math.min(this.gameHeight, yi + stepi); k++) {
                        data.setUint32((this.gameWidth * k + i) << 2, col, true);
                    }
                    yi += stepi;
                }
            }
        }
    }
}
