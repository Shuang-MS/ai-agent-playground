interface Cron {
  cron: string;
  cron_action: string;
  cron_value: string;
}

export interface RangeHoodState {
  name: string;
  on: boolean;
  level: number;
  lockScreen: boolean;
  co_status: string;
  ch4_value: number;
  rapid_suction_left: number;
  rapid_suction_right: number;
  rapid_suction_both: number;
  light: boolean;
  scheduled_power_on_minutes: number;
  scheduled_power_off_minutes: number;
  cron: Cron[];
  q5awi_on?: boolean;
}

export const rangeHoodState: RangeHoodState = {
  name: '主展厅烟机CXW-200-Q5AWi',
  on: false,
  level: 2,
  lockScreen: false,
  co_status: '正常',
  ch4_value: 500,
  rapid_suction_left: 0,
  rapid_suction_right: 0,
  rapid_suction_both: 0,
  light: false,
  scheduled_power_on_minutes: 0,
  scheduled_power_off_minutes: 0,
  cron: [],
  q5awi_on: false,
};

export const rangeHoodState2: RangeHoodState = {
  name: '主展厅烟机CXW-200-Q3AWi',
  on: false,
  level: 2,
  lockScreen: false,
  co_status: '正常',
  ch4_value: 500,
  rapid_suction_left: 0,
  rapid_suction_right: 0,
  rapid_suction_both: 0,
  light: false,
  scheduled_power_on_minutes: 0,
  scheduled_power_off_minutes: 0,
  cron: [],
  q5awi_on: false,
};
