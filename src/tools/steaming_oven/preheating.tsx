import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { steamingOvenState } from '../SteamingOvenState';

export const definition: ToolDefinitionType = {
  name: 'set_preheating',
  description: `Sets the preheating（预热） of the steaming oven. 预热支持两种模式， 如果用户没有明确指定，请反问。`,
  parameters: {
    type: 'object',
    properties: {
      preheating: {
        type: 'string',
        description: 'The preheating to set the steaming oven to.',
        enum: ['蒸烤箱蒸模式预热', '烤模式预热'],
      },
      minutes: {
        type: 'number',
        description: 'The minutes to set the preheating to.',
        enum: [10, 15, 20, 25, 30, 45, 60],
      },
    },
  },
};

export const handler: Function = async ({
  preheating,
}: {
  [key: string]: any;
}) => {
  steamingOvenState.preheating = preheating;

  return {
    preheating: preheating,
  };
};
