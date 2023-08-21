import { IPlayer, IPlayerRays } from './types';

export default class Player2d {
	private world2d: HTMLCanvasElement;
	private ctx2d: CanvasRenderingContext2D;
	private walls: Uint8Array;
	private wallCols: number;
	private wallRows: number;
	private wallW: number;
	private wallH: number;
	private frameRate: number;
	private speedMultiplier: number;
	public rays: Float32Array | null;
	public rayCoords: Float32Array | null;
	public objectTypes: Uint8Array | null;
	public objectDirs: Uint8Array | null;
	public extraRay: {
		ang: number;
		l: number;
		coords: number[];
		objType: number;
		objDir: number;
	};
	private rayIncrement: number;
	private rayOpacity: number;
	private fov: number;
	private fovRad: number;
	public rotation: number;
	private angle: number;
	private distToProjectionPlane: number;
	public rayAngles: Float32Array | null;
	private rayDensityAdjustment: number;
	public rotDir: string | null;
	public rotAmt: number;
	private moveDirFB: string | null;
	private moveAmtStart: number;
	private moveAmt: number;
	private moveAmtTop: number;
	private moveDirStrafe: string | null;
	private moveDirRays: {
		foreward: number;
		left: number;
		right: number;
		backward: number;
	};
	public playerX: number;
	public playerY: number;
	public devMode: boolean;
	public playerRays: IPlayerRays[];
	public playerW: number;
	private renderDist: number;

	constructor(
		world2d: HTMLCanvasElement,
		ctx2d: CanvasRenderingContext2D,
		walls: Uint8Array,
		wallCols: number,
		wallRows: number,
		wallW: number,
		wallH: number,
		frameRate: number
	) {
		this.world2d = world2d;
		this.ctx2d = ctx2d;
		this.walls = walls;
		this.wallCols = wallCols;
		this.wallRows = wallRows;
		this.wallW = wallW;
		this.wallH = wallH;
		this.frameRate = frameRate;
		this.speedMultiplier = frameRate / 60;
		this.rays = null;
		this.rayCoords = null;
		this.objectTypes = null;
		this.objectDirs = null;
		this.extraRay = {
			ang: 0,
			l: 0,
			coords: [],
			objType: 0,
			objDir: 0,
		};
		this.rayIncrement = 2;
		this.rayOpacity = 0.26;
		this.fov = 60;
		this.fovRad = this.fov * (Math.PI / 180);
		this.rotation = 332;
		this.angle = this.rotation + 90;
		this.distToProjectionPlane = world2d.width / 2 / Math.tan(this.fovRad / 2);
		this.rayAngles = null;
		this.rayDensityAdjustment = 8;
		this.rotDir = null;
		this.rotAmt = 2 / this.speedMultiplier;
		this.moveDirFB = null;
		this.moveAmtStart = 3 / this.speedMultiplier;
		this.moveAmt = 3 / this.speedMultiplier;
		this.moveAmtTop = 3 / this.speedMultiplier;
		this.moveDirStrafe = null;
		this.moveDirRays = {
			foreward: Infinity,
			left: Infinity,
			right: Infinity,
			backward: Infinity,
		};
		this.playerX = 650;
		this.playerY = 120;
		this.devMode = true;
		this.playerRays = [];
		this.playerW = 20;
		this.renderDist = 800;
	}

	public setUp() {
		this.setAngles();
	}

	public setRotation(dir: string | null) {
		// if (this.rotDir === null) {
		// 	this.rotAmt = 2;
		// }
		this.rotDir = dir;
	}

	public setMouseRotation(amt: number) {
		this.rotation += amt;
		this.angle += amt;
	}

	public setStrafeDir(dir: string | null) {
		if (this.moveDirStrafe === null) {
			this.moveAmt = this.moveAmtStart;
		}
		this.moveDirStrafe = dir;
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
	}

	public setMoveDir(dir: string | null) {
		if (this.moveDirFB === null) {
			this.moveAmt = this.moveAmtStart;
		}
		this.moveDirFB = dir;
	}

	private move() {
		if (!this?.rays?.length) return;
		this.rotate();

		if (this.moveAmt < this.moveAmtTop) this.moveAmt += 0.05;

		const dirRadians = this.angle * (Math.PI / 180);
		const moveX = this.moveAmt * Math.cos(90 * (Math.PI / 180) - dirRadians);
		const moveY = this.moveAmt * Math.cos(dirRadians);
		const dirRadiansStrafe = dirRadians + Math.PI / 2;
		const strafeX = (this.moveAmt * Math.cos(90 * (Math.PI / 180) - dirRadiansStrafe)) / 2;
		const strafeY = (this.moveAmt * Math.cos(dirRadiansStrafe)) / 2;
		const hittingF = this.moveDirRays.foreward < 30;
		const hittingL = this.moveDirRays.left < 30;
		const hittingR = this.moveDirRays.right < 30;
		const hittingB = this.moveDirRays.backward < 30;

		if (this.moveDirFB === 'forwards') {
			if (!hittingF) {
				this.playerX += moveX;
				this.playerY -= moveY;
			}
		} else if (this.moveDirFB === 'backwards') {
			if (!hittingB) {
				this.playerX -= moveX;
				this.playerY += moveY;
			}
		}
		if (this.moveDirStrafe === 'left') {
			if (!hittingL) {
				this.playerX -= strafeX;
			}
			if (!hittingL) {
				this.playerY += strafeY;
			}
		} else if (this.moveDirStrafe === 'right') {
			if (!hittingR) {
				this.playerX += strafeX;
			}
			if (!hittingR) {
				this.playerY -= strafeY;
			}
		}
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

		this.extraRay.ang = Math.atan((x - this.world2d.width / 2) / this.distToProjectionPlane);

		this.rays = new Float32Array(this.rayAngles.length);
		this.rayCoords = new Float32Array(this.rayAngles.length * 2);
		this.objectTypes = new Uint8Array(this.rayAngles.length);
		this.objectDirs = new Uint8Array(this.rayAngles.length);
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
		p4?: { x: number; y: number }
	) => {
		const x3 = x;
		const y3 = y;
		let x4;
		let y4;
		let uMax = Infinity;
		if (p4?.x && p4?.y) {
			x4 = p4.x;
			y4 = p4.y;
			uMax = 1;
		} else {
			x4 = x + r * Math.cos(theta);
			y4 = y + r * Math.sin(theta);
		}

		const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

		if (denom == 0) {
			return;
		}
		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
		const u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;
		if (t >= 0 && t <= 1 && u >= 0 && u <= uMax) {
			const px = x3 + u * (x4 - x3);
			const py = y3 + u * (y4 - y3);
			return [px, py];
		} else {
			return;
		}
	};

	private getIntersectionsForRect(
		j: number,
		k: number,
		x: number,
		y: number,
		adjustedAngle: number,
		p4?: { x: number; y: number }
	) {
		if (!this.rayAngles) {
			return {
				record: Infinity,
				closest: null,
				dir: 0,
			};
		}
		const r = 1;

		// Test to see if the ray will intersect with the block at all before checking all 4 sides
		// const xMid = k * this.wallW + this.wallW / 2;
		// const yMid = j * this.wallH + this.wallH / 2;
		// const deltaD = this.wallW * Math.sqrt(2);
		// const slope = (yMid - y) / (xMid - x);
		// const perpSlope = -(1 / slope);
		// const angle = Math.atan(perpSlope);

		// const xMid1 = xMid + deltaD * Math.cos(angle);
		// const yMid1 = yMid + deltaD * Math.sin(angle);
		// const xMid2 = xMid - deltaD * Math.cos(angle);
		// const yMid2 = yMid - deltaD * Math.sin(angle);

		// const intersection = this.getIntersection(x, y, r, adjustedAngle, xMid1, yMid1, xMid2, yMid2);
		// if (!intersection) {
		// 	return {
		// 		record: Infinity,
		// 		closest: null,
		// 		dir: 0,
		// 	};
		// }

		const x1 = k * this.wallW;
		const y1 = j * this.wallH;

		const x2 = x1 + this.wallW;
		const y2 = y1;

		const x3 = x1 + this.wallW;
		const y3 = y1 + this.wallH;

		const x4 = x1;
		const y4 = y1 + this.wallH;

		let record = Infinity;
		let closest = null;
		let dir = 0;

		let wX1 = 0;
		let wY1 = 0;
		let wX2 = 0;
		let wY2 = 0;

		for (let n = 0; n < 4; n++) {
			switch (n) {
				case 0:
					wX1 = x1;
					wY1 = y1;
					wX2 = x2;
					wY2 = y2;
					break;
				case 1:
					wX1 = x2;
					wY1 = y2;
					wX2 = x3;
					wY2 = y3;
					break;
				case 2:
					wX1 = x3;
					wY1 = y3;
					wX2 = x4;
					wY2 = y4;
					break;
				case 3:
					wX1 = x4;
					wY1 = y4;
					wX2 = x1;
					wY2 = y1;
					break;
			}

			const intersection = this.getIntersection(x, y, r, adjustedAngle, wX1, wY1, wX2, wY2, p4);
			if (intersection?.[0]) {
				const dx = Math.abs(x - intersection[0]);
				const dy = Math.abs(y - intersection[1]);
				const d = Math.sqrt(dx * dx + dy * dy);
				record = Math.min(d, record);
				if (d <= record) {
					record = d;
					closest = intersection;
					dir = n;
				}
			}
		}

		return {
			record,
			closest,
			dir,
		};
	}

	private getRayAngle(x1: number, y1: number, x2: number, y2: number) {
		let rayAng =
			x2 - x1 < 0
				? 270 - (Math.atan((y2 - y1) / -(x2 - x1)) * 180) / Math.PI
				: 90 + (Math.atan((y2 - y1) / (x2 - x1)) * 180) / Math.PI;
		rayAng = (((rayAng - 90) % 360) + 360) % 360;

		return rayAng;
	}

	private getPercAcrScreen(
		x: number,
		y: number,
		px: number,
		py: number,
		rotation: number,
		isSprite: boolean
	) {
		const rayAng = this.getRayAngle(x, y, px, py);

		let rayRotDiff = rayAng - rotation;

		if (Math.abs(rayRotDiff) > this.fov / 2) {
			rayRotDiff = rayRotDiff >= 0 ? rayRotDiff - 360 : 360 + rayRotDiff;
		}

		const percAcrScreen = rayRotDiff / this.fov + 0.5;

		return percAcrScreen;
	}

	public draw(players: IPlayer[]) {
		const x = this.playerX;
		const y = this.playerY;

		this.playerRays = [];

		this.move();

		if (!this.rayAngles || !this.rays) return;
		const rotation = ((this.rotation % 360) + 360) % 360;

		let objTypeTemp = 0;
		let objDirTemp = 0;

		for (let i = 0; i < this.rayAngles.length + 1; i++) {
			let adjustedAngle;
			if (i === this.rayAngles.length) {
				adjustedAngle = this.extraRay.ang + rotation * (Math.PI / 180);
			} else {
				adjustedAngle = this.rayAngles[i] + rotation * (Math.PI / 180);
			}

			let closest = null;
			let record = Infinity;

			for (let j = 0; j < this.wallRows; j++) {
				for (let k = 0; k < this.wallCols; k++) {
					const wall = this.walls[j * this.wallCols + k];
					if (wall === 0) continue;

					const rectIntersection: {
						record: number;
						closest: number[] | null;
						dir: number;
					} = this.getIntersectionsForRect(j, k, x, y, adjustedAngle);

					if (rectIntersection.record < record) {
						record = rectIntersection.record;
						closest = rectIntersection.closest;

						objTypeTemp = wall;
						objDirTemp = rectIntersection.dir;
					}
				}
			}
			if (i === this.rayAngles.length) {
				// If on extra ray angle
				if (closest) {
					if (this.devMode) {
						this.ctx2d.beginPath();
						this.ctx2d.moveTo(x, y);
						this.ctx2d.lineTo(closest[0], closest[1]);
						this.ctx2d.strokeStyle = `rgba(0,255,0,${this.rayOpacity + 0.1})`;
						this.ctx2d.lineWidth = 1;
						this.ctx2d.stroke();
					}

					this.extraRay.l = record;
					if (this.rayCoords) {
						this.extraRay.coords[0] = closest[0];
						this.extraRay.coords[1] = closest[1];
					}
					if (this.objectTypes) this.extraRay.objType = objTypeTemp;
					if (this.objectDirs) this.extraRay.objDir = objDirTemp;
				} else {
					this.extraRay.l = Infinity;
				}
			} else {
				if (closest) {
					if (this.devMode) {
						this.ctx2d.beginPath();
						this.ctx2d.moveTo(x, y);
						this.ctx2d.lineTo(closest[0], closest[1]);
						this.ctx2d.strokeStyle = `rgba(255,255,255,${this.rayOpacity})`;
						this.ctx2d.lineWidth = 1;
						this.ctx2d.stroke();
					}

					this.rays[i] = record;
					if (this.rayCoords) {
						this.rayCoords[i * 2] = closest[0];
						this.rayCoords[i * 2 + 1] = closest[1];
					}
					if (this.objectTypes) this.objectTypes[i] = objTypeTemp;
					if (this.objectDirs) this.objectDirs[i] = objDirTemp;
				} else {
					this.rays[i] = Infinity;
				}
			}
		}

		loop1: for (let i = 0; i < players.length; i++) {
			const p = players[i];
			for (let j = 0; j < this.wallRows; j++) {
				for (let k = 0; k < this.wallCols; k++) {
					const wall = this.walls[j * this.wallCols + k];
					if (wall === 0) continue;

					const rectIntersection: {
						record: number;
						closest: number[] | null;
						dir: number;
					} = this.getIntersectionsForRect(j, k, x, y, 0, { x: p.x, y: p.y });

					if (rectIntersection?.closest?.[0]) continue loop1;
				}
			}

			const dx = Math.abs(x - p.x);
			const dy = Math.abs(y - p.y);
			const d = Math.sqrt(dx * dx + dy * dy);

			const deltaD = this.playerW / 2;
			const slope = (p.y - this.playerY) / (p.x - this.playerX);
			const perpSlope = -(1 / slope);
			const angle = Math.atan(perpSlope);
			const x1 = p.x + deltaD * Math.cos(angle);
			const y1 = p.y + deltaD * Math.sin(angle);
			const x2 = p.x - deltaD * Math.cos(angle);
			const y2 = p.y - deltaD * Math.sin(angle);

			const percAcrScreen: number = this.getPercAcrScreen(x, y, p.x, p.y, rotation, false);

			const angleDeg = this.getRayAngle(x, y, p.x, p.y);
			let percAcrScreenL: number = -1;
			let percAcrScreenR: number = -1;

			if (angleDeg >= 0 && angleDeg <= 180) {
				percAcrScreenL = this.getPercAcrScreen(x, y, x1, y1, rotation, true);
				percAcrScreenR = this.getPercAcrScreen(x, y, x2, y2, rotation, true);
			} else {
				percAcrScreenL = this.getPercAcrScreen(x, y, x2, y2, rotation, true);
				percAcrScreenR = this.getPercAcrScreen(x, y, x1, y1, rotation, true);
			}

			if ((percAcrScreenL >= 0 && percAcrScreenL <= 1) || (percAcrScreenR >= 0 && percAcrScreenR <= 1)) {
				if (percAcrScreenL >= 0 && percAcrScreenL <= 1 && percAcrScreenR >= 0 && percAcrScreenR <= 1) {
					const percAcrScreenLtemp = percAcrScreenL;
					percAcrScreenL = Math.min(percAcrScreenL, percAcrScreenR);
					percAcrScreenR = Math.max(percAcrScreenLtemp, percAcrScreenR);
				}
				this.playerRays.push({
					l: d,
					x: p.x,
					y: p.y,
					name: p.name,
					percAcrossScreen: percAcrScreen,
					percAcrossScreen1: percAcrScreenL,
					percAcrossScreen2: percAcrScreenR,
				});

				if (this.devMode) {
					this.ctx2d.beginPath();
					this.ctx2d.moveTo(x, y);
					this.ctx2d.lineTo(p.x, p.y);
					this.ctx2d.strokeStyle = `rgba(255,0,0,1)`;
					this.ctx2d.lineWidth = 1;
					this.ctx2d.stroke();
				}
			}
		}

		const rotationF = ((Math.PI / 180) * ((this.rotation % 360) + 360)) % 360;
		const rotationR = ((Math.PI / 180) * (((this.rotation + 90) % 360) + 360)) % 360;
		const rotationB = ((Math.PI / 180) * (((this.rotation + 180) % 360) + 360)) % 360;
		const rotationL = ((Math.PI / 180) * (((this.rotation - 90) % 360) + 360)) % 360;

		let closestF = null;
		let recordF = Infinity;

		let closestL = null;
		let recordL = Infinity;

		let closestR = null;
		let recordR = Infinity;

		let closestB = null;
		let recordB = Infinity;

		for (let i = 0; i < this.wallRows; i++) {
			for (let j = 0; j < this.wallCols; j++) {
				const wall = this.walls[i * this.wallCols + j];
				if (wall === 0) continue;

				const fIntersection: {
					record: number;
					closest: number[] | null;
				} = this.getIntersectionsForRect(i, j, x, y, rotationF);
				if (fIntersection.record < recordF) {
					recordF = fIntersection.record;
					closestF = fIntersection.closest;
				}

				const lIntersection: {
					record: number;
					closest: number[] | null;
				} = this.getIntersectionsForRect(i, j, x, y, rotationL);
				if (lIntersection.record < recordL) {
					recordL = lIntersection.record;
					closestL = lIntersection.closest;
				}

				const rIntersection: {
					record: number;
					closest: number[] | null;
				} = this.getIntersectionsForRect(i, j, x, y, rotationR);
				if (rIntersection.record < recordR) {
					recordR = rIntersection.record;
					closestR = rIntersection.closest;
				}

				const bIntersection: {
					record: number;
					closest: number[] | null;
				} = this.getIntersectionsForRect(i, j, x, y, rotationB);
				if (bIntersection.record < recordB) {
					recordB = bIntersection.record;
					closestB = bIntersection.closest;
				}
			}
		}

		if (closestF) this.moveDirRays.foreward = recordF;
		else this.moveDirRays.foreward = Infinity;

		if (closestL) this.moveDirRays.left = recordL;
		else this.moveDirRays.left = Infinity;

		if (closestR) this.moveDirRays.right = recordR;
		else this.moveDirRays.right = Infinity;

		if (closestB) this.moveDirRays.backward = recordB;
		else this.moveDirRays.backward = Infinity;

		this.ctx2d.fillStyle = `rgba(0,255,0,1)`;
		this.ctx2d.beginPath();
		this.ctx2d.ellipse(this.playerX, this.playerY, 6, 6, 0, 0, 2 * Math.PI);
		this.ctx2d.fill();
	}
}
