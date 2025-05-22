export interface LlmState {
  count: number;
  on: boolean;
  temperature: number;
}
export const llmState: LlmState = {
  count: 0,
  on: false,
  temperature: 25,
};
