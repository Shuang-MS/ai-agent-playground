import { SCENE_AIR_CONDITIONING } from '../lib/const';
import { Profiles } from '../lib/Profiles';

import { llmState } from './AirState';

export const getInstructions = (instructions: string) => {
  const profiles = new Profiles();
  const profile = profiles.currentProfile;

  const currentTime = new Date().toLocaleString();
  instructions = instructions + `\n当前时间：${currentTime} `;

  if (profile.scene === SCENE_AIR_CONDITIONING) {
    return getAirInstructions(instructions);
  }

  return instructions;
};

const getAirInstructions = (instructions: string) => {
  if (!llmState.on) {
    instructions =
      instructions +
      `\n ${llmState.instructions}
       \n 空调是关闭状态，不能进行任何操作。
       \n 如果用户的操作包含打开空调，那么不用提示，你先打空调，再按照顺序执行其他操作。
       \n 如果用户的操作不包含打开空调，则只能进行定时开机操作，其他操作需要提示空调是关闭状态，只能打开空调，不能进行其他任何操作，并且询问用户是否打开空调。
  `;

    return instructions;
  }

  instructions =
    instructions +
    `\n ${llmState.instructions}
    \n空调状态状态如下：
    \n状态：${llmState.on ? '开' : '关'}
    \n温度：${llmState.temperature}
    \n模式：${llmState.mode}
    \n除菌：${llmState.disinfection ? '开' : '关'}
    \nAI控制：${llmState.ai_control ? '开' : '关'}
    \n新风级别：${llmState.fresh_air_level ? llmState.fresh_air_level : '关闭'}
    \n净化级别：${llmState.purification_level ? llmState.purification_level : '关闭'}
    \n风速：${llmState.gear_level ? llmState.gear_level : '关闭'}
    \n音量：${llmState.volume_percentage ? llmState.volume_percentage : '静音'}
    \n湿度控制/控湿：${llmState.moisture_control ? '开' : '关'}
    \n速热模式：${llmState.heat_flash ? '开' : '关'}
    \n速冷模式：${llmState.cool_flash ? '开' : '关'}
    \n防直吹：${llmState.anti_direct_airflow ? '开' : '关'}
    \n智能清洁/智清洁：${llmState.smart_cleaning ? '开' : '关'}
    \n无风感：${llmState.wind_free ? '开' : '关'}
    \n电辅热：${llmState.electric_auxiliary_heating ? '开' : '关'}
    \n定时开机(小时)：${llmState.scheduled_power_on_hours}
    \n定时关机(小时)：${llmState.scheduled_power_off_hours}
    \n风向：${llmState.air_direction}
    \n屏幕显示：${llmState.screen_display ? '开' : '关'}
    \n风速百分比：${llmState.wind_speed_percentage}
    \n节能模式/ECOMaster功能/ECO功能：${llmState.energy_saving ? '开' : '关'}
    \n室内温度：${llmState.indoor_temperature}
    \n室外温度：${llmState.outdoor_temperature}
    \n连续对话/自然对话：${llmState.continuous_dialogue ? '开' : '关'}
  `;

  return instructions;
};
