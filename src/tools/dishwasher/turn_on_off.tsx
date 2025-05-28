import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { dishwasherState } from '../DishwasherState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_power_dishwasher',
  description: `Turns on or off the dishwasher.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the dishwasher.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  dishwasherState.on = on;
  return {
    on: on,
    device_name: dishwasherState.name,
  };
};
