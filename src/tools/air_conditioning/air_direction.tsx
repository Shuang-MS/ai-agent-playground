import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'set_air_direction',
  description: `Sets the air direction of the air conditioning. `,
  parameters: {
    type: 'object',
    properties: {
      air_direction: {
        type: 'string',
        description: 'The air direction to set the air conditioning to.',
        enum: ['上', '下', '左', '右', '上下', '左右', '关闭'],
      },
    },
  },
};

export const handler: Function = async ({
  air_direction,
}: {
  [key: string]: any;
}) => {
  llmState.air_direction = air_direction;

  let message = '';
  if (llmState.air_direction !== '关闭') {
    llmState.mode = '制热模式';
    message = '已经顺便把空调模式设置为制热模式';
  }

  return {
    air_direction: air_direction,
    message: message,
  };
};
