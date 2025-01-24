import { ComponentType, MouseEvent } from "react";
import { FieldValues } from "react-hook-form";

import { useFormErrorMessage } from "@lib/hooks";

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
    <div className="flex w-full flex-row justify-start gap-2">
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
  return <hr className="mb-4 self-stretch border-neutral-2" />;
};

const InputGroup = <
  TFieldValues extends FieldValues,
  TInputProps extends InputProps<TFieldValues>,
>(
  props: TInputProps & {
    childType: ComponentType<TInputProps>;
  },
) => {
  const errorMessage = useFormErrorMessage(
    props.label,
    props.field,
    props.rules,
    props.errors,
  );

  return (
    <div
      className={`flex h-20 max-w-xs flex-col ${
        props.className ? props.className : "" }`}
    >
      <label htmlFor={props.field}>
        {props.label + (props.rules.required ? " *" : "")}
      </label>
      <props.childType {...props} />
      <div className="mb-2 text-sm text-red-600">{errorMessage}</div>
    </div>
  );
};

export const TextInputGroup = <TFieldValues extends FieldValues>(
  props: TextInputProps<TFieldValues>,
) => {
  return InputGroup<TFieldValues, typeof props>({
    ...props,
    childType: TextInput,
  });
};

export const SelectInputGroup = <TFieldValues extends FieldValues>(
  props: SelectInputProps<TFieldValues>,
) => {
  return InputGroup<TFieldValues, typeof props>({
    ...props,
    childType: SelectInput,
  });
};

export const DateTimeInputGroup = <TFieldValues extends FieldValues>(
  props: DateTimeInputProps<TFieldValues>,
) => {
  return InputGroup<TFieldValues, typeof props>({
    ...props,
    childType: DateTimeInput,
  });
};

export const CheckboxGroup = <TFieldValues extends FieldValues>(
  props: CheckboxProps<TFieldValues>,
) => {
  return InputGroup<TFieldValues, typeof props>({
    ...props,
    childType: Checkbox,
  });
};
