import { HEIGHT, WIDTH } from "./main";

export class Firefly {
  xPos: number;
  yPos: number;
  canvasCtx: CanvasRenderingContext2D;

  fillStyle: string = "#F7D902";
  radius: number = 5;
  speed: number = 0.5;
  dx: number = Math.random() < 0.5 ? -this.speed : this.speed;
  dy: number = Math.random() < 0.5 ? -this.speed : this.speed;

  constructor(xPos: number, yPos: number, canvasCtx: CanvasRenderingContext2D) {
    this.xPos = xPos;
    this.yPos = yPos;
    this.canvasCtx = canvasCtx;
  }

  draw() {
    this.canvasCtx.fillStyle = this.fillStyle;
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(this.xPos, this.yPos, this.radius, 0, 2 * Math.PI);
    this.canvasCtx.shadowBlur = 10;
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

    // Move in staggered motions
    this.xPos += Math.random() * 1.7 * this.dx - this.dx;
    this.yPos += Math.random() * 1.7 * this.dy - this.dy;

    this.draw();
  }
}
