import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState } from '../RangeHoodState';

export const definition: ToolDefinitionType = {
  name: 'lock_screen',
  description: `Locks the screen.`,
  parameters: {
    type: 'object',
    properties: {
      lockScreen: {
        type: 'boolean',
        description: 'Whether to lock the screen.',
      },
    },
  },
};

export const handler: Function = async ({
  lockScreen,
}: {
  [key: string]: any;
}) => {
  rangeHoodState.lockScreen = lockScreen;
  return {
    lockScreen: lockScreen,
  };
};
