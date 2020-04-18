
import Shader from "./Shader"

export default class Program {
    private _gl: WebGLRenderingContext = undefined;
    private _glProgram: WebGLProgram = undefined;

    public get glProgram(): WebGLProgram {
        return this._glProgram;
    }

    private _vs: Shader = undefined;
    private _fs: Shader = undefined;

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

    public static createWith(gl: WebGLRenderingContext, vs: Shader, fs: Shader) {
        let program = new Program(gl);
        if (program.initWith(vs, fs).link()) {
            return program;
        } else {
            return undefined;
        }
    }

    public static createWithSource(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
        let program = new Program(gl);
        if (program.initWithSource(vsSource, fsSource).link()) {
            return program;
        } else {
            return undefined;
        }
    }

    public link() {
        this._gl.linkProgram(this._glProgram);

        let success = this._gl.getProgramParameter(this._glProgram, this._gl.LINK_STATUS);
        if (success) {
            return this;
        }

        console.warn(this._gl.getProgramInfoLog(this._glProgram));
        this.delete();

        return undefined;
    }

    public use() {
        if (this._glProgram) {
            this._gl.useProgram(this._glProgram);
            return this;
        }

        return undefined;
    }

    public delete() {
        if (this._glProgram) {
            this._gl.deleteProgram(this._glProgram);
            this._glProgram = undefined;
        }
    }

    public getAttribLocation(name: string) {
        return this._gl.getAttribLocation(this._glProgram, name);
    }

    private initWithSource(vsSource: string, fsSource: string) {
        let vs = Shader.createWithSource(this._gl, this._gl.VERTEX_SHADER, vsSource);
        let fs = Shader.createWithSource(this._gl, this._gl.FRAGMENT_SHADER, fsSource);

        return this.initWith(vs, fs);
    }

    private initWith(vs: Shader, fs: Shader) {
        this._vs = vs;
        this._fs = fs;
        this._glProgram = this._gl.createProgram();
        this._gl.attachShader(this._glProgram, this._vs.glShader);
        this._gl.attachShader(this._glProgram, this._fs.glShader);

        return this;
    }
}
