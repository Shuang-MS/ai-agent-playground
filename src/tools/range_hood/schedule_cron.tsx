import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState } from '../RangeHoodState';

export const definition: ToolDefinitionType = {
  name: 'set_schedule_cron',
  description: `Sets the schedule cron of the range hood.`,
  parameters: {
    type: 'object',
    properties: {
      cron: {
        type: 'string',
        description: 'The cron to set the range hood to.',
        enum: ['day', 'week', 'month'],
      },
      cron_action: {
        type: 'string',
        description: 'The cron value to set the range hood to.',
        enum: ['set_power_on', 'set_power_off', 'set_wind_level'],
      },
      cron_value: {
        type: 'string',
        description: 'The cron value to set the range hood to.',
      },
    },
    required: ['cron', 'cron_action', 'cron_value'],
    additionalProperties: false,
  },
};

export const handler: Function = async ({
  cron,
  cron_action,
  cron_value,
}: {
  [key: string]: any;
}) => {
  rangeHoodState.cron.push({
    cron: cron,
    cron_action: cron_action,
    cron_value: cron_value,
  });

  return {
    cron: cron,
    cron_action: cron_action,
    cron_value: cron_value,
  };
};
