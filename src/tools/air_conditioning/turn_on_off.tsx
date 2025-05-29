import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { airState } from '../AirConditioningState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_power',
  description: `Turns on or off the air conditioning.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the air conditioning.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  airState.on = on;
  return {
    on: on,
  };
};
