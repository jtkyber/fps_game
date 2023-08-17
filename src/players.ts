import { IPlayer } from './types';

export default class Players {
	private world2d: HTMLCanvasElement;
	private ctx2d: CanvasRenderingContext2D;
	public players: IPlayer[];
	private pWidth: number;
	private userX: number;
	private userY: number;

	constructor(world2d: HTMLCanvasElement, ctx2d: CanvasRenderingContext2D) {
		this.world2d = world2d;
		this.ctx2d = ctx2d;
		this.players = [];
		this.pWidth = 20;
		this.userX = 0;
		this.userY = 0;
	}

	public setUserCoords(x: number, y: number) {
		this.userX = x;
		this.userY = y;
	}

	public addPlayer(name: string) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === name) return;
		}

		this.players.push({
			name: name,
			x: this.world2d.width / 2,
			y: this.world2d.height / 2,
		});
		console.log(`${name} has joined the match`);
	}

	public removePlayer(name: string) {
		console.log(`Player ${name} has left the match`);
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === name) {
				this.players.splice(i, 1);
			}
		}
	}

	public updatePlayerPos(p: IPlayer) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i].name === p.name) {
				this.players[i].x = p.x;
				this.players[i].y = p.y;
				return;
			}
		}

		this.players.push({
			name: p.name,
			x: p.x,
			y: p.y,
		});
	}

	// private makePlayersPerp() {
	// 	const deltaD = this.pWidth / 2;
	// 	for (let i = 0; i < this.players.length; i++) {
	// 		const { x, y } = this.players[i];
	// 		const slope = (y - this.userY) / (x - this.userX);
	// 		const perpSlope = -(1 / slope);
	// 		const angle = Math.atan(perpSlope);
	// 		this.players[i].x1 = x + deltaD * Math.cos(angle);
	// 		this.players[i].y1 = y + deltaD * Math.sin(angle);
	// 		this.players[i].x2 = x - deltaD * Math.cos(angle);
	// 		this.players[i].y2 = y - deltaD * Math.sin(angle);
	// 	}
	// }

	public draw() {
		for (let i = 0; i < this.players.length; i++) {
			const p = this.players[i];

			this.ctx2d.fillStyle = 'red';
			this.ctx2d.beginPath();
			this.ctx2d.ellipse(p.x, p.y, 6, 6, 2 * Math.PI, 0, 2 * Math.PI);
			this.ctx2d.fill();
		}

		// for (let i = 0; i < this.players.length; i++) {
		// 	const p = this.players[i];
		// 	if (!p.x1 || !p.y1 || !p.x2 || !p.y2) continue;

		// 	this.ctx2d.beginPath();
		// 	this.ctx2d.moveTo(p.x1, p.y1);
		// 	this.ctx2d.lineTo(p.x2, p.y2);
		// 	this.ctx2d.lineWidth = 6;
		// 	this.ctx2d.strokeStyle = 'rgba(245,230,66,1)';
		// 	this.ctx2d.stroke();
		// }
	}
}
