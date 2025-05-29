import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

import * as steaming_oven_turn_on_off from './steaming_oven/turn_on_off';
import * as steaming_oven_get_info from './steaming_oven/get_info';
import * as steaming_oven_temperature from './steaming_oven/temperature';
import * as steaming_oven_menu from './steaming_oven/menu';
import * as steaming_oven_mode from './steaming_oven/mode';
import * as steaming_oven_humidifier_on from './steaming_oven/humidifier_on';
import * as steaming_oven_water_tank_on from './steaming_oven/water_tank_on';
import * as steaming_oven_reservation from './steaming_oven/reservation';
import * as steaming_oven_action from './steaming_oven/action';

export const steaming_oven_control_tools: [ToolDefinitionType, Function][] = [
  [steaming_oven_turn_on_off.definition, steaming_oven_turn_on_off.handler],
  [steaming_oven_get_info.definition, steaming_oven_get_info.handler],
  [steaming_oven_temperature.definition, steaming_oven_temperature.handler],
  [steaming_oven_menu.definition, steaming_oven_menu.handler],
  [steaming_oven_mode.definition, steaming_oven_mode.handler],
  [steaming_oven_humidifier_on.definition, steaming_oven_humidifier_on.handler],
  [steaming_oven_water_tank_on.definition, steaming_oven_water_tank_on.handler],
  [steaming_oven_reservation.definition, steaming_oven_reservation.handler],
  [steaming_oven_action.definition, steaming_oven_action.handler],
];
