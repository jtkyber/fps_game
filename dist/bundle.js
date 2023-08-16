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


var world2d = document.getElementById('world2d');
var world3d = document.getElementById('world3d');
var ctx2d = world2d.getContext('2d', { alpha: false });
var ctx3d = world3d.getContext('2d', { alpha: false });
var fpsElement = document.getElementById('fpsCounter');
var walls2d;
var player2d;
var fpsInterval, now, then, elapsed, requestID;
var frameCount = 0;
var frameRate = 60;
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
        player2d.draw(world2d.width / 2, world2d.height / 2);
    }
};
var setUp = function () {
    walls2d = new _walls2d__WEBPACK_IMPORTED_MODULE_1__["default"](world2d, ctx2d);
    walls2d.setUp();
    player2d = new _player2d__WEBPACK_IMPORTED_MODULE_0__["default"](world2d, ctx2d, walls2d.walls, walls2d.wallCols, walls2d.wallRows, walls2d.wallW, walls2d.wallH);
    player2d.setUp();
    gameLoop();
};
window.onload = function () {
    then = Date.now();
    setUp();
};
document.addEventListener('keydown', function (e) {
    //Set move forewards and backwards
    // if (e.code === 'KeyW') {
    // 	player2d.setMoveDir('forwards');
    // } else if (e.code === 'KeyS') {
    // 	player2d.setMoveDir('backwards');
    // }
    if (e.code === 'KeyA') {
        player2d.setRotation('left');
    }
    else if (e.code === 'KeyD') {
        player2d.setRotation('right');
    }
});
document.addEventListener('keyup', function (e) {
    //Set movement variables to null when key released{
    if (e.code === 'KeyA' || e.code === 'KeyD') {
        player2d.setRotation(null);
    }
    // if (e.code === 'KeyW' || e.code === 'KeyS') {
    // 	player2d.setMoveDir(null);
    // 	localStorage.setItem('playerPos', JSON.stringify(player2d.getPlayerPos()));
    // }
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
            // console.log(adjustedAngle);
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
        this.rayIncrement = 2;
        this.rayOpacity = 0.26;
        this.fov = 45;
        this.fovRad = this.fov * (Math.PI / 180);
        this.rotation = 45;
        this.angle = this.rotation + 90;
        this.distToProjectionPlane = world2d.width / 2 / Math.tan(this.fovRad / 2);
        this.rayAngles = null;
        this.rayDensityAdjustment = 12;
        this.rotDir = null;
        this.rotAmt = 0.2;
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
        // console.log(this.rotation);
    };
    Player2d.prototype.move = function () {
        this.rotate();
        // if (this.moveAmt < this.moveAmtTop) {
        // 	if (!this.fullscreen) {
        // 		this.moveAmt += 0.05;
        // 	} else {
        // 		this.moveAmt = this.moveAmtTop;
        // 	}
        // }
        // const dirRadians = this.angle * (Math.PI / 180);
        // const moveX = this.moveAmt * Math.cos(90 * (Math.PI / 180) - dirRadians);
        // const moveY = this.moveAmt * Math.cos(dirRadians);
        // const dirRadiansStrafe = dirRadians + Math.PI / 2;
        // const strafeX = (this.moveAmt * Math.cos(90 * (Math.PI / 180) - dirRadiansStrafe)) / 2;
        // const strafeY = (this.moveAmt * Math.cos(dirRadiansStrafe)) / 2;
        // const hittingF = this.moveDirRays.foreward < 5;
        // const hittingL = this.moveDirRays.left < 5;
        // const hittingR = this.moveDirRays.right < 5;
        // const hittingB = this.moveDirRays.backward < 5;
        // if (this.moveDirFB === 'forwards') {
        // 	if (!hittingF) {
        // 		this.playerX += moveX;
        // 	}
        // 	if (!hittingF) {
        // 		this.playerY -= moveY;
        // 	}
        // } else if (this.moveDirFB === 'backwards') {
        // 	if (!hittingB) {
        // 		this.playerX -= moveX;
        // 	}
        // 	if (!hittingB) {
        // 		this.playerY += moveY;
        // 	}
        // }
        // if (this.moveDirStrafe === 'left') {
        // 	if (!hittingL) {
        // 		this.playerX -= strafeX;
        // 	}
        // 	if (!hittingL) {
        // 		this.playerY += strafeY;
        // 	}
        // } else if (this.moveDirStrafe === 'right') {
        // 	if (!hittingR) {
        // 		this.playerX += strafeX;
        // 	}
        // 	if (!hittingR) {
        // 		this.playerY -= strafeY;
        // 	}
        // }
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
        // console.log(this.rayAngles);
    };
    Player2d.prototype.draw = function (x, y) {
        this.move();
        if (!this.rayAngles || !this.rays)
            return;
        var r = 1;
        var rotation = ((this.rotation % 360) + 360) % 360;
        for (var i = 0; i < this.rayAngles.length; i++) {
            var closest = null;
            var record = Infinity;
            for (var j = 0; j < this.wallRows; j++) {
                for (var k = 0; k < this.wallCols; k++) {
                    var wall = this.walls[j * this.wallCols + k];
                    if (wall === 0)
                        continue;
                    var x1 = k * this.wallW;
                    var y1 = j * this.wallH;
                    var x2 = x1 + this.wallW;
                    var y2 = y1;
                    var x3 = x1 + this.wallW;
                    var y3 = y1 + this.wallH;
                    var x4 = x1;
                    var y4 = y1 + this.wallH;
                    for (var n = 0; n < 4; n++) {
                        switch (n) {
                            case 0:
                                var intersectionTop = this.getIntersection(x, y, r, this.rayAngles[i], x1, y1, x2, y2, rotation);
                                if (intersectionTop) {
                                    var dx = Math.abs(x - intersectionTop[0]);
                                    var dy = Math.abs(y - intersectionTop[1]);
                                    var d = Math.sqrt(dx * dx + dy * dy);
                                    record = Math.min(d, record);
                                    if (d <= record) {
                                        record = d;
                                        closest = intersectionTop;
                                    }
                                }
                                break;
                            case 1:
                                var intersectionRight = this.getIntersection(x, y, r, this.rayAngles[i], x2, y2, x3, y3, rotation);
                                if (intersectionRight) {
                                    var dx = Math.abs(x - intersectionRight[0]);
                                    var dy = Math.abs(y - intersectionRight[1]);
                                    var d = Math.sqrt(dx * dx + dy * dy);
                                    record = Math.min(d, record);
                                    if (d <= record) {
                                        record = d;
                                        closest = intersectionRight;
                                    }
                                }
                                break;
                            case 2:
                                var intersectionBot = this.getIntersection(x, y, r, this.rayAngles[i], x3, y3, x4, y4, rotation);
                                if (intersectionBot) {
                                    var dx = Math.abs(x - intersectionBot[0]);
                                    var dy = Math.abs(y - intersectionBot[1]);
                                    var d = Math.sqrt(dx * dx + dy * dy);
                                    record = Math.min(d, record);
                                    if (d <= record) {
                                        record = d;
                                        closest = intersectionBot;
                                    }
                                }
                                break;
                            case 3:
                                var intersectionLeft = this.getIntersection(x, y, r, this.rayAngles[i], x4, y4, x1, y1, rotation);
                                if (intersectionLeft) {
                                    var dx = Math.abs(x - intersectionLeft[0]);
                                    var dy = Math.abs(y - intersectionLeft[1]);
                                    var d = Math.sqrt(dx * dx + dy * dy);
                                    record = Math.min(d, record);
                                    if (d <= record) {
                                        record = d;
                                        closest = intersectionLeft;
                                    }
                                }
                                break;
                        }
                    }
                    // switch (wall) {
                    // 	case 0:
                    // 		break;
                    // 	case 1:
                    // 		break;
                    // }
                }
            }
            // for (let i = 0; i < this.wallCoords.length; i += 4) {
            // 	// console.log(this.walls[i]);
            // 	const x1 = this.wallCoords[i];
            // 	const y1 = this.wallCoords[i + 1];
            // 	const x2 = this.wallCoords[i + 2];
            // 	const y2 = this.wallCoords[i + 3];
            // 	const intersection = this.getIntersection(x, y, r, this.rayAngles[i], x1, y1, x2, y2, rotation);
            // 	if (intersection) {
            // 		const dx = Math.abs(x - intersection[0]);
            // 		const dy = Math.abs(y - intersection[1]);
            // 		const d = Math.sqrt(dx * dx + dy * dy);
            // 		record = Math.min(d, record);
            // 		if (d <= record) {
            // 			record = d;
            // 			closest = intersection;
            // 		}
            // 	}
            // }
            if (closest) {
                this.ctx2d.beginPath();
                this.ctx2d.moveTo(x, y);
                this.ctx2d.lineTo(closest[0], closest[1]);
                this.ctx2d.strokeStyle = "rgba(255,255,255,".concat(this.rayOpacity, ")");
                this.ctx2d.lineWidth = 1;
                this.ctx2d.stroke();
                this.rays[i] = record;
            }
            else {
                this.rays[i] = Infinity;
            }
            // const rotationF = ((this.rotation % 360) + 360) % 360;
            // const rotationR = (((this.rotation + 90) % 360) + 360) % 360;
            // const rotationB = (((this.rotation + 180) % 360) + 360) % 360;
            // const rotationL = (((this.rotation - 90) % 360) + 360) % 360;
            // let closestF = null;
            // let recordF = Infinity;
            // let closestL = null;
            // let recordL = Infinity;
            // let closestR = null;
            // let recordR = Infinity;
            // let closestB = null;
            // let recordB = Infinity;
            // for (let i = 0; i < this.walls.length; i++) {
            // 	const x1 = this.walls[i];
            // 	const y1 = this.walls[i + 1];
            // 	const x2 = this.walls[i + 2];
            // 	const y2 = this.walls[i + 3];
            // 	const fIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationF);
            // 	const lIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationL);
            // 	const rIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationR);
            // 	const bIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationB);
            // 	if (fIntersection) {
            // 		const dx = Math.abs(x - fIntersection[0]);
            // 		const dy = Math.abs(y - fIntersection[1]);
            // 		const d = Math.sqrt(dx * dx + dy * dy);
            // 		recordF = Math.min(d, recordF);
            // 		if (d <= recordF) {
            // 			recordF = d;
            // 			closestF = fIntersection;
            // 		}
            // 	}
            // 	if (lIntersection) {
            // 		const dx = Math.abs(x - lIntersection[0]);
            // 		const dy = Math.abs(y - lIntersection[1]);
            // 		const d = Math.sqrt(dx * dx + dy * dy);
            // 		recordL = Math.min(d, recordL);
            // 		if (d <= recordL) {
            // 			recordL = d;
            // 			closestL = lIntersection;
            // 		}
            // 	}
            // 	if (rIntersection) {
            // 		const dx = Math.abs(x - rIntersection[0]);
            // 		const dy = Math.abs(y - rIntersection[1]);
            // 		const d = Math.sqrt(dx * dx + dy * dy);
            // 		recordR = Math.min(d, recordR);
            // 		if (d <= recordR) {
            // 			recordR = d;
            // 			closestR = rIntersection;
            // 		}
            // 	}
            // 	if (bIntersection) {
            // 		const dx = Math.abs(x - bIntersection[0]);
            // 		const dy = Math.abs(y - bIntersection[1]);
            // 		const d = Math.sqrt(dx * dx + dy * dy);
            // 		recordB = Math.min(d, recordB);
            // 		if (d <= recordB) {
            // 			recordB = d;
            // 			closestB = bIntersection;
            // 		}
            // 	}
            // }
            // if (closestF) {
            // 	this.moveDirRays.foreward = recordF;
            // } else {
            // 	this.moveDirRays.foreward = Infinity;
            // }
            // if (closestL) {
            // 	this.moveDirRays.left = recordL;
            // } else {
            // 	this.moveDirRays.left = Infinity;
            // }
            // if (closestR) {
            // 	this.moveDirRays.right = recordR;
            // } else {
            // 	this.moveDirRays.right = Infinity;
            // }
            // if (closestB) {
            // 	this.moveDirRays.backward = recordB;
            // } else {
            // 	this.moveDirRays.backward = Infinity;
            // }
            this.ctx2d.fillStyle = 'rgb(0, 155, 255)';
            this.ctx2d.beginPath();
            this.ctx2d.ellipse(x, y, 2, 2, 0, 0, 2 * Math.PI);
            this.ctx2d.fill();
            // this.walls3d.draw(
            // 	this.rayLengths,
            // 	this.rayXvalues,
            // 	this.rayYvalues,
            // 	this.allSpriteRays,
            // 	this.cornersInView
            // );
        }
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
    // public wallCoords: Float32Array;
    function Walls2d(world2d, ctx2d) {
        this.world2d = world2d;
        this.ctx2d = ctx2d;
        this.wallCols = 16;
        this.wallRows = 9;
        this.walls = new Uint8Array([
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ].flat());
        this.wallW = this.world2d.width / this.wallCols;
        this.wallH = this.world2d.height / this.wallRows;
        // this.wallCoords = new Float32Array(this.walls.length * 8);
    }
    Walls2d.prototype.setUp = function () {
        // let wallCoordsIndex = 0;
        // for (let i = 0; i < this.wallCols; i++) {
        // 	for (let j = 0; j < this.wallRows; j++) {
        // 		const x1 = i * this.wallW;
        // 		const y1 = j * this.wallH;
        // 		const x2 = x1 + this.wallW;
        // 		const y2 = y1;
        // 		const x3 = x1 + this.wallW;
        // 		const y3 = y1 + this.wallH;
        // 		const x4 = x1;
        // 		const y4 = y1 + this.wallH;
        // 		this.wallCoords[wallCoordsIndex] = x1;
        // 		this.wallCoords[wallCoordsIndex + 1] = y1;
        // 		this.wallCoords[wallCoordsIndex + 2] = x2;
        // 		this.wallCoords[wallCoordsIndex + 3] = y2;
        // 		this.wallCoords[wallCoordsIndex + 4] = x3;
        // 		this.wallCoords[wallCoordsIndex + 5] = y3;
        // 		this.wallCoords[wallCoordsIndex + 6] = x4;
        // 		this.wallCoords[wallCoordsIndex + 7] = y4;
        // 		wallCoordsIndex += 8;
        // 	}
        // }
    };
    Walls2d.prototype.draw = function () {
        var count = 0;
        for (var i = 0; i < this.wallRows; i++) {
            for (var j = 0; j < this.wallCols; j++) {
                this.ctx2d.fillStyle = count % 2 === 0 ? 'rgb(100, 100, 100)' : 'rgb(50, 50, 50)';
                var wall = this.walls[i * this.wallCols + j];
                switch (wall) {
                    case 0:
                        break;
                    case 1:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQzFCO1lBQ0MsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDaEQsQ0FBQyxJQUFJLEVBQUUsQ0FDUixDQUFDO1FBQ0YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ2hELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNqRCw2REFBNkQ7SUFDOUQsQ0FBQztJQUVNLHVCQUFLLEdBQVo7UUFDQywyQkFBMkI7UUFDM0IsNENBQTRDO1FBQzVDLDZDQUE2QztRQUM3QywrQkFBK0I7UUFDL0IsK0JBQStCO1FBQy9CLGdDQUFnQztRQUNoQyxtQkFBbUI7UUFDbkIsZ0NBQWdDO1FBQ2hDLGdDQUFnQztRQUNoQyxtQkFBbUI7UUFDbkIsZ0NBQWdDO1FBQ2hDLDJDQUEyQztRQUMzQywrQ0FBK0M7UUFDL0MsK0NBQStDO1FBQy9DLCtDQUErQztRQUMvQywrQ0FBK0M7UUFDL0MsK0NBQStDO1FBQy9DLCtDQUErQztRQUMvQywrQ0FBK0M7UUFDL0MsMEJBQTBCO1FBQzFCLEtBQUs7UUFDTCxJQUFJO0lBQ0wsQ0FBQztJQUVNLHNCQUFJLEdBQVg7UUFDQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDbEYsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFL0MsUUFBUSxJQUFJLEVBQUU7b0JBQ2IsS0FBSyxDQUFDO3dCQUNMLE1BQU07b0JBQ1AsS0FBSyxDQUFDO3dCQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7d0JBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUN4RSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNsQixNQUFNO2lCQUNQO2dCQUNELEtBQUssRUFBRSxDQUFDO2FBQ1I7U0FDRDtJQUNGLENBQUM7SUFDRixjQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7VUM5RUQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy9wbGF5ZXIyZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS8uL3NyYy93YWxsczJkLnRzIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQbGF5ZXIyZCBmcm9tICcuL3BsYXllcjJkJztcclxuaW1wb3J0IFdhbGxzMmQgZnJvbSAnLi93YWxsczJkJztcclxuXHJcbmNvbnN0IHdvcmxkMmQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dvcmxkMmQnKTtcclxuY29uc3Qgd29ybGQzZCA9IDxIVE1MQ2FudmFzRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd29ybGQzZCcpO1xyXG5cclxuY29uc3QgY3R4MmQgPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPndvcmxkMmQuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcclxuY29uc3QgY3R4M2QgPSA8Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEPndvcmxkM2QuZ2V0Q29udGV4dCgnMmQnLCB7IGFscGhhOiBmYWxzZSB9KTtcclxuXHJcbmNvbnN0IGZwc0VsZW1lbnQgPSA8SFRNTEhlYWRpbmdFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcHNDb3VudGVyJyk7XHJcblxyXG5sZXQgd2FsbHMyZDogV2FsbHMyZDtcclxubGV0IHBsYXllcjJkOiBQbGF5ZXIyZDtcclxuXHJcbmxldCBmcHNJbnRlcnZhbDogbnVtYmVyLCBub3c6IG51bWJlciwgdGhlbjogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIsIHJlcXVlc3RJRDogbnVtYmVyO1xyXG5sZXQgZnJhbWVDb3VudDogbnVtYmVyID0gMDtcclxuY29uc3QgZnJhbWVSYXRlID0gNjA7XHJcblxyXG5jb25zdCBzZXRGcmFtZXJhdGVWYWx1ZSA9ICgpID0+IHtcclxuXHRmcHNFbGVtZW50LmlubmVyVGV4dCA9IGZyYW1lQ291bnQudG9TdHJpbmcoKTtcclxuXHRmcHNFbGVtZW50LnN0eWxlLmNvbG9yID0gZnJhbWVDb3VudCA8IGZyYW1lUmF0ZSA/ICdyZWQnIDogJ3JnYigwLCAyNTUsIDApJztcclxuXHRmcmFtZUNvdW50ID0gMDtcclxufTtcclxuXHJcbmNvbnN0IGdhbWVMb29wID0gKCkgPT4ge1xyXG5cdHJlcXVlc3RJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcCk7XHJcblxyXG5cdGZwc0ludGVydmFsID0gMTAwMCAvIGZyYW1lUmF0ZTtcclxuXHJcblx0bm93ID0gRGF0ZS5ub3coKTtcclxuXHRlbGFwc2VkID0gbm93IC0gdGhlbjtcclxuXHJcblx0aWYgKGVsYXBzZWQgPiBmcHNJbnRlcnZhbCkge1xyXG5cdFx0aWYgKGZyYW1lQ291bnQgPT09IDApIHNldFRpbWVvdXQoc2V0RnJhbWVyYXRlVmFsdWUsIDEwMDApO1xyXG5cdFx0ZnJhbWVDb3VudCArPSAxO1xyXG5cdFx0dGhlbiA9IG5vdyAtIChlbGFwc2VkICUgZnBzSW50ZXJ2YWwpO1xyXG5cclxuXHRcdGN0eDJkLmNsZWFyUmVjdCgwLCAwLCB3b3JsZDJkLndpZHRoLCB3b3JsZDJkLmhlaWdodCk7XHJcblx0XHRjdHgzZC5jbGVhclJlY3QoMCwgMCwgd29ybGQzZC53aWR0aCwgd29ybGQzZC5oZWlnaHQpO1xyXG5cclxuXHRcdHdhbGxzMmQuZHJhdygpO1xyXG5cdFx0cGxheWVyMmQuZHJhdyh3b3JsZDJkLndpZHRoIC8gMiwgd29ybGQyZC5oZWlnaHQgLyAyKTtcclxuXHR9XHJcbn07XHJcblxyXG5jb25zdCBzZXRVcCA9ICgpID0+IHtcclxuXHR3YWxsczJkID0gbmV3IFdhbGxzMmQod29ybGQyZCwgY3R4MmQpO1xyXG5cdHdhbGxzMmQuc2V0VXAoKTtcclxuXHRwbGF5ZXIyZCA9IG5ldyBQbGF5ZXIyZChcclxuXHRcdHdvcmxkMmQsXHJcblx0XHRjdHgyZCxcclxuXHRcdHdhbGxzMmQud2FsbHMsXHJcblx0XHR3YWxsczJkLndhbGxDb2xzLFxyXG5cdFx0d2FsbHMyZC53YWxsUm93cyxcclxuXHRcdHdhbGxzMmQud2FsbFcsXHJcblx0XHR3YWxsczJkLndhbGxIXHJcblx0KTtcclxuXHRwbGF5ZXIyZC5zZXRVcCgpO1xyXG5cdGdhbWVMb29wKCk7XHJcbn07XHJcblxyXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xyXG5cdHRoZW4gPSBEYXRlLm5vdygpO1xyXG5cdHNldFVwKCk7XHJcbn07XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XHJcblx0Ly9TZXQgbW92ZSBmb3Jld2FyZHMgYW5kIGJhY2t3YXJkc1xyXG5cdC8vIGlmIChlLmNvZGUgPT09ICdLZXlXJykge1xyXG5cdC8vIFx0cGxheWVyMmQuc2V0TW92ZURpcignZm9yd2FyZHMnKTtcclxuXHQvLyB9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleVMnKSB7XHJcblx0Ly8gXHRwbGF5ZXIyZC5zZXRNb3ZlRGlyKCdiYWNrd2FyZHMnKTtcclxuXHQvLyB9XHJcblxyXG5cdGlmIChlLmNvZGUgPT09ICdLZXlBJykge1xyXG5cdFx0cGxheWVyMmQuc2V0Um90YXRpb24oJ2xlZnQnKTtcclxuXHR9IGVsc2UgaWYgKGUuY29kZSA9PT0gJ0tleUQnKSB7XHJcblx0XHRwbGF5ZXIyZC5zZXRSb3RhdGlvbigncmlnaHQnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCBlID0+IHtcclxuXHQvL1NldCBtb3ZlbWVudCB2YXJpYWJsZXMgdG8gbnVsbCB3aGVuIGtleSByZWxlYXNlZHtcclxuXHRpZiAoZS5jb2RlID09PSAnS2V5QScgfHwgZS5jb2RlID09PSAnS2V5RCcpIHtcclxuXHRcdHBsYXllcjJkLnNldFJvdGF0aW9uKG51bGwpO1xyXG5cdH1cclxuXHJcblx0Ly8gaWYgKGUuY29kZSA9PT0gJ0tleVcnIHx8IGUuY29kZSA9PT0gJ0tleVMnKSB7XHJcblx0Ly8gXHRwbGF5ZXIyZC5zZXRNb3ZlRGlyKG51bGwpO1xyXG5cdC8vIFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3BsYXllclBvcycsIEpTT04uc3RyaW5naWZ5KHBsYXllcjJkLmdldFBsYXllclBvcygpKSk7XHJcblx0Ly8gfVxyXG59KTtcclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxheWVyMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHByaXZhdGUgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHJpdmF0ZSB3YWxsQ29sczogbnVtYmVyO1xyXG5cdHByaXZhdGUgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxXOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsSDogbnVtYmVyO1xyXG5cdHByaXZhdGUgcmF5czogRmxvYXQzMkFycmF5IHwgbnVsbDtcclxuXHRwcml2YXRlIHJheUluY3JlbWVudDogbnVtYmVyO1xyXG5cdHByaXZhdGUgcmF5T3BhY2l0eTogbnVtYmVyO1xyXG5cdHByaXZhdGUgZm92UmFkOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBmb3Y6IG51bWJlcjtcclxuXHRwcml2YXRlIHJvdGF0aW9uOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBhbmdsZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgZGlzdFRvUHJvamVjdGlvblBsYW5lOiBudW1iZXI7XHJcblx0cHJpdmF0ZSByYXlBbmdsZXM6IEZsb2F0MzJBcnJheSB8IG51bGw7XHJcblx0cHJpdmF0ZSByYXlEZW5zaXR5QWRqdXN0bWVudDogbnVtYmVyO1xyXG5cdHByaXZhdGUgcm90RGlyOiBzdHJpbmcgfCBudWxsO1xyXG5cdHByaXZhdGUgcm90QW10OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKFxyXG5cdFx0d29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsXHJcblx0XHRjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG5cdFx0d2FsbHM6IFVpbnQ4QXJyYXksXHJcblx0XHR3YWxsQ29sczogbnVtYmVyLFxyXG5cdFx0d2FsbFJvd3M6IG51bWJlcixcclxuXHRcdHdhbGxXOiBudW1iZXIsXHJcblx0XHR3YWxsSDogbnVtYmVyXHJcblx0KSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy53YWxscyA9IHdhbGxzO1xyXG5cdFx0dGhpcy53YWxsQ29scyA9IHdhbGxDb2xzO1xyXG5cdFx0dGhpcy53YWxsUm93cyA9IHdhbGxSb3dzO1xyXG5cdFx0dGhpcy53YWxsVyA9IHdhbGxXO1xyXG5cdFx0dGhpcy53YWxsSCA9IHdhbGxIO1xyXG5cdFx0dGhpcy5yYXlzID0gbnVsbDtcclxuXHRcdHRoaXMucmF5SW5jcmVtZW50ID0gMjtcclxuXHRcdHRoaXMucmF5T3BhY2l0eSA9IDAuMjY7XHJcblx0XHR0aGlzLmZvdiA9IDQ1O1xyXG5cdFx0dGhpcy5mb3ZSYWQgPSB0aGlzLmZvdiAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdHRoaXMucm90YXRpb24gPSA0NTtcclxuXHRcdHRoaXMuYW5nbGUgPSB0aGlzLnJvdGF0aW9uICsgOTA7XHJcblx0XHR0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSA9IHdvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHRcdHRoaXMucmF5QW5nbGVzID0gbnVsbDtcclxuXHRcdHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnQgPSAxMjtcclxuXHRcdHRoaXMucm90RGlyID0gbnVsbDtcclxuXHRcdHRoaXMucm90QW10ID0gMC4yO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFVwKCkge1xyXG5cdFx0dGhpcy5zZXRBbmdsZXMoKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRSb3RhdGlvbihkaXI6IHN0cmluZyB8IG51bGwpIHtcclxuXHRcdGlmICh0aGlzLnJvdERpciA9PT0gbnVsbCkge1xyXG5cdFx0XHR0aGlzLnJvdEFtdCA9IDI7XHJcblx0XHR9XHJcblx0XHR0aGlzLnJvdERpciA9IGRpcjtcclxuXHRcdC8vIGNvbnNvbGUubG9nKHRoaXMucm90QW10KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgcm90YXRlKCkge1xyXG5cdFx0Ly8gaWYgKHRoaXMucm90QW10IDwgdGhpcy5yb3RBbXQpIHtcclxuXHRcdC8vIFx0dGhpcy5yb3RBbXQgKz0gMC4xO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdGlmICh0aGlzLnJvdERpciA9PT0gJ2xlZnQnKSB7XHJcblx0XHRcdHRoaXMucm90YXRpb24gLT0gdGhpcy5yb3RBbXQ7XHJcblx0XHRcdHRoaXMuYW5nbGUgLT0gdGhpcy5yb3RBbXQ7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMucm90RGlyID09PSAncmlnaHQnKSB7XHJcblx0XHRcdHRoaXMucm90YXRpb24gKz0gdGhpcy5yb3RBbXQ7XHJcblx0XHRcdHRoaXMuYW5nbGUgKz0gdGhpcy5yb3RBbXQ7XHJcblx0XHR9XHJcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLnJvdGF0aW9uKTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgbW92ZSgpIHtcclxuXHRcdHRoaXMucm90YXRlKCk7XHJcblx0XHQvLyBpZiAodGhpcy5tb3ZlQW10IDwgdGhpcy5tb3ZlQW10VG9wKSB7XHJcblx0XHQvLyBcdGlmICghdGhpcy5mdWxsc2NyZWVuKSB7XHJcblx0XHQvLyBcdFx0dGhpcy5tb3ZlQW10ICs9IDAuMDU7XHJcblx0XHQvLyBcdH0gZWxzZSB7XHJcblx0XHQvLyBcdFx0dGhpcy5tb3ZlQW10ID0gdGhpcy5tb3ZlQW10VG9wO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9XHJcblx0XHQvLyBjb25zdCBkaXJSYWRpYW5zID0gdGhpcy5hbmdsZSAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdC8vIGNvbnN0IG1vdmVYID0gdGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoOTAgKiAoTWF0aC5QSSAvIDE4MCkgLSBkaXJSYWRpYW5zKTtcclxuXHRcdC8vIGNvbnN0IG1vdmVZID0gdGhpcy5tb3ZlQW10ICogTWF0aC5jb3MoZGlyUmFkaWFucyk7XHJcblx0XHQvLyBjb25zdCBkaXJSYWRpYW5zU3RyYWZlID0gZGlyUmFkaWFucyArIE1hdGguUEkgLyAyO1xyXG5cdFx0Ly8gY29uc3Qgc3RyYWZlWCA9ICh0aGlzLm1vdmVBbXQgKiBNYXRoLmNvcyg5MCAqIChNYXRoLlBJIC8gMTgwKSAtIGRpclJhZGlhbnNTdHJhZmUpKSAvIDI7XHJcblx0XHQvLyBjb25zdCBzdHJhZmVZID0gKHRoaXMubW92ZUFtdCAqIE1hdGguY29zKGRpclJhZGlhbnNTdHJhZmUpKSAvIDI7XHJcblx0XHQvLyBjb25zdCBoaXR0aW5nRiA9IHRoaXMubW92ZURpclJheXMuZm9yZXdhcmQgPCA1O1xyXG5cdFx0Ly8gY29uc3QgaGl0dGluZ0wgPSB0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPCA1O1xyXG5cdFx0Ly8gY29uc3QgaGl0dGluZ1IgPSB0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0IDwgNTtcclxuXHRcdC8vIGNvbnN0IGhpdHRpbmdCID0gdGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA8IDU7XHJcblx0XHQvLyBpZiAodGhpcy5tb3ZlRGlyRkIgPT09ICdmb3J3YXJkcycpIHtcclxuXHRcdC8vIFx0aWYgKCFoaXR0aW5nRikge1xyXG5cdFx0Ly8gXHRcdHRoaXMucGxheWVyWCArPSBtb3ZlWDtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gXHRpZiAoIWhpdHRpbmdGKSB7XHJcblx0XHQvLyBcdFx0dGhpcy5wbGF5ZXJZIC09IG1vdmVZO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9IGVsc2UgaWYgKHRoaXMubW92ZURpckZCID09PSAnYmFja3dhcmRzJykge1xyXG5cdFx0Ly8gXHRpZiAoIWhpdHRpbmdCKSB7XHJcblx0XHQvLyBcdFx0dGhpcy5wbGF5ZXJYIC09IG1vdmVYO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyBcdGlmICghaGl0dGluZ0IpIHtcclxuXHRcdC8vIFx0XHR0aGlzLnBsYXllclkgKz0gbW92ZVk7XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIH1cclxuXHRcdC8vIGlmICh0aGlzLm1vdmVEaXJTdHJhZmUgPT09ICdsZWZ0Jykge1xyXG5cdFx0Ly8gXHRpZiAoIWhpdHRpbmdMKSB7XHJcblx0XHQvLyBcdFx0dGhpcy5wbGF5ZXJYIC09IHN0cmFmZVg7XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIFx0aWYgKCFoaXR0aW5nTCkge1xyXG5cdFx0Ly8gXHRcdHRoaXMucGxheWVyWSArPSBzdHJhZmVZO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9IGVsc2UgaWYgKHRoaXMubW92ZURpclN0cmFmZSA9PT0gJ3JpZ2h0Jykge1xyXG5cdFx0Ly8gXHRpZiAoIWhpdHRpbmdSKSB7XHJcblx0XHQvLyBcdFx0dGhpcy5wbGF5ZXJYICs9IHN0cmFmZVg7XHJcblx0XHQvLyBcdH1cclxuXHRcdC8vIFx0aWYgKCFoaXR0aW5nUikge1xyXG5cdFx0Ly8gXHRcdHRoaXMucGxheWVyWSAtPSBzdHJhZmVZO1xyXG5cdFx0Ly8gXHR9XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHNldEFuZ2xlcygpIHtcclxuXHRcdGNvbnN0IGFuZ2xlQXJyTGVuZ3RoID0gTWF0aC5jZWlsKFxyXG5cdFx0XHQodGhpcy53b3JsZDJkLndpZHRoICsgdGhpcy5yYXlEZW5zaXR5QWRqdXN0bWVudCkgLyB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50XHJcblx0XHQpO1xyXG5cdFx0dGhpcy5yYXlBbmdsZXMgPSBuZXcgRmxvYXQzMkFycmF5KGFuZ2xlQXJyTGVuZ3RoKTtcclxuXHRcdHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lID0gdGhpcy53b3JsZDJkLndpZHRoIC8gMiAvIE1hdGgudGFuKHRoaXMuZm92UmFkIC8gMik7XHJcblxyXG5cdFx0bGV0IHggPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhbmdsZUFyckxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMucmF5QW5nbGVzW2ldID0gTWF0aC5hdGFuKCh4IC0gdGhpcy53b3JsZDJkLndpZHRoIC8gMikgLyB0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSk7XHJcblx0XHRcdHggKz0gdGhpcy5yYXlEZW5zaXR5QWRqdXN0bWVudDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnJheXMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCk7XHJcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLnJheUFuZ2xlcyk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldEludGVyc2VjdGlvbiA9IChcclxuXHRcdHg6IG51bWJlcixcclxuXHRcdHk6IG51bWJlcixcclxuXHRcdHI6IG51bWJlcixcclxuXHRcdHRoZXRhOiBudW1iZXIsXHJcblx0XHR4MTogbnVtYmVyLFxyXG5cdFx0eTE6IG51bWJlcixcclxuXHRcdHgyOiBudW1iZXIsXHJcblx0XHR5MjogbnVtYmVyLFxyXG5cdFx0cm90OiBudW1iZXJcclxuXHQpID0+IHtcclxuXHRcdGNvbnN0IGFkanVzdGVkQW5nbGUgPSB0aGV0YSArIHJvdCAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdGNvbnN0IHgzID0geDtcclxuXHRcdGNvbnN0IHkzID0geTtcclxuXHRcdGNvbnN0IHg0ID0geCArIHIgKiBNYXRoLmNvcyhhZGp1c3RlZEFuZ2xlKTtcclxuXHRcdGNvbnN0IHk0ID0geSArIHIgKiBNYXRoLnNpbihhZGp1c3RlZEFuZ2xlKTtcclxuXHRcdGNvbnN0IGRlbm9tID0gKHgxIC0geDIpICogKHkzIC0geTQpIC0gKHkxIC0geTIpICogKHgzIC0geDQpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKGFkanVzdGVkQW5nbGUpO1xyXG5cdFx0aWYgKGRlbm9tID09IDApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgdCA9ICgoeDEgLSB4MykgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MykgKiAoeDMgLSB4NCkpIC8gZGVub207XHJcblx0XHRjb25zdCB1ID0gKCh4MSAtIHgzKSAqICh5MSAtIHkyKSAtICh5MSAtIHkzKSAqICh4MSAtIHgyKSkgLyBkZW5vbTtcclxuXHRcdGlmICh0ID4gMCAmJiB0IDwgMSAmJiB1ID4gMCkge1xyXG5cdFx0XHRjb25zdCBweCA9IHgzICsgdSAqICh4NCAtIHgzKTtcclxuXHRcdFx0Y29uc3QgcHkgPSB5MyArIHUgKiAoeTQgLSB5Myk7XHJcblx0XHRcdHJldHVybiBbcHgsIHB5XTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRwdWJsaWMgZHJhdyh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG5cdFx0dGhpcy5tb3ZlKCk7XHJcblx0XHRpZiAoIXRoaXMucmF5QW5nbGVzIHx8ICF0aGlzLnJheXMpIHJldHVybjtcclxuXHRcdGNvbnN0IHIgPSAxO1xyXG5cdFx0Y29uc3Qgcm90YXRpb24gPSAoKHRoaXMucm90YXRpb24gJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmF5QW5nbGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGxldCBjbG9zZXN0ID0gbnVsbDtcclxuXHRcdFx0bGV0IHJlY29yZCA9IEluZmluaXR5O1xyXG5cclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxSb3dzOyBqKyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCBrID0gMDsgayA8IHRoaXMud2FsbENvbHM7IGsrKykge1xyXG5cdFx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaiAqIHRoaXMud2FsbENvbHMgKyBrXTtcclxuXHRcdFx0XHRcdGlmICh3YWxsID09PSAwKSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRjb25zdCB4MSA9IGsgKiB0aGlzLndhbGxXO1xyXG5cdFx0XHRcdFx0Y29uc3QgeTEgPSBqICogdGhpcy53YWxsSDtcclxuXHJcblx0XHRcdFx0XHRjb25zdCB4MiA9IHgxICsgdGhpcy53YWxsVztcclxuXHRcdFx0XHRcdGNvbnN0IHkyID0geTE7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgeDMgPSB4MSArIHRoaXMud2FsbFc7XHJcblx0XHRcdFx0XHRjb25zdCB5MyA9IHkxICsgdGhpcy53YWxsSDtcclxuXHJcblx0XHRcdFx0XHRjb25zdCB4NCA9IHgxO1xyXG5cdFx0XHRcdFx0Y29uc3QgeTQgPSB5MSArIHRoaXMud2FsbEg7XHJcblxyXG5cdFx0XHRcdFx0Zm9yIChsZXQgbiA9IDA7IG4gPCA0OyBuKyspIHtcclxuXHRcdFx0XHRcdFx0c3dpdGNoIChuKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgaW50ZXJzZWN0aW9uVG9wID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oXHJcblx0XHRcdFx0XHRcdFx0XHRcdHgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHksXHJcblx0XHRcdFx0XHRcdFx0XHRcdHIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMucmF5QW5nbGVzW2ldLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR4MSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0eTEsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHgyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR5MixcclxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRpb25cclxuXHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uVG9wKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGludGVyc2VjdGlvblRvcFswXSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGludGVyc2VjdGlvblRvcFsxXSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmQgPSBNYXRoLm1pbihkLCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZCA8PSByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNsb3Nlc3QgPSBpbnRlcnNlY3Rpb25Ub3A7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlIDE6XHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25SaWdodCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR4LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnJheUFuZ2xlc1tpXSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0eDIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHkyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR4MyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0eTMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0aW9uXHJcblx0XHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvblJpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGludGVyc2VjdGlvblJpZ2h0WzBdKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uUmlnaHRbMV0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uUmlnaHQ7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdGNhc2UgMjpcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbkJvdCA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR4LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR5LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnJheUFuZ2xlc1tpXSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0eDMsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHkzLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR4NCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0eTQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJvdGF0aW9uXHJcblx0XHRcdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKGludGVyc2VjdGlvbkJvdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25Cb3RbMF0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBpbnRlcnNlY3Rpb25Cb3RbMV0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVjb3JkID0gZDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uQm90O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHRjYXNlIDM6XHJcblx0XHRcdFx0XHRcdFx0XHRjb25zdCBpbnRlcnNlY3Rpb25MZWZ0ID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oXHJcblx0XHRcdFx0XHRcdFx0XHRcdHgsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHksXHJcblx0XHRcdFx0XHRcdFx0XHRcdHIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMucmF5QW5nbGVzW2ldLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR4NCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0eTQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHgxLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR5MSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0cm90YXRpb25cclxuXHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoaW50ZXJzZWN0aW9uTGVmdCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25MZWZ0WzBdKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uTGVmdFsxXSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmQgPSBNYXRoLm1pbihkLCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoZCA8PSByZWNvcmQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNsb3Nlc3QgPSBpbnRlcnNlY3Rpb25MZWZ0O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIHN3aXRjaCAod2FsbCkge1xyXG5cdFx0XHRcdFx0Ly8gXHRjYXNlIDA6XHJcblx0XHRcdFx0XHQvLyBcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHQvLyBcdGNhc2UgMTpcclxuXHRcdFx0XHRcdC8vIFx0XHRicmVhaztcclxuXHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53YWxsQ29vcmRzLmxlbmd0aDsgaSArPSA0KSB7XHJcblx0XHRcdC8vIFx0Ly8gY29uc29sZS5sb2codGhpcy53YWxsc1tpXSk7XHJcblx0XHRcdC8vIFx0Y29uc3QgeDEgPSB0aGlzLndhbGxDb29yZHNbaV07XHJcblx0XHRcdC8vIFx0Y29uc3QgeTEgPSB0aGlzLndhbGxDb29yZHNbaSArIDFdO1xyXG5cdFx0XHQvLyBcdGNvbnN0IHgyID0gdGhpcy53YWxsQ29vcmRzW2kgKyAyXTtcclxuXHRcdFx0Ly8gXHRjb25zdCB5MiA9IHRoaXMud2FsbENvb3Jkc1tpICsgM107XHJcblxyXG5cdFx0XHQvLyBcdGNvbnN0IGludGVyc2VjdGlvbiA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHRoaXMucmF5QW5nbGVzW2ldLCB4MSwgeTEsIHgyLCB5Miwgcm90YXRpb24pO1xyXG5cclxuXHRcdFx0Ly8gXHRpZiAoaW50ZXJzZWN0aW9uKSB7XHJcblx0XHRcdC8vIFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBpbnRlcnNlY3Rpb25bMF0pO1xyXG5cdFx0XHQvLyBcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gaW50ZXJzZWN0aW9uWzFdKTtcclxuXHRcdFx0Ly8gXHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cdFx0XHQvLyBcdFx0cmVjb3JkID0gTWF0aC5taW4oZCwgcmVjb3JkKTtcclxuXHRcdFx0Ly8gXHRcdGlmIChkIDw9IHJlY29yZCkge1xyXG5cdFx0XHQvLyBcdFx0XHRyZWNvcmQgPSBkO1xyXG5cdFx0XHQvLyBcdFx0XHRjbG9zZXN0ID0gaW50ZXJzZWN0aW9uO1xyXG5cdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHQvLyBcdH1cclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0aWYgKGNsb3Nlc3QpIHtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdHRoaXMuY3R4MmQubW92ZVRvKHgsIHkpO1xyXG5cdFx0XHRcdHRoaXMuY3R4MmQubGluZVRvKGNsb3Nlc3RbMF0sIGNsb3Nlc3RbMV0pO1xyXG5cdFx0XHRcdHRoaXMuY3R4MmQuc3Ryb2tlU3R5bGUgPSBgcmdiYSgyNTUsMjU1LDI1NSwke3RoaXMucmF5T3BhY2l0eX0pYDtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLmxpbmVXaWR0aCA9IDE7XHJcblx0XHRcdFx0dGhpcy5jdHgyZC5zdHJva2UoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5yYXlzW2ldID0gcmVjb3JkO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMucmF5c1tpXSA9IEluZmluaXR5O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBjb25zdCByb3RhdGlvbkYgPSAoKHRoaXMucm90YXRpb24gJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHRcdFx0Ly8gY29uc3Qgcm90YXRpb25SID0gKCgodGhpcy5yb3RhdGlvbiArIDkwKSAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cdFx0XHQvLyBjb25zdCByb3RhdGlvbkIgPSAoKCh0aGlzLnJvdGF0aW9uICsgMTgwKSAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cdFx0XHQvLyBjb25zdCByb3RhdGlvbkwgPSAoKCh0aGlzLnJvdGF0aW9uIC0gOTApICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblxyXG5cdFx0XHQvLyBsZXQgY2xvc2VzdEYgPSBudWxsO1xyXG5cdFx0XHQvLyBsZXQgcmVjb3JkRiA9IEluZmluaXR5O1xyXG5cclxuXHRcdFx0Ly8gbGV0IGNsb3Nlc3RMID0gbnVsbDtcclxuXHRcdFx0Ly8gbGV0IHJlY29yZEwgPSBJbmZpbml0eTtcclxuXHJcblx0XHRcdC8vIGxldCBjbG9zZXN0UiA9IG51bGw7XHJcblx0XHRcdC8vIGxldCByZWNvcmRSID0gSW5maW5pdHk7XHJcblxyXG5cdFx0XHQvLyBsZXQgY2xvc2VzdEIgPSBudWxsO1xyXG5cdFx0XHQvLyBsZXQgcmVjb3JkQiA9IEluZmluaXR5O1xyXG5cclxuXHRcdFx0Ly8gZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdC8vIFx0Y29uc3QgeDEgPSB0aGlzLndhbGxzW2ldO1xyXG5cdFx0XHQvLyBcdGNvbnN0IHkxID0gdGhpcy53YWxsc1tpICsgMV07XHJcblx0XHRcdC8vIFx0Y29uc3QgeDIgPSB0aGlzLndhbGxzW2kgKyAyXTtcclxuXHRcdFx0Ly8gXHRjb25zdCB5MiA9IHRoaXMud2FsbHNbaSArIDNdO1xyXG5cclxuXHRcdFx0Ly8gXHRjb25zdCBmSW50ZXJzZWN0aW9uID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgMCwgeDEsIHkxLCB4MiwgeTIsIHJvdGF0aW9uRik7XHJcblx0XHRcdC8vIFx0Y29uc3QgbEludGVyc2VjdGlvbiA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIDAsIHgxLCB5MSwgeDIsIHkyLCByb3RhdGlvbkwpO1xyXG5cdFx0XHQvLyBcdGNvbnN0IHJJbnRlcnNlY3Rpb24gPSB0aGlzLmdldEludGVyc2VjdGlvbih4LCB5LCByLCAwLCB4MSwgeTEsIHgyLCB5Miwgcm90YXRpb25SKTtcclxuXHRcdFx0Ly8gXHRjb25zdCBiSW50ZXJzZWN0aW9uID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgMCwgeDEsIHkxLCB4MiwgeTIsIHJvdGF0aW9uQik7XHJcblxyXG5cdFx0XHQvLyBcdGlmIChmSW50ZXJzZWN0aW9uKSB7XHJcblx0XHRcdC8vIFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBmSW50ZXJzZWN0aW9uWzBdKTtcclxuXHRcdFx0Ly8gXHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGZJbnRlcnNlY3Rpb25bMV0pO1xyXG5cdFx0XHQvLyBcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblxyXG5cdFx0XHQvLyBcdFx0cmVjb3JkRiA9IE1hdGgubWluKGQsIHJlY29yZEYpO1xyXG5cdFx0XHQvLyBcdFx0aWYgKGQgPD0gcmVjb3JkRikge1xyXG5cdFx0XHQvLyBcdFx0XHRyZWNvcmRGID0gZDtcclxuXHRcdFx0Ly8gXHRcdFx0Y2xvc2VzdEYgPSBmSW50ZXJzZWN0aW9uO1xyXG5cdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHQvLyBcdH1cclxuXHRcdFx0Ly8gXHRpZiAobEludGVyc2VjdGlvbikge1xyXG5cdFx0XHQvLyBcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gbEludGVyc2VjdGlvblswXSk7XHJcblx0XHRcdC8vIFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBsSW50ZXJzZWN0aW9uWzFdKTtcclxuXHRcdFx0Ly8gXHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuXHRcdFx0Ly8gXHRcdHJlY29yZEwgPSBNYXRoLm1pbihkLCByZWNvcmRMKTtcclxuXHRcdFx0Ly8gXHRcdGlmIChkIDw9IHJlY29yZEwpIHtcclxuXHRcdFx0Ly8gXHRcdFx0cmVjb3JkTCA9IGQ7XHJcblx0XHRcdC8vIFx0XHRcdGNsb3Nlc3RMID0gbEludGVyc2VjdGlvbjtcclxuXHRcdFx0Ly8gXHRcdH1cclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIFx0aWYgKHJJbnRlcnNlY3Rpb24pIHtcclxuXHRcdFx0Ly8gXHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIHJJbnRlcnNlY3Rpb25bMF0pO1xyXG5cdFx0XHQvLyBcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gckludGVyc2VjdGlvblsxXSk7XHJcblx0XHRcdC8vIFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcblx0XHRcdC8vIFx0XHRyZWNvcmRSID0gTWF0aC5taW4oZCwgcmVjb3JkUik7XHJcblx0XHRcdC8vIFx0XHRpZiAoZCA8PSByZWNvcmRSKSB7XHJcblx0XHRcdC8vIFx0XHRcdHJlY29yZFIgPSBkO1xyXG5cdFx0XHQvLyBcdFx0XHRjbG9zZXN0UiA9IHJJbnRlcnNlY3Rpb247XHJcblx0XHRcdC8vIFx0XHR9XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyBcdGlmIChiSW50ZXJzZWN0aW9uKSB7XHJcblx0XHRcdC8vIFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBiSW50ZXJzZWN0aW9uWzBdKTtcclxuXHRcdFx0Ly8gXHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGJJbnRlcnNlY3Rpb25bMV0pO1xyXG5cdFx0XHQvLyBcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblxyXG5cdFx0XHQvLyBcdFx0cmVjb3JkQiA9IE1hdGgubWluKGQsIHJlY29yZEIpO1xyXG5cdFx0XHQvLyBcdFx0aWYgKGQgPD0gcmVjb3JkQikge1xyXG5cdFx0XHQvLyBcdFx0XHRyZWNvcmRCID0gZDtcclxuXHRcdFx0Ly8gXHRcdFx0Y2xvc2VzdEIgPSBiSW50ZXJzZWN0aW9uO1xyXG5cdFx0XHQvLyBcdFx0fVxyXG5cdFx0XHQvLyBcdH1cclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0Ly8gaWYgKGNsb3Nlc3RGKSB7XHJcblx0XHRcdC8vIFx0dGhpcy5tb3ZlRGlyUmF5cy5mb3Jld2FyZCA9IHJlY29yZEY7XHJcblx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdC8vIFx0dGhpcy5tb3ZlRGlyUmF5cy5mb3Jld2FyZCA9IEluZmluaXR5O1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHQvLyBpZiAoY2xvc2VzdEwpIHtcclxuXHRcdFx0Ly8gXHR0aGlzLm1vdmVEaXJSYXlzLmxlZnQgPSByZWNvcmRMO1xyXG5cdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHQvLyBcdHRoaXMubW92ZURpclJheXMubGVmdCA9IEluZmluaXR5O1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHQvLyBpZiAoY2xvc2VzdFIpIHtcclxuXHRcdFx0Ly8gXHR0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0ID0gcmVjb3JkUjtcclxuXHRcdFx0Ly8gfSBlbHNlIHtcclxuXHRcdFx0Ly8gXHR0aGlzLm1vdmVEaXJSYXlzLnJpZ2h0ID0gSW5maW5pdHk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vIGlmIChjbG9zZXN0Qikge1xyXG5cdFx0XHQvLyBcdHRoaXMubW92ZURpclJheXMuYmFja3dhcmQgPSByZWNvcmRCO1xyXG5cdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHQvLyBcdHRoaXMubW92ZURpclJheXMuYmFja3dhcmQgPSBJbmZpbml0eTtcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0dGhpcy5jdHgyZC5maWxsU3R5bGUgPSAncmdiKDAsIDE1NSwgMjU1KSc7XHJcblx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdHRoaXMuY3R4MmQuZWxsaXBzZSh4LCB5LCAyLCAyLCAwLCAwLCAyICogTWF0aC5QSSk7XHJcblx0XHRcdHRoaXMuY3R4MmQuZmlsbCgpO1xyXG5cclxuXHRcdFx0Ly8gdGhpcy53YWxsczNkLmRyYXcoXHJcblx0XHRcdC8vIFx0dGhpcy5yYXlMZW5ndGhzLFxyXG5cdFx0XHQvLyBcdHRoaXMucmF5WHZhbHVlcyxcclxuXHRcdFx0Ly8gXHR0aGlzLnJheVl2YWx1ZXMsXHJcblx0XHRcdC8vIFx0dGhpcy5hbGxTcHJpdGVSYXlzLFxyXG5cdFx0XHQvLyBcdHRoaXMuY29ybmVyc0luVmlld1xyXG5cdFx0XHQvLyApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBXYWxsczJkIHtcclxuXHRwcml2YXRlIHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cdHByaXZhdGUgY3R4MmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHRwdWJsaWMgd2FsbENvbHM6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbFJvd3M6IG51bWJlcjtcclxuXHRwdWJsaWMgd2FsbHM6IFVpbnQ4QXJyYXk7XHJcblx0cHVibGljIHdhbGxXOiBudW1iZXI7XHJcblx0cHVibGljIHdhbGxIOiBudW1iZXI7XHJcblx0Ly8gcHVibGljIHdhbGxDb29yZHM6IEZsb2F0MzJBcnJheTtcclxuXHJcblx0Y29uc3RydWN0b3Iod29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQsIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHRcdHRoaXMud29ybGQyZCA9IHdvcmxkMmQ7XHJcblx0XHR0aGlzLmN0eDJkID0gY3R4MmQ7XHJcblx0XHR0aGlzLndhbGxDb2xzID0gMTY7XHJcblx0XHR0aGlzLndhbGxSb3dzID0gOTtcclxuXHRcdHRoaXMud2FsbHMgPSBuZXcgVWludDhBcnJheShcclxuXHRcdFx0W1xyXG5cdFx0XHRcdFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDEsIDEsIDEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG5cdFx0XHRdLmZsYXQoKVxyXG5cdFx0KTtcclxuXHRcdHRoaXMud2FsbFcgPSB0aGlzLndvcmxkMmQud2lkdGggLyB0aGlzLndhbGxDb2xzO1xyXG5cdFx0dGhpcy53YWxsSCA9IHRoaXMud29ybGQyZC5oZWlnaHQgLyB0aGlzLndhbGxSb3dzO1xyXG5cdFx0Ly8gdGhpcy53YWxsQ29vcmRzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLndhbGxzLmxlbmd0aCAqIDgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFVwKCkge1xyXG5cdFx0Ly8gbGV0IHdhbGxDb29yZHNJbmRleCA9IDA7XHJcblx0XHQvLyBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2FsbENvbHM7IGkrKykge1xyXG5cdFx0Ly8gXHRmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMud2FsbFJvd3M7IGorKykge1xyXG5cdFx0Ly8gXHRcdGNvbnN0IHgxID0gaSAqIHRoaXMud2FsbFc7XHJcblx0XHQvLyBcdFx0Y29uc3QgeTEgPSBqICogdGhpcy53YWxsSDtcclxuXHRcdC8vIFx0XHRjb25zdCB4MiA9IHgxICsgdGhpcy53YWxsVztcclxuXHRcdC8vIFx0XHRjb25zdCB5MiA9IHkxO1xyXG5cdFx0Ly8gXHRcdGNvbnN0IHgzID0geDEgKyB0aGlzLndhbGxXO1xyXG5cdFx0Ly8gXHRcdGNvbnN0IHkzID0geTEgKyB0aGlzLndhbGxIO1xyXG5cdFx0Ly8gXHRcdGNvbnN0IHg0ID0geDE7XHJcblx0XHQvLyBcdFx0Y29uc3QgeTQgPSB5MSArIHRoaXMud2FsbEg7XHJcblx0XHQvLyBcdFx0dGhpcy53YWxsQ29vcmRzW3dhbGxDb29yZHNJbmRleF0gPSB4MTtcclxuXHRcdC8vIFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4ICsgMV0gPSB5MTtcclxuXHRcdC8vIFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4ICsgMl0gPSB4MjtcclxuXHRcdC8vIFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4ICsgM10gPSB5MjtcclxuXHRcdC8vIFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4ICsgNF0gPSB4MztcclxuXHRcdC8vIFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4ICsgNV0gPSB5MztcclxuXHRcdC8vIFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4ICsgNl0gPSB4NDtcclxuXHRcdC8vIFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4ICsgN10gPSB5NDtcclxuXHRcdC8vIFx0XHR3YWxsQ29vcmRzSW5kZXggKz0gODtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcoKSB7XHJcblx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxSb3dzOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxDb2xzOyBqKyspIHtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9IGNvdW50ICUgMiA9PT0gMCA/ICdyZ2IoMTAwLCAxMDAsIDEwMCknIDogJ3JnYig1MCwgNTAsIDUwKSc7XHJcblx0XHRcdFx0Y29uc3Qgd2FsbCA9IHRoaXMud2FsbHNbaSAqIHRoaXMud2FsbENvbHMgKyBqXTtcclxuXHJcblx0XHRcdFx0c3dpdGNoICh3YWxsKSB7XHJcblx0XHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLmJlZ2luUGF0aCgpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN0eDJkLnJlY3QoaiAqIHRoaXMud2FsbFcsIGkgKiB0aGlzLndhbGxILCB0aGlzLndhbGxXLCB0aGlzLndhbGxIKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3BsYXllcjJkLnRzXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3R5cGVzLnRzXCIpO1xudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvd2FsbHMyZC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==