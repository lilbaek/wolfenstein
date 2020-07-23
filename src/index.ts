import {Wolf} from './wolf';

window.onload = function (): void {
    const wolf = new Wolf();
    wolf.run().catch(x => {
        console.error(x);
    });
};
