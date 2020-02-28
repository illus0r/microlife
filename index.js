//console.log('hello')

// Const
// Force field resolution
const fieldResolution = [64, 64]

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
let reproductionTime = 0.5
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
	let gravityFieldLocalSize = 100
	gravityFieldLocal = createGraphics(gravityFieldLocalSize, gravityFieldLocalSize)
	gravityFieldLocal.noStroke()
	gravityFieldLocal.background('white')
	for(let i = gravityFieldLocal.width; i > 0; i--){
		gravityFieldLocal.fill(200 + 56 * i * 2 / gravityFieldLocal.width)
		gravityFieldLocal.circle(
			gravityFieldLocal.width / 2,
			gravityFieldLocal.height / 2,
			i * 2
		)
	}
}


function Cell(properties) {
	let p = properties
	// TODO unpack props
	this.position = [p.x, p.y]
	this.timer = 0
	this.getRadius = () => this.timer < 100 ? 10 + this.timer * 0.1 : 10
	this.getScreenX = (x) => int(x * width  / fieldResolution[0])
	this.getScreenY = (y) => int(y * height / fieldResolution[1])
	this.getFieldX = (x) => int(x * fieldResolution[0] / width)
	this.getFieldY = (y) => int(y * fieldResolution[1] / height)
	this.velocity = createVector(random(-1, 1), random(-1, 1))

	this.getGradient = field => {
		let fieldX = this.getFieldX(this.position[0])
		let fieldY = this.getFieldY(this.position[1])
		let dx = field.get(fieldX - 2, fieldY)[0] - field.get(fieldX + 1, fieldY)[0]
		let dy = field.get(fieldX, fieldY - 2)[0] - field.get(fieldX, fieldY + 1)[0]
		return [dx, dy]
	}

	this.draw = function() {
		push()
		fill(0)
		noStroke()
		let radius = this.getRadius()
		circle(this.position[0], this.position[1], radius)
		//translate(-50, -50)
		//blendMode(MULTIPLY)
		//image(gravityFieldLocal, this.position[0], this.position[1])
		//blendMode(BLEND)
		pop()
		push()
		translate(-gravityFieldLocal.width / 2, -gravityFieldLocal.height / 2)
		image(gravityFieldLocal,
			this.position[0],
			this.position[1],
			gravityFieldLocal.width,
			gravityFieldLocal.height,
		)
		//console.log(
			//this.getFieldX(this.position[0]),
			//this.getFieldY(this.position[1]),
		//)
		pop()
	}

	this.update = function() {
		// Draw gravity field
		//let radius = this.getRadius()
		//gravityField.circle(
			//this.getFieldX(this.position[0]),
			//this.getFieldY(this.position[1]),
			//this.getFieldX(radius)
		//)
		//if(random() < frameRate() / 100) {
			//gravityField.push()
			//gravityField.translate(-gravityFieldLocal.width / 2, -gravityFieldLocal.height / 2)
			//gravityField.image(gravityFieldLocal,
				//this.getFieldX(this.position[0]),
				//this.getFieldY(this.position[1]),
				//gravityFieldLocal.width,
				//gravityFieldLocal.height,
			//)
			////console.log(
				////this.getFieldX(this.position[0]),
				////this.getFieldY(this.position[1]),
			////)
			//gravityField.pop()
		//}

		this.timer++
		let [dx, dy] = this.getGradient(gravityField)
		this.forceGravity = createVector(dx, dy)
		let mass = 100 //FIXME
		let friction = 0.1
		this.velocity.mult(1 - friction)
		this.velocity.add(this.forceGravity.copy().div(mass).mult(-1))
		this.position[0] += this.velocity.x
		this.position[1] += this.velocity.y
	}
}

let cells = []
let gravityField
let gravityFieldLocal

function setup() {
	createCanvas(512, 512)
	gravityField = createGraphics(
		fieldResolution[0],
		fieldResolution[1]
	)

	createGravityFieldLocal()

	for(let i = 0; i < 100; i++){
		cells.push(new Cell({
			x: random(width/2 - 50, width/2 + 50),
			y: random(height/2 - 50, height/2 + 50),
		}))
	}
	
}

function draw() {
	blendMode(BLEND)
	//gravityField.blendMode(BLEND)
	gravityField.background('white')
	background('white')
	blendMode(MULTIPLY)
	//gravityField.blendMode(MULTIPLY)

	cells.forEach(cell => {
		cell.update()
	})

	//gravityField.filter(BLUR, 50)
	image(gravityField, 0, 0, width, height)
	
	cells.forEach(cell => {
		cell.draw()
	})

	let fps = frameRate()
	text("FPS: " + fps.toFixed(2), 10, height - 10)
}
