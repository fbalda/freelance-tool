import Router from "next/router";
import { MdEdit } from "react-icons/md";

import { WorkHours } from "@prisma/client";

import { PanelIconButton } from "./panels/panel";
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

        <thead className="border-b border-black bg-neutral-1">
          <tr className="">
            <th className="my-4 pl-4">Date</th>
            <th className="mx-4 border-l border-black pl-4">Hours</th>
            <th className="mx-4 border-l border-black py-2 pl-4">Rate</th>
            <th className="mx-4 border-l border-black py-2 pl-4">Revenue</th>
            <th className="mx-4 border-l border-black py-2 pl-4" />
          </tr>
        </thead>
        <tbody className="min-h-[12%] px-4">
          {props.status === "success" &&
            props.workHours.map((workHours, index) => {
              return (
                <tr
                  className="border-b border-neutral-2 last:mb-0 last:border-0
                    last:pb-0"
                  key={index}
                >
                  <td className="py-2 pl-4">{`${new Date(
                    workHours.date,
                  ).toDateString()}`}</td>
                  <td className="py-2 pl-4">{`${workHours.hours}h`}</td>
                  <td className="py-2 pl-4">{`${workHours.rate}€`}</td>
                  <td className="py-2 pl-4">{`${
                    workHours.rate * workHours.hours
                  }€`}</td>
                  <td className="text-center">
                    <PanelIconButton
                      icon={MdEdit}
                      tooltip="Edit"
                      onClick={async () => {
                        await Router.push(`/work-hours/${workHours.id}/edit`);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {props.status === "success" && props.workHours.length === 0 && (
        <div className="py-1 text-center">Empty</div>
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
