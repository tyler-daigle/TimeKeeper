import { TimeKeeper } from "./TimeKeeper";

export function updateCounter(value: number) {
  document.getElementById("app")!.innerHTML = value.toString();
}

const tk = new TimeKeeper();
const timer1 = tk.createTimer((seconds) => {
  console.log(seconds);
});

setTimeout(() => {
  const id = tk.createTimer((seconds) => {
    if (seconds === 5) {
      tk.pauseTimer(id);
      setTimeout(() => {
        console.log("Resuming...");
        tk.resumeTimer(id);
      }, 3000);
    }
    if (tk.isTimerRunning(id)) {
      console.log("Second Timer: ", seconds);
    }
  });
}, 2000);
