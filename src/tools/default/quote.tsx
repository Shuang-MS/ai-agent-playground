import { ToolDefinitionType } from '@theodoreniu/realtime-api-beta/dist/lib/client';
import { Profiles } from '../../lib/Profiles';

const profiles = new Profiles();
const profile = profiles.currentProfile;

export const definition: ToolDefinitionType = {
  name: 'quote',
  description: 'Get real-time quote data for US stocks. data from Finnhub API.',
  parameters: {
    type: 'object',
    properties: {
      symbol: {
        type: 'string',
        description: 'symbol of the stock',
      },
    },
    required: ['symbol'],
    additionalProperties: false,
  },
};

export const handler: Function = async ({ symbol }: { [key: string]: any }) => {
  const quoteToken = profile?.quoteToken || '';
  if (!quoteToken) {
    throw new Error('Quote token is not set, please set it in the settings.');
  }

  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${quoteToken}`;

  console.log('fetch quote url', url);
  const result = await fetch(url, {
    method: 'GET',
  });

  return await result.json();
};
