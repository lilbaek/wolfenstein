import {GameAssets} from './Game/game-assets';
import {Game} from './Game/game';

export class Wolf {
    private gameAssets = new GameAssets();
    private canvas: HTMLCanvasElement;
    private game: Game;
    private keys: any = {};

    public async run(): Promise<void> {
        await this.gameAssets.loadResources();
        this.canvas = document.createElement('canvas') as HTMLCanvasElement;
        this.game = new Game(this.canvas, this.gameAssets);
        document.body.appendChild(this.canvas);
        this.game.initialize();
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
        this.game.update(this.keys);
        this.game.draw();
        requestAnimationFrame(this.tick);
    }
}
