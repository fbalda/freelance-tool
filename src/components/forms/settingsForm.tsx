import { UserData } from "@prisma/client";
import Router from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonBar, Divider, TextInputGroup } from "./formElements";

export type SettingsData = Omit<UserData, "id" | "salt" | "pwhash"> & {
  id?: string;
  password: string;
  currentPassword?: string;
};

type SettingsFormData = SettingsData & { repeatPassword: string };

const SettingsForm = (props: {
  onSubmit: (settingsData: SettingsData) => Promise<void>;
  onDelete?: () => Promise<void>;
  type: "add" | "edit";
  defaultValues?: Partial<SettingsData>;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SettingsFormData>();

  const [disabled, setDisabled] = useState(false);

  const onSubmit = (data: SettingsFormData) => {
    setDisabled(true);

    if (props.type === "edit") {
      data.id = props.defaultValues?.id;
    }

    const { repeatPassword, ...submitData } = data;

    props.onSubmit(submitData).finally(() => setDisabled(false));
  };

  const onCancel = undefined;

  const onDelete = props.onDelete
    ? async () => {
        await props.onDelete?.();
        Router.back();
      }
    : undefined;

  return (
    <form
      className="flex flex-col items-stretch justify-end px-4 py-2 
    w-[48rem]"
    >
      <fieldset disabled={disabled}>
        <TextInputGroup
          label="Username"
          field="username"
          type="text"
          defaultValue={props.defaultValues?.username}
          rules={{
            minLength: 5,
            maxLength: 60,
            required: true,
          }}
          register={register}
          errors={errors}
        />
        {props.type === "edit" ? (
          <TextInputGroup
            label="Current Password"
            field="currentPassword"
            type="password"
            rules={{
              minLength: 5,
              maxLength: 99,
            }}
            register={register}
            errors={errors}
            className="max-w-[8rem] "
          />
        ) : (
          <></>
        )}
        <TextInputGroup
          label={props.type === "edit" ? "New Password" : "Password"}
          field="password"
          type="password"
          rules={{
            minLength: 5,
            maxLength: 99,
            required: props.type === "add",
          }}
          register={register}
          errors={errors}
          className="max-w-[8rem] "
        />
        <TextInputGroup
          label={
            props.type === "edit" ? "Repeat new Password" : "Repeat Password"
          }
          field="repeatPassword"
          type="password"
          rules={{
            required: props.type === "add",
            validate: (
              val: string | number | boolean | Date | null | undefined
            ) => {
              if (watch("password") != val) {
                return "Your passwords do no match";
              }
            },
          }}
          register={register}
          errors={errors}
          className="max-w-[8rem]"
        />
        <Divider />
        <TextInputGroup
          label="Business Name"
          field="businessName"
          type="text"
          defaultValue={props.defaultValues?.businessName}
          rules={{
            minLength: 5,
            maxLength: 60,
            required: true,
          }}
          register={register}
          errors={errors}
        />
        <div className="flex flex-row gap-2">
          <TextInputGroup
            label="Street"
            field="street"
            type="text"
            defaultValue={props.defaultValues?.street}
            rules={{
              minLength: 3,
              maxLength: 40,
              required: true,
            }}
            register={register}
            errors={errors}
            className="grow shrink-0"
          />
          <TextInputGroup
            label="House Number"
            field="houseNumber"
            type="text"
            defaultValue={props.defaultValues?.houseNumber}
            rules={{ maxLength: 10, required: true }}
            register={register}
            errors={errors}
            className="shrink min-w-[1rem] max-w-[8rem]"
          />
        </div>
        <div className="flex flex-row gap-2">
          <TextInputGroup
            label="Zip Code"
            field="zip"
            type="number"
            defaultValue={props.defaultValues?.zip?.toString()}
            rules={{
              min: "1000",
              max: "99999",
              required: true,
            }}
            register={register}
            errors={errors}
            className="shrink max-w-[6rem]"
          />
          <TextInputGroup
            label="City"
            field="city"
            type="text"
            defaultValue={props.defaultValues?.city}
            rules={{
              minLength: 2,
              maxLength: 40,
              required: true,
            }}
            register={register}
            errors={errors}
            className="max-w-[13.5rem] grow"
          />
        </div>
        <Divider />
        <TextInputGroup
          label="Phone Number"
          field="phone"
          type="tel"
          defaultValue={props.defaultValues?.phone}
          placeholder=""
          rules={{
            min: "1000",
            max: "999999999",
            required: true,
          }}
          register={register}
          errors={errors}
          className="shrink max-w-[6rem]"
        />
        <TextInputGroup
          label="Email Address"
          field="email"
          type="email"
          defaultValue={props.defaultValues?.email}
          placeholder=""
          rules={{ required: true }}
          register={register}
          errors={errors}
          className="shrink max-w-[6rem]"
        />
        <Divider />
        <TextInputGroup
          label="IBAN"
          field="iban"
          type="text"
          defaultValue={props.defaultValues?.iban}
          placeholder=""
          rules={{
            minLength: 6,
            maxLength: 34,
            required: true,
          }}
          register={register}
          errors={errors}
          className="shrink max-w-[6rem]"
        />
        <TextInputGroup
          label="BIC"
          field="bic"
          type="text"
          defaultValue={props.defaultValues?.bic}
          placeholder=""
          rules={{
            minLength: 8,
            maxLength: 11,
            required: true,
          }}
          register={register}
          errors={errors}
          className="shrink max-w-[6rem]"
        />
        <TextInputGroup
          label="Tax Number"
          field="taxNumber"
          type="text"
          defaultValue={props.defaultValues?.taxNumber}
          placeholder=""
          rules={{
            minLength: 12,
            maxLength: 12,
            required: true,
          }}
          register={register}
          errors={errors}
          className="shrink max-w-[6rem]"
        />

        <Divider />
        <ButtonBar
          submitLabel={props.type === "add" ? "Create" : "Save Changes"}
          onSubmit={handleSubmit(onSubmit)}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      </fieldset>
    </form>
  );
};

export default SettingsForm;
