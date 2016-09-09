var WIDTH = 700;
var HEIGHT = 600;
var ACC = 1;
var pi = Math.PI;
var canvas, ctx, keystate;
var player, ai, ball;
var upArrow = 38;
var downArrow = 40;

player = {
	x: null,
	y: null,
	width: 20,
	height: 100,

	update: function() {
		if (keystate[upArrow]) this.y -= 7;
		if (keystate[downArrow]) this.y += 7;
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
};
ai = {
	width: 20,
	height: 100,
	x: this.width,
	y: (HEIGHT - this.height)/2,

	update: function() {
		var desty = ball.y - (this.height - ball.side)*0.5;
		this.y += (desty - this.y)*0.1;
		this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0);
	},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
};
ball = {
	x: null,
	y: null,
	vel: null,
	side: 20,
	speed: 10,

	serve: function(side) {
		var r = Math.random();
		this.x = side===1 ? player.x+player.width : ai.x - this.side;
		this.y = side===1 ? player.y+(player.height-ball.side)/2 : ai.y+(ai.height-ball.side)/2;

		var phi = 0.1*pi*(1 - 2*r);
		this.vel = {
			x: side*this.speed*Math.cos(phi),
			y: side*this.speed*Math.sin(phi)
		}

	},

	update: function() {
		this.x += this.vel.x;
		this.y += this.vel.y;

		if (this.y < 0 || this.y+this.side > HEIGHT) {
			var offset = this.vel.y<0 ? -this.y : HEIGHT-(this.y+this.side);
			this.y += 2*offset;
			this.vel.y *= -1;
		}

		var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
			return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
		};

		var pdle = this.vel.x < 0 ? player : ai;
		if (AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height, this.x, this.y, this.side, this.side))
		{
			this.x = pdle===player ? player.x+player.width : ai.x-this.side;
			var n = (this.y+this.side - pdle.y)/(pdle.height+this.side);
			var phi = 0.25*pi*(2*n - 1);	// pi/4 = 45 degrees

			var smash = Math.abs(phi) >0.2*pi ? 1.5 : 1;
			this.vel.x = smash*(pdle===player ? 1 : -1)*this.speed*Math.cos(phi);
			this.vel.y = smash*this.speed*Math.sin(phi);
		};

		if (this.x+this.side < -50 || this.x > WIDTH+50) {
			this.serve(pdle===player ? 1 : -1);
		};
	},
	draw: function() {
		ctx.fillRect(this.x, this.y, this.side, this.side);
	}
}

function main() {
	canvas = document.getElementById("gameCanvas");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	ctx = canvas.getContext('2d');

	keystate = {};
	document.addEventListener('keydown', function(evt) {
		keystate[evt.keyCode] = true;
		// prevent screen from scrolling
        switch (evt.keyCode){
            case 37: case 39: case 38:  case 40:   // Arrow keys
            evt.preventDefault(); break;
            default: break;
        }
	});
	document.addEventListener('keyup', function(evt) {
		delete keystate[evt.keyCode];
	});



	init();

	var loop = function() {
		update();
		draw();

		window.requestAnimationFrame(loop, canvas);
	};
	window.requestAnimationFrame(loop, canvas);
}

function init() {
	player.x = player.width;
	player.y = (HEIGHT - player.height)/2;

	ai.x = WIDTH - (player.width + ai.width);
	ai.y = (HEIGHT - ai.height)/2;

	ball.serve(1);
}

function update() {
	ball.update();
	player.update();
	ai.update();
}

function draw() {
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	ctx.save()
	ctx.fillStyle = '#fff';

	ball.draw();
	player.draw();
	ai.draw();

	var w = 1;
	var x = (WIDTH - w)*0.5;
	var y = 0;
	var step = HEIGHT/20;
	while (y < HEIGHT) {
		ctx.fillRect(x, y+0.25, w, step*0.5)
		y += step;
	}

	ctx.restore();
}

main();