import { useState } from "react";
import { FieldValues } from "react-hook-form";

import { InputProps } from "./input";

export type DateTimeInputProps<TFieldValues extends FieldValues> =
  InputProps<TFieldValues> & {
    type: "date" | "datetime-local" | "month" | "time" | "week";
    defaultValue?: Date;
  };

const DateTimeInput = <TFieldValues extends FieldValues>(
  props: DateTimeInputProps<TFieldValues> & { error?: boolean },
) => {
  const [wasChanged, setWasChanged] = useState(false);
  const { onChange } = props.rules;

  return (
    <input
      aria-invalid={props.error ? true : false}
      className={`form-control ${props.error ? "error" : ""}
        ${!wasChanged ? "text-neutral-3" : ""}`}
      type={props.type}
      defaultValue={props.defaultValue?.toISOString().substring(0, 10)}
      {...props.register(props.field, props.rules)}
      onChange={(event) => {
        setWasChanged(true);
        onChange?.(event);
      }}
    />
  );
};

export default DateTimeInput;
