export class Ticker {
  private _tickAction: (remainingSeconds: number) => void;
  private _remainingMs: number;
  private _targetTime: number;
  private _runningId: NodeJS.Timeout;
  private _lastTick: number;

  public setTickAction(tickAction: (remainingSeconds: number) => void): void {
    this._tickAction = tickAction;
  }

  public start(fullSeconds: number): void {
    this._remainingMs = fullSeconds * 1000;
    this._run();
  }

  public pause(): void {
    this._stop();
  }

  public resume(): void {
    this._run();
  }

  public reset(): void {
    this._targetTime = undefined;
    this._stop();
  }

  public tick(remainingSeconds: number): void {
    if (remainingSeconds !== this._lastTick) {
      this._lastTick = remainingSeconds;
      this._tickAction?.(remainingSeconds);
    }
  }

  private _run() {
    this._targetTime = Date.now() + this._remainingMs;
    if (!this._runningId) {
      this._runningId = setInterval(() => {
        const remainingSeconds = Math.ceil(
          (this._targetTime - Date.now()) / 1000
        );
        this.tick(remainingSeconds);
      }, 50);
    }
  }

  private _stop() {
    if (this._runningId) {
      clearInterval(this._runningId);
      this._runningId = undefined;
    }
    if (this._targetTime === undefined) {
      this._remainingMs = 0;
      this.tick(0);
    } else {
      this._targetTime = undefined;
      this._remainingMs = this._targetTime - Date.now();
    }
  }
}
