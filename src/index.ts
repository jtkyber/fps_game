import Player2d from './player2d';
import Walls2d from './walls2d';
import Walls3d from './walls3d';

const world2d = <HTMLCanvasElement>document.getElementById('world2d');
const world3d = <HTMLCanvasElement>document.getElementById('world3d');

const ctx2d = <CanvasRenderingContext2D>world2d.getContext('2d', { alpha: false });
const ctx3d = <CanvasRenderingContext2D>world3d.getContext('2d', { alpha: false });

const fpsElement = <HTMLHeadingElement>document.getElementById('fpsCounter');

let walls2d: Walls2d;
let walls3d: Walls3d;
let player2d: Player2d;

let fpsInterval: number, now: number, then: number, elapsed: number, requestID: number;
let frameCount: number = 0;
const frameRate = 75;

let devMode = true;

const setFramerateValue = () => {
	fpsElement.innerText = frameCount.toString();
	fpsElement.style.color = frameCount < frameRate ? 'red' : 'rgb(0, 255, 0)';
	frameCount = 0;
};

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

		walls2d.draw();
		player2d.draw();
		walls3d.draw(
			player2d.rays,
			player2d.objectTypes,
			player2d.objectDirs,
			player2d.playerX,
			player2d.playerY,
			player2d.rayAngles
		);
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
		walls2d.wallH
	);
	player2d.setUp();
	gameLoop();
};

window.onload = () => {
	then = Date.now();
	setUp();
};

document.addEventListener('mousemove', e => {
	if (!devMode) {
		player2d.setMouseRotation(e.movementX / 20);
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
			document.exitPointerLock =
				//@ts-ignore
				document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
			document.exitPointerLock();
		}
	}
});
