//Global Variables
let canvasX = 1280;
let canvasY = 800;
let targetFrameRate = 60;
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
		this.months = [];

		let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let daysInPrevMonth = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30];
		this.months.push({label: monthNames[date.today.getMonth()] + " " + (date.today.getYear() % 100), position: date.today.getDate()});
		if (49 - date.today.getDate() > daysInPrevMonth[date.today.getMonth()]) {
			this.months.push({label: monthNames[(date.today.getMonth() + 11) % 12] + " " + ((date.today.getYear() - 1 + Math.ceil(date.today.getMonth()  / 12)) % 100), position: date.today.getDate() + daysInPrevMonth[date.today.getMonth()]});
		}
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
		textSize(16);
		fill(0);
		strokeWeight(1);
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

		//Draw month markers
		textSize(16);
		stroke(0);
		for (let i = 0; i < this.months.length; i++) {
			let xPos = this.position.x + this.width - ((this.months[i].position - 1) * (this.width / 48)) - ((date.seconds() / 86400000) * (this.width / 48));
			strokeWeight(1);
			text(this.months[i].label, xPos, this.position.y + this.height + 18);
			strokeWeight(4);
			line(xPos, this.position.y + this.height, xPos, this.position.y + this.height + 5);
			
		}
		
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

	newMonth(month, year) {
		let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		this.months.push({label: monthNames[month] + " " + (year % 100), position: 0});
	}

	update() {
		for (let i = 0; i < this.months.length; i++) {
			this.months[i].position++;
			if (this.months[i].position > 48) {
				this.months.splice(i, 1);
				i--;
			}
		}
	}
}


class Stock {
	constructor(name, value, volatility, trend, lowerBound, upperBound, color, posX, posY) {
		this.name = name;
		this.values = [value];
		this.volatility = volatility;
		this.trend = trend;
		this.lowerBound = lowerBound;
		this.upperBound = upperBound;
		this.color = color;
		this.shares = 0;
		this.drawPos = {x: posX, y: posY};

		this.tempTrendTimer = 0;
		this.tempTrend = 0;
		this.tempVolatility = 0;

		this.buyButton = new Button(posX + 50, posY + 130, 40, "#00DB21", "BUY!", () => this.buy());
		this.sellButton = new Button(posX + 150, posY + 130, 40, "#E33D1B", "SELL!", () => this.sell());

		for (let i = 0; i < 49; i++) this.addValue();
	}

	addValue() {
		let volatility = this.volatility;
		let trend = this.trend;
		let currentValue = this.values[this.values.length - 1];
		
		if (this.tempTrendTimer > 0) {
			this.tempTrendTimer--;
			volatility = this.tempVolatility;
			trend = this.tempTrend;
		}else{
			if (currentValue < this.lowerBound) trend += volatility / 3;
			else if (currentValue > this.upperBound) trend -= volatility / 3;
		}

		let newValue = currentValue + (Math.random() * volatility) - (volatility / 2) + trend;
		if (newValue < 1) newValue = 1;
		else if (newValue > 300) newValue = 300;

		this.values.push(newValue);
	}

	getValue() {
		return this.values[this.values.length - 2];
	}

	adjust(volatility, trend, timer) {
		this.tempVolatility = volatility;
		this.tempTrend = trend;
		this.tempTrendTimer = timer;
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
			//for (let i = 0; i < Math.floor(profit / 1000); i++) coins.push(new Coin(mouseX, mouseY, 1000));
			coins.push(new Coin(mouseX, mouseY, profit));
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
		this.startDate = this.startofDay;
	},

	draw: function() {
		let oldDate = this.today.getDate();
		this.today.setMinutes(this.today.getMinutes() + 20);

		if (this.today.getDate() != oldDate) {
			this.newDay(this.today.getDate());
		}

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

	newDay: function(day) {
		if (day == 1) chart.newMonth(this.today.getMonth(), this.today.getYear());
		
		this.startofDay = this.today.getTime();

		chart.update();
		gold.update();
		oil.update();
		tech.update();
	}
}


let news = {
	messagePos: 0,
	storyIndex: false,
	message: "The biggest stories as they happen!",

	draw: function() {

		fill(0);
		noStroke();
		textSize(20);
		textAlign(LEFT);
		text(this.message, 1210 - this.messagePos, 50);

		this.messagePos++;
		if (this.messagePos > 560 + textWidth(this.message)) {
			this.messagePos = 0;

			if(this.storyIndex != false) {
				newsStories[this.storyIndex].consequence();
				if (newsStories[this.storyIndex].remove) newsStories.splice(this.storyIndex, 1);
			}

			this.storyIndex = Math.floor(Math.random() * newsStories.length);
			this.message = newsStories[this.storyIndex].story;			
		}

		textAlign(CENTER);

		fill(backgroundCol);
		rect(0 , 0, 480, 80);
		rect(1210 , 0, 70, 80);

		stroke(0);
		strokeWeight(4);
		noFill();
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

let chart = new Chart(100, 120, 1080, 400);
let gold = new Stock("Gold", 70, 20, 0.3, 60, 250, "#FF7732", 240, 570);
let oil = new Stock("Oil", 60, 60, 0.1, 30, 150, "#B125D9", 540, 570);
let tech =  new Stock("Tech", 120, 40, -0.3, 20, 200, "#00AAFF", 840, 570);

let restartButton = new Button(canvasX / 2, 500, 60, "#00DB21", "Restart", () => location.reload());

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

	if (score < 1000000) {
		background(backgroundCol);
		news.draw();
		drawScore();
		date.draw();
		oil.draw();
		tech.draw();
		gold.draw();
		chart.draw();
		coins.draw();
		dollar.draw();
	}else{
		noStroke();
		fill(color(0, 0, 0, 5));
		rect(0, 0, canvasX, canvasY);
		stroke(0);
		strokeWeight(8);
		fill(255);
		rect(150, 250, 980, 160, 20);
		textSize(50);
		fill(0);
		strokeWeight(3);
		text("Congratulations! You made $1,000,000!", canvasX / 2, 310);
		textSize(30);
		text("It took you " + Math.floor((date.startofDay - date.startDate) / 86400000) + " days!", canvasX / 2, 360);
		restartButton.draw();
	}

}