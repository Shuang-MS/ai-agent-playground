import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

import * as steaming_oven_turn_on_off from './steaming_oven/turn_on_off';

export const steaming_oven_control_tools: [ToolDefinitionType, Function][] = [
  [steaming_oven_turn_on_off.definition, steaming_oven_turn_on_off.handler],
];
