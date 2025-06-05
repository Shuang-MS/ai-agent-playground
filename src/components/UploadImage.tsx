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
      sendAssistantMessage('根据照片描述，冰箱出现故障代码 EP，怎么办？');
    }

    if (file.name === '图像识别2.png') {
      sendAssistantMessage('根据照片描述，应用提示盐不足，怎么解决？');
    }

    if (file.name === '图像识别3.png') {
      sendAssistantMessage(
        '根据照片描述，纸质说明书或外包装上带有服务图标的二维码，是什么？',
      );
    }

    if (file.name === '图像识别4.png') {
      sendAssistantMessage('根据照片描述，洗衣机显示E30错误，怎么办？');
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
