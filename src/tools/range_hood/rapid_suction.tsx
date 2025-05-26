import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState } from '../../components/RangeHood';

export const definition: ToolDefinitionType = {
  name: 'set_rapid_suction',
  description: `Sets the rapid suction of the range hood. `,
  parameters: {
    type: 'object',
    properties: {
      position: {
        type: 'string',
        description: 'The position to set the rapid suction to.',
        enum: ['left', 'right', 'both'],
      },
      level: {
        type: 'number',
        description: 'The level to set the rapid suction to. 0 is off',
        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    },
    required: ['position', 'level'],
    additionalProperties: false,
  },
};

export const handler: Function = async ({
  position,
  level,
}: {
  [key: string]: any;
}) => {
  if (position === 'left') {
    rangeHoodState.rapid_suction_left = level;
  } else if (position === 'right') {
    rangeHoodState.rapid_suction_right = level;
  } else if (position === 'both') {
    rangeHoodState.rapid_suction_both = level;
  }

  return {
    rapid_suction_left: rangeHoodState.rapid_suction_left,
    rapid_suction_right: rangeHoodState.rapid_suction_right,
    rapid_suction_both: rangeHoodState.rapid_suction_both,
  };
};
