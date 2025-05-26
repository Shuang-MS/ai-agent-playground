import { SCENE_AIR_CONDITIONING, SCENE_RANGE_HOOD } from '../lib/const';
import { Profiles } from '../lib/Profiles';

import { airState } from './AirState';
import { rangeHoodState } from './RangeHood';

export const getInstructions = (instructions: string) => {
  const profiles = new Profiles();
  const profile = profiles.currentProfile;

  const currentTime = new Date().toLocaleString();
  instructions = instructions + `\n当前时间：${currentTime} `;

  if (profile.scene === SCENE_AIR_CONDITIONING) {
    return getAirInstructions(instructions);
  }

  if (profile.scene === SCENE_RANGE_HOOD) {
    return getRangeHoodInstructions(instructions);
  }

  return instructions;
};

const getAirInstructions = (instructions: string) => {
  if (!airState.on) {
    instructions =
      instructions +
      `\n ${airState.instructions}
       \n 空调是关闭状态，不能进行任何操作。
       \n 如果用户的操作包含打开空调，那么不用提示，你先打空调，再按照顺序执行其他操作。
       \n 如果用户的操作不包含打开空调，则只能进行定时开机操作，其他操作需要提示空调是关闭状态，只能打开空调，不能进行其他任何操作，并且询问用户是否打开空调。
  `;

    return instructions;
  }

  instructions =
    instructions +
    `\n ${airState.instructions}
    \n空调状态状态如下：
    \n状态：${airState.on ? '开' : '关'}
    \n温度：${airState.temperature}
    \n模式：${airState.mode}
    \n除菌：${airState.disinfection ? '开' : '关'}
    \nAI控制：${airState.ai_control ? '开' : '关'}
    \n新风级别：${airState.fresh_air_level ? airState.fresh_air_level : '关闭'}
    \n净化级别：${airState.purification_level ? airState.purification_level : '关闭'}
    \n风速：${airState.gear_level ? airState.gear_level : '关闭'}
    \n音量：${airState.volume_percentage ? airState.volume_percentage : '静音'}
    \n湿度控制/控湿：${airState.moisture_control ? '开' : '关'}
    \n速热模式：${airState.heat_flash ? '开' : '关'}
    \n速冷模式：${airState.cool_flash ? '开' : '关'}
    \n防直吹：${airState.anti_direct_airflow ? '开' : '关'}
    \n智能清洁/智清洁：${airState.smart_cleaning ? '开' : '关'}
    \n无风感：${airState.wind_free ? '开' : '关'}
    \n电辅热：${airState.electric_auxiliary_heating ? '开' : '关'}
    \n定时开机(小时)：${airState.scheduled_power_on_hours}
    \n定时关机(小时)：${airState.scheduled_power_off_hours}
    \n风向：${airState.air_direction}
    \n屏幕显示：${airState.screen_display ? '开' : '关'}
    \n风速百分比：${airState.wind_speed_percentage}
    \n节能模式/ECOMaster功能/ECO功能：${airState.energy_saving ? '开' : '关'}
    \n室内温度：${airState.indoor_temperature}
    \n室外温度：${airState.outdoor_temperature}
    \n连续对话/自然对话：${airState.continuous_dialogue ? '开' : '关'}
  `;

  return instructions;
};

const getRangeHoodInstructions = (instructions: string) => {
  if (!rangeHoodState.on) {
    instructions =
      instructions +
      `\n ${rangeHoodState.instructions}
       \n 油烟机是关闭状态，不能进行任何操作。
       \n 如果用户的操作包含打开油烟机，那么不用提示，你先打油烟机，再按照顺序执行其他操作。
  `;

    return instructions;
  }

  instructions =
    instructions +
    `\n ${rangeHoodState.instructions}
    \n油烟机状态状态如下：
    \n状态：${rangeHoodState.on ? '开' : '关'}
  `;

  return instructions;
};
