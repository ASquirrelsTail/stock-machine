//Global Variables

let canvasX = 640;
let canvasY = 400;
let targetFrameRate = 60;
let canvasCenter;


// Coin that flys from start point to end point
class Coin {
	constructor(startX, startY, endX, endY) {
		this.position = createVector(startX, startY);
		this.target = createVector(endX, endY);
		this.velocity = p5.Vector.random2D().mult(Math.random() * 30);
		this.acceleration = createVector(0, 0);
		this.friction = 0.9;
		this.live = true;
		
	}

	update() {
		this.velocity.mult(this.friction).add(this.acceleration);
		let vectorToTarget = p5.Vector.sub(this.target, this.position);
		this.position.add(this.velocity);
		if (vectorToTarget.mag() > 20) this.acceleration = vectorToTarget.normalize().mult(2);
		else {
			this.position = createVector(canvasX * 0.9, canvasY * 0.1);
			this.acceleration = createVector(0, 0);
			this.velocity = createVector(0, 0);
			this.live = false;
		}
	}

	draw() {
		if (this.live) {
			ellipse(this.position.x, this.position.y, 8);
		}
	}
}


//Button class, has position, radius, color(NF), label and onClick function
class Button {
	constructor(posX, posY, radius, color, label = "", onClick = () => {}) {
		this.position = createVector(posX, posY);
		this.radius = radius;
		this.color = color;
		this.label = label;
		this.onClick = onClick;
	}

	draw() {
		let mouseRange = createVector(mouseX - this.position.x, mouseY - this.position.y);

		if (mouseRange.magSq() < this.radius * this.radius) {
			if (mouseIsPressed) {
				fill(220 * 0.8, 40 * 0.8, 40 * 0.8);
				this.onClick();
			}else fill(220 * 1.2, 40 * 1.2, 40 * 1.2);
		}else fill(220, 40, 40);

		strokeWeight(5);
		stroke(220 * 0.8, 40 * 0.8, 40 * 0.8);

		ellipse(this.position.x, this.position.y, this.radius);

		strokeWeight(0);
		textSize(16);
		fill(254);
		text(this.label, this.position.x, this.position.y);
	}
}


class Chart {
	constructor(posX, posY, width, height) {
		this.position = createVector(posX, posY);
		this.width = width;
		this.height = height;
	}

	draw() {
		strokeWeight(3);
		stroke(0);
		noFill();

		beginShape();
			vertex(this.position.x, this.position.y);
			vertex(this.position.x, this.position.y + this.height);
			vertex(this.position.x + this.width, this.position.y + this.height);
		endShape();
	}

	drawLine(line, color) {
		let interval = this.width / (line.length - 1);
		strokeWeight(5);
		stroke(color);
		noFill();

		beginShape();
		for(let i = 0; i < line.length; i++) {
			vertex(i * interval + this.position.x, this.position.y + this.height - line[i]);
		}
		endShape();
	}
}


// An array class for entities that can call their update and draw functions, and remove them when they die
class EntityArray extends Array {
	constructor() {
		super();
	}

	update() {
		for(let i = 0; i < this.length; i++) {
			this[i].update();
			if (!this[i].live) { // Remove dead entities
				this.splice(i, 1);
				i--;
			}
		}
	}

	preDraw() {

	}

	draw() {
		this.update();
		this.preDraw();
		this.forEach((entity) => entity.draw());
	}
}


// Game Variables

let button;
let chart;

let coins = new EntityArray();
coins.preDraw = function() {
	resetMatrix();
	fill(255, 255, 144);
	strokeWeight(4);
	stroke(180, 180, 0);
}


//Processing setup
function setup() {
	createCanvas(canvasX, canvasY);
	frameRate(targetFrameRate);
	rectMode(CORNER);
	ellipseMode(RADIUS);
	strokeCap(ROUND);
	strokeJoin(ROUND);
	textAlign(CENTER, CENTER);
	button = new Button(100, 100, 30, [210, 40, 40], "Sell!", function() {coins.push(new Coin(this.position.x, this.position.y, 400, 200))});
	chart = new Chart(50, 50, 300, 100);
}


//Processing draw/game loop
function draw() {
	background(120);
	fill(255);
	chart.drawLine([10, 30, 10, 50, 0], color("#00C7FF"));
	chart.drawLine([45, 21, 5, 12, 14, 82, 21, 11], color("#05F94B"));
	chart.drawLine([20, 43, 9, 0], color("#FF7732"));
	chart.draw();
	button.draw();
	coins.draw();
}