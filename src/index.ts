import Player2d from './player2d';
import Walls2d from './walls2d';

const world2d = <HTMLCanvasElement>document.getElementById('world2d');
const world3d = <HTMLCanvasElement>document.getElementById('world3d');

const ctx2d = <CanvasRenderingContext2D>world2d.getContext('2d', { alpha: false });
const ctx3d = <CanvasRenderingContext2D>world3d.getContext('2d', { alpha: false });

const fpsElement = <HTMLHeadingElement>document.getElementById('fpsCounter');

let walls2d: Walls2d;
let player2d: Player2d;

let fpsInterval: number, now: number, then: number, elapsed: number, requestID: number;
let frameCount: number = 0;
const frameRate = 60;

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
		player2d.draw(world2d.width / 2, world2d.height / 2);
	}
};

const setUp = () => {
	walls2d = new Walls2d(world2d, ctx2d);
	walls2d.setUp();
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

document.addEventListener('keydown', e => {
	//Set move forewards and backwards
	// if (e.code === 'KeyW') {
	// 	player2d.setMoveDir('forwards');
	// } else if (e.code === 'KeyS') {
	// 	player2d.setMoveDir('backwards');
	// }

	if (e.code === 'KeyA') {
		player2d.setRotation('left');
	} else if (e.code === 'KeyD') {
		player2d.setRotation('right');
	}
});

document.addEventListener('keyup', e => {
	//Set movement variables to null when key released{
	if (e.code === 'KeyA' || e.code === 'KeyD') {
		player2d.setRotation(null);
	}

	// if (e.code === 'KeyW' || e.code === 'KeyS') {
	// 	player2d.setMoveDir(null);
	// 	localStorage.setItem('playerPos', JSON.stringify(player2d.getPlayerPos()));
	// }
});
