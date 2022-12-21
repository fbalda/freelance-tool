import { WorkHours } from "@prisma/client";
import Router from "next/router";
import { MdEdit } from "react-icons/md";
import Spinner from "./spinner";

const WorkHoursList = (props: {
  workHours: WorkHours[];
  clientName: string;
  removeWorkHours: (id: number) => Promise<void>;
  status: "error" | "success" | "idle" | "loading";
}) => {
  return (
    <>
      <table className="text-left">
        <colgroup>
          <col className="" />
          <col className="w-25" />
          <col className="w-25" />
          <col className="w-25" />
          <col className="w-12" />
        </colgroup>

        <thead className="bg-neutral-1 border-b border-black">
          <tr className="">
            <th className="my-4 pl-4">Date</th>
            <th className="mx-4 border-l pl-4 border-black">Hours</th>
            <th className="mx-4 py-2 border-l pl-4 border-black">Rate</th>
            <th className="mx-4 py-2 border-l pl-4 border-black">Revenue</th>
            <th className="mx-4 py-2 border-l pl-4 border-black" />
          </tr>
        </thead>
        <tbody className="min-h-[12%] px-4">
          {props.status === "success" &&
            props.workHours.map((workHours, index) => {
              return (
                <tr
                  className="border-neutral-2 border-b last:border-0 \
                    last:mb-0 last:pb-0"
                  key={index}
                >
                  <td className="pl-4 py-2">{`${new Date(
                    workHours.date
                  ).toDateString()}`}</td>
                  <td className="pl-4 py-2">{`${workHours.hours}h`}</td>
                  <td className="pl-4 py-2">{`${workHours.rate}€`}</td>
                  <td className="pl-4 py-2">{`${
                    workHours.rate * workHours.hours
                  }€`}</td>
                  <td className="text-center">
                    <button
                      className="link"
                      onClick={async () => {
                        await Router.push(`/work-hours/${workHours.id}/edit`);
                      }}
                    >
                      <MdEdit size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {props.status === "success" && props.workHours.length === 0 && (
        <div className="text-center py-1">Empty</div>
      )}

      {props.status === "loading" && (
        <div className="flex flex-row justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default WorkHoursList;
