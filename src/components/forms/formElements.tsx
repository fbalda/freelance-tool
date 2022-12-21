import { useFormErrorMessage } from "@lib/hooks";
import { ComponentType, MouseEvent } from "react";
import { FieldValues } from "react-hook-form";
import Checkbox, { CheckboxProps } from "./checkbox";
import DateTimeInput, { DateTimeInputProps } from "./dateTimeInput";
import { InputProps } from "./input";
import SelectInput, { SelectInputProps } from "./selectInput";
import TextInput, { TextInputProps } from "./textInput";

export const ButtonBar = (props: {
  submitLabel: string;
  onSubmit?: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}) => {
  const onSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await props.onSubmit?.();
  };

  const onCancel = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await props.onCancel?.();
  };

  const onDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await props.onDelete?.();
  };

  return (
    <div className="flex flex-row justify-start gap-2 w-full">
      <button type="submit" className="button" onClick={onSubmit}>
        {props.submitLabel}
      </button>
      {props.onCancel ? (
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      ) : (
        <></>
      )}
      {props.onDelete ? (
        <button className="delete-button ml-auto" onClick={onDelete}>
          Delete
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export const Divider = () => {
  return <hr className="border-neutral-2 mb-4 self-stretch" />;
};

const InputGroup = <
  TFieldValues extends FieldValues,
  TInputProps extends InputProps<TFieldValues>
>(
  props: TInputProps & {
    childType: ComponentType<TInputProps>;
  }
) => {
  const errorMessage = useFormErrorMessage(
    props.label,
    props.field,
    props.rules,
    props.errors
  );

  return (
    <div
      className={`flex flex-col h-20 max-w-xs ${
        props.className ? props.className : ""
      }`}
    >
      <label htmlFor={props.field}>
        {props.label + (props.rules.required ? " *" : "")}
      </label>
      <props.childType {...props} />
      <div className="text-red-600 mb-2 text-sm">{errorMessage}</div>
    </div>
  );
};

export const TextInputGroup = <TFieldValues extends FieldValues>(
  props: TextInputProps<TFieldValues>
) => {
  return InputGroup<TFieldValues, typeof props>({
    ...props,
    childType: TextInput,
  });
};

export const SelectInputGroup = <TFieldValues extends FieldValues>(
  props: SelectInputProps<TFieldValues>
) => {
  return InputGroup<TFieldValues, typeof props>({
    ...props,
    childType: SelectInput,
  });
};

export const DateTimeInputGroup = <TFieldValues extends FieldValues>(
  props: DateTimeInputProps<TFieldValues>
) => {
  return InputGroup<TFieldValues, typeof props>({
    ...props,
    childType: DateTimeInput,
  });
};

export const CheckboxGroup = <TFieldValues extends FieldValues>(
  props: CheckboxProps<TFieldValues>
) => {
  return InputGroup<TFieldValues, typeof props>({
    ...props,
    childType: Checkbox,
  });
};
