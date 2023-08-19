/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _player2d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player2d */ "./src/player2d.ts");
/* harmony import */ var _players__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./players */ "./src/players.ts");
/* harmony import */ var _walls2d__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./walls2d */ "./src/walls2d.ts");
/* harmony import */ var _walls3d__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./walls3d */ "./src/walls3d.ts");




// Use wss (secure) instead of ws for produciton
var socket = new WebSocket('ws://localhost:3000/server');
var world2d = document.getElementById('world2d');
var world3d = document.getElementById('world3d');
var ctx2d = world2d.getContext('2d', { alpha: false });
var ctx3d = world3d.getContext('2d', { alpha: false });
var fpsElement = document.getElementById('fpsCounter');
var walls2d;
var walls3d;
var player2d;
var players;
var fpsInterval, now, then, elapsed, requestID;
var frameCount = 0;
var frameRate = 20;
var devMode = true;
var userId;
var lastRecordedPlayerPos = {
    x: 0,
    y: 0,
};
var setFramerateValue = function () {
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
var gameLoop = function () {
    requestID = requestAnimationFrame(gameLoop);
    fpsInterval = 1000 / frameRate;
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        if (frameCount === 0)
            setTimeout(setFramerateValue, 1000);
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
        walls3d.draw(player2d.rays, player2d.rayCoords, player2d.objectTypes, player2d.objectDirs, player2d.playerX, player2d.playerY, player2d.rayAngles, player2d.playerRays, player2d.playerW);
        one: if (player2d.playerX !== lastRecordedPlayerPos.x || player2d.playerY !== lastRecordedPlayerPos.y) {
            lastRecordedPlayerPos.x = player2d.playerX;
            lastRecordedPlayerPos.y = player2d.playerY;
            if (!userId)
                break one;
            var data = {
                action: 'update-player-pos',
                id: userId,
                data: {
                    x: lastRecordedPlayerPos.x,
                    y: lastRecordedPlayerPos.y,
                },
            };
            socket.send(JSON.stringify(data));
        }
        ctx3d.fillStyle = "rgba(0,255,0,1)";
        ctx3d.lineWidth = 2;
        ctx3d.beginPath();
        ctx3d.ellipse(world3d.width / 2, world3d.height / 2.5, 5, 5, 0, 0, 2 * Math.PI);
        ctx3d.fill();
    }
};
var setUp = function () {
    walls2d = new _walls2d__WEBPACK_IMPORTED_MODULE_2__["default"](world2d, ctx2d);
    walls3d = new _walls3d__WEBPACK_IMPORTED_MODULE_3__["default"](world3d, ctx3d, walls2d.wallW, walls2d.wallH);
    player2d = new _player2d__WEBPACK_IMPORTED_MODULE_0__["default"](world2d, ctx2d, walls2d.walls, walls2d.wallCols, walls2d.wallRows, walls2d.wallW, walls2d.wallH, frameRate);
    player2d.setUp();
    players = new _players__WEBPACK_IMPORTED_MODULE_1__["default"](world2d, ctx2d);
    gameLoop();
};
window.onload = function () {
    then = Date.now();
    setUp();
};
document.addEventListener('mousemove', function (e) {
    if (!devMode) {
        player2d.setMouseRotation(e.movementX / 20);
        walls3d.setBgTopXMouseMove(e.movementX);
    }
});
document.addEventListener('keydown', function (e) {
    //Set move forewards and backwards
    if (e.code === 'KeyW') {
        player2d.setMoveDir('forwards');
    }
    else if (e.code === 'KeyS') {
        player2d.setMoveDir('backwards');
    }
    if (e.code === 'KeyA') {
        if (devMode)
            player2d.setRotation('left');
        else
            player2d.setStrafeDir('left');
    }
    else if (e.code === 'KeyD') {
        if (devMode)
            player2d.setRotation('right');
        else
            player2d.setStrafeDir('right');
    }
});
document.addEventListener('keyup', function (e) {
    //Set movement variables to null when key released{
    if (e.code === 'KeyA' || e.code === 'KeyD') {
        if (devMode)
            player2d.setRotation(null);
        else
            player2d.setStrafeDir(null);
    }
    else if (e.code === 'KeyW' || e.code === 'KeyS') {
        player2d.setMoveDir(null);
    }
    else if (e.code === 'KeyM') {
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
        }
        else {
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
socket.addEventListener('open', function () {
    console.log('User connected');
});
socket.addEventListener('message', function (event) {
    var res = JSON.parse(event.data);
    var data;
    switch (res === null || res === void 0 ? void 0 : res.action) {
        case 'set-user-id':
            console.log('UserId has been set');
            userId = res.data;
            if (!userId)
                return;
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


/***/ }),

/***/ "./src/player2d.ts":
/*!*************************!*\
  !*** ./src/player2d.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Player2d = /** @class */ (function () {
    function Player2d(world2d, ctx2d, walls, wallCols, wallRows, wallW, wallH, frameRate) {
        this.getIntersection = function (x, y, r, theta, x1, y1, x2, y2, rot, p4) {
            var adjustedAngle = theta + rot * (Math.PI / 180);
            var x3 = x;
            var y3 = y;
            var x4;
            var y4;
            var uMax = Infinity;
            if ((p4 === null || p4 === void 0 ? void 0 : p4.x) && (p4 === null || p4 === void 0 ? void 0 : p4.y)) {
                x4 = p4.x;
                y4 = p4.y;
                uMax = 1;
            }
            else {
                x4 = x + r * Math.cos(adjustedAngle);
                y4 = y + r * Math.sin(adjustedAngle);
            }
            var denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (denom == 0) {
                return;
            }
            var t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
            var u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;
            if (t >= 0 && t <= 1 && u >= 0 && u <= uMax) {
                var px = x3 + u * (x4 - x3);
                var py = y3 + u * (y4 - y3);
                return [px, py];
            }
            else {
                return;
            }
        };
        this.world2d = world2d;
        this.ctx2d = ctx2d;
        this.walls = walls;
        this.wallCols = wallCols;
        this.wallRows = wallRows;
        this.wallW = wallW;
        this.wallH = wallH;
        this.frameRate = frameRate;
        this.speedMultiplier = frameRate / 60;
        this.rays = null;
        this.rayCoords = null;
        this.objectTypes = null;
        this.objectDirs = null;
        this.rayIncrement = 2;
        this.rayOpacity = 0.26;
        this.fov = 60;
        this.fovRad = this.fov * (Math.PI / 180);
        this.rotation = 230;
        this.angle = this.rotation + 90;
        this.distToProjectionPlane = world2d.width / 2 / Math.tan(this.fovRad / 2);
        this.rayAngles = null;
        this.rayDensityAdjustment = 150;
        this.rotDir = null;
        this.rotAmt = 2 / this.speedMultiplier;
        this.moveDirFB = null;
        this.moveAmtStart = 3 / this.speedMultiplier;
        this.moveAmt = 3 / this.speedMultiplier;
        this.moveAmtTop = 3 / this.speedMultiplier;
        this.moveDirStrafe = null;
        this.moveDirRays = {
            foreward: Infinity,
            left: Infinity,
            right: Infinity,
            backward: Infinity,
        };
        this.playerX = 840;
        this.playerY = 150;
        this.devMode = true;
        this.playerRays = [];
        this.playerW = 20;
    }
    Player2d.prototype.setUp = function () {
        this.setAngles();
    };
    Player2d.prototype.setRotation = function (dir) {
        // if (this.rotDir === null) {
        // 	this.rotAmt = 2;
        // }
        this.rotDir = dir;
    };
    Player2d.prototype.setMouseRotation = function (amt) {
        this.rotation += amt;
        this.angle += amt;
    };
    Player2d.prototype.setStrafeDir = function (dir) {
        if (this.moveDirStrafe === null) {
            this.moveAmt = this.moveAmtStart;
        }
        this.moveDirStrafe = dir;
    };
    Player2d.prototype.rotate = function () {
        // if (this.rotAmt < this.rotAmt) {
        // 	this.rotAmt += 0.1;
        // }
        if (this.rotDir === 'left') {
            this.rotation -= this.rotAmt;
            this.angle -= this.rotAmt;
        }
        else if (this.rotDir === 'right') {
            this.rotation += this.rotAmt;
            this.angle += this.rotAmt;
        }
    };
    Player2d.prototype.setMoveDir = function (dir) {
        if (this.moveDirFB === null) {
            this.moveAmt = this.moveAmtStart;
        }
        this.moveDirFB = dir;
    };
    Player2d.prototype.move = function () {
        var _a;
        if (!((_a = this === null || this === void 0 ? void 0 : this.rays) === null || _a === void 0 ? void 0 : _a.length))
            return;
        this.rotate();
        if (this.moveAmt < this.moveAmtTop)
            this.moveAmt += 0.05;
        var dirRadians = this.angle * (Math.PI / 180);
        var moveX = this.moveAmt * Math.cos(90 * (Math.PI / 180) - dirRadians);
        var moveY = this.moveAmt * Math.cos(dirRadians);
        var dirRadiansStrafe = dirRadians + Math.PI / 2;
        var strafeX = (this.moveAmt * Math.cos(90 * (Math.PI / 180) - dirRadiansStrafe)) / 2;
        var strafeY = (this.moveAmt * Math.cos(dirRadiansStrafe)) / 2;
        var hittingF = this.moveDirRays.foreward < 14;
        var hittingL = this.moveDirRays.left < 14;
        var hittingR = this.moveDirRays.right < 14;
        var hittingB = this.moveDirRays.backward < 14;
        if (this.moveDirFB === 'forwards') {
            if (!hittingF) {
                this.playerX += moveX;
                this.playerY -= moveY;
            }
        }
        else if (this.moveDirFB === 'backwards') {
            if (!hittingB) {
                this.playerX -= moveX;
                this.playerY += moveY;
            }
        }
        if (this.moveDirStrafe === 'left') {
            if (!hittingL) {
                this.playerX -= strafeX;
            }
            if (!hittingL) {
                this.playerY += strafeY;
            }
        }
        else if (this.moveDirStrafe === 'right') {
            if (!hittingR) {
                this.playerX += strafeX;
            }
            if (!hittingR) {
                this.playerY -= strafeY;
            }
        }
    };
    Player2d.prototype.setAngles = function () {
        var angleArrLength = Math.ceil((this.world2d.width + this.rayDensityAdjustment) / this.rayDensityAdjustment);
        this.rayAngles = new Float32Array(angleArrLength);
        this.distToProjectionPlane = this.world2d.width / 2 / Math.tan(this.fovRad / 2);
        var x = 0;
        for (var i = 0; i < angleArrLength; i++) {
            this.rayAngles[i] = Math.atan((x - this.world2d.width / 2) / this.distToProjectionPlane);
            x += this.rayDensityAdjustment;
        }
        this.rays = new Float32Array(this.rayAngles.length);
        this.rayCoords = new Float32Array(this.rayAngles.length * 2);
        this.objectTypes = new Uint8Array(this.rayAngles.length);
        this.objectDirs = new Uint8Array(this.rayAngles.length);
    };
    Player2d.prototype.getIntersectionsForRect = function (j, k, x, y, rayAngle, rotation, p4) {
        var r = 1;
        var x1 = k * this.wallW;
        var y1 = j * this.wallH;
        var x2 = x1 + this.wallW;
        var y2 = y1;
        var x3 = x1 + this.wallW;
        var y3 = y1 + this.wallH;
        var x4 = x1;
        var y4 = y1 + this.wallH;
        var record = Infinity;
        var closest = null;
        var dir = 0;
        for (var n = 0; n < 4; n++) {
            switch (n) {
                case 0:
                    var intersectionTop = this.getIntersection(x, y, r, rayAngle, x1, y1, x2, y2, rotation, p4);
                    if (intersectionTop) {
                        var dx = Math.abs(x - intersectionTop[0]);
                        var dy = Math.abs(y - intersectionTop[1]);
                        var d = Math.sqrt(dx * dx + dy * dy);
                        record = Math.min(d, record);
                        if (d <= record) {
                            record = d;
                            closest = intersectionTop;
                            dir = 0;
                        }
                    }
                    break;
                case 1:
                    var intersectionRight = this.getIntersection(x, y, r, rayAngle, x2, y2, x3, y3, rotation, p4);
                    if (intersectionRight) {
                        var dx = Math.abs(x - intersectionRight[0]);
                        var dy = Math.abs(y - intersectionRight[1]);
                        var d = Math.sqrt(dx * dx + dy * dy);
                        record = Math.min(d, record);
                        if (d <= record) {
                            record = d;
                            closest = intersectionRight;
                            dir = 1;
                        }
                    }
                    break;
                case 2:
                    var intersectionBot = this.getIntersection(x, y, r, rayAngle, x3, y3, x4, y4, rotation, p4);
                    if (intersectionBot) {
                        var dx = Math.abs(x - intersectionBot[0]);
                        var dy = Math.abs(y - intersectionBot[1]);
                        var d = Math.sqrt(dx * dx + dy * dy);
                        record = Math.min(d, record);
                        if (d <= record) {
                            record = d;
                            closest = intersectionBot;
                            dir = 2;
                        }
                    }
                    break;
                case 3:
                    var intersectionLeft = this.getIntersection(x, y, r, rayAngle, x4, y4, x1, y1, rotation, p4);
                    if (intersectionLeft) {
                        var dx = Math.abs(x - intersectionLeft[0]);
                        var dy = Math.abs(y - intersectionLeft[1]);
                        var d = Math.sqrt(dx * dx + dy * dy);
                        record = Math.min(d, record);
                        if (d <= record) {
                            record = d;
                            closest = intersectionLeft;
                            dir = 3;
                        }
                    }
                    break;
            }
        }
        return {
            record: record,
            closest: closest,
            dir: dir,
        };
    };
    Player2d.prototype.getRayAngle = function (x1, y1, x2, y2) {
        var rayAng = x2 - x1 < 0
            ? 270 - (Math.atan((y2 - y1) / -(x2 - x1)) * 180) / Math.PI
            : 90 + (Math.atan((y2 - y1) / (x2 - x1)) * 180) / Math.PI;
        rayAng = (((rayAng - 90) % 360) + 360) % 360;
        return rayAng;
    };
    Player2d.prototype.getPercAcrScreen = function (x, y, px, py, rotation, isSprite) {
        var rayAng = this.getRayAngle(x, y, px, py);
        var rayRotDiff = rayAng - rotation;
        if (Math.abs(rayRotDiff) > this.fov / 2) {
            rayRotDiff = rayRotDiff >= 0 ? rayRotDiff - 360 : 360 + rayRotDiff;
        }
        var percAcrScreen = rayRotDiff / this.fov + 0.5;
        return percAcrScreen;
    };
    Player2d.prototype.draw = function (players) {
        var _a;
        var x = this.playerX;
        var y = this.playerY;
        this.playerRays = [];
        this.move();
        if (!this.rayAngles || !this.rays)
            return;
        var rotation = ((this.rotation % 360) + 360) % 360;
        var objTypeTemp = 0;
        var objDirTemp = 0;
        for (var i = 0; i < this.rayAngles.length; i++) {
            var closest = null;
            var record = Infinity;
            for (var j = 0; j < this.wallRows; j++) {
                for (var k = 0; k < this.wallCols; k++) {
                    var wall = this.walls[j * this.wallCols + k];
                    if (wall === 0)
                        continue;
                    var rectIntersection = this.getIntersectionsForRect(j, k, x, y, this.rayAngles[i], rotation);
                    if (rectIntersection.record < record) {
                        record = rectIntersection.record;
                        closest = rectIntersection.closest;
                        objTypeTemp = wall;
                        objDirTemp = rectIntersection.dir;
                    }
                }
            }
            if (closest) {
                if (this.devMode) {
                    this.ctx2d.beginPath();
                    this.ctx2d.moveTo(x, y);
                    this.ctx2d.lineTo(closest[0], closest[1]);
                    this.ctx2d.strokeStyle = "rgba(255,255,255,".concat(this.rayOpacity, ")");
                    this.ctx2d.lineWidth = 1;
                    this.ctx2d.stroke();
                }
                this.rays[i] = record;
                if (this.rayCoords) {
                    this.rayCoords[i * 2] = closest[0];
                    this.rayCoords[i * 2 + 1] = closest[1];
                }
                if (this.objectTypes)
                    this.objectTypes[i] = objTypeTemp;
                if (this.objectDirs)
                    this.objectDirs[i] = objDirTemp;
            }
            else {
                this.rays[i] = Infinity;
            }
        }
        loop1: for (var i = 0; i < players.length; i++) {
            var p = players[i];
            for (var j = 0; j < this.wallRows; j++) {
                for (var k = 0; k < this.wallCols; k++) {
                    var wall = this.walls[j * this.wallCols + k];
                    if (wall === 0)
                        continue;
                    var rectIntersection = this.getIntersectionsForRect(j, k, x, y, 0, rotation, { x: p.x, y: p.y });
                    if ((_a = rectIntersection === null || rectIntersection === void 0 ? void 0 : rectIntersection.closest) === null || _a === void 0 ? void 0 : _a[0])
                        continue loop1;
                }
            }
            var dx = Math.abs(x - p.x);
            var dy = Math.abs(y - p.y);
            var d = Math.sqrt(dx * dx + dy * dy);
            var deltaD = this.playerW / 2;
            var slope = (p.y - this.playerY) / (p.x - this.playerX);
            var perpSlope = -(1 / slope);
            var angle = Math.atan(perpSlope);
            var x1 = p.x + deltaD * Math.cos(angle);
            var y1 = p.y + deltaD * Math.sin(angle);
            var x2 = p.x - deltaD * Math.cos(angle);
            var y2 = p.y - deltaD * Math.sin(angle);
            var percAcrScreen = this.getPercAcrScreen(x, y, p.x, p.y, rotation, false);
            var angleDeg = this.getRayAngle(x, y, p.x, p.y);
            var percAcrScreenL = -1;
            var percAcrScreenR = -1;
            if (angleDeg >= 0 && angleDeg <= 180) {
                percAcrScreenL = this.getPercAcrScreen(x, y, x1, y1, rotation, true);
                percAcrScreenR = this.getPercAcrScreen(x, y, x2, y2, rotation, true);
            }
            else {
                percAcrScreenL = this.getPercAcrScreen(x, y, x2, y2, rotation, true);
                percAcrScreenR = this.getPercAcrScreen(x, y, x1, y1, rotation, true);
            }
            if ((percAcrScreenL >= 0 && percAcrScreenL <= 1) || (percAcrScreenR >= 0 && percAcrScreenR <= 1)) {
                if (percAcrScreenL >= 0 && percAcrScreenL <= 1 && percAcrScreenR >= 0 && percAcrScreenR <= 1) {
                    var percAcrScreenLtemp = percAcrScreenL;
                    percAcrScreenL = Math.min(percAcrScreenL, percAcrScreenR);
                    percAcrScreenR = Math.max(percAcrScreenLtemp, percAcrScreenR);
                }
                this.playerRays.push({
                    l: d,
                    x: p.x,
                    y: p.y,
                    name: p.name,
                    percAcrossScreen: percAcrScreen,
                    percAcrossScreen1: percAcrScreenL,
                    percAcrossScreen2: percAcrScreenR,
                });
                if (this.devMode) {
                    this.ctx2d.beginPath();
                    this.ctx2d.moveTo(x, y);
                    this.ctx2d.lineTo(p.x, p.y);
                    this.ctx2d.strokeStyle = "rgba(255,0,0,1)";
                    this.ctx2d.lineWidth = 1;
                    this.ctx2d.stroke();
                }
            }
            // if (percAcrScreen >= 0 && percAcrScreen <= 1) {
            // 	this.playerRays.push({
            // 		l: d,
            // 		x: p.x,
            // 		y: p.y,
            // 		name: p.name,
            // 		percAcrossScreen: percAcrScreen,
            // 	});
            // }
        }
        var rotationF = ((this.rotation % 360) + 360) % 360;
        var rotationR = (((this.rotation + 90) % 360) + 360) % 360;
        var rotationB = (((this.rotation + 180) % 360) + 360) % 360;
        var rotationL = (((this.rotation - 90) % 360) + 360) % 360;
        var closestF = null;
        var recordF = Infinity;
        var closestL = null;
        var recordL = Infinity;
        var closestR = null;
        var recordR = Infinity;
        var closestB = null;
        var recordB = Infinity;
        for (var i = 0; i < this.wallRows; i++) {
            for (var j = 0; j < this.wallCols; j++) {
                var wall = this.walls[i * this.wallCols + j];
                if (wall === 0)
                    continue;
                var fIntersection = this.getIntersectionsForRect(i, j, x, y, 0, rotationF);
                if (fIntersection.record < recordF) {
                    recordF = fIntersection.record;
                    closestF = fIntersection.closest;
                }
                var lIntersection = this.getIntersectionsForRect(i, j, x, y, 0, rotationL);
                if (lIntersection.record < recordL) {
                    recordL = lIntersection.record;
                    closestL = lIntersection.closest;
                }
                var rIntersection = this.getIntersectionsForRect(i, j, x, y, 0, rotationR);
                if (rIntersection.record < recordR) {
                    recordR = rIntersection.record;
                    closestR = rIntersection.closest;
                }
                var bIntersection = this.getIntersectionsForRect(i, j, x, y, 0, rotationB);
                if (bIntersection.record < recordB) {
                    recordB = bIntersection.record;
                    closestB = bIntersection.closest;
                }
            }
        }
        if (closestF)
            this.moveDirRays.foreward = recordF;
        else
            this.moveDirRays.foreward = Infinity;
        if (closestL)
            this.moveDirRays.left = recordL;
        else
            this.moveDirRays.left = Infinity;
        if (closestR)
            this.moveDirRays.right = recordR;
        else
            this.moveDirRays.right = Infinity;
        if (closestB)
            this.moveDirRays.backward = recordB;
        else
            this.moveDirRays.backward = Infinity;
        this.ctx2d.fillStyle = "rgba(0,255,0,1)";
        this.ctx2d.beginPath();
        this.ctx2d.ellipse(this.playerX, this.playerY, 6, 6, 0, 0, 2 * Math.PI);
        this.ctx2d.fill();
    };
    return Player2d;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player2d);


/***/ }),

/***/ "./src/players.ts":
/*!************************!*\
  !*** ./src/players.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Players = /** @class */ (function () {
    function Players(world2d, ctx2d) {
        this.world2d = world2d;
        this.ctx2d = ctx2d;
        this.players = [];
    }
    Players.prototype.addPlayer = function (name) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].name === name)
                return;
        }
        this.players.push({
            name: name,
            x: this.world2d.width / 2,
            y: this.world2d.height / 2,
        });
        console.log("".concat(name, " has joined the match"));
    };
    Players.prototype.removePlayer = function (name) {
        console.log("Player ".concat(name, " has left the match"));
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].name === name) {
                this.players.splice(i, 1);
            }
        }
    };
    Players.prototype.updatePlayerPos = function (p) {
        for (var i = 0; i < this.players.length; i++) {
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
    };
    Players.prototype.draw = function () {
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
            this.ctx2d.fillStyle = 'red';
            this.ctx2d.beginPath();
            this.ctx2d.ellipse(p.x, p.y, 6, 6, 2 * Math.PI, 0, 2 * Math.PI);
            this.ctx2d.fill();
        }
    };
    return Players;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Players);


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/walls2d.ts":
/*!************************!*\
  !*** ./src/walls2d.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Walls2d = /** @class */ (function () {
    function Walls2d(world2d, ctx2d) {
        this.world2d = world2d;
        this.ctx2d = ctx2d;
        this.wallCols = 32;
        this.wallRows = 18;
        this.walls = new Uint8Array([
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1],
            [1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ].flat());
        this.wallW = this.world2d.width / this.wallCols;
        this.wallH = this.world2d.height / this.wallRows;
        this.devMode = true;
    }
    Walls2d.prototype.draw = function () {
        if (this.devMode) {
            var count = 0;
            for (var i = 0; i < this.wallRows; i++) {
                for (var j = 0; j < this.wallCols; j++) {
                    this.ctx2d.fillStyle = 'rgb(100, 100, 100)';
                    var wall = this.walls[i * this.wallCols + j];
                    switch (wall) {
                        case 0:
                            break;
                        case 1:
                            this.ctx2d.beginPath();
                            this.ctx2d.rect(j * this.wallW, i * this.wallH, this.wallW, this.wallH);
                            this.ctx2d.fill();
                            break;
                        case 2:
                            this.ctx2d.beginPath();
                            this.ctx2d.rect(j * this.wallW, i * this.wallH, this.wallW, this.wallH);
                            this.ctx2d.fill();
                            break;
                    }
                    count++;
                }
            }
        }
    };
    return Walls2d;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Walls2d);


/***/ }),

/***/ "./src/walls3d.ts":
/*!************************!*\
  !*** ./src/walls3d.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Walls3d = /** @class */ (function () {
    function Walls3d(world3d, ctx3d, wallW, wallH) {
        this.world3d = world3d;
        this.ctx3d = ctx3d;
        this.wallW = wallW;
        this.wallH = wallH;
        this.world3dDiag = Math.sqrt(Math.pow(world3d.width, 2) + Math.pow(world3d.height, 2));
        this.wallTexture = new Image();
        this.wallTexture.src = '../public/blueTexture.png';
        this.wallTextureDark = new Image();
        this.wallTextureDark.src = '../public/blueTexture.png';
        this.bgTopImg = new Image();
        this.bgTopImg.src = '../public/stars.jpg';
        this.bgTopX = 0;
        this.wallCenterHeight = this.world3d.height / 2.5;
    }
    Walls3d.prototype.drawBackground = function () {
        //multiply bg img width by 4 so when you rotate 90deg, you're 1/4th through the img
        this.bgTopImg.width = this.world3d.width * 2;
        this.bgTopImg.height = this.world3d.height;
        //reset bg img position if ends of img are in view
        if (this.bgTopX > 0) {
            this.bgTopX = -this.bgTopImg.width;
        }
        else if (this.bgTopX < -this.bgTopImg.width) {
            this.bgTopX = 0;
        }
        this.ctx3d.drawImage(this.bgTopImg, this.bgTopX, this.wallCenterHeight, this.bgTopImg.width, -this.bgTopImg.height);
        this.ctx3d.drawImage(this.bgTopImg, this.bgTopX + this.bgTopImg.width, this.wallCenterHeight, this.bgTopImg.width, -this.bgTopImg.height);
        this.ctx3d.fillStyle = "rgba(0,0,0,0.7)";
        this.ctx3d.fillRect(0, 0, this.world3d.width, this.wallCenterHeight);
        this.ctx3d.fillStyle = "rgb(15, 35, 15)";
        this.ctx3d.fillRect(0, this.wallCenterHeight, this.world3d.width, this.world3d.height - this.wallCenterHeight);
    };
    Walls3d.prototype.setBgTopXMouseMove = function (moveDelta) {
        this.bgTopX -= ((this.bgTopImg.width / 180) * moveDelta) / 20;
    };
    Walls3d.prototype.setbgTopX = function (rotAmt, moveDirLR) {
        var xDelta = (this.bgTopImg.width / 180) * rotAmt;
        if (moveDirLR === 'left') {
            this.bgTopX += xDelta;
        }
        else if (moveDirLR === 'right') {
            this.bgTopX -= xDelta;
        }
    };
    Walls3d.prototype.draw = function (rays, rayCoords, objectTypes, objectDirs, pX, pY, rayAngles, playerRays, playerW) {
        if (!rays || !rayAngles || !rayCoords)
            return;
        this.drawBackground();
        var wallWidth = this.world3d.width / rays.length;
        var wallWidthOversized = wallWidth + 1;
        var wallX = 0;
        for (var i = 0; i < rays.length; i++) {
            var dist = rays[i] * Math.cos(rayAngles[i]);
            var offset = (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 2
                ? rayCoords[i * 2] % this.wallW
                : rayCoords[i * 2 + 1] % this.wallH;
            var offset2 = i < rays.length - 1
                ? (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i + 1]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i + 1]) === 2
                    ? rayCoords[(i + 1) * 2] % this.wallW
                    : rayCoords[(i + 1) * 2 + 1] % this.wallH
                : null;
            var wallShiftAmt = (this.world3d.height * 50) / dist;
            var wallStartTop = this.wallCenterHeight - wallShiftAmt;
            var wallEndBottom = this.wallCenterHeight + wallShiftAmt;
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
            var sWidth = 0;
            // Try to create sWidth without offset2
            label1: if ((objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 2 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 3) {
                if (offset2 === null) {
                    sWidth = 8;
                    break label1;
                }
                sWidth = offset <= offset2 ? offset2 - offset : this.wallW - offset + offset2;
                // console.log(offset);
            }
            else {
                if (offset2 === null) {
                    sWidth = 8;
                    offset = this.wallW - offset;
                    break label1;
                }
                sWidth = offset2 <= offset ? offset - offset2 : this.wallW - offset2 + offset;
                offset = this.wallW - offset;
            }
            if ((objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 2) {
                this.ctx3d.drawImage(this.wallTexture, offset, 0, sWidth, this.wallTexture.height, wallX, wallStartTop, wallWidthOversized, wallEndBottom - wallStartTop);
            }
            else {
                this.ctx3d.drawImage(this.wallTextureDark, offset, 0, sWidth, this.wallTextureDark.height, wallX, wallStartTop, wallWidthOversized, wallEndBottom - wallStartTop);
            }
            wallX += wallWidth;
        }
        for (var i = 0; i < playerRays.length; i++) {
            var rayL = playerRays[i].l;
            var w = (this.world3d.width * playerW) / rayL;
            // let x = playerRays[i].percAcrossScreen * this.world3d.width;
            var x = void 0;
            if (playerRays[i].percAcrossScreen1 >= 0 && playerRays[i].percAcrossScreen1 <= 1) {
                x = playerRays[i].percAcrossScreen1 * this.world3d.width + w / 2;
            }
            else {
                x = playerRays[i].percAcrossScreen2 * this.world3d.width - w / 2;
            }
            var playerCenterHeight = this.world3d.height / 2.5;
            var wallShiftAmt = (this.world3d.height * 50) / rayL;
            var playerShiftAmt = (this.world3d.height * 40) / rayL;
            var adjToBotAmt = wallShiftAmt - playerShiftAmt;
            var playerStartTop = playerCenterHeight - playerShiftAmt + adjToBotAmt;
            var playerEndBottom = playerCenterHeight + playerShiftAmt + adjToBotAmt;
            var wallDarkness = rayL / this.world3d.height;
            wallDarkness = (this.world3dDiag - rayL) / this.world3dDiag;
            this.ctx3d.fillStyle = "rgba(".concat(255 * wallDarkness, ",").concat(100 * wallDarkness, ",").concat(0 * wallDarkness, ",1)");
            this.ctx3d.fillRect(x - w / 2, playerStartTop, w, playerEndBottom - playerStartTop);
        }
    };
    return Walls3d;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Walls3d);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("./src/index.ts");
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/player2d.ts");
/******/ 	__webpack_require__("./src/players.ts");
/******/ 	__webpack_require__("./src/types.ts");
/******/ 	__webpack_require__("./src/walls2d.ts");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/walls3d.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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S0FBSyxHQUFHLElBQUksVUFBVSxDQUMxQjtZQUNDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFB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NUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsZUFBUSxHQUFHLEdBQUcsWUFBWSxjQUFJLEdBQUcsR0FBRyxZQUFZLGNBQUksQ0FBQyxHQUFHLFlBQVksUUFBSyxDQUFDO1lBRWpHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLEVBQUUsZUFBZSxHQUFHLGNBQWMsQ0FBQyxDQUFDO1NBQ3BGO0lBQ0YsQ0FBQztJQUNGLGNBQUM7QUFBRCxDQUFDOzs7Ozs7OztVQ3hORDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9wbGF5ZXIyZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9wbGF5ZXJzLnRzIiwid2VicGFjazovL2Zwc19nYW1lLy4vc3JjL3dhbGxzMmQudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvd2FsbHMzZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWVyMmQgZnJvbSAnLi9wbGF5ZXIyZCc7XHJcbmltcG9ydCBQbGF5ZXJzIGZyb20gJy4vcGxheWVycyc7XHJcbmltcG9ydCB7IElTb2NrZXREYXRhUmVxLCBJU29ja2V0RGF0YVJlcyB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgV2FsbHMyZCBmcm9tICcuL3dhbGxzMmQnO1xyXG5pbXBvcnQgV2FsbHMzZCBmcm9tICcuL3dhbGxzM2QnO1xyXG5cclxuLy8gVXNlIHdzcyAoc2VjdXJlKSBpbnN0ZWFkIG9mIHdzIGZvciBwcm9kdWNpdG9uXHJcbmNvbnN0IHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjMwMDAvc2VydmVyJyk7XHJcblxyXG5jb25zdCB3b3JsZDJkID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3b3JsZDJkJyk7XHJcbmNvbnN0IHdvcmxkM2QgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dvcmxkM2QnKTtcclxuXHJcbmNvbnN0IGN0eDJkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDJkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcbmNvbnN0IGN0eDNkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDNkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcblxyXG5jb25zdCBmcHNFbGVtZW50ID0gPEhUTUxIZWFkaW5nRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnBzQ291bnRlcicpO1xyXG5cclxubGV0IHdhbGxzMmQ6IFdhbGxzMmQ7XHJcbmxldCB3YWxsczNkOiBXYWxsczNkO1xyXG5sZXQgcGxheWVyMmQ6IFBsYXllcjJkO1xyXG5sZXQgcGxheWVyczogUGxheWVycztcclxuXHJcbmxldCBmcHNJbnRlcnZhbDogbnVtYmVyLCBub3c6IG51bWJlciwgdGhlbjogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIsIHJlcXVlc3RJRDogbnVtYmVyO1xyXG5sZXQgZnJhbWVDb3VudDogbnVtYmVyID0gMDtcclxuY29uc3QgZnJhbWVSYXRlID0gMjA7XHJcblxyXG5sZXQgZGV2TW9kZSA9IHRydWU7XHJcblxyXG5sZXQgdXNlcklkOiBhbnk7XHJcbmxldCBsYXN0UmVjb3JkZWRQbGF5ZXJQb3MgPSB7XHJcblx0eDogMCxcclxuXHR5OiAwLFxyXG59O1xyXG5cclxuY29uc3Qgc2V0RnJhbWVyYXRlVmFsdWUgPSAoKSA9PiB7XHJcblx0ZnBzRWxlbWVudC5pbm5lclRleHQgPSBmcmFtZUNvdW50LnRvU3RyaW5nKCk7XHJcblx0ZnBzRWxlbWVudC5zdHlsZS5jb2xvciA9IGZyYW1lQ291bnQgPCBmcmFtZVJhdGUgPyAncmVkJyA6ICdyZ2IoMCwgMjU1LCAwKSc7XHJcblx0ZnJhbWVDb3VudCA9IDA7XHJcbn07XHJcblxyXG4vLyBsZXQgYXJyVGVzdDogbnVtYmVyW10gPSBbXTtcclxuLy8gY29uc3QgYXJyVGVzdDIgPSBuZXcgRmxvYXQzMkFycmF5KDUwMDApO1xyXG5cclxuLy8gZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJUZXN0Mi5sZW5ndGg7IGkrKykge1xyXG4vLyBcdGFyclRlc3QucHVzaChpKTtcclxuLy8gXHRhcnJUZXN0MltpXSA9IGk7XHJcbi8vIH1cclxuXHJcbmNvbnN0IGdhbWVMb29wID0gKCkgPT4ge1xyXG5cdHJlcXVlc3RJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcCk7XHJcblxyXG5cdGZwc0ludGVydmFsID0gMTAwMCAvIGZyYW1lUmF0ZTtcclxuXHJcblx0bm93ID0gRGF0ZS5ub3coKTtcclxuXHRlbGFwc2VkID0gbm93IC0gdGhlbjtcclxuXHJcblx0aWYgKGVsYXBzZWQgPiBmcHNJbnRlcnZhbCkge1xyXG5cdFx0aWYgKGZyYW1lQ291bnQgPT09IDApIHNldFRpbWVvdXQoc2V0RnJhbWVyYXRlVmFsdWUsIDEwMDApO1xyXG5cdFx0ZnJhbWVDb3VudCArPSAxO1xyXG5cdFx0dGhlbiA9IG5vdyAtIChlbGFwc2VkICUgZnBzSW50ZXJ2YWwpO1xyXG5cclxuXHRcdGN0eDJkLmNsZWFyUmVjdCgwLCAwLCB3b3JsZDJkLndpZHRoLCB3b3JsZDJkLmhlaWdodCk7XHJcblx0XHRjdHgzZC5jbGVhclJlY3QoMCwgMCwgd29ybGQzZC53aWR0aCwgd29ybGQzZC5oZWlnaHQpO1xyXG5cclxuXHRcdC8vIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyVGVzdDIubGVuZ3RoOyBpKyspIHtcclxuXHRcdC8vIFx0Ly8gYXJyVGVzdFtpXSA9IE1hdGgucmFuZG9tKCk7XHJcblx0XHQvLyBcdGFyclRlc3QyW2ldID0gTWF0aC5yYW5kb20oKTtcclxuXHJcblx0XHQvLyBcdGN0eDJkLmNsZWFyUmVjdCgwLCAwLCB3b3JsZDJkLndpZHRoLCB3b3JsZDJkLmhlaWdodCk7XHJcblx0XHQvLyBcdGN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0Ly8gXHRjdHgyZC5mb250ID0gJzQ4cHggYXJpYWwnO1xyXG5cdFx0Ly8gXHRjdHgyZC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xyXG5cdFx0Ly8gXHRjdHgyZC5maWxsVGV4dChhcnJUZXN0MltpXS50b1N0cmluZygpLCAxMDAsIDEwMCk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0d2FsbHMyZC5kcmF3KCk7XHJcblx0XHRwbGF5ZXJzLmRyYXcoKTtcclxuXHRcdHBsYXllcjJkLmRyYXcocGxheWVycy5wbGF5ZXJzKTtcclxuXHRcdHdhbGxzM2Quc2V0YmdUb3BYKHBsYXllcjJkLnJvdEFtdCwgcGxheWVyMmQucm90RGlyKTtcclxuXHRcdHdhbGxzM2QuZHJhdyhcclxuXHRcdFx0cGxheWVyMmQucmF5cyxcclxuXHRcdFx0cGxheWVyMmQucmF5Q29vcmRzLFxyXG5cdFx0XHRwbGF5ZXIyZC5vYmplY3RUeXBlcyxcclxuXHRcdFx0cGxheWVyMmQub2JqZWN0RGlycyxcclxuXHRcdFx0cGxheWVyMmQucGxheWVyWCxcclxuXHRcdFx0cGxheWVyMmQucGxheWVyWSxcclxuXHRcdFx0cGxheWVyMmQucmF5QW5nbGVzLFxyXG5cdFx0XHRwbGF5ZXIyZC5wbGF5ZXJSYXlzLFxyXG5cdFx0XHRwbGF5ZXIyZC5wbGF5ZXJXXHJcblx0XHQpO1xyXG5cclxuXHRcdG9uZTogaWYgKHBsYXllcjJkLnBsYXllclggIT09IGxhc3RSZWNvcmRlZFBsYXllclBvcy54IHx8IHBsYXllcjJkLnBsYXllclkgIT09IGxhc3RSZWNvcmRlZFBsYXllclBvcy55KSB7XHJcblx0XHRcdGxhc3RSZWNvcmRlZFBsYXllclBvcy54ID0gcGxheWVyMmQucGxheWVyWDtcclxuXHRcdFx0bGFzdFJlY29yZGVkUGxheWVyUG9zLnkgPSBwbGF5ZXIyZC5wbGF5ZXJZO1xyXG5cclxuXHRcdFx0aWYgKCF1c2VySWQpIGJyZWFrIG9uZTtcclxuXHJcblx0XHRcdGNvbnN0IGRhdGE6IElTb2NrZXREYXRhUmVxID0ge1xyXG5cdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZS1wbGF5ZXItcG9zJyxcclxuXHRcdFx0XHRpZDogdXNlcklkLFxyXG5cdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdHg6IGxhc3RSZWNvcmRlZFBsYXllclBvcy54LFxyXG5cdFx0XHRcdFx0eTogbGFzdFJlY29yZGVkUGxheWVyUG9zLnksXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fTtcclxuXHRcdFx0c29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKDAsMjU1LDAsMSlgO1xyXG5cdFx0Y3R4M2QubGluZVdpZHRoID0gMjtcclxuXHRcdGN0eDNkLmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4M2QuZWxsaXBzZSh3b3JsZDNkLndpZHRoIC8gMiwgd29ybGQzZC5oZWlnaHQgLyAyLjUsIDUsIDUsIDAsIDAsIDIgKiBNYXRoLlBJKTtcclxuXHRcdGN0eDNkLmZpbGwoKTtcclxuXHR9XHJcbn07XHJcblxyXG5jb25zdCBzZXRVcCA9ICgpID0+IHtcclxuXHR3YWxsczJkID0gbmV3IFdhbGxzMmQod29ybGQyZCwgY3R4MmQpO1xyXG5cdHdhbGxzM2QgPSBuZXcgV2FsbHMzZCh3b3JsZDNkLCBjdHgzZCwgd2FsbHMyZC53YWxsVywgd2FsbHMyZC53YWxsSCk7XHJcblx0cGxheWVyMmQgPSBuZXcgUGxheWVyMmQoXHJcblx0XHR3b3JsZDJkLFxyXG5cdFx0Y3R4MmQsXHJcblx0XHR3YWxsczJkLndhbGxzLFxyXG5cdFx0d2FsbHMyZC53YWxsQ29scyxcclxuXHRcdHdhbGxzMmQud2FsbFJvd3MsXHJcblx0XHR3YWxsczJkLndhbGxXLFxyXG5cdFx0d2FsbHMyZC53YWxsSCxcclxuXHRcdGZyYW1lUmF0ZVxyXG5cdCk7XHJcblx0cGxheWVyMmQuc2V0VXAoKTtcclxuXHRwbGF5ZXJzID0gbmV3IFBsYXllcnMod29ybGQyZCwgY3R4MmQpO1xyXG5cdGdhbWVMb29wKCk7XHJcbn07XHJcblxyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG5cdHRoZW4gPSBEYXRlLm5vdygpO1xyXG5cdHNldFVwKCk7XHJcbn07XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBlID0+IHtcclxuXHRpZiAoIWRldk1vZGUpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdXNlUm90YXRpb24oZS5tb3ZlbWVudFggLyAyMCk7XHJcblx0XHR3YWxsczNkLnNldEJnVG9wWE1vdXNlTW92ZShlLm1vdmVtZW50WCk7XHJcblx0fVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcclxuXHQvL1NldCBtb3ZlIGZvcmV3YXJkcyBhbmQgYmFja3dhcmRzXHJcblx0aWYgKGUuY29kZSA9PT0gJ0tleVcnKSB7XHJcblx0XHRwbGF5ZXIyZC5zZXRNb3ZlRGlyKCdmb3J3YXJkcycpO1xyXG5cdH0gZWxzZSBpZiAoZS5jb2RlID09PSAnS2V5UycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIoJ2JhY2t3YXJkcycpO1xyXG5cdH1cclxuXHJcblx0aWYgKGUuY29kZSA9PT0gJ0tleUEnKSB7XHJcblx0XHRpZiAoZGV2TW9kZSkgcGxheWVyMmQuc2V0Um90YXRpb24oJ2xlZnQnKTtcclxuXHRcdGVsc2UgcGxheWVyMmQuc2V0U3RyYWZlRGlyKCdsZWZ0Jyk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlEJykge1xyXG5cdFx0aWYgKGRldk1vZGUpIHBsYXllcjJkLnNldFJvdGF0aW9uKCdyaWdodCcpO1xyXG5cdFx0ZWxzZSBwbGF5ZXIyZC5zZXRTdHJhZmVEaXIoJ3JpZ2h0Jyk7XHJcblx0fVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZSA9PiB7XHJcblx0Ly9TZXQgbW92ZW1lbnQgdmFyaWFibGVzIHRvIG51bGwgd2hlbiBrZXkgcmVsZWFzZWR7XHJcblx0aWYgKGUuY29kZSA9PT0gJ0tleUEnIHx8IGUuY29kZSA9PT0gJ0tleUQnKSB7XHJcblx0XHRpZiAoZGV2TW9kZSkgcGxheWVyMmQuc2V0Um90YXRpb24obnVsbCk7XHJcblx0XHRlbHNlIHBsYXllcjJkLnNldFN0cmFmZURpcihudWxsKTtcclxuXHR9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleVcnIHx8IGUuY29kZSA9PT0gJ0tleVMnKSB7XHJcblx0XHRwbGF5ZXIyZC5zZXRNb3ZlRGlyKG51bGwpO1xyXG5cdH0gZWxzZSBpZiAoZS5jb2RlID09PSAnS2V5TScpIHtcclxuXHRcdGRldk1vZGUgPSAhZGV2TW9kZTtcclxuXHRcdGlmICghZGV2TW9kZSkge1xyXG5cdFx0XHR3b3JsZDJkLmNsYXNzTGlzdC5hZGQoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0d29ybGQzZC5jbGFzc0xpc3QuYWRkKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdHBsYXllcjJkLmRldk1vZGUgPSBmYWxzZTtcclxuXHRcdFx0d2FsbHMyZC5kZXZNb2RlID0gZmFsc2U7XHJcblx0XHRcdHdvcmxkM2QucmVxdWVzdFBvaW50ZXJMb2NrID1cclxuXHRcdFx0XHQvL0B0cy1pZ25vcmVcclxuXHRcdFx0XHR3b3JsZDNkLnJlcXVlc3RQb2ludGVyTG9jayB8fCB3b3JsZDNkLm1velJlcXVlc3RQb2ludGVyTG9jayB8fCB3b3JsZDNkLndlYmtpdFJlcXVlc3RQb2ludGVyTG9jaztcclxuXHRcdFx0Ly9AdHMtaWdub3JlXHJcblx0XHRcdHdvcmxkM2QucmVxdWVzdFBvaW50ZXJMb2NrKHtcclxuXHRcdFx0XHR1bmFkanVzdGVkTW92ZW1lbnQ6IHRydWUsXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0d29ybGQyZC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdHdvcmxkM2QuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbHNjcmVlbicpO1xyXG5cdFx0XHRwbGF5ZXIyZC5kZXZNb2RlID0gdHJ1ZTtcclxuXHRcdFx0d2FsbHMyZC5kZXZNb2RlID0gdHJ1ZTtcclxuXHRcdFx0ZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrID1cclxuXHRcdFx0XHQvL0B0cy1pZ25vcmVcclxuXHRcdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2sgfHwgZG9jdW1lbnQubW96RXhpdFBvaW50ZXJMb2NrIHx8IGRvY3VtZW50LndlYmtpdEV4aXRQb2ludGVyTG9jaztcclxuXHRcdFx0ZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuXHJcbnNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdvcGVuJywgKCkgPT4ge1xyXG5cdGNvbnNvbGUubG9nKCdVc2VyIGNvbm5lY3RlZCcpO1xyXG59KTtcclxuXHJcbnNvY2tldC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZXZlbnQgPT4ge1xyXG5cdGNvbnN0IHJlczogSVNvY2tldERhdGFSZXMgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpO1xyXG5cdGxldCBkYXRhOiBJU29ja2V0RGF0YVJlcTtcclxuXHJcblx0c3dpdGNoIChyZXM/LmFjdGlvbikge1xyXG5cdFx0Y2FzZSAnc2V0LXVzZXItaWQnOlxyXG5cdFx0XHRjb25zb2xlLmxvZygnVXNlcklkIGhhcyBiZWVuIHNldCcpO1xyXG5cdFx0XHR1c2VySWQgPSByZXMuZGF0YTtcclxuXHJcblx0XHRcdGlmICghdXNlcklkKSByZXR1cm47XHJcblx0XHRcdGRhdGEgPSB7XHJcblx0XHRcdFx0YWN0aW9uOiAnc2VuZC11c2VyLXRvLWNsaWVudHMnLFxyXG5cdFx0XHRcdGlkOiB1c2VySWQsXHJcblx0XHRcdFx0ZGF0YTogJycsXHJcblx0XHRcdH07XHJcblx0XHRcdHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICdzZW5kLXVzZXItdG8tY2xpZW50cyc6XHJcblx0XHRcdHBsYXllcnMuYWRkUGxheWVyKHJlcy5kYXRhKTtcclxuXHJcblx0XHRcdC8vIGlmICghdXNlcklkKSByZXR1cm47XHJcblx0XHRcdC8vIGRhdGEgPSB7XHJcblx0XHRcdC8vIFx0YWN0aW9uOiAnc2VuZC11c2VyLXRvLWNsaWVudHMnLFxyXG5cdFx0XHQvLyBcdGlkOiB1c2VySWQsXHJcblx0XHRcdC8vIFx0ZGF0YTogJycsXHJcblx0XHRcdC8vIH07XHJcblx0XHRcdC8vIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICd1cGRhdGUtcGxheWVyLXBvcyc6XHJcblx0XHRcdHBsYXllcnMudXBkYXRlUGxheWVyUG9zKHsgbmFtZTogcmVzLmRhdGEucGxheWVySWQsIHg6IHJlcy5kYXRhLngsIHk6IHJlcy5kYXRhLnkgfSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAncmVtb3ZlLXBsYXllcic6XHJcblx0XHRcdHBsYXllcnMucmVtb3ZlUGxheWVyKHJlcy5kYXRhKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0fVxyXG59KTtcclxuIiwiaW1wb3J0IHsgSVBsYXllciwgSVBsYXllclJheXMgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllcjJkIHtcclxuXHRwcml2YXRlIHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cdHByaXZhdGUgY3R4MmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHRwcml2YXRlIHdhbGxzOiBVaW50OEFycmF5O1xyXG5cdHByaXZhdGUgd2FsbENvbHM6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxSb3dzOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsVzogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbEg6IG51bWJlcjtcclxuXHRwcml2YXRlIGZyYW1lUmF0ZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgc3BlZWRNdWx0aXBsaWVyOiBudW1iZXI7XHJcblx0cHVibGljIHJheXM6IEZsb2F0MzJBcnJheSB8IG51bGw7XHJcblx0cHVibGljIHJheUNvb3JkczogRmxvYXQzMkFycmF5IHwgbnVsbDtcclxuXHRwdWJsaWMgb2JqZWN0VHlwZXM6IFVpbnQ4QXJyYXkgfCBudWxsO1xyXG5cdHB1YmxpYyBvYmplY3REaXJzOiBVaW50OEFycmF5IHwgbnVsbDtcclxuXHRwcml2YXRlIHJheUluY3JlbWVudDogbnVtYmVyO1xyXG5cdHByaXZhdGUgcmF5T3BhY2l0eTogbnVtYmVyO1xyXG5cdHByaXZhdGUgZm92OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBmb3ZSYWQ6IG51bWJlcjtcclxuXHRwdWJsaWMgcm90YXRpb246IG51bWJlcjtcclxuXHRwcml2YXRlIGFuZ2xlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBkaXN0VG9Qcm9qZWN0aW9uUGxhbmU6IG51bWJlcjtcclxuXHRwdWJsaWMgcmF5QW5nbGVzOiBGbG9hdDMyQXJyYXkgfCBudWxsO1xyXG5cdHByaXZhdGUgcmF5RGVuc2l0eUFkanVzdG1lbnQ6IG51bWJlcjtcclxuXHRwdWJsaWMgcm90RGlyOiBzdHJpbmcgfCBudWxsO1xyXG5cdHB1YmxpYyByb3RBbXQ6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVEaXJGQjogc3RyaW5nIHwgbnVsbDtcclxuXHRwcml2YXRlIG1vdmVBbXRTdGFydDogbnVtYmVyO1xyXG5cdHByaXZhdGUgbW92ZUFtdDogbnVtYmVyO1xyXG5cdHByaXZhdGUgbW92ZUFtdFRvcDogbnVtYmVyO1xyXG5cdHByaXZhdGUgbW92ZURpclN0cmFmZTogc3RyaW5nIHwgbnVsbDtcclxuXHRwcml2YXRlIG1vdmVEaXJSYXlzOiB7XHJcblx0XHRmb3Jld2FyZDogbnVtYmVyO1xyXG5cdFx0bGVmdDogbnVtYmVyO1xyXG5cdFx0cmlnaHQ6IG51bWJlcjtcclxuXHRcdGJhY2t3YXJkOiBudW1iZXI7XHJcblx0fTtcclxuXHRwdWJsaWMgcGxheWVyWDogbnVtYmVyO1xyXG5cdHB1YmxpYyBwbGF5ZXJZOiBudW1iZXI7XHJcblx0cHVibGljIGRldk1vZGU6IGJvb2xlYW47XHJcblx0cHVibGljIHBsYXllclJheXM6IElQbGF5ZXJSYXlzW107XHJcblx0cHVibGljIHBsYXllclc6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoXHJcblx0XHR3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudCxcclxuXHRcdGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcblx0XHR3YWxsczogVWludDhBcnJheSxcclxuXHRcdHdhbGxDb2xzOiBudW1iZXIsXHJcblx0XHR3YWxsUm93czogbnVtYmVyLFxyXG5cdFx0d2FsbFc6IG51bWJlcixcclxuXHRcdHdhbGxIOiBudW1iZXIsXHJcblx0XHRmcmFtZVJhdGU6IG51bWJlclxyXG5cdCkge1xyXG5cdFx0dGhpcy53b3JsZDJkID0gd29ybGQyZDtcclxuXHRcdHRoaXMuY3R4MmQgPSBjdHgyZDtcclxuXHRcdHRoaXMud2FsbHMgPSB3YWxscztcclxuXHRcdHRoaXMud2FsbENvbHMgPSB3YWxsQ29scztcclxuXHRcdHRoaXMud2FsbFJvd3MgPSB3YWxsUm93cztcclxuXHRcdHRoaXMud2FsbFcgPSB3YWxsVztcclxuXHRcdHRoaXMud2FsbEggPSB3YWxsSDtcclxuXHRcdHRoaXMuZnJhbWVSYXRlID0gZnJhbWVSYXRlO1xyXG5cdFx0dGhpcy5zcGVlZE11bHRpcGxpZXIgPSBmcmFtZVJhdGUgLyA2MDtcclxuXHRcdHRoaXMucmF5cyA9IG51bGw7XHJcblx0XHR0aGlzLnJheUNvb3JkcyA9IG51bGw7XHJcblx0XHR0aGlzLm9iamVjdFR5cGVzID0gbnVsbDtcclxuXHRcdHRoaXMub2JqZWN0RGlycyA9IG51bGw7XHJcblx0XHR0aGlzLnJheUluY3JlbWVudCA9IDI7XHJcblx0XHR0aGlzLnJheU9wYWNpdHkgPSAwLjI2O1xyXG5cdFx0dGhpcy5mb3YgPSA2MDtcclxuXHRcdHRoaXMuZm92UmFkID0gdGhpcy5mb3YgKiAoTWF0aC5QSSAvIDE4MCk7XHJcblx0XHR0aGlzLnJvdGF0aW9uID0gMjMwO1xyXG5cdFx0dGhpcy5hbmdsZSA9IHRoaXMucm90YXRpb24gKyA5MDtcclxuXHRcdHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lID0gd29ybGQyZC53aWR0aCAvIDIgLyBNYXRoLnRhbih0aGlzLmZvdlJhZCAvIDIpO1xyXG5cdFx0dGhpcy5yYXlBbmdsZXMgPSBudWxsO1xyXG5cdFx0dGhpcy5yYXlEZW5zaXR5QWRqdXN0bWVudCA9IDE1MDtcclxuXHRcdHRoaXMucm90RGlyID0gbnVsbDtcclxuXHRcdHRoaXMucm90QW10ID0gMiAvIHRoaXMuc3BlZWRNdWx0aXBsaWVyO1xyXG5cdFx0dGhpcy5tb3ZlRGlyRkIgPSBudWxsO1xyXG5cdFx0dGhpcy5tb3ZlQW10U3RhcnQgPSAzIC8gdGhpcy5zcGVlZE11bHRpcGxpZXI7XHJcblx0XHR0aGlzLm1vdmVBbXQgPSAzIC8gdGhpcy5zcGVlZE11bHRpcGxpZXI7XHJcblx0XHR0aGlzLm1vdmVBbXRUb3AgPSAzIC8gdGhpcy5zcGVlZE11bHRpcGxpZXI7XHJcblx0XHR0aGlzLm1vdmVEaXJTdHJhZmUgPSBudWxsO1xyXG5cdFx0dGhpcy5tb3ZlRGlyUmF5cyA9IHtcclxuXHRcdFx0Zm9yZXdhcmQ6IEluZmluaXR5LFxyXG5cdFx0XHRsZWZ0OiBJbmZpbml0eSxcclxuXHRcdFx0cmlnaHQ6IEluZmluaXR5LFxyXG5cdFx0XHRiYWNrd2FyZDogSW5maW5pdHksXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5wbGF5ZXJYID0gODQwO1xyXG5cdFx0dGhpcy5wbGF5ZXJZID0gMTUwO1xyXG5cdFx0dGhpcy5kZXZNb2RlID0gdHJ1ZTtcclxuXHRcdHRoaXMucGxheWVyUmF5cyA9IFtdO1xyXG5cdFx0dGhpcy5wbGF5ZXJXID0gMjA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0VXAoKSB7XHJcblx0XHR0aGlzLnNldEFuZ2xlcygpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFJvdGF0aW9uKGRpcjogc3RyaW5nIHwgbnVsbCkge1xyXG5cdFx0Ly8gaWYgKHRoaXMucm90RGlyID09PSBudWxsKSB7XHJcblx0XHQvLyBcdHRoaXMucm90QW10ID0gMjtcclxuXHRcdC8vIH1cclxuXHRcdHRoaXMucm90RGlyID0gZGlyO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldE1vdXNlUm90YXRpb24oYW10OiBudW1iZXIpIHtcclxuXHRcdHRoaXMucm90YXRpb24gKz0gYW10O1xyXG5cdFx0dGhpcy5hbmdsZSArPSBhbXQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0U3RyYWZlRGlyKGRpcjogc3RyaW5nIHwgbnVsbCkge1xyXG5cdFx0aWYgKHRoaXMubW92ZURpclN0cmFmZSA9PT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLm1vdmVBbXQgPSB0aGlzLm1vdmVBbXRTdGFydDtcclxuXHRcdH1cclxuXHRcdHRoaXMubW92ZURpclN0cmFmZSA9IGRpcjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgcm90YXRlKCkge1xyXG5cdFx0Ly8gaWYgKHRoaXMucm90QW10IDwgdGhpcy5yb3RBbXQpIHtcclxuXHRcdC8vIFx0dGhpcy5yb3RBbXQgKz0gMC4xO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdGlmICh0aGlzLnJvdERpciA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdHRoaXMucm90YXRpb24gLT0gdGhpcy5yb3RBbXQ7XHJcblx0XHRcdHRoaXMuYW5nbGUgLT0gdGhpcy5yb3RBbXQ7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMucm90RGlyID09PSAncmlnaHQnKSB7XHJcblx0XHRcdHRoaXMucm90YXRpb24gKz0gdGhpcy5yb3RBbXQ7XHJcblx0XHRcdHRoaXMuYW5nbGUgKz0gdGhpcy5yb3RBbXQ7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0TW92ZURpcihkaXI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdGlmICh0aGlzLm1vdmVEaXJGQiA9PT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLm1vdmVBbXQgPSB0aGlzLm1vdmVBbXRTdGFydDtcclxuXHRcdH1cclxuXHRcdHRoaXMubW92ZURpckZCID0gZGlyO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBtb3ZlKCkge1xyXG5cdFx0aWYgKCF0aGlzPy5yYXlzPy5sZW5ndGgpIHJldHVybjtcclxuXHRcdHRoaXMucm90YXRlKCk7XHJcblxyXG5cdFx0aWYgKHRoaXMubW92ZUFtdCA8IHRoaXMubW92ZUFtdFRvcCkgdGhpcy5tb3ZlQW10ICs9IDAuMDU7XHJcblxyXG5cdFx0Y29uc3QgZGlyUmFkaWFucyA9IHRoaXMuYW5nbGUgKiAoTWF0aC5QSSAvIDE4MCk7XHJcblx0XHRjb25zdCBtb3ZlWCA9IHRoaXMubW92ZUFtdCAqIE1hdGguY29zKDkwICogKE1hdGguUEkgLyAxODApIC0gZGlyUmFkaWFucyk7XHJcblx0XHRjb25zdCBtb3ZlWSA9IHRoaXMubW92ZUFtdCAqIE1hdGguY29zKGRpclJhZGlhbnMpO1xyXG5cdFx0Y29uc3QgZGlyUmFkaWFuc1N0cmFmZSA9IGRpclJhZGlhbnMgKyBNYXRoLlBJIC8gMjtcclxuXHRcdGNvbnN0IHN0cmFmZVggPSAodGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoOTAgKiAoTWF0aC5QSSAvIDE4MCkgLSBkaXJSYWRpYW5zU3RyYWZlKSkgLyAyO1xyXG5cdFx0Y29uc3Qgc3RyYWZlWSA9ICh0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyhkaXJSYWRpYW5zU3RyYWZlKSkgLyAyO1xyXG5cdFx0Y29uc3QgaGl0dGluZ0YgPSB0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkIDwgMTQ7XHJcblx0XHRjb25zdCBoaXR0aW5nTCA9IHRoaXMubW92ZURpclJheXMubGVmdCA8IDE0O1xyXG5cdFx0Y29uc3QgaGl0dGluZ1IgPSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0IDwgMTQ7XHJcblx0XHRjb25zdCBoaXR0aW5nQiA9IHRoaXMubW92ZURpclJheXMuYmFja3dhcmQgPCAxNDtcclxuXHJcblx0XHRpZiAodGhpcy5tb3ZlRGlyRkIgPT09ICdmb3J3YXJkcycpIHtcclxuXHRcdFx0aWYgKCFoaXR0aW5nRikge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWCArPSBtb3ZlWDtcclxuXHRcdFx0XHR0aGlzLnBsYXllclkgLT0gbW92ZVk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5tb3ZlRGlyRkIgPT09ICdiYWNrd2FyZHMnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0IpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggLT0gbW92ZVg7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZICs9IG1vdmVZO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy5tb3ZlRGlyU3RyYWZlID09PSAnbGVmdCcpIHtcclxuXHRcdFx0aWYgKCFoaXR0aW5nTCkge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWCAtPSBzdHJhZmVYO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghaGl0dGluZ0wpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclkgKz0gc3RyYWZlWTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLm1vdmVEaXJTdHJhZmUgPT09ICdyaWdodCcpIHtcclxuXHRcdFx0aWYgKCFoaXR0aW5nUikge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWCArPSBzdHJhZmVYO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICghaGl0dGluZ1IpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclkgLT0gc3RyYWZlWTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBzZXRBbmdsZXMoKSB7XHJcblx0XHRjb25zdCBhbmdsZUFyckxlbmd0aCA9IE1hdGguY2VpbChcclxuXHRcdFx0KHRoaXMud29ybGQyZC53aWR0aCArIHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnQpIC8gdGhpcy5yYXlEZW5zaXR5QWRqdXN0bWVudFxyXG5cdFx0KTtcclxuXHRcdHRoaXMucmF5QW5nbGVzID0gbmV3IEZsb2F0MzJBcnJheShhbmdsZUFyckxlbmd0aCk7XHJcblx0XHR0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSA9IHRoaXMud29ybGQyZC53aWR0aCAvIDIgLyBNYXRoLnRhbih0aGlzLmZvdlJhZCAvIDIpO1xyXG5cclxuXHRcdGxldCB4ID0gMDtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYW5nbGVBcnJMZW5ndGg7IGkrKykge1xyXG5cdFx0XHR0aGlzLnJheUFuZ2xlc1tpXSA9IE1hdGguYXRhbigoeCAtIHRoaXMud29ybGQyZC53aWR0aCAvIDIpIC8gdGhpcy5kaXN0VG9Qcm9qZWN0aW9uUGxhbmUpO1xyXG5cdFx0XHR4ICs9IHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnQ7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5yYXlzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGgpO1xyXG5cdFx0dGhpcy5yYXlDb29yZHMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCAqIDIpO1xyXG5cdFx0dGhpcy5vYmplY3RUeXBlcyA9IG5ldyBVaW50OEFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCk7XHJcblx0XHR0aGlzLm9iamVjdERpcnMgPSBuZXcgVWludDhBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGgpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRJbnRlcnNlY3Rpb24gPSAoXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHRyOiBudW1iZXIsXHJcblx0XHR0aGV0YTogbnVtYmVyLFxyXG5cdFx0eDE6IG51bWJlcixcclxuXHRcdHkxOiBudW1iZXIsXHJcblx0XHR4MjogbnVtYmVyLFxyXG5cdFx0eTI6IG51bWJlcixcclxuXHRcdHJvdDogbnVtYmVyLFxyXG5cdFx0cDQ/OiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH1cclxuXHQpID0+IHtcclxuXHRcdGNvbnN0IGFkanVzdGVkQW5nbGUgPSB0aGV0YSArIHJvdCAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdGNvbnN0IHgzID0geDtcclxuXHRcdGNvbnN0IHkzID0geTtcclxuXHRcdGxldCB4NDtcclxuXHRcdGxldCB5NDtcclxuXHRcdGxldCB1TWF4ID0gSW5maW5pdHk7XHJcblx0XHRpZiAocDQ/LnggJiYgcDQ/LnkpIHtcclxuXHRcdFx0eDQgPSBwNC54O1xyXG5cdFx0XHR5NCA9IHA0Lnk7XHJcblx0XHRcdHVNYXggPSAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0eDQgPSB4ICsgciAqIE1hdGguY29zKGFkanVzdGVkQW5nbGUpO1xyXG5cdFx0XHR5NCA9IHkgKyByICogTWF0aC5zaW4oYWRqdXN0ZWRBbmdsZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgZGVub20gPSAoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCk7XHJcblxyXG5cdFx0aWYgKGRlbm9tID09IDApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgdCA9ICgoeDEgLSB4MykgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MykgKiAoeDMgLSB4NCkpIC8gZGVub207XHJcblx0XHRjb25zdCB1ID0gKCh4MSAtIHgzKSAqICh5MSAtIHkyKSAtICh5MSAtIHkzKSAqICh4MSAtIHgyKSkgLyBkZW5vbTtcclxuXHRcdGlmICh0ID49IDAgJiYgdCA8PSAxICYmIHUgPj0gMCAmJiB1IDw9IHVNYXgpIHtcclxuXHRcdFx0Y29uc3QgcHggPSB4MyArIHUgKiAoeDQgLSB4Myk7XHJcblx0XHRcdGNvbnN0IHB5ID0geTMgKyB1ICogKHk0IC0geTMpO1xyXG5cdFx0XHRyZXR1cm4gW3B4LCBweV07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0cHJpdmF0ZSBnZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChcclxuXHRcdGo6IG51bWJlcixcclxuXHRcdGs6IG51bWJlcixcclxuXHRcdHg6IG51bWJlcixcclxuXHRcdHk6IG51bWJlcixcclxuXHRcdHJheUFuZ2xlOiBudW1iZXIsXHJcblx0XHRyb3RhdGlvbjogbnVtYmVyLFxyXG5cdFx0cDQ/OiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH1cclxuXHQpIHtcclxuXHRcdGNvbnN0IHIgPSAxO1xyXG5cdFx0Y29uc3QgeDEgPSBrICogdGhpcy53YWxsVztcclxuXHRcdGNvbnN0IHkxID0gaiAqIHRoaXMud2FsbEg7XHJcblxyXG5cdFx0Y29uc3QgeDIgPSB4MSArIHRoaXMud2FsbFc7XHJcblx0XHRjb25zdCB5MiA9IHkxO1xyXG5cclxuXHRcdGNvbnN0IHgzID0geDEgKyB0aGlzLndhbGxXO1xyXG5cdFx0Y29uc3QgeTMgPSB5MSArIHRoaXMud2FsbEg7XHJcblxyXG5cdFx0Y29uc3QgeDQgPSB4MTtcclxuXHRcdGNvbnN0IHk0ID0geTEgKyB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGxldCByZWNvcmQgPSBJbmZpbml0eTtcclxuXHRcdGxldCBjbG9zZXN0ID0gbnVsbDtcclxuXHRcdGxldCBkaXIgPSAwO1xyXG5cclxuXHRcdGZvciAobGV0IG4gPSAwOyBuIDwgNDsgbisrKSB7XHJcblx0XHRcdHN3aXRjaCAobikge1xyXG5cdFx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvblRvcCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHJheUFuZ2xlLCB4MSwgeTEsIHgyLCB5Miwgcm90YXRpb24sIHA0KTtcclxuXHRcdFx0XHRcdGlmIChpbnRlcnNlY3Rpb25Ub3ApIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gaW50ZXJzZWN0aW9uVG9wWzBdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uVG9wWzFdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblx0XHRcdFx0XHRcdHJlY29yZCA9IE1hdGgubWluKGQsIHJlY29yZCk7XHJcblx0XHRcdFx0XHRcdGlmIChkIDw9IHJlY29yZCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlY29yZCA9IGQ7XHJcblx0XHRcdFx0XHRcdFx0Y2xvc2VzdCA9IGludGVyc2VjdGlvblRvcDtcclxuXHRcdFx0XHRcdFx0XHRkaXIgPSAwO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25SaWdodCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHJheUFuZ2xlLCB4MiwgeTIsIHgzLCB5Mywgcm90YXRpb24sIHA0KTtcclxuXHRcdFx0XHRcdGlmIChpbnRlcnNlY3Rpb25SaWdodCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25SaWdodFswXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGludGVyc2VjdGlvblJpZ2h0WzFdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblx0XHRcdFx0XHRcdHJlY29yZCA9IE1hdGgubWluKGQsIHJlY29yZCk7XHJcblx0XHRcdFx0XHRcdGlmIChkIDw9IHJlY29yZCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlY29yZCA9IGQ7XHJcblx0XHRcdFx0XHRcdFx0Y2xvc2VzdCA9IGludGVyc2VjdGlvblJpZ2h0O1xyXG5cdFx0XHRcdFx0XHRcdGRpciA9IDE7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbkJvdCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHJheUFuZ2xlLCB4MywgeTMsIHg0LCB5NCwgcm90YXRpb24sIHA0KTtcclxuXHRcdFx0XHRcdGlmIChpbnRlcnNlY3Rpb25Cb3QpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gaW50ZXJzZWN0aW9uQm90WzBdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uQm90WzFdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblx0XHRcdFx0XHRcdHJlY29yZCA9IE1hdGgubWluKGQsIHJlY29yZCk7XHJcblx0XHRcdFx0XHRcdGlmIChkIDw9IHJlY29yZCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlY29yZCA9IGQ7XHJcblx0XHRcdFx0XHRcdFx0Y2xvc2VzdCA9IGludGVyc2VjdGlvbkJvdDtcclxuXHRcdFx0XHRcdFx0XHRkaXIgPSAyO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25MZWZ0ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgcmF5QW5nbGUsIHg0LCB5NCwgeDEsIHkxLCByb3RhdGlvbiwgcDQpO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvbkxlZnQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gaW50ZXJzZWN0aW9uTGVmdFswXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGludGVyc2VjdGlvbkxlZnRbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uTGVmdDtcclxuXHRcdFx0XHRcdFx0XHRkaXIgPSAzO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlY29yZCxcclxuXHRcdFx0Y2xvc2VzdCxcclxuXHRcdFx0ZGlyLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0UmF5QW5nbGUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcikge1xyXG5cdFx0bGV0IHJheUFuZyA9XHJcblx0XHRcdHgyIC0geDEgPCAwXHJcblx0XHRcdFx0PyAyNzAgLSAoTWF0aC5hdGFuKCh5MiAtIHkxKSAvIC0oeDIgLSB4MSkpICogMTgwKSAvIE1hdGguUElcclxuXHRcdFx0XHQ6IDkwICsgKE1hdGguYXRhbigoeTIgLSB5MSkgLyAoeDIgLSB4MSkpICogMTgwKSAvIE1hdGguUEk7XHJcblx0XHRyYXlBbmcgPSAoKChyYXlBbmcgLSA5MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHJcblx0XHRyZXR1cm4gcmF5QW5nO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRQZXJjQWNyU2NyZWVuKFxyXG5cdFx0eDogbnVtYmVyLFxyXG5cdFx0eTogbnVtYmVyLFxyXG5cdFx0cHg6IG51bWJlcixcclxuXHRcdHB5OiBudW1iZXIsXHJcblx0XHRyb3RhdGlvbjogbnVtYmVyLFxyXG5cdFx0aXNTcHJpdGU6IGJvb2xlYW5cclxuXHQpIHtcclxuXHRcdGNvbnN0IHJheUFuZyA9IHRoaXMuZ2V0UmF5QW5nbGUoeCwgeSwgcHgsIHB5KTtcclxuXHJcblx0XHRsZXQgcmF5Um90RGlmZiA9IHJheUFuZyAtIHJvdGF0aW9uO1xyXG5cclxuXHRcdGlmIChNYXRoLmFicyhyYXlSb3REaWZmKSA+IHRoaXMuZm92IC8gMikge1xyXG5cdFx0XHRyYXlSb3REaWZmID0gcmF5Um90RGlmZiA+PSAwID8gcmF5Um90RGlmZiAtIDM2MCA6IDM2MCArIHJheVJvdERpZmY7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGVyY0FjclNjcmVlbiA9IHJheVJvdERpZmYgLyB0aGlzLmZvdiArIDAuNTtcclxuXHJcblx0XHRyZXR1cm4gcGVyY0FjclNjcmVlbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KHBsYXllcnM6IElQbGF5ZXJbXSkge1xyXG5cdFx0Y29uc3QgeCA9IHRoaXMucGxheWVyWDtcclxuXHRcdGNvbnN0IHkgPSB0aGlzLnBsYXllclk7XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXJSYXlzID0gW107XHJcblxyXG5cdFx0dGhpcy5tb3ZlKCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLnJheUFuZ2xlcyB8fCAhdGhpcy5yYXlzKSByZXR1cm47XHJcblx0XHRjb25zdCByb3RhdGlvbiA9ICgodGhpcy5yb3RhdGlvbiAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cclxuXHRcdGxldCBvYmpUeXBlVGVtcCA9IDA7XHJcblx0XHRsZXQgb2JqRGlyVGVtcCA9IDA7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJheUFuZ2xlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgY2xvc2VzdCA9IG51bGw7XHJcblx0XHRcdGxldCByZWNvcmQgPSBJbmZpbml0eTtcclxuXHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsUm93czsgaisrKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLndhbGxDb2xzOyBrKyspIHtcclxuXHRcdFx0XHRcdGNvbnN0IHdhbGwgPSB0aGlzLndhbGxzW2ogKiB0aGlzLndhbGxDb2xzICsga107XHJcblx0XHRcdFx0XHRpZiAod2FsbCA9PT0gMCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgcmVjdEludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdFx0XHRkaXI6IG51bWJlcjtcclxuXHRcdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGosIGssIHgsIHksIHRoaXMucmF5QW5nbGVzW2ldLCByb3RhdGlvbik7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHJlY3RJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdHJlY29yZCA9IHJlY3RJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0XHRjbG9zZXN0ID0gcmVjdEludGVyc2VjdGlvbi5jbG9zZXN0O1xyXG5cclxuXHRcdFx0XHRcdFx0b2JqVHlwZVRlbXAgPSB3YWxsO1xyXG5cdFx0XHRcdFx0XHRvYmpEaXJUZW1wID0gcmVjdEludGVyc2VjdGlvbi5kaXI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY2xvc2VzdCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmRldk1vZGUpIHtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLm1vdmVUbyh4LCB5KTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVRvKGNsb3Nlc3RbMF0sIGNsb3Nlc3RbMV0pO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5zdHJva2VTdHlsZSA9IGByZ2JhKDI1NSwyNTUsMjU1LCR7dGhpcy5yYXlPcGFjaXR5fSlgO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5saW5lV2lkdGggPSAxO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5zdHJva2UoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMucmF5c1tpXSA9IHJlY29yZDtcclxuXHRcdFx0XHRpZiAodGhpcy5yYXlDb29yZHMpIHtcclxuXHRcdFx0XHRcdHRoaXMucmF5Q29vcmRzW2kgKiAyXSA9IGNsb3Nlc3RbMF07XHJcblx0XHRcdFx0XHR0aGlzLnJheUNvb3Jkc1tpICogMiArIDFdID0gY2xvc2VzdFsxXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMub2JqZWN0VHlwZXMpIHRoaXMub2JqZWN0VHlwZXNbaV0gPSBvYmpUeXBlVGVtcDtcclxuXHRcdFx0XHRpZiAodGhpcy5vYmplY3REaXJzKSB0aGlzLm9iamVjdERpcnNbaV0gPSBvYmpEaXJUZW1wO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMucmF5c1tpXSA9IEluZmluaXR5O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bG9vcDE6IGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBwID0gcGxheWVyc1tpXTtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxSb3dzOyBqKyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IHRoaXMud2FsbENvbHM7IGsrKykge1xyXG5cdFx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaiAqIHRoaXMud2FsbENvbHMgKyBrXTtcclxuXHRcdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCByZWN0SW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0XHRcdGRpcjogbnVtYmVyO1xyXG5cdFx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaiwgaywgeCwgeSwgMCwgcm90YXRpb24sIHsgeDogcC54LCB5OiBwLnkgfSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHJlY3RJbnRlcnNlY3Rpb24/LmNsb3Nlc3Q/LlswXSkgY29udGludWUgbG9vcDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBwLngpO1xyXG5cdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBwLnkpO1xyXG5cdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcblx0XHRcdGNvbnN0IGRlbHRhRCA9IHRoaXMucGxheWVyVyAvIDI7XHJcblx0XHRcdGNvbnN0IHNsb3BlID0gKHAueSAtIHRoaXMucGxheWVyWSkgLyAocC54IC0gdGhpcy5wbGF5ZXJYKTtcclxuXHRcdFx0Y29uc3QgcGVycFNsb3BlID0gLSgxIC8gc2xvcGUpO1xyXG5cdFx0XHRjb25zdCBhbmdsZSA9IE1hdGguYXRhbihwZXJwU2xvcGUpO1xyXG5cdFx0XHRjb25zdCB4MSA9IHAueCArIGRlbHRhRCAqIE1hdGguY29zKGFuZ2xlKTtcclxuXHRcdFx0Y29uc3QgeTEgPSBwLnkgKyBkZWx0YUQgKiBNYXRoLnNpbihhbmdsZSk7XHJcblx0XHRcdGNvbnN0IHgyID0gcC54IC0gZGVsdGFEICogTWF0aC5jb3MoYW5nbGUpO1xyXG5cdFx0XHRjb25zdCB5MiA9IHAueSAtIGRlbHRhRCAqIE1hdGguc2luKGFuZ2xlKTtcclxuXHJcblx0XHRcdGNvbnN0IHBlcmNBY3JTY3JlZW46IG51bWJlciA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCBwLngsIHAueSwgcm90YXRpb24sIGZhbHNlKTtcclxuXHJcblx0XHRcdGNvbnN0IGFuZ2xlRGVnID0gdGhpcy5nZXRSYXlBbmdsZSh4LCB5LCBwLngsIHAueSk7XHJcblx0XHRcdGxldCBwZXJjQWNyU2NyZWVuTDogbnVtYmVyID0gLTE7XHJcblx0XHRcdGxldCBwZXJjQWNyU2NyZWVuUjogbnVtYmVyID0gLTE7XHJcblxyXG5cdFx0XHRpZiAoYW5nbGVEZWcgPj0gMCAmJiBhbmdsZURlZyA8PSAxODApIHtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuTCA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MSwgeTEsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuUiA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MiwgeTIsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuTCA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MiwgeTIsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuUiA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MSwgeTEsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKChwZXJjQWNyU2NyZWVuTCA+PSAwICYmIHBlcmNBY3JTY3JlZW5MIDw9IDEpIHx8IChwZXJjQWNyU2NyZWVuUiA+PSAwICYmIHBlcmNBY3JTY3JlZW5SIDw9IDEpKSB7XHJcblx0XHRcdFx0aWYgKHBlcmNBY3JTY3JlZW5MID49IDAgJiYgcGVyY0FjclNjcmVlbkwgPD0gMSAmJiBwZXJjQWNyU2NyZWVuUiA+PSAwICYmIHBlcmNBY3JTY3JlZW5SIDw9IDEpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHBlcmNBY3JTY3JlZW5MdGVtcCA9IHBlcmNBY3JTY3JlZW5MO1xyXG5cdFx0XHRcdFx0cGVyY0FjclNjcmVlbkwgPSBNYXRoLm1pbihwZXJjQWNyU2NyZWVuTCwgcGVyY0FjclNjcmVlblIpO1xyXG5cdFx0XHRcdFx0cGVyY0FjclNjcmVlblIgPSBNYXRoLm1heChwZXJjQWNyU2NyZWVuTHRlbXAsIHBlcmNBY3JTY3JlZW5SKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJSYXlzLnB1c2goe1xyXG5cdFx0XHRcdFx0bDogZCxcclxuXHRcdFx0XHRcdHg6IHAueCxcclxuXHRcdFx0XHRcdHk6IHAueSxcclxuXHRcdFx0XHRcdG5hbWU6IHAubmFtZSxcclxuXHRcdFx0XHRcdHBlcmNBY3Jvc3NTY3JlZW46IHBlcmNBY3JTY3JlZW4sXHJcblx0XHRcdFx0XHRwZXJjQWNyb3NzU2NyZWVuMTogcGVyY0FjclNjcmVlbkwsXHJcblx0XHRcdFx0XHRwZXJjQWNyb3NzU2NyZWVuMjogcGVyY0FjclNjcmVlblIsXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmRldk1vZGUpIHtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLm1vdmVUbyh4LCB5KTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVRvKHAueCwgcC55KTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlU3R5bGUgPSBgcmdiYSgyNTUsMCwwLDEpYDtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVdpZHRoID0gMTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiAocGVyY0FjclNjcmVlbiA+PSAwICYmIHBlcmNBY3JTY3JlZW4gPD0gMSkge1xyXG5cdFx0XHQvLyBcdHRoaXMucGxheWVyUmF5cy5wdXNoKHtcclxuXHRcdFx0Ly8gXHRcdGw6IGQsXHJcblx0XHRcdC8vIFx0XHR4OiBwLngsXHJcblx0XHRcdC8vIFx0XHR5OiBwLnksXHJcblx0XHRcdC8vIFx0XHRuYW1lOiBwLm5hbWUsXHJcblx0XHRcdC8vIFx0XHRwZXJjQWNyb3NzU2NyZWVuOiBwZXJjQWNyU2NyZWVuLFxyXG5cdFx0XHQvLyBcdH0pO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgcm90YXRpb25GID0gKCh0aGlzLnJvdGF0aW9uICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblx0XHRjb25zdCByb3RhdGlvblIgPSAoKCh0aGlzLnJvdGF0aW9uICsgOTApICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblx0XHRjb25zdCByb3RhdGlvbkIgPSAoKCh0aGlzLnJvdGF0aW9uICsgMTgwKSAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cdFx0Y29uc3Qgcm90YXRpb25MID0gKCgodGhpcy5yb3RhdGlvbiAtIDkwKSAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cclxuXHRcdGxldCBjbG9zZXN0RiA9IG51bGw7XHJcblx0XHRsZXQgcmVjb3JkRiA9IEluZmluaXR5O1xyXG5cclxuXHRcdGxldCBjbG9zZXN0TCA9IG51bGw7XHJcblx0XHRsZXQgcmVjb3JkTCA9IEluZmluaXR5O1xyXG5cclxuXHRcdGxldCBjbG9zZXN0UiA9IG51bGw7XHJcblx0XHRsZXQgcmVjb3JkUiA9IEluZmluaXR5O1xyXG5cclxuXHRcdGxldCBjbG9zZXN0QiA9IG51bGw7XHJcblx0XHRsZXQgcmVjb3JkQiA9IEluZmluaXR5O1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53YWxsUm93czsgaSsrKSB7XHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsQ29sczsgaisrKSB7XHJcblx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaSAqIHRoaXMud2FsbENvbHMgKyBqXTtcclxuXHRcdFx0XHRpZiAod2FsbCA9PT0gMCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdGNvbnN0IGZJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGksIGosIHgsIHksIDAsIHJvdGF0aW9uRik7XHJcblx0XHRcdFx0aWYgKGZJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkRikge1xyXG5cdFx0XHRcdFx0cmVjb3JkRiA9IGZJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdEYgPSBmSW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBsSW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdGNsb3Nlc3Q6IG51bWJlcltdIHwgbnVsbDtcclxuXHRcdFx0XHR9ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChpLCBqLCB4LCB5LCAwLCByb3RhdGlvbkwpO1xyXG5cdFx0XHRcdGlmIChsSW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZEwpIHtcclxuXHRcdFx0XHRcdHJlY29yZEwgPSBsSW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdGNsb3Nlc3RMID0gbEludGVyc2VjdGlvbi5jbG9zZXN0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3QgckludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgMCwgcm90YXRpb25SKTtcclxuXHRcdFx0XHRpZiAockludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRSKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRSID0gckludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0UiA9IHJJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IGJJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGksIGosIHgsIHksIDAsIHJvdGF0aW9uQik7XHJcblx0XHRcdFx0aWYgKGJJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkQikge1xyXG5cdFx0XHRcdFx0cmVjb3JkQiA9IGJJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdEIgPSBiSW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RGKSB0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkID0gcmVjb3JkRjtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5mb3Jld2FyZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdGlmIChjbG9zZXN0TCkgdGhpcy5tb3ZlRGlyUmF5cy5sZWZ0ID0gcmVjb3JkTDtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5sZWZ0ID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RSKSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0ID0gcmVjb3JkUjtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5yaWdodCA9IEluZmluaXR5O1xyXG5cclxuXHRcdGlmIChjbG9zZXN0QikgdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA9IHJlY29yZEI7XHJcblx0XHRlbHNlIHRoaXMubW92ZURpclJheXMuYmFja3dhcmQgPSBJbmZpbml0eTtcclxuXHJcblx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9IGByZ2JhKDAsMjU1LDAsMSlgO1xyXG5cdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdHRoaXMuY3R4MmQuZWxsaXBzZSh0aGlzLnBsYXllclgsIHRoaXMucGxheWVyWSwgNiwgNiwgMCwgMCwgMiAqIE1hdGguUEkpO1xyXG5cdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IElQbGF5ZXIgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllcnMge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHB1YmxpYyBwbGF5ZXJzOiBJUGxheWVyW107XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy5wbGF5ZXJzID0gW107XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWRkUGxheWVyKG5hbWU6IHN0cmluZykge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMucGxheWVyc1tpXS5uYW1lID09PSBuYW1lKSByZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXJzLnB1c2goe1xyXG5cdFx0XHRuYW1lOiBuYW1lLFxyXG5cdFx0XHR4OiB0aGlzLndvcmxkMmQud2lkdGggLyAyLFxyXG5cdFx0XHR5OiB0aGlzLndvcmxkMmQuaGVpZ2h0IC8gMixcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5sb2coYCR7bmFtZX0gaGFzIGpvaW5lZCB0aGUgbWF0Y2hgKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZW1vdmVQbGF5ZXIobmFtZTogc3RyaW5nKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgUGxheWVyICR7bmFtZX0gaGFzIGxlZnQgdGhlIG1hdGNoYCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJzW2ldLm5hbWUgPT09IG5hbWUpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllcnMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlUGxheWVyUG9zKHA6IElQbGF5ZXIpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnBsYXllcnNbaV0ubmFtZSA9PT0gcC5uYW1lKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJzW2ldLnggPSBwLng7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJzW2ldLnkgPSBwLnk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXJzLnB1c2goe1xyXG5cdFx0XHRuYW1lOiBwLm5hbWUsXHJcblx0XHRcdHg6IHAueCxcclxuXHRcdFx0eTogcC55LFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZHJhdygpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHAgPSB0aGlzLnBsYXllcnNbaV07XHJcblxyXG5cdFx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9ICdyZWQnO1xyXG5cdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHR0aGlzLmN0eDJkLmVsbGlwc2UocC54LCBwLnksIDYsIDYsIDIgKiBNYXRoLlBJLCAwLCAyICogTWF0aC5QSSk7XHJcblx0XHRcdHRoaXMuY3R4MmQuZmlsbCgpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxsczJkIHtcclxuXHRwcml2YXRlIHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cdHByaXZhdGUgY3R4MmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHRwdWJsaWMgd2FsbENvbHM6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHVibGljIHdhbGxXOiBudW1iZXI7XHJcblx0cHVibGljIHdhbGxIOiBudW1iZXI7XHJcblx0cHVibGljIGRldk1vZGU6IGJvb2xlYW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy53YWxsQ29scyA9IDMyO1xyXG5cdFx0dGhpcy53YWxsUm93cyA9IDE4O1xyXG5cdFx0dGhpcy53YWxscyA9IG5ldyBVaW50OEFycmF5KFxyXG5cdFx0XHRbXHJcblx0XHRcdFx0WzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDEsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAxLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAxLCAwLCAwLCAxLCAxLCAxLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAwLCAxLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDEsIDEsIDEsIDEsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAxLCAxLCAxLCAxLCAwLCAxLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDEsIDEsIDEsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMiwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDEsIDEsIDEsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcblx0XHRcdF0uZmxhdCgpXHJcblx0XHQpO1xyXG5cdFx0dGhpcy53YWxsVyA9IHRoaXMud29ybGQyZC53aWR0aCAvIHRoaXMud2FsbENvbHM7XHJcblx0XHR0aGlzLndhbGxIID0gdGhpcy53b3JsZDJkLmhlaWdodCAvIHRoaXMud2FsbFJvd3M7XHJcblx0XHR0aGlzLmRldk1vZGUgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcoKSB7XHJcblx0XHRpZiAodGhpcy5kZXZNb2RlKSB7XHJcblx0XHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53YWxsUm93czsgaSsrKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxDb2xzOyBqKyspIHtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gJ3JnYigxMDAsIDEwMCwgMTAwKSc7XHJcblx0XHRcdFx0XHRjb25zdCB3YWxsID0gdGhpcy53YWxsc1tpICogdGhpcy53YWxsQ29scyArIGpdO1xyXG5cclxuXHRcdFx0XHRcdHN3aXRjaCAod2FsbCkge1xyXG5cdFx0XHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3R4MmQucmVjdChqICogdGhpcy53YWxsVywgaSAqIHRoaXMud2FsbEgsIHRoaXMud2FsbFcsIHRoaXMud2FsbEgpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuZmlsbCgpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnJlY3QoaiAqIHRoaXMud2FsbFcsIGkgKiB0aGlzLndhbGxILCB0aGlzLndhbGxXLCB0aGlzLndhbGxIKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmZpbGwoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IElQbGF5ZXJSYXlzIH0gZnJvbSAnLi90eXBlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxsczNkIHtcclxuXHRwcml2YXRlIHdvcmxkM2Q6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cdHByaXZhdGUgY3R4M2Q6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHRwcml2YXRlIHdhbGxXOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsSDogbnVtYmVyO1xyXG5cdHByaXZhdGUgd29ybGQzZERpYWc6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxUZXh0dXJlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cdHByaXZhdGUgd2FsbFRleHR1cmVEYXJrOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cdHByaXZhdGUgYmdUb3BJbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcblx0cHJpdmF0ZSBiZ1RvcFg6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxDZW50ZXJIZWlnaHQ6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQzZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDNkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHdhbGxXOiBudW1iZXIsIHdhbGxIOiBudW1iZXIpIHtcclxuXHRcdHRoaXMud29ybGQzZCA9IHdvcmxkM2Q7XHJcblx0XHR0aGlzLmN0eDNkID0gY3R4M2Q7XHJcblx0XHR0aGlzLndhbGxXID0gd2FsbFc7XHJcblx0XHR0aGlzLndhbGxIID0gd2FsbEg7XHJcblx0XHR0aGlzLndvcmxkM2REaWFnID0gTWF0aC5zcXJ0KE1hdGgucG93KHdvcmxkM2Qud2lkdGgsIDIpICsgTWF0aC5wb3cod29ybGQzZC5oZWlnaHQsIDIpKTtcclxuXHRcdHRoaXMud2FsbFRleHR1cmUgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMud2FsbFRleHR1cmUuc3JjID0gJy4uL3B1YmxpYy9ibHVlVGV4dHVyZS5wbmcnO1xyXG5cdFx0dGhpcy53YWxsVGV4dHVyZURhcmsgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMud2FsbFRleHR1cmVEYXJrLnNyYyA9ICcuLi9wdWJsaWMvYmx1ZVRleHR1cmUucG5nJztcclxuXHRcdHRoaXMuYmdUb3BJbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuYmdUb3BJbWcuc3JjID0gJy4uL3B1YmxpYy9zdGFycy5qcGcnO1xyXG5cdFx0dGhpcy5iZ1RvcFggPSAwO1xyXG5cdFx0dGhpcy53YWxsQ2VudGVySGVpZ2h0ID0gdGhpcy53b3JsZDNkLmhlaWdodCAvIDIuNTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZHJhd0JhY2tncm91bmQoKSB7XHJcblx0XHQvL211bHRpcGx5IGJnIGltZyB3aWR0aCBieSA0IHNvIHdoZW4geW91IHJvdGF0ZSA5MGRlZywgeW91J3JlIDEvNHRoIHRocm91Z2ggdGhlIGltZ1xyXG5cdFx0dGhpcy5iZ1RvcEltZy53aWR0aCA9IHRoaXMud29ybGQzZC53aWR0aCAqIDI7XHJcblx0XHR0aGlzLmJnVG9wSW1nLmhlaWdodCA9IHRoaXMud29ybGQzZC5oZWlnaHQ7XHJcblxyXG5cdFx0Ly9yZXNldCBiZyBpbWcgcG9zaXRpb24gaWYgZW5kcyBvZiBpbWcgYXJlIGluIHZpZXdcclxuXHRcdGlmICh0aGlzLmJnVG9wWCA+IDApIHtcclxuXHRcdFx0dGhpcy5iZ1RvcFggPSAtdGhpcy5iZ1RvcEltZy53aWR0aDtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5iZ1RvcFggPCAtdGhpcy5iZ1RvcEltZy53aWR0aCkge1xyXG5cdFx0XHR0aGlzLmJnVG9wWCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jdHgzZC5kcmF3SW1hZ2UoXHJcblx0XHRcdHRoaXMuYmdUb3BJbWcsXHJcblx0XHRcdHRoaXMuYmdUb3BYLFxyXG5cdFx0XHR0aGlzLndhbGxDZW50ZXJIZWlnaHQsXHJcblx0XHRcdHRoaXMuYmdUb3BJbWcud2lkdGgsXHJcblx0XHRcdC10aGlzLmJnVG9wSW1nLmhlaWdodFxyXG5cdFx0KTtcclxuXHRcdHRoaXMuY3R4M2QuZHJhd0ltYWdlKFxyXG5cdFx0XHR0aGlzLmJnVG9wSW1nLFxyXG5cdFx0XHR0aGlzLmJnVG9wWCArIHRoaXMuYmdUb3BJbWcud2lkdGgsXHJcblx0XHRcdHRoaXMud2FsbENlbnRlckhlaWdodCxcclxuXHRcdFx0dGhpcy5iZ1RvcEltZy53aWR0aCxcclxuXHRcdFx0LXRoaXMuYmdUb3BJbWcuaGVpZ2h0XHJcblx0XHQpO1xyXG5cdFx0dGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiYSgwLDAsMCwwLjcpYDtcclxuXHRcdHRoaXMuY3R4M2QuZmlsbFJlY3QoMCwgMCwgdGhpcy53b3JsZDNkLndpZHRoLCB0aGlzLndhbGxDZW50ZXJIZWlnaHQpO1xyXG5cclxuXHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYigxNSwgMzUsIDE1KWA7XHJcblx0XHR0aGlzLmN0eDNkLmZpbGxSZWN0KFxyXG5cdFx0XHQwLFxyXG5cdFx0XHR0aGlzLndhbGxDZW50ZXJIZWlnaHQsXHJcblx0XHRcdHRoaXMud29ybGQzZC53aWR0aCxcclxuXHRcdFx0dGhpcy53b3JsZDNkLmhlaWdodCAtIHRoaXMud2FsbENlbnRlckhlaWdodFxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRCZ1RvcFhNb3VzZU1vdmUobW92ZURlbHRhOiBudW1iZXIpIHtcclxuXHRcdHRoaXMuYmdUb3BYIC09ICgodGhpcy5iZ1RvcEltZy53aWR0aCAvIDE4MCkgKiBtb3ZlRGVsdGEpIC8gMjA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0YmdUb3BYKHJvdEFtdDogbnVtYmVyLCBtb3ZlRGlyTFI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdGNvbnN0IHhEZWx0YSA9ICh0aGlzLmJnVG9wSW1nLndpZHRoIC8gMTgwKSAqIHJvdEFtdDtcclxuXHRcdGlmIChtb3ZlRGlyTFIgPT09ICdsZWZ0Jykge1xyXG5cdFx0XHR0aGlzLmJnVG9wWCArPSB4RGVsdGE7XHJcblx0XHR9IGVsc2UgaWYgKG1vdmVEaXJMUiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHR0aGlzLmJnVG9wWCAtPSB4RGVsdGE7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZHJhdyhcclxuXHRcdHJheXM6IEZsb2F0MzJBcnJheSB8IG51bGwsXHJcblx0XHRyYXlDb29yZHM6IEZsb2F0MzJBcnJheSB8IG51bGwsXHJcblx0XHRvYmplY3RUeXBlczogVWludDhBcnJheSB8IG51bGwsXHJcblx0XHRvYmplY3REaXJzOiBVaW50OEFycmF5IHwgbnVsbCxcclxuXHRcdHBYOiBudW1iZXIsXHJcblx0XHRwWTogbnVtYmVyLFxyXG5cdFx0cmF5QW5nbGVzOiBGbG9hdDMyQXJyYXkgfCBudWxsLFxyXG5cdFx0cGxheWVyUmF5czogSVBsYXllclJheXNbXSxcclxuXHRcdHBsYXllclc6IG51bWJlclxyXG5cdCkge1xyXG5cdFx0aWYgKCFyYXlzIHx8ICFyYXlBbmdsZXMgfHwgIXJheUNvb3JkcykgcmV0dXJuO1xyXG5cdFx0dGhpcy5kcmF3QmFja2dyb3VuZCgpO1xyXG5cclxuXHRcdGNvbnN0IHdhbGxXaWR0aCA9IHRoaXMud29ybGQzZC53aWR0aCAvIHJheXMubGVuZ3RoO1xyXG5cdFx0Y29uc3Qgd2FsbFdpZHRoT3ZlcnNpemVkID0gd2FsbFdpZHRoICsgMTtcclxuXHRcdGxldCB3YWxsWCA9IDA7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByYXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGRpc3QgPSByYXlzW2ldICogTWF0aC5jb3MocmF5QW5nbGVzW2ldKTtcclxuXHRcdFx0bGV0IG9mZnNldCA9XHJcblx0XHRcdFx0b2JqZWN0RGlycz8uW2ldID09PSAwIHx8IG9iamVjdERpcnM/LltpXSA9PT0gMlxyXG5cdFx0XHRcdFx0PyByYXlDb29yZHNbaSAqIDJdICUgdGhpcy53YWxsV1xyXG5cdFx0XHRcdFx0OiByYXlDb29yZHNbaSAqIDIgKyAxXSAlIHRoaXMud2FsbEg7XHJcblxyXG5cdFx0XHRjb25zdCBvZmZzZXQyID1cclxuXHRcdFx0XHRpIDwgcmF5cy5sZW5ndGggLSAxXHJcblx0XHRcdFx0XHQ/IG9iamVjdERpcnM/LltpICsgMV0gPT09IDAgfHwgb2JqZWN0RGlycz8uW2kgKyAxXSA9PT0gMlxyXG5cdFx0XHRcdFx0XHQ/IHJheUNvb3Jkc1soaSArIDEpICogMl0gJSB0aGlzLndhbGxXXHJcblx0XHRcdFx0XHRcdDogcmF5Q29vcmRzWyhpICsgMSkgKiAyICsgMV0gJSB0aGlzLndhbGxIXHJcblx0XHRcdFx0XHQ6IG51bGw7XHJcblxyXG5cdFx0XHRjb25zdCB3YWxsU2hpZnRBbXQgPSAodGhpcy53b3JsZDNkLmhlaWdodCAqIDUwKSAvIGRpc3Q7XHJcblx0XHRcdGNvbnN0IHdhbGxTdGFydFRvcCA9IHRoaXMud2FsbENlbnRlckhlaWdodCAtIHdhbGxTaGlmdEFtdDtcclxuXHRcdFx0Y29uc3Qgd2FsbEVuZEJvdHRvbSA9IHRoaXMud2FsbENlbnRlckhlaWdodCArIHdhbGxTaGlmdEFtdDtcclxuXHJcblx0XHRcdC8vIGxldCB3YWxsRGFya25lc3MgPSBkaXN0IC8gdGhpcy53b3JsZDNkLmhlaWdodDtcclxuXHRcdFx0Ly8gd2FsbERhcmtuZXNzID0gKHRoaXMud29ybGQzZERpYWcgLSBkaXN0KSAvIHRoaXMud29ybGQzZERpYWc7XHJcblxyXG5cdFx0XHQvLyBzd2l0Y2ggKG9iamVjdERpcnM/LltpXSkge1xyXG5cdFx0XHQvLyBcdGNhc2UgMDpcclxuXHRcdFx0Ly8gXHRcdHdhbGxEYXJrbmVzcyAtPSAwLjI7XHJcblx0XHRcdC8vIFx0XHRicmVhaztcclxuXHRcdFx0Ly8gXHRjYXNlIDI6XHJcblx0XHRcdC8vIFx0XHR3YWxsRGFya25lc3MgLT0gMC4yO1xyXG5cdFx0XHQvLyBcdFx0YnJlYWs7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vIHN3aXRjaCAob2JqZWN0VHlwZXM/LltpXSkge1xyXG5cdFx0XHQvLyBcdGNhc2UgMTpcclxuXHRcdFx0Ly8gXHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoJHsyNTUgKiB3YWxsRGFya25lc3N9LCR7MjU1ICogd2FsbERhcmtuZXNzfSwkezI1NSAqIHdhbGxEYXJrbmVzc30sMSlgO1xyXG5cdFx0XHQvLyBcdFx0YnJlYWs7XHJcblx0XHRcdC8vIFx0Y2FzZSAyOlxyXG5cdFx0XHQvLyBcdFx0dGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiYSgkezAgKiB3YWxsRGFya25lc3N9LCR7MTAwICogd2FsbERhcmtuZXNzfSwkezEwMCAqIHdhbGxEYXJrbmVzc30sMSlgO1xyXG5cdFx0XHQvLyBcdFx0YnJlYWs7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vIHRoaXMuY3R4M2QuZmlsbFJlY3Qod2FsbFgsIHdhbGxTdGFydFRvcCwgd2FsbFdpZHRoT3ZlcnNpemVkLCB3YWxsRW5kQm90dG9tIC0gd2FsbFN0YXJ0VG9wKTtcclxuXHJcblx0XHRcdGxldCBzV2lkdGggPSAwO1xyXG5cclxuXHRcdFx0Ly8gVHJ5IHRvIGNyZWF0ZSBzV2lkdGggd2l0aG91dCBvZmZzZXQyXHJcblx0XHRcdGxhYmVsMTogaWYgKG9iamVjdERpcnM/LltpXSA9PT0gMiB8fCBvYmplY3REaXJzPy5baV0gPT09IDMpIHtcclxuXHRcdFx0XHRpZiAob2Zmc2V0MiA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0c1dpZHRoID0gODtcclxuXHRcdFx0XHRcdGJyZWFrIGxhYmVsMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c1dpZHRoID0gb2Zmc2V0IDw9IG9mZnNldDIgPyBvZmZzZXQyIC0gb2Zmc2V0IDogdGhpcy53YWxsVyAtIG9mZnNldCArIG9mZnNldDI7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2cob2Zmc2V0KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAob2Zmc2V0MiA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0c1dpZHRoID0gODtcclxuXHRcdFx0XHRcdG9mZnNldCA9IHRoaXMud2FsbFcgLSBvZmZzZXQ7XHJcblx0XHRcdFx0XHRicmVhayBsYWJlbDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHNXaWR0aCA9IG9mZnNldDIgPD0gb2Zmc2V0ID8gb2Zmc2V0IC0gb2Zmc2V0MiA6IHRoaXMud2FsbFcgLSBvZmZzZXQyICsgb2Zmc2V0O1xyXG5cdFx0XHRcdG9mZnNldCA9IHRoaXMud2FsbFcgLSBvZmZzZXQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChvYmplY3REaXJzPy5baV0gPT09IDAgfHwgb2JqZWN0RGlycz8uW2ldID09PSAyKSB7XHJcblx0XHRcdFx0dGhpcy5jdHgzZC5kcmF3SW1hZ2UoXHJcblx0XHRcdFx0XHR0aGlzLndhbGxUZXh0dXJlLFxyXG5cdFx0XHRcdFx0b2Zmc2V0LFxyXG5cdFx0XHRcdFx0MCxcclxuXHRcdFx0XHRcdHNXaWR0aCxcclxuXHRcdFx0XHRcdHRoaXMud2FsbFRleHR1cmUuaGVpZ2h0LFxyXG5cdFx0XHRcdFx0d2FsbFgsXHJcblx0XHRcdFx0XHR3YWxsU3RhcnRUb3AsXHJcblx0XHRcdFx0XHR3YWxsV2lkdGhPdmVyc2l6ZWQsXHJcblx0XHRcdFx0XHR3YWxsRW5kQm90dG9tIC0gd2FsbFN0YXJ0VG9wXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmN0eDNkLmRyYXdJbWFnZShcclxuXHRcdFx0XHRcdHRoaXMud2FsbFRleHR1cmVEYXJrLFxyXG5cdFx0XHRcdFx0b2Zmc2V0LFxyXG5cdFx0XHRcdFx0MCxcclxuXHRcdFx0XHRcdHNXaWR0aCxcclxuXHRcdFx0XHRcdHRoaXMud2FsbFRleHR1cmVEYXJrLmhlaWdodCxcclxuXHRcdFx0XHRcdHdhbGxYLFxyXG5cdFx0XHRcdFx0d2FsbFN0YXJ0VG9wLFxyXG5cdFx0XHRcdFx0d2FsbFdpZHRoT3ZlcnNpemVkLFxyXG5cdFx0XHRcdFx0d2FsbEVuZEJvdHRvbSAtIHdhbGxTdGFydFRvcFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHdhbGxYICs9IHdhbGxXaWR0aDtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllclJheXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcmF5TCA9IHBsYXllclJheXNbaV0ubDtcclxuXHRcdFx0Y29uc3QgdyA9ICh0aGlzLndvcmxkM2Qud2lkdGggKiBwbGF5ZXJXKSAvIHJheUw7XHJcblx0XHRcdC8vIGxldCB4ID0gcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuICogdGhpcy53b3JsZDNkLndpZHRoO1xyXG5cdFx0XHRsZXQgeDtcclxuXHJcblx0XHRcdGlmIChwbGF5ZXJSYXlzW2ldLnBlcmNBY3Jvc3NTY3JlZW4xID49IDAgJiYgcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuMSA8PSAxKSB7XHJcblx0XHRcdFx0eCA9IHBsYXllclJheXNbaV0ucGVyY0Fjcm9zc1NjcmVlbjEgKiB0aGlzLndvcmxkM2Qud2lkdGggKyB3IC8gMjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR4ID0gcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuMiAqIHRoaXMud29ybGQzZC53aWR0aCAtIHcgLyAyO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgcGxheWVyQ2VudGVySGVpZ2h0ID0gdGhpcy53b3JsZDNkLmhlaWdodCAvIDIuNTtcclxuXHRcdFx0Y29uc3Qgd2FsbFNoaWZ0QW10ID0gKHRoaXMud29ybGQzZC5oZWlnaHQgKiA1MCkgLyByYXlMO1xyXG5cdFx0XHRjb25zdCBwbGF5ZXJTaGlmdEFtdCA9ICh0aGlzLndvcmxkM2QuaGVpZ2h0ICogNDApIC8gcmF5TDtcclxuXHRcdFx0Y29uc3QgYWRqVG9Cb3RBbXQgPSB3YWxsU2hpZnRBbXQgLSBwbGF5ZXJTaGlmdEFtdDtcclxuXHRcdFx0Y29uc3QgcGxheWVyU3RhcnRUb3AgPSBwbGF5ZXJDZW50ZXJIZWlnaHQgLSBwbGF5ZXJTaGlmdEFtdCArIGFkalRvQm90QW10O1xyXG5cdFx0XHRjb25zdCBwbGF5ZXJFbmRCb3R0b20gPSBwbGF5ZXJDZW50ZXJIZWlnaHQgKyBwbGF5ZXJTaGlmdEFtdCArIGFkalRvQm90QW10O1xyXG5cclxuXHRcdFx0bGV0IHdhbGxEYXJrbmVzcyA9IHJheUwgLyB0aGlzLndvcmxkM2QuaGVpZ2h0O1xyXG5cdFx0XHR3YWxsRGFya25lc3MgPSAodGhpcy53b3JsZDNkRGlhZyAtIHJheUwpIC8gdGhpcy53b3JsZDNkRGlhZztcclxuXHJcblx0XHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoJHsyNTUgKiB3YWxsRGFya25lc3N9LCR7MTAwICogd2FsbERhcmtuZXNzfSwkezAgKiB3YWxsRGFya25lc3N9LDEpYDtcclxuXHJcblx0XHRcdHRoaXMuY3R4M2QuZmlsbFJlY3QoeCAtIHcgLyAyLCBwbGF5ZXJTdGFydFRvcCwgdywgcGxheWVyRW5kQm90dG9tIC0gcGxheWVyU3RhcnRUb3ApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wbGF5ZXIyZC50c1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wbGF5ZXJzLnRzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3R5cGVzLnRzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3dhbGxzMmQudHNcIik7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy93YWxsczNkLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9