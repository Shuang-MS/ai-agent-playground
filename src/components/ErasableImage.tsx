import React, { useRef, useEffect, useState } from 'react';
import transparent from '../../src/static/transparent.png';
import { GptImage } from '../types/GptImage';
import { useGptImagesDispatch } from '../contexts/GptImagesContext';
interface ErasableImageProps {
  width?: number;
  height?: number;
  eraserRadius?: number;
  gptImage: GptImage;
}

const ErasableImage: React.FC<ErasableImageProps> = ({
  width = 1024,
  height = 1024,
  eraserRadius = 20,
  gptImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isErasing = useRef<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const gptImagesDispatch = useGptImagesDispatch()!;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const img = new window.Image();
    img.src = `data:image/png;base64,${gptImage?.mask_b64_json ? gptImage.mask_b64_json : gptImage.b64_json}`;
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      setImgLoaded(true);
    };
    img.onerror = () => {
      setImgLoaded(false);
    };
  }, [gptImage, width, height]);

  useEffect(() => {
    if (!imgLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    interface PointerPos {
      x: number;
      y: number;
    }
    let lastPos: PointerPos | null = null;

    const getPointerPos = (e: MouseEvent | TouchEvent): PointerPos => {
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;
      if ('touches' in e && e.touches.length) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e && 'clientY' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      } else {
        clientX = 0;
        clientY = 0;
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const eraseAtPos = (x: number, y: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, eraserRadius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    };

    const eraseLine = (from: PointerPos, to: PointerPos) => {
      const dist = Math.hypot(to.x - from.x, to.y - from.y);
      const steps = Math.max(1, Math.ceil(dist / (eraserRadius / 2)));
      for (let i = 0; i <= steps; i++) {
        const x = from.x + ((to.x - from.x) * i) / steps;
        const y = from.y + ((to.y - from.y) * i) / steps;
        eraseAtPos(x, y);
      }
    };

    const startErase = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isErasing.current = true;
      lastPos = getPointerPos(e);
      eraseAtPos(lastPos.x, lastPos.y);
    };

    const eraseMove = (e: MouseEvent | TouchEvent) => {
      if (!isErasing.current) return;
      e.preventDefault();
      const pos = getPointerPos(e);
      if (lastPos) {
        eraseLine(lastPos, pos);
      } else {
        eraseAtPos(pos.x, pos.y);
      }
      lastPos = pos;
    };

    const endErase = () => {
      isErasing.current = false;
      lastPos = null;

      if (canvas) {
        // Ensure the canvas has an alpha channel
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d', { alpha: true });

        if (tempCtx) {
          // Draw the current canvas content to the temporary canvas
          tempCtx.drawImage(canvas, 0, 0);

          // Get the image data to ensure alpha values are preserved
          const imageData = tempCtx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          );

          // Convert to base64 with alpha channel preserved
          const base64 = tempCanvas.toDataURL('image/png');

          gptImagesDispatch({
            type: 'change',
            gptImage: {
              ...gptImage,
              mask_b64_json: base64.replace('data:image/png;base64,', ''),
            },
          });
        }
      }
    };

    canvas.addEventListener('mousedown', startErase as EventListener);
    window.addEventListener('mousemove', eraseMove as EventListener);
    window.addEventListener('mouseup', endErase as EventListener);

    canvas.addEventListener('touchstart', startErase as EventListener);
    window.addEventListener('touchmove', eraseMove as EventListener, {
      passive: false,
    });
    window.addEventListener('touchend', endErase as EventListener);

    return () => {
      canvas.removeEventListener('mousedown', startErase as EventListener);
      window.removeEventListener('mousemove', eraseMove as EventListener);
      window.removeEventListener('mouseup', endErase as EventListener);

      canvas.removeEventListener('touchstart', startErase as EventListener);
      window.removeEventListener('touchmove', eraseMove as EventListener);
      window.removeEventListener('touchend', endErase as EventListener);
    };
  }, [imgLoaded, eraserRadius]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: 'none',
        display: 'block',
        touchAction: 'none',
        background: `url(${transparent})`,
        cursor: 'crosshair',
      }}
    />
  );
};

export default ErasableImage;
