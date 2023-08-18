import { IPlayer } from './types';

export default class Players {
	private world2d: HTMLCanvasElement;
	private ctx2d: CanvasRenderingContext2D;
	public players: IPlayer[];

	constructor(world2d: HTMLCanvasElement, ctx2d: CanvasRenderingContext2D) {
		this.world2d = world2d;
		this.ctx2d = ctx2d;
		this.players = [];
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

	public draw() {
		for (let i = 0; i < this.players.length; i++) {
			const p = this.players[i];

			this.ctx2d.fillStyle = 'red';
			this.ctx2d.beginPath();
			this.ctx2d.ellipse(p.x, p.y, 6, 6, 2 * Math.PI, 0, 2 * Math.PI);
			this.ctx2d.fill();
		}
	}
}
