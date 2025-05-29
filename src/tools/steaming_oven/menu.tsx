import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { steamingOvenState, SteamingOvenMenu } from '../SteamingOvenState';

const menu_string = Object.values(SteamingOvenMenu)
  .map((menu) => menu.toString())
  .join(',');

export const definition: ToolDefinitionType = {
  name: 'set_menu_steaming_oven',
  description: `Sets the menu of the steaming oven. `,
  parameters: {
    type: 'object',
    properties: {
      menu: {
        type: 'string',
        description: `The menu to set the steaming oven to. 可能在菜单里：${menu_string}， 也可以不在菜单里，比如包子或者其他事物。`,
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
