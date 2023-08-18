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
    player2d = new _player2d__WEBPACK_IMPORTED_MODULE_0__["default"](world2d, ctx2d, walls2d.walls, walls2d.wallCols, walls2d.wallRows, walls2d.wallW, walls2d.wallH);
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
    function Player2d(world2d, ctx2d, walls, wallCols, wallRows, wallW, wallH) {
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
        this.rays = null;
        this.rayCoords = null;
        this.objectTypes = null;
        this.objectDirs = null;
        this.rayIncrement = 2;
        this.rayOpacity = 0.26;
        this.fov = 60;
        this.fovRad = this.fov * (Math.PI / 180);
        this.rotation = 90;
        this.angle = this.rotation + 90;
        this.distToProjectionPlane = world2d.width / 2 / Math.tan(this.fovRad / 2);
        this.rayAngles = null;
        this.rayDensityAdjustment = 12;
        this.rotDir = null;
        this.rotAmt = 2;
        this.moveDirFB = null;
        this.moveAmtStart = 2;
        this.moveAmt = 3;
        this.moveAmtTop = 3;
        this.moveDirStrafe = null;
        this.moveDirRays = {
            foreward: Infinity,
            left: Infinity,
            right: Infinity,
            backward: Infinity,
        };
        this.playerX = 800;
        this.playerY = 500;
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
            loop2: for (var j = 0; j < this.wallCols; j++) {
                var wall = this.walls[i * this.wallCols + j];
                if (wall === 0)
                    continue loop2;
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
            var offset2 = (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i + 1]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i + 1]) === 2
                ? rayCoords[(i + 1) * 2] % this.wallW
                : rayCoords[(i + 1) * 2 + 1] % this.wallH;
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
            // const sWidth =
            // 	objectDirs?.[i] === 0 || objectDirs?.[i] === 2
            // 		? this.wallTexture.width / offset
            // 		: this.wallTexture.height / offset;
            // console.log(offset);
            var sWidth = 0;
            if ((objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 2 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 3) {
                sWidth = offset2 >= 0 ? (offset <= offset2 ? offset2 - offset : this.wallW - offset + offset2) : 8;
            }
            else {
                // Not working right, don't know why
                sWidth = offset2 >= 0 ? (offset2 <= offset ? offset - offset2 : this.wallW - offset2 + offset) : 8;
                // console.log(offset, offset2, sWidth);
            }
            if ((objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 2) {
                this.ctx3d.drawImage(this.wallTexture, offset, 0, sWidth, this.wallTexture.height, wallX, wallStartTop, wallWidth, wallEndBottom - wallStartTop);
            }
            else {
                this.ctx3d.drawImage(this.wallTextureDark, offset, 0, sWidth, this.wallTextureDark.height, wallX, wallStartTop, wallWidth, wallEndBottom - wallStartTop);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFF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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9wbGF5ZXIyZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9wbGF5ZXJzLnRzIiwid2VicGFjazovL2Zwc19nYW1lLy4vc3JjL3dhbGxzMmQudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvd2FsbHMzZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWVyMmQgZnJvbSAnLi9wbGF5ZXIyZCc7XHJcbmltcG9ydCBQbGF5ZXJzIGZyb20gJy4vcGxheWVycyc7XHJcbmltcG9ydCB7IElTb2NrZXREYXRhUmVxLCBJU29ja2V0RGF0YVJlcyB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgV2FsbHMyZCBmcm9tICcuL3dhbGxzMmQnO1xyXG5pbXBvcnQgV2FsbHMzZCBmcm9tICcuL3dhbGxzM2QnO1xyXG5cclxuLy8gVXNlIHdzcyAoc2VjdXJlKSBpbnN0ZWFkIG9mIHdzIGZvciBwcm9kdWNpdG9uXHJcbmNvbnN0IHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjMwMDAvc2VydmVyJyk7XHJcblxyXG5jb25zdCB3b3JsZDJkID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3b3JsZDJkJyk7XHJcbmNvbnN0IHdvcmxkM2QgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dvcmxkM2QnKTtcclxuXHJcbmNvbnN0IGN0eDJkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDJkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcbmNvbnN0IGN0eDNkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDNkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcblxyXG5jb25zdCBmcHNFbGVtZW50ID0gPEhUTUxIZWFkaW5nRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnBzQ291bnRlcicpO1xyXG5cclxubGV0IHdhbGxzMmQ6IFdhbGxzMmQ7XHJcbmxldCB3YWxsczNkOiBXYWxsczNkO1xyXG5sZXQgcGxheWVyMmQ6IFBsYXllcjJkO1xyXG5sZXQgcGxheWVyczogUGxheWVycztcclxuXHJcbmxldCBmcHNJbnRlcnZhbDogbnVtYmVyLCBub3c6IG51bWJlciwgdGhlbjogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIsIHJlcXVlc3RJRDogbnVtYmVyO1xyXG5sZXQgZnJhbWVDb3VudDogbnVtYmVyID0gMDtcclxuY29uc3QgZnJhbWVSYXRlID0gNjA7XHJcblxyXG5sZXQgZGV2TW9kZSA9IHRydWU7XHJcblxyXG5sZXQgdXNlcklkOiBhbnk7XHJcbmxldCBsYXN0UmVjb3JkZWRQbGF5ZXJQb3MgPSB7XHJcblx0eDogMCxcclxuXHR5OiAwLFxyXG59O1xyXG5cclxuY29uc3Qgc2V0RnJhbWVyYXRlVmFsdWUgPSAoKSA9PiB7XHJcblx0ZnBzRWxlbWVudC5pbm5lclRleHQgPSBmcmFtZUNvdW50LnRvU3RyaW5nKCk7XHJcblx0ZnBzRWxlbWVudC5zdHlsZS5jb2xvciA9IGZyYW1lQ291bnQgPCBmcmFtZVJhdGUgPyAncmVkJyA6ICdyZ2IoMCwgMjU1LCAwKSc7XHJcblx0ZnJhbWVDb3VudCA9IDA7XHJcbn07XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9ICgpID0+IHtcclxuXHRyZXF1ZXN0SUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xyXG5cclxuXHRmcHNJbnRlcnZhbCA9IDEwMDAgLyBmcmFtZVJhdGU7XHJcblxyXG5cdG5vdyA9IERhdGUubm93KCk7XHJcblx0ZWxhcHNlZCA9IG5vdyAtIHRoZW47XHJcblxyXG5cdGlmIChlbGFwc2VkID4gZnBzSW50ZXJ2YWwpIHtcclxuXHRcdGlmIChmcmFtZUNvdW50ID09PSAwKSBzZXRUaW1lb3V0KHNldEZyYW1lcmF0ZVZhbHVlLCAxMDAwKTtcclxuXHRcdGZyYW1lQ291bnQgKz0gMTtcclxuXHRcdHRoZW4gPSBub3cgLSAoZWxhcHNlZCAlIGZwc0ludGVydmFsKTtcclxuXHJcblx0XHRjdHgyZC5jbGVhclJlY3QoMCwgMCwgd29ybGQyZC53aWR0aCwgd29ybGQyZC5oZWlnaHQpO1xyXG5cdFx0Y3R4M2QuY2xlYXJSZWN0KDAsIDAsIHdvcmxkM2Qud2lkdGgsIHdvcmxkM2QuaGVpZ2h0KTtcclxuXHJcblx0XHR3YWxsczJkLmRyYXcoKTtcclxuXHRcdHBsYXllcnMuZHJhdygpO1xyXG5cdFx0cGxheWVyMmQuZHJhdyhwbGF5ZXJzLnBsYXllcnMpO1xyXG5cdFx0d2FsbHMzZC5zZXRiZ1RvcFgocGxheWVyMmQucm90QW10LCBwbGF5ZXIyZC5yb3REaXIpO1xyXG5cdFx0d2FsbHMzZC5kcmF3KFxyXG5cdFx0XHRwbGF5ZXIyZC5yYXlzLFxyXG5cdFx0XHRwbGF5ZXIyZC5yYXlDb29yZHMsXHJcblx0XHRcdHBsYXllcjJkLm9iamVjdFR5cGVzLFxyXG5cdFx0XHRwbGF5ZXIyZC5vYmplY3REaXJzLFxyXG5cdFx0XHRwbGF5ZXIyZC5wbGF5ZXJYLFxyXG5cdFx0XHRwbGF5ZXIyZC5wbGF5ZXJZLFxyXG5cdFx0XHRwbGF5ZXIyZC5yYXlBbmdsZXMsXHJcblx0XHRcdHBsYXllcjJkLnBsYXllclJheXMsXHJcblx0XHRcdHBsYXllcjJkLnBsYXllcldcclxuXHRcdCk7XHJcblxyXG5cdFx0b25lOiBpZiAocGxheWVyMmQucGxheWVyWCAhPT0gbGFzdFJlY29yZGVkUGxheWVyUG9zLnggfHwgcGxheWVyMmQucGxheWVyWSAhPT0gbGFzdFJlY29yZGVkUGxheWVyUG9zLnkpIHtcclxuXHRcdFx0bGFzdFJlY29yZGVkUGxheWVyUG9zLnggPSBwbGF5ZXIyZC5wbGF5ZXJYO1xyXG5cdFx0XHRsYXN0UmVjb3JkZWRQbGF5ZXJQb3MueSA9IHBsYXllcjJkLnBsYXllclk7XHJcblxyXG5cdFx0XHRpZiAoIXVzZXJJZCkgYnJlYWsgb25lO1xyXG5cclxuXHRcdFx0Y29uc3QgZGF0YTogSVNvY2tldERhdGFSZXEgPSB7XHJcblx0XHRcdFx0YWN0aW9uOiAndXBkYXRlLXBsYXllci1wb3MnLFxyXG5cdFx0XHRcdGlkOiB1c2VySWQsXHJcblx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0eDogbGFzdFJlY29yZGVkUGxheWVyUG9zLngsXHJcblx0XHRcdFx0XHR5OiBsYXN0UmVjb3JkZWRQbGF5ZXJQb3MueSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoMCwyNTUsMCwxKWA7XHJcblx0XHRjdHgzZC5saW5lV2lkdGggPSAyO1xyXG5cdFx0Y3R4M2QuYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgzZC5lbGxpcHNlKHdvcmxkM2Qud2lkdGggLyAyLCB3b3JsZDNkLmhlaWdodCAvIDIuNSwgNSwgNSwgMCwgMCwgMiAqIE1hdGguUEkpO1xyXG5cdFx0Y3R4M2QuZmlsbCgpO1xyXG5cdH1cclxufTtcclxuXHJcbmNvbnN0IHNldFVwID0gKCkgPT4ge1xyXG5cdHdhbGxzMmQgPSBuZXcgV2FsbHMyZCh3b3JsZDJkLCBjdHgyZCk7XHJcblx0d2FsbHMzZCA9IG5ldyBXYWxsczNkKHdvcmxkM2QsIGN0eDNkLCB3YWxsczJkLndhbGxXLCB3YWxsczJkLndhbGxIKTtcclxuXHRwbGF5ZXIyZCA9IG5ldyBQbGF5ZXIyZChcclxuXHRcdHdvcmxkMmQsXHJcblx0XHRjdHgyZCxcclxuXHRcdHdhbGxzMmQud2FsbHMsXHJcblx0XHR3YWxsczJkLndhbGxDb2xzLFxyXG5cdFx0d2FsbHMyZC53YWxsUm93cyxcclxuXHRcdHdhbGxzMmQud2FsbFcsXHJcblx0XHR3YWxsczJkLndhbGxIXHJcblx0KTtcclxuXHRwbGF5ZXIyZC5zZXRVcCgpO1xyXG5cdHBsYXllcnMgPSBuZXcgUGxheWVycyh3b3JsZDJkLCBjdHgyZCk7XHJcblx0Z2FtZUxvb3AoKTtcclxufTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcblx0dGhlbiA9IERhdGUubm93KCk7XHJcblx0c2V0VXAoKTtcclxufTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xyXG5cdGlmICghZGV2TW9kZSkge1xyXG5cdFx0cGxheWVyMmQuc2V0TW91c2VSb3RhdGlvbihlLm1vdmVtZW50WCAvIDIwKTtcclxuXHRcdHdhbGxzM2Quc2V0QmdUb3BYTW91c2VNb3ZlKGUubW92ZW1lbnRYKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG5cdC8vU2V0IG1vdmUgZm9yZXdhcmRzIGFuZCBiYWNrd2FyZHNcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5VycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIoJ2ZvcndhcmRzJyk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlTJykge1xyXG5cdFx0cGxheWVyMmQuc2V0TW92ZURpcignYmFja3dhcmRzJyk7XHJcblx0fVxyXG5cclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbignbGVmdCcpO1xyXG5cdFx0ZWxzZSBwbGF5ZXIyZC5zZXRTdHJhZmVEaXIoJ2xlZnQnKTtcclxuXHR9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleUQnKSB7XHJcblx0XHRpZiAoZGV2TW9kZSkgcGxheWVyMmQuc2V0Um90YXRpb24oJ3JpZ2h0Jyk7XHJcblx0XHRlbHNlIHBsYXllcjJkLnNldFN0cmFmZURpcigncmlnaHQnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuXHQvL1NldCBtb3ZlbWVudCB2YXJpYWJsZXMgdG8gbnVsbCB3aGVuIGtleSByZWxlYXNlZHtcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScgfHwgZS5jb2RlID09PSAnS2V5RCcpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbihudWxsKTtcclxuXHRcdGVsc2UgcGxheWVyMmQuc2V0U3RyYWZlRGlyKG51bGwpO1xyXG5cdH0gZWxzZSBpZiAoZS5jb2RlID09PSAnS2V5VycgfHwgZS5jb2RlID09PSAnS2V5UycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIobnVsbCk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlNJykge1xyXG5cdFx0ZGV2TW9kZSA9ICFkZXZNb2RlO1xyXG5cdFx0aWYgKCFkZXZNb2RlKSB7XHJcblx0XHRcdHdvcmxkMmQuY2xhc3NMaXN0LmFkZCgnZnVsbHNjcmVlbicpO1xyXG5cdFx0XHR3b3JsZDNkLmNsYXNzTGlzdC5hZGQoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0cGxheWVyMmQuZGV2TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHR3YWxsczJkLmRldk1vZGUgPSBmYWxzZTtcclxuXHRcdFx0d29ybGQzZC5yZXF1ZXN0UG9pbnRlckxvY2sgPVxyXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0XHRcdHdvcmxkM2QucmVxdWVzdFBvaW50ZXJMb2NrIHx8IHdvcmxkM2QubW96UmVxdWVzdFBvaW50ZXJMb2NrIHx8IHdvcmxkM2Qud2Via2l0UmVxdWVzdFBvaW50ZXJMb2NrO1xyXG5cdFx0XHQvL0B0cy1pZ25vcmVcclxuXHRcdFx0d29ybGQzZC5yZXF1ZXN0UG9pbnRlckxvY2soe1xyXG5cdFx0XHRcdHVuYWRqdXN0ZWRNb3ZlbWVudDogdHJ1ZSxcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR3b3JsZDJkLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0d29ybGQzZC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdHBsYXllcjJkLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0XHR3YWxsczJkLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2sgPVxyXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0XHRcdGRvY3VtZW50LmV4aXRQb2ludGVyTG9jayB8fCBkb2N1bWVudC5tb3pFeGl0UG9pbnRlckxvY2sgfHwgZG9jdW1lbnQud2Via2l0RXhpdFBvaW50ZXJMb2NrO1xyXG5cdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCAoKSA9PiB7XHJcblx0Y29uc29sZS5sb2coJ1VzZXIgY29ubmVjdGVkJyk7XHJcbn0pO1xyXG5cclxuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBldmVudCA9PiB7XHJcblx0Y29uc3QgcmVzOiBJU29ja2V0RGF0YVJlcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcblx0bGV0IGRhdGE6IElTb2NrZXREYXRhUmVxO1xyXG5cclxuXHRzd2l0Y2ggKHJlcz8uYWN0aW9uKSB7XHJcblx0XHRjYXNlICdzZXQtdXNlci1pZCc6XHJcblx0XHRcdGNvbnNvbGUubG9nKCdVc2VySWQgaGFzIGJlZW4gc2V0Jyk7XHJcblx0XHRcdHVzZXJJZCA9IHJlcy5kYXRhO1xyXG5cclxuXHRcdFx0aWYgKCF1c2VySWQpIHJldHVybjtcclxuXHRcdFx0ZGF0YSA9IHtcclxuXHRcdFx0XHRhY3Rpb246ICdzZW5kLXVzZXItdG8tY2xpZW50cycsXHJcblx0XHRcdFx0aWQ6IHVzZXJJZCxcclxuXHRcdFx0XHRkYXRhOiAnJyxcclxuXHRcdFx0fTtcclxuXHRcdFx0c29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3NlbmQtdXNlci10by1jbGllbnRzJzpcclxuXHRcdFx0cGxheWVycy5hZGRQbGF5ZXIocmVzLmRhdGEpO1xyXG5cclxuXHRcdFx0Ly8gaWYgKCF1c2VySWQpIHJldHVybjtcclxuXHRcdFx0Ly8gZGF0YSA9IHtcclxuXHRcdFx0Ly8gXHRhY3Rpb246ICdzZW5kLXVzZXItdG8tY2xpZW50cycsXHJcblx0XHRcdC8vIFx0aWQ6IHVzZXJJZCxcclxuXHRcdFx0Ly8gXHRkYXRhOiAnJyxcclxuXHRcdFx0Ly8gfTtcclxuXHRcdFx0Ly8gc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3VwZGF0ZS1wbGF5ZXItcG9zJzpcclxuXHRcdFx0cGxheWVycy51cGRhdGVQbGF5ZXJQb3MoeyBuYW1lOiByZXMuZGF0YS5wbGF5ZXJJZCwgeDogcmVzLmRhdGEueCwgeTogcmVzLmRhdGEueSB9KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICdyZW1vdmUtcGxheWVyJzpcclxuXHRcdFx0cGxheWVycy5yZW1vdmVQbGF5ZXIocmVzLmRhdGEpO1xyXG5cdFx0XHRicmVhaztcclxuXHR9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBJUGxheWVyLCBJUGxheWVyUmF5cyB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHByaXZhdGUgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHJpdmF0ZSB3YWxsQ29sczogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxXOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsSDogbnVtYmVyO1xyXG5cdHB1YmxpYyByYXlzOiBGbG9hdDMyQXJyYXkgfCBudWxsO1xyXG5cdHB1YmxpYyByYXlDb29yZHM6IEZsb2F0MzJBcnJheSB8IG51bGw7XHJcblx0cHVibGljIG9iamVjdFR5cGVzOiBVaW50OEFycmF5IHwgbnVsbDtcclxuXHRwdWJsaWMgb2JqZWN0RGlyczogVWludDhBcnJheSB8IG51bGw7XHJcblx0cHJpdmF0ZSByYXlJbmNyZW1lbnQ6IG51bWJlcjtcclxuXHRwcml2YXRlIHJheU9wYWNpdHk6IG51bWJlcjtcclxuXHRwcml2YXRlIGZvdjogbnVtYmVyO1xyXG5cdHByaXZhdGUgZm92UmFkOiBudW1iZXI7XHJcblx0cHVibGljIHJvdGF0aW9uOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBhbmdsZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgZGlzdFRvUHJvamVjdGlvblBsYW5lOiBudW1iZXI7XHJcblx0cHVibGljIHJheUFuZ2xlczogRmxvYXQzMkFycmF5IHwgbnVsbDtcclxuXHRwcml2YXRlIHJheURlbnNpdHlBZGp1c3RtZW50OiBudW1iZXI7XHJcblx0cHVibGljIHJvdERpcjogc3RyaW5nIHwgbnVsbDtcclxuXHRwdWJsaWMgcm90QW10OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBtb3ZlRGlyRkI6IHN0cmluZyB8IG51bGw7XHJcblx0cHJpdmF0ZSBtb3ZlQW10U3RhcnQ6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVBbXQ6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVBbXRUb3A6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVEaXJTdHJhZmU6IHN0cmluZyB8IG51bGw7XHJcblx0cHJpdmF0ZSBtb3ZlRGlyUmF5czoge1xyXG5cdFx0Zm9yZXdhcmQ6IG51bWJlcjtcclxuXHRcdGxlZnQ6IG51bWJlcjtcclxuXHRcdHJpZ2h0OiBudW1iZXI7XHJcblx0XHRiYWNrd2FyZDogbnVtYmVyO1xyXG5cdH07XHJcblx0cHVibGljIHBsYXllclg6IG51bWJlcjtcclxuXHRwdWJsaWMgcGxheWVyWTogbnVtYmVyO1xyXG5cdHB1YmxpYyBkZXZNb2RlOiBib29sZWFuO1xyXG5cdHB1YmxpYyBwbGF5ZXJSYXlzOiBJUGxheWVyUmF5c1tdO1xyXG5cdHB1YmxpYyBwbGF5ZXJXOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKFxyXG5cdFx0d29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsXHJcblx0XHRjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG5cdFx0d2FsbHM6IFVpbnQ4QXJyYXksXHJcblx0XHR3YWxsQ29sczogbnVtYmVyLFxyXG5cdFx0d2FsbFJvd3M6IG51bWJlcixcclxuXHRcdHdhbGxXOiBudW1iZXIsXHJcblx0XHR3YWxsSDogbnVtYmVyXHJcblx0KSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy53YWxscyA9IHdhbGxzO1xyXG5cdFx0dGhpcy53YWxsQ29scyA9IHdhbGxDb2xzO1xyXG5cdFx0dGhpcy53YWxsUm93cyA9IHdhbGxSb3dzO1xyXG5cdFx0dGhpcy53YWxsVyA9IHdhbGxXO1xyXG5cdFx0dGhpcy53YWxsSCA9IHdhbGxIO1xyXG5cdFx0dGhpcy5yYXlzID0gbnVsbDtcclxuXHRcdHRoaXMucmF5Q29vcmRzID0gbnVsbDtcclxuXHRcdHRoaXMub2JqZWN0VHlwZXMgPSBudWxsO1xyXG5cdFx0dGhpcy5vYmplY3REaXJzID0gbnVsbDtcclxuXHRcdHRoaXMucmF5SW5jcmVtZW50ID0gMjtcclxuXHRcdHRoaXMucmF5T3BhY2l0eSA9IDAuMjY7XHJcblx0XHR0aGlzLmZvdiA9IDYwO1xyXG5cdFx0dGhpcy5mb3ZSYWQgPSB0aGlzLmZvdiAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdHRoaXMucm90YXRpb24gPSA5MDtcclxuXHRcdHRoaXMuYW5nbGUgPSB0aGlzLnJvdGF0aW9uICsgOTA7XHJcblx0XHR0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSA9IHdvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHRcdHRoaXMucmF5QW5nbGVzID0gbnVsbDtcclxuXHRcdHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnQgPSAxMjtcclxuXHRcdHRoaXMucm90RGlyID0gbnVsbDtcclxuXHRcdHRoaXMucm90QW10ID0gMjtcclxuXHRcdHRoaXMubW92ZURpckZCID0gbnVsbDtcclxuXHRcdHRoaXMubW92ZUFtdFN0YXJ0ID0gMjtcclxuXHRcdHRoaXMubW92ZUFtdCA9IDM7XHJcblx0XHR0aGlzLm1vdmVBbXRUb3AgPSAzO1xyXG5cdFx0dGhpcy5tb3ZlRGlyU3RyYWZlID0gbnVsbDtcclxuXHRcdHRoaXMubW92ZURpclJheXMgPSB7XHJcblx0XHRcdGZvcmV3YXJkOiBJbmZpbml0eSxcclxuXHRcdFx0bGVmdDogSW5maW5pdHksXHJcblx0XHRcdHJpZ2h0OiBJbmZpbml0eSxcclxuXHRcdFx0YmFja3dhcmQ6IEluZmluaXR5LFxyXG5cdFx0fTtcclxuXHRcdHRoaXMucGxheWVyWCA9IDgwMDtcclxuXHRcdHRoaXMucGxheWVyWSA9IDUwMDtcclxuXHRcdHRoaXMuZGV2TW9kZSA9IHRydWU7XHJcblx0XHR0aGlzLnBsYXllclJheXMgPSBbXTtcclxuXHRcdHRoaXMucGxheWVyVyA9IDIwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFVwKCkge1xyXG5cdFx0dGhpcy5zZXRBbmdsZXMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRSb3RhdGlvbihkaXI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdC8vIGlmICh0aGlzLnJvdERpciA9PT0gbnVsbCkge1xyXG5cdFx0Ly8gXHR0aGlzLnJvdEFtdCA9IDI7XHJcblx0XHQvLyB9XHJcblx0XHR0aGlzLnJvdERpciA9IGRpcjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRNb3VzZVJvdGF0aW9uKGFtdDogbnVtYmVyKSB7XHJcblx0XHR0aGlzLnJvdGF0aW9uICs9IGFtdDtcclxuXHRcdHRoaXMuYW5nbGUgKz0gYW10O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFN0cmFmZURpcihkaXI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdGlmICh0aGlzLm1vdmVEaXJTdHJhZmUgPT09IG51bGwpIHtcclxuXHRcdFx0dGhpcy5tb3ZlQW10ID0gdGhpcy5tb3ZlQW10U3RhcnQ7XHJcblx0XHR9XHJcblx0XHR0aGlzLm1vdmVEaXJTdHJhZmUgPSBkaXI7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHJvdGF0ZSgpIHtcclxuXHRcdC8vIGlmICh0aGlzLnJvdEFtdCA8IHRoaXMucm90QW10KSB7XHJcblx0XHQvLyBcdHRoaXMucm90QW10ICs9IDAuMTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHRpZiAodGhpcy5yb3REaXIgPT09ICdsZWZ0Jykge1xyXG5cdFx0XHR0aGlzLnJvdGF0aW9uIC09IHRoaXMucm90QW10O1xyXG5cdFx0XHR0aGlzLmFuZ2xlIC09IHRoaXMucm90QW10O1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnJvdERpciA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHR0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90QW10O1xyXG5cdFx0XHR0aGlzLmFuZ2xlICs9IHRoaXMucm90QW10O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldE1vdmVEaXIoZGlyOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHRpZiAodGhpcy5tb3ZlRGlyRkIgPT09IG51bGwpIHtcclxuXHRcdFx0dGhpcy5tb3ZlQW10ID0gdGhpcy5tb3ZlQW10U3RhcnQ7XHJcblx0XHR9XHJcblx0XHR0aGlzLm1vdmVEaXJGQiA9IGRpcjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgbW92ZSgpIHtcclxuXHRcdGlmICghdGhpcz8ucmF5cz8ubGVuZ3RoKSByZXR1cm47XHJcblx0XHR0aGlzLnJvdGF0ZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLm1vdmVBbXQgPCB0aGlzLm1vdmVBbXRUb3ApIHRoaXMubW92ZUFtdCArPSAwLjA1O1xyXG5cclxuXHRcdGNvbnN0IGRpclJhZGlhbnMgPSB0aGlzLmFuZ2xlICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0Y29uc3QgbW92ZVggPSB0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyg5MCAqIChNYXRoLlBJIC8gMTgwKSAtIGRpclJhZGlhbnMpO1xyXG5cdFx0Y29uc3QgbW92ZVkgPSB0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyhkaXJSYWRpYW5zKTtcclxuXHRcdGNvbnN0IGRpclJhZGlhbnNTdHJhZmUgPSBkaXJSYWRpYW5zICsgTWF0aC5QSSAvIDI7XHJcblx0XHRjb25zdCBzdHJhZmVYID0gKHRoaXMubW92ZUFtdCAqIE1hdGguY29zKDkwICogKE1hdGguUEkgLyAxODApIC0gZGlyUmFkaWFuc1N0cmFmZSkpIC8gMjtcclxuXHRcdGNvbnN0IHN0cmFmZVkgPSAodGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoZGlyUmFkaWFuc1N0cmFmZSkpIC8gMjtcclxuXHRcdGNvbnN0IGhpdHRpbmdGID0gdGhpcy5tb3ZlRGlyUmF5cy5mb3Jld2FyZCA8IDE0O1xyXG5cdFx0Y29uc3QgaGl0dGluZ0wgPSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPCAxNDtcclxuXHRcdGNvbnN0IGhpdHRpbmdSID0gdGhpcy5tb3ZlRGlyUmF5cy5yaWdodCA8IDE0O1xyXG5cdFx0Y29uc3QgaGl0dGluZ0IgPSB0aGlzLm1vdmVEaXJSYXlzLmJhY2t3YXJkIDwgMTQ7XHJcblxyXG5cdFx0aWYgKHRoaXMubW92ZURpckZCID09PSAnZm9yd2FyZHMnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0YpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gbW92ZVg7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IG1vdmVZO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMubW92ZURpckZCID09PSAnYmFja3dhcmRzJykge1xyXG5cdFx0XHRpZiAoIWhpdHRpbmdCKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJYIC09IG1vdmVYO1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWSArPSBtb3ZlWTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubW92ZURpclN0cmFmZSA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0wpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggLT0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdMKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZICs9IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5tb3ZlRGlyU3RyYWZlID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ1IpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdSKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc2V0QW5nbGVzKCkge1xyXG5cdFx0Y29uc3QgYW5nbGVBcnJMZW5ndGggPSBNYXRoLmNlaWwoXHJcblx0XHRcdCh0aGlzLndvcmxkMmQud2lkdGggKyB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50KSAvIHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnRcclxuXHRcdCk7XHJcblx0XHR0aGlzLnJheUFuZ2xlcyA9IG5ldyBGbG9hdDMyQXJyYXkoYW5nbGVBcnJMZW5ndGgpO1xyXG5cdFx0dGhpcy5kaXN0VG9Qcm9qZWN0aW9uUGxhbmUgPSB0aGlzLndvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHJcblx0XHRsZXQgeCA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFuZ2xlQXJyTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy5yYXlBbmdsZXNbaV0gPSBNYXRoLmF0YW4oKHggLSB0aGlzLndvcmxkMmQud2lkdGggLyAyKSAvIHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lKTtcclxuXHRcdFx0eCArPSB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMucmF5cyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5yYXlBbmdsZXMubGVuZ3RoKTtcclxuXHRcdHRoaXMucmF5Q29vcmRzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGggKiAyKTtcclxuXHRcdHRoaXMub2JqZWN0VHlwZXMgPSBuZXcgVWludDhBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGgpO1xyXG5cdFx0dGhpcy5vYmplY3REaXJzID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5yYXlBbmdsZXMubGVuZ3RoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0SW50ZXJzZWN0aW9uID0gKFxyXG5cdFx0eDogbnVtYmVyLFxyXG5cdFx0eTogbnVtYmVyLFxyXG5cdFx0cjogbnVtYmVyLFxyXG5cdFx0dGhldGE6IG51bWJlcixcclxuXHRcdHgxOiBudW1iZXIsXHJcblx0XHR5MTogbnVtYmVyLFxyXG5cdFx0eDI6IG51bWJlcixcclxuXHRcdHkyOiBudW1iZXIsXHJcblx0XHRyb3Q6IG51bWJlcixcclxuXHRcdHA0PzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9XHJcblx0KSA9PiB7XHJcblx0XHRjb25zdCBhZGp1c3RlZEFuZ2xlID0gdGhldGEgKyByb3QgKiAoTWF0aC5QSSAvIDE4MCk7XHJcblx0XHRjb25zdCB4MyA9IHg7XHJcblx0XHRjb25zdCB5MyA9IHk7XHJcblx0XHRsZXQgeDQ7XHJcblx0XHRsZXQgeTQ7XHJcblx0XHRsZXQgdU1heCA9IEluZmluaXR5O1xyXG5cdFx0aWYgKHA0Py54ICYmIHA0Py55KSB7XHJcblx0XHRcdHg0ID0gcDQueDtcclxuXHRcdFx0eTQgPSBwNC55O1xyXG5cdFx0XHR1TWF4ID0gMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHg0ID0geCArIHIgKiBNYXRoLmNvcyhhZGp1c3RlZEFuZ2xlKTtcclxuXHRcdFx0eTQgPSB5ICsgciAqIE1hdGguc2luKGFkanVzdGVkQW5nbGUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGRlbm9tID0gKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpO1xyXG5cclxuXHRcdGlmIChkZW5vbSA9PSAwKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHQgPSAoKHgxIC0geDMpICogKHkzIC0geTQpIC0gKHkxIC0geTMpICogKHgzIC0geDQpKSAvIGRlbm9tO1xyXG5cdFx0Y29uc3QgdSA9ICgoeDEgLSB4MykgKiAoeTEgLSB5MikgLSAoeTEgLSB5MykgKiAoeDEgLSB4MikpIC8gZGVub207XHJcblx0XHRpZiAodCA+PSAwICYmIHQgPD0gMSAmJiB1ID49IDAgJiYgdSA8PSB1TWF4KSB7XHJcblx0XHRcdGNvbnN0IHB4ID0geDMgKyB1ICogKHg0IC0geDMpO1xyXG5cdFx0XHRjb25zdCBweSA9IHkzICsgdSAqICh5NCAtIHkzKTtcclxuXHRcdFx0cmV0dXJuIFtweCwgcHldO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHByaXZhdGUgZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoXHJcblx0XHRqOiBudW1iZXIsXHJcblx0XHRrOiBudW1iZXIsXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHRyYXlBbmdsZTogbnVtYmVyLFxyXG5cdFx0cm90YXRpb246IG51bWJlcixcclxuXHRcdHA0PzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9XHJcblx0KSB7XHJcblx0XHRjb25zdCByID0gMTtcclxuXHRcdGNvbnN0IHgxID0gayAqIHRoaXMud2FsbFc7XHJcblx0XHRjb25zdCB5MSA9IGogKiB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGNvbnN0IHgyID0geDEgKyB0aGlzLndhbGxXO1xyXG5cdFx0Y29uc3QgeTIgPSB5MTtcclxuXHJcblx0XHRjb25zdCB4MyA9IHgxICsgdGhpcy53YWxsVztcclxuXHRcdGNvbnN0IHkzID0geTEgKyB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGNvbnN0IHg0ID0geDE7XHJcblx0XHRjb25zdCB5NCA9IHkxICsgdGhpcy53YWxsSDtcclxuXHJcblx0XHRsZXQgcmVjb3JkID0gSW5maW5pdHk7XHJcblx0XHRsZXQgY2xvc2VzdCA9IG51bGw7XHJcblx0XHRsZXQgZGlyID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBuID0gMDsgbiA8IDQ7IG4rKykge1xyXG5cdFx0XHRzd2l0Y2ggKG4pIHtcclxuXHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25Ub3AgPSB0aGlzLmdldEludGVyc2VjdGlvbih4LCB5LCByLCByYXlBbmdsZSwgeDEsIHkxLCB4MiwgeTIsIHJvdGF0aW9uLCBwNCk7XHJcblx0XHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uVG9wKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGludGVyc2VjdGlvblRvcFswXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGludGVyc2VjdGlvblRvcFsxXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQgPSBNYXRoLm1pbihkLCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0XHRpZiAoZCA8PSByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHRcdFx0XHRcdGNsb3Nlc3QgPSBpbnRlcnNlY3Rpb25Ub3A7XHJcblx0XHRcdFx0XHRcdFx0ZGlyID0gMDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvblJpZ2h0ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgcmF5QW5nbGUsIHgyLCB5MiwgeDMsIHkzLCByb3RhdGlvbiwgcDQpO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvblJpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGludGVyc2VjdGlvblJpZ2h0WzBdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uUmlnaHRbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uUmlnaHQ7XHJcblx0XHRcdFx0XHRcdFx0ZGlyID0gMTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uQm90ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgcmF5QW5nbGUsIHgzLCB5MywgeDQsIHk0LCByb3RhdGlvbiwgcDQpO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvbkJvdCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25Cb3RbMF0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBpbnRlcnNlY3Rpb25Cb3RbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uQm90O1xyXG5cdFx0XHRcdFx0XHRcdGRpciA9IDI7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbkxlZnQgPSB0aGlzLmdldEludGVyc2VjdGlvbih4LCB5LCByLCByYXlBbmdsZSwgeDQsIHk0LCB4MSwgeTEsIHJvdGF0aW9uLCBwNCk7XHJcblx0XHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uTGVmdCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25MZWZ0WzBdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uTGVmdFsxXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQgPSBNYXRoLm1pbihkLCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0XHRpZiAoZCA8PSByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHRcdFx0XHRcdGNsb3Nlc3QgPSBpbnRlcnNlY3Rpb25MZWZ0O1xyXG5cdFx0XHRcdFx0XHRcdGRpciA9IDM7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVjb3JkLFxyXG5cdFx0XHRjbG9zZXN0LFxyXG5cdFx0XHRkaXIsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRSYXlBbmdsZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKSB7XHJcblx0XHRsZXQgcmF5QW5nID1cclxuXHRcdFx0eDIgLSB4MSA8IDBcclxuXHRcdFx0XHQ/IDI3MCAtIChNYXRoLmF0YW4oKHkyIC0geTEpIC8gLSh4MiAtIHgxKSkgKiAxODApIC8gTWF0aC5QSVxyXG5cdFx0XHRcdDogOTAgKyAoTWF0aC5hdGFuKCh5MiAtIHkxKSAvICh4MiAtIHgxKSkgKiAxODApIC8gTWF0aC5QSTtcclxuXHRcdHJheUFuZyA9ICgoKHJheUFuZyAtIDkwKSAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cclxuXHRcdHJldHVybiByYXlBbmc7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldFBlcmNBY3JTY3JlZW4oXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHRweDogbnVtYmVyLFxyXG5cdFx0cHk6IG51bWJlcixcclxuXHRcdHJvdGF0aW9uOiBudW1iZXIsXHJcblx0XHRpc1Nwcml0ZTogYm9vbGVhblxyXG5cdCkge1xyXG5cdFx0Y29uc3QgcmF5QW5nID0gdGhpcy5nZXRSYXlBbmdsZSh4LCB5LCBweCwgcHkpO1xyXG5cclxuXHRcdGxldCByYXlSb3REaWZmID0gcmF5QW5nIC0gcm90YXRpb247XHJcblxyXG5cdFx0aWYgKE1hdGguYWJzKHJheVJvdERpZmYpID4gdGhpcy5mb3YgLyAyKSB7XHJcblx0XHRcdHJheVJvdERpZmYgPSByYXlSb3REaWZmID49IDAgPyByYXlSb3REaWZmIC0gMzYwIDogMzYwICsgcmF5Um90RGlmZjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwZXJjQWNyU2NyZWVuID0gcmF5Um90RGlmZiAvIHRoaXMuZm92ICsgMC41O1xyXG5cclxuXHRcdHJldHVybiBwZXJjQWNyU2NyZWVuO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcocGxheWVyczogSVBsYXllcltdKSB7XHJcblx0XHRjb25zdCB4ID0gdGhpcy5wbGF5ZXJYO1xyXG5cdFx0Y29uc3QgeSA9IHRoaXMucGxheWVyWTtcclxuXHJcblx0XHR0aGlzLnBsYXllclJheXMgPSBbXTtcclxuXHJcblx0XHR0aGlzLm1vdmUoKTtcclxuXHJcblx0XHRpZiAoIXRoaXMucmF5QW5nbGVzIHx8ICF0aGlzLnJheXMpIHJldHVybjtcclxuXHRcdGNvbnN0IHJvdGF0aW9uID0gKCh0aGlzLnJvdGF0aW9uICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblxyXG5cdFx0bGV0IG9ialR5cGVUZW1wID0gMDtcclxuXHRcdGxldCBvYmpEaXJUZW1wID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmF5QW5nbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBjbG9zZXN0ID0gbnVsbDtcclxuXHRcdFx0bGV0IHJlY29yZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxSb3dzOyBqKyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IHRoaXMud2FsbENvbHM7IGsrKykge1xyXG5cdFx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaiAqIHRoaXMud2FsbENvbHMgKyBrXTtcclxuXHRcdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCByZWN0SW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0XHRcdGRpcjogbnVtYmVyO1xyXG5cdFx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaiwgaywgeCwgeSwgdGhpcy5yYXlBbmdsZXNbaV0sIHJvdGF0aW9uKTtcclxuXHJcblx0XHRcdFx0XHRpZiAocmVjdEludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gcmVjdEludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRcdGNsb3Nlc3QgPSByZWN0SW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblxyXG5cdFx0XHRcdFx0XHRvYmpUeXBlVGVtcCA9IHdhbGw7XHJcblx0XHRcdFx0XHRcdG9iakRpclRlbXAgPSByZWN0SW50ZXJzZWN0aW9uLmRpcjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjbG9zZXN0KSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZGV2TW9kZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubW92ZVRvKHgsIHkpO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5saW5lVG8oY2xvc2VzdFswXSwgY2xvc2VzdFsxXSk7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZVN0eWxlID0gYHJnYmEoMjU1LDI1NSwyNTUsJHt0aGlzLnJheU9wYWNpdHl9KWA7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5yYXlzW2ldID0gcmVjb3JkO1xyXG5cdFx0XHRcdGlmICh0aGlzLnJheUNvb3Jkcykge1xyXG5cdFx0XHRcdFx0dGhpcy5yYXlDb29yZHNbaSAqIDJdID0gY2xvc2VzdFswXTtcclxuXHRcdFx0XHRcdHRoaXMucmF5Q29vcmRzW2kgKiAyICsgMV0gPSBjbG9zZXN0WzFdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5vYmplY3RUeXBlcykgdGhpcy5vYmplY3RUeXBlc1tpXSA9IG9ialR5cGVUZW1wO1xyXG5cdFx0XHRcdGlmICh0aGlzLm9iamVjdERpcnMpIHRoaXMub2JqZWN0RGlyc1tpXSA9IG9iakRpclRlbXA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5yYXlzW2ldID0gSW5maW5pdHk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRsb29wMTogZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHAgPSBwbGF5ZXJzW2ldO1xyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2FsbFJvd3M7IGorKykge1xyXG5cdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy53YWxsQ29sczsgaysrKSB7XHJcblx0XHRcdFx0XHRjb25zdCB3YWxsID0gdGhpcy53YWxsc1tqICogdGhpcy53YWxsQ29scyArIGtdO1xyXG5cdFx0XHRcdFx0aWYgKHdhbGwgPT09IDApIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdGNvbnN0IHJlY3RJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRcdGNsb3Nlc3Q6IG51bWJlcltdIHwgbnVsbDtcclxuXHRcdFx0XHRcdFx0ZGlyOiBudW1iZXI7XHJcblx0XHRcdFx0XHR9ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChqLCBrLCB4LCB5LCAwLCByb3RhdGlvbiwgeyB4OiBwLngsIHk6IHAueSB9KTtcclxuXHJcblx0XHRcdFx0XHRpZiAocmVjdEludGVyc2VjdGlvbj8uY2xvc2VzdD8uWzBdKSBjb250aW51ZSBsb29wMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIHAueCk7XHJcblx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIHAueSk7XHJcblx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuXHRcdFx0Y29uc3QgZGVsdGFEID0gdGhpcy5wbGF5ZXJXIC8gMjtcclxuXHRcdFx0Y29uc3Qgc2xvcGUgPSAocC55IC0gdGhpcy5wbGF5ZXJZKSAvIChwLnggLSB0aGlzLnBsYXllclgpO1xyXG5cdFx0XHRjb25zdCBwZXJwU2xvcGUgPSAtKDEgLyBzbG9wZSk7XHJcblx0XHRcdGNvbnN0IGFuZ2xlID0gTWF0aC5hdGFuKHBlcnBTbG9wZSk7XHJcblx0XHRcdGNvbnN0IHgxID0gcC54ICsgZGVsdGFEICogTWF0aC5jb3MoYW5nbGUpO1xyXG5cdFx0XHRjb25zdCB5MSA9IHAueSArIGRlbHRhRCAqIE1hdGguc2luKGFuZ2xlKTtcclxuXHRcdFx0Y29uc3QgeDIgPSBwLnggLSBkZWx0YUQgKiBNYXRoLmNvcyhhbmdsZSk7XHJcblx0XHRcdGNvbnN0IHkyID0gcC55IC0gZGVsdGFEICogTWF0aC5zaW4oYW5nbGUpO1xyXG5cclxuXHRcdFx0Y29uc3QgcGVyY0FjclNjcmVlbjogbnVtYmVyID0gdGhpcy5nZXRQZXJjQWNyU2NyZWVuKHgsIHksIHAueCwgcC55LCByb3RhdGlvbiwgZmFsc2UpO1xyXG5cclxuXHRcdFx0Y29uc3QgYW5nbGVEZWcgPSB0aGlzLmdldFJheUFuZ2xlKHgsIHksIHAueCwgcC55KTtcclxuXHRcdFx0bGV0IHBlcmNBY3JTY3JlZW5MOiBudW1iZXIgPSAtMTtcclxuXHRcdFx0bGV0IHBlcmNBY3JTY3JlZW5SOiBudW1iZXIgPSAtMTtcclxuXHJcblx0XHRcdGlmIChhbmdsZURlZyA+PSAwICYmIGFuZ2xlRGVnIDw9IDE4MCkge1xyXG5cdFx0XHRcdHBlcmNBY3JTY3JlZW5MID0gdGhpcy5nZXRQZXJjQWNyU2NyZWVuKHgsIHksIHgxLCB5MSwgcm90YXRpb24sIHRydWUpO1xyXG5cdFx0XHRcdHBlcmNBY3JTY3JlZW5SID0gdGhpcy5nZXRQZXJjQWNyU2NyZWVuKHgsIHksIHgyLCB5Miwgcm90YXRpb24sIHRydWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHBlcmNBY3JTY3JlZW5MID0gdGhpcy5nZXRQZXJjQWNyU2NyZWVuKHgsIHksIHgyLCB5Miwgcm90YXRpb24sIHRydWUpO1xyXG5cdFx0XHRcdHBlcmNBY3JTY3JlZW5SID0gdGhpcy5nZXRQZXJjQWNyU2NyZWVuKHgsIHksIHgxLCB5MSwgcm90YXRpb24sIHRydWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoKHBlcmNBY3JTY3JlZW5MID49IDAgJiYgcGVyY0FjclNjcmVlbkwgPD0gMSkgfHwgKHBlcmNBY3JTY3JlZW5SID49IDAgJiYgcGVyY0FjclNjcmVlblIgPD0gMSkpIHtcclxuXHRcdFx0XHRpZiAocGVyY0FjclNjcmVlbkwgPj0gMCAmJiBwZXJjQWNyU2NyZWVuTCA8PSAxICYmIHBlcmNBY3JTY3JlZW5SID49IDAgJiYgcGVyY0FjclNjcmVlblIgPD0gMSkge1xyXG5cdFx0XHRcdFx0Y29uc3QgcGVyY0FjclNjcmVlbkx0ZW1wID0gcGVyY0FjclNjcmVlbkw7XHJcblx0XHRcdFx0XHRwZXJjQWNyU2NyZWVuTCA9IE1hdGgubWluKHBlcmNBY3JTY3JlZW5MLCBwZXJjQWNyU2NyZWVuUik7XHJcblx0XHRcdFx0XHRwZXJjQWNyU2NyZWVuUiA9IE1hdGgubWF4KHBlcmNBY3JTY3JlZW5MdGVtcCwgcGVyY0FjclNjcmVlblIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnBsYXllclJheXMucHVzaCh7XHJcblx0XHRcdFx0XHRsOiBkLFxyXG5cdFx0XHRcdFx0eDogcC54LFxyXG5cdFx0XHRcdFx0eTogcC55LFxyXG5cdFx0XHRcdFx0bmFtZTogcC5uYW1lLFxyXG5cdFx0XHRcdFx0cGVyY0Fjcm9zc1NjcmVlbjogcGVyY0FjclNjcmVlbixcclxuXHRcdFx0XHRcdHBlcmNBY3Jvc3NTY3JlZW4xOiBwZXJjQWNyU2NyZWVuTCxcclxuXHRcdFx0XHRcdHBlcmNBY3Jvc3NTY3JlZW4yOiBwZXJjQWNyU2NyZWVuUixcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuZGV2TW9kZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubW92ZVRvKHgsIHkpO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5saW5lVG8ocC54LCBwLnkpO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5zdHJva2VTdHlsZSA9IGByZ2JhKDI1NSwwLDAsMSlgO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5saW5lV2lkdGggPSAxO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5zdHJva2UoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmIChwZXJjQWNyU2NyZWVuID49IDAgJiYgcGVyY0FjclNjcmVlbiA8PSAxKSB7XHJcblx0XHRcdC8vIFx0dGhpcy5wbGF5ZXJSYXlzLnB1c2goe1xyXG5cdFx0XHQvLyBcdFx0bDogZCxcclxuXHRcdFx0Ly8gXHRcdHg6IHAueCxcclxuXHRcdFx0Ly8gXHRcdHk6IHAueSxcclxuXHRcdFx0Ly8gXHRcdG5hbWU6IHAubmFtZSxcclxuXHRcdFx0Ly8gXHRcdHBlcmNBY3Jvc3NTY3JlZW46IHBlcmNBY3JTY3JlZW4sXHJcblx0XHRcdC8vIFx0fSk7XHJcblx0XHRcdC8vIH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCByb3RhdGlvbkYgPSAoKHRoaXMucm90YXRpb24gJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHRcdGNvbnN0IHJvdGF0aW9uUiA9ICgoKHRoaXMucm90YXRpb24gKyA5MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHRcdGNvbnN0IHJvdGF0aW9uQiA9ICgoKHRoaXMucm90YXRpb24gKyAxODApICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblx0XHRjb25zdCByb3RhdGlvbkwgPSAoKCh0aGlzLnJvdGF0aW9uIC0gOTApICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RGID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRGID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RMID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRMID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RSID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRSID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RCID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRCID0gSW5maW5pdHk7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxSb3dzOyBpKyspIHtcclxuXHRcdFx0bG9vcDI6IGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsQ29sczsgaisrKSB7XHJcblx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaSAqIHRoaXMud2FsbENvbHMgKyBqXTtcclxuXHRcdFx0XHRpZiAod2FsbCA9PT0gMCkgY29udGludWUgbG9vcDI7XHJcblxyXG5cdFx0XHRcdGNvbnN0IGZJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGksIGosIHgsIHksIDAsIHJvdGF0aW9uRik7XHJcblx0XHRcdFx0aWYgKGZJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkRikge1xyXG5cdFx0XHRcdFx0cmVjb3JkRiA9IGZJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdEYgPSBmSW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBsSW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdGNsb3Nlc3Q6IG51bWJlcltdIHwgbnVsbDtcclxuXHRcdFx0XHR9ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChpLCBqLCB4LCB5LCAwLCByb3RhdGlvbkwpO1xyXG5cdFx0XHRcdGlmIChsSW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZEwpIHtcclxuXHRcdFx0XHRcdHJlY29yZEwgPSBsSW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdGNsb3Nlc3RMID0gbEludGVyc2VjdGlvbi5jbG9zZXN0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3QgckludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgMCwgcm90YXRpb25SKTtcclxuXHRcdFx0XHRpZiAockludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRSKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRSID0gckludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0UiA9IHJJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IGJJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGksIGosIHgsIHksIDAsIHJvdGF0aW9uQik7XHJcblx0XHRcdFx0aWYgKGJJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkQikge1xyXG5cdFx0XHRcdFx0cmVjb3JkQiA9IGJJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdEIgPSBiSW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RGKSB0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkID0gcmVjb3JkRjtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5mb3Jld2FyZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdGlmIChjbG9zZXN0TCkgdGhpcy5tb3ZlRGlyUmF5cy5sZWZ0ID0gcmVjb3JkTDtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5sZWZ0ID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RSKSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0ID0gcmVjb3JkUjtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5yaWdodCA9IEluZmluaXR5O1xyXG5cclxuXHRcdGlmIChjbG9zZXN0QikgdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA9IHJlY29yZEI7XHJcblx0XHRlbHNlIHRoaXMubW92ZURpclJheXMuYmFja3dhcmQgPSBJbmZpbml0eTtcclxuXHJcblx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9IGByZ2JhKDAsMjU1LDAsMSlgO1xyXG5cdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdHRoaXMuY3R4MmQuZWxsaXBzZSh0aGlzLnBsYXllclgsIHRoaXMucGxheWVyWSwgNiwgNiwgMCwgMCwgMiAqIE1hdGguUEkpO1xyXG5cdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IElQbGF5ZXIgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllcnMge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHB1YmxpYyBwbGF5ZXJzOiBJUGxheWVyW107XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy5wbGF5ZXJzID0gW107XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYWRkUGxheWVyKG5hbWU6IHN0cmluZykge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMucGxheWVyc1tpXS5uYW1lID09PSBuYW1lKSByZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXJzLnB1c2goe1xyXG5cdFx0XHRuYW1lOiBuYW1lLFxyXG5cdFx0XHR4OiB0aGlzLndvcmxkMmQud2lkdGggLyAyLFxyXG5cdFx0XHR5OiB0aGlzLndvcmxkMmQuaGVpZ2h0IC8gMixcclxuXHRcdH0pO1xyXG5cdFx0Y29uc29sZS5sb2coYCR7bmFtZX0gaGFzIGpvaW5lZCB0aGUgbWF0Y2hgKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZW1vdmVQbGF5ZXIobmFtZTogc3RyaW5nKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgUGxheWVyICR7bmFtZX0gaGFzIGxlZnQgdGhlIG1hdGNoYCk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJzW2ldLm5hbWUgPT09IG5hbWUpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllcnMuc3BsaWNlKGksIDEpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdXBkYXRlUGxheWVyUG9zKHA6IElQbGF5ZXIpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnBsYXllcnNbaV0ubmFtZSA9PT0gcC5uYW1lKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJzW2ldLnggPSBwLng7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJzW2ldLnkgPSBwLnk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXJzLnB1c2goe1xyXG5cdFx0XHRuYW1lOiBwLm5hbWUsXHJcblx0XHRcdHg6IHAueCxcclxuXHRcdFx0eTogcC55LFxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZHJhdygpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHAgPSB0aGlzLnBsYXllcnNbaV07XHJcblxyXG5cdFx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9ICdyZWQnO1xyXG5cdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHR0aGlzLmN0eDJkLmVsbGlwc2UocC54LCBwLnksIDYsIDYsIDIgKiBNYXRoLlBJLCAwLCAyICogTWF0aC5QSSk7XHJcblx0XHRcdHRoaXMuY3R4MmQuZmlsbCgpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxsczJkIHtcclxuXHRwcml2YXRlIHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cdHByaXZhdGUgY3R4MmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHRwdWJsaWMgd2FsbENvbHM6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHVibGljIHdhbGxXOiBudW1iZXI7XHJcblx0cHVibGljIHdhbGxIOiBudW1iZXI7XHJcblx0cHVibGljIGRldk1vZGU6IGJvb2xlYW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy53YWxsQ29scyA9IDMyO1xyXG5cdFx0dGhpcy53YWxsUm93cyA9IDE4O1xyXG5cdFx0dGhpcy53YWxscyA9IG5ldyBVaW50OEFycmF5KFxyXG5cdFx0XHRbXHJcblx0XHRcdFx0WzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDEsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAxLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAxLCAwLCAwLCAxLCAxLCAxLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAwLCAxLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDEsIDEsIDEsIDEsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAxLCAxLCAxLCAxLCAwLCAxLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDEsIDEsIDEsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMiwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDEsIDEsIDEsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcblx0XHRcdF0uZmxhdCgpXHJcblx0XHQpO1xyXG5cdFx0dGhpcy53YWxsVyA9IHRoaXMud29ybGQyZC53aWR0aCAvIHRoaXMud2FsbENvbHM7XHJcblx0XHR0aGlzLndhbGxIID0gdGhpcy53b3JsZDJkLmhlaWdodCAvIHRoaXMud2FsbFJvd3M7XHJcblx0XHR0aGlzLmRldk1vZGUgPSB0cnVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcoKSB7XHJcblx0XHRpZiAodGhpcy5kZXZNb2RlKSB7XHJcblx0XHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53YWxsUm93czsgaSsrKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxDb2xzOyBqKyspIHtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gJ3JnYigxMDAsIDEwMCwgMTAwKSc7XHJcblx0XHRcdFx0XHRjb25zdCB3YWxsID0gdGhpcy53YWxsc1tpICogdGhpcy53YWxsQ29scyArIGpdO1xyXG5cclxuXHRcdFx0XHRcdHN3aXRjaCAod2FsbCkge1xyXG5cdFx0XHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3R4MmQucmVjdChqICogdGhpcy53YWxsVywgaSAqIHRoaXMud2FsbEgsIHRoaXMud2FsbFcsIHRoaXMud2FsbEgpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuZmlsbCgpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnJlY3QoaiAqIHRoaXMud2FsbFcsIGkgKiB0aGlzLndhbGxILCB0aGlzLndhbGxXLCB0aGlzLndhbGxIKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmZpbGwoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvdW50Kys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IElQbGF5ZXJSYXlzIH0gZnJvbSAnLi90eXBlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxsczNkIHtcclxuXHRwcml2YXRlIHdvcmxkM2Q6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cdHByaXZhdGUgY3R4M2Q6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHRwcml2YXRlIHdhbGxXOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsSDogbnVtYmVyO1xyXG5cdHByaXZhdGUgd29ybGQzZERpYWc6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxUZXh0dXJlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cdHByaXZhdGUgd2FsbFRleHR1cmVEYXJrOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cdHByaXZhdGUgYmdUb3BJbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcblx0cHJpdmF0ZSBiZ1RvcFg6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxDZW50ZXJIZWlnaHQ6IG51bWJlcjtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQzZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDNkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHdhbGxXOiBudW1iZXIsIHdhbGxIOiBudW1iZXIpIHtcclxuXHRcdHRoaXMud29ybGQzZCA9IHdvcmxkM2Q7XHJcblx0XHR0aGlzLmN0eDNkID0gY3R4M2Q7XHJcblx0XHR0aGlzLndhbGxXID0gd2FsbFc7XHJcblx0XHR0aGlzLndhbGxIID0gd2FsbEg7XHJcblx0XHR0aGlzLndvcmxkM2REaWFnID0gTWF0aC5zcXJ0KE1hdGgucG93KHdvcmxkM2Qud2lkdGgsIDIpICsgTWF0aC5wb3cod29ybGQzZC5oZWlnaHQsIDIpKTtcclxuXHRcdHRoaXMud2FsbFRleHR1cmUgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMud2FsbFRleHR1cmUuc3JjID0gJy4uL3B1YmxpYy9zdG9uZVRleHR1cmUucG5nJztcclxuXHRcdHRoaXMud2FsbFRleHR1cmVEYXJrID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLndhbGxUZXh0dXJlRGFyay5zcmMgPSAnLi4vcHVibGljL3N0b25lVGV4dHVyZURhcmsucG5nJztcclxuXHRcdHRoaXMuYmdUb3BJbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuYmdUb3BJbWcuc3JjID0gJy4uL3B1YmxpYy9zdGFycy5qcGcnO1xyXG5cdFx0dGhpcy5iZ1RvcFggPSAwO1xyXG5cdFx0dGhpcy53YWxsQ2VudGVySGVpZ2h0ID0gdGhpcy53b3JsZDNkLmhlaWdodCAvIDIuNTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZHJhd0JhY2tncm91bmQoKSB7XHJcblx0XHQvL211bHRpcGx5IGJnIGltZyB3aWR0aCBieSA0IHNvIHdoZW4geW91IHJvdGF0ZSA5MGRlZywgeW91J3JlIDEvNHRoIHRocm91Z2ggdGhlIGltZ1xyXG5cdFx0dGhpcy5iZ1RvcEltZy53aWR0aCA9IHRoaXMud29ybGQzZC53aWR0aCAqIDI7XHJcblx0XHR0aGlzLmJnVG9wSW1nLmhlaWdodCA9IHRoaXMud29ybGQzZC5oZWlnaHQ7XHJcblxyXG5cdFx0Ly9yZXNldCBiZyBpbWcgcG9zaXRpb24gaWYgZW5kcyBvZiBpbWcgYXJlIGluIHZpZXdcclxuXHRcdGlmICh0aGlzLmJnVG9wWCA+IDApIHtcclxuXHRcdFx0dGhpcy5iZ1RvcFggPSAtdGhpcy5iZ1RvcEltZy53aWR0aDtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5iZ1RvcFggPCAtdGhpcy5iZ1RvcEltZy53aWR0aCkge1xyXG5cdFx0XHR0aGlzLmJnVG9wWCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5jdHgzZC5kcmF3SW1hZ2UoXHJcblx0XHRcdHRoaXMuYmdUb3BJbWcsXHJcblx0XHRcdHRoaXMuYmdUb3BYLFxyXG5cdFx0XHR0aGlzLndhbGxDZW50ZXJIZWlnaHQsXHJcblx0XHRcdHRoaXMuYmdUb3BJbWcud2lkdGgsXHJcblx0XHRcdC10aGlzLmJnVG9wSW1nLmhlaWdodFxyXG5cdFx0KTtcclxuXHRcdHRoaXMuY3R4M2QuZHJhd0ltYWdlKFxyXG5cdFx0XHR0aGlzLmJnVG9wSW1nLFxyXG5cdFx0XHR0aGlzLmJnVG9wWCArIHRoaXMuYmdUb3BJbWcud2lkdGgsXHJcblx0XHRcdHRoaXMud2FsbENlbnRlckhlaWdodCxcclxuXHRcdFx0dGhpcy5iZ1RvcEltZy53aWR0aCxcclxuXHRcdFx0LXRoaXMuYmdUb3BJbWcuaGVpZ2h0XHJcblx0XHQpO1xyXG5cdFx0dGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiYSgwLDAsMCwwLjcpYDtcclxuXHRcdHRoaXMuY3R4M2QuZmlsbFJlY3QoMCwgMCwgdGhpcy53b3JsZDNkLndpZHRoLCB0aGlzLndhbGxDZW50ZXJIZWlnaHQpO1xyXG5cclxuXHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYigxNSwgMzUsIDE1KWA7XHJcblx0XHR0aGlzLmN0eDNkLmZpbGxSZWN0KFxyXG5cdFx0XHQwLFxyXG5cdFx0XHR0aGlzLndhbGxDZW50ZXJIZWlnaHQsXHJcblx0XHRcdHRoaXMud29ybGQzZC53aWR0aCxcclxuXHRcdFx0dGhpcy53b3JsZDNkLmhlaWdodCAtIHRoaXMud2FsbENlbnRlckhlaWdodFxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRCZ1RvcFhNb3VzZU1vdmUobW92ZURlbHRhOiBudW1iZXIpIHtcclxuXHRcdHRoaXMuYmdUb3BYIC09ICgodGhpcy5iZ1RvcEltZy53aWR0aCAvIDE4MCkgKiBtb3ZlRGVsdGEpIC8gMjA7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0YmdUb3BYKHJvdEFtdDogbnVtYmVyLCBtb3ZlRGlyTFI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdGNvbnN0IHhEZWx0YSA9ICh0aGlzLmJnVG9wSW1nLndpZHRoIC8gMTgwKSAqIHJvdEFtdDtcclxuXHRcdGlmIChtb3ZlRGlyTFIgPT09ICdsZWZ0Jykge1xyXG5cdFx0XHR0aGlzLmJnVG9wWCArPSB4RGVsdGE7XHJcblx0XHR9IGVsc2UgaWYgKG1vdmVEaXJMUiA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHR0aGlzLmJnVG9wWCAtPSB4RGVsdGE7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZHJhdyhcclxuXHRcdHJheXM6IEZsb2F0MzJBcnJheSB8IG51bGwsXHJcblx0XHRyYXlDb29yZHM6IEZsb2F0MzJBcnJheSB8IG51bGwsXHJcblx0XHRvYmplY3RUeXBlczogVWludDhBcnJheSB8IG51bGwsXHJcblx0XHRvYmplY3REaXJzOiBVaW50OEFycmF5IHwgbnVsbCxcclxuXHRcdHBYOiBudW1iZXIsXHJcblx0XHRwWTogbnVtYmVyLFxyXG5cdFx0cmF5QW5nbGVzOiBGbG9hdDMyQXJyYXkgfCBudWxsLFxyXG5cdFx0cGxheWVyUmF5czogSVBsYXllclJheXNbXSxcclxuXHRcdHBsYXllclc6IG51bWJlclxyXG5cdCkge1xyXG5cdFx0aWYgKCFyYXlzIHx8ICFyYXlBbmdsZXMgfHwgIXJheUNvb3JkcykgcmV0dXJuO1xyXG5cdFx0dGhpcy5kcmF3QmFja2dyb3VuZCgpO1xyXG5cclxuXHRcdGNvbnN0IHdhbGxXaWR0aCA9IHRoaXMud29ybGQzZC53aWR0aCAvIHJheXMubGVuZ3RoO1xyXG5cdFx0Y29uc3Qgd2FsbFdpZHRoT3ZlcnNpemVkID0gd2FsbFdpZHRoICsgMTtcclxuXHRcdGxldCB3YWxsWCA9IDA7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByYXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGRpc3QgPSByYXlzW2ldICogTWF0aC5jb3MocmF5QW5nbGVzW2ldKTtcclxuXHRcdFx0Y29uc3Qgb2Zmc2V0ID1cclxuXHRcdFx0XHRvYmplY3REaXJzPy5baV0gPT09IDAgfHwgb2JqZWN0RGlycz8uW2ldID09PSAyXHJcblx0XHRcdFx0XHQ/IHJheUNvb3Jkc1tpICogMl0gJSB0aGlzLndhbGxXXHJcblx0XHRcdFx0XHQ6IHJheUNvb3Jkc1tpICogMiArIDFdICUgdGhpcy53YWxsSDtcclxuXHJcblx0XHRcdGNvbnN0IG9mZnNldDIgPVxyXG5cdFx0XHRcdG9iamVjdERpcnM/LltpICsgMV0gPT09IDAgfHwgb2JqZWN0RGlycz8uW2kgKyAxXSA9PT0gMlxyXG5cdFx0XHRcdFx0PyByYXlDb29yZHNbKGkgKyAxKSAqIDJdICUgdGhpcy53YWxsV1xyXG5cdFx0XHRcdFx0OiByYXlDb29yZHNbKGkgKyAxKSAqIDIgKyAxXSAlIHRoaXMud2FsbEg7XHJcblxyXG5cdFx0XHRjb25zdCB3YWxsU2hpZnRBbXQgPSAodGhpcy53b3JsZDNkLmhlaWdodCAqIDUwKSAvIGRpc3Q7XHJcblx0XHRcdGNvbnN0IHdhbGxTdGFydFRvcCA9IHRoaXMud2FsbENlbnRlckhlaWdodCAtIHdhbGxTaGlmdEFtdDtcclxuXHRcdFx0Y29uc3Qgd2FsbEVuZEJvdHRvbSA9IHRoaXMud2FsbENlbnRlckhlaWdodCArIHdhbGxTaGlmdEFtdDtcclxuXHJcblx0XHRcdC8vIGxldCB3YWxsRGFya25lc3MgPSBkaXN0IC8gdGhpcy53b3JsZDNkLmhlaWdodDtcclxuXHRcdFx0Ly8gd2FsbERhcmtuZXNzID0gKHRoaXMud29ybGQzZERpYWcgLSBkaXN0KSAvIHRoaXMud29ybGQzZERpYWc7XHJcblxyXG5cdFx0XHQvLyBzd2l0Y2ggKG9iamVjdERpcnM/LltpXSkge1xyXG5cdFx0XHQvLyBcdGNhc2UgMDpcclxuXHRcdFx0Ly8gXHRcdHdhbGxEYXJrbmVzcyAtPSAwLjI7XHJcblx0XHRcdC8vIFx0XHRicmVhaztcclxuXHRcdFx0Ly8gXHRjYXNlIDI6XHJcblx0XHRcdC8vIFx0XHR3YWxsRGFya25lc3MgLT0gMC4yO1xyXG5cdFx0XHQvLyBcdFx0YnJlYWs7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vIHN3aXRjaCAob2JqZWN0VHlwZXM/LltpXSkge1xyXG5cdFx0XHQvLyBcdGNhc2UgMTpcclxuXHRcdFx0Ly8gXHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoJHsyNTUgKiB3YWxsRGFya25lc3N9LCR7MjU1ICogd2FsbERhcmtuZXNzfSwkezI1NSAqIHdhbGxEYXJrbmVzc30sMSlgO1xyXG5cdFx0XHQvLyBcdFx0YnJlYWs7XHJcblx0XHRcdC8vIFx0Y2FzZSAyOlxyXG5cdFx0XHQvLyBcdFx0dGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiYSgkezAgKiB3YWxsRGFya25lc3N9LCR7MTAwICogd2FsbERhcmtuZXNzfSwkezEwMCAqIHdhbGxEYXJrbmVzc30sMSlgO1xyXG5cdFx0XHQvLyBcdFx0YnJlYWs7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vIHRoaXMuY3R4M2QuZmlsbFJlY3Qod2FsbFgsIHdhbGxTdGFydFRvcCwgd2FsbFdpZHRoT3ZlcnNpemVkLCB3YWxsRW5kQm90dG9tIC0gd2FsbFN0YXJ0VG9wKTtcclxuXHJcblx0XHRcdC8vIGNvbnN0IHNXaWR0aCA9XHJcblx0XHRcdC8vIFx0b2JqZWN0RGlycz8uW2ldID09PSAwIHx8IG9iamVjdERpcnM/LltpXSA9PT0gMlxyXG5cdFx0XHQvLyBcdFx0PyB0aGlzLndhbGxUZXh0dXJlLndpZHRoIC8gb2Zmc2V0XHJcblx0XHRcdC8vIFx0XHQ6IHRoaXMud2FsbFRleHR1cmUuaGVpZ2h0IC8gb2Zmc2V0O1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhvZmZzZXQpO1xyXG5cclxuXHRcdFx0bGV0IHNXaWR0aCA9IDA7XHJcblxyXG5cdFx0XHRpZiAob2JqZWN0RGlycz8uW2ldID09PSAyIHx8IG9iamVjdERpcnM/LltpXSA9PT0gMykge1xyXG5cdFx0XHRcdHNXaWR0aCA9IG9mZnNldDIgPj0gMCA/IChvZmZzZXQgPD0gb2Zmc2V0MiA/IG9mZnNldDIgLSBvZmZzZXQgOiB0aGlzLndhbGxXIC0gb2Zmc2V0ICsgb2Zmc2V0MikgOiA4O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIE5vdCB3b3JraW5nIHJpZ2h0LCBkb24ndCBrbm93IHdoeVxyXG5cdFx0XHRcdHNXaWR0aCA9IG9mZnNldDIgPj0gMCA/IChvZmZzZXQyIDw9IG9mZnNldCA/IG9mZnNldCAtIG9mZnNldDIgOiB0aGlzLndhbGxXIC0gb2Zmc2V0MiArIG9mZnNldCkgOiA4O1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKG9mZnNldCwgb2Zmc2V0Miwgc1dpZHRoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9iamVjdERpcnM/LltpXSA9PT0gMCB8fCBvYmplY3REaXJzPy5baV0gPT09IDIpIHtcclxuXHRcdFx0XHR0aGlzLmN0eDNkLmRyYXdJbWFnZShcclxuXHRcdFx0XHRcdHRoaXMud2FsbFRleHR1cmUsXHJcblx0XHRcdFx0XHRvZmZzZXQsXHJcblx0XHRcdFx0XHQwLFxyXG5cdFx0XHRcdFx0c1dpZHRoLFxyXG5cdFx0XHRcdFx0dGhpcy53YWxsVGV4dHVyZS5oZWlnaHQsXHJcblx0XHRcdFx0XHR3YWxsWCxcclxuXHRcdFx0XHRcdHdhbGxTdGFydFRvcCxcclxuXHRcdFx0XHRcdHdhbGxXaWR0aCxcclxuXHRcdFx0XHRcdHdhbGxFbmRCb3R0b20gLSB3YWxsU3RhcnRUb3BcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuY3R4M2QuZHJhd0ltYWdlKFxyXG5cdFx0XHRcdFx0dGhpcy53YWxsVGV4dHVyZURhcmssXHJcblx0XHRcdFx0XHRvZmZzZXQsXHJcblx0XHRcdFx0XHQwLFxyXG5cdFx0XHRcdFx0c1dpZHRoLFxyXG5cdFx0XHRcdFx0dGhpcy53YWxsVGV4dHVyZURhcmsuaGVpZ2h0LFxyXG5cdFx0XHRcdFx0d2FsbFgsXHJcblx0XHRcdFx0XHR3YWxsU3RhcnRUb3AsXHJcblx0XHRcdFx0XHR3YWxsV2lkdGgsXHJcblx0XHRcdFx0XHR3YWxsRW5kQm90dG9tIC0gd2FsbFN0YXJ0VG9wXHJcblx0XHRcdFx0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0d2FsbFggKz0gd2FsbFdpZHRoO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVyUmF5cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCByYXlMID0gcGxheWVyUmF5c1tpXS5sO1xyXG5cdFx0XHRjb25zdCB3ID0gKHRoaXMud29ybGQzZC53aWR0aCAqIHBsYXllclcpIC8gcmF5TDtcclxuXHRcdFx0Ly8gbGV0IHggPSBwbGF5ZXJSYXlzW2ldLnBlcmNBY3Jvc3NTY3JlZW4gKiB0aGlzLndvcmxkM2Qud2lkdGg7XHJcblx0XHRcdGxldCB4O1xyXG5cclxuXHRcdFx0aWYgKHBsYXllclJheXNbaV0ucGVyY0Fjcm9zc1NjcmVlbjEgPj0gMCAmJiBwbGF5ZXJSYXlzW2ldLnBlcmNBY3Jvc3NTY3JlZW4xIDw9IDEpIHtcclxuXHRcdFx0XHR4ID0gcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuMSAqIHRoaXMud29ybGQzZC53aWR0aCArIHcgLyAyO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHggPSBwbGF5ZXJSYXlzW2ldLnBlcmNBY3Jvc3NTY3JlZW4yICogdGhpcy53b3JsZDNkLndpZHRoIC0gdyAvIDI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGxldCBwbGF5ZXJDZW50ZXJIZWlnaHQgPSB0aGlzLndvcmxkM2QuaGVpZ2h0IC8gMi41O1xyXG5cdFx0XHRjb25zdCB3YWxsU2hpZnRBbXQgPSAodGhpcy53b3JsZDNkLmhlaWdodCAqIDUwKSAvIHJheUw7XHJcblx0XHRcdGNvbnN0IHBsYXllclNoaWZ0QW10ID0gKHRoaXMud29ybGQzZC5oZWlnaHQgKiA0MCkgLyByYXlMO1xyXG5cdFx0XHRjb25zdCBhZGpUb0JvdEFtdCA9IHdhbGxTaGlmdEFtdCAtIHBsYXllclNoaWZ0QW10O1xyXG5cdFx0XHRjb25zdCBwbGF5ZXJTdGFydFRvcCA9IHBsYXllckNlbnRlckhlaWdodCAtIHBsYXllclNoaWZ0QW10ICsgYWRqVG9Cb3RBbXQ7XHJcblx0XHRcdGNvbnN0IHBsYXllckVuZEJvdHRvbSA9IHBsYXllckNlbnRlckhlaWdodCArIHBsYXllclNoaWZ0QW10ICsgYWRqVG9Cb3RBbXQ7XHJcblxyXG5cdFx0XHRsZXQgd2FsbERhcmtuZXNzID0gcmF5TCAvIHRoaXMud29ybGQzZC5oZWlnaHQ7XHJcblx0XHRcdHdhbGxEYXJrbmVzcyA9ICh0aGlzLndvcmxkM2REaWFnIC0gcmF5TCkgLyB0aGlzLndvcmxkM2REaWFnO1xyXG5cclxuXHRcdFx0dGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiYSgkezI1NSAqIHdhbGxEYXJrbmVzc30sJHsxMDAgKiB3YWxsRGFya25lc3N9LCR7MCAqIHdhbGxEYXJrbmVzc30sMSlgO1xyXG5cclxuXHRcdFx0dGhpcy5jdHgzZC5maWxsUmVjdCh4IC0gdyAvIDIsIHBsYXllclN0YXJ0VG9wLCB3LCBwbGF5ZXJFbmRCb3R0b20gLSBwbGF5ZXJTdGFydFRvcCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3BsYXllcjJkLnRzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3BsYXllcnMudHNcIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvdHlwZXMudHNcIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvd2FsbHMyZC50c1wiKTtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3dhbGxzM2QudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=