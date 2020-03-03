import Cell from "../cell.js";

let friction = 1 // FIXME move inside config

function Predator(properties) {
	Cell.call(this, properties)
	this.type = 'predator'
	
	//this.repulsionFieldLocal = createFieldLocal(0, 50, 0.5)
	//this.attractionFieldLocal = createFieldLocal(1, 100, 0)
	// FIXME
}

function Prey(properties) {
	Cell.call(this, properties)
	this.type = 'prey'

	//this.repulsionFieldLocal = createFieldLocal(0, 50, 0)
	//this.attractionFieldLocal = createFieldLocal(1, 100, 0.1)
	// FIXME

	this.draw = function() {
		this.p.push()
		this.p.translate(this.pos.x, this.pos.y)
		this.p.fill(0)
		this.p.circle(0, 0, 4)
		this.p.pop()
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



export default function sketch(p) {
	let cells = []
	let gravityField

	p.setup = function() {
		this.createCanvas(512, 512)

		for(let i = 0; i < 31; i++){
			cells.push(new Predator({
				p: this,
				x: 30 + i * 10,
				y: this.height / 2,
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
				p: this,
				x: this.random(this.width),
				y: this.random(this.height),
			}))
		}
	}

	p.draw = function() {
		this.background('black')
		this.blendMode(this.SCREEN)
		cells.forEach(cell => {
			cell.drawFields()
		})

		cells.forEach(cell => {
			cell.update()
		})

		this.blendMode(this.BLEND)
		this.background('silver')
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

		let fps = this.frameRate()
		this.text("FPS: " + fps.toFixed(2), 10, this.height - 10)
	}.bind(p)
}




