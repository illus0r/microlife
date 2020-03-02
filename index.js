// Const

// Vars
// вязкость
let friction = 1

// amount of food
let foodAmount = 0.5
// gravity
let gravity = 0.5
// charge
let charge = 0.5

// Cell props
// - reproduction speed
let reproductionTime = 999999999
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

// Food hunting
// Connecting to each other

function createFieldLocal(channel = 0, size = 50, strength = 0.5) {
	let fieldLocal = createGraphics(size, size)
	fieldLocal.noStroke()
	fieldLocal.background('white')
	for(let i = fieldLocal.width; i > 1; i--){
		let color = 256 * strength * (1 - i * 2 / fieldLocal.width)
		//color = 156 // FIXME
		switch (channel) {
			case 0:
				fieldLocal.fill(color, 0, 0)
				break;
			case 1:
				fieldLocal.fill(0, color, 0)
				break;
			case 2:
				fieldLocal.fill(0, 0, color)
				break;
		}
		fieldLocal.circle(
			fieldLocal.width / 2,
			fieldLocal.height / 2,
			i * 2
		)
		//break // FIXME
	}
	return fieldLocal
}



function Cell(properties) {
	let p = properties
	this.pos = createVector(p.x, p.y)

	this.timer = 0
	this.mass = 5
	this.velocity = createVector(random(-3, 3), random(-3, 3))
	this.force = createVector(0, 0)
	this.direction = random(TAU)
	this.repulsionFieldLocal = createFieldLocal(0, 50, 0.5)
	this.attractionFieldLocal = createFieldLocal(1, 100, 0.5)
	this.energy = 1
	this.cellAttached
	this.cellAttachedForce = createVector(0, 0)

	this.getRadius = () => 10//5 + this.timer / 20

	this.getScreenX = (x) => int(x * width  / fieldResolution[0])

	this.getScreenY = (y) => int(y * height / fieldResolution[1])

	this.getFieldX = (x) => int(x * fieldResolution[0] / width)

	this.getFieldY = (y) => int(y * fieldResolution[1] / height)

	this.feed = () => this.energy += 1

	this.getGradient = (channel) => {
		if(
			this.pos.x < 1 ||
			this.pos.x > width - 2 ||
			this.pos.y < 1 ||
			this.pos.y > height - 2
			) {
			return createVector(0, 0)
		}
		let fieldX = this.pos.x
		let fieldY = this.pos.y
		let dx = get(fieldX - 1, fieldY)[channel] - get(fieldX + 1, fieldY)[channel]
		let dy = get(fieldX, fieldY - 1)[channel] - get(fieldX, fieldY + 1)[channel]
		return createVector(dx, dy)
	}

	// DRAW FIELD
	//
	this.drawFields = function() {
		push()
		translate(-this.attractionFieldLocal.width / 2, -this.attractionFieldLocal.height / 2)
		image(this.attractionFieldLocal,
			this.pos.x,
			this.pos.y,
			this.attractionFieldLocal.width,
			this.attractionFieldLocal.height,
		)
		pop()

		push()
		translate(-this.repulsionFieldLocal.width / 2, -this.repulsionFieldLocal.height / 2)
		image(this.repulsionFieldLocal,
			this.pos.x,
			this.pos.y,
			this.repulsionFieldLocal.width,
			this.repulsionFieldLocal.height,
		)
		pop()
	}

	// DRAW
	//
	this.draw = function() {
		let radius = this.getRadius()
		//push()
		//translate(this.pos.x, this.pos.y)
		//rotate(this.direction)
		////ellipse(0, 0, radius, radius / 2)
		//pop()

		if(!this.cellAttached) return
		push()
		stroke(0)
		strokeWeight(radius)
		line(this.pos.x, this.pos.y, this.cellAttached.pos.x, this.cellAttached.pos.y)
		strokeWeight(radius-2)
		stroke('white')
		line(this.pos.x, this.pos.y, this.cellAttached.pos.x, this.cellAttached.pos.y)
		pop()

		// FORCE VECTORS
		//push()
		//translate(this.pos.x, this.pos.y)
		//let forceDraw = this.force.copy().mult(10)
		//line(0, 0, forceDraw.x, forceDraw.y)
		//pop()

	}

	// UPDATE
	//
	this.update = function() {
		this.timer++
		//if (this.energy > 2) {
			//this.reproduce()
			//this.energy -= 2
		//}
		//this.attach()
		//this.rotate()
		this.getForce()
		this.applyForce()
		this.move()
	}

	//this.attach = function() {
		//if(!this.attachment) {
			//if
		//}
	//}

	this.reproduce = function() {
		cells.push(new Cell({
			x: this.pos.x,
			y: this.pos.y,
		}))
		this.timer = 0
	}

	this.getForceAttachment = function() {
		let attachmentLength = 10
		let distance = this.cellAttached.pos.copy().sub(this.pos)
		let tension = distance.copy().sub(attachmentLength).mult(0.4)
		//tension.mult(tension.mag())
		return tension
	}

	this.getForce = function() {
		this.force.x = 0
		this.force.y = 0

		let forceRepulsion = this.getGradient(0)
		this.force.add(forceRepulsion)

		if(!this.cellAttached) {
			let forceAttraction = this.getGradient(1).mult(-2.5)
			this.force.add(forceAttraction)
		}

		let forceFriction = this.velocity.copy().mult(-friction)
		this.force.add(forceFriction)

		this.force.add(this.cellAttachedForce)

		if(!this.cellAttached) return
		let forceAttachment = this.getForceAttachment()
		this.force.add(forceAttachment)
		this.cellAttached.cellAttachedForce = -forceAttachment
	}

	this.applyForce = function() {
		this.velocity.add( this.force.div(this.mass) )
	}

	this.rotate = function() {
		this.direction = this.velocity.heading() 
	}


	this.move = function() {
		this.pos.x += this.velocity.x
		this.pos.y += this.velocity.y

		// reflection
		if(this.pos.x < 0) {
			this.pos.x = 8
			this.velocity.x = -2 * this.velocity.x
		}
		if(this.pos.x > width - 1) {
			this.pos.x = width - 9
			this.velocity.x = -2 * this.velocity.x
		}
		if(this.pos.y < 0) {
			this.pos.y = 8
			this.velocity.y = -2 * this.velocity.y
		}
		if(this.pos.y > height - 1) {
			this.pos.y = height - 9
			this.velocity.y = -2 * this.velocity.y
		}
		
	}
}


function Predator(properties) {
	Cell.call(this, properties)
	this.type = 'predator'
	
	this.repulsionFieldLocal = createFieldLocal(0, 50, 0.5)
	this.attractionFieldLocal = createFieldLocal(1, 100, 0)
}

function Prey(properties) {
	Cell.call(this, properties)
	this.type = 'prey'

	this.repulsionFieldLocal = createFieldLocal(0, 50, 0)
	this.attractionFieldLocal = createFieldLocal(1, 100, 0.1)

	this.draw = function() {
		push()
		translate(this.pos.x, this.pos.y)
		fill(0)
		circle(0, 0, 4)
		pop()
	}

	this.getForce = function() {
		this.force.x = 0
		this.force.y = 0
		let forceRepulsion = this.getGradient(0)
		let forceFriction = this.velocity.copy().mult(-friction)
		this.force.add(forceRepulsion)
		this.force.add(forceFriction)
	}

}

let cells = []
let gravityField

function setup() {
	createCanvas(512, 512)

	for(let i = 0; i < 31; i++){
		cells.push(new Predator({
			x: 30 + i * 10,
			y: height / 2,
			//x: random(width),
			//y: random(height),
		}))
	}
	for(let i = 0; i < 30; i++){
		if(i % 5)
			cells[i].cellAttached = cells[i + 1]
	}

	for(let i = 0; i < 200; i++){
		cells.push(new Prey({
			x: random(width),
			y: random(height),
		}))
	}
}

function draw() {
	background('black')
	blendMode(SCREEN)
	cells.forEach(cell => {
		cell.drawFields()
	})

	cells.forEach(cell => {
		cell.update()
	})

	blendMode(BLEND)
	//background('white')
	cells.forEach(cell => {
		cell.draw()
	})

	// EATING
	let eatingRadius = 5
	for(let i = 0; i < cells.length; i++) {
		for(let j = 1; j < i; j++) {
			if(i == j) {
				break
			}
			let cell1 = cells[i]
			let cell2 = cells[j]
			if (cell1.type == 'prey' &&
				cell2.type == 'predator' &&
				Math.abs(cell1.pos.x - cell2.pos.x) < eatingRadius &&
				Math.abs(cell1.pos.y - cell2.pos.y) < eatingRadius
			) {
				cells.splice(i, 1)
				cell2.feed()
				break
			}
		}
	}

	let fps = frameRate()
	text("FPS: " + fps.toFixed(2), 10, height - 10)
}
