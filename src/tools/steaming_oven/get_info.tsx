import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { steamingOvenState } from '../SteamingOvenState';

export const definition: ToolDefinitionType = {
  name: 'get_steaming_oven_info',
  description: `Gets the information about the steaming oven.`,
  parameters: {
    type: 'object',
    properties: {},
  },
};

export const handler: Function = async () => {
  return steamingOvenState;
};
