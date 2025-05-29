import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState } from '../RangeHoodState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_off_q5awi',
  description: `Turns on or off the Q5awi of the range hood.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the Q5awi of the range hood.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  rangeHoodState.q5awi_on = on;
  return {
    q5awi_on: on,
  };
};
