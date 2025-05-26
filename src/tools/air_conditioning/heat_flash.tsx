import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_heat_flash',
  description: `Turns on or off the air conditioning heat flash. 设置速热模式/打开或关闭速热模式`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning heat flash.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  llmState.heat_flash = on;
  return {
    on: on,
  };
};
