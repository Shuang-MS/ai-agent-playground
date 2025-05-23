import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_cool_flash',
  description: `Turns on or off the air conditioning cool flash. 设置速冷模式/打开或关闭速冷模式`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning cool flash.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  llmState.cool_flash = on;
  return {
    on: on,
  };
};
