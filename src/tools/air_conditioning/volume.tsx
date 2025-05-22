import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'set_volume',
  description: `Sets the volume of the air conditioning. 0/1/2/3/4/5/6/7/8/9/10 , 0 is off`,
  parameters: {
    type: 'object',
    properties: {
      gear_level: {
        type: 'number',
        description: 'The volume to set the air conditioning to.',
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
  },
};

export const handler: Function = async ({ volume }: { [key: string]: any }) => {
  llmState.volume = volume;
  return {
    volume: volume,
  };
};
