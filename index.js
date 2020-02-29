//console.log('hello')

// Const

// Vars
// вязкость
let friction = 0.1

// amount of food
let foodAmount = 0.5
// gravity
let gravity = 0.5
// charge
let charge = 0.5

// Cell props
// - reproduction speed
let reproductionTime = 50
// - lifespan
let lifespan = 0.5
// - quantity of strings
let stringsQuantity = 0.5
// ~ ~ ~
// - string strength
//let stringsStrength = 0.5
// - string length
//let stringsLength = 0.5
// - color
// - possible angle of string
// - size
// - stress


// Scenario:
// Cell is changing it's form and size
// Cell hunts for a food.
// Cell reproduces once. Cells 


function createGravityFieldLocal() {
	let gravityFieldLocalSize = 50
	gravityFieldLocal = createGraphics(gravityFieldLocalSize, gravityFieldLocalSize)
	gravityFieldLocal.noStroke()
	gravityFieldLocal.background('white')
	for(let i = gravityFieldLocal.width; i > 0; i--){
		gravityFieldLocal.fill(100 + 156 * i * 2 / gravityFieldLocal.width)
		gravityFieldLocal.circle(
			gravityFieldLocal.width / 2,
			gravityFieldLocal.height / 2,
			i * 2
		)
	}
}


function Cell(properties) {
	let p = properties
	this.pos = createVector(p.x, p.y)

	this.timer = 0
	this.mass = 10
	this.velocity = createVector(random(-1, 1), random(-1, 1))

	this.getRadius = () => 5 + this.timer / 20

	this.getScreenX = (x) => int(x * width  / fieldResolution[0])

	this.getScreenY = (y) => int(y * height / fieldResolution[1])

	this.getFieldX = (x) => int(x * fieldResolution[0] / width)

	this.getFieldY = (y) => int(y * fieldResolution[1] / height)

	this.getGradient = () => {
		if(
			this.pos.x < 1 ||
			this.pos.x > width - 2 ||
			this.pos.y < 1 ||
			this.pos.y > height - 2
			) {
			return [0, 0]
		}
		let fieldX = this.pos.x
		let fieldY = this.pos.y
		let dx = get(fieldX - 1, fieldY)[0] - get(fieldX + 1, fieldY)[0]
		let dy = get(fieldX, fieldY - 1)[0] - get(fieldX, fieldY + 1)[0]
		return [dx, dy]
	}

	// DRAW FIELD
	//
	this.drawFields = function() {
		push()
		translate(-gravityFieldLocal.width / 2, -gravityFieldLocal.height / 2)
		image(gravityFieldLocal,
			this.pos.x,
			this.pos.y,
			gravityFieldLocal.width,
			gravityFieldLocal.height,
		)
		pop()
	}

	// DRAW
	//
	this.draw = function() {
		let radius = this.getRadius()
		circle(this.pos.x, this.pos.y, radius)
	}

	// UPDATE
	//
	this.update = function() {
		this.timer++
		if (this.timer > reproductionTime && random() < 0.1) {
			this.reproduce()
		}
		this.applyForce()
		this.move()
	}

	this.reproduce = function() {
		cells.push(new Cell({
			x: this.pos.x,
			y: this.pos.y,
		}))
		this.timer = 0
	}

	this.applyForce = function() {
		let [dx, dy] = this.getGradient()
		this.forceGravity = createVector(dx, dy)
		this.velocity.mult(1 - friction)
		this.velocity.add(this.forceGravity.copy().div(this.mass).mult(-1))
	}

	this.move = function() {
		this.pos.x += this.velocity.x
		this.pos.y += this.velocity.y

		// reflection
		if(this.pos.x < 0) {
			this.pos.x = 0
			this.velocity.x = - this.velocity.x
		}
		if(this.pos.x > width - 1) {
			this.pos.x = width - 1
			this.velocity.x = - this.velocity.x
		}
		if(this.pos.y < 0) {
			this.pos.y = 0
			this.velocity.y = - this.velocity.y
		}
		if(this.pos.y > height - 1) {
			this.pos.y = height - 1
			this.velocity.y = - this.velocity.y
		}
		
	}
}

let cells = []
let gravityField
let gravityFieldLocal

function setup() {
	createCanvas(512, 512)

	createGravityFieldLocal()

	for(let i = 0; i < 10; i++){
		cells.push(new Cell({
			//x: random(width),
			//y: random(height),
			x: random(width/2 - 10, width/2 + 10),
			y: random(height/2 - 10, height/2 + 10),
		}))
	}
	
}

function draw() {
	background('white')
	blendMode(MULTIPLY)
	cells.forEach(cell => {
		cell.drawFields()
	})

	cells.forEach(cell => {
		cell.update()
	})

	blendMode(BLEND)
	background('white')
	cells.forEach(cell => {
		cell.draw()
	})

	let fps = frameRate()
	text("FPS: " + fps.toFixed(2), 10, height - 10)
}
