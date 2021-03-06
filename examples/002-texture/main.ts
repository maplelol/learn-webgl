
import MainLoop from "../../engine/MainLoop"
import Program from "../../engine/Program"

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

    private _program: Program = undefined;

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

        const fsSource = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_tex;

            void main() {
                gl_FragColor = texture2D(u_tex,vec2(v_texCoord.x,1.0-v_texCoord.y));
            }
        `;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.clearColor(0.25, 0.25, 0.25, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this._program = Program.createWithSource(gl, vsSource, fsSource);
        let positionAttribLoc = this._program.getAttribLocation("a_position");
        let texCoordAttribLoc = this._program.getAttribLocation("a_texCoord");

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

        this._program.use();

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
}

let ex = new Example002_Texture();
ex.loadImage("https://webglfundamentals.org/webgl/resources/leaves.jpg").then((image) => {
    ex.render(image);
});

MainLoop.instance.init(60).start(() => {

});
