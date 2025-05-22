export interface LlmState {
  count: number;
  on: boolean;
  temperature: number;
  mode: string;
}
export const llmState: LlmState = {
  count: 0,
  on: false,
  temperature: 25,
  mode: '制冷模式',
};
