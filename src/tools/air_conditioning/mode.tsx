import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { airState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'set_mode',
  description: `Sets the mode of the air conditioning. `,
  parameters: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        description: 'The mode to set the air conditioning to.',
        enum: [
          '制冷模式',
          '制热模式',
          '自动模式',
          '送风模式',
          '抽湿模式',
          '睡眠模式',
        ],
      },
    },
  },
};

export const handler: Function = async ({ mode }: { [key: string]: any }) => {
  airState.mode = mode;
  return {
    mode: mode,
  };
};
