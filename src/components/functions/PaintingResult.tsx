import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import { GptImage } from '../../types/GptImage';
import { Image } from 'react-feather';
import { useGptImages } from '../../contexts/GptImagesContext';
import { useContexts } from '../../providers/AppProvider';
import { modalStyles } from '../../styles/modalStyles';
import transparent from '../../../src/static/transparent.png';
import EditMaskImage from './EditMaskImage';

const PaintingResult: React.FC = () => {
  const images = useGptImages();
  const [isShow, setIsShow] = useState(false);
  const { isNightMode } = useContexts();

  const importModalStyles = modalStyles({ isNightMode });
  const [editImage, setEditImage] = useState<GptImage | null>(null);

  useEffect(() => {
    if (!isShow) {
      setEditImage(null);
    }
  }, [isShow, setEditImage]);

  const styles = {
    content: {
      padding: '10px',
      flexWrap: 'wrap',
      gap: '10px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(25%, 1fr))',
      gridGap: '10px',
    } as React.CSSProperties,
    img: {
      width: '290px',
      height: 'auto',
      objectFit: 'contain',
    } as React.CSSProperties,
  };

  useEffect(() => {
    setIsShow(images.length > 0);
  }, [images, setIsShow, setEditImage]);

  const ImageItem = ({
    image,
    onClick,
    isLast = false,
  }: {
    image: GptImage;
    onClick: () => void;
    isLast?: boolean;
  }) => {
    const b64 = image.mask_b64 ? image.mask_b64 : image.b64;
    return (
      <img
        src={`data:image/png;base64,${isLast ? b64 : image.b64}`}
        alt={image.prompt}
        style={{
          ...styles.img,
          background: `url(${transparent})`,
          opacity: isLast ? 1 : 0.7,
          cursor: isLast ? 'pointer' : 'not-allowed',
        }}
        onClick={isLast ? onClick : undefined}
      />
    );
  };

  const ShowPainting = () => {
    if (!isShow) {
      return null;
    }

    return (
      <div style={importModalStyles.backdrop}>
        <div style={{ ...importModalStyles.modal }} className={'modal'}>
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
            {images.length === 0 && <div key={'no-images'}>No images</div>}

            {images.map((image: GptImage, index: number) => (
              <ImageItem
                key={image.id}
                image={image}
                onClick={() => {
                  setEditImage(image);
                }}
                isLast={index === images.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {images.length > 0 && (
        <span onClick={() => setIsShow(true)}>
          <Image />
        </span>
      )}
      <EditMaskImage editImage={editImage} setEditImage={setEditImage} />
      <ShowPainting />
    </>
  );
};

export default PaintingResult;
