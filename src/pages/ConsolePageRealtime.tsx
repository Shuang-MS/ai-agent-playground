import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ItemType,
  ToolDefinitionType,
} from '@theodoreniu/realtime-api-beta/dist/lib/client.js';
import {
  AVATAR_READY,
  clientHiEnglish,
  CONNECT_CONNECTED,
  CONNECT_CONNECTING,
  CONNECT_DISCONNECTED,
  SWITCH_FUNCTIONS_AIR_CONDITIONING_CONTROL,
} from '../lib/const';

import './ConsolePage.scss';
import Camera from '../components/Camera';
import SettingsComponent from '../components/Settings';
import FileUploadComponent from '../components/FileUploadComponent';
import { useContexts } from '../providers/AppProvider';
import Avatar from '../components/Avatar';
import AudioVisualization from '../components/AudioVisualization';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools';
import ConnectButton from '../components/ConnectButton';
import TurnEndType from '../components/TurnEndType';
import ConnectMessage from '../components/ConnectMessage';
import RealtimeMessages from '../components/RealtimeMessages';
import { InputBarRealtime } from '../components/InputBarRealtime';
import { RealtimeClient } from '@theodoreniu/realtime-api-beta';
import { RealtimeEvent, RealtimeTokenUsage } from '../types/RealtimeEvent';
import BuiltFunctionDisable from '../components/BuiltFunctionDisable';
import { Profiles } from '../lib/Profiles';
import { llmState } from '../components/LlmState';

export const appendAirConditioningStateToInstructions = (
  instructions: string,
  switchFunctions: string,
) => {
  if (switchFunctions !== SWITCH_FUNCTIONS_AIR_CONDITIONING_CONTROL) {
    return instructions;
  }

  if (!llmState.on) {
    instructions =
      instructions +
      `\n 空调是关闭状态，不能进行任何操作。
       \n 如果用户的操作包含打开空调，那么不用提示，你先打空调，再按照顺序执行其他操作。
       \n 如果用户的操作不包含打开空调，需要提示空调是关闭状态，只能打开空调，不能进行其他任何操作，并且询问用户是否打开空调。
  `;

    return instructions;
  }

  instructions =
    instructions +
    `\n空调状态状态如下：
    \n状态：${llmState.on ? '开' : '关'}
    \n温度：${llmState.temperature}
    \n模式：${llmState.mode}
    \n除菌：${llmState.disinfection ? '开' : '关'}
    \nAI控制：${llmState.ai_control ? '开' : '关'}
    \n新风级别：${llmState.fresh_air_level ? llmState.fresh_air_level : '关闭'}
    \n净化级别：${llmState.purification_level ? llmState.purification_level : '关闭'}
    \n风速：${llmState.gear_level ? llmState.gear_level : '关闭'}
    \n音量：${llmState.volume ? llmState.volume : '静音'}
    \n湿度控制：${llmState.moisture_control ? '开' : '关'}
    \n热风闪烁：${llmState.heat_flash ? '开' : '关'}
    \n冷风闪烁：${llmState.cool_flash ? '开' : '关'}
    \n防直吹：${llmState.anti_direct_airflow ? '开' : '关'}
    \n智能清洁：${llmState.smart_cleaning ? '开' : '关'}
    \n无风感：${llmState.wind_free ? '开' : '关'}
    \n电辅热：${llmState.electric_auxiliary_heating ? '开' : '关'}
    \n定时开机：${llmState.scheduled_power_on_minutes}
    \n定时关机：${llmState.scheduled_power_off_minutes}
    \n风向：${llmState.air_direction}
    \n屏幕显示：${llmState.screen_display ? '开' : '关'}
    \n风速百分比：${llmState.wind_speed_percentage}
    \n节能模式：${llmState.energy_saving ? '开' : '关'}
  `;

  return instructions;
};

export function ConsolePageRealtime() {
  const {
    avatarStatusRef,
    avatarStatus,
    llmInstructions,
    setResponseBuffer,
    functionsToolsRef,
    connectStatus,
    setConnectStatus,
    resetTokenLatency,
    recordTokenLatency,
    setIsAvatarSpeaking,
    connectMessage,
    setConnectMessage,
    isDebugModeRef,
    resetApp,
    setInputTokens,
    setInputTextTokens,
    setInputAudioTokens,
    setOutputTokens,
    setOutputTextTokens,
    setOutputAudioTokens,
    appKey,
    setMessages,
  } = useContexts();

  const profiles = new Profiles();
  const profile = profiles.currentProfile;

  const [callStates, setCallStates] = useState<Record<string, any>>({});

  const realtimeClientRef = useRef<RealtimeClient>(
    new RealtimeClient({
      apiKey: profile.realtimeKey,
      url: profile.getAgentRealtimeUrl(),
      debug: false,
      dangerouslyAllowAPIKeyInBrowser: true,
    }),
  );

  const updateInstructions = async () => {
    if (realtimeClientRef?.current.isConnected()) {
      const currentTime = new Date().toLocaleString();
      let instructions = llmInstructions + `\n当前时间：${currentTime} `;

      instructions = appendAirConditioningStateToInstructions(
        instructions,
        profiles.currentProfile?.switchFunctions,
      );

      console.log('updateInstructions');
      realtimeClientRef.current.updateSession({
        instructions: instructions,
      });
    } else {
      console.log(
        'realtimeClientRef.current is not connected, skip update instructions',
      );
    }
  };

  useEffect(() => {
    updateInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [llmInstructions]);

  useEffect(() => {
    const timer = setInterval(() => {
      updateInstructions();
    }, 5000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [llmInstructions]);

  useEffect(() => {
    console.log('appKey updated, reset realtimeClientRef', appKey);
    wavStreamPlayerRef.current?.interrupt();
    realtimeClientRef.current?.reset();
  }, [appKey]);

  /**
   * Core RealtimeClient and audio capture setup
   * Set all of our instructions, tools, events and more
   */
  useEffect(() => {
    // Get refs
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = realtimeClientRef.current;

    // Set instructions
    client.updateSession({ instructions: llmInstructions });
    // Set transcription, otherwise we don't get user transcriptions back
    client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });
    // Set voice
    client.updateSession({ voice: 'echo' });
    // Set temperature
    client.updateSession({
      temperature: profile?.temperature,
    });
    // Set tool choice
    client.updateSession({
      tool_choice: 'auto',
    });

    // Add tools
    functionsToolsRef.current.forEach(
      ([definition, handler]: [ToolDefinitionType, Function]) => {
        client.addTool(definition, handler);
      },
    );

    // handle realtime events from client + server for event logging
    client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
      const {
        source,
        event: { type },
      } = realtimeEvent;

      if (type === 'error') {
        if (realtimeEvent.event?.error?.code === null) {
          console.error(realtimeEvent.event);
        } else {
          alert(JSON.stringify(realtimeEvent.event, null, 2));
          window.location.reload();
        }
      }

      if (realtimeEvent.event?.response?.status === 'failed') {
        setItems([]);
        console.error(realtimeEvent.event.response?.status_details?.error);
        const type =
          realtimeEvent.event.response?.status_details?.error?.type ||
          'server_error';
        const message =
          realtimeEvent.event.response?.status_details?.error?.message ||
          'error';
        setConnectMessage(`${type}\n${message}`);
      }

      if (realtimeEvent?.event?.response?.usage) {
        tokensRecord(realtimeEvent?.event?.response?.usage);
      }
      latencyRecord(realtimeEvent);

      if (source === 'server' && type === 'input_audio_buffer.speech_started') {
        setIsAvatarSpeaking(false);
      }
    });

    client.on('error', (event: any) => {
      console.error(event);
      setConnectMessage(event.message);
      setConnectStatus(CONNECT_DISCONNECTED);
    });

    client.on('close', (event: any) => {
      console.error(event);
      setConnectStatus(CONNECT_DISCONNECTED);
    });

    client.on('conversation.interrupted', async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });

    client.on('conversation.item.completed', async ({ item }: any) => {
      if (item.type === 'function_call') {
        callStates[item.call_id] = item;
      }

      if (item.type === 'function_call_output') {
        const call = callStates[item.call_id];
        console.log('load function call', call);

        const result = {
          name: call.name,
          arguments: JSON.parse(call.arguments),
          output: JSON.parse(item.output),
        };
        setMessages((prevMessages) => [result, ...prevMessages]);
      }
    });

    client.on('conversation.updated', async ({ item, delta }: any) => {
      if (isDebugModeRef.current) {
        console.log('item', item);
        console.log('delta', delta);
      }

      if (
        item.object === 'realtime.item' &&
        item.type === 'message' &&
        item.role === 'assistant'
      ) {
        setResponseBuffer(item.formatted.transcript);
      }

      const items = client.conversation.getItems();
      if (delta?.audio) {
        if (avatarStatusRef.current !== AVATAR_READY) {
          wavStreamPlayer.add16BitPCM(delta.audio, item.id);
        }
      }

      if (item.status === 'completed' && item.formatted.audio?.length) {
        item.formatted.file = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000,
        );
      }

      const dataStore: { [key: string]: number } = {};
      // for item in items, get item and index
      for (const [index, item] of items.entries()) {
        if (item.type === 'function_call' && item?.formatted?.tool?.call_id) {
          dataStore[item.formatted.tool.call_id] = index;
          continue;
        }

        if (item.type === 'function_call_output') {
          const callId = item.call_id;
          const callIndex = dataStore[callId];
          if (callIndex !== undefined) {
            items[callIndex] = item;
            delete items[index];
          }
        }
      }

      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      client.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startTimeRef = useRef<string>(new Date().toISOString());

  /**
   * Instantiate:
   * - WavRecorder (speech input)
   * - WavStreamPlayer (speech output)
   * - RealtimeClient (API client)
   */
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 }),
  );

  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 }),
  );

  /**
   * All of our variables for displaying application state
   * - items are all conversation items (dialog)
   * - realtimeEvents are event logs, which can be expanded
   * - memoryKv is for set_memory() function
   * - coords, marker are for get_weather() function
   */
  const [items, setItems] = useState<ItemType[]>([]);
  useEffect(() => {
    // Auto-scroll the conversation logs
    const conversationEls = [].slice.call(
      document.body.querySelectorAll('[data-conversation-content]'),
    );
    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  /**
   * Connect to conversation:
   * WavRecorder tasK speech input, WavStreamPlayer output, client is API client
   */
  const connectConversation = useCallback(async () => {
    if (!profile.getAgentRealtimeUrl()) {
      setConnectStatus(CONNECT_DISCONNECTED);
      setConnectMessage('Please set your Target URI.');
      return;
    }

    setConnectStatus(CONNECT_CONNECTING);
    setConnectMessage('Connecting...');

    // Connect to realtime API
    try {
      await realtimeClientRef.current.connect();

      const sse = new EventSource(profile.getAgentSseUrl());
      sse.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(data);
        } catch (e: any) {
          console.error(e);
        }
      };
      sse.onerror = (event) => {
        console.error(event);
      };
      sse.onopen = (event) => {
        console.log('sse open', event);
      };
    } catch (e: any) {
      console.error(e);
      const tip = `链接失败，如果您确定配置信息无误，可能是由于网络问题。建议使用 VPN 及最新版 Edge 浏览器。
      \nConnection failed, if you are certain that the configuration is correct, it may be due to network issues. Recommended: VPN and the latest Edge browser.
      `;
      setConnectStatus(CONNECT_DISCONNECTED);
      setConnectMessage(tip);
      alert(`${tip}\n${e}`);
      resetApp();
      return;
    }

    // Set state variables
    startTimeRef.current = new Date().toISOString();
    setConnectStatus(CONNECT_CONNECTED);
    setConnectMessage('');
    setItems(realtimeClientRef.current.conversation.getItems());

    // Connect to microphone
    await wavRecorderRef.current.begin();

    // Connect to audio output
    await wavStreamPlayerRef.current.connect();

    realtimeClientRef.current.sendUserMessageContent([
      {
        type: `input_text`,
        text: clientHiEnglish,
      },
    ]);

    if (realtimeClientRef.current.getTurnDetectionType() === 'server_vad') {
      await wavRecorderRef.current.record((data) =>
        realtimeClientRef.current.appendInputAudio(data.mono),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latencyRecord = (e: RealtimeEvent) => {
    const {
      source,
      event: { type },
    } = e;

    if (e.event.type === 'input_audio_buffer.append') {
      return;
    }

    if (source === 'client' && type === 'response.create') {
      resetTokenLatency();
    }

    if (source === 'server' && type === 'input_audio_buffer.committed') {
      resetTokenLatency();
    }

    if (source === 'server' && type === 'response.output_item.added') {
      recordTokenLatency('');
    }

    if (source === 'server' && type === 'response.audio.delta') {
      recordTokenLatency('');
    }
  };

  const tokensRecord = (e: RealtimeTokenUsage) => {
    setInputTokens((prev) => prev + e.input_tokens);
    setInputTextTokens((prev) => prev + e.input_token_details.text_tokens);
    setInputAudioTokens((prev) => prev + e.input_token_details.audio_tokens);
    setOutputTokens((prev) => prev + e.output_tokens);
    setOutputTextTokens((prev) => prev + e.output_token_details.text_tokens);
    setOutputAudioTokens((prev) => prev + e.output_token_details.audio_tokens);
  };

  /**
   * Render the application
   */
  return (
    <>
      <div className="content-logs container_bg">
        <div className="content-block conversation">
          <div className="content-block-body" data-conversation-content>
            <ConnectMessage connectMessage={connectMessage} />

            <RealtimeMessages
              items={items}
              avatarStatus={avatarStatus}
              realtimeClient={realtimeClientRef.current}
            />
          </div>

          <InputBarRealtime
            wavStreamPlayer={wavStreamPlayerRef.current}
            realtimeClient={realtimeClientRef.current}
          />
        </div>
      </div>

      <div className="content-right">
        <BuiltFunctionDisable />
        <Avatar />
        <Camera />

        <SettingsComponent connectStatus={connectStatus} />

        <TurnEndType
          connectStatus={connectStatus}
          realtimeClient={realtimeClientRef.current}
          wavRecorderRef={wavRecorderRef.current}
          wavStreamPlayerRef={wavStreamPlayerRef.current}
        />

        <FileUploadComponent
          connectStatus={connectStatus}
          realtimeClient={realtimeClientRef.current}
        />

        <ConnectButton
          connectStatus={connectStatus}
          connectConversation={connectConversation}
        />

        <AudioVisualization
          wavRecorder={wavRecorderRef.current}
          wavStreamPlayer={wavStreamPlayerRef.current}
        />
      </div>
    </>
  );
}
