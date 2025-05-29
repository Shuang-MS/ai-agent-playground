import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { dishwasherState } from '../DishwasherState';

export const definition: ToolDefinitionType = {
  name: 'get_dishwasher_info',
  description: `Gets the information about the dishwasher.`,
  parameters: {
    type: 'object',
    properties: {},
  },
};

export const handler: Function = async () => {
  return {
    state: dishwasherState,
  };
};
