import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

export const definition: ToolDefinitionType = {
  name: 'painting_modify',
  description:
    'modify generated painting. edit generated image. respond wait message to the user before calling the tool.',
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
