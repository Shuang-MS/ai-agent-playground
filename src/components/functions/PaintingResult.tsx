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
  const { isNightMode, setMaskImage, maskImage } = useContexts();

  const importModalStyles = modalStyles({ isNightMode });
  const [editImage, setEditImage] = useState<GptImage | null>(null);

  useEffect(() => {
    if (!isShow) {
      setEditImage(null);
    }
  }, [isShow, setEditImage, setMaskImage]);

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
    setEditImage(null);
    setMaskImage('');
  }, [images, setIsShow, setEditImage, setMaskImage]);

  const ImageItem = ({
    b64_json,
    prompt,
    onClick,
    isMask = false,
    isLast = false,
  }: {
    b64_json: string;
    prompt: string;
    onClick: () => void;
    isMask?: boolean;
    isLast?: boolean;
  }) => {
    return (
      <img
        src={`data:image/png;base64,${b64_json}`}
        alt={prompt}
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

          <EditMaskImage editImage={editImage} setEditImage={setEditImage} />

          <div style={styles.content}>
            {images.length === 0 && <div key={'no-images'}>No images</div>}

            {images.map((image: GptImage, index: number) => (
              <>
                {image.mask_b64_json && (
                  <ImageItem
                    b64_json={image.mask_b64_json}
                    prompt={image.prompt}
                    isMask={true}
                    onClick={() => {
                      console.log('image', image);
                    }}
                  />
                )}

                <ImageItem
                  b64_json={image.b64_json}
                  prompt={image.prompt}
                  onClick={() => {
                    setEditImage(image);
                  }}
                  isMask={false}
                  isLast={index === images.length - 1}
                />
              </>
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
      <ShowPainting />
    </>
  );
};

export default PaintingResult;
