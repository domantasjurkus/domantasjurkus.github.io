// constants
var KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN=40;
var KEY_SPACE = 32;
var KEY_R = 82;
var ROWS = 19;
var COLS = 29;
var SQR = 30;
var SCREEN_WIDTH = COLS*SQR;
var SCREEN_HEIGHT = ROWS*SQR + 100;
var INFO_HEIGHT = 100;
var START_POS_X = Math.round(COLS/2);
var START_POS_Y = Math.round(ROWS/2);
var OBST_ANIM_SPEED = 12;

// game globals
var canvas, ctx, keystate, frames;
var zombie_count, obstacle_count;
var key_down;
var zombies_moved;
var step_done;
var step_count;
var score;
var highscore;
var isGameOver;
var isGameKeyPressed;
var isTeleportDone;
var zomb_array, obst_array;

// graphics and sound globals
var background, player_img_list, zombie_img_list;
var obst_img_list, obst_frame;
var splash_img;
var music, radar_sound, tele_sound, death_sound;