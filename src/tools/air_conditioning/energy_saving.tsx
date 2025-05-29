import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { airState } from '../AirConditioningState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_energy_saving',
  description: `Turns on or off the air conditioning energy saving. 节能模式/节能省电模式/ECOMaster功能/ECO功能`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning energy saving.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  airState.energy_saving = on;
  return {
    on: on,
  };
};
