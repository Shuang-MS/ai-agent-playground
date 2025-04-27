import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

export const definition: ToolDefinitionType = {
  name: 'image_modify',
  description:
    'modify generated painting or uploaded image. you have a mask image for modifying certain parts, so do not ask user provide mask image or specify the parts to modify, respond wait message to the user before calling the tool.',
  parameters: {
    type: 'object',
    properties: {
      edit_prompt: {
        type: 'string',
        description: 'prompt of the edited image',
      },
    },
    required: ['edit_prompt'],
    strict: true,
  },
};
