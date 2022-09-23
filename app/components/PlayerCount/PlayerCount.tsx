export default function PlayerCount({
  current,
  max,
}: {
  current?: number;
  max?: number;
}) {
  const num = current ?? 0;
  const den = max;

  return <div>{`${num} ${den ? ` / ${den}` : null} `}</div>;
}
