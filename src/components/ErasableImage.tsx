import React, { useRef, useEffect, useState } from 'react';

interface ErasableImageProps {
  imageBase64: string; // 形如 data:image/png;base64,xxx
  width?: number; // 画布宽度，默认 400
  height?: number; // 画布高度，默认 400
  eraserRadius?: number; // 橡皮擦半径，默认 20
  onImageChange?: (base64: string) => void; // 擦除后image变化时触发
}

const ErasableImage: React.FC<ErasableImageProps> = ({
  imageBase64,
  width = 300,
  height = 300,
  eraserRadius = 20,
  onImageChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isErasing = useRef<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new window.Image();
    img.src = imageBase64;
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      setImgLoaded(true);
    };
    img.onerror = () => {
      setImgLoaded(false);
    };
  }, [imageBase64, width, height]);

  useEffect(() => {
    if (!imgLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
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
        const base64 = canvas.toDataURL('image/png');
        if (onImageChange) {
          onImageChange(base64);
        }
      }
    };

    // 事件监听绑定
    canvas.addEventListener('mousedown', startErase as EventListener);
    window.addEventListener('mousemove', eraseMove as EventListener);
    window.addEventListener('mouseup', endErase as EventListener);

    canvas.addEventListener('touchstart', startErase as EventListener);
    window.addEventListener('touchmove', eraseMove as EventListener, {
      passive: false,
    });
    window.addEventListener('touchend', endErase as EventListener);

    // 事件解绑
    return () => {
      canvas.removeEventListener('mousedown', startErase as EventListener);
      window.removeEventListener('mousemove', eraseMove as EventListener);
      window.removeEventListener('mouseup', endErase as EventListener);

      canvas.removeEventListener('touchstart', startErase as EventListener);
      window.removeEventListener('touchmove', eraseMove as EventListener);
      window.removeEventListener('touchend', endErase as EventListener);
    };
  }, [imgLoaded, eraserRadius, onImageChange]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        border: 'none',
        display: 'block',
        touchAction: 'none',
        background: 'black',
        zIndex: 1000,
      }}
    />
  );
};

export default ErasableImage;
