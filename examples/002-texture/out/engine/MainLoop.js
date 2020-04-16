"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MainLoop = /** @class */ (function () {
    function MainLoop() {
        this._frameRate = 60;
        this._cb = undefined;
    }
    MainLoop.prototype.init = function (frameRate) {
        this._frameRate = frameRate;
        return this;
    };
    MainLoop.prototype.start = function (cb) {
        this._cb = cb;
        this.loop();
    };
    MainLoop.prototype.loop = function () {
        this._cb();
        console.log(Date.now());
        requestAnimationFrame(this.loop.bind(this));
    };
    MainLoop.instance = new MainLoop();
    return MainLoop;
}());
exports.default = MainLoop;
