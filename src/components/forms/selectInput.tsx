import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { InputProps } from "./input";

export type SelectInputProps<TFieldValues extends FieldValues> =
  InputProps<TFieldValues> & {
    options: { value: number | string | undefined; name: string }[];
    defaultValue?: number | string;
    placeholder?: string;
  };

const SelectInput = <TFieldValues extends FieldValues>(
  props: SelectInputProps<TFieldValues> & { error?: boolean }
) => {
  // We use a workaround to display the default value as gray, since we use
  // react-hook-form and therefore can't style with the :invalid selector.
  // Also we don't want it to have the red border that invalid inputs get
  // after submitting. There probably is a better way to do this
  const [wasChanged, setWasChanged] = useState(false);

  const { onChange, ...rules } = props.rules;

  return (
    <select
      defaultValue={props.defaultValue || ""}
      aria-invalid={props.error ? true : false}
      className={`form-control ${props.error ? "error" : ""} ${
        props.defaultValue || wasChanged ? "" : "text-gray-600"
      } ${props.className ? props.className : ""}`}
      {...props.register(props.field, rules)}
      onChange={(event) => {
        setWasChanged(true);
        onChange?.(event);
      }}
    >
      <option value={""} disabled hidden>
        {props.placeholder}
      </option>
      {props.options.map((option, index) => {
        return (
          <option key={index} value={option.value}>
            {option.name}
          </option>
        );
      })}
    </select>
  );
};

export default SelectInput;
