import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_screen_display',
  description: `Turns on or off the air conditioning screen display. 设置屏幕亮灭/打开屏显/关闭屏显`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning screen display.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  llmState.screen_display = on;
  return {
    on: on,
  };
};
