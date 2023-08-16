export default class Player2d {
	private world2d: HTMLCanvasElement;
	private ctx2d: CanvasRenderingContext2D;
	private walls: Uint8Array;
	private wallCols: number;
	private wallRows: number;
	private wallW: number;
	private wallH: number;
	private rays: Float32Array | null;
	private rayIncrement: number;
	private rayOpacity: number;
	private fovRad: number;
	private fov: number;
	private rotation: number;
	private angle: number;
	private distToProjectionPlane: number;
	private rayAngles: Float32Array | null;
	private rayDensityAdjustment: number;
	private rotDir: string | null;
	private rotAmt: number;

	constructor(
		world2d: HTMLCanvasElement,
		ctx2d: CanvasRenderingContext2D,
		walls: Uint8Array,
		wallCols: number,
		wallRows: number,
		wallW: number,
		wallH: number
	) {
		this.world2d = world2d;
		this.ctx2d = ctx2d;
		this.walls = walls;
		this.wallCols = wallCols;
		this.wallRows = wallRows;
		this.wallW = wallW;
		this.wallH = wallH;
		this.rays = null;
		this.rayIncrement = 2;
		this.rayOpacity = 0.26;
		this.fov = 45;
		this.fovRad = this.fov * (Math.PI / 180);
		this.rotation = 45;
		this.angle = this.rotation + 90;
		this.distToProjectionPlane = world2d.width / 2 / Math.tan(this.fovRad / 2);
		this.rayAngles = null;
		this.rayDensityAdjustment = 12;
		this.rotDir = null;
		this.rotAmt = 0.2;
	}

	public setUp() {
		this.setAngles();
	}

	public setRotation(dir: string | null) {
		if (this.rotDir === null) {
			this.rotAmt = 2;
		}
		this.rotDir = dir;
		// console.log(this.rotAmt);
	}

	private rotate() {
		// if (this.rotAmt < this.rotAmt) {
		// 	this.rotAmt += 0.1;
		// }

		if (this.rotDir === 'left') {
			this.rotation -= this.rotAmt;
			this.angle -= this.rotAmt;
		} else if (this.rotDir === 'right') {
			this.rotation += this.rotAmt;
			this.angle += this.rotAmt;
		}
		// console.log(this.rotation);
	}

	private move() {
		this.rotate();
		// if (this.moveAmt < this.moveAmtTop) {
		// 	if (!this.fullscreen) {
		// 		this.moveAmt += 0.05;
		// 	} else {
		// 		this.moveAmt = this.moveAmtTop;
		// 	}
		// }
		// const dirRadians = this.angle * (Math.PI / 180);
		// const moveX = this.moveAmt * Math.cos(90 * (Math.PI / 180) - dirRadians);
		// const moveY = this.moveAmt * Math.cos(dirRadians);
		// const dirRadiansStrafe = dirRadians + Math.PI / 2;
		// const strafeX = (this.moveAmt * Math.cos(90 * (Math.PI / 180) - dirRadiansStrafe)) / 2;
		// const strafeY = (this.moveAmt * Math.cos(dirRadiansStrafe)) / 2;
		// const hittingF = this.moveDirRays.foreward < 5;
		// const hittingL = this.moveDirRays.left < 5;
		// const hittingR = this.moveDirRays.right < 5;
		// const hittingB = this.moveDirRays.backward < 5;
		// if (this.moveDirFB === 'forwards') {
		// 	if (!hittingF) {
		// 		this.playerX += moveX;
		// 	}
		// 	if (!hittingF) {
		// 		this.playerY -= moveY;
		// 	}
		// } else if (this.moveDirFB === 'backwards') {
		// 	if (!hittingB) {
		// 		this.playerX -= moveX;
		// 	}
		// 	if (!hittingB) {
		// 		this.playerY += moveY;
		// 	}
		// }
		// if (this.moveDirStrafe === 'left') {
		// 	if (!hittingL) {
		// 		this.playerX -= strafeX;
		// 	}
		// 	if (!hittingL) {
		// 		this.playerY += strafeY;
		// 	}
		// } else if (this.moveDirStrafe === 'right') {
		// 	if (!hittingR) {
		// 		this.playerX += strafeX;
		// 	}
		// 	if (!hittingR) {
		// 		this.playerY -= strafeY;
		// 	}
		// }
	}

	private setAngles() {
		const angleArrLength = Math.ceil(
			(this.world2d.width + this.rayDensityAdjustment) / this.rayDensityAdjustment
		);
		this.rayAngles = new Float32Array(angleArrLength);
		this.distToProjectionPlane = this.world2d.width / 2 / Math.tan(this.fovRad / 2);

		let x = 0;
		for (let i = 0; i < angleArrLength; i++) {
			this.rayAngles[i] = Math.atan((x - this.world2d.width / 2) / this.distToProjectionPlane);
			x += this.rayDensityAdjustment;
		}

		this.rays = new Float32Array(this.rayAngles.length);
		// console.log(this.rayAngles);
	}

	private getIntersection = (
		x: number,
		y: number,
		r: number,
		theta: number,
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		rot: number
	) => {
		const adjustedAngle = theta + rot * (Math.PI / 180);
		const x3 = x;
		const y3 = y;
		const x4 = x + r * Math.cos(adjustedAngle);
		const y4 = y + r * Math.sin(adjustedAngle);
		const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

		// console.log(adjustedAngle);
		if (denom == 0) {
			return;
		}
		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
		const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;
		if (t > 0 && t < 1 && u > 0) {
			const px = x3 + u * (x4 - x3);
			const py = y3 + u * (y4 - y3);
			return [px, py];
		} else {
			return;
		}
	};

	public draw(x: number, y: number) {
		this.move();
		if (!this.rayAngles || !this.rays) return;
		const r = 1;
		const rotation = ((this.rotation % 360) + 360) % 360;

		for (let i = 0; i < this.rayAngles.length; i++) {
			let closest = null;
			let record = Infinity;

			for (let j = 0; j < this.wallRows; j++) {
				for (let k = 0; k < this.wallCols; k++) {
					const wall = this.walls[j * this.wallCols + k];
					if (wall === 0) continue;

					const x1 = k * this.wallW;
					const y1 = j * this.wallH;

					const x2 = x1 + this.wallW;
					const y2 = y1;

					const x3 = x1 + this.wallW;
					const y3 = y1 + this.wallH;

					const x4 = x1;
					const y4 = y1 + this.wallH;

					for (let n = 0; n < 4; n++) {
						switch (n) {
							case 0:
								const intersectionTop = this.getIntersection(
									x,
									y,
									r,
									this.rayAngles[i],
									x1,
									y1,
									x2,
									y2,
									rotation
								);
								if (intersectionTop) {
									const dx = Math.abs(x - intersectionTop[0]);
									const dy = Math.abs(y - intersectionTop[1]);
									const d = Math.sqrt(dx * dx + dy * dy);
									record = Math.min(d, record);
									if (d <= record) {
										record = d;
										closest = intersectionTop;
									}
								}

								break;
							case 1:
								const intersectionRight = this.getIntersection(
									x,
									y,
									r,
									this.rayAngles[i],
									x2,
									y2,
									x3,
									y3,
									rotation
								);
								if (intersectionRight) {
									const dx = Math.abs(x - intersectionRight[0]);
									const dy = Math.abs(y - intersectionRight[1]);
									const d = Math.sqrt(dx * dx + dy * dy);
									record = Math.min(d, record);
									if (d <= record) {
										record = d;
										closest = intersectionRight;
									}
								}
								break;
							case 2:
								const intersectionBot = this.getIntersection(
									x,
									y,
									r,
									this.rayAngles[i],
									x3,
									y3,
									x4,
									y4,
									rotation
								);
								if (intersectionBot) {
									const dx = Math.abs(x - intersectionBot[0]);
									const dy = Math.abs(y - intersectionBot[1]);
									const d = Math.sqrt(dx * dx + dy * dy);
									record = Math.min(d, record);
									if (d <= record) {
										record = d;
										closest = intersectionBot;
									}
								}
								break;
							case 3:
								const intersectionLeft = this.getIntersection(
									x,
									y,
									r,
									this.rayAngles[i],
									x4,
									y4,
									x1,
									y1,
									rotation
								);
								if (intersectionLeft) {
									const dx = Math.abs(x - intersectionLeft[0]);
									const dy = Math.abs(y - intersectionLeft[1]);
									const d = Math.sqrt(dx * dx + dy * dy);
									record = Math.min(d, record);
									if (d <= record) {
										record = d;
										closest = intersectionLeft;
									}
								}
								break;
						}
					}

					// switch (wall) {
					// 	case 0:
					// 		break;
					// 	case 1:
					// 		break;
					// }
				}
			}

			// for (let i = 0; i < this.wallCoords.length; i += 4) {
			// 	// console.log(this.walls[i]);
			// 	const x1 = this.wallCoords[i];
			// 	const y1 = this.wallCoords[i + 1];
			// 	const x2 = this.wallCoords[i + 2];
			// 	const y2 = this.wallCoords[i + 3];

			// 	const intersection = this.getIntersection(x, y, r, this.rayAngles[i], x1, y1, x2, y2, rotation);

			// 	if (intersection) {
			// 		const dx = Math.abs(x - intersection[0]);
			// 		const dy = Math.abs(y - intersection[1]);
			// 		const d = Math.sqrt(dx * dx + dy * dy);
			// 		record = Math.min(d, record);
			// 		if (d <= record) {
			// 			record = d;
			// 			closest = intersection;
			// 		}
			// 	}
			// }

			if (closest) {
				this.ctx2d.beginPath();
				this.ctx2d.moveTo(x, y);
				this.ctx2d.lineTo(closest[0], closest[1]);
				this.ctx2d.strokeStyle = `rgba(255,255,255,${this.rayOpacity})`;
				this.ctx2d.lineWidth = 1;
				this.ctx2d.stroke();

				this.rays[i] = record;
			} else {
				this.rays[i] = Infinity;
			}

			// const rotationF = ((this.rotation % 360) + 360) % 360;
			// const rotationR = (((this.rotation + 90) % 360) + 360) % 360;
			// const rotationB = (((this.rotation + 180) % 360) + 360) % 360;
			// const rotationL = (((this.rotation - 90) % 360) + 360) % 360;

			// let closestF = null;
			// let recordF = Infinity;

			// let closestL = null;
			// let recordL = Infinity;

			// let closestR = null;
			// let recordR = Infinity;

			// let closestB = null;
			// let recordB = Infinity;

			// for (let i = 0; i < this.walls.length; i++) {
			// 	const x1 = this.walls[i];
			// 	const y1 = this.walls[i + 1];
			// 	const x2 = this.walls[i + 2];
			// 	const y2 = this.walls[i + 3];

			// 	const fIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationF);
			// 	const lIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationL);
			// 	const rIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationR);
			// 	const bIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationB);

			// 	if (fIntersection) {
			// 		const dx = Math.abs(x - fIntersection[0]);
			// 		const dy = Math.abs(y - fIntersection[1]);
			// 		const d = Math.sqrt(dx * dx + dy * dy);

			// 		recordF = Math.min(d, recordF);
			// 		if (d <= recordF) {
			// 			recordF = d;
			// 			closestF = fIntersection;
			// 		}
			// 	}
			// 	if (lIntersection) {
			// 		const dx = Math.abs(x - lIntersection[0]);
			// 		const dy = Math.abs(y - lIntersection[1]);
			// 		const d = Math.sqrt(dx * dx + dy * dy);

			// 		recordL = Math.min(d, recordL);
			// 		if (d <= recordL) {
			// 			recordL = d;
			// 			closestL = lIntersection;
			// 		}
			// 	}
			// 	if (rIntersection) {
			// 		const dx = Math.abs(x - rIntersection[0]);
			// 		const dy = Math.abs(y - rIntersection[1]);
			// 		const d = Math.sqrt(dx * dx + dy * dy);

			// 		recordR = Math.min(d, recordR);
			// 		if (d <= recordR) {
			// 			recordR = d;
			// 			closestR = rIntersection;
			// 		}
			// 	}
			// 	if (bIntersection) {
			// 		const dx = Math.abs(x - bIntersection[0]);
			// 		const dy = Math.abs(y - bIntersection[1]);
			// 		const d = Math.sqrt(dx * dx + dy * dy);

			// 		recordB = Math.min(d, recordB);
			// 		if (d <= recordB) {
			// 			recordB = d;
			// 			closestB = bIntersection;
			// 		}
			// 	}
			// }

			// if (closestF) {
			// 	this.moveDirRays.foreward = recordF;
			// } else {
			// 	this.moveDirRays.foreward = Infinity;
			// }

			// if (closestL) {
			// 	this.moveDirRays.left = recordL;
			// } else {
			// 	this.moveDirRays.left = Infinity;
			// }

			// if (closestR) {
			// 	this.moveDirRays.right = recordR;
			// } else {
			// 	this.moveDirRays.right = Infinity;
			// }

			// if (closestB) {
			// 	this.moveDirRays.backward = recordB;
			// } else {
			// 	this.moveDirRays.backward = Infinity;
			// }

			this.ctx2d.fillStyle = 'rgb(0, 155, 255)';
			this.ctx2d.beginPath();
			this.ctx2d.ellipse(x, y, 2, 2, 0, 0, 2 * Math.PI);
			this.ctx2d.fill();

			// this.walls3d.draw(
			// 	this.rayLengths,
			// 	this.rayXvalues,
			// 	this.rayYvalues,
			// 	this.allSpriteRays,
			// 	this.cornersInView
			// );
		}
	}
}
