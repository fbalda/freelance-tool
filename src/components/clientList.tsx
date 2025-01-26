import Link from "next/link";

import { ClientData } from "@lib/hooks";

import { Table, TableBody, TableColumns } from "./panels/table";
import Spinner from "./spinner";

const ClientList = (props: {
  status: "error" | "success" | "idle" | "loading";
  clients: ClientData[];
}) => {
  return (
    <>
      <Table>
        <TableColumns
          columns={[
            { title: "Name" },
            { title: "Client Number", width: 10 },
            { title: "Last Month", width: 10 },
            { title: "Current Month", width: 10 },
          ]}
        />
        <TableBody>
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
        </TableBody>
      </Table>
      {props.status === "success" && props.clients.length === 0 && (
        <div className="pt-2 text-center text-neutral-3">Empty</div>
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
