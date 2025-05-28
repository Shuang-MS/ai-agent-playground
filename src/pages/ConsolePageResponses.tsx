import { useCallback, useState } from 'react';

import {
  CONNECT_CONNECTED,
  CONNECT_CONNECTING,
  CONNECT_DISCONNECTED,
} from '../lib/const';

import './ConsolePage.scss';
import Camera from '../components/Camera';
import SettingsComponent from '../components/Settings';
import FileViewer from '../components/FileViewer';
import Avatar from '../components/Avatar';
import ConnectButton from '../components/ConnectButton';
import ConnectMessage from '../components/ConnectMessage';
import AssistantMessages from '../components/messages/AssistantMessages';

import { getOpenAIClient, parseOpenaiSetting } from '../lib/openai';
import { useContexts } from '../providers/AppProvider';
import { InputBarAssistant } from '../components/InputBarAssistant';

import BuiltFunctionDisable from '../components/BuiltFunctionDisable';
import { Profiles } from '../lib/Profiles';
import SpeechTTS from '../components/SpeechTTS';

import {
  ResponseCreateParamsStreaming,
  Tool,
  ResponseFunctionToolCall,
  Response,
  ResponseInputItem,
} from 'openai/resources/responses/responses';
import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { getInstructions } from '../components/GetInstructions';

export function ConsolePageResponses() {
  const {
    connectMessage,
    connectStatus,
    recordTokenLatency,
    setConnectMessage,
    setConnectStatus,
    setInputTokens,
    setMessages,
    setOutputTokens,
    setResponseBuffer,
    setLastMessageTextArray,
  } = useContexts();

  const [messagesAssistant, setMessagesAssistant] = useState<any[]>([]);

  const [lastResponse, setLastResponse] = useState<Response | null>(null);

  const [assistantRunning, setAssistantRunning] = useState(false);

  const [profiles] = useState<Profiles>(new Profiles());

  const { functionsToolsRef, llmInstructions } = useContexts();

  const functionCallHandler = async (
    call: ResponseFunctionToolCall,
  ): Promise<ResponseInputItem.FunctionCallOutput> => {
    console.log('load function call', call);

    const args = JSON.parse(call.arguments);

    for (const [definition, handler] of functionsToolsRef.current) {
      if (definition.name === call.name) {
        const output = await handler({ ...args });
        const result = {
          ...call,
          output: output,
        };
        setMessages((prevMessages) => [result, ...prevMessages]);
        return {
          type: 'function_call_output',
          call_id: call.call_id,
          output: JSON.stringify(output),
        } as ResponseInputItem.FunctionCallOutput;
      }
    }

    return {
      type: 'function_call_output',
      call_id: call.call_id,
      output: JSON.stringify({
        error: `Function ${call.name} not found`,
      }),
    } as ResponseInputItem.FunctionCallOutput;
  };

  const stopResponsesJob = async () => {
    if (lastResponse === null) {
      return;
    }

    console.log('lastResponse:', lastResponse);

    try {
      const cancelJob = await getOpenAIClient().responses.cancel(
        lastResponse.id,
      );
      console.log('cancelJob', cancelJob);
    } catch (error) {
      console.log('cancelJob error', JSON.stringify(error));
    }
  };

  const handleAssistantTextCreated = () => {
    appendAssistantMessage('assistant', '');
  };

  /*
    =======================
    === Utility Helpers ===
    =======================
  */
  const appendAssistantToLastMessage = (text: string) => {
    setMessagesAssistant((prevMessages: any) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      const latestText = lastMessage.text + text;
      const updatedLastMessage = {
        ...lastMessage,
        text: latestText,
      };

      return [...prevMessages.slice(0, -1), updatedLastMessage];
    });
  };

  const appendAssistantMessage = (role: string, text: string) => {
    setMessagesAssistant((prevMessages: any) => [
      ...prevMessages,
      { role, text },
    ]);
  };

  const sendAssistantMessage = async (
    inputMessage: string | ResponseInputItem.FunctionCallOutput[],
  ) => {
    setAssistantRunning(true);
    try {
      const { modelName } = parseOpenaiSetting(
        profiles.currentProfile?.completionTargetUri || '',
      );

      const tools: Array<Tool> = [];

      functionsToolsRef.current.forEach(
        ([definition]: [ToolDefinitionType, Function]) => {
          tools.push({
            type: 'function',
            name: definition.name,
            description: definition.description,
            parameters: definition.parameters,
            strict: true,
          } as Tool);
        },
      );

      const params: ResponseCreateParamsStreaming = {
        instructions: getInstructions(llmInstructions),
        temperature: profiles.currentProfile?.temperature || 0.5,
        top_p: 1,
        model: modelName,
        // store: true,
        input: inputMessage,
        stream: true,
        tools: tools,
        previous_response_id: lastResponse?.id || null,
      };

      const response = await getOpenAIClient().responses.create(params);

      handleAssistantTextCreated();

      const functionCallOutput: ResponseInputItem.FunctionCallOutput[] = [];

      for await (const event of response) {
        console.log(event);
        recordTokenLatency();
        if (event.type === 'response.output_text.delta') {
          setResponseBuffer((latestText) => latestText + event.delta);
          appendAssistantToLastMessage(event.delta);
        } else if (event.type === 'response.output_text.done') {
          setLastMessageTextArray((prev) => [...prev, event.text]);
        } else if (event.type === 'response.completed') {
          if (event.response.usage) {
            const { input_tokens, output_tokens } = event.response.usage;
            setInputTokens((prev) => prev + input_tokens);
            setOutputTokens((prev) => prev + output_tokens);
          }

          if (functionCallOutput.length > 0) {
            await sendAssistantMessage(functionCallOutput);
          }
        } else if (event.type === 'response.output_item.done') {
          if (event.item.type === 'function_call') {
            functionCallOutput.push(await functionCallHandler(event.item));
          }
        } else if (event.type === 'response.created') {
          setLastResponse(event.response);
        }
      }
    } catch (error) {
      setConnectStatus(CONNECT_DISCONNECTED);
      setConnectMessage(JSON.stringify(error));
    }
    setAssistantRunning(false);
  };

  const connectConversation = useCallback(async () => {
    try {
      setConnectStatus(CONNECT_CONNECTING);
      setConnectStatus(CONNECT_CONNECTED);
      setConnectMessage('');
      setLastResponse(null);
    } catch (error: any) {
      setConnectStatus(CONNECT_DISCONNECTED);
      setConnectMessage(error.message);
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
            <ConnectMessage connectMessage={connectMessage} />

            <AssistantMessages
              connectStatus={connectStatus}
              messagesAssistant={messagesAssistant}
            />
          </div>

          <InputBarAssistant
            setMessagesAssistant={setMessagesAssistant}
            setAssistantRunning={setAssistantRunning}
            sendAssistantMessage={sendAssistantMessage}
            stopCurrentStreamJob={stopResponsesJob}
            assistantRunning={assistantRunning}
          />
        </div>
      </div>

      <div className="content-right">
        <BuiltFunctionDisable />

        <Avatar />

        <SpeechTTS />

        <Camera />

        <SettingsComponent connectStatus={connectStatus} />

        <FileViewer connectStatus={connectStatus} />

        <ConnectButton
          connectStatus={connectStatus}
          connectConversation={connectConversation}
        />
      </div>
    </>
  );
}
