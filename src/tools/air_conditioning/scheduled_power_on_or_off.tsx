import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'set_scheduled_power_on_or_off',
  description: `Sets the gear level of the air conditioning. 0/1/2/3/4/5 , 0 is off, 1 is low, 2 is medium, 3 is high, 4 is very high, 5 is max.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the air conditioning.',
      },
      after_minutes: {
        type: 'number',
        description: 'The minutes to turn on or off the air conditioning.',
      },
    },
  },
};

export const handler: Function = async ({
  on,
  after_minutes,
}: {
  [key: string]: any;
}) => {
  if (on) {
    llmState.scheduled_power_on_minutes = after_minutes;
  } else {
    llmState.scheduled_power_off_minutes = after_minutes;
  }
  return {
    on,
    after_minutes,
  };
};
