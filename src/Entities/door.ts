import {DoorType} from '../Defs/door-type';
import {Player} from '../Game/player';

export class Door {
    public x: number;
    public y: number;
    public isOpen: boolean;
    public Type: DoorType;
    public Vertical: boolean;
    public TextureIndex: number;
    private player: Player;
    private timer: { x: number, y: number, t: number, opening: boolean };

    constructor(x: number, y: number, player: Player) {
        this.x = x;
        this.y = y;
        this.player = player;
    }

    public tick(): void {
        const timer = this.timer;
        if (timer) {
            timer.t += 1;
            if (timer.t > 64) {
                this.isOpen = timer.opening;
                this.timer = undefined;
            }
        }
    }

    public update(keys: any): void {
        if (keys[' ']) {
            if (!this.timer) {
                const player = this.player;
                const pW = this.player.getPositionInWorld();
                if (this.x !== pW.worldX || this.y !== pW.worldY) {
                    return;
                }
                let opening = true;
                if (this.isOpen) {
                    // Validate if player is too close to the door
                    if ((pW.dx > 0 && pW.worldX - player.x <= player.radius) ||
                        (pW.dx < 0 && player.x - pW.worldX - 1 <= player.radius) ||
                        (pW.dy > 0 && pW.worldY - player.y <= player.radius) ||
                        (pW.dy < 0 && player.y - pW.worldY - 1 <= player.radius)) {
                        return;
                    } else {
                        // the door closes (it becomes blocking immediately)
                        opening = false;
                        this.isOpen = false;
                    }
                }
                this.timer = {
                    x: pW.worldX,
                    y: pW.worldY,
                    t: 0,
                    opening: opening
                };
            }
        }
    }

    public getTimer(): { x: number, y: number, t: number, opening: boolean } {
        return this.timer;
    }
}
