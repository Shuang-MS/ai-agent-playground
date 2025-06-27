interface Cron {
  cron: string;
  cron_action: string;
  cron_value: string;
}

export interface WaterHeater {
  name: string;
  on: boolean;
  level: number;
  temperature: number;
  power_off_when_temperature_is_arrive: number;
  cron: Cron[];
}

export const waterHeater: WaterHeater = {
  name: '厨房热水器',
  on: false,
  level: 2,
  temperature: 0,
  power_off_when_temperature_is_arrive: 0,
  cron: [],
};
