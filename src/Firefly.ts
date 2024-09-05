import { HEIGHT, WIDTH } from "./main";

export class Firefly {
  xPos: number;
  yPos: number;
  canvasCtx: CanvasRenderingContext2D;
  fillStyle: string;

  radius: number = 8;
  dx: number = 1;
  dy: number = 1;

  constructor(
    xPos: number,
    yPos: number,
    canvasCtx: CanvasRenderingContext2D,
    fillStyle?: string
  ) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.canvasCtx = canvasCtx;
    this.fillStyle = fillStyle ?? "#F7D902";
  }

  draw() {
    this.canvasCtx.fillStyle = `#F7D902`;
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
    this.canvasCtx.shadowBlur = 30;
    this.canvasCtx.shadowColor = "#F7D902";
    this.canvasCtx.fill();
  }

  update() {
    // Ensure they bounce off horizontal edges
    if (this.xPos + this.radius >= WIDTH - 100 || this.xPos - this.radius < 0) {
      this.dx = -this.dx;
    }

    // Ensure they bounce off vertical edges
    if (
      this.yPos + this.radius >= HEIGHT - 100 ||
      this.yPos - this.radius < 0
    ) {
      this.dy = -this.dy;
    }

    this.xPos += this.dx;
    this.yPos += this.dy;

    this.draw();
  }
}
