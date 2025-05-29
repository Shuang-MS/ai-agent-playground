export enum RunMode {
  'bottom_open' = '下层洗打开',
  'bottom_close' = '下层洗关闭',
  'top_open' = '上层洗打开',
  'top_close' = '上层洗关闭',
}

export enum RunState {
  'stop' = '停止',
  'start' = '启动',
  'pause' = '暂停',
  'continue' = '继续',
}

export interface DishwasherState {
  name: string;
  // 开关
  on: boolean;
  // finish_at
  finish_at: number;
  // 漂洗剂等级
  detergent_level: number;
  detergent_type: string;
  // 门的开关状态
  door_open: boolean;
  // 运行模式设置-洗碗机下层洗打开
  run_mode: RunMode;
  // 运行设置（【启动/暂停/继续】洗碗机清洗）
  run_state: RunState;
}

export const dishwasherState: DishwasherState = {
  name: '厨房洗碗机',
  on: false,
  finish_at: 0,
  detergent_level: 0,
  detergent_type: 'soft',
  door_open: false,
  run_mode: RunMode.bottom_open,
  run_state: RunState.stop,
};
