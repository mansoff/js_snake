
const gameObject = { 

	settings: {
		selector: 'container',
		cubeSize: 10,
		color: {
			red: "rgb(255 0 0)",
			yellow: "rgb(255 255 0)",
		},
		widthPx: 300,
		heightPx: 400,
		width: 30,
		height: 40,
	},
	canvas: null,
	snake: [
	 	{ x: 15, y: 20 },
	 	{ x: 15, y: 21 },
	 	{ x: 15, y: 22 },
	 	{ x: 15, y: 23 },
	 	{ x: 15, y: 24 },
	 	{ x: 15, y: 25 },
	],
	snakeColor: 'yellow',
	snakeDirection: 'up',
	snakeSpeed: 150,
	gameOver: false,
	wormColor: 'red',
	worm: null,
	tail: null,
	
	
	init() {
		this.checkConfig();
		this.bindKeyboard();
		this.drawCanvas();
		this.drawSnake();
		
		function timeout(self) {
			if (self.gameOver === true) {
				return;
			}
			
    		setTimeout(() => {
    			self.moveSnake();
    			self.checkCollision();
    			self.drawSnake();
    			self.placeWorm();
    			self.drawWorm();
    			
        		timeout(self);
    		}, self.snakeSpeed);
		}

		timeout(this);	
	},
		
	drawSnake() {
		this.clearCanvas();
		
		this.snake.forEach((current) => {
			this.drawCube(current.x, current.y, this.snakeColor);	
		}, this);
		
	},
	
	moveSnake() {
		let xDiff = 0;
		let yDiff = 0;
		
		switch (this.snakeDirection) {
  			case 'up':
  				xDiff = 0;
  				yDiff = -1;
    			break;
    			
    		case 'down':
  				xDiff = 0;
  				yDiff = 1;
    			break;
    			
    		case 'left':
  				xDiff = -1;
  				yDiff = 0;
    			break;
    			
			case 'right':
  				xDiff = 1;
  				yDiff = 0;
    			break;
 
			default:
    			alert('Error: Snake direction is wrong');
    			break;
		}
		
		let head = this.snake[0];
		let hewHead = {x:0, y:0};

		hewHead.x = head.x + xDiff;
		hewHead.y = head.y + yDiff;

		this.snake.unshift(hewHead);
		this.tail = this.snake.pop();
	},
	
	growSnake() {
		this.snake.push(this.tail);
	},

	destroyWorm() {
		this.worm = null;
	},
	
	checkCollision() {
		if (this.isWallCollision()) {
			console.log('isWallCollision');
			this.printGameOver();
		}

		if (this.isSnakeCollision()) {
			console.log('isSnakeCollision');
			this.printGameOver();
		}

		if (this.isWormEaten()) {
			this.growSnake();
			this.destroyWorm();
		}
	},

	isWallCollision() {
		let head = this.snake[0];

		return head.x < 0 || head.y < 0
			|| head.x >= this.settings.width
			|| head.y >= this.settings.height;
	},

	isSnakeCollision() {
		if (this.snake === null) {
			return false;
		}

		let snakeMap = this.getSnakeUniqueValues();
		const uniqueValues = new Set(snakeMap);

		return uniqueValues.size < snakeMap.length;
	},

	isWormEaten() {
		if (this.worm !== null && this.snake !== null) {
			let snakeMap = this.getSnakeUniqueValues();
			snakeMap.push(""+this.worm.x+this.worm.y);
			const uniqueValues = new Set(snakeMap);

			return uniqueValues.size < snakeMap.length;
		}

		return false;
	},

	getSnakeUniqueValues() {
		return this.snake.map(v => ""+v.x+v.y);
	},

	generateRandomCoordinates: function () {
		return {
			x: this.getRandomInt(this.settings.width),
			y: this.getRandomInt(this.settings.width),
		};
	},

	placeWorm() {
		if (this.worm !== null) {
			return;
		}
		
		let worm = this.generateRandomCoordinates();

		let snakeMap = this.getSnakeUniqueValues();
		snakeMap.push(""+worm.x+worm.y);
		const uniqueValues = new Set(snakeMap);
		if (uniqueValues.size >= snakeMap.length) {
			this.worm = worm;
		} else {
			this.worm = null;
			console.log('trying to place worm on snake - skipping');
		}
	},
	
	drawWorm() {
		if (this.worm === null) {
			return;
		}	
		this.drawCube(this.worm.x, this.worm.y, this.wormColor);	
	},
	
	getRandomInt(max) {
  		return Math.floor(Math.random() * max);
	},
	
	printGameOver(){
		this.gameOver = true;
		alert ('Game Over :(');
	},
	
	drawCube(x, y, color) {
		const size = this.settings.cubeSize;
		this.canvas.fillStyle = this.getRgbColor(color);
        this.canvas.fillRect( x * size, y * size, size, size);
        this.canvas.strokeRect(x * size, y * size, size, size)
	},
	
	clearCanvas() {
		this.canvas.clearRect(0, 0, this.settings.widthPx, this.settings.heightPx);
	},
	
	getRgbColor(color) {
		return this.settings.color[color];
	},
	
	drawCanvas() {
		const canvasHtml = document.querySelector("."+this.settings.selector);
		this.canvas = canvasHtml.getContext("2d");
	},
	
	bindKeyboard() {
		document.addEventListener("keydown", (event) => {
  			if (event.keyCode === 37 && this.snakeDirection !== 'right') {
  				this.snakeDirection = 'left';
  				//left arrow
    			return;
  			}
  			if (event.keyCode === 38 && this.snakeDirection !== 'down') {
  				//up arrow
  				this.snakeDirection = 'up';
    			return;
  			}
  			if (event.keyCode === 39 && this.snakeDirection !== 'left') {
  				this.snakeDirection = 'right';
  				//right arrow
    			return;
  			}
  			if (event.keyCode === 40 && this.snakeDirection !== 'up') {
  				//down arrow
  				this.snakeDirection = 'down';
    			return;
  			}
			if (event.keyCode === 27) {
				//escape
				console.log('escape pressed');
				this.printGameOver();
			}
		});
	},
	
	checkConfig() {
		if (
			this.settings.cubeSize * this.settings.width > this.settings.widthPx
			|| this.settings.cubeSize * this.settings.height > this.settings.heightPx
		) {
			alert('Check settings, canvas size is less than game field');
			this.printGameOver();
		}
	},
};

addEventListener("DOMContentLoaded", () => {
	gameObject.init();
});
