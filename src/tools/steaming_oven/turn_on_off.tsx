import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { steamingOvenState } from '../SteamingOvenState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_power_steaming_oven',
  description: `Turns on or off the steaming oven.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the steaming oven.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  steamingOvenState.on = on;
  return {
    on: on,
    device_name: steamingOvenState.name,
  };
};
