import axios from "axios";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { YearMonths } from "../../pages/api/client/active-months";
import { ButtonBar, Divider, SelectInputGroup } from "./formElements";

const CreateInvoiceForm = (props: {
  onSubmit: (month: string) => Promise<void>;
  clientId: string;
}) => {
  const { data: activeMonths } = useQuery<YearMonths[]>(
    ["activeMonths"],
    async () => {
      return (
        await axios.post(`/api/client/active-months`, {
          clientId: props.clientId,
        })
      ).data as YearMonths[];
    },
    {
      refetchOnMount: true,
    }
  );

  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    const tempOptions: string[] = [];

    activeMonths?.forEach((yearMonths) => {
      yearMonths.months.forEach((month) => {
        tempOptions.push(`${month}/${yearMonths.year}`);
      });
    });

    setOptions(tempOptions);
  }, [activeMonths]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ month: string }>();

  const onSubmit = async (data: { month: string }) => {
    await props.onSubmit(data.month);
    reset();
  };

  const onCancel = () => {
    Router.back();
  };

  return (
    <form className="flex flex-col items-start px-4 py-2">
      <div className="flex flex-row items-end gap-2">
        <SelectInputGroup
          label="Month"
          field="month"
          rules={{ required: true }}
          register={register}
          errors={errors}
          options={
            options.map((option) => {
              return {
                value: option,
                name: option,
              };
            }) || []
          }
          placeholder="Select Year"
        />
      </div>
      <>
        <Divider />
        <ButtonBar
          submitLabel="Create Invoice"
          onSubmit={handleSubmit(onSubmit)}
          onCancel={onCancel}
        />
      </>
    </form>
  );
};

export default CreateInvoiceForm;
