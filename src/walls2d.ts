export default class Walls2d {
	private world2d: HTMLCanvasElement;
	private ctx2d: CanvasRenderingContext2D;
	private wallCols: number;
	private wallRows: number;
	private walls: Uint8Array;
	private wallW: number;
	private wallH: number;
	public wallCoords: Float32Array;

	constructor(world2d: HTMLCanvasElement, ctx2d: CanvasRenderingContext2D) {
		this.world2d = world2d;
		this.ctx2d = ctx2d;
		this.wallCols = 9;
		this.wallRows = 9;
		this.walls = new Uint8Array(
			[
				[1, 1, 1, 1, 1, 1, 1, 1, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 0, 0, 1],
				[1, 1, 1, 1, 1, 1, 1, 1, 1],
			].flat()
		);
		this.wallW = this.world2d.width / this.wallCols;
		this.wallH = this.world2d.height / this.wallRows;
		this.wallCoords = new Float32Array(this.walls.length * 8);
	}

	public setUp() {
		let wallCoordsIndex = 0;

		for (let i = 0; i < this.wallCols; i++) {
			for (let j = 0; j < this.wallRows; j++) {
				const x1 = i * this.wallW;
				const y1 = j * this.wallH;

				const x2 = x1 + this.wallW;
				const y2 = y1;

				const x3 = x1 + this.wallW;
				const y3 = y1 + this.wallH;

				const x4 = x1;
				const y4 = y1 + this.wallH;

				this.wallCoords[wallCoordsIndex] = x1;
				this.wallCoords[wallCoordsIndex + 1] = y1;

				this.wallCoords[wallCoordsIndex + 2] = x2;
				this.wallCoords[wallCoordsIndex + 3] = y2;

				this.wallCoords[wallCoordsIndex + 4] = x3;
				this.wallCoords[wallCoordsIndex + 5] = y3;

				this.wallCoords[wallCoordsIndex + 6] = x4;
				this.wallCoords[wallCoordsIndex + 7] = y4;

				wallCoordsIndex += 8;
			}
		}
	}

	public draw() {
		let count = 0;
		for (let i = 0; i < this.wallCols; i++) {
			for (let j = 0; j < this.wallRows; j++) {
				this.ctx2d.fillStyle = count % 2 === 0 ? 'rgb(0, 100, 0)' : 'rgb(100, 0, 0)';
				const wall = this.walls[i + j * this.wallRows];

				switch (wall) {
					case 0:
						break;
					case 1:
						this.ctx2d.beginPath();
						this.ctx2d.rect(j * this.wallW, i * this.wallH, this.wallW, this.wallH);
						this.ctx2d.fill();
						break;
				}
				count++;
			}
		}
	}
}
