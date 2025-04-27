import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

export const definition: ToolDefinitionType = {
  name: 'image_modify',
  description:
    'modify generated painting. edit generated image. you have a mask image for modifying certain parts, so do not ask user provide mask image or specify the parts to modify, respond wait message to the user before calling the tool.',
  parameters: {
    type: 'object',
    properties: {
      prompt: {
        type: 'string',
        description: 'prompt of the image',
      },
    },
    required: ['prompt'],
    strict: true,
  },
};
