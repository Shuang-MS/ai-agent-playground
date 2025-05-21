import React, { useEffect, useCallback } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { useContexts } from '../providers/AppProvider';
import { AVATAR_READY, SPEECH_LANGUAGE_DEFAULT } from '../lib/const';
import { Profiles } from '../lib/Profiles';
import TaskQueue from './speech_queue';

const speechLanguageMap: Record<string, string> = {
  SPEECH_LANGUAGE_ZH_CN: 'zh-CN-Xiaoxiao:DragonHDFlashLatestNeural',
  SPEECH_LANGUAGE_EN_US: 'en-US-AvaMultilingualNeural',
  SPEECH_LANGUAGE_VI_VN: 'vi-VN-HoaiMyNeural',
  SPEECH_LANGUAGE_TH_TH: 'th-TH-AcharaNeural',
  SPEECH_LANGUAGE_JA_JP: 'ja-JP-NanamiNeural',
  SPEECH_LANGUAGE_KO_KR: 'ko-KR-SunHiNeural',
  SPEECH_LANGUAGE_MS_MY: 'ms-MY-YasminNeural',
};

const SpeechTTS: React.FC = () => {
  const { needSpeechQueueRef, avatarStatusRef, setNeedSpeechQueue } =
    useContexts();

  const profiles = new Profiles();
  const profile = profiles.currentProfile;

  const speechKey = profile?.cogSvcSubKey || '';
  const serviceRegion = profile?.cogSvcRegion || '';

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    serviceRegion,
  );

  speechConfig.speechSynthesisVoiceName =
    speechLanguageMap[profile?.detectLanguage || SPEECH_LANGUAGE_DEFAULT];

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const speak = async (text: string) => {
    try {
      if (!text.trim()) return;

      if (!speechKey || !serviceRegion) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        synthesizer.speakTextAsync(
          text,
          (result) => {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              console.log(`Speech synthesized for text [${text}]`);

              resolve();
            } else if (result.reason === sdk.ResultReason.Canceled) {
              const cancellation = sdk.CancellationDetails.fromResult(result);
              console.error(
                `Speech synthesis canceled: ${cancellation.reason}`,
              );
              if (cancellation.reason === sdk.CancellationReason.Error) {
                console.error(`Error details: ${cancellation.errorDetails}`);
              }
              reject(
                new Error(`Speech synthesis canceled: ${cancellation.reason}`),
              );
            }
          },
          (err) => {
            console.error(err);
            synthesizer.close();
            reject(err);
          },
        );
      });
    } catch (error) {
      console.error('Error fetching audio stream:', error);
    }
  };

  const addTask = useCallback(
    (text: string) => {
      TaskQueue.enqueue(async () => {
        await speak(text);
      }).catch(() => {});
    },
    [speak],
  );

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (avatarStatusRef.current === AVATAR_READY) {
        return;
      }

      if (needSpeechQueueRef?.current?.length === 0) {
        return;
      }

      const current_text = needSpeechQueueRef.current[0];
      addTask(current_text);
      setNeedSpeechQueue(needSpeechQueueRef.current.slice(1));
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarStatusRef, needSpeechQueueRef]);

  return null;
};

export default SpeechTTS;
