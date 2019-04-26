function initGame(){
	// game canvas
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;
	ctx.width = SCREEN_WIDTH;
	ctx.height = SCREEN_HEIGHT;

	keystate = {};

	// retrieve highscore from cookie
	highscore = getCookie("highscore");

	// load background graphics
	background = new Image();
	background.src = "images/background.png";
	// load player images
	player_img_list = []
	for (var i = 1; i <= 4; i++){
		file_name = "images/player/player_0" + i + ".png";
		var player_img = new Image();
		player_img.src = file_name;
		player_img_list.push(player_img);
	}
	// load zombie images
	zombie_img_list = []
	for (var i = 1; i <= 4; i++){
		file_name = "images/zombie/zombie_0" + i + ".png";
		var zombie_img = new Image();
		zombie_img.src = file_name;
		zombie_img_list.push(zombie_img);
	}
	// obstacle image list
	obst_img_list = [];
	obst_frame = 0;
	for (var i = 1; i <= 4; i++){
		file_name = "images/obstacle/obst_0" + i + ".png";
		var obst_img = new Image();
		obst_img.src = file_name;
		obst_img_list.push(obst_img);
	}
	// splash
	splash_img = new Image();
	splash_img.src = "images/splash.jpg";

	// load sound
	music = new Audio('sound/music.ogg');
	radar_sound = new Audio('sound/radar.ogg');
	tele_sound = new Audio('sound/rep.ogg');
	death_sound = new Audio('sound/death.ogg');

	// set primary class properties
	player.img = player_img_list[player.dir];	

	//wait for keydown/keyup
	window.addEventListener("keydown", function(evt) {
			keystate[evt.keyCode] = true;
			// prevent screen from scrolling
	        switch(evt.keyCode){
	            case 37: case 39: case 38:  case 40:   // Arrow keys
	            case 32: evt.preventDefault(); break;  // Space
	            default: break;
	        }
	});
	window.addEventListener("keyup", function(evt) {
			delete keystate[evt.keyCode];
	});

	window.onload = function() {
		ctx.drawImage(splash_img, 0, 0);
		splashScreen();
	}
}

function splashScreen(){
	ctx.font = "32px Lucida console";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText("Zombocalypso", SCREEN_WIDTH/2, SCREEN_HEIGHT/2-50);

	ctx.font = "20px Lucida console";
	ctx.fillStyle = "white";
	ctx.fillText("move with arrow keys", SCREEN_WIDTH/2, SCREEN_HEIGHT/2+30);
	ctx.fillText("teleport with spacebar", SCREEN_WIDTH/2, SCREEN_HEIGHT/2+60);
	ctx.fillText("press space to play", SCREEN_WIDTH/2, SCREEN_HEIGHT/2+130);

	if (keystate[KEY_SPACE]) {
		initFirstLevel();
		return;
	}

	window.requestAnimationFrame(splashScreen);
}

function initFirstLevel(){
	// assign values to global variables
	frames = 0;
	zombie_count = 7;
	obstacle_count = 15;
	step_done = false;
	step_count = 0;
	score = 0;
	isGameOver = false;
	isTeleportDone = false;
	zomb_array = [];
	obst_array = [];

	// loop music
	music.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	music.play();

	// reset death sound
	death_sound.pause();
	death_sound.currentTime = 0;

	player.init();
	generateObstacles(obstacle_count);
	initLevel();
	loop();
}

function initLevel(){
	generateZombies(zombie_count);
	player.updateTeleport();
	draw();
}

function generateObstacles(count){
	// for debugging
	/*for (var i = 0; i < count+10; i++){
		x_pos = i + 5;
		y_pos = 4;
		var obstacle = new Obstacle(x_pos, y_pos);
		obst_array.push(obstacle);
	}*/
	for (var i = 0; i < count; i++){
		var x_pos = Math.floor(Math.random()*COLS);
		var y_pos = Math.floor(Math.random()*ROWS);
		// distance between player and obstacle
		var dist_x = Math.abs(player.x_pos - x_pos);
		var dist_y = Math.abs(player.y_pos - y_pos);
		// regenerate coordinates if too close to player
		while ((dist_x < 3) || (dist_y < 3)) {
			x_pos = Math.floor(Math.random()*COLS);
			y_pos = Math.floor(Math.random()*ROWS);
			dist_x = Math.abs(player.x_pos - x_pos);
			dist_y = Math.abs(player.x_pos - x_pos);
		}
		var obstacle = new Obstacle(x_pos, y_pos);
		obst_array.push(obstacle);
	}
}

function generateZombies(count){
	// for debugging
	/*for (var i = 0; i < count; i++){
		var x_pos = i + 5;
		var y_pos = 3;
		var zombie = new Zombie(x_pos, y_pos, zombie_img_list[0], 0);
		zombie.init = i
		zomb_array.push(zombie);
	}*/
	for (var i = 0; i < count; i++){
		var x_pos = Math.floor(Math.random()*COLS);
		var y_pos = Math.floor(Math.random()*ROWS);
		// distance between player and zombie
		var dist_x = Math.abs(player.x_pos - x_pos);
		var dist_y = Math.abs(player.y_pos - y_pos);
		// regenerate coordinates if too close to player
		while ((dist_x < 6) && (dist_y < 5)) {
			x_pos = Math.floor(Math.random()*COLS);
			y_pos = Math.floor(Math.random()*ROWS);
			dist_x = Math.abs(player.x_pos - x_pos);
			dist_y = Math.abs(player.y_pos - y_pos);
		}
		// regenerate coordinates if on top of an obstacle
		for (var o in obst_array){
			while ((x_pos == obst_array[o].x_pos)&&
				  (y_pos == obst_array[o].y_pos)) {
				x_pos = Math.floor(Math.random()*ROWS);
				y_pos = Math.floor(Math.random()*COLS);
			}
		}
		var zombie = new Zombie(x_pos, y_pos, zombie_img_list[0], 0);
		zomb_array.push(zombie);
	}
}

function loop(){
	// animate obstacles
	if (frames%OBST_ANIM_SPEED == 0){
		obst_frame = (obst_frame+1)%4;
		draw();
	}

	// check if an arrow key is pressed
	isArrowKeyPressed = (keystate[KEY_UP] ||keystate[KEY_DOWN] ||
						keystate[KEY_LEFT]||keystate[KEY_RIGHT]);

	//do step() only if a gameplay key is being pressed
	if ((isArrowKeyPressed)&&(step_done == false)){

		// deterime which direction the player should go
		if (keystate[KEY_UP]) {
			dir = 0;
		} else if (keystate[KEY_RIGHT]) {
			dir = 1;
		} else if (keystate[KEY_DOWN]) {
			dir = 2;
		} else if (keystate[KEY_LEFT]) {
			dir = 3;
		}

		step(dir);
		step_done = true;
	}

	// teleport without doing a step()
	if ((keystate[KEY_SPACE])&&(player.tele_count > 0)&&(isTeleportDone==false)) {
		player.teleport();
		draw();
		isTeleportDone = true;
	}

	// if no key is being pressed
	if (isEmpty(keystate) == true){
		step_done = false;
		isTeleportDone = false;
	}

	// if the game is over
	if (isGameOver == false) {
		window.requestAnimationFrame(loop);
	} else if (isGameOver == true) {
		// gameOver is a loop - we want to work with the sounds only once
		music.pause();
		music.currentTime = 0;
		death_sound.play();
		gameOver();
	}
	frames++;
}

function step(dir){
	step_count++;

	// 1 - update
	player.update(dir);
	for (var i in zomb_array){ zomb_array[i].update(); }

	// 2 - check for collisions
	checkPlayerZombieCol();
	checkZombieObstacleCol();
	checkZombieCols();
	checkPlayerObstacleCol();

	// 3 - after checking collisions, update teleport
	player.updateTeleport();

	// 4 - if all zombies are dead - new level
	if (zomb_array.length == 0) {
		zombie_count += 2;
		if (obst_array.length > 3) {
			obst_array.splice(obst_array.length-1, 1);
		}
		score += zombie_count;
		step_done = true;
		initLevel();
	}

	draw();
}

function draw(){
	ctx.clearRect(0, 0, ctx.width, ctx.height);

	// draw grid
	for (var r=0; r<ROWS; r++){
		for (var c=0; c<COLS; c++){
			var x = c*SQR;
			var y = r*SQR;
			ctx.drawImage(background, x, y);
		}
	}
	player.draw();

	// draw obstacles
	for (var i in obst_array) {
		ctx.drawImage(obst_img_list[obst_frame], obst_array[i].x_draw, obst_array[i].y_draw);
	}

	// draw zombies
	for (var i in zomb_array) {
		ctx.drawImage(zomb_array[i].img, zomb_array[i].x_draw, zomb_array[i].y_draw);
	}

	// draw hud
	ctx.fillStyle = "#311";
	ctx.fillRect(0, ctx.height-INFO_HEIGHT, ctx.width, INFO_HEIGHT);

	ctx.font = "20px Lucida console";
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.fillText("Teleports Remaining: " + player.tele_count, 30, ctx.height-60);
	ctx.fillText("Score for Teleport:  " + player.next_tele_at, 30, ctx.height-25);
	
	ctx.font = "26px Lucida console";
	ctx.textAlign = "center";
	ctx.fillText("Score: " + score, ctx.width/2, ctx.height-40);
	ctx.fillText("High Score: " + highscore, ctx.width-150, ctx.height-40);
}

function gameOver(){
	draw();

	// save highscore
	if (score > highscore){
		highscore = score;
		setCookie("highscore", score, 90);
	}

	// splash
	ctx.fillStyle = "#200";
	ctx.fillRect(SCREEN_WIDTH/2-195, SCREEN_HEIGHT/2-80, 400, 210);
	ctx.fillStyle = "#500";
	ctx.fillRect(SCREEN_WIDTH/2-200, SCREEN_HEIGHT/2-85, 400, 210);

	var rank = "";
	switch(true) {
		case (score<1):    rank = "Try Harder";     break;
		case (score<5):    rank = "Stew Cooker";    break;
		case (score<10):   rank = "Mud Skipper";    break;
		case (score<25):   rank = "Sewer Crawler";  break;
		case (score<50):   rank = "Leg Twister";    break;
		case (score<100):  rank = "Path Finder";    break;
		case (score<200):  rank = "Grass Runner";   break;
		case (score<300):  rank = "Boot Strapper";  break;
		case (score<500):  rank = "Flame Juggler";  break;
		case (score<1000): rank = "Corpse Basher";  break;
		case (score<1500): rank = "Soul Eater";     break;
		case (score<2000): rank = "Enigma Machine"; break;
		case (score<3000): rank = "Void Brewer";    break;
		case (score<5000): rank = "Overlord";       break;

		default:           rank = "Bug Finder";     break;
	}

	ctx.font = "32px Lucida console";
	ctx.fillStyle = "white";
	ctx.textAlign="center";
	ctx.fillText("Death be upon you", ctx.width/2, ctx.height/2-30);

	ctx.font = "24px Lucida console";
	ctx.fillStyle = "white";
	ctx.textAlign="center";
	ctx.fillText("Final Score: " + score, ctx.width/2, ctx.height/2+20);
	ctx.fillText("Final Rank: " + rank, ctx.width/2, ctx.height/2+50);
	ctx.fillText("Try again? Press R", ctx.width/2, ctx.height/2+100);

	if (keystate[KEY_R]) {
		initFirstLevel();
		return;
	}
	window.requestAnimationFrame(gameOver);
}

initGame();