import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'get_info',
  description: `Gets the information about the air conditioning.`,
  parameters: {
    type: 'object',
    properties: {},
  },
};

export const handler: Function = async () => {
  return {
    state: llmState,
  };
};
