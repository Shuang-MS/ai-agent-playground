import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { steamingOvenState, SteamingOvenMenu } from '../SteamingOvenState';

export const definition: ToolDefinitionType = {
  name: 'set_menu_steaming_oven',
  description: `Sets the menu of the steaming oven. `,
  parameters: {
    type: 'object',
    properties: {
      menu: {
        type: 'string',
        description: 'The menu to set the steaming oven to.',
        enum: Object.values(SteamingOvenMenu),
      },
    },
  },
};

export const handler: Function = async ({ menu }: { [key: string]: any }) => {
  steamingOvenState.menu = menu;

  return {
    menu: menu,
  };
};
