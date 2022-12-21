import { FieldValues } from "react-hook-form";
import { InputProps } from "./input";

export type DateTimeInputProps<TFieldValues extends FieldValues> =
  InputProps<TFieldValues> & {
    type: "date" | "datetime-local" | "month" | "time" | "week";
    defaultValue?: Date;
  };

const DateTimeInput = <TFieldValues extends FieldValues>(
  props: DateTimeInputProps<TFieldValues> & { error?: boolean }
) => {
  return (
    <input
      aria-invalid={props.error ? true : false}
      className={`form-control ${props.error ? "error" : ""}`}
      type={props.type}
      defaultValue={props.defaultValue?.toISOString().substring(0, 10)}
      {...props.register(props.field, props.rules)}
    />
  );
};

export default DateTimeInput;
