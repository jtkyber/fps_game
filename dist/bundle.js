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
var frameRate = 60;
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
        walls3d.draw(player2d.rays, player2d.rayCoords, player2d.objectTypes, player2d.objectDirs, player2d.extraRay, player2d.rayAngles, player2d.playerRays, player2d.playerW);
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
        this.getIntersection = function (x, y, r, theta, x1, y1, x2, y2, p4) {
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
                x4 = x + r * Math.cos(theta);
                y4 = y + r * Math.sin(theta);
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
        this.extraRay = {
            ang: 0,
            l: 0,
            coords: [],
            objType: 0,
            objDir: 0,
        };
        this.rayIncrement = 2;
        this.rayOpacity = 0.26;
        this.fov = 60;
        this.fovRad = this.fov * (Math.PI / 180);
        this.rotation = 332;
        this.angle = this.rotation + 90;
        this.distToProjectionPlane = world2d.width / 2 / Math.tan(this.fovRad / 2);
        this.rayAngles = null;
        this.rayDensityAdjustment = 8;
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
        this.playerX = 650;
        this.playerY = 120;
        this.devMode = true;
        this.playerRays = [];
        this.playerW = 20;
        this.renderDist = 800;
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
        var hittingF = this.moveDirRays.foreward < 30;
        var hittingL = this.moveDirRays.left < 30;
        var hittingR = this.moveDirRays.right < 30;
        var hittingB = this.moveDirRays.backward < 30;
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
        this.extraRay.ang = Math.atan((x - this.world2d.width / 2) / this.distToProjectionPlane);
        this.rays = new Float32Array(this.rayAngles.length);
        this.rayCoords = new Float32Array(this.rayAngles.length * 2);
        this.objectTypes = new Uint8Array(this.rayAngles.length);
        this.objectDirs = new Uint8Array(this.rayAngles.length);
    };
    Player2d.prototype.getIntersectionsForRect = function (j, k, x, y, adjustedAngle, p4) {
        if (!this.rayAngles) {
            return {
                record: Infinity,
                closest: null,
                dir: 0,
            };
        }
        var r = 1;
        // Test to see if the ray will intersect with the block at all before checking all 4 sides
        // const xMid = k * this.wallW + this.wallW / 2;
        // const yMid = j * this.wallH + this.wallH / 2;
        // const deltaD = this.wallW * Math.sqrt(2);
        // const slope = (yMid - y) / (xMid - x);
        // const perpSlope = -(1 / slope);
        // const angle = Math.atan(perpSlope);
        // const xMid1 = xMid + deltaD * Math.cos(angle);
        // const yMid1 = yMid + deltaD * Math.sin(angle);
        // const xMid2 = xMid - deltaD * Math.cos(angle);
        // const yMid2 = yMid - deltaD * Math.sin(angle);
        // const intersection = this.getIntersection(x, y, r, adjustedAngle, xMid1, yMid1, xMid2, yMid2);
        // if (!intersection) {
        // 	return {
        // 		record: Infinity,
        // 		closest: null,
        // 		dir: 0,
        // 	};
        // }
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
        var wX1 = 0;
        var wY1 = 0;
        var wX2 = 0;
        var wY2 = 0;
        for (var n = 0; n < 4; n++) {
            switch (n) {
                case 0:
                    wX1 = x1;
                    wY1 = y1;
                    wX2 = x2;
                    wY2 = y2;
                    break;
                case 1:
                    wX1 = x2;
                    wY1 = y2;
                    wX2 = x3;
                    wY2 = y3;
                    break;
                case 2:
                    wX1 = x3;
                    wY1 = y3;
                    wX2 = x4;
                    wY2 = y4;
                    break;
                case 3:
                    wX1 = x4;
                    wY1 = y4;
                    wX2 = x1;
                    wY2 = y1;
                    break;
            }
            var intersection = this.getIntersection(x, y, r, adjustedAngle, wX1, wY1, wX2, wY2, p4);
            if (intersection === null || intersection === void 0 ? void 0 : intersection[0]) {
                var dx = Math.abs(x - intersection[0]);
                var dy = Math.abs(y - intersection[1]);
                var d = Math.sqrt(dx * dx + dy * dy);
                record = Math.min(d, record);
                if (d <= record) {
                    record = d;
                    closest = intersection;
                    dir = n;
                }
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
        for (var i = 0; i < this.rayAngles.length + 1; i++) {
            var adjustedAngle = void 0;
            if (i === this.rayAngles.length) {
                adjustedAngle = this.extraRay.ang + rotation * (Math.PI / 180);
            }
            else {
                adjustedAngle = this.rayAngles[i] + rotation * (Math.PI / 180);
            }
            var closest = null;
            var record = Infinity;
            for (var j = 0; j < this.wallRows; j++) {
                for (var k = 0; k < this.wallCols; k++) {
                    var wall = this.walls[j * this.wallCols + k];
                    if (wall === 0)
                        continue;
                    var rectIntersection = this.getIntersectionsForRect(j, k, x, y, adjustedAngle);
                    if (rectIntersection.record < record) {
                        record = rectIntersection.record;
                        closest = rectIntersection.closest;
                        objTypeTemp = wall;
                        objDirTemp = rectIntersection.dir;
                    }
                }
            }
            if (i === this.rayAngles.length) {
                // If on extra ray angle
                if (closest) {
                    if (this.devMode) {
                        this.ctx2d.beginPath();
                        this.ctx2d.moveTo(x, y);
                        this.ctx2d.lineTo(closest[0], closest[1]);
                        this.ctx2d.strokeStyle = "rgba(0,255,0,".concat(this.rayOpacity + 0.1, ")");
                        this.ctx2d.lineWidth = 1;
                        this.ctx2d.stroke();
                    }
                    this.extraRay.l = record;
                    if (this.rayCoords) {
                        this.extraRay.coords[0] = closest[0];
                        this.extraRay.coords[1] = closest[1];
                    }
                    if (this.objectTypes)
                        this.extraRay.objType = objTypeTemp;
                    if (this.objectDirs)
                        this.extraRay.objDir = objDirTemp;
                }
                else {
                    this.extraRay.l = Infinity;
                }
            }
            else {
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
        }
        loop1: for (var i = 0; i < players.length; i++) {
            var p = players[i];
            for (var j = 0; j < this.wallRows; j++) {
                for (var k = 0; k < this.wallCols; k++) {
                    var wall = this.walls[j * this.wallCols + k];
                    if (wall === 0)
                        continue;
                    var rectIntersection = this.getIntersectionsForRect(j, k, x, y, 0, { x: p.x, y: p.y });
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
        }
        var rotationF = ((Math.PI / 180) * ((this.rotation % 360) + 360)) % 360;
        var rotationR = ((Math.PI / 180) * (((this.rotation + 90) % 360) + 360)) % 360;
        var rotationB = ((Math.PI / 180) * (((this.rotation + 180) % 360) + 360)) % 360;
        var rotationL = ((Math.PI / 180) * (((this.rotation - 90) % 360) + 360)) % 360;
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
                var fIntersection = this.getIntersectionsForRect(i, j, x, y, rotationF);
                if (fIntersection.record < recordF) {
                    recordF = fIntersection.record;
                    closestF = fIntersection.closest;
                }
                var lIntersection = this.getIntersectionsForRect(i, j, x, y, rotationL);
                if (lIntersection.record < recordL) {
                    recordL = lIntersection.record;
                    closestL = lIntersection.closest;
                }
                var rIntersection = this.getIntersectionsForRect(i, j, x, y, rotationR);
                if (rIntersection.record < recordR) {
                    recordR = rIntersection.record;
                    closestR = rIntersection.closest;
                }
                var bIntersection = this.getIntersectionsForRect(i, j, x, y, rotationB);
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
        ].flat()
        // [
        // 	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        // 	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        // ].flat()
        );
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
        this.wallTexture.src = '../public/stoneTexture.png';
        this.wallTextureDark = new Image();
        this.wallTextureDark.src = '../public/stoneTextureDark.png';
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
        // this.ctx3d.fillStyle = `rgb(200, 200, 200)`;
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
    Walls3d.prototype.draw = function (rays, rayCoords, objectTypes, objectDirs, extraRay, rayAngles, playerRays, playerW) {
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
            var offset2 = void 0;
            if (i === rays.length - 1) {
                offset2 =
                    extraRay.objDir === 0 || extraRay.objDir === 2
                        ? extraRay.coords[0] % this.wallW
                        : extraRay.coords[1] % this.wallH;
            }
            else {
                offset2 =
                    (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i + 1]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i + 1]) === 2
                        ? rayCoords[(i + 1) * 2] % this.wallW
                        : rayCoords[(i + 1) * 2 + 1] % this.wallH;
            }
            if ((objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 1) {
                offset = this.wallW - offset;
                offset2 = this.wallW - offset2;
            }
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
            var curImg = null;
            var sWidth = 0;
            var chunk2Offset = null;
            sWidth = offset <= offset2 ? offset2 - offset : this.wallW - offset + offset2;
            if (offset > offset2) {
                chunk2Offset = -(this.wallW - offset);
            }
            if ((objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 2) {
                curImg = this.wallTexture;
            }
            else {
                curImg = this.wallTextureDark;
            }
            this.ctx3d.drawImage(curImg, offset, 0, sWidth, curImg.height, wallX, wallStartTop, wallWidthOversized, wallEndBottom - wallStartTop);
            if (chunk2Offset) {
                this.ctx3d.drawImage(curImg, chunk2Offset, 0, sWidth, curImg.height, wallX, wallStartTop, wallWidthOversized, wallEndBottom - wallStartTop);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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aEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxF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QUFDO1lBRTVELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGVBQVEsR0FBRyxHQUFHLFlBQVksY0FBSSxHQUFHLEdBQUcsWUFBWSxjQUFJLENBQUMsR0FBRyxZQUFZLFFBQUssQ0FBQztZQUVqRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxjQUFjLEVBQUUsQ0FBQyxFQUFFLGVBQWUsR0FBRyxjQUFjLENBQUMsQ0FBQztTQUNwRjtJQUNGLENBQUM7SUFDRixjQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7VUNyT0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvcGxheWVyMmQudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvcGxheWVycy50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy93YWxsczJkLnRzIiwid2VicGFjazovL2Zwc19nYW1lLy4vc3JjL3dhbGxzM2QudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBsYXllcjJkIGZyb20gJy4vcGxheWVyMmQnO1xyXG5pbXBvcnQgUGxheWVycyBmcm9tICcuL3BsYXllcnMnO1xyXG5pbXBvcnQgeyBJU29ja2V0RGF0YVJlcSwgSVNvY2tldERhdGFSZXMgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IFdhbGxzMmQgZnJvbSAnLi93YWxsczJkJztcclxuaW1wb3J0IFdhbGxzM2QgZnJvbSAnLi93YWxsczNkJztcclxuXHJcbi8vIFVzZSB3c3MgKHNlY3VyZSkgaW5zdGVhZCBvZiB3cyBmb3IgcHJvZHVjaXRvblxyXG5jb25zdCBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KCd3czovL2xvY2FsaG9zdDozMDAwL3NlcnZlcicpO1xyXG5cclxuY29uc3Qgd29ybGQyZCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd29ybGQyZCcpO1xyXG5jb25zdCB3b3JsZDNkID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3b3JsZDNkJyk7XHJcblxyXG5jb25zdCBjdHgyZCA9IDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+d29ybGQyZC5nZXRDb250ZXh0KCcyZCcsIHsgYWxwaGE6IGZhbHNlIH0pO1xyXG5jb25zdCBjdHgzZCA9IDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+d29ybGQzZC5nZXRDb250ZXh0KCcyZCcsIHsgYWxwaGE6IGZhbHNlIH0pO1xyXG5cclxuY29uc3QgZnBzRWxlbWVudCA9IDxIVE1MSGVhZGluZ0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zwc0NvdW50ZXInKTtcclxuXHJcbmxldCB3YWxsczJkOiBXYWxsczJkO1xyXG5sZXQgd2FsbHMzZDogV2FsbHMzZDtcclxubGV0IHBsYXllcjJkOiBQbGF5ZXIyZDtcclxubGV0IHBsYXllcnM6IFBsYXllcnM7XHJcblxyXG5sZXQgZnBzSW50ZXJ2YWw6IG51bWJlciwgbm93OiBudW1iZXIsIHRoZW46IG51bWJlciwgZWxhcHNlZDogbnVtYmVyLCByZXF1ZXN0SUQ6IG51bWJlcjtcclxubGV0IGZyYW1lQ291bnQ6IG51bWJlciA9IDA7XHJcbmNvbnN0IGZyYW1lUmF0ZSA9IDYwO1xyXG5cclxubGV0IGRldk1vZGUgPSB0cnVlO1xyXG5cclxubGV0IHVzZXJJZDogYW55O1xyXG5sZXQgbGFzdFJlY29yZGVkUGxheWVyUG9zID0ge1xyXG5cdHg6IDAsXHJcblx0eTogMCxcclxufTtcclxuXHJcbmNvbnN0IHNldEZyYW1lcmF0ZVZhbHVlID0gKCkgPT4ge1xyXG5cdGZwc0VsZW1lbnQuaW5uZXJUZXh0ID0gZnJhbWVDb3VudC50b1N0cmluZygpO1xyXG5cdGZwc0VsZW1lbnQuc3R5bGUuY29sb3IgPSBmcmFtZUNvdW50IDwgZnJhbWVSYXRlID8gJ3JlZCcgOiAncmdiKDAsIDI1NSwgMCknO1xyXG5cdGZyYW1lQ291bnQgPSAwO1xyXG59O1xyXG5cclxuLy8gbGV0IGFyclRlc3Q6IG51bWJlcltdID0gW107XHJcbi8vIGNvbnN0IGFyclRlc3QyID0gbmV3IEZsb2F0MzJBcnJheSg1MDAwKTtcclxuXHJcbi8vIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyVGVzdDIubGVuZ3RoOyBpKyspIHtcclxuLy8gXHRhcnJUZXN0LnB1c2goaSk7XHJcbi8vIFx0YXJyVGVzdDJbaV0gPSBpO1xyXG4vLyB9XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9ICgpID0+IHtcclxuXHRyZXF1ZXN0SUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xyXG5cclxuXHRmcHNJbnRlcnZhbCA9IDEwMDAgLyBmcmFtZVJhdGU7XHJcblxyXG5cdG5vdyA9IERhdGUubm93KCk7XHJcblx0ZWxhcHNlZCA9IG5vdyAtIHRoZW47XHJcblxyXG5cdGlmIChlbGFwc2VkID4gZnBzSW50ZXJ2YWwpIHtcclxuXHRcdGlmIChmcmFtZUNvdW50ID09PSAwKSBzZXRUaW1lb3V0KHNldEZyYW1lcmF0ZVZhbHVlLCAxMDAwKTtcclxuXHRcdGZyYW1lQ291bnQgKz0gMTtcclxuXHRcdHRoZW4gPSBub3cgLSAoZWxhcHNlZCAlIGZwc0ludGVydmFsKTtcclxuXHJcblx0XHRjdHgyZC5jbGVhclJlY3QoMCwgMCwgd29ybGQyZC53aWR0aCwgd29ybGQyZC5oZWlnaHQpO1xyXG5cdFx0Y3R4M2QuY2xlYXJSZWN0KDAsIDAsIHdvcmxkM2Qud2lkdGgsIHdvcmxkM2QuaGVpZ2h0KTtcclxuXHJcblx0XHQvLyBmb3IgKGxldCBpID0gMDsgaSA8IGFyclRlc3QyLmxlbmd0aDsgaSsrKSB7XHJcblx0XHQvLyBcdC8vIGFyclRlc3RbaV0gPSBNYXRoLnJhbmRvbSgpO1xyXG5cdFx0Ly8gXHRhcnJUZXN0MltpXSA9IE1hdGgucmFuZG9tKCk7XHJcblxyXG5cdFx0Ly8gXHRjdHgyZC5jbGVhclJlY3QoMCwgMCwgd29ybGQyZC53aWR0aCwgd29ybGQyZC5oZWlnaHQpO1xyXG5cdFx0Ly8gXHRjdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdC8vIFx0Y3R4MmQuZm9udCA9ICc0OHB4IGFyaWFsJztcclxuXHRcdC8vIFx0Y3R4MmQuZmlsbFN0eWxlID0gJ2dyZWVuJztcclxuXHRcdC8vIFx0Y3R4MmQuZmlsbFRleHQoYXJyVGVzdDJbaV0udG9TdHJpbmcoKSwgMTAwLCAxMDApO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdHdhbGxzMmQuZHJhdygpO1xyXG5cdFx0cGxheWVycy5kcmF3KCk7XHJcblx0XHRwbGF5ZXIyZC5kcmF3KHBsYXllcnMucGxheWVycyk7XHJcblx0XHR3YWxsczNkLnNldGJnVG9wWChwbGF5ZXIyZC5yb3RBbXQsIHBsYXllcjJkLnJvdERpcik7XHJcblx0XHR3YWxsczNkLmRyYXcoXHJcblx0XHRcdHBsYXllcjJkLnJheXMsXHJcblx0XHRcdHBsYXllcjJkLnJheUNvb3JkcyxcclxuXHRcdFx0cGxheWVyMmQub2JqZWN0VHlwZXMsXHJcblx0XHRcdHBsYXllcjJkLm9iamVjdERpcnMsXHJcblx0XHRcdHBsYXllcjJkLmV4dHJhUmF5LFxyXG5cdFx0XHRwbGF5ZXIyZC5yYXlBbmdsZXMsXHJcblx0XHRcdHBsYXllcjJkLnBsYXllclJheXMsXHJcblx0XHRcdHBsYXllcjJkLnBsYXllcldcclxuXHRcdCk7XHJcblxyXG5cdFx0b25lOiBpZiAocGxheWVyMmQucGxheWVyWCAhPT0gbGFzdFJlY29yZGVkUGxheWVyUG9zLnggfHwgcGxheWVyMmQucGxheWVyWSAhPT0gbGFzdFJlY29yZGVkUGxheWVyUG9zLnkpIHtcclxuXHRcdFx0bGFzdFJlY29yZGVkUGxheWVyUG9zLnggPSBwbGF5ZXIyZC5wbGF5ZXJYO1xyXG5cdFx0XHRsYXN0UmVjb3JkZWRQbGF5ZXJQb3MueSA9IHBsYXllcjJkLnBsYXllclk7XHJcblxyXG5cdFx0XHRpZiAoIXVzZXJJZCkgYnJlYWsgb25lO1xyXG5cclxuXHRcdFx0Y29uc3QgZGF0YTogSVNvY2tldERhdGFSZXEgPSB7XHJcblx0XHRcdFx0YWN0aW9uOiAndXBkYXRlLXBsYXllci1wb3MnLFxyXG5cdFx0XHRcdGlkOiB1c2VySWQsXHJcblx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0eDogbGFzdFJlY29yZGVkUGxheWVyUG9zLngsXHJcblx0XHRcdFx0XHR5OiBsYXN0UmVjb3JkZWRQbGF5ZXJQb3MueSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoMCwyNTUsMCwxKWA7XHJcblx0XHRjdHgzZC5saW5lV2lkdGggPSAyO1xyXG5cdFx0Y3R4M2QuYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgzZC5lbGxpcHNlKHdvcmxkM2Qud2lkdGggLyAyLCB3b3JsZDNkLmhlaWdodCAvIDIuNSwgNSwgNSwgMCwgMCwgMiAqIE1hdGguUEkpO1xyXG5cdFx0Y3R4M2QuZmlsbCgpO1xyXG5cdH1cclxufTtcclxuXHJcbmNvbnN0IHNldFVwID0gKCkgPT4ge1xyXG5cdHdhbGxzMmQgPSBuZXcgV2FsbHMyZCh3b3JsZDJkLCBjdHgyZCk7XHJcblx0d2FsbHMzZCA9IG5ldyBXYWxsczNkKHdvcmxkM2QsIGN0eDNkLCB3YWxsczJkLndhbGxXLCB3YWxsczJkLndhbGxIKTtcclxuXHRwbGF5ZXIyZCA9IG5ldyBQbGF5ZXIyZChcclxuXHRcdHdvcmxkMmQsXHJcblx0XHRjdHgyZCxcclxuXHRcdHdhbGxzMmQud2FsbHMsXHJcblx0XHR3YWxsczJkLndhbGxDb2xzLFxyXG5cdFx0d2FsbHMyZC53YWxsUm93cyxcclxuXHRcdHdhbGxzMmQud2FsbFcsXHJcblx0XHR3YWxsczJkLndhbGxILFxyXG5cdFx0ZnJhbWVSYXRlXHJcblx0KTtcclxuXHRwbGF5ZXIyZC5zZXRVcCgpO1xyXG5cdHBsYXllcnMgPSBuZXcgUGxheWVycyh3b3JsZDJkLCBjdHgyZCk7XHJcblx0Z2FtZUxvb3AoKTtcclxufTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcblx0dGhlbiA9IERhdGUubm93KCk7XHJcblx0c2V0VXAoKTtcclxufTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xyXG5cdGlmICghZGV2TW9kZSkge1xyXG5cdFx0cGxheWVyMmQuc2V0TW91c2VSb3RhdGlvbihlLm1vdmVtZW50WCAvIDIwKTtcclxuXHRcdHdhbGxzM2Quc2V0QmdUb3BYTW91c2VNb3ZlKGUubW92ZW1lbnRYKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG5cdC8vU2V0IG1vdmUgZm9yZXdhcmRzIGFuZCBiYWNrd2FyZHNcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5VycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIoJ2ZvcndhcmRzJyk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlTJykge1xyXG5cdFx0cGxheWVyMmQuc2V0TW92ZURpcignYmFja3dhcmRzJyk7XHJcblx0fVxyXG5cclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbignbGVmdCcpO1xyXG5cdFx0ZWxzZSBwbGF5ZXIyZC5zZXRTdHJhZmVEaXIoJ2xlZnQnKTtcclxuXHR9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleUQnKSB7XHJcblx0XHRpZiAoZGV2TW9kZSkgcGxheWVyMmQuc2V0Um90YXRpb24oJ3JpZ2h0Jyk7XHJcblx0XHRlbHNlIHBsYXllcjJkLnNldFN0cmFmZURpcigncmlnaHQnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuXHQvL1NldCBtb3ZlbWVudCB2YXJpYWJsZXMgdG8gbnVsbCB3aGVuIGtleSByZWxlYXNlZHtcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScgfHwgZS5jb2RlID09PSAnS2V5RCcpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbihudWxsKTtcclxuXHRcdGVsc2UgcGxheWVyMmQuc2V0U3RyYWZlRGlyKG51bGwpO1xyXG5cdH0gZWxzZSBpZiAoZS5jb2RlID09PSAnS2V5VycgfHwgZS5jb2RlID09PSAnS2V5UycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIobnVsbCk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlNJykge1xyXG5cdFx0ZGV2TW9kZSA9ICFkZXZNb2RlO1xyXG5cdFx0aWYgKCFkZXZNb2RlKSB7XHJcblx0XHRcdHdvcmxkMmQuY2xhc3NMaXN0LmFkZCgnZnVsbHNjcmVlbicpO1xyXG5cdFx0XHR3b3JsZDNkLmNsYXNzTGlzdC5hZGQoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0cGxheWVyMmQuZGV2TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHR3YWxsczJkLmRldk1vZGUgPSBmYWxzZTtcclxuXHRcdFx0d29ybGQzZC5yZXF1ZXN0UG9pbnRlckxvY2sgPVxyXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0XHRcdHdvcmxkM2QucmVxdWVzdFBvaW50ZXJMb2NrIHx8IHdvcmxkM2QubW96UmVxdWVzdFBvaW50ZXJMb2NrIHx8IHdvcmxkM2Qud2Via2l0UmVxdWVzdFBvaW50ZXJMb2NrO1xyXG5cdFx0XHQvL0B0cy1pZ25vcmVcclxuXHRcdFx0d29ybGQzZC5yZXF1ZXN0UG9pbnRlckxvY2soe1xyXG5cdFx0XHRcdHVuYWRqdXN0ZWRNb3ZlbWVudDogdHJ1ZSxcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR3b3JsZDJkLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0d29ybGQzZC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdHBsYXllcjJkLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0XHR3YWxsczJkLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2sgPVxyXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0XHRcdGRvY3VtZW50LmV4aXRQb2ludGVyTG9jayB8fCBkb2N1bWVudC5tb3pFeGl0UG9pbnRlckxvY2sgfHwgZG9jdW1lbnQud2Via2l0RXhpdFBvaW50ZXJMb2NrO1xyXG5cdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCAoKSA9PiB7XHJcblx0Y29uc29sZS5sb2coJ1VzZXIgY29ubmVjdGVkJyk7XHJcbn0pO1xyXG5cclxuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBldmVudCA9PiB7XHJcblx0Y29uc3QgcmVzOiBJU29ja2V0RGF0YVJlcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcblx0bGV0IGRhdGE6IElTb2NrZXREYXRhUmVxO1xyXG5cclxuXHRzd2l0Y2ggKHJlcz8uYWN0aW9uKSB7XHJcblx0XHRjYXNlICdzZXQtdXNlci1pZCc6XHJcblx0XHRcdGNvbnNvbGUubG9nKCdVc2VySWQgaGFzIGJlZW4gc2V0Jyk7XHJcblx0XHRcdHVzZXJJZCA9IHJlcy5kYXRhO1xyXG5cclxuXHRcdFx0aWYgKCF1c2VySWQpIHJldHVybjtcclxuXHRcdFx0ZGF0YSA9IHtcclxuXHRcdFx0XHRhY3Rpb246ICdzZW5kLXVzZXItdG8tY2xpZW50cycsXHJcblx0XHRcdFx0aWQ6IHVzZXJJZCxcclxuXHRcdFx0XHRkYXRhOiAnJyxcclxuXHRcdFx0fTtcclxuXHRcdFx0c29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3NlbmQtdXNlci10by1jbGllbnRzJzpcclxuXHRcdFx0cGxheWVycy5hZGRQbGF5ZXIocmVzLmRhdGEpO1xyXG5cclxuXHRcdFx0Ly8gaWYgKCF1c2VySWQpIHJldHVybjtcclxuXHRcdFx0Ly8gZGF0YSA9IHtcclxuXHRcdFx0Ly8gXHRhY3Rpb246ICdzZW5kLXVzZXItdG8tY2xpZW50cycsXHJcblx0XHRcdC8vIFx0aWQ6IHVzZXJJZCxcclxuXHRcdFx0Ly8gXHRkYXRhOiAnJyxcclxuXHRcdFx0Ly8gfTtcclxuXHRcdFx0Ly8gc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3VwZGF0ZS1wbGF5ZXItcG9zJzpcclxuXHRcdFx0cGxheWVycy51cGRhdGVQbGF5ZXJQb3MoeyBuYW1lOiByZXMuZGF0YS5wbGF5ZXJJZCwgeDogcmVzLmRhdGEueCwgeTogcmVzLmRhdGEueSB9KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICdyZW1vdmUtcGxheWVyJzpcclxuXHRcdFx0cGxheWVycy5yZW1vdmVQbGF5ZXIocmVzLmRhdGEpO1xyXG5cdFx0XHRicmVhaztcclxuXHR9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBJUGxheWVyLCBJUGxheWVyUmF5cyB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHByaXZhdGUgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHJpdmF0ZSB3YWxsQ29sczogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxXOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsSDogbnVtYmVyO1xyXG5cdHByaXZhdGUgZnJhbWVSYXRlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBzcGVlZE11bHRpcGxpZXI6IG51bWJlcjtcclxuXHRwdWJsaWMgcmF5czogRmxvYXQzMkFycmF5IHwgbnVsbDtcclxuXHRwdWJsaWMgcmF5Q29vcmRzOiBGbG9hdDMyQXJyYXkgfCBudWxsO1xyXG5cdHB1YmxpYyBvYmplY3RUeXBlczogVWludDhBcnJheSB8IG51bGw7XHJcblx0cHVibGljIG9iamVjdERpcnM6IFVpbnQ4QXJyYXkgfCBudWxsO1xyXG5cdHB1YmxpYyBleHRyYVJheToge1xyXG5cdFx0YW5nOiBudW1iZXI7XHJcblx0XHRsOiBudW1iZXI7XHJcblx0XHRjb29yZHM6IG51bWJlcltdO1xyXG5cdFx0b2JqVHlwZTogbnVtYmVyO1xyXG5cdFx0b2JqRGlyOiBudW1iZXI7XHJcblx0fTtcclxuXHRwcml2YXRlIHJheUluY3JlbWVudDogbnVtYmVyO1xyXG5cdHByaXZhdGUgcmF5T3BhY2l0eTogbnVtYmVyO1xyXG5cdHByaXZhdGUgZm92OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBmb3ZSYWQ6IG51bWJlcjtcclxuXHRwdWJsaWMgcm90YXRpb246IG51bWJlcjtcclxuXHRwcml2YXRlIGFuZ2xlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBkaXN0VG9Qcm9qZWN0aW9uUGxhbmU6IG51bWJlcjtcclxuXHRwdWJsaWMgcmF5QW5nbGVzOiBGbG9hdDMyQXJyYXkgfCBudWxsO1xyXG5cdHByaXZhdGUgcmF5RGVuc2l0eUFkanVzdG1lbnQ6IG51bWJlcjtcclxuXHRwdWJsaWMgcm90RGlyOiBzdHJpbmcgfCBudWxsO1xyXG5cdHB1YmxpYyByb3RBbXQ6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVEaXJGQjogc3RyaW5nIHwgbnVsbDtcclxuXHRwcml2YXRlIG1vdmVBbXRTdGFydDogbnVtYmVyO1xyXG5cdHByaXZhdGUgbW92ZUFtdDogbnVtYmVyO1xyXG5cdHByaXZhdGUgbW92ZUFtdFRvcDogbnVtYmVyO1xyXG5cdHByaXZhdGUgbW92ZURpclN0cmFmZTogc3RyaW5nIHwgbnVsbDtcclxuXHRwcml2YXRlIG1vdmVEaXJSYXlzOiB7XHJcblx0XHRmb3Jld2FyZDogbnVtYmVyO1xyXG5cdFx0bGVmdDogbnVtYmVyO1xyXG5cdFx0cmlnaHQ6IG51bWJlcjtcclxuXHRcdGJhY2t3YXJkOiBudW1iZXI7XHJcblx0fTtcclxuXHRwdWJsaWMgcGxheWVyWDogbnVtYmVyO1xyXG5cdHB1YmxpYyBwbGF5ZXJZOiBudW1iZXI7XHJcblx0cHVibGljIGRldk1vZGU6IGJvb2xlYW47XHJcblx0cHVibGljIHBsYXllclJheXM6IElQbGF5ZXJSYXlzW107XHJcblx0cHVibGljIHBsYXllclc6IG51bWJlcjtcclxuXHRwcml2YXRlIHJlbmRlckRpc3Q6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3IoXHJcblx0XHR3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudCxcclxuXHRcdGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcblx0XHR3YWxsczogVWludDhBcnJheSxcclxuXHRcdHdhbGxDb2xzOiBudW1iZXIsXHJcblx0XHR3YWxsUm93czogbnVtYmVyLFxyXG5cdFx0d2FsbFc6IG51bWJlcixcclxuXHRcdHdhbGxIOiBudW1iZXIsXHJcblx0XHRmcmFtZVJhdGU6IG51bWJlclxyXG5cdCkge1xyXG5cdFx0dGhpcy53b3JsZDJkID0gd29ybGQyZDtcclxuXHRcdHRoaXMuY3R4MmQgPSBjdHgyZDtcclxuXHRcdHRoaXMud2FsbHMgPSB3YWxscztcclxuXHRcdHRoaXMud2FsbENvbHMgPSB3YWxsQ29scztcclxuXHRcdHRoaXMud2FsbFJvd3MgPSB3YWxsUm93cztcclxuXHRcdHRoaXMud2FsbFcgPSB3YWxsVztcclxuXHRcdHRoaXMud2FsbEggPSB3YWxsSDtcclxuXHRcdHRoaXMuZnJhbWVSYXRlID0gZnJhbWVSYXRlO1xyXG5cdFx0dGhpcy5zcGVlZE11bHRpcGxpZXIgPSBmcmFtZVJhdGUgLyA2MDtcclxuXHRcdHRoaXMucmF5cyA9IG51bGw7XHJcblx0XHR0aGlzLnJheUNvb3JkcyA9IG51bGw7XHJcblx0XHR0aGlzLm9iamVjdFR5cGVzID0gbnVsbDtcclxuXHRcdHRoaXMub2JqZWN0RGlycyA9IG51bGw7XHJcblx0XHR0aGlzLmV4dHJhUmF5ID0ge1xyXG5cdFx0XHRhbmc6IDAsXHJcblx0XHRcdGw6IDAsXHJcblx0XHRcdGNvb3JkczogW10sXHJcblx0XHRcdG9ialR5cGU6IDAsXHJcblx0XHRcdG9iakRpcjogMCxcclxuXHRcdH07XHJcblx0XHR0aGlzLnJheUluY3JlbWVudCA9IDI7XHJcblx0XHR0aGlzLnJheU9wYWNpdHkgPSAwLjI2O1xyXG5cdFx0dGhpcy5mb3YgPSA2MDtcclxuXHRcdHRoaXMuZm92UmFkID0gdGhpcy5mb3YgKiAoTWF0aC5QSSAvIDE4MCk7XHJcblx0XHR0aGlzLnJvdGF0aW9uID0gMzMyO1xyXG5cdFx0dGhpcy5hbmdsZSA9IHRoaXMucm90YXRpb24gKyA5MDtcclxuXHRcdHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lID0gd29ybGQyZC53aWR0aCAvIDIgLyBNYXRoLnRhbih0aGlzLmZvdlJhZCAvIDIpO1xyXG5cdFx0dGhpcy5yYXlBbmdsZXMgPSBudWxsO1xyXG5cdFx0dGhpcy5yYXlEZW5zaXR5QWRqdXN0bWVudCA9IDg7XHJcblx0XHR0aGlzLnJvdERpciA9IG51bGw7XHJcblx0XHR0aGlzLnJvdEFtdCA9IDIgLyB0aGlzLnNwZWVkTXVsdGlwbGllcjtcclxuXHRcdHRoaXMubW92ZURpckZCID0gbnVsbDtcclxuXHRcdHRoaXMubW92ZUFtdFN0YXJ0ID0gMyAvIHRoaXMuc3BlZWRNdWx0aXBsaWVyO1xyXG5cdFx0dGhpcy5tb3ZlQW10ID0gMyAvIHRoaXMuc3BlZWRNdWx0aXBsaWVyO1xyXG5cdFx0dGhpcy5tb3ZlQW10VG9wID0gMyAvIHRoaXMuc3BlZWRNdWx0aXBsaWVyO1xyXG5cdFx0dGhpcy5tb3ZlRGlyU3RyYWZlID0gbnVsbDtcclxuXHRcdHRoaXMubW92ZURpclJheXMgPSB7XHJcblx0XHRcdGZvcmV3YXJkOiBJbmZpbml0eSxcclxuXHRcdFx0bGVmdDogSW5maW5pdHksXHJcblx0XHRcdHJpZ2h0OiBJbmZpbml0eSxcclxuXHRcdFx0YmFja3dhcmQ6IEluZmluaXR5LFxyXG5cdFx0fTtcclxuXHRcdHRoaXMucGxheWVyWCA9IDY1MDtcclxuXHRcdHRoaXMucGxheWVyWSA9IDEyMDtcclxuXHRcdHRoaXMuZGV2TW9kZSA9IHRydWU7XHJcblx0XHR0aGlzLnBsYXllclJheXMgPSBbXTtcclxuXHRcdHRoaXMucGxheWVyVyA9IDIwO1xyXG5cdFx0dGhpcy5yZW5kZXJEaXN0ID0gODAwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFVwKCkge1xyXG5cdFx0dGhpcy5zZXRBbmdsZXMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRSb3RhdGlvbihkaXI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdC8vIGlmICh0aGlzLnJvdERpciA9PT0gbnVsbCkge1xyXG5cdFx0Ly8gXHR0aGlzLnJvdEFtdCA9IDI7XHJcblx0XHQvLyB9XHJcblx0XHR0aGlzLnJvdERpciA9IGRpcjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRNb3VzZVJvdGF0aW9uKGFtdDogbnVtYmVyKSB7XHJcblx0XHR0aGlzLnJvdGF0aW9uICs9IGFtdDtcclxuXHRcdHRoaXMuYW5nbGUgKz0gYW10O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFN0cmFmZURpcihkaXI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdGlmICh0aGlzLm1vdmVEaXJTdHJhZmUgPT09IG51bGwpIHtcclxuXHRcdFx0dGhpcy5tb3ZlQW10ID0gdGhpcy5tb3ZlQW10U3RhcnQ7XHJcblx0XHR9XHJcblx0XHR0aGlzLm1vdmVEaXJTdHJhZmUgPSBkaXI7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHJvdGF0ZSgpIHtcclxuXHRcdC8vIGlmICh0aGlzLnJvdEFtdCA8IHRoaXMucm90QW10KSB7XHJcblx0XHQvLyBcdHRoaXMucm90QW10ICs9IDAuMTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHRpZiAodGhpcy5yb3REaXIgPT09ICdsZWZ0Jykge1xyXG5cdFx0XHR0aGlzLnJvdGF0aW9uIC09IHRoaXMucm90QW10O1xyXG5cdFx0XHR0aGlzLmFuZ2xlIC09IHRoaXMucm90QW10O1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnJvdERpciA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHR0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90QW10O1xyXG5cdFx0XHR0aGlzLmFuZ2xlICs9IHRoaXMucm90QW10O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldE1vdmVEaXIoZGlyOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHRpZiAodGhpcy5tb3ZlRGlyRkIgPT09IG51bGwpIHtcclxuXHRcdFx0dGhpcy5tb3ZlQW10ID0gdGhpcy5tb3ZlQW10U3RhcnQ7XHJcblx0XHR9XHJcblx0XHR0aGlzLm1vdmVEaXJGQiA9IGRpcjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgbW92ZSgpIHtcclxuXHRcdGlmICghdGhpcz8ucmF5cz8ubGVuZ3RoKSByZXR1cm47XHJcblx0XHR0aGlzLnJvdGF0ZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLm1vdmVBbXQgPCB0aGlzLm1vdmVBbXRUb3ApIHRoaXMubW92ZUFtdCArPSAwLjA1O1xyXG5cclxuXHRcdGNvbnN0IGRpclJhZGlhbnMgPSB0aGlzLmFuZ2xlICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0Y29uc3QgbW92ZVggPSB0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyg5MCAqIChNYXRoLlBJIC8gMTgwKSAtIGRpclJhZGlhbnMpO1xyXG5cdFx0Y29uc3QgbW92ZVkgPSB0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyhkaXJSYWRpYW5zKTtcclxuXHRcdGNvbnN0IGRpclJhZGlhbnNTdHJhZmUgPSBkaXJSYWRpYW5zICsgTWF0aC5QSSAvIDI7XHJcblx0XHRjb25zdCBzdHJhZmVYID0gKHRoaXMubW92ZUFtdCAqIE1hdGguY29zKDkwICogKE1hdGguUEkgLyAxODApIC0gZGlyUmFkaWFuc1N0cmFmZSkpIC8gMjtcclxuXHRcdGNvbnN0IHN0cmFmZVkgPSAodGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoZGlyUmFkaWFuc1N0cmFmZSkpIC8gMjtcclxuXHRcdGNvbnN0IGhpdHRpbmdGID0gdGhpcy5tb3ZlRGlyUmF5cy5mb3Jld2FyZCA8IDMwO1xyXG5cdFx0Y29uc3QgaGl0dGluZ0wgPSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPCAzMDtcclxuXHRcdGNvbnN0IGhpdHRpbmdSID0gdGhpcy5tb3ZlRGlyUmF5cy5yaWdodCA8IDMwO1xyXG5cdFx0Y29uc3QgaGl0dGluZ0IgPSB0aGlzLm1vdmVEaXJSYXlzLmJhY2t3YXJkIDwgMzA7XHJcblxyXG5cdFx0aWYgKHRoaXMubW92ZURpckZCID09PSAnZm9yd2FyZHMnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0YpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gbW92ZVg7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IG1vdmVZO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMubW92ZURpckZCID09PSAnYmFja3dhcmRzJykge1xyXG5cdFx0XHRpZiAoIWhpdHRpbmdCKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJYIC09IG1vdmVYO1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWSArPSBtb3ZlWTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubW92ZURpclN0cmFmZSA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0wpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggLT0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdMKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZICs9IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5tb3ZlRGlyU3RyYWZlID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ1IpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdSKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc2V0QW5nbGVzKCkge1xyXG5cdFx0Y29uc3QgYW5nbGVBcnJMZW5ndGggPSBNYXRoLmNlaWwoXHJcblx0XHRcdCh0aGlzLndvcmxkMmQud2lkdGggKyB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50KSAvIHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnRcclxuXHRcdCk7XHJcblx0XHR0aGlzLnJheUFuZ2xlcyA9IG5ldyBGbG9hdDMyQXJyYXkoYW5nbGVBcnJMZW5ndGgpO1xyXG5cdFx0dGhpcy5kaXN0VG9Qcm9qZWN0aW9uUGxhbmUgPSB0aGlzLndvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHJcblx0XHRsZXQgeCA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFuZ2xlQXJyTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy5yYXlBbmdsZXNbaV0gPSBNYXRoLmF0YW4oKHggLSB0aGlzLndvcmxkMmQud2lkdGggLyAyKSAvIHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lKTtcclxuXHRcdFx0eCArPSB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZXh0cmFSYXkuYW5nID0gTWF0aC5hdGFuKCh4IC0gdGhpcy53b3JsZDJkLndpZHRoIC8gMikgLyB0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSk7XHJcblxyXG5cdFx0dGhpcy5yYXlzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGgpO1xyXG5cdFx0dGhpcy5yYXlDb29yZHMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCAqIDIpO1xyXG5cdFx0dGhpcy5vYmplY3RUeXBlcyA9IG5ldyBVaW50OEFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCk7XHJcblx0XHR0aGlzLm9iamVjdERpcnMgPSBuZXcgVWludDhBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGgpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRJbnRlcnNlY3Rpb24gPSAoXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHRyOiBudW1iZXIsXHJcblx0XHR0aGV0YTogbnVtYmVyLFxyXG5cdFx0eDE6IG51bWJlcixcclxuXHRcdHkxOiBudW1iZXIsXHJcblx0XHR4MjogbnVtYmVyLFxyXG5cdFx0eTI6IG51bWJlcixcclxuXHRcdHA0PzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9XHJcblx0KSA9PiB7XHJcblx0XHRjb25zdCB4MyA9IHg7XHJcblx0XHRjb25zdCB5MyA9IHk7XHJcblx0XHRsZXQgeDQ7XHJcblx0XHRsZXQgeTQ7XHJcblx0XHRsZXQgdU1heCA9IEluZmluaXR5O1xyXG5cdFx0aWYgKHA0Py54ICYmIHA0Py55KSB7XHJcblx0XHRcdHg0ID0gcDQueDtcclxuXHRcdFx0eTQgPSBwNC55O1xyXG5cdFx0XHR1TWF4ID0gMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHg0ID0geCArIHIgKiBNYXRoLmNvcyh0aGV0YSk7XHJcblx0XHRcdHk0ID0geSArIHIgKiBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgZGVub20gPSAoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCk7XHJcblxyXG5cdFx0aWYgKGRlbm9tID09IDApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgdCA9ICgoeDEgLSB4MykgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MykgKiAoeDMgLSB4NCkpIC8gZGVub207XHJcblx0XHRjb25zdCB1ID0gKCh4MSAtIHgzKSAqICh5MSAtIHkyKSAtICh5MSAtIHkzKSAqICh4MSAtIHgyKSkgLyBkZW5vbTtcclxuXHRcdGlmICh0ID49IDAgJiYgdCA8PSAxICYmIHUgPj0gMCAmJiB1IDw9IHVNYXgpIHtcclxuXHRcdFx0Y29uc3QgcHggPSB4MyArIHUgKiAoeDQgLSB4Myk7XHJcblx0XHRcdGNvbnN0IHB5ID0geTMgKyB1ICogKHk0IC0geTMpO1xyXG5cdFx0XHRyZXR1cm4gW3B4LCBweV07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0cHJpdmF0ZSBnZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChcclxuXHRcdGo6IG51bWJlcixcclxuXHRcdGs6IG51bWJlcixcclxuXHRcdHg6IG51bWJlcixcclxuXHRcdHk6IG51bWJlcixcclxuXHRcdGFkanVzdGVkQW5nbGU6IG51bWJlcixcclxuXHRcdHA0PzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9XHJcblx0KSB7XHJcblx0XHRpZiAoIXRoaXMucmF5QW5nbGVzKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVjb3JkOiBJbmZpbml0eSxcclxuXHRcdFx0XHRjbG9zZXN0OiBudWxsLFxyXG5cdFx0XHRcdGRpcjogMCxcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHIgPSAxO1xyXG5cclxuXHRcdC8vIFRlc3QgdG8gc2VlIGlmIHRoZSByYXkgd2lsbCBpbnRlcnNlY3Qgd2l0aCB0aGUgYmxvY2sgYXQgYWxsIGJlZm9yZSBjaGVja2luZyBhbGwgNCBzaWRlc1xyXG5cdFx0Ly8gY29uc3QgeE1pZCA9IGsgKiB0aGlzLndhbGxXICsgdGhpcy53YWxsVyAvIDI7XHJcblx0XHQvLyBjb25zdCB5TWlkID0gaiAqIHRoaXMud2FsbEggKyB0aGlzLndhbGxIIC8gMjtcclxuXHRcdC8vIGNvbnN0IGRlbHRhRCA9IHRoaXMud2FsbFcgKiBNYXRoLnNxcnQoMik7XHJcblx0XHQvLyBjb25zdCBzbG9wZSA9ICh5TWlkIC0geSkgLyAoeE1pZCAtIHgpO1xyXG5cdFx0Ly8gY29uc3QgcGVycFNsb3BlID0gLSgxIC8gc2xvcGUpO1xyXG5cdFx0Ly8gY29uc3QgYW5nbGUgPSBNYXRoLmF0YW4ocGVycFNsb3BlKTtcclxuXHJcblx0XHQvLyBjb25zdCB4TWlkMSA9IHhNaWQgKyBkZWx0YUQgKiBNYXRoLmNvcyhhbmdsZSk7XHJcblx0XHQvLyBjb25zdCB5TWlkMSA9IHlNaWQgKyBkZWx0YUQgKiBNYXRoLnNpbihhbmdsZSk7XHJcblx0XHQvLyBjb25zdCB4TWlkMiA9IHhNaWQgLSBkZWx0YUQgKiBNYXRoLmNvcyhhbmdsZSk7XHJcblx0XHQvLyBjb25zdCB5TWlkMiA9IHlNaWQgLSBkZWx0YUQgKiBNYXRoLnNpbihhbmdsZSk7XHJcblxyXG5cdFx0Ly8gY29uc3QgaW50ZXJzZWN0aW9uID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgYWRqdXN0ZWRBbmdsZSwgeE1pZDEsIHlNaWQxLCB4TWlkMiwgeU1pZDIpO1xyXG5cdFx0Ly8gaWYgKCFpbnRlcnNlY3Rpb24pIHtcclxuXHRcdC8vIFx0cmV0dXJuIHtcclxuXHRcdC8vIFx0XHRyZWNvcmQ6IEluZmluaXR5LFxyXG5cdFx0Ly8gXHRcdGNsb3Nlc3Q6IG51bGwsXHJcblx0XHQvLyBcdFx0ZGlyOiAwLFxyXG5cdFx0Ly8gXHR9O1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdGNvbnN0IHgxID0gayAqIHRoaXMud2FsbFc7XHJcblx0XHRjb25zdCB5MSA9IGogKiB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGNvbnN0IHgyID0geDEgKyB0aGlzLndhbGxXO1xyXG5cdFx0Y29uc3QgeTIgPSB5MTtcclxuXHJcblx0XHRjb25zdCB4MyA9IHgxICsgdGhpcy53YWxsVztcclxuXHRcdGNvbnN0IHkzID0geTEgKyB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGNvbnN0IHg0ID0geDE7XHJcblx0XHRjb25zdCB5NCA9IHkxICsgdGhpcy53YWxsSDtcclxuXHJcblx0XHRsZXQgcmVjb3JkID0gSW5maW5pdHk7XHJcblx0XHRsZXQgY2xvc2VzdCA9IG51bGw7XHJcblx0XHRsZXQgZGlyID0gMDtcclxuXHJcblx0XHRsZXQgd1gxID0gMDtcclxuXHRcdGxldCB3WTEgPSAwO1xyXG5cdFx0bGV0IHdYMiA9IDA7XHJcblx0XHRsZXQgd1kyID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBuID0gMDsgbiA8IDQ7IG4rKykge1xyXG5cdFx0XHRzd2l0Y2ggKG4pIHtcclxuXHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHR3WDEgPSB4MTtcclxuXHRcdFx0XHRcdHdZMSA9IHkxO1xyXG5cdFx0XHRcdFx0d1gyID0geDI7XHJcblx0XHRcdFx0XHR3WTIgPSB5MjtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdHdYMSA9IHgyO1xyXG5cdFx0XHRcdFx0d1kxID0geTI7XHJcblx0XHRcdFx0XHR3WDIgPSB4MztcclxuXHRcdFx0XHRcdHdZMiA9IHkzO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0d1gxID0geDM7XHJcblx0XHRcdFx0XHR3WTEgPSB5MztcclxuXHRcdFx0XHRcdHdYMiA9IHg0O1xyXG5cdFx0XHRcdFx0d1kyID0geTQ7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHR3WDEgPSB4NDtcclxuXHRcdFx0XHRcdHdZMSA9IHk0O1xyXG5cdFx0XHRcdFx0d1gyID0geDE7XHJcblx0XHRcdFx0XHR3WTIgPSB5MTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBpbnRlcnNlY3Rpb24gPSB0aGlzLmdldEludGVyc2VjdGlvbih4LCB5LCByLCBhZGp1c3RlZEFuZ2xlLCB3WDEsIHdZMSwgd1gyLCB3WTIsIHA0KTtcclxuXHRcdFx0aWYgKGludGVyc2VjdGlvbj8uWzBdKSB7XHJcblx0XHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gaW50ZXJzZWN0aW9uWzBdKTtcclxuXHRcdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBpbnRlcnNlY3Rpb25bMV0pO1xyXG5cdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHRcdHJlY29yZCA9IE1hdGgubWluKGQsIHJlY29yZCk7XHJcblx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdCA9IGludGVyc2VjdGlvbjtcclxuXHRcdFx0XHRcdGRpciA9IG47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVjb3JkLFxyXG5cdFx0XHRjbG9zZXN0LFxyXG5cdFx0XHRkaXIsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRSYXlBbmdsZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKSB7XHJcblx0XHRsZXQgcmF5QW5nID1cclxuXHRcdFx0eDIgLSB4MSA8IDBcclxuXHRcdFx0XHQ/IDI3MCAtIChNYXRoLmF0YW4oKHkyIC0geTEpIC8gLSh4MiAtIHgxKSkgKiAxODApIC8gTWF0aC5QSVxyXG5cdFx0XHRcdDogOTAgKyAoTWF0aC5hdGFuKCh5MiAtIHkxKSAvICh4MiAtIHgxKSkgKiAxODApIC8gTWF0aC5QSTtcclxuXHRcdHJheUFuZyA9ICgoKHJheUFuZyAtIDkwKSAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cclxuXHRcdHJldHVybiByYXlBbmc7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldFBlcmNBY3JTY3JlZW4oXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHRweDogbnVtYmVyLFxyXG5cdFx0cHk6IG51bWJlcixcclxuXHRcdHJvdGF0aW9uOiBudW1iZXIsXHJcblx0XHRpc1Nwcml0ZTogYm9vbGVhblxyXG5cdCkge1xyXG5cdFx0Y29uc3QgcmF5QW5nID0gdGhpcy5nZXRSYXlBbmdsZSh4LCB5LCBweCwgcHkpO1xyXG5cclxuXHRcdGxldCByYXlSb3REaWZmID0gcmF5QW5nIC0gcm90YXRpb247XHJcblxyXG5cdFx0aWYgKE1hdGguYWJzKHJheVJvdERpZmYpID4gdGhpcy5mb3YgLyAyKSB7XHJcblx0XHRcdHJheVJvdERpZmYgPSByYXlSb3REaWZmID49IDAgPyByYXlSb3REaWZmIC0gMzYwIDogMzYwICsgcmF5Um90RGlmZjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwZXJjQWNyU2NyZWVuID0gcmF5Um90RGlmZiAvIHRoaXMuZm92ICsgMC41O1xyXG5cclxuXHRcdHJldHVybiBwZXJjQWNyU2NyZWVuO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcocGxheWVyczogSVBsYXllcltdKSB7XHJcblx0XHRjb25zdCB4ID0gdGhpcy5wbGF5ZXJYO1xyXG5cdFx0Y29uc3QgeSA9IHRoaXMucGxheWVyWTtcclxuXHJcblx0XHR0aGlzLnBsYXllclJheXMgPSBbXTtcclxuXHJcblx0XHR0aGlzLm1vdmUoKTtcclxuXHJcblx0XHRpZiAoIXRoaXMucmF5QW5nbGVzIHx8ICF0aGlzLnJheXMpIHJldHVybjtcclxuXHRcdGNvbnN0IHJvdGF0aW9uID0gKCh0aGlzLnJvdGF0aW9uICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblxyXG5cdFx0bGV0IG9ialR5cGVUZW1wID0gMDtcclxuXHRcdGxldCBvYmpEaXJUZW1wID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmF5QW5nbGVzLmxlbmd0aCArIDE7IGkrKykge1xyXG5cdFx0XHRsZXQgYWRqdXN0ZWRBbmdsZTtcclxuXHRcdFx0aWYgKGkgPT09IHRoaXMucmF5QW5nbGVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdGFkanVzdGVkQW5nbGUgPSB0aGlzLmV4dHJhUmF5LmFuZyArIHJvdGF0aW9uICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFkanVzdGVkQW5nbGUgPSB0aGlzLnJheUFuZ2xlc1tpXSArIHJvdGF0aW9uICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgY2xvc2VzdCA9IG51bGw7XHJcblx0XHRcdGxldCByZWNvcmQgPSBJbmZpbml0eTtcclxuXHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsUm93czsgaisrKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLndhbGxDb2xzOyBrKyspIHtcclxuXHRcdFx0XHRcdGNvbnN0IHdhbGwgPSB0aGlzLndhbGxzW2ogKiB0aGlzLndhbGxDb2xzICsga107XHJcblx0XHRcdFx0XHRpZiAod2FsbCA9PT0gMCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgcmVjdEludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdFx0XHRkaXI6IG51bWJlcjtcclxuXHRcdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGosIGssIHgsIHksIGFkanVzdGVkQW5nbGUpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChyZWN0SW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZCkge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQgPSByZWN0SW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdCA9IHJlY3RJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHJcblx0XHRcdFx0XHRcdG9ialR5cGVUZW1wID0gd2FsbDtcclxuXHRcdFx0XHRcdFx0b2JqRGlyVGVtcCA9IHJlY3RJbnRlcnNlY3Rpb24uZGlyO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaSA9PT0gdGhpcy5yYXlBbmdsZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0Ly8gSWYgb24gZXh0cmEgcmF5IGFuZ2xlXHJcblx0XHRcdFx0aWYgKGNsb3Nlc3QpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmRldk1vZGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5tb3ZlVG8oeCwgeSk7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVRvKGNsb3Nlc3RbMF0sIGNsb3Nlc3RbMV0pO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZVN0eWxlID0gYHJnYmEoMCwyNTUsMCwke3RoaXMucmF5T3BhY2l0eSArIDAuMX0pYDtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5saW5lV2lkdGggPSAxO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRoaXMuZXh0cmFSYXkubCA9IHJlY29yZDtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnJheUNvb3Jkcykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmV4dHJhUmF5LmNvb3Jkc1swXSA9IGNsb3Nlc3RbMF07XHJcblx0XHRcdFx0XHRcdHRoaXMuZXh0cmFSYXkuY29vcmRzWzFdID0gY2xvc2VzdFsxXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICh0aGlzLm9iamVjdFR5cGVzKSB0aGlzLmV4dHJhUmF5Lm9ialR5cGUgPSBvYmpUeXBlVGVtcDtcclxuXHRcdFx0XHRcdGlmICh0aGlzLm9iamVjdERpcnMpIHRoaXMuZXh0cmFSYXkub2JqRGlyID0gb2JqRGlyVGVtcDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5leHRyYVJheS5sID0gSW5maW5pdHk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChjbG9zZXN0KSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5kZXZNb2RlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQubW92ZVRvKHgsIHkpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVUbyhjbG9zZXN0WzBdLCBjbG9zZXN0WzFdKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5zdHJva2VTdHlsZSA9IGByZ2JhKDI1NSwyNTUsMjU1LCR7dGhpcy5yYXlPcGFjaXR5fSlgO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5yYXlzW2ldID0gcmVjb3JkO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMucmF5Q29vcmRzKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMucmF5Q29vcmRzW2kgKiAyXSA9IGNsb3Nlc3RbMF07XHJcblx0XHRcdFx0XHRcdHRoaXMucmF5Q29vcmRzW2kgKiAyICsgMV0gPSBjbG9zZXN0WzFdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHRoaXMub2JqZWN0VHlwZXMpIHRoaXMub2JqZWN0VHlwZXNbaV0gPSBvYmpUeXBlVGVtcDtcclxuXHRcdFx0XHRcdGlmICh0aGlzLm9iamVjdERpcnMpIHRoaXMub2JqZWN0RGlyc1tpXSA9IG9iakRpclRlbXA7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMucmF5c1tpXSA9IEluZmluaXR5O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxvb3AxOiBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcCA9IHBsYXllcnNbaV07XHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsUm93czsgaisrKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLndhbGxDb2xzOyBrKyspIHtcclxuXHRcdFx0XHRcdGNvbnN0IHdhbGwgPSB0aGlzLndhbGxzW2ogKiB0aGlzLndhbGxDb2xzICsga107XHJcblx0XHRcdFx0XHRpZiAod2FsbCA9PT0gMCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgcmVjdEludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdFx0XHRkaXI6IG51bWJlcjtcclxuXHRcdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGosIGssIHgsIHksIDAsIHsgeDogcC54LCB5OiBwLnkgfSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHJlY3RJbnRlcnNlY3Rpb24/LmNsb3Nlc3Q/LlswXSkgY29udGludWUgbG9vcDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBwLngpO1xyXG5cdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBwLnkpO1xyXG5cdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcblx0XHRcdGNvbnN0IGRlbHRhRCA9IHRoaXMucGxheWVyVyAvIDI7XHJcblx0XHRcdGNvbnN0IHNsb3BlID0gKHAueSAtIHRoaXMucGxheWVyWSkgLyAocC54IC0gdGhpcy5wbGF5ZXJYKTtcclxuXHRcdFx0Y29uc3QgcGVycFNsb3BlID0gLSgxIC8gc2xvcGUpO1xyXG5cdFx0XHRjb25zdCBhbmdsZSA9IE1hdGguYXRhbihwZXJwU2xvcGUpO1xyXG5cdFx0XHRjb25zdCB4MSA9IHAueCArIGRlbHRhRCAqIE1hdGguY29zKGFuZ2xlKTtcclxuXHRcdFx0Y29uc3QgeTEgPSBwLnkgKyBkZWx0YUQgKiBNYXRoLnNpbihhbmdsZSk7XHJcblx0XHRcdGNvbnN0IHgyID0gcC54IC0gZGVsdGFEICogTWF0aC5jb3MoYW5nbGUpO1xyXG5cdFx0XHRjb25zdCB5MiA9IHAueSAtIGRlbHRhRCAqIE1hdGguc2luKGFuZ2xlKTtcclxuXHJcblx0XHRcdGNvbnN0IHBlcmNBY3JTY3JlZW46IG51bWJlciA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCBwLngsIHAueSwgcm90YXRpb24sIGZhbHNlKTtcclxuXHJcblx0XHRcdGNvbnN0IGFuZ2xlRGVnID0gdGhpcy5nZXRSYXlBbmdsZSh4LCB5LCBwLngsIHAueSk7XHJcblx0XHRcdGxldCBwZXJjQWNyU2NyZWVuTDogbnVtYmVyID0gLTE7XHJcblx0XHRcdGxldCBwZXJjQWNyU2NyZWVuUjogbnVtYmVyID0gLTE7XHJcblxyXG5cdFx0XHRpZiAoYW5nbGVEZWcgPj0gMCAmJiBhbmdsZURlZyA8PSAxODApIHtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuTCA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MSwgeTEsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuUiA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MiwgeTIsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuTCA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MiwgeTIsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuUiA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MSwgeTEsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKChwZXJjQWNyU2NyZWVuTCA+PSAwICYmIHBlcmNBY3JTY3JlZW5MIDw9IDEpIHx8IChwZXJjQWNyU2NyZWVuUiA+PSAwICYmIHBlcmNBY3JTY3JlZW5SIDw9IDEpKSB7XHJcblx0XHRcdFx0aWYgKHBlcmNBY3JTY3JlZW5MID49IDAgJiYgcGVyY0FjclNjcmVlbkwgPD0gMSAmJiBwZXJjQWNyU2NyZWVuUiA+PSAwICYmIHBlcmNBY3JTY3JlZW5SIDw9IDEpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHBlcmNBY3JTY3JlZW5MdGVtcCA9IHBlcmNBY3JTY3JlZW5MO1xyXG5cdFx0XHRcdFx0cGVyY0FjclNjcmVlbkwgPSBNYXRoLm1pbihwZXJjQWNyU2NyZWVuTCwgcGVyY0FjclNjcmVlblIpO1xyXG5cdFx0XHRcdFx0cGVyY0FjclNjcmVlblIgPSBNYXRoLm1heChwZXJjQWNyU2NyZWVuTHRlbXAsIHBlcmNBY3JTY3JlZW5SKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJSYXlzLnB1c2goe1xyXG5cdFx0XHRcdFx0bDogZCxcclxuXHRcdFx0XHRcdHg6IHAueCxcclxuXHRcdFx0XHRcdHk6IHAueSxcclxuXHRcdFx0XHRcdG5hbWU6IHAubmFtZSxcclxuXHRcdFx0XHRcdHBlcmNBY3Jvc3NTY3JlZW46IHBlcmNBY3JTY3JlZW4sXHJcblx0XHRcdFx0XHRwZXJjQWNyb3NzU2NyZWVuMTogcGVyY0FjclNjcmVlbkwsXHJcblx0XHRcdFx0XHRwZXJjQWNyb3NzU2NyZWVuMjogcGVyY0FjclNjcmVlblIsXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmRldk1vZGUpIHtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLm1vdmVUbyh4LCB5KTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVRvKHAueCwgcC55KTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlU3R5bGUgPSBgcmdiYSgyNTUsMCwwLDEpYDtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVdpZHRoID0gMTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgcm90YXRpb25GID0gKChNYXRoLlBJIC8gMTgwKSAqICgodGhpcy5yb3RhdGlvbiAlIDM2MCkgKyAzNjApKSAlIDM2MDtcclxuXHRcdGNvbnN0IHJvdGF0aW9uUiA9ICgoTWF0aC5QSSAvIDE4MCkgKiAoKCh0aGlzLnJvdGF0aW9uICsgOTApICUgMzYwKSArIDM2MCkpICUgMzYwO1xyXG5cdFx0Y29uc3Qgcm90YXRpb25CID0gKChNYXRoLlBJIC8gMTgwKSAqICgoKHRoaXMucm90YXRpb24gKyAxODApICUgMzYwKSArIDM2MCkpICUgMzYwO1xyXG5cdFx0Y29uc3Qgcm90YXRpb25MID0gKChNYXRoLlBJIC8gMTgwKSAqICgoKHRoaXMucm90YXRpb24gLSA5MCkgJSAzNjApICsgMzYwKSkgJSAzNjA7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RGID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRGID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RMID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRMID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RSID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRSID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RCID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRCID0gSW5maW5pdHk7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxSb3dzOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxDb2xzOyBqKyspIHtcclxuXHRcdFx0XHRjb25zdCB3YWxsID0gdGhpcy53YWxsc1tpICogdGhpcy53YWxsQ29scyArIGpdO1xyXG5cdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0Y29uc3QgZkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgcm90YXRpb25GKTtcclxuXHRcdFx0XHRpZiAoZkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRGKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRGID0gZkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0RiA9IGZJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IGxJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGksIGosIHgsIHksIHJvdGF0aW9uTCk7XHJcblx0XHRcdFx0aWYgKGxJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkTCkge1xyXG5cdFx0XHRcdFx0cmVjb3JkTCA9IGxJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdEwgPSBsSW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBySW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdGNsb3Nlc3Q6IG51bWJlcltdIHwgbnVsbDtcclxuXHRcdFx0XHR9ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChpLCBqLCB4LCB5LCByb3RhdGlvblIpO1xyXG5cdFx0XHRcdGlmIChySW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZFIpIHtcclxuXHRcdFx0XHRcdHJlY29yZFIgPSBySW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdGNsb3Nlc3RSID0gckludGVyc2VjdGlvbi5jbG9zZXN0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3QgYkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgcm90YXRpb25CKTtcclxuXHRcdFx0XHRpZiAoYkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRCKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRCID0gYkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0QiA9IGJJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY2xvc2VzdEYpIHRoaXMubW92ZURpclJheXMuZm9yZXdhcmQgPSByZWNvcmRGO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RMKSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSByZWNvcmRMO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSBJbmZpbml0eTtcclxuXHJcblx0XHRpZiAoY2xvc2VzdFIpIHRoaXMubW92ZURpclJheXMucmlnaHQgPSByZWNvcmRSO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0ID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RCKSB0aGlzLm1vdmVEaXJSYXlzLmJhY2t3YXJkID0gcmVjb3JkQjtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gYHJnYmEoMCwyNTUsMCwxKWA7XHJcblx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0dGhpcy5jdHgyZC5lbGxpcHNlKHRoaXMucGxheWVyWCwgdGhpcy5wbGF5ZXJZLCA2LCA2LCAwLCAwLCAyICogTWF0aC5QSSk7XHJcblx0XHR0aGlzLmN0eDJkLmZpbGwoKTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgSVBsYXllciB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVycyB7XHJcblx0cHJpdmF0ZSB3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHVibGljIHBsYXllcnM6IElQbGF5ZXJbXTtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMud29ybGQyZCA9IHdvcmxkMmQ7XHJcblx0XHR0aGlzLmN0eDJkID0gY3R4MmQ7XHJcblx0XHR0aGlzLnBsYXllcnMgPSBbXTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGRQbGF5ZXIobmFtZTogc3RyaW5nKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJzW2ldLm5hbWUgPT09IG5hbWUpIHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBsYXllcnMucHVzaCh7XHJcblx0XHRcdG5hbWU6IG5hbWUsXHJcblx0XHRcdHg6IHRoaXMud29ybGQyZC53aWR0aCAvIDIsXHJcblx0XHRcdHk6IHRoaXMud29ybGQyZC5oZWlnaHQgLyAyLFxyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhgJHtuYW1lfSBoYXMgam9pbmVkIHRoZSBtYXRjaGApO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlbW92ZVBsYXllcihuYW1lOiBzdHJpbmcpIHtcclxuXHRcdGNvbnNvbGUubG9nKGBQbGF5ZXIgJHtuYW1lfSBoYXMgbGVmdCB0aGUgbWF0Y2hgKTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnBsYXllcnNbaV0ubmFtZSA9PT0gbmFtZSkge1xyXG5cdFx0XHRcdHRoaXMucGxheWVycy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGVQbGF5ZXJQb3MocDogSVBsYXllcikge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMucGxheWVyc1tpXS5uYW1lID09PSBwLm5hbWUpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllcnNbaV0ueCA9IHAueDtcclxuXHRcdFx0XHR0aGlzLnBsYXllcnNbaV0ueSA9IHAueTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBsYXllcnMucHVzaCh7XHJcblx0XHRcdG5hbWU6IHAubmFtZSxcclxuXHRcdFx0eDogcC54LFxyXG5cdFx0XHR5OiBwLnksXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcCA9IHRoaXMucGxheWVyc1tpXTtcclxuXHJcblx0XHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gJ3JlZCc7XHJcblx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdHRoaXMuY3R4MmQuZWxsaXBzZShwLngsIHAueSwgNiwgNiwgMiAqIE1hdGguUEksIDAsIDIgKiBNYXRoLlBJKTtcclxuXHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxzMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHB1YmxpYyB3YWxsQ29sczogbnVtYmVyO1xyXG5cdHB1YmxpYyB3YWxsUm93czogbnVtYmVyO1xyXG5cdHB1YmxpYyB3YWxsczogVWludDhBcnJheTtcclxuXHRwdWJsaWMgd2FsbFc6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbEg6IG51bWJlcjtcclxuXHRwdWJsaWMgZGV2TW9kZTogYm9vbGVhbjtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMud29ybGQyZCA9IHdvcmxkMmQ7XHJcblx0XHR0aGlzLmN0eDJkID0gY3R4MmQ7XHJcblx0XHR0aGlzLndhbGxDb2xzID0gMzI7XHJcblx0XHR0aGlzLndhbGxSb3dzID0gMTg7XHJcblx0XHR0aGlzLndhbGxzID0gbmV3IFVpbnQ4QXJyYXkoXHJcblx0XHRcdFtcclxuXHRcdFx0XHRbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMSwgMSwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDEsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMSwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDAsIDAsIDEsIDEsIDEsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDAsIDEsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMSwgMSwgMSwgMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDEsIDEsIDEsIDAsIDEsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMSwgMSwgMSwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAyLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMSwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMSwgMSwgMSwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuXHRcdFx0XS5mbGF0KClcclxuXHRcdFx0Ly8gW1xyXG5cdFx0XHQvLyBcdFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuXHRcdFx0Ly8gXHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdC8vIFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHQvLyBcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0Ly8gXHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdC8vIFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHQvLyBcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0Ly8gXHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdC8vIFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHQvLyBcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0Ly8gXHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdC8vIFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHQvLyBcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0Ly8gXHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdC8vIFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHQvLyBcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0Ly8gXHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdC8vIFx0WzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG5cdFx0XHQvLyBdLmZsYXQoKVxyXG5cdFx0KTtcclxuXHRcdHRoaXMud2FsbFcgPSB0aGlzLndvcmxkMmQud2lkdGggLyB0aGlzLndhbGxDb2xzO1xyXG5cdFx0dGhpcy53YWxsSCA9IHRoaXMud29ybGQyZC5oZWlnaHQgLyB0aGlzLndhbGxSb3dzO1xyXG5cdFx0dGhpcy5kZXZNb2RlID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KCkge1xyXG5cdFx0aWYgKHRoaXMuZGV2TW9kZSkge1xyXG5cdFx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2FsbFJvd3M7IGkrKykge1xyXG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsQ29sczsgaisrKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9ICdyZ2IoMTAwLCAxMDAsIDEwMCknO1xyXG5cdFx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaSAqIHRoaXMud2FsbENvbHMgKyBqXTtcclxuXHJcblx0XHRcdFx0XHRzd2l0Y2ggKHdhbGwpIHtcclxuXHRcdFx0XHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnJlY3QoaiAqIHRoaXMud2FsbFcsIGkgKiB0aGlzLndhbGxILCB0aGlzLndhbGxXLCB0aGlzLndhbGxIKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmZpbGwoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5yZWN0KGogKiB0aGlzLndhbGxXLCBpICogdGhpcy53YWxsSCwgdGhpcy53YWxsVywgdGhpcy53YWxsSCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgeyBJUGxheWVyUmF5cyB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbHMzZCB7XHJcblx0cHJpdmF0ZSB3b3JsZDNkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDNkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHJpdmF0ZSB3YWxsVzogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbEg6IG51bWJlcjtcclxuXHRwcml2YXRlIHdvcmxkM2REaWFnOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsVGV4dHVyZTogSFRNTEltYWdlRWxlbWVudDtcclxuXHRwcml2YXRlIHdhbGxUZXh0dXJlRGFyazogSFRNTEltYWdlRWxlbWVudDtcclxuXHRwcml2YXRlIGJnVG9wSW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cdHByaXZhdGUgYmdUb3BYOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsQ2VudGVySGVpZ2h0OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkM2Q6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgzZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB3YWxsVzogbnVtYmVyLCB3YWxsSDogbnVtYmVyKSB7XHJcblx0XHR0aGlzLndvcmxkM2QgPSB3b3JsZDNkO1xyXG5cdFx0dGhpcy5jdHgzZCA9IGN0eDNkO1xyXG5cdFx0dGhpcy53YWxsVyA9IHdhbGxXO1xyXG5cdFx0dGhpcy53YWxsSCA9IHdhbGxIO1xyXG5cdFx0dGhpcy53b3JsZDNkRGlhZyA9IE1hdGguc3FydChNYXRoLnBvdyh3b3JsZDNkLndpZHRoLCAyKSArIE1hdGgucG93KHdvcmxkM2QuaGVpZ2h0LCAyKSk7XHJcblx0XHR0aGlzLndhbGxUZXh0dXJlID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLndhbGxUZXh0dXJlLnNyYyA9ICcuLi9wdWJsaWMvc3RvbmVUZXh0dXJlLnBuZyc7XHJcblx0XHR0aGlzLndhbGxUZXh0dXJlRGFyayA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0dGhpcy53YWxsVGV4dHVyZURhcmsuc3JjID0gJy4uL3B1YmxpYy9zdG9uZVRleHR1cmVEYXJrLnBuZyc7XHJcblx0XHR0aGlzLmJnVG9wSW1nID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLmJnVG9wSW1nLnNyYyA9ICcuLi9wdWJsaWMvc3RhcnMuanBnJztcclxuXHRcdHRoaXMuYmdUb3BYID0gMDtcclxuXHRcdHRoaXMud2FsbENlbnRlckhlaWdodCA9IHRoaXMud29ybGQzZC5oZWlnaHQgLyAyLjU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGRyYXdCYWNrZ3JvdW5kKCkge1xyXG5cdFx0Ly9tdWx0aXBseSBiZyBpbWcgd2lkdGggYnkgNCBzbyB3aGVuIHlvdSByb3RhdGUgOTBkZWcsIHlvdSdyZSAxLzR0aCB0aHJvdWdoIHRoZSBpbWdcclxuXHRcdHRoaXMuYmdUb3BJbWcud2lkdGggPSB0aGlzLndvcmxkM2Qud2lkdGggKiAyO1xyXG5cdFx0dGhpcy5iZ1RvcEltZy5oZWlnaHQgPSB0aGlzLndvcmxkM2QuaGVpZ2h0O1xyXG5cclxuXHRcdC8vcmVzZXQgYmcgaW1nIHBvc2l0aW9uIGlmIGVuZHMgb2YgaW1nIGFyZSBpbiB2aWV3XHJcblx0XHRpZiAodGhpcy5iZ1RvcFggPiAwKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYID0gLXRoaXMuYmdUb3BJbWcud2lkdGg7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuYmdUb3BYIDwgLXRoaXMuYmdUb3BJbWcud2lkdGgpIHtcclxuXHRcdFx0dGhpcy5iZ1RvcFggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuY3R4M2QuZHJhd0ltYWdlKFxyXG5cdFx0XHR0aGlzLmJnVG9wSW1nLFxyXG5cdFx0XHR0aGlzLmJnVG9wWCxcclxuXHRcdFx0dGhpcy53YWxsQ2VudGVySGVpZ2h0LFxyXG5cdFx0XHR0aGlzLmJnVG9wSW1nLndpZHRoLFxyXG5cdFx0XHQtdGhpcy5iZ1RvcEltZy5oZWlnaHRcclxuXHRcdCk7XHJcblx0XHR0aGlzLmN0eDNkLmRyYXdJbWFnZShcclxuXHRcdFx0dGhpcy5iZ1RvcEltZyxcclxuXHRcdFx0dGhpcy5iZ1RvcFggKyB0aGlzLmJnVG9wSW1nLndpZHRoLFxyXG5cdFx0XHR0aGlzLndhbGxDZW50ZXJIZWlnaHQsXHJcblx0XHRcdHRoaXMuYmdUb3BJbWcud2lkdGgsXHJcblx0XHRcdC10aGlzLmJnVG9wSW1nLmhlaWdodFxyXG5cdFx0KTtcclxuXHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoMCwwLDAsMC43KWA7XHJcblx0XHR0aGlzLmN0eDNkLmZpbGxSZWN0KDAsIDAsIHRoaXMud29ybGQzZC53aWR0aCwgdGhpcy53YWxsQ2VudGVySGVpZ2h0KTtcclxuXHJcblx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2IoMTUsIDM1LCAxNSlgO1xyXG5cdFx0Ly8gdGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiKDIwMCwgMjAwLCAyMDApYDtcclxuXHRcdHRoaXMuY3R4M2QuZmlsbFJlY3QoXHJcblx0XHRcdDAsXHJcblx0XHRcdHRoaXMud2FsbENlbnRlckhlaWdodCxcclxuXHRcdFx0dGhpcy53b3JsZDNkLndpZHRoLFxyXG5cdFx0XHR0aGlzLndvcmxkM2QuaGVpZ2h0IC0gdGhpcy53YWxsQ2VudGVySGVpZ2h0XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEJnVG9wWE1vdXNlTW92ZShtb3ZlRGVsdGE6IG51bWJlcikge1xyXG5cdFx0dGhpcy5iZ1RvcFggLT0gKCh0aGlzLmJnVG9wSW1nLndpZHRoIC8gMTgwKSAqIG1vdmVEZWx0YSkgLyAyMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRiZ1RvcFgocm90QW10OiBudW1iZXIsIG1vdmVEaXJMUjogc3RyaW5nIHwgbnVsbCkge1xyXG5cdFx0Y29uc3QgeERlbHRhID0gKHRoaXMuYmdUb3BJbWcud2lkdGggLyAxODApICogcm90QW10O1xyXG5cdFx0aWYgKG1vdmVEaXJMUiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYICs9IHhEZWx0YTtcclxuXHRcdH0gZWxzZSBpZiAobW92ZURpckxSID09PSAncmlnaHQnKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYIC09IHhEZWx0YTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KFxyXG5cdFx0cmF5czogRmxvYXQzMkFycmF5IHwgbnVsbCxcclxuXHRcdHJheUNvb3JkczogRmxvYXQzMkFycmF5IHwgbnVsbCxcclxuXHRcdG9iamVjdFR5cGVzOiBVaW50OEFycmF5IHwgbnVsbCxcclxuXHRcdG9iamVjdERpcnM6IFVpbnQ4QXJyYXkgfCBudWxsLFxyXG5cdFx0ZXh0cmFSYXk6IHtcclxuXHRcdFx0YW5nOiBudW1iZXI7XHJcblx0XHRcdGw6IG51bWJlcjtcclxuXHRcdFx0Y29vcmRzOiBudW1iZXJbXTtcclxuXHRcdFx0b2JqVHlwZTogbnVtYmVyO1xyXG5cdFx0XHRvYmpEaXI6IG51bWJlcjtcclxuXHRcdH0sXHJcblx0XHRyYXlBbmdsZXM6IEZsb2F0MzJBcnJheSB8IG51bGwsXHJcblx0XHRwbGF5ZXJSYXlzOiBJUGxheWVyUmF5c1tdLFxyXG5cdFx0cGxheWVyVzogbnVtYmVyXHJcblx0KSB7XHJcblx0XHRpZiAoIXJheXMgfHwgIXJheUFuZ2xlcyB8fCAhcmF5Q29vcmRzKSByZXR1cm47XHJcblx0XHR0aGlzLmRyYXdCYWNrZ3JvdW5kKCk7XHJcblxyXG5cdFx0Y29uc3Qgd2FsbFdpZHRoID0gdGhpcy53b3JsZDNkLndpZHRoIC8gcmF5cy5sZW5ndGg7XHJcblx0XHRjb25zdCB3YWxsV2lkdGhPdmVyc2l6ZWQgPSB3YWxsV2lkdGggKyAxO1xyXG5cdFx0bGV0IHdhbGxYID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJheXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgZGlzdCA9IHJheXNbaV0gKiBNYXRoLmNvcyhyYXlBbmdsZXNbaV0pO1xyXG5cdFx0XHRsZXQgb2Zmc2V0ID1cclxuXHRcdFx0XHRvYmplY3REaXJzPy5baV0gPT09IDAgfHwgb2JqZWN0RGlycz8uW2ldID09PSAyXHJcblx0XHRcdFx0XHQ/IHJheUNvb3Jkc1tpICogMl0gJSB0aGlzLndhbGxXXHJcblx0XHRcdFx0XHQ6IHJheUNvb3Jkc1tpICogMiArIDFdICUgdGhpcy53YWxsSDtcclxuXHJcblx0XHRcdGxldCBvZmZzZXQyOiBudW1iZXI7XHJcblxyXG5cdFx0XHRpZiAoaSA9PT0gcmF5cy5sZW5ndGggLSAxKSB7XHJcblx0XHRcdFx0b2Zmc2V0MiA9XHJcblx0XHRcdFx0XHRleHRyYVJheS5vYmpEaXIgPT09IDAgfHwgZXh0cmFSYXkub2JqRGlyID09PSAyXHJcblx0XHRcdFx0XHRcdD8gZXh0cmFSYXkuY29vcmRzWzBdICUgdGhpcy53YWxsV1xyXG5cdFx0XHRcdFx0XHQ6IGV4dHJhUmF5LmNvb3Jkc1sxXSAlIHRoaXMud2FsbEg7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b2Zmc2V0MiA9XHJcblx0XHRcdFx0XHRvYmplY3REaXJzPy5baSArIDFdID09PSAwIHx8IG9iamVjdERpcnM/LltpICsgMV0gPT09IDJcclxuXHRcdFx0XHRcdFx0PyByYXlDb29yZHNbKGkgKyAxKSAqIDJdICUgdGhpcy53YWxsV1xyXG5cdFx0XHRcdFx0XHQ6IHJheUNvb3Jkc1soaSArIDEpICogMiArIDFdICUgdGhpcy53YWxsSDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9iamVjdERpcnM/LltpXSA9PT0gMCB8fCBvYmplY3REaXJzPy5baV0gPT09IDEpIHtcclxuXHRcdFx0XHRvZmZzZXQgPSB0aGlzLndhbGxXIC0gb2Zmc2V0O1xyXG5cdFx0XHRcdG9mZnNldDIgPSB0aGlzLndhbGxXIC0gb2Zmc2V0MjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3Qgd2FsbFNoaWZ0QW10ID0gKHRoaXMud29ybGQzZC5oZWlnaHQgKiA1MCkgLyBkaXN0O1xyXG5cdFx0XHRjb25zdCB3YWxsU3RhcnRUb3AgPSB0aGlzLndhbGxDZW50ZXJIZWlnaHQgLSB3YWxsU2hpZnRBbXQ7XHJcblx0XHRcdGNvbnN0IHdhbGxFbmRCb3R0b20gPSB0aGlzLndhbGxDZW50ZXJIZWlnaHQgKyB3YWxsU2hpZnRBbXQ7XHJcblxyXG5cdFx0XHQvLyBsZXQgd2FsbERhcmtuZXNzID0gZGlzdCAvIHRoaXMud29ybGQzZC5oZWlnaHQ7XHJcblx0XHRcdC8vIHdhbGxEYXJrbmVzcyA9ICh0aGlzLndvcmxkM2REaWFnIC0gZGlzdCkgLyB0aGlzLndvcmxkM2REaWFnO1xyXG5cclxuXHRcdFx0Ly8gc3dpdGNoIChvYmplY3REaXJzPy5baV0pIHtcclxuXHRcdFx0Ly8gXHRjYXNlIDA6XHJcblx0XHRcdC8vIFx0XHR3YWxsRGFya25lc3MgLT0gMC4yO1xyXG5cdFx0XHQvLyBcdFx0YnJlYWs7XHJcblx0XHRcdC8vIFx0Y2FzZSAyOlxyXG5cdFx0XHQvLyBcdFx0d2FsbERhcmtuZXNzIC09IDAuMjtcclxuXHRcdFx0Ly8gXHRcdGJyZWFrO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHQvLyBzd2l0Y2ggKG9iamVjdFR5cGVzPy5baV0pIHtcclxuXHRcdFx0Ly8gXHRjYXNlIDE6XHJcblx0XHRcdC8vIFx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKCR7MjU1ICogd2FsbERhcmtuZXNzfSwkezI1NSAqIHdhbGxEYXJrbmVzc30sJHsyNTUgKiB3YWxsRGFya25lc3N9LDEpYDtcclxuXHRcdFx0Ly8gXHRcdGJyZWFrO1xyXG5cdFx0XHQvLyBcdGNhc2UgMjpcclxuXHRcdFx0Ly8gXHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoJHswICogd2FsbERhcmtuZXNzfSwkezEwMCAqIHdhbGxEYXJrbmVzc30sJHsxMDAgKiB3YWxsRGFya25lc3N9LDEpYDtcclxuXHRcdFx0Ly8gXHRcdGJyZWFrO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHQvLyB0aGlzLmN0eDNkLmZpbGxSZWN0KHdhbGxYLCB3YWxsU3RhcnRUb3AsIHdhbGxXaWR0aE92ZXJzaXplZCwgd2FsbEVuZEJvdHRvbSAtIHdhbGxTdGFydFRvcCk7XHJcblxyXG5cdFx0XHRsZXQgY3VySW1nID0gbnVsbDtcclxuXHRcdFx0bGV0IHNXaWR0aCA9IDA7XHJcblx0XHRcdGxldCBjaHVuazJPZmZzZXQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuXHRcdFx0c1dpZHRoID0gb2Zmc2V0IDw9IG9mZnNldDIgPyBvZmZzZXQyIC0gb2Zmc2V0IDogdGhpcy53YWxsVyAtIG9mZnNldCArIG9mZnNldDI7XHJcblx0XHRcdGlmIChvZmZzZXQgPiBvZmZzZXQyKSB7XHJcblx0XHRcdFx0Y2h1bmsyT2Zmc2V0ID0gLSh0aGlzLndhbGxXIC0gb2Zmc2V0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9iamVjdERpcnM/LltpXSA9PT0gMCB8fCBvYmplY3REaXJzPy5baV0gPT09IDIpIHtcclxuXHRcdFx0XHRjdXJJbWcgPSB0aGlzLndhbGxUZXh0dXJlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGN1ckltZyA9IHRoaXMud2FsbFRleHR1cmVEYXJrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmN0eDNkLmRyYXdJbWFnZShcclxuXHRcdFx0XHRjdXJJbWcsXHJcblx0XHRcdFx0b2Zmc2V0LFxyXG5cdFx0XHRcdDAsXHJcblx0XHRcdFx0c1dpZHRoLFxyXG5cdFx0XHRcdGN1ckltZy5oZWlnaHQsXHJcblx0XHRcdFx0d2FsbFgsXHJcblx0XHRcdFx0d2FsbFN0YXJ0VG9wLFxyXG5cdFx0XHRcdHdhbGxXaWR0aE92ZXJzaXplZCxcclxuXHRcdFx0XHR3YWxsRW5kQm90dG9tIC0gd2FsbFN0YXJ0VG9wXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRpZiAoY2h1bmsyT2Zmc2V0KSB7XHJcblx0XHRcdFx0dGhpcy5jdHgzZC5kcmF3SW1hZ2UoXHJcblx0XHRcdFx0XHRjdXJJbWcsXHJcblx0XHRcdFx0XHRjaHVuazJPZmZzZXQsXHJcblx0XHRcdFx0XHQwLFxyXG5cdFx0XHRcdFx0c1dpZHRoLFxyXG5cdFx0XHRcdFx0Y3VySW1nLmhlaWdodCxcclxuXHRcdFx0XHRcdHdhbGxYLFxyXG5cdFx0XHRcdFx0d2FsbFN0YXJ0VG9wLFxyXG5cdFx0XHRcdFx0d2FsbFdpZHRoT3ZlcnNpemVkLFxyXG5cdFx0XHRcdFx0d2FsbEVuZEJvdHRvbSAtIHdhbGxTdGFydFRvcFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHdhbGxYICs9IHdhbGxXaWR0aDtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllclJheXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcmF5TCA9IHBsYXllclJheXNbaV0ubDtcclxuXHRcdFx0Y29uc3QgdyA9ICh0aGlzLndvcmxkM2Qud2lkdGggKiBwbGF5ZXJXKSAvIHJheUw7XHJcblx0XHRcdC8vIGxldCB4ID0gcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuICogdGhpcy53b3JsZDNkLndpZHRoO1xyXG5cdFx0XHRsZXQgeDtcclxuXHJcblx0XHRcdGlmIChwbGF5ZXJSYXlzW2ldLnBlcmNBY3Jvc3NTY3JlZW4xID49IDAgJiYgcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuMSA8PSAxKSB7XHJcblx0XHRcdFx0eCA9IHBsYXllclJheXNbaV0ucGVyY0Fjcm9zc1NjcmVlbjEgKiB0aGlzLndvcmxkM2Qud2lkdGggKyB3IC8gMjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR4ID0gcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuMiAqIHRoaXMud29ybGQzZC53aWR0aCAtIHcgLyAyO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgcGxheWVyQ2VudGVySGVpZ2h0ID0gdGhpcy53b3JsZDNkLmhlaWdodCAvIDIuNTtcclxuXHRcdFx0Y29uc3Qgd2FsbFNoaWZ0QW10ID0gKHRoaXMud29ybGQzZC5oZWlnaHQgKiA1MCkgLyByYXlMO1xyXG5cdFx0XHRjb25zdCBwbGF5ZXJTaGlmdEFtdCA9ICh0aGlzLndvcmxkM2QuaGVpZ2h0ICogNDApIC8gcmF5TDtcclxuXHRcdFx0Y29uc3QgYWRqVG9Cb3RBbXQgPSB3YWxsU2hpZnRBbXQgLSBwbGF5ZXJTaGlmdEFtdDtcclxuXHRcdFx0Y29uc3QgcGxheWVyU3RhcnRUb3AgPSBwbGF5ZXJDZW50ZXJIZWlnaHQgLSBwbGF5ZXJTaGlmdEFtdCArIGFkalRvQm90QW10O1xyXG5cdFx0XHRjb25zdCBwbGF5ZXJFbmRCb3R0b20gPSBwbGF5ZXJDZW50ZXJIZWlnaHQgKyBwbGF5ZXJTaGlmdEFtdCArIGFkalRvQm90QW10O1xyXG5cclxuXHRcdFx0bGV0IHdhbGxEYXJrbmVzcyA9IHJheUwgLyB0aGlzLndvcmxkM2QuaGVpZ2h0O1xyXG5cdFx0XHR3YWxsRGFya25lc3MgPSAodGhpcy53b3JsZDNkRGlhZyAtIHJheUwpIC8gdGhpcy53b3JsZDNkRGlhZztcclxuXHJcblx0XHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoJHsyNTUgKiB3YWxsRGFya25lc3N9LCR7MTAwICogd2FsbERhcmtuZXNzfSwkezAgKiB3YWxsRGFya25lc3N9LDEpYDtcclxuXHJcblx0XHRcdHRoaXMuY3R4M2QuZmlsbFJlY3QoeCAtIHcgLyAyLCBwbGF5ZXJTdGFydFRvcCwgdywgcGxheWVyRW5kQm90dG9tIC0gcGxheWVyU3RhcnRUb3ApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wbGF5ZXIyZC50c1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wbGF5ZXJzLnRzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3R5cGVzLnRzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3dhbGxzMmQudHNcIik7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy93YWxsczNkLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9