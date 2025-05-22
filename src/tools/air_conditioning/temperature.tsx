import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'set_temperature',
  description: `Sets the temperature of the air conditioning. 有点冷：+1度 / 有点热：-1度 / 太冷了：+3度 / 太热了：-3度`,
  parameters: {
    type: 'object',
    properties: {
      temperature: {
        type: 'number',
        description: 'The temperature to set the air conditioning to.',
        enum: [
          16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22, 22.5,
          23, 23.5, 24, 24.5, 25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5,
          30,
        ],
      },
    },
  },
};

export const handler: Function = async ({
  temperature,
}: {
  [key: string]: any;
}) => {
  llmState.temperature = temperature;
  return {
    temperature: temperature,
  };
};
