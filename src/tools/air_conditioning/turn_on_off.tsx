import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_off',
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
  llmState.on = on;
  return {
    on: on,
  };
};
