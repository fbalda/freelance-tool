import { Client, WorkHours } from "@prisma/client";
import Router from "next/router";
import { useForm } from "react-hook-form";
import {
  ButtonBar,
  DateTimeInputGroup,
  Divider,
  SelectInputGroup,
  TextInputGroup,
} from "./formElements";

export type WorkHoursData = Omit<WorkHours, "id"> & { id: string | undefined };

const WorkHoursForm = (props: {
  onSubmit: (data: WorkHoursData) => Promise<void>;
  onDelete?: () => Promise<void>;
  type: "add" | "edit";
  clients: Client[];
  defaultValues?: Partial<WorkHoursData>;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkHoursData>();

  const onSubmit = async (data: WorkHoursData) => {
    if (props.type === "edit") {
      data.id = props.defaultValues?.id;
    }

    await props.onSubmit(data);
    reset();
  };

  const onCancel = () => {
    Router.back();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start px-4 py-2"
    >
      <div className="flex flex-row items-end gap-2">
        <SelectInputGroup
          label="Client"
          field="clientId"
          rules={{ required: true }}
          register={register}
          errors={errors}
          defaultValue={props.defaultValues?.clientId}
          options={props.clients.map((client) => {
            return { value: client.id, name: client.name };
          })}
          placeholder="Choose a Client"
        />

        <TextInputGroup
          label="Hours"
          field="hours"
          type="number"
          defaultValue={props.defaultValues?.hours?.toString()}
          placeholder="10"
          rules={{ required: true }}
          register={register}
          errors={errors}
        />
        <TextInputGroup
          label="Rate"
          field="rate"
          type="number"
          defaultValue={props.defaultValues?.rate?.toString()}
          placeholder="90"
          rules={{ required: true }}
          register={register}
          errors={errors}
        />
        <DateTimeInputGroup
          label="Date"
          field="date"
          type="date"
          defaultValue={props.defaultValues?.date}
          rules={{ required: true }}
          register={register}
          errors={errors}
        />
        {props.type === "add" ? (
          <div className="flex flex-row justify-end gap-2 mb-8">
            <button type="submit" className="button ml-3">
              {props.type === "add" ? "Add" : "Save Changes"}
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>

      {props.type === "edit" ? (
        <>
          <Divider />
          <ButtonBar
            submitLabel="Save Changes"
            onCancel={onCancel}
            onDelete={props.onDelete}
          />
        </>
      ) : (
        <></>
      )}
    </form>
  );
};

export default WorkHoursForm;
