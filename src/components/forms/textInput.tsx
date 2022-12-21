import { FieldValues } from "react-hook-form";
import { InputProps } from "./input";

type InputStringTypes =
  | "number"
  | "text"
  | "password"
  | "hidden"
  | "tel"
  | "email";

export interface TextInputProps<TFieldValues extends FieldValues>
  extends InputProps<TFieldValues> {
  placeholder?: string;
  type: InputStringTypes;
  defaultValue?: string;
}

const TextInput = <TFieldValues extends FieldValues>(
  props: TextInputProps<TFieldValues> & { error?: boolean }
) => {
  return (
    <input
      aria-invalid={props.error ? true : false}
      className={`form-control ${props.error ? "error" : ""} w-full`}
      type={props.type}
      defaultValue={props.defaultValue}
      {...props.register(props.field, props.rules)}
    />
  );
};

export default TextInput;
