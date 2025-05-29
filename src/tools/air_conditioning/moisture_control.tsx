import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { airState } from '../AirConditioningState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_moisture_control',
  description: `Turns on or off the air conditioning moisture control. 湿度控制/设置AI控湿功能/打开AI控湿功能/关闭AI控湿功能`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning moisture control.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  airState.moisture_control = on;
  return {
    on: on,
  };
};
