//constants
var COLS=26, ROWS=26;
var EMPTY=0, SNAKE=1, FRUIT=2;
var LEFT=0, UP=1, RIGHT=2, DOWN=3;
//keycodes
var KEY_LEFT=37, KEY_UP=38, KEY_RIGHT=39, KEY_DOWN=40;
//game objects
var canvas, ctx, keystate, frames, score;
//grid
var grid = {
	width: null,
	height: null,
	_grid: null,
	
	init: function(d, c, r) {
		this.width = c;
		this.height = r;
		
		this._grid = [];
		for (var x = 0; x < c; x++) {
			this._grid.push([]);
			for (var y = 0; y < r; y++) {
				this._grid[x].push(d);
			}
		}
	},
	set: function(val, x, y) {
		this._grid[x][y] = val;
	},
	get: function(x, y) {
		return this._grid[x][y];
	}
}

var snake = {

	direction: null,
	last: null,			//pointer to the last element in the queue
	_queue: null,
	
	//clears the queue and sets the start position and direction
	init: function(d, x, y) {
		this.direction = d;
		this._queue = [];
		this.insert(x, y);		//adds an element to the queue
	},
	insert: function(x, y) {
		this._queue.unshift({x:x, y:y});
		this.last = this._queue[0];
	},
	remove: function() {
		return this._queue.pop();
	}
}

//set food on a random tile
function setFood() {
	var empty = [];
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			if (grid.get(x, y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}
	var randpos = empty[Math.round(Math.random()*(empty.length - 1))];
	grid.set(FRUIT, randpos.x, randpos.y);
}

//starts the game
function main() {
	canvas = document.getElementById("gameCanvas");
	canvas.width = COLS*20;
	canvas.height = ROWS*20;
	ctx = canvas.getContext("2d");
	ctx.font = "18px Helvetica";
	
	frames = 0;
	keystate = {};

	// prevent screen from scrolling
	window.addEventListener("keydown", function(evt) {
			keystate[evt.keyCode] = true;
	        switch(evt.keyCode){
	            case 37: case 39: case 38:  case 40:   // Arrow keys
	            case 32: evt.preventDefault(); break;  // Space
	            default: break;
	        }
	});

	//wait for keydown/keyup
	document.addEventListener("keydown", function(evt) {
			keystate[evt.keyCode] = true;
			// prevent screen from scrolling
	        switch(evt.keyCode){
	            case 37: case 39: case 38:  case 40:   // Arrow keys
	            case 32: evt.preventDefault(); break;  // Space
	            default: break;
	        }
	});
	document.addEventListener("keyup", function(evt) {
			delete keystate[evt.keyCode];
	});
	
	init();
	loop();
}

//resets and inits game objects
function init() {
	score = 0;
	grid.init(EMPTY, COLS, ROWS);
	
	//both odd and even number of columns
	var sp = {x:Math.floor(COLS/2), y:ROWS-1};
	snake.init(UP, sp.x, sp.y);
	grid.set(SNAKE, sp.x, sp.y);
	
	setFood();
}

//the game loop function, used for game updates and rendering
function loop() {
	update();
	draw();
	//When ready to redraw the canvas call the loop function first.
	//Runs about 60 frames a second
	window.requestAnimationFrame(loop, canvas);
}

//updates game logic
function update() {
	frames++;

	//if keystate is ... change snake.direction to ...
	if (keystate[KEY_LEFT] && snake.direction != RIGHT)
		snake.direction = LEFT;
	if (keystate[KEY_UP] && snake.direction != DOWN)
		snake.direction = UP;
	if (keystate[KEY_RIGHT] && snake.direction != LEFT)
		snake.direction = RIGHT;
	if (keystate[KEY_DOWN] && snake.direction != UP)
		snake.direction = DOWN;

	//update frames
	if (frames%5 === 0) {
		//nx, ny - coordinates of the new tile the snake will cross
		var nx = snake.last.x;
		var ny = snake.last.y;

		switch (snake.direction) {
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}

		//if the snake hits the border
		if (nx < 0 || nx > grid.width-1||
			ny < 0 || ny > grid.height-1||
			grid.get(nx, ny) === SNAKE) {
			return init();
		}

		//if the snake hits the food tile
		if (grid.get(nx, ny) === FRUIT) {
			// increment the score and sets a new fruit position
			score++;
			setFood();
		} else {
			// take out the first item from the snake queue i.e
			// the tail and remove id from grid
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
		}

		// add a snake id at the new position and append it to 
		// the snake queue
		grid.set(SNAKE, nx, ny);
		snake.insert(nx, ny);
	}
}

//renders the grid to the canvas
function draw() {

	// calculate tile width and height
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;

	// iterate through the grid and draw all cells
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			// sets the fillstyle depending on the id of
			// each cell
			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = "#343";
					break;
				case SNAKE:
					ctx.fillStyle = "#6a6";
					break;
				case FRUIT:
					ctx.fillStyle = "#a33";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}
}

//start the game
main();
