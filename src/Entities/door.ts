import {DoorType} from '../Defs/door-type';

export class Door {

    public x: number;
    public y: number;
    public isOpen: boolean;
    public Type: DoorType;
    public Vertical: boolean;
    public TextureIndex: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.isOpen = true;
    }


}
