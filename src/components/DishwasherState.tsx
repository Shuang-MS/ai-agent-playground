export interface DishwasherState {
  name: string;
  // 开关
  on: boolean;
  // 漂洗剂等级
  detergent_level: number;
  // 发漂洗剂类型
  detergent_type: string;
}

export const dishwasherState: DishwasherState = {
  name: '厨房洗碗机',
  on: false,
  detergent_level: 0,
  detergent_type: 'soft',
};
