import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'set_temperature',
  description: `Sets the temperature of the air conditioning. 有点冷：+1度 / 有点热：-1度 / 太冷了：+3度 / 太热了：-3度。最高是30度，最低是16度。如果是送风模式，则不允许调整温度。`,
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

  if (llmState.mode === '送风模式') {
    return {
      error: '送风模式不能调整温度',
    };
  }

  return {
    temperature: temperature,
  };
};
