import {GameAssets} from './Game/game-assets';
import {Renderer} from './Rendering/renderer';

export class Wolf {
    private gameAssets = new GameAssets();
    private canvas: HTMLCanvasElement;
    private renderer: Renderer;
    private keys: any = {};

    public async run(): Promise<void> {
        await this.gameAssets.loadResources();
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.renderer = new Renderer(this.canvas, this.gameAssets);
        document.body.appendChild(this.canvas);
        this.tick = this.tick.bind(this);
        this.tick();
        document.onkeydown = ev => {
            ev.preventDefault();
            this.keys[ev.key] = true;
        };
        document.onkeyup = ev => {
            ev.preventDefault();
            this.keys[ev.key] = false;
        };
    }

    private tick(): void {
        this.renderer.update(this.keys);
        this.renderer.draw();
        requestAnimationFrame(this.tick);
    }
}
