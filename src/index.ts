import Player2d from './player2d';
import Players from './players';
import { ISocketDataReq, ISocketDataRes } from './types';
import Walls2d from './walls2d';
import Walls3d from './walls3d';

// Use wss (secure) instead of ws for produciton
const socket = new WebSocket('ws://localhost:3000/server');

const world2d = <HTMLCanvasElement>document.getElementById('world2d');
const world3d = <HTMLCanvasElement>document.getElementById('world3d');

const ctx2d = <CanvasRenderingContext2D>world2d.getContext('2d', { alpha: false });
const ctx3d = <CanvasRenderingContext2D>world3d.getContext('2d', { alpha: false });

const fpsElement = <HTMLHeadingElement>document.getElementById('fpsCounter');

let walls2d: Walls2d;
let walls3d: Walls3d;
let player2d: Player2d;
let players: Players;

let fpsInterval: number, now: number, then: number, elapsed: number, requestID: number;
let frameCount: number = 0;
const frameRate = 20;

let devMode = true;

let userId: any;
let lastRecordedPlayerPos = {
	x: 0,
	y: 0,
};

const setFramerateValue = () => {
	fpsElement.innerText = frameCount.toString();
	fpsElement.style.color = frameCount < frameRate ? 'red' : 'rgb(0, 255, 0)';
	frameCount = 0;
};

// let arrTest: number[] = [];
// const arrTest2 = new Float32Array(5000);

// for (let i = 0; i < arrTest2.length; i++) {
// 	arrTest.push(i);
// 	arrTest2[i] = i;
// }

const gameLoop = () => {
	requestID = requestAnimationFrame(gameLoop);

	fpsInterval = 1000 / frameRate;

	now = Date.now();
	elapsed = now - then;

	if (elapsed > fpsInterval) {
		if (frameCount === 0) setTimeout(setFramerateValue, 1000);
		frameCount += 1;
		then = now - (elapsed % fpsInterval);

		ctx2d.clearRect(0, 0, world2d.width, world2d.height);
		ctx3d.clearRect(0, 0, world3d.width, world3d.height);

		// for (let i = 0; i < arrTest2.length; i++) {
		// 	// arrTest[i] = Math.random();
		// 	arrTest2[i] = Math.random();

		// 	ctx2d.clearRect(0, 0, world2d.width, world2d.height);
		// 	ctx2d.beginPath();
		// 	ctx2d.font = '48px arial';
		// 	ctx2d.fillStyle = 'green';
		// 	ctx2d.fillText(arrTest2[i].toString(), 100, 100);
		// }

		walls2d.draw();
		players.draw();
		player2d.draw(players.players);
		walls3d.setbgTopX(player2d.rotAmt, player2d.rotDir);
		walls3d.draw(
			player2d.rays,
			player2d.rayCoords,
			player2d.objectTypes,
			player2d.objectDirs,
			player2d.playerX,
			player2d.playerY,
			player2d.rayAngles,
			player2d.playerRays,
			player2d.playerW
		);

		one: if (player2d.playerX !== lastRecordedPlayerPos.x || player2d.playerY !== lastRecordedPlayerPos.y) {
			lastRecordedPlayerPos.x = player2d.playerX;
			lastRecordedPlayerPos.y = player2d.playerY;

			if (!userId) break one;

			const data: ISocketDataReq = {
				action: 'update-player-pos',
				id: userId,
				data: {
					x: lastRecordedPlayerPos.x,
					y: lastRecordedPlayerPos.y,
				},
			};
			socket.send(JSON.stringify(data));
		}

		ctx3d.fillStyle = `rgba(0,255,0,1)`;
		ctx3d.lineWidth = 2;
		ctx3d.beginPath();
		ctx3d.ellipse(world3d.width / 2, world3d.height / 2.5, 5, 5, 0, 0, 2 * Math.PI);
		ctx3d.fill();
	}
};

const setUp = () => {
	walls2d = new Walls2d(world2d, ctx2d);
	walls3d = new Walls3d(world3d, ctx3d, walls2d.wallW, walls2d.wallH);
	player2d = new Player2d(
		world2d,
		ctx2d,
		walls2d.walls,
		walls2d.wallCols,
		walls2d.wallRows,
		walls2d.wallW,
		walls2d.wallH,
		frameRate
	);
	player2d.setUp();
	players = new Players(world2d, ctx2d);
	gameLoop();
};

window.onload = () => {
	then = Date.now();
	setUp();
};

document.addEventListener('mousemove', e => {
	if (!devMode) {
		player2d.setMouseRotation(e.movementX / 20);
		walls3d.setBgTopXMouseMove(e.movementX);
	}
});

document.addEventListener('keydown', e => {
	//Set move forewards and backwards
	if (e.code === 'KeyW') {
		player2d.setMoveDir('forwards');
	} else if (e.code === 'KeyS') {
		player2d.setMoveDir('backwards');
	}

	if (e.code === 'KeyA') {
		if (devMode) player2d.setRotation('left');
		else player2d.setStrafeDir('left');
	} else if (e.code === 'KeyD') {
		if (devMode) player2d.setRotation('right');
		else player2d.setStrafeDir('right');
	}
});

document.addEventListener('keyup', e => {
	//Set movement variables to null when key released{
	if (e.code === 'KeyA' || e.code === 'KeyD') {
		if (devMode) player2d.setRotation(null);
		else player2d.setStrafeDir(null);
	} else if (e.code === 'KeyW' || e.code === 'KeyS') {
		player2d.setMoveDir(null);
	} else if (e.code === 'KeyM') {
		devMode = !devMode;
		if (!devMode) {
			world2d.classList.add('fullscreen');
			world3d.classList.add('fullscreen');
			player2d.devMode = false;
			walls2d.devMode = false;
			world3d.requestPointerLock =
				//@ts-ignore
				world3d.requestPointerLock || world3d.mozRequestPointerLock || world3d.webkitRequestPointerLock;
			//@ts-ignore
			world3d.requestPointerLock({
				unadjustedMovement: true,
			});
		} else {
			world2d.classList.remove('fullscreen');
			world3d.classList.remove('fullscreen');
			player2d.devMode = true;
			walls2d.devMode = true;
			document.exitPointerLock =
				//@ts-ignore
				document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
			document.exitPointerLock();
		}
	}
});

socket.addEventListener('open', () => {
	console.log('User connected');
});

socket.addEventListener('message', event => {
	const res: ISocketDataRes = JSON.parse(event.data);
	let data: ISocketDataReq;

	switch (res?.action) {
		case 'set-user-id':
			console.log('UserId has been set');
			userId = res.data;

			if (!userId) return;
			data = {
				action: 'send-user-to-clients',
				id: userId,
				data: '',
			};
			socket.send(JSON.stringify(data));
			break;
		case 'send-user-to-clients':
			players.addPlayer(res.data);

			// if (!userId) return;
			// data = {
			// 	action: 'send-user-to-clients',
			// 	id: userId,
			// 	data: '',
			// };
			// socket.send(JSON.stringify(data));
			break;
		case 'update-player-pos':
			players.updatePlayerPos({ name: res.data.playerId, x: res.data.x, y: res.data.y });
			break;
		case 'remove-player':
			players.removePlayer(res.data);
			break;
	}
});
