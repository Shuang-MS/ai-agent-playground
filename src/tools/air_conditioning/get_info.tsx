import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { airState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'get_air_conditioning_info',
  description: `Gets the information about the air conditioning.`,
  parameters: {
    type: 'object',
    properties: {},
  },
};

export const handler: Function = async () => {
  return {
    state: airState,
  };
};
