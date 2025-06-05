export type RealtimeWebRtcEvent = {
  event_id: string;
  session: { [key: string]: any };
  type:
    | string
    | 'response.created'
    | 'response.audio_transcript.delta'
    | 'response.audio_transcript.done'
    | 'response.done'
    | 'response.output_item.done';
  data?: string;
  delta?: string;
  text?: string;
  content_index?: number;
  output_index?: number;
  response_id?: string;
  response_type?: string;
  transcript?: string;
  response?: { [key: string]: any };
  item?: { [key: string]: any };
  error?: { [key: string]: any };
};

export type RealtimeWebRtcFunctionCall = {
  arguments: string;
  call_id: string;
  id: string;
  name: string;
  object: string;
  status: number;
  type: number;
};
