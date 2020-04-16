var Example001_Triangle = /** @class */ (function () {
    function Example001_Triangle() {
    }
    Example001_Triangle.prototype.render = function () {
        var canvas = document.querySelector("#canvas");
        var gl = canvas.getContext("webgl");
        gl.clearColor(0.5, 0.5, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        var vsSource = "\n            attribute vec3 a_position;\n            attribute vec4 a_color;\n            varying vec4 v_color;\n\n            void main() {\n                gl_Position = vec4(a_position,1);\n                v_color = a_color;\n            }\n        ";
        var vertexShader = this.createShaderFromSource(gl, gl.VERTEX_SHADER, vsSource);
        var fsSource = "\n            precision mediump float;\n            varying vec4 v_color;\n\n            void main() {\n                gl_FragColor = v_color;\n            }\n        ";
        var fragmentShader = this.createShaderFromSource(gl, gl.FRAGMENT_SHADER, fsSource);
        var program = this.createProgram(gl, vertexShader, fragmentShader);
        var positionAttribLoc = gl.getAttribLocation(program, "a_position");
        var colorAttribLoc = gl.getAttribLocation(program, "a_color");
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var positions = [
            0, 0,
            0.5, 0.5,
            0.5, 0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        var colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        var colors = [
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 1, 1, 1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttribLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorAttribLoc);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(colorAttribLoc, 4, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    Example001_Triangle.prototype.createShaderFromSource = function (gl, type, source) {
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
    Example001_Triangle.prototype.createProgram = function (gl, vs, fs) {
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
    return Example001_Triangle;
}());
new Example001_Triangle().render();
