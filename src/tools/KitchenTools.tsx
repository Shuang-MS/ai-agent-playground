import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

import { range_hood_control_tools } from './RangeHoodTools';
import { steaming_oven_control_tools } from './SteamingOvenTools';
import { dishwasher_control_tools } from './DishwasherStateTools';

export const kitchen_control_tools: [ToolDefinitionType, Function][] = [
  ...range_hood_control_tools,
  ...steaming_oven_control_tools,
  ...dishwasher_control_tools,
];
