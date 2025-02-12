import { Firefly } from "./Firefly";
import { drawBackground } from "./drawBackground";
import { randomiseNumInRange } from "./randomiseNumInRange";
import firefliesAudio from "./assets/owl_city-fireflies.mp3";

// TODO be able to actually resize the canvas
export const WIDTH = window.innerWidth - 500;
export const HEIGHT = window.innerHeight;
const numFireflies = 70;

// These are just magic numbers that I found work well with this song
const LOUD_BEAT_AMPLITUDE = 220;
const QUIET_BEAT_AMPLITUDE = 160;

const audio = document.querySelector("#audio") as HTMLAudioElement;
audio.src = firefliesAudio;
audio.addEventListener("play", onPlay);

function onPlay() {
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
  // This helps you create an analyser node
  // Which gets you all the frequency data
  const analyser = audioCtx.createAnalyser();

  // This gets the fireflies audio input as a mediastream input
  // It needs to be in the mediastream format so that the analyser node can analyse it
  const source = audioCtx.createMediaStreamSource(
    // Has to be typed as any because captureStream as a type doesn't exist
    // on HTML Audio Elements... even though it is a real method on that element..
    (audio as any).captureStream()
  );
  // Now the analyser has a mediastream input to analyse so you can grab the frequency data later
  source.connect(analyser);

  // half of the size of the FFT (Fast Fourier Transform) window
  // The FFT algorithm converts audio data into freq (x) by amplitude (y) data
  // the whole frequency range has been divided into the binCount number of bins
  // As a result there will be 1024 bins
  const bufferLength = analyser.frequencyBinCount;

  // At this point, data array is a bunch of zeroes eg: [0,0,0,0,0,0...]
  // This is an unsigned 8 bit int array. It has to be like this because
  // the byte frequency data method only accepts unsigned 8 bit int arrays
  const dataArray = new Uint8Array(bufferLength);
  // PRESENTER NOTE:
  // console.debug("dataArray", dataArray);

  const fireflies = generateFireflies(canvasCtx, canvas.width, canvas.height);
  draw(canvasCtx, analyser, dataArray, bufferLength, fireflies);
}

function generateFireflies(
  canvasCtx: CanvasRenderingContext2D,
  width: number,
  height: number
): Firefly[] {
  const fireflies = [];
  for (let i = 0; i < numFireflies; i++) {
    // Set the initial position of each firefly in random spots of the canvas
    const xPos = randomiseNumInRange(100, width - 100);
    const yPos = randomiseNumInRange(100, height - 100);

    fireflies.push(new Firefly(xPos, yPos, canvasCtx));
  }
  return fireflies;
}

function draw(
  canvasCtx: CanvasRenderingContext2D,
  analyser: AnalyserNode,
  dataArray: Uint8Array,
  bufferLength: number,
  fireflies: Firefly[]
) {
  requestAnimationFrame(() =>
    draw(canvasCtx, analyser, dataArray, bufferLength, fireflies)
  );

  drawBackground(canvasCtx);

  // This is where the data array is actually filled with values
  // and is populated with an array of amplitudes (decibel value dB) which are indexed by frequency bin (Hz range)
  // The order is that the lowest frequency bin is first and the highest frequency is last
  analyser.getByteFrequencyData(dataArray);
  // PRESENTER NOTE:
  // console.log("filled dataArray", dataArray);

  const halfFirefliesIndex = Math.floor(fireflies.length / 2);
  // For each decibel amplitude value in the data array that is higher than my arbitrary threshold of 170
  // redraw the fireflies. this way they will move with the music
  // The louder the music, the higher the amplitude (and also the more decibel values in a row that are higher than the threshold)
  // Therefore the fireflies will move more quickly, and get more opaque when the music is louder as they are redrawn more frequently
  for (let i = 0; i < bufferLength; i++) {
    // Loud half of fireflies
    if (dataArray[i] > LOUD_BEAT_AMPLITUDE) {
      for (let j = 0; j < halfFirefliesIndex; j++) {
        fireflies[j].update();
      }
      // Quiet half of fireflies
    } else if (dataArray[i] > QUIET_BEAT_AMPLITUDE) {
      for (let j = halfFirefliesIndex; j < fireflies.length; j++) {
        fireflies[j].update();
      }
    }
  }
}
