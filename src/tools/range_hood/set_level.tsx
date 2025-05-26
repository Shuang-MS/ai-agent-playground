import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState } from '../../components/RangeHood';

export const definition: ToolDefinitionType = {
  name: 'set_level',
  description: `Sets the level of the range hood. 0/1/2/3/4/5/6/7/8/9/10 , 0 is off, 打开默认是 2`,
  parameters: {
    type: 'object',
    properties: {
      level: {
        type: 'number',
        description: 'The level to set the range hood to.',
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
  },
};

export const handler: Function = async ({ level }: { [key: string]: any }) => {
  rangeHoodState.level = level;
  return {
    level: level,
  };
};
