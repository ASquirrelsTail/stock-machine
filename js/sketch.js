//Global Variables

let canvasX = 1280;
let canvasY = 800;
let targetFrameRate = 60;
let canvasCenter;
let backgroundCol = 120;


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
		this.position = {x: posX, y: posY};
		this.width = width;
		this.height = height;
	}

	draw() {
		fill(backgroundCol);
		noStroke();
		rect(this.position.x -50, this.position.y - 10, 50, this.height + 20);
		rect(this.position.x + this.width, this.position.y - 10, 50, this.height + 20);

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
		let interval = this.width / (line.length - 2);
		strokeWeight(5);
		stroke(color);
		noFill();

		beginShape();
		for(let i = 0; i < line.length; i++) {
			vertex((i * interval) + this.position.x - ((date.seconds() / 86400000) * interval), this.position.y + this.height - (line[i] / 200 * this.height));
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

		this.buyButton = new Button(posX - 50, posY + 80, 30, [210, 40, 40], "BUY!", () => this.buy());
		this.sellButton = new Button(posX + 50, posY + 80, 30, [210, 40, 40], "SELL!", () => this.sell());

		for (let i = 0; i < 49; i++) this.addValue();
	}

	getValue() {
		return this.values[this.values.length - 1]
	}

	addValue() {
		let newValue = this.getValue() + (Math.random() * this.volatility) - (this.volatility / 2) + this.trend;
		if (newValue < 1) newValue = 1;
		else if (newValue > 200) newValue = 200;

		this.values.push(newValue);
	}

	draw() {
		chart.drawLine(this.values, color(this.color));

		fill(255);
		stroke(0);
		strokeWeight(4);
		rect(this.drawPos.x - 25, this.drawPos.y, 70, 40, 10);
		
		fill(0);
		strokeWeight(2);
		textSize(20);
		textAlign(RIGHT);
		text("$" + Math.floor(this.getValue()), this.drawPos.x - 25, this.drawPos.y + 5, 65, 30);
		textAlign(CENTER);

		text(this.name, this.drawPos.x - 25, this.drawPos.y - 40);
		text("Shares: " + this.shares, this.drawPos.x - 25, this.drawPos.y - 80);
		
		fill(color(this.color));
		noStroke();
		rect(this.drawPos.x - 50, this.drawPos.y - 40, 35, 35, 10);

		this.buyButton.draw();
		this.sellButton.draw();
	}

	update() {
		this.values.splice(0, 1);
		this.addValue();
	}

	buy() {
		if (score > this.getValue()) {
			this.shares++;
			score -= this.getValue();
		}
	}

	sell() {
		if (this.shares > 0) {
			this.shares--;
			for (let i = 0; i < Math.floor(this.getValue() / 50); i++) coins.push(new Coin(mouseX, mouseY, 50));
			coins.push(new Coin(mouseX, mouseY, this.getValue() % 50))
		}
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
		stroke(0);
		strokeWeight(4);
		rect(460, 30, 200, 40, 10, 0, 0, 10);
	
		fill(255);
		stroke(255);
		strokeWeight(1);
		textSize(20);
		text("BREAKING NEWS", 460, 36, 200, 30);
	}
}


// Game Variables

let score = 1000000;

let chart = new Chart(100, 100, 1080, 300);
let gold = new Stock("Gold", 93, 20, 0.3, "#00C7FF", 200, 500);
let oil = new Stock("Oil", 60, 60, 0.1, "#05F94B", 500, 500);
let tech =  new Stock("Technology", 120, 40, -0.3, "#FF7732", 800, 500);

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