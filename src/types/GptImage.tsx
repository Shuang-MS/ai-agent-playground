export type GptImage = {
  id: string;
  prompt: string;
  b64: string;
  mask_b64: string;
  gpt_image?: boolean;
};

export type GptImageAction = {
  type: 'add' | 'change' | 'delete';
  gptImage: GptImage;
};
