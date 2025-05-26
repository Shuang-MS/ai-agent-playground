import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_anti_direct_airflow',
  description: `Turns on or off the air conditioning anti direct airflow. 设置防直吹/打开或关闭防直吹、打开或者关闭面对着人直接吹`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description:
          'Whether to turn on or off the air conditioning anti direct airflow.',
      },
    },
  },
};

export const handler: Function = async ({ on }: { [key: string]: any }) => {
  llmState.anti_direct_airflow = on;
  return {
    on: on,
  };
};
