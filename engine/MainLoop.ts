
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
        console.log(Date.now());
        requestAnimationFrame(this.loop.bind(this));
    }
}
