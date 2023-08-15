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
var frameRate = 10;
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
        walls2d.draw();
        player2d.draw(world2d.width / 2, world2d.height / 2);
    }
};
var setUp = function () {
    walls2d = new _walls2d__WEBPACK_IMPORTED_MODULE_1__["default"](world2d, ctx2d);
    walls2d.setUp();
    player2d = new _player2d__WEBPACK_IMPORTED_MODULE_0__["default"](world2d, ctx2d, walls2d.wallCoords);
    player2d.setUp();
    gameLoop();
};
window.onload = function () {
    then = Date.now();
    setUp();
};


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
    function Player2d(world2d, ctx2d, walls) {
        this.getIntersection = function (x, y, r, theta, x1, y1, x2, y2, rot) {
            // console.log(rot);
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
        this.rays = null;
        this.rayIncrement = 0.2;
        this.rayOpacity = 0.26;
        this.fov = 45;
        this.fovRad = this.fov * (Math.PI / 180);
        this.rotation = 45;
        this.angle = this.rotation + 90;
        this.distToProjectionPlane = world2d.width / 2 / Math.tan(this.fovRad / 2);
        this.rayAngles = null;
        this.rayDensityAdjustment = 12;
    }
    Player2d.prototype.setUp = function () {
        this.setAngles();
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
    };
    Player2d.prototype.draw = function (x, y) {
        if (!this.rayAngles || !this.rays)
            return;
        var r = 1;
        for (var i = 0; i < this.rayAngles.length; i++) {
            var closest = null;
            var record = Infinity;
            // console.log(this.rotation);
            for (var i_1 = 0; i_1 < this.walls.length; i_1 += 4) {
                // console.log(this.walls[i]);
                var x1 = this.walls[i_1];
                var y1 = this.walls[i_1 + 1];
                var x2 = this.walls[i_1 + 2];
                var y2 = this.walls[i_1 + 3];
                var intersection = this.getIntersection(x, y, r, this.rayAngles[i_1], x1, y1, x2, y2, this.rotation);
                if (intersection) {
                    var dx = Math.abs(x - intersection[0]);
                    var dy = Math.abs(y - intersection[1]);
                    var d = Math.sqrt(dx * dx + dy * dy);
                    record = Math.min(d, record);
                    if (d <= record) {
                        record = d;
                        closest = intersection;
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
            }
            else {
                this.rays[i] = Infinity;
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
            for (var i_2 = 0; i_2 < this.walls.length; i_2++) {
                var x1 = this.walls[i_2];
                var y1 = this.walls[i_2 + 1];
                var x2 = this.walls[i_2 + 2];
                var y2 = this.walls[i_2 + 3];
                var fIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationF);
                var lIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationL);
                var rIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationR);
                var bIntersection = this.getIntersection(x, y, r, 0, x1, y1, x2, y2, rotationB);
                if (fIntersection) {
                    var dx = Math.abs(x - fIntersection[0]);
                    var dy = Math.abs(y - fIntersection[1]);
                    var d = Math.sqrt(dx * dx + dy * dy);
                    recordF = Math.min(d, recordF);
                    if (d <= recordF) {
                        recordF = d;
                        closestF = fIntersection;
                    }
                }
                if (lIntersection) {
                    var dx = Math.abs(x - lIntersection[0]);
                    var dy = Math.abs(y - lIntersection[1]);
                    var d = Math.sqrt(dx * dx + dy * dy);
                    recordL = Math.min(d, recordL);
                    if (d <= recordL) {
                        recordL = d;
                        closestL = lIntersection;
                    }
                }
                if (rIntersection) {
                    var dx = Math.abs(x - rIntersection[0]);
                    var dy = Math.abs(y - rIntersection[1]);
                    var d = Math.sqrt(dx * dx + dy * dy);
                    recordR = Math.min(d, recordR);
                    if (d <= recordR) {
                        recordR = d;
                        closestR = rIntersection;
                    }
                }
                if (bIntersection) {
                    var dx = Math.abs(x - bIntersection[0]);
                    var dy = Math.abs(y - bIntersection[1]);
                    var d = Math.sqrt(dx * dx + dy * dy);
                    recordB = Math.min(d, recordB);
                    if (d <= recordB) {
                        recordB = d;
                        closestB = bIntersection;
                    }
                }
            }
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
            this.ctx2d.ellipse(x, y, 6, 6, 0, 0, 2 * Math.PI);
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
    function Walls2d(world2d, ctx2d) {
        this.world2d = world2d;
        this.ctx2d = ctx2d;
        this.wallCols = 9;
        this.wallRows = 9;
        this.walls = new Uint8Array([
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
        ].flat());
        this.wallW = this.world2d.width / this.wallCols;
        this.wallH = this.world2d.height / this.wallRows;
        this.wallCoords = new Float32Array(this.walls.length * 8);
    }
    Walls2d.prototype.setUp = function () {
        var wallCoordsIndex = 0;
        for (var i = 0; i < this.wallCols; i++) {
            for (var j = 0; j < this.wallRows; j++) {
                var x1 = i * this.wallW;
                var y1 = j * this.wallH;
                var x2 = x1 + this.wallW;
                var y2 = y1;
                var x3 = x1 + this.wallW;
                var y3 = y1 + this.wallH;
                var x4 = x1;
                var y4 = y1 + this.wallH;
                this.wallCoords[wallCoordsIndex] = x1;
                this.wallCoords[wallCoordsIndex + 1] = y1;
                this.wallCoords[wallCoordsIndex + 2] = x2;
                this.wallCoords[wallCoordsIndex + 3] = y2;
                this.wallCoords[wallCoordsIndex + 4] = x3;
                this.wallCoords[wallCoordsIndex + 5] = y3;
                this.wallCoords[wallCoordsIndex + 6] = x4;
                this.wallCoords[wallCoordsIndex + 7] = y4;
                wallCoordsIndex += 8;
            }
        }
    };
    Walls2d.prototype.draw = function () {
        var count = 0;
        for (var i = 0; i < this.wallCols; i++) {
            for (var j = 0; j < this.wallRows; j++) {
                this.ctx2d.fillStyle = count % 2 === 0 ? 'rgb(0, 100, 0)' : 'rgb(100, 0, 0)';
                var wall = this.walls[i + j * this.wallRows];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUFBVSxFQUNWLEdBQVc7WUFFWCxvQkFBb0I7WUFDcEIsSUFBTSxhQUFhLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDcEQsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsSUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzNDLElBQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzQyxJQUFNLEtBQUssR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUM1RCxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7Z0JBQ2YsT0FBTzthQUNQO1lBQ0QsSUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNsRSxJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7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Q0FBQztnQkFDMUIsSUFBTSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBRTFCLElBQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUMzQixJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7Z0JBRWQsSUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQzNCLElBQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUUzQixJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUM7Z0JBQ2QsSUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBRTNCLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUN0QyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBRTFDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUUxQyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBQzFDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFFMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7Z0JBRTFDLGVBQWUsSUFBSSxDQUFDLENBQUM7YUFDckI7U0FDRDtJQUNGLENBQUM7SUFFTSxzQkFBSSxHQUFYO1FBQ0MsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzdFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRS9DLFFBQVEsSUFBSSxFQUFFO29CQUNiLEtBQUssQ0FBQzt3QkFDTCxNQUFNO29CQUNQLEtBQUssQ0FBQzt3QkFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO3dCQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDeEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQzt3QkFDbEIsTUFBTTtpQkFDUDtnQkFDRCxLQUFLLEVBQUUsQ0FBQzthQUNSO1NBQ0Q7SUFDRixDQUFDO0lBQ0YsY0FBQztBQUFELENBQUM7Ozs7Ozs7O1VDdkZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztVRU5BO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvcGxheWVyMmQudHMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvLi9zcmMvd2FsbHMyZC50cyIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9mcHNfZ2FtZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZnBzX2dhbWUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2Zwc19nYW1lL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGxheWVyMmQgZnJvbSAnLi9wbGF5ZXIyZCc7XHJcbmltcG9ydCBXYWxsczJkIGZyb20gJy4vd2FsbHMyZCc7XHJcblxyXG5jb25zdCB3b3JsZDJkID0gPEhUTUxDYW52YXNFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3b3JsZDJkJyk7XHJcbmNvbnN0IHdvcmxkM2QgPSA8SFRNTENhbnZhc0VsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dvcmxkM2QnKTtcclxuXHJcbmNvbnN0IGN0eDJkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDJkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcbmNvbnN0IGN0eDNkID0gPENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRD53b3JsZDNkLmdldENvbnRleHQoJzJkJywgeyBhbHBoYTogZmFsc2UgfSk7XHJcblxyXG5jb25zdCBmcHNFbGVtZW50ID0gPEhUTUxIZWFkaW5nRWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnBzQ291bnRlcicpO1xyXG5cclxubGV0IHdhbGxzMmQ6IFdhbGxzMmQ7XHJcbmxldCBwbGF5ZXIyZDogUGxheWVyMmQ7XHJcblxyXG5sZXQgZnBzSW50ZXJ2YWw6IG51bWJlciwgbm93OiBudW1iZXIsIHRoZW46IG51bWJlciwgZWxhcHNlZDogbnVtYmVyLCByZXF1ZXN0SUQ6IG51bWJlcjtcclxubGV0IGZyYW1lQ291bnQ6IG51bWJlciA9IDA7XHJcbmNvbnN0IGZyYW1lUmF0ZSA9IDEwO1xyXG5cclxuY29uc3Qgc2V0RnJhbWVyYXRlVmFsdWUgPSAoKSA9PiB7XHJcblx0ZnBzRWxlbWVudC5pbm5lclRleHQgPSBmcmFtZUNvdW50LnRvU3RyaW5nKCk7XHJcblx0ZnBzRWxlbWVudC5zdHlsZS5jb2xvciA9IGZyYW1lQ291bnQgPCBmcmFtZVJhdGUgPyAncmVkJyA6ICdyZ2IoMCwgMjU1LCAwKSc7XHJcblx0ZnJhbWVDb3VudCA9IDA7XHJcbn07XHJcblxyXG5jb25zdCBnYW1lTG9vcCA9ICgpID0+IHtcclxuXHRyZXF1ZXN0SUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xyXG5cclxuXHRmcHNJbnRlcnZhbCA9IDEwMDAgLyBmcmFtZVJhdGU7XHJcblxyXG5cdG5vdyA9IERhdGUubm93KCk7XHJcblx0ZWxhcHNlZCA9IG5vdyAtIHRoZW47XHJcblxyXG5cdGlmIChlbGFwc2VkID4gZnBzSW50ZXJ2YWwpIHtcclxuXHRcdGlmIChmcmFtZUNvdW50ID09PSAwKSBzZXRUaW1lb3V0KHNldEZyYW1lcmF0ZVZhbHVlLCAxMDAwKTtcclxuXHRcdGZyYW1lQ291bnQgKz0gMTtcclxuXHRcdHRoZW4gPSBub3cgLSAoZWxhcHNlZCAlIGZwc0ludGVydmFsKTtcclxuXHJcblx0XHR3YWxsczJkLmRyYXcoKTtcclxuXHRcdHBsYXllcjJkLmRyYXcod29ybGQyZC53aWR0aCAvIDIsIHdvcmxkMmQuaGVpZ2h0IC8gMik7XHJcblx0fVxyXG59O1xyXG5cclxuY29uc3Qgc2V0VXAgPSAoKSA9PiB7XHJcblx0d2FsbHMyZCA9IG5ldyBXYWxsczJkKHdvcmxkMmQsIGN0eDJkKTtcclxuXHR3YWxsczJkLnNldFVwKCk7XHJcblx0cGxheWVyMmQgPSBuZXcgUGxheWVyMmQod29ybGQyZCwgY3R4MmQsIHdhbGxzMmQud2FsbENvb3Jkcyk7XHJcblx0cGxheWVyMmQuc2V0VXAoKTtcclxuXHRnYW1lTG9vcCgpO1xyXG59O1xyXG5cclxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcclxuXHR0aGVuID0gRGF0ZS5ub3coKTtcclxuXHRzZXRVcCgpO1xyXG59O1xyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIyZCB7XHJcblx0cHJpdmF0ZSB3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHRwcml2YXRlIGN0eDJkOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblx0cHJpdmF0ZSB3YWxsczogRmxvYXQzMkFycmF5O1xyXG5cdHByaXZhdGUgcmF5czogRmxvYXQzMkFycmF5IHwgbnVsbDtcclxuXHRwcml2YXRlIHJheUluY3JlbWVudDogbnVtYmVyO1xyXG5cdHByaXZhdGUgcmF5T3BhY2l0eTogbnVtYmVyO1xyXG5cdHByaXZhdGUgZm92UmFkOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBmb3Y6IG51bWJlcjtcclxuXHRwcml2YXRlIHJvdGF0aW9uOiBudW1iZXI7XHJcblx0cHJpdmF0ZSBhbmdsZTogbnVtYmVyO1xyXG5cdHByaXZhdGUgZGlzdFRvUHJvamVjdGlvblBsYW5lOiBudW1iZXI7XHJcblx0cHJpdmF0ZSByYXlBbmdsZXM6IEZsb2F0MzJBcnJheSB8IG51bGw7XHJcblx0cHJpdmF0ZSByYXlEZW5zaXR5QWRqdXN0bWVudDogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3Rvcih3b3JsZDJkOiBIVE1MQ2FudmFzRWxlbWVudCwgY3R4MmQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgd2FsbHM6IEZsb2F0MzJBcnJheSkge1xyXG5cdFx0dGhpcy53b3JsZDJkID0gd29ybGQyZDtcclxuXHRcdHRoaXMuY3R4MmQgPSBjdHgyZDtcclxuXHRcdHRoaXMud2FsbHMgPSB3YWxscztcclxuXHRcdHRoaXMucmF5cyA9IG51bGw7XHJcblx0XHR0aGlzLnJheUluY3JlbWVudCA9IDAuMjtcclxuXHRcdHRoaXMucmF5T3BhY2l0eSA9IDAuMjY7XHJcblx0XHR0aGlzLmZvdiA9IDQ1O1xyXG5cdFx0dGhpcy5mb3ZSYWQgPSB0aGlzLmZvdiAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHRcdHRoaXMucm90YXRpb24gPSA0NTtcclxuXHRcdHRoaXMuYW5nbGUgPSB0aGlzLnJvdGF0aW9uICsgOTA7XHJcblx0XHR0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSA9IHdvcmxkMmQud2lkdGggLyAyIC8gTWF0aC50YW4odGhpcy5mb3ZSYWQgLyAyKTtcclxuXHRcdHRoaXMucmF5QW5nbGVzID0gbnVsbDtcclxuXHRcdHRoaXMucmF5RGVuc2l0eUFkanVzdG1lbnQgPSAxMjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzZXRVcCgpIHtcclxuXHRcdHRoaXMuc2V0QW5nbGVzKCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIHNldEFuZ2xlcygpIHtcclxuXHRcdGNvbnN0IGFuZ2xlQXJyTGVuZ3RoID0gTWF0aC5jZWlsKFxyXG5cdFx0XHQodGhpcy53b3JsZDJkLndpZHRoICsgdGhpcy5yYXlEZW5zaXR5QWRqdXN0bWVudCkgLyB0aGlzLnJheURlbnNpdHlBZGp1c3RtZW50XHJcblx0XHQpO1xyXG5cdFx0dGhpcy5yYXlBbmdsZXMgPSBuZXcgRmxvYXQzMkFycmF5KGFuZ2xlQXJyTGVuZ3RoKTtcclxuXHRcdHRoaXMuZGlzdFRvUHJvamVjdGlvblBsYW5lID0gdGhpcy53b3JsZDJkLndpZHRoIC8gMiAvIE1hdGgudGFuKHRoaXMuZm92UmFkIC8gMik7XHJcblxyXG5cdFx0bGV0IHggPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhbmdsZUFyckxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHRoaXMucmF5QW5nbGVzW2ldID0gTWF0aC5hdGFuKCh4IC0gdGhpcy53b3JsZDJkLndpZHRoIC8gMikgLyB0aGlzLmRpc3RUb1Byb2plY3Rpb25QbGFuZSk7XHJcblx0XHRcdHggKz0gdGhpcy5yYXlEZW5zaXR5QWRqdXN0bWVudDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnJheXMgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucmF5QW5nbGVzLmxlbmd0aCk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGdldEludGVyc2VjdGlvbiA9IChcclxuXHRcdHg6IG51bWJlcixcclxuXHRcdHk6IG51bWJlcixcclxuXHRcdHI6IG51bWJlcixcclxuXHRcdHRoZXRhOiBudW1iZXIsXHJcblx0XHR4MTogbnVtYmVyLFxyXG5cdFx0eTE6IG51bWJlcixcclxuXHRcdHgyOiBudW1iZXIsXHJcblx0XHR5MjogbnVtYmVyLFxyXG5cdFx0cm90OiBudW1iZXJcclxuXHQpID0+IHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKHJvdCk7XHJcblx0XHRjb25zdCBhZGp1c3RlZEFuZ2xlID0gdGhldGEgKyByb3QgKiAoTWF0aC5QSSAvIDE4MCk7XHJcblx0XHRjb25zdCB4MyA9IHg7XHJcblx0XHRjb25zdCB5MyA9IHk7XHJcblx0XHRjb25zdCB4NCA9IHggKyByICogTWF0aC5jb3MoYWRqdXN0ZWRBbmdsZSk7XHJcblx0XHRjb25zdCB5NCA9IHkgKyByICogTWF0aC5zaW4oYWRqdXN0ZWRBbmdsZSk7XHJcblx0XHRjb25zdCBkZW5vbSA9ICh4MSAtIHgyKSAqICh5MyAtIHk0KSAtICh5MSAtIHkyKSAqICh4MyAtIHg0KTtcclxuXHRcdGlmIChkZW5vbSA9PSAwKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHQgPSAoKHgxIC0geDMpICogKHkzIC0geTQpIC0gKHkxIC0geTMpICogKHgzIC0geDQpKSAvIGRlbm9tO1xyXG5cdFx0Y29uc3QgdSA9ICgoeDEgLSB4MykgKiAoeTEgLSB5MikgLSAoeTEgLSB5MykgKiAoeDEgLSB4MikpIC8gZGVub207XHJcblx0XHRpZiAodCA+IDAgJiYgdCA8IDEgJiYgdSA+IDApIHtcclxuXHRcdFx0Y29uc3QgcHggPSB4MyArIHUgKiAoeDQgLSB4Myk7XHJcblx0XHRcdGNvbnN0IHB5ID0geTMgKyB1ICogKHk0IC0geTMpO1xyXG5cdFx0XHRyZXR1cm4gW3B4LCBweV07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0cHVibGljIGRyYXcoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuXHRcdGlmICghdGhpcy5yYXlBbmdsZXMgfHwgIXRoaXMucmF5cykgcmV0dXJuO1xyXG5cdFx0Y29uc3QgciA9IDE7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJheUFuZ2xlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgY2xvc2VzdCA9IG51bGw7XHJcblx0XHRcdGxldCByZWNvcmQgPSBJbmZpbml0eTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2codGhpcy5yb3RhdGlvbik7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2FsbHMubGVuZ3RoOyBpICs9IDQpIHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLndhbGxzW2ldKTtcclxuXHRcdFx0XHRjb25zdCB4MSA9IHRoaXMud2FsbHNbaV07XHJcblx0XHRcdFx0Y29uc3QgeTEgPSB0aGlzLndhbGxzW2kgKyAxXTtcclxuXHRcdFx0XHRjb25zdCB4MiA9IHRoaXMud2FsbHNbaSArIDJdO1xyXG5cdFx0XHRcdGNvbnN0IHkyID0gdGhpcy53YWxsc1tpICsgM107XHJcblxyXG5cdFx0XHRcdGNvbnN0IGludGVyc2VjdGlvbiA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIHRoaXMucmF5QW5nbGVzW2ldLCB4MSwgeTEsIHgyLCB5MiwgdGhpcy5yb3RhdGlvbik7XHJcblxyXG5cdFx0XHRcdGlmIChpbnRlcnNlY3Rpb24pIHtcclxuXHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGludGVyc2VjdGlvblswXSk7XHJcblx0XHRcdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBpbnRlcnNlY3Rpb25bMV0pO1xyXG5cdFx0XHRcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblx0XHRcdFx0XHRyZWNvcmQgPSBNYXRoLm1pbihkLCByZWNvcmQpO1xyXG5cdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkKSB7XHJcblx0XHRcdFx0XHRcdHJlY29yZCA9IGQ7XHJcblx0XHRcdFx0XHRcdGNsb3Nlc3QgPSBpbnRlcnNlY3Rpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoY2xvc2VzdCkge1xyXG5cdFx0XHRcdHRoaXMuY3R4MmQuYmVnaW5QYXRoKCk7XHJcblx0XHRcdFx0dGhpcy5jdHgyZC5tb3ZlVG8oeCwgeSk7XHJcblx0XHRcdFx0dGhpcy5jdHgyZC5saW5lVG8oY2xvc2VzdFswXSwgY2xvc2VzdFsxXSk7XHJcblx0XHRcdFx0dGhpcy5jdHgyZC5zdHJva2VTdHlsZSA9IGByZ2JhKDI1NSwyNTUsMjU1LCR7dGhpcy5yYXlPcGFjaXR5fSlgO1xyXG5cdFx0XHRcdHRoaXMuY3R4MmQubGluZVdpZHRoID0gMTtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLnN0cm9rZSgpO1xyXG5cclxuXHRcdFx0XHR0aGlzLnJheXNbaV0gPSByZWNvcmQ7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5yYXlzW2ldID0gSW5maW5pdHk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnN0IHJvdGF0aW9uRiA9ICgodGhpcy5yb3RhdGlvbiAlIDM2MCkgKyAzNjApICUgMzYwO1xyXG5cdFx0XHRjb25zdCByb3RhdGlvblIgPSAoKCh0aGlzLnJvdGF0aW9uICsgOTApICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblx0XHRcdGNvbnN0IHJvdGF0aW9uQiA9ICgoKHRoaXMucm90YXRpb24gKyAxODApICUgMzYwKSArIDM2MCkgJSAzNjA7XHJcblx0XHRcdGNvbnN0IHJvdGF0aW9uTCA9ICgoKHRoaXMucm90YXRpb24gLSA5MCkgJSAzNjApICsgMzYwKSAlIDM2MDtcclxuXHJcblx0XHRcdGxldCBjbG9zZXN0RiA9IG51bGw7XHJcblx0XHRcdGxldCByZWNvcmRGID0gSW5maW5pdHk7XHJcblxyXG5cdFx0XHRsZXQgY2xvc2VzdEwgPSBudWxsO1xyXG5cdFx0XHRsZXQgcmVjb3JkTCA9IEluZmluaXR5O1xyXG5cclxuXHRcdFx0bGV0IGNsb3Nlc3RSID0gbnVsbDtcclxuXHRcdFx0bGV0IHJlY29yZFIgPSBJbmZpbml0eTtcclxuXHJcblx0XHRcdGxldCBjbG9zZXN0QiA9IG51bGw7XHJcblx0XHRcdGxldCByZWNvcmRCID0gSW5maW5pdHk7XHJcblxyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud2FsbHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCB4MSA9IHRoaXMud2FsbHNbaV07XHJcblx0XHRcdFx0Y29uc3QgeTEgPSB0aGlzLndhbGxzW2kgKyAxXTtcclxuXHRcdFx0XHRjb25zdCB4MiA9IHRoaXMud2FsbHNbaSArIDJdO1xyXG5cdFx0XHRcdGNvbnN0IHkyID0gdGhpcy53YWxsc1tpICsgM107XHJcblxyXG5cdFx0XHRcdGNvbnN0IGZJbnRlcnNlY3Rpb24gPSB0aGlzLmdldEludGVyc2VjdGlvbih4LCB5LCByLCAwLCB4MSwgeTEsIHgyLCB5Miwgcm90YXRpb25GKTtcclxuXHRcdFx0XHRjb25zdCBsSW50ZXJzZWN0aW9uID0gdGhpcy5nZXRJbnRlcnNlY3Rpb24oeCwgeSwgciwgMCwgeDEsIHkxLCB4MiwgeTIsIHJvdGF0aW9uTCk7XHJcblx0XHRcdFx0Y29uc3QgckludGVyc2VjdGlvbiA9IHRoaXMuZ2V0SW50ZXJzZWN0aW9uKHgsIHksIHIsIDAsIHgxLCB5MSwgeDIsIHkyLCByb3RhdGlvblIpO1xyXG5cdFx0XHRcdGNvbnN0IGJJbnRlcnNlY3Rpb24gPSB0aGlzLmdldEludGVyc2VjdGlvbih4LCB5LCByLCAwLCB4MSwgeTEsIHgyLCB5Miwgcm90YXRpb25CKTtcclxuXHJcblx0XHRcdFx0aWYgKGZJbnRlcnNlY3Rpb24pIHtcclxuXHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGZJbnRlcnNlY3Rpb25bMF0pO1xyXG5cdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gZkludGVyc2VjdGlvblsxXSk7XHJcblx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcblx0XHRcdFx0XHRyZWNvcmRGID0gTWF0aC5taW4oZCwgcmVjb3JkRik7XHJcblx0XHRcdFx0XHRpZiAoZCA8PSByZWNvcmRGKSB7XHJcblx0XHRcdFx0XHRcdHJlY29yZEYgPSBkO1xyXG5cdFx0XHRcdFx0XHRjbG9zZXN0RiA9IGZJbnRlcnNlY3Rpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChsSW50ZXJzZWN0aW9uKSB7XHJcblx0XHRcdFx0XHRjb25zdCBkeCA9IE1hdGguYWJzKHggLSBsSW50ZXJzZWN0aW9uWzBdKTtcclxuXHRcdFx0XHRcdGNvbnN0IGR5ID0gTWF0aC5hYnMoeSAtIGxJbnRlcnNlY3Rpb25bMV0pO1xyXG5cdFx0XHRcdFx0Y29uc3QgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcblxyXG5cdFx0XHRcdFx0cmVjb3JkTCA9IE1hdGgubWluKGQsIHJlY29yZEwpO1xyXG5cdFx0XHRcdFx0aWYgKGQgPD0gcmVjb3JkTCkge1xyXG5cdFx0XHRcdFx0XHRyZWNvcmRMID0gZDtcclxuXHRcdFx0XHRcdFx0Y2xvc2VzdEwgPSBsSW50ZXJzZWN0aW9uO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAockludGVyc2VjdGlvbikge1xyXG5cdFx0XHRcdFx0Y29uc3QgZHggPSBNYXRoLmFicyh4IC0gckludGVyc2VjdGlvblswXSk7XHJcblx0XHRcdFx0XHRjb25zdCBkeSA9IE1hdGguYWJzKHkgLSBySW50ZXJzZWN0aW9uWzFdKTtcclxuXHRcdFx0XHRcdGNvbnN0IGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG5cclxuXHRcdFx0XHRcdHJlY29yZFIgPSBNYXRoLm1pbihkLCByZWNvcmRSKTtcclxuXHRcdFx0XHRcdGlmIChkIDw9IHJlY29yZFIpIHtcclxuXHRcdFx0XHRcdFx0cmVjb3JkUiA9IGQ7XHJcblx0XHRcdFx0XHRcdGNsb3Nlc3RSID0gckludGVyc2VjdGlvbjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGJJbnRlcnNlY3Rpb24pIHtcclxuXHRcdFx0XHRcdGNvbnN0IGR4ID0gTWF0aC5hYnMoeCAtIGJJbnRlcnNlY3Rpb25bMF0pO1xyXG5cdFx0XHRcdFx0Y29uc3QgZHkgPSBNYXRoLmFicyh5IC0gYkludGVyc2VjdGlvblsxXSk7XHJcblx0XHRcdFx0XHRjb25zdCBkID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHJcblx0XHRcdFx0XHRyZWNvcmRCID0gTWF0aC5taW4oZCwgcmVjb3JkQik7XHJcblx0XHRcdFx0XHRpZiAoZCA8PSByZWNvcmRCKSB7XHJcblx0XHRcdFx0XHRcdHJlY29yZEIgPSBkO1xyXG5cdFx0XHRcdFx0XHRjbG9zZXN0QiA9IGJJbnRlcnNlY3Rpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBpZiAoY2xvc2VzdEYpIHtcclxuXHRcdFx0Ly8gXHR0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkID0gcmVjb3JkRjtcclxuXHRcdFx0Ly8gfSBlbHNlIHtcclxuXHRcdFx0Ly8gXHR0aGlzLm1vdmVEaXJSYXlzLmZvcmV3YXJkID0gSW5maW5pdHk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vIGlmIChjbG9zZXN0TCkge1xyXG5cdFx0XHQvLyBcdHRoaXMubW92ZURpclJheXMubGVmdCA9IHJlY29yZEw7XHJcblx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdC8vIFx0dGhpcy5tb3ZlRGlyUmF5cy5sZWZ0ID0gSW5maW5pdHk7XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHRcdC8vIGlmIChjbG9zZXN0Uikge1xyXG5cdFx0XHQvLyBcdHRoaXMubW92ZURpclJheXMucmlnaHQgPSByZWNvcmRSO1xyXG5cdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHQvLyBcdHRoaXMubW92ZURpclJheXMucmlnaHQgPSBJbmZpbml0eTtcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0Ly8gaWYgKGNsb3Nlc3RCKSB7XHJcblx0XHRcdC8vIFx0dGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA9IHJlY29yZEI7XHJcblx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdC8vIFx0dGhpcy5tb3ZlRGlyUmF5cy5iYWNrd2FyZCA9IEluZmluaXR5O1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9ICdyZ2IoMCwgMTU1LCAyNTUpJztcclxuXHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0dGhpcy5jdHgyZC5lbGxpcHNlKHgsIHksIDYsIDYsIDAsIDAsIDIgKiBNYXRoLlBJKTtcclxuXHRcdFx0dGhpcy5jdHgyZC5maWxsKCk7XHJcblxyXG5cdFx0XHQvLyB0aGlzLndhbGxzM2QuZHJhdyhcclxuXHRcdFx0Ly8gXHR0aGlzLnJheUxlbmd0aHMsXHJcblx0XHRcdC8vIFx0dGhpcy5yYXlYdmFsdWVzLFxyXG5cdFx0XHQvLyBcdHRoaXMucmF5WXZhbHVlcyxcclxuXHRcdFx0Ly8gXHR0aGlzLmFsbFNwcml0ZVJheXMsXHJcblx0XHRcdC8vIFx0dGhpcy5jb3JuZXJzSW5WaWV3XHJcblx0XHRcdC8vICk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGxzMmQge1xyXG5cdHByaXZhdGUgd29ybGQyZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblx0cHJpdmF0ZSBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cdHByaXZhdGUgd2FsbENvbHM6IG51bWJlcjtcclxuXHRwcml2YXRlIHdhbGxSb3dzOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsczogVWludDhBcnJheTtcclxuXHRwcml2YXRlIHdhbGxXOiBudW1iZXI7XHJcblx0cHJpdmF0ZSB3YWxsSDogbnVtYmVyO1xyXG5cdHB1YmxpYyB3YWxsQ29vcmRzOiBGbG9hdDMyQXJyYXk7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHdvcmxkMmQ6IEhUTUxDYW52YXNFbGVtZW50LCBjdHgyZDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcblx0XHR0aGlzLndvcmxkMmQgPSB3b3JsZDJkO1xyXG5cdFx0dGhpcy5jdHgyZCA9IGN0eDJkO1xyXG5cdFx0dGhpcy53YWxsQ29scyA9IDk7XHJcblx0XHR0aGlzLndhbGxSb3dzID0gOTtcclxuXHRcdHRoaXMud2FsbHMgPSBuZXcgVWludDhBcnJheShcclxuXHRcdFx0W1xyXG5cdFx0XHRcdFsxLCAxLCAxLCAxLCAxLCAxLCAxLCAxLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDFdLFxyXG5cdFx0XHRdLmZsYXQoKVxyXG5cdFx0KTtcclxuXHRcdHRoaXMud2FsbFcgPSB0aGlzLndvcmxkMmQud2lkdGggLyB0aGlzLndhbGxDb2xzO1xyXG5cdFx0dGhpcy53YWxsSCA9IHRoaXMud29ybGQyZC5oZWlnaHQgLyB0aGlzLndhbGxSb3dzO1xyXG5cdFx0dGhpcy53YWxsQ29vcmRzID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLndhbGxzLmxlbmd0aCAqIDgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFVwKCkge1xyXG5cdFx0bGV0IHdhbGxDb29yZHNJbmRleCA9IDA7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxDb2xzOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxSb3dzOyBqKyspIHtcclxuXHRcdFx0XHRjb25zdCB4MSA9IGkgKiB0aGlzLndhbGxXO1xyXG5cdFx0XHRcdGNvbnN0IHkxID0gaiAqIHRoaXMud2FsbEg7XHJcblxyXG5cdFx0XHRcdGNvbnN0IHgyID0geDEgKyB0aGlzLndhbGxXO1xyXG5cdFx0XHRcdGNvbnN0IHkyID0geTE7XHJcblxyXG5cdFx0XHRcdGNvbnN0IHgzID0geDEgKyB0aGlzLndhbGxXO1xyXG5cdFx0XHRcdGNvbnN0IHkzID0geTEgKyB0aGlzLndhbGxIO1xyXG5cclxuXHRcdFx0XHRjb25zdCB4NCA9IHgxO1xyXG5cdFx0XHRcdGNvbnN0IHk0ID0geTEgKyB0aGlzLndhbGxIO1xyXG5cclxuXHRcdFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4XSA9IHgxO1xyXG5cdFx0XHRcdHRoaXMud2FsbENvb3Jkc1t3YWxsQ29vcmRzSW5kZXggKyAxXSA9IHkxO1xyXG5cclxuXHRcdFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4ICsgMl0gPSB4MjtcclxuXHRcdFx0XHR0aGlzLndhbGxDb29yZHNbd2FsbENvb3Jkc0luZGV4ICsgM10gPSB5MjtcclxuXHJcblx0XHRcdFx0dGhpcy53YWxsQ29vcmRzW3dhbGxDb29yZHNJbmRleCArIDRdID0geDM7XHJcblx0XHRcdFx0dGhpcy53YWxsQ29vcmRzW3dhbGxDb29yZHNJbmRleCArIDVdID0geTM7XHJcblxyXG5cdFx0XHRcdHRoaXMud2FsbENvb3Jkc1t3YWxsQ29vcmRzSW5kZXggKyA2XSA9IHg0O1xyXG5cdFx0XHRcdHRoaXMud2FsbENvb3Jkc1t3YWxsQ29vcmRzSW5kZXggKyA3XSA9IHk0O1xyXG5cclxuXHRcdFx0XHR3YWxsQ29vcmRzSW5kZXggKz0gODtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGRyYXcoKSB7XHJcblx0XHRsZXQgY291bnQgPSAwO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhbGxDb2xzOyBpKyspIHtcclxuXHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLndhbGxSb3dzOyBqKyspIHtcclxuXHRcdFx0XHR0aGlzLmN0eDJkLmZpbGxTdHlsZSA9IGNvdW50ICUgMiA9PT0gMCA/ICdyZ2IoMCwgMTAwLCAwKScgOiAncmdiKDEwMCwgMCwgMCknO1xyXG5cdFx0XHRcdGNvbnN0IHdhbGwgPSB0aGlzLndhbGxzW2kgKyBqICogdGhpcy53YWxsUm93c107XHJcblxyXG5cdFx0XHRcdHN3aXRjaCAod2FsbCkge1xyXG5cdFx0XHRcdFx0Y2FzZSAwOlxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMTpcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5iZWdpblBhdGgoKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdHgyZC5yZWN0KGogKiB0aGlzLndhbGxXLCBpICogdGhpcy53YWxsSCwgdGhpcy53YWxsVywgdGhpcy53YWxsSCk7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3R4MmQuZmlsbCgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y291bnQrKztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wbGF5ZXIyZC50c1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy90eXBlcy50c1wiKTtcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3dhbGxzMmQudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=