import Link from "next/link";

import { ClientData } from "@lib/hooks";

import Spinner from "./spinner";

const ClientList = (props: {
  status: "error" | "success" | "idle" | "loading";
  clients: ClientData[];
}) => {
  return (
    <>
      <table className="text-left">
        <colgroup>
          <col className="" />
          <col className="w-40" />
          <col className="w-60" />
          <col className="w-60" />
        </colgroup>

        <thead className="border-b border-neutral-0 bg-neutral-2">
          <tr className="">
            <th className="my-4 pl-4">Name</th>
            <th className="my-4 border-l border-neutral-0 pl-4">
              Client Number
            </th>
            <th className="mx-4 border-l border-neutral-0 py-2 pl-4">
              Last Month
            </th>
            <th className="mx-4 border-l border-neutral-0 pl-4">
              Current Month
            </th>
          </tr>
        </thead>
        <tbody>
          {props.status === "success" &&
            props.clients.map((client, index) => {
              return (
                <tr
                  className="border-b border-neutral-2 last:mb-0 last:border-0
                    last:pb-0"
                  key={index}
                >
                  <td className="py-2 pl-4">
                    <Link
                      className="link"
                      href={`/clients/${encodeURIComponent(client.id)}`}
                    >
                      {client.name}
                    </Link>
                  </td>
                  <td className="py-2 pl-4">{`${(
                    "0000" + client.clientNumber.toString()
                  ).slice(-5)}`}</td>
                  <td className="py-2 pl-4">
                    {`${client.lastMonthRevenue}€ /\
                     ${client.lastMonthHours}h`}
                  </td>
                  <td className="py-2 pl-4 text-green-300">
                    {`${client.currentMonthRevenue}€ / \
                      ${client.currentMonthHours}h`}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {props.status === "success" && props.clients.length === 0 && (
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

export default ClientList;
