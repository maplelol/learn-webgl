"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MainLoop_1 = require("../../engine/MainLoop");
var Example002_Texture = /** @class */ (function () {
    function Example002_Texture() {
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
        var vertexShader = this.createShaderFromSource(gl, gl.VERTEX_SHADER, vsSource);
        var fsSource = "\n            precision mediump float;\n            varying vec2 v_texCoord;\n            uniform sampler2D u_tex;\n\n            void main() {\n                gl_FragColor = texture2D(u_tex,vec2(v_texCoord.x,1.0-v_texCoord.y));\n            }\n        ";
        var fragmentShader = this.createShaderFromSource(gl, gl.FRAGMENT_SHADER, fsSource);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.5, 0.5, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var program = this.createProgram(gl, vertexShader, fragmentShader);
        var positionAttribLoc = gl.getAttribLocation(program, "a_position");
        var texCoordAttribLoc = gl.getAttribLocation(program, "a_texCoord");
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
        gl.useProgram(program);
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
    Example002_Texture.prototype.createShaderFromSource = function (gl, type, source) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return undefined;
    };
    Example002_Texture.prototype.createProgram = function (gl, vs, fs) {
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        console.warn(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return undefined;
    };
    return Example002_Texture;
}());
var ex = new Example002_Texture();
ex.loadImage("https://webglfundamentals.org/webgl/resources/leaves.jpg").then(function (image) {
    ex.render(image);
});
MainLoop_1.default.instance.init(60).start(function () {
});
