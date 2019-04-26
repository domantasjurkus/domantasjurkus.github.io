function checkPlayerZombieCol(){
	// if zombie reaches player
	for (z in zomb_array){
		if ((zomb_array[z].x_pos == player.x_pos)
		&& (zomb_array[z].y_pos == player.y_pos)){
			isGameOver = true;
		}
	}
}

function checkZombieCols(){
	// if zombies bump into each other
	for (var z1 = 0; z1 < zomb_array.length-1; z1++){
		for (var z2 = z1 + 1; z2 < zomb_array.length; z2++){
			if ((zomb_array[z1].x_pos == zomb_array[z2].x_pos)&&
				(zomb_array[z1].y_pos == zomb_array[z2].y_pos)){
				zomb_array.splice(z1, 1);
				zomb_array.splice(z2, 1);
				score += 2;
				break;
			}
		}
	}
}

function checkZombieObstacleCol(){
	// collect the indexes of zombies that need to be deleted
	var del_indexes = [];
	for (var o in obst_array) {
		for (var z in zomb_array) {
			if ((zomb_array[z].x_pos == obst_array[o].x_pos)
			&& (zomb_array[z].y_pos == obst_array[o].y_pos)){
				/*del_indexes += [z];*/
			del_indexes.push(z);
			}
		}
	}
	// delete zombies within the collected indexes
	// looping in reverse order to prevent early length reduction
	for (var a = del_indexes.length-1; a > -1; a--) {
		ind = del_indexes[a];
		zomb_array.splice(ind, 1);
		score++;
	}
}

function checkPlayerObstacleCol(){
	for (var o in obst_array) {
		if ((obst_array[o].x_pos == player.x_pos)&&(obst_array[o].y_pos == player.y_pos)) {
			isGameOver = true;
		}
	}
}