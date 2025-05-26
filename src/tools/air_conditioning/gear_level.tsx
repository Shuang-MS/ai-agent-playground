import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'set_gear_level',
  description: `Sets the gear level of the air conditioning. 0/1/2/3/4/5 , 0 is off, 1 is low, 2 is medium, 3 is high, 4 is very high, 5 is max. 打开默认是 2`,
  parameters: {
    type: 'object',
    properties: {
      gear_level: {
        type: 'number',
        description: 'The gear level to set the air conditioning to.',
        enum: [0, 1, 2, 3, 4, 5],
      },
    },
  },
};

export const handler: Function = async ({
  gear_level,
}: {
  [key: string]: any;
}) => {
  llmState.gear_level = gear_level;
  return {
    gear_level: gear_level,
  };
};
