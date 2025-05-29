import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { steamingOvenState, SteamingOvenRunMode } from '../SteamingOvenState';

export const definition: ToolDefinitionType = {
  name: 'set_mode_steaming_oven',
  description: `Sets the mode of the steaming oven. `,
  parameters: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        description: 'The mode to set the steaming oven to.',
        enum: Object.values(SteamingOvenRunMode),
      },
    },
  },
};

export const handler: Function = async ({ mode }: { [key: string]: any }) => {
  steamingOvenState.run_mode = mode;

  return {
    mode: mode,
  };
};
