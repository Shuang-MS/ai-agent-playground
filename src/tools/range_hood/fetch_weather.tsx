import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';

export const definition: ToolDefinitionType = {
  name: 'fetch_weather',
  description: `Fetches the weather information for the specified location.`,
  parameters: {
    type: 'object',
    properties: {
      city: {
        type: 'string',
        description:
          "The city to fetch weather information for. Use the user's original input, including language.",
      },
    },
  },
};

export const handler: Function = async ({ city }: { [key: string]: any }) => {
  return {
    weather: 'Sunny, 25°C',
    temperature: '25°C',
    humidity: '50%',
    wind: '10 km/h',
    precipitation: '0 mm',
    cloud_cover: '50%',
    uv_index: '5',
  };
};
