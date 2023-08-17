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
var frameRate = 75;
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
        walls3d.draw(player2d.rays, player2d.objectTypes, player2d.objectDirs, player2d.playerX, player2d.playerY, player2d.rayAngles, player2d.playerRays);
        one: if (player2d.playerX !== lastRecordedPlayerPos.x || player2d.playerY !== lastRecordedPlayerPos.y) {
            lastRecordedPlayerPos.x = player2d.playerX;
            lastRecordedPlayerPos.y = player2d.playerY;
            players.setUserCoords(lastRecordedPlayerPos.x, lastRecordedPlayerPos.y);
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
        this.rotAmt = 0.2;
        this.moveDirFB = null;
        this.moveAmtStart = 0.5;
        this.moveAmt = 2;
        this.moveAmtTop = 2;
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
        this.playerL = 20;
    }
    Player2d.prototype.setUp = function () {
        this.setAngles();
    };
    Player2d.prototype.setRotation = function (dir) {
        if (this.rotDir === null) {
            this.rotAmt = 2;
        }
        this.rotDir = dir;
        // console.log(this.rotAmt);
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
        var hittingF = this.moveDirRays.foreward < 5;
        var hittingL = this.moveDirRays.left < 5;
        var hittingR = this.moveDirRays.right < 5;
        var hittingB = this.moveDirRays.backward < 5;
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
            var spriteRayAngle = p.x - x < 0
                ? 270 - (Math.atan((p.y - y) / -(p.x - x)) * 180) / Math.PI
                : 90 + (Math.atan((p.y - y) / (p.x - x)) * 180) / Math.PI;
            spriteRayAngle = (((spriteRayAngle - 90) % 360) + 360) % 360;
            var rayRotDiff = spriteRayAngle - rotation;
            if (Math.abs(rayRotDiff) > this.fov / 2) {
                rayRotDiff = rayRotDiff >= 0 ? rayRotDiff - 360 : 360 + rayRotDiff;
            }
            var percAcrScreen = rayRotDiff / this.fov + 0.5;
            if (percAcrScreen >= 0 && percAcrScreen <= 1) {
                this.playerRays.push({
                    l: d,
                    x: p.x,
                    y: p.y,
                    name: p.name,
                    percAcrossScreen: percAcrScreen,
                });
            }
        }
        if (this.devMode) {
            for (var i = 0; i < this.playerRays.length; i++) {
                this.ctx2d.beginPath();
                this.ctx2d.moveTo(x, y);
                this.ctx2d.lineTo(this.playerRays[i].x, this.playerRays[i].y);
                this.ctx2d.strokeStyle = "rgba(255,0,0,1)";
                this.ctx2d.lineWidth = 1;
                this.ctx2d.stroke();
            }
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
        this.pWidth = 20;
        this.userX = 0;
        this.userY = 0;
    }
    Players.prototype.setUserCoords = function (x, y) {
        this.userX = x;
        this.userY = y;
    };
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
    Players.prototype.draw = function () {
        for (var i = 0; i < this.players.length; i++) {
            var p = this.players[i];
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
    }
    Walls2d.prototype.draw = function () {
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
    Walls3d.prototype.draw = function (rays, objectTypes, objectDirs, pX, pY, rayAngles, playerRays) {
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
            var x = playerRays[i].percAcrossScreen * this.world3d.width;
            var playerW = (this.world3d.width * 20) / rayL;
            var playerCenterHeight = this.world3d.height / 2.5;
            var wallShiftAmt = (this.world3d.height * 50) / rayL;
            var playerShiftAmt = (this.world3d.height * 40) / rayL;
            var adjToBotAmt = wallShiftAmt - playerShiftAmt;
            var playerStartTop = playerCenterHeight - playerShiftAmt + adjToBotAmt;
            var playerEndBottom = playerCenterHeight + playerShiftAmt + adjToBotAmt;
            var wallDarkness = rayL / this.world3d.height;
            wallDarkness = (this.world3dDiag - rayL) / this.world3dDiag;
            this.ctx3d.fillStyle = "rgba(".concat(255 * wallDarkness, ",").concat(100 * wallDarkness, ",").concat(0 * wallDarkness, ",1)");
            this.ctx3d.fillRect(x - playerW / 2, playerStartTop, playerW, playerEndBottom - playerStartTop);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxD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QUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFFNUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsZUFBUSxHQUFHLEdBQUcsWUFBWSxjQUFJLEdBQUcsR0FBRyxZQUFZLGNBQUksQ0FBQyxHQUFHLFlBQVksUUFBSyxDQUFDO1lBRWpHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUcsQ0FBQyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsZUFBZSxHQUFHLGNBQWMsQ0FBQyxDQUFDO1NBQ2hHO0lBQ0YsQ0FBQztJQUNGLGNBQUM7QUFBRCxDQUFDOzs7Ozs7OztVQ3JLRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9wbGF5ZXIyZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9wbGF5ZXJzLnRzIiwid2VicGFjazovL2Zwc19nYW1lLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovL2Zwc19nYW1lLy4vc3JjL3dhbGxzMmQudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvd2FsbHMzZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWVyMmQgZnJvbSAnLi9wbGF5ZXIyZCc7XHJcbmltcG9ydCBQbGF5ZXJzIGZyb20gJy4vcGxheWVycyc7XHJcbmltcG9ydCB7IElTb2NrZXREYXRhUmVxLCBJU29ja2V0RGF0YVJlcyB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgV2FsbHMyZCBmcm9tICcuL3dhbGxzMmQnO1xyXG5pbXBvcnQgV2FsbHMzZCBmcm9tICcuL3dhbGxzM2QnO1xyXG5cclxuLy8gVXNlIHdzcyAoc2VjdXJlKSBpbnN0ZWFkIG9mIHdzIGZvciBwcm9kdWNpdG9uXHJcbmNvbnN0IHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjMwMDAvc2VydmVyJyk7XHJcblxyXG5jb25zdCB3b3JsZDJkID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3b3JsZDJkJyk7XHJcbmNvbnN0IHdvcmxkM2QgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dvcmxkM2QnKTtcclxuXHJcbmNvbnN0IGN0eDJkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDJkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcbmNvbnN0IGN0eDNkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDNkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcblxyXG5jb25zdCBmcHNFbGVtZW50ID0gPEhUTUxIZWFkaW5nRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnBzQ291bnRlcicpO1xyXG5cclxubGV0IHdhbGxzMmQ6IFdhbGxzMmQ7XHJcbmxldCB3YWxsczNkOiBXYWxsczNkO1xyXG5sZXQgcGxheWVyMmQ6IFBsYXllcjJkO1xyXG5sZXQgcGxheWVyczogUGxheWVycztcclxuXHJcbmxldCBmcHNJbnRlcnZhbDogbnVtYmVyLCBub3c6IG51bWJlciwgdGhlbjogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIsIHJlcXVlc3RJRDogbnVtYmVyO1xyXG5sZXQgZnJhbWVDb3VudDogbnVtYmVyID0gMDtcclxuY29uc3QgZnJhbWVSYXRlID0gNzU7XHJcblxyXG5sZXQgZGV2TW9kZSA9IHRydWU7XHJcblxyXG5sZXQgdXNlcklkOiBhbnk7XHJcbmxldCBsYXN0UmVjb3JkZWRQbGF5ZXJQb3MgPSB7XHJcblx0eDogMCxcclxuXHR5OiAwLFxyXG59O1xyXG5cclxuY29uc3Qgc2V0RnJhbWVyYXRlVmFsdWUgPSAoKSA9PiB7XHJcblx0ZnBzRWxlbWVudC5pbm5lclRleHQgPSBmcmFtZUNvdW50LnRvU3RyaW5nKCk7XHJcblx0ZnBzRWxlbWVudC5zdHlsZS5jb2xvciA9IGZyYW1lQ291bnQgPCBmcmFtZVJhdGUgPyAncmVkJyA6ICdyZ2IoMCwgMjU1LCAwKSc7XHJcblx0ZnJhbWVDb3VudCA9IDA7XHJcbn07XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9ICgpID0+IHtcclxuXHRyZXF1ZXN0SUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xyXG5cclxuXHRmcHNJbnRlcnZhbCA9IDEwMDAgLyBmcmFtZVJhdGU7XHJcblxyXG5cdG5vdyA9IERhdGUubm93KCk7XHJcblx0ZWxhcHNlZCA9IG5vdyAtIHRoZW47XHJcblxyXG5cdGlmIChlbGFwc2VkID4gZnBzSW50ZXJ2YWwpIHtcclxuXHRcdGlmIChmcmFtZUNvdW50ID09PSAwKSBzZXRUaW1lb3V0KHNldEZyYW1lcmF0ZVZhbHVlLCAxMDAwKTtcclxuXHRcdGZyYW1lQ291bnQgKz0gMTtcclxuXHRcdHRoZW4gPSBub3cgLSAoZWxhcHNlZCAlIGZwc0ludGVydmFsKTtcclxuXHJcblx0XHRjdHgyZC5jbGVhclJlY3QoMCwgMCwgd29ybGQyZC53aWR0aCwgd29ybGQyZC5oZWlnaHQpO1xyXG5cdFx0Y3R4M2QuY2xlYXJSZWN0KDAsIDAsIHdvcmxkM2Qud2lkdGgsIHdvcmxkM2QuaGVpZ2h0KTtcclxuXHJcblx0XHR3YWxsczJkLmRyYXcoKTtcclxuXHRcdHBsYXllcnMuZHJhdygpO1xyXG5cdFx0cGxheWVyMmQuZHJhdyhwbGF5ZXJzLnBsYXllcnMpO1xyXG5cdFx0d2FsbHMzZC5zZXRiZ1RvcFgocGxheWVyMmQucm90QW10LCBwbGF5ZXIyZC5yb3REaXIpO1xyXG5cdFx0d2FsbHMzZC5kcmF3KFxyXG5cdFx0XHRwbGF5ZXIyZC5yYXlzLFxyXG5cdFx0XHRwbGF5ZXIyZC5vYmplY3RUeXBlcyxcclxuXHRcdFx0cGxheWVyMmQub2JqZWN0RGlycyxcclxuXHRcdFx0cGxheWVyMmQucGxheWVyWCxcclxuXHRcdFx0cGxheWVyMmQucGxheWVyWSxcclxuXHRcdFx0cGxheWVyMmQucmF5QW5nbGVzLFxyXG5cdFx0XHRwbGF5ZXIyZC5wbGF5ZXJSYXlzXHJcblx0XHQpO1xyXG5cclxuXHRcdG9uZTogaWYgKHBsYXllcjJkLnBsYXllclggIT09IGxhc3RSZWNvcmRlZFBsYXllclBvcy54IHx8IHBsYXllcjJkLnBsYXllclkgIT09IGxhc3RSZWNvcmRlZFBsYXllclBvcy55KSB7XHJcblx0XHRcdGxhc3RSZWNvcmRlZFBsYXllclBvcy54ID0gcGxheWVyMmQucGxheWVyWDtcclxuXHRcdFx0bGFzdFJlY29yZGVkUGxheWVyUG9zLnkgPSBwbGF5ZXIyZC5wbGF5ZXJZO1xyXG5cclxuXHRcdFx0cGxheWVycy5zZXRVc2VyQ29vcmRzKGxhc3RSZWNvcmRlZFBsYXllclBvcy54LCBsYXN0UmVjb3JkZWRQbGF5ZXJQb3MueSk7XHJcblxyXG5cdFx0XHRpZiAoIXVzZXJJZCkgYnJlYWsgb25lO1xyXG5cclxuXHRcdFx0Y29uc3QgZGF0YTogSVNvY2tldERhdGFSZXEgPSB7XHJcblx0XHRcdFx0YWN0aW9uOiAndXBkYXRlLXBsYXllci1wb3MnLFxyXG5cdFx0XHRcdGlkOiB1c2VySWQsXHJcblx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0eDogbGFzdFJlY29yZGVkUGxheWVyUG9zLngsXHJcblx0XHRcdFx0XHR5OiBsYXN0UmVjb3JkZWRQbGF5ZXJQb3MueSxcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoMCwyNTUsMCwxKWA7XHJcblx0XHRjdHgzZC5saW5lV2lkdGggPSAyO1xyXG5cdFx0Y3R4M2QuYmVnaW5QYXRoKCk7XHJcblx0XHRjdHgzZC5lbGxpcHNlKHdvcmxkM2Qud2lkdGggLyAyLCB3b3JsZDNkLmhlaWdodCAvIDIuNSwgNSwgNSwgMCwgMCwgMiAqIE1hdGguUEkpO1xyXG5cdFx0Y3R4M2QuZmlsbCgpO1xyXG5cdH1cclxufTtcclxuXHJcbmNvbnN0IHNldFVwID0gKCkgPT4ge1xyXG5cdHdhbGxzMmQgPSBuZXcgV2FsbHMyZCh3b3JsZDJkLCBjdHgyZCk7XHJcblx0d2FsbHMzZCA9IG5ldyBXYWxsczNkKHdvcmxkM2QsIGN0eDNkLCB3YWxsczJkLndhbGxXLCB3YWxsczJkLndhbGxIKTtcclxuXHRwbGF5ZXIyZCA9IG5ldyBQbGF5ZXIyZChcclxuXHRcdHdvcmxkMmQsXHJcblx0XHRjdHgyZCxcclxuXHRcdHdhbGxzMmQud2FsbHMsXHJcblx0XHR3YWxsczJkLndhbGxDb2xzLFxyXG5cdFx0d2FsbHMyZC53YWxsUm93cyxcclxuXHRcdHdhbGxzMmQud2FsbFcsXHJcblx0XHR3YWxsczJkLndhbGxIXHJcblx0KTtcclxuXHRwbGF5ZXIyZC5zZXRVcCgpO1xyXG5cdHBsYXllcnMgPSBuZXcgUGxheWVycyh3b3JsZDJkLCBjdHgyZCk7XHJcblx0Z2FtZUxvb3AoKTtcclxufTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcblx0dGhlbiA9IERhdGUubm93KCk7XHJcblx0c2V0VXAoKTtcclxufTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xyXG5cdGlmICghZGV2TW9kZSkge1xyXG5cdFx0cGxheWVyMmQuc2V0TW91c2VSb3RhdGlvbihlLm1vdmVtZW50WCAvIDIwKTtcclxuXHRcdHdhbGxzM2Quc2V0QmdUb3BYTW91c2VNb3ZlKGUubW92ZW1lbnRYKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG5cdC8vU2V0IG1vdmUgZm9yZXdhcmRzIGFuZCBiYWNrd2FyZHNcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5VycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIoJ2ZvcndhcmRzJyk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlTJykge1xyXG5cdFx0cGxheWVyMmQuc2V0TW92ZURpcignYmFja3dhcmRzJyk7XHJcblx0fVxyXG5cclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbignbGVmdCcpO1xyXG5cdFx0ZWxzZSBwbGF5ZXIyZC5zZXRTdHJhZmVEaXIoJ2xlZnQnKTtcclxuXHR9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleUQnKSB7XHJcblx0XHRpZiAoZGV2TW9kZSkgcGxheWVyMmQuc2V0Um90YXRpb24oJ3JpZ2h0Jyk7XHJcblx0XHRlbHNlIHBsYXllcjJkLnNldFN0cmFmZURpcigncmlnaHQnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuXHQvL1NldCBtb3ZlbWVudCB2YXJpYWJsZXMgdG8gbnVsbCB3aGVuIGtleSByZWxlYXNlZHtcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScgfHwgZS5jb2RlID09PSAnS2V5RCcpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbihudWxsKTtcclxuXHRcdGVsc2UgcGxheWVyMmQuc2V0U3RyYWZlRGlyKG51bGwpO1xyXG5cdH0gZWxzZSBpZiAoZS5jb2RlID09PSAnS2V5VycgfHwgZS5jb2RlID09PSAnS2V5UycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIobnVsbCk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlNJykge1xyXG5cdFx0ZGV2TW9kZSA9ICFkZXZNb2RlO1xyXG5cdFx0aWYgKCFkZXZNb2RlKSB7XHJcblx0XHRcdHdvcmxkMmQuY2xhc3NMaXN0LmFkZCgnZnVsbHNjcmVlbicpO1xyXG5cdFx0XHR3b3JsZDNkLmNsYXNzTGlzdC5hZGQoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0cGxheWVyMmQuZGV2TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHR3b3JsZDNkLnJlcXVlc3RQb2ludGVyTG9jayA9XHJcblx0XHRcdFx0Ly9AdHMtaWdub3JlXHJcblx0XHRcdFx0d29ybGQzZC5yZXF1ZXN0UG9pbnRlckxvY2sgfHwgd29ybGQzZC5tb3pSZXF1ZXN0UG9pbnRlckxvY2sgfHwgd29ybGQzZC53ZWJraXRSZXF1ZXN0UG9pbnRlckxvY2s7XHJcblx0XHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0XHR3b3JsZDNkLnJlcXVlc3RQb2ludGVyTG9jayh7XHJcblx0XHRcdFx0dW5hZGp1c3RlZE1vdmVtZW50OiB0cnVlLFxyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHdvcmxkMmQuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbHNjcmVlbicpO1xyXG5cdFx0XHR3b3JsZDNkLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0cGxheWVyMmQuZGV2TW9kZSA9IHRydWU7XHJcblx0XHRcdGRvY3VtZW50LmV4aXRQb2ludGVyTG9jayA9XHJcblx0XHRcdFx0Ly9AdHMtaWdub3JlXHJcblx0XHRcdFx0ZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrIHx8IGRvY3VtZW50Lm1vekV4aXRQb2ludGVyTG9jayB8fCBkb2N1bWVudC53ZWJraXRFeGl0UG9pbnRlckxvY2s7XHJcblx0XHRcdGRvY3VtZW50LmV4aXRQb2ludGVyTG9jaygpO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcblxyXG5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignb3BlbicsICgpID0+IHtcclxuXHRjb25zb2xlLmxvZygnVXNlciBjb25uZWN0ZWQnKTtcclxufSk7XHJcblxyXG5zb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGV2ZW50ID0+IHtcclxuXHRjb25zdCByZXM6IElTb2NrZXREYXRhUmVzID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcclxuXHRsZXQgZGF0YTogSVNvY2tldERhdGFSZXE7XHJcblxyXG5cdHN3aXRjaCAocmVzPy5hY3Rpb24pIHtcclxuXHRcdGNhc2UgJ3NldC11c2VyLWlkJzpcclxuXHRcdFx0Y29uc29sZS5sb2coJ1VzZXJJZCBoYXMgYmVlbiBzZXQnKTtcclxuXHRcdFx0dXNlcklkID0gcmVzLmRhdGE7XHJcblxyXG5cdFx0XHRpZiAoIXVzZXJJZCkgcmV0dXJuO1xyXG5cdFx0XHRkYXRhID0ge1xyXG5cdFx0XHRcdGFjdGlvbjogJ3NlbmQtdXNlci10by1jbGllbnRzJyxcclxuXHRcdFx0XHRpZDogdXNlcklkLFxyXG5cdFx0XHRcdGRhdGE6ICcnLFxyXG5cdFx0XHR9O1xyXG5cdFx0XHRzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAnc2VuZC11c2VyLXRvLWNsaWVudHMnOlxyXG5cdFx0XHRwbGF5ZXJzLmFkZFBsYXllcihyZXMuZGF0YSk7XHJcblxyXG5cdFx0XHQvLyBpZiAoIXVzZXJJZCkgcmV0dXJuO1xyXG5cdFx0XHQvLyBkYXRhID0ge1xyXG5cdFx0XHQvLyBcdGFjdGlvbjogJ3NlbmQtdXNlci10by1jbGllbnRzJyxcclxuXHRcdFx0Ly8gXHRpZDogdXNlcklkLFxyXG5cdFx0XHQvLyBcdGRhdGE6ICcnLFxyXG5cdFx0XHQvLyB9O1xyXG5cdFx0XHQvLyBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0Y2FzZSAndXBkYXRlLXBsYXllci1wb3MnOlxyXG5cdFx0XHRwbGF5ZXJzLnVwZGF0ZVBsYXllclBvcyh7IG5hbWU6IHJlcy5kYXRhLnBsYXllcklkLCB4OiByZXMuZGF0YS54LCB5OiByZXMuZGF0YS55IH0pO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3JlbW92ZS1wbGF5ZXInOlxyXG5cdFx0XHRwbGF5ZXJzLnJlbW92ZVBsYXllcihyZXMuZGF0YSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdH1cclxufSk7XHJcbiIsImltcG9ydCB7IElQbGF5ZXIsIElQbGF5ZXJSYXlzIH0gZnJvbSAnLi90eXBlcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIyZCB7XHJcblx0cHJpdmF0ZSB3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHJpdmF0ZSB3YWxsczogVWludDhBcnJheTtcclxuXHRwcml2YXRlIHdhbGxDb2xzOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsUm93czogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbFc6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxIOiBudW1iZXI7XHJcblx0cHVibGljIHJheXM6IEZsb2F0MzJBcnJheSB8IG51bGw7XHJcblx0cHVibGljIG9iamVjdFR5cGVzOiBVaW50OEFycmF5IHwgbnVsbDtcclxuXHRwdWJsaWMgb2JqZWN0RGlyczogVWludDhBcnJheSB8IG51bGw7XHJcblx0cHJpdmF0ZSByYXlJbmNyZW1lbnQ6IG51bWJlcjtcclxuXHRwcml2YXRlIHJheU9wYWNpdHk6IG51bWJlcjtcclxuXHRwcml2YXRlIGZvdjogbnVtYmVyO1xyXG5cdHByaXZhdGUgZm92UmFkOiBudW1iZXI7XHJcblx0cHVibGljIHJvdGF0aW9uOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBhbmdsZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgZGlzdFRvUHJvamVjdGlvblBsYW5lOiBudW1iZXI7XHJcblx0cHVibGljIHJheUFuZ2xlczogRmxvYXQzMkFycmF5IHwgbnVsbDtcclxuXHRwcml2YXRlIHJheURlbnNpdHlBZGp1c3RtZW50OiBudW1iZXI7XHJcblx0cHVibGljIHJvdERpcjogc3RyaW5nIHwgbnVsbDtcclxuXHRwdWJsaWMgcm90QW10OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBtb3ZlRGlyRkI6IHN0cmluZyB8IG51bGw7XHJcblx0cHJpdmF0ZSBtb3ZlQW10U3RhcnQ6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVBbXQ6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVBbXRUb3A6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVEaXJTdHJhZmU6IHN0cmluZyB8IG51bGw7XHJcblx0cHJpdmF0ZSBtb3ZlRGlyUmF5czoge1xyXG5cdFx0Zm9yZXdhcmQ6IG51bWJlcjtcclxuXHRcdGxlZnQ6IG51bWJlcjtcclxuXHRcdHJpZ2h0OiBudW1iZXI7XHJcblx0XHRiYWNrd2FyZDogbnVtYmVyO1xyXG5cdH07XHJcblx0cHVibGljIHBsYXllclg6IG51bWJlcjtcclxuXHRwdWJsaWMgcGxheWVyWTogbnVtYmVyO1xyXG5cdHB1YmxpYyBkZXZNb2RlOiBib29sZWFuO1xyXG5cdHB1YmxpYyBwbGF5ZXJSYXlzOiBJUGxheWVyUmF5c1tdO1xyXG5cdHB1YmxpYyBwbGF5ZXJMOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKFxyXG5cdFx0d29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsXHJcblx0XHRjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG5cdFx0d2FsbHM6IFVpbnQ4QXJyYXksXHJcblx0XHR3YWxsQ29sczogbnVtYmVyLFxyXG5cdFx0d2FsbFJvd3M6IG51bWJlcixcclxuXHRcdHdhbGxXOiBudW1iZXIsXHJcblx0XHR3YWxsSDogbnVtYmVyXHJcblx0KSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy53YWxscyA9IHdhbGxzO1xyXG5cdFx0dGhpcy53YWxsQ29scyA9IHdhbGxDb2xzO1xyXG5cdFx0dGhpcy53YWxsUm93cyA9IHdhbGxSb3dzO1xyXG5cdFx0dGhpcy53YWxsVyA9IHdhbGxXO1xyXG5cdFx0dGhpcy53YWxsSCA9IHdhbGxIO1xyXG5cdFx0dGhpcy5yYXlzID0gbnVsbDtcclxuXHRcdHRoaXMub2JqZWN0VHlwZXMgPSBudWxsO1xyXG5cdFx0dGhpcy5vYmplY3REaXJzID0gbnVsbDtcclxuXHRcdHRoaXMucmF5SW5jcmVtZW50ID0gMjtcclxuXHRcdHRoaXMucmF5T3BhY2l0eSA9IDAuMjY7XHJcblx0XHR0aGlzLmZvdiA9IDYwO1xyXG5cdFx0dGhpcy5mb3ZSYWQgPSB0aGlzLmZvdiAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdHRoaXMucm90YXRpb24gPSA0NTtcclxuXHRcdHRoaXMuYW5nbGUgPSB0aGlzLnJvdGF0aW9uICsgOTA7XHJcblx0XHR0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSA9IHdvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHRcdHRoaXMucmF5QW5nbGVzID0gbnVsbDtcclxuXHRcdHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnQgPSAxMjtcclxuXHRcdHRoaXMucm90RGlyID0gbnVsbDtcclxuXHRcdHRoaXMucm90QW10ID0gMC4yO1xyXG5cdFx0dGhpcy5tb3ZlRGlyRkIgPSBudWxsO1xyXG5cdFx0dGhpcy5tb3ZlQW10U3RhcnQgPSAwLjU7XHJcblx0XHR0aGlzLm1vdmVBbXQgPSAyO1xyXG5cdFx0dGhpcy5tb3ZlQW10VG9wID0gMjtcclxuXHRcdHRoaXMubW92ZURpclN0cmFmZSA9IG51bGw7XHJcblx0XHR0aGlzLm1vdmVEaXJSYXlzID0ge1xyXG5cdFx0XHRmb3Jld2FyZDogSW5maW5pdHksXHJcblx0XHRcdGxlZnQ6IEluZmluaXR5LFxyXG5cdFx0XHRyaWdodDogSW5maW5pdHksXHJcblx0XHRcdGJhY2t3YXJkOiBJbmZpbml0eSxcclxuXHRcdH07XHJcblx0XHR0aGlzLnBsYXllclggPSAxMDA7XHJcblx0XHR0aGlzLnBsYXllclkgPSAxMDA7XHJcblx0XHR0aGlzLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0dGhpcy5wbGF5ZXJSYXlzID0gW107XHJcblx0XHR0aGlzLnBsYXllckwgPSAyMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRVcCgpIHtcclxuXHRcdHRoaXMuc2V0QW5nbGVzKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0Um90YXRpb24oZGlyOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHRpZiAodGhpcy5yb3REaXIgPT09IG51bGwpIHtcclxuXHRcdFx0dGhpcy5yb3RBbXQgPSAyO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5yb3REaXIgPSBkaXI7XHJcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLnJvdEFtdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0TW91c2VSb3RhdGlvbihhbXQ6IG51bWJlcikge1xyXG5cdFx0dGhpcy5yb3RhdGlvbiArPSBhbXQ7XHJcblx0XHR0aGlzLmFuZ2xlICs9IGFtdDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRTdHJhZmVEaXIoZGlyOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHRpZiAodGhpcy5tb3ZlRGlyU3RyYWZlID09PSBudWxsKSB7XHJcblx0XHRcdHRoaXMubW92ZUFtdCA9IHRoaXMubW92ZUFtdFN0YXJ0O1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5tb3ZlRGlyU3RyYWZlID0gZGlyO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSByb3RhdGUoKSB7XHJcblx0XHQvLyBpZiAodGhpcy5yb3RBbXQgPCB0aGlzLnJvdEFtdCkge1xyXG5cdFx0Ly8gXHR0aGlzLnJvdEFtdCArPSAwLjE7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0aWYgKHRoaXMucm90RGlyID09PSAnbGVmdCcpIHtcclxuXHRcdFx0dGhpcy5yb3RhdGlvbiAtPSB0aGlzLnJvdEFtdDtcclxuXHRcdFx0dGhpcy5hbmdsZSAtPSB0aGlzLnJvdEFtdDtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5yb3REaXIgPT09ICdyaWdodCcpIHtcclxuXHRcdFx0dGhpcy5yb3RhdGlvbiArPSB0aGlzLnJvdEFtdDtcclxuXHRcdFx0dGhpcy5hbmdsZSArPSB0aGlzLnJvdEFtdDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRNb3ZlRGlyKGRpcjogc3RyaW5nIHwgbnVsbCkge1xyXG5cdFx0aWYgKHRoaXMubW92ZURpckZCID09PSBudWxsKSB7XHJcblx0XHRcdHRoaXMubW92ZUFtdCA9IHRoaXMubW92ZUFtdFN0YXJ0O1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5tb3ZlRGlyRkIgPSBkaXI7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG1vdmUoKSB7XHJcblx0XHRpZiAoIXRoaXM/LnJheXM/Lmxlbmd0aCkgcmV0dXJuO1xyXG5cdFx0dGhpcy5yb3RhdGUoKTtcclxuXHJcblx0XHRpZiAodGhpcy5tb3ZlQW10IDwgdGhpcy5tb3ZlQW10VG9wKSB0aGlzLm1vdmVBbXQgKz0gMC4wNTtcclxuXHJcblx0XHRjb25zdCBkaXJSYWRpYW5zID0gdGhpcy5hbmdsZSAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdGNvbnN0IG1vdmVYID0gdGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoOTAgKiAoTWF0aC5QSSAvIDE4MCkgLSBkaXJSYWRpYW5zKTtcclxuXHRcdGNvbnN0IG1vdmVZID0gdGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoZGlyUmFkaWFucyk7XHJcblx0XHRjb25zdCBkaXJSYWRpYW5zU3RyYWZlID0gZGlyUmFkaWFucyArIE1hdGguUEkgLyAyO1xyXG5cdFx0Y29uc3Qgc3RyYWZlWCA9ICh0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyg5MCAqIChNYXRoLlBJIC8gMTgwKSAtIGRpclJhZGlhbnNTdHJhZmUpKSAvIDI7XHJcblx0XHRjb25zdCBzdHJhZmVZID0gKHRoaXMubW92ZUFtdCAqIE1hdGguY29zKGRpclJhZGlhbnNTdHJhZmUpKSAvIDI7XHJcblx0XHRjb25zdCBoaXR0aW5nRiA9IHRoaXMubW92ZURpclJheXMuZm9yZXdhcmQgPCA1O1xyXG5cdFx0Y29uc3QgaGl0dGluZ0wgPSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPCA1O1xyXG5cdFx0Y29uc3QgaGl0dGluZ1IgPSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0IDwgNTtcclxuXHRcdGNvbnN0IGhpdHRpbmdCID0gdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA8IDU7XHJcblxyXG5cdFx0aWYgKHRoaXMubW92ZURpckZCID09PSAnZm9yd2FyZHMnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0YpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gbW92ZVg7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IG1vdmVZO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMubW92ZURpckZCID09PSAnYmFja3dhcmRzJykge1xyXG5cdFx0XHRpZiAoIWhpdHRpbmdCKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJYIC09IG1vdmVYO1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWSArPSBtb3ZlWTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubW92ZURpclN0cmFmZSA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0wpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggLT0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdMKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZICs9IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5tb3ZlRGlyU3RyYWZlID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ1IpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdSKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc2V0QW5nbGVzKCkge1xyXG5cdFx0Y29uc3QgYW5nbGVBcnJMZW5ndGggPSBNYXRoLmNlaWwoXHJcblx0XHRcdCh0aGlzLndvcmxkMmQud2lkdGggKyB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50KSAvIHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnRcclxuXHRcdCk7XHJcblx0XHR0aGlzLnJheUFuZ2xlcyA9IG5ldyBGbG9hdDMyQXJyYXkoYW5nbGVBcnJMZW5ndGgpO1xyXG5cdFx0dGhpcy5kaXN0VG9Qcm9qZWN0aW9uUGxhbmUgPSB0aGlzLndvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHJcblx0XHRsZXQgeCA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFuZ2xlQXJyTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy5yYXlBbmdsZXNbaV0gPSBNYXRoLmF0YW4oKHggLSB0aGlzLndvcmxkMmQud2lkdGggLyAyKSAvIHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lKTtcclxuXHRcdFx0eCArPSB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMucmF5cyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5yYXlBbmdsZXMubGVuZ3RoKTtcclxuXHRcdHRoaXMub2JqZWN0VHlwZXMgPSBuZXcgVWludDhBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGgpO1xyXG5cdFx0dGhpcy5vYmplY3REaXJzID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5yYXlBbmdsZXMubGVuZ3RoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0SW50ZXJzZWN0aW9uID0gKFxyXG5cdFx0eDogbnVtYmVyLFxyXG5cdFx0eTogbnVtYmVyLFxyXG5cdFx0cjogbnVtYmVyLFxyXG5cdFx0dGhldGE6IG51bWJlcixcclxuXHRcdHgxOiBudW1iZXIsXHJcblx0XHR5MTogbnVtYmVyLFxyXG5cdFx0eDI6IG51bWJlcixcclxuXHRcdHkyOiBudW1iZXIsXHJcblx0XHRyb3Q6IG51bWJlcixcclxuXHRcdHA0PzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9XHJcblx0KSA9PiB7XHJcblx0XHRjb25zdCBhZGp1c3RlZEFuZ2xlID0gdGhldGEgKyByb3QgKiAoTWF0aC5QSSAvIDE4MCk7XHJcblx0XHRjb25zdCB4MyA9IHg7XHJcblx0XHRjb25zdCB5MyA9IHk7XHJcblx0XHRsZXQgeDQ7XHJcblx0XHRsZXQgeTQ7XHJcblx0XHRsZXQgdU1heCA9IEluZmluaXR5O1xyXG5cdFx0aWYgKHA0Py54ICYmIHA0Py55KSB7XHJcblx0XHRcdHg0ID0gcDQueDtcclxuXHRcdFx0eTQgPSBwNC55O1xyXG5cdFx0XHR1TWF4ID0gMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHg0ID0geCArIHIgKiBNYXRoLmNvcyhhZGp1c3RlZEFuZ2xlKTtcclxuXHRcdFx0eTQgPSB5ICsgciAqIE1hdGguc2luKGFkanVzdGVkQW5nbGUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGRlbm9tID0gKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpO1xyXG5cclxuXHRcdGlmIChkZW5vbSA9PSAwKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHQgPSAoKHgxIC0geDMpICogKHkzIC0geTQpIC0gKHkxIC0geTMpICogKHgzIC0geDQpKSAvIGRlbm9tO1xyXG5cdFx0Y29uc3QgdSA9ICgoeDEgLSB4MykgKiAoeTEgLSB5MikgLSAoeTEgLSB5MykgKiAoeDEgLSB4MikpIC8gZGVub207XHJcblx0XHRpZiAodCA+PSAwICYmIHQgPD0gMSAmJiB1ID49IDAgJiYgdSA8PSB1TWF4KSB7XHJcblx0XHRcdGNvbnN0IHB4ID0geDMgKyB1ICogKHg0IC0geDMpO1xyXG5cdFx0XHRjb25zdCBweSA9IHkzICsgdSAqICh5NCAtIHkzKTtcclxuXHRcdFx0cmV0dXJuIFtweCwgcHldO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHByaXZhdGUgZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoXHJcblx0XHRqOiBudW1iZXIsXHJcblx0XHRrOiBudW1iZXIsXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHRyYXlBbmdsZTogbnVtYmVyLFxyXG5cdFx0cm90YXRpb246IG51bWJlcixcclxuXHRcdHA0PzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9XHJcblx0KSB7XHJcblx0XHRjb25zdCByID0gMTtcclxuXHRcdGNvbnN0IHgxID0gayAqIHRoaXMud2FsbFc7XHJcblx0XHRjb25zdCB5MSA9IGogKiB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGNvbnN0IHgyID0geDEgKyB0aGlzLndhbGxXO1xyXG5cdFx0Y29uc3QgeTIgPSB5MTtcclxuXHJcblx0XHRjb25zdCB4MyA9IHgxICsgdGhpcy53YWxsVztcclxuXHRcdGNvbnN0IHkzID0geTEgKyB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGNvbnN0IHg0ID0geDE7XHJcblx0XHRjb25zdCB5NCA9IHkxICsgdGhpcy53YWxsSDtcclxuXHJcblx0XHRsZXQgcmVjb3JkID0gSW5maW5pdHk7XHJcblx0XHRsZXQgY2xvc2VzdCA9IG51bGw7XHJcblx0XHRsZXQgZGlyID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBuID0gMDsgbiA8IDQ7IG4rKykge1xyXG5cdFx0XHRzd2l0Y2ggKG4pIHtcclxuXHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25Ub3AgPSB0aGlzLmdldEludGVyc2VjdGlvbih4LCB5LCByLCByYXlBbmdsZSwgeDEsIHkxLCB4MiwgeTIsIHJvdGF0aW9uLCBwNCk7XHJcblx0XHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uVG9wKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGludGVyc2VjdGlvblRvcFswXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGludGVyc2VjdGlvblRvcFsxXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQgPSBNYXRoLm1pbihkLCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0XHRpZiAoZCA8PSByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHRcdFx0XHRcdGNsb3Nlc3QgPSBpbnRlcnNlY3Rpb25Ub3A7XHJcblx0XHRcdFx0XHRcdFx0ZGlyID0gMDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvblJpZ2h0ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgcmF5QW5nbGUsIHgyLCB5MiwgeDMsIHkzLCByb3RhdGlvbiwgcDQpO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvblJpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGludGVyc2VjdGlvblJpZ2h0WzBdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uUmlnaHRbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uUmlnaHQ7XHJcblx0XHRcdFx0XHRcdFx0ZGlyID0gMTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uQm90ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgcmF5QW5nbGUsIHgzLCB5MywgeDQsIHk0LCByb3RhdGlvbiwgcDQpO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvbkJvdCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25Cb3RbMF0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBpbnRlcnNlY3Rpb25Cb3RbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uQm90O1xyXG5cdFx0XHRcdFx0XHRcdGRpciA9IDI7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMzpcclxuXHRcdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbkxlZnQgPSB0aGlzLmdldEludGVyc2VjdGlvbih4LCB5LCByLCByYXlBbmdsZSwgeDQsIHk0LCB4MSwgeTEsIHJvdGF0aW9uLCBwNCk7XHJcblx0XHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uTGVmdCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25MZWZ0WzBdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uTGVmdFsxXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQgPSBNYXRoLm1pbihkLCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0XHRpZiAoZCA8PSByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHRcdFx0XHRcdGNsb3Nlc3QgPSBpbnRlcnNlY3Rpb25MZWZ0O1xyXG5cdFx0XHRcdFx0XHRcdGRpciA9IDM7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVjb3JkLFxyXG5cdFx0XHRjbG9zZXN0LFxyXG5cdFx0XHRkaXIsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcocGxheWVyczogSVBsYXllcltdKSB7XHJcblx0XHRjb25zdCB4ID0gdGhpcy5wbGF5ZXJYO1xyXG5cdFx0Y29uc3QgeSA9IHRoaXMucGxheWVyWTtcclxuXHJcblx0XHR0aGlzLnBsYXllclJheXMgPSBbXTtcclxuXHJcblx0XHR0aGlzLm1vdmUoKTtcclxuXHJcblx0XHRpZiAoIXRoaXMucmF5QW5nbGVzIHx8ICF0aGlzLnJheXMpIHJldHVybjtcclxuXHRcdGNvbnN0IHIgPSAxO1xyXG5cdFx0Y29uc3Qgcm90YXRpb24gPSAoKHRoaXMucm90YXRpb24gJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHJcblx0XHRsZXQgb2JqVHlwZVRlbXAgPSAwO1xyXG5cdFx0bGV0IG9iakRpclRlbXAgPSAwO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yYXlBbmdsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0bGV0IGNsb3Nlc3QgPSBudWxsO1xyXG5cdFx0XHRsZXQgcmVjb3JkID0gSW5maW5pdHk7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2FsbFJvd3M7IGorKykge1xyXG5cdFx0XHRcdGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy53YWxsQ29sczsgaysrKSB7XHJcblx0XHRcdFx0XHRjb25zdCB3YWxsID0gdGhpcy53YWxsc1tqICogdGhpcy53YWxsQ29scyArIGtdO1xyXG5cdFx0XHRcdFx0aWYgKHdhbGwgPT09IDApIGNvbnRpbnVlO1xyXG5cclxuXHRcdFx0XHRcdGNvbnN0IHJlY3RJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRcdGNsb3Nlc3Q6IG51bWJlcltdIHwgbnVsbDtcclxuXHRcdFx0XHRcdFx0ZGlyOiBudW1iZXI7XHJcblx0XHRcdFx0XHR9ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChqLCBrLCB4LCB5LCB0aGlzLnJheUFuZ2xlc1tpXSwgcm90YXRpb24pO1xyXG5cclxuXHRcdFx0XHRcdGlmIChyZWN0SW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZCkge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQgPSByZWN0SW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdCA9IHJlY3RJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHJcblx0XHRcdFx0XHRcdG9ialR5cGVUZW1wID0gd2FsbDtcclxuXHRcdFx0XHRcdFx0b2JqRGlyVGVtcCA9IHJlY3RJbnRlcnNlY3Rpb24uZGlyO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGNsb3Nlc3QpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5kZXZNb2RlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0dGhpcy5jdHgyZC5tb3ZlVG8oeCwgeSk7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVUbyhjbG9zZXN0WzBdLCBjbG9zZXN0WzFdKTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlU3R5bGUgPSBgcmdiYSgyNTUsMjU1LDI1NSwke3RoaXMucmF5T3BhY2l0eX0pYDtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVdpZHRoID0gMTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLnJheXNbaV0gPSByZWNvcmQ7XHJcblx0XHRcdFx0aWYgKHRoaXMub2JqZWN0VHlwZXMpIHRoaXMub2JqZWN0VHlwZXNbaV0gPSBvYmpUeXBlVGVtcDtcclxuXHRcdFx0XHRpZiAodGhpcy5vYmplY3REaXJzKSB0aGlzLm9iamVjdERpcnNbaV0gPSBvYmpEaXJUZW1wO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMucmF5c1tpXSA9IEluZmluaXR5O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0bG9vcDE6IGZvciAobGV0IGkgPSAwOyBpIDwgcGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBwID0gcGxheWVyc1tpXTtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxSb3dzOyBqKyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IHRoaXMud2FsbENvbHM7IGsrKykge1xyXG5cdFx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaiAqIHRoaXMud2FsbENvbHMgKyBrXTtcclxuXHRcdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCByZWN0SW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0XHRcdGRpcjogbnVtYmVyO1xyXG5cdFx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaiwgaywgeCwgeSwgMCwgcm90YXRpb24sIHsgeDogcC54LCB5OiBwLnkgfSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHJlY3RJbnRlcnNlY3Rpb24/LmNsb3Nlc3Q/LlswXSkgY29udGludWUgbG9vcDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBwLngpO1xyXG5cdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBwLnkpO1xyXG5cdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcblx0XHRcdGxldCBzcHJpdGVSYXlBbmdsZSA9XHJcblx0XHRcdFx0cC54IC0geCA8IDBcclxuXHRcdFx0XHRcdD8gMjcwIC0gKE1hdGguYXRhbigocC55IC0geSkgLyAtKHAueCAtIHgpKSAqIDE4MCkgLyBNYXRoLlBJXHJcblx0XHRcdFx0XHQ6IDkwICsgKE1hdGguYXRhbigocC55IC0geSkgLyAocC54IC0geCkpICogMTgwKSAvIE1hdGguUEk7XHJcblx0XHRcdHNwcml0ZVJheUFuZ2xlID0gKCgoc3ByaXRlUmF5QW5nbGUgLSA5MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHJcblx0XHRcdGxldCByYXlSb3REaWZmID0gc3ByaXRlUmF5QW5nbGUgLSByb3RhdGlvbjtcclxuXHJcblx0XHRcdGlmIChNYXRoLmFicyhyYXlSb3REaWZmKSA+IHRoaXMuZm92IC8gMikge1xyXG5cdFx0XHRcdHJheVJvdERpZmYgPSByYXlSb3REaWZmID49IDAgPyByYXlSb3REaWZmIC0gMzYwIDogMzYwICsgcmF5Um90RGlmZjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc3QgcGVyY0FjclNjcmVlbiA9IHJheVJvdERpZmYgLyB0aGlzLmZvdiArIDAuNTtcclxuXHJcblx0XHRcdGlmIChwZXJjQWNyU2NyZWVuID49IDAgJiYgcGVyY0FjclNjcmVlbiA8PSAxKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJSYXlzLnB1c2goe1xyXG5cdFx0XHRcdFx0bDogZCxcclxuXHRcdFx0XHRcdHg6IHAueCxcclxuXHRcdFx0XHRcdHk6IHAueSxcclxuXHRcdFx0XHRcdG5hbWU6IHAubmFtZSxcclxuXHRcdFx0XHRcdHBlcmNBY3Jvc3NTY3JlZW46IHBlcmNBY3JTY3JlZW4sXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAodGhpcy5kZXZNb2RlKSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJSYXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLm1vdmVUbyh4LCB5KTtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVUbyh0aGlzLnBsYXllclJheXNbaV0ueCwgdGhpcy5wbGF5ZXJSYXlzW2ldLnkpO1xyXG5cdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlU3R5bGUgPSBgcmdiYSgyNTUsMCwwLDEpYDtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdFx0dGhpcy5jdHgyZC5zdHJva2UoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IHJvdGF0aW9uRiA9ICgodGhpcy5yb3RhdGlvbiAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cdFx0Y29uc3Qgcm90YXRpb25SID0gKCgodGhpcy5yb3RhdGlvbiArIDkwKSAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cdFx0Y29uc3Qgcm90YXRpb25CID0gKCgodGhpcy5yb3RhdGlvbiArIDE4MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHRcdGNvbnN0IHJvdGF0aW9uTCA9ICgoKHRoaXMucm90YXRpb24gLSA5MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHJcblx0XHRsZXQgY2xvc2VzdEYgPSBudWxsO1xyXG5cdFx0bGV0IHJlY29yZEYgPSBJbmZpbml0eTtcclxuXHJcblx0XHRsZXQgY2xvc2VzdEwgPSBudWxsO1xyXG5cdFx0bGV0IHJlY29yZEwgPSBJbmZpbml0eTtcclxuXHJcblx0XHRsZXQgY2xvc2VzdFIgPSBudWxsO1xyXG5cdFx0bGV0IHJlY29yZFIgPSBJbmZpbml0eTtcclxuXHJcblx0XHRsZXQgY2xvc2VzdEIgPSBudWxsO1xyXG5cdFx0bGV0IHJlY29yZEIgPSBJbmZpbml0eTtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2FsbFJvd3M7IGkrKykge1xyXG5cdFx0XHRsb29wMjogZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxDb2xzOyBqKyspIHtcclxuXHRcdFx0XHRjb25zdCB3YWxsID0gdGhpcy53YWxsc1tpICogdGhpcy53YWxsQ29scyArIGpdO1xyXG5cdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZSBsb29wMjtcclxuXHJcblx0XHRcdFx0Y29uc3QgZkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgMCwgcm90YXRpb25GKTtcclxuXHRcdFx0XHRpZiAoZkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRGKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRGID0gZkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0RiA9IGZJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IGxJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGksIGosIHgsIHksIDAsIHJvdGF0aW9uTCk7XHJcblx0XHRcdFx0aWYgKGxJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkTCkge1xyXG5cdFx0XHRcdFx0cmVjb3JkTCA9IGxJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdEwgPSBsSW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBySW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdGNsb3Nlc3Q6IG51bWJlcltdIHwgbnVsbDtcclxuXHRcdFx0XHR9ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChpLCBqLCB4LCB5LCAwLCByb3RhdGlvblIpO1xyXG5cdFx0XHRcdGlmIChySW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZFIpIHtcclxuXHRcdFx0XHRcdHJlY29yZFIgPSBySW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdGNsb3Nlc3RSID0gckludGVyc2VjdGlvbi5jbG9zZXN0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3QgYkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgMCwgcm90YXRpb25CKTtcclxuXHRcdFx0XHRpZiAoYkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRCKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRCID0gYkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0QiA9IGJJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY2xvc2VzdEYpIHRoaXMubW92ZURpclJheXMuZm9yZXdhcmQgPSByZWNvcmRGO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RMKSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSByZWNvcmRMO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSBJbmZpbml0eTtcclxuXHJcblx0XHRpZiAoY2xvc2VzdFIpIHRoaXMubW92ZURpclJheXMucmlnaHQgPSByZWNvcmRSO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0ID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RCKSB0aGlzLm1vdmVEaXJSYXlzLmJhY2t3YXJkID0gcmVjb3JkQjtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gYHJnYmEoMCwyNTUsMCwxKWA7XHJcblx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0dGhpcy5jdHgyZC5lbGxpcHNlKHRoaXMucGxheWVyWCwgdGhpcy5wbGF5ZXJZLCA2LCA2LCAwLCAwLCAyICogTWF0aC5QSSk7XHJcblx0XHR0aGlzLmN0eDJkLmZpbGwoKTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgSVBsYXllciB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVycyB7XHJcblx0cHJpdmF0ZSB3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHVibGljIHBsYXllcnM6IElQbGF5ZXJbXTtcclxuXHRwcml2YXRlIHBXaWR0aDogbnVtYmVyO1xyXG5cdHByaXZhdGUgdXNlclg6IG51bWJlcjtcclxuXHRwcml2YXRlIHVzZXJZOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy5wbGF5ZXJzID0gW107XHJcblx0XHR0aGlzLnBXaWR0aCA9IDIwO1xyXG5cdFx0dGhpcy51c2VyWCA9IDA7XHJcblx0XHR0aGlzLnVzZXJZID0gMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRVc2VyQ29vcmRzKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcblx0XHR0aGlzLnVzZXJYID0geDtcclxuXHRcdHRoaXMudXNlclkgPSB5O1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFkZFBsYXllcihuYW1lOiBzdHJpbmcpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnBsYXllcnNbaV0ubmFtZSA9PT0gbmFtZSkgcmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMucGxheWVycy5wdXNoKHtcclxuXHRcdFx0bmFtZTogbmFtZSxcclxuXHRcdFx0eDogdGhpcy53b3JsZDJkLndpZHRoIC8gMixcclxuXHRcdFx0eTogdGhpcy53b3JsZDJkLmhlaWdodCAvIDIsXHJcblx0XHR9KTtcclxuXHRcdGNvbnNvbGUubG9nKGAke25hbWV9IGhhcyBqb2luZWQgdGhlIG1hdGNoYCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgcmVtb3ZlUGxheWVyKG5hbWU6IHN0cmluZykge1xyXG5cdFx0Y29uc29sZS5sb2coYFBsYXllciAke25hbWV9IGhhcyBsZWZ0IHRoZSBtYXRjaGApO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMucGxheWVyc1tpXS5uYW1lID09PSBuYW1lKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJzLnNwbGljZShpLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHVwZGF0ZVBsYXllclBvcyhwOiBJUGxheWVyKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJzW2ldLm5hbWUgPT09IHAubmFtZSkge1xyXG5cdFx0XHRcdHRoaXMucGxheWVyc1tpXS54ID0gcC54O1xyXG5cdFx0XHRcdHRoaXMucGxheWVyc1tpXS55ID0gcC55O1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMucGxheWVycy5wdXNoKHtcclxuXHRcdFx0bmFtZTogcC5uYW1lLFxyXG5cdFx0XHR4OiBwLngsXHJcblx0XHRcdHk6IHAueSxcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gcHJpdmF0ZSBtYWtlUGxheWVyc1BlcnAoKSB7XHJcblx0Ly8gXHRjb25zdCBkZWx0YUQgPSB0aGlzLnBXaWR0aCAvIDI7XHJcblx0Ly8gXHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdC8vIFx0XHRjb25zdCB7IHgsIHkgfSA9IHRoaXMucGxheWVyc1tpXTtcclxuXHQvLyBcdFx0Y29uc3Qgc2xvcGUgPSAoeSAtIHRoaXMudXNlclkpIC8gKHggLSB0aGlzLnVzZXJYKTtcclxuXHQvLyBcdFx0Y29uc3QgcGVycFNsb3BlID0gLSgxIC8gc2xvcGUpO1xyXG5cdC8vIFx0XHRjb25zdCBhbmdsZSA9IE1hdGguYXRhbihwZXJwU2xvcGUpO1xyXG5cdC8vIFx0XHR0aGlzLnBsYXllcnNbaV0ueDEgPSB4ICsgZGVsdGFEICogTWF0aC5jb3MoYW5nbGUpO1xyXG5cdC8vIFx0XHR0aGlzLnBsYXllcnNbaV0ueTEgPSB5ICsgZGVsdGFEICogTWF0aC5zaW4oYW5nbGUpO1xyXG5cdC8vIFx0XHR0aGlzLnBsYXllcnNbaV0ueDIgPSB4IC0gZGVsdGFEICogTWF0aC5jb3MoYW5nbGUpO1xyXG5cdC8vIFx0XHR0aGlzLnBsYXllcnNbaV0ueTIgPSB5IC0gZGVsdGFEICogTWF0aC5zaW4oYW5nbGUpO1xyXG5cdC8vIFx0fVxyXG5cdC8vIH1cclxuXHJcblx0cHVibGljIGRyYXcoKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBwID0gdGhpcy5wbGF5ZXJzW2ldO1xyXG5cclxuXHRcdFx0dGhpcy5jdHgyZC5maWxsU3R5bGUgPSAncmVkJztcclxuXHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0dGhpcy5jdHgyZC5lbGxpcHNlKHAueCwgcC55LCA2LCA2LCAyICogTWF0aC5QSSwgMCwgMiAqIE1hdGguUEkpO1xyXG5cdFx0XHR0aGlzLmN0eDJkLmZpbGwoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0Ly8gXHRjb25zdCBwID0gdGhpcy5wbGF5ZXJzW2ldO1xyXG5cdFx0Ly8gXHRpZiAoIXAueDEgfHwgIXAueTEgfHwgIXAueDIgfHwgIXAueTIpIGNvbnRpbnVlO1xyXG5cclxuXHRcdC8vIFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdC8vIFx0dGhpcy5jdHgyZC5tb3ZlVG8ocC54MSwgcC55MSk7XHJcblx0XHQvLyBcdHRoaXMuY3R4MmQubGluZVRvKHAueDIsIHAueTIpO1xyXG5cdFx0Ly8gXHR0aGlzLmN0eDJkLmxpbmVXaWR0aCA9IDY7XHJcblx0XHQvLyBcdHRoaXMuY3R4MmQuc3Ryb2tlU3R5bGUgPSAncmdiYSgyNDUsMjMwLDY2LDEpJztcclxuXHRcdC8vIFx0dGhpcy5jdHgyZC5zdHJva2UoKTtcclxuXHRcdC8vIH1cclxuXHR9XHJcbn1cclxuIiwiZXhwb3J0IGludGVyZmFjZSBJV2FsbERhdGEge1xyXG5cdHdhbGxzOiBVaW50OEFycmF5O1xyXG5cdGNvbHM6IG51bWJlcjtcclxuXHRyb3dzOiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNvY2tldERhdGFSZXMge1xyXG5cdGFjdGlvbjogc3RyaW5nO1xyXG5cdGRhdGE6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU29ja2V0RGF0YVJlcSB7XHJcblx0YWN0aW9uOiBzdHJpbmc7XHJcblx0aWQ6IHN0cmluZztcclxuXHRkYXRhOiBhbnk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBsYXllciB7XHJcblx0bmFtZTogc3RyaW5nO1xyXG5cdHg6IG51bWJlcjtcclxuXHR5OiBudW1iZXI7XHJcblx0eDE/OiBudW1iZXI7XHJcblx0eTE/OiBudW1iZXI7XHJcblx0eDI/OiBudW1iZXI7XHJcblx0eTI/OiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBsYXllclJheXMge1xyXG5cdGw6IG51bWJlcjtcclxuXHR4OiBudW1iZXI7XHJcblx0eTogbnVtYmVyO1xyXG5cdG5hbWU6IHN0cmluZztcclxuXHRwZXJjQWNyb3NzU2NyZWVuOiBudW1iZXI7XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbHMyZCB7XHJcblx0cHJpdmF0ZSB3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHVibGljIHdhbGxDb2xzOiBudW1iZXI7XHJcblx0cHVibGljIHdhbGxSb3dzOiBudW1iZXI7XHJcblx0cHVibGljIHdhbGxzOiBVaW50OEFycmF5O1xyXG5cdHB1YmxpYyB3YWxsVzogbnVtYmVyO1xyXG5cdHB1YmxpYyB3YWxsSDogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcih3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudCwgY3R4MmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG5cdFx0dGhpcy53b3JsZDJkID0gd29ybGQyZDtcclxuXHRcdHRoaXMuY3R4MmQgPSBjdHgyZDtcclxuXHRcdHRoaXMud2FsbENvbHMgPSAzMjtcclxuXHRcdHRoaXMud2FsbFJvd3MgPSAxODtcclxuXHRcdHRoaXMud2FsbHMgPSBuZXcgVWludDhBcnJheShcclxuXHRcdFx0W1xyXG5cdFx0XHRcdFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAxLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMSwgMSwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAxLCAxLCAxLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMSwgMCwgMCwgMSwgMSwgMSwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMCwgMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDEsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAxLCAxLCAxLCAxLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMSwgMSwgMSwgMSwgMCwgMSwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAxLCAxLCAxLCAwLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAxLCAxLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDIsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAxLCAwLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAwLCAxLCAxLCAxLCAxLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG5cdFx0XHRdLmZsYXQoKVxyXG5cdFx0KTtcclxuXHRcdHRoaXMud2FsbFcgPSB0aGlzLndvcmxkMmQud2lkdGggLyB0aGlzLndhbGxDb2xzO1xyXG5cdFx0dGhpcy53YWxsSCA9IHRoaXMud29ybGQyZC5oZWlnaHQgLyB0aGlzLndhbGxSb3dzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcoKSB7XHJcblx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxSb3dzOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxDb2xzOyBqKyspIHtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9ICdyZ2IoMTAwLCAxMDAsIDEwMCknO1xyXG5cdFx0XHRcdGNvbnN0IHdhbGwgPSB0aGlzLndhbGxzW2kgKiB0aGlzLndhbGxDb2xzICsgal07XHJcblxyXG5cdFx0XHRcdHN3aXRjaCAod2FsbCkge1xyXG5cdFx0XHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5yZWN0KGogKiB0aGlzLndhbGxXLCBpICogdGhpcy53YWxsSCwgdGhpcy53YWxsVywgdGhpcy53YWxsSCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuZmlsbCgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5yZWN0KGogKiB0aGlzLndhbGxXLCBpICogdGhpcy53YWxsSCwgdGhpcy53YWxsVywgdGhpcy53YWxsSCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuZmlsbCgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgeyBJUGxheWVyUmF5cyB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbHMzZCB7XHJcblx0cHJpdmF0ZSB3b3JsZDNkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDNkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHJpdmF0ZSB3YWxsVzogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbEg6IG51bWJlcjtcclxuXHRwcml2YXRlIHdvcmxkM2REaWFnOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsVGV4dHVyZTogSFRNTEltYWdlRWxlbWVudDtcclxuXHRwcml2YXRlIGJnVG9wSW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cdHByaXZhdGUgYmdUb3BYOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsQ2VudGVySGVpZ2h0OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkM2Q6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgzZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB3YWxsVzogbnVtYmVyLCB3YWxsSDogbnVtYmVyKSB7XHJcblx0XHR0aGlzLndvcmxkM2QgPSB3b3JsZDNkO1xyXG5cdFx0dGhpcy5jdHgzZCA9IGN0eDNkO1xyXG5cdFx0dGhpcy53YWxsVyA9IHdhbGxXO1xyXG5cdFx0dGhpcy53YWxsSCA9IHdhbGxIO1xyXG5cdFx0dGhpcy53b3JsZDNkRGlhZyA9IE1hdGguc3FydChNYXRoLnBvdyh3b3JsZDNkLndpZHRoLCAyKSArIE1hdGgucG93KHdvcmxkM2QuaGVpZ2h0LCAyKSk7XHJcblx0XHR0aGlzLndhbGxUZXh0dXJlID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLndhbGxUZXh0dXJlLnNyYyA9ICcuLi9wdWJsaWMvc3RvbmVUZXh0dXJlLnBuZyc7XHJcblx0XHR0aGlzLmJnVG9wSW1nID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLmJnVG9wSW1nLnNyYyA9ICcuLi9wdWJsaWMvc3RhcnMuanBnJztcclxuXHRcdHRoaXMuYmdUb3BYID0gMDtcclxuXHRcdHRoaXMud2FsbENlbnRlckhlaWdodCA9IHRoaXMud29ybGQzZC5oZWlnaHQgLyAyLjU7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGRyYXdCYWNrZ3JvdW5kKCkge1xyXG5cdFx0Ly9tdWx0aXBseSBiZyBpbWcgd2lkdGggYnkgNCBzbyB3aGVuIHlvdSByb3RhdGUgOTBkZWcsIHlvdSdyZSAxLzR0aCB0aHJvdWdoIHRoZSBpbWdcclxuXHRcdHRoaXMuYmdUb3BJbWcud2lkdGggPSB0aGlzLndvcmxkM2Qud2lkdGggKiAyO1xyXG5cdFx0dGhpcy5iZ1RvcEltZy5oZWlnaHQgPSB0aGlzLndvcmxkM2QuaGVpZ2h0O1xyXG5cclxuXHRcdC8vcmVzZXQgYmcgaW1nIHBvc2l0aW9uIGlmIGVuZHMgb2YgaW1nIGFyZSBpbiB2aWV3XHJcblx0XHRpZiAodGhpcy5iZ1RvcFggPiAwKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYID0gLXRoaXMuYmdUb3BJbWcud2lkdGg7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuYmdUb3BYIDwgLXRoaXMuYmdUb3BJbWcud2lkdGgpIHtcclxuXHRcdFx0dGhpcy5iZ1RvcFggPSAwO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuY3R4M2QuZHJhd0ltYWdlKFxyXG5cdFx0XHR0aGlzLmJnVG9wSW1nLFxyXG5cdFx0XHR0aGlzLmJnVG9wWCxcclxuXHRcdFx0dGhpcy53YWxsQ2VudGVySGVpZ2h0LFxyXG5cdFx0XHR0aGlzLmJnVG9wSW1nLndpZHRoLFxyXG5cdFx0XHQtdGhpcy5iZ1RvcEltZy5oZWlnaHRcclxuXHRcdCk7XHJcblx0XHR0aGlzLmN0eDNkLmRyYXdJbWFnZShcclxuXHRcdFx0dGhpcy5iZ1RvcEltZyxcclxuXHRcdFx0dGhpcy5iZ1RvcFggKyB0aGlzLmJnVG9wSW1nLndpZHRoLFxyXG5cdFx0XHR0aGlzLndhbGxDZW50ZXJIZWlnaHQsXHJcblx0XHRcdHRoaXMuYmdUb3BJbWcud2lkdGgsXHJcblx0XHRcdC10aGlzLmJnVG9wSW1nLmhlaWdodFxyXG5cdFx0KTtcclxuXHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoMCwwLDAsMC43KWA7XHJcblx0XHR0aGlzLmN0eDNkLmZpbGxSZWN0KDAsIDAsIHRoaXMud29ybGQzZC53aWR0aCwgdGhpcy53YWxsQ2VudGVySGVpZ2h0KTtcclxuXHJcblx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2IoMTUsIDM1LCAxNSlgO1xyXG5cdFx0dGhpcy5jdHgzZC5maWxsUmVjdChcclxuXHRcdFx0MCxcclxuXHRcdFx0dGhpcy53YWxsQ2VudGVySGVpZ2h0LFxyXG5cdFx0XHR0aGlzLndvcmxkM2Qud2lkdGgsXHJcblx0XHRcdHRoaXMud29ybGQzZC5oZWlnaHQgLSB0aGlzLndhbGxDZW50ZXJIZWlnaHRcclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0QmdUb3BYTW91c2VNb3ZlKG1vdmVEZWx0YTogbnVtYmVyKSB7XHJcblx0XHR0aGlzLmJnVG9wWCAtPSAoKHRoaXMuYmdUb3BJbWcud2lkdGggLyAxODApICogbW92ZURlbHRhKSAvIDIwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldGJnVG9wWChyb3RBbXQ6IG51bWJlciwgbW92ZURpckxSOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHRjb25zdCB4RGVsdGEgPSAodGhpcy5iZ1RvcEltZy53aWR0aCAvIDE4MCkgKiByb3RBbXQ7XHJcblx0XHRpZiAobW92ZURpckxSID09PSAnbGVmdCcpIHtcclxuXHRcdFx0dGhpcy5iZ1RvcFggKz0geERlbHRhO1xyXG5cdFx0fSBlbHNlIGlmIChtb3ZlRGlyTFIgPT09ICdyaWdodCcpIHtcclxuXHRcdFx0dGhpcy5iZ1RvcFggLT0geERlbHRhO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcoXHJcblx0XHRyYXlzOiBGbG9hdDMyQXJyYXkgfCBudWxsLFxyXG5cdFx0b2JqZWN0VHlwZXM6IFVpbnQ4QXJyYXkgfCBudWxsLFxyXG5cdFx0b2JqZWN0RGlyczogVWludDhBcnJheSB8IG51bGwsXHJcblx0XHRwWDogbnVtYmVyLFxyXG5cdFx0cFk6IG51bWJlcixcclxuXHRcdHJheUFuZ2xlczogRmxvYXQzMkFycmF5IHwgbnVsbCxcclxuXHRcdHBsYXllclJheXM6IElQbGF5ZXJSYXlzW11cclxuXHQpIHtcclxuXHRcdGlmICghcmF5cyB8fCAhcmF5QW5nbGVzKSByZXR1cm47XHJcblx0XHR0aGlzLmRyYXdCYWNrZ3JvdW5kKCk7XHJcblxyXG5cdFx0Y29uc3Qgd2FsbFdpZHRoID0gdGhpcy53b3JsZDNkLndpZHRoIC8gcmF5cy5sZW5ndGg7XHJcblx0XHRjb25zdCB3YWxsV2lkdGhPdmVyc2l6ZWQgPSB3YWxsV2lkdGggKyAxO1xyXG5cdFx0bGV0IHdhbGxYID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHJheXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgZGlzdCA9IHJheXNbaV0gKiBNYXRoLmNvcyhyYXlBbmdsZXNbaV0pO1xyXG5cdFx0XHRjb25zdCBvZmZzZXQgPSBvYmplY3REaXJzPy5baV0gPT09IDAgfHwgb2JqZWN0RGlycz8uW2ldID09PSAyID8gcFggLyB0aGlzLndhbGxXIDogcFkgLyB0aGlzLndhbGxIO1xyXG5cclxuXHRcdFx0Y29uc3Qgd2FsbFNoaWZ0QW10ID0gKHRoaXMud29ybGQzZC5oZWlnaHQgKiA1MCkgLyBkaXN0O1xyXG5cdFx0XHRjb25zdCB3YWxsU3RhcnRUb3AgPSB0aGlzLndhbGxDZW50ZXJIZWlnaHQgLSB3YWxsU2hpZnRBbXQ7XHJcblx0XHRcdGNvbnN0IHdhbGxFbmRCb3R0b20gPSB0aGlzLndhbGxDZW50ZXJIZWlnaHQgKyB3YWxsU2hpZnRBbXQ7XHJcblxyXG5cdFx0XHRsZXQgd2FsbERhcmtuZXNzID0gZGlzdCAvIHRoaXMud29ybGQzZC5oZWlnaHQ7XHJcblx0XHRcdHdhbGxEYXJrbmVzcyA9ICh0aGlzLndvcmxkM2REaWFnIC0gZGlzdCkgLyB0aGlzLndvcmxkM2REaWFnO1xyXG5cclxuXHRcdFx0c3dpdGNoIChvYmplY3REaXJzPy5baV0pIHtcclxuXHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHR3YWxsRGFya25lc3MgLT0gMC4yO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0d2FsbERhcmtuZXNzIC09IDAuMjtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzd2l0Y2ggKG9iamVjdFR5cGVzPy5baV0pIHtcclxuXHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKCR7MjU1ICogd2FsbERhcmtuZXNzfSwkezI1NSAqIHdhbGxEYXJrbmVzc30sJHsyNTUgKiB3YWxsRGFya25lc3N9LDEpYDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoJHswICogd2FsbERhcmtuZXNzfSwkezEwMCAqIHdhbGxEYXJrbmVzc30sJHsxMDAgKiB3YWxsRGFya25lc3N9LDEpYDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmN0eDNkLmZpbGxSZWN0KHdhbGxYLCB3YWxsU3RhcnRUb3AsIHdhbGxXaWR0aE92ZXJzaXplZCwgd2FsbEVuZEJvdHRvbSAtIHdhbGxTdGFydFRvcCk7XHJcblxyXG5cdFx0XHQvLyAvLyBjb25zdCBzV2lkdGggPVxyXG5cdFx0XHQvLyAvLyBcdG9iamVjdERpcnM/LltpXSA9PT0gMCB8fCBvYmplY3REaXJzPy5baV0gPT09IDJcclxuXHRcdFx0Ly8gLy8gXHRcdD8gdGhpcy53YWxsVGV4dHVyZS53aWR0aCAvIG9mZnNldFxyXG5cdFx0XHQvLyAvLyBcdFx0OiB0aGlzLndhbGxUZXh0dXJlLmhlaWdodCAvIG9mZnNldDtcclxuXHJcblx0XHRcdC8vIHRoaXMuY3R4M2QuZHJhd0ltYWdlKFxyXG5cdFx0XHQvLyBcdHRoaXMud2FsbFRleHR1cmUsXHJcblx0XHRcdC8vIFx0b2Zmc2V0LFxyXG5cdFx0XHQvLyBcdDAsXHJcblx0XHRcdC8vIFx0dGhpcy53YWxsVGV4dHVyZS53aWR0aCxcclxuXHRcdFx0Ly8gXHR0aGlzLndhbGxUZXh0dXJlLmhlaWdodCxcclxuXHRcdFx0Ly8gXHR3YWxsWCxcclxuXHRcdFx0Ly8gXHR3YWxsU3RhcnRUb3AsXHJcblx0XHRcdC8vIFx0d2FsbFdpZHRoLFxyXG5cdFx0XHQvLyBcdHdhbGxFbmRCb3R0b20gLSB3YWxsU3RhcnRUb3BcclxuXHRcdFx0Ly8gKTtcclxuXHJcblx0XHRcdHdhbGxYICs9IHdhbGxXaWR0aDtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllclJheXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcmF5TCA9IHBsYXllclJheXNbaV0ubDtcclxuXHRcdFx0Y29uc3QgeCA9IHBsYXllclJheXNbaV0ucGVyY0Fjcm9zc1NjcmVlbiAqIHRoaXMud29ybGQzZC53aWR0aDtcclxuXHRcdFx0Y29uc3QgcGxheWVyVyA9ICh0aGlzLndvcmxkM2Qud2lkdGggKiAyMCkgLyByYXlMO1xyXG5cclxuXHRcdFx0bGV0IHBsYXllckNlbnRlckhlaWdodCA9IHRoaXMud29ybGQzZC5oZWlnaHQgLyAyLjU7XHJcblx0XHRcdGNvbnN0IHdhbGxTaGlmdEFtdCA9ICh0aGlzLndvcmxkM2QuaGVpZ2h0ICogNTApIC8gcmF5TDtcclxuXHRcdFx0Y29uc3QgcGxheWVyU2hpZnRBbXQgPSAodGhpcy53b3JsZDNkLmhlaWdodCAqIDQwKSAvIHJheUw7XHJcblx0XHRcdGNvbnN0IGFkalRvQm90QW10ID0gd2FsbFNoaWZ0QW10IC0gcGxheWVyU2hpZnRBbXQ7XHJcblx0XHRcdGNvbnN0IHBsYXllclN0YXJ0VG9wID0gcGxheWVyQ2VudGVySGVpZ2h0IC0gcGxheWVyU2hpZnRBbXQgKyBhZGpUb0JvdEFtdDtcclxuXHRcdFx0Y29uc3QgcGxheWVyRW5kQm90dG9tID0gcGxheWVyQ2VudGVySGVpZ2h0ICsgcGxheWVyU2hpZnRBbXQgKyBhZGpUb0JvdEFtdDtcclxuXHJcblx0XHRcdGxldCB3YWxsRGFya25lc3MgPSByYXlMIC8gdGhpcy53b3JsZDNkLmhlaWdodDtcclxuXHRcdFx0d2FsbERhcmtuZXNzID0gKHRoaXMud29ybGQzZERpYWcgLSByYXlMKSAvIHRoaXMud29ybGQzZERpYWc7XHJcblxyXG5cdFx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKCR7MjU1ICogd2FsbERhcmtuZXNzfSwkezEwMCAqIHdhbGxEYXJrbmVzc30sJHswICogd2FsbERhcmtuZXNzfSwxKWA7XHJcblxyXG5cdFx0XHR0aGlzLmN0eDNkLmZpbGxSZWN0KHggLSBwbGF5ZXJXIC8gMiwgcGxheWVyU3RhcnRUb3AsIHBsYXllclcsIHBsYXllckVuZEJvdHRvbSAtIHBsYXllclN0YXJ0VG9wKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcGxheWVyMmQudHNcIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvcGxheWVycy50c1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy90eXBlcy50c1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy93YWxsczJkLnRzXCIpO1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvd2FsbHMzZC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==