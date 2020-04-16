
import MainLoop from "../../engine/MainLoop"

class Example002_Texture {
    public loadImage(url: string): Promise<HTMLImageElement> {
        let image = new Image();
        image.crossOrigin = "anonymous";
        image.src = url;
        return new Promise((resolve, reject) => {
            image.onload = () => {
                resolve(image);
            };
        });
    }

    public render(image: HTMLImageElement) {
        let canvas: HTMLCanvasElement = document.querySelector("#canvas");
        let gl: WebGLRenderingContext = canvas.getContext("webgl");

        const vsSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;

            void main() {
                gl_Position = vec4(a_position,0,1);
                v_texCoord = a_texCoord;
            }
        `;
        let vertexShader: WebGLShader = this.createShaderFromSource(gl, gl.VERTEX_SHADER, vsSource);

        const fsSource = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_tex;

            void main() {
                gl_FragColor = texture2D(u_tex,vec2(v_texCoord.x,1.0-v_texCoord.y));
            }
        `;
        let fragmentShader: WebGLShader = this.createShaderFromSource(gl, gl.FRAGMENT_SHADER, fsSource);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.5, 0.5, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let program: WebGLProgram = this.createProgram(gl, vertexShader, fragmentShader);
        let positionAttribLoc = gl.getAttribLocation(program, "a_position");
        let texCoordAttribLoc = gl.getAttribLocation(program, "a_texCoord");

        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        let positions = [
            0, 0,
            image.width / gl.canvas.width * 2, 0,
            0, image.height / gl.canvas.height * 2,
            0, image.height / gl.canvas.height * 2,
            image.width / gl.canvas.width * 2, image.height / gl.canvas.height * 2,
            image.width / gl.canvas.width * 2, 0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        let texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        let texCoords = [
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

        let texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
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

let ex = new Example002_Texture();
ex.loadImage("https://webglfundamentals.org/webgl/resources/leaves.jpg").then((image) => {
    ex.render(image);
});

MainLoop.instance.init(60).start(() => {

});
