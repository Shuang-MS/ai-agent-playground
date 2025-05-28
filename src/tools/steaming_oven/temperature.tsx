import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { steamingOvenState } from '../SteamingOvenState';

export const definition: ToolDefinitionType = {
  name: 'set_temperature_steaming_oven',
  description: `Sets the temperature of the steaming oven. `,
  parameters: {
    type: 'object',
    properties: {
      temperature: {
        type: 'number',
        description: 'The temperature to set the steaming oven to.',
        enum: [
          50, 55, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180,
          190, 200,
        ],
      },
    },
  },
};

export const handler: Function = async ({
  temperature,
}: {
  [key: string]: any;
}) => {
  steamingOvenState.temperature = temperature;

  return {
    temperature: temperature,
  };
};
