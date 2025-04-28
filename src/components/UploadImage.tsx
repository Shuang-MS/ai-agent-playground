import { GptImage } from '../types/GptImage';
import './InputBar.scss';
import { Image } from 'react-feather';
import { useGptImagesDispatch } from '../contexts/GptImagesContext';
import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function UploadImage() {
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

    const img = new window.Image();
    img.onload = () => {
      if (img.width !== 1024 || img.height !== 1024) {
        alert('Image must be 1024x1024 pixels');
        return;
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
