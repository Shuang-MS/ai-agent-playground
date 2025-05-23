import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_wind_free',
  description: `Turns on or off the air conditioning wind free. 无风感`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning wind free.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  llmState.wind_free = on;
  return {
    on: on,
  };
};
