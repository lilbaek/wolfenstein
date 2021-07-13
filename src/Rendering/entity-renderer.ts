import {palette} from '../Defs/palette';
import {GameAssets} from '../Game/game-assets';
import {Map} from '../Game/map';
import {Player} from '../Game/player';
import {WorldRenderer} from './world-renderer';

export class EntityRenderer {
    private gameAssets: GameAssets;
    private readonly gameWidth: number;
    private readonly gameHeight: number;
    private map: Map;
    private player: Player;
    private worldRenderer: WorldRenderer;
    private fov = 1;
    private wallHeight: number;

    constructor(gameAssets: GameAssets, map: Map, gameWidth: number, gameHeight: number, worldRenderer: WorldRenderer) {
        this.worldRenderer = worldRenderer;
        this.gameAssets = gameAssets;
        this.map = map;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.wallHeight = this.gameWidth / (2 * this.fov);
        this.player = this.map.player;
    }

    public draw(data: DataView, entities: Array<IEntity>): void {
        for (let i = 0; i < entities.length; i++) {
            const t = entities[i];
            if (t.rx < this.map.player.radius) {
                // thing is behind the screen
                continue;
            } else if (Math.abs(t.ry) > t.rx + 1) {
                // thing is out of field of view
                continue;
            }
            const th = this.wallHeight / t.rx;
            const tx = ~~((t.ry / t.rx + this.fov) * this.wallHeight - th / 2);
            const ty = ~~((this.gameHeight - th) / 2);
            let index = t.spriteIndex;
            if (t.orientable) {
                index += (Math.round(4 * Math.atan2(t.x - this.map.player.x, t.y - this.map.player.y) / Math.PI - t.direction) + 16) % 8;
            }
            this.drawSprite(data, index, tx, ty, th, t.rx);
        }
    }

    /**
     * Draw a sprite on screen
     * @param data draw target
     * @param index index of the sprite texture
     * @param x x-coordinate of the top-left corner of the rendered sprite
     * @param y y-coordinate of the top-left corner of the rendered sprite
     * @param height height of the rendered sprite in pixels
     * @param dist distance from player (if sprite is farther than zIndex, column is not drawn)
     */
    private drawSprite(data: DataView, index: number, x: number, y: number, height: number, dist: number = 0): void {
        const scale = Math.ceil(height / 64);
        const firstSprite = this.gameAssets.wsMap.getUint16(2, true);
        const spriteOffset = this.gameAssets.wsMap.getUint32(6 + 4 * (firstSprite + index), true);
        const firstCol = this.gameAssets.wsMap.getUint16(spriteOffset, true);
        const lastCol = this.gameAssets.wsMap.getUint16(spriteOffset + 2, true);
        const nbCol = lastCol - firstCol + 1;
        let pixelPoolOffset = spriteOffset + 4 + 2 * nbCol;
        for (let col = firstCol; col <= lastCol; col++) {
            let colOffset = spriteOffset + this.gameAssets.wsMap.getUint16(spriteOffset + 4 + 2 * (col - firstCol), true);
            while (true) {
                const endRow = this.gameAssets.wsMap.getUint16(colOffset, true) / 2;
                if (endRow === 0) {
                    break;
                }
                const startRow = this.gameAssets.wsMap.getUint16(colOffset + 4, true) / 2;
                colOffset += 6;
                for (let row = startRow; row < endRow; row++) {
                    this.drawScaledPixel(
                        data,
                        x + ~~(col * height / 64),
                        y + ~~(row * height / 64),
                        this.gameAssets.wsMap.getUint8(pixelPoolOffset),
                        scale,
                        dist
                    );
                    pixelPoolOffset += 1;
                }
            }
        }
    }

    /**
     * Draw a scaled pixel on the canvas. A pixel will cover a square of scale x scale pixels on the canvas,
     * @param data draw target
     * @param x x-coordinate of the top left corner of the square
     * @param y y-coordinate of the top left corner of the square
     * @param palCol palette index of the color
     * @param scale scale of the pixel
     * @param dist (optional) distance of the object that contains the pixel. If the distance is larger than the
     * zIndex for a given column, no pixel will be drawn on the canvas
     */
    private drawScaledPixel(data: DataView, x: number, y: number, palCol: number, scale: number, dist: number = 0): void {
        if (palCol !== undefined) {
            const color = palette[palCol];
            for (let col = x >= 0 ? x : 0; col < x + scale && col < this.gameWidth; col++) {
                if (dist >= this.worldRenderer.zIndex[col]) {
                    // sprite is hidden on this column
                    continue;
                }
                for (let row = y >= 0 ? y : 0; row < y + scale && row < this.gameWidth; row++) {
                    try {
                        data.setUint32((this.gameWidth * row + col) << 2, color, true);
                    } catch (e) {
                       // console.log(e);
                    }
                }
            }
        }
    }
}
