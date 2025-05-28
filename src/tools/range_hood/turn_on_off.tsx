import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState } from '../RangeHoodState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_power',
  description: `Turns on or off the range hood.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the range hood.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  rangeHoodState.on = on;
  return {
    on: on,
    device_name: rangeHoodState.name,
  };
};
