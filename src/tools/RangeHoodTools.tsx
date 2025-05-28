import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

import * as range_hood_turn_on_off from './range_hood/turn_on_off';
import * as range_hood_set_level from './range_hood/set_level';
import * as range_hood_fetch_weather from './range_hood/fetch_weather';
import * as range_hood_get_current_time from './range_hood/get_current_time';
import * as range_hood_lock_screen from './range_hood/lock_screen';
import * as range_hood_rapid_suction from './range_hood/rapid_suction';
import * as range_hood_turn_on_off_light from './range_hood/turn_on_off_light';
import * as range_hood_scheduled_power_on_or_off from './range_hood/scheduled_power_on_or_off';
import * as range_hood_schedule_cron from './range_hood/schedule_cron';
import * as range_hood_turn_on_off_q5awi from './range_hood/turn_on_off_q5awi';

export const range_hood_control_tools: [ToolDefinitionType, Function][] = [
  [range_hood_turn_on_off.definition, range_hood_turn_on_off.handler],
  [range_hood_set_level.definition, range_hood_set_level.handler],
  [range_hood_fetch_weather.definition, range_hood_fetch_weather.handler],
  [range_hood_get_current_time.definition, range_hood_get_current_time.handler],
  [range_hood_lock_screen.definition, range_hood_lock_screen.handler],
  [range_hood_rapid_suction.definition, range_hood_rapid_suction.handler],
  [
    range_hood_turn_on_off_light.definition,
    range_hood_turn_on_off_light.handler,
  ],
  [
    range_hood_scheduled_power_on_or_off.definition,
    range_hood_scheduled_power_on_or_off.handler,
  ],
  [range_hood_schedule_cron.definition, range_hood_schedule_cron.handler],
  [
    range_hood_turn_on_off_q5awi.definition,
    range_hood_turn_on_off_q5awi.handler,
  ],
];
