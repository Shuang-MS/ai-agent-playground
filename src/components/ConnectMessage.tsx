export default function ConnectMessage({
  connectMessage,
}: {
  connectMessage: string;
}) {
  return connectMessage ? (
    <div
      className={'waiting'}
      style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}
    >
      {connectMessage}
    </div>
  ) : null;
}
