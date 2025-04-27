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
  console.log('src', src);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({
    width: width ?? 300, // 默认宽度设为300
    height: height ?? 300, // 默认高度设为300
  });
  const [error, setError] = useState<string | null>(null);

  // 图片加载与初始化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Canvas元素未找到');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('无法获取Canvas上下文');
      return;
    }

    // 设置初始画布尺寸
    canvas.width = imgSize.width;
    canvas.height = imgSize.height;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 检查src是否有效
    if (!src || typeof src !== 'string' || src.trim() === '') {
      setError('无效的图片源');
      return;
    }

    const img = new window.Image();

    img.onload = () => {
      try {
        const iw = width ?? img.width;
        const ih = height ?? img.height;

        // 更新画布尺寸
        canvas.width = iw;
        canvas.height = ih;
        setImgSize({ width: iw, height: ih });

        // 清空画布并绘制图像
        ctx.clearRect(0, 0, iw, ih);
        ctx.drawImage(img, 0, 0, iw, ih);

        console.log('图像已成功加载到画布', { width: iw, height: ih });
        setError(null);
      } catch (err) {
        console.error('绘制图像时出错:', err);
        setError(
          `绘制图像时出错: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    };

    img.onerror = (err) => {
      console.error('图片加载失败:', err);
      setError('图片加载失败');
    };

    img.src = src;
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
    <div style={{ position: 'relative' }}>
      {error && (
        <div
          style={{
            color: 'red',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(255,255,255,0.8)',
            padding: '5px',
            zIndex: 10,
          }}
        >
          {error}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={imgSize.width}
        height={imgSize.height}
        style={{
          touchAction: 'none',
          display: 'block',
          border: '1px solid #aaa',
          background: 'transparent',
          maxWidth: '100%',
          height: 'auto',
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />
    </div>
  );
};

export default Eraser;
