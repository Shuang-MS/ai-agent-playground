import { useCallback, useEffect } from 'react';

import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client.js';
import {
  CONNECT_CONNECTED,
  CONNECT_CONNECTING,
  CONNECT_DISCONNECTED,
} from '../lib/const';

import './ConsolePage.scss';
import Camera from '../components/Camera';
import SettingsComponent from '../components/Settings';
import { useContexts } from '../providers/AppProvider';
import ConnectButton from '../components/ConnectButton';
import ConnectMessage from '../components/ConnectMessage';
import BuiltFunctionDisable from '../components/BuiltFunctionDisable';
import { Profiles } from '../lib/Profiles';
import {
  RealtimeWebRtcEvent,
  RealtimeWebRtcFunctionCall,
} from '../types/RealtimeWebRtcEvent';
import { RealtimeTokenUsage } from '../types/RealtimeEvent';

export function ConsolePageRealtimeWebRTC() {
  const {
    llmInstructions,
    functionsToolsRef,
    connectStatus,
    setConnectStatus,
    connectMessage,
    setConnectMessage,
    resetApp,
    resetTokenLatency,
    recordTokenLatency,
    setInputTokens,
    setInputTextTokens,
    setInputAudioTokens,
    setOutputTokens,
    setOutputTextTokens,
    setOutputAudioTokens,
    setMessages,
  } = useContexts();

  const profiles = new Profiles();
  const profile = profiles.currentProfile;
  const tools: any[] = [];

  functionsToolsRef.current.forEach(
    ([definition]: [ToolDefinitionType, Function]) => {
      tools.push({ ...definition, type: 'function' });
    },
  );

  useEffect(() => {
    // updateInstructions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [llmInstructions]);

  const functionCallHandler = async (call: RealtimeWebRtcFunctionCall) => {
    console.log('load function call', call);

    const args = JSON.parse(call.arguments);
    const name = call.name;

    for (const [definition, handler] of functionsToolsRef.current) {
      if (definition.name === name) {
        const output = await handler({ ...args });
        const result = {
          name: name,
          arguments: args,
          output: output,
        };
        setMessages((prevMessages) => [result, ...prevMessages]);
        return JSON.stringify(output);
      }
    }

    return JSON.stringify({
      error: `Function ${call.name} not found`,
    });
  };

  const latencyRecord = (e: RealtimeWebRtcEvent) => {
    const { type } = e;

    if (type === 'response.created') {
      resetTokenLatency();
    }

    if (type === 'response.output_item.added') {
      recordTokenLatency();
    }

    if (type === 'response.audio_transcript.delta') {
      recordTokenLatency();
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

  async function initRtc(ephemeralKey: string, deployment: string) {
    const peerConnection = new RTCPeerConnection();

    const dataChannel = peerConnection.createDataChannel('realtime-channel');

    function updateSession() {
      const event = {
        type: 'session.update',
        session: {
          instructions: llmInstructions,
        },
      };
      sendData(event);
    }

    async function sendData(data: any) {
      dataChannel.send(JSON.stringify(data));
      console.log('Sent client event:');
      console.log(data);
    }

    const audioElement = document.createElement('audio');
    audioElement.autoplay = true;
    document.body.appendChild(audioElement);

    peerConnection.ontrack = (event: RTCTrackEvent) => {
      audioElement.srcObject = event.streams[0];
    };

    const clientMedia = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const audioTrack = clientMedia.getAudioTracks()[0];
    peerConnection.addTrack(audioTrack);

    dataChannel.addEventListener('open', () => {
      console.log('Data channel is open');
      updateSession();
    });

    dataChannel.addEventListener('message', async (event: MessageEvent) => {
      const realtimeEvent = JSON.parse(event.data) as RealtimeWebRtcEvent;
      console.log('Received Server event:');
      console.log(realtimeEvent);

      latencyRecord(realtimeEvent);

      if (realtimeEvent.response?.usage) {
        tokensRecord(realtimeEvent.response?.usage);
      }

      if (realtimeEvent.type === 'session.update') {
        const instructions = realtimeEvent.session.instructions;
        console.log('Instructions: ' + instructions);
      } else if (realtimeEvent.type === 'session.error') {
        console.log('Error: ' + realtimeEvent.error?.message);
      } else if (realtimeEvent.type === 'session.end') {
        console.log('Session ended.');
      } else if (realtimeEvent.type === 'session.created') {
        setConnectStatus(CONNECT_CONNECTED);
        setConnectMessage('Connected, start talking...');
      } else if (realtimeEvent.type === 'response.created') {
        setConnectMessage('');
      } else if (realtimeEvent.type === 'response.audio_transcript.delta') {
        if (realtimeEvent.delta) {
          setConnectMessage((prev: string) => prev + realtimeEvent.delta);
        }
      } else if (realtimeEvent.type === 'response.audio_transcript.done') {
        if (realtimeEvent.transcript) {
          setConnectMessage(realtimeEvent.transcript);
        }
      } else if (realtimeEvent.type === 'response.output_item.done') {
        if (realtimeEvent.item?.call_id) {
          const call = realtimeEvent.item as RealtimeWebRtcFunctionCall;
          const output = await functionCallHandler(call);
          const event = {
            type: 'conversation.item.create',
            item: {
              type: 'function_call_output',
              call_id: call.call_id,
              output: output,
            },
          };
          updateSession();
          sendData(event);
        }
      }
    });

    dataChannel.addEventListener('close', () => {
      console.log('Data channel is closed');
      resetApp();
    });

    dataChannel.addEventListener('error', (error) => {
      console.error('Data channel error:', error);
    });

    // Start the session using the Session Description Protocol (SDP)
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const sdpResponse = await fetch(
      `${profile.getRealtimeWebRTCUrl()}?model=${deployment}`,
      {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      },
    );

    const answer = { type: 'answer', sdp: await sdpResponse.text() } as any;
    await peerConnection.setRemoteDescription(answer);
  }

  async function getEK(sessionUrl: string, apiKey: string, deployment: string) {
    const response = await fetch(sessionUrl, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: deployment,
        voice: 'echo',
        temperature: profile?.temperature,
        tool_choice: 'auto',
        tools: tools,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed`);
    }

    const data = await response.json();

    const sessionId = data.id;
    const ephemeralKey = data.client_secret?.value;

    // Mask the ephemeral key in the log message.
    console.log('Ephemeral Key Received: ' + ephemeralKey);
    console.log('WebRTC Session Id = ' + sessionId);

    // Set up the WebRTC connection using the ephemeral key.
    return ephemeralKey;
  }

  /**
   * Connect to conversation:
   * WavRecorder tasK speech input, WavStreamPlayer output, client is API client
   */
  const connectConversation = useCallback(async () => {
    if (!profile.getRealtimeSessionUrl()) {
      setConnectStatus(CONNECT_DISCONNECTED);
      setConnectMessage('Please set your Realtime Session URL.');
      return;
    }

    if (!profile.getRealtimeWebRTCUrl()) {
      setConnectStatus(CONNECT_DISCONNECTED);
      setConnectMessage('Please set your Realtime WebRTC URL.');
      return;
    }

    const deployment = profile.getRealtimeDeployment();
    if (!deployment) {
      setConnectStatus(CONNECT_DISCONNECTED);
      setConnectMessage('Please set your Realtime Deployment.');
      return;
    }

    try {
      setConnectStatus(CONNECT_CONNECTING);
      setConnectMessage('Getting ephemeral key...');

      const ephemeralKey = await getEK(
        profile.getRealtimeSessionUrl(),
        profile.realtimeKey,
        deployment,
      );

      if (!ephemeralKey) {
        setConnectStatus(CONNECT_DISCONNECTED);
        setConnectMessage('Error fetching ephemeral key.');
        return;
      }

      setConnectStatus(CONNECT_CONNECTING);
      setConnectMessage('Connecting...');
      initRtc(ephemeralKey, deployment);
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Render the application
   */
  return (
    <>
      <div className="content-logs container_bg">
        <div className="content-block conversation">
          <div className="content-block-body" data-conversation-content>
            <ConnectMessage
              connectMessage={connectMessage}
              defaultMessage={'Waiting for response...'}
            />
          </div>
        </div>
      </div>

      <div className="content-right">
        <BuiltFunctionDisable />

        <Camera />

        <SettingsComponent connectStatus={connectStatus} />

        <ConnectButton
          connectStatus={connectStatus}
          connectConversation={connectConversation}
        />
      </div>
    </>
  );
}
