import { Firefly } from "./Firefly";

export const WIDTH = window.innerWidth - 500;
export const HEIGHT = window.innerHeight - 200;

const audio = document.querySelector("#audio") as HTMLAudioElement;
audio.addEventListener("play", main);
const fireflies: Firefly[] = [];
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

  for (let i = 0; i < 15; i++) {
    const xPos = randomiseNumInRange(100, WIDTH - 100);
    const yPos = randomiseNumInRange(100, HEIGHT - 100);

    fireflies.push(new Firefly(xPos, yPos, canvasCtx));
  }

  console.log("loaf fireflies", fireflies);
  draw(canvasCtx, analyser, dataArray, bufferLength);
}

export function randomiseNumInRange(floor: number, ceil: number) {
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

  drawBackground(canvasCtx);

  // each item in the array represents the decibel value for a specific frequency.
  // This is where the data array is actually filled with values
  analyser.getByteFrequencyData(dataArray);

  for (let i = 0; i < bufferLength; i++) {
    // TODO stop hard coding these values when your brain wakes up
    if (dataArray[i] > 220) {
      fireflies[0].update();
      fireflies[1].update();
      fireflies[2].update();
      fireflies[3].update();
      fireflies[4].update();
      fireflies[5].update();
    } else if (dataArray[i] > 170) {
      fireflies[6].update();
      fireflies[7].update();
      fireflies[8].update();
      fireflies[9].update();
      fireflies[10].update();
    }
  }
}

// TODO make sure abckground loads immediately
function drawBackground(canvasCtx: CanvasRenderingContext2D) {
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
}
