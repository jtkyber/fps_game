export default class Walls3d {
	private world3d: HTMLCanvasElement;
	private ctx3d: CanvasRenderingContext2D;
	private wallW: number;
	private wallH: number;
	private world3dDiag: number;
	private wallTexture: HTMLImageElement;

	constructor(world3d: HTMLCanvasElement, ctx3d: CanvasRenderingContext2D, wallW: number, wallH: number) {
		this.world3d = world3d;
		this.ctx3d = ctx3d;
		this.wallW = wallW;
		this.wallH = wallH;
		this.world3dDiag = Math.sqrt(Math.pow(world3d.width, 2) + Math.pow(world3d.height, 2));
		this.wallTexture = new Image();
		this.wallTexture.src = '../public/stoneTexture.png';
	}

	public draw(
		rays: Float32Array | null,
		objectTypes: Uint8Array | null,
		objectDirs: Uint8Array | null,
		pX: number,
		pY: number,
		rayAngles: Float32Array | null
	) {
		if (!rays || !rayAngles) return;

		const wallWidth = this.world3d.width / rays.length;
		const wallWidthOversized = wallWidth + 1;
		let wallX = 0;

		for (let i = 0; i < rays.length; i++) {
			const dist = rays[i] * Math.cos(rayAngles[i]);
			const offset = objectDirs?.[i] === 0 || objectDirs?.[i] === 2 ? pX / this.wallW : pY / this.wallH;

			const wallShiftAmt = (this.world3d.height * 50) / dist;
			let wallCenterHeight = this.world3d.height / 2.5;
			const wallStartTop = wallCenterHeight - wallShiftAmt;
			const wallEndBottom = wallCenterHeight + wallShiftAmt;

			let wallDarkness = dist / this.world3d.height;
			wallDarkness = (this.world3dDiag - dist) / this.world3dDiag;

			switch (objectDirs?.[i]) {
				case 0:
					wallDarkness -= 0.2;
					break;
				case 2:
					wallDarkness -= 0.2;
					break;
			}

			switch (objectTypes?.[i]) {
				case 1:
					this.ctx3d.fillStyle = `rgba(${255 * wallDarkness},${255 * wallDarkness},${255 * wallDarkness},1)`;
					break;
				case 2:
					this.ctx3d.fillStyle = `rgba(${0 * wallDarkness},${100 * wallDarkness},${100 * wallDarkness},1)`;
					break;
			}

			this.ctx3d.fillRect(wallX, wallStartTop, wallWidthOversized, wallEndBottom - wallStartTop);

			// // const sWidth =
			// // 	objectDirs?.[i] === 0 || objectDirs?.[i] === 2
			// // 		? this.wallTexture.width / offset
			// // 		: this.wallTexture.height / offset;

			// this.ctx3d.drawImage(
			// 	this.wallTexture,
			// 	offset,
			// 	0,
			// 	this.wallTexture.width,
			// 	this.wallTexture.height,
			// 	wallX,
			// 	wallStartTop,
			// 	wallWidth,
			// 	wallEndBottom - wallStartTop
			// );

			wallX += wallWidth;
		}
	}
}
