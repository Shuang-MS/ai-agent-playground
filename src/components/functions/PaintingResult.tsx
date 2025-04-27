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
      zIndex: 1000,
    } as React.CSSProperties,
  };

  useEffect(() => {
    setIsShow(images.length > 0);
  }, [images]);

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

          <div style={styles.content}>
            {images.length === 0 && <div>No images</div>}

            {images.map((image: GptImage, index: number) => (
              <>
                {/* display when not last index */}
                {index + 1 < images.length && (
                  <img
                    src={`data:image/png;base64,${image.b64_json}`}
                    alt={image.prompt}
                    key={index}
                    style={styles.img}
                  />
                )}

                {/* display only last index */}
                {index + 1 >= images.length && (
                  <div style={styles.img}>
                    <ErasableImage
                      key={index}
                      imageBase64={
                        maskImage
                          ? maskImage
                          : `data:image/png;base64,${image.b64_json}`
                      }
                      width={300}
                      height={300}
                      eraserRadius={20}
                      onImageChange={(image: string) => setMaskImage(image)}
                    />
                  </div>
                )}
              </>
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
