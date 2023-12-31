import { IPlayerRays } from './types';

export default class Walls3d {
	private world3d: HTMLCanvasElement;
	private ctx3d: CanvasRenderingContext2D;
	private wallW: number;
	private wallH: number;
	private world3dDiag: number;
	private bgTopX: number;
	private wallCenterHeight: number;
	private wMultiplier: number;
	private texturePaths: string[];
	private textures: any;

	constructor(world3d: HTMLCanvasElement, ctx3d: CanvasRenderingContext2D, wallW: number, wallH: number) {
		this.world3d = world3d;
		this.ctx3d = ctx3d;
		this.wallW = wallW;
		this.wallH = wallH;
		this.world3dDiag = Math.sqrt(Math.pow(world3d.width, 2) + Math.pow(world3d.height, 2));
		this.bgTopX = 0;
		this.wallCenterHeight = this.world3d.height / 2.5;
		this.wMultiplier = 0;
		this.texturePaths = ['../public/wallTexture.png', '../public/wallTextureDark.png', '../public/stars.jpg'];
		this.textures = {};
	}

	public async setUp() {
		const preloadImages = () => {
			const promises = this.texturePaths.map((path: string) => {
				return new Promise((resolve, reject) => {
					const name = path.split('/').pop()?.split('.')[0];
					const image = new Image();

					image.src = path;
					image.onload = () => {
						resolve([name, image]);
					};
					image.onerror = () => reject(`Image failed to load: ${path}`);
				});
			});
			return Promise.all(promises);
		};

		const imgArraytemp: any[] = await preloadImages();
		this.textures = Object.fromEntries(imgArraytemp);

		this.wMultiplier = Math.abs(this.textures.wallTexture.width / this.wallW);
	}

	private drawBackground() {
		//multiply bg img width by 4 so when you rotate 90deg, you're 1/4th through the img
		this.textures.stars.width = this.world3d.width * 2;
		this.textures.stars.height = this.world3d.height;

		//reset bg img position if ends of img are in view
		if (this.bgTopX > 0) {
			this.bgTopX = -this.textures.stars.width;
		} else if (this.bgTopX < -this.textures.stars.width) {
			this.bgTopX = 0;
		}

		this.ctx3d.drawImage(
			this.textures.stars,
			this.bgTopX,
			this.wallCenterHeight,
			this.textures.stars.width,
			-this.textures.stars.height
		);
		this.ctx3d.drawImage(
			this.textures.stars,
			this.bgTopX + this.textures.stars.width,
			this.wallCenterHeight,
			this.textures.stars.width,
			-this.textures.stars.height
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
		this.bgTopX -= ((this.textures.stars.width / 180) * moveDelta) / 20;
	}

	public setbgTopX(rotAmt: number, moveDirLR: string | null) {
		const xDelta = (this.textures.stars.width / 180) * rotAmt;
		if (moveDirLR === 'left') {
			this.bgTopX += xDelta;
		} else if (moveDirLR === 'right') {
			this.bgTopX -= xDelta;
		}
	}

	public draw(
		rays: Float32Array | null,
		rayCoords: Float32Array | null,
		objectTypes: Uint8Array | null,
		objectDirs: Uint8Array | null,
		extraRay: {
			ang: number;
			l: number;
			coords: number[];
			objType: number;
			objDir: number;
		},
		rayAngles: Float32Array | null,
		playerRays: IPlayerRays[],
		playerW: number,
		distToProjectionPlane: number
	) {
		if (!rays || !rayAngles || !rayCoords) return;
		this.drawBackground();

		const wallWidth = this.world3d.width / rays.length;
		const wallWidthOversized = wallWidth + 1;
		let wallX = 0;

		for (let i = 0; i < rays.length; i++) {
			const dist = rays[i] * Math.cos(rayAngles[i]);
			let offset =
				objectDirs?.[i] === 0 || objectDirs?.[i] === 2
					? rayCoords[i * 2] % this.wallW
					: rayCoords[i * 2 + 1] % this.wallH;

			let offset2: number;

			if (i === rays.length - 1) {
				offset2 =
					extraRay.objDir === 0 || extraRay.objDir === 2
						? extraRay.coords[0] % this.wallW
						: extraRay.coords[1] % this.wallH;
			} else {
				offset2 =
					objectDirs?.[i + 1] === 0 || objectDirs?.[i + 1] === 2
						? rayCoords[(i + 1) * 2] % this.wallW
						: rayCoords[(i + 1) * 2 + 1] % this.wallH;
			}

			if (objectDirs?.[i] === 0 || objectDirs?.[i] === 1) {
				offset = this.wallW - offset;
				offset2 = this.wallW - offset2;
			}
			offset *= this.wMultiplier;
			offset2 *= this.wMultiplier;

			const wallHeight = (this.wallH / dist) * distToProjectionPlane;
			// const wallHalfHeight = (this.world3d.height * 50) / dist;
			const wallHalfHeight = wallHeight / 2;
			const wallStartTop = this.wallCenterHeight - wallHalfHeight;
			const wallEndBottom = this.wallCenterHeight + wallHalfHeight;

			// let wallDarkness = dist / this.world3d.height;
			// wallDarkness = (this.world3dDiag - dist) / this.world3dDiag;

			// switch (objectDirs?.[i]) {
			// 	case 0:
			// 		wallDarkness -= 0.2;
			// 		break;
			// 	case 2:
			// 		wallDarkness -= 0.2;
			// 		break;
			// }

			// switch (objectTypes?.[i]) {
			// 	case 1:
			// 		this.ctx3d.fillStyle = `rgba(${255 * wallDarkness},${255 * wallDarkness},${255 * wallDarkness},1)`;
			// 		break;
			// 	case 2:
			// 		this.ctx3d.fillStyle = `rgba(${0 * wallDarkness},${100 * wallDarkness},${100 * wallDarkness},1)`;
			// 		break;
			// }

			// this.ctx3d.fillRect(wallX, wallStartTop, wallWidthOversized, wallEndBottom - wallStartTop);

			let curImg = null;
			let sWidth = 0;
			let chunk2Offset: number | null = null;

			sWidth = offset <= offset2 ? offset2 - offset : this.textures.wallTexture.width - offset + offset2;
			if (offset > offset2) {
				chunk2Offset = -(this.textures.wallTexture.width - offset);
			}

			if (objectDirs?.[i] === 0 || objectDirs?.[i] === 2) {
				curImg = this.textures.wallTexture;
			} else {
				curImg = this.textures.wallTextureDark;
			}

			this.ctx3d.drawImage(
				curImg,
				offset,
				0,
				sWidth,
				curImg.height,
				wallX,
				wallStartTop,
				wallWidthOversized,
				wallEndBottom - wallStartTop
			);

			if (chunk2Offset) {
				this.ctx3d.drawImage(
					curImg,
					chunk2Offset,
					0,
					sWidth,
					curImg.height,
					wallX,
					wallStartTop,
					wallWidthOversized,
					wallEndBottom - wallStartTop
				);
			}

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
