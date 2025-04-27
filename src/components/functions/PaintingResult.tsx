import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import { GptImage } from '../../types/GptImage';
import { Image } from 'react-feather';
import { useGptImages } from '../../contexts/GptImagesContext';
import { useContexts } from '../../providers/AppProvider';
import { modalStyles } from '../../styles/modalStyles';
import ErasableImage from '../ErasableImage';

const PaintingResult: React.FC = () => {
  const images = useGptImages();
  const [isShow, setIsShow] = useState(false);
  const { isNightMode, setMaskImage, maskImage } = useContexts();
  const gptImages = useGptImages();
  const importModalStyles = modalStyles({ isNightMode });
  const [editImage, setEditImage] = useState<GptImage | null>(null);

  useEffect(() => {
    if (isShow) {
      setEditImage(null);
      setMaskImage('');
    }
  }, [isShow, setEditImage, setMaskImage]);

  const styles = {
    content: {
      padding: '20px',
      flexWrap: 'wrap',
      gap: '10px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(25%, 1fr))',
      gridGap: '10px',
    } as React.CSSProperties,
    img: {
      width: '300px',
      height: 'auto',
    } as React.CSSProperties,
  };

  useEffect(() => {
    setIsShow(images.length > 0);
  }, [images]);

  function getImageSizeFromBase64(
    base64: string,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = (e) => {
        reject(new Error('图片加载失败'));
      };
      img.src = base64;
    });
  }

  const EditMaskImage = () => {
    if (!editImage) {
      return null;
    }

    // get editImage real size
    (async () => {
      const size = await getImageSizeFromBase64(editImage.b64_json);
      const width = size.width;
      const height = size.height;
      alert(`width: ${width}, height: ${height}`);
    })();

    return (
      <ErasableImage
        imageBase64={
          maskImage ? maskImage : `data:image/png;base64,${editImage.b64_json}`
        }
        width={300}
        height={300}
        eraserRadius={20}
        onImageChange={(image: string) => setMaskImage(image)}
      />
    );
  };

  const ShowPainting = () => {
    if (!isShow) {
      return null;
    }

    return (
      <div style={importModalStyles.backdrop}>
        <div style={importModalStyles.modal} className={'modal'}>
          <div style={importModalStyles.header}>
            <h2>Images</h2>
            <button
              key="close"
              onClick={() => setIsShow(false)}
              style={importModalStyles.closeBtn}
            >
              <X />
            </button>
          </div>

          <EditMaskImage />

          <div style={styles.content}>
            {images.length === 0 && <div>No images</div>}

            {images.map((image: GptImage, index: number) => (
              <img
                src={`data:image/png;base64,${image.b64_json}`}
                alt={image.prompt}
                key={index}
                style={styles.img}
                onClick={() => {
                  if (index + 1 < images.length) {
                    alert('not last image');
                    return;
                  }

                  setEditImage(image);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {gptImages.length > 0 && (
        <span onClick={() => setIsShow(true)}>
          <Image />
        </span>
      )}
      <ShowPainting />
    </>
  );
};

export default PaintingResult;
