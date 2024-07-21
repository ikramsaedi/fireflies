const WIDTH = 500;
const HEIGHT = 300;

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

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 2048;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  console.log("loaf data array", dataArray);
  // canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
  draw(canvasCtx, analyser, dataArray, bufferLength);
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

  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = "rgb(0 0 0)";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  const barWidth = (WIDTH / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];
    console.log("loaf barheight", barHeight);

    canvasCtx.fillStyle = `rgb(${barHeight + 100} 50 50)`;
    canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

    x += barWidth + 1;
  }
}
