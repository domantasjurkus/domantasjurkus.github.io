console.log("classes.js loaded");

var player = {
	x_pos: undefined,
	y_pos: undefined,
	x_draw: undefined,
	y_draw: undefined,
	dir: undefined,
	img: undefined,
	next_tele_at: undefined,
	tele_count: undefined,

	init: function(){
		this.dir = 0;
		this.img = player_img_list[0];
		this.x_pos = Math.ceil(COLS/2);
		this.y_pos = Math.ceil(ROWS/2);
		this.x_draw = this.x_pos*SQR;
		this.y_draw = this.y_pos*SQR;
		this.next_tele_at = 4;
		this.tele_count = 0;
	},

	update: function(dir){
		this.dir = dir;
		this.movePlayer(dir);

		// update drawing coordinates
		this.x_draw = this.x_pos*SQR;
		this.y_draw = this.y_pos*SQR;

		//update image based on direction
		if (this.dir == 0)
			this.img = player_img_list[0]
		else if (this.dir == 1)
			this.img = player_img_list[1]
		else if (this.dir == 2)
			this.img = player_img_list[2]
		else if (this.dir == 3)
			this.img = player_img_list[3]
	},

	updateTeleport: function(){
		// check whether player gets another teleport
		if (score >= this.next_tele_at) {
			this.tele_count += 1;
			this.next_tele_at *= 2;
			radar_sound.play();
		}
	},

	movePlayer: function(dir){
		if      ((dir == 0)&&(this.y_pos > 0))		this.y_pos--;
		else if ((dir == 1)&&(this.x_pos < COLS-1))	this.x_pos++;
		else if ((dir == 2)&&(this.y_pos < ROWS-1))	this.y_pos++;
		else if ((dir == 3)&&(this.x_pos > 0))		this.x_pos--;
	},

	teleport: function(){
		this.tele_count -= 1;
		// generate random position
		this.x_pos = Math.floor(Math.random()*COLS);
		this.y_pos = Math.floor(Math.random()*ROWS);

		// if a player spawns too close to a zombie
		// distance between player and zombie
		for (z in zomb_array) {
			var dist_x = Math.abs(this.x_pos - zomb_array[z].x_pos);
			var dist_y = Math.abs(this.y_pos - zomb_array[z].y_pos);
			// regenerate coordinates if too close to zombie
			while ((dist_x < 3) || (dist_y < 3)) {
				this.x_pos = Math.floor(Math.random()*COLS);
				this.y_pos = Math.floor(Math.random()*ROWS);
				dist_x = Math.abs(this.x_pos - zomb_array[z].x_pos);
				dist_y = Math.abs(this.x_pos - zomb_array[z].x_pos);
			}
		}

		// if a player spawns on top ob an obstacle
		for (o in obst_array) {
			while ((this.x_pos == obst_array[o].x_pos)&&(this.y_pos == obst_array[o].y_pos)) {
				this.x_pos = Math.floor(Math.random()*COLS);
				this.y_pos = Math.floor(Math.random()*ROWS);
			}
		}

		// update drawing coordinates
		this.x_draw = this.x_pos*SQR;
		this.y_draw = this.y_pos*SQR;

		tele_sound.play();
	},

	draw: function(){
		ctx.drawImage(player.img, player.x_draw, player.y_draw)
	}
}

function Zombie(x_pos, y_pos, img, dir){
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.x_draw = this.x_pos*SQR;
	this.y_draw = this.y_pos*SQR;
	this.dir = dir;
	this.img = zombie_img_list[this.dir];

	this.update = function(){
		this.findDirection();
		this.move();

		// set drawing coordinates based of grid coordinates
		this.x_draw = this.x_pos*SQR;
		this.y_draw = this.y_pos*SQR;

		// update image based on direction
		if (this.dir == 0)
			this.img = zombie_img_list[0]
		else if (this.dir == 1)
			this.img = zombie_img_list[1]
		else if (this.dir == 2)
			this.img = zombie_img_list[2]
		else if (this.dir == 3)
			this.img = zombie_img_list[3]
	}
	
	this.findDirection = function(){
		// if player and zombie are on the same vertical line
		if (this.x_pos == player.x_pos){
			// if player is top of zombie
			if (player.y_pos < this.y_pos){
				this.dir = 0;
			// if player is down from zombie
			} else if (this.y_pos < player.y_pos) {
				this.dir = 2;
			// if the zombie is on the player
			} else {
				this.dir = -1;
			}
		}

		// if player and zombie are on the same horizontal line
		if (this.y_pos == player.y_pos){
			// if player is left from zombie
			if (player.x_pos < this.x_pos){
				this.dir = 3;
			// if player is right from zombie
			} else if (this.x_pos < player.x_pos) {
				this.dir = 1;
			// if the zombie is on the player
			} else {
				this.dir = -1;
			}
		}

		// if player is on the 1st quadrangle
		else if ((this.x_pos < player.x_pos)&&(this.y_pos > player.y_pos)){
			this.dir = Math.floor(Math.random()+0.5);
		}
		// if player is on the 2nd quadrangle
		else if ((this.x_pos > player.x_pos)&&(this.y_pos > player.y_pos)){
			this.dir = Math.floor(Math.random()+3.5)%4;
		}
		// if player is on the 3rd quadrangle
		else if ((this.x_pos > player.x_pos)&&(this.y_pos < player.y_pos)){
			this.dir = Math.floor(Math.random()+2.5);
		}
		// if player is on the 4th quadrangle
		else if ((this.x_pos < player.x_pos)&&(this.y_pos < player.y_pos)){
			this.dir = Math.floor(Math.random()+1.5);
		}
	}

	this.move = function(){
		switch(this.dir) {
			case 0:
				this.y_pos--;
				break;
			case 1:
				this.x_pos++;
				break;
			case 2:
				this.y_pos++;
				break;
			case 3:
				this.x_pos--;
				break;
		}
	}
}

function Obstacle(x_pos, y_pos){
	this.x_pos = x_pos;
	this.y_pos = y_pos;
	this.x_draw = this.x_pos*SQR;
	this.y_draw = this.y_pos*SQR;
}