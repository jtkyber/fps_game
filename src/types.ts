export interface IWallData {
	walls: Uint8Array;
	cols: number;
	rows: number;
}

export interface ISocketDataRes {
	action: string;
	data: any;
}

export interface ISocketDataReq {
	action: string;
	id: string;
	data: any;
}

export interface IPlayer {
	name: string;
	x: number;
	y: number;
	x1?: number;
	y1?: number;
	x2?: number;
	y2?: number;
}

export interface IPlayerRays {
	l: number;
	x: number;
	y: number;
	name: string;
	percAcrossScreen: number;
}
