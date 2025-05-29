import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState } from '../RangeHoodState';

export const definition: ToolDefinitionType = {
  name: 'set_scheduled_power_on_or_off',
  description: `Sets the scheduled power on or off of the range hood. 0/1/2/3/4/5 , 0 is off/取消定时, 1 is low, 2 is medium, 3 is high, 4 is very high, 5 is max.`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the range hood.',
      },
      after_minutes: {
        type: 'number',
        description:
          'The minutes to turn on or off the range hood. 你需要把时间单位都换算为分钟',
        enum: [0, 3, 5, 10, 15, 20, 25, 30, 45, 60],
      },
      trigger_type: {
        type: 'string',
        description: 'The trigger type of the range hood.',
        enum: ['notify', 'execute'],
      },
    },
    required: ['on', 'after_minutes', 'trigger_type'],
    additionalProperties: false,
  },
};

export const handler: Function = async ({
  on,
  after_minutes,
}: {
  [key: string]: any;
}) => {
  if (on) {
    rangeHoodState.scheduled_power_on_minutes = after_minutes;
  } else {
    rangeHoodState.scheduled_power_off_minutes = after_minutes;
  }
  return {
    on,
    after_minutes,
  };
};
