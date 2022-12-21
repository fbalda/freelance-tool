import { forwardRef } from "react";
import { FieldValues } from "react-hook-form";
import { InputProps } from "./input";

export type CheckboxProps<TFieldValues extends FieldValues> =
  InputProps<TFieldValues> & {
    defaultValue?: boolean;
  };

const InputWrapper = forwardRef<
  HTMLInputElement,
  {
    error?: string;
    placeholder: string;
    defaultValue?: string;
  }
>((props, ref) => {
  return (
    <input
      ref={ref}
      aria-invalid={props.error ? true : false}
      className={`form-control ${(props.error as string) && "error"} w-full`}
      type="checkbox"
      {...props}
    />
  );
});
InputWrapper.displayName = "Input";

const Checkbox = <TFieldValues extends FieldValues>(
  props: CheckboxProps<TFieldValues> & { error?: boolean }
) => {
  return (
    <input
      aria-invalid={props.error ? true : false}
      className={`form-control ${props.error ? "error" : ""} w-full`}
      type="checkbox"
      defaultValue={props.defaultValue ? "1" : "2"}
      {...props.register(props.field, props.rules)}
    />
  );
};

export default Checkbox;
