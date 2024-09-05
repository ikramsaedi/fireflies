export class Firefly {
  xPos: number;
  yPos: number;
  canvasCtx: CanvasRenderingContext2D;
  size: number;

  constructor(xPos: number, yPos: number, canvasCtx: CanvasRenderingContext2D) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.canvasCtx = canvasCtx;
    this.size = 8;
  }

  draw() {
    this.canvasCtx.fillStyle = `#F7D902`;
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(this.xPos, this.yPos, this.size, 0, 2 * Math.PI);
    this.canvasCtx.shadowBlur = 30;
    this.canvasCtx.shadowColor = "#F7D902";
    this.canvasCtx.fill();
  }
}
