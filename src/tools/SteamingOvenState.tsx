export interface SteamingOvenState {
  name: string;
  // 开关
  on: boolean;
  // 加湿功能（加蒸汽）开关状态
  humidifier_on: boolean;
  // 水箱开关状态
  water_tank_on: boolean;
  // 温度
  temperature: number;
  // 水箱水位
  water_tank_level: '低' | '中' | '高';
  // 预约时间
  reservation_start_at: number;
  reservation_end_at: number;

  run_mode:
    | '烤'
    | '蒸'
    | '风焙烤'
    | '热风烤'
    | '烧烤'
    | '纯蒸'
    | '强力蒸'
    | '再加热'
    | '发酵'
    | '解冻'
    | '除垢'
    | '冲洗'
    | '快速蒸'
    | '加湿烤'
    | '空气炸'
    | '保温'
    | '烘干'
    | '营养炖'
    | '烤果干';
  run_state: '启动' | '结束当前工作' | '暂停' | '继续';
  menu_list:
    | ''
    | '奥尔良风味烤翅'
    | '孜然烤羊排'
    | '韩式烤五花'
    | '莲藕排骨汤'
    | '粉蒸肉'
    | '粤式腊味三拼'
    | '豉汁蒸排骨'
    | '嫩烤西冷牛排'
    | '孜然羊肉串'
    | '清蒸大闸蟹'
    | '清蒸鲈鱼'
    | '蒜蓉粉丝虾'
    | '蒜蓉粉丝扇贝'
    | '秘制川味烤鱼'
    | '五谷丰登'
    | '蒜蓉烤茄子'
    | '清蒸南瓜'
    | '脆皮五香花生米'
    | '厚切风焙红薯片'
    | '黄油曲奇'
    | '葡式蛋挞'
    | '戚风蛋糕'
    | '宫廷桃酥'
    | '营养蒸米饭'
    | '鲜虾培根披萨';
}

export const steamingOvenState: SteamingOvenState = {
  name: '厨房蒸烤箱1',
  on: false,
  humidifier_on: false,
  water_tank_on: false,
  water_tank_level: '低',
  temperature: 25,
  reservation_start_at: 0,
  reservation_end_at: 0,
  run_mode: '烤',
  run_state: '启动',
  menu_list: '',
};
