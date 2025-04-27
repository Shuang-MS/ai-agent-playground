export type GptImage = {
  id: string;
  prompt: string;
  b64_json: string;
  mask_b64_json: string;
};

export type GptImageAction = {
  type: 'add' | 'change' | 'delete';
  gptImage: GptImage;
};
