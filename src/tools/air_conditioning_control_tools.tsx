import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

import * as air_weather from './air_conditioning/fetch_weather';
import * as air_turn_on_off from './air_conditioning/turn_on_off';
import * as air_get_info from './air_conditioning/get_info';
import * as air_temperature from './air_conditioning/temperature';
import * as air_mode from './air_conditioning/mode';
import * as air_disinfection from './air_conditioning/disinfection';
import * as air_ai_control from './air_conditioning/ai_control';
import * as air_fresh_air_level from './air_conditioning/fresh_air_level';
import * as air_purification_level from './air_conditioning/purification_level';
import * as air_gear_level from './air_conditioning/gear_level';
import * as air_volume from './air_conditioning/volume';
import * as air_moisture_control from './air_conditioning/moisture_control';
import * as air_heat_flash from './air_conditioning/heat_flash';
import * as air_cool_flash from './air_conditioning/cool_flash';
import * as air_anti_direct_airflow from './air_conditioning/anti_direct_airflow';
import * as air_smart_cleaning from './air_conditioning/smart_cleaning';
import * as air_wind_free from './air_conditioning/wind_free';
import * as air_electric_auxiliary_heating from './air_conditioning/electric_auxiliary_heating';
import * as air_scheduled_power_on_or_off from './air_conditioning/scheduled_power_on_or_off';
import * as air_direction from './air_conditioning/air_direction';
import * as air_screen_display from './air_conditioning/screen_display';
import * as air_wind_speed_percentage from './air_conditioning/wind_speed_percentage';
import * as air_energy_saving from './air_conditioning/energy_saving';
import * as air_continuous_dialogue from './air_conditioning/continuous_dialogue';

export const air_conditioning_control_tools: [ToolDefinitionType, Function][] =
  [
    [air_weather.definition, air_weather.handler],
    [air_turn_on_off.definition, air_turn_on_off.handler],
    [air_get_info.definition, air_get_info.handler],
    [air_temperature.definition, air_temperature.handler],
    [air_mode.definition, air_mode.handler],
    [air_disinfection.definition, air_disinfection.handler],
    [air_ai_control.definition, air_ai_control.handler],
    [air_fresh_air_level.definition, air_fresh_air_level.handler],
    [air_purification_level.definition, air_purification_level.handler],
    [air_gear_level.definition, air_gear_level.handler],
    [air_volume.definition, air_volume.handler],
    [air_moisture_control.definition, air_moisture_control.handler],
    [air_heat_flash.definition, air_heat_flash.handler],
    [air_cool_flash.definition, air_cool_flash.handler],
    [air_anti_direct_airflow.definition, air_anti_direct_airflow.handler],
    [air_smart_cleaning.definition, air_smart_cleaning.handler],
    [air_wind_free.definition, air_wind_free.handler],
    [
      air_electric_auxiliary_heating.definition,
      air_electric_auxiliary_heating.handler,
    ],
    [
      air_scheduled_power_on_or_off.definition,
      air_scheduled_power_on_or_off.handler,
    ],
    [air_direction.definition, air_direction.handler],
    [air_screen_display.definition, air_screen_display.handler],
    [air_wind_speed_percentage.definition, air_wind_speed_percentage.handler],
    [air_energy_saving.definition, air_energy_saving.handler],
    [air_continuous_dialogue.definition, air_continuous_dialogue.handler],
  ];
