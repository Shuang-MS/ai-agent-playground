import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

import * as dishwasher_turn_on_off from './dishwasher/turn_on_off';

export const dishwasher_control_tools: [ToolDefinitionType, Function][] = [
  [dishwasher_turn_on_off.definition, dishwasher_turn_on_off.handler],
];
