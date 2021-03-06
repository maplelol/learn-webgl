(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
        requestAnimationFrame(this.loop.bind(this));
    };
    MainLoop.instance = new MainLoop();
    return MainLoop;
}());
exports.default = MainLoop;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shader_1 = require("./Shader");
var Program = /** @class */ (function () {
    function Program(gl) {
        this._gl = undefined;
        this._glProgram = undefined;
        this._vs = undefined;
        this._fs = undefined;
        this._gl = gl;
    }
    Object.defineProperty(Program.prototype, "glProgram", {
        get: function () {
            return this._glProgram;
        },
        enumerable: true,
        configurable: true
    });
    Program.createWith = function (gl, vs, fs) {
        var program = new Program(gl);
        if (program.initWith(vs, fs).link()) {
            return program;
        }
        else {
            return undefined;
        }
    };
    Program.createWithSource = function (gl, vsSource, fsSource) {
        var program = new Program(gl);
        if (program.initWithSource(vsSource, fsSource).link()) {
            return program;
        }
        else {
            return undefined;
        }
    };
    Program.prototype.link = function () {
        this._gl.linkProgram(this._glProgram);
        var success = this._gl.getProgramParameter(this._glProgram, this._gl.LINK_STATUS);
        if (success) {
            return this;
        }
        console.warn(this._gl.getProgramInfoLog(this._glProgram));
        this.delete();
        return undefined;
    };
    Program.prototype.use = function () {
        if (this._glProgram) {
            this._gl.useProgram(this._glProgram);
            return this;
        }
        return undefined;
    };
    Program.prototype.delete = function () {
        if (this._glProgram) {
            this._gl.deleteProgram(this._glProgram);
            this._glProgram = undefined;
        }
    };
    Program.prototype.getAttribLocation = function (name) {
        return this._gl.getAttribLocation(this._glProgram, name);
    };
    Program.prototype.initWithSource = function (vsSource, fsSource) {
        var vs = Shader_1.default.createWithSource(this._gl, this._gl.VERTEX_SHADER, vsSource);
        var fs = Shader_1.default.createWithSource(this._gl, this._gl.FRAGMENT_SHADER, fsSource);
        return this.initWith(vs, fs);
    };
    Program.prototype.initWith = function (vs, fs) {
        if (this._glProgram) {
            this._gl.deleteProgram(this._glProgram);
            this._glProgram = undefined;
        }
        this._vs = vs;
        this._fs = fs;
        this._glProgram = this._gl.createProgram();
        this._gl.attachShader(this._glProgram, this._vs.glShader);
        this._gl.attachShader(this._glProgram, this._fs.glShader);
        return this;
    };
    return Program;
}());
exports.default = Program;

},{"./Shader":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Shader = /** @class */ (function () {
    function Shader(gl) {
        this._gl = undefined;
        this._glShader = undefined;
        this._gl = gl;
    }
    Object.defineProperty(Shader.prototype, "glShader", {
        get: function () {
            return this._glShader;
        },
        enumerable: true,
        configurable: true
    });
    Shader.createWithSource = function (gl, type, source) {
        var shader = new Shader(gl);
        if (shader.initWith(type, source).compile()) {
            return shader;
        }
        else {
            return undefined;
        }
    };
    Shader.prototype.compile = function () {
        this._gl.compileShader(this._glShader);
        var success = this._gl.getShaderParameter(this._glShader, this._gl.COMPILE_STATUS);
        if (success) {
            return this;
        }
        console.warn(this._gl.getShaderInfoLog(this._glShader));
        this.delete();
        return undefined;
    };
    Shader.prototype.delete = function () {
        if (this._glShader) {
            this._gl.deleteShader(this._glShader);
            this._glShader = undefined;
        }
    };
    Shader.prototype.initWith = function (type, source) {
        if (this._glShader) {
            this._gl.deleteShader(this._glShader);
            this._glShader = undefined;
        }
        this._glShader = this._gl.createShader(type);
        this._gl.shaderSource(this._glShader, source);
        return this;
    };
    return Shader;
}());
exports.default = Shader;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MainLoop_1 = require("../../engine/MainLoop");
var Program_1 = require("../../engine/Program");
var Example002_Texture = /** @class */ (function () {
    function Example002_Texture() {
        this._program = undefined;
    }
    Example002_Texture.prototype.loadImage = function (url) {
        var image = new Image();
        image.crossOrigin = "anonymous";
        image.src = url;
        return new Promise(function (resolve, reject) {
            image.onload = function () {
                resolve(image);
            };
        });
    };
    Example002_Texture.prototype.render = function (image) {
        var canvas = document.querySelector("#canvas");
        var gl = canvas.getContext("webgl");
        var vsSource = "\n            attribute vec2 a_position;\n            attribute vec2 a_texCoord;\n            varying vec2 v_texCoord;\n\n            void main() {\n                gl_Position = vec4(a_position,0,1);\n                v_texCoord = a_texCoord;\n            }\n        ";
        var fsSource = "\n            precision mediump float;\n            varying vec2 v_texCoord;\n            uniform sampler2D u_tex;\n\n            void main() {\n                gl_FragColor = texture2D(u_tex,vec2(v_texCoord.x,1.0-v_texCoord.y));\n            }\n        ";
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.25, 0.25, 0.25, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._program = Program_1.default.createWithSource(gl, vsSource, fsSource);
        var positionAttribLoc = this._program.getAttribLocation("a_position");
        var texCoordAttribLoc = this._program.getAttribLocation("a_texCoord");
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var positions = [
            0, 0,
            image.width / gl.canvas.width * 2, 0,
            0, image.height / gl.canvas.height * 2,
            0, image.height / gl.canvas.height * 2,
            image.width / gl.canvas.width * 2, image.height / gl.canvas.height * 2,
            image.width / gl.canvas.width * 2, 0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        var texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        var texCoords = [
            0, 0,
            1, 0,
            0, 1,
            0, 1,
            1, 1,
            1, 0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
        this._program.use();
        gl.enableVertexAttribArray(positionAttribLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(texCoordAttribLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.vertexAttribPointer(texCoordAttribLoc, 2, gl.FLOAT, false, 0, 0);
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    return Example002_Texture;
}());
var ex = new Example002_Texture();
ex.loadImage("https://webglfundamentals.org/webgl/resources/leaves.jpg").then(function (image) {
    ex.render(image);
});
MainLoop_1.default.instance.init(60).start(function () {
});

},{"../../engine/MainLoop":1,"../../engine/Program":2}]},{},[4]);
