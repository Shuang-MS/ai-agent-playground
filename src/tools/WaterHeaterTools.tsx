import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

import * as water_heater_turn_on_off from './water_heater/turn_on_off';
import * as power_off from './water_heater/power_off';

export const water_heater_control_tools: [ToolDefinitionType, Function][] = [
  [water_heater_turn_on_off.definition, water_heater_turn_on_off.handler],
  [power_off.definition, power_off.handler],
];
