import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { useContexts } from '../providers/AppProvider';
import {
  CAMERA_OFF,
  CAMERA_PHOTO_INTERVAL_MS,
  CAMERA_PHOTO_LIMIT,
  CAMERA_READY,
  CAMERA_STARTING,
} from '../lib/const';
import { Camera as CameraIcon, CameraOff, RefreshCw } from 'react-feather';
import { X } from 'react-feather';
import { componentLoadingStyles } from '../styles/componentLoadingStyles';
import { addTextWatermarkToBase64 } from '../lib/watermark';
import { Profiles } from '../lib/Profiles';

const Camera: React.FC = () => {
  const webcamRef = React.useRef<Webcam>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    photos,
    setPhotos,
    cameraStatus,
    cameraStatusRef,
    setCameraStatus,
    replaceInstructions,
    isNightMode,
  } = useContexts();

  const [facingMode, setFacingMode] = useState('user');

  const [cameraCount, setCameraCount] = useState(0);

  const componentLoading = componentLoadingStyles({ isNightMode });

  const [profiles, setProfiles] = useState<Profiles>(new Profiles());

  useEffect(() => {
    console.log('cameraStatus:', cameraStatus);
    cameraStatusRef.current = cameraStatus;

    if (cameraStatus === CAMERA_READY) {
      replaceInstructions('现在我的摄像头是关闭的', '现在我的摄像头是打开的');
    }

    if (cameraStatus === CAMERA_OFF) {
      setPhotos([]);
      replaceInstructions('现在我的摄像头是打开的', '现在我的摄像头是关闭的');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraStatus]);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput',
        );
        setCameraCount(videoDevices.length);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    getCameras();
  }, []);

  const toggleCameraModel = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const handleWebcamReady = (e: MediaStream) => {
    console.log('handleWebcamReady', e);
    setCameraStatus(CAMERA_READY);
  };

  const handleClick = () => {
    if (cameraStatus === CAMERA_READY) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (webcamRef.current && cameraStatusRef.current === CAMERA_READY) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) {
          return;
        }

        // add current time as watermark to the image
        const time = new Date().toLocaleTimeString();

        addTextWatermarkToBase64(imageSrc, {
          watermarkText: time,
          xOffset: 50,
          yOffset: 10,
          fontColor: 'rgba(0,0,0)',
        })
          .then((newBase64) => {
            setPhotos((prevPhotos) => {
              return [...prevPhotos, newBase64].slice(-CAMERA_PHOTO_LIMIT);
            });
          })
          .catch((err) => {
            console.error('addTextWatermarkToBase64 error:', err);
            setPhotos((prevPhotos) => {
              return [...prevPhotos, imageSrc].slice(-CAMERA_PHOTO_LIMIT);
            });
          });
      }
    }, CAMERA_PHOTO_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCamera = () => {
    if (cameraStatus === CAMERA_OFF) {
      setCameraStatus(CAMERA_STARTING);
    } else {
      setCameraStatus(CAMERA_OFF);
    }
  };

  const SwitchCameraIcon = () => {
    return cameraStatus === CAMERA_STARTING ? null : (
      <button className="content-block-btn" onClick={toggleCamera}>
        {cameraStatus !== CAMERA_OFF ? <CameraIcon /> : <CameraOff />}
      </button>
    );
  };

  const RefreshCameraIcon = () => {
    return cameraCount > 1 && cameraStatus === CAMERA_READY ? (
      <button
        className="content-block-btn switch"
        style={{ display: cameraStatus !== CAMERA_READY ? 'none' : '' }}
        onClick={toggleCameraModel}
      >
        <RefreshCw />
      </button>
    ) : null;
  };

  const PhotosBrowser = () => {
    return isModalOpen ? (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <div>
            <X style={styles.closeButton} onClick={closeModal} />
          </div>

          {photos.length > 0 ? (
            <div style={styles.imageContainer}>
              {photos.map((base64Img, index) => (
                <img
                  key={index}
                  src={base64Img}
                  alt={`Image ${index + 1}`}
                  style={styles.image}
                />
              ))}
            </div>
          ) : (
            <p>No photos</p>
          )}
        </div>
      </div>
    ) : null;
  };

  return profiles.currentProfile?.isDefaultScene ? (
    <div className="content-block camera container_bg">
      <div>
        <SwitchCameraIcon />
        <RefreshCameraIcon />
      </div>

      {cameraStatus === CAMERA_STARTING && (
        <div style={componentLoading.camLoading}>
          <div style={componentLoading.spinner} key={'camLoading'}></div>
        </div>
      )}

      {cameraStatus !== CAMERA_OFF && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className={'content-block-webcam'}
          onClick={handleClick}
          videoConstraints={{ facingMode }}
          onUserMedia={handleWebcamReady}
        />
      )}

      <PhotosBrowser />
    </div>
  ) : null;
};

const styles = {
  modalOverlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 90000,
  } as React.CSSProperties,
  modalContent: {
    backgroundColor: '#ededed',
    padding: '20px',
    borderRadius: '8px',
    width: '80%',
    maxHeight: '80%',
    overflowY: 'auto' as 'auto',
  } as React.CSSProperties,
  closeButton: {
    marginBottom: '10px',
    cursor: 'pointer',
    float: 'right' as 'right',
    color: '#626262',
  } as React.CSSProperties,
  imageContainer: {
    display: 'flex',
    flexWrap: 'wrap' as 'wrap',
    gap: '10px',
  } as React.CSSProperties,
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover' as 'cover',
  } as React.CSSProperties,
};

export default Camera;
