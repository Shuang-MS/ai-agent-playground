import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_ai_control',
  description: `Turns on or off the air conditioning ai control. 设置AI功能/打开AI控制功能/关闭AI控制功能`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning ai control.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  llmState.ai_control = on;
  return {
    on: on,
  };
};
