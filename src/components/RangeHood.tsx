export interface RangeHood {
  name: string;
  on: boolean;
  level: number;
  lockScreen: boolean;
  co_status: string;
  ch4_value: number;
  toString: () => string;
}

export const rangeHoodState: RangeHood = {
  name: '厨房油烟机',
  on: false,
  level: 2,
  lockScreen: false,
  co_status: '正常',
  ch4_value: 500,

  toString: () => {
    return JSON.stringify(
      {
        ...rangeHoodState,
        ch4_value_status: rangeHoodState.ch4_value > 1000 ? '超标' : '正常',
      },
      null,
      2,
    );
  },
};
