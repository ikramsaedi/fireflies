import { Firefly } from "./Firefly";
import { drawBackground } from "./drawBackground";
import { randomiseNumInRange } from "./randomiseNumInRange";
import firefliesAudio from "./assets/owl_city-fireflies.mp3";

export const WIDTH = window.innerWidth - 500;
export const HEIGHT = window.innerHeight - 200;

// These are just magic numbers that I found work well with this song
const LOUD_BEAT_AMPLITUDE = 220;
const QUIET_BEAT_AMPLITUDE = 160;

const audio = document.querySelector("#audio") as HTMLAudioElement;
audio.src = firefliesAudio;
audio.addEventListener("play", main);

const fireflies: Firefly[] = [];
function main() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  if (!audio || !canvas) {
    return;
  }
  // Set up the canvas
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

  // This gets the fireflies audio input as a mediastream input
  // It needs to be in the mediastream format so that the analyser node can analyse it
  const source = audioCtx.createMediaStreamSource(
    (audio as any).captureStream()
  );
  // Now the analyser has a mediastream input to analyse so u can grab the frequency data later
  source.connect(analyser);

  // TODO actually understand what this means
  // half of the size of the FFT (Fast Fourier Transform) window
  // The FFT algorithm converts audio data into freq (x) by amplitude (y) data
  // the whole frequency range has been divided into the binCount number of bins
  const bufferLength = analyser.frequencyBinCount;

  // At this point, data array is a bunch of zeroes
  // This is an unsigned 8 bit int array. It has to be like this because
  // the byte frequency data method only accepts unsigned 8 bit int arrays
  const dataArray = new Uint8Array(bufferLength);

  generateFireflies(canvasCtx);
  draw(canvasCtx, analyser, dataArray, bufferLength);
}

function generateFireflies(canvasCtx: CanvasRenderingContext2D) {
  for (let i = 0; i < 15; i++) {
    const xPos = randomiseNumInRange(100, WIDTH - 100);
    const yPos = randomiseNumInRange(100, HEIGHT - 100);

    fireflies.push(new Firefly(xPos, yPos, canvasCtx));
  }
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

  // TODO make sure background loads immediately
  drawBackground(canvasCtx);

  // each item in the array represents the decibel value for a specific frequency.
  // This is where the data array is actually filled with values
  // each bin takes up a byte (can have val between 0-255)
  // this is a list of amplitudes which are indexed by frequency bin
  analyser.getByteFrequencyData(dataArray);

  const halfFirefliesIndex = Math.floor(fireflies.length / 2);
  // For each decibel amplitude value in the data array that is higher than my arbitrary threshold of 170
  // redraw the fireflies. this way they will move with the music
  // The louder the music, the higher the amplitude (and also the more decibel values in a row that are higher than the threshold)
  // Therefore the fireflies will move more quickly when the music is louder as they are redrawn more frequently

  // going from lowest freq to highest freq
  for (let i = 0; i < bufferLength; i++) {
    if (dataArray[i] > LOUD_BEAT_AMPLITUDE) {
      for (let j = 0; j < halfFirefliesIndex; j++) {
        fireflies[j].update();
      }
    } else if (dataArray[i] > QUIET_BEAT_AMPLITUDE) {
      for (let j = halfFirefliesIndex; j < fireflies.length; j++) {
        fireflies[j].update();
      }
    }
  }
}
