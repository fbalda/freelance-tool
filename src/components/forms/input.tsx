import { ReactElement } from "react";
import {
  FieldErrors,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

export interface InputProps<TFieldValues extends FieldValues> {
  label: string;
  field: FieldPath<TFieldValues>;
  rules: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
  errors: FieldErrors<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  children?: ReactElement[] | ReactElement;
  className?: string;
}
