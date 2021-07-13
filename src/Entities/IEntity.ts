interface IEntity {
    /*
     * X map location
     */
    x: number;
    /*
     * Y map location
     */
    y: number;
    /**
     * Relative x-coordinate in the player's reference frame
     */
    rx: number;
    /**
     * Relative y-coordinate in the player's reference frame
     */
    ry: number;
    spriteIndex: number;
    /**
     * Whether the thing can be collected by the player (ammunition, weapon, food, treasure, 1up)
     */
    collectible: boolean;
    /**
     * Whether the thing has different sprites depending on orientation
     */
    orientable: boolean;
    /**
     * Whether the thing blocks player movement
     */
    blocking: boolean;
    /**
     * Facing direction (0: North, 1: East, 2: South, 3: West)
     */
    direction: number;
    /**
     * Start executing a sprite animation (change current sprite at regular intervals)
     */
    startAnimation(animation: any): void;
    /**
     * Update necessary attributes each frame:
     * - relative coordinates from player's perspective
     * - possible animation values
     */
    tick(): void;
    update(keys: any): void;
}
