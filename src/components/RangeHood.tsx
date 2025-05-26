export interface RangeHood {
  instructions: string;
  on: boolean;
}

export const rangeHoodState: RangeHood = {
  instructions:
    '你是油烟机智能助手，你可以帮助用户控制油烟机。回复请务必简短。',
  on: false,
};
