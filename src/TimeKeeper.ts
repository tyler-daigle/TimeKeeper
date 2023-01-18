/*

  Create multiple timers
  keep track of them
  start and stop/pause each timer
  Kill Timers
  Reset timers
  get the current elapsed number of seconds
  Call a function at a certain elapsed time

  Create one main timer that keeps track of the current time and 
  base all the other timers off of that?

*/
import { v4 as uuidv4 } from "uuid";

type TimerCallback = (currSeconds: number) => void;

interface Timer {
  started: number;
  paused: boolean;
  pausedAt: number;
  callback: TimerCallback;
}

export class TimeKeeper {
  private _globalTimerId: number;
  private _globalSeconds: number = 0;
  // private _callbacks: TimerCallback[]; // array of functions that look like: (numSeconds) => {do whatever}
  private _timers: Map<string, Timer>;

  constructor() {
    const GLOBAL_TICK_INTERVAL = Math.floor(1000 / 60);
    let lastCalled = Date.now();
    let elapsed = 0;
    this._timers = new Map();
    // this._callbacks = [];

    this._globalTimerId = setInterval(() => {
      const now = Date.now();
      elapsed += now - lastCalled;
      if (elapsed >= 1000) {
        elapsed = 0;
        this._globalSeconds += 1;
        this.executeCallbacks();
      }
      lastCalled = now;
    }, GLOBAL_TICK_INTERVAL);
  }

  executeCallbacks() {
    // call the callbacks if they exist and the timer is running
    this._timers.forEach((timer) => {
      if (!timer.paused && timer.callback) {
        timer.callback(this._globalSeconds - timer.started);
      }
    });
  }

  getGlobalSeconds() {
    return this._globalSeconds;
  }

  createTimer(callback: TimerCallback): string {
    const id = uuidv4();
    const timer: Timer = {
      started: this._globalSeconds,
      paused: false,
      pausedAt: 0,
      callback,
    };
    this._timers.set(id, timer);
    return id;
  }

  removeTimer(id: string): number {
    this._timers.delete(id);
    return this._globalSeconds;
  }

  pauseTimer(id: string) {
    const timer = this._timers.get(id);
    if (timer) {
      timer.paused = true;
      timer.pausedAt = this._globalSeconds;
    }
  }

  resumeTimer(id: string) {
    const timer = this._timers.get(id);
    if (timer) {
      timer.paused = false;
      timer.started = timer.started + (this._globalSeconds - timer.pausedAt);
    }
  }

  getElapsedSeconds(id: string) {
    const timer = this._timers.get(id);
    if (timer) {
      const seconds = timer.started - this._globalSeconds;
      return seconds;
    } else {
      throw new Error(`Timer ${id} doesn't exist!`);
    }
  }

  isTimerRunning(id: string) {
    const timer = this._timers.get(id);
    return timer && !timer.paused;
  }

  destroy() {
    clearInterval(this._globalTimerId);
    console.log("Timer Destroyed");
  }
}
