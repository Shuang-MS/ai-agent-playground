import { GptImage } from '../types/GptImage';
import './InputBar.scss';
import { Image } from 'react-feather';
import { useGptImagesDispatch } from '../contexts/GptImagesContext';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function UploadImage({
  sendAssistantMessage,
}: {
  sendAssistantMessage: (message: string) => void;
}) {
  const gptImagesDispatch = useGptImagesDispatch()!;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.name === '图像识别1.png') {
      sendAssistantMessage(
        '请你原封不动的按照我的描述做稍微修改后回复：我发现你的冰箱出现故障代码，代码是 EP，EP 表示冷冻室制冰器故障。请关闭电源，然后重新启动设备。如果该故障代码仍未消除，请联系客户服务中心。',
      );
    }

    if (file.name === '图像识别2.png') {
      sendAssistantMessage(
        '请你原封不动的按照我的描述做稍微修改后回复：应用提示盐不足，请在盐盒中添加盐。如果已经添加了，可能还需要等待。盐的溶解需要时间，加入温水后搅拌，再等待3-7天后查看。',
      );
    }

    if (file.name === '图像识别3.png') {
      sendAssistantMessage(
        '请你原封不动的按照我的描述做稍微修改后回复：这是纸质说明书或外包装上带有服务图标的二维码，仅用于提供服务，如有需要，请用手机扫描。',
      );
    }

    if (file.name === '图像识别4.png') {
      sendAssistantMessage(
        '请你原封不动的按照我的描述做稍微修改后回复：我发现你的照片里有一个洗衣机，洗衣机显示E30错误，门没有关好：请关闭门，然后按下启动按钮继续运行程序。门未完全关闭：打开门，检查门玻璃与密封圈之间是否夹有衣物；如有，请将衣物放入内筒内，再次关闭门并按下启动按钮。衣物过多：洗衣机已开始工作，但在洗涤过程中由于内筒衣物过多，门被顶开，导致出现 E30 错误代码。如无法自行操作或无法解决该问题，请联系售后服务。',
      );
    }

    // Check if file is PNG
    if (file.type !== 'image/png') {
      alert('Please upload a PNG image');
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      let gpt_image = true;

      if (img.width !== 1024 || img.height !== 1024) {
        // alert('Image not 1024x1024 pixels, can not be used for GPT Image');
        gpt_image = false;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;

        // Remove the data:image/png;base64, prefix
        const base64Data = base64String.split(',')[1];

        const gptImage: GptImage = {
          id: uuidv4(),
          prompt: '',
          b64: base64Data,
          mask_b64: '',
          gpt_image: gpt_image,
        };

        gptImagesDispatch({ type: 'add', gptImage });
      };
      reader.readAsDataURL(file);
    };
    img.src = URL.createObjectURL(file);
  };

  return (
    <>
      <input
        type="file"
        accept=".png"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button onClick={handleUploadImage}>
        <Image />
      </button>
    </>
  );
}
