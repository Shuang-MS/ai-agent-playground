import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { waterHeater } from '../waterHeater';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_power_water_heater',
  description: `Turns on or off the water heater.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the water heater.',
      },
      name: {
        type: 'string',
        description: 'The name of the water heater.',
        enum: [waterHeater.name],
      },
    },
  },
};

export const handler: Function = async ({
  on,
  name,
}: {
  [key: string]: any;
}) => {
  waterHeater.on = on;

  return {
    on: on,
    name: name,
  };
};
