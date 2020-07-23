import {Map} from './map';

export class GameAssets {
    public wsMap: DataView;
    private wallTextureOffset: number;
    private gameMaps: ArrayBuffer;
    private mapHead: ArrayBuffer;

    public loadResources(): Promise<any> {
        const gamemapsPromise = this.getBinaryFile('GAMEMAPS.WL6');
        const mapheadPromise = this.getBinaryFile('MAPHEAD.WL6');
        const vswapPromise = this.getBinaryFile('VSWAP.WL6');
        gamemapsPromise.then(req => this.gameMaps = req);
        mapheadPromise.then(req => this.mapHead = req);
        vswapPromise.then(req => {
            this.wsMap = new DataView(req);
            this.wallTextureOffset = this.wsMap.getUint32(6, true);
        });
        return Promise.all([gamemapsPromise, mapheadPromise, vswapPromise]);
    }

    private getBinaryFile(url: string): Promise<ArrayBuffer> {
        return new Promise(resolve => {
            const req = new XMLHttpRequest();
            req.onload = () => resolve(req.response);
            req.responseType = 'arraybuffer';
            req.open('GET', url);
            req.send();
        });
    }

    public loadLevel(level: number): Map {
        const mapHeadView = new DataView(this.mapHead);
        const offset = mapHeadView.getUint32(2 + 4 * level, true);
        const mapHeader = new DataView(this.gameMaps, offset, 42);
        const plane0View = new DataView(
            this.gameMaps,
            mapHeader.getUint32(0, true),
            mapHeader.getUint16(12, true),
        );
        const plane0 = this.rlewDecode(this.carmackDecode(plane0View));
        const plane1View = new DataView(
            this.gameMaps,
            mapHeader.getUint32(4, true),
            mapHeader.getUint16(14, true),
        );
        const plane1 = this.rlewDecode(this.carmackDecode(plane1View));
        const map = new Map(plane0, plane1, this.wallTextureOffset);
        map.setup();
        return map;
    }

    /**
     * Decode a RLEW-encoded sequence of bytes
     */
    public rlewDecode(inView: DataView): DataView {
        const mapHeadView = new DataView(this.mapHead);
        const rlewTag = mapHeadView.getUint16(0, true);
        const size = inView.getUint16(0, true);
        const buffer = new ArrayBuffer(size);
        const outView = new DataView(buffer);
        let inOffset = 2;
        let outOffset = 0;
        while (inOffset < inView.byteLength) {
            const w = inView.getUint16(inOffset, true);
            inOffset += 2;
            if (w === rlewTag) {
                const n = inView.getUint16(inOffset, true);
                const x = inView.getUint16(inOffset + 2, true);
                inOffset += 4;
                for (let i = 0; i < n; i++) {
                    outView.setUint16(outOffset, x, true);
                    outOffset += 2;
                }
            } else {
                outView.setUint16(outOffset, w, true);
                outOffset += 2;
            }
        }
        return outView;
    }

    /**
     * Decode a Carmack-encoded sequence of bytes
     */
    public carmackDecode(inView: DataView): DataView {
        const size = inView.getUint16(0, true);
        const buffer = new ArrayBuffer(size);
        const outView = new DataView(buffer);
        let inOffset = 2;
        let outOffset = 0;
        while (inOffset < inView.byteLength) {
            const x = inView.getUint8(inOffset + 1);
            if (x === 0xA7 || x === 0xA8) {
                // possibly a pointer
                const n = inView.getUint8(inOffset);
                if (n === 0) {
                    // exception (not really a pointer)
                    outView.setUint8(outOffset, inView.getUint8(inOffset + 2));
                    outView.setUint8(outOffset + 1, x);
                    inOffset += 3;
                    outOffset += 2;
                } else if (x === 0xA7) {
                    // near pointer
                    const offset = 2 * inView.getUint8(inOffset + 2);
                    for (let i = 0; i < n; i++) {
                        outView.setUint16(outOffset, outView.getUint16(outOffset - offset, true), true);
                        outOffset += 2;
                    }
                    inOffset += 3;
                } else {
                    // far pointer
                    const offset = 2 * inView.getUint16(inOffset + 2, true);
                    for (let i = 0; i < n; i++) {
                        outView.setUint16(outOffset, outView.getUint16(offset + 2 * i, true), true);
                        outOffset += 2;
                    }
                    inOffset += 4;
                }
            } else {
                // not a pointer
                outView.setUint16(outOffset, inView.getUint16(inOffset, true), true);
                inOffset += 2;
                outOffset += 2;
            }
        }
        return outView;
    }
}
