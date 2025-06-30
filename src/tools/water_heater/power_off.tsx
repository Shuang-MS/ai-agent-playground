import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { waterHeater } from '../waterHeater';

export const definition: ToolDefinitionType = {
  name: 'power_off_when_temperature_is_arrive',
  description: `Sets the scheduled power off of the water heater when the temperature is arrive.`,
  parameters: {
    type: 'object',
    properties: {
      temperature: {
        type: 'number',
        description: 'The temperature to set the water heater to.',
        enum: [25, 30, 45, 60, 70, 80, 90, 100],
      },
    },
    required: ['temperature'],
    additionalProperties: false,
  },
};

export const handler: Function = async ({
  temperature,
}: {
  [key: string]: any;
}) => {
  waterHeater.power_off_when_temperature_is_arrive = temperature;
  return {
    temperature,
  };
};
