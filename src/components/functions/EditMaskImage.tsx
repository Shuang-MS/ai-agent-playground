import React from 'react';
import { X } from 'react-feather';
import { GptImage } from '../../types/GptImage';
import { useContexts } from '../../providers/AppProvider';
import { modalStyles } from '../../styles/modalStyles';
import ErasableImage from '../ErasableImage';

const EditMaskImage: React.FC<{
  editImage: GptImage | null;
  setEditImage: (editImage: GptImage | null) => void;
}> = ({ editImage, setEditImage }) => {
  const { isNightMode, setMaskImage, maskImage } = useContexts();
  const importModalStyles = modalStyles({ isNightMode });

  if (!editImage) {
    return null;
  }

  return (
    <div
      style={{
        ...importModalStyles.backdrop,
        zIndex: 10000,
      }}
    >
      <div
        style={{
          ...importModalStyles.modal,
          width: '1028px',
          height: '1028px',
        }}
      >
        <div style={importModalStyles.header}>
          <h2>Edit Mask Image</h2>
          <button
            key="close"
            onClick={() => setEditImage(null)}
            style={importModalStyles.closeBtn}
          >
            <X />
          </button>
        </div>

        <button
          style={{
            cursor: 'pointer',
            height: '50px',
            width: '70px',
            position: 'absolute',
            fontSize: '18px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            color: 'black',
          }}
          onClick={() => setMaskImage('')}
        >
          Reset
        </button>
        <ErasableImage
          imageBase64={
            maskImage
              ? maskImage
              : `data:image/png;base64,${editImage.b64_json}`
          }
          width={1024}
          height={1024}
          eraserRadius={20}
          onImageChange={(image: string) => setMaskImage(image)}
        />
      </div>
    </div>
  );
};

export default EditMaskImage;
