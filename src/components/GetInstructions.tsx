import { SCENE_AIR_CONDITIONING, SCENE_KITCHEN } from '../lib/const';
import { Profiles } from '../lib/Profiles';

import { airState } from '../tools/AirConditioningState';
import { rangeHoodState, rangeHoodState2 } from '../tools/RangeHoodState';
import { dishwasherState } from '../tools/DishwasherState';
import { waterHeater } from '../tools/waterHeater';
import {
  SteamingOvenMenu,
  steamingOvenState,
} from '../tools/SteamingOvenState';

export const getInstructions = (instructions: string) => {
  const profiles = new Profiles();
  const profile = profiles.currentProfile;

  const currentTime = new Date().toLocaleString();

  instructions = instructions + `\n特别注意：`;
  instructions =
    instructions +
    `\n- 默认语言是 ${profile.detectLanguage}，你要始终输出和用户相同的语言，用户更换语言，你也要更换到相同的语言。`;
  instructions = instructions + `\n- 当前时间：${currentTime} `;
  instructions = instructions + `\n`;

  if (profile.scene === SCENE_AIR_CONDITIONING) {
    return getAirInstructions(instructions);
  }

  if (profile.scene === SCENE_KITCHEN) {
    return getKitchenInstructions(instructions);
  }

  return instructions;
};

const getAirInstructions = (instructions: string) => {
  const base_instructions =
    '你是空调智能助手，你可以帮助用户控制空调。回复请务必简短。';

  if (!airState.on) {
    instructions =
      instructions +
      `\n- ${base_instructions}
       \n- 空调【${airState.name}】是关闭状态，不能进行任何操作。
       \n- 如果用户的操作包含打开空调，那么不用提示，你先打空调，再按照顺序执行其他操作。
       \n- 如果用户的操作不包含打开空调，则只能进行定时开机操作，其他操作需要提示空调是关闭状态，只能打开空调，不能进行其他任何操作，并且询问用户是否打开空调。
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

  if (airState.mode === '送风模式') {
    instructions = instructions + `\n- 送风模式下不能调节温度。`;
  }

  return instructions;
};

const getKitchenInstructions = (instructions: string) => {
  const base_instructions = `你是厨房智能助手，你可以帮助用户控制以下设备。回复请务必简短。如果用户得操作设备有多个，请一定不要默认选择设备和型号，你必须反问用户选择哪一个。`;

  instructions =
    instructions +
    `\n- ${base_instructions}
       \n- 如果是关闭状态，不能进行任何操作。
       \n- 如果用户的操作包含打开设备，那么不用提示，你先打设备，再按照顺序执行其他操作。
       \n- 只有蒸烤箱可以做食物，其他设备不能做食物。
  `;

  instructions =
    instructions +
    `\n${base_instructions}
    \n
    \n## 洗碗机状态
    \n名称：${dishwasherState.name}
    \n开关机状态：${dishwasherState.on ? '开' : '关'}
    \n完成时间：${dishwasherState.finish_at ? new Date(dishwasherState.finish_at).toLocaleString() : '未设置'}
    \n漂洗剂等级：${dishwasherState.detergent_level}
    \n漂洗剂类型：${dishwasherState.detergent_type}
    \n门开关状态：${dishwasherState.door_open ? '开' : '关'}
    \n运行模式：${dishwasherState.run_mode}
    \n运行状态：${dishwasherState.run_state}
    \n
    \n## '${rangeHoodState2.name}'状态
    \n名称：'${rangeHoodState2.name}'
    \n开关机状态：${rangeHoodState2.on ? '开' : '关'}
    \n定时开机(分钟)：${rangeHoodState2.scheduled_power_on_minutes ?? '未设置'}
    \n定时关机(分钟)：${rangeHoodState2.scheduled_power_off_minutes ?? '未设置'}
    \n灯光/照明灯：${rangeHoodState2.light ? '开' : '关'}
    \n风量/风速/档位：${rangeHoodState2.level}
    \n左侧快速吸力：${rangeHoodState2.rapid_suction_left}
    \n右侧快速吸力：${rangeHoodState2.rapid_suction_right}
    \n两侧快速吸力：${rangeHoodState2.rapid_suction_both}
    \nCO值：${rangeHoodState2.co_status}
    \nCH4值：${rangeHoodState2.ch4_value}
    \nCH4值状态：${rangeHoodState2.ch4_value > 1000 ? '超标' : '正常'}
    \n锁屏：${rangeHoodState2.lockScreen ? '开' : '关'}
    \n定时任务：${rangeHoodState2.cron.map((c) => `${c.cron} ${c.cron_action} ${c.cron_value}`).join('\n')}
    \n
    \n## 蒸烤箱状态
    \n名称：${steamingOvenState.name}
    \n开关机状态：${steamingOvenState.on ? '开' : '关'}
    \n加湿功能：${steamingOvenState.humidifier_on ? '开' : '关'}
    \n水箱开关状态：${steamingOvenState.water_tank_on ? '开' : '关'}
    \n水箱水位：${steamingOvenState.water_tank_level}
    \n温度：${steamingOvenState.temperature}
    \n菜单：${Object.values(SteamingOvenMenu).join(', ')}
    \n模式：${steamingOvenState.run_mode}
    \n预约开始时间：${steamingOvenState.reservation_start_at}
    \n预约结束时间：${steamingOvenState.reservation_end_at}
    \n
    \n## 热水器状态
    \n名称：${waterHeater.name}
    \n开关机状态：${waterHeater.on ? '开' : '关'}
    \n温度：${waterHeater.temperature}
    \n定时关机(温度)：${waterHeater.power_off_when_temperature_is_arrive ?? '未设置'}
    \n定时任务：${waterHeater.cron.map((c) => `${c.cron} ${c.cron_action} ${c.cron_value}`).join('\n')}
    \n
    \n## '${rangeHoodState.name}'状态
    \n名称：'${rangeHoodState.name}'
    \n开关机状态：${rangeHoodState.on ? '开' : '关'}
    \n定时开机(分钟)：${rangeHoodState.scheduled_power_on_minutes ?? '未设置'}
    \n定时关机(分钟)：${rangeHoodState.scheduled_power_off_minutes ?? '未设置'}
    \n灯光/照明灯：${rangeHoodState.light ? '开' : '关'}
    \n风量/风速/档位：${rangeHoodState.level}
    \n左侧快速吸力：${rangeHoodState.rapid_suction_left}
    \n右侧快速吸力：${rangeHoodState.rapid_suction_right}
    \n两侧快速吸力：${rangeHoodState.rapid_suction_both}
    \nCO值：${rangeHoodState.co_status}
    \nCH4值：${rangeHoodState.ch4_value}
    \nCH4值状态：${rangeHoodState.ch4_value > 1000 ? '超标' : '正常'}
    \n锁屏：${rangeHoodState.lockScreen ? '开' : '关'}
    \n定时任务：${rangeHoodState.cron.map((c) => `${c.cron} ${c.cron_action} ${c.cron_value}`).join('\n')}
    \nQ5awi：${rangeHoodState.q5awi_on ? '开' : '关'}
    `;

  instructions =
    instructions +
    `\n\n注意：
\n- 用户必须明确指定设备型号，否则请按照设备列表反问型号。永远不要默认操作第一个设备。
\n- 我再强调一遍，用户必须明确指定设备型号，否则请按照设备列表反问型号。`;

  return instructions;
};
