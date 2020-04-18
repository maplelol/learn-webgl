
export default class Shader {
    private _gl: WebGLRenderingContext = undefined;
    private _glShader: WebGLShader = undefined;

    public get glShader() {
        return this._glShader;
    }

    constructor(gl: WebGLRenderingContext) {
        this._gl = gl;
    }

    public static createWithSource(gl: WebGLRenderingContext, type: GLenum, source: string) {
        let shader = new Shader(gl);
        if (shader.initWith(type, source).compile()) {
            return shader;
        } else {
            return undefined;
        }
    }

    public compile() {
        this._gl.compileShader(this._glShader);

        let success = this._gl.getShaderParameter(this._glShader, this._gl.COMPILE_STATUS);
        if (success) {
            return this;
        }

        console.warn(this._gl.getShaderInfoLog(this._glShader));
        this.delete();

        return undefined;
    }

    public delete() {
        if (this._glShader) {
            this._gl.deleteShader(this._glShader);
            this._glShader = undefined;
        }
    }

    private initWith(type: GLenum, source: string) {
        this._glShader = this._gl.createShader(type);
        this._gl.shaderSource(this._glShader, source);

        return this;
    }
}
