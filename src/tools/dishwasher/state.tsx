import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { dishwasherState, RunState } from '../DishwasherState';

export const definition: ToolDefinitionType = {
  name: 'get_dishwasher_state',
  description: `Gets the state of the dishwasher.`,
  parameters: {
    type: 'object',
    properties: {
      state: {
        type: 'string',
        description: 'The state of the dishwasher.',
        enum: Object.values(RunState),
      },
    },
  },
};

export const handler: Function = async ({ state }: { [key: string]: any }) => {
  dishwasherState.run_state = state;

  if (state === RunState.start) {
    dishwasherState.finish_at = new Date().getTime() + 60 * 60;
  } else {
    dishwasherState.finish_at = 0;
  }

  return {
    state: state,
    device_name: dishwasherState.name,
  };
};
