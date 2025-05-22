import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/LlmState';

export const definition: ToolDefinitionType = {
  name: 'set_wind_speed_percentage',
  description: `Sets the wind speed percentage of the air conditioning. 风速。 /最小风，风速一档，风速百分之一/静音风是百分之20%`,
  parameters: {
    type: 'object',
    properties: {
      wind_speed_percentage: {
        type: 'number',
        description:
          'The wind speed percentage to set the air conditioning to.',
        enum: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      },
    },
  },
};

export const handler: Function = async ({
  wind_speed_percentage,
}: {
  [key: string]: any;
}) => {
  llmState.wind_speed_percentage = wind_speed_percentage;
  return {
    wind_speed_percentage: wind_speed_percentage,
  };
};
