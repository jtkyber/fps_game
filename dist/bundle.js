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
        walls3d.draw(player2d.rays, player2d.objectTypes, player2d.objectDirs, player2d.playerX, player2d.playerY, player2d.rayAngles, player2d.playerRays, player2d.playerW);
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
        this.objectTypes = null;
        this.objectDirs = null;
        this.rayIncrement = 2;
        this.rayOpacity = 0.26;
        this.fov = 60;
        this.fovRad = this.fov * (Math.PI / 180);
        this.rotation = 45;
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
        this.playerX = 100;
        this.playerY = 100;
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
        var r = 1;
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
    Walls3d.prototype.draw = function (rays, objectTypes, objectDirs, pX, pY, rayAngles, playerRays, playerW) {
        if (!rays || !rayAngles)
            return;
        this.drawBackground();
        var wallWidth = this.world3d.width / rays.length;
        var wallWidthOversized = wallWidth + 1;
        var wallX = 0;
        for (var i = 0; i < rays.length; i++) {
            var dist = rays[i] * Math.cos(rayAngles[i]);
            var offset = (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 2 ? pX / this.wallW : pY / this.wallH;
            var wallShiftAmt = (this.world3d.height * 50) / dist;
            var wallStartTop = this.wallCenterHeight - wallShiftAmt;
            var wallEndBottom = this.wallCenterHeight + wallShiftAmt;
            var wallDarkness = dist / this.world3d.height;
            wallDarkness = (this.world3dDiag - dist) / this.world3dDiag;
            switch (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) {
                case 0:
                    wallDarkness -= 0.2;
                    break;
                case 2:
                    wallDarkness -= 0.2;
                    break;
            }
            switch (objectTypes === null || objectTypes === void 0 ? void 0 : objectTypes[i]) {
                case 1:
                    this.ctx3d.fillStyle = "rgba(".concat(255 * wallDarkness, ",").concat(255 * wallDarkness, ",").concat(255 * wallDarkness, ",1)");
                    break;
                case 2:
                    this.ctx3d.fillStyle = "rgba(".concat(0 * wallDarkness, ",").concat(100 * wallDarkness, ",").concat(100 * wallDarkness, ",1)");
                    break;
            }
            this.ctx3d.fillRect(wallX, wallStartTop, wallWidthOversized, wallEndBottom - wallStartTop);
            // // const sWidth =
            // // 	objectDirs?.[i] === 0 || objectDirs?.[i] === 2
            // // 		? this.wallTexture.width / offset
            // // 		: this.wallTexture.height / offset;
            // this.ctx3d.drawImage(
            // 	this.wallTexture,
            // 	offset,
            // 	0,
            // 	this.wallTexture.width,
            // 	this.wallTexture.height,
            // 	wallX,
            // 	wallStartTop,
            // 	wallWidth,
            // 	wallEndBottom - wallStartTop
            // );
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFrQztBQUNGO0FBRUE7QUFDQTtBQUVoQyxnREFBZ0Q7QUFDaEQsSUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUUzRCxJQUFNLE9BQU8sR0FBc0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0RSxJQUFNLE9BQU8sR0FBc0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUV0RSxJQUFNLEtBQUssR0FBNkIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUNuRixJQUFNLEtBQUssR0FBNkIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUVuRixJQUFNLFVBQVUsR0FBdUIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUU3RSxJQUFJLE9BQWdCLENBQUM7QUFDckIsSUFBSSxPQUFnQixDQUFDO0FBQ3JCLElBQUksUUFBa0IsQ0FBQztBQUN2QixJQUFJLE9BQWdCLENBQUM7QUFFckIsSUFBSSxXQUFtQixFQUFFLEdBQVcsRUFBRSxJQUFZLEVBQUUsT0FBZSxFQUFFLFNBQWlCLENBQUM7QUFDdkYsSUFBSSxVQUFVLEdBQVcsQ0FBQyxDQUFDO0FBQzNCLElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUVyQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFFbkIsSUFBSSxNQUFXLENBQUM7QUFDaEIsSUFBSSxxQkFBcUIsR0FBRztJQUMzQixDQUFDLEVBQUUsQ0FBQztJQUNKLENBQUMsRUFBRSxDQUFDO0NBQ0osQ0FBQztBQUVGLElBQU0saUJBQWlCLEdBQUc7SUFDekIsVUFBVSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0MsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUMzRSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGLElBQU0sUUFBUSxHQUFHO0lBQ2hCLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU1QyxXQUFXLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUUvQixHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLE9BQU8sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBRXJCLElBQUksT0FBTyxHQUFHLFdBQVcsRUFBRTtRQUMxQixJQUFJLFVBQVUsS0FBSyxDQUFDO1lBQUUsVUFBVSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFELFVBQVUsSUFBSSxDQUFDLENBQUM7UUFDaEIsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsQ0FBQztRQUVyQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJELE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNmLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEQsT0FBTyxDQUFDLElBQUksQ0FDWCxRQUFRLENBQUMsSUFBSSxFQUNiLFFBQVEsQ0FBQyxXQUFXLEVBQ3BCLFFBQVEsQ0FBQyxVQUFVLEVBQ25CLFFBQVEsQ0FBQyxPQUFPLEVBQ2hCLFFBQVEsQ0FBQyxPQUFPLEVBQ2hCLFFBQVEsQ0FBQyxTQUFTLEVBQ2xCLFFBQVEsQ0FBQyxVQUFVLEVBQ25CLFFBQVEsQ0FBQyxPQUFPLENBQ2hCLENBQUM7UUFFRixHQUFHLEVBQUUsSUFBSSxRQUFRLENBQUMsT0FBTyxLQUFLLHFCQUFxQixDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsT0FBTyxLQUFLLHFCQUFxQixDQUFDLENBQUMsRUFBRTtZQUN0RyxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUMzQyxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUUzQyxJQUFJLENBQUMsTUFBTTtnQkFBRSxNQUFNLEdBQUcsQ0FBQztZQUV2QixJQUFNLElBQUksR0FBbUI7Z0JBQzVCLE1BQU0sRUFBRSxtQkFBbUI7Z0JBQzNCLEVBQUUsRUFBRSxNQUFNO2dCQUNWLElBQUksRUFBRTtvQkFDTCxDQUFDLEVBQUUscUJBQXFCLENBQUMsQ0FBQztvQkFDMUIsQ0FBQyxFQUFFLHFCQUFxQixDQUFDLENBQUM7aUJBQzFCO2FBQ0QsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2xDO1FBRUQsS0FBSyxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQztRQUNwQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNwQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjtBQUNGLENBQUMsQ0FBQztBQUVGLElBQU0sS0FBSyxHQUFHO0lBQ2IsT0FBTyxHQUFHLElBQUksZ0RBQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsT0FBTyxHQUFHLElBQUksZ0RBQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BFLFFBQVEsR0FBRyxJQUFJLGlEQUFRLENBQ3RCLE9BQU8sRUFDUCxLQUFLLEVBQ0wsT0FBTyxDQUFDLEtBQUssRUFDYixPQUFPLENBQUMsUUFBUSxFQUNoQixPQUFPLENBQUMsUUFBUSxFQUNoQixPQUFPLENBQUMsS0FBSyxFQUNiLE9BQU8sQ0FBQyxLQUFLLENBQ2IsQ0FBQztJQUNGLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQixPQUFPLEdBQUcsSUFBSSxnREFBTyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QyxRQUFRLEVBQUUsQ0FBQztBQUNaLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLEdBQUc7SUFDZixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLEtBQUssRUFBRSxDQUFDO0FBQ1QsQ0FBQyxDQUFDO0FBRUYsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxXQUFDO0lBQ3ZDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDYixRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM1QyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3hDO0FBQ0YsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFdBQUM7SUFDckMsa0NBQWtDO0lBQ2xDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDdEIsUUFBUSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUNoQztTQUFNLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDN0IsUUFBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNqQztJQUVELElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDdEIsSUFBSSxPQUFPO1lBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7WUFDckMsUUFBUSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNuQztTQUFNLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDN0IsSUFBSSxPQUFPO1lBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7WUFDdEMsUUFBUSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNwQztBQUNGLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxXQUFDO0lBQ25DLG1EQUFtRDtJQUNuRCxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQzNDLElBQUksT0FBTztZQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7O1lBQ25DLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakM7U0FBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ2xELFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDMUI7U0FBTSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQzdCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2IsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDcEMsUUFBUSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDekIsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDeEIsT0FBTyxDQUFDLGtCQUFrQjtnQkFDekIsWUFBWTtnQkFDWixPQUFPLENBQUMsa0JBQWtCLElBQUksT0FBTyxDQUFDLHFCQUFxQixJQUFJLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQztZQUNqRyxZQUFZO1lBQ1osT0FBTyxDQUFDLGtCQUFrQixDQUFDO2dCQUMxQixrQkFBa0IsRUFBRSxJQUFJO2FBQ3hCLENBQUMsQ0FBQztTQUNIO2FBQU07WUFDTixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2QyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2QyxRQUFRLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUN4QixPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztZQUN2QixRQUFRLENBQUMsZUFBZTtnQkFDdkIsWUFBWTtnQkFDWixRQUFRLENBQUMsZUFBZSxJQUFJLFFBQVEsQ0FBQyxrQkFBa0IsSUFBSSxRQUFRLENBQUMscUJBQXFCLENBQUM7WUFDM0YsUUFBUSxDQUFDLGVBQWUsRUFBRSxDQUFDO1NBQzNCO0tBQ0Q7QUFDRixDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7SUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxlQUFLO0lBQ3ZDLElBQU0sR0FBRyxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRCxJQUFJLElBQW9CLENBQUM7SUFFekIsUUFBUSxHQUFHLGFBQUgsR0FBRyx1QkFBSCxHQUFHLENBQUUsTUFBTSxFQUFFO1FBQ3BCLEtBQUssYUFBYTtZQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDbkMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFFbEIsSUFBSSxDQUFDLE1BQU07Z0JBQUUsT0FBTztZQUNwQixJQUFJLEdBQUc7Z0JBQ04sTUFBTSxFQUFFLHNCQUFzQjtnQkFDOUIsRUFBRSxFQUFFLE1BQU07Z0JBQ1YsSUFBSSxFQUFFLEVBQUU7YUFDUixDQUFDO1lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDbEMsTUFBTTtRQUNQLEtBQUssc0JBQXNCO1lBQzFCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTVCLHVCQUF1QjtZQUN2QixXQUFXO1lBQ1gsbUNBQW1DO1lBQ25DLGVBQWU7WUFDZixhQUFhO1lBQ2IsS0FBSztZQUNMLHFDQUFxQztZQUNyQyxNQUFNO1FBQ1AsS0FBSyxtQkFBbUI7WUFDdkIsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuRixNQUFNO1FBQ1AsS0FBSyxlQUFlO1lBQ25CLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLE1BQU07S0FDUDtBQUNGLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNyTkg7SUF1Q0Msa0JBQ0MsT0FBMEIsRUFDMUIsS0FBK0IsRUFDL0IsS0FBaUIsRUFDakIsUUFBZ0IsRUFDaEIsUUFBZ0IsRUFDaEIsS0FBYSxFQUNiLEtBQWE7UUFvSk4sb0JBQWUsR0FBRyxVQUN6QixDQUFTLEVBQ1QsQ0FBUyxFQUNULENBQVMsRUFDVCxLQUFhLEVBQ2IsRUFBVSxFQUNWLEVBQVUsRUFDVixFQUFVLEVBQ1YsRUFBVSxFQUNWLEdBQVcsRUFDWCxFQUE2QjtZQUU3QixJQUFNLGFBQWEsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNwRCxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDYixJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLEVBQUUsQ0FBQztZQUNQLElBQUksRUFBRSxDQUFDO1lBQ1AsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDO1lBQ3BCLElBQUksR0FBRSxhQUFGLEVBQUUsdUJBQUYsRUFBRSxDQUFFLENBQUMsTUFBSSxFQUFFLGFBQUYsRUFBRSx1QkFBRixFQUFFLENBQUUsQ0FBQyxHQUFFO2dCQUNuQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDVixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLEdBQUcsQ0FBQyxDQUFDO2FBQ1Q7aUJBQU07Z0JBQ04sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDckMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUNyQztZQUVELElBQU0sS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBRTVELElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtnQkFDZixPQUFPO2FBQ1A7WUFDRCxJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ2xFLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDbEUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUM1QyxJQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QixJQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUM5QixPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ2hCO2lCQUFNO2dCQUNOLE9BQU87YUFDUDtRQUNGLENBQUMsQ0FBQztRQTNMRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRztZQUNsQixRQUFRLEVBQUUsUUFBUTtZQUNsQixJQUFJLEVBQUUsUUFBUTtZQUNkLEtBQUssRUFBRSxRQUFRO1lBQ2YsUUFBUSxFQUFFLFFBQVE7U0FDbEIsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFTSx3QkFBSyxHQUFaO1FBQ0MsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFTSw4QkFBVyxHQUFsQixVQUFtQixHQUFrQjtRQUNwQyw4QkFBOEI7UUFDOUIsb0JBQW9CO1FBQ3BCLElBQUk7UUFDSixJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRU0sbUNBQWdCLEdBQXZCLFVBQXdCLEdBQVc7UUFDbEMsSUFBSSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUM7UUFDckIsSUFBSSxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUVNLCtCQUFZLEdBQW5CLFVBQW9CLEdBQWtCO1FBQ3JDLElBQUksSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLEVBQUU7WUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFDMUIsQ0FBQztJQUVPLHlCQUFNLEdBQWQ7UUFDQyxtQ0FBbUM7UUFDbkMsdUJBQXVCO1FBQ3ZCLElBQUk7UUFFSixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO1lBQzNCLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUM3QixJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDMUI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFO1lBQ25DLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUM3QixJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDMUI7SUFDRixDQUFDO0lBRU0sNkJBQVUsR0FBakIsVUFBa0IsR0FBa0I7UUFDbkMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtZQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDakM7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUN0QixDQUFDO0lBRU8sdUJBQUksR0FBWjs7UUFDQyxJQUFJLENBQUMsV0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLElBQUksMENBQUUsTUFBTTtZQUFFLE9BQU87UUFDaEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWQsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVO1lBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUM7UUFFekQsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7UUFDekUsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xELElBQU0sZ0JBQWdCLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELElBQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2RixJQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hFLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNoRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7UUFDNUMsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQzdDLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUVoRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssVUFBVSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO2FBQ3RCO1NBQ0Q7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssV0FBVyxFQUFFO1lBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO2FBQ3RCO1NBQ0Q7UUFDRCxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssTUFBTSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUM7YUFDeEI7WUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNkLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDO2FBQ3hCO1NBQ0Q7YUFBTSxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssT0FBTyxFQUFFO1lBQzFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUM7YUFDeEI7WUFDRCxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNkLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDO2FBQ3hCO1NBQ0Q7SUFDRixDQUFDO0lBRU8sNEJBQVMsR0FBakI7UUFDQyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUMvQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FDNUUsQ0FBQztRQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFaEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDekYsQ0FBQyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztTQUMvQjtRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUE2Q08sMENBQXVCLEdBQS9CLFVBQ0MsQ0FBUyxFQUNULENBQVMsRUFDVCxDQUFTLEVBQ1QsQ0FBUyxFQUNULFFBQWdCLEVBQ2hCLFFBQWdCLEVBQ2hCLEVBQTZCO1FBRTdCLElBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLElBQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzFCLElBQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRTFCLElBQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUVkLElBQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzNCLElBQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRTNCLElBQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNkLElBQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRTNCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUN0QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBRVosS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQixRQUFRLENBQUMsRUFBRTtnQkFDVixLQUFLLENBQUM7b0JBQ0wsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDOUYsSUFBSSxlQUFlLEVBQUU7d0JBQ3BCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDNUMsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDdkMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUM3QixJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUU7NEJBQ2hCLE1BQU0sR0FBRyxDQUFDLENBQUM7NEJBQ1gsT0FBTyxHQUFHLGVBQWUsQ0FBQzs0QkFDMUIsR0FBRyxHQUFHLENBQUMsQ0FBQzt5QkFDUjtxQkFDRDtvQkFFRCxNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7b0JBQ2hHLElBQUksaUJBQWlCLEVBQUU7d0JBQ3RCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlDLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzlDLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7d0JBQ3ZDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxDQUFDLElBQUksTUFBTSxFQUFFOzRCQUNoQixNQUFNLEdBQUcsQ0FBQyxDQUFDOzRCQUNYLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQzs0QkFDNUIsR0FBRyxHQUFHLENBQUMsQ0FBQzt5QkFDUjtxQkFDRDtvQkFDRCxNQUFNO2dCQUNQLEtBQUssQ0FBQztvQkFDTCxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUM5RixJQUFJLGVBQWUsRUFBRTt3QkFDcEIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzVDLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUM1QyxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO3dCQUN2QyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQzdCLElBQUksQ0FBQyxJQUFJLE1BQU0sRUFBRTs0QkFDaEIsTUFBTSxHQUFHLENBQUMsQ0FBQzs0QkFDWCxPQUFPLEdBQUcsZUFBZSxDQUFDOzRCQUMxQixHQUFHLEdBQUcsQ0FBQyxDQUFDO3lCQUNSO3FCQUNEO29CQUNELE1BQU07Z0JBQ1AsS0FBSyxDQUFDO29CQUNMLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztvQkFDL0YsSUFBSSxnQkFBZ0IsRUFBRTt3QkFDckIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0MsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0MsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQzt3QkFDdkMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUM3QixJQUFJLENBQUMsSUFBSSxNQUFNLEVBQUU7NEJBQ2hCLE1BQU0sR0FBRyxDQUFDLENBQUM7NEJBQ1gsT0FBTyxHQUFHLGdCQUFnQixDQUFDOzRCQUMzQixHQUFHLEdBQUcsQ0FBQyxDQUFDO3lCQUNSO3FCQUNEO29CQUNELE1BQU07YUFDUDtTQUNEO1FBRUQsT0FBTztZQUNOLE1BQU07WUFDTixPQUFPO1lBQ1AsR0FBRztTQUNILENBQUM7SUFDSCxDQUFDO0lBRU8sOEJBQVcsR0FBbkIsVUFBb0IsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVTtRQUNqRSxJQUFJLE1BQU0sR0FDVCxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7WUFDVixDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDM0QsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQzVELE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRTdDLE9BQU8sTUFBTSxDQUFDO0lBQ2YsQ0FBQztJQUVPLG1DQUFnQixHQUF4QixVQUNDLENBQVMsRUFDVCxDQUFTLEVBQ1QsRUFBVSxFQUNWLEVBQVUsRUFDVixRQUFnQixFQUNoQixRQUFpQjtRQUVqQixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTlDLElBQUksVUFBVSxHQUFHLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFFbkMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ3hDLFVBQVUsR0FBRyxVQUFVLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDO1NBQ25FO1FBRUQsSUFBTSxhQUFhLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBRWxELE9BQU8sYUFBYSxDQUFDO0lBQ3RCLENBQUM7SUFFTSx1QkFBSSxHQUFYLFVBQVksT0FBa0I7O1FBQzdCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdkIsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUV2QixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUVyQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFWixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO1lBQUUsT0FBTztRQUMxQyxJQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWixJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFckQsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUVuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQztZQUV0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3ZDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQy9DLElBQUksSUFBSSxLQUFLLENBQUM7d0JBQUUsU0FBUztvQkFFekIsSUFBTSxnQkFBZ0IsR0FJbEIsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUUxRSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUU7d0JBQ3JDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7d0JBQ2pDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7d0JBRW5DLFdBQVcsR0FBRyxJQUFJLENBQUM7d0JBQ25CLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7cUJBQ2xDO2lCQUNEO2FBQ0Q7WUFFRCxJQUFJLE9BQU8sRUFBRTtnQkFDWixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRywyQkFBb0IsSUFBSSxDQUFDLFVBQVUsTUFBRyxDQUFDO29CQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ3BCO2dCQUVELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO2dCQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXO29CQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDO2dCQUN4RCxJQUFJLElBQUksQ0FBQyxVQUFVO29CQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO2FBQ3JEO2lCQUFNO2dCQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO2FBQ3hCO1NBQ0Q7UUFFRCxLQUFLLEVBQUUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDL0MsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN2QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDdkMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDL0MsSUFBSSxJQUFJLEtBQUssQ0FBQzt3QkFBRSxTQUFTO29CQUV6QixJQUFNLGdCQUFnQixHQUlsQixJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRTlFLElBQUksc0JBQWdCLGFBQWhCLGdCQUFnQix1QkFBaEIsZ0JBQWdCLENBQUUsT0FBTywwQ0FBRyxDQUFDLENBQUM7d0JBQUUsU0FBUyxLQUFLLENBQUM7aUJBQ25EO2FBQ0Q7WUFFRCxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFFdkMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7WUFDaEMsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzFELElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDL0IsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNuQyxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFDLElBQU0sYUFBYSxHQUFXLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFckYsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xELElBQUksY0FBYyxHQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksY0FBYyxHQUFXLENBQUMsQ0FBQyxDQUFDO1lBRWhDLElBQUksUUFBUSxJQUFJLENBQUMsSUFBSSxRQUFRLElBQUksR0FBRyxFQUFFO2dCQUNyQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JFLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNyRTtpQkFBTTtnQkFDTixjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3JFLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNyRTtZQUVELElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxJQUFJLGNBQWMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLElBQUksY0FBYyxJQUFJLENBQUMsQ0FBQyxFQUFFO2dCQUNqRyxJQUFJLGNBQWMsSUFBSSxDQUFDLElBQUksY0FBYyxJQUFJLENBQUMsSUFBSSxjQUFjLElBQUksQ0FBQyxJQUFJLGNBQWMsSUFBSSxDQUFDLEVBQUU7b0JBQzdGLElBQU0sa0JBQWtCLEdBQUcsY0FBYyxDQUFDO29CQUMxQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7b0JBQzFELGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGNBQWMsQ0FBQyxDQUFDO2lCQUM5RDtnQkFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztvQkFDcEIsQ0FBQyxFQUFFLENBQUM7b0JBQ0osQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNOLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDTixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUk7b0JBQ1osZ0JBQWdCLEVBQUUsYUFBYTtvQkFDL0IsaUJBQWlCLEVBQUUsY0FBYztvQkFDakMsaUJBQWlCLEVBQUUsY0FBYztpQkFDakMsQ0FBQyxDQUFDO2dCQUVILElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtvQkFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUM7b0JBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDcEI7YUFDRDtZQUVELGtEQUFrRDtZQUNsRCwwQkFBMEI7WUFDMUIsVUFBVTtZQUNWLFlBQVk7WUFDWixZQUFZO1lBQ1osa0JBQWtCO1lBQ2xCLHFDQUFxQztZQUNyQyxPQUFPO1lBQ1AsSUFBSTtTQUNKO1FBRUQsSUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3RELElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzdELElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzlELElBQU0sU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRTdELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFFdkIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQztRQUV2QixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBRXZCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFFdkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsS0FBSyxFQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM5QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLElBQUksS0FBSyxDQUFDO29CQUFFLFNBQVMsS0FBSyxDQUFDO2dCQUUvQixJQUFNLGFBQWEsR0FHZixJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLE9BQU8sRUFBRTtvQkFDbkMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7b0JBQy9CLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO2lCQUNqQztnQkFFRCxJQUFNLGFBQWEsR0FHZixJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLE9BQU8sRUFBRTtvQkFDbkMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7b0JBQy9CLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO2lCQUNqQztnQkFFRCxJQUFNLGFBQWEsR0FHZixJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLE9BQU8sRUFBRTtvQkFDbkMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7b0JBQy9CLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO2lCQUNqQztnQkFFRCxJQUFNLGFBQWEsR0FHZixJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDM0QsSUFBSSxhQUFhLENBQUMsTUFBTSxHQUFHLE9BQU8sRUFBRTtvQkFDbkMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7b0JBQy9CLFFBQVEsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDO2lCQUNqQzthQUNEO1NBQ0Q7UUFFRCxJQUFJLFFBQVE7WUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7O1lBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUUxQyxJQUFJLFFBQVE7WUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7O1lBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUV0QyxJQUFJLFFBQVE7WUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7O1lBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztRQUV2QyxJQUFJLFFBQVE7WUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7O1lBQzdDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUUxQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4RSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFDRixlQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQ25rQkQ7SUFLQyxpQkFBWSxPQUEwQixFQUFFLEtBQStCO1FBQ3RFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFTSwyQkFBUyxHQUFoQixVQUFpQixJQUFZO1FBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUk7Z0JBQUUsT0FBTztTQUMxQztRQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2pCLElBQUksRUFBRSxJQUFJO1lBQ1YsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUM7WUFDekIsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUM7U0FDMUIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFHLElBQUksMEJBQXVCLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRU0sOEJBQVksR0FBbkIsVUFBb0IsSUFBWTtRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFVLElBQUksd0JBQXFCLENBQUMsQ0FBQztRQUNqRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUMxQjtTQUNEO0lBQ0YsQ0FBQztJQUVNLGlDQUFlLEdBQXRCLFVBQXVCLENBQVU7UUFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzdDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRTtnQkFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsT0FBTzthQUNQO1NBQ0Q7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNqQixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUk7WUFDWixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDTixDQUFDLENBQUM7SUFDSixDQUFDO0lBRU0sc0JBQUksR0FBWDtRQUNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTFCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztZQUM3QixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbEI7SUFDRixDQUFDO0lBQ0YsY0FBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REQ7SUFVQyxpQkFBWSxPQUEwQixFQUFFLEtBQStCO1FBQ3RFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQzFCO1lBQ0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDaEcsQ0FBQyxJQUFJLEVBQUUsQ0FDUixDQUFDO1FBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FB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QUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUU1RCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxlQUFRLEdBQUcsR0FBRyxZQUFZLGNBQUksR0FBRyxHQUFHLFlBQVksY0FBSSxDQUFDLEdBQUcsWUFBWSxRQUFLLENBQUM7WUFFakcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsRUFBRSxlQUFlLEdBQUcsY0FBYyxDQUFDLENBQUM7U0FDcEY7SUFDRixDQUFDO0lBQ0YsY0FBQztBQUFELENBQUM7Ozs7Ozs7O1VDN0tEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Zwc19nYW1lLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL2Zwc19nYW1lLy4vc3JjL3BsYXllcjJkLnRzIiwid2VicGFjazovL2Zwc19nYW1lLy4vc3JjL3BsYXllcnMudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvd2FsbHMyZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy93YWxsczNkLnRzIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQbGF5ZXIyZCBmcm9tICcuL3BsYXllcjJkJztcclxuaW1wb3J0IFBsYXllcnMgZnJvbSAnLi9wbGF5ZXJzJztcclxuaW1wb3J0IHsgSVNvY2tldERhdGFSZXEsIElTb2NrZXREYXRhUmVzIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCBXYWxsczJkIGZyb20gJy4vd2FsbHMyZCc7XHJcbmltcG9ydCBXYWxsczNkIGZyb20gJy4vd2FsbHMzZCc7XHJcblxyXG4vLyBVc2Ugd3NzIChzZWN1cmUpIGluc3RlYWQgb2Ygd3MgZm9yIHByb2R1Y2l0b25cclxuY29uc3Qgc29ja2V0ID0gbmV3IFdlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6MzAwMC9zZXJ2ZXInKTtcclxuXHJcbmNvbnN0IHdvcmxkMmQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dvcmxkMmQnKTtcclxuY29uc3Qgd29ybGQzZCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd29ybGQzZCcpO1xyXG5cclxuY29uc3QgY3R4MmQgPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPndvcmxkMmQuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcclxuY29uc3QgY3R4M2QgPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPndvcmxkM2QuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcclxuXHJcbmNvbnN0IGZwc0VsZW1lbnQgPSA8SFRNTEhlYWRpbmdFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcHNDb3VudGVyJyk7XHJcblxyXG5sZXQgd2FsbHMyZDogV2FsbHMyZDtcclxubGV0IHdhbGxzM2Q6IFdhbGxzM2Q7XHJcbmxldCBwbGF5ZXIyZDogUGxheWVyMmQ7XHJcbmxldCBwbGF5ZXJzOiBQbGF5ZXJzO1xyXG5cclxubGV0IGZwc0ludGVydmFsOiBudW1iZXIsIG5vdzogbnVtYmVyLCB0aGVuOiBudW1iZXIsIGVsYXBzZWQ6IG51bWJlciwgcmVxdWVzdElEOiBudW1iZXI7XHJcbmxldCBmcmFtZUNvdW50OiBudW1iZXIgPSAwO1xyXG5jb25zdCBmcmFtZVJhdGUgPSA2MDtcclxuXHJcbmxldCBkZXZNb2RlID0gdHJ1ZTtcclxuXHJcbmxldCB1c2VySWQ6IGFueTtcclxubGV0IGxhc3RSZWNvcmRlZFBsYXllclBvcyA9IHtcclxuXHR4OiAwLFxyXG5cdHk6IDAsXHJcbn07XHJcblxyXG5jb25zdCBzZXRGcmFtZXJhdGVWYWx1ZSA9ICgpID0+IHtcclxuXHRmcHNFbGVtZW50LmlubmVyVGV4dCA9IGZyYW1lQ291bnQudG9TdHJpbmcoKTtcclxuXHRmcHNFbGVtZW50LnN0eWxlLmNvbG9yID0gZnJhbWVDb3VudCA8IGZyYW1lUmF0ZSA/ICdyZWQnIDogJ3JnYigwLCAyNTUsIDApJztcclxuXHRmcmFtZUNvdW50ID0gMDtcclxufTtcclxuXHJcbmNvbnN0IGdhbWVMb29wID0gKCkgPT4ge1xyXG5cdHJlcXVlc3RJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcCk7XHJcblxyXG5cdGZwc0ludGVydmFsID0gMTAwMCAvIGZyYW1lUmF0ZTtcclxuXHJcblx0bm93ID0gRGF0ZS5ub3coKTtcclxuXHRlbGFwc2VkID0gbm93IC0gdGhlbjtcclxuXHJcblx0aWYgKGVsYXBzZWQgPiBmcHNJbnRlcnZhbCkge1xyXG5cdFx0aWYgKGZyYW1lQ291bnQgPT09IDApIHNldFRpbWVvdXQoc2V0RnJhbWVyYXRlVmFsdWUsIDEwMDApO1xyXG5cdFx0ZnJhbWVDb3VudCArPSAxO1xyXG5cdFx0dGhlbiA9IG5vdyAtIChlbGFwc2VkICUgZnBzSW50ZXJ2YWwpO1xyXG5cclxuXHRcdGN0eDJkLmNsZWFyUmVjdCgwLCAwLCB3b3JsZDJkLndpZHRoLCB3b3JsZDJkLmhlaWdodCk7XHJcblx0XHRjdHgzZC5jbGVhclJlY3QoMCwgMCwgd29ybGQzZC53aWR0aCwgd29ybGQzZC5oZWlnaHQpO1xyXG5cclxuXHRcdHdhbGxzMmQuZHJhdygpO1xyXG5cdFx0cGxheWVycy5kcmF3KCk7XHJcblx0XHRwbGF5ZXIyZC5kcmF3KHBsYXllcnMucGxheWVycyk7XHJcblx0XHR3YWxsczNkLnNldGJnVG9wWChwbGF5ZXIyZC5yb3RBbXQsIHBsYXllcjJkLnJvdERpcik7XHJcblx0XHR3YWxsczNkLmRyYXcoXHJcblx0XHRcdHBsYXllcjJkLnJheXMsXHJcblx0XHRcdHBsYXllcjJkLm9iamVjdFR5cGVzLFxyXG5cdFx0XHRwbGF5ZXIyZC5vYmplY3REaXJzLFxyXG5cdFx0XHRwbGF5ZXIyZC5wbGF5ZXJYLFxyXG5cdFx0XHRwbGF5ZXIyZC5wbGF5ZXJZLFxyXG5cdFx0XHRwbGF5ZXIyZC5yYXlBbmdsZXMsXHJcblx0XHRcdHBsYXllcjJkLnBsYXllclJheXMsXHJcblx0XHRcdHBsYXllcjJkLnBsYXllcldcclxuXHRcdCk7XHJcblxyXG5cdFx0b25lOiBpZiAocGxheWVyMmQucGxheWVyWCAhPT0gbGFzdFJlY29yZGVkUGxheWVyUG9zLnggfHwgcGxheWVyMmQucGxheWVyWSAhPT0gbGFzdFJlY29yZGVkUGxheWVyUG9zLnkpIHtcclxuXHRcdFx0bGFzdFJlY29yZGVkUGxheWVyUG9zLnggPSBwbGF5ZXIyZC5wbGF5ZXJYO1xyXG5cdFx0XHRsYXN0UmVjb3JkZWRQbGF5ZXJQb3MueSA9IHBsYXllcjJkLnBsYXllclk7XHJcblxyXG5cdFx0XHRpZiAoIXVzZXJJZCkgYnJlYWsgb25lO1xyXG5cclxuXHRcdFx0Y29uc3QgZGF0YTogSVNvY2tldERhdGFSZXEgPSB7XHJcblx0XHRcdFx0YWN0aW9uOiAndXBkYXRlLXBsYXllci1wb3MnLFxyXG5cdFx0XHRcdGlkOiB1c2VySWQsXHJcblx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0eDogbGFzdFJlY29yZGVkUGxheWVyUG9zLngsXHJcblx0XHRcdFx0XHR5OiBsYXN0UmVjb3JkZWRQbGF5ZXJQb3MueSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoMCwyNTUsMCwxKWA7XHJcblx0XHRjdHgzZC5saW5lV2lkdGggPSAyO1xyXG5cdFx0Y3R4M2QuYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgzZC5lbGxpcHNlKHdvcmxkM2Qud2lkdGggLyAyLCB3b3JsZDNkLmhlaWdodCAvIDIuNSwgNSwgNSwgMCwgMCwgMiAqIE1hdGguUEkpO1xyXG5cdFx0Y3R4M2QuZmlsbCgpO1xyXG5cdH1cclxufTtcclxuXHJcbmNvbnN0IHNldFVwID0gKCkgPT4ge1xyXG5cdHdhbGxzMmQgPSBuZXcgV2FsbHMyZCh3b3JsZDJkLCBjdHgyZCk7XHJcblx0d2FsbHMzZCA9IG5ldyBXYWxsczNkKHdvcmxkM2QsIGN0eDNkLCB3YWxsczJkLndhbGxXLCB3YWxsczJkLndhbGxIKTtcclxuXHRwbGF5ZXIyZCA9IG5ldyBQbGF5ZXIyZChcclxuXHRcdHdvcmxkMmQsXHJcblx0XHRjdHgyZCxcclxuXHRcdHdhbGxzMmQud2FsbHMsXHJcblx0XHR3YWxsczJkLndhbGxDb2xzLFxyXG5cdFx0d2FsbHMyZC53YWxsUm93cyxcclxuXHRcdHdhbGxzMmQud2FsbFcsXHJcblx0XHR3YWxsczJkLndhbGxIXHJcblx0KTtcclxuXHRwbGF5ZXIyZC5zZXRVcCgpO1xyXG5cdHBsYXllcnMgPSBuZXcgUGxheWVycyh3b3JsZDJkLCBjdHgyZCk7XHJcblx0Z2FtZUxvb3AoKTtcclxufTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcblx0dGhlbiA9IERhdGUubm93KCk7XHJcblx0c2V0VXAoKTtcclxufTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xyXG5cdGlmICghZGV2TW9kZSkge1xyXG5cdFx0cGxheWVyMmQuc2V0TW91c2VSb3RhdGlvbihlLm1vdmVtZW50WCAvIDIwKTtcclxuXHRcdHdhbGxzM2Quc2V0QmdUb3BYTW91c2VNb3ZlKGUubW92ZW1lbnRYKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG5cdC8vU2V0IG1vdmUgZm9yZXdhcmRzIGFuZCBiYWNrd2FyZHNcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5VycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIoJ2ZvcndhcmRzJyk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlTJykge1xyXG5cdFx0cGxheWVyMmQuc2V0TW92ZURpcignYmFja3dhcmRzJyk7XHJcblx0fVxyXG5cclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbignbGVmdCcpO1xyXG5cdFx0ZWxzZSBwbGF5ZXIyZC5zZXRTdHJhZmVEaXIoJ2xlZnQnKTtcclxuXHR9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleUQnKSB7XHJcblx0XHRpZiAoZGV2TW9kZSkgcGxheWVyMmQuc2V0Um90YXRpb24oJ3JpZ2h0Jyk7XHJcblx0XHRlbHNlIHBsYXllcjJkLnNldFN0cmFmZURpcigncmlnaHQnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuXHQvL1NldCBtb3ZlbWVudCB2YXJpYWJsZXMgdG8gbnVsbCB3aGVuIGtleSByZWxlYXNlZHtcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScgfHwgZS5jb2RlID09PSAnS2V5RCcpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbihudWxsKTtcclxuXHRcdGVsc2UgcGxheWVyMmQuc2V0U3RyYWZlRGlyKG51bGwpO1xyXG5cdH0gZWxzZSBpZiAoZS5jb2RlID09PSAnS2V5VycgfHwgZS5jb2RlID09PSAnS2V5UycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIobnVsbCk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlNJykge1xyXG5cdFx0ZGV2TW9kZSA9ICFkZXZNb2RlO1xyXG5cdFx0aWYgKCFkZXZNb2RlKSB7XHJcblx0XHRcdHdvcmxkMmQuY2xhc3NMaXN0LmFkZCgnZnVsbHNjcmVlbicpO1xyXG5cdFx0XHR3b3JsZDNkLmNsYXNzTGlzdC5hZGQoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0cGxheWVyMmQuZGV2TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHR3YWxsczJkLmRldk1vZGUgPSBmYWxzZTtcclxuXHRcdFx0d29ybGQzZC5yZXF1ZXN0UG9pbnRlckxvY2sgPVxyXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0XHRcdHdvcmxkM2QucmVxdWVzdFBvaW50ZXJMb2NrIHx8IHdvcmxkM2QubW96UmVxdWVzdFBvaW50ZXJMb2NrIHx8IHdvcmxkM2Qud2Via2l0UmVxdWVzdFBvaW50ZXJMb2NrO1xyXG5cdFx0XHQvL0B0cy1pZ25vcmVcclxuXHRcdFx0d29ybGQzZC5yZXF1ZXN0UG9pbnRlckxvY2soe1xyXG5cdFx0XHRcdHVuYWRqdXN0ZWRNb3ZlbWVudDogdHJ1ZSxcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR3b3JsZDJkLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0d29ybGQzZC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdHBsYXllcjJkLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0XHR3YWxsczJkLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2sgPVxyXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0XHRcdGRvY3VtZW50LmV4aXRQb2ludGVyTG9jayB8fCBkb2N1bWVudC5tb3pFeGl0UG9pbnRlckxvY2sgfHwgZG9jdW1lbnQud2Via2l0RXhpdFBvaW50ZXJMb2NrO1xyXG5cdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCAoKSA9PiB7XHJcblx0Y29uc29sZS5sb2coJ1VzZXIgY29ubmVjdGVkJyk7XHJcbn0pO1xyXG5cclxuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBldmVudCA9PiB7XHJcblx0Y29uc3QgcmVzOiBJU29ja2V0RGF0YVJlcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcblx0bGV0IGRhdGE6IElTb2NrZXREYXRhUmVxO1xyXG5cclxuXHRzd2l0Y2ggKHJlcz8uYWN0aW9uKSB7XHJcblx0XHRjYXNlICdzZXQtdXNlci1pZCc6XHJcblx0XHRcdGNvbnNvbGUubG9nKCdVc2VySWQgaGFzIGJlZW4gc2V0Jyk7XHJcblx0XHRcdHVzZXJJZCA9IHJlcy5kYXRhO1xyXG5cclxuXHRcdFx0aWYgKCF1c2VySWQpIHJldHVybjtcclxuXHRcdFx0ZGF0YSA9IHtcclxuXHRcdFx0XHRhY3Rpb246ICdzZW5kLXVzZXItdG8tY2xpZW50cycsXHJcblx0XHRcdFx0aWQ6IHVzZXJJZCxcclxuXHRcdFx0XHRkYXRhOiAnJyxcclxuXHRcdFx0fTtcclxuXHRcdFx0c29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3NlbmQtdXNlci10by1jbGllbnRzJzpcclxuXHRcdFx0cGxheWVycy5hZGRQbGF5ZXIocmVzLmRhdGEpO1xyXG5cclxuXHRcdFx0Ly8gaWYgKCF1c2VySWQpIHJldHVybjtcclxuXHRcdFx0Ly8gZGF0YSA9IHtcclxuXHRcdFx0Ly8gXHRhY3Rpb246ICdzZW5kLXVzZXItdG8tY2xpZW50cycsXHJcblx0XHRcdC8vIFx0aWQ6IHVzZXJJZCxcclxuXHRcdFx0Ly8gXHRkYXRhOiAnJyxcclxuXHRcdFx0Ly8gfTtcclxuXHRcdFx0Ly8gc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3VwZGF0ZS1wbGF5ZXItcG9zJzpcclxuXHRcdFx0cGxheWVycy51cGRhdGVQbGF5ZXJQb3MoeyBuYW1lOiByZXMuZGF0YS5wbGF5ZXJJZCwgeDogcmVzLmRhdGEueCwgeTogcmVzLmRhdGEueSB9KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICdyZW1vdmUtcGxheWVyJzpcclxuXHRcdFx0cGxheWVycy5yZW1vdmVQbGF5ZXIocmVzLmRhdGEpO1xyXG5cdFx0XHRicmVhaztcclxuXHR9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBJUGxheWVyLCBJUGxheWVyUmF5cyB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHByaXZhdGUgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHJpdmF0ZSB3YWxsQ29sczogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxXOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsSDogbnVtYmVyO1xyXG5cdHB1YmxpYyByYXlzOiBGbG9hdDMyQXJyYXkgfCBudWxsO1xyXG5cdHB1YmxpYyBvYmplY3RUeXBlczogVWludDhBcnJheSB8IG51bGw7XHJcblx0cHVibGljIG9iamVjdERpcnM6IFVpbnQ4QXJyYXkgfCBudWxsO1xyXG5cdHByaXZhdGUgcmF5SW5jcmVtZW50OiBudW1iZXI7XHJcblx0cHJpdmF0ZSByYXlPcGFjaXR5OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBmb3Y6IG51bWJlcjtcclxuXHRwcml2YXRlIGZvdlJhZDogbnVtYmVyO1xyXG5cdHB1YmxpYyByb3RhdGlvbjogbnVtYmVyO1xyXG5cdHByaXZhdGUgYW5nbGU6IG51bWJlcjtcclxuXHRwcml2YXRlIGRpc3RUb1Byb2plY3Rpb25QbGFuZTogbnVtYmVyO1xyXG5cdHB1YmxpYyByYXlBbmdsZXM6IEZsb2F0MzJBcnJheSB8IG51bGw7XHJcblx0cHJpdmF0ZSByYXlEZW5zaXR5QWRqdXN0bWVudDogbnVtYmVyO1xyXG5cdHB1YmxpYyByb3REaXI6IHN0cmluZyB8IG51bGw7XHJcblx0cHVibGljIHJvdEFtdDogbnVtYmVyO1xyXG5cdHByaXZhdGUgbW92ZURpckZCOiBzdHJpbmcgfCBudWxsO1xyXG5cdHByaXZhdGUgbW92ZUFtdFN0YXJ0OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBtb3ZlQW10OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBtb3ZlQW10VG9wOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBtb3ZlRGlyU3RyYWZlOiBzdHJpbmcgfCBudWxsO1xyXG5cdHByaXZhdGUgbW92ZURpclJheXM6IHtcclxuXHRcdGZvcmV3YXJkOiBudW1iZXI7XHJcblx0XHRsZWZ0OiBudW1iZXI7XHJcblx0XHRyaWdodDogbnVtYmVyO1xyXG5cdFx0YmFja3dhcmQ6IG51bWJlcjtcclxuXHR9O1xyXG5cdHB1YmxpYyBwbGF5ZXJYOiBudW1iZXI7XHJcblx0cHVibGljIHBsYXllclk6IG51bWJlcjtcclxuXHRwdWJsaWMgZGV2TW9kZTogYm9vbGVhbjtcclxuXHRwdWJsaWMgcGxheWVyUmF5czogSVBsYXllclJheXNbXTtcclxuXHRwdWJsaWMgcGxheWVyVzogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihcclxuXHRcdHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50LFxyXG5cdFx0Y3R4MmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuXHRcdHdhbGxzOiBVaW50OEFycmF5LFxyXG5cdFx0d2FsbENvbHM6IG51bWJlcixcclxuXHRcdHdhbGxSb3dzOiBudW1iZXIsXHJcblx0XHR3YWxsVzogbnVtYmVyLFxyXG5cdFx0d2FsbEg6IG51bWJlclxyXG5cdCkge1xyXG5cdFx0dGhpcy53b3JsZDJkID0gd29ybGQyZDtcclxuXHRcdHRoaXMuY3R4MmQgPSBjdHgyZDtcclxuXHRcdHRoaXMud2FsbHMgPSB3YWxscztcclxuXHRcdHRoaXMud2FsbENvbHMgPSB3YWxsQ29scztcclxuXHRcdHRoaXMud2FsbFJvd3MgPSB3YWxsUm93cztcclxuXHRcdHRoaXMud2FsbFcgPSB3YWxsVztcclxuXHRcdHRoaXMud2FsbEggPSB3YWxsSDtcclxuXHRcdHRoaXMucmF5cyA9IG51bGw7XHJcblx0XHR0aGlzLm9iamVjdFR5cGVzID0gbnVsbDtcclxuXHRcdHRoaXMub2JqZWN0RGlycyA9IG51bGw7XHJcblx0XHR0aGlzLnJheUluY3JlbWVudCA9IDI7XHJcblx0XHR0aGlzLnJheU9wYWNpdHkgPSAwLjI2O1xyXG5cdFx0dGhpcy5mb3YgPSA2MDtcclxuXHRcdHRoaXMuZm92UmFkID0gdGhpcy5mb3YgKiAoTWF0aC5QSSAvIDE4MCk7XHJcblx0XHR0aGlzLnJvdGF0aW9uID0gNDU7XHJcblx0XHR0aGlzLmFuZ2xlID0gdGhpcy5yb3RhdGlvbiArIDkwO1xyXG5cdFx0dGhpcy5kaXN0VG9Qcm9qZWN0aW9uUGxhbmUgPSB3b3JsZDJkLndpZHRoIC8gMiAvIE1hdGgudGFuKHRoaXMuZm92UmFkIC8gMik7XHJcblx0XHR0aGlzLnJheUFuZ2xlcyA9IG51bGw7XHJcblx0XHR0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50ID0gMTI7XHJcblx0XHR0aGlzLnJvdERpciA9IG51bGw7XHJcblx0XHR0aGlzLnJvdEFtdCA9IDI7XHJcblx0XHR0aGlzLm1vdmVEaXJGQiA9IG51bGw7XHJcblx0XHR0aGlzLm1vdmVBbXRTdGFydCA9IDI7XHJcblx0XHR0aGlzLm1vdmVBbXQgPSAzO1xyXG5cdFx0dGhpcy5tb3ZlQW10VG9wID0gMztcclxuXHRcdHRoaXMubW92ZURpclN0cmFmZSA9IG51bGw7XHJcblx0XHR0aGlzLm1vdmVEaXJSYXlzID0ge1xyXG5cdFx0XHRmb3Jld2FyZDogSW5maW5pdHksXHJcblx0XHRcdGxlZnQ6IEluZmluaXR5LFxyXG5cdFx0XHRyaWdodDogSW5maW5pdHksXHJcblx0XHRcdGJhY2t3YXJkOiBJbmZpbml0eSxcclxuXHRcdH07XHJcblx0XHR0aGlzLnBsYXllclggPSAxMDA7XHJcblx0XHR0aGlzLnBsYXllclkgPSAxMDA7XHJcblx0XHR0aGlzLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0dGhpcy5wbGF5ZXJSYXlzID0gW107XHJcblx0XHR0aGlzLnBsYXllclcgPSAyMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRVcCgpIHtcclxuXHRcdHRoaXMuc2V0QW5nbGVzKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0Um90YXRpb24oZGlyOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHQvLyBpZiAodGhpcy5yb3REaXIgPT09IG51bGwpIHtcclxuXHRcdC8vIFx0dGhpcy5yb3RBbXQgPSAyO1xyXG5cdFx0Ly8gfVxyXG5cdFx0dGhpcy5yb3REaXIgPSBkaXI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0TW91c2VSb3RhdGlvbihhbXQ6IG51bWJlcikge1xyXG5cdFx0dGhpcy5yb3RhdGlvbiArPSBhbXQ7XHJcblx0XHR0aGlzLmFuZ2xlICs9IGFtdDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRTdHJhZmVEaXIoZGlyOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHRpZiAodGhpcy5tb3ZlRGlyU3RyYWZlID09PSBudWxsKSB7XHJcblx0XHRcdHRoaXMubW92ZUFtdCA9IHRoaXMubW92ZUFtdFN0YXJ0O1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5tb3ZlRGlyU3RyYWZlID0gZGlyO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSByb3RhdGUoKSB7XHJcblx0XHQvLyBpZiAodGhpcy5yb3RBbXQgPCB0aGlzLnJvdEFtdCkge1xyXG5cdFx0Ly8gXHR0aGlzLnJvdEFtdCArPSAwLjE7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0aWYgKHRoaXMucm90RGlyID09PSAnbGVmdCcpIHtcclxuXHRcdFx0dGhpcy5yb3RhdGlvbiAtPSB0aGlzLnJvdEFtdDtcclxuXHRcdFx0dGhpcy5hbmdsZSAtPSB0aGlzLnJvdEFtdDtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5yb3REaXIgPT09ICdyaWdodCcpIHtcclxuXHRcdFx0dGhpcy5yb3RhdGlvbiArPSB0aGlzLnJvdEFtdDtcclxuXHRcdFx0dGhpcy5hbmdsZSArPSB0aGlzLnJvdEFtdDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRNb3ZlRGlyKGRpcjogc3RyaW5nIHwgbnVsbCkge1xyXG5cdFx0aWYgKHRoaXMubW92ZURpckZCID09PSBudWxsKSB7XHJcblx0XHRcdHRoaXMubW92ZUFtdCA9IHRoaXMubW92ZUFtdFN0YXJ0O1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5tb3ZlRGlyRkIgPSBkaXI7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG1vdmUoKSB7XHJcblx0XHRpZiAoIXRoaXM/LnJheXM/Lmxlbmd0aCkgcmV0dXJuO1xyXG5cdFx0dGhpcy5yb3RhdGUoKTtcclxuXHJcblx0XHRpZiAodGhpcy5tb3ZlQW10IDwgdGhpcy5tb3ZlQW10VG9wKSB0aGlzLm1vdmVBbXQgKz0gMC4wNTtcclxuXHJcblx0XHRjb25zdCBkaXJSYWRpYW5zID0gdGhpcy5hbmdsZSAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdGNvbnN0IG1vdmVYID0gdGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoOTAgKiAoTWF0aC5QSSAvIDE4MCkgLSBkaXJSYWRpYW5zKTtcclxuXHRcdGNvbnN0IG1vdmVZID0gdGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoZGlyUmFkaWFucyk7XHJcblx0XHRjb25zdCBkaXJSYWRpYW5zU3RyYWZlID0gZGlyUmFkaWFucyArIE1hdGguUEkgLyAyO1xyXG5cdFx0Y29uc3Qgc3RyYWZlWCA9ICh0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyg5MCAqIChNYXRoLlBJIC8gMTgwKSAtIGRpclJhZGlhbnNTdHJhZmUpKSAvIDI7XHJcblx0XHRjb25zdCBzdHJhZmVZID0gKHRoaXMubW92ZUFtdCAqIE1hdGguY29zKGRpclJhZGlhbnNTdHJhZmUpKSAvIDI7XHJcblx0XHRjb25zdCBoaXR0aW5nRiA9IHRoaXMubW92ZURpclJheXMuZm9yZXdhcmQgPCAxNDtcclxuXHRcdGNvbnN0IGhpdHRpbmdMID0gdGhpcy5tb3ZlRGlyUmF5cy5sZWZ0IDwgMTQ7XHJcblx0XHRjb25zdCBoaXR0aW5nUiA9IHRoaXMubW92ZURpclJheXMucmlnaHQgPCAxNDtcclxuXHRcdGNvbnN0IGhpdHRpbmdCID0gdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA8IDE0O1xyXG5cclxuXHRcdGlmICh0aGlzLm1vdmVEaXJGQiA9PT0gJ2ZvcndhcmRzJykge1xyXG5cdFx0XHRpZiAoIWhpdHRpbmdGKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJYICs9IG1vdmVYO1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWSAtPSBtb3ZlWTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLm1vdmVEaXJGQiA9PT0gJ2JhY2t3YXJkcycpIHtcclxuXHRcdFx0aWYgKCFoaXR0aW5nQikge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWCAtPSBtb3ZlWDtcclxuXHRcdFx0XHR0aGlzLnBsYXllclkgKz0gbW92ZVk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLm1vdmVEaXJTdHJhZmUgPT09ICdsZWZ0Jykge1xyXG5cdFx0XHRpZiAoIWhpdHRpbmdMKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJYIC09IHN0cmFmZVg7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFoaXR0aW5nTCkge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWSArPSBzdHJhZmVZO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMubW92ZURpclN0cmFmZSA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHRpZiAoIWhpdHRpbmdSKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJYICs9IHN0cmFmZVg7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKCFoaXR0aW5nUikge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWSAtPSBzdHJhZmVZO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHNldEFuZ2xlcygpIHtcclxuXHRcdGNvbnN0IGFuZ2xlQXJyTGVuZ3RoID0gTWF0aC5jZWlsKFxyXG5cdFx0XHQodGhpcy53b3JsZDJkLndpZHRoICsgdGhpcy5yYXlEZW5zaXR5QWRqdXN0bWVudCkgLyB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50XHJcblx0XHQpO1xyXG5cdFx0dGhpcy5yYXlBbmdsZXMgPSBuZXcgRmxvYXQzMkFycmF5KGFuZ2xlQXJyTGVuZ3RoKTtcclxuXHRcdHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lID0gdGhpcy53b3JsZDJkLndpZHRoIC8gMiAvIE1hdGgudGFuKHRoaXMuZm92UmFkIC8gMik7XHJcblxyXG5cdFx0bGV0IHggPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhbmdsZUFyckxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMucmF5QW5nbGVzW2ldID0gTWF0aC5hdGFuKCh4IC0gdGhpcy53b3JsZDJkLndpZHRoIC8gMikgLyB0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSk7XHJcblx0XHRcdHggKz0gdGhpcy5yYXlEZW5zaXR5QWRqdXN0bWVudDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnJheXMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCk7XHJcblx0XHR0aGlzLm9iamVjdFR5cGVzID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5yYXlBbmdsZXMubGVuZ3RoKTtcclxuXHRcdHRoaXMub2JqZWN0RGlycyA9IG5ldyBVaW50OEFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldEludGVyc2VjdGlvbiA9IChcclxuXHRcdHg6IG51bWJlcixcclxuXHRcdHk6IG51bWJlcixcclxuXHRcdHI6IG51bWJlcixcclxuXHRcdHRoZXRhOiBudW1iZXIsXHJcblx0XHR4MTogbnVtYmVyLFxyXG5cdFx0eTE6IG51bWJlcixcclxuXHRcdHgyOiBudW1iZXIsXHJcblx0XHR5MjogbnVtYmVyLFxyXG5cdFx0cm90OiBudW1iZXIsXHJcblx0XHRwND86IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfVxyXG5cdCkgPT4ge1xyXG5cdFx0Y29uc3QgYWRqdXN0ZWRBbmdsZSA9IHRoZXRhICsgcm90ICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0Y29uc3QgeDMgPSB4O1xyXG5cdFx0Y29uc3QgeTMgPSB5O1xyXG5cdFx0bGV0IHg0O1xyXG5cdFx0bGV0IHk0O1xyXG5cdFx0bGV0IHVNYXggPSBJbmZpbml0eTtcclxuXHRcdGlmIChwND8ueCAmJiBwND8ueSkge1xyXG5cdFx0XHR4NCA9IHA0Lng7XHJcblx0XHRcdHk0ID0gcDQueTtcclxuXHRcdFx0dU1heCA9IDE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR4NCA9IHggKyByICogTWF0aC5jb3MoYWRqdXN0ZWRBbmdsZSk7XHJcblx0XHRcdHk0ID0geSArIHIgKiBNYXRoLnNpbihhZGp1c3RlZEFuZ2xlKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBkZW5vbSA9ICh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KTtcclxuXHJcblx0XHRpZiAoZGVub20gPT0gMCkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRjb25zdCB0ID0gKCh4MSAtIHgzKSAqICh5MyAtIHk0KSAtICh5MSAtIHkzKSAqICh4MyAtIHg0KSkgLyBkZW5vbTtcclxuXHRcdGNvbnN0IHUgPSAoKHgxIC0geDMpICogKHkxIC0geTIpIC0gKHkxIC0geTMpICogKHgxIC0geDIpKSAvIGRlbm9tO1xyXG5cdFx0aWYgKHQgPj0gMCAmJiB0IDw9IDEgJiYgdSA+PSAwICYmIHUgPD0gdU1heCkge1xyXG5cdFx0XHRjb25zdCBweCA9IHgzICsgdSAqICh4NCAtIHgzKTtcclxuXHRcdFx0Y29uc3QgcHkgPSB5MyArIHUgKiAoeTQgLSB5Myk7XHJcblx0XHRcdHJldHVybiBbcHgsIHB5XTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRwcml2YXRlIGdldEludGVyc2VjdGlvbnNGb3JSZWN0KFxyXG5cdFx0ajogbnVtYmVyLFxyXG5cdFx0azogbnVtYmVyLFxyXG5cdFx0eDogbnVtYmVyLFxyXG5cdFx0eTogbnVtYmVyLFxyXG5cdFx0cmF5QW5nbGU6IG51bWJlcixcclxuXHRcdHJvdGF0aW9uOiBudW1iZXIsXHJcblx0XHRwND86IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfVxyXG5cdCkge1xyXG5cdFx0Y29uc3QgciA9IDE7XHJcblx0XHRjb25zdCB4MSA9IGsgKiB0aGlzLndhbGxXO1xyXG5cdFx0Y29uc3QgeTEgPSBqICogdGhpcy53YWxsSDtcclxuXHJcblx0XHRjb25zdCB4MiA9IHgxICsgdGhpcy53YWxsVztcclxuXHRcdGNvbnN0IHkyID0geTE7XHJcblxyXG5cdFx0Y29uc3QgeDMgPSB4MSArIHRoaXMud2FsbFc7XHJcblx0XHRjb25zdCB5MyA9IHkxICsgdGhpcy53YWxsSDtcclxuXHJcblx0XHRjb25zdCB4NCA9IHgxO1xyXG5cdFx0Y29uc3QgeTQgPSB5MSArIHRoaXMud2FsbEg7XHJcblxyXG5cdFx0bGV0IHJlY29yZCA9IEluZmluaXR5O1xyXG5cdFx0bGV0IGNsb3Nlc3QgPSBudWxsO1xyXG5cdFx0bGV0IGRpciA9IDA7XHJcblxyXG5cdFx0Zm9yIChsZXQgbiA9IDA7IG4gPCA0OyBuKyspIHtcclxuXHRcdFx0c3dpdGNoIChuKSB7XHJcblx0XHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uVG9wID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgcmF5QW5nbGUsIHgxLCB5MSwgeDIsIHkyLCByb3RhdGlvbiwgcDQpO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvblRvcCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25Ub3BbMF0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBpbnRlcnNlY3Rpb25Ub3BbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uVG9wO1xyXG5cdFx0XHRcdFx0XHRcdGRpciA9IDA7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25SaWdodCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHJheUFuZ2xlLCB4MiwgeTIsIHgzLCB5Mywgcm90YXRpb24sIHA0KTtcclxuXHRcdFx0XHRcdGlmIChpbnRlcnNlY3Rpb25SaWdodCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25SaWdodFswXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGludGVyc2VjdGlvblJpZ2h0WzFdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblx0XHRcdFx0XHRcdHJlY29yZCA9IE1hdGgubWluKGQsIHJlY29yZCk7XHJcblx0XHRcdFx0XHRcdGlmIChkIDw9IHJlY29yZCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlY29yZCA9IGQ7XHJcblx0XHRcdFx0XHRcdFx0Y2xvc2VzdCA9IGludGVyc2VjdGlvblJpZ2h0O1xyXG5cdFx0XHRcdFx0XHRcdGRpciA9IDE7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbkJvdCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHJheUFuZ2xlLCB4MywgeTMsIHg0LCB5NCwgcm90YXRpb24sIHA0KTtcclxuXHRcdFx0XHRcdGlmIChpbnRlcnNlY3Rpb25Cb3QpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gaW50ZXJzZWN0aW9uQm90WzBdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uQm90WzFdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblx0XHRcdFx0XHRcdHJlY29yZCA9IE1hdGgubWluKGQsIHJlY29yZCk7XHJcblx0XHRcdFx0XHRcdGlmIChkIDw9IHJlY29yZCkge1xyXG5cdFx0XHRcdFx0XHRcdHJlY29yZCA9IGQ7XHJcblx0XHRcdFx0XHRcdFx0Y2xvc2VzdCA9IGludGVyc2VjdGlvbkJvdDtcclxuXHRcdFx0XHRcdFx0XHRkaXIgPSAyO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25MZWZ0ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgcmF5QW5nbGUsIHg0LCB5NCwgeDEsIHkxLCByb3RhdGlvbiwgcDQpO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvbkxlZnQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gaW50ZXJzZWN0aW9uTGVmdFswXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGludGVyc2VjdGlvbkxlZnRbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uTGVmdDtcclxuXHRcdFx0XHRcdFx0XHRkaXIgPSAzO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlY29yZCxcclxuXHRcdFx0Y2xvc2VzdCxcclxuXHRcdFx0ZGlyLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0UmF5QW5nbGUoeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlcikge1xyXG5cdFx0bGV0IHJheUFuZyA9XHJcblx0XHRcdHgyIC0geDEgPCAwXHJcblx0XHRcdFx0PyAyNzAgLSAoTWF0aC5hdGFuKCh5MiAtIHkxKSAvIC0oeDIgLSB4MSkpICogMTgwKSAvIE1hdGguUElcclxuXHRcdFx0XHQ6IDkwICsgKE1hdGguYXRhbigoeTIgLSB5MSkgLyAoeDIgLSB4MSkpICogMTgwKSAvIE1hdGguUEk7XHJcblx0XHRyYXlBbmcgPSAoKChyYXlBbmcgLSA5MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHJcblx0XHRyZXR1cm4gcmF5QW5nO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRQZXJjQWNyU2NyZWVuKFxyXG5cdFx0eDogbnVtYmVyLFxyXG5cdFx0eTogbnVtYmVyLFxyXG5cdFx0cHg6IG51bWJlcixcclxuXHRcdHB5OiBudW1iZXIsXHJcblx0XHRyb3RhdGlvbjogbnVtYmVyLFxyXG5cdFx0aXNTcHJpdGU6IGJvb2xlYW5cclxuXHQpIHtcclxuXHRcdGNvbnN0IHJheUFuZyA9IHRoaXMuZ2V0UmF5QW5nbGUoeCwgeSwgcHgsIHB5KTtcclxuXHJcblx0XHRsZXQgcmF5Um90RGlmZiA9IHJheUFuZyAtIHJvdGF0aW9uO1xyXG5cclxuXHRcdGlmIChNYXRoLmFicyhyYXlSb3REaWZmKSA+IHRoaXMuZm92IC8gMikge1xyXG5cdFx0XHRyYXlSb3REaWZmID0gcmF5Um90RGlmZiA+PSAwID8gcmF5Um90RGlmZiAtIDM2MCA6IDM2MCArIHJheVJvdERpZmY7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgcGVyY0FjclNjcmVlbiA9IHJheVJvdERpZmYgLyB0aGlzLmZvdiArIDAuNTtcclxuXHJcblx0XHRyZXR1cm4gcGVyY0FjclNjcmVlbjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KHBsYXllcnM6IElQbGF5ZXJbXSkge1xyXG5cdFx0Y29uc3QgeCA9IHRoaXMucGxheWVyWDtcclxuXHRcdGNvbnN0IHkgPSB0aGlzLnBsYXllclk7XHJcblxyXG5cdFx0dGhpcy5wbGF5ZXJSYXlzID0gW107XHJcblxyXG5cdFx0dGhpcy5tb3ZlKCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLnJheUFuZ2xlcyB8fCAhdGhpcy5yYXlzKSByZXR1cm47XHJcblx0XHRjb25zdCByID0gMTtcclxuXHRcdGNvbnN0IHJvdGF0aW9uID0gKCh0aGlzLnJvdGF0aW9uICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblxyXG5cdFx0bGV0IG9ialR5cGVUZW1wID0gMDtcclxuXHRcdGxldCBvYmpEaXJUZW1wID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmF5QW5nbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBjbG9zZXN0ID0gbnVsbDtcclxuXHRcdFx0bGV0IHJlY29yZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxSb3dzOyBqKyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IHRoaXMud2FsbENvbHM7IGsrKykge1xyXG5cdFx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaiAqIHRoaXMud2FsbENvbHMgKyBrXTtcclxuXHRcdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCByZWN0SW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0XHRcdGRpcjogbnVtYmVyO1xyXG5cdFx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaiwgaywgeCwgeSwgdGhpcy5yYXlBbmdsZXNbaV0sIHJvdGF0aW9uKTtcclxuXHJcblx0XHRcdFx0XHRpZiAocmVjdEludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gcmVjdEludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRcdGNsb3Nlc3QgPSByZWN0SW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblxyXG5cdFx0XHRcdFx0XHRvYmpUeXBlVGVtcCA9IHdhbGw7XHJcblx0XHRcdFx0XHRcdG9iakRpclRlbXAgPSByZWN0SW50ZXJzZWN0aW9uLmRpcjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjbG9zZXN0KSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuZGV2TW9kZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubW92ZVRvKHgsIHkpO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5saW5lVG8oY2xvc2VzdFswXSwgY2xvc2VzdFsxXSk7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZVN0eWxlID0gYHJnYmEoMjU1LDI1NSwyNTUsJHt0aGlzLnJheU9wYWNpdHl9KWA7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5yYXlzW2ldID0gcmVjb3JkO1xyXG5cdFx0XHRcdGlmICh0aGlzLm9iamVjdFR5cGVzKSB0aGlzLm9iamVjdFR5cGVzW2ldID0gb2JqVHlwZVRlbXA7XHJcblx0XHRcdFx0aWYgKHRoaXMub2JqZWN0RGlycykgdGhpcy5vYmplY3REaXJzW2ldID0gb2JqRGlyVGVtcDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnJheXNbaV0gPSBJbmZpbml0eTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxvb3AxOiBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcCA9IHBsYXllcnNbaV07XHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsUm93czsgaisrKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLndhbGxDb2xzOyBrKyspIHtcclxuXHRcdFx0XHRcdGNvbnN0IHdhbGwgPSB0aGlzLndhbGxzW2ogKiB0aGlzLndhbGxDb2xzICsga107XHJcblx0XHRcdFx0XHRpZiAod2FsbCA9PT0gMCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgcmVjdEludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdFx0XHRkaXI6IG51bWJlcjtcclxuXHRcdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGosIGssIHgsIHksIDAsIHJvdGF0aW9uLCB7IHg6IHAueCwgeTogcC55IH0pO1xyXG5cclxuXHRcdFx0XHRcdGlmIChyZWN0SW50ZXJzZWN0aW9uPy5jbG9zZXN0Py5bMF0pIGNvbnRpbnVlIGxvb3AxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gcC54KTtcclxuXHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gcC55KTtcclxuXHRcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblxyXG5cdFx0XHRjb25zdCBkZWx0YUQgPSB0aGlzLnBsYXllclcgLyAyO1xyXG5cdFx0XHRjb25zdCBzbG9wZSA9IChwLnkgLSB0aGlzLnBsYXllclkpIC8gKHAueCAtIHRoaXMucGxheWVyWCk7XHJcblx0XHRcdGNvbnN0IHBlcnBTbG9wZSA9IC0oMSAvIHNsb3BlKTtcclxuXHRcdFx0Y29uc3QgYW5nbGUgPSBNYXRoLmF0YW4ocGVycFNsb3BlKTtcclxuXHRcdFx0Y29uc3QgeDEgPSBwLnggKyBkZWx0YUQgKiBNYXRoLmNvcyhhbmdsZSk7XHJcblx0XHRcdGNvbnN0IHkxID0gcC55ICsgZGVsdGFEICogTWF0aC5zaW4oYW5nbGUpO1xyXG5cdFx0XHRjb25zdCB4MiA9IHAueCAtIGRlbHRhRCAqIE1hdGguY29zKGFuZ2xlKTtcclxuXHRcdFx0Y29uc3QgeTIgPSBwLnkgLSBkZWx0YUQgKiBNYXRoLnNpbihhbmdsZSk7XHJcblxyXG5cdFx0XHRjb25zdCBwZXJjQWNyU2NyZWVuOiBudW1iZXIgPSB0aGlzLmdldFBlcmNBY3JTY3JlZW4oeCwgeSwgcC54LCBwLnksIHJvdGF0aW9uLCBmYWxzZSk7XHJcblxyXG5cdFx0XHRjb25zdCBhbmdsZURlZyA9IHRoaXMuZ2V0UmF5QW5nbGUoeCwgeSwgcC54LCBwLnkpO1xyXG5cdFx0XHRsZXQgcGVyY0FjclNjcmVlbkw6IG51bWJlciA9IC0xO1xyXG5cdFx0XHRsZXQgcGVyY0FjclNjcmVlblI6IG51bWJlciA9IC0xO1xyXG5cclxuXHRcdFx0aWYgKGFuZ2xlRGVnID49IDAgJiYgYW5nbGVEZWcgPD0gMTgwKSB7XHJcblx0XHRcdFx0cGVyY0FjclNjcmVlbkwgPSB0aGlzLmdldFBlcmNBY3JTY3JlZW4oeCwgeSwgeDEsIHkxLCByb3RhdGlvbiwgdHJ1ZSk7XHJcblx0XHRcdFx0cGVyY0FjclNjcmVlblIgPSB0aGlzLmdldFBlcmNBY3JTY3JlZW4oeCwgeSwgeDIsIHkyLCByb3RhdGlvbiwgdHJ1ZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cGVyY0FjclNjcmVlbkwgPSB0aGlzLmdldFBlcmNBY3JTY3JlZW4oeCwgeSwgeDIsIHkyLCByb3RhdGlvbiwgdHJ1ZSk7XHJcblx0XHRcdFx0cGVyY0FjclNjcmVlblIgPSB0aGlzLmdldFBlcmNBY3JTY3JlZW4oeCwgeSwgeDEsIHkxLCByb3RhdGlvbiwgdHJ1ZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICgocGVyY0FjclNjcmVlbkwgPj0gMCAmJiBwZXJjQWNyU2NyZWVuTCA8PSAxKSB8fCAocGVyY0FjclNjcmVlblIgPj0gMCAmJiBwZXJjQWNyU2NyZWVuUiA8PSAxKSkge1xyXG5cdFx0XHRcdGlmIChwZXJjQWNyU2NyZWVuTCA+PSAwICYmIHBlcmNBY3JTY3JlZW5MIDw9IDEgJiYgcGVyY0FjclNjcmVlblIgPj0gMCAmJiBwZXJjQWNyU2NyZWVuUiA8PSAxKSB7XHJcblx0XHRcdFx0XHRjb25zdCBwZXJjQWNyU2NyZWVuTHRlbXAgPSBwZXJjQWNyU2NyZWVuTDtcclxuXHRcdFx0XHRcdHBlcmNBY3JTY3JlZW5MID0gTWF0aC5taW4ocGVyY0FjclNjcmVlbkwsIHBlcmNBY3JTY3JlZW5SKTtcclxuXHRcdFx0XHRcdHBlcmNBY3JTY3JlZW5SID0gTWF0aC5tYXgocGVyY0FjclNjcmVlbkx0ZW1wLCBwZXJjQWNyU2NyZWVuUik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucGxheWVyUmF5cy5wdXNoKHtcclxuXHRcdFx0XHRcdGw6IGQsXHJcblx0XHRcdFx0XHR4OiBwLngsXHJcblx0XHRcdFx0XHR5OiBwLnksXHJcblx0XHRcdFx0XHRuYW1lOiBwLm5hbWUsXHJcblx0XHRcdFx0XHRwZXJjQWNyb3NzU2NyZWVuOiBwZXJjQWNyU2NyZWVuLFxyXG5cdFx0XHRcdFx0cGVyY0Fjcm9zc1NjcmVlbjE6IHBlcmNBY3JTY3JlZW5MLFxyXG5cdFx0XHRcdFx0cGVyY0Fjcm9zc1NjcmVlbjI6IHBlcmNBY3JTY3JlZW5SLFxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5kZXZNb2RlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5tb3ZlVG8oeCwgeSk7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVUbyhwLngsIHAueSk7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZVN0eWxlID0gYHJnYmEoMjU1LDAsMCwxKWA7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgKHBlcmNBY3JTY3JlZW4gPj0gMCAmJiBwZXJjQWNyU2NyZWVuIDw9IDEpIHtcclxuXHRcdFx0Ly8gXHR0aGlzLnBsYXllclJheXMucHVzaCh7XHJcblx0XHRcdC8vIFx0XHRsOiBkLFxyXG5cdFx0XHQvLyBcdFx0eDogcC54LFxyXG5cdFx0XHQvLyBcdFx0eTogcC55LFxyXG5cdFx0XHQvLyBcdFx0bmFtZTogcC5uYW1lLFxyXG5cdFx0XHQvLyBcdFx0cGVyY0Fjcm9zc1NjcmVlbjogcGVyY0FjclNjcmVlbixcclxuXHRcdFx0Ly8gXHR9KTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHJvdGF0aW9uRiA9ICgodGhpcy5yb3RhdGlvbiAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cdFx0Y29uc3Qgcm90YXRpb25SID0gKCgodGhpcy5yb3RhdGlvbiArIDkwKSAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cdFx0Y29uc3Qgcm90YXRpb25CID0gKCgodGhpcy5yb3RhdGlvbiArIDE4MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHRcdGNvbnN0IHJvdGF0aW9uTCA9ICgoKHRoaXMucm90YXRpb24gLSA5MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHJcblx0XHRsZXQgY2xvc2VzdEYgPSBudWxsO1xyXG5cdFx0bGV0IHJlY29yZEYgPSBJbmZpbml0eTtcclxuXHJcblx0XHRsZXQgY2xvc2VzdEwgPSBudWxsO1xyXG5cdFx0bGV0IHJlY29yZEwgPSBJbmZpbml0eTtcclxuXHJcblx0XHRsZXQgY2xvc2VzdFIgPSBudWxsO1xyXG5cdFx0bGV0IHJlY29yZFIgPSBJbmZpbml0eTtcclxuXHJcblx0XHRsZXQgY2xvc2VzdEIgPSBudWxsO1xyXG5cdFx0bGV0IHJlY29yZEIgPSBJbmZpbml0eTtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2FsbFJvd3M7IGkrKykge1xyXG5cdFx0XHRsb29wMjogZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxDb2xzOyBqKyspIHtcclxuXHRcdFx0XHRjb25zdCB3YWxsID0gdGhpcy53YWxsc1tpICogdGhpcy53YWxsQ29scyArIGpdO1xyXG5cdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZSBsb29wMjtcclxuXHJcblx0XHRcdFx0Y29uc3QgZkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgMCwgcm90YXRpb25GKTtcclxuXHRcdFx0XHRpZiAoZkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRGKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRGID0gZkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0RiA9IGZJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IGxJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGksIGosIHgsIHksIDAsIHJvdGF0aW9uTCk7XHJcblx0XHRcdFx0aWYgKGxJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkTCkge1xyXG5cdFx0XHRcdFx0cmVjb3JkTCA9IGxJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdEwgPSBsSW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBySW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdGNsb3Nlc3Q6IG51bWJlcltdIHwgbnVsbDtcclxuXHRcdFx0XHR9ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChpLCBqLCB4LCB5LCAwLCByb3RhdGlvblIpO1xyXG5cdFx0XHRcdGlmIChySW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZFIpIHtcclxuXHRcdFx0XHRcdHJlY29yZFIgPSBySW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdGNsb3Nlc3RSID0gckludGVyc2VjdGlvbi5jbG9zZXN0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3QgYkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgMCwgcm90YXRpb25CKTtcclxuXHRcdFx0XHRpZiAoYkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRCKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRCID0gYkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0QiA9IGJJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY2xvc2VzdEYpIHRoaXMubW92ZURpclJheXMuZm9yZXdhcmQgPSByZWNvcmRGO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RMKSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSByZWNvcmRMO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSBJbmZpbml0eTtcclxuXHJcblx0XHRpZiAoY2xvc2VzdFIpIHRoaXMubW92ZURpclJheXMucmlnaHQgPSByZWNvcmRSO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0ID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RCKSB0aGlzLm1vdmVEaXJSYXlzLmJhY2t3YXJkID0gcmVjb3JkQjtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gYHJnYmEoMCwyNTUsMCwxKWA7XHJcblx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0dGhpcy5jdHgyZC5lbGxpcHNlKHRoaXMucGxheWVyWCwgdGhpcy5wbGF5ZXJZLCA2LCA2LCAwLCAwLCAyICogTWF0aC5QSSk7XHJcblx0XHR0aGlzLmN0eDJkLmZpbGwoKTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgSVBsYXllciB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVycyB7XHJcblx0cHJpdmF0ZSB3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHVibGljIHBsYXllcnM6IElQbGF5ZXJbXTtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMud29ybGQyZCA9IHdvcmxkMmQ7XHJcblx0XHR0aGlzLmN0eDJkID0gY3R4MmQ7XHJcblx0XHR0aGlzLnBsYXllcnMgPSBbXTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGRQbGF5ZXIobmFtZTogc3RyaW5nKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJzW2ldLm5hbWUgPT09IG5hbWUpIHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBsYXllcnMucHVzaCh7XHJcblx0XHRcdG5hbWU6IG5hbWUsXHJcblx0XHRcdHg6IHRoaXMud29ybGQyZC53aWR0aCAvIDIsXHJcblx0XHRcdHk6IHRoaXMud29ybGQyZC5oZWlnaHQgLyAyLFxyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhgJHtuYW1lfSBoYXMgam9pbmVkIHRoZSBtYXRjaGApO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlbW92ZVBsYXllcihuYW1lOiBzdHJpbmcpIHtcclxuXHRcdGNvbnNvbGUubG9nKGBQbGF5ZXIgJHtuYW1lfSBoYXMgbGVmdCB0aGUgbWF0Y2hgKTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnBsYXllcnNbaV0ubmFtZSA9PT0gbmFtZSkge1xyXG5cdFx0XHRcdHRoaXMucGxheWVycy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGVQbGF5ZXJQb3MocDogSVBsYXllcikge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMucGxheWVyc1tpXS5uYW1lID09PSBwLm5hbWUpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllcnNbaV0ueCA9IHAueDtcclxuXHRcdFx0XHR0aGlzLnBsYXllcnNbaV0ueSA9IHAueTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBsYXllcnMucHVzaCh7XHJcblx0XHRcdG5hbWU6IHAubmFtZSxcclxuXHRcdFx0eDogcC54LFxyXG5cdFx0XHR5OiBwLnksXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcCA9IHRoaXMucGxheWVyc1tpXTtcclxuXHJcblx0XHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gJ3JlZCc7XHJcblx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdHRoaXMuY3R4MmQuZWxsaXBzZShwLngsIHAueSwgNiwgNiwgMiAqIE1hdGguUEksIDAsIDIgKiBNYXRoLlBJKTtcclxuXHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxzMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHB1YmxpYyB3YWxsQ29sczogbnVtYmVyO1xyXG5cdHB1YmxpYyB3YWxsUm93czogbnVtYmVyO1xyXG5cdHB1YmxpYyB3YWxsczogVWludDhBcnJheTtcclxuXHRwdWJsaWMgd2FsbFc6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbEg6IG51bWJlcjtcclxuXHRwdWJsaWMgZGV2TW9kZTogYm9vbGVhbjtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMud29ybGQyZCA9IHdvcmxkMmQ7XHJcblx0XHR0aGlzLmN0eDJkID0gY3R4MmQ7XHJcblx0XHR0aGlzLndhbGxDb2xzID0gMzI7XHJcblx0XHR0aGlzLndhbGxSb3dzID0gMTg7XHJcblx0XHR0aGlzLndhbGxzID0gbmV3IFVpbnQ4QXJyYXkoXHJcblx0XHRcdFtcclxuXHRcdFx0XHRbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMSwgMSwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDEsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMSwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDAsIDAsIDEsIDEsIDEsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDAsIDEsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAxLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMSwgMSwgMSwgMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDEsIDEsIDEsIDAsIDEsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMSwgMSwgMSwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAyLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMSwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMSwgMSwgMSwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuXHRcdFx0XS5mbGF0KClcclxuXHRcdCk7XHJcblx0XHR0aGlzLndhbGxXID0gdGhpcy53b3JsZDJkLndpZHRoIC8gdGhpcy53YWxsQ29scztcclxuXHRcdHRoaXMud2FsbEggPSB0aGlzLndvcmxkMmQuaGVpZ2h0IC8gdGhpcy53YWxsUm93cztcclxuXHRcdHRoaXMuZGV2TW9kZSA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZHJhdygpIHtcclxuXHRcdGlmICh0aGlzLmRldk1vZGUpIHtcclxuXHRcdFx0bGV0IGNvdW50ID0gMDtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxSb3dzOyBpKyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2FsbENvbHM7IGorKykge1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5maWxsU3R5bGUgPSAncmdiKDEwMCwgMTAwLCAxMDApJztcclxuXHRcdFx0XHRcdGNvbnN0IHdhbGwgPSB0aGlzLndhbGxzW2kgKiB0aGlzLndhbGxDb2xzICsgal07XHJcblxyXG5cdFx0XHRcdFx0c3dpdGNoICh3YWxsKSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5yZWN0KGogKiB0aGlzLndhbGxXLCBpICogdGhpcy53YWxsSCwgdGhpcy53YWxsVywgdGhpcy53YWxsSCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3R4MmQucmVjdChqICogdGhpcy53YWxsVywgaSAqIHRoaXMud2FsbEgsIHRoaXMud2FsbFcsIHRoaXMud2FsbEgpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuZmlsbCgpO1xyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgSVBsYXllclJheXMgfSBmcm9tICcuL3R5cGVzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxzM2Qge1xyXG5cdHByaXZhdGUgd29ybGQzZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgzZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHByaXZhdGUgd2FsbFc6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxIOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3b3JsZDNkRGlhZzogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbFRleHR1cmU6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcblx0cHJpdmF0ZSBiZ1RvcEltZzogSFRNTEltYWdlRWxlbWVudDtcclxuXHRwcml2YXRlIGJnVG9wWDogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbENlbnRlckhlaWdodDogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcih3b3JsZDNkOiBIVE1MQ2FudmFzRWxlbWVudCwgY3R4M2Q6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgd2FsbFc6IG51bWJlciwgd2FsbEg6IG51bWJlcikge1xyXG5cdFx0dGhpcy53b3JsZDNkID0gd29ybGQzZDtcclxuXHRcdHRoaXMuY3R4M2QgPSBjdHgzZDtcclxuXHRcdHRoaXMud2FsbFcgPSB3YWxsVztcclxuXHRcdHRoaXMud2FsbEggPSB3YWxsSDtcclxuXHRcdHRoaXMud29ybGQzZERpYWcgPSBNYXRoLnNxcnQoTWF0aC5wb3cod29ybGQzZC53aWR0aCwgMikgKyBNYXRoLnBvdyh3b3JsZDNkLmhlaWdodCwgMikpO1xyXG5cdFx0dGhpcy53YWxsVGV4dHVyZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0dGhpcy53YWxsVGV4dHVyZS5zcmMgPSAnLi4vcHVibGljL3N0b25lVGV4dHVyZS5wbmcnO1xyXG5cdFx0dGhpcy5iZ1RvcEltZyA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0dGhpcy5iZ1RvcEltZy5zcmMgPSAnLi4vcHVibGljL3N0YXJzLmpwZyc7XHJcblx0XHR0aGlzLmJnVG9wWCA9IDA7XHJcblx0XHR0aGlzLndhbGxDZW50ZXJIZWlnaHQgPSB0aGlzLndvcmxkM2QuaGVpZ2h0IC8gMi41O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBkcmF3QmFja2dyb3VuZCgpIHtcclxuXHRcdC8vbXVsdGlwbHkgYmcgaW1nIHdpZHRoIGJ5IDQgc28gd2hlbiB5b3Ugcm90YXRlIDkwZGVnLCB5b3UncmUgMS80dGggdGhyb3VnaCB0aGUgaW1nXHJcblx0XHR0aGlzLmJnVG9wSW1nLndpZHRoID0gdGhpcy53b3JsZDNkLndpZHRoICogMjtcclxuXHRcdHRoaXMuYmdUb3BJbWcuaGVpZ2h0ID0gdGhpcy53b3JsZDNkLmhlaWdodDtcclxuXHJcblx0XHQvL3Jlc2V0IGJnIGltZyBwb3NpdGlvbiBpZiBlbmRzIG9mIGltZyBhcmUgaW4gdmlld1xyXG5cdFx0aWYgKHRoaXMuYmdUb3BYID4gMCkge1xyXG5cdFx0XHR0aGlzLmJnVG9wWCA9IC10aGlzLmJnVG9wSW1nLndpZHRoO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmJnVG9wWCA8IC10aGlzLmJnVG9wSW1nLndpZHRoKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmN0eDNkLmRyYXdJbWFnZShcclxuXHRcdFx0dGhpcy5iZ1RvcEltZyxcclxuXHRcdFx0dGhpcy5iZ1RvcFgsXHJcblx0XHRcdHRoaXMud2FsbENlbnRlckhlaWdodCxcclxuXHRcdFx0dGhpcy5iZ1RvcEltZy53aWR0aCxcclxuXHRcdFx0LXRoaXMuYmdUb3BJbWcuaGVpZ2h0XHJcblx0XHQpO1xyXG5cdFx0dGhpcy5jdHgzZC5kcmF3SW1hZ2UoXHJcblx0XHRcdHRoaXMuYmdUb3BJbWcsXHJcblx0XHRcdHRoaXMuYmdUb3BYICsgdGhpcy5iZ1RvcEltZy53aWR0aCxcclxuXHRcdFx0dGhpcy53YWxsQ2VudGVySGVpZ2h0LFxyXG5cdFx0XHR0aGlzLmJnVG9wSW1nLndpZHRoLFxyXG5cdFx0XHQtdGhpcy5iZ1RvcEltZy5oZWlnaHRcclxuXHRcdCk7XHJcblx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKDAsMCwwLDAuNylgO1xyXG5cdFx0dGhpcy5jdHgzZC5maWxsUmVjdCgwLCAwLCB0aGlzLndvcmxkM2Qud2lkdGgsIHRoaXMud2FsbENlbnRlckhlaWdodCk7XHJcblxyXG5cdFx0dGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiKDE1LCAzNSwgMTUpYDtcclxuXHRcdHRoaXMuY3R4M2QuZmlsbFJlY3QoXHJcblx0XHRcdDAsXHJcblx0XHRcdHRoaXMud2FsbENlbnRlckhlaWdodCxcclxuXHRcdFx0dGhpcy53b3JsZDNkLndpZHRoLFxyXG5cdFx0XHR0aGlzLndvcmxkM2QuaGVpZ2h0IC0gdGhpcy53YWxsQ2VudGVySGVpZ2h0XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEJnVG9wWE1vdXNlTW92ZShtb3ZlRGVsdGE6IG51bWJlcikge1xyXG5cdFx0dGhpcy5iZ1RvcFggLT0gKCh0aGlzLmJnVG9wSW1nLndpZHRoIC8gMTgwKSAqIG1vdmVEZWx0YSkgLyAyMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRiZ1RvcFgocm90QW10OiBudW1iZXIsIG1vdmVEaXJMUjogc3RyaW5nIHwgbnVsbCkge1xyXG5cdFx0Y29uc3QgeERlbHRhID0gKHRoaXMuYmdUb3BJbWcud2lkdGggLyAxODApICogcm90QW10O1xyXG5cdFx0aWYgKG1vdmVEaXJMUiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYICs9IHhEZWx0YTtcclxuXHRcdH0gZWxzZSBpZiAobW92ZURpckxSID09PSAncmlnaHQnKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYIC09IHhEZWx0YTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KFxyXG5cdFx0cmF5czogRmxvYXQzMkFycmF5IHwgbnVsbCxcclxuXHRcdG9iamVjdFR5cGVzOiBVaW50OEFycmF5IHwgbnVsbCxcclxuXHRcdG9iamVjdERpcnM6IFVpbnQ4QXJyYXkgfCBudWxsLFxyXG5cdFx0cFg6IG51bWJlcixcclxuXHRcdHBZOiBudW1iZXIsXHJcblx0XHRyYXlBbmdsZXM6IEZsb2F0MzJBcnJheSB8IG51bGwsXHJcblx0XHRwbGF5ZXJSYXlzOiBJUGxheWVyUmF5c1tdLFxyXG5cdFx0cGxheWVyVzogbnVtYmVyXHJcblx0KSB7XHJcblx0XHRpZiAoIXJheXMgfHwgIXJheUFuZ2xlcykgcmV0dXJuO1xyXG5cdFx0dGhpcy5kcmF3QmFja2dyb3VuZCgpO1xyXG5cclxuXHRcdGNvbnN0IHdhbGxXaWR0aCA9IHRoaXMud29ybGQzZC53aWR0aCAvIHJheXMubGVuZ3RoO1xyXG5cdFx0Y29uc3Qgd2FsbFdpZHRoT3ZlcnNpemVkID0gd2FsbFdpZHRoICsgMTtcclxuXHRcdGxldCB3YWxsWCA9IDA7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByYXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGRpc3QgPSByYXlzW2ldICogTWF0aC5jb3MocmF5QW5nbGVzW2ldKTtcclxuXHRcdFx0Y29uc3Qgb2Zmc2V0ID0gb2JqZWN0RGlycz8uW2ldID09PSAwIHx8IG9iamVjdERpcnM/LltpXSA9PT0gMiA/IHBYIC8gdGhpcy53YWxsVyA6IHBZIC8gdGhpcy53YWxsSDtcclxuXHJcblx0XHRcdGNvbnN0IHdhbGxTaGlmdEFtdCA9ICh0aGlzLndvcmxkM2QuaGVpZ2h0ICogNTApIC8gZGlzdDtcclxuXHRcdFx0Y29uc3Qgd2FsbFN0YXJ0VG9wID0gdGhpcy53YWxsQ2VudGVySGVpZ2h0IC0gd2FsbFNoaWZ0QW10O1xyXG5cdFx0XHRjb25zdCB3YWxsRW5kQm90dG9tID0gdGhpcy53YWxsQ2VudGVySGVpZ2h0ICsgd2FsbFNoaWZ0QW10O1xyXG5cclxuXHRcdFx0bGV0IHdhbGxEYXJrbmVzcyA9IGRpc3QgLyB0aGlzLndvcmxkM2QuaGVpZ2h0O1xyXG5cdFx0XHR3YWxsRGFya25lc3MgPSAodGhpcy53b3JsZDNkRGlhZyAtIGRpc3QpIC8gdGhpcy53b3JsZDNkRGlhZztcclxuXHJcblx0XHRcdHN3aXRjaCAob2JqZWN0RGlycz8uW2ldKSB7XHJcblx0XHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdFx0d2FsbERhcmtuZXNzIC09IDAuMjtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdHdhbGxEYXJrbmVzcyAtPSAwLjI7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3dpdGNoIChvYmplY3RUeXBlcz8uW2ldKSB7XHJcblx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0dGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiYSgkezI1NSAqIHdhbGxEYXJrbmVzc30sJHsyNTUgKiB3YWxsRGFya25lc3N9LCR7MjU1ICogd2FsbERhcmtuZXNzfSwxKWA7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKCR7MCAqIHdhbGxEYXJrbmVzc30sJHsxMDAgKiB3YWxsRGFya25lc3N9LCR7MTAwICogd2FsbERhcmtuZXNzfSwxKWA7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5jdHgzZC5maWxsUmVjdCh3YWxsWCwgd2FsbFN0YXJ0VG9wLCB3YWxsV2lkdGhPdmVyc2l6ZWQsIHdhbGxFbmRCb3R0b20gLSB3YWxsU3RhcnRUb3ApO1xyXG5cclxuXHRcdFx0Ly8gLy8gY29uc3Qgc1dpZHRoID1cclxuXHRcdFx0Ly8gLy8gXHRvYmplY3REaXJzPy5baV0gPT09IDAgfHwgb2JqZWN0RGlycz8uW2ldID09PSAyXHJcblx0XHRcdC8vIC8vIFx0XHQ/IHRoaXMud2FsbFRleHR1cmUud2lkdGggLyBvZmZzZXRcclxuXHRcdFx0Ly8gLy8gXHRcdDogdGhpcy53YWxsVGV4dHVyZS5oZWlnaHQgLyBvZmZzZXQ7XHJcblxyXG5cdFx0XHQvLyB0aGlzLmN0eDNkLmRyYXdJbWFnZShcclxuXHRcdFx0Ly8gXHR0aGlzLndhbGxUZXh0dXJlLFxyXG5cdFx0XHQvLyBcdG9mZnNldCxcclxuXHRcdFx0Ly8gXHQwLFxyXG5cdFx0XHQvLyBcdHRoaXMud2FsbFRleHR1cmUud2lkdGgsXHJcblx0XHRcdC8vIFx0dGhpcy53YWxsVGV4dHVyZS5oZWlnaHQsXHJcblx0XHRcdC8vIFx0d2FsbFgsXHJcblx0XHRcdC8vIFx0d2FsbFN0YXJ0VG9wLFxyXG5cdFx0XHQvLyBcdHdhbGxXaWR0aCxcclxuXHRcdFx0Ly8gXHR3YWxsRW5kQm90dG9tIC0gd2FsbFN0YXJ0VG9wXHJcblx0XHRcdC8vICk7XHJcblxyXG5cdFx0XHR3YWxsWCArPSB3YWxsV2lkdGg7XHJcblx0XHR9XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJSYXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IHJheUwgPSBwbGF5ZXJSYXlzW2ldLmw7XHJcblx0XHRcdGNvbnN0IHcgPSAodGhpcy53b3JsZDNkLndpZHRoICogcGxheWVyVykgLyByYXlMO1xyXG5cdFx0XHQvLyBsZXQgeCA9IHBsYXllclJheXNbaV0ucGVyY0Fjcm9zc1NjcmVlbiAqIHRoaXMud29ybGQzZC53aWR0aDtcclxuXHRcdFx0bGV0IHg7XHJcblxyXG5cdFx0XHRpZiAocGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuMSA+PSAwICYmIHBsYXllclJheXNbaV0ucGVyY0Fjcm9zc1NjcmVlbjEgPD0gMSkge1xyXG5cdFx0XHRcdHggPSBwbGF5ZXJSYXlzW2ldLnBlcmNBY3Jvc3NTY3JlZW4xICogdGhpcy53b3JsZDNkLndpZHRoICsgdyAvIDI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0eCA9IHBsYXllclJheXNbaV0ucGVyY0Fjcm9zc1NjcmVlbjIgKiB0aGlzLndvcmxkM2Qud2lkdGggLSB3IC8gMjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bGV0IHBsYXllckNlbnRlckhlaWdodCA9IHRoaXMud29ybGQzZC5oZWlnaHQgLyAyLjU7XHJcblx0XHRcdGNvbnN0IHdhbGxTaGlmdEFtdCA9ICh0aGlzLndvcmxkM2QuaGVpZ2h0ICogNTApIC8gcmF5TDtcclxuXHRcdFx0Y29uc3QgcGxheWVyU2hpZnRBbXQgPSAodGhpcy53b3JsZDNkLmhlaWdodCAqIDQwKSAvIHJheUw7XHJcblx0XHRcdGNvbnN0IGFkalRvQm90QW10ID0gd2FsbFNoaWZ0QW10IC0gcGxheWVyU2hpZnRBbXQ7XHJcblx0XHRcdGNvbnN0IHBsYXllclN0YXJ0VG9wID0gcGxheWVyQ2VudGVySGVpZ2h0IC0gcGxheWVyU2hpZnRBbXQgKyBhZGpUb0JvdEFtdDtcclxuXHRcdFx0Y29uc3QgcGxheWVyRW5kQm90dG9tID0gcGxheWVyQ2VudGVySGVpZ2h0ICsgcGxheWVyU2hpZnRBbXQgKyBhZGpUb0JvdEFtdDtcclxuXHJcblx0XHRcdGxldCB3YWxsRGFya25lc3MgPSByYXlMIC8gdGhpcy53b3JsZDNkLmhlaWdodDtcclxuXHRcdFx0d2FsbERhcmtuZXNzID0gKHRoaXMud29ybGQzZERpYWcgLSByYXlMKSAvIHRoaXMud29ybGQzZERpYWc7XHJcblxyXG5cdFx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKCR7MjU1ICogd2FsbERhcmtuZXNzfSwkezEwMCAqIHdhbGxEYXJrbmVzc30sJHswICogd2FsbERhcmtuZXNzfSwxKWA7XHJcblxyXG5cdFx0XHR0aGlzLmN0eDNkLmZpbGxSZWN0KHggLSB3IC8gMiwgcGxheWVyU3RhcnRUb3AsIHcsIHBsYXllckVuZEJvdHRvbSAtIHBsYXllclN0YXJ0VG9wKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcGxheWVyMmQudHNcIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcGxheWVycy50c1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy90eXBlcy50c1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy93YWxsczJkLnRzXCIpO1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvd2FsbHMzZC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==