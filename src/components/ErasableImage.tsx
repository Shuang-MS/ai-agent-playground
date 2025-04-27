import React, { useRef, useEffect, useState } from 'react';

// 定义组件 props 的类型
export interface EraserProps {
  src: string; // base64 PNG 图片（dataURL 形式）
  width?: number; // 画布宽度（可选，不填则用图片宽度）
  height?: number; // 画布高度（可选，不填则用图片高度）
  size?: number; // 橡皮擦直径（可选，默认 20）
  onFinish?: (newBase64: string) => void; // 松开鼠标/手指后的回调
}

const Eraser: React.FC<EraserProps> = ({
  src,
  width,
  height,
  size = 20,
  onFinish,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({
    width: width ?? 1,
    height: height ?? 1,
  });

  // 图片加载与初始化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const iw = width ?? img.width;
      const ih = height ?? img.height;
      canvas.width = iw;
      canvas.height = ih;
      setImgSize({ width: iw, height: ih });
      ctx.clearRect(0, 0, iw, ih);
      ctx.drawImage(img, 0, 0, iw, ih);
    };
  }, [src, width, height]);

  // 获取鼠标或触摸坐标
  const getPos = (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    let x = 0,
      y = 0;
    if ('touches' in e && e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else if ('nativeEvent' in e) {
      const mouseEvent = e as React.MouseEvent<HTMLCanvasElement, MouseEvent>;
      x = mouseEvent.nativeEvent.offsetX;
      y = mouseEvent.nativeEvent.offsetY;
    }
    return { x, y };
  };

  // 实际擦除函数
  const erase = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
  };

  // 事件处理
  const handleStart = (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getPos(e);
    erase(x, y);
  };

  const handleMove = (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    erase(x, y);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    if (onFinish && canvasRef.current) {
      const data = canvasRef.current.toDataURL('image/png');
      onFinish(data);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={imgSize.width}
      height={imgSize.height}
      style={{
        touchAction: 'none',
        display: 'block',
        border: '1px solid #aaa',
        background: 'transparent',
      }}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    />
  );
};

export default Eraser;
