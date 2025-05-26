import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'set_scheduled_power_on_or_off',
  description: `Sets the gear level of the air conditioning. 0/1/2/3/4/5 , 0 is off/取消定时, 1 is low, 2 is medium, 3 is high, 4 is very high, 5 is max.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the air conditioning.',
      },
      after_hours: {
        type: 'number',
        description:
          'The minutes to turn on or off the air conditioning. 你需要把时间单位都换算为小时',
        enum: [0, 0.5, 1, 2, 3, 4, 5, 6, 7, 8],
      },
    },
  },
};

export const handler: Function = async ({
  on,
  after_hours,
}: {
  [key: string]: any;
}) => {
  if (on) {
    llmState.scheduled_power_on_hours = after_hours;
  } else {
    llmState.scheduled_power_off_hours = after_hours;
  }
  return {
    on,
    after_hours,
  };
};
