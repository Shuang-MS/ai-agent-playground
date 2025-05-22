import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'set_fresh_air_level',
  description: `Sets the fresh air level of the air conditioning. 新风模式级别 0/1/2/3/4/5, 减小新风是当前级别-1, 增加新风是当前级别+1。0是关闭新风。`,
  parameters: {
    type: 'object',
    properties: {
      fresh_air_level: {
        type: 'number',
        description: 'The fresh air level to set the air conditioning to.',
        enum: [0, 1, 2, 3, 4, 5],
      },
    },
  },
};

export const handler: Function = async ({
  fresh_air_level,
}: {
  [key: string]: any;
}) => {
  llmState.fresh_air_level = fresh_air_level;
  return {
    fresh_air_level: fresh_air_level,
  };
};
