import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState } from '../../components/RangeHood';

export const definition: ToolDefinitionType = {
  name: 'turn_on_off_light',
  description: `Turns on or off the light of the range hood.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the light of the range hood.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  rangeHoodState.light = on;
  return {
    light: on,
  };
};
