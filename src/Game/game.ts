import {GameAssets} from '../Game/game-assets';
import {EntityRenderer} from '../Rendering/entity-renderer';
import {WorldRenderer} from '../Rendering/world-renderer';
import {EntitySpawner} from './entity-spawner';
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
    private entityRenderer: EntityRenderer;
    private player: Player;
    private map: Map;
    private entitySpawner: EntitySpawner;
    private entities: Array<IEntity>;

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
        this.entityRenderer = new EntityRenderer(this.gameAssets, this.map, this.gameWidth, this.gameHeight, this.worldRenderer);
        this.entitySpawner = new EntitySpawner(this.map.plane0, this.map.plane1);
        this.entities = this.entitySpawner.setup(this.map);
    }

    public update(keys: any): void {
        this.player.handleInput(keys);
        this.map.handleInput(keys);
        this.map.tick();
        this.entities.forEach((e) => {
            e.update(keys);
            e.tick();
        });
    }

    public draw(): void {
        this.worldRenderer.draw(this.pixels);
        this.entityRenderer.draw(this.pixels, this.entities);
        this.context.putImageData(this.imageData, 0, 0);
        this.context.drawImage(this.canvas, 0, 0);
    }
}
