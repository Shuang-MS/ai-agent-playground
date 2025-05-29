import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { dishwasherState, RunMode } from '../DishwasherState';

export const definition: ToolDefinitionType = {
  name: 'set_run_mode_dishwasher',
  description: `Sets the run mode of the dishwasher.`,
  parameters: {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        description: 'The run mode of the dishwasher.',
        enum: Object.values(RunMode),
      },
    },
  },
};

export const handler: Function = async ({ mode }: { [key: string]: any }) => {
  dishwasherState.run_mode = mode;
  return {
    mode: mode,
    device_name: dishwasherState.name,
  };
};
