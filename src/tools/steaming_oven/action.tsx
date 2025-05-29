import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

export const definition: ToolDefinitionType = {
  name: 'get_action',
  description: `get action of steaming oven, like make food, cook, breakfast, lunch, meals, etc., as well as the food related operations that users wish the steaming oven to perform. The action you need to extract is food, breakfast, lunch, meals, etc.`,
  parameters: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        description:
          'The action of the steaming oven. like make food, cook, breakfast, lunch, meals, etc.',
      },
    },
  },
};

export const handler: Function = async ({ action }: { [key: string]: any }) => {
  return {
    action: action,
  };
};
