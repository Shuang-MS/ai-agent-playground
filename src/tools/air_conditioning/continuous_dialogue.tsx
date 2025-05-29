import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { airState } from '../AirConditioningState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_continuous_dialogue',
  description: `Turns on or off the air conditioning continuous dialogue. 设置连续对话/打开或关闭连续对话/打开会话模式/打开或关闭自然对话`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning continuous dialogue.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  airState.continuous_dialogue = on;
  return {
    on: on,
  };
};
