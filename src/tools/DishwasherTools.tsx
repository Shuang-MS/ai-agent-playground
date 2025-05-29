import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

import * as dishwasher_turn_on_off from './dishwasher/turn_on_off';
import * as dishwasher_mode from './dishwasher/mode';
import * as dishwasher_state from './dishwasher/state';
import * as dishwasher_get_info from './dishwasher/get_info';

export const dishwasher_control_tools: [ToolDefinitionType, Function][] = [
  [dishwasher_turn_on_off.definition, dishwasher_turn_on_off.handler],
  [dishwasher_mode.definition, dishwasher_mode.handler],
  [dishwasher_state.definition, dishwasher_state.handler],
  [dishwasher_get_info.definition, dishwasher_get_info.handler],
];
