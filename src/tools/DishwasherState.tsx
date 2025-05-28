export interface DishwasherState {
  name: string;
  // 开关
  on: boolean;
  // 漂洗剂等级
  detergent_level: number;
  // 发漂洗剂类型
  detergent_type: string;
  // 门的开关状态
  door_open: boolean;
  // 运行模式设置-洗碗机下层洗打开
  run_mode: 'bottom_open';
  // 运行设置（【启动/暂停/继续】洗碗机清洗）
  run_state: 'stop' | 'start' | 'pause' | 'continue';
}

export const dishwasherState: DishwasherState = {
  name: '厨房洗碗机',
  on: false,
  detergent_level: 0,
  detergent_type: 'soft',
  door_open: false,
  run_mode: 'bottom_open',
  run_state: 'stop',
};
