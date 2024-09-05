export class Firefly {
  xPos: number;
  yPos: number;
  canvasCtx: CanvasRenderingContext2D;
  size: number;
  fillStyle: string;

  constructor(
    xPos: number,
    yPos: number,
    canvasCtx: CanvasRenderingContext2D,
    fillStyle?: string
  ) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.canvasCtx = canvasCtx;
    this.size = 8;
    this.fillStyle = fillStyle ?? "#F7D902";
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
