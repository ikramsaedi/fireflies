import { HEIGHT, WIDTH } from "./main";

export function drawBackground(canvasCtx: CanvasRenderingContext2D) {
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
