
import Shader from "./Shader"

export default class MainLoop {
    public static readonly instance: MainLoop = new MainLoop();

    private _frameRate: number = 60;
    private _cb: Function = undefined;

    public init(frameRate: number) {
        this._frameRate = frameRate;

        return this;
    }

    public start(cb: Function) {
        this._cb = cb;
        this.loop();
    }

    private loop() {
        this._cb();
        requestAnimationFrame(this.loop.bind(this));
    }

    public static createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
        return Shader.createFromSource(gl, type, source);
    }
}
