import { Send } from 'react-feather';

import { useContexts } from '../providers/AppProvider';
import './InputBar.scss';
import { CONNECT_CONNECTED, SHORTCUTS } from '../lib/const';
import { RealtimeClient } from '@theodoreniu/realtime-api-beta';
import { WavStreamPlayer } from '../lib/wavtools';
import { RecommendText } from './RecommendText';
import { UploadImage } from './UploadImage';
import { Profiles } from '../lib/Profiles';

export function InputBarRealtime({
  wavStreamPlayer,
  realtimeClient,
}: {
  wavStreamPlayer: WavStreamPlayer;
  realtimeClient: RealtimeClient;
}) {
  const { setInputValue, setResponseBuffer, inputValue, connectStatus } =
    useContexts();

  const cancelRealtimeResponse = async () => {
    const trackSampleOffset = wavStreamPlayer.interrupt();
    if (trackSampleOffset?.trackId) {
      const { trackId, offset } = trackSampleOffset;
      realtimeClient.cancelResponse(trackId, offset);
    }
  };

  const { resetTokenLatency } = useContexts();

  const sendText = async (inputValue: string) => {
    if (!inputValue.trim()) return;
    setResponseBuffer('');

    resetTokenLatency();

    cancelRealtimeResponse();
    realtimeClient.sendUserMessageContent([
      {
        type: `input_text`,
        text: inputValue,
      },
    ]);
    setInputValue('');
    console.log('send text', inputValue);
    return;
  };
  const profiles = new Profiles();

  return (
    <>
      {connectStatus === CONNECT_CONNECTED && (
        <div>
          <RecommendText
            handleInputButtonClick={sendText}
            messages={
              SHORTCUTS[
                profiles.currentProfile?.scene as keyof typeof SHORTCUTS
              ]
            }
          />
          <div className="text-input">
            <input
              type="text"
              placeholder="Type your message here..."
              value={inputValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendText(inputValue);
                }
                if (e.key === 'Escape') {
                  setInputValue('');
                }
              }}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <button
              onClick={() => sendText(inputValue)}
              style={{ display: inputValue ? '' : 'none' }}
              disabled={!inputValue}
            >
              <Send />
            </button>

            <UploadImage sendAssistantMessage={sendText} />
          </div>
        </div>
      )}
    </>
  );
}
