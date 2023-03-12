import { Events, trigger } from "utils/events";
import * as React from "react";

interface Props {
  event: Events;
  step?: number;
  label?: string;
}

export default function STInput({
  event,
  step = 0.01,
  label,
}: Props): JSX.Element {
  const [value, setValue] = React.useState<number>(1);

  React.useEffect(() => {
    trigger(event, { value });
  }, [value]);

  return (
    <div>
      <label>{label}: </label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => {
          setValue(Number(e.target.value));
        }}
      />
    </div>
  );
}
