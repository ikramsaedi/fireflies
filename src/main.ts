import { Firefly } from "./Firefly";

const WIDTH = window.innerWidth - 500;
const HEIGHT = window.innerHeight - 200;

const audio = document.querySelector("#audio") as HTMLAudioElement;
audio.addEventListener("play", main);
function main() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  if (!audio || !canvas) {
    return;
  }
  const canvasCtx = canvas.getContext("2d");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const audioCtx = new AudioContext();

  if (!audioCtx || !canvasCtx) {
    return;
  }
  // This helps u create an analyser node
  // Which gets u all the frequency data
  const analyser = audioCtx.createAnalyser();

  const source = audioCtx.createMediaStreamSource(
    (audio as any).captureStream()
  );
  // Now the analyser has a mediastream input to analyse so u can grab the frequency data later
  source.connect(analyser);

  analyser.fftSize = 2048;

  const bufferLength = analyser.frequencyBinCount;
  // At this point, data array is a bunch of zeroes
  const dataArray = new Uint8Array(bufferLength);

  draw(canvasCtx, analyser, dataArray, bufferLength);
}

function randomiseNumInRange(floor: number, ceil: number) {
  const range = ceil - floor + 1;
  return Math.floor(Math.random() * range) + floor;
}

function draw(
  canvasCtx: CanvasRenderingContext2D,
  analyser: AnalyserNode,
  dataArray: Uint8Array,
  bufferLength: number
) {
  requestAnimationFrame(() =>
    draw(canvasCtx, analyser, dataArray, bufferLength)
  );

  // each item in the array represents the decibel value for a specific frequency.
  // This is where the data array is actually filled with values
  analyser.getByteFrequencyData(dataArray);

  // TODO make sure abckground loads immediately
  // Make background
  const gradient = canvasCtx.createRadialGradient(
    WIDTH / 2,
    HEIGHT / 2,
    HEIGHT / 8,
    WIDTH / 2,
    HEIGHT / 2,
    HEIGHT / 1.5
  );
  gradient.addColorStop(0, "#10265B");
  gradient.addColorStop(1, "#0E0E28");
  canvasCtx.fillStyle = gradient;
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  const FIREFLY_SIZE = 8;

  for (let i = 0; i < bufferLength; i++) {
    if (dataArray[i] > 250) {
      const firefly = new Firefly(500, 400, canvasCtx);
      firefly.draw();
      // // it's a BEAT
      // canvasCtx.fillStyle = `#F7D902`;
      // canvasCtx.beginPath();
      // // Needs to be randomised between

      // Math.random();
      // // 100 -> WIDTH - 100,
      // // 100 -> HEIGHT - 100

      // // Now randomise it
      // // fuck :skull:

      // // OK WE WANT TO TRIGGER AN ANIMATION INSTEAD
      // // maybe randomise
      // const xPos = randomiseNumInRange(100, WIDTH - 100);
      // const yPos = randomiseNumInRange(100, HEIGHT - 100);
      // canvasCtx.arc(xPos, yPos, FIREFLY_SIZE, 0, 2 * Math.PI);
      // canvasCtx.shadowBlur = 30;
      // canvasCtx.shadowColor = "#F7D902";
      // canvasCtx.fill();
    } else if (dataArray[i] > 220) {
      canvasCtx.fillStyle = `#F7D902`;
      canvasCtx.beginPath();
      canvasCtx.arc(800, 600, FIREFLY_SIZE, 0, 2 * Math.PI);
      canvasCtx.fill();
    } else if (dataArray[i] > 200) {
      canvasCtx.fillStyle = `#F7D902`;
      canvasCtx.beginPath();
      canvasCtx.arc(300, 100, FIREFLY_SIZE, 0, 2 * Math.PI);
      canvasCtx.fill();
    }
  }
}
