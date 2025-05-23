import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_electric_auxiliary_heating',
  description: `Turns on or off the air conditioning electric auxiliary heating. 电辅热`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning electric auxiliary heating.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  llmState.electric_auxiliary_heating = on;
  return {
    on: on,
  };
};
