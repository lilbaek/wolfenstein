import {WolfConst} from './wolf-const';
export const DoorConsts = {
    CLOSEWALL       : WolfConst.MINDIST, // Space between wall & player
    MAXDOORS        : 64,           // max number of sliding doors

    MAX_DOORS       : 256, // jseidelin: doesn't look like this is used?
    DOOR_TIMEOUT    : 300,
    DOOR_MINOPEN    : 50,
    DOOR_FULLOPEN   : 63,
    DOOR_VERT       : 255,
    DOOR_HORIZ      : 254,
    DOOR_E_VERT     : 253,
    DOOR_E_HORIZ    : 252,
    DOOR_G_VERT     : 251,
    DOOR_G_HORIZ    : 250,
    DOOR_S_VERT     : 249,
    DOOR_S_HORIZ    : 248,
    FIRST_DOOR      : 248,
    LAST_LOCK       : 251,

    TEX_DOOR        : 98,
    // TEX_DOOR        : 126,

    dr_closing      : -1,
    dr_closed       : 0,
    dr_opening      : 1,
    dr_open         : 2,

    TEX_DDOOR       : (0 + 98), // Simple Door
    TEX_PLATE       : (2 + 98), // Door Plate
    TEX_DELEV       : (4 + 98), // Elevator Door
    TEX_DLOCK        : (6 + 98)  // Locked Door
}
