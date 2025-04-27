import { GptImage } from '../types/GptImage';
import './InputBar.scss';
import { Image } from 'react-feather';
import { useGptImagesDispatch } from '../contexts/GptImagesContext';
import { useRef } from 'react';

export function UploadImage({}: {}) {
  const gptImagesDispatch = useGptImagesDispatch()!;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is PNG
    if (file.type !== 'image/png') {
      alert('Please upload a PNG image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      // Remove the data:image/png;base64, prefix
      const base64Data = base64String.split(',')[1];

      const gptImage: GptImage = {
        prompt: 'modify the image',
        b64_json: base64Data,
      };

      gptImagesDispatch({ type: 'add', gptImage });
    };
    reader.readAsDataURL(file);
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
