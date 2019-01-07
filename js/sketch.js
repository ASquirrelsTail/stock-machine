//Global Variables

let canvasX = 640;
let canvasY = 400;
let targetFrameRate = 60;
let canvasCenter;
let camera;

//Game variables

let player;

//Entities have position, velocity and acceleration
class Entity{
	constructor(startX, startY) {
		this.position = createVector(startX, startY);
		this.velocity = createVector(0, 0);
		this.acceleration = createVector(0, 0);
		this.maxVelocity = 1000;
		this.friction = 1; 
	}

	//Update the entity's position based on its velocity and acceleration
	update() {
		this.velocity.mult(this.friction).add(this.acceleration).limit(this.maxVelocity);
		this.position.add(this.velocity);
		this.acceleration = createVector(0, 0);
	}

	
}

//Player is an entity with a draw function
class Player extends Entity{
	constructor(startX, startY) {
		super(startX, startY);
		this.maxVelocity = 20; // Stop the player from accelerating to stupid speeds
		this.friction = 0.95; // Make the player slow down slightly over time
	}

	draw() {
		camera.setMatrix();
		translate(this.position.x, this.position.y);
		rotate(this.velocity.heading());
		triangle(20, 0, -10, 10, -10, -10);
	}
}

class Camera {
	constructor(centerX, centerY, zoom) {
		this.position = createVector(centerX, centerY).sub(canvasCenter);
		//this.zoom = zoom;
	}

	setMatrix() {
		resetMatrix();
		translate(-this.position.x, -this.position.y);
	}

	follow(entity) {
		this.position = p5.Vector.sub(entity.position, canvasCenter);
	}
}

function doAim() {
	strokeWeight(6);
	stroke(255);
	let vector = createVector(mouseX - canvasCenter.x, mouseY - canvasCenter.y);
	vector = vector.limit(100);

	resetMatrix();
	line(canvasCenter.x, canvasCenter.y, vector.x + canvasCenter.x, vector.y + canvasCenter.y);

	if (mouseIsPressed) {
		player.acceleration.sub(vector.mult(0.01));
	}
}

function setup() {
	createCanvas(canvasX, canvasY);
	frameRate(targetFrameRate);
	rectMode(CENTER);
	strokeCap(ROUND);
	canvasCenter = createVector(canvasX / 2, canvasY / 2);
	camera = new Camera(10, 10, 1.1);
	player = new Player(10, 10);
}

function draw() {
	background(20);
	fill(255);
	doAim();
	camera.follow(player); // Camera follows one frame behind player
	player.update();
	player.draw();
}