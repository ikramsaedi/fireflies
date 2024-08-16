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
  // Now the analyser has a mediastream input to analyse so u can grab the frequency data later
  source.connect(analyser);

  analyser.fftSize = 2048;

  const bufferLength = analyser.frequencyBinCount;
  // At this point, data array is a bunch of zeroes
  const dataArray = new Uint8Array(bufferLength);

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

  // each item in the array represents the decibel value for a specific frequency.
  // This is where the data array is actually filled with values
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = "rgb(0 0 0)";
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  for (let i = 0; i < bufferLength; i++) {
    if (dataArray[i] > 250) {
      // it's a BEAT
      canvasCtx.fillStyle = `rgb(50 50 50)`;
      canvasCtx.beginPath();
      canvasCtx.arc(100, 75, 50, 0, 2 * Math.PI);
      canvasCtx.fill();
    } else if (dataArray[i] > 220) {
      canvasCtx.fillStyle = `rgb(50 50 50)`;
      canvasCtx.beginPath();
      canvasCtx.arc(200, 0, 50, 0, 2 * Math.PI);
      canvasCtx.fill();
    } else if (dataArray[i] > 200) {
      canvasCtx.fillStyle = `rgb(50 50 50)`;
      canvasCtx.beginPath();
      canvasCtx.arc(0, 150, 50, 0, 2 * Math.PI);
      canvasCtx.fill();
    }
    //  else if (dataArray[i] > 190) {
    //   canvasCtx.fillStyle = `rgb(50 50 50)`;
    //   canvasCtx.beginPath();
    //   canvasCtx.arc(300, 200, 50, 0, 2 * Math.PI);
    //   canvasCtx.fill();
    // } else if (dataArray[i] > 180) {
    //   canvasCtx.fillStyle = `rgb(50 50 50)`;
    //   canvasCtx.beginPath();
    //   canvasCtx.arc(500, 200, 50, 0, 2 * Math.PI);
    //   canvasCtx.fill();
    // }
  }
}
