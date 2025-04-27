import React from 'react';
import { GptImage } from '../../types/GptImage';
import { useContexts } from '../../providers/AppProvider';
import ErasableImage from '../ErasableImage';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
} as React.CSSProperties;

const closeBtnStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  height: '50px',
  width: '70px',
  fontSize: '18px',
  backgroundColor: 'white',
  border: '1px solid #ccc',
  borderRadius: '5px',
  color: 'black',
  margin: '10px',
  position: 'absolute',
  top: '0',
  right: '0',
} as React.CSSProperties;

const EditMaskImage: React.FC<{
  editImage: GptImage | null;
  setEditImage: (editImage: GptImage | null) => void;
}> = ({ editImage, setEditImage }) => {
  const { setMaskImage, maskImage } = useContexts();

  if (!editImage) {
    return null;
  }

  const open = true;

  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          zIndex: 9999999,
          backgroundColor: 'black',
        }}
      >
        <Box sx={style}>
          <button
            style={{ ...closeBtnStyle, left: '0' }}
            onClick={() => setMaskImage('')}
          >
            Reset
          </button>

          <button
            style={{ ...closeBtnStyle, right: '0' }}
            onClick={() => setEditImage(null)}
          >
            Close
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
        </Box>
      </Modal>
    </div>
  );
};

export default EditMaskImage;
