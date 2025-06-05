export default function ConnectMessage({
  connectMessage,
  defaultMessage = '',
}: {
  connectMessage: string;
  defaultMessage?: string;
}) {
  return connectMessage ? (
    <div
      className={'waiting'}
      style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}
    >
      {connectMessage || defaultMessage}
    </div>
  ) : null;
}
