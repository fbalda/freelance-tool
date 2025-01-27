import Router from "next/router";
import { MdEdit } from "react-icons/md";

import { WorkHours } from "@prisma/client";

import { PanelIconButton } from "./panels/panel";
import { Table, TableBody, TableColumns } from "./panels/table";
import Spinner from "./spinner";

const WorkHoursList = (props: {
  workHours: WorkHours[];
  clientName: string;
  removeWorkHours: (id: number) => Promise<void>;
  status: "error" | "success" | "idle" | "loading";
}) => {
  return (
    <>
      <Table>
        <TableColumns
          columns={[
            {
              title: "Date",
            },
            {
              title: "Hours",
            },
            {
              title: "Rate",
            },
            {
              title: "Revenue",
            },
          ]}
        />
        <TableBody>
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
        </TableBody>
      </Table>

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
