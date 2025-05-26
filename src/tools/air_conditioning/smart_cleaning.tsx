import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_smart_cleaning',
  description: `Turns on or off the air conditioning smart cleaning. 智能清洁/智清洁`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning smart cleaning.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  llmState.smart_cleaning = on;
  return {
    on: on,
  };
};
