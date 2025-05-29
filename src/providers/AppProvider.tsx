import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  IMAGE_HAS_NOT_UPLOADED,
  IMAGE_HAS_UPLOADED,
  IMAGE_MODIFY_INSTRUCTIONS_NOT_SPECIFIED,
  IMAGE_MODIFY_INSTRUCTIONS_SPECIFIED,
  SYSTEM_INSTRUCTIONS,
} from '../lib/instructions';
import { v4 as uuidv4 } from 'uuid';

import * as memory from '../tools/default/memory';
import * as weather from '../tools/default/weather';
import * as avatar from '../tools/default/avatar';
import * as order_get from '../tools/default/order_get';
import * as order_return from '../tools/default/order_return';
import * as bing from '../tools/default/bing';
import * as dark from '../tools/default/dark';
import * as news from '../tools/default/news';
import * as location from '../tools/default/location';
import * as stock_recommend from '../tools/default/stock_recommend';
import * as products_recommend from '../tools/default/products_recommend';
import * as demo from '../tools/default/demo';
import * as feishu from '../tools/default/feishu';
import * as background from '../tools/default/background';
import * as open_url from '../tools/default/open_url';
import * as debug_model from '../tools/default/debug_model';
import * as set_disconnection from '../tools/default/set_disconnection';
import * as camera_current from '../tools/default/camera_current';
import * as camera_on from '../tools/default/camera_on';
import * as camera_take_photo from '../tools/default/camera_take_photo';
import * as opacity from '../tools/default/opacity';
import * as devices_action from '../tools/default/devices_action';
import * as camera_video from '../tools/default/camera_video';
import * as painting from '../tools/default/painting';
import * as image_modify from '../tools/default/painting_modify';
import * as azure_docs from '../tools/default/azure_docs';
import * as quote from '../tools/default/quote';
import * as exchange_rate_aim from '../tools/default/exchange_rate_aim';
import * as exchange_rate_list from '../tools/default/exchange_rate_list';
import * as exchange_rate_configs from '../tools/default/exchange_rate_configs';

import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import {
  AVATAR_OFF,
  AVATAR_READY,
  AVATAR_STARTING,
  CAMERA_OFF,
  CAMERA_PHOTO_LIMIT,
  CAMERA_READY,
  CAMERA_STARTING,
  CONNECT_DISCONNECTED,
  SPEECH_METHOD_COMPLETION,
  SPEECH_METHOD_STREAM,
  SCENE_AIR_CONDITIONING,
  SCENE_KITCHEN,
} from '../lib/const';
import {
  editImages,
  getCompletion,
  getImages,
  getOpenAIClient,
} from '../lib/openai';
import { delayFunction } from '../lib/helper';
import { Assistant } from 'openai/resources/beta/assistants';
import { processAndStoreSentence } from '../lib/sentence';
import axios from 'axios';
import { GptImage } from '../types/GptImage';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  useGptImages,
  useGptImagesDispatch,
  useGptImagesRef,
} from '../contexts/GptImagesContext';
import { VectorStore } from 'openai/resources/vector-stores/vector-stores';
import { Profiles } from '../lib/Profiles';
import { GRAPHRAG_ABOUT } from '../tools/default/azure_docs';
import { air_conditioning_control_tools } from '../tools/AirConditioningTools';
import { kitchen_control_tools } from '../tools/KitchenTools';

export type ReplaceInstructionsArray = {
  source: string | RegExp;
  target: string;
};

interface AppContextType {
  photos: string[];
  photosRef: React.RefObject<string[]>;
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;

  debug: boolean;
  debugRef: React.RefObject<boolean>;
  setDebug: React.Dispatch<React.SetStateAction<boolean>>;

  thread: any | null;
  threadRef: React.RefObject<any | null>;
  setThread: React.Dispatch<React.SetStateAction<any | null>>;

  threadJob: any | null;
  threadJobRef: React.RefObject<any | null>;
  setThreadJob: React.Dispatch<React.SetStateAction<any | null>>;

  responseBuffer: string;
  responseBufferRef: React.RefObject<string>;
  setResponseBuffer: React.Dispatch<React.SetStateAction<string>>;

  speechSentencesCacheArray: string[];
  speechSentencesCacheArrayRef: React.RefObject<string[]>;
  setSpeechSentencesCacheArray: React.Dispatch<React.SetStateAction<string[]>>;

  llmInstructions: string;
  llmInstructionsRef: React.RefObject<string>;
  replaceInstructions: (source: string | RegExp, target: string) => string;
  replaceInstructionsArray: (
    instructions: ReplaceInstructionsArray[],
  ) => string;

  cameraStatus: string;
  cameraStatusRef: React.RefObject<string>;
  setCameraStatus: React.Dispatch<React.SetStateAction<string>>;

  connectStatus: string;
  connectStatusRef: React.RefObject<string>;
  setConnectStatus: React.Dispatch<React.SetStateAction<string>>;

  avatarStatus: string;
  avatarStatusRef: React.RefObject<string>;
  setAvatarStatus: React.Dispatch<React.SetStateAction<string>>;

  assistant: Assistant | null;
  assistantRef: React.RefObject<Assistant | null>;
  setAssistant: React.Dispatch<React.SetStateAction<Assistant | null>>;

  vectorStore: VectorStore | null;
  vectorStoreRef: React.RefObject<VectorStore | null>;
  setVectorStore: React.Dispatch<React.SetStateAction<VectorStore | null>>;

  isNightMode: boolean;
  isNightModeRef: React.RefObject<boolean>;
  setIsNightMode: React.Dispatch<React.SetStateAction<boolean>>;

  isAvatarSpeaking: boolean;
  setIsAvatarSpeaking: React.Dispatch<React.SetStateAction<boolean>>;

  memoryKv: { [key: string]: any };
  memoryKvRef: React.RefObject<{ [key: string]: any }>;
  setMemoryKv: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;

  inputValue: string;
  inputValueRef: React.RefObject<string>;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;

  needSpeechQueue: string[];
  needSpeechQueueRef: React.RefObject<string[]>;
  setNeedSpeechQueue: React.Dispatch<React.SetStateAction<string[]>>;

  functionsToolsRef: React.RefObject<[ToolDefinitionType, Function][]>;

  caption: string;
  captionRef: React.RefObject<string>;
  setCaption: React.Dispatch<React.SetStateAction<string>>;

  inputTokens: number;
  inputTokensRef: React.RefObject<number>;
  setInputTokens: React.Dispatch<React.SetStateAction<number>>;

  inputTextTokens: number;
  inputTextTokensRef: React.RefObject<number>;
  setInputTextTokens: React.Dispatch<React.SetStateAction<number>>;

  inputAudioTokens: number;
  inputAudioTokensRef: React.RefObject<number>;
  setInputAudioTokens: React.Dispatch<React.SetStateAction<number>>;

  outputTokens: number;
  outputTokensRef: React.RefObject<number>;
  setOutputTokens: React.Dispatch<React.SetStateAction<number>>;

  outputTextTokens: number;
  outputTextTokensRef: React.RefObject<number>;
  setOutputTextTokens: React.Dispatch<React.SetStateAction<number>>;

  outputAudioTokens: number;
  outputAudioTokensRef: React.RefObject<number>;
  setOutputAudioTokens: React.Dispatch<React.SetStateAction<number>>;

  captionQueue: string[];
  captionQueueRef: React.RefObject<string[]>;
  setCaptionQueue: React.Dispatch<React.SetStateAction<string[]>>;
  updateCaptionQueue: (caption: string) => void;
  addCaptionQueue: (caption: string) => void;

  bingSearchData: any;
  setBingSearchData: React.Dispatch<React.SetStateAction<any>>;

  isOnline: boolean;

  isFirstTokenRef: React.RefObject<boolean>;

  firstTokenLatencyArray: number[];
  firstTokenLatencyArrayRef: React.RefObject<number[]>;
  setFirstTokenLatencyArray: React.Dispatch<React.SetStateAction<number[]>>;

  sendTimeRef: React.RefObject<number>;
  lastTokenTimeRef: React.RefObject<number>;

  tokenLatencyArray: number[];
  tokenLatencyArrayRef: React.RefObject<number[]>;
  setTokenLatencyArray: React.Dispatch<React.SetStateAction<number[]>>;

  resetTokenLatency: () => void;
  recordTokenLatency: () => void;

  connectMessage: string;
  setConnectMessage: React.Dispatch<React.SetStateAction<string>>;

  resetApp: () => void;

  isDebugMode: boolean;
  isDebugModeRef: React.RefObject<boolean>;
  setIsDebugMode: React.Dispatch<React.SetStateAction<boolean>>;

  appKey: number;

  loadFunctionsTools: [ToolDefinitionType, Function][];
  builtinFunctionTools: [ToolDefinitionType, Function][];

  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;

  camera_on_handler: Function;

  lastMessageTextArray: string[];
  lastMessageTextArrayRef: React.RefObject<string[]>;
  setLastMessageTextArray: React.Dispatch<React.SetStateAction<string[]>>;
}

const IS_DEBUG: boolean = window.location.href.includes('localhost');

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{
  children: ReactNode;
  appKey: number;
  setAppKey: React.Dispatch<React.SetStateAction<number>>;
  isNightMode: boolean;
  setIsNightMode: React.Dispatch<React.SetStateAction<boolean>>;
  setOpacity: React.Dispatch<React.SetStateAction<number>>;
  setBackground: React.Dispatch<React.SetStateAction<string>>;
  loadFunctionsTools: [ToolDefinitionType, Function][];
}> = ({
  children,
  appKey,
  setAppKey,
  isNightMode,
  setIsNightMode,
  setOpacity,
  setBackground,
  loadFunctionsTools,
}) => {
  const isOnline = useOnlineStatus();

  const [profiles, setProfiles] = useState<Profiles>(new Profiles());

  // lastMessageTextArray string[]
  const [lastMessageTextArray, setLastMessageTextArray] = useState<string[]>(
    [],
  );
  const lastMessageTextArrayRef = useRef(lastMessageTextArray);
  useEffect(() => {
    lastMessageTextArrayRef.current = lastMessageTextArray;
    // get last message text
    const lastMessageText =
      lastMessageTextArray[lastMessageTextArray.length - 1];
    if (
      lastMessageText &&
      profiles.currentProfile?.speechMethod === SPEECH_METHOD_COMPLETION
    ) {
      console.log(`Completion Speech need: [${lastMessageText}]`);
    }
  }, [lastMessageTextArray, profiles]);

  // caption string
  const [caption, setCaption] = useState('');
  const captionRef = useRef(caption);
  useEffect(() => {
    captionRef.current = caption;
  }, [caption]);

  // captionQueue string[]
  const [captionQueue, setCaptionQueue] = useState<string[]>([]);
  const captionQueueRef = useRef<string[]>([]);
  const updateCaptionQueue = (caption: string) => {
    if (captionQueueRef.current.length === 0) {
      return;
    }
    if (captionQueueRef.current[0] === caption) {
      setCaptionQueue(captionQueueRef.current.slice(1));
    }
  };
  const addCaptionQueue = (caption: string) => {
    setCaptionQueue([...captionQueueRef.current, caption]);
  };

  // inputTokens number
  const [inputTokens, setInputTokens] = useState(0);
  const inputTokensRef = useRef(inputTokens);

  // inputTextTokens number
  const [inputTextTokens, setInputTextTokens] = useState(0);
  const inputTextTokensRef = useRef(inputTextTokens);

  // inputAudioTokens number
  const [inputAudioTokens, setInputAudioTokens] = useState(0);
  const inputAudioTokensRef = useRef(inputAudioTokens);

  // outputTokens number
  const [outputTokens, setOutputTokens] = useState(0);
  const outputTokensRef = useRef(outputTokens);

  // outputTextTokens number
  const [outputTextTokens, setOutputTextTokens] = useState(0);
  const outputTextTokensRef = useRef(outputTextTokens);

  // outputAudioTokens number
  const [outputAudioTokens, setOutputAudioTokens] = useState(0);
  const outputAudioTokensRef = useRef(outputAudioTokens);

  // cameraStatus string
  const [cameraStatus, setCameraStatus] = useState(CAMERA_OFF);
  const cameraStatusRef = useRef(cameraStatus);
  useEffect(() => {
    cameraStatusRef.current = cameraStatus;
  }, [cameraStatus]);

  // connectStatus string
  const [connectStatus, setConnectStatus] = useState(CONNECT_DISCONNECTED);
  const connectStatusRef = useRef(connectStatus);
  useEffect(() => {
    connectStatusRef.current = connectStatus;
  }, [connectStatus]);

  // avatarStatus string
  const [avatarStatus, setAvatarStatus] = useState(AVATAR_OFF);
  const avatarStatusRef = useRef(avatarStatus);
  useEffect(() => {
    avatarStatusRef.current = avatarStatus;
  }, [avatarStatus]);

  // input string
  const [inputValue, setInputValue] = useState('');
  const inputValueRef = useRef(inputValue);
  useEffect(() => {
    inputValueRef.current = inputValue;
  }, [inputValue]);

  // photos
  const [photos, setPhotos] = useState<string[]>([]);
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  // isDebugMode boolean
  const [isDebugMode, setIsDebugMode] = useState<boolean>(false);
  const isDebugModeRef = useRef(isDebugMode);
  useEffect(() => {
    isDebugModeRef.current = isDebugMode;
    if (isDebugMode) {
      replaceInstructions('调试模式是关闭的', '调试模式是开启的');
    } else {
      replaceInstructions('调试模式是开启的', '调试模式是关闭的');
    }
  }, [isDebugMode]);

  // debug
  const [debug, setDebug] = useState<boolean>(IS_DEBUG);
  const debugRef = useRef(debug);
  useEffect(() => {
    debugRef.current = debug;
  }, [debug]);

  // loading
  const [loading, setLoading] = useState<boolean>(false);

  // assistant
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const assistantRef = useRef(assistant);
  useEffect(() => {
    assistantRef.current = assistant;
  }, [assistant]);

  // vectorStore
  const [vectorStore, setVectorStore] = useState<VectorStore | null>(null);
  const vectorStoreRef = useRef(vectorStore);
  useEffect(() => {
    vectorStoreRef.current = vectorStore;
  }, [vectorStore]);

  // thread
  const [thread, setThread] = useState<any | null>(null);
  const threadRef = useRef(thread);
  useEffect(() => {
    threadRef.current = thread;
  }, [thread]);

  // threadJob
  const [threadJob, setThreadJob] = useState<any | null>(null);
  const threadJobRef = useRef(threadJob);
  useEffect(() => {
    threadJobRef.current = threadJob;
  }, [threadJob]);

  // connectMessage string
  const [connectMessage, setConnectMessage] = useState(
    'Awaiting Connection...',
  );

  // needSpeechQueue string[]
  const [needSpeechQueue, setNeedSpeechQueue] = useState<string[]>([]);
  const needSpeechQueueRef = useRef<string[]>([]);
  useEffect(() => {
    needSpeechQueueRef.current = needSpeechQueue;
  }, [needSpeechQueue]);

  // responseBuffer string
  const [responseBuffer, setResponseBuffer] = useState<string>('');
  const responseBufferRef = useRef(responseBuffer);
  useEffect(() => {
    responseBufferRef.current = responseBuffer;

    if (!responseBuffer) {
      setNeedSpeechQueue([]);
      setCaptionQueue([]);
      setIsAvatarSpeaking(false);
      return;
    }

    const sentences = processAndStoreSentence(
      responseBuffer,
      avatarStatus === AVATAR_READY,
      speechSentencesCacheArrayRef,
    );

    for (const sentence of sentences) {
      if (!sentence.exists) {
        if (profiles.currentProfile?.speechMethod === SPEECH_METHOD_STREAM) {
          console.log(`Stream Speech need: [${sentence.sentence}]`);
          setNeedSpeechQueue([...needSpeechQueue, sentence.sentence]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseBuffer]);

  // speechSentencesCacheArray array
  const [speechSentencesCacheArray, setSpeechSentencesCacheArray] = useState<
    string[]
  >([]);
  const speechSentencesCacheArrayRef = useRef(speechSentencesCacheArray);
  useEffect(() => {
    speechSentencesCacheArrayRef.current = speechSentencesCacheArray;
  }, [speechSentencesCacheArray]);

  const isNightModeRef = useRef(isNightMode);

  // isAvatarSpeaking boolean
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState<boolean>(false);

  // memoryKv
  const [memoryKv, setMemoryKv] = useState<{ [key: string]: any }>({});
  const memoryKvRef = useRef(memoryKv);
  useEffect(() => {
    memoryKvRef.current = memoryKv;
  }, [memoryKv]);

  // sendTime DateTime
  const sendTimeRef = useRef(0);

  // lastTokenTime DateTime
  const lastTokenTimeRef = useRef(0);

  const isFirstTokenRef = useRef<boolean>(false);

  // firstTokenLatencyArray number[]
  const [firstTokenLatencyArray, setFirstTokenLatencyArray] = useState<
    number[]
  >([]);
  const firstTokenLatencyArrayRef = useRef(firstTokenLatencyArray);
  useEffect(() => {
    firstTokenLatencyArrayRef.current = firstTokenLatencyArray;
  }, [firstTokenLatencyArray]);

  // tokenLatencyArray number[]
  const [tokenLatencyArray, setTokenLatencyArray] = useState<number[]>([]);
  const tokenLatencyArrayRef = useRef(tokenLatencyArray);
  useEffect(() => {
    tokenLatencyArrayRef.current = tokenLatencyArray;
  }, [tokenLatencyArray]);

  const resetApp = () => {
    setAppKey((prevKey) => prevKey + 1);
  };

  const resetTokenLatency = () => {
    isFirstTokenRef.current = true;
    sendTimeRef.current = Date.now();
    lastTokenTimeRef.current = 0;
  };

  const recordTokenLatency = () => {
    if (isFirstTokenRef.current) {
      isFirstTokenRef.current = false;
      lastTokenTimeRef.current = Date.now();
      const latency = Date.now() - sendTimeRef.current;
      if (latency > 0) {
        setFirstTokenLatencyArray((prevArray: number[]) => [
          ...prevArray,
          latency,
        ]);
      }
      lastTokenTimeRef.current = Date.now();
    } else {
      const latency = Date.now() - lastTokenTimeRef.current;
      lastTokenTimeRef.current = Date.now();
      if (latency > 0) {
        setTokenLatencyArray((prevArray: number[]) => [...prevArray, latency]);
      }
    }
  };

  // -------- functions ---------
  const camera_on_handler: Function = ({ on }: { [on: string]: boolean }) => {
    try {
      if (on) {
        if (cameraStatusRef.current === CAMERA_READY) {
          return {
            message: 'The camera is already on.',
          };
        }

        setCameraStatus(CAMERA_STARTING);
        return {
          message: 'The camera is starting, please wait a moment to turn on.',
        };
      }

      setCameraStatus(CAMERA_OFF);

      return { message: 'The camera has been turned off' };
    } catch (error) {
      console.error('camera error', error);
      return { error: error };
    }
  };

  const camera_current_handler: Function = async ({
    prompt = '',
  }: {
    [key: string]: string | undefined;
  }) => {
    try {
      if (prompt) {
        prompt = `User questions about these frames are: ${prompt}`;
      }

      console.log('prompt', prompt);

      if (photosRef.current && photosRef.current.length === 0) {
        console.log('no photos, please turn on your camera');
        return { error: 'no photos, please turn on your camera' };
      }

      let content: any = [
        {
          type: 'text',
          text: `Can you describe what you saw? ${prompt}. The top left corner of the image is the time, and usually you don't need to explain this time.`,
        },
      ];

      content.push({
        type: 'image_url',
        image_url: {
          url: photosRef.current[photosRef.current.length - 1],
          detail: 'high',
        },
      });

      const messages = [
        {
          role: 'user',
          content: content,
        },
      ];

      const resp = await getCompletion(messages);
      console.log('vision resp', resp);

      return { message: resp };
    } catch (error) {
      console.error('vision error', error);
      return { error: error };
    }
  };

  const camera_video_handler: Function = async ({
    prompt = '',
    seconds = CAMERA_PHOTO_LIMIT,
  }: {
    [key: string]: any;
  }) => {
    console.log('prompt', prompt);
    console.log('seconds', seconds);

    if (seconds && seconds > CAMERA_PHOTO_LIMIT) {
      return {
        error: `The maximum number of seconds is ${CAMERA_PHOTO_LIMIT}`,
      };
    }

    if (photosRef.current && photosRef.current.length === 0) {
      return { error: 'no photos, please turn on your camera' };
    }

    if (prompt) {
      prompt = `User questions about these frames are: ${prompt}`;
    }

    let content: any = [
      {
        type: 'text',
        text: `I'm going to give you a set of video frames from the video head capture, just captured. The images are displayed in reverse chronological order. Can you describe what you saw? If there are more pictures, it is continuous, please tell me the complete event that happened just now. ${prompt}`,
      },
    ];

    const lastTenPhotos = photosRef.current.slice(-seconds);
    // for photos
    lastTenPhotos.forEach((photo: string) => {
      content.push({
        type: 'image_url',
        image_url: {
          url: photo,
        },
      });
    });

    try {
      const messages = [
        {
          role: 'user',
          content: content,
        },
      ];

      const resp = await getCompletion(messages);
      console.log('vision resp', resp);

      return { message: resp };
    } catch (error) {
      console.error('vision error', error);

      return { error: error };
    }
  };

  const memory_handler: Function = async ({
    key,
    value,
  }: {
    [key: string]: any;
  }) => {
    setMemoryKv((memoryKv) => {
      const newKv = { ...memoryKv };
      newKv[key] = value;
      return newKv;
    });
    return { ok: true };
  };

  const avatar_handler: Function = async ({
    on,
  }: {
    [key: string]: boolean;
  }) => {
    if (on) {
      if (avatarStatusRef.current === AVATAR_READY) {
        return {
          message: 'The avatar is already on.',
        };
      }

      setAvatarStatus(AVATAR_STARTING);

      let checkTime = 0;

      while (checkTime < 25) {
        await delayFunction(1000);
        checkTime++;
        if (avatarStatusRef.current === AVATAR_READY) {
          return { message: 'ok' };
        }
      }

      setAvatarStatus(AVATAR_OFF);
      return { message: 'Error, please check your error message.' };
    }

    setAvatarStatus(AVATAR_OFF);

    return { message: 'done' };
  };

  const dark_handler: Function = ({ on }: { [on: string]: boolean }) => {
    setIsNightMode(on);
    return { ok: true };
  };

  const gptImagesDispatch = useGptImagesDispatch()!;
  const gptImagesRef = useGptImagesRef();
  const images = useGptImages();
  useEffect(() => {
    const instructions: ReplaceInstructionsArray[] = [];

    gptImagesRef.current = images;

    if (images.length > 0) {
      console.log('images', images);

      instructions.push({
        source: IMAGE_HAS_NOT_UPLOADED,
        target: IMAGE_HAS_UPLOADED,
      });

      if (images[images.length - 1].mask_b64) {
        instructions.push({
          source: IMAGE_MODIFY_INSTRUCTIONS_NOT_SPECIFIED,
          target: IMAGE_MODIFY_INSTRUCTIONS_SPECIFIED,
        });
      } else {
        instructions.push({
          source: IMAGE_MODIFY_INSTRUCTIONS_SPECIFIED,
          target: IMAGE_MODIFY_INSTRUCTIONS_NOT_SPECIFIED,
        });
      }
    } else {
      instructions.push({
        source: IMAGE_HAS_UPLOADED,
        target: IMAGE_HAS_NOT_UPLOADED,
      });
    }

    replaceInstructionsArray(instructions);
  }, [images, gptImagesRef]);

  const painting_handler: Function = async ({
    prompt,
    n,
  }: {
    [key: string]: any;
  }) => {
    try {
      const resp = await getImages({ prompt: prompt, n: n });
      const images = resp.data;

      for (const image of images) {
        const gptImage: GptImage = {
          id: uuidv4(),
          prompt: prompt,
          b64: image.b64_json,
          mask_b64: '',
        };

        gptImagesDispatch({ type: 'add', gptImage });
        console.log('painting', gptImage);
      }

      console.log('gptImagesRef', gptImagesRef.current);
      return { result: 'completed, please check the results in the modal.' };
    } catch (error) {
      console.error('painting error', error);
      return { error: error };
    }
  };

  const image_modify_handler: Function = async ({
    edit_requirements,
    original_image_number,
  }: {
    [key: string | number]: any;
  }) => {
    const len = gptImagesRef.current?.length || 0;
    if (!gptImagesRef.current || len === 0) {
      return { error: 'no painting data, please generate painting first.' };
    }

    if (original_image_number > len) {
      return {
        error: `no enough painting data, please generate or upload ${original_image_number} paintings first.`,
      };
    }

    console.log('original_image_number', original_image_number);

    const lastImage = gptImagesRef.current[len - 1];
    const images = [];
    for (let i = len - 1; i >= len - original_image_number; i--) {
      images.push(gptImagesRef.current[i]);
    }

    try {
      const resp = await editImages(images, lastImage, edit_requirements);
      const image = resp.data[0];

      const gptImage: GptImage = {
        id: uuidv4(),
        prompt: edit_requirements,
        b64: image.b64_json,
        mask_b64: '',
      };

      gptImagesDispatch({ type: 'add', gptImage });

      console.log('edit painting', gptImage);

      if (lastImage.mask_b64) {
        return {
          result: 'completed with mask, please check the results in the modal.',
        };
      }

      return { result: 'completed, please check the results in the modal.' };
    } catch (error) {
      console.error('modify painting error', error);
      return { error: error };
    }
  };

  const [bingSearchData, setBingSearchData] = useState<any>(null);
  const bing_search_handler: Function = async ({
    query,
    count = 10,
    page = 1,
  }: {
    [key: string]: any;
  }) => {
    if (!profiles.currentProfile?.bingApiKey) {
      throw new Error('Bing API key is not set');
    }

    const offset = (page - 1) * count;
    const mkt = 'en-US';
    const params = { q: query, mkt: mkt, count: count, offset: offset };
    const headers = {
      'Ocp-Apim-Subscription-Key': profiles.currentProfile?.bingApiKey,
    };

    const response = await axios.get(
      'https://api.bing.microsoft.com/v7.0/search',
      { headers, params },
    );
    const data = response.data;

    setBingSearchData(data);

    console.log(data);

    return {
      message:
        "ok, please check the results in the modal. you don't need to say anything.",
      data: data,
    };
  };

  const camera_take_photo_handler: Function = async () => {
    // for first time, wait 2 seconds to make sure the camera is ready
    if (cameraStatusRef.current !== CAMERA_READY) {
      await delayFunction(4000);
    }

    if (cameraStatusRef.current !== CAMERA_READY) {
      return { error: 'camera is not ready, please turn on the camera first.' };
    }

    const currentPhoto = photosRef.current[photosRef.current.length - 1];
    const base64Data = currentPhoto.split(',')[1];
    const gptImage: GptImage = {
      id: uuidv4(),
      prompt: 'take a photo',
      b64: base64Data,
      mask_b64: '',
    };
    gptImagesDispatch({ type: 'add', gptImage });
    return { message: 'ok' };
  };

  const opacity_handler: Function = async ({
    opacity,
  }: {
    [key: string]: any;
  }) => {
    console.log('opacity', opacity);
    // set opacity to float
    setOpacity(Number(opacity));
    return { message: 'ok' };
  };

  const background_handler: Function = () => {
    const backgroundImage = ['1', '2', '3', '4'];
    const randomIndex = Math.floor(Math.random() * backgroundImage.length);
    const randomBackground = backgroundImage[randomIndex];
    setBackground(randomBackground);
    return { message: `ok, the background image is ${randomBackground}.png` };
  };

  const debug_handler: Function = async ({
    debug_mode,
  }: {
    [key: string]: any;
  }) => {
    setIsDebugMode(debug_mode);
    return { ok: true };
  };

  const set_disconnection_handler: Function = () => {
    resetApp();
    return { ok: true };
  };

  const azure_docs_definition = {
    ...azure_docs.definition,
    description: azure_docs.definition.description.replace(
      '{rag}',
      profiles.currentProfile?.graphragAbout || GRAPHRAG_ABOUT,
    ),
  };

  const builtinFunctionTools: [ToolDefinitionType, Function][] = [
    [camera_on.definition, camera_on_handler],
    [camera_take_photo.definition, camera_take_photo_handler],
    [opacity.definition, opacity_handler],
    [background.definition, background_handler],
    [camera_current.definition, camera_current_handler],
    [camera_video.definition, camera_video_handler],
    [memory.definition, memory_handler],
    [avatar.definition, avatar_handler],
    [dark.definition, dark_handler],
    [bing.definition, bing_search_handler],
    [painting.definition, painting_handler],
    [image_modify.definition, image_modify_handler],
    [debug_model.definition, debug_handler],
    [set_disconnection.definition, set_disconnection_handler],
    [news.definition, news.handler],
    [weather.definition, weather.handler],
    [order_get.definition, order_get.handler],
    [order_return.definition, order_return.handler],
    [exchange_rate_aim.definition, exchange_rate_aim.handler],
    [exchange_rate_list.definition, exchange_rate_list.handler],
    [exchange_rate_configs.definition, exchange_rate_configs.handler],
    [products_recommend.definition, products_recommend.handler],
    [location.definition, location.handler],
    [feishu.definition, feishu.handler],
    [open_url.definition, open_url.handler],
    [azure_docs_definition, azure_docs.handler],
    [demo.definition, demo.handler],
    [quote.definition, quote.handler],
    [stock_recommend.definition, stock_recommend.handler],
    [devices_action.definition, devices_action.handler],
  ];
  builtinFunctionTools.sort((a, b) => a[0].name.localeCompare(b[0].name));

  let merge_tools: [ToolDefinitionType, Function][] = profiles.currentProfile
    ?.isDefaultScene
    ? [...loadFunctionsTools, ...builtinFunctionTools]
    : [...loadFunctionsTools];

  if (profiles.currentProfile?.scene === SCENE_AIR_CONDITIONING) {
    merge_tools = air_conditioning_control_tools;
  }

  if (profiles.currentProfile?.scene === SCENE_KITCHEN) {
    merge_tools = kitchen_control_tools;
  }

  // resort merge_tools by ToolDefinitionType name
  merge_tools.sort((a, b) => a[0].name.localeCompare(b[0].name));

  const functions_tool: [ToolDefinitionType, Function][] = merge_tools;

  // functions_tools array
  const functionsToolsRef =
    useRef<[ToolDefinitionType, Function][]>(functions_tool);

  let updateInstructions = profiles.currentProfile?.isDefaultScene
    ? SYSTEM_INSTRUCTIONS
    : profiles.currentProfile?.prompt || '';

  const [messages, setMessages] = useState<any[]>([]);

  const [llmInstructions, setLlmInstructions] =
    useState<string>(updateInstructions);
  const llmInstructionsRef = useRef(llmInstructions);

  useEffect(() => {
    llmInstructionsRef.current = llmInstructions;

    if (assistant) {
      assistant.instructions = llmInstructions;
      (async () => {
        try {
          const res = await getOpenAIClient().beta.assistants.update(
            assistant.id,
            {
              instructions: llmInstructions,
            },
          );
          console.log('assistant instructions updated', res);
        } catch (error) {
          console.error('Error:', error);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [llmInstructions]);

  const replaceInstructions = (source: string | RegExp, target: string) => {
    console.log('replaceInstructions', source, ' -> ', target);
    const new_instructions = llmInstructionsRef.current.replace(source, target);
    setLlmInstructions(new_instructions);
    return new_instructions;
  };

  const replaceInstructionsArray = (
    instructions: ReplaceInstructionsArray[],
  ) => {
    let new_instructions = llmInstructionsRef.current;
    for (const instruction of instructions) {
      console.log(
        'replaceInstructionsArray',
        instruction.source,
        ' -> ',
        instruction.target,
      );
      new_instructions = new_instructions.replace(
        instruction.source,
        instruction.target,
      );
    }
    setLlmInstructions(new_instructions);
    return new_instructions;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.ctrlKey &&
      event.altKey &&
      (event.key === 'p' || event.key === 'P')
    ) {
      event.preventDefault();
      setDebug((prevMyVariable) => {
        return !prevMyVariable;
      });
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        isOnline,
        photos,
        photosRef,
        setPhotos,
        loading,
        setLoading,
        debug,
        debugRef,
        setDebug,
        assistant,
        assistantRef,
        setAssistant,
        thread,
        threadRef,
        setThread,
        threadJob,
        threadJobRef,
        setThreadJob,
        responseBuffer,
        responseBufferRef,
        setResponseBuffer,
        speechSentencesCacheArray,
        speechSentencesCacheArrayRef,
        setSpeechSentencesCacheArray,
        llmInstructions,
        llmInstructionsRef,
        replaceInstructions,
        isNightMode,
        isNightModeRef,
        setIsNightMode,
        isAvatarSpeaking,
        setIsAvatarSpeaking,
        memoryKv,
        memoryKvRef,
        setMemoryKv,
        inputValue,
        inputValueRef,
        setInputValue,
        needSpeechQueue,
        needSpeechQueueRef,
        setNeedSpeechQueue,
        caption,
        captionRef,
        setCaption,
        captionQueue,
        captionQueueRef,
        setCaptionQueue,
        updateCaptionQueue,
        addCaptionQueue,
        bingSearchData,
        setBingSearchData,
        cameraStatus,
        cameraStatusRef,
        setCameraStatus,
        connectStatus,
        connectStatusRef,
        setConnectStatus,
        avatarStatus,
        avatarStatusRef,
        setAvatarStatus,
        isFirstTokenRef,
        firstTokenLatencyArray,
        firstTokenLatencyArrayRef,
        setFirstTokenLatencyArray,
        tokenLatencyArray,
        tokenLatencyArrayRef,
        setTokenLatencyArray,
        recordTokenLatency,
        resetTokenLatency,
        sendTimeRef,
        lastTokenTimeRef,
        functionsToolsRef,
        connectMessage,
        setConnectMessage,
        resetApp,
        isDebugMode,
        isDebugModeRef,
        setIsDebugMode,
        vectorStore,
        vectorStoreRef,
        setVectorStore,
        inputTokens,
        inputTokensRef,
        setInputTokens,
        outputTokens,
        outputTokensRef,
        setOutputTokens,
        inputTextTokens,
        inputTextTokensRef,
        setInputTextTokens,
        outputTextTokens,
        outputTextTokensRef,
        setOutputTextTokens,
        inputAudioTokens,
        inputAudioTokensRef,
        setInputAudioTokens,
        outputAudioTokens,
        outputAudioTokensRef,
        setOutputAudioTokens,
        appKey,
        loadFunctionsTools,
        builtinFunctionTools,
        messages,
        setMessages,
        camera_on_handler,
        replaceInstructionsArray,
        lastMessageTextArray,
        lastMessageTextArrayRef,
        setLastMessageTextArray,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useContexts = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useContexts must be used within a AppProvider');
  }
  return context;
};
