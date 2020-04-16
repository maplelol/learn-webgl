
class Example001_Triangle {
    public render() {
        let canvas: HTMLCanvasElement = document.querySelector("#canvas");
        let gl: WebGLRenderingContext = canvas.getContext("webgl");

        gl.clearColor(0.5, 0.5, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const vsSource = `
            attribute vec3 a_position;
            attribute vec4 a_color;
            varying vec4 v_color;

            void main() {
                gl_Position = vec4(a_position,1);
                v_color = a_color;
            }
        `;
        let vertexShader: WebGLShader = this.createShaderFromSource(gl, gl.VERTEX_SHADER, vsSource);

        const fsSource = `
            precision mediump float;
            varying vec4 v_color;

            void main() {
                gl_FragColor = v_color;
            }
        `;
        let fragmentShader: WebGLShader = this.createShaderFromSource(gl, gl.FRAGMENT_SHADER, fsSource);

        let program: WebGLProgram = this.createProgram(gl, vertexShader, fragmentShader);
        let positionAttribLoc = gl.getAttribLocation(program, "a_position");
        let colorAttribLoc = gl.getAttribLocation(program, "a_color");

        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        let positions = [
            0, 0,
            0.5, 0.5,
            0.5, 0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        let colors = [
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1,
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
    }

    public createShaderFromSource(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader {
        let shader: WebGLShader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }

        console.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);

        return undefined;
    }

    public createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
        let program: WebGLProgram = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        console.warn(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);

        return undefined;
    }
}

new Example001_Triangle().render();
