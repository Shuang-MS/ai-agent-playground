import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState, rangeHoodState2 } from '../RangeHoodState';

export const definition: ToolDefinitionType = {
  name: 'get_range_hood_info',
  description: `Gets the information about the range hood.`,
  parameters: {
    type: 'object',
    properties: {},
  },
};

export const handler: Function = async () => {
  return {
    state: [rangeHoodState, rangeHoodState2],
  };
};
