import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { rangeHoodState, rangeHoodState2 } from '../RangeHoodState';

export const definition: ToolDefinitionType = {
  name: 'turn_on_or_off_power_range_hood',
  description: `Turns on or off the range hood. 不要默认选择设备，用户必须明确指定设备名称，否则请按照设备列表反问名称。`,
  parameters: {
    type: 'object',
    properties: {
      on: {
        type: 'boolean',
        description: 'Whether to turn on or off the range hood.',
      },
      device_name: {
        type: 'string',
        description:
          'The device name of the range hood. 请不要默认选择第一个，这个参数必须由用户输入。',
        enum: [rangeHoodState.name, rangeHoodState2.name],
      },
    },
  },
};

export const handler: Function = async ({
  on,
  device_name,
}: {
  [key: string]: any;
}) => {
  if (device_name === rangeHoodState.name) {
    rangeHoodState.on = on;
  } else if (device_name === rangeHoodState2.name) {
    rangeHoodState2.on = on;
  }

  return {
    on: on,
    device_name: device_name,
  };
};
