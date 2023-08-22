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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




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
        walls3d.draw(player2d.rays, player2d.rayCoords, player2d.objectTypes, player2d.objectDirs, player2d.extraRay, player2d.rayAngles, player2d.playerRays, player2d.playerW, player2d.distToProjectionPlane);
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
var setUp = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                walls2d = new _walls2d__WEBPACK_IMPORTED_MODULE_2__["default"](world2d, ctx2d);
                walls3d = new _walls3d__WEBPACK_IMPORTED_MODULE_3__["default"](world3d, ctx3d, walls2d.wallW, walls2d.wallH);
                player2d = new _player2d__WEBPACK_IMPORTED_MODULE_0__["default"](world2d, ctx2d, walls2d.walls, walls2d.wallCols, walls2d.wallRows, walls2d.wallW, walls2d.wallH, frameRate);
                return [4 /*yield*/, player2d.setUp()];
            case 1:
                _a.sent();
                return [4 /*yield*/, walls3d.setUp()];
            case 2:
                _a.sent();
                players = new _players__WEBPACK_IMPORTED_MODULE_1__["default"](world2d, ctx2d);
                gameLoop();
                return [2 /*return*/];
        }
    });
}); };
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
        this.rotation = 300;
        this.angle = this.rotation + 90;
        this.distToProjectionPlane = world2d.width / 2 / Math.tan(this.fovRad / 2);
        this.rayAngles = null;
        this.rayDensityAdjustment = 10;
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
        this.playerX = 200;
        this.playerY = 200;
        this.devMode = true;
        this.playerRays = [];
        this.playerW = 20;
        this.renderDist = 800;
        this.playerCollisionMargin = 20;
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
        var hittingF = this.moveDirRays.foreward < this.playerCollisionMargin;
        var hittingL = this.moveDirRays.left < this.playerCollisionMargin;
        var hittingR = this.moveDirRays.right < this.playerCollisionMargin;
        var hittingB = this.moveDirRays.backward < this.playerCollisionMargin;
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
        this.wallCols = 64;
        this.wallRows = 36;
        // prettier-ignore
        this.walls = new Uint8Array([
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ].flat());
        this.wallW = this.world2d.width / this.wallCols;
        this.wallH = this.world2d.height / this.wallRows;
        this.devMode = true;
    }
    Walls2d.prototype.draw = function () {
        // console.log(this.walls.length);
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
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Walls3d = /** @class */ (function () {
    function Walls3d(world3d, ctx3d, wallW, wallH) {
        this.world3d = world3d;
        this.ctx3d = ctx3d;
        this.wallW = wallW;
        this.wallH = wallH;
        this.world3dDiag = Math.sqrt(Math.pow(world3d.width, 2) + Math.pow(world3d.height, 2));
        this.bgTopX = 0;
        this.wallCenterHeight = this.world3d.height / 2.5;
        this.wMultiplier = 0;
        this.texturePaths = ['../public/wallTexture.png', '../public/wallTextureDark.png', '../public/stars.jpg'];
        this.textures = {};
    }
    Walls3d.prototype.setUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var preloadImages, imgArraytemp;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        preloadImages = function () {
                            var promises = _this.texturePaths.map(function (path) {
                                return new Promise(function (resolve, reject) {
                                    var _a;
                                    var name = (_a = path.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                                    var image = new Image();
                                    image.src = path;
                                    image.onload = function () {
                                        resolve([name, image]);
                                    };
                                    image.onerror = function () { return reject("Image failed to load: ".concat(path)); };
                                });
                            });
                            return Promise.all(promises);
                        };
                        return [4 /*yield*/, preloadImages()];
                    case 1:
                        imgArraytemp = _a.sent();
                        this.textures = Object.fromEntries(imgArraytemp);
                        this.wMultiplier = Math.abs(this.textures.wallTexture.width / this.wallW);
                        return [2 /*return*/];
                }
            });
        });
    };
    Walls3d.prototype.drawBackground = function () {
        //multiply bg img width by 4 so when you rotate 90deg, you're 1/4th through the img
        this.textures.stars.width = this.world3d.width * 2;
        this.textures.stars.height = this.world3d.height;
        //reset bg img position if ends of img are in view
        if (this.bgTopX > 0) {
            this.bgTopX = -this.textures.stars.width;
        }
        else if (this.bgTopX < -this.textures.stars.width) {
            this.bgTopX = 0;
        }
        this.ctx3d.drawImage(this.textures.stars, this.bgTopX, this.wallCenterHeight, this.textures.stars.width, -this.textures.stars.height);
        this.ctx3d.drawImage(this.textures.stars, this.bgTopX + this.textures.stars.width, this.wallCenterHeight, this.textures.stars.width, -this.textures.stars.height);
        this.ctx3d.fillStyle = "rgba(0,0,0,0.7)";
        this.ctx3d.fillRect(0, 0, this.world3d.width, this.wallCenterHeight);
        this.ctx3d.fillStyle = "rgb(15, 35, 15)";
        this.ctx3d.fillRect(0, this.wallCenterHeight, this.world3d.width, this.world3d.height - this.wallCenterHeight);
    };
    Walls3d.prototype.setBgTopXMouseMove = function (moveDelta) {
        this.bgTopX -= ((this.textures.stars.width / 180) * moveDelta) / 20;
    };
    Walls3d.prototype.setbgTopX = function (rotAmt, moveDirLR) {
        var xDelta = (this.textures.stars.width / 180) * rotAmt;
        if (moveDirLR === 'left') {
            this.bgTopX += xDelta;
        }
        else if (moveDirLR === 'right') {
            this.bgTopX -= xDelta;
        }
    };
    Walls3d.prototype.draw = function (rays, rayCoords, objectTypes, objectDirs, extraRay, rayAngles, playerRays, playerW, distToProjectionPlane) {
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
            offset *= this.wMultiplier;
            offset2 *= this.wMultiplier;
            var wallHeight = (this.wallH / dist) * distToProjectionPlane;
            // const wallHalfHeight = (this.world3d.height * 50) / dist;
            var wallHalfHeight = wallHeight / 2;
            var wallStartTop = this.wallCenterHeight - wallHalfHeight;
            var wallEndBottom = this.wallCenterHeight + wallHalfHeight;
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
            sWidth = offset <= offset2 ? offset2 - offset : this.textures.wallTexture.width - offset + offset2;
            if (offset > offset2) {
                chunk2Offset = -(this.textures.wallTexture.width - offset);
            }
            if ((objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 2) {
                curImg = this.textures.wallTexture;
            }
            else {
                curImg = this.textures.wallTextureDark;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNoTSxDQUFDLElBQUksRUFBRSxDQUNSLENBQUM7UUFDRixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUks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OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9wbGF5ZXIyZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9wbGF5ZXJzLnRzIiwid2VicGFjazovL2Zwc19nYW1lLy4vc3JjL3dhbGxzMmQudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvd2FsbHMzZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWVyMmQgZnJvbSAnLi9wbGF5ZXIyZCc7XHJcbmltcG9ydCBQbGF5ZXJzIGZyb20gJy4vcGxheWVycyc7XHJcbmltcG9ydCB7IElTb2NrZXREYXRhUmVxLCBJU29ja2V0RGF0YVJlcyB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgV2FsbHMyZCBmcm9tICcuL3dhbGxzMmQnO1xyXG5pbXBvcnQgV2FsbHMzZCBmcm9tICcuL3dhbGxzM2QnO1xyXG5cclxuLy8gVXNlIHdzcyAoc2VjdXJlKSBpbnN0ZWFkIG9mIHdzIGZvciBwcm9kdWNpdG9uXHJcbmNvbnN0IHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vbG9jYWxob3N0OjMwMDAvc2VydmVyJyk7XHJcblxyXG5jb25zdCB3b3JsZDJkID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3b3JsZDJkJyk7XHJcbmNvbnN0IHdvcmxkM2QgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dvcmxkM2QnKTtcclxuXHJcbmNvbnN0IGN0eDJkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDJkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcbmNvbnN0IGN0eDNkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDNkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcblxyXG5jb25zdCBmcHNFbGVtZW50ID0gPEhUTUxIZWFkaW5nRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnBzQ291bnRlcicpO1xyXG5cclxubGV0IHdhbGxzMmQ6IFdhbGxzMmQ7XHJcbmxldCB3YWxsczNkOiBXYWxsczNkO1xyXG5sZXQgcGxheWVyMmQ6IFBsYXllcjJkO1xyXG5sZXQgcGxheWVyczogUGxheWVycztcclxuXHJcbmxldCBmcHNJbnRlcnZhbDogbnVtYmVyLCBub3c6IG51bWJlciwgdGhlbjogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIsIHJlcXVlc3RJRDogbnVtYmVyO1xyXG5sZXQgZnJhbWVDb3VudDogbnVtYmVyID0gMDtcclxuY29uc3QgZnJhbWVSYXRlID0gNjA7XHJcblxyXG5sZXQgZGV2TW9kZSA9IHRydWU7XHJcblxyXG5sZXQgdXNlcklkOiBhbnk7XHJcbmxldCBsYXN0UmVjb3JkZWRQbGF5ZXJQb3MgPSB7XHJcblx0eDogMCxcclxuXHR5OiAwLFxyXG59O1xyXG5cclxuY29uc3Qgc2V0RnJhbWVyYXRlVmFsdWUgPSAoKSA9PiB7XHJcblx0ZnBzRWxlbWVudC5pbm5lclRleHQgPSBmcmFtZUNvdW50LnRvU3RyaW5nKCk7XHJcblx0ZnBzRWxlbWVudC5zdHlsZS5jb2xvciA9IGZyYW1lQ291bnQgPCBmcmFtZVJhdGUgPyAncmVkJyA6ICdyZ2IoMCwgMjU1LCAwKSc7XHJcblx0ZnJhbWVDb3VudCA9IDA7XHJcbn07XHJcblxyXG4vLyBsZXQgYXJyVGVzdDogbnVtYmVyW10gPSBbXTtcclxuLy8gY29uc3QgYXJyVGVzdDIgPSBuZXcgRmxvYXQzMkFycmF5KDUwMDApO1xyXG5cclxuLy8gZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJUZXN0Mi5sZW5ndGg7IGkrKykge1xyXG4vLyBcdGFyclRlc3QucHVzaChpKTtcclxuLy8gXHRhcnJUZXN0MltpXSA9IGk7XHJcbi8vIH1cclxuXHJcbmNvbnN0IGdhbWVMb29wID0gKCkgPT4ge1xyXG5cdHJlcXVlc3RJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcCk7XHJcblxyXG5cdGZwc0ludGVydmFsID0gMTAwMCAvIGZyYW1lUmF0ZTtcclxuXHJcblx0bm93ID0gRGF0ZS5ub3coKTtcclxuXHRlbGFwc2VkID0gbm93IC0gdGhlbjtcclxuXHJcblx0aWYgKGVsYXBzZWQgPiBmcHNJbnRlcnZhbCkge1xyXG5cdFx0aWYgKGZyYW1lQ291bnQgPT09IDApIHNldFRpbWVvdXQoc2V0RnJhbWVyYXRlVmFsdWUsIDEwMDApO1xyXG5cdFx0ZnJhbWVDb3VudCArPSAxO1xyXG5cdFx0dGhlbiA9IG5vdyAtIChlbGFwc2VkICUgZnBzSW50ZXJ2YWwpO1xyXG5cclxuXHRcdGN0eDJkLmNsZWFyUmVjdCgwLCAwLCB3b3JsZDJkLndpZHRoLCB3b3JsZDJkLmhlaWdodCk7XHJcblx0XHRjdHgzZC5jbGVhclJlY3QoMCwgMCwgd29ybGQzZC53aWR0aCwgd29ybGQzZC5oZWlnaHQpO1xyXG5cclxuXHRcdC8vIGZvciAobGV0IGkgPSAwOyBpIDwgYXJyVGVzdDIubGVuZ3RoOyBpKyspIHtcclxuXHRcdC8vIFx0Ly8gYXJyVGVzdFtpXSA9IE1hdGgucmFuZG9tKCk7XHJcblx0XHQvLyBcdGFyclRlc3QyW2ldID0gTWF0aC5yYW5kb20oKTtcclxuXHJcblx0XHQvLyBcdGN0eDJkLmNsZWFyUmVjdCgwLCAwLCB3b3JsZDJkLndpZHRoLCB3b3JsZDJkLmhlaWdodCk7XHJcblx0XHQvLyBcdGN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0Ly8gXHRjdHgyZC5mb250ID0gJzQ4cHggYXJpYWwnO1xyXG5cdFx0Ly8gXHRjdHgyZC5maWxsU3R5bGUgPSAnZ3JlZW4nO1xyXG5cdFx0Ly8gXHRjdHgyZC5maWxsVGV4dChhcnJUZXN0MltpXS50b1N0cmluZygpLCAxMDAsIDEwMCk7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0d2FsbHMyZC5kcmF3KCk7XHJcblx0XHRwbGF5ZXJzLmRyYXcoKTtcclxuXHRcdHBsYXllcjJkLmRyYXcocGxheWVycy5wbGF5ZXJzKTtcclxuXHRcdHdhbGxzM2Quc2V0YmdUb3BYKHBsYXllcjJkLnJvdEFtdCwgcGxheWVyMmQucm90RGlyKTtcclxuXHRcdHdhbGxzM2QuZHJhdyhcclxuXHRcdFx0cGxheWVyMmQucmF5cyxcclxuXHRcdFx0cGxheWVyMmQucmF5Q29vcmRzLFxyXG5cdFx0XHRwbGF5ZXIyZC5vYmplY3RUeXBlcyxcclxuXHRcdFx0cGxheWVyMmQub2JqZWN0RGlycyxcclxuXHRcdFx0cGxheWVyMmQuZXh0cmFSYXksXHJcblx0XHRcdHBsYXllcjJkLnJheUFuZ2xlcyxcclxuXHRcdFx0cGxheWVyMmQucGxheWVyUmF5cyxcclxuXHRcdFx0cGxheWVyMmQucGxheWVyVyxcclxuXHRcdFx0cGxheWVyMmQuZGlzdFRvUHJvamVjdGlvblBsYW5lXHJcblx0XHQpO1xyXG5cclxuXHRcdG9uZTogaWYgKHBsYXllcjJkLnBsYXllclggIT09IGxhc3RSZWNvcmRlZFBsYXllclBvcy54IHx8IHBsYXllcjJkLnBsYXllclkgIT09IGxhc3RSZWNvcmRlZFBsYXllclBvcy55KSB7XHJcblx0XHRcdGxhc3RSZWNvcmRlZFBsYXllclBvcy54ID0gcGxheWVyMmQucGxheWVyWDtcclxuXHRcdFx0bGFzdFJlY29yZGVkUGxheWVyUG9zLnkgPSBwbGF5ZXIyZC5wbGF5ZXJZO1xyXG5cclxuXHRcdFx0aWYgKCF1c2VySWQpIGJyZWFrIG9uZTtcclxuXHJcblx0XHRcdGNvbnN0IGRhdGE6IElTb2NrZXREYXRhUmVxID0ge1xyXG5cdFx0XHRcdGFjdGlvbjogJ3VwZGF0ZS1wbGF5ZXItcG9zJyxcclxuXHRcdFx0XHRpZDogdXNlcklkLFxyXG5cdFx0XHRcdGRhdGE6IHtcclxuXHRcdFx0XHRcdHg6IGxhc3RSZWNvcmRlZFBsYXllclBvcy54LFxyXG5cdFx0XHRcdFx0eTogbGFzdFJlY29yZGVkUGxheWVyUG9zLnksXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0fTtcclxuXHRcdFx0c29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKDAsMjU1LDAsMSlgO1xyXG5cdFx0Y3R4M2QubGluZVdpZHRoID0gMjtcclxuXHRcdGN0eDNkLmJlZ2luUGF0aCgpO1xyXG5cdFx0Y3R4M2QuZWxsaXBzZSh3b3JsZDNkLndpZHRoIC8gMiwgd29ybGQzZC5oZWlnaHQgLyAyLjUsIDUsIDUsIDAsIDAsIDIgKiBNYXRoLlBJKTtcclxuXHRcdGN0eDNkLmZpbGwoKTtcclxuXHR9XHJcbn07XHJcblxyXG5jb25zdCBzZXRVcCA9IGFzeW5jICgpID0+IHtcclxuXHR3YWxsczJkID0gbmV3IFdhbGxzMmQod29ybGQyZCwgY3R4MmQpO1xyXG5cdHdhbGxzM2QgPSBuZXcgV2FsbHMzZCh3b3JsZDNkLCBjdHgzZCwgd2FsbHMyZC53YWxsVywgd2FsbHMyZC53YWxsSCk7XHJcblx0cGxheWVyMmQgPSBuZXcgUGxheWVyMmQoXHJcblx0XHR3b3JsZDJkLFxyXG5cdFx0Y3R4MmQsXHJcblx0XHR3YWxsczJkLndhbGxzLFxyXG5cdFx0d2FsbHMyZC53YWxsQ29scyxcclxuXHRcdHdhbGxzMmQud2FsbFJvd3MsXHJcblx0XHR3YWxsczJkLndhbGxXLFxyXG5cdFx0d2FsbHMyZC53YWxsSCxcclxuXHRcdGZyYW1lUmF0ZVxyXG5cdCk7XHJcblx0YXdhaXQgcGxheWVyMmQuc2V0VXAoKTtcclxuXHRhd2FpdCB3YWxsczNkLnNldFVwKCk7XHJcblxyXG5cdHBsYXllcnMgPSBuZXcgUGxheWVycyh3b3JsZDJkLCBjdHgyZCk7XHJcblx0Z2FtZUxvb3AoKTtcclxufTtcclxuXHJcbndpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcblx0dGhlbiA9IERhdGUubm93KCk7XHJcblx0c2V0VXAoKTtcclxufTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGUgPT4ge1xyXG5cdGlmICghZGV2TW9kZSkge1xyXG5cdFx0cGxheWVyMmQuc2V0TW91c2VSb3RhdGlvbihlLm1vdmVtZW50WCAvIDIwKTtcclxuXHRcdHdhbGxzM2Quc2V0QmdUb3BYTW91c2VNb3ZlKGUubW92ZW1lbnRYKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG5cdC8vU2V0IG1vdmUgZm9yZXdhcmRzIGFuZCBiYWNrd2FyZHNcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5VycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIoJ2ZvcndhcmRzJyk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlTJykge1xyXG5cdFx0cGxheWVyMmQuc2V0TW92ZURpcignYmFja3dhcmRzJyk7XHJcblx0fVxyXG5cclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbignbGVmdCcpO1xyXG5cdFx0ZWxzZSBwbGF5ZXIyZC5zZXRTdHJhZmVEaXIoJ2xlZnQnKTtcclxuXHR9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleUQnKSB7XHJcblx0XHRpZiAoZGV2TW9kZSkgcGxheWVyMmQuc2V0Um90YXRpb24oJ3JpZ2h0Jyk7XHJcblx0XHRlbHNlIHBsYXllcjJkLnNldFN0cmFmZURpcigncmlnaHQnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuXHQvL1NldCBtb3ZlbWVudCB2YXJpYWJsZXMgdG8gbnVsbCB3aGVuIGtleSByZWxlYXNlZHtcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScgfHwgZS5jb2RlID09PSAnS2V5RCcpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbihudWxsKTtcclxuXHRcdGVsc2UgcGxheWVyMmQuc2V0U3RyYWZlRGlyKG51bGwpO1xyXG5cdH0gZWxzZSBpZiAoZS5jb2RlID09PSAnS2V5VycgfHwgZS5jb2RlID09PSAnS2V5UycpIHtcclxuXHRcdHBsYXllcjJkLnNldE1vdmVEaXIobnVsbCk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlNJykge1xyXG5cdFx0ZGV2TW9kZSA9ICFkZXZNb2RlO1xyXG5cdFx0aWYgKCFkZXZNb2RlKSB7XHJcblx0XHRcdHdvcmxkMmQuY2xhc3NMaXN0LmFkZCgnZnVsbHNjcmVlbicpO1xyXG5cdFx0XHR3b3JsZDNkLmNsYXNzTGlzdC5hZGQoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0cGxheWVyMmQuZGV2TW9kZSA9IGZhbHNlO1xyXG5cdFx0XHR3YWxsczJkLmRldk1vZGUgPSBmYWxzZTtcclxuXHRcdFx0d29ybGQzZC5yZXF1ZXN0UG9pbnRlckxvY2sgPVxyXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0XHRcdHdvcmxkM2QucmVxdWVzdFBvaW50ZXJMb2NrIHx8IHdvcmxkM2QubW96UmVxdWVzdFBvaW50ZXJMb2NrIHx8IHdvcmxkM2Qud2Via2l0UmVxdWVzdFBvaW50ZXJMb2NrO1xyXG5cdFx0XHQvL0B0cy1pZ25vcmVcclxuXHRcdFx0d29ybGQzZC5yZXF1ZXN0UG9pbnRlckxvY2soe1xyXG5cdFx0XHRcdHVuYWRqdXN0ZWRNb3ZlbWVudDogdHJ1ZSxcclxuXHRcdFx0fSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR3b3JsZDJkLmNsYXNzTGlzdC5yZW1vdmUoJ2Z1bGxzY3JlZW4nKTtcclxuXHRcdFx0d29ybGQzZC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdHBsYXllcjJkLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0XHR3YWxsczJkLmRldk1vZGUgPSB0cnVlO1xyXG5cdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2sgPVxyXG5cdFx0XHRcdC8vQHRzLWlnbm9yZVxyXG5cdFx0XHRcdGRvY3VtZW50LmV4aXRQb2ludGVyTG9jayB8fCBkb2N1bWVudC5tb3pFeGl0UG9pbnRlckxvY2sgfHwgZG9jdW1lbnQud2Via2l0RXhpdFBvaW50ZXJMb2NrO1xyXG5cdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCAoKSA9PiB7XHJcblx0Y29uc29sZS5sb2coJ1VzZXIgY29ubmVjdGVkJyk7XHJcbn0pO1xyXG5cclxuc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBldmVudCA9PiB7XHJcblx0Y29uc3QgcmVzOiBJU29ja2V0RGF0YVJlcyA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcblx0bGV0IGRhdGE6IElTb2NrZXREYXRhUmVxO1xyXG5cclxuXHRzd2l0Y2ggKHJlcz8uYWN0aW9uKSB7XHJcblx0XHRjYXNlICdzZXQtdXNlci1pZCc6XHJcblx0XHRcdGNvbnNvbGUubG9nKCdVc2VySWQgaGFzIGJlZW4gc2V0Jyk7XHJcblx0XHRcdHVzZXJJZCA9IHJlcy5kYXRhO1xyXG5cclxuXHRcdFx0aWYgKCF1c2VySWQpIHJldHVybjtcclxuXHRcdFx0ZGF0YSA9IHtcclxuXHRcdFx0XHRhY3Rpb246ICdzZW5kLXVzZXItdG8tY2xpZW50cycsXHJcblx0XHRcdFx0aWQ6IHVzZXJJZCxcclxuXHRcdFx0XHRkYXRhOiAnJyxcclxuXHRcdFx0fTtcclxuXHRcdFx0c29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3NlbmQtdXNlci10by1jbGllbnRzJzpcclxuXHRcdFx0cGxheWVycy5hZGRQbGF5ZXIocmVzLmRhdGEpO1xyXG5cclxuXHRcdFx0Ly8gaWYgKCF1c2VySWQpIHJldHVybjtcclxuXHRcdFx0Ly8gZGF0YSA9IHtcclxuXHRcdFx0Ly8gXHRhY3Rpb246ICdzZW5kLXVzZXItdG8tY2xpZW50cycsXHJcblx0XHRcdC8vIFx0aWQ6IHVzZXJJZCxcclxuXHRcdFx0Ly8gXHRkYXRhOiAnJyxcclxuXHRcdFx0Ly8gfTtcclxuXHRcdFx0Ly8gc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdGNhc2UgJ3VwZGF0ZS1wbGF5ZXItcG9zJzpcclxuXHRcdFx0cGxheWVycy51cGRhdGVQbGF5ZXJQb3MoeyBuYW1lOiByZXMuZGF0YS5wbGF5ZXJJZCwgeDogcmVzLmRhdGEueCwgeTogcmVzLmRhdGEueSB9KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRjYXNlICdyZW1vdmUtcGxheWVyJzpcclxuXHRcdFx0cGxheWVycy5yZW1vdmVQbGF5ZXIocmVzLmRhdGEpO1xyXG5cdFx0XHRicmVhaztcclxuXHR9XHJcbn0pO1xyXG4iLCJpbXBvcnQgeyBJUGxheWVyLCBJUGxheWVyUmF5cyB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHByaXZhdGUgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHJpdmF0ZSB3YWxsQ29sczogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxXOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsSDogbnVtYmVyO1xyXG5cdHByaXZhdGUgZnJhbWVSYXRlOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBzcGVlZE11bHRpcGxpZXI6IG51bWJlcjtcclxuXHRwdWJsaWMgcmF5czogRmxvYXQzMkFycmF5IHwgbnVsbDtcclxuXHRwdWJsaWMgcmF5Q29vcmRzOiBGbG9hdDMyQXJyYXkgfCBudWxsO1xyXG5cdHB1YmxpYyBvYmplY3RUeXBlczogVWludDhBcnJheSB8IG51bGw7XHJcblx0cHVibGljIG9iamVjdERpcnM6IFVpbnQ4QXJyYXkgfCBudWxsO1xyXG5cdHB1YmxpYyBleHRyYVJheToge1xyXG5cdFx0YW5nOiBudW1iZXI7XHJcblx0XHRsOiBudW1iZXI7XHJcblx0XHRjb29yZHM6IG51bWJlcltdO1xyXG5cdFx0b2JqVHlwZTogbnVtYmVyO1xyXG5cdFx0b2JqRGlyOiBudW1iZXI7XHJcblx0fTtcclxuXHRwcml2YXRlIHJheUluY3JlbWVudDogbnVtYmVyO1xyXG5cdHByaXZhdGUgcmF5T3BhY2l0eTogbnVtYmVyO1xyXG5cdHByaXZhdGUgZm92OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBmb3ZSYWQ6IG51bWJlcjtcclxuXHRwdWJsaWMgcm90YXRpb246IG51bWJlcjtcclxuXHRwcml2YXRlIGFuZ2xlOiBudW1iZXI7XHJcblx0cHVibGljIGRpc3RUb1Byb2plY3Rpb25QbGFuZTogbnVtYmVyO1xyXG5cdHB1YmxpYyByYXlBbmdsZXM6IEZsb2F0MzJBcnJheSB8IG51bGw7XHJcblx0cHJpdmF0ZSByYXlEZW5zaXR5QWRqdXN0bWVudDogbnVtYmVyO1xyXG5cdHB1YmxpYyByb3REaXI6IHN0cmluZyB8IG51bGw7XHJcblx0cHVibGljIHJvdEFtdDogbnVtYmVyO1xyXG5cdHByaXZhdGUgbW92ZURpckZCOiBzdHJpbmcgfCBudWxsO1xyXG5cdHByaXZhdGUgbW92ZUFtdFN0YXJ0OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBtb3ZlQW10OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBtb3ZlQW10VG9wOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBtb3ZlRGlyU3RyYWZlOiBzdHJpbmcgfCBudWxsO1xyXG5cdHByaXZhdGUgbW92ZURpclJheXM6IHtcclxuXHRcdGZvcmV3YXJkOiBudW1iZXI7XHJcblx0XHRsZWZ0OiBudW1iZXI7XHJcblx0XHRyaWdodDogbnVtYmVyO1xyXG5cdFx0YmFja3dhcmQ6IG51bWJlcjtcclxuXHR9O1xyXG5cdHB1YmxpYyBwbGF5ZXJYOiBudW1iZXI7XHJcblx0cHVibGljIHBsYXllclk6IG51bWJlcjtcclxuXHRwdWJsaWMgZGV2TW9kZTogYm9vbGVhbjtcclxuXHRwdWJsaWMgcGxheWVyUmF5czogSVBsYXllclJheXNbXTtcclxuXHRwdWJsaWMgcGxheWVyVzogbnVtYmVyO1xyXG5cdHByaXZhdGUgcmVuZGVyRGlzdDogbnVtYmVyO1xyXG5cdHByaXZhdGUgcGxheWVyQ29sbGlzaW9uTWFyZ2luOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKFxyXG5cdFx0d29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsXHJcblx0XHRjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG5cdFx0d2FsbHM6IFVpbnQ4QXJyYXksXHJcblx0XHR3YWxsQ29sczogbnVtYmVyLFxyXG5cdFx0d2FsbFJvd3M6IG51bWJlcixcclxuXHRcdHdhbGxXOiBudW1iZXIsXHJcblx0XHR3YWxsSDogbnVtYmVyLFxyXG5cdFx0ZnJhbWVSYXRlOiBudW1iZXJcclxuXHQpIHtcclxuXHRcdHRoaXMud29ybGQyZCA9IHdvcmxkMmQ7XHJcblx0XHR0aGlzLmN0eDJkID0gY3R4MmQ7XHJcblx0XHR0aGlzLndhbGxzID0gd2FsbHM7XHJcblx0XHR0aGlzLndhbGxDb2xzID0gd2FsbENvbHM7XHJcblx0XHR0aGlzLndhbGxSb3dzID0gd2FsbFJvd3M7XHJcblx0XHR0aGlzLndhbGxXID0gd2FsbFc7XHJcblx0XHR0aGlzLndhbGxIID0gd2FsbEg7XHJcblx0XHR0aGlzLmZyYW1lUmF0ZSA9IGZyYW1lUmF0ZTtcclxuXHRcdHRoaXMuc3BlZWRNdWx0aXBsaWVyID0gZnJhbWVSYXRlIC8gNjA7XHJcblx0XHR0aGlzLnJheXMgPSBudWxsO1xyXG5cdFx0dGhpcy5yYXlDb29yZHMgPSBudWxsO1xyXG5cdFx0dGhpcy5vYmplY3RUeXBlcyA9IG51bGw7XHJcblx0XHR0aGlzLm9iamVjdERpcnMgPSBudWxsO1xyXG5cdFx0dGhpcy5leHRyYVJheSA9IHtcclxuXHRcdFx0YW5nOiAwLFxyXG5cdFx0XHRsOiAwLFxyXG5cdFx0XHRjb29yZHM6IFtdLFxyXG5cdFx0XHRvYmpUeXBlOiAwLFxyXG5cdFx0XHRvYmpEaXI6IDAsXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5yYXlJbmNyZW1lbnQgPSAyO1xyXG5cdFx0dGhpcy5yYXlPcGFjaXR5ID0gMC4yNjtcclxuXHRcdHRoaXMuZm92ID0gNjA7XHJcblx0XHR0aGlzLmZvdlJhZCA9IHRoaXMuZm92ICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0dGhpcy5yb3RhdGlvbiA9IDMwMDtcclxuXHRcdHRoaXMuYW5nbGUgPSB0aGlzLnJvdGF0aW9uICsgOTA7XHJcblx0XHR0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSA9IHdvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHRcdHRoaXMucmF5QW5nbGVzID0gbnVsbDtcclxuXHRcdHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnQgPSAxMDtcclxuXHRcdHRoaXMucm90RGlyID0gbnVsbDtcclxuXHRcdHRoaXMucm90QW10ID0gMiAvIHRoaXMuc3BlZWRNdWx0aXBsaWVyO1xyXG5cdFx0dGhpcy5tb3ZlRGlyRkIgPSBudWxsO1xyXG5cdFx0dGhpcy5tb3ZlQW10U3RhcnQgPSAzIC8gdGhpcy5zcGVlZE11bHRpcGxpZXI7XHJcblx0XHR0aGlzLm1vdmVBbXQgPSAzIC8gdGhpcy5zcGVlZE11bHRpcGxpZXI7XHJcblx0XHR0aGlzLm1vdmVBbXRUb3AgPSAzIC8gdGhpcy5zcGVlZE11bHRpcGxpZXI7XHJcblx0XHR0aGlzLm1vdmVEaXJTdHJhZmUgPSBudWxsO1xyXG5cdFx0dGhpcy5tb3ZlRGlyUmF5cyA9IHtcclxuXHRcdFx0Zm9yZXdhcmQ6IEluZmluaXR5LFxyXG5cdFx0XHRsZWZ0OiBJbmZpbml0eSxcclxuXHRcdFx0cmlnaHQ6IEluZmluaXR5LFxyXG5cdFx0XHRiYWNrd2FyZDogSW5maW5pdHksXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5wbGF5ZXJYID0gMjAwO1xyXG5cdFx0dGhpcy5wbGF5ZXJZID0gMjAwO1xyXG5cdFx0dGhpcy5kZXZNb2RlID0gdHJ1ZTtcclxuXHRcdHRoaXMucGxheWVyUmF5cyA9IFtdO1xyXG5cdFx0dGhpcy5wbGF5ZXJXID0gMjA7XHJcblx0XHR0aGlzLnJlbmRlckRpc3QgPSA4MDA7XHJcblx0XHR0aGlzLnBsYXllckNvbGxpc2lvbk1hcmdpbiA9IDIwO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFVwKCkge1xyXG5cdFx0dGhpcy5zZXRBbmdsZXMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRSb3RhdGlvbihkaXI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdC8vIGlmICh0aGlzLnJvdERpciA9PT0gbnVsbCkge1xyXG5cdFx0Ly8gXHR0aGlzLnJvdEFtdCA9IDI7XHJcblx0XHQvLyB9XHJcblx0XHR0aGlzLnJvdERpciA9IGRpcjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRNb3VzZVJvdGF0aW9uKGFtdDogbnVtYmVyKSB7XHJcblx0XHR0aGlzLnJvdGF0aW9uICs9IGFtdDtcclxuXHRcdHRoaXMuYW5nbGUgKz0gYW10O1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFN0cmFmZURpcihkaXI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdGlmICh0aGlzLm1vdmVEaXJTdHJhZmUgPT09IG51bGwpIHtcclxuXHRcdFx0dGhpcy5tb3ZlQW10ID0gdGhpcy5tb3ZlQW10U3RhcnQ7XHJcblx0XHR9XHJcblx0XHR0aGlzLm1vdmVEaXJTdHJhZmUgPSBkaXI7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHJvdGF0ZSgpIHtcclxuXHRcdC8vIGlmICh0aGlzLnJvdEFtdCA8IHRoaXMucm90QW10KSB7XHJcblx0XHQvLyBcdHRoaXMucm90QW10ICs9IDAuMTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHRpZiAodGhpcy5yb3REaXIgPT09ICdsZWZ0Jykge1xyXG5cdFx0XHR0aGlzLnJvdGF0aW9uIC09IHRoaXMucm90QW10O1xyXG5cdFx0XHR0aGlzLmFuZ2xlIC09IHRoaXMucm90QW10O1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnJvdERpciA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0XHR0aGlzLnJvdGF0aW9uICs9IHRoaXMucm90QW10O1xyXG5cdFx0XHR0aGlzLmFuZ2xlICs9IHRoaXMucm90QW10O1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldE1vdmVEaXIoZGlyOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHRpZiAodGhpcy5tb3ZlRGlyRkIgPT09IG51bGwpIHtcclxuXHRcdFx0dGhpcy5tb3ZlQW10ID0gdGhpcy5tb3ZlQW10U3RhcnQ7XHJcblx0XHR9XHJcblx0XHR0aGlzLm1vdmVEaXJGQiA9IGRpcjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgbW92ZSgpIHtcclxuXHRcdGlmICghdGhpcz8ucmF5cz8ubGVuZ3RoKSByZXR1cm47XHJcblx0XHR0aGlzLnJvdGF0ZSgpO1xyXG5cclxuXHRcdGlmICh0aGlzLm1vdmVBbXQgPCB0aGlzLm1vdmVBbXRUb3ApIHRoaXMubW92ZUFtdCArPSAwLjA1O1xyXG5cclxuXHRcdGNvbnN0IGRpclJhZGlhbnMgPSB0aGlzLmFuZ2xlICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0Y29uc3QgbW92ZVggPSB0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyg5MCAqIChNYXRoLlBJIC8gMTgwKSAtIGRpclJhZGlhbnMpO1xyXG5cdFx0Y29uc3QgbW92ZVkgPSB0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyhkaXJSYWRpYW5zKTtcclxuXHRcdGNvbnN0IGRpclJhZGlhbnNTdHJhZmUgPSBkaXJSYWRpYW5zICsgTWF0aC5QSSAvIDI7XHJcblx0XHRjb25zdCBzdHJhZmVYID0gKHRoaXMubW92ZUFtdCAqIE1hdGguY29zKDkwICogKE1hdGguUEkgLyAxODApIC0gZGlyUmFkaWFuc1N0cmFmZSkpIC8gMjtcclxuXHRcdGNvbnN0IHN0cmFmZVkgPSAodGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoZGlyUmFkaWFuc1N0cmFmZSkpIC8gMjtcclxuXHRcdGNvbnN0IGhpdHRpbmdGID0gdGhpcy5tb3ZlRGlyUmF5cy5mb3Jld2FyZCA8IHRoaXMucGxheWVyQ29sbGlzaW9uTWFyZ2luO1xyXG5cdFx0Y29uc3QgaGl0dGluZ0wgPSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPCB0aGlzLnBsYXllckNvbGxpc2lvbk1hcmdpbjtcclxuXHRcdGNvbnN0IGhpdHRpbmdSID0gdGhpcy5tb3ZlRGlyUmF5cy5yaWdodCA8IHRoaXMucGxheWVyQ29sbGlzaW9uTWFyZ2luO1xyXG5cdFx0Y29uc3QgaGl0dGluZ0IgPSB0aGlzLm1vdmVEaXJSYXlzLmJhY2t3YXJkIDwgdGhpcy5wbGF5ZXJDb2xsaXNpb25NYXJnaW47XHJcblxyXG5cdFx0aWYgKHRoaXMubW92ZURpckZCID09PSAnZm9yd2FyZHMnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0YpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gbW92ZVg7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IG1vdmVZO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMubW92ZURpckZCID09PSAnYmFja3dhcmRzJykge1xyXG5cdFx0XHRpZiAoIWhpdHRpbmdCKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJYIC09IG1vdmVYO1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWSArPSBtb3ZlWTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubW92ZURpclN0cmFmZSA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0wpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggLT0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdMKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZICs9IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5tb3ZlRGlyU3RyYWZlID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ1IpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdSKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc2V0QW5nbGVzKCkge1xyXG5cdFx0Y29uc3QgYW5nbGVBcnJMZW5ndGggPSBNYXRoLmNlaWwoXHJcblx0XHRcdCh0aGlzLndvcmxkMmQud2lkdGggKyB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50KSAvIHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnRcclxuXHRcdCk7XHJcblx0XHR0aGlzLnJheUFuZ2xlcyA9IG5ldyBGbG9hdDMyQXJyYXkoYW5nbGVBcnJMZW5ndGgpO1xyXG5cdFx0dGhpcy5kaXN0VG9Qcm9qZWN0aW9uUGxhbmUgPSB0aGlzLndvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHJcblx0XHRsZXQgeCA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFuZ2xlQXJyTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy5yYXlBbmdsZXNbaV0gPSBNYXRoLmF0YW4oKHggLSB0aGlzLndvcmxkMmQud2lkdGggLyAyKSAvIHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lKTtcclxuXHRcdFx0eCArPSB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZXh0cmFSYXkuYW5nID0gTWF0aC5hdGFuKCh4IC0gdGhpcy53b3JsZDJkLndpZHRoIC8gMikgLyB0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSk7XHJcblxyXG5cdFx0dGhpcy5yYXlzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGgpO1xyXG5cdFx0dGhpcy5yYXlDb29yZHMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCAqIDIpO1xyXG5cdFx0dGhpcy5vYmplY3RUeXBlcyA9IG5ldyBVaW50OEFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCk7XHJcblx0XHR0aGlzLm9iamVjdERpcnMgPSBuZXcgVWludDhBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGgpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRJbnRlcnNlY3Rpb24gPSAoXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHRyOiBudW1iZXIsXHJcblx0XHR0aGV0YTogbnVtYmVyLFxyXG5cdFx0eDE6IG51bWJlcixcclxuXHRcdHkxOiBudW1iZXIsXHJcblx0XHR4MjogbnVtYmVyLFxyXG5cdFx0eTI6IG51bWJlcixcclxuXHRcdHA0PzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9XHJcblx0KSA9PiB7XHJcblx0XHRjb25zdCB4MyA9IHg7XHJcblx0XHRjb25zdCB5MyA9IHk7XHJcblx0XHRsZXQgeDQ7XHJcblx0XHRsZXQgeTQ7XHJcblx0XHRsZXQgdU1heCA9IEluZmluaXR5O1xyXG5cdFx0aWYgKHA0Py54ICYmIHA0Py55KSB7XHJcblx0XHRcdHg0ID0gcDQueDtcclxuXHRcdFx0eTQgPSBwNC55O1xyXG5cdFx0XHR1TWF4ID0gMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHg0ID0geCArIHIgKiBNYXRoLmNvcyh0aGV0YSk7XHJcblx0XHRcdHk0ID0geSArIHIgKiBNYXRoLnNpbih0aGV0YSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3QgZGVub20gPSAoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCk7XHJcblxyXG5cdFx0aWYgKGRlbm9tID09IDApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgdCA9ICgoeDEgLSB4MykgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MykgKiAoeDMgLSB4NCkpIC8gZGVub207XHJcblx0XHRjb25zdCB1ID0gKCh4MSAtIHgzKSAqICh5MSAtIHkyKSAtICh5MSAtIHkzKSAqICh4MSAtIHgyKSkgLyBkZW5vbTtcclxuXHRcdGlmICh0ID49IDAgJiYgdCA8PSAxICYmIHUgPj0gMCAmJiB1IDw9IHVNYXgpIHtcclxuXHRcdFx0Y29uc3QgcHggPSB4MyArIHUgKiAoeDQgLSB4Myk7XHJcblx0XHRcdGNvbnN0IHB5ID0geTMgKyB1ICogKHk0IC0geTMpO1xyXG5cdFx0XHRyZXR1cm4gW3B4LCBweV07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0cHJpdmF0ZSBnZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChcclxuXHRcdGo6IG51bWJlcixcclxuXHRcdGs6IG51bWJlcixcclxuXHRcdHg6IG51bWJlcixcclxuXHRcdHk6IG51bWJlcixcclxuXHRcdGFkanVzdGVkQW5nbGU6IG51bWJlcixcclxuXHRcdHA0PzogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9XHJcblx0KSB7XHJcblx0XHRpZiAoIXRoaXMucmF5QW5nbGVzKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cmVjb3JkOiBJbmZpbml0eSxcclxuXHRcdFx0XHRjbG9zZXN0OiBudWxsLFxyXG5cdFx0XHRcdGRpcjogMCxcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHIgPSAxO1xyXG5cclxuXHRcdC8vIFRlc3QgdG8gc2VlIGlmIHRoZSByYXkgd2lsbCBpbnRlcnNlY3Qgd2l0aCB0aGUgYmxvY2sgYXQgYWxsIGJlZm9yZSBjaGVja2luZyBhbGwgNCBzaWRlc1xyXG5cdFx0Ly8gY29uc3QgeE1pZCA9IGsgKiB0aGlzLndhbGxXICsgdGhpcy53YWxsVyAvIDI7XHJcblx0XHQvLyBjb25zdCB5TWlkID0gaiAqIHRoaXMud2FsbEggKyB0aGlzLndhbGxIIC8gMjtcclxuXHRcdC8vIGNvbnN0IGRlbHRhRCA9IHRoaXMud2FsbFcgKiBNYXRoLnNxcnQoMik7XHJcblx0XHQvLyBjb25zdCBzbG9wZSA9ICh5TWlkIC0geSkgLyAoeE1pZCAtIHgpO1xyXG5cdFx0Ly8gY29uc3QgcGVycFNsb3BlID0gLSgxIC8gc2xvcGUpO1xyXG5cdFx0Ly8gY29uc3QgYW5nbGUgPSBNYXRoLmF0YW4ocGVycFNsb3BlKTtcclxuXHJcblx0XHQvLyBjb25zdCB4TWlkMSA9IHhNaWQgKyBkZWx0YUQgKiBNYXRoLmNvcyhhbmdsZSk7XHJcblx0XHQvLyBjb25zdCB5TWlkMSA9IHlNaWQgKyBkZWx0YUQgKiBNYXRoLnNpbihhbmdsZSk7XHJcblx0XHQvLyBjb25zdCB4TWlkMiA9IHhNaWQgLSBkZWx0YUQgKiBNYXRoLmNvcyhhbmdsZSk7XHJcblx0XHQvLyBjb25zdCB5TWlkMiA9IHlNaWQgLSBkZWx0YUQgKiBNYXRoLnNpbihhbmdsZSk7XHJcblxyXG5cdFx0Ly8gY29uc3QgaW50ZXJzZWN0aW9uID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgYWRqdXN0ZWRBbmdsZSwgeE1pZDEsIHlNaWQxLCB4TWlkMiwgeU1pZDIpO1xyXG5cdFx0Ly8gaWYgKCFpbnRlcnNlY3Rpb24pIHtcclxuXHRcdC8vIFx0cmV0dXJuIHtcclxuXHRcdC8vIFx0XHRyZWNvcmQ6IEluZmluaXR5LFxyXG5cdFx0Ly8gXHRcdGNsb3Nlc3Q6IG51bGwsXHJcblx0XHQvLyBcdFx0ZGlyOiAwLFxyXG5cdFx0Ly8gXHR9O1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdGNvbnN0IHgxID0gayAqIHRoaXMud2FsbFc7XHJcblx0XHRjb25zdCB5MSA9IGogKiB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGNvbnN0IHgyID0geDEgKyB0aGlzLndhbGxXO1xyXG5cdFx0Y29uc3QgeTIgPSB5MTtcclxuXHJcblx0XHRjb25zdCB4MyA9IHgxICsgdGhpcy53YWxsVztcclxuXHRcdGNvbnN0IHkzID0geTEgKyB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGNvbnN0IHg0ID0geDE7XHJcblx0XHRjb25zdCB5NCA9IHkxICsgdGhpcy53YWxsSDtcclxuXHJcblx0XHRsZXQgcmVjb3JkID0gSW5maW5pdHk7XHJcblx0XHRsZXQgY2xvc2VzdCA9IG51bGw7XHJcblx0XHRsZXQgZGlyID0gMDtcclxuXHJcblx0XHRsZXQgd1gxID0gMDtcclxuXHRcdGxldCB3WTEgPSAwO1xyXG5cdFx0bGV0IHdYMiA9IDA7XHJcblx0XHRsZXQgd1kyID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBuID0gMDsgbiA8IDQ7IG4rKykge1xyXG5cdFx0XHRzd2l0Y2ggKG4pIHtcclxuXHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHR3WDEgPSB4MTtcclxuXHRcdFx0XHRcdHdZMSA9IHkxO1xyXG5cdFx0XHRcdFx0d1gyID0geDI7XHJcblx0XHRcdFx0XHR3WTIgPSB5MjtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdHdYMSA9IHgyO1xyXG5cdFx0XHRcdFx0d1kxID0geTI7XHJcblx0XHRcdFx0XHR3WDIgPSB4MztcclxuXHRcdFx0XHRcdHdZMiA9IHkzO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0d1gxID0geDM7XHJcblx0XHRcdFx0XHR3WTEgPSB5MztcclxuXHRcdFx0XHRcdHdYMiA9IHg0O1xyXG5cdFx0XHRcdFx0d1kyID0geTQ7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHR3WDEgPSB4NDtcclxuXHRcdFx0XHRcdHdZMSA9IHk0O1xyXG5cdFx0XHRcdFx0d1gyID0geDE7XHJcblx0XHRcdFx0XHR3WTIgPSB5MTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBpbnRlcnNlY3Rpb24gPSB0aGlzLmdldEludGVyc2VjdGlvbih4LCB5LCByLCBhZGp1c3RlZEFuZ2xlLCB3WDEsIHdZMSwgd1gyLCB3WTIsIHA0KTtcclxuXHRcdFx0aWYgKGludGVyc2VjdGlvbj8uWzBdKSB7XHJcblx0XHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gaW50ZXJzZWN0aW9uWzBdKTtcclxuXHRcdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBpbnRlcnNlY3Rpb25bMV0pO1xyXG5cdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHRcdHJlY29yZCA9IE1hdGgubWluKGQsIHJlY29yZCk7XHJcblx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdCA9IGludGVyc2VjdGlvbjtcclxuXHRcdFx0XHRcdGRpciA9IG47XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0cmVjb3JkLFxyXG5cdFx0XHRjbG9zZXN0LFxyXG5cdFx0XHRkaXIsXHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBnZXRSYXlBbmdsZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKSB7XHJcblx0XHRsZXQgcmF5QW5nID1cclxuXHRcdFx0eDIgLSB4MSA8IDBcclxuXHRcdFx0XHQ/IDI3MCAtIChNYXRoLmF0YW4oKHkyIC0geTEpIC8gLSh4MiAtIHgxKSkgKiAxODApIC8gTWF0aC5QSVxyXG5cdFx0XHRcdDogOTAgKyAoTWF0aC5hdGFuKCh5MiAtIHkxKSAvICh4MiAtIHgxKSkgKiAxODApIC8gTWF0aC5QSTtcclxuXHRcdHJheUFuZyA9ICgoKHJheUFuZyAtIDkwKSAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cclxuXHRcdHJldHVybiByYXlBbmc7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldFBlcmNBY3JTY3JlZW4oXHJcblx0XHR4OiBudW1iZXIsXHJcblx0XHR5OiBudW1iZXIsXHJcblx0XHRweDogbnVtYmVyLFxyXG5cdFx0cHk6IG51bWJlcixcclxuXHRcdHJvdGF0aW9uOiBudW1iZXIsXHJcblx0XHRpc1Nwcml0ZTogYm9vbGVhblxyXG5cdCkge1xyXG5cdFx0Y29uc3QgcmF5QW5nID0gdGhpcy5nZXRSYXlBbmdsZSh4LCB5LCBweCwgcHkpO1xyXG5cclxuXHRcdGxldCByYXlSb3REaWZmID0gcmF5QW5nIC0gcm90YXRpb247XHJcblxyXG5cdFx0aWYgKE1hdGguYWJzKHJheVJvdERpZmYpID4gdGhpcy5mb3YgLyAyKSB7XHJcblx0XHRcdHJheVJvdERpZmYgPSByYXlSb3REaWZmID49IDAgPyByYXlSb3REaWZmIC0gMzYwIDogMzYwICsgcmF5Um90RGlmZjtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBwZXJjQWNyU2NyZWVuID0gcmF5Um90RGlmZiAvIHRoaXMuZm92ICsgMC41O1xyXG5cclxuXHRcdHJldHVybiBwZXJjQWNyU2NyZWVuO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcocGxheWVyczogSVBsYXllcltdKSB7XHJcblx0XHRjb25zdCB4ID0gdGhpcy5wbGF5ZXJYO1xyXG5cdFx0Y29uc3QgeSA9IHRoaXMucGxheWVyWTtcclxuXHJcblx0XHR0aGlzLnBsYXllclJheXMgPSBbXTtcclxuXHJcblx0XHR0aGlzLm1vdmUoKTtcclxuXHJcblx0XHRpZiAoIXRoaXMucmF5QW5nbGVzIHx8ICF0aGlzLnJheXMpIHJldHVybjtcclxuXHRcdGNvbnN0IHJvdGF0aW9uID0gKCh0aGlzLnJvdGF0aW9uICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblxyXG5cdFx0bGV0IG9ialR5cGVUZW1wID0gMDtcclxuXHRcdGxldCBvYmpEaXJUZW1wID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmF5QW5nbGVzLmxlbmd0aCArIDE7IGkrKykge1xyXG5cdFx0XHRsZXQgYWRqdXN0ZWRBbmdsZTtcclxuXHRcdFx0aWYgKGkgPT09IHRoaXMucmF5QW5nbGVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdGFkanVzdGVkQW5nbGUgPSB0aGlzLmV4dHJhUmF5LmFuZyArIHJvdGF0aW9uICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFkanVzdGVkQW5nbGUgPSB0aGlzLnJheUFuZ2xlc1tpXSArIHJvdGF0aW9uICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgY2xvc2VzdCA9IG51bGw7XHJcblx0XHRcdGxldCByZWNvcmQgPSBJbmZpbml0eTtcclxuXHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsUm93czsgaisrKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLndhbGxDb2xzOyBrKyspIHtcclxuXHRcdFx0XHRcdGNvbnN0IHdhbGwgPSB0aGlzLndhbGxzW2ogKiB0aGlzLndhbGxDb2xzICsga107XHJcblx0XHRcdFx0XHRpZiAod2FsbCA9PT0gMCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgcmVjdEludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdFx0XHRkaXI6IG51bWJlcjtcclxuXHRcdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGosIGssIHgsIHksIGFkanVzdGVkQW5nbGUpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChyZWN0SW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZCkge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQgPSByZWN0SW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdCA9IHJlY3RJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHJcblx0XHRcdFx0XHRcdG9ialR5cGVUZW1wID0gd2FsbDtcclxuXHRcdFx0XHRcdFx0b2JqRGlyVGVtcCA9IHJlY3RJbnRlcnNlY3Rpb24uZGlyO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaSA9PT0gdGhpcy5yYXlBbmdsZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0Ly8gSWYgb24gZXh0cmEgcmF5IGFuZ2xlXHJcblx0XHRcdFx0aWYgKGNsb3Nlc3QpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmRldk1vZGUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5tb3ZlVG8oeCwgeSk7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVRvKGNsb3Nlc3RbMF0sIGNsb3Nlc3RbMV0pO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZVN0eWxlID0gYHJnYmEoMCwyNTUsMCwke3RoaXMucmF5T3BhY2l0eSArIDAuMX0pYDtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5saW5lV2lkdGggPSAxO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRoaXMuZXh0cmFSYXkubCA9IHJlY29yZDtcclxuXHRcdFx0XHRcdGlmICh0aGlzLnJheUNvb3Jkcykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmV4dHJhUmF5LmNvb3Jkc1swXSA9IGNsb3Nlc3RbMF07XHJcblx0XHRcdFx0XHRcdHRoaXMuZXh0cmFSYXkuY29vcmRzWzFdID0gY2xvc2VzdFsxXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICh0aGlzLm9iamVjdFR5cGVzKSB0aGlzLmV4dHJhUmF5Lm9ialR5cGUgPSBvYmpUeXBlVGVtcDtcclxuXHRcdFx0XHRcdGlmICh0aGlzLm9iamVjdERpcnMpIHRoaXMuZXh0cmFSYXkub2JqRGlyID0gb2JqRGlyVGVtcDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5leHRyYVJheS5sID0gSW5maW5pdHk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChjbG9zZXN0KSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5kZXZNb2RlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQubW92ZVRvKHgsIHkpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVUbyhjbG9zZXN0WzBdLCBjbG9zZXN0WzFdKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5zdHJva2VTdHlsZSA9IGByZ2JhKDI1NSwyNTUsMjU1LCR7dGhpcy5yYXlPcGFjaXR5fSlgO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5yYXlzW2ldID0gcmVjb3JkO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMucmF5Q29vcmRzKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMucmF5Q29vcmRzW2kgKiAyXSA9IGNsb3Nlc3RbMF07XHJcblx0XHRcdFx0XHRcdHRoaXMucmF5Q29vcmRzW2kgKiAyICsgMV0gPSBjbG9zZXN0WzFdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHRoaXMub2JqZWN0VHlwZXMpIHRoaXMub2JqZWN0VHlwZXNbaV0gPSBvYmpUeXBlVGVtcDtcclxuXHRcdFx0XHRcdGlmICh0aGlzLm9iamVjdERpcnMpIHRoaXMub2JqZWN0RGlyc1tpXSA9IG9iakRpclRlbXA7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMucmF5c1tpXSA9IEluZmluaXR5O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGxvb3AxOiBmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcCA9IHBsYXllcnNbaV07XHJcblx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsUm93czsgaisrKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLndhbGxDb2xzOyBrKyspIHtcclxuXHRcdFx0XHRcdGNvbnN0IHdhbGwgPSB0aGlzLndhbGxzW2ogKiB0aGlzLndhbGxDb2xzICsga107XHJcblx0XHRcdFx0XHRpZiAod2FsbCA9PT0gMCkgY29udGludWU7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgcmVjdEludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdFx0XHRkaXI6IG51bWJlcjtcclxuXHRcdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGosIGssIHgsIHksIDAsIHsgeDogcC54LCB5OiBwLnkgfSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKHJlY3RJbnRlcnNlY3Rpb24/LmNsb3Nlc3Q/LlswXSkgY29udGludWUgbG9vcDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBwLngpO1xyXG5cdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBwLnkpO1xyXG5cdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcblx0XHRcdGNvbnN0IGRlbHRhRCA9IHRoaXMucGxheWVyVyAvIDI7XHJcblx0XHRcdGNvbnN0IHNsb3BlID0gKHAueSAtIHRoaXMucGxheWVyWSkgLyAocC54IC0gdGhpcy5wbGF5ZXJYKTtcclxuXHRcdFx0Y29uc3QgcGVycFNsb3BlID0gLSgxIC8gc2xvcGUpO1xyXG5cdFx0XHRjb25zdCBhbmdsZSA9IE1hdGguYXRhbihwZXJwU2xvcGUpO1xyXG5cdFx0XHRjb25zdCB4MSA9IHAueCArIGRlbHRhRCAqIE1hdGguY29zKGFuZ2xlKTtcclxuXHRcdFx0Y29uc3QgeTEgPSBwLnkgKyBkZWx0YUQgKiBNYXRoLnNpbihhbmdsZSk7XHJcblx0XHRcdGNvbnN0IHgyID0gcC54IC0gZGVsdGFEICogTWF0aC5jb3MoYW5nbGUpO1xyXG5cdFx0XHRjb25zdCB5MiA9IHAueSAtIGRlbHRhRCAqIE1hdGguc2luKGFuZ2xlKTtcclxuXHJcblx0XHRcdGNvbnN0IHBlcmNBY3JTY3JlZW46IG51bWJlciA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCBwLngsIHAueSwgcm90YXRpb24sIGZhbHNlKTtcclxuXHJcblx0XHRcdGNvbnN0IGFuZ2xlRGVnID0gdGhpcy5nZXRSYXlBbmdsZSh4LCB5LCBwLngsIHAueSk7XHJcblx0XHRcdGxldCBwZXJjQWNyU2NyZWVuTDogbnVtYmVyID0gLTE7XHJcblx0XHRcdGxldCBwZXJjQWNyU2NyZWVuUjogbnVtYmVyID0gLTE7XHJcblxyXG5cdFx0XHRpZiAoYW5nbGVEZWcgPj0gMCAmJiBhbmdsZURlZyA8PSAxODApIHtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuTCA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MSwgeTEsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuUiA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MiwgeTIsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuTCA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MiwgeTIsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0XHRwZXJjQWNyU2NyZWVuUiA9IHRoaXMuZ2V0UGVyY0FjclNjcmVlbih4LCB5LCB4MSwgeTEsIHJvdGF0aW9uLCB0cnVlKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKChwZXJjQWNyU2NyZWVuTCA+PSAwICYmIHBlcmNBY3JTY3JlZW5MIDw9IDEpIHx8IChwZXJjQWNyU2NyZWVuUiA+PSAwICYmIHBlcmNBY3JTY3JlZW5SIDw9IDEpKSB7XHJcblx0XHRcdFx0aWYgKHBlcmNBY3JTY3JlZW5MID49IDAgJiYgcGVyY0FjclNjcmVlbkwgPD0gMSAmJiBwZXJjQWNyU2NyZWVuUiA+PSAwICYmIHBlcmNBY3JTY3JlZW5SIDw9IDEpIHtcclxuXHRcdFx0XHRcdGNvbnN0IHBlcmNBY3JTY3JlZW5MdGVtcCA9IHBlcmNBY3JTY3JlZW5MO1xyXG5cdFx0XHRcdFx0cGVyY0FjclNjcmVlbkwgPSBNYXRoLm1pbihwZXJjQWNyU2NyZWVuTCwgcGVyY0FjclNjcmVlblIpO1xyXG5cdFx0XHRcdFx0cGVyY0FjclNjcmVlblIgPSBNYXRoLm1heChwZXJjQWNyU2NyZWVuTHRlbXAsIHBlcmNBY3JTY3JlZW5SKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJSYXlzLnB1c2goe1xyXG5cdFx0XHRcdFx0bDogZCxcclxuXHRcdFx0XHRcdHg6IHAueCxcclxuXHRcdFx0XHRcdHk6IHAueSxcclxuXHRcdFx0XHRcdG5hbWU6IHAubmFtZSxcclxuXHRcdFx0XHRcdHBlcmNBY3Jvc3NTY3JlZW46IHBlcmNBY3JTY3JlZW4sXHJcblx0XHRcdFx0XHRwZXJjQWNyb3NzU2NyZWVuMTogcGVyY0FjclNjcmVlbkwsXHJcblx0XHRcdFx0XHRwZXJjQWNyb3NzU2NyZWVuMjogcGVyY0FjclNjcmVlblIsXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmRldk1vZGUpIHtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLm1vdmVUbyh4LCB5KTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVRvKHAueCwgcC55KTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlU3R5bGUgPSBgcmdiYSgyNTUsMCwwLDEpYDtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQubGluZVdpZHRoID0gMTtcclxuXHRcdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc3Qgcm90YXRpb25GID0gKChNYXRoLlBJIC8gMTgwKSAqICgodGhpcy5yb3RhdGlvbiAlIDM2MCkgKyAzNjApKSAlIDM2MDtcclxuXHRcdGNvbnN0IHJvdGF0aW9uUiA9ICgoTWF0aC5QSSAvIDE4MCkgKiAoKCh0aGlzLnJvdGF0aW9uICsgOTApICUgMzYwKSArIDM2MCkpICUgMzYwO1xyXG5cdFx0Y29uc3Qgcm90YXRpb25CID0gKChNYXRoLlBJIC8gMTgwKSAqICgoKHRoaXMucm90YXRpb24gKyAxODApICUgMzYwKSArIDM2MCkpICUgMzYwO1xyXG5cdFx0Y29uc3Qgcm90YXRpb25MID0gKChNYXRoLlBJIC8gMTgwKSAqICgoKHRoaXMucm90YXRpb24gLSA5MCkgJSAzNjApICsgMzYwKSkgJSAzNjA7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RGID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRGID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RMID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRMID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RSID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRSID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RCID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRCID0gSW5maW5pdHk7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxSb3dzOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxDb2xzOyBqKyspIHtcclxuXHRcdFx0XHRjb25zdCB3YWxsID0gdGhpcy53YWxsc1tpICogdGhpcy53YWxsQ29scyArIGpdO1xyXG5cdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0Y29uc3QgZkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgcm90YXRpb25GKTtcclxuXHRcdFx0XHRpZiAoZkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRGKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRGID0gZkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0RiA9IGZJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IGxJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGksIGosIHgsIHksIHJvdGF0aW9uTCk7XHJcblx0XHRcdFx0aWYgKGxJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkTCkge1xyXG5cdFx0XHRcdFx0cmVjb3JkTCA9IGxJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdEwgPSBsSW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBySW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdGNsb3Nlc3Q6IG51bWJlcltdIHwgbnVsbDtcclxuXHRcdFx0XHR9ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChpLCBqLCB4LCB5LCByb3RhdGlvblIpO1xyXG5cdFx0XHRcdGlmIChySW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZFIpIHtcclxuXHRcdFx0XHRcdHJlY29yZFIgPSBySW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdGNsb3Nlc3RSID0gckludGVyc2VjdGlvbi5jbG9zZXN0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3QgYkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgcm90YXRpb25CKTtcclxuXHRcdFx0XHRpZiAoYkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRCKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRCID0gYkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0QiA9IGJJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY2xvc2VzdEYpIHRoaXMubW92ZURpclJheXMuZm9yZXdhcmQgPSByZWNvcmRGO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RMKSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSByZWNvcmRMO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSBJbmZpbml0eTtcclxuXHJcblx0XHRpZiAoY2xvc2VzdFIpIHRoaXMubW92ZURpclJheXMucmlnaHQgPSByZWNvcmRSO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0ID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RCKSB0aGlzLm1vdmVEaXJSYXlzLmJhY2t3YXJkID0gcmVjb3JkQjtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gYHJnYmEoMCwyNTUsMCwxKWA7XHJcblx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0dGhpcy5jdHgyZC5lbGxpcHNlKHRoaXMucGxheWVyWCwgdGhpcy5wbGF5ZXJZLCA2LCA2LCAwLCAwLCAyICogTWF0aC5QSSk7XHJcblx0XHR0aGlzLmN0eDJkLmZpbGwoKTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgSVBsYXllciB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVycyB7XHJcblx0cHJpdmF0ZSB3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHVibGljIHBsYXllcnM6IElQbGF5ZXJbXTtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMud29ybGQyZCA9IHdvcmxkMmQ7XHJcblx0XHR0aGlzLmN0eDJkID0gY3R4MmQ7XHJcblx0XHR0aGlzLnBsYXllcnMgPSBbXTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhZGRQbGF5ZXIobmFtZTogc3RyaW5nKSB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucGxheWVycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5wbGF5ZXJzW2ldLm5hbWUgPT09IG5hbWUpIHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBsYXllcnMucHVzaCh7XHJcblx0XHRcdG5hbWU6IG5hbWUsXHJcblx0XHRcdHg6IHRoaXMud29ybGQyZC53aWR0aCAvIDIsXHJcblx0XHRcdHk6IHRoaXMud29ybGQyZC5oZWlnaHQgLyAyLFxyXG5cdFx0fSk7XHJcblx0XHRjb25zb2xlLmxvZyhgJHtuYW1lfSBoYXMgam9pbmVkIHRoZSBtYXRjaGApO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlbW92ZVBsYXllcihuYW1lOiBzdHJpbmcpIHtcclxuXHRcdGNvbnNvbGUubG9nKGBQbGF5ZXIgJHtuYW1lfSBoYXMgbGVmdCB0aGUgbWF0Y2hgKTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGlmICh0aGlzLnBsYXllcnNbaV0ubmFtZSA9PT0gbmFtZSkge1xyXG5cdFx0XHRcdHRoaXMucGxheWVycy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyB1cGRhdGVQbGF5ZXJQb3MocDogSVBsYXllcikge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMucGxheWVyc1tpXS5uYW1lID09PSBwLm5hbWUpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllcnNbaV0ueCA9IHAueDtcclxuXHRcdFx0XHR0aGlzLnBsYXllcnNbaV0ueSA9IHAueTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBsYXllcnMucHVzaCh7XHJcblx0XHRcdG5hbWU6IHAubmFtZSxcclxuXHRcdFx0eDogcC54LFxyXG5cdFx0XHR5OiBwLnksXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcCA9IHRoaXMucGxheWVyc1tpXTtcclxuXHJcblx0XHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gJ3JlZCc7XHJcblx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdHRoaXMuY3R4MmQuZWxsaXBzZShwLngsIHAueSwgNiwgNiwgMiAqIE1hdGguUEksIDAsIDIgKiBNYXRoLlBJKTtcclxuXHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxzMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHB1YmxpYyB3YWxsQ29sczogbnVtYmVyO1xyXG5cdHB1YmxpYyB3YWxsUm93czogbnVtYmVyO1xyXG5cdHB1YmxpYyB3YWxsczogVWludDhBcnJheTtcclxuXHRwdWJsaWMgd2FsbFc6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbEg6IG51bWJlcjtcclxuXHRwdWJsaWMgZGV2TW9kZTogYm9vbGVhbjtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMud29ybGQyZCA9IHdvcmxkMmQ7XHJcblx0XHR0aGlzLmN0eDJkID0gY3R4MmQ7XHJcblx0XHR0aGlzLndhbGxDb2xzID0gNjQ7XHJcblx0XHR0aGlzLndhbGxSb3dzID0gMzY7XHJcblx0XHQvLyBwcmV0dGllci1pZ25vcmVcclxuXHRcdHRoaXMud2FsbHMgPSBuZXcgVWludDhBcnJheShcclxuXHRcdFx0W1xyXG5cdFx0XHRcdFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG5cdFx0XHRdLmZsYXQoKVxyXG5cdFx0KTtcclxuXHRcdHRoaXMud2FsbFcgPSB0aGlzLndvcmxkMmQud2lkdGggLyB0aGlzLndhbGxDb2xzO1xyXG5cdFx0dGhpcy53YWxsSCA9IHRoaXMud29ybGQyZC5oZWlnaHQgLyB0aGlzLndhbGxSb3dzO1xyXG5cdFx0dGhpcy5kZXZNb2RlID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KCkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2codGhpcy53YWxscy5sZW5ndGgpO1xyXG5cdFx0aWYgKHRoaXMuZGV2TW9kZSkge1xyXG5cdFx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2FsbFJvd3M7IGkrKykge1xyXG5cdFx0XHRcdGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy53YWxsQ29sczsgaisrKSB7XHJcblx0XHRcdFx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9ICdyZ2IoMTAwLCAxMDAsIDEwMCknO1xyXG5cdFx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaSAqIHRoaXMud2FsbENvbHMgKyBqXTtcclxuXHJcblx0XHRcdFx0XHRzd2l0Y2ggKHdhbGwpIHtcclxuXHRcdFx0XHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnJlY3QoaiAqIHRoaXMud2FsbFcsIGkgKiB0aGlzLndhbGxILCB0aGlzLndhbGxXLCB0aGlzLndhbGxIKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmZpbGwoKTtcclxuXHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5yZWN0KGogKiB0aGlzLndhbGxXLCBpICogdGhpcy53YWxsSCwgdGhpcy53YWxsVywgdGhpcy53YWxsSCk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJpbXBvcnQgeyBJUGxheWVyUmF5cyB9IGZyb20gJy4vdHlwZXMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbHMzZCB7XHJcblx0cHJpdmF0ZSB3b3JsZDNkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDNkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHJpdmF0ZSB3YWxsVzogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbEg6IG51bWJlcjtcclxuXHRwcml2YXRlIHdvcmxkM2REaWFnOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBiZ1RvcFg6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxDZW50ZXJIZWlnaHQ6IG51bWJlcjtcclxuXHRwcml2YXRlIHdNdWx0aXBsaWVyOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB0ZXh0dXJlUGF0aHM6IHN0cmluZ1tdO1xyXG5cdHByaXZhdGUgdGV4dHVyZXM6IGFueTtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQzZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDNkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHdhbGxXOiBudW1iZXIsIHdhbGxIOiBudW1iZXIpIHtcclxuXHRcdHRoaXMud29ybGQzZCA9IHdvcmxkM2Q7XHJcblx0XHR0aGlzLmN0eDNkID0gY3R4M2Q7XHJcblx0XHR0aGlzLndhbGxXID0gd2FsbFc7XHJcblx0XHR0aGlzLndhbGxIID0gd2FsbEg7XHJcblx0XHR0aGlzLndvcmxkM2REaWFnID0gTWF0aC5zcXJ0KE1hdGgucG93KHdvcmxkM2Qud2lkdGgsIDIpICsgTWF0aC5wb3cod29ybGQzZC5oZWlnaHQsIDIpKTtcclxuXHRcdHRoaXMuYmdUb3BYID0gMDtcclxuXHRcdHRoaXMud2FsbENlbnRlckhlaWdodCA9IHRoaXMud29ybGQzZC5oZWlnaHQgLyAyLjU7XHJcblx0XHR0aGlzLndNdWx0aXBsaWVyID0gMDtcclxuXHRcdHRoaXMudGV4dHVyZVBhdGhzID0gWycuLi9wdWJsaWMvd2FsbFRleHR1cmUucG5nJywgJy4uL3B1YmxpYy93YWxsVGV4dHVyZURhcmsucG5nJywgJy4uL3B1YmxpYy9zdGFycy5qcGcnXTtcclxuXHRcdHRoaXMudGV4dHVyZXMgPSB7fTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhc3luYyBzZXRVcCgpIHtcclxuXHRcdGNvbnN0IHByZWxvYWRJbWFnZXMgPSAoKSA9PiB7XHJcblx0XHRcdGNvbnN0IHByb21pc2VzID0gdGhpcy50ZXh0dXJlUGF0aHMubWFwKChwYXRoOiBzdHJpbmcpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRcdFx0Y29uc3QgbmFtZSA9IHBhdGguc3BsaXQoJy8nKS5wb3AoKT8uc3BsaXQoJy4nKVswXTtcclxuXHRcdFx0XHRcdGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0XHRcdFx0aW1hZ2Uuc3JjID0gcGF0aDtcclxuXHRcdFx0XHRcdGltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuXHRcdFx0XHRcdFx0cmVzb2x2ZShbbmFtZSwgaW1hZ2VdKTtcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRpbWFnZS5vbmVycm9yID0gKCkgPT4gcmVqZWN0KGBJbWFnZSBmYWlsZWQgdG8gbG9hZDogJHtwYXRofWApO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKTtcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3QgaW1nQXJyYXl0ZW1wOiBhbnlbXSA9IGF3YWl0IHByZWxvYWRJbWFnZXMoKTtcclxuXHRcdHRoaXMudGV4dHVyZXMgPSBPYmplY3QuZnJvbUVudHJpZXMoaW1nQXJyYXl0ZW1wKTtcclxuXHJcblx0XHR0aGlzLndNdWx0aXBsaWVyID0gTWF0aC5hYnModGhpcy50ZXh0dXJlcy53YWxsVGV4dHVyZS53aWR0aCAvIHRoaXMud2FsbFcpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBkcmF3QmFja2dyb3VuZCgpIHtcclxuXHRcdC8vbXVsdGlwbHkgYmcgaW1nIHdpZHRoIGJ5IDQgc28gd2hlbiB5b3Ugcm90YXRlIDkwZGVnLCB5b3UncmUgMS80dGggdGhyb3VnaCB0aGUgaW1nXHJcblx0XHR0aGlzLnRleHR1cmVzLnN0YXJzLndpZHRoID0gdGhpcy53b3JsZDNkLndpZHRoICogMjtcclxuXHRcdHRoaXMudGV4dHVyZXMuc3RhcnMuaGVpZ2h0ID0gdGhpcy53b3JsZDNkLmhlaWdodDtcclxuXHJcblx0XHQvL3Jlc2V0IGJnIGltZyBwb3NpdGlvbiBpZiBlbmRzIG9mIGltZyBhcmUgaW4gdmlld1xyXG5cdFx0aWYgKHRoaXMuYmdUb3BYID4gMCkge1xyXG5cdFx0XHR0aGlzLmJnVG9wWCA9IC10aGlzLnRleHR1cmVzLnN0YXJzLndpZHRoO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmJnVG9wWCA8IC10aGlzLnRleHR1cmVzLnN0YXJzLndpZHRoKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmN0eDNkLmRyYXdJbWFnZShcclxuXHRcdFx0dGhpcy50ZXh0dXJlcy5zdGFycyxcclxuXHRcdFx0dGhpcy5iZ1RvcFgsXHJcblx0XHRcdHRoaXMud2FsbENlbnRlckhlaWdodCxcclxuXHRcdFx0dGhpcy50ZXh0dXJlcy5zdGFycy53aWR0aCxcclxuXHRcdFx0LXRoaXMudGV4dHVyZXMuc3RhcnMuaGVpZ2h0XHJcblx0XHQpO1xyXG5cdFx0dGhpcy5jdHgzZC5kcmF3SW1hZ2UoXHJcblx0XHRcdHRoaXMudGV4dHVyZXMuc3RhcnMsXHJcblx0XHRcdHRoaXMuYmdUb3BYICsgdGhpcy50ZXh0dXJlcy5zdGFycy53aWR0aCxcclxuXHRcdFx0dGhpcy53YWxsQ2VudGVySGVpZ2h0LFxyXG5cdFx0XHR0aGlzLnRleHR1cmVzLnN0YXJzLndpZHRoLFxyXG5cdFx0XHQtdGhpcy50ZXh0dXJlcy5zdGFycy5oZWlnaHRcclxuXHRcdCk7XHJcblx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKDAsMCwwLDAuNylgO1xyXG5cdFx0dGhpcy5jdHgzZC5maWxsUmVjdCgwLCAwLCB0aGlzLndvcmxkM2Qud2lkdGgsIHRoaXMud2FsbENlbnRlckhlaWdodCk7XHJcblxyXG5cdFx0dGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiKDE1LCAzNSwgMTUpYDtcclxuXHRcdHRoaXMuY3R4M2QuZmlsbFJlY3QoXHJcblx0XHRcdDAsXHJcblx0XHRcdHRoaXMud2FsbENlbnRlckhlaWdodCxcclxuXHRcdFx0dGhpcy53b3JsZDNkLndpZHRoLFxyXG5cdFx0XHR0aGlzLndvcmxkM2QuaGVpZ2h0IC0gdGhpcy53YWxsQ2VudGVySGVpZ2h0XHJcblx0XHQpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldEJnVG9wWE1vdXNlTW92ZShtb3ZlRGVsdGE6IG51bWJlcikge1xyXG5cdFx0dGhpcy5iZ1RvcFggLT0gKCh0aGlzLnRleHR1cmVzLnN0YXJzLndpZHRoIC8gMTgwKSAqIG1vdmVEZWx0YSkgLyAyMDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRiZ1RvcFgocm90QW10OiBudW1iZXIsIG1vdmVEaXJMUjogc3RyaW5nIHwgbnVsbCkge1xyXG5cdFx0Y29uc3QgeERlbHRhID0gKHRoaXMudGV4dHVyZXMuc3RhcnMud2lkdGggLyAxODApICogcm90QW10O1xyXG5cdFx0aWYgKG1vdmVEaXJMUiA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYICs9IHhEZWx0YTtcclxuXHRcdH0gZWxzZSBpZiAobW92ZURpckxSID09PSAncmlnaHQnKSB7XHJcblx0XHRcdHRoaXMuYmdUb3BYIC09IHhEZWx0YTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KFxyXG5cdFx0cmF5czogRmxvYXQzMkFycmF5IHwgbnVsbCxcclxuXHRcdHJheUNvb3JkczogRmxvYXQzMkFycmF5IHwgbnVsbCxcclxuXHRcdG9iamVjdFR5cGVzOiBVaW50OEFycmF5IHwgbnVsbCxcclxuXHRcdG9iamVjdERpcnM6IFVpbnQ4QXJyYXkgfCBudWxsLFxyXG5cdFx0ZXh0cmFSYXk6IHtcclxuXHRcdFx0YW5nOiBudW1iZXI7XHJcblx0XHRcdGw6IG51bWJlcjtcclxuXHRcdFx0Y29vcmRzOiBudW1iZXJbXTtcclxuXHRcdFx0b2JqVHlwZTogbnVtYmVyO1xyXG5cdFx0XHRvYmpEaXI6IG51bWJlcjtcclxuXHRcdH0sXHJcblx0XHRyYXlBbmdsZXM6IEZsb2F0MzJBcnJheSB8IG51bGwsXHJcblx0XHRwbGF5ZXJSYXlzOiBJUGxheWVyUmF5c1tdLFxyXG5cdFx0cGxheWVyVzogbnVtYmVyLFxyXG5cdFx0ZGlzdFRvUHJvamVjdGlvblBsYW5lOiBudW1iZXJcclxuXHQpIHtcclxuXHRcdGlmICghcmF5cyB8fCAhcmF5QW5nbGVzIHx8ICFyYXlDb29yZHMpIHJldHVybjtcclxuXHRcdHRoaXMuZHJhd0JhY2tncm91bmQoKTtcclxuXHJcblx0XHRjb25zdCB3YWxsV2lkdGggPSB0aGlzLndvcmxkM2Qud2lkdGggLyByYXlzLmxlbmd0aDtcclxuXHRcdGNvbnN0IHdhbGxXaWR0aE92ZXJzaXplZCA9IHdhbGxXaWR0aCArIDE7XHJcblx0XHRsZXQgd2FsbFggPSAwO1xyXG5cclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcmF5cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBkaXN0ID0gcmF5c1tpXSAqIE1hdGguY29zKHJheUFuZ2xlc1tpXSk7XHJcblx0XHRcdGxldCBvZmZzZXQgPVxyXG5cdFx0XHRcdG9iamVjdERpcnM/LltpXSA9PT0gMCB8fCBvYmplY3REaXJzPy5baV0gPT09IDJcclxuXHRcdFx0XHRcdD8gcmF5Q29vcmRzW2kgKiAyXSAlIHRoaXMud2FsbFdcclxuXHRcdFx0XHRcdDogcmF5Q29vcmRzW2kgKiAyICsgMV0gJSB0aGlzLndhbGxIO1xyXG5cclxuXHRcdFx0bGV0IG9mZnNldDI6IG51bWJlcjtcclxuXHJcblx0XHRcdGlmIChpID09PSByYXlzLmxlbmd0aCAtIDEpIHtcclxuXHRcdFx0XHRvZmZzZXQyID1cclxuXHRcdFx0XHRcdGV4dHJhUmF5Lm9iakRpciA9PT0gMCB8fCBleHRyYVJheS5vYmpEaXIgPT09IDJcclxuXHRcdFx0XHRcdFx0PyBleHRyYVJheS5jb29yZHNbMF0gJSB0aGlzLndhbGxXXHJcblx0XHRcdFx0XHRcdDogZXh0cmFSYXkuY29vcmRzWzFdICUgdGhpcy53YWxsSDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvZmZzZXQyID1cclxuXHRcdFx0XHRcdG9iamVjdERpcnM/LltpICsgMV0gPT09IDAgfHwgb2JqZWN0RGlycz8uW2kgKyAxXSA9PT0gMlxyXG5cdFx0XHRcdFx0XHQ/IHJheUNvb3Jkc1soaSArIDEpICogMl0gJSB0aGlzLndhbGxXXHJcblx0XHRcdFx0XHRcdDogcmF5Q29vcmRzWyhpICsgMSkgKiAyICsgMV0gJSB0aGlzLndhbGxIO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAob2JqZWN0RGlycz8uW2ldID09PSAwIHx8IG9iamVjdERpcnM/LltpXSA9PT0gMSkge1xyXG5cdFx0XHRcdG9mZnNldCA9IHRoaXMud2FsbFcgLSBvZmZzZXQ7XHJcblx0XHRcdFx0b2Zmc2V0MiA9IHRoaXMud2FsbFcgLSBvZmZzZXQyO1xyXG5cdFx0XHR9XHJcblx0XHRcdG9mZnNldCAqPSB0aGlzLndNdWx0aXBsaWVyO1xyXG5cdFx0XHRvZmZzZXQyICo9IHRoaXMud011bHRpcGxpZXI7XHJcblxyXG5cdFx0XHRjb25zdCB3YWxsSGVpZ2h0ID0gKHRoaXMud2FsbEggLyBkaXN0KSAqIGRpc3RUb1Byb2plY3Rpb25QbGFuZTtcclxuXHRcdFx0Ly8gY29uc3Qgd2FsbEhhbGZIZWlnaHQgPSAodGhpcy53b3JsZDNkLmhlaWdodCAqIDUwKSAvIGRpc3Q7XHJcblx0XHRcdGNvbnN0IHdhbGxIYWxmSGVpZ2h0ID0gd2FsbEhlaWdodCAvIDI7XHJcblx0XHRcdGNvbnN0IHdhbGxTdGFydFRvcCA9IHRoaXMud2FsbENlbnRlckhlaWdodCAtIHdhbGxIYWxmSGVpZ2h0O1xyXG5cdFx0XHRjb25zdCB3YWxsRW5kQm90dG9tID0gdGhpcy53YWxsQ2VudGVySGVpZ2h0ICsgd2FsbEhhbGZIZWlnaHQ7XHJcblxyXG5cdFx0XHQvLyBsZXQgd2FsbERhcmtuZXNzID0gZGlzdCAvIHRoaXMud29ybGQzZC5oZWlnaHQ7XHJcblx0XHRcdC8vIHdhbGxEYXJrbmVzcyA9ICh0aGlzLndvcmxkM2REaWFnIC0gZGlzdCkgLyB0aGlzLndvcmxkM2REaWFnO1xyXG5cclxuXHRcdFx0Ly8gc3dpdGNoIChvYmplY3REaXJzPy5baV0pIHtcclxuXHRcdFx0Ly8gXHRjYXNlIDA6XHJcblx0XHRcdC8vIFx0XHR3YWxsRGFya25lc3MgLT0gMC4yO1xyXG5cdFx0XHQvLyBcdFx0YnJlYWs7XHJcblx0XHRcdC8vIFx0Y2FzZSAyOlxyXG5cdFx0XHQvLyBcdFx0d2FsbERhcmtuZXNzIC09IDAuMjtcclxuXHRcdFx0Ly8gXHRcdGJyZWFrO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHQvLyBzd2l0Y2ggKG9iamVjdFR5cGVzPy5baV0pIHtcclxuXHRcdFx0Ly8gXHRjYXNlIDE6XHJcblx0XHRcdC8vIFx0XHR0aGlzLmN0eDNkLmZpbGxTdHlsZSA9IGByZ2JhKCR7MjU1ICogd2FsbERhcmtuZXNzfSwkezI1NSAqIHdhbGxEYXJrbmVzc30sJHsyNTUgKiB3YWxsRGFya25lc3N9LDEpYDtcclxuXHRcdFx0Ly8gXHRcdGJyZWFrO1xyXG5cdFx0XHQvLyBcdGNhc2UgMjpcclxuXHRcdFx0Ly8gXHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoJHswICogd2FsbERhcmtuZXNzfSwkezEwMCAqIHdhbGxEYXJrbmVzc30sJHsxMDAgKiB3YWxsRGFya25lc3N9LDEpYDtcclxuXHRcdFx0Ly8gXHRcdGJyZWFrO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHQvLyB0aGlzLmN0eDNkLmZpbGxSZWN0KHdhbGxYLCB3YWxsU3RhcnRUb3AsIHdhbGxXaWR0aE92ZXJzaXplZCwgd2FsbEVuZEJvdHRvbSAtIHdhbGxTdGFydFRvcCk7XHJcblxyXG5cdFx0XHRsZXQgY3VySW1nID0gbnVsbDtcclxuXHRcdFx0bGV0IHNXaWR0aCA9IDA7XHJcblx0XHRcdGxldCBjaHVuazJPZmZzZXQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xyXG5cclxuXHRcdFx0c1dpZHRoID0gb2Zmc2V0IDw9IG9mZnNldDIgPyBvZmZzZXQyIC0gb2Zmc2V0IDogdGhpcy50ZXh0dXJlcy53YWxsVGV4dHVyZS53aWR0aCAtIG9mZnNldCArIG9mZnNldDI7XHJcblx0XHRcdGlmIChvZmZzZXQgPiBvZmZzZXQyKSB7XHJcblx0XHRcdFx0Y2h1bmsyT2Zmc2V0ID0gLSh0aGlzLnRleHR1cmVzLndhbGxUZXh0dXJlLndpZHRoIC0gb2Zmc2V0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9iamVjdERpcnM/LltpXSA9PT0gMCB8fCBvYmplY3REaXJzPy5baV0gPT09IDIpIHtcclxuXHRcdFx0XHRjdXJJbWcgPSB0aGlzLnRleHR1cmVzLndhbGxUZXh0dXJlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGN1ckltZyA9IHRoaXMudGV4dHVyZXMud2FsbFRleHR1cmVEYXJrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLmN0eDNkLmRyYXdJbWFnZShcclxuXHRcdFx0XHRjdXJJbWcsXHJcblx0XHRcdFx0b2Zmc2V0LFxyXG5cdFx0XHRcdDAsXHJcblx0XHRcdFx0c1dpZHRoLFxyXG5cdFx0XHRcdGN1ckltZy5oZWlnaHQsXHJcblx0XHRcdFx0d2FsbFgsXHJcblx0XHRcdFx0d2FsbFN0YXJ0VG9wLFxyXG5cdFx0XHRcdHdhbGxXaWR0aE92ZXJzaXplZCxcclxuXHRcdFx0XHR3YWxsRW5kQm90dG9tIC0gd2FsbFN0YXJ0VG9wXHJcblx0XHRcdCk7XHJcblxyXG5cdFx0XHRpZiAoY2h1bmsyT2Zmc2V0KSB7XHJcblx0XHRcdFx0dGhpcy5jdHgzZC5kcmF3SW1hZ2UoXHJcblx0XHRcdFx0XHRjdXJJbWcsXHJcblx0XHRcdFx0XHRjaHVuazJPZmZzZXQsXHJcblx0XHRcdFx0XHQwLFxyXG5cdFx0XHRcdFx0c1dpZHRoLFxyXG5cdFx0XHRcdFx0Y3VySW1nLmhlaWdodCxcclxuXHRcdFx0XHRcdHdhbGxYLFxyXG5cdFx0XHRcdFx0d2FsbFN0YXJ0VG9wLFxyXG5cdFx0XHRcdFx0d2FsbFdpZHRoT3ZlcnNpemVkLFxyXG5cdFx0XHRcdFx0d2FsbEVuZEJvdHRvbSAtIHdhbGxTdGFydFRvcFxyXG5cdFx0XHRcdCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHdhbGxYICs9IHdhbGxXaWR0aDtcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHBsYXllclJheXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgcmF5TCA9IHBsYXllclJheXNbaV0ubDtcclxuXHRcdFx0Y29uc3QgdyA9ICh0aGlzLndvcmxkM2Qud2lkdGggKiBwbGF5ZXJXKSAvIHJheUw7XHJcblx0XHRcdC8vIGxldCB4ID0gcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuICogdGhpcy53b3JsZDNkLndpZHRoO1xyXG5cdFx0XHRsZXQgeDtcclxuXHJcblx0XHRcdGlmIChwbGF5ZXJSYXlzW2ldLnBlcmNBY3Jvc3NTY3JlZW4xID49IDAgJiYgcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuMSA8PSAxKSB7XHJcblx0XHRcdFx0eCA9IHBsYXllclJheXNbaV0ucGVyY0Fjcm9zc1NjcmVlbjEgKiB0aGlzLndvcmxkM2Qud2lkdGggKyB3IC8gMjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR4ID0gcGxheWVyUmF5c1tpXS5wZXJjQWNyb3NzU2NyZWVuMiAqIHRoaXMud29ybGQzZC53aWR0aCAtIHcgLyAyO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgcGxheWVyQ2VudGVySGVpZ2h0ID0gdGhpcy53b3JsZDNkLmhlaWdodCAvIDIuNTtcclxuXHRcdFx0Y29uc3Qgd2FsbFNoaWZ0QW10ID0gKHRoaXMud29ybGQzZC5oZWlnaHQgKiA1MCkgLyByYXlMO1xyXG5cdFx0XHRjb25zdCBwbGF5ZXJTaGlmdEFtdCA9ICh0aGlzLndvcmxkM2QuaGVpZ2h0ICogNDApIC8gcmF5TDtcclxuXHRcdFx0Y29uc3QgYWRqVG9Cb3RBbXQgPSB3YWxsU2hpZnRBbXQgLSBwbGF5ZXJTaGlmdEFtdDtcclxuXHRcdFx0Y29uc3QgcGxheWVyU3RhcnRUb3AgPSBwbGF5ZXJDZW50ZXJIZWlnaHQgLSBwbGF5ZXJTaGlmdEFtdCArIGFkalRvQm90QW10O1xyXG5cdFx0XHRjb25zdCBwbGF5ZXJFbmRCb3R0b20gPSBwbGF5ZXJDZW50ZXJIZWlnaHQgKyBwbGF5ZXJTaGlmdEFtdCArIGFkalRvQm90QW10O1xyXG5cclxuXHRcdFx0bGV0IHdhbGxEYXJrbmVzcyA9IHJheUwgLyB0aGlzLndvcmxkM2QuaGVpZ2h0O1xyXG5cdFx0XHR3YWxsRGFya25lc3MgPSAodGhpcy53b3JsZDNkRGlhZyAtIHJheUwpIC8gdGhpcy53b3JsZDNkRGlhZztcclxuXHJcblx0XHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoJHsyNTUgKiB3YWxsRGFya25lc3N9LCR7MTAwICogd2FsbERhcmtuZXNzfSwkezAgKiB3YWxsRGFya25lc3N9LDEpYDtcclxuXHJcblx0XHRcdHRoaXMuY3R4M2QuZmlsbFJlY3QoeCAtIHcgLyAyLCBwbGF5ZXJTdGFydFRvcCwgdywgcGxheWVyRW5kQm90dG9tIC0gcGxheWVyU3RhcnRUb3ApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wbGF5ZXIyZC50c1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wbGF5ZXJzLnRzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3R5cGVzLnRzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3dhbGxzMmQudHNcIik7XG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy93YWxsczNkLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9