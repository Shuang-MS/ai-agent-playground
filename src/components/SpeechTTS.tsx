import React, { useEffect, useCallback } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { useContexts } from '../providers/AppProvider';
import {
  AVATAR_READY,
  SPEECH_LANGUAGE_DEFAULT,
  SPEECH_LANGUAGE_EN_US,
  SPEECH_LANGUAGE_JA_JP,
  SPEECH_LANGUAGE_KO_KR,
  SPEECH_LANGUAGE_MS_MY,
  SPEECH_LANGUAGE_TH_TH,
  SPEECH_LANGUAGE_VI_VN,
  SPEECH_LANGUAGE_ZH_CN,
  SPEECH_METHOD_COMPLETION,
  SPEECH_VOICE_WOMAN,
} from '../lib/const';
import { Profiles } from '../lib/Profiles';
import TaskQueue from './speech_queue';

const speechLanguageMapWoman: Record<string, string> = {
  [SPEECH_LANGUAGE_ZH_CN]: 'zh-CN-Xiaoxiao:DragonHDFlashLatestNeural',
  [SPEECH_LANGUAGE_EN_US]: 'en-US-AvaMultilingualNeural',
  [SPEECH_LANGUAGE_VI_VN]: 'vi-VN-HoaiMyNeural',
  [SPEECH_LANGUAGE_TH_TH]: 'th-TH-AcharaNeural',
  [SPEECH_LANGUAGE_JA_JP]: 'ja-JP-NanamiNeural',
  [SPEECH_LANGUAGE_KO_KR]: 'ko-KR-SunHiNeural',
  [SPEECH_LANGUAGE_MS_MY]: 'ms-MY-YasminNeural',
};

const speechLanguageMapMan: Record<string, string> = {
  [SPEECH_LANGUAGE_ZH_CN]: 'zh-CN-YunxiNeural',
  [SPEECH_LANGUAGE_EN_US]: 'en-US-AndrewMultilingualNeural',
  [SPEECH_LANGUAGE_VI_VN]: 'vi-VN-NamMinhNeural',
  [SPEECH_LANGUAGE_TH_TH]: 'th-TH-NiwatNeural',
  [SPEECH_LANGUAGE_JA_JP]: 'ja-JP-Masaru:DragonHDLatestNeural',
  [SPEECH_LANGUAGE_KO_KR]: 'ko-KR-HyunsuNeural',
  [SPEECH_LANGUAGE_MS_MY]: 'ms-MY-OsmanNeural',
};

const SpeechTTS: React.FC = () => {
  const {
    needSpeechQueueRef,
    avatarStatusRef,
    setNeedSpeechQueue,
    lastMessageTextArrayRef,
    setLastMessageTextArray,
  } = useContexts();

  const profiles = new Profiles();
  const profile = profiles.currentProfile;

  const speechKey = profile?.cogSvcSubKey || '';
  const serviceRegion = profile?.cogSvcRegion || '';

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    serviceRegion,
  );

  const detectLanguage = profile?.detectLanguage || SPEECH_LANGUAGE_DEFAULT;
  const speechSynthesisVoiceName =
    profile?.speechVoice === SPEECH_VOICE_WOMAN
      ? speechLanguageMapWoman[detectLanguage]
      : speechLanguageMapMan[detectLanguage];

  speechConfig.speechSynthesisVoiceName = speechSynthesisVoiceName;

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
              console.log(`Speech synthesized: [${text}]`);

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

      if (profile?.speechMethod === SPEECH_METHOD_COMPLETION) {
        if (lastMessageTextArrayRef.current.length === 0) {
          return;
        }
        const current_text = lastMessageTextArrayRef.current[0];
        addTask(current_text);
        setLastMessageTextArray(lastMessageTextArrayRef.current.slice(1));
      } else {
        if (needSpeechQueueRef?.current?.length === 0) {
          return;
        }
        const current_text = needSpeechQueueRef.current[0];
        addTask(current_text);
        setNeedSpeechQueue(needSpeechQueueRef.current.slice(1));
      }
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarStatusRef, needSpeechQueueRef, lastMessageTextArrayRef]);

  return null;
};

export default SpeechTTS;
