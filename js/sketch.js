//Global Variables
const canvasX = 1280;
const canvasY = 800;
const targetFrameRate = 60;
const backgroundCol = 255;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


//View object for storing and reseting current view/scale
let view = {
	scale: 1,
	offsetX: 0,
	offsetY: 0,
	reset: function() {
		resetMatrix();
		translate(this.offsetX, this.offsetY);
		scale(this.scale, this.scale);
	}
}


//Processing resize function updates view when called
function windowResized() {
	let gameAspect = canvasX / canvasY;
	let windowAspect = windowWidth / windowHeight;
	let newScale = 1;

	if (windowAspect > gameAspect) {
		newScale = windowHeight / canvasY;
	}else{
		newScale = windowWidth / canvasX;
	}

	view.scale = newScale;
	view.offsetX = -((canvasX * newScale) - windowWidth) / 2;
	view.offsetY = -((canvasY * newScale) - windowHeight) / 2;

	resizeCanvas(windowWidth, windowHeight);
}


// Coin that flys from start point to end point
class Coin {
	constructor(startX, startY, value) {
		this.position = createVector(startX, startY);
		this.target = createVector(dollar.position.x, dollar.position.y);
		this.velocity = p5.Vector.random2D().mult(Math.random() * 30);
		this.acceleration = createVector(0, 0);
		this.friction = 0.9;
		this.value = value;
		this.live = true;
		
	}

	//Called before each draw call - resolve the coins movement based on its velocity and trajectory towards it's target (The $ sign)
	update() {
		this.velocity.mult(this.friction).add(this.acceleration);
		let vectorToTarget = p5.Vector.sub(this.target, this.position);
		this.position.add(this.velocity);
		if (vectorToTarget.magSq() > 20 * 20) this.acceleration = vectorToTarget.normalize().mult(2); //If it's further than 20px away, acelerate towards the dollar
		else {
			this.position = createVector(canvasX * 0.9, canvasY * 0.1); //Otherwise kill it, and add it's value to the score
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


//Create extended array object to store coins
let coins = [];
//Called once per draw() loop by coins.draw(), updates coins, and removes dead ones
coins.update = function() {
	for(let i = 0; i < this.length; i++) {
		this[i].update();
		if (!this[i].live) { // Remove dead entities
			this.splice(i, 1);
			i--;
		}
	}
}
//Called once per processing draw() loop, updates all coins, then draws them
coins.draw = function() {
	this.update();
	fill(255, 255, 144);
	strokeWeight(4);
	stroke(180, 180, 0);
	this.forEach((entity) => entity.draw());
}
//Deletes all coins for game restarts
coins.deleteAll = function() {
	this.splice(0, this.length);
}


//Button class, has position, radius, color, label and onClick function
class Button {
	constructor(posX, posY, radius, color, label = "", onClick = () => false) {
		this.position = {x: posX, y: posY};
		this.radius = radius;
		this.color = color;
		this.label = label;
		this.onClick = onClick;
	}

	//Called during the processing draw() loop, draw button and processes clicks
	draw() {
		//Create a vector for the distance between the mouse and the centre of the button
		let mouseRange = createVector(((mouseX - view.offsetX) / view.scale) - this.position.x, ((mouseY - view.offsetY) / view.scale) - this.position.y);

		let buttonColor = color(this.color);
		let buttonHeight = 15;
		let yOffset = this.position.y;

		if (mouseRange.magSq() < this.radius * this.radius) { //Check if the mouse in inside the button's radius
			if (mouseIsPressed) { 
				if (this.onClick()) { //If mouse is pressed and it's click function returns true, reduce its height so it looks pressed
					buttonHeight = 10;
					yOffset = this.position.y + 5;
				}
			}else buttonColor = lerpColor(buttonColor, color(255, 255, 255), 0.2); //If the mouse is only hovering, lighten the button's color
		}

		//Draw the button
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


//Stock class
class Stock {
	constructor(name, value, volatility, trend, lowerBound, upperBound, color, posX, posY) {
		this.name = name;
		this.values = [value];
		this.volatility = volatility; //Volatility is how wildly the value fluctuates
		this.trend = trend; //Trend is the general direction the share is heading
		this.lowerBound = lowerBound;
		this.upperBound = upperBound;
		this.color = color;
		this.shares = 0;
		this.drawPos = {x: posX, y: posY};

		this.tempTrendTimer = 0; //Temporary trend and volatility are adjustments that last a certain number of days, before reverting to the standard
		this.tempTrend = 0;
		this.tempVolatility = 0;

		this.buyButton = new Button(posX + 50, posY + 130, 40, "#00DB21", "BUY!", () => this.buy());
		this.sellButton = new Button(posX + 150, posY + 130, 40, "#E33D1B", "SELL!", () => this.sell());

		for (let i = 0; i < 49; i++) this.addValue();
	}

	//Add a value for tomorrow based on current trends and volatility (depending if temporary adjustments are active)
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

	//Returns the current value of the share, the one currently visible on the graph
	getValue() {
		return this.values[this.values.length - 2];
	}

	//Adds a temporary adjustment to the volatility and trend of the stock for a number of days
	adjust(volatility, trend, timer) {
		this.tempVolatility = volatility;
		this.tempTrend = trend;
		this.tempTrendTimer = timer;
	}

	//Draw stocks name, value, current number owned, and buy/sell buttons
	draw() {
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

	//Called once a day by date.newDay() to remove the oldest value, and add a new one for tomorrow
	update() {
		this.values.splice(0, 1);
		this.addValue();
	}

	//Exchange score for stock of equivilent value. Returns true if a purchase was made, false if funds are insufficient
	buy() {
		let result = false;
		for (let i = 0; i < score / (this.getValue() * 120); i++) { //Number of transactions per frame scales with available funds
			if (score > this.getValue()) {
				this.shares++;
				score -= this.getValue();
				result = true;
			}
		}
		return result;
	}

	//Sell stock in exchange for score (delivered by way of coins). Returns true if a sale was made, false if there are no available stocks
	sell() {
		let result = false;
		let profit = 0;
		for (let i = 0; i < this.shares / 60 && i < 1000; i++) { //Number of sales per frame scales with number of shares owned
			if (this.shares > 0) {
				this.shares--;
				profit += this.getValue();
			}
		}
		if (profit > 0) { //If money was made create a coin for that value to deliver it to the score display
			coins.push(new Coin(((mouseX - view.offsetX) / view.scale), ((mouseY - view.offsetY) / view.scale), profit));
			result = true;
		}
		return result;
	}
}



//Called once per processing draw() loop
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


//Dollar sign, radius increases when a coin is delivered, and decreases slowly with time.
let dollar = {
	position: {x: 50, y: 50},
	radius: 25,

	//Called once per processing draw() loop, should be called after coins so they go behind it
	draw: function() {
		if (this.radius > 35) this.radius = 35;
		else if (this.radius > 25) this.radius -= 1;
		else this.radius = 25;

		stroke(0);
		strokeWeight(4);
		fill(180, 180, 0);
		ellipse(this.position.x, this.position.y, this.radius + 15);

		translate(this.position.x, this.position.y);
		scale(this.radius / 25, this.radius / 25);
		noStroke();
		fill(255, 255, 144);
		ellipse(0, 0, 25);
		fill(0);
		stroke(0);
		strokeWeight(2);
		textSize(30);
		text("$", 0, 2);
		view.reset();
	}
}


//Date object for in game date
let date = {
	init: function() {
		this.today = new Date();
		this.today.setMinutes(0);
		this.today.setHours(0);
		this.startofDay = this.today.getTime();
		this.startDate = this.startofDay;
	},

	//Called once per processing draw() loop
	draw: function() {
		let oldDate = this.today.getDate();
		this.today.setMinutes(this.today.getMinutes() + 20); //Adds 20 minutes tot he current day

		if (this.today.getDate() != oldDate) { //Checks if a new day has started
			this.newDay(this.today.getDate());
		}

		//Draws date box
		fill(255);
		stroke(0);
		strokeWeight(4);
		rect(230, 30, 200, 40, 10);
	
		fill(0);
		strokeWeight(1);
		textSize(20);
		text(this.today.toDateString(), 230, 36, 200, 30);
	},

	//Returns number of seconds in curent day -  for calculating how much of a day has passed
	seconds: function() {
		return this.today.getTime() - this.startofDay;
	},

	//Called at the start of each day
	newDay: function(day) {
		if (day == 1) chart.newMonth(this.today.getMonth(), this.today.getYear()); //Checks if a new month has started and adds it to the chart
		
		this.startofDay = this.today.getTime(); //Reset the start of day

		//Update chart and stocks
		chart.update();
		gold.update();
		oil.update();
		tech.update();
	}
}


//News object for showing and updating news stories
let news = {
	init: function() {
		this.messagePos = 0;
		this.storyIndex = false;
		this.message = "The biggest stories as they happen!";

		//Copy news data into news stories
		this.newsStories = newsStoriesData.slice(0);
	},
	
	//Called once per processing draw() loop
	draw: function() {

		//Draw news story text
		fill(0);
		noStroke();
		textSize(20);
		textAlign(LEFT);
		text(this.message, 1210 - this.messagePos, 50);

		//Advance the current message
		this.messagePos++;
		if (this.messagePos > 560 + textWidth(this.message)) { //If the message has finished show the next one
			this.messagePos = 0;

			if(this.storyIndex != false) {
				this.newsStories[this.storyIndex].consequence(); //resolve the current story's consequences
				if (this.newsStories[this.storyIndex].remove) this.newsStories.splice(this.storyIndex, 1); //If it should be removed delete it from the list of stories;
			}

			this.storyIndex = Math.floor(Math.random() * this.newsStories.length); //Choose a new story at random
			this.message = this.newsStories[this.storyIndex].story;			
		}

		textAlign(CENTER);

		//Cover any of the story outside the news story box then draw box
		fill(backgroundCol);
		rect(-1000, 0, 1480, 80);
		rect(1210 , 0, 1070, 80);

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


//Chart object for drawing and updating the chart
let chart = {
	init: function (posX, posY, width, height) {
		this.position = {x: posX, y: posY};
		this.width = width;
		this.height = height;
		this.yAxisRange = 300;
		this.xAxisRange = 50;
		this.months = [];
		this.lines = [];

		let daysInPrevMonth = [31, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30];
		this.months.push({label: monthNames[date.today.getMonth()] + " " + (date.today.getYear() % 100), position: date.today.getDate()});
		if (this.xAxisRange - date.today.getDate() > daysInPrevMonth[date.today.getMonth()]) {
			this.months.push({label: monthNames[(date.today.getMonth() + 11) % 12] + " " + ((date.today.getYear() - 1 + Math.ceil(date.today.getMonth()  / 12)) % 100), position: date.today.getDate() + daysInPrevMonth[date.today.getMonth()]});
		}
	},

	//Called once per processing draw() loop
	draw: function() {
		let dayProgress = date.seconds() / 86400000; //How far through the current day we are
		let interval = this.width / (this.xAxisRange - 2); //X axis intervals
		let noTicks = 7; //Number of Y-axis ticks to draw

		//Draw graph lines from stock data
		this.lines.forEach((item) => {
			strokeWeight(5);
			stroke(color(item.color));
			noFill();

			beginShape();
			for(let i = 0; i < item.values.length && i < this.xAxisRange; i++) {
				vertex((i * interval) + this.position.x - (dayProgress * interval), this.position.y + this.height - (item.values[i] / this.yAxisRange * this.height));
			}
			endShape();
		});

		//Cover the overflow of lines
		fill(backgroundCol);
		noStroke();
		rect(this.position.x -50, this.position.y - 10, 50, this.height + 20);
		rect(this.position.x + this.width, this.position.y - 10, 50, this.height + 20);

		//Draw axes
		strokeWeight(4);
		stroke(0);
		noFill();
		line(this.position.x, this.position.y, this.position.x, this.position.y + this.height);
		line(this.position.x, this.position.y + this.height, this.position.x + this.width, this.position.y + this.height);
		line(this.position.x + this.width, this.position.y + this.height, this.position.x + this.width, this.position.y);

		//Draw ticks
		for (let i = 0; i < noTicks; i++) {
			let posY = this.position.y + ((this.height / 6) * i);

			line(this.position.x, posY, this.position.x - 5, posY);
			line(this.position.x + this.width, posY, this.position.x + this.width + 5, posY);

			if (i % 2 == 0) {
				textSize(16);
				fill(0);
				strokeWeight(1);
				textAlign(RIGHT);
				text("£" + parseInt(this.yAxisRange * ((6 - i) / 6)), this.position.x - 10, posY);

				textAlign(LEFT);
				text("£" + parseInt(this.yAxisRange * ((6 - i) / 6)), this.position.x + this.width + 10, posY);

				strokeWeight(4);
				noFill();
			}
			
		}

		//Draw month markers
		textAlign(CENTER); //Reset text position
		textSize(16);
		fill(0);
		stroke(0);
		for (let i = 0; i < this.months.length; i++) {
			let xPos = this.position.x + this.width - ((this.months[i].position - 1) * interval) - (dayProgress * interval);
			strokeWeight(1);
			text(this.months[i].label, xPos, this.position.y + this.height + 18);
			strokeWeight(4);
			line(xPos, this.position.y + this.height, xPos, this.position.y + this.height + 5);
			
		}
		
	},

	//Add stock to draw as a line
	addLine: function(stock) {
		this.lines.push(stock);
	},

	//Add a new month marker, called by date.newDay() on the first of each month
	newMonth: function(month, year) {
		this.months.push({label: monthNames[month] + " " + (year % 100), position: 0});
	},

	//Called at the start of each day by date.newDay()
	update: function() {
		for (let i = 0; i < this.months.length; i++) {
			this.months[i].position++;
			if (this.months[i].position > 48) {
				this.months.splice(i, 1);
				i--;
			}
		}
	}
}


//Restart button to be shown at games end
let restartButton = new Button(canvasX / 2, 500, 60, "#00DB21", "Restart", () => initGame());


//Game variables
let score, gold, oil, tech, newsStories;


//Set/Reset game variables
function initGame() {
	date.init();
	news.init();

	score = 1000;

	coins.deleteAll();

	chart.init(100, 120, 1080, 400);
	gold = new Stock("Gold", 70, 20, 0.3, 60, 250, "#FF7732", 240, 570);
	oil = new Stock("Oil", 60, 60, 0.1, 30, 150, "#B125D9", 540, 570);
	tech =  new Stock("Tech", 120, 40, -0.3, 20, 200, "#00AAFF", 840, 570);
	chart.addLine(gold);
	chart.addLine(oil);
	chart.addLine(tech);	
}


//Processing setup
function setup() {
	createCanvas(canvasX, canvasY);
	windowResized();
	frameRate(targetFrameRate);
	rectMode(CORNER);
	ellipseMode(RADIUS);
	strokeCap(ROUND);
	strokeJoin(ROUND);
	textAlign(CENTER, CENTER);

	initGame();
}


//Processing draw/game loop
function draw() {
	view.reset();
	//Game
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
		dollar.draw(); //Call after coins so they are drawn behind it
	}else{
		//End game screen
		noStroke();
		fill(color(0, 0, 0, 5));
		resetMatrix()
		rect(0, 0, windowWidth, windowHeight);
		view.reset();
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