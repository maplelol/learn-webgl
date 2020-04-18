
export default class Shader {
    private _shader: WebGLShader = undefined;

    public set glShader(s: WebGLShader) {
        this._shader = s;
    }
    public get glShader() {
        return this._shader;
    }

    public static createFromSource(gl: WebGLRenderingContext, type: GLenum, source: string): Shader {
        let glShader = gl.createShader(type);
        gl.shaderSource(glShader, source);
        gl.compileShader(glShader);

        let success = gl.getShaderParameter(glShader, gl.COMPILE_STATUS);
        if (success) {
            let shader = new Shader();
            shader.glShader = glShader;
            return shader;
        }

        console.warn(gl.getShaderInfoLog(glShader));
        gl.deleteShader(glShader);

        return undefined;
    }
}
