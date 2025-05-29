import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

export const definition: ToolDefinitionType = {
  name: 'get_current_time',
  description: `Gets the current time.`,
  parameters: {
    type: 'object',
    properties: {},
  },
};

export const handler: Function = async () => {
  return {
    time: new Date().toLocaleString(),
    week: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
  };
};
