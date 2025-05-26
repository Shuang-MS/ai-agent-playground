import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { llmState } from '../../components/AirState';

export const definition: ToolDefinitionType = {
  name: 'set_volume_percentage',
  description: `Sets the volume of the air conditioning. 0 is off/silent/mute/静音, 100 is max.`,
  parameters: {
    type: 'object',
    properties: {
      volume_percentage: {
        type: 'number',
        description: 'The volume to set the air conditioning to.',
        default: 50,
        range: {
          min: 0,
          max: 100,
          step: 1,
        },
      },
    },
  },
};

export const handler: Function = async ({
  volume_percentage,
}: {
  [key: string]: any;
}) => {
  llmState.volume_percentage = volume_percentage;
  return {
    volume_percentage: volume_percentage,
  };
};
