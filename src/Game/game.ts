import {Door} from '../Entities/door';
import {GameAssets} from '../Game/game-assets';
import {WorldRenderer} from '../Rendering/world-renderer';
import {Map} from './map';
import {Player} from './player';

export class Game {
    private gameWidth = 640;
    private gameHeight = 400;
    private context: CanvasRenderingContext2D;
    private imageData: ImageData;
    private pixels: DataView;
    private canvas: HTMLCanvasElement;
    private gameAssets: GameAssets;
    private worldRenderer: WorldRenderer;
    private player: Player;
    private map: Map;

    constructor(canvas: HTMLCanvasElement, gameAssets: GameAssets) {
        this.canvas = canvas;
        this.gameAssets = gameAssets;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        this.context = this.canvas.getContext('2d', {alpha: false});
        this.imageData = new ImageData(this.gameWidth, this.gameHeight);
        this.pixels = new DataView(this.imageData.data.buffer);
    }

    public initialize(): void {
        this.map = this.gameAssets.loadLevel(0);
        this.player = this.map.player;
        this.worldRenderer = new WorldRenderer(this.gameAssets, this.map, this.gameWidth, this.gameHeight);
    }

    public update(keys: any): void {
        this.player.handleInput(keys);
        this.map.handleInput(keys);
        this.map.tick();
    }

    public draw(): void {
        this.worldRenderer.draw(this.pixels);
        this.context.putImageData(this.imageData, 0, 0);
        this.context.drawImage(this.canvas, 0, 0);
    }
}
