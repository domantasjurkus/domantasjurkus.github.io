function generateZombies(count){
    zomb_array = []
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
    return zomb_array;
}

function generateObstacles(count){
    obst_array = []
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
    return obst_array
}