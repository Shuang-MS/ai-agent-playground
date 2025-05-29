import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { steamingOvenState, SteamingOvenMenu } from '../SteamingOvenState';

export const definition: ToolDefinitionType = {
  name: 'set_reservation_steaming_oven',
  description: `Sets the reservation of the steaming oven. `,
  parameters: {
    type: 'object',
    properties: {
      start_at: {
        type: 'number',
        description: 'The start time of the reservation.',
      },
      end_at: {
        type: 'number',
        description: 'The end time of the reservation.',
      },
    },
  },
};

export const handler: Function = async ({
  start_at,
  end_at,
}: {
  [key: string]: any;
}) => {
  steamingOvenState.reservation_start_at = start_at;
  steamingOvenState.reservation_end_at = end_at;

  return {
    start_at: start_at,
    end_at: end_at,
  };
};
