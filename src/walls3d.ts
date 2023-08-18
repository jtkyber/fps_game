import { IPlayerRays } from './types';

export default class Walls3d {
	private world3d: HTMLCanvasElement;
	private ctx3d: CanvasRenderingContext2D;
	private wallW: number;
	private wallH: number;
	private world3dDiag: number;
	private wallTexture: HTMLImageElement;
	private bgTopImg: HTMLImageElement;
	private bgTopX: number;
	private wallCenterHeight: number;

	constructor(world3d: HTMLCanvasElement, ctx3d: CanvasRenderingContext2D, wallW: number, wallH: number) {
		this.world3d = world3d;
		this.ctx3d = ctx3d;
		this.wallW = wallW;
		this.wallH = wallH;
		this.world3dDiag = Math.sqrt(Math.pow(world3d.width, 2) + Math.pow(world3d.height, 2));
		this.wallTexture = new Image();
		this.wallTexture.src = '../public/stoneTexture.png';
		this.bgTopImg = new Image();
		this.bgTopImg.src = '../public/stars.jpg';
		this.bgTopX = 0;
		this.wallCenterHeight = this.world3d.height / 2.5;
	}

	private drawBackground() {
		//multiply bg img width by 4 so when you rotate 90deg, you're 1/4th through the img
		this.bgTopImg.width = this.world3d.width * 2;
		this.bgTopImg.height = this.world3d.height;

		//reset bg img position if ends of img are in view
		if (this.bgTopX > 0) {
			this.bgTopX = -this.bgTopImg.width;
		} else if (this.bgTopX < -this.bgTopImg.width) {
			this.bgTopX = 0;
		}

		this.ctx3d.drawImage(
			this.bgTopImg,
			this.bgTopX,
			this.wallCenterHeight,
			this.bgTopImg.width,
			-this.bgTopImg.height
		);
		this.ctx3d.drawImage(
			this.bgTopImg,
			this.bgTopX + this.bgTopImg.width,
			this.wallCenterHeight,
			this.bgTopImg.width,
			-this.bgTopImg.height
		);
		this.ctx3d.fillStyle = `rgba(0,0,0,0.7)`;
		this.ctx3d.fillRect(0, 0, this.world3d.width, this.wallCenterHeight);

		this.ctx3d.fillStyle = `rgb(15, 35, 15)`;
		this.ctx3d.fillRect(
			0,
			this.wallCenterHeight,
			this.world3d.width,
			this.world3d.height - this.wallCenterHeight
		);
	}

	public setBgTopXMouseMove(moveDelta: number) {
		this.bgTopX -= ((this.bgTopImg.width / 180) * moveDelta) / 20;
	}

	public setbgTopX(rotAmt: number, moveDirLR: string | null) {
		const xDelta = (this.bgTopImg.width / 180) * rotAmt;
		if (moveDirLR === 'left') {
			this.bgTopX += xDelta;
		} else if (moveDirLR === 'right') {
			this.bgTopX -= xDelta;
		}
	}

	public draw(
		rays: Float32Array | null,
		objectTypes: Uint8Array | null,
		objectDirs: Uint8Array | null,
		pX: number,
		pY: number,
		rayAngles: Float32Array | null,
		playerRays: IPlayerRays[],
		playerW: number
	) {
		if (!rays || !rayAngles) return;
		this.drawBackground();

		const wallWidth = this.world3d.width / rays.length;
		const wallWidthOversized = wallWidth + 1;
		let wallX = 0;

		for (let i = 0; i < rays.length; i++) {
			const dist = rays[i] * Math.cos(rayAngles[i]);
			const offset = objectDirs?.[i] === 0 || objectDirs?.[i] === 2 ? pX / this.wallW : pY / this.wallH;

			const wallShiftAmt = (this.world3d.height * 50) / dist;
			const wallStartTop = this.wallCenterHeight - wallShiftAmt;
			const wallEndBottom = this.wallCenterHeight + wallShiftAmt;

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

		for (let i = 0; i < playerRays.length; i++) {
			const rayL = playerRays[i].l;
			const w = (this.world3d.width * playerW) / rayL;
			// let x = playerRays[i].percAcrossScreen * this.world3d.width;
			let x;

			if (playerRays[i].percAcrossScreen1 >= 0 && playerRays[i].percAcrossScreen1 <= 1) {
				x = playerRays[i].percAcrossScreen1 * this.world3d.width + w / 2;
			} else {
				x = playerRays[i].percAcrossScreen2 * this.world3d.width - w / 2;
			}

			let playerCenterHeight = this.world3d.height / 2.5;
			const wallShiftAmt = (this.world3d.height * 50) / rayL;
			const playerShiftAmt = (this.world3d.height * 40) / rayL;
			const adjToBotAmt = wallShiftAmt - playerShiftAmt;
			const playerStartTop = playerCenterHeight - playerShiftAmt + adjToBotAmt;
			const playerEndBottom = playerCenterHeight + playerShiftAmt + adjToBotAmt;

			let wallDarkness = rayL / this.world3d.height;
			wallDarkness = (this.world3dDiag - rayL) / this.world3dDiag;

			this.ctx3d.fillStyle = `rgba(${255 * wallDarkness},${100 * wallDarkness},${0 * wallDarkness},1)`;

			this.ctx3d.fillRect(x - w / 2, playerStartTop, w, playerEndBottom - playerStartTop);
		}
	}
}
