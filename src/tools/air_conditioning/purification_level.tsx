import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { airState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'set_purification_level',
  description: `Sets the purification level of the air conditioning. 净化模式级别 0/1/2/3/4/5, 减小净化是当前级别-1, 增大净化是当前级别+1. 0是关闭净化。最小最低是1。打开默认是2`,
  parameters: {
    type: 'object',
    properties: {
      purification_level: {
        type: 'number',
        description: 'The purification level to set the air conditioning to.',
        enum: [0, 1, 2, 3, 4, 5],
      },
    },
  },
};

export const handler: Function = async ({
  purification_level,
}: {
  [key: string]: any;
}) => {
  airState.purification_level = purification_level;
  return {
    purification_level: purification_level,
  };
};
