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
  const base_instructions =
    '你是空调智能助手，你可以帮助用户控制空调。回复请务必简短。';

  if (!airState.on) {
    instructions =
      instructions +
      `\n ${base_instructions}
       \n 空调是关闭状态，不能进行任何操作。
       \n 如果用户的操作包含打开空调，那么不用提示，你先打空调，再按照顺序执行其他操作。
       \n 如果用户的操作不包含打开空调，则只能进行定时开机操作，其他操作需要提示空调是关闭状态，只能打开空调，不能进行其他任何操作，并且询问用户是否打开空调。
  `;

    return instructions;
  }

  instructions =
    instructions +
    `\n${base_instructions}
    \n空调状态状态如下：
    \n名称：${airState.name}
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
  const base_instructions =
    '你是油烟机智能助手，你可以帮助用户控制油烟机。回复请务必简短。';

  if (!rangeHoodState.on) {
    instructions =
      instructions +
      `\n${base_instructions}
       \n油烟机是关闭状态，不能进行任何操作。
       \n如果用户的操作包含打开油烟机，那么不用提示，你先打油烟机，再按照顺序执行其他操作。
  `;

    return instructions;
  }

  instructions =
    instructions +
    `\n${base_instructions}
    \n油烟机状态状态如下：
    \n名称：${rangeHoodState.name}
    \n开关机状态：${rangeHoodState.on ? '开' : '关'}
    \n定时开机(分钟)：${rangeHoodState.scheduled_power_on_minutes}
    \n定时关机(分钟)：${rangeHoodState.scheduled_power_off_minutes}
    \n灯光/照明灯：${rangeHoodState.light ? '开' : '关'}
    \n风量/风速/档位：${rangeHoodState.level}
    \n左侧快速吸力：${rangeHoodState.rapid_suction_left}
    \n右侧快速吸力：${rangeHoodState.rapid_suction_right}
    \nCO值：${rangeHoodState.co_status}
    \nCH4值：${rangeHoodState.ch4_value}
    \nCH4值状态：${rangeHoodState.ch4_value > 1000 ? '超标' : '正常'}
    \n锁屏：${rangeHoodState.lockScreen ? '开' : '关'}
    \n定时任务：${rangeHoodState.cron.map((c) => `${c.cron} ${c.cron_action} ${c.cron_value}`).join('\n')}
  `;

  return instructions;
};
