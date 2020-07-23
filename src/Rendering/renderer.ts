import {GameAssets} from '../Game/game-assets';
import {WorldRenderer} from './world-renderer';

export class Renderer {
    private gameWidth = 640;
    private gameHeight = 400;
    private context: CanvasRenderingContext2D;
    private imageData: ImageData;
    private pixels: DataView;
    private canvas: HTMLCanvasElement;
    private gameAssets: GameAssets;
    private worldRenderer: WorldRenderer;

    constructor(canvas: HTMLCanvasElement, gameAssets: GameAssets) {
        this.canvas = canvas;
        this.gameAssets = gameAssets;
        this.canvas.width = this.gameWidth;
        this.canvas.height = this.gameHeight;
        this.context = this.canvas.getContext('2d', {alpha: false});
        this.imageData = new ImageData(this.gameWidth, this.gameHeight);
        this.pixels = new DataView(this.imageData.data.buffer);
        this.worldRenderer = new WorldRenderer(gameAssets, this.gameWidth, this.gameHeight);

    }

    public update(keys: any): void {
        this.worldRenderer.update(keys);
    }

    public draw(): void {
        this.worldRenderer.draw(this.pixels);
        this.context.putImageData(this.imageData, 0, 0);
        this.context.drawImage(this.canvas, 0, 0);
    }
}
