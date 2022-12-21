import { Client } from "@prisma/client";
import Router from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonBar, Divider, TextInputGroup } from "./formElements";

export type ClientData = Omit<Client, "id"> & { id?: string };

const ClientForm = (props: {
  onSubmit: (clientData: ClientData) => Promise<void>;
  onDelete?: () => Promise<void>;
  type: "add" | "edit";
  defaultValues?: Partial<Client>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientData>();

  const [disabled, setDisabled] = useState(false);

  const onSubmit = (data: ClientData) => {
    setDisabled(true);

    if (props.type === "edit") {
      data.id = props.defaultValues?.id;
    }

    props.onSubmit(data).finally(() => setDisabled(false));
  };

  const onCancel = () => {
    Router.back();
  };

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
          label="Name"
          field="name"
          type="text"
          defaultValue={props.defaultValues?.name}
          placeholder="Example Company"
          rules={{ minLength: 5, maxLength: 60, required: true }}
          register={register}
          errors={errors}
        />
        <TextInputGroup
          label="Client Number"
          field="clientNumber"
          type="number"
          defaultValue={props.defaultValues?.clientNumber?.toString()}
          placeholder="10000"
          rules={{ required: false }}
          register={register}
          errors={errors}
          className="max-w-[8rem] "
        />
        <Divider />
        <TextInputGroup
          label="Full Name"
          field="fullName"
          type="text"
          defaultValue={props.defaultValues?.fullName}
          placeholder="Example Company GmbH"
          rules={{ minLength: 5, maxLength: 60, required: true }}
          register={register}
          errors={errors}
        />
        <TextInputGroup
          label="Care Of"
          field="careOf"
          type="text"
          defaultValue={props.defaultValues?.careOf || undefined}
          placeholder="Mr. Example"
          rules={{ maxLength: 30 }}
          register={register}
          errors={errors}
          className="grow"
        />
        <div className="flex flex-row gap-2">
          <TextInputGroup
            label="Street"
            field="street"
            type="text"
            defaultValue={props.defaultValues?.street}
            placeholder="Example Street"
            rules={{ minLength: 3, maxLength: 40, required: true }}
            register={register}
            errors={errors}
            className="grow shrink-0"
          />
          <TextInputGroup
            label="House Number"
            field="houseNumber"
            type="text"
            defaultValue={props.defaultValues?.houseNumber}
            placeholder="1a"
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
            placeholder="12345"
            rules={{ min: "1000", max: "99999", required: true }}
            register={register}
            errors={errors}
            className="shrink max-w-[6rem]"
          />
          <TextInputGroup
            label="City"
            field="city"
            type="text"
            defaultValue={props.defaultValues?.city}
            placeholder="Exampletown"
            rules={{ minLength: 2, maxLength: 40, required: true }}
            register={register}
            errors={errors}
            className="max-w-[13.5rem] grow"
          />
        </div>
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

export default ClientForm;
