//Global Variables

let canvasX = 1280;
let canvasY = 800;
let targetFrameRate = 60;
let canvasCenter;
let backgroundCol = 255;


// Coin that flys from start point to end point
class Coin {
	constructor(startX, startY, value) {
		this.position = createVector(startX, startY);
		this.target = createVector(50, 50);
		this.velocity = p5.Vector.random2D().mult(Math.random() * 30);
		this.acceleration = createVector(0, 0);
		this.friction = 0.9;
		this.value = value;
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
			dollar.radius += 3;
			score += this.value;
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
		this.position = {x: posX, y: posY};
		this.radius = radius;
		this.color = color;
		this.label = label;
		this.onClick = onClick;
	}

	draw() {
		let mouseRange = createVector(mouseX - this.position.x, mouseY - this.position.y);

		let buttonColor = color(this.color);
		let buttonHeight = 15;
		let yOffset = this.position.y;

		if (mouseRange.magSq() < this.radius * this.radius) {
			if (mouseIsPressed) {
				if (this.onClick()) {
					buttonHeight = 10;
					yOffset = this.position.y + 5;
				}
			}else buttonColor = lerpColor(buttonColor, color(255, 255, 255), 0.2);
		}
		


		fill(lerpColor(buttonColor, color(0, 0, 0), 0.4));
		stroke(0);
		strokeWeight(4);

		beginShape();
		vertex(this.position.x - this.radius, yOffset);
		vertex(this.position.x - this.radius, yOffset + buttonHeight);
		bezierVertex(this.position.x - this.radius, yOffset + buttonHeight + 1.2 * this.radius, this.position.x + this.radius, yOffset + buttonHeight + 1.2 * this.radius, this.position.x + this.radius, yOffset + buttonHeight);
		vertex(this.position.x + this.radius, yOffset);
		endShape();

		fill(buttonColor);

		ellipse(this.position.x, yOffset, this.radius);

		strokeWeight(1);
		textSize(20);
		fill(255);
		stroke(255);
		text(this.label, this.position.x, yOffset);
	}
}


class Chart {
	constructor(posX, posY, width, height) {
		this.position = {x: posX, y: posY};
		this.width = width;
		this.height = height;
	}

	draw() {
		fill(backgroundCol);
		noStroke();
		rect(this.position.x -50, this.position.y - 10, 50, this.height + 20);
		rect(this.position.x + this.width, this.position.y - 10, 50, this.height + 20);

		strokeWeight(4);
		stroke(0);
		noFill();

		line(this.position.x, this.position.y, this.position.x, this.position.y + this.height);
		line(this.position.x, this.position.y + this.height, this.position.x + this.width, this.position.y + this.height);
		line(this.position.x + this.width, this.position.y + this.height, this.position.x + this.width, this.position.y);

		line(this.position.x, this.position.y, this.position.x - 5, this.position.y);
		line(this.position.x, this.position.y + (this.height / 6), this.position.x - 5, this.position.y + (this.height / 6));
		line(this.position.x, this.position.y + (this.height / 3), this.position.x - 5, this.position.y + (this.height / 3));
		line(this.position.x, this.position.y + (this.height / 2), this.position.x - 5, this.position.y + (this.height / 2));
		line(this.position.x, this.position.y + 2 * (this.height / 3), this.position.x - 5, this.position.y + 2 * (this.height / 3));
		line(this.position.x, this.position.y + 5 * (this.height / 6), this.position.x - 5, this.position.y + 5 * (this.height / 6));
		line(this.position.x, this.position.y + this.height, this.position.x - 5, this.position.y + this.height);

		line(this.position.x + this.width, this.position.y, this.position.x  + this.width + 5, this.position.y);
		line(this.position.x + this.width, this.position.y + (this.height / 6), this.position.x  + this.width + 5, this.position.y + (this.height / 6));
		line(this.position.x + this.width, this.position.y + (this.height / 3), this.position.x  + this.width + 5, this.position.y + (this.height / 3));
		line(this.position.x + this.width, this.position.y + (this.height / 2), this.position.x  + this.width + 5, this.position.y + (this.height / 2));
		line(this.position.x + this.width, this.position.y + 2 * (this.height / 3), this.position.x  + this.width + 5, this.position.y + 2 * (this.height / 3));
		line(this.position.x + this.width, this.position.y + 5 * (this.height / 6), this.position.x  + this.width + 5, this.position.y + 5 * (this.height / 6));
		line(this.position.x + this.width, this.position.y + this.height, this.position.x  + this.width + 5, this.position.y + this.height);

		textAlign(RIGHT);
		textSize(10);
		fill(0);
		noStroke();
		text("£300", this.position.x - 10, this.position.y);
		text("£200", this.position.x - 10, this.position.y + (this.height / 3));
		text("£100", this.position.x - 10, this.position.y + 2 * (this.height / 3));
		text("£0", this.position.x - 10, this.position.y + this.height);
		textAlign(LEFT);
		text("£300", this.position.x + this.width + 10, this.position.y);
		text("£200", this.position.x + this.width + 10, this.position.y + (this.height / 3));
		text("£100", this.position.x + this.width + 10, this.position.y + 2 * (this.height / 3));
		text("£0", this.position.x + this.width + 10, this.position.y + this.height);
		textAlign(CENTER);
	}

	drawLine(line, color) {
		let interval = this.width / (line.length - 2);
		strokeWeight(5);
		stroke(color);
		noFill();

		beginShape();
		for(let i = 0; i < line.length; i++) {
			vertex((i * interval) + this.position.x - ((date.seconds() / 86400000) * interval), this.position.y + this.height - (line[i] / 300 * this.height));
		}
		endShape();
	}
}


class Stock {
	constructor(name, value, volatility, trend, color, posX, posY) {
		this.name = name;
		this.values = [value];
		this.volatility = volatility;
		this.trend = trend;
		this.color = color;
		this.shares = 0;
		this.drawPos = {x: posX, y: posY};

		this.buyButton = new Button(posX + 50, posY + 130, 40, "#00DB21", "BUY!", () => this.buy());
		this.sellButton = new Button(posX + 150, posY + 130, 40, "#E33D1B", "SELL!", () => this.sell());

		for (let i = 0; i < 49; i++) this.addValue();
	}

	addValue() {
		let newValue = this.values[this.values.length - 1] + (Math.random() * this.volatility) - (this.volatility / 2) + this.trend;
		if (newValue < 1) newValue = 1;
		else if (newValue > 300) newValue = 300;

		this.values.push(newValue);
	}

	getValue() {
		return this.values[this.values.length - 2]
	}

	draw() {
		chart.drawLine(this.values, color(this.color));

		fill(255);
		stroke(0);
		strokeWeight(4);
		rect(this.drawPos.x, this.drawPos.y, 200, 80, 10);

		rect(this.drawPos.x, this.drawPos.y, 200, 40, 10);
		fill(color(this.color));
		rect(this.drawPos.x + 140, this.drawPos.y, 60, 40, 0, 10, 10, 0);
		
		fill(0);
		strokeWeight(2);
		textSize(20);
		text(this.name, this.drawPos.x, this.drawPos.y, 140, 40);
		textAlign(LEFT);
		text("Shares:", this.drawPos.x + 8, this.drawPos.y + 40, 190, 40);
		textAlign(RIGHT);
		text("" + this.shares, this.drawPos.x, this.drawPos.y + 40, 197, 40);
		fill(255);
		stroke(255);
		strokeWeight(1);
		text("$" + Math.floor(this.getValue()), this.drawPos.x + 140, this.drawPos.y, 57, 40);
		textAlign(CENTER);

		this.buyButton.draw();
		this.sellButton.draw();

	}

	update() {
		this.values.splice(0, 1);
		this.addValue();
	}

	buy() {
		let result = false;
		for (let i = 0; i < score / (this.getValue() * 120); i++) {
			if (score > this.getValue()) {
				this.shares++;
				score -= this.getValue();
				result = true;
			}
		}
		return result;
	}

	sell() {
		let result = false;
		let profit = 0;
		for (let i = 0; i < this.shares / 60 && i < 1000; i++) {
			if (this.shares > 0) {
				this.shares--;
				profit += this.getValue();
			}
		}
		if (profit > 0) {
			for (let i = 0; i < Math.floor(profit / 1000); i++) coins.push(new Coin(mouseX, mouseY, 1000));
			coins.push(new Coin(mouseX, mouseY, this.getValue() % 1000));
			result = true;
		}
		return result;
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


function drawScore() {
	let scoreText = Math.floor(score).toLocaleString();

	fill(255);
	stroke(0);
	strokeWeight(4);
	rect(50, 30, 150, 40, 10);
	
	fill(0);
	strokeWeight(2);
	textSize(20);
	textAlign(RIGHT);
	text(scoreText, 100, 36, 95, 30);
	textAlign(CENTER);
}

let dollar = {
	radius: 25,

	draw: function() {
		if (this.radius > 35) this.radius = 35;
		else if (this.radius > 25) this.radius -= 1;
		else this.radius = 25;

		stroke(0);
		strokeWeight(4);
		fill(180, 180, 0);
		ellipse(50, 50, this.radius + 15);

		translate(50, 50);
		scale(this.radius / 25, this.radius / 25);
		noStroke();
		fill(255, 255, 144);
		ellipse(0, 0, 25);
		fill(0);
		stroke(0);
		strokeWeight(2);
		textSize(30);
		text("$", 0, 2);
		resetMatrix();
	}
}

let date = {
	today: new Date(),

	startofDay: Date.now(),

	init: function() {
		this.today.setMinutes(0);
		this.today.setHours(0);
		this.startofDay = this.today.getTime();
	},

	draw: function() {
		let oldDate = this.today.getDate();
		this.today.setMinutes(this.today.getMinutes() + 20);

		if (this.today.getDate() != oldDate) this.newDay();

		fill(255);
		stroke(0);
		strokeWeight(4);
		rect(230, 30, 200, 40, 10);
	
		fill(0);
		strokeWeight(1);
		textSize(20);
		text(this.today.toDateString(), 230, 36, 200, 30);
	},

	seconds: function() {
		return this.today.getTime() - this.startofDay;
	},

	newDay: function() {
		this.startofDay = this.today.getTime();

		gold.update();
		oil.update();
		tech.update();
	}
}


let news = {
	draw: function() {
		fill(255);
		stroke(0);
		strokeWeight(4);
		rect(460, 30, 750, 40, 10);

		fill(color("#E33D1B"));
		rect(460, 30, 200, 40, 10, 0, 0, 10);
	
		fill(255);
		stroke(255);
		strokeWeight(1);
		textSize(20);
		text("BREAKING NEWS", 460, 36, 200, 30);
	}
}


// Game Variables

let score = 1000;

let chart = new Chart(100, 100, 1080, 400);
let gold = new Stock("Gold", 93, 20, 0.3, "#FF7732", 240, 550);
let oil = new Stock("Oil", 60, 60, 0.1, "#B125D9", 540, 550);
let tech =  new Stock("Tech", 120, 40, -0.3, "#00AAFF", 840, 550);

let coins = new EntityArray();
coins.preDraw = function() {
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

	date.init();
}


//Processing draw/game loop
function draw() {
	background(backgroundCol);

	drawScore();
	date.draw();
	news.draw();

	
	oil.draw();
	tech.draw();
	gold.draw();
	chart.draw();
	coins.draw();

	dollar.draw();
}