import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_avatar',
  description:
    'You can turn on / off your virtual human avatar. respond wait message to the user before calling the tool.',
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'bool of turn on or off avatar.',
      },
    },
    required: ['on'],
    additionalProperties: false,
  },
};
