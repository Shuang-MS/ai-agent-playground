import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

export const definition: ToolDefinitionType = {
  name: 'recommended_breakfast_steaming_oven',
  description: `Gets the recommended breakfast of the steaming oven. `,
  parameters: {
    type: 'object',
    properties: {},
  },
};

export const handler: Function = async () => {
  return {
    recommended_breakfast: [
      '蒸蛋',
      '蒸鱼',
      '蒸肉',
      '蒸蔬菜',
      '蒸米饭',
      '蒸馒头',
      '蒸包子',
    ],
  };
};
