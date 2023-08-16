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
/* harmony import */ var _walls2d__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./walls2d */ "./src/walls2d.ts");
/* harmony import */ var _walls3d__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./walls3d */ "./src/walls3d.ts");



var world2d = document.getElementById('world2d');
var world3d = document.getElementById('world3d');
var ctx2d = world2d.getContext('2d', { alpha: false });
var ctx3d = world3d.getContext('2d', { alpha: false });
var fpsElement = document.getElementById('fpsCounter');
var walls2d;
var walls3d;
var player2d;
var fpsInterval, now, then, elapsed, requestID;
var frameCount = 0;
var frameRate = 75;
var devMode = true;
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
        player2d.draw();
        walls3d.draw(player2d.rays, player2d.objectTypes, player2d.objectDirs, player2d.playerX, player2d.playerY, player2d.rayAngles);
    }
};
var setUp = function () {
    walls2d = new _walls2d__WEBPACK_IMPORTED_MODULE_1__["default"](world2d, ctx2d);
    walls3d = new _walls3d__WEBPACK_IMPORTED_MODULE_2__["default"](world3d, ctx3d, walls2d.wallW, walls2d.wallH);
    player2d = new _player2d__WEBPACK_IMPORTED_MODULE_0__["default"](world2d, ctx2d, walls2d.walls, walls2d.wallCols, walls2d.wallRows, walls2d.wallW, walls2d.wallH);
    player2d.setUp();
    gameLoop();
};
window.onload = function () {
    then = Date.now();
    setUp();
};
document.addEventListener('mousemove', function (e) {
    if (!devMode) {
        player2d.setMouseRotation(e.movementX / 20);
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
        this.getIntersection = function (x, y, r, theta, x1, y1, x2, y2, rot) {
            var adjustedAngle = theta + rot * (Math.PI / 180);
            var x3 = x;
            var y3 = y;
            var x4 = x + r * Math.cos(adjustedAngle);
            var y4 = y + r * Math.sin(adjustedAngle);
            var denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if (denom == 0) {
                return;
            }
            var t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
            var u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;
            if (t > 0 && t < 1 && u > 0) {
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
        this.rayDensityAdjustment = 18;
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
        this.playerX = this.world2d.width / 2;
        this.playerY = this.world2d.height / 2;
        this.devMode = true;
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
    Player2d.prototype.getIntersectionsForRect = function (j, k, x, y, rayAngle, rotation) {
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
                    var intersectionTop = this.getIntersection(x, y, r, rayAngle, x1, y1, x2, y2, rotation);
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
                    var intersectionRight = this.getIntersection(x, y, r, rayAngle, x2, y2, x3, y3, rotation);
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
                    var intersectionBot = this.getIntersection(x, y, r, rayAngle, x3, y3, x4, y4, rotation);
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
                    var intersectionLeft = this.getIntersection(x, y, r, rayAngle, x4, y4, x1, y1, rotation);
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
    Player2d.prototype.draw = function () {
        var x = this.playerX;
        var y = this.playerY;
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
                this.ctx2d.beginPath();
                this.ctx2d.moveTo(x, y);
                this.ctx2d.lineTo(closest[0], closest[1]);
                this.ctx2d.strokeStyle = "rgba(255,255,255,".concat(this.rayOpacity, ")");
                this.ctx2d.lineWidth = 1;
                this.ctx2d.stroke();
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
        this.ctx2d.fillStyle = 'rgb(255, 0, 0)';
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
    };
    return Player2d;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player2d);


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
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
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
    }
    Walls3d.prototype.draw = function (rays, objectTypes, objectDirs, pX, pY, rayAngles) {
        if (!rays || !rayAngles)
            return;
        var wallWidth = this.world3d.width / rays.length;
        var wallWidthOversized = wallWidth + 1;
        var wallX = 0;
        for (var i = 0; i < rays.length; i++) {
            var dist = rays[i] * Math.cos(rayAngles[i]);
            var offset = (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 0 || (objectDirs === null || objectDirs === void 0 ? void 0 : objectDirs[i]) === 2 ? pX / this.wallW : pY / this.wallH;
            var wallShiftAmt = (this.world3d.height * 50) / dist;
            var wallCenterHeight = this.world3d.height / 2.5;
            var wallStartTop = wallCenterHeight - wallShiftAmt;
            var wallEndBottom = wallCenterHeight + wallShiftAmt;
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
/******/ 	__webpack_require__("./src/types.ts");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/walls2d.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxD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QU07YUFDUDtZQUVELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsYUFBYSxHQUFHLFlBQVksQ0FBQyxDQUFDO1lBRTNGLG9CQUFvQjtZQUNwQixxREFBcUQ7WUFDckQseUNBQXlDO1lBQ3pDLDJDQUEyQztZQUUzQyx3QkFBd0I7WUFDeEIscUJBQXFCO1lBQ3JCLFdBQVc7WUFDWCxNQUFNO1lBQ04sMkJBQTJCO1lBQzNCLDRCQUE0QjtZQUM1QixVQUFVO1lBQ1YsaUJBQWlCO1lBQ2pCLGNBQWM7WUFDZCxnQ0FBZ0M7WUFDaEMsS0FBSztZQUVMLEtBQUssSUFBSSxTQUFTLENBQUM7U0FDbkI7SUFDRixDQUFDO0lBQ0YsY0FBQztBQUFELENBQUM7Ozs7Ozs7O1VDcEZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvcGxheWVyMmQudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvd2FsbHMyZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy93YWxsczNkLnRzIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQbGF5ZXIyZCBmcm9tICcuL3BsYXllcjJkJztcclxuaW1wb3J0IFdhbGxzMmQgZnJvbSAnLi93YWxsczJkJztcclxuaW1wb3J0IFdhbGxzM2QgZnJvbSAnLi93YWxsczNkJztcclxuXHJcbmNvbnN0IHdvcmxkMmQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dvcmxkMmQnKTtcclxuY29uc3Qgd29ybGQzZCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd29ybGQzZCcpO1xyXG5cclxuY29uc3QgY3R4MmQgPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPndvcmxkMmQuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcclxuY29uc3QgY3R4M2QgPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPndvcmxkM2QuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcclxuXHJcbmNvbnN0IGZwc0VsZW1lbnQgPSA8SFRNTEhlYWRpbmdFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcHNDb3VudGVyJyk7XHJcblxyXG5sZXQgd2FsbHMyZDogV2FsbHMyZDtcclxubGV0IHdhbGxzM2Q6IFdhbGxzM2Q7XHJcbmxldCBwbGF5ZXIyZDogUGxheWVyMmQ7XHJcblxyXG5sZXQgZnBzSW50ZXJ2YWw6IG51bWJlciwgbm93OiBudW1iZXIsIHRoZW46IG51bWJlciwgZWxhcHNlZDogbnVtYmVyLCByZXF1ZXN0SUQ6IG51bWJlcjtcclxubGV0IGZyYW1lQ291bnQ6IG51bWJlciA9IDA7XHJcbmNvbnN0IGZyYW1lUmF0ZSA9IDc1O1xyXG5cclxubGV0IGRldk1vZGUgPSB0cnVlO1xyXG5cclxuY29uc3Qgc2V0RnJhbWVyYXRlVmFsdWUgPSAoKSA9PiB7XHJcblx0ZnBzRWxlbWVudC5pbm5lclRleHQgPSBmcmFtZUNvdW50LnRvU3RyaW5nKCk7XHJcblx0ZnBzRWxlbWVudC5zdHlsZS5jb2xvciA9IGZyYW1lQ291bnQgPCBmcmFtZVJhdGUgPyAncmVkJyA6ICdyZ2IoMCwgMjU1LCAwKSc7XHJcblx0ZnJhbWVDb3VudCA9IDA7XHJcbn07XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9ICgpID0+IHtcclxuXHRyZXF1ZXN0SUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xyXG5cclxuXHRmcHNJbnRlcnZhbCA9IDEwMDAgLyBmcmFtZVJhdGU7XHJcblxyXG5cdG5vdyA9IERhdGUubm93KCk7XHJcblx0ZWxhcHNlZCA9IG5vdyAtIHRoZW47XHJcblxyXG5cdGlmIChlbGFwc2VkID4gZnBzSW50ZXJ2YWwpIHtcclxuXHRcdGlmIChmcmFtZUNvdW50ID09PSAwKSBzZXRUaW1lb3V0KHNldEZyYW1lcmF0ZVZhbHVlLCAxMDAwKTtcclxuXHRcdGZyYW1lQ291bnQgKz0gMTtcclxuXHRcdHRoZW4gPSBub3cgLSAoZWxhcHNlZCAlIGZwc0ludGVydmFsKTtcclxuXHJcblx0XHRjdHgyZC5jbGVhclJlY3QoMCwgMCwgd29ybGQyZC53aWR0aCwgd29ybGQyZC5oZWlnaHQpO1xyXG5cdFx0Y3R4M2QuY2xlYXJSZWN0KDAsIDAsIHdvcmxkM2Qud2lkdGgsIHdvcmxkM2QuaGVpZ2h0KTtcclxuXHJcblx0XHR3YWxsczJkLmRyYXcoKTtcclxuXHRcdHBsYXllcjJkLmRyYXcoKTtcclxuXHRcdHdhbGxzM2QuZHJhdyhcclxuXHRcdFx0cGxheWVyMmQucmF5cyxcclxuXHRcdFx0cGxheWVyMmQub2JqZWN0VHlwZXMsXHJcblx0XHRcdHBsYXllcjJkLm9iamVjdERpcnMsXHJcblx0XHRcdHBsYXllcjJkLnBsYXllclgsXHJcblx0XHRcdHBsYXllcjJkLnBsYXllclksXHJcblx0XHRcdHBsYXllcjJkLnJheUFuZ2xlc1xyXG5cdFx0KTtcclxuXHR9XHJcbn07XHJcblxyXG5jb25zdCBzZXRVcCA9ICgpID0+IHtcclxuXHR3YWxsczJkID0gbmV3IFdhbGxzMmQod29ybGQyZCwgY3R4MmQpO1xyXG5cdHdhbGxzM2QgPSBuZXcgV2FsbHMzZCh3b3JsZDNkLCBjdHgzZCwgd2FsbHMyZC53YWxsVywgd2FsbHMyZC53YWxsSCk7XHJcblx0cGxheWVyMmQgPSBuZXcgUGxheWVyMmQoXHJcblx0XHR3b3JsZDJkLFxyXG5cdFx0Y3R4MmQsXHJcblx0XHR3YWxsczJkLndhbGxzLFxyXG5cdFx0d2FsbHMyZC53YWxsQ29scyxcclxuXHRcdHdhbGxzMmQud2FsbFJvd3MsXHJcblx0XHR3YWxsczJkLndhbGxXLFxyXG5cdFx0d2FsbHMyZC53YWxsSFxyXG5cdCk7XHJcblx0cGxheWVyMmQuc2V0VXAoKTtcclxuXHRnYW1lTG9vcCgpO1xyXG59O1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuXHR0aGVuID0gRGF0ZS5ub3coKTtcclxuXHRzZXRVcCgpO1xyXG59O1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZSA9PiB7XHJcblx0aWYgKCFkZXZNb2RlKSB7XHJcblx0XHRwbGF5ZXIyZC5zZXRNb3VzZVJvdGF0aW9uKGUubW92ZW1lbnRYIC8gMjApO1xyXG5cdH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XHJcblx0Ly9TZXQgbW92ZSBmb3Jld2FyZHMgYW5kIGJhY2t3YXJkc1xyXG5cdGlmIChlLmNvZGUgPT09ICdLZXlXJykge1xyXG5cdFx0cGxheWVyMmQuc2V0TW92ZURpcignZm9yd2FyZHMnKTtcclxuXHR9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleVMnKSB7XHJcblx0XHRwbGF5ZXIyZC5zZXRNb3ZlRGlyKCdiYWNrd2FyZHMnKTtcclxuXHR9XHJcblxyXG5cdGlmIChlLmNvZGUgPT09ICdLZXlBJykge1xyXG5cdFx0aWYgKGRldk1vZGUpIHBsYXllcjJkLnNldFJvdGF0aW9uKCdsZWZ0Jyk7XHJcblx0XHRlbHNlIHBsYXllcjJkLnNldFN0cmFmZURpcignbGVmdCcpO1xyXG5cdH0gZWxzZSBpZiAoZS5jb2RlID09PSAnS2V5RCcpIHtcclxuXHRcdGlmIChkZXZNb2RlKSBwbGF5ZXIyZC5zZXRSb3RhdGlvbigncmlnaHQnKTtcclxuXHRcdGVsc2UgcGxheWVyMmQuc2V0U3RyYWZlRGlyKCdyaWdodCcpO1xyXG5cdH1cclxufSk7XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIGUgPT4ge1xyXG5cdC8vU2V0IG1vdmVtZW50IHZhcmlhYmxlcyB0byBudWxsIHdoZW4ga2V5IHJlbGVhc2Vke1xyXG5cdGlmIChlLmNvZGUgPT09ICdLZXlBJyB8fCBlLmNvZGUgPT09ICdLZXlEJykge1xyXG5cdFx0aWYgKGRldk1vZGUpIHBsYXllcjJkLnNldFJvdGF0aW9uKG51bGwpO1xyXG5cdFx0ZWxzZSBwbGF5ZXIyZC5zZXRTdHJhZmVEaXIobnVsbCk7XHJcblx0fSBlbHNlIGlmIChlLmNvZGUgPT09ICdLZXlXJyB8fCBlLmNvZGUgPT09ICdLZXlTJykge1xyXG5cdFx0cGxheWVyMmQuc2V0TW92ZURpcihudWxsKTtcclxuXHR9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleU0nKSB7XHJcblx0XHRkZXZNb2RlID0gIWRldk1vZGU7XHJcblx0XHRpZiAoIWRldk1vZGUpIHtcclxuXHRcdFx0d29ybGQyZC5jbGFzc0xpc3QuYWRkKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdHdvcmxkM2QuY2xhc3NMaXN0LmFkZCgnZnVsbHNjcmVlbicpO1xyXG5cdFx0XHRwbGF5ZXIyZC5kZXZNb2RlID0gZmFsc2U7XHJcblx0XHRcdHdvcmxkM2QucmVxdWVzdFBvaW50ZXJMb2NrID1cclxuXHRcdFx0XHQvL0B0cy1pZ25vcmVcclxuXHRcdFx0XHR3b3JsZDNkLnJlcXVlc3RQb2ludGVyTG9jayB8fCB3b3JsZDNkLm1velJlcXVlc3RQb2ludGVyTG9jayB8fCB3b3JsZDNkLndlYmtpdFJlcXVlc3RQb2ludGVyTG9jaztcclxuXHRcdFx0Ly9AdHMtaWdub3JlXHJcblx0XHRcdHdvcmxkM2QucmVxdWVzdFBvaW50ZXJMb2NrKHtcclxuXHRcdFx0XHR1bmFkanVzdGVkTW92ZW1lbnQ6IHRydWUsXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0d29ybGQyZC5jbGFzc0xpc3QucmVtb3ZlKCdmdWxsc2NyZWVuJyk7XHJcblx0XHRcdHdvcmxkM2QuY2xhc3NMaXN0LnJlbW92ZSgnZnVsbHNjcmVlbicpO1xyXG5cdFx0XHRwbGF5ZXIyZC5kZXZNb2RlID0gdHJ1ZTtcclxuXHRcdFx0ZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrID1cclxuXHRcdFx0XHQvL0B0cy1pZ25vcmVcclxuXHRcdFx0XHRkb2N1bWVudC5leGl0UG9pbnRlckxvY2sgfHwgZG9jdW1lbnQubW96RXhpdFBvaW50ZXJMb2NrIHx8IGRvY3VtZW50LndlYmtpdEV4aXRQb2ludGVyTG9jaztcclxuXHRcdFx0ZG9jdW1lbnQuZXhpdFBvaW50ZXJMb2NrKCk7XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHByaXZhdGUgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHJpdmF0ZSB3YWxsQ29sczogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxXOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsSDogbnVtYmVyO1xyXG5cdHB1YmxpYyByYXlzOiBGbG9hdDMyQXJyYXkgfCBudWxsO1xyXG5cdHB1YmxpYyBvYmplY3RUeXBlczogVWludDhBcnJheSB8IG51bGw7XHJcblx0cHVibGljIG9iamVjdERpcnM6IFVpbnQ4QXJyYXkgfCBudWxsO1xyXG5cdHByaXZhdGUgcmF5SW5jcmVtZW50OiBudW1iZXI7XHJcblx0cHJpdmF0ZSByYXlPcGFjaXR5OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBmb3Y6IG51bWJlcjtcclxuXHRwcml2YXRlIGZvdlJhZDogbnVtYmVyO1xyXG5cdHB1YmxpYyByb3RhdGlvbjogbnVtYmVyO1xyXG5cdHByaXZhdGUgYW5nbGU6IG51bWJlcjtcclxuXHRwcml2YXRlIGRpc3RUb1Byb2plY3Rpb25QbGFuZTogbnVtYmVyO1xyXG5cdHB1YmxpYyByYXlBbmdsZXM6IEZsb2F0MzJBcnJheSB8IG51bGw7XHJcblx0cHJpdmF0ZSByYXlEZW5zaXR5QWRqdXN0bWVudDogbnVtYmVyO1xyXG5cdHByaXZhdGUgcm90RGlyOiBzdHJpbmcgfCBudWxsO1xyXG5cdHByaXZhdGUgcm90QW10OiBudW1iZXI7XHJcblx0cHJpdmF0ZSBtb3ZlRGlyRkI6IHN0cmluZyB8IG51bGw7XHJcblx0cHJpdmF0ZSBtb3ZlQW10U3RhcnQ6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVBbXQ6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVBbXRUb3A6IG51bWJlcjtcclxuXHRwcml2YXRlIG1vdmVEaXJTdHJhZmU6IHN0cmluZyB8IG51bGw7XHJcblx0cHJpdmF0ZSBtb3ZlRGlyUmF5czoge1xyXG5cdFx0Zm9yZXdhcmQ6IG51bWJlcjtcclxuXHRcdGxlZnQ6IG51bWJlcjtcclxuXHRcdHJpZ2h0OiBudW1iZXI7XHJcblx0XHRiYWNrd2FyZDogbnVtYmVyO1xyXG5cdH07XHJcblx0cHVibGljIHBsYXllclg6IG51bWJlcjtcclxuXHRwdWJsaWMgcGxheWVyWTogbnVtYmVyO1xyXG5cdHB1YmxpYyBkZXZNb2RlOiBib29sZWFuO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihcclxuXHRcdHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50LFxyXG5cdFx0Y3R4MmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCxcclxuXHRcdHdhbGxzOiBVaW50OEFycmF5LFxyXG5cdFx0d2FsbENvbHM6IG51bWJlcixcclxuXHRcdHdhbGxSb3dzOiBudW1iZXIsXHJcblx0XHR3YWxsVzogbnVtYmVyLFxyXG5cdFx0d2FsbEg6IG51bWJlclxyXG5cdCkge1xyXG5cdFx0dGhpcy53b3JsZDJkID0gd29ybGQyZDtcclxuXHRcdHRoaXMuY3R4MmQgPSBjdHgyZDtcclxuXHRcdHRoaXMud2FsbHMgPSB3YWxscztcclxuXHRcdHRoaXMud2FsbENvbHMgPSB3YWxsQ29scztcclxuXHRcdHRoaXMud2FsbFJvd3MgPSB3YWxsUm93cztcclxuXHRcdHRoaXMud2FsbFcgPSB3YWxsVztcclxuXHRcdHRoaXMud2FsbEggPSB3YWxsSDtcclxuXHRcdHRoaXMucmF5cyA9IG51bGw7XHJcblx0XHR0aGlzLm9iamVjdFR5cGVzID0gbnVsbDtcclxuXHRcdHRoaXMub2JqZWN0RGlycyA9IG51bGw7XHJcblx0XHR0aGlzLnJheUluY3JlbWVudCA9IDI7XHJcblx0XHR0aGlzLnJheU9wYWNpdHkgPSAwLjI2O1xyXG5cdFx0dGhpcy5mb3YgPSA2MDtcclxuXHRcdHRoaXMuZm92UmFkID0gdGhpcy5mb3YgKiAoTWF0aC5QSSAvIDE4MCk7XHJcblx0XHR0aGlzLnJvdGF0aW9uID0gNDU7XHJcblx0XHR0aGlzLmFuZ2xlID0gdGhpcy5yb3RhdGlvbiArIDkwO1xyXG5cdFx0dGhpcy5kaXN0VG9Qcm9qZWN0aW9uUGxhbmUgPSB3b3JsZDJkLndpZHRoIC8gMiAvIE1hdGgudGFuKHRoaXMuZm92UmFkIC8gMik7XHJcblx0XHR0aGlzLnJheUFuZ2xlcyA9IG51bGw7XHJcblx0XHR0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50ID0gMTg7XHJcblx0XHR0aGlzLnJvdERpciA9IG51bGw7XHJcblx0XHR0aGlzLnJvdEFtdCA9IDAuMjtcclxuXHRcdHRoaXMubW92ZURpckZCID0gbnVsbDtcclxuXHRcdHRoaXMubW92ZUFtdFN0YXJ0ID0gMC41O1xyXG5cdFx0dGhpcy5tb3ZlQW10ID0gMjtcclxuXHRcdHRoaXMubW92ZUFtdFRvcCA9IDI7XHJcblx0XHR0aGlzLm1vdmVEaXJTdHJhZmUgPSBudWxsO1xyXG5cdFx0dGhpcy5tb3ZlRGlyUmF5cyA9IHtcclxuXHRcdFx0Zm9yZXdhcmQ6IEluZmluaXR5LFxyXG5cdFx0XHRsZWZ0OiBJbmZpbml0eSxcclxuXHRcdFx0cmlnaHQ6IEluZmluaXR5LFxyXG5cdFx0XHRiYWNrd2FyZDogSW5maW5pdHksXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5wbGF5ZXJYID0gdGhpcy53b3JsZDJkLndpZHRoIC8gMjtcclxuXHRcdHRoaXMucGxheWVyWSA9IHRoaXMud29ybGQyZC5oZWlnaHQgLyAyO1xyXG5cdFx0dGhpcy5kZXZNb2RlID0gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRVcCgpIHtcclxuXHRcdHRoaXMuc2V0QW5nbGVzKCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0Um90YXRpb24oZGlyOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHRpZiAodGhpcy5yb3REaXIgPT09IG51bGwpIHtcclxuXHRcdFx0dGhpcy5yb3RBbXQgPSAyO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5yb3REaXIgPSBkaXI7XHJcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLnJvdEFtdCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc2V0TW91c2VSb3RhdGlvbihhbXQ6IG51bWJlcikge1xyXG5cdFx0dGhpcy5yb3RhdGlvbiArPSBhbXQ7XHJcblx0XHR0aGlzLmFuZ2xlICs9IGFtdDtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRTdHJhZmVEaXIoZGlyOiBzdHJpbmcgfCBudWxsKSB7XHJcblx0XHRpZiAodGhpcy5tb3ZlRGlyU3RyYWZlID09PSBudWxsKSB7XHJcblx0XHRcdHRoaXMubW92ZUFtdCA9IHRoaXMubW92ZUFtdFN0YXJ0O1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5tb3ZlRGlyU3RyYWZlID0gZGlyO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSByb3RhdGUoKSB7XHJcblx0XHQvLyBpZiAodGhpcy5yb3RBbXQgPCB0aGlzLnJvdEFtdCkge1xyXG5cdFx0Ly8gXHR0aGlzLnJvdEFtdCArPSAwLjE7XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0aWYgKHRoaXMucm90RGlyID09PSAnbGVmdCcpIHtcclxuXHRcdFx0dGhpcy5yb3RhdGlvbiAtPSB0aGlzLnJvdEFtdDtcclxuXHRcdFx0dGhpcy5hbmdsZSAtPSB0aGlzLnJvdEFtdDtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5yb3REaXIgPT09ICdyaWdodCcpIHtcclxuXHRcdFx0dGhpcy5yb3RhdGlvbiArPSB0aGlzLnJvdEFtdDtcclxuXHRcdFx0dGhpcy5hbmdsZSArPSB0aGlzLnJvdEFtdDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRNb3ZlRGlyKGRpcjogc3RyaW5nIHwgbnVsbCkge1xyXG5cdFx0aWYgKHRoaXMubW92ZURpckZCID09PSBudWxsKSB7XHJcblx0XHRcdHRoaXMubW92ZUFtdCA9IHRoaXMubW92ZUFtdFN0YXJ0O1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5tb3ZlRGlyRkIgPSBkaXI7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIG1vdmUoKSB7XHJcblx0XHRpZiAoIXRoaXM/LnJheXM/Lmxlbmd0aCkgcmV0dXJuO1xyXG5cdFx0dGhpcy5yb3RhdGUoKTtcclxuXHJcblx0XHRpZiAodGhpcy5tb3ZlQW10IDwgdGhpcy5tb3ZlQW10VG9wKSB0aGlzLm1vdmVBbXQgKz0gMC4wNTtcclxuXHJcblx0XHRjb25zdCBkaXJSYWRpYW5zID0gdGhpcy5hbmdsZSAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdGNvbnN0IG1vdmVYID0gdGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoOTAgKiAoTWF0aC5QSSAvIDE4MCkgLSBkaXJSYWRpYW5zKTtcclxuXHRcdGNvbnN0IG1vdmVZID0gdGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoZGlyUmFkaWFucyk7XHJcblx0XHRjb25zdCBkaXJSYWRpYW5zU3RyYWZlID0gZGlyUmFkaWFucyArIE1hdGguUEkgLyAyO1xyXG5cdFx0Y29uc3Qgc3RyYWZlWCA9ICh0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyg5MCAqIChNYXRoLlBJIC8gMTgwKSAtIGRpclJhZGlhbnNTdHJhZmUpKSAvIDI7XHJcblx0XHRjb25zdCBzdHJhZmVZID0gKHRoaXMubW92ZUFtdCAqIE1hdGguY29zKGRpclJhZGlhbnNTdHJhZmUpKSAvIDI7XHJcblx0XHRjb25zdCBoaXR0aW5nRiA9IHRoaXMubW92ZURpclJheXMuZm9yZXdhcmQgPCA1O1xyXG5cdFx0Y29uc3QgaGl0dGluZ0wgPSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPCA1O1xyXG5cdFx0Y29uc3QgaGl0dGluZ1IgPSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0IDwgNTtcclxuXHRcdGNvbnN0IGhpdHRpbmdCID0gdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA8IDU7XHJcblxyXG5cdFx0aWYgKHRoaXMubW92ZURpckZCID09PSAnZm9yd2FyZHMnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0YpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gbW92ZVg7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IG1vdmVZO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMubW92ZURpckZCID09PSAnYmFja3dhcmRzJykge1xyXG5cdFx0XHRpZiAoIWhpdHRpbmdCKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJYIC09IG1vdmVYO1xyXG5cdFx0XHRcdHRoaXMucGxheWVyWSArPSBtb3ZlWTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubW92ZURpclN0cmFmZSA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ0wpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggLT0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdMKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZICs9IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5tb3ZlRGlyU3RyYWZlID09PSAncmlnaHQnKSB7XHJcblx0XHRcdGlmICghaGl0dGluZ1IpIHtcclxuXHRcdFx0XHR0aGlzLnBsYXllclggKz0gc3RyYWZlWDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoIWhpdHRpbmdSKSB7XHJcblx0XHRcdFx0dGhpcy5wbGF5ZXJZIC09IHN0cmFmZVk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc2V0QW5nbGVzKCkge1xyXG5cdFx0Y29uc3QgYW5nbGVBcnJMZW5ndGggPSBNYXRoLmNlaWwoXHJcblx0XHRcdCh0aGlzLndvcmxkMmQud2lkdGggKyB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50KSAvIHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnRcclxuXHRcdCk7XHJcblx0XHR0aGlzLnJheUFuZ2xlcyA9IG5ldyBGbG9hdDMyQXJyYXkoYW5nbGVBcnJMZW5ndGgpO1xyXG5cdFx0dGhpcy5kaXN0VG9Qcm9qZWN0aW9uUGxhbmUgPSB0aGlzLndvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHJcblx0XHRsZXQgeCA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGFuZ2xlQXJyTGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dGhpcy5yYXlBbmdsZXNbaV0gPSBNYXRoLmF0YW4oKHggLSB0aGlzLndvcmxkMmQud2lkdGggLyAyKSAvIHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lKTtcclxuXHRcdFx0eCArPSB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMucmF5cyA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5yYXlBbmdsZXMubGVuZ3RoKTtcclxuXHRcdHRoaXMub2JqZWN0VHlwZXMgPSBuZXcgVWludDhBcnJheSh0aGlzLnJheUFuZ2xlcy5sZW5ndGgpO1xyXG5cdFx0dGhpcy5vYmplY3REaXJzID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5yYXlBbmdsZXMubGVuZ3RoKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZ2V0SW50ZXJzZWN0aW9uID0gKFxyXG5cdFx0eDogbnVtYmVyLFxyXG5cdFx0eTogbnVtYmVyLFxyXG5cdFx0cjogbnVtYmVyLFxyXG5cdFx0dGhldGE6IG51bWJlcixcclxuXHRcdHgxOiBudW1iZXIsXHJcblx0XHR5MTogbnVtYmVyLFxyXG5cdFx0eDI6IG51bWJlcixcclxuXHRcdHkyOiBudW1iZXIsXHJcblx0XHRyb3Q6IG51bWJlclxyXG5cdCkgPT4ge1xyXG5cdFx0Y29uc3QgYWRqdXN0ZWRBbmdsZSA9IHRoZXRhICsgcm90ICogKE1hdGguUEkgLyAxODApO1xyXG5cdFx0Y29uc3QgeDMgPSB4O1xyXG5cdFx0Y29uc3QgeTMgPSB5O1xyXG5cdFx0Y29uc3QgeDQgPSB4ICsgciAqIE1hdGguY29zKGFkanVzdGVkQW5nbGUpO1xyXG5cdFx0Y29uc3QgeTQgPSB5ICsgciAqIE1hdGguc2luKGFkanVzdGVkQW5nbGUpO1xyXG5cdFx0Y29uc3QgZGVub20gPSAoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCk7XHJcblxyXG5cdFx0aWYgKGRlbm9tID09IDApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgdCA9ICgoeDEgLSB4MykgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MykgKiAoeDMgLSB4NCkpIC8gZGVub207XHJcblx0XHRjb25zdCB1ID0gKCh4MSAtIHgzKSAqICh5MSAtIHkyKSAtICh5MSAtIHkzKSAqICh4MSAtIHgyKSkgLyBkZW5vbTtcclxuXHRcdGlmICh0ID4gMCAmJiB0IDwgMSAmJiB1ID4gMCkge1xyXG5cdFx0XHRjb25zdCBweCA9IHgzICsgdSAqICh4NCAtIHgzKTtcclxuXHRcdFx0Y29uc3QgcHkgPSB5MyArIHUgKiAoeTQgLSB5Myk7XHJcblx0XHRcdHJldHVybiBbcHgsIHB5XTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRwcml2YXRlIGdldEludGVyc2VjdGlvbnNGb3JSZWN0KFxyXG5cdFx0ajogbnVtYmVyLFxyXG5cdFx0azogbnVtYmVyLFxyXG5cdFx0eDogbnVtYmVyLFxyXG5cdFx0eTogbnVtYmVyLFxyXG5cdFx0cmF5QW5nbGU6IG51bWJlcixcclxuXHRcdHJvdGF0aW9uOiBudW1iZXJcclxuXHQpIHtcclxuXHRcdGNvbnN0IHIgPSAxO1xyXG5cdFx0Y29uc3QgeDEgPSBrICogdGhpcy53YWxsVztcclxuXHRcdGNvbnN0IHkxID0gaiAqIHRoaXMud2FsbEg7XHJcblxyXG5cdFx0Y29uc3QgeDIgPSB4MSArIHRoaXMud2FsbFc7XHJcblx0XHRjb25zdCB5MiA9IHkxO1xyXG5cclxuXHRcdGNvbnN0IHgzID0geDEgKyB0aGlzLndhbGxXO1xyXG5cdFx0Y29uc3QgeTMgPSB5MSArIHRoaXMud2FsbEg7XHJcblxyXG5cdFx0Y29uc3QgeDQgPSB4MTtcclxuXHRcdGNvbnN0IHk0ID0geTEgKyB0aGlzLndhbGxIO1xyXG5cclxuXHRcdGxldCByZWNvcmQgPSBJbmZpbml0eTtcclxuXHRcdGxldCBjbG9zZXN0ID0gbnVsbDtcclxuXHRcdGxldCBkaXIgPSAwO1xyXG5cclxuXHRcdGZvciAobGV0IG4gPSAwOyBuIDwgNDsgbisrKSB7XHJcblx0XHRcdHN3aXRjaCAobikge1xyXG5cdFx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvblRvcCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHJheUFuZ2xlLCB4MSwgeTEsIHgyLCB5Miwgcm90YXRpb24pO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvblRvcCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25Ub3BbMF0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBpbnRlcnNlY3Rpb25Ub3BbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uVG9wO1xyXG5cdFx0XHRcdFx0XHRcdGRpciA9IDA7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25SaWdodCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHJheUFuZ2xlLCB4MiwgeTIsIHgzLCB5Mywgcm90YXRpb24pO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvblJpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGludGVyc2VjdGlvblJpZ2h0WzBdKTtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uUmlnaHRbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uUmlnaHQ7XHJcblx0XHRcdFx0XHRcdFx0ZGlyID0gMTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uQm90ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgcmF5QW5nbGUsIHgzLCB5MywgeDQsIHk0LCByb3RhdGlvbik7XHJcblx0XHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uQm90KSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGludGVyc2VjdGlvbkJvdFswXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGludGVyc2VjdGlvbkJvdFsxXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHRcdFx0XHRyZWNvcmQgPSBNYXRoLm1pbihkLCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0XHRpZiAoZCA8PSByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHRcdFx0XHRcdGNsb3Nlc3QgPSBpbnRlcnNlY3Rpb25Cb3Q7XHJcblx0XHRcdFx0XHRcdFx0ZGlyID0gMjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAzOlxyXG5cdFx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uTGVmdCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHJheUFuZ2xlLCB4NCwgeTQsIHgxLCB5MSwgcm90YXRpb24pO1xyXG5cdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvbkxlZnQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gaW50ZXJzZWN0aW9uTGVmdFswXSk7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGludGVyc2VjdGlvbkxlZnRbMV0pO1xyXG5cdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uTGVmdDtcclxuXHRcdFx0XHRcdFx0XHRkaXIgPSAzO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJlY29yZCxcclxuXHRcdFx0Y2xvc2VzdCxcclxuXHRcdFx0ZGlyLFxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBkcmF3KCkge1xyXG5cdFx0Y29uc3QgeCA9IHRoaXMucGxheWVyWDtcclxuXHRcdGNvbnN0IHkgPSB0aGlzLnBsYXllclk7XHJcblxyXG5cdFx0dGhpcy5tb3ZlKCk7XHJcblxyXG5cdFx0aWYgKCF0aGlzLnJheUFuZ2xlcyB8fCAhdGhpcy5yYXlzKSByZXR1cm47XHJcblx0XHRjb25zdCByID0gMTtcclxuXHRcdGNvbnN0IHJvdGF0aW9uID0gKCh0aGlzLnJvdGF0aW9uICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblxyXG5cdFx0bGV0IG9ialR5cGVUZW1wID0gMDtcclxuXHRcdGxldCBvYmpEaXJUZW1wID0gMDtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmF5QW5nbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBjbG9zZXN0ID0gbnVsbDtcclxuXHRcdFx0bGV0IHJlY29yZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxSb3dzOyBqKyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IHRoaXMud2FsbENvbHM7IGsrKykge1xyXG5cdFx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaiAqIHRoaXMud2FsbENvbHMgKyBrXTtcclxuXHRcdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCByZWN0SW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0XHRcdGRpcjogbnVtYmVyO1xyXG5cdFx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaiwgaywgeCwgeSwgdGhpcy5yYXlBbmdsZXNbaV0sIHJvdGF0aW9uKTtcclxuXHJcblx0XHRcdFx0XHRpZiAocmVjdEludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0cmVjb3JkID0gcmVjdEludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRcdGNsb3Nlc3QgPSByZWN0SW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblxyXG5cdFx0XHRcdFx0XHRvYmpUeXBlVGVtcCA9IHdhbGw7XHJcblx0XHRcdFx0XHRcdG9iakRpclRlbXAgPSByZWN0SW50ZXJzZWN0aW9uLmRpcjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChjbG9zZXN0KSB7XHJcblx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLm1vdmVUbyh4LCB5KTtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVUbyhjbG9zZXN0WzBdLCBjbG9zZXN0WzFdKTtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZVN0eWxlID0gYHJnYmEoMjU1LDI1NSwyNTUsJHt0aGlzLnJheU9wYWNpdHl9KWA7XHJcblx0XHRcdFx0dGhpcy5jdHgyZC5saW5lV2lkdGggPSAxO1xyXG5cdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMucmF5c1tpXSA9IHJlY29yZDtcclxuXHRcdFx0XHRpZiAodGhpcy5vYmplY3RUeXBlcykgdGhpcy5vYmplY3RUeXBlc1tpXSA9IG9ialR5cGVUZW1wO1xyXG5cdFx0XHRcdGlmICh0aGlzLm9iamVjdERpcnMpIHRoaXMub2JqZWN0RGlyc1tpXSA9IG9iakRpclRlbXA7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5yYXlzW2ldID0gSW5maW5pdHk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCByb3RhdGlvbkYgPSAoKHRoaXMucm90YXRpb24gJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHRcdGNvbnN0IHJvdGF0aW9uUiA9ICgoKHRoaXMucm90YXRpb24gKyA5MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHRcdGNvbnN0IHJvdGF0aW9uQiA9ICgoKHRoaXMucm90YXRpb24gKyAxODApICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblx0XHRjb25zdCByb3RhdGlvbkwgPSAoKCh0aGlzLnJvdGF0aW9uIC0gOTApICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RGID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRGID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RMID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRMID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RSID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRSID0gSW5maW5pdHk7XHJcblxyXG5cdFx0bGV0IGNsb3Nlc3RCID0gbnVsbDtcclxuXHRcdGxldCByZWNvcmRCID0gSW5maW5pdHk7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxSb3dzOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxDb2xzOyBqKyspIHtcclxuXHRcdFx0XHRjb25zdCB3YWxsID0gdGhpcy53YWxsc1tpICogdGhpcy53YWxsQ29scyArIGpdO1xyXG5cdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0Y29uc3QgZkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgMCwgcm90YXRpb25GKTtcclxuXHRcdFx0XHRpZiAoZkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRGKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRGID0gZkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0RiA9IGZJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbnN0IGxJbnRlcnNlY3Rpb246IHtcclxuXHRcdFx0XHRcdHJlY29yZDogbnVtYmVyO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdDogbnVtYmVyW10gfCBudWxsO1xyXG5cdFx0XHRcdH0gPSB0aGlzLmdldEludGVyc2VjdGlvbnNGb3JSZWN0KGksIGosIHgsIHksIDAsIHJvdGF0aW9uTCk7XHJcblx0XHRcdFx0aWYgKGxJbnRlcnNlY3Rpb24ucmVjb3JkIDwgcmVjb3JkTCkge1xyXG5cdFx0XHRcdFx0cmVjb3JkTCA9IGxJbnRlcnNlY3Rpb24ucmVjb3JkO1xyXG5cdFx0XHRcdFx0Y2xvc2VzdEwgPSBsSW50ZXJzZWN0aW9uLmNsb3Nlc3Q7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRjb25zdCBySW50ZXJzZWN0aW9uOiB7XHJcblx0XHRcdFx0XHRyZWNvcmQ6IG51bWJlcjtcclxuXHRcdFx0XHRcdGNsb3Nlc3Q6IG51bWJlcltdIHwgbnVsbDtcclxuXHRcdFx0XHR9ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb25zRm9yUmVjdChpLCBqLCB4LCB5LCAwLCByb3RhdGlvblIpO1xyXG5cdFx0XHRcdGlmIChySW50ZXJzZWN0aW9uLnJlY29yZCA8IHJlY29yZFIpIHtcclxuXHRcdFx0XHRcdHJlY29yZFIgPSBySW50ZXJzZWN0aW9uLnJlY29yZDtcclxuXHRcdFx0XHRcdGNsb3Nlc3RSID0gckludGVyc2VjdGlvbi5jbG9zZXN0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Y29uc3QgYkludGVyc2VjdGlvbjoge1xyXG5cdFx0XHRcdFx0cmVjb3JkOiBudW1iZXI7XHJcblx0XHRcdFx0XHRjbG9zZXN0OiBudW1iZXJbXSB8IG51bGw7XHJcblx0XHRcdFx0fSA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uc0ZvclJlY3QoaSwgaiwgeCwgeSwgMCwgcm90YXRpb25CKTtcclxuXHRcdFx0XHRpZiAoYkludGVyc2VjdGlvbi5yZWNvcmQgPCByZWNvcmRCKSB7XHJcblx0XHRcdFx0XHRyZWNvcmRCID0gYkludGVyc2VjdGlvbi5yZWNvcmQ7XHJcblx0XHRcdFx0XHRjbG9zZXN0QiA9IGJJbnRlcnNlY3Rpb24uY2xvc2VzdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gJ3JnYigyNTUsIDAsIDApJztcclxuXHJcblx0XHRpZiAoY2xvc2VzdEYpIHRoaXMubW92ZURpclJheXMuZm9yZXdhcmQgPSByZWNvcmRGO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RMKSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSByZWNvcmRMO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSBJbmZpbml0eTtcclxuXHJcblx0XHRpZiAoY2xvc2VzdFIpIHRoaXMubW92ZURpclJheXMucmlnaHQgPSByZWNvcmRSO1xyXG5cdFx0ZWxzZSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0ID0gSW5maW5pdHk7XHJcblxyXG5cdFx0aWYgKGNsb3Nlc3RCKSB0aGlzLm1vdmVEaXJSYXlzLmJhY2t3YXJkID0gcmVjb3JkQjtcclxuXHRcdGVsc2UgdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA9IEluZmluaXR5O1xyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxsczJkIHtcclxuXHRwcml2YXRlIHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cdHByaXZhdGUgY3R4MmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHRwdWJsaWMgd2FsbENvbHM6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHVibGljIHdhbGxXOiBudW1iZXI7XHJcblx0cHVibGljIHdhbGxIOiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy53YWxsQ29scyA9IDMyO1xyXG5cdFx0dGhpcy53YWxsUm93cyA9IDE4O1xyXG5cdFx0dGhpcy53YWxscyA9IG5ldyBVaW50OEFycmF5KFxyXG5cdFx0XHRbXHJcblx0XHRcdFx0WzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMiwgMiwgMiwgMiwgMiwgMiwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDIsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAyLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMiwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDIsIDIsIDIsIDIsIDAsIDIsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDIsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMiwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMV0sXHJcblx0XHRcdF0uZmxhdCgpXHJcblx0XHQpO1xyXG5cdFx0dGhpcy53YWxsVyA9IHRoaXMud29ybGQyZC53aWR0aCAvIHRoaXMud2FsbENvbHM7XHJcblx0XHR0aGlzLndhbGxIID0gdGhpcy53b3JsZDJkLmhlaWdodCAvIHRoaXMud2FsbFJvd3M7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZHJhdygpIHtcclxuXHRcdGxldCBjb3VudCA9IDA7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2FsbFJvd3M7IGkrKykge1xyXG5cdFx0XHRmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2FsbENvbHM7IGorKykge1xyXG5cdFx0XHRcdHRoaXMuY3R4MmQuZmlsbFN0eWxlID0gJ3JnYigxMDAsIDEwMCwgMTAwKSc7XHJcblx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaSAqIHRoaXMud2FsbENvbHMgKyBqXTtcclxuXHJcblx0XHRcdFx0c3dpdGNoICh3YWxsKSB7XHJcblx0XHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnJlY3QoaiAqIHRoaXMud2FsbFcsIGkgKiB0aGlzLndhbGxILCB0aGlzLndhbGxXLCB0aGlzLndhbGxIKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnJlY3QoaiAqIHRoaXMud2FsbFcsIGkgKiB0aGlzLndhbGxILCB0aGlzLndhbGxXLCB0aGlzLndhbGxIKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxzM2Qge1xyXG5cdHByaXZhdGUgd29ybGQzZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgzZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHByaXZhdGUgd2FsbFc6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxIOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3b3JsZDNkRGlhZzogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbFRleHR1cmU6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkM2Q6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgzZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCB3YWxsVzogbnVtYmVyLCB3YWxsSDogbnVtYmVyKSB7XHJcblx0XHR0aGlzLndvcmxkM2QgPSB3b3JsZDNkO1xyXG5cdFx0dGhpcy5jdHgzZCA9IGN0eDNkO1xyXG5cdFx0dGhpcy53YWxsVyA9IHdhbGxXO1xyXG5cdFx0dGhpcy53YWxsSCA9IHdhbGxIO1xyXG5cdFx0dGhpcy53b3JsZDNkRGlhZyA9IE1hdGguc3FydChNYXRoLnBvdyh3b3JsZDNkLndpZHRoLCAyKSArIE1hdGgucG93KHdvcmxkM2QuaGVpZ2h0LCAyKSk7XHJcblx0XHR0aGlzLndhbGxUZXh0dXJlID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLndhbGxUZXh0dXJlLnNyYyA9ICcuLi9wdWJsaWMvc3RvbmVUZXh0dXJlLnBuZyc7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZHJhdyhcclxuXHRcdHJheXM6IEZsb2F0MzJBcnJheSB8IG51bGwsXHJcblx0XHRvYmplY3RUeXBlczogVWludDhBcnJheSB8IG51bGwsXHJcblx0XHRvYmplY3REaXJzOiBVaW50OEFycmF5IHwgbnVsbCxcclxuXHRcdHBYOiBudW1iZXIsXHJcblx0XHRwWTogbnVtYmVyLFxyXG5cdFx0cmF5QW5nbGVzOiBGbG9hdDMyQXJyYXkgfCBudWxsXHJcblx0KSB7XHJcblx0XHRpZiAoIXJheXMgfHwgIXJheUFuZ2xlcykgcmV0dXJuO1xyXG5cclxuXHRcdGNvbnN0IHdhbGxXaWR0aCA9IHRoaXMud29ybGQzZC53aWR0aCAvIHJheXMubGVuZ3RoO1xyXG5cdFx0Y29uc3Qgd2FsbFdpZHRoT3ZlcnNpemVkID0gd2FsbFdpZHRoICsgMTtcclxuXHRcdGxldCB3YWxsWCA9IDA7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByYXlzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGRpc3QgPSByYXlzW2ldICogTWF0aC5jb3MocmF5QW5nbGVzW2ldKTtcclxuXHRcdFx0Y29uc3Qgb2Zmc2V0ID0gb2JqZWN0RGlycz8uW2ldID09PSAwIHx8IG9iamVjdERpcnM/LltpXSA9PT0gMiA/IHBYIC8gdGhpcy53YWxsVyA6IHBZIC8gdGhpcy53YWxsSDtcclxuXHJcblx0XHRcdGNvbnN0IHdhbGxTaGlmdEFtdCA9ICh0aGlzLndvcmxkM2QuaGVpZ2h0ICogNTApIC8gZGlzdDtcclxuXHRcdFx0bGV0IHdhbGxDZW50ZXJIZWlnaHQgPSB0aGlzLndvcmxkM2QuaGVpZ2h0IC8gMi41O1xyXG5cdFx0XHRjb25zdCB3YWxsU3RhcnRUb3AgPSB3YWxsQ2VudGVySGVpZ2h0IC0gd2FsbFNoaWZ0QW10O1xyXG5cdFx0XHRjb25zdCB3YWxsRW5kQm90dG9tID0gd2FsbENlbnRlckhlaWdodCArIHdhbGxTaGlmdEFtdDtcclxuXHJcblx0XHRcdGxldCB3YWxsRGFya25lc3MgPSBkaXN0IC8gdGhpcy53b3JsZDNkLmhlaWdodDtcclxuXHRcdFx0d2FsbERhcmtuZXNzID0gKHRoaXMud29ybGQzZERpYWcgLSBkaXN0KSAvIHRoaXMud29ybGQzZERpYWc7XHJcblxyXG5cdFx0XHRzd2l0Y2ggKG9iamVjdERpcnM/LltpXSkge1xyXG5cdFx0XHRcdGNhc2UgMDpcclxuXHRcdFx0XHRcdHdhbGxEYXJrbmVzcyAtPSAwLjI7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDI6XHJcblx0XHRcdFx0XHR3YWxsRGFya25lc3MgLT0gMC4yO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN3aXRjaCAob2JqZWN0VHlwZXM/LltpXSkge1xyXG5cdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdHRoaXMuY3R4M2QuZmlsbFN0eWxlID0gYHJnYmEoJHsyNTUgKiB3YWxsRGFya25lc3N9LCR7MjU1ICogd2FsbERhcmtuZXNzfSwkezI1NSAqIHdhbGxEYXJrbmVzc30sMSlgO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAyOlxyXG5cdFx0XHRcdFx0dGhpcy5jdHgzZC5maWxsU3R5bGUgPSBgcmdiYSgkezAgKiB3YWxsRGFya25lc3N9LCR7MTAwICogd2FsbERhcmtuZXNzfSwkezEwMCAqIHdhbGxEYXJrbmVzc30sMSlgO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuY3R4M2QuZmlsbFJlY3Qod2FsbFgsIHdhbGxTdGFydFRvcCwgd2FsbFdpZHRoT3ZlcnNpemVkLCB3YWxsRW5kQm90dG9tIC0gd2FsbFN0YXJ0VG9wKTtcclxuXHJcblx0XHRcdC8vIC8vIGNvbnN0IHNXaWR0aCA9XHJcblx0XHRcdC8vIC8vIFx0b2JqZWN0RGlycz8uW2ldID09PSAwIHx8IG9iamVjdERpcnM/LltpXSA9PT0gMlxyXG5cdFx0XHQvLyAvLyBcdFx0PyB0aGlzLndhbGxUZXh0dXJlLndpZHRoIC8gb2Zmc2V0XHJcblx0XHRcdC8vIC8vIFx0XHQ6IHRoaXMud2FsbFRleHR1cmUuaGVpZ2h0IC8gb2Zmc2V0O1xyXG5cclxuXHRcdFx0Ly8gdGhpcy5jdHgzZC5kcmF3SW1hZ2UoXHJcblx0XHRcdC8vIFx0dGhpcy53YWxsVGV4dHVyZSxcclxuXHRcdFx0Ly8gXHRvZmZzZXQsXHJcblx0XHRcdC8vIFx0MCxcclxuXHRcdFx0Ly8gXHR0aGlzLndhbGxUZXh0dXJlLndpZHRoLFxyXG5cdFx0XHQvLyBcdHRoaXMud2FsbFRleHR1cmUuaGVpZ2h0LFxyXG5cdFx0XHQvLyBcdHdhbGxYLFxyXG5cdFx0XHQvLyBcdHdhbGxTdGFydFRvcCxcclxuXHRcdFx0Ly8gXHR3YWxsV2lkdGgsXHJcblx0XHRcdC8vIFx0d2FsbEVuZEJvdHRvbSAtIHdhbGxTdGFydFRvcFxyXG5cdFx0XHQvLyApO1xyXG5cclxuXHRcdFx0d2FsbFggKz0gd2FsbFdpZHRoO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wbGF5ZXIyZC50c1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy90eXBlcy50c1wiKTtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3dhbGxzMmQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=